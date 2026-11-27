/* PROJECT LEGACY — walk / run as a toggle.
   Before: how far you pushed the stick decided walk or run, and a pill at the bottom said which.
   Now: a toggle on the left side of the screen. 🚶 걷기 = always walk (quiet, slower) · 🏃 달리기 = always run (loud, fast).
   The stick only gives the direction. The bottom pill is gone. Driving is not affected.
   Loaded late (after atmos.js). */
'use strict';
const MV_WALK=.6;/* the stick strength that walking means (under the run line of .75 → footsteps stay quiet) */
let MVMODE='run';try{MVMODE=localStorage.getItem('pl_mv')||'run'}catch(e){}
{const _u=upd;upd=function(dt){const rx=jx,ry=jy;if(S&&!S.dr){const m=Math.hypot(jx,jy);if(m>.1){const t=MVMODE=='walk'?MV_WALK:1;jx=jx/m*t;jy=jy/m*t}}try{return _u.apply(this,arguments)}finally{if(jx!==0||jy!==0){jx=rx;jy=ry}}}}
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
/* ---------- other ways to switch, to try in the sample (setting kept) ----------
   two  : two buttons on the left (as before)
   one  : one round button by the thumb · tap = switch
   dtap : no button · tap the stick area twice quickly = switch (a small sign shows the mode)
   auto : no button · push the stick to the edge and hold ½ s = run, ease off = walk */
let MVSTYLE='two';try{MVSTYLE=localStorage.getItem('pl_mvs')||'two'}catch(e){}
let mvEdgeT=0,mvAutoRun=false,mvLastTap=0,mvSignT=0;
function mvStyle(s){MVSTYLE=s;try{localStorage.setItem('pl_mvs',s)}catch(e){}mvLayout();msg({two:'걷기 · 달리기 버튼 2개',one:'버튼 1개 · 누를 때마다 바뀜',dtap:'스틱 자리를 두 번 톡 = 바꾸기',auto:'스틱을 끝까지 밀고 ½초 = 달리기',wpn:'무기칸 위 버튼 · 누를 때마다 걷기 ↔ 달리기'}[s])}
function mvLayout(){const t=$('mvT'),o=$('mvO');if(t)t.style.display=MVSTYLE=='two'?'':'none';if(o){o.style.display=MVSTYLE=='one'?'':'none';o.textContent=MVMODE=='walk'?'🚶':'🏃';o.className=MVMODE}}
document.body.insertAdjacentHTML('beforeend','<button id="mvO"></button><div id="mvSign"></div>');
$('mvO').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();mvSet(MVMODE=='walk'?'run':'walk')});
{const _p=mvPaint;mvPaint=function(){_p();mvLayout()}}
/* the auto style decides the mode itself every frame */
{const _u=upd;upd=function(dt){if(MVSTYLE=='auto'&&S&&!S.dr){const m=Math.hypot(jx,jy);if(m>.92)mvEdgeT+=dt;else mvEdgeT=0;const r=mvEdgeT>.5;if(r!=mvAutoRun){mvAutoRun=r;mvSignT=1.2}MVMODE=r?'run':'walk'}if(mvSignT>0)mvSignT-=dt;return _u.apply(this,arguments)}}
/* double tap on the left part of the screen (where the stick is) */
document.addEventListener('pointerdown',e=>{if(MVSTYLE!='dtap'||!run||PAUSE)return;if(e.target.closest&&e.target.closest('button,#bm,#bmap,#sd,#tbH,#bld'))return;if(e.clientX>innerWidth*.55)return;const t=performance.now();if(t-mvLastTap<300){mvSet(MVMODE=='walk'?'run':'walk');mvSignT=1.2;mvLastTap=0}else mvLastTap=t},true);
/* the small sign by the player when the mode changes (dtap · auto) */
setInterval(()=>{const s=$('mvSign');if(!s)return;const show=(MVSTYLE=='dtap'||MVSTYLE=='auto')&&run&&!PAUSE;s.style.display=show?'':'none';if(!show)return;s.textContent=MVMODE=='walk'?'🚶 걷기':'🏃 달리기';s.className=MVMODE+(mvSignT>0?' pop':'')},100);
document.head.insertAdjacentHTML('beforeend',`<style>
#mvO{position:fixed;left:max(12px,env(safe-area-inset-left,0px));bottom:calc(env(safe-area-inset-bottom,0px) + 250px);z-index:3;width:58px;height:58px;padding:0;border-radius:50%;font-size:26px;background:#0d1114d9;border:2px solid #ffffff33;touch-action:none}
#mvO.run{border-color:#ffb04a;box-shadow:0 0 0 3px #ffb04a33}#mvO.walk{border-color:#7fd0ff;box-shadow:0 0 0 3px #7fd0ff33}
#mvSign{position:fixed;left:max(12px,env(safe-area-inset-left,0px));bottom:calc(env(safe-area-inset-bottom,0px) + 250px);z-index:3;pointer-events:none;font-size:12px;padding:4px 9px;border-radius:99px;background:#0d1114cc;border:1px solid #ffffff22;color:#e8e2d6;opacity:.75;transition:transform .15s}
#mvSign.pop{transform:scale(1.25);opacity:1}#mvSign.run{color:#ffd09a}#mvSign.walk{color:#bfe6ff}
body.bld #mvO,body.bld #mvSign{visibility:hidden}</style>`);
mvLayout();
/* ---------- the chosen place: one toggle button right above the weapon panel (bottom right) ---------- */
MVSTYLE='wpn';try{localStorage.setItem('pl_mvs','wpn')}catch(e){}
{const _l=mvLayout;mvLayout=function(){_l();const t=$('mvT'),o=$('mvO');if(MVSTYLE!='wpn'){if(o)o.classList.remove('wpn');return}if(t)t.style.display='none';if(o){o.style.display='';o.classList.add('wpn');o.innerHTML=(MVMODE=='walk'?'🚶':'🏃')+'<small>'+(MVMODE=='walk'?'걷기':'달리기')+'</small>';o.className='wpn '+MVMODE}mvPlace()}}
function mvPlace(){const o=$('mvO');if(!o||MVSTYLE!='wpn')return;const w=$('wc2');if(!w||getComputedStyle(w).display=='none'){o.style.left='';o.style.right='';o.style.bottom='';o.style.top='';return}
 const r=w.getBoundingClientRect(),W=o.offsetWidth||54,H=o.offsetHeight||54;let right=Math.max(8,innerWidth-r.right),x0=innerWidth-right-W,top=r.top-8-H;
 for(const id of['tr','iaHint','vHud']){const e=$(id);if(!e||getComputedStyle(e).display=='none'||getComputedStyle(e).visibility=='hidden')continue;const q=e.getBoundingClientRect();if(!q.width)continue;if(q.right>x0&&q.left<x0+W&&q.bottom>top&&q.top<top+H)top=q.top-8-H}
 o.style.left='auto';o.style.bottom='auto';o.style.right=right+'px';o.style.top=Math.max(60,top)+'px'}
setInterval(mvPlace,250);addEventListener('resize',mvPlace);
document.head.insertAdjacentHTML('beforeend',`<style>#mvO.wpn{width:54px;height:54px;border-radius:14px;font-size:20px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;line-height:1.1}#mvO.wpn small{font-size:10px;font-weight:600}
#mvO.wpn.run{color:#ffd09a}#mvO.wpn.walk{color:#bfe6ff}body.uied #mvO{display:none!important}</style>`);
mvLayout();
