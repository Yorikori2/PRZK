/* PROJECT LEGACY — sample: special ammo (opinion 6). Made at the ③ 탄약 제작대 from mined metals and powders.
   Every calibre (9mm · 5.56 · 7.62 · .308) comes in six kinds, and 12-gauge has five shells of its own.
   Pick which kind a calibre loads in the bag ([🔫 이 탄으로 장전]); the magazine keeps what was loaded.
   Loaded after mine_next.js. */
'use strict';
const ACAL={'9mm':['9mm',10],'556':['5.56mm',10],'762':['7.62mm',8],'308':['.308',5]};
/* kind: name, colour, what it does (text), stat changes, on-hit, recipe(n) */
const AKIND={
 bp:['흑색화약탄','#2a2a2a','값싸게 · 피해 -5% · 소음 +1',{d:.95,nz:1},null,n=>({case:n,blead:n,primer:n,bpow:2})],
 ap:['철갑탄','#4a5aa8','관통 +1 · 헤비 · 정예 · 약탈자에게 피해 +25%',{pierce:1},{tough:1.25},n=>({case:n,btung:n,primer:n,spow:1})],
 hp:['할로포인트','#c43c32','피해 +20% · 관통 안 됨 · 단단한 적에게 -20%',{d:1.2,nopierce:1},{tough:.8},n=>({case:n,bcop:n,primer:n,spow:1,icopper:1})],
 inc:['소이탄','#ff8a3a','맞은 좀비에 불 (2초)',{},{burn:2},n=>({case:n,blead:n,primer:n,bpow:1,sulfur:2})],
 sub:['아음속탄','#5a6470','소음 -2 · 피해 -10% · 소음기와 쓰면 거의 무음',{d:.9,nz:-2},null,n=>({case:n,blead:n,ilead:1,primer:n,bpow:1})],
 shk:['충격탄','#7ec8f0','맞은 좀비 0.5초 감전 (멈춤) · 희토류 필요',{},{stun:.5},n=>({case:n,bcop:n,primer:n,spow:1,orare:1})]};
const SHELL={slug:['슬러그','#e0b03a','한 발로 · 피해 ×4.5 · 사거리 +40% · 관통 1',{slug:1},null,{case:6,ilead:2,primer:6,bpow:1}],
 fl:['플레셰트','#9aa0a6','산탄 +2 · 관통 1 · 알갱이 피해 -20%',{pel:2,d:.8,pierce:1},null,{case:6,steel:1,primer:6,bpow:1}],
 db:['드래곤 브레스','#ff6a2a','불꽃 산탄 · 맞으면 불 (3초) · 사거리 -20%',{r:.8},{burn:3},{case:6,primer:6,bpow:1,sulfur:2,coal:1}],
 bean:['빈백 (고무탄)','#3a8a5a','피해 ×0.3 · 맞은 좀비 1초 넘어짐',{d:.3},{stun:1},{case:6,cloth:2,primer:6,bpow:1}],
 bp:['흑색 산탄','#2a2a2a','값싸게 · 피해 -5% · 소음 +1',{d:.95,nz:1},null,{case:6,blead:12,primer:6,bpow:2}]};
const AVAR={};/* item id → [calibre, kind, stat changes, on-hit] */
const ammoBadge=(base,c)=>()=>{(IC[base]||(()=>{}))();R('#1d1714',14,14,9,9);R(c,15,15,7,7);R('#ffffff66',15,15,3,2)};
for(const cal in ACAL)for(const k in AKIND){const id='a'+cal+'_'+k,A=AKIND[k],base='a'+cal;AVAR[id]=[cal,k,A[3],A[4]];if(!I_BY[id]){const it=[id,ACAL[cal][0]+' '+A[0],'a',k=='bp'?'c':k=='shk'||k=='ap'?'r':'u',I_BY[base]?I_BY[base][4]:.01,A[2]+' · ③ 탄약 제작대'];ITEMS.push(it);I_BY[id]=it}IC[id]=ammoBadge(base,A[1])}
for(const k in SHELL){const id='a12g_'+k,A=SHELL[k];AVAR[id]=['12g',k,A[3],A[4]];if(!I_BY[id]){const it=[id,'12게이지 '+A[0],'a',k=='bp'?'c':k=='slug'||k=='db'?'r':'u',.04,A[2]+' · ③ 탄약 제작대'];ITEMS.push(it);I_BY[id]=it}IC[id]=ammoBadge('a12g',A[1])}
/* recipes on the ammo bench, grouped by calibre */
for(const cal in ACAL){const n=ACAL[cal][1];for(const k in AKIND)FRC.ammob.push(['a'+cal+'_'+k,n,AKIND[k][5](n)])}
for(const k in SHELL)FRC.ammob.push(['a12g_'+k,6,SHELL[k][5]]);
const FCALS=[['parts','탄 부품'],['9mm','9mm'],['556','5.56'],['762','7.62'],['308','.308'],['12g','12게이지']];let FCAL='parts';
const calOf=id=>{const m=/^a(9mm|556|762|308|12g)(_|$)/.exec(id);return m?m[1]:'parts'};
/* ---------- which kind each calibre loads ---------- */
const aSel=()=>S.p.aSel=S.p.aSel||{},aMagT=()=>S.p.magT=S.p.magT||{};
function ammoLoad(id){const p=S.p,cal=calOf(id);if(cal=='parts')return;const sel=aSel();sel[cal]=id=='a'+cal?'':id;
 /* guns of that calibre with other rounds in the magazine: unload them back to the bag */
 for(const g in p.mag){const w=W_BY[g];if(!w||!w[4].ammo||w[4].ammo!=cal)continue;const n=p.mag[g]|0,t=aMagT()[g]||('a'+cal);if(n>0&&t!=(sel[cal]||'a'+cal)){p.inv[t]=(p.inv[t]|0)+n;p.mag[g]=0;delete aMagT()[g]}}
 msg('🔫 '+NM2(sel[cal]||'a'+cal)+' 장전으로 바꿨어요 · 재장전하면 들어가요');hud2()}
