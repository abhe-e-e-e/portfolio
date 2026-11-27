'use strict';
let category='all';const search=document.querySelector('#product-search');
function filterProducts(){const query=search.value.trim().toLowerCase();let count=0;document.querySelectorAll('.product').forEach(card=>{const visible=(category==='all'||card.dataset.kind===category)&&card.dataset.search.toLowerCase().includes(query);card.hidden=!visible;if(visible)count++});document.querySelector('#result-count').textContent=`${count} reference${count===1?'':'s'}`;document.querySelector('#empty-results').hidden=count!==0;}
if(search){search.addEventListener('input',filterProducts);document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{category=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));filterProducts()}))}
const form=document.querySelector('#enquiry');
if(form){const text=()=>{const d=new FormData(form);return `Decor Pack project enquiry\n\nName: ${d.get('name')}\nCompany: ${d.get('company')||'—'}\nEmail: ${d.get('email')}\nQuantity: ${d.get('quantity')||'To discuss'}\nTarget date: ${d.get('date')||'To discuss'}\nReferences: ${d.get('references')||'To discuss'}\n\n${d.get('details')}`};form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;location.href='mailto:glasscoatprint@gmail.com?subject='+encodeURIComponent('Bottle project enquiry')+'&body='+encodeURIComponent(text());document.querySelector('#form-status').textContent='Your email app has been requested. Review and send the draft there, or copy the enquiry below.'});document.querySelector('.copy-enquiry').addEventListener('click',async()=>{if(!form.reportValidity())return;try{await navigator.clipboard.writeText(text());document.querySelector('#form-status').textContent='Enquiry copied. Paste it into an email to glasscoatprint@gmail.com.'}catch{document.querySelector('#form-status').textContent='Copy is unavailable in this browser. Please use Prepare enquiry email.'}})}

// Interactive editorial colour study, independent of the saved studio design.
const materialNames={smoke:'01 / SMOKE',amber:'02 / AMBER',rose:'03 / ROSE'};
document.querySelectorAll('.material-select button').forEach(button=>button.addEventListener('click',()=>{const name=button.dataset.material;document.querySelector('.material-stage').dataset.material=name;document.querySelector('#material-name').textContent=materialNames[name];document.querySelectorAll('.material-select button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)))}));
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('revealed');observer.unobserve(entry.target)}})},{threshold:.08});document.querySelectorAll('.intro-section,.service-overview,.material-story,.collection-feature,.project-dialogue,.capability,.process').forEach(el=>{el.classList.add('reveal');observer.observe(el)})}

const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const hero=document.querySelector('.premium-hero'),motionButton=document.querySelector('.motion-toggle');
let motionPaused=false,motionFrame=0;
if(hero){
 const art=hero.querySelector('.hero-art');
 hero.addEventListener('pointermove',event=>{if(reducedMotion.matches||motionPaused||event.pointerType==='touch')return;const r=hero.getBoundingClientRect();art.style.setProperty('--pointer-x',`${((event.clientX-r.left)/r.width-.5)*22}px`);art.style.setProperty('--pointer-y',`${((event.clientY-r.top)/r.height-.5)*16}px`)});
 hero.addEventListener('pointerleave',()=>{art.style.setProperty('--pointer-x','0px');art.style.setProperty('--pointer-y','0px')});
 motionButton.addEventListener('click',()=>{motionPaused=!motionPaused;document.body.classList.toggle('motion-paused',motionPaused);motionButton.textContent=motionPaused?'Resume motion':'Pause motion';motionButton.setAttribute('aria-pressed',String(motionPaused))});
 const updateScroll=()=>{motionFrame=0;if(reducedMotion.matches||motionPaused)return;const box=hero.getBoundingClientRect();if(box.bottom>0)art.style.setProperty('--scroll-shift',`${Math.min(45,Math.max(0,-box.top)*.08)}px`);const stage=document.querySelector('.material-stage');if(stage){const b=stage.getBoundingClientRect();if(b.bottom>0&&b.top<innerHeight)stage.style.setProperty('--material-shift',`${Math.max(-14,Math.min(14,(innerHeight/2-b.top-b.height/2)*.04))}px`)}};
 addEventListener('scroll',()=>{if(!motionFrame&&!reducedMotion.matches&&!motionPaused)motionFrame=requestAnimationFrame(updateScroll)},{passive:true});
}
const rail=document.querySelector('.reference-rail');
if(rail){const move=direction=>rail.scrollBy({left:direction*(rail.querySelector('.reference-photo').getBoundingClientRect().width+20),behavior:reducedMotion.matches?'instant':'smooth'});document.querySelector('.gallery-prev').addEventListener('click',()=>move(-1));document.querySelector('.gallery-next').addEventListener('click',()=>move(1));rail.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1)}})}

