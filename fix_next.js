/* PROJECT LEGACY — robustness fixes found while play-testing. Loaded last. */
'use strict';
/* leaving the underground when you are not underground did nothing useful and threw (SURF is empty) */
{const _de=dunExit;dunExit=function(){if(typeof DUN=='undefined'||!DUN||!SURF){if(typeof DUN!='undefined')DUN=null;return}return _de.apply(this,arguments)}}
/* dying underground respawned you at the base coordinates while the mine map stayed loaded (no base, wrong world):
   climb out first, then the normal death / respawn happens on the surface */
{const _d=die;die=function(){if(typeof DUN!='undefined'&&DUN&&SURF){try{dunExit()}catch(e){}}return _d.apply(this,arguments)}}
/* holding a demolition tool means demolition mode (e.g. after loading a save made in demolition mode) */
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(typeof DEMO=='undefined'||!S||!S.p||!run)return;if(!DEMO&&DT[actW(S.p)]){DEMO=true;document.body.classList.add('demoOn');if(typeof WCK!='undefined')WCK=''}}}

/* floor-level things (hatch, hole to the next floor, fuel island) are drawn with the floor, never on top of the player */
Object.assign(FLAT,{hatch:1,mhole:1,island:1});
/* closing the explore map (✕) hid it but left the game paused: you could not move afterwards */
/* (also the stash and other windows that paused the game on opening: their ✕ only hid the window) */
{const _cb=closeBase;closeBase=function(){const m=$('bm').dataset.m;const r=_cb.apply(this,arguments);if($('bm').style.display=='none'&&run&&!(typeof UIE!='undefined'&&UIE.on)&&!$('bmap')){PAUSE=false;if(m=='xmap')$('bm').dataset.m=''}return r}}
/* HUD editor: the right-hand weapon · quick-slot panel (#wc2) is what is on screen now; the old card (#wc) and the old
   quick slots (#qk) are hidden in that style, so the editor offered panels you could not see or move */
function uiIdsFix(){if(typeof UIE=='undefined')return;const C=document.body.dataset.wcs!='old',has=id=>UIE.ids.some(x=>x[0]==id);
 if(C){UIE.ids=UIE.ids.filter(x=>x[0]!='wc'&&x[0]!='qk');if(!has('wc2'))UIE.ids.push(['wc2','무기 · 퀵슬롯'])}else{UIE.ids=UIE.ids.filter(x=>x[0]!='wc2');if(!has('qk'))UIE.ids.push(['qk','퀵슬롯']);if(!has('wc'))UIE.ids.push(['wc','무기 카드'])}}
if(typeof uiApply=='function'){uiIdsFix();
 {const _ua=uiApply;uiApply=function(){const r=_ua.apply(this,arguments);const el=$('wc2');if(el){if(el.style.left){el.style.setProperty('right','auto','important');el.style.setProperty('bottom','auto','important');el.style.transition='opacity .22s'}else el.style.transition=''}return r}}
 document.head.insertAdjacentHTML('beforeend','<style>body.uied #wc2,body.uidrag #wc2{transition:none!important}</style>');
 if(typeof wcSet=='function'){const _ws=wcSet;wcSet=function(s){_ws(s);uiIdsFix();try{uiApply()}catch(e){}}}
 try{uiApply()}catch(e){}}
/* the close button of every window (bag, stash, workshop, companions …) floats just above the window, big and easy to hit;
   it presses the window's own ✕, so each window still closes its own way. In landscape (side panel) it sits on its left. */
