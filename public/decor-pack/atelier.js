(() => {
 const stage=document.querySelector('.atelier-animation');if(!stage)return;
 const phases=[['A form with possibility.','Start with the bottle and closure that suit your idea.'],['Colour gives it character.','Explore translucent colour, opaque coatings and gradients.'],['A signature of your own.','Bring your identity to life through artwork and decoration.'],['The details come together.','Review the complete direction with our team before sampling.']];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let current=0,paused=reduced.matches,timer;
 const button=document.querySelector('#atelier-pause');
 function show(i){current=i;stage.dataset.phase=i;document.querySelector('#atelier-count').textContent='0'+(i+1)+' / 04';document.querySelector('#atelier-title').textContent=phases[i][0];document.querySelector('#atelier-description').textContent=phases[i][1];document.querySelectorAll('[data-phase-button]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.phaseButton)===i)));}
 function schedule(){clearInterval(timer);button.textContent=paused?'Play':'Pause';button.setAttribute('aria-label',paused?'Play animation':'Pause animation');if(!paused&&!document.hidden)timer=setInterval(()=>show((current+1)%4),8000);}
 document.querySelectorAll('[data-phase-button]').forEach(b=>b.addEventListener('click',()=>{show(Number(b.dataset.phaseButton));schedule()}));button.addEventListener('click',()=>{paused=!paused;schedule()});document.addEventListener('visibilitychange',schedule);reduced.addEventListener('change',()=>{paused=reduced.matches;schedule()});schedule();
})();
