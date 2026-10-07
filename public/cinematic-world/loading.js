// Loading: drives % counter + bar. On finish → 6-strip vertical curtain reveal.
(()=>{
  const loader=document.querySelector('#page-loader');if(!loader)return;
  window.vixieLoading=true;
  let pct=0,done=false,layoutReady=false,frameReady=false,sceneError=false;
  const pctEl=loader.querySelector('[data-loader-pct]'),barEl=loader.querySelector('[data-loader-bar]');

  // Inject reveal curtain (6 vertical strips) immediately
  const curtain=document.createElement('div');
  curtain.id='reveal-curtain';curtain.setAttribute('aria-hidden','true');
  for(let i=0;i<6;i++){const s=document.createElement('div');s.className='curtain-strip';curtain.appendChild(s);}
  document.body.appendChild(curtain);

  // Step → target % milestones
  const PCT=[0,25,60,85,100];

  function setProgress(target){
    target=Math.min(100,Math.max(pct,Math.round(target)));
    pct=target;
    if(pctEl)pctEl.textContent=pct;
    if(barEl)barEl.style.width=pct+'%';
  }

  function inert(value){
    document.querySelectorAll('main,.site-nav,footer,.workbench,.skip').forEach(el=>{el.inert=value;});
    document.querySelector('main')?.setAttribute('aria-busy',String(value));
  }

  function reveal(){
    // Trigger 6-strip curtain animation via class
    document.body.classList.add('vixie-reveal');
    // Remove curtain from DOM after last strip has exited (275ms delay + 700ms anim + buffer)
    setTimeout(()=>curtain.remove(),1100);
  }

  function finish(reason){
    if(done)return;done=true;
    clearTimeout(timeout);cancelAnimationFrame(crawlFrame);clearTimeout(crawlTimer);
    setProgress(100);
    window.vixieLoading=false;
    inert(false);
    window.dispatchEvent(new CustomEvent('vixie-boot-complete',{detail:{reason}}));
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    loader.classList.add('is-leaving');
    setTimeout(()=>{loader.remove();reveal();},reduced?0:400);
  }

  const complete=()=>{if(layoutReady&&(frameReady||sceneError))finish(sceneError?'fallback':'ready');};

  window.addEventListener('vixie-layout-ready',()=>{
    layoutReady=true;setProgress(PCT[1]);
    requestAnimationFrame(()=>{
      if(done)return;
      const visible=[...document.querySelectorAll('[data-live-scene]')].some(el=>{
        const r=el.getBoundingClientRect();
        return r.width>0&&r.height>0&&r.bottom>0&&r.top<innerHeight&&getComputedStyle(el).visibility!=='hidden';
      });
      if(!visible)finish('interface');else complete();
    });
  });

  window.addEventListener('vixie-boot-progress',e=>{
    if(done)return;
    const next=e.detail.step??0;
    setProgress(PCT[Math.min(next,PCT.length-1)]);
  });

  window.addEventListener('vixie-scene-frame',()=>{frameReady=true;setProgress(PCT[3]);complete();},{once:true});
  window.addEventListener('vixie-scene-error',()=>{sceneError=true;setProgress(PCT[3]);complete();});

  document.addEventListener('DOMContentLoaded',()=>{if(!done)inert(true);},{once:true});

  // Gentle crawl to keep counter moving while waiting (caps at 90)
  let crawlFrame,crawlTimer;
  (function crawl(){
    if(done)return;
    if(pct<90)setProgress(pct+Math.random()*0.4);
    crawlTimer=setTimeout(()=>{crawlFrame=requestAnimationFrame(crawl);},100);
  })();

  const timeout=setTimeout(()=>finish('timeout'),15000);
})();
