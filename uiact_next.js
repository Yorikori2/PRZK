/* PROJECT LEGACY — sample: fewer pop-ups, one interact button, demolition mode, big-enhance effect.
   1) The stack of context buttons above the weapon card is gone. One small hint above [상호작용] says what the button will do
      (and "+N" opens the other choices). Tapping [상호작용] does it: open a workbench, a turret / base, the stash, a station,
      the enhance bench, ladders, chests, merchants…
   2) Enhancing and options only at the 강화 · 룬 작업대 (the base-menu shortcut buttons are gone).
   3) Demolition mode: a 🔨 switch above the attack button. Off = tools never demolish (and the rings / tool prompts hide).
      On = your best demolition tool is wielded and the attack button demolishes; switching off puts your weapon back.
   4) Enhancing to +10 or higher: a light pillar, a screen flash, a banner and a rising chime.
   Loaded last (before scenes9.js). */
'use strict';
/* ---------- 1) one interact button ---------- */
const IALOW=/흙 · 돌|\(공격 버튼\)|운전 중|폭발까지/;
function iaList(){let B=[];try{B=dmCtx()}catch(e){}return B}
function iaTop(B){const A=B.filter(q=>q.f&&!q.info&&!q.off);return A.find(q=>q.big&&!IALOW.test(q.t))||A.find(q=>!IALOW.test(q.t))||null}
/* stations and things around the base that used to need a menu: now [상호작용] */
{const _c=dmCtx;dmCtx=function(){const B=_c();if(!S||DUN||!S.base||!inBase(S.p.x,S.p.y))return B;const p=S.p,near=(t,r)=>BP.find(o=>o.t==t&&Math.hypot(o.x+o.w/2-p.x,o.y+o.h/2-p.y)<(r||70));
  if(near('bench3'))B.push({t:'🛠 제작 (작업대)',f:()=>openCraft()});if(near('stash',60))B.push({t:'📦 보관함 열기',f:()=>openStash()});if(near('turret',80))B.push({t:'🔫 포탑 · 거점 관리',f:()=>openBase()});return B}}
