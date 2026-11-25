/* PROJECT LEGACY — small-screen fixes, first-time tips, wave alarm underground.
   1) Landscape phones: the weapon / quick-slot panel sits low, left of the action buttons (no longer touching the
      block label); narrow phones: the wave line stays on one line.
   2) First-time tips (once per device): the right-edge handle, the 철거 slot when you first own a demolition tool,
      the 강화 · 룬 작업대 when you first pick up an enhancement stone or rune.
   3) A wave while you are underground: a red alarm banner, a siren and a pulsing edge; the wave waits at the base
      (chip on screen) and starts when you climb out.
   Loaded after wcard_next.js. */
'use strict';
/* ---------- 1) layout ---------- */
document.head.insertAdjacentHTML('beforeend',`<style>
@media (orientation:landscape) and (max-height:520px){body[data-wcs="C"] #wc2{bottom:calc(env(safe-area-inset-bottom,0px) + 8px)!important;right:172px!important}body[data-wcs="C"] #wc2 .sl{width:46px;height:50px}body[data-wcs="C"] #wc2 .sl img{width:24px;height:24px}body[data-wcs="C"] #wc2 .q{width:40px;height:40px}body[data-wcs="C"] #wc2 .q img{width:24px;height:24px}
 #wcH{bottom:calc(env(safe-area-inset-bottom,0px) + 100px)!important}}
@media (max-width:400px){#tp{max-width:calc(100vw - 200px);overflow:hidden}#tp .w{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:10px}}</style>`);
/* ---------- 2) first-time tips ---------- */
let TIPS={};try{TIPS=JSON.parse(localStorage.getItem('pl_tips')||'{}')}catch(e){}
function tipShow(key,sel,text){if(TIPS[key])return false;const t=document.querySelector(sel);if(!t)return false;const r=t.getBoundingClientRect();if(!r.width||getComputedStyle(t).display=='none')return false;
 TIPS[key]=1;try{localStorage.setItem('pl_tips',JSON.stringify(TIPS))}catch(e){}let el=$('tipB');if(el)el.remove();
 document.body.insertAdjacentHTML('beforeend','<div id="tipB"><div class="tx">'+text+'</div><small>눌러서 닫기</small><i></i></div>');el=$('tipB');const w=Math.min(260,innerWidth-24);el.style.width=w+'px';
 const left=Math.max(12,Math.min(innerWidth-w-12,r.left+r.width/2-w/2));el.style.left=left+'px';const above=r.top>140;if(above)el.style.bottom=(innerHeight-r.top+12)+'px';else{el.style.top=(r.bottom+12)+'px';el.classList.add('dn')}
 el.querySelector('i').style.left=Math.max(10,Math.min(w-20,r.left+r.width/2-left-6))+'px';t.classList.add('tipHi');
 const close=()=>{el.remove();t.classList.remove('tipHi')};el.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();close()});setTimeout(()=>{if(document.body.contains(el))close()},7000);return true}
let TIPT=0;
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!S||!S.p||!run||PAUSE||$('bm').style.display=='block'||(typeof UIE!='undefined'&&UIE.on)){const tb=$('tipB');if(tb&&$('bm').style.display=='block')tb.remove();return}TIPT-=dt;if(TIPT>0||$('tipB'))return;TIPT=.5;const p=S.p;
  if(S.t!=null&&(S.tipT=(S.tipT||0)+.5)>3&&tipShow('handle','#wcH','오른쪽 <b>손잡이</b>를 누르면 퀵슬롯과 무기 칸을 접고 펴요'))return;
  if(DT&&Object.keys(DT).some(id=>has(p,id))&&WCOPEN&&tipShow('demo','#wc2 .sl[data-s="dm"]','<b>철거</b> 칸을 누르면 철거 모드 · 공격 버튼으로 건물과 가구를 부숴요 · 다른 칸을 누르면 원래 무기로'))return;
  if(Object.keys(p.inv).some(k=>p.inv[k]>0&&/^(enh[1-4g]|orn|rn_|ao_)/.test(k))&&!fBuilt('enhb')){if(tipShow('enhb','#wcH','강화석과 룬은 거점의 <b>강화 · 룬 작업대</b>에서 써요 · 제작소(제련로 근처)에서 <b>⑤번</b>을 지으세요'))return}}}
