/* PROJECT LEGACY — sample: one rune for every option.
   옵션의 룬 · 빛나는 옵션의 룬 · 찬란한 옵션의 룬 work on weapons, armour and special gear alike.
   Using one on a slot rolls a random option that fits that item; the option that was there simply disappears
   (nothing comes back to the bag) and the new one is applied. Locks + "roll every unlocked slot" work everywhere.
   Every option, on every kind of gear, comes in grades Ⅰ · Ⅱ · Ⅲ · Ⅳ.
   Loaded after armenh_next.js, light_next.js and mineplus_next.js. */
'use strict';
const ORN={orn1:['옵션의 룬','u',[62,28,8,2],'#7fd07f'],orn2:['빛나는 옵션의 룬','e',[28,45,22,5],'#5aa8ff'],orn3:['찬란한 옵션의 룬','l',[0,40,40,20],'#ffb84a']};
for(const id in ORN){const[n,rar,w,c]=ORN[id];if(!I_BY[id]){const it=[id,n,'r',rar,.1,'무기 · 방어구 · 특수 장비 · 철거 장비의 옵션 칸에 써요 · 그 장비에 맞는 옵션이 무작위로 붙고, 있던 옵션은 사라져요 · 등급 Ⅰ '+w[0]+'% · Ⅱ '+w[1]+'% · Ⅲ '+w[2]+'% · Ⅳ '+w[3]+'%'];ITEMS.push(it);I_BY[id]=it}
 IC[id]=()=>{R('#1d1714',5,3,14,18);R('#2e2a40',6,4,12,15);R('#1d1a2a',8,17,8,3);R(c,11,5,2,2);R(c,9,7,6,2);R(c,8,9,8,2);R(c,9,11,6,2);R(c,11,13,2,2);R('#fff',11,9,2,1);if(id!='orn1'){R('#fff',7,5,1,1);R('#fff',16,15,1,1)}if(id=='orn3'){R('#fff',16,5,1,1);R('#fff',7,15,1,1)}}}
/* every rune now sits in one bag tab */
for(const it of ITEMS)if(/^(rn_|ao_|so_|do_|aor|wor|orn)/.test(it[0]))it[2]='r';
/* old option runes from earlier samples turn into the unified ones */
function ornMigrate(){const p=S&&S.p;if(!p||p.ornMig)return;for(const[a,b2]of[['aor1','orn1'],['aor2','orn2'],['aor3','orn3'],['wor1','orn1'],['wor2','orn2'],['wor3','orn3']])if(p.inv[a]>0){p.inv[b2]=(p.inv[b2]|0)+p.inv[a];delete p.inv[a]}p.ornMig=1}
for(const k in AOPT){const id='ao_'+k+4,[e,n,parts,f]=AOPT[k];if(!I_BY[id]){const it=[id,n+' 방어구 룬 Ⅳ','r','l',.1,'방어구 옵션 · '+f(4)+' · 끼울 수 있는 부위: '+parts.map(q=>PN[q]).join(' · ')];ITEMS.push(it);I_BY[id]=it}}
/* ---------- special gear options ---------- */
const SOPT={
 amp:['🔦','광원 증폭',g=>'손전등 · 헤드램프 · 총기 전술조명 빛 거리 +'+10*g+'%','#ffe680'],
 watch:['👁','경계',g=>'밤에 좀비가 나를 알아채는 거리 -'+8*g+'%','#9ad0f0'],
 heat:['🌡','열 감지',g=>'벽 너머 '+(50*g)+' 안의 좀비가 붉게 보여요 (열화상 고글이면 범위 +'+50*g+')','#e05a30'],
 pure:['🫁','정화',g=>'가스 · 산성 · 광산 독가스 피해 -'+15*g+'%','#9ad04a'],
 focus:['🎯','집중',g=>'밤이나 지하에서 총기 피해 +'+3*g+'%','#5aa8ff'],
 seek:['🧭','탐색가',g=>'광산에서 광석을 캘 때 '+8*g+'% 확률로 하나 더','#e0b03a']};
