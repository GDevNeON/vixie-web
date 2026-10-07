// Decode and reduce large atlas textures off the UI thread. Source artwork is not recolored.
let queue=Promise.resolve();
self.onmessage=({data})=>{queue=queue.then(()=>prepare(data));};
async function prepare({id,url,maxSize=2048}){
 try{
  // Cache the prepared PNG, so reload does not decode an 8192px source again.
  // Bump the cache revision whenever the source atlas changes; sources are pinned in SHA256.txt.
  let cache;const key=new URL(url);key.searchParams.set('vixie-atlas',String(maxSize));
  try{cache=await caches.open('vixie-preview-atlas-20261004-v1');const hit=await cache.match(key.href);if(hit){const blob=await hit.blob();self.postMessage({type:'progress',id,loaded:blob.size,total:blob.size,cached:true});self.postMessage({type:'complete',id,blob,cached:true,...JSON.parse(hit.headers.get('x-vixie-size'))});return;}}catch{cache=null;}
  const response=await fetch(url);if(!response.ok)throw Error('Character texture HTTP '+response.status);
  const total=Number(response.headers.get('content-length'))||0,reader=response.body.getReader(),chunks=[];let loaded=0,lastReport=0;
  while(true){const {done,value}=await reader.read();if(done)break;chunks.push(value);loaded+=value.byteLength;if(performance.now()-lastReport>120){self.postMessage({type:'progress',id,loaded,total});lastReport=performance.now();}}
  self.postMessage({type:'progress',id,loaded,total});
  const original=new Blob(chunks,{type:'image/png'}),bitmap=await createImageBitmap(original),sourceWidth=bitmap.width,sourceHeight=bitmap.height;
  let blob=original,width=sourceWidth,height=sourceHeight;
  if(Math.max(width,height)>maxSize){const ratio=maxSize/Math.max(width,height);width=Math.round(width*ratio);height=Math.round(height*ratio);const canvas=new OffscreenCanvas(width,height),ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(bitmap,0,0,width,height);blob=await canvas.convertToBlob({type:'image/png'});}
  bitmap.close();const sizes={width,height,sourceWidth,sourceHeight};
  self.postMessage({type:'complete',id,blob,...sizes,loaded});
  if(cache)try{await cache.put(key.href,new Response(blob,{headers:{'Content-Type':'image/png','x-vixie-size':JSON.stringify(sizes)}}));}catch{/* Storage limits must not block the preview. */}
 }catch(error){self.postMessage({type:'error',id,error:error.message});}
}
