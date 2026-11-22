/* PROJECT LEGACY — rainy-day water and sound visualisation settings.
   - Rain doubles what the base's rain-water module (빗물통/물탱크/급수탑) collects; the base sheet says so.
   - The 🎚 sound settings sheet gets three switches: off-screen sound arrows, the running footstep ring, and sound captions
     (short text such as "→ 오른쪽 멀리 · 감염견 짖음") so players with the sound off get the same information.
   Needs atmos.js and zsound.js. */
'use strict';
/* ================= rain water ================= */
const rainMul=()=>typeof rainNow=='function'&&rainNow()?2:1;
{const _ob=openBase;openBase=function(){_ob();if(!S)return;const b=$('bm'),lv=S.base.lv.water||0;const h2=b.querySelector('h2');if(!h2)return;
  h2.insertAdjacentHTML('afterend','<div class="rainw'+(rainNow()?' on':'')+'">'+(rainNow()?'🌧 비가 와요 · 빗물 받이 생산 ×2':'⛅ 맑음 · 비 오는 날엔 빗물 받이 생산 ×2')+(lv?'':' <small>(물 저장 시설이 있어야 해요)</small>')+'</div>')}}
/* ================= sound visualisation switches ================= */
let VIS={arrows:1,ring:1,cap:0};try{Object.assign(VIS,JSON.parse(localStorage.getItem('pl_vis')||'{}'))}catch(e){}
const VISK=[['arrows','➤ 화면 밖 소리 화살표','소리가 난 방향을 화면 가장자리에 표시'],['ring','◯ 달리기 발소리 범위','달릴 때 좀비를 부르는 범위를 원으로 표시'],['cap','💬 소리 자막','중요한 소리를 짧은 글로 표시 · 소리를 끄고 할 때 추천']];
function setVis(k,v){VIS[k]=v?1:0;try{localStorage.setItem('pl_vis',JSON.stringify(VIS))}catch(e){}visApply()}
function visApply(){const sd=$('sdir');if(sd)sd.style.display=VIS.arrows?'':'none';const c=$('scap');if(c)c.style.display=VIS.cap?'':'none'}
{const _om=openMixer;openMixer=function(){_om();const b=$('bm');b.insertAdjacentHTML('beforeend','<div class="s3h">👁 소리를 눈으로 보기</div>'+VISK.map(([k,n,d])=>'<label class="vsr"><input type="checkbox" data-vs="'+k+'"'+(VIS[k]?' checked':'')+'><span><b>'+n+'</b><small>'+d+'</small></span></label>').join(''));
  b.querySelectorAll('[data-vs]').forEach(c=>c.onchange=()=>{setVis(c.dataset.vs,c.checked);msg((c.checked?'켜짐: ':'꺼짐: ')+VISK.find(v=>v[0]==c.dataset.vs)[1])})}}
/* footstep ring on/off */
{const _dfx=drawGearFx;drawGearFx=function(){if(!VIS.ring&&typeof AT!='undefined')AT.ring.length=0;_dfx()}}
/* captions */
const CAPN={civ1:'좀비 신음',civ2:'좀비 신음',civ3:'좀비 신음',runner:'러너 으르렁',screamer:'비명 좀비 비명',heavy:'중무장 좀비 신음',crawler:'크롤러 꿀렁임',spitter:'스피터 꿀렁임',bloater:'부머 부글거림',stalker:'스토커 숨소리',dog:'감염견 짖음',burner:'불타는 좀비 신음',shocker:'감전 좀비 지직',sleeper:'잠복자 숨소리',brute:'브루트 포효',brood:'번식체 꿀렁임',goliath:'골리앗 포효'};
const CAPE={leap:'스토커 도약!',charge:'브루트 돌진!',wake:'잠복자 기습!',slam:'골리앗 내려찍기!',spawn:'번식체가 크롤러를 낳음',spit:'산성 침',boom:'폭발',roar:'포효'};
const CAP=[];const capLast={};
function dirWord(x,y){const p=S.p,dx=x-p.x,dy=y-p.y,d=Math.hypot(dx,dy),a=Math.atan2(dy,dx),ar=['→ 오른쪽','↘ 오른쪽 아래','↓ 아래','↙ 왼쪽 아래','← 왼쪽','↖ 왼쪽 위','↑ 위','↗ 오른쪽 위'][((Math.round(a/(Math.PI/4))%8)+8)%8];return(d<180?'● 바로 옆':ar)+(d>=180?(d>600?' 멀리':d>320?'':' 가까이'):'')}
function caption(key,txt,x,y){if(!S)return;const d=Math.hypot(x-S.p.x,y-S.p.y);if(d>1000)return;const now=performance.now();if(capLast[key]&&now-capLast[key]<2200)return;capLast[key]=now;CAP.unshift({t:2.6,s:dirWord(x,y)+' · '+txt,hot:/!$/.test(txt)});CAP.length=Math.min(CAP.length,3)}
{const _v=voice;voice=function(z,vol){caption('v'+z.look,CAPN[z.look]||'좀비 소리',z.x,z.y);return _v(z,vol)}}
{const _e=ev3;ev3=function(k,x,y,vol,arg){caption('e'+k+Math.round(x/200)+Math.round(y/200),CAPE[k]||'소리',x,y);return _e(k,x,y,vol,arg)}}
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!S)return;for(const c of CAP)c.t-=dt;for(let i=CAP.length-1;i>=0;i--)if(CAP[i].t<=0)CAP.splice(i,1);
  const el=$('scap');if(el&&VIS.cap)el.innerHTML=CAP.map(c=>'<div class="'+(c.hot?'hot':'')+'" style="opacity:'+Math.min(1,c.t*1.5)+'">'+c.s+'</div>').join('')}}
document.body.insertAdjacentHTML('beforeend','<div id="scap"></div>');
document.head.insertAdjacentHTML('beforeend',`<style>
#bm .rainw{margin:4px 0 8px;padding:6px 10px;border-radius:10px;background:#ffffff0a;font-size:12.5px}#bm .rainw.on{background:#3a86c822;border:1px solid #4aa0e066}#bm .rainw small{color:var(--mut)}
#bm .vsr{display:grid;grid-template-columns:24px 1fr;gap:8px;align-items:center;padding:7px 9px;border-radius:10px;background:#ffffff08;margin-top:5px;cursor:pointer}#bm .vsr input{width:18px;height:18px;accent-color:#5fbf6a}#bm .vsr b{display:block;font-size:12.5px}#bm .vsr small{font-size:10.5px;color:var(--mut)}
#scap{position:fixed;left:max(10px,env(safe-area-inset-left,0px));bottom:calc(env(safe-area-inset-bottom,0px) + 40px);z-index:3;pointer-events:none;display:flex;flex-direction:column-reverse;gap:3px;align-items:flex-start;max-width:52vw}
#scap div{font-size:11.5px;padding:3px 9px;max-width:52vw;overflow:hidden;text-overflow:ellipsis;border-radius:8px;background:#000c;border:1px solid #ffffff22;white-space:nowrap}#scap div.hot{border-color:#ff6a5a;color:#ffb0a0}
@media (orientation:landscape) and (max-height:420px){#scap{left:calc(max(10px,env(safe-area-inset-left,0px)) + 100px);max-width:40vw}#scap div{max-width:40vw}}

</style>`);
visApply();