for(const k in SOPT)for(let g2=1;g2<=4;g2++){const id='so_'+k+g2;if(!I_BY[id]){const it=[id,SOPT[k][1]+' 옵션 '+ROMN[g2],'r','r',.1,'특수 장비 옵션 · '+SOPT[k][2](g2)];ITEMS.push(it);I_BY[id]=it}}
const sSlots=id=>SPX[id]?Math.ceil(SPX[id][0]/2):0;/* T1-2: 1 · T3-4: 2 · T5: 3 */
const SE=()=>{const pg=PGo();pg.sopt=pg.sopt||{};pg.olock=pg.olock||{};return pg};
function sopt(k){const p=S&&S.p;if(!p||!p.eq||!p.eq.spec||!has(p,p.eq.spec))return 0;let g2=0;for(const r of((S.pg&&S.pg.sopt)||{})[p.eq.spec]||[])if(r&&r.slice(3,-1)==k)g2+=+r.slice(-1);return g2}
{const _b=myBeams;myBeams=function(){const B=_b(),a=sopt('amp');if(a)for(const b of B)b.r*=1+.1*a;return B}}
{const _dm=detMul;detMul=function(){const m=_dm(),w=sopt('watch');return w&&NIGHT?m*Math.max(.3,1-.08*w):m}}
{const _h=hurtP;hurtP=function(n,why){const u=sopt('pure');if(u&&why&&/부머/.test(why))n*=Math.max(0,1-.15*u);return _h(n,why)}}
{const _gu=gearUpd;gearUpd=function(dt){const p=S&&S.p,h0=p&&p.hp;_gu(dt);if(!p||!run)return;ornMigrate();const u=sopt('pure');if(!u||!(p.hp<h0))return;let a=0;
  if(typeof S4!='undefined')for(const q of S4.pud||[])if(Math.hypot(p.x-q.x,p.y-q.y)<q.r)a+=10*dt;for(const q of S.mgas||[])if(Math.hypot(p.x-q.x,p.y-q.y)<80&&!spec('gasmask'))a+=6*dt;if(a)p.hp=Math.min(h0,p.hp+a*Math.min(.9,.15*u))}}
{const _hz=hitZ;hitZ=function(q,dmg,dx,dy,n){const f=sopt('focus');if(f&&S&&(NIGHT||DUN)&&GCLASS[actW(S.p)]&&!q.npc)dmg*=1+.03*f;return _hz(q,dmg,dx,dy,n)}}
{const _ia=invAdd;invAdd=function(p,id,n){const s=sopt('seek');if(s&&MDIG&&ORE_BY[id]&&n>0&&Math.random()<.08*s){n++;S.seekHit=1}return _ia(p,id,n)}}
OVL.push((g2,sx,sy,k)=>{const h=sopt('heat');if(!h)return;const p=S.p,R2=(spec('thermal')?300:0)+50*h;for(const z of Z){const d=Math.hypot(z.x-p.x,z.y-p.y);if(d>R2||z.npc)continue;if(los(p.x,p.y-12,z.x,z.y-12))continue;const X=sx(z.x),Y=sy(z.y);g2.fillStyle='rgba(255,90,50,.5)';g2.beginPath();g2.ellipse(X,Y-14*k,7*k,14*k,0,0,Math.PI*2);g2.fill()}});
/* ---------- one roll for every kind of gear ---------- */
const OK0=1;const OK={w:{nm:'무기',list:()=>ownedW().filter(i=>!DT[i]),slots:id=>ENH.slots(enhLv(id)),how:'+0 1칸 · +5 2칸 · +10 3칸 (무기 강화)',arr:id=>{const pg=EP();return pg.ench[id]=pg.ench[id]||[]},pool:id=>RK.slice(),mk:(k,g2)=>'rn_'+k+g2,max:4,info:r=>{const t=r.slice(3,-1);return[RUNES[t][0],RUNES[t][1],RUNES[t][3],typeof WTXT!='undefined'&&WTXT[t]?WTXT[t](+r.slice(-1)):RUNES[t][2]]}},
 a:{nm:'방어구',list:()=>Object.keys(ARMX).filter(id=>has(S.p,id)),slots:id=>aSlots(aLv(id)),how:'+5 1칸 · +10 2칸 · +15 3칸 (방어구 강화)',arr:id=>{const pg=AE();return pg.aopt[id]=pg.aopt[id]||[]},pool:id=>Object.keys(AOPT).filter(k=>AOPT[k][2].includes(ARMX[id][0])),mk:(k,g2)=>'ao_'+k+g2,max:4,info:r=>{const o=AOPT[r.slice(3,-1)];return[o[0],o[1],o[4],o[3](+r.slice(-1))]}},
 s:{nm:'특수 장비',list:()=>Object.keys(SPX).filter(id=>has(S.p,id)),slots:sSlots,how:'T1~T2 1칸 · T3~T4 2칸 · T5 3칸 (강화 없음)',arr:id=>{const pg=SE();return pg.sopt[id]=pg.sopt[id]||[]},pool:id=>Object.keys(SOPT),mk:(k,g2)=>'so_'+k+g2,max:4,info:r=>{const o=SOPT[r.slice(3,-1)];return[o[0],o[1],o[3],o[2](+r.slice(-1))]}}};