// Source-led studies: switch actual brochure extracts, with detail inspection.
const brochureStudies={
 coating:{src:'assets/brochure/colour-range.png',alt:'Brochure coating study showing clear, deep red, ivory and smoke bottle finishes',description:'One form, four colour directions. Compare how transparency and coverage change the character of the glass.',page:4},
 printing:{src:'assets/brochure/botanical-print.png',alt:'Botanical artwork printed on a clear bottle, an illustrative brochure study',description:'A botanical line drawing follows the face of the bottle. Consider the scale of the artwork and the clear space around it.',page:5},
 detail:{src:'assets/brochure/glass-detail.png',alt:'Fine decorative lines on deep red glass, a close-up brochure design study',description:'Fine lines meet deep colour. Look at the relationship between the decoration, the edge and the surface of the glass.',page:6}
};
const studyImage=document.querySelector('#study-image'),studyDialog=document.querySelector('#study-dialog');
if(studyImage){
 let activeStudy='coating';const tabs=[...document.querySelectorAll('[data-study][role=tab]')];
 function chooseStudy(key,focus=false){const data=brochureStudies[key];activeStudy=key;tabs.forEach(t=>{const active=t.dataset.study===key;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;const action=t.querySelector('.study-action');if(action){const label=t.dataset.study==='detail'?'decoration':t.dataset.study;action.firstElementChild.textContent=(active?'Viewing ':'View ')+label;action.lastElementChild.textContent=active?'✓':'→'}if(active&&focus)t.focus()});studyImage.src=data.src;studyImage.alt=data.alt;studyImage.parentElement.dataset.study=key;document.querySelector('#study-panel').setAttribute('aria-labelledby','study-tab-'+key);document.querySelector('#study-description').textContent=data.description;document.querySelector('#study-source').textContent=`Brochure design study / p. ${data.page}`;if(!reducedMotion.matches)studyImage.animate([{opacity:.3,transform:'scale(1.02)'},{opacity:1,transform:'scale(1)'}],{duration:600,easing:'ease-out'})}
 tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>chooseStudy(tab.dataset.study));tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight'||event.key==='ArrowDown')next=(i+1)%tabs.length;if(event.key==='ArrowLeft'||event.key==='ArrowUp')next=(i+tabs.length-1)%tabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;if(next!==undefined){event.preventDefault();chooseStudy(tabs[next].dataset.study,true)}})});
 document.querySelector('#study-enlarge').addEventListener('click',()=>{const data=brochureStudies[activeStudy];const full=document.querySelector('#study-full-image');full.src=data.src;full.alt=data.alt;document.querySelector('#study-full-caption').textContent=`Illustrative design study from the supplied company brochure, page ${data.page}.`;studyDialog.showModal()});
 document.querySelector('.close-study').addEventListener('click',()=>studyDialog.close());
 const motion=document.createElement('button');motion.className='motion-study-toggle';motion.textContent='Pause image movement';motion.setAttribute('aria-pressed','false');document.querySelector('.workbench-heading').append(motion);motion.addEventListener('click',()=>{const paused=document.body.classList.toggle('craft-motion-paused');motion.setAttribute('aria-pressed',String(paused));motion.textContent=paused?'Resume image movement':'Pause image movement'});
}