/* reloading draws from the chosen kind: swap it into the base slot for the call */
function aSwap(p,f){const id=actW(p),w=W_BY[id],cal=w&&w[4].ammo;const sel=cal&&p.aSel&&p.aSel[cal];if(!sel)return f();const base='a'+cal,b=p.inv[base]|0;p.inv[base]=p.inv[sel]|0;
 try{return f()}finally{const left=p.inv[base]|0;if(left)p.inv[sel]=left;else delete p.inv[sel];if(b)p.inv[base]=b;else delete p.inv[base]}}
{const _r=reload;reload=function(p,q){return aSwap(p,()=>_r(p,q))}}
{const _rt=reloadTick;reloadTick=function(p,dt){const id=p.rlw,m0=id?p.mag[id]|0:0;const r=aSwap(p,()=>_rt(p,dt));if(id&&(p.mag[id]|0)>m0){const w=W_BY[id],cal=w[4].ammo,sel=p.aSel&&p.aSel[cal];if(sel)aMagT()[id]=sel;else delete aMagT()[id]}return r}}
{const _h=hud2;hud2=function(){if(!S||!S.p)return _h();return aSwap(S.p,_h)}}
/* the loaded kind changes the gun's numbers */
const curKind=id=>{const t=S&&S.p&&S.p.magT&&S.p.magT[id];return t&&AVAR[t]?t:null};
{const _w=s3W;s3W=function(id){const w=_w(id),t=curKind(id);if(!w||!t||!S||!S.p||(S.p.mag[id]|0)<=0)return w;const C=AVAR[t][2],s=Object.assign({},w[4]);
  if(C.d)s.d*=C.d;if(C.nz)s.nz=Math.max(0,(s.nz||0)+C.nz);if(C.r)s.r*=C.r;if(C.pierce&&!s.pel)s.pierce=(s.pierce||1)+C.pierce;if(C.nopierce)delete s.pierce;
  if(s.pel){if(C.slug){s.d=s.d*s.pel*.75;delete s.pel;s.r*=1.4;s.pierce=2}if(C.pel){s.pel+=C.pel;s.pierce=2}}const w2=w.slice();w2[4]=s;return w2}}
/* on-hit effects while a gun shot is being resolved */
let SHOT=null;
{const _ga=gearAct;gearAct=function(){const p=S.p,id=actW(p);SHOT=GCLASS[id]?curKind(id):null;try{return _ga()}finally{SHOT=null}}}
{const _hz=hitZ;hitZ=function(q,dmg,dx,dy,n){const H=SHOT&&AVAR[SHOT][3];if(H){const tough=q.raider||q.elite||(typeof ELITEZ!='undefined'&&ELITEZ.includes(q.look));if(H.tough&&tough)dmg*=H.tough}
  _hz(q,dmg,dx,dy,n);if(H){if(H.burn)q.burn=Math.max(q.burn||0,H.burn);if(H.stun&&!q.raider&&!q.npc){q.stun=Math.max(q.stun||0,H.stun);if(SHOT.includes('shk'))fx.push({k:'zap',a:[q.x-6,q.y-20],b:[q.x+6,q.y-8],l:.15})}}}}
/* ---------- bag: choose what to load ---------- */
{const _ob=openBag;openBag=function(id){_ob(id);if(!S)return;const sel=BSEL,cal=sel&&calOf(sel);if(!sel||cal=='parts'||catOf(sel)!='a')return;const ba=$('bm').querySelector('.det .ba');if(!ba)return;
  const now=(S.p.aSel&&S.p.aSel[cal])||'a'+cal,on=now==sel;ba.insertAdjacentHTML('afterbegin','<button id="aLoad" '+(on?'disabled':'')+'>'+(on?'✅ 지금 장전 중':'🔫 이 탄으로 장전')+'</button>');$('aLoad').onclick=()=>{ammoLoad(sel);openBag(sel)}}}
/* ---------- forge window: calibre chips on the ammo bench ---------- */
{const _of=openForge;openForge=function(tab){_of(tab);if(FTAB!='ammob'||!fBuilt('ammob'))return;const b=$('bm'),rows=[...b.querySelectorAll('.mod')];
  for(const r of rows){const btn=r.querySelector('[data-fc]');if(!btn)continue;if(calOf(btn.dataset.fc)!=FCAL)r.style.display='none'}
  const pic=b.querySelector('.fpic');if(pic)pic.insertAdjacentHTML('afterend','<div class="flt">'+FCALS.map(([k,n])=>'<span class="chip'+(FCAL==k?' on':'')+'" data-fcal="'+k+'">'+n+'</span>').join('')+'</div>'+(FCAL=='parts'?'':'<div class="sub">'+(FCAL=='12g'?'12게이지 전용 산탄 5종':'같은 구경 6종')+' · 만든 뒤 가방에서 [🔫 이 탄으로 장전]</div>'));
  b.querySelectorAll('[data-fcal]').forEach(e=>e.onclick=()=>{FCAL=e.dataset.fcal;openForge()})}}
