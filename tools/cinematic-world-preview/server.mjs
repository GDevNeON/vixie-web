import http from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(process.env.VIXIE_CINEMATIC_SKETCH_ROOT||path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../vixie-web-planning/sketches/002-cinematic-world')), port=Number(process.env.PORT||4382);
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2','.json':'application/json','.md':'text/plain; charset=utf-8'};
let active=false,last=0;
const json=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
const server=http.createServer(async(req,res)=>{
 try {
  if(req.headers.host!==`127.0.0.1:${port}`&&req.headers.host!==`localhost:${port}`)return json(res,403,{error:'Local preview only'});
  const url=new URL(req.url,`http://127.0.0.1:${port}`);
  if(url.pathname==='/api/status')return json(res,200,{live:!!process.env.OPENROUTER_API_KEY,model:'openrouter/free'});
  if(url.pathname==='/api/chat'){
   if(req.method!=='POST')return json(res,405,{error:'POST required'});
   if(req.headers.origin&&!['http://127.0.0.1:'+port,'http://localhost:'+port].includes(req.headers.origin))return json(res,403,{error:'Origin rejected'});
   if(!process.env.OPENROUTER_API_KEY)return json(res,503,{error:'Chưa cấu hình OPENROUTER_API_KEY. Có thể thử thoại mẫu.'});
   if(active||Date.now()-last<2500)return json(res,429,{error:'Đợi vài giây rồi thử lại.'});
   let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>12000)return json(res,413,{error:'Tin nhắn quá dài.'});}
   const data=JSON.parse(raw),messages=data.messages;
   if(!Array.isArray(messages)||messages.length>12||messages.some(m=>!['user','assistant'].includes(m.role)||typeof m.content!=='string'||m.content.length>1200))return json(res,400,{error:'Invalid conversation'});
   active=true;last=Date.now();
   try {
    const response=await fetch('https://openrouter.ai/api/v1/chat/completions',{method:'POST',headers:{Authorization:`Bearer ${process.env.OPENROUTER_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model:'openrouter/free',max_tokens:200,messages:[{role:'system',content:'You are the Vixie website AI companion demo, friendly and concise. Reply in the language of the user in at most 3 short sentences. You are an AI, never claim to be human or conscious. Do not claim to access the device or remember outside this session. Begin with exactly one emotion tag: [calm], [happy], [curious], or [warm]. Do not encourage exclusivity or dependency. If asked about product availability, say this is a design demo and release details are not confirmed.'},...messages]}),signal:AbortSignal.timeout(25000)});
    if(!response.ok)return json(res,response.status===429?429:502,{error:response.status===429?'Hạn mức API free đã hết. Thử lại sau.':'Nhà cung cấp chưa phản hồi. Thử lại sau.'});
    const result=await response.json();const reply=result.choices?.[0]?.message?.content;
    if(typeof reply!=='string'||!reply.trim())return json(res,502,{error:'Phản hồi trống. Thử lại nhé.'});
    json(res,200,{reply});
   }catch(e){json(res,504,{error:'Kết nối quá hạn. Hội thoại vẫn ở đây.'});}finally{active=false;}return;
  }
  if(req.method!=='GET'&&req.method!=='HEAD')return json(res,405,{error:'Method not allowed'});
  const relative=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname);
  const file=path.resolve(root,'.'+relative);
  if(!file.startsWith(root+path.sep)||relative.split('/').some(s=>s.startsWith('.'))||file.endsWith('.mjs'))return json(res,403,{error:'Forbidden'});
  if(!(await stat(file)).isFile())return json(res,404,{error:'Not found'});
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:await readFile(file));
 }catch{if(!res.headersSent)json(res,404,{error:'Not found'});else res.end();}
});
server.listen(port,'127.0.0.1',()=>console.log(`Vixie sketches: http://127.0.0.1:${port} — API ${process.env.OPENROUTER_API_KEY?'configured':'sample mode'}`));