const oLock=(kd,id)=>{const pg=SE();return pg.olock[kd+':'+id]=pg.olock[kd+':'+id]||[]};
const pickG=w=>{let r=Math.random()*100;for(let i=0;i<w.length;i++){r-=w[i];if(r<0)return i+1}return w.length};
let OKD='w',OSEL=null,ORS='orn1',ORRES=null,OLAST=null;
function oRoll(kd,id,slots){const p=S.p,K=OK[kd],sl=K.slots(id),a=K.arr(id),lk=oLock(kd,id),locked=[...Array(sl).keys()].filter(i=>lk[i]&&a[i]&&!slots.includes(i)),need=slots.length>1?locked.length:0;
 if(!(p.inv[ORS]>0))return msg('🔮 '+ORN[ORS][0]+'이(가) 없어요');if((p.inv.enhg|0)<need)return msg('🔒 잠근 칸 '+need+'개 = 보호 부적 '+need+'개가 필요해요');
 invTake(p,ORS,1);if(need)invTake(p,'enhg',need);const used=new Set([...Array(sl).keys()].filter(i=>!slots.includes(i)&&a[i]).map(i=>a[i].slice(3,-1))),old=slots.map(i=>a[i]).filter(Boolean),pool=K.pool(id);
 for(const i of slots){const L=pool.filter(k=>!used.has(k));if(!L.length)break;const k=L[Math.random()*L.length|0];used.add(k);a[i]=K.mk(k,Math.min(K.max,pickG(ORN[ORS][2])))}for(let i=0;i<sl;i++)if(a[i]===undefined)a[i]=null;
 OLAST={kd,id,slots};ORRES=['ok','🔮 '+slots.map(i=>{const f=K.info(a[i]);return f[0]+' '+f[1]+' '+ROM[+a[i].slice(-1)]}).join(' · ')+' 적용'+(old.length?' · 있던 '+old.map(r=>K.info(r)[1]).join(' · ')+'은(는) 사라졌어요':'')+(need?' · 🔒 '+need+'칸 유지 (부적 '+need+')':'')];
 try{s3dirty()}catch(e){}openRunes();hud2()}