let IAB=[],IAK='',IAT=0;
document.body.insertAdjacentHTML('beforeend','<div id="iaHint"></div>');
function iaRefresh(){const el=$('iaHint');if(!el)return;const B=run&&S&&!PAUSE?iaList():[],top=iaTop(B),rest=B.filter(q=>q!==top&&(q.f||q.info)),info=B.find(q=>q.info&&!q.f);IAB=B;
 const k=(top?top.t:'')+'|'+rest.length+'|'+(info?info.t:'');if(k==IAK)return;IAK=k;{const pp=$('iaPop');if(pp)pp.remove()}const a=$('act').getBoundingClientRect();
 if(!top&&!info&&!rest.length){el.style.display='none';return}el.style.display='flex';el.style.right=(innerWidth-a.right-4)+'px';el.style.bottom=(innerHeight-a.top+8)+'px';
 el.innerHTML=(top?'<span class="t">'+top.t.replace(/\s*\(.*?\)\s*$/,'')+'</span>':info?'<span class="t i">'+info.t+'</span>':'')+(rest.length?'<span class="n">'+(top||info?'+'+rest.length:'⋯ '+rest.length)+'</span>':'')}
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);IAT-=dt;if(IAT<=0){IAT=.2;iaRefresh()}}}
$('iaHint').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();iaPop()});
function iaPop(){let el=$('iaPop');if(el){el.remove();return}const B=IAB.filter(q=>q.f||q.info);if(!B.length)return;document.body.insertAdjacentHTML('beforeend','<div id="iaPop">'+B.map((q,i)=>'<button data-i="'+i+'" class="'+(q.f&&!q.off?'':'dim')+'">'+q.t+'</button>').join('')+'</div>');el=$('iaPop');
 const h=$('iaHint').getBoundingClientRect();el.style.right=(innerWidth-h.right)+'px';el.style.bottom=(innerHeight-h.top+6)+'px';
 el.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();const b=e.target.closest('[data-i]');if(b){const q=B[+b.dataset.i];if(q&&q.f&&!q.off)q.f()}el.remove();IAK=''});
 setTimeout(()=>{const off=e=>{if(!el.contains(e.target)&&!e.target.closest('#iaHint')){el.remove();removeEventListener('pointerdown',off,true)}};addEventListener('pointerdown',off,true)},40)}
{const _ia=ia;ia=function(){if(S&&!S.dr){const top=iaTop(iaList());if(top){top.f();IAK='';return}}return _ia()}}
/* ---------- 2) enhancing only at the 강화 · 룬 작업대 ---------- */
const nearEnhB=()=>{if(!S||!S.base||!fBuilt('enhb')||!inBase(S.p.x,S.p.y))return false;const L=FPOS.enhb,p=S.p;return Math.hypot(p.x-(BL.ox+L[0]+L[2]/2),p.y-(BL.oy+L[1]+L[3]/2))<90};
if(typeof nearBench=='function')nearBench=nearEnhB;
{const _u=use2;use2=function(k){if(k&&(k.startsWith('rn_')||k.startsWith('enh'))&&!nearEnhB())return msg('💠 강화 · 옵션은 거점의 강화 · 룬 작업대에서 해요 (제작소 ⑤번)');return _u.apply(this,arguments)}}
document.head.insertAdjacentHTML('beforeend','<style>#enhOpen,#aeOpen,#ornOpen,#forgeOpen{display:none!important}</style>');
/* ---------- 3) demolition mode ---------- */
let DEMO=false,DEMOPREV=null;
const bestTool=()=>['dt3','dt2','dt1','dt1f'].find(id=>has(S.p,id));
function demoMode(on){const p=S.p;if(on==null)on=!DEMO;if(on){const t=bestTool();if(!t)return msg('🔨 철거 도구가 없어요 (작업대에서 철거 해머 제작)');DEMOPREV={mel:p.eq.mel,as:p.as};p.eq.mel=t;p.as='mel';DEMO=true;msg('🔨 철거 모드 · '+NM2(t)+' · 공격 버튼으로 철거해요 · 다시 누르면 무기로 돌아가요')}
 else{DEMO=false;if(DEMOPREV){if(DEMOPREV.mel&&has(p,DEMOPREV.mel))p.eq.mel=DEMOPREV.mel;else if(DT[p.eq.mel])p.eq.mel='';p.as=DEMOPREV.as=='mel'&&!p.eq.mel?'prim':DEMOPREV.as}DEMOPREV=null;msg('⚔ 전투 모드')}
 document.body.classList.toggle('demoOn',DEMO);hud2()}
{const _dz=dZone;dZone=function(){if(!DEMO)return null;return _dz.apply(this,arguments)}}
{const _dr=dReady;dReady=function(z,t,q){if(!DEMO)return false;return _dr(z,t,q)}}
{const _c=dmCtx;dmCtx=function(){let B=_c();if(!DEMO)B=B.filter(q=>!/공격 버튼으로 (가구|원 안)|고리 안 자동 해체|💣 폭파|Lv\d 필요 🔒/.test(q.t));return B}}
/* picking a different weapon leaves demolition mode */
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(DEMO&&S&&!DT[actW(S.p)]){DEMO=false;DEMOPREV=null;document.body.classList.remove('demoOn')}}}
document.body.insertAdjacentHTML('beforeend','<button id="demoB" title="철거 모드">🔨</button>');
$('demoB').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();if(run)demoMode()});
{const _h=hud2;hud2=function(){const r=_h.apply(this,arguments);const b=$('demoB');if(b&&S&&S.p){b.style.display=bestTool()||DEMO?'':'none';const a=$('atk').getBoundingClientRect();b.style.right=(innerWidth-a.right+a.width/2-20)+'px';b.style.bottom=(innerHeight-a.top+8)+'px';$('atk').textContent=DEMO?'철거':'공격'}return r}}
/* ---------- 4) +10 and higher: light pillar, flash, banner, chime ---------- */
let EFX=null;
function enhFx(lv,nm){const t0=performance.now();EFX={t0,lv};const big=lv>=ENH.max;
 document.body.insertAdjacentHTML('beforeend','<div id="enhFx"><div class="fl"></div><div class="bn"><b>✨ +'+lv+' 강화 성공!</b><small>'+nm+(big?' · 최대 강화':'')+'</small></div></div>');setTimeout(()=>{const e=$('enhFx');if(e)e.remove()},2600);
 sfx((a,t)=>{const N=[523,659,784,1047,1319].slice(0,big?5:4);N.forEach((f,i)=>tone(a,t+i*.09,{w:'triangle',f0:f,f1:f*1.01,d:.35,v:.16}));tone(a,t+N.length*.09,{w:'sine',f0:2093,f1:2093,d:.9,v:.12})})}
