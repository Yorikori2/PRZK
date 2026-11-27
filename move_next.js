/* PROJECT LEGACY — walk / run as a toggle.
   Before: how far you pushed the stick decided walk or run, and a pill at the bottom said which.
   Now: a toggle on the left side of the screen. 🚶 걷기 = always walk (quiet, slower) · 🏃 달리기 = always run (loud, fast).
   The stick only gives the direction. The bottom pill is gone. Driving is not affected.
   Loaded late (after atmos.js). */
'use strict';
const MV_WALK=.6;/* the stick strength that walking means (under the run line of .75 → footsteps stay quiet) */
let MVMODE='run';try{MVMODE=localStorage.getItem('pl_mv')||'run'}catch(e){}
{const _u=upd;upd=function(dt){if(S&&!S.dr){const m=Math.hypot(jx,jy);if(m>.1){const t=MVMODE=='walk'?MV_WALK:1;jx=jx/m*t;jy=jy/m*t}}return _u.apply(this,arguments)}}
function mvSet(m){MVMODE=m;try{localStorage.setItem('pl_mv',m)}catch(e){}mvPaint();msg(m=='walk'?'🚶 걷기 · 조용히 움직여요 (발소리 작음)':'🏃 달리기 · 빠르지만 발소리가 커요')}
function mvPaint(){const el=$('mvT');if(!el)return;el.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.mv==MVMODE))}
document.body.insertAdjacentHTML('beforeend','<div id="mvT"><button data-mv="walk">🚶<small>걷기</small></button><button data-mv="run">🏃<small>달리기</small></button></div>');
$('mvT').querySelectorAll('button').forEach(b=>{b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();mvSet(b.dataset.mv)})});mvPaint();
document.head.insertAdjacentHTML('beforeend',`<style>
#atmo{display:none!important}
#mvT{position:fixed;left:max(10px,env(safe-area-inset-left,0px));top:calc(env(safe-area-inset-top,0px) + 34%);z-index:3;display:flex;flex-direction:column;gap:4px;padding:4px;border-radius:16px;background:#0d1114cc;border:1px solid #ffffff22;touch-action:none}
#mvT button{width:52px;height:52px;padding:0;border-radius:12px;border:1px solid transparent;background:transparent;color:#e8e2d6;font-size:20px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;opacity:.55}
#mvT button small{font-size:10px}#mvT button.on{opacity:1;background:#e0b03a2e;border-color:#e0b03a;color:#ffd36a}
body.bld #mvT{visibility:hidden}
@media (orientation:landscape) and (max-height:520px){#mvT{top:calc(env(safe-area-inset-top,0px) + 120px)}#mvT button{width:46px;height:44px;font-size:17px}}</style>`);
/* the HUD editor can move it like the other panels */
if(typeof UIE!='undefined'&&UIE.ids&&!UIE.ids.some(x=>x[0]=='mvT'))UIE.ids.push(['mvT','걷기 · 달리기']);