function openRunes(kd,id){ornMigrate();if(kd)OKD=kd;if(id)OSEL=id;const b=$('bm'),p=S.p,K=OK[OKD],L=K.list();if(!L.includes(OSEL))OSEL=L[0]||null;b.dataset.m='runes';PAUSE=true;
 let h='<div class="sh"><h2>🔮 룬 · 옵션</h2><div class="wt">룬 하나로 무기 · 방어구 · 특수 장비 모두</div><button onclick="closeBase();PAUSE=false">✕</button></div>';
 h+='<div class="flt">'+Object.keys(OK).map(k=>'<span class="chip'+(OKD==k?' on':'')+'" data-okd="'+k+'">'+OK[k].nm+'</span>').join('')+'</div>';
 h+='<div class="aeL">'+(L.map(i=>{const n=(K.arr(i)||[]).filter(Boolean).length;return'<div class="aeI'+(i==OSEL?' on':'')+'" data-osel="'+i+'"><img src="'+icon(i)+'"><b>'+(n?'◆'.repeat(n):'')+'</b><small>'+NM2(i).slice(0,6)+'</small></div>'}).join('')||'<small class="mut">가진 '+K.nm+'이(가) 없어요</small>')+'</div>';
 h+='<div class="aorP">'+Object.keys(ORN).map(k=>'<span class="chip'+(ORS==k?' on':'')+'" data-orn="'+k+'"><img src="'+icon(k)+'">'+ORN[k][0]+' ×'+(p.inv[k]|0)+'<small>Ⅰ'+ORN[k][2][0]+' Ⅱ'+ORN[k][2][1]+' Ⅲ'+ORN[k][2][2]+' Ⅳ'+ORN[k][2][3]+'%</small></span>').join('')+'</div>';
 if(OSEL){const sl=K.slots(OSEL),a=K.arr(OSEL),lk=oLock(OKD,OSEL);
  h+='<div class="aeC"><div class="aeT"><img src="'+icon(OSEL)+'"><div><b>'+NM2(OSEL)+'</b><small>옵션 칸 '+sl+'/3 · '+K.how+'</small></div></div>';if(ORRES)h+='<div class="aeRes '+ORRES[0]+'">'+ORRES[1]+'</div>';
  h+='<div class="aeS">'+[0,1,2].map(i=>{if(i>=sl)return'<div class="aeSl lk">🔒 아직 잠긴 칸</div>';const r=a[i],f=r&&K.info(r),fresh=OLAST&&OLAST.kd==OKD&&OLAST.id==OSEL&&OLAST.slots.includes(i);
   return'<div class="aeSl'+(lk[i]&&r?' locked':'')+(fresh?' rolled'+Math.min(3,+r.slice(-1)):'')+'">'+(r?'<span class="lkB'+(lk[i]?' on':'')+'" data-olk="'+i+'">'+(lk[i]?'🔒':'🔓')+'</span><b style="color:'+f[2]+'">'+f[0]+' '+f[1]+' '+ROM[+r.slice(-1)]+'</b><small>'+f[3]+'</small>':'<small class="mut">빈 칸</small>')+
    '<button class="aorB" data-oroll="'+i+'" '+(lk[i]&&r?'disabled':(p.inv[ORS]|0)>0?'':'disabled')+'>'+(lk[i]&&r?'🔒 잠김':'🔮 '+(r?'다시 뽑기':'부여'))+'</button></div>'}).join('')+'</div>';
  if(sl>=2){const nl=[...Array(sl).keys()].filter(i=>lk[i]&&a[i]).length;h+='<button id="oAll" class="allB">🔮 잠그지 않은 칸 모두 다시 뽑기 · '+ORN[ORS][0]+' 1'+(nl?' + 보호 부적 '+nl+' ('+(p.inv.enhg|0)+')':'')+'</button>'}
  h+='<small class="mut">다시 뽑으면 있던 옵션은 사라지고 새 옵션이 바로 붙어요 (가방으로 돌아오지 않아요)</small></div>'}
 b.innerHTML=h;b.style.display='block';
 b.querySelectorAll('[data-okd]').forEach(e=>e.onclick=()=>{OKD=e.dataset.okd;OSEL=null;ORRES=null;OLAST=null;openRunes()});b.querySelectorAll('[data-osel]').forEach(e=>e.onclick=()=>{OSEL=e.dataset.osel;ORRES=null;OLAST=null;openRunes()});
 b.querySelectorAll('[data-orn]').forEach(e=>e.onclick=()=>{ORS=e.dataset.orn;openRunes()});b.querySelectorAll('[data-oroll]').forEach(e=>e.onclick=()=>oRoll(OKD,OSEL,[+e.dataset.oroll]));
 b.querySelectorAll('[data-olk]').forEach(e=>e.onclick=ev=>{ev.stopPropagation();const i=+e.dataset.olk,lk=oLock(OKD,OSEL);lk[i]=!lk[i];openRunes()});
 const all=$('oAll');if(all)all.onclick=()=>{const sl=K.slots(OSEL),a=K.arr(OSEL),lk=oLock(OKD,OSEL),free=[...Array(sl).keys()].filter(i=>!(lk[i]&&a[i]));if(!free.length)return msg('🔒 모든 칸이 잠겨 있어요');oRoll(OKD,OSEL,free)}}