// Keyboard-accessible service selection with direct-link support.
const serviceTabs=[...document.querySelectorAll('[data-service][role=tab]')];
if(serviceTabs.length){
 function selectService(key,focus=false,writeHash=false){const active=serviceTabs.find(t=>t.dataset.service===key)||serviceTabs[0];serviceTabs.forEach(tab=>{const selected=tab===active;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;document.querySelector('#'+tab.getAttribute('aria-controls')).hidden=!selected});if(focus)active.focus();if(writeHash)history.replaceState(null,'','#'+active.dataset.service)}
 serviceTabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectService(tab.dataset.service,false,true));tab.addEventListener('keydown',e=>{const next=e.key==='ArrowRight'?(i+1)%3:e.key==='ArrowLeft'?(i+2)%3:e.key==='Home'?0:e.key==='End'?2:null;if(next!==null){e.preventDefault();selectService(serviceTabs[next].dataset.service,true,true)}})});
 selectService(location.hash.slice(1));addEventListener('hashchange',()=>selectService(location.hash.slice(1)));
}
const timelineTabs=[...document.querySelectorAll('[data-timeline][role=tab]')];
if(timelineTabs.length){
 function selectMilestone(index,focus=false){timelineTabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;tab.classList.toggle('passed',i<index);document.querySelector('#'+tab.getAttribute('aria-controls')).hidden=i!==index});document.querySelector('#timeline-status').textContent=`Stage 0${index+1} of 04`;document.querySelector('#timeline-previous').disabled=index===0;document.querySelector('#timeline-next').disabled=index===3;if(focus)timelineTabs[index].focus()}
 timelineTabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectMilestone(i));tab.addEventListener('keydown',e=>{const next=(e.key==='ArrowRight'||e.key==='ArrowDown')?(i+1)%4:(e.key==='ArrowLeft'||e.key==='ArrowUp')?(i+3)%4:e.key==='Home'?0:e.key==='End'?3:null;if(next!==null){e.preventDefault();selectMilestone(next,true)}})});
}

if(timelineTabs.length){['previous','next'].forEach(direction=>document.querySelector('#timeline-'+direction).addEventListener('click',()=>{const current=timelineTabs.findIndex(t=>t.getAttribute('aria-selected')==='true');timelineTabs[current+(direction==='next'?1:-1)]?.click()}))}
const replayDrawing=document.querySelector('.replay-drawing');if(replayDrawing)replayDrawing.addEventListener('click',()=>{const drawing=document.querySelector('.signature-drawing');drawing.classList.remove('drawing-replay');void drawing.offsetWidth;drawing.classList.add('drawing-replay')});

// Reveal supporting copy once it enters view; keep content available without JS.
const scrollCopy=[...document.querySelectorAll('.craft-home section:not(.signature-hero) h2,.craft-home section:not(.signature-hero) .eyebrow,.workbench-aside>p,.workbench-aside>.text-link,.composition-copy>.text-link,.components-study>div>.text-link,.studio-invitation>div>.button,.studio-invitation li,.craft-enquiry>.atelier-link')];
if('IntersectionObserver' in window&&!reducedMotion.matches){
 const revealCopy=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('copy-visible');revealCopy.unobserve(entry.target)}}),{threshold:.15,rootMargin:'0px 0px -25px 0px'});
 scrollCopy.forEach(el=>{el.classList.add('scroll-copy');revealCopy.observe(el)});
 document.addEventListener('focusin',event=>{const el=event.target.closest('.scroll-copy');if(el)el.classList.add('copy-visible')});
 reducedMotion.addEventListener('change',event=>{if(event.matches){scrollCopy.forEach(el=>el.classList.add('copy-visible'));revealCopy.disconnect()}});
}

// Keep complete premium-set references together in the enquiry.
if(form){const ref=new URLSearchParams(location.search).get("reference");const input=form.querySelector('[name="references"]');if(ref&&input)input.value=ref.slice(0,240);}
