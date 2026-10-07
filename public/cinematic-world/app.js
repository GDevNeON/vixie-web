const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const page=document.body.dataset.page;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');let motion=!reduced.matches,ctx,lenis,tick,inspection=false;
window.vixieMotion=()=>motion;
function scrollSetup(){
 ctx?.revert();if(tick)gsap.ticker.remove(tick);lenis?.destroy();lenis=null;tick=null;
 window.vixieStoryTween=null;
 document.documentElement.dataset.motion=motion?'on':'off';$('#motion')?.setAttribute('aria-pressed',String(motion));
 if(!motion){window.dispatchEvent(new CustomEvent('vixie-motion'));return;}
 gsap.registerPlugin(ScrollTrigger);
 let footerNative=false;
 lenis=new Lenis({duration:1.2,easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)),prevent:node=>{const native=$('footer').getBoundingClientRect().top<innerHeight&&scrollY>100;if(native!==footerNative){lenis?.reset();footerNative=native;}return node.closest?.('footer,[data-lenis-prevent]')||native;}});
 lenis.on('scroll',ScrollTrigger.update);tick=t=>lenis.raf(t*1000);gsap.ticker.add(tick);gsap.ticker.lagSmoothing(0);
 ctx=gsap.context(()=>{
  if($('.hero-copy'))gsap.from('.hero-copy > :not(h1)',{y:20,opacity:0,duration:.8,stagger:.08,ease:'power3.out'});
  $$('.chapter,.directory,.lab-main').forEach(section=>{
   if(section.matches('.creator'))return;
   const targets=section.querySelectorAll('.chapter-head,.lab-title,.resource-row,.lab-info>div');
   if(targets.length)gsap.from(targets,{y:35,opacity:.3,duration:.8,stagger:.09,scrollTrigger:{trigger:section,start:'top 90%',end:'top 20%',scrub:1}});
  });
  if($('.story-track')&&innerWidth>760){window.vixieStoryTween=gsap.to('.story-track',{xPercent:-66.6667,ease:'none',scrollTrigger:{trigger:'.story',start:'top top',end:()=>'+='+innerWidth*2.2,pin:true,scrub:1,invalidateOnRefresh:true,refreshPriority:10}});}
  if($('.signal-score'))gsap.to('.signal-score i',{scaleY:i=>.25+Math.abs(Math.sin(i*.61))*2,stagger:.03,scrollTrigger:{trigger:'.intro',start:'top bottom',end:'bottom top',scrub:1}});
  gsap.fromTo('.progress',{scaleX:0},{scaleX:1,ease:'none',scrollTrigger:{trigger:'main',start:'top top',end:'bottom bottom',scrub:true}});
  gsap.from('.site-nav .wordmark path',{strokeDasharray:2000,strokeDashoffset:2000,duration:2.2,ease:'power2.inOut'});
  $$('.chapter:not(.creator) p,.chapter:not(.creator) .actions,.chapter details,.caption-row').forEach(el=>gsap.from(el,{y:18,opacity:.5,scrollTrigger:{trigger:el,start:'top 98%',end:'top 75%',scrub:.6}}));
 });
 window.dispatchEvent(new CustomEvent('vixie-motion'));
 lenis?.resize();
}
window.vixieScrollTo=target=>{if(lenis)lenis.scrollTo(target);else if(typeof target==='number')window.scrollTo({top:target,behavior:'instant'});else target.scrollIntoView();};
function variant(v){document.body.classList.toggle('editorial',v==='b');$$('[data-variant]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.variant===v)));scrollSetup();ScrollTrigger.refresh();}
 $$('[data-variant]').forEach(b=>b.onclick=()=>variant(b.dataset.variant));
 const themeBtn=$('#theme');if(themeBtn)themeBtn.onclick=()=>{document.body.classList.toggle('dark');window.dispatchEvent(new CustomEvent('vixie-theme'));};
 const motionBtn=$('#motion');if(motionBtn)motionBtn.onclick=()=>{motion=!motion&&!reduced.matches;scrollSetup();};reduced.addEventListener('change',()=>{motion=!reduced.matches;scrollSetup();});
 const vpSelect=$('#viewport');if(vpSelect)vpSelect.onchange=e=>{document.body.style.maxWidth=e.target.value==='0'?'':e.target.value+'px';document.body.style.marginInline='auto';scrollSetup();};
 const inspectBtn=$('#inspect');if(inspectBtn)inspectBtn.onclick=()=>{inspection=!inspection;inspectBtn.setAttribute('aria-pressed',String(inspection));if(!inspection)$('.annotation')?.remove();};
document.addEventListener('pointermove',e=>{if(!inspection||e.target.closest('.workbench'))return;let tip=$('.annotation');if(!tip){tip=document.createElement('div');tip.className='annotation';document.body.append(tip);}const css=getComputedStyle(e.target);tip.textContent=`${e.target.tagName} · ${css.fontSize} · gap ${css.gap} · padding ${css.padding} · ${css.color}`;tip.style.left=Math.min(e.clientX+15,innerWidth-275)+'px';tip.style.top=Math.min(e.clientY+15,innerHeight-80)+'px';});
$$('a[href^="#"]').forEach(link=>link.addEventListener('click',e=>{const target=$(link.getAttribute('href'));if(!target)return;e.preventDefault();if(lenis)lenis.scrollTo(target,{offset:-20});else target.scrollIntoView();target.tabIndex=-1;target.focus({preventScroll:true});}));
$$('details').forEach(el=>el.addEventListener('toggle',()=>ScrollTrigger.refresh()));
$$('[data-mood]').forEach(b=>b.onclick=()=>setMood(b.dataset.mood));
function setMood(mood){window.dispatchEvent(new CustomEvent('vixie-mood',{detail:mood}));$$('[data-mood]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mood===mood)));$$('[data-mood-label]').forEach(e=>e.textContent=({calm:'Calm · present',happy:'Happy · bright eyes',curious:'Curious · listening',warm:'Warm · a little blush'})[mood]||mood);const bars=$$('.motion-score i');if(bars.length)gsap.to(bars,{scaleY:i=>({calm:.5,happy:1,curious:.75,warm:.65})[mood]*(.7+Math.sin(i*.8)**2*.6),y:i=>mood==='happy'?Math.sin(i*.7)*10:0,duration:motion?.6:0,stagger:motion?.018:0,ease:'power3.out',overwrite:true});}
window.setVixieMood=setMood;
window.addEventListener('DOMContentLoaded',()=>document.fonts.ready.then(()=>{variant(new URLSearchParams(location.search).get('v')||'a');window.dispatchEvent(new CustomEvent('vixie-layout-ready'));}),{once:true});
let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(scrollSetup,180);});
if(page==='demo'){
 const form=$('#chat-form'),input=$('#message'),messages=$('#messages'),status=$('#chat-status');let history=[],busy=false,live=false,controller=null,generation=0;
 fetch('/api/status').then(r=>r.json()).then(s=>{live=s.live;$('#mode').textContent=live?'AI · OpenRouter free':'THOẠI MẪU';$('#chat-disclosure').textContent=live?'AI demo. Khi gửi, nội dung hội thoại được chuyển tới OpenRouter và nhà cung cấp mô hình. Không lưu trên server preview.':'Bạn đang thử hội thoại mẫu. Chat AI chưa kết nối; nội dung ở chế độ này không được gửi tới nhà cung cấp AI.';}).catch(()=>{});
 function bubble(role,text){const b=document.createElement('div');b.className='bubble '+(role==='user'?'user':'');const label=document.createElement('small');label.textContent=role==='user'?'YOU':live?'VIXIE · AI':'VIXIE · THOẠI MẪU';const content=document.createElement('span');content.textContent=text;b.append(label,content);messages.append(b);messages.scrollTop=messages.scrollHeight;}
 async function send(text){if(busy||!text.trim())return;busy=true;const epoch=generation;input.value='';form.querySelector('button').disabled=true;bubble('user',text);status.textContent=live?'Đang lắng nghe…':'Đang chạy tình huống mẫu…';setMood('curious');
  try{let reply;if(live){controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),30000);let r;try{r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:[...history.slice(-10),{role:'user',content:text}]}),signal:controller.signal});}finally{clearTimeout(timeout);}const data=await r.json();if(!r.ok)throw Error(data.error||'Kết nối lỗi');reply=data.reply;}
   else{await new Promise(r=>setTimeout(r,motion?650:0));reply=/mệt|buồn|tired/i.test(text)?'[warm] Hôm nay có vẻ dài nhỉ. Thử thả lỏng vai một chút nhé. Bạn muốn kể phần khó nhất trong ngày không?':/học|work|focus|tập trung/i.test(text)?'[calm] Mình ở đây. Bạn chọn một việc nhỏ để bắt đầu nhé — mình sẽ giữ không gian thật yên.':'[happy] Chào bạn. Một góc nhỏ trên màn hình, một lời chào mỗi ngày. Hôm nay bạn muốn làm gì?';}
   if(epoch!==generation)return;const tag=reply.match(/^\[(calm|happy|curious|warm)\]/);setMood(tag?.[1]||'calm');const clean=reply.replace(/^\[[^\]]+\]\s*/,'');bubble('assistant',clean);history.push({role:'user',content:text},{role:'assistant',content:clean});history=history.slice(-10);status.textContent=live?'Đã nhận phản hồi AI.':'Đã phát thoại mẫu — chưa gọi LLM.';window.dispatchEvent(new CustomEvent('vixie-speak',{detail:{text:clean,voice:$('#voice').checked}}));
  }catch(err){if(epoch===generation)status.textContent=err.name==='AbortError'?'Đã dừng kết nối. Bạn có thể gửi lại.':err.message;}finally{if(epoch===generation){busy=false;form.querySelector('button').disabled=false;}}
 }
 form.onsubmit=e=>{e.preventDefault();send(input.value.trim().slice(0,600));};$$('[data-prompt]').forEach(b=>b.onclick=()=>send(b.dataset.prompt));
 $('#reset').onclick=()=>{generation++;controller?.abort();window.speechSynthesis?.cancel();window.dispatchEvent(new CustomEvent('vixie-reset'));busy=false;form.querySelector('button').disabled=false;history=[];messages.replaceChildren();status.textContent='Đã xóa hội thoại trong phiên này.';setMood('calm');};
}
if(page==='explore'){
 const guides={android:['Android','Cài ứng dụng từ Google Play khi bản phát hành được công bố.','Chọn một nhân vật trong thư viện.','Xem trước rồi đặt làm hình nền. Chỉ cấp quyền khi tính năng cần dùng.'],windows:['Windows','Tải bộ cài chính thức khi bản phát hành được công bố.','Mở Vixie và chọn nhân vật yêu thích.','Đặt nhân vật lên desktop; tùy chỉnh vị trí và cách tương tác.']};
 $$('[data-os]').forEach(b=>b.onclick=()=>{$$('[data-os]').forEach(x=>x.setAttribute('aria-selected',String(x===b)));const g=guides[b.dataset.os];$('#os-title').textContent=g[0];$('#install-steps').replaceChildren(...g.slice(1).map((text,i)=>{const li=document.createElement('li');li.textContent=`0${i+1}  ${text}`;return li;}));});
 const articles={guide:['Your first hello.','Bắt đầu từ một nhân vật bạn thích.','Mở thư viện, xem trước nhân vật rồi chọn cách đặt lên màn hình. Android và Windows có cách cài đặt khác nhau; hướng dẫn tải phía trên sẽ đổi theo nền tảng bạn chọn.','Thử một lời chào ngắn, một cái chạm, rồi đổi mood. Demo trên website chỉ lưu hội thoại trong phiên hiện tại.'],stories:['A quieter kind of company.','Một màn hình gần gũi hơn.','Một góc học tập, một khoảng nghỉ giữa hai việc, hay lời chào khi mở máy. Vixie bắt đầu từ những khoảnh khắc nhỏ ấy.','Đây là câu chuyện định hướng sản phẩm. Các khả năng trong demo không chứng minh toàn bộ tính năng app đã sẵn sàng phát hành.'],updates:['Building in the open.','Ghi chú thiết kế · 04.10.2026','Bộ concept này khám phá hành trình wallpaper → touch → conversation → expression. Demo dùng model Live2D có sẵn trong workspace.','Chưa công bố số phiên bản, lịch phát hành hay changelog production.'],privacy:['Your space. Your choice.','Thông tin của bản demo.','Ở chế độ mẫu, nội dung không được gửi tới LLM. Ở chế độ AI, tin nhắn được gửi qua proxy local tới OpenRouter và nhà cung cấp mô hình. Hội thoại chỉ ở bộ nhớ phiên trình duyệt.','Xóa phiên bằng nút Clear conversation. Đây là trang giải thích demo, không thay thế Privacy Policy, Terms hay phê duyệt pháp lý của sản phẩm.'],support:['A little help.','Chọn vấn đề bạn đang gặp.','Nhân vật không hiện: thử tải lại, kiểm tra WebGL và mở bằng preview server. API báo giới hạn: chuyển sang thử tương tác mood hoặc thử lại sau.','Kênh hỗ trợ chính thức chưa được xác nhận trong plans. Bản sketch không tự tạo địa chỉ liên hệ hoặc link cộng đồng.']};
 function article(){const key=location.hash.slice(1);if(!articles[key])return;const a=articles[key];$('#article').hidden=false;$('#article-title').textContent=a[0];window.dispatchEvent(new CustomEvent('vixie-title-change',{detail:$('#article-title')}));$('#article-sub').textContent=a[1];$('#article-p1').textContent=a[2];$('#article-p2').textContent=a[3];ScrollTrigger.refresh();}
 window.addEventListener('hashchange',article);$$('[data-article]').forEach(a=>a.onclick=()=>{setTimeout(()=>{article();$('#article').scrollIntoView({behavior:motion?'smooth':'instant'});},0);});article();
 document.fonts.ready.then(()=>{if(articles[location.hash.slice(1)])$('#article').scrollIntoView();});
}