/* ways in: the enhance windows, the bag (rune detail), the base menu */
{const _oa=openAEnh;openAEnh=function(sel){_oa(sel);const h4=[...$('bm').querySelectorAll('h4')].find(e=>/옵션 칸/.test(e.textContent));if(h4)h4.insertAdjacentHTML('afterend','<button class="allB" onclick="openRunes(\'a\',AESEL)">🔮 룬으로 옵션 바꾸기</button>')}}
{const _oe=openEnh;openEnh=function(sel){_oe(sel);const h4=[...$('bm').querySelectorAll('h4')].find(e=>/룬 칸/.test(e.textContent));if(h4)h4.insertAdjacentHTML('afterend','<button class="allB" onclick="openRunes(\'w\',ENSEL)">🔮 룬으로 옵션 바꾸기</button>')}}
{const _ob=openBag;openBag=function(id){_ob(id);const f=$('bm').querySelector('.flt');if(f){f.querySelectorAll('[data-f="o"]').forEach(e=>e.remove());const r=f.querySelector('[data-f="r"]');if(r)r.textContent='룬'}
  if(BSEL&&ORN[BSEL]){const ba=$('bm').querySelector('.det .ba');if(ba)ba.insertAdjacentHTML('afterbegin','<button onclick="openRunes()">🔮 옵션 바꾸기</button>')}
  const it=BSEL&&SPX[BSEL];if(it){const ba=$('bm').querySelector('.det .ba');if(ba)ba.insertAdjacentHTML('afterbegin','<button onclick="openRunes(\'s\',\''+BSEL+'\')">🔮 옵션</button>')}}}
{const _ob=openBase;openBase=function(){_ob.apply(this,arguments);if(!S||$('ornOpen'))return;const h=$('bm').querySelector('h2');if(h)h.insertAdjacentHTML('afterend','<button id="ornOpen" style="float:right;padding:4px 10px;font-size:12px;width:auto;margin-left:4px" onclick="openRunes()">🔮 룬 · 옵션</button>')}}
document.head.insertAdjacentHTML('beforeend',`<style>#bm .aorP{display:flex;gap:5px;flex-wrap:wrap;margin:6px 0}#bm .aorP .chip{display:flex;align-items:center;gap:4px;font-size:11px}#bm .aorP .chip img{width:18px;height:18px;image-rendering:pixelated}#bm .aorP small{color:var(--mut);font-size:9.5px}
#bm .aorB{display:block;width:100%;margin-top:4px;padding:3px;font-size:11px}#bm .allB{display:block;width:100%;margin:6px 0;padding:6px;font-size:12px;background:#2a2410;border-color:#ffd36a66}
#bm .lkB{float:right;cursor:pointer;font-size:13px;padding:0 3px;border-radius:6px;opacity:.6}#bm .lkB.on{opacity:1;background:#3a3010}#bm .aeSl.locked{border-color:#ffd36a;border-style:solid}
@keyframes ornF{0%{box-shadow:0 0 0 0 var(--rc)}40%{box-shadow:0 0 14px 4px var(--rc)}100%{box-shadow:0 0 0 0 var(--rc)}}#bm .aeSl.rolled1{--rc:#7fd07f;animation:ornF 1s}#bm .aeSl.rolled2{--rc:#5aa8ff;animation:ornF 1s 2}#bm .aeSl.rolled3{--rc:#ffb84a;animation:ornF 1s 3;border-color:#ffb84a}</style>`);
/* ---------- demolition tools: options that make demolition faster ---------- */
const DOPT={
 speed:['⚡','빠른 손',g=>'휘두르기 · 자동 철거 간격 -'+12*g+'%','#ffe45a'],
 power:['🔨','파괴력',g=>'한 번에 주는 철거 피해 +'+25*g+'%','#ff8a3a'],
 reach:['📏','긴 손잡이',g=>'닿는 거리 +'+10*g+'%','#9ad0f0'],
 chain:['🧱','연쇄 파괴',g=>g>=4?'한 번에 부수는 가구 · 벽 +3':g>=3?'한 번에 부수는 가구 · 벽 +2':g>=2?'한 번에 부수는 가구 · 벽 +1':'25% 확률로 가구 · 벽 하나 더','#c9a46a'],
 salv:['♻','재활용',g=>'부순 것에서 나오는 재료 +'+15*g+'%','#7fd07f'],
 hush:['🤫','저소음',g=>'철거 소음 -'+18*g+'% (좀비가 덜 몰려와요)','#9aa0a6']};
