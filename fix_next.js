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
 const own=()=>{const b=$('bm');if(!b)return null;return[...b.querySelectorAll('.sh button')].find(x=>x.textContent.trim()=='✕')||null};
 bx.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation()});
 bx.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const o=own();if(o)o.click();else{closeBase();PAUSE=false}place()});
 function place(){const b=$('bm');const vis=b&&b.style.display=='block'&&getComputedStyle(b).display!='none';if(!vis||(typeof UIE!='undefined'&&UIE.on)){bx.style.display='none';document.body.classList.remove('bmx2');return}
  const r=b.getBoundingClientRect();bx.style.display='flex';document.body.classList.add('bmx2');{const o=own();if(o&&o.style.display!='none')o.style.display='none'}if(r.top>60){bx.style.top=(r.top-50)+'px';bx.style.left=(r.right-56)+'px'}else{bx.style.top='10px';bx.style.left=Math.max(6,r.left-52)+'px'}}
 new MutationObserver(place).observe($('bm'),{attributes:true,attributeFilter:['style'],childList:true});addEventListener('resize',place);setInterval(place,300);place()})();
document.head.insertAdjacentHTML('beforeend',`<style>#bmX2{position:fixed;z-index:12;display:none;align-items:center;justify-content:center;width:44px;height:44px;padding:0;border-radius:50%;font-size:20px;font-weight:700;background:#1d2228f2;border:2px solid #ffffff55;color:#fff;box-shadow:0 4px 14px #000a}
#bmX2:active{transform:scale(.92)}</style>`);