OVL.push((g2,sx,sy,k)=>{if(!EFX)return;const e=(performance.now()-EFX.t0)/1000;if(e>2.4){EFX=null;return}const p=S.p,X=sx(p.x),Y=sy(p.y),a=e<.3?e/.3:Math.max(0,1-(e-1.2)/1.2),H=innerHeight;
 g2.save();g2.globalCompositeOperation='lighter';const gr=g2.createLinearGradient(X-26,0,X+26,0);gr.addColorStop(0,'rgba(255,210,90,0)');gr.addColorStop(.5,'rgba(255,240,170,'+.75*a+')');gr.addColorStop(1,'rgba(255,210,90,0)');g2.fillStyle=gr;g2.fillRect(X-26,0,52,Y);
 g2.strokeStyle='rgba(255,220,120,'+a+')';g2.lineWidth=3;g2.beginPath();g2.ellipse(X,Y,20+e*90,(20+e*90)*.35,0,0,Math.PI*2);g2.stroke();
 for(let i=0;i<14;i++){const yy=Y-((e*260+i*37)%Math.max(60,Y)),xx=X+Math.sin(i*2.1+e*4)*18;g2.fillStyle='rgba(255,250,210,'+a+')';g2.fillRect(xx,yy,2,2)}g2.restore()});
{const _d=doEnh;doEnh=function(){const id=ENSEL,l0=enhLv(id);_d.apply(this,arguments);const l1=enhLv(id);if(l1>l0&&l1>=10)enhFx(l1,NM2(id))}}
{const _d=doAEnh;doAEnh=function(){const id=AESEL,l0=aLv(id);_d.apply(this,arguments);const l1=aLv(id);if(l1>l0&&l1>=10)enhFx(l1,NM2(id))}}
document.head.insertAdjacentHTML('beforeend',`<style>#dmBox{display:none!important}
#iaHint{position:fixed;z-index:5;display:none;align-items:center;gap:4px;pointer-events:auto;max-width:62vw}#iaHint .t{padding:5px 10px;border-radius:99px;background:#1e3a4ee6;border:1px solid #5aa8ff88;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#iaHint .t.i{background:#1d1a14dd;border-color:#ffffff33;color:var(--mut)}#iaHint .n{padding:5px 8px;border-radius:99px;background:#3a2a14ee;border:1px solid #e0b03a;font-size:12px;font-weight:700}
#iaPop{position:fixed;z-index:9;display:flex;flex-direction:column;gap:4px;padding:6px;border-radius:12px;background:#141a20f2;border:1px solid #ffffff2a;max-width:78vw}#iaPop button{text-align:left;padding:7px 12px;font-size:13px;width:auto}#iaPop button.dim{opacity:.55}
#demoB{position:fixed;z-index:5;width:40px;height:40px;border-radius:50%;padding:0;font-size:18px;background:#2a2e33;border:2px solid #8a9096}body.demoOn #demoB{background:#6b4426;border-color:#ffd36a;box-shadow:0 0 10px #ffd36a88}body.demoOn #atk{background:radial-gradient(circle at 40% 35%,#a8783e,#5a3e1e)!important}
#enhFx{position:fixed;inset:0;z-index:20;pointer-events:none}#enhFx .fl{position:absolute;inset:0;background:radial-gradient(circle at 50% 55%,#fff6d0cc,#ffd36a44 35%,transparent 70%);animation:efF 1.2s forwards}@keyframes efF{0%{opacity:0}15%{opacity:1}100%{opacity:0}}
#enhFx .bn{position:absolute;left:50%;top:30%;transform:translate(-50%,-50%);text-align:center;animation:efB 2.5s forwards}#enhFx .bn{white-space:nowrap}#enhFx .bn b{display:block;font-size:26px;color:#ffe08a;text-shadow:0 0 12px #ffb84a,0 2px 0 #5a3c14}#enhFx .bn small{font-size:14px;color:#fff}@keyframes efB{0%{opacity:0;transform:translate(-50%,-30%) scale(.6)}15%{opacity:1;transform:translate(-50%,-50%) scale(1.1)}25%{transform:translate(-50%,-50%) scale(1)}80%{opacity:1}100%{opacity:0;transform:translate(-50%,-70%)}}</style>`);
