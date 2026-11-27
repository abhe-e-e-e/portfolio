'use strict';
const themeButton=document.querySelector('.theme');
if(themeButton){
function themeLabel(){const dark=document.documentElement.dataset.theme==='dark';themeButton.innerHTML='<span class="theme-sun" aria-hidden="true">☀</span><span class="theme-moon" aria-hidden="true">☾</span><span class="theme-knob" aria-hidden="true"></span>';themeButton.setAttribute('aria-label','Dark appearance');themeButton.setAttribute('role','switch');themeButton.setAttribute('aria-checked',String(dark));themeButton.setAttribute('aria-pressed',String(dark));}
themeLabel();themeButton.addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=next;try{localStorage.setItem('decor-pack-theme',next)}catch{}themeLabel()});
}
const menu=document.querySelector('.menu-button'),navigation=document.querySelector('#navigation');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'Close':'Menu';navigation.classList.toggle('open',open)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){menu.click();menu.focus()}});

navigation.addEventListener('click',event=>{if(event.target.closest('a')&&menu.getAttribute('aria-expanded')==='true')menu.click()});