(function(){const bx=document.createElement('button');bx.id='bmX2';bx.textContent='✕';bx.setAttribute('aria-label','닫기');document.body.appendChild(bx);
 const own=()=>{const m=document.getElementById('bmap');if(m)return document.getElementById('bmX');const b=$('bm');if(!b)return null;return[...b.querySelectorAll('.sh button')].find(x=>x.textContent.trim()=='✕')||[...b.querySelectorAll('button')].find(x=>x.textContent.trim()=='닫기')||null};
 /* every window: the close button inside it is hidden, the floating ✕ above does the job */
 const hideInner=()=>{const b=$('bm');if(b)b.querySelectorAll('button').forEach(x=>{const t=x.textContent.trim();if((t=='✕'||t=='닫기'||t=='×')&&x.id!='bmX2'&&x.style.display!='none')x.style.display='none'});const mx=document.getElementById('bmX');if(mx&&mx.style.display!='none')mx.style.display='none'};
 bx.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation()});
 bx.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const o=own();if(o)o.click();else{closeBase();PAUSE=false}place()});
 function place(){const map=document.getElementById('bmap');if(map&&getComputedStyle(map).display!='none'){hideInner();bx.style.display='flex';bx.style.top='calc(env(safe-area-inset-top,0px) + 10px)';bx.style.left=(innerWidth-56)+'px';return}const b=$('bm');const vis=b&&b.style.display=='block'&&getComputedStyle(b).display!='none';if(!vis||(typeof UIE!='undefined'&&UIE.on)){bx.style.display='none';document.body.classList.remove('bmx2');return}hideInner();
  const r=b.getBoundingClientRect();bx.style.display='flex';document.body.classList.add('bmx2');{const o=own();if(o&&o.style.display!='none')o.style.display='none'}if(r.top>60){bx.style.top=(r.top-50)+'px';bx.style.left=(r.right-56)+'px'}else{bx.style.top='10px';bx.style.left=Math.max(6,r.left-52)+'px'}}
 new MutationObserver(place).observe($('bm'),{attributes:true,attributeFilter:['style'],childList:true});new MutationObserver(place).observe(document.body,{childList:true});addEventListener('resize',place);setInterval(place,300);place()})();
document.head.insertAdjacentHTML('beforeend',`<style>#bmX2{position:fixed;z-index:200;display:none;align-items:center;justify-content:center;width:44px;height:44px;padding:0;border-radius:50%;font-size:20px;font-weight:700;background:#1d2228f2;border:2px solid #ffffff55;color:#fff;box-shadow:0 4px 14px #000a}
#bmX2:active{transform:scale(.92)}</style>`);
/* HUD editor: the bar must not cover the weapon panel (nor the status panel / quick slots) → try a few heights, keep the one that hides least */
{const ar=(a,b)=>Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
 const KEY=['wc2','tr','st'];
 function uiBarCost(b){const r=b.getBoundingClientRect();let c=0;for(const id of KEY){const e=document.getElementById(id);if(!e)continue;const q=e.getBoundingClientRect();if(!q.width)continue;c+=ar(r,q)*(id=='wc2'?3:1)}
  if(r.top<0||r.bottom>innerHeight)c+=1e7;return c}
 function uiBarClear(){const b=document.getElementById('uiBar'),w=document.getElementById('wc2');if(!b||!w||b.style.display=='none')return;const wr=w.getBoundingClientRect();if(!wr.width)return;
  b.style.left='';const h=b.getBoundingClientRect().height,cur=b.style.top||'50%',cand=[cur,Math.round(wr.top-8-h/2)+'px','50%','22%','78%'];let best=cur,bc=1/0,bl='';
  for(const t of cand){b.style.top=t;b.style.left='';let c=uiBarCost(b);if(c<bc){bc=c;best=t;bl=''}
   /* wide, short screens: slide it left of the weapon panel */const bw=b.getBoundingClientRect().width,L=Math.max(bw/2+6,wr.left-8-bw/2);b.style.left=L+'px';const c2=uiBarCost(b)+1;if(c2<bc){bc=c2;best=t;bl=L+'px'}b.style.left=''}
  b.style.top=best;b.style.left=bl}
 window.uiBarClear=uiBarClear;
 if(typeof uiEdit=='function'){const _ue=uiEdit;uiEdit=function(on){const r=_ue.apply(this,arguments);if(on)uiBarClear();return r}}
 addEventListener('resize',()=>setTimeout(uiBarClear,50))}
/* the [상호작용] hint stayed on top of open windows */
document.head.insertAdjacentHTML('beforeend','<style>body:has(#bm[style*="display: block"]) #iaHint,body:has(#bmap) #iaHint{display:none!important}</style>');
/* the shield durability chip sat on top of open windows (same layer) → under them */
document.head.insertAdjacentHTML('beforeend','<style>#shdHud{z-index:4!important}</style>');
/* other chips that could cover an open window: the zone banner and the demolition button */
document.head.insertAdjacentHTML('beforeend','<style>#zoneb,#demoB{z-index:4!important}</style>');