for(const k in DOPT)for(let g2=1;g2<=4;g2++){const id='do_'+k+g2;if(!I_BY[id]){const it=[id,DOPT[k][1]+' 옵션 '+ROMN[g2],'r','r',.1,'철거 장비 옵션 · '+DOPT[k][2](g2)];ITEMS.push(it);I_BY[id]=it}}
const dSlots=id=>({dt1:1,dt1f:1,dt2:2,dt3:3,dt4:4,dt5:4})[id]||0;/* tool level = option slots */
OK.d={nm:'철거 장비',list:()=>Object.keys(DT).filter(id=>has(S.p,id)),slots:dSlots,how:'Lv1 도구 1칸 · Lv2 2칸 · Lv3 3칸 · Lv4 · Lv5 4칸',arr:id=>{const pg=SE();pg.dopt=pg.dopt||{};return pg.dopt[id]=pg.dopt[id]||[]},pool:id=>Object.keys(DOPT).filter(k=>!(id=='dt1f'&&k=='chain')),mk:(k,g2)=>'do_'+k+g2,max:4,info:r=>{const o=DOPT[r.slice(3,-1)];return[o[0],o[1],o[3],o[2](+r.slice(-1))]}};
function dopt(k,id){const p=S&&S.p;id=id||(p&&actW(p));if(!id||!DT[id])return 0;let g2=0;for(const r of(((S.pg&&S.pg.dopt)||{})[id])||[])if(r&&r.slice(3,-1)==k)g2+=+r.slice(-1);return g2}
/* the tool numbers read the options live (curTool copies them) */
function dtOptBind(id){const T=DT[id];if(!T||T._ob)return;Object.defineProperty(T,'_ob',{value:1});const base={rng:T.rng,dmg:T.dmg,n:T.n,auto:T.auto};
 Object.defineProperty(T,'rng',{get:()=>base.rng*(1+.1*dopt('reach',id)),enumerable:true,configurable:true});
 Object.defineProperty(T,'dmg',{get:()=>base.dmg*(1+.25*dopt('power',id)),enumerable:true,configurable:true});
 Object.defineProperty(T,'n',{get:()=>{const c=dopt('chain',id);return base.n+(c>=4?3:c>=3?2:c>=2?1:c>=1&&Math.random()<.25?1:0)},enumerable:true,configurable:true});
 if(base.auto)Object.defineProperty(T,'auto',{get:()=>base.auto*Math.max(.3,1-.12*dopt('speed',id)),enumerable:true,configurable:true});
 const W=W_BY[id]&&W_BY[id][4];if(W){const cd=W.cd;Object.defineProperty(W,'cd',{get:()=>cd*Math.max(.3,1-.12*dopt('speed',id)),enumerable:true,configurable:true})}}
