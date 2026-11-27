'use strict';

// Replay the introduction on every page load, including refreshes.
(() => {
  const splash = document.querySelector('.brand-splash');
  if (!splash || typeof splash.showModal !== 'function') return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');


  let closing = false;
  let timer;
  let closeTimer;
  const cleanup = () => {
    clearTimeout(timer);
    clearTimeout(closeTimer);
    document.body.classList.remove('splash-active');
  };
  const dismiss = () => {
    if (closing) return;
    closing = true;
    clearTimeout(timer);
    splash.classList.add('is-leaving');
    closeTimer = setTimeout(() => {
      splash.close();
      document.dispatchEvent(new Event("decor-intro-complete"));
      cleanup();
    }, motion.matches ? 0 : 400);
  };

  splash.addEventListener('cancel', event => {
    event.preventDefault();
    dismiss();
  });
  splash.addEventListener('close', cleanup);
  motion.addEventListener('change', event => { if (event.matches) dismiss(); });
  splash.showModal();
  document.body.classList.add('splash-active');

  timer = setTimeout(dismiss, motion.matches ? 1200 : 3400);
})();

// The nearest stage to the viewport centre drives the persistent illustration.
(() => {
  const steps = [...document.querySelectorAll('.journey-step')];
  const bottle = document.querySelector('.journey-bottle');
  if (!steps.length || !bottle) return;
  const markers = [...document.querySelectorAll('.journey-progress span')];
  let scheduled = false;
  function update() {
    scheduled = false;
    let active = 0, nearest = Infinity;
    steps.forEach((step, index) => {
      const box = step.getBoundingClientRect();
      const distance = Math.abs(box.top + box.height / 2 - innerHeight / 2);
      if (distance < nearest) { nearest = distance; active = index; }
    });
    bottle.dataset.activeStage = String(active);
    markers.forEach((marker, index) => marker.classList.toggle('active', index <= active));
    steps.forEach((step, index) => step.classList.toggle('is-current', index === active));
  }
  function schedule() { if (!scheduled) { scheduled = true; requestAnimationFrame(update); } }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  update();
})();

// One pinned stage swaps image and copy together as the section is traversed.
(() => {
 const section=document.querySelector('.home-capabilities');if(!section)return;
 const panels=[...section.querySelectorAll('.service-panel')],markers=[...section.querySelectorAll('.finish-progress span')];
 let frame=0,active=-1;
 section.classList.add('scroll-finishes');
 function update(){frame=0;if(innerHeight<=650){panels.forEach(panel=>{panel.hidden=false;panel.inert=false;});active=-1;return;}const rect=section.getBoundingClientRect(),travel=Math.max(1,rect.height-innerHeight);const index=Math.min(2,Math.max(0,Math.floor((-rect.top/travel)*3)));
  if(index===active)return;active=index;
  panels.forEach((panel,i)=>{panel.hidden=i!==index;panel.inert=i!==index;panel.classList.toggle('finish-in-view',i===index);});
  markers.forEach((marker,i)=>{marker.classList.toggle('active',i===index);if(i===index)marker.setAttribute('aria-current','step');else marker.removeAttribute('aria-current');});
  section.dataset.activeFinish=String(index);
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(update);}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);update();
})();

// A single compact gallery; manual use, hover, focus and reduced motion stop autoplay.
(() => {
 const gallery=document.querySelector('.gallery-carousel');if(!gallery)return;
 const slides=[...gallery.querySelectorAll('figure')],previous=document.querySelector('.gallery-previous'),next=document.querySelector('.gallery-next'),play=document.querySelector('.gallery-play'),position=document.querySelector('.gallery-position'),motion=matchMedia('(prefers-reduced-motion: reduce)');
 const progress=document.querySelector('.gallery-progress');progress.innerHTML=slides.map((_,i)=>`<button aria-label="Go to slide ${i+1}" data-slide="${i}"><span></span></button>`).join('');progress.addEventListener('click',e=>{const b=e.target.closest('[data-slide]');if(b)manual(Number(b.dataset.slide));});
 let index=0,paused=motion.matches,hover=false,focused=false,visible=false,timer;
 function schedule(){clearInterval(timer);const running=!paused&&!hover&&!focused&&visible&&!document.hidden;progress.classList.toggle('running',running);if(running)timer=setInterval(()=>show(index+1),3000);}
 function show(i){index=(i+slides.length)%slides.length;slides.forEach((slide,n)=>{slide.hidden=n!==index;slide.setAttribute('aria-label',`${n+1} of ${slides.length}`);slide.setAttribute('aria-roledescription','slide');});position.textContent=`0${index+1} / 0${slides.length}`;progress.querySelectorAll('button').forEach((b,n)=>{b.setAttribute('aria-current',n===index?'true':'false');b.classList.toggle('current',n===index);});}
 function label(){play.textContent=paused?'Play slideshow':'Pause slideshow';play.setAttribute('aria-pressed',String(paused));}
 function manual(i){paused=true;show(i);label();schedule();}
 previous.addEventListener('click',()=>manual(index-1));next.addEventListener('click',()=>manual(index+1));play.addEventListener('click',()=>{paused=!paused;label();schedule();});
 gallery.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();manual(index+(e.key==='ArrowRight'?1:-1));}});
 gallery.addEventListener('mouseenter',()=>{hover=true;schedule();});gallery.addEventListener('mouseleave',()=>{hover=false;schedule();});gallery.addEventListener('focusin',()=>{focused=true;schedule();});gallery.addEventListener('focusout',e=>{if(!gallery.contains(e.relatedTarget)){focused=false;schedule();}});
 document.addEventListener('visibilitychange',schedule);motion.addEventListener('change',()=>{paused=motion.matches;label();schedule();});new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)gallery.querySelectorAll('img').forEach(img=>img.loading='eager');schedule();}).observe(gallery);show(0);label();
})();