/* ---------- 3) wave while underground ----------
   The wave's zombies would have been spawned inside the mine map, so the wave waits at the surface:
   alarm now, a chip while you stay below, and the wave starts the moment you climb out. */
function ugAlarm(n){let el=$('ugA');if(el)el.remove();document.body.insertAdjacentHTML('beforeend','<div id="ugA"><b>🚨 지상 거점에 웨이브 '+n+'!</b><small>좀비가 거점 앞에 모였어요 · 올라가는 순간 시작돼요</small></div>');setTimeout(()=>{const e=$('ugA');if(e)e.remove()},5000);
 document.body.classList.add('ugWave');setTimeout(()=>document.body.classList.remove('ugWave'),6000);try{sfx((a,t)=>{for(let i=0;i<4;i++){tone(a,t+i*.5,{w:'sawtooth',f0:600,f1:950,d:.25,v:.12});tone(a,t+i*.5+.25,{w:'sawtooth',f0:950,f1:600,d:.25,v:.12})}})}catch(e){}}
{const _w=wave;wave=function(n){if(typeof DUN!='undefined'&&DUN&&S){S.wavePend=Math.max(S.wavePend||0,n);S.wv=n;ugAlarm(n);return}return _w.apply(this,arguments)}}
{const _de=dunExit;dunExit=function(){const r=_de.apply(this,arguments);if(S&&S.wavePend&&!(typeof DUN!='undefined'&&DUN)){const n=S.wavePend;S.wavePend=0;const c=$('ugC');if(c)c.remove();setTimeout(()=>{try{wave(n)}catch(e){}},400)}return r}}
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!S)return;let c=$('ugC');const under=typeof DUN!='undefined'&&DUN;if(!under||!S.wavePend){if(c)c.remove();return}
  if(!c){document.body.insertAdjacentHTML('beforeend','<div id="ugC"></div>');c=$('ugC')}c.textContent='🚨 거점에 웨이브 '+S.wavePend+' 대기 중 · 올라가면 시작'}}
document.head.insertAdjacentHTML('beforeend',`<style>#tipB{position:fixed;z-index:30;padding:9px 12px 7px;border-radius:12px;background:#1e3a4ef5;border:1.5px solid #9ad0f0;box-shadow:0 4px 16px #0008;font-size:13px;line-height:1.45;animation:tipIn .25s}
#tipB small{display:block;margin-top:3px;color:#9ad0f0;font-size:10.5px}#tipB i{position:absolute;bottom:-7px;width:12px;height:12px;background:#1e3a4e;border-right:1.5px solid #9ad0f0;border-bottom:1.5px solid #9ad0f0;transform:rotate(45deg)}#tipB.dn i{bottom:auto;top:-7px;transform:rotate(225deg)}
@keyframes tipIn{from{opacity:0;transform:translateY(6px)}to{opacity:1}}.tipHi{outline:2px solid #9ad0f0;outline-offset:3px;border-radius:12px;animation:tipP 1s infinite}@keyframes tipP{50%{outline-color:#9ad0f000}}
#ugA{position:fixed;left:50%;top:30%;transform:translate(-50%,-50%);z-index:25;padding:12px 18px;border-radius:14px;background:#5a1414f2;border:2px solid #ff6a5a;text-align:center;animation:ugIn .4s;pointer-events:none;white-space:nowrap}#ugA b{display:block;font-size:20px;color:#ffd0c8}#ugA small{font-size:12px;color:#ffe8e0}
@keyframes ugIn{from{opacity:0;transform:translate(-50%,-50%) scale(.8)}to{opacity:1}}body.ugWave::after{content:'';position:fixed;inset:0;pointer-events:none;z-index:24;box-shadow:inset 0 0 40px 8px #ff3a3a88;animation:ugP 1.2s infinite}@keyframes ugP{50%{box-shadow:inset 0 0 20px 2px #ff3a3a33}}
#ugC{position:fixed;left:50%;transform:translateX(-50%);top:calc(env(safe-area-inset-top,0px) + 150px);z-index:6;padding:4px 12px;border-radius:99px;background:#5a1414e6;border:1px solid #ff6a5a;font-size:12px;pointer-events:none}</style>`);
