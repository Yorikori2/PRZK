/* PROJECT LEGACY — the app part: offline files (service worker), an [앱 설치] button where the browser offers it,
   and a tidy full-screen start when opened from the home screen. Does nothing inside a preview frame or from a file. */
'use strict';
(function(){const top=(()=>{try{return window.top===window}catch(e){return false}})();
 const ok=top&&'serviceWorker' in navigator&&/^https?:$/.test(location.protocol);
 if(ok)addEventListener('load',()=>{navigator.serviceWorker.register('sw.js').catch(()=>{})});
 let ask=null;addEventListener('beforeinstallprompt',e=>{e.preventDefault();ask=e;show()});
 function show(){if(document.getElementById('appI'))return;const b=document.createElement('button');b.id='appI';b.textContent='📲 앱 설치';b.onclick=async()=>{if(!ask)return;ask.prompt();try{await ask.userChoice}catch(e){}ask=null;b.remove()};document.body.appendChild(b)}
 const standalone=matchMedia('(display-mode: standalone),(display-mode: fullscreen)').matches||navigator.standalone;if(standalone)document.documentElement.classList.add('app');
 /* iPhone has no install prompt: a one-time hint on the title screen */
 const ios=/iphone|ipad|ipod/i.test(navigator.userAgent)&&!standalone&&top&&/^https:$/.test(location.protocol);let seen=false;try{seen=localStorage.getItem('pl_ioshint')=='1'}catch(e){}
 if(ios&&!seen)addEventListener('load',()=>setTimeout(()=>{const d=document.createElement('div');d.id='appH';d.innerHTML='📲 홈 화면에 추가하면 앱처럼 전체 화면으로 즐길 수 있어요<br><small>Safari 아래 <b>공유</b> → <b>홈 화면에 추가</b></small><button>닫기</button>';d.querySelector('button').onclick=()=>{d.remove();try{localStorage.setItem('pl_ioshint','1')}catch(e){}};document.body.appendChild(d)},2500));
 document.head.insertAdjacentHTML('beforeend','<style>#appI{position:fixed;right:12px;top:calc(env(safe-area-inset-top,0px) + 12px);z-index:300;padding:9px 14px;border-radius:12px;background:#e0b03a;color:#1d1714;font-weight:800;border:0;box-shadow:0 4px 14px #000a}#appH{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(env(safe-area-inset-bottom,0px) + 16px);z-index:300;max-width:92vw;padding:10px 14px;border-radius:12px;background:#0d1114f2;border:1px solid #ffd36a88;color:#e8e2d6;font-size:13px;text-align:center;line-height:1.5}#appH button{display:block;margin:6px auto 0;padding:4px 12px;font-size:12px}</style>')})();