for(const id in DT)dtOptBind(id);
let DHIT=false;
{const _dh=dHitWith;dHitWith=function(tool,z){DHIT=true;try{return _dh(tool,z)}finally{DHIT=false}}}
{const _df=dFloor;dFloor=function(){DHIT=true;try{return _df.apply(this,arguments)}finally{DHIT=false}}}
{const _n=noise;noise=function(x,y,lv){if(DHIT){const h=dopt('hush');if(h)lv=Math.max(0,lv*(1-.18*h))}return _n(x,y,lv)}}
{const _ia=invAdd;invAdd=function(p,id,n){if(DHIT&&n>0&&!W_BY[id]){const s=dopt('salv');if(s){const x=n*.15*s;n+=Math.floor(x)+(Math.random()<x%1?1:0)}}return _ia(p,id,n)}}
{const _ob=openBag;openBag=function(id){_ob(id);if(BSEL&&DT[BSEL]){const ba=$('bm').querySelector('.det .ba');if(ba&&!ba.querySelector('.dOpt'))ba.insertAdjacentHTML('afterbegin','<button class="dOpt" onclick="openRunes(\'d\',\''+BSEL+'\')">🔮 옵션</button>')}}}
/* weapon runes in plain numbers per grade */
const WTXT={fire:g=>'맞으면 불 · 초당 '+8*g+' 피해 (2초)',ice:g=>'맞으면 2초 동안 '+(15+10*g)+'% 느려져요',shock:g=>(10+5*g)+'% 확률로 주변 2마리에 번개 (피해 40%)',leech:g=>'준 피해의 '+2*g+'% 만큼 체력 회복',hunt:g=>'구역 좀비에게 피해 +'+6*g+'% × 구역 (4구역부터 +'+24*g+'%)',exec:g=>'체력 30% 이하 좀비에게 피해 +'+25*g+'%'};
/* the option table (Ⅰ ~ Ⅳ for every option of the tab) */
function optTable(kd){const R3=[1,2,3,4],row=(ic,nm,f,c)=>'<tr><td style="white-space:normal"><b style="color:'+c+'">'+ic+' '+nm+'</b></td>'+R3.map(g2=>'<td style="white-space:normal">'+f(g2)+'</td>').join('')+'</tr>';let rows='';
 if(kd=='w')for(const t of RK){const r=RUNES[t];rows+=row(r[0],r[1],g2=>WTXT[t]?WTXT[t](g2):r[2],r[3])}
 if(kd=='a')for(const k in AOPT){const o=AOPT[k];rows+=row(o[0],o[1]+' <small>('+o[2].map(q=>PN[q]).join('·')+')</small>',o[3],o[4])}
 if(kd=='s')for(const k in SOPT){const o=SOPT[k];rows+=row(o[0],o[1],o[2],o[3])}
 if(kd=='d')for(const k in DOPT){const o=DOPT[k];rows+=row(o[0],o[1],o[2],o[3])}
 return'<div style="overflow-x:auto"><table class="cmpT"><tr><th>'+OK[kd].nm+' 옵션</th><th>Ⅰ등급</th><th>Ⅱ등급</th><th>Ⅲ등급</th><th>Ⅳ등급</th></tr>'+rows+'</table></div>'}
let OTAB=false;
{const _or=openRunes;openRunes=function(kd,id){_or(kd,id);const b=$('bm'),f=b.querySelector('.flt');if(!f)return;f.insertAdjacentHTML('beforeend','<span class="chip'+(OTAB?' on':'')+'" id="oTab">📋 옵션 표</span>');$('oTab').onclick=()=>{OTAB=!OTAB;openRunes()};
  if(OTAB){const L=b.querySelector('.aeL');if(L)L.insertAdjacentHTML('beforebegin',optTable(OKD))}}}
