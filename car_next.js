/* PROJECT LEGACY — vehicles.
   Five kinds: civilian · police · hospital · military · lab — each with its own pixel art and one special.
   You start with no car. The only way to get one: a dropped car key, found while searching buildings of that kind.
   Picking up a key parks that car nearby (marked on the map) · open it with the key · it is yours.
   Garage at the base parking spot: switch cars, repair, modify (armour · engine · economy · ram bar · searchlight).
   Loaded after ally_next.js. Hooks in the engine: vSpd · vTick · vDraw (guarded with typeof). */
'use strict';
const VEH={
 civ:{nm:'민간 승용차',kn:'민간',ic:'🚗',spd:300,hp:300,ram:90,fuel:.15,nz:3,L:54,Wd:26,sp:null,ds:'평범한 승용차 · 무난한 속도와 연비'},
 pol:{nm:'경찰 순찰차',kn:'경찰',ic:'🚓',spd:345,hp:380,ram:110,fuel:.18,nz:3,L:56,Wd:26,sp:'siren',ds:'가장 빨라요 · 사이렌을 켜 두면 차로 좀비가 몰려와요 (세워 두고 미끼로)'},
 med:{nm:'구급차',kn:'병원',ic:'🚑',spd:280,hp:460,ram:90,fuel:.18,nz:3,L:62,Wd:30,sp:'heal',ds:'타고 있는 동안 체력 회복 · 출혈이 멈춰요'},
 mil:{nm:'군용 장갑차',kn:'군',ic:'🪖',spd:250,hp:900,ram:170,fuel:.26,nz:4,L:64,Wd:32,sp:'gun',ds:'아주 튼튼해요 · 지붕 기관총이 가방의 5.56 탄으로 자동 사격'},
 lab:{nm:'연구소 전기 밴',kn:'연구소',ic:'🔬',spd:320,hp:340,ram:80,fuel:0,nz:1,L:58,Wd:28,sp:'ev',ds:'아주 조용해요 · 연료 대신 배터리 (전자부품 1개 = 25%)'}};
const VORD=['civ','pol','med','mil','lab'];
/* where each key turns up when you search */
const VKIN={houses:'civ',apt:'civ',garage:'civ',mart:'civ',mall:'civ',police:'pol',prison:'pol',hosp:'med',hospR:'med',clinic:'med',pharm:'med',mil:'mil',milR:'mil',rbase:'mil',lab:'lab'};
const VKCH={garage:.10,police:.06,prison:.05,hosp:.06,hospR:.06,clinic:.04,pharm:.03,mil:.07,milR:.07,rbase:.06,lab:.07};
const VMOD={arm:['🛡','장갑판',3,'체력 +40% · 받는 피해 -15%',l=>({scrap:10*l,steel:2*l})],
 eng:['⚙','엔진 튜닝',3,'속도 +7%',l=>({scrap:6*l,elec:2*l})],
 eco:['⛽','연비 개조',3,'연료 · 배터리 사용 -20%',l=>({scrap:5*l,elec:3*l})],
 ram:['🔺','충각',1,'들이받는 피해 +60% · 들이받아도 차가 안 상해요',()=>({scrap:20,steel:4})],
 lamp:['💡','서치라이트',1,'밤에 차 주변이 훨씬 넓게 밝아요',()=>({elec:4,scrap:4})]};
const VKC={civ:['#3a6ea5','#9cc4ec'],pol:['#1c2a4a','#e8ecf0'],med:['#c8302a','#f2f2ee'],mil:['#5b6b3a','#9aab6a'],lab:['#2aa198','#e6f0f0']};
/* ---------- items: the keys ---------- */
for(const t of VORD){const id='vk_'+t;if(I_BY[id])continue;const it=[id,VEH[t].kn+' 차 열쇠','m',t=='mil'||t=='lab'?'e':t=='civ'?'u':'r',.05,VEH[t].nm+' 열쇠 · 주우면 근처에 그 차가 서 있어요 (지도에 🔑 표시) · 차 앞에서 [상호작용]으로 열어요'];ITEMS.push(it);I_BY[id]=it;
 const[c1,c2]=VKC[t];IC[id]=()=>{R('#1d1714',3,6,9,9);R('#c9a42a',4,7,7,7);R('#1d1714',6,9,3,3);R('#c9a42a',11,9,9,3);R('#e0bc3a',11,9,9,1);R('#c9a42a',16,12,2,3);R('#c9a42a',19,12,2,4);R(c1,2,15,8,7);R(c2,3,16,6,2);R('#1d1714',2,15,8,1)}}
/* ---------- helpers ---------- */
const VC=()=>S&&S.car;
const vOwned=c=>!!(c&&c.t&&!c.none&&!c.dz);
const vMods=c=>{c.mods=c.mods||{};return c.mods};
const vMaxHp=c=>Math.round(VEH[c.t].hp*(1+.4*(vMods(c).arm|0)));
const VGAR=()=>{S.inf.vgar=S.inf.vgar||[];return S.inf.vgar};
const VWILD=()=>{S.inf.vwild=S.inf.vwild||[];return S.inf.vwild};
function vNew(t){const c={t,hp:VEH[t].hp,mods:{},vid:(S.inf.vN=(S.inf.vN||0)+1),h:true,dir:'r'};if(t=='lab')c.bat=60;return c}
function vNone(){return{x:-1e6,y:-1e6,h:true,none:1}}
/* ---------- start with no car · old saves keep theirs as a civilian car ---------- */
{const _st=start;start=function(d,load){const r=_st.apply(this,arguments);try{if(S&&S.inf){const c=S.car;
  if(!load){S.car=vNone();S.inf.vgar=[];S.inf.vwild=[]}
  else if(c&&!c.t&&!c.none&&!c.dz){Object.assign(c,{t:'civ',hp:VEH.civ.hp,mods:{},vid:1,dir:'r'})}
  else if(c&&c.none){c.x=-1e6;c.y=-1e6}}}catch(e){}return r}}
/* ---------- the engine hooks ---------- */
function vSpd(){const c=VC();if(!vOwned(c))return 300;if(c.broken)return 0;return VEH[c.t].spd*(1+.07*(vMods(c).eng|0))}
let vNzT=0;
function vTick(dt,vx,vy){const c=VC(),p=S.p,V=VEH[c.t],M=vMods(c);c.dir=VDIR8[((Math.round(Math.atan2(vy,vx)/(Math.PI/4))%8)+8)%8];
 const use=dt*(1-.2*(M.eco|0));
 if(c.t=='lab'){c.bat=Math.max(0,(c.bat||0)-use*.7);if(c.bat<=0){S.dr=0;p.y+=24;msg('🔋 배터리가 다 됐어요 · 전자부품으로 충전하세요');return}}
 else{p.inv.fuel=Math.max(0,(p.inv.fuel||0)-use*V.fuel);if(p.inv.fuel<=0){delete p.inv.fuel;S.dr=0;p.y+=24;msg('⛽ 연료가 다 떨어졌어요');return}}
 const ram=V.ram*((M.ram|0)?1.6:1);for(const z of Z){if(z.npc||z.hp<=0)continue;if(Math.hypot(z.x-c.x,z.y-c.y)<V.L*.55){if((z._vr||0)>performance.now())continue;z._vr=performance.now()+400;z.hp-=ram;blood(z.x,z.y,vx,vy,5);if(!(M.ram|0))vHurt(c,4)}}
 vNzT-=dt;if(vNzT<=0&&typeof noise=='function'){vNzT=.5;if(V.nz)noise(c.x,c.y,V.nz)}}
function vHurt(c,n){if(!vOwned(c)||c.broken)return;c.hp=Math.max(0,c.hp-n);if(c.hp<=0){c.broken=1;if(S.dr){S.dr=0;S.p.y+=24}c.siren=0;msg('💥 '+VEH[c.t].nm+'이(가) 멈췄어요 · 고철로 수리하세요');try{sfx((A,t)=>tone(A,t,{w:'sawtooth',f0:160,f1:40,d:.5,v:.08}))}catch(e){}}}
/* every frame: zombies claw the car · the specials */
let vGunT=0,vSirT=0;
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);const c=VC();if(!run||PAUSE||!vOwned(c))return;const p=S.p,V=VEH[c.t],M=vMods(c);
  if(S.dr){for(const z of Z){if(z.npc||z.hp<=0||z.raider&&!z.melee)continue;if(Math.hypot(z.x-c.x,z.y-c.y)<V.L*.5){z.cd=(z.cd||0)-dt;if(z.cd<=0){z.cd=1;vHurt(c,(z.dmg!=null?z.dmg:7)*.6*(1-.15*(M.arm|0)))}}}
   if(c.t=='med'){p.hp=Math.min(MHP(p),p.hp+3*dt);p.bleed=0}
   if(c.t=='mil'&&c.gun!==false){vGunT-=dt;if(vGunT<=0){let best=null,bd=240;for(const z of Z){if(z.npc||z.hp<=0)continue;const d=Math.hypot(z.x-c.x,z.y-c.y);if(d<bd){bd=d;best=z}}
     if(best){if((p.inv.a556|0)>0){invTake(p,'a556',1);vGunT=.16;const d=bd||1;hitZ(best,28,(best.x-c.x)/d,(best.y-c.y)/d,1);fx.push({k:'tr',a:[c.x,c.y-14],b:[best.x,best.y-14],l:.06});if(typeof noise=='function'&&Math.random()<.3)noise(c.x,c.y,4);try{sfx((A,t)=>tone(A,t,{w:'square',f0:300,f1:120,d:.06,v:.04}))}catch(e){}}else{vGunT=2;if(!c._noAm){c._noAm=1;msg('🪖 기관총: 가방에 5.56 탄이 없어요')}}}else vGunT=.2;if((p.inv.a556|0)>0)c._noAm=0}}}
  if(c.siren){vSirT-=dt;if(vSirT<=0){vSirT=1;if(typeof noise=='function')noise(c.x,c.y,5);try{sfx((A,t)=>{tone(A,t,{w:'square',f0:900,f1:600,d:.35,v:.03});tone(A,t+.4,{w:'square',f0:600,f1:900,d:.35,v:.03})})}catch(e){}}}}}
/* ---------- boarding · repairs · battery ---------- */
function vBoard(){const c=VC(),p=S.p;if(!vOwned(c))return;if(c.broken)return msg('💥 고장 · 먼저 수리하세요 (고철)');
 if(c.t=='lab'){if((c.bat||0)<=0)return msg('🔋 배터리가 비었어요 · 전자부품으로 충전하세요')}else if(!((p.inv.fuel||0)>0))return msg('⛽ 연료가 필요해요');
 S.dr=1;p.x=c.x;p.y=c.y;msg(VEH[c.t].ic+' '+VEH[c.t].nm+' 운전 · '+(c.t=='lab'?'배터리 '+Math.round(c.bat)+'%':'연료 '+(+(p.inv.fuel||0).toFixed(1)))+' · 내리기 = [상호작용]')}
const vFixCost=c=>Math.ceil((vMaxHp(c)-c.hp)/vMaxHp(c)*20);
function vRepair(){const c=VC(),p=S.p,n=vFixCost(c);if(n<=0)return;const have=p.inv.scrap|0;if(!have)return msg('🔧 고철이 필요해요 ('+n+'개)');const u=Math.min(have,n);invTake(p,'scrap',u);c.hp=Math.min(vMaxHp(c),c.hp+Math.ceil(vMaxHp(c)*u/20));if(c.hp>=vMaxHp(c)*.25)c.broken=0;msg('🔧 고철 '+u+'개로 수리 · 체력 '+Math.round(c.hp)+'/'+vMaxHp(c)+(c.broken?' · 아직 움직이지 않아요':''))}
function vCharge(){const c=VC(),p=S.p;if(!(p.inv.elec>0))return msg('🔋 전자부품이 필요해요');invTake(p,'elec',1);c.bat=Math.min(100,(c.bat||0)+25);msg('🔋 배터리 '+Math.round(c.bat)+'%')}
function vToggle(){const c=VC();if(!vOwned(c))return;if(c.t=='pol'){c.siren=!c.siren;vSirT=0;msg(c.siren?'🚨 사이렌 켬 · 좀비가 이 차로 몰려와요 · 세워 두고 내리면 미끼가 돼요':'사이렌 끔')}else if(c.t=='mil'){c.gun=c.gun===false;msg(c.gun?'🪖 지붕 기관총 켬 (5.56 탄 사용)':'지붕 기관총 끔 (탄 아끼기)')}vHud(true)}
/* ---------- the dropped key → the car is parked nearby ---------- */
/* where the found car stands: outside every building (roof), clear of walls and things, never in the base · nearest such spot, else the road beside the block */
const vIndoor=(X,Y,m)=>W0.roofs.some(r=>X>r.x-m&&X<r.x+r.w+m&&Y>r.y-m&&Y<r.y+r.h+m);
function vSpotOk(X,Y){return!vIndoor(X,Y,34)&&!blocker(X,Y,34)&&!(typeof inBase=='function'&&inBase(X,Y))&&X>40&&Y>40&&X<WW-40&&Y<WH-40}
function vSpot(x,y){for(let i=0;i<260;i++){const a=i*2.39996,r=30+i*4,X=x+Math.cos(a)*r,Y=y+Math.sin(a)*r;if(vSpotOk(X,Y))return[X,Y]}
 const[gx,gy]=gOf(x,y),[ox,oy]=bo(gx-OGX,gy-OGY),Y=oy+BH+RD/2;for(let d=0;d<BW;d+=24)for(const X of[x+d,x-d])if(vSpotOk(X,Y))return[X,Y];return[x,Y]}
function vWildAdd(t){const p=S.p;if(VWILD().some(w=>w.t==t))return;const[x,y]=vSpot(p.x,p.y),[gx,gy]=gOf(x,y),[ox,oy]=bo(gx-OGX,gy-OGY);const w={t,gk:gx+','+gy,rx:Math.round(x-ox),ry:Math.round(y-oy),dir:Math.random()<.5?'r':'l',vid:Date.now()%1e6};VWILD().push(w);
 if(typeof MARKS=='function'){if(typeof MKI!='undefined'&&!MKI.some(m=>m[0]=='🔑'))MKI.push(['🔑','#ffd36a','차량']);MARKS().push({gx,gy,lx:w.rx,ly:w.ry,ic:MKI.findIndex(m=>m[0]=='🔑'),nm:VEH[t].nm,veh:w.vid})}
 infRebuild();setTimeout(()=>msg('🔑 '+VEH[t].kn+' 차 열쇠! · 근처에 '+VEH[t].nm+'이(가) 서 있어요 (지도에 🔑)'),700)}
{const _ia=invAdd;invAdd=function(p,id,n){const r=_ia.apply(this,arguments);try{if(n>0&&S&&S.inf&&p===S.p&&/^vk_/.test(id)){const t=id.slice(3);if(VEH[t]&&!(typeof vAll=='function'&&vAll().some(v=>v.t==t)))vWildAdd(t)}}catch(e){}return r}}
/* searching: a small chance for a key of that building's kind (not for a car you already have or one already waiting) */
{const _sr=s3SearchRoll;s3SearchRoll=function(o,kind,tier,r){const pid=_sr.apply(this,arguments);try{if(typeof DUN!='undefined'&&DUN)return pid;const t=VKIN[kind];if(!t||!S||!S.inf)return pid;
  const own=vOwned(S.car)&&S.car.t==t||VGAR().some(v=>v.t==t)||VWILD().some(w=>w.t==t)||(S.p.inv['vk_'+t]|0)>0;if(own)return pid;
  if(Math.random()<(VKCH[kind]||.025)*(window.VKEYX||1))r['vk_'+t]=1}catch(e){}return pid}}
/* the parked cars live in the world as objects (solid) */
{const _bw=buildWorld;buildWorld=function(){const w=_bw.apply(this,arguments);try{if(!(typeof DUN!='undefined'&&DUN)&&S&&S.inf)for(const v of S.inf.vwild||[]){const[gx,gy]=v.gk.split(',').map(Number),cc=gx-OGX,rr=gy-OGY;if(cc<0||rr<0||cc>=NBX||rr>=NBY)continue;const[ox,oy]=bo(cc,rr),V=VEH[v.t],hz=v.dir=='r'||v.dir=='l',w2=hz?V.L:V.Wd,h2=hz?V.Wd:V.L;
  W0.objs.push({t:'vwild',x:ox+v.rx-w2/2,y:oy+v.ry-h2/2,w:w2,h:h2,vt:v.t,dir:v.dir,vid:v.vid})}}catch(e){}return w}}
P('vwild','버려진 차',null,o=>{vPaint(o.vt,o.dir,o.x+o.w/2,o.y+o.h/2,{dust:1});const t=performance.now()/250,y=o.y-14+Math.sin(t)*2,cx=o.x+o.w/2;R('#1d1714',cx-5,y-2,11,8);R('#ffd36a',cx-4,y-1,9,6);R('#1d1714',cx-1,y+6,3,3);R('#ffd36a',cx,y+6,1,2)},true);
function vClaim(o){const p=S.p,t=o.vt,id='vk_'+t;if(!(p.inv[id]>0))return msg('🔒 '+VEH[t].kn+' 차 열쇠가 필요해요');const own=vAll();if(own.some(v=>v.t==t))return msg('이미 '+VEH[t].nm+'이(가) 있어요 · 종류마다 1대만 가질 수 있어요');if(own.length>=vCap())return msg(vGLv()?'🔧 차고가 가득 찼어요 (Lv'+vGLv()+' · '+vCap()+'대) · 차고를 올리거나 차고에서 폐차하세요':'🏗 차를 더 가지려면 거점에 차고를 지어야 해요 (천막에서 [차고 짓기])');invTake(p,id,1);
 const i=VWILD().findIndex(w=>w.vid==o.vid);if(i>=0)VWILD().splice(i,1);if(typeof MARKS=='function'){const L=MARKS(),j=L.findIndex(m=>m.veh==o.vid);if(j>=0)L.splice(j,1)}
 const k=W0.objs.indexOf(o);if(k>=0)W0.objs.splice(k,1);infDerived();
 const old=VC();if(vOwned(old)){const keep=Object.assign({},old);delete keep.x;delete keep.y;keep.siren=0;VGAR().push(keep)}
 const c=vNew(t);c.x=o.x+o.w/2;c.y=o.y+o.h/2;c.dir=o.dir;c.h=o.dir=='r'||o.dir=='l';S.car=c;
 msg('🔑 '+VEH[t].nm+'이(가) 내 차가 됐어요!'+(vOwned(old)?' · 타던 '+VEH[old.t].nm+'은(는) 거점 차고로 보냈어요':'')+' · '+VEH[t].ds)}
/* ---------- garage at the base parking spot ---------- */
const vGarPos=()=>{const o=W0.objs.find(o=>o.t=='garage');return o?[o.x+o.w/2,o.y+o.h+34]:null};
function vGarNear(){const o=W0.objs.find(o=>o.t=='garage');if(!o||typeof DUN!='undefined'&&DUN)return false;const p=S.p;return p.x>o.x-30&&p.x<o.x+o.w+30&&p.y>o.y-20&&p.y<o.y+o.h+60}
function vCost(c){return Object.entries(c).map(([k,v])=>NM2(k)+' '+v).join(' · ')}
function vHave(c){const p=S.p;return Object.entries(c).every(([k,v])=>((p.inv[k]|0)+((S.base.st||{})[k]|0))>=v)}
function vPay(c){const p=S.p;for(const k in c){const a=Math.min(p.inv[k]|0,c[k]);if(a)invTake(p,k,a);if(c[k]-a)S.base.st[k]-=c[k]-a}}
function vGarage(){const b=$('bm'),c=VC(),g=VGAR();b.dataset.m='veh';PAUSE=true;
 const card=(v,act)=>{const V=VEH[v.t],M=vMods(v),mx=vMaxHp(v),f=Math.max(0,v.hp/mx);
  return'<div class="vC'+(act?' on':'')+'"><img src="'+vImg(v.t,'r')+'"><div class="vI"><b>'+V.ic+' '+V.nm+(act?' <small>· 지금 타는 차</small>':'')+'</b><small>'+V.ds+'</small><div class="vB"><i style="width:'+f*100+'%;background:'+(f>.5?'#5fe08a':f>.25?'#ffd36a':'#ff6a5a')+'"></i></div><small>체력 '+Math.round(v.hp)+'/'+mx+' · 속도 '+Math.round(V.spd*(1+.07*(M.eng|0)))+' · 들이받기 '+Math.round(V.ram*((M.ram|0)?1.6:1))+(v.t=='lab'?' · 배터리 '+Math.round(v.bat||0)+'%':' · 연료 '+(+(V.fuel*(1-.2*(M.eco|0))).toFixed(2))+'/초')+(v.broken?' · <b style="color:#ff8a7a">고장</b>':'')+'</small></div>'+(act?'':'<div class="vR" style="flex-direction:column"><button data-vs="'+v.vid+'">꺼내기</button><button data-vx="'+v.vid+'" class="no">폐차</button></div>')+'</div>'};
 const gl=vGLv(),up=gl<5?GCOST[gl]:null;let h='<div class="sh"><h2>🔧 차고 Lv'+gl+'</h2><div class="wt">차 '+vAll().length+'/'+vCap()+'대 · 종류마다 1대 · 재료는 가방과 창고에서 같이 써요</div><button onclick="closeBase();PAUSE=false">✕</button></div>'+(up?'<div class="vM"><span><b>🏗 차고 Lv'+(gl+1)+'로 올리기</b><small>주차 '+(gl+1)+'대 · 비용: '+vCost(up)+'</small></span><button id="vGup" class="'+(vHave(up)?'':'no')+'">올리기</button></div>':'<div class="sub">차고 최고 레벨 · 5대까지 주차</div>');
 if(!vOwned(c)&&!g.length)h+='<div class="sub">아직 차가 없어요 · 건물을 수색하다 보면 <b>차 열쇠</b>가 떨어져 있어요<br>· 민간: 주택 · 아파트 · 정비소 · 마트 · 쇼핑몰<br>· 경찰: 경찰서 · 교도소 · 병원: 병원 · 의원 · 약국<br>· 군: 군부대 · 약탈자 기지 · 연구소: 연구소<br>· 열쇠를 주우면 그 근처에 차가 서 있고, 지도에 🔑로 표시돼요</div>';
 if(vOwned(c)){h+=card(c,true);const n=vFixCost(c);h+='<div class="vR"><button id="vFix" '+(n<=0?'disabled':'')+'>🔧 수리 · 고철 '+n+'</button>'+(c.t=='lab'?'<button id="vChg" '+(c.bat>=100?'disabled':'')+'>🔋 충전 · 전자부품 1 (+25%)</button>':'')+'</div><h3 class="vH">개조</h3>';
  for(const k in VMOD){const[ic,nm,mx,ds,cf]=VMOD[k],l=vMods(c)[k]|0,cost=l<mx?cf(l+1):null;h+='<div class="vM"><span><b>'+ic+' '+nm+'</b> '+(mx>1?'Lv'+l+'/'+mx:l?'달림':'없음')+'<small>'+ds+(cost?' · 비용: '+vCost(cost):' · 다 올렸어요')+'</small></span>'+(cost?'<button data-vm="'+k+'" '+(vHave(cost)?'':'class="no"')+'>'+(l?'올리기':'달기')+'</button>':'')+'</div>'}}
 if(g.length)h+='<h3 class="vH">차고에 있는 차</h3>'+g.map(v=>card(v,false)).join('');
 b.innerHTML=h;b.style.display='block';
 const gu=$('vGup');if(gu)gu.onclick=()=>{if(!vHave(up))return msg('재료가 부족해요 · '+vCost(up));vPay(up);S.base.gar.lv++;infRebuild();msg('🏗 차고 Lv'+S.base.gar.lv+' · 주차 '+vCap()+'대');vGarage()};
 b.querySelectorAll('[data-vx]').forEach(x=>x.onclick=()=>{const i=g.findIndex(v=>v.vid==+x.dataset.vx);if(i<0)return;if(x.dataset.ok!='1'){x.dataset.ok='1';x.textContent='정말 폐차?';return}const v=g.splice(i,1)[0];invAdd(S.p,'scrap',10);if(I_BY.steel)invAdd(S.p,'steel',2);infRebuild();msg('🔧 '+VEH[v.t].nm+' 폐차 · 고철 10 · 강철 2 · 이 종류 열쇠가 다시 나올 수 있어요');vGarage()});
 const f=$('vFix');if(f)f.onclick=()=>{vRepairG();vGarage()};const ch=$('vChg');if(ch)ch.onclick=()=>{vCharge();vGarage()};
 b.querySelectorAll('[data-vm]').forEach(x=>x.onclick=()=>{const k=x.dataset.vm,l=vMods(c)[k]|0,cost=VMOD[k][4](l+1);if(!vHave(cost))return msg('재료가 부족해요 · '+vCost(cost));vPay(cost);const before=vMaxHp(c);vMods(c)[k]=l+1;if(k=='arm')c.hp+=vMaxHp(c)-before;msg('🔧 '+VMOD[k][1]+(VMOD[k][2]>1?' Lv'+(l+1):' 달았어요'));vGarage()});
 b.querySelectorAll('[data-vs]').forEach(x=>x.onclick=()=>{const i=g.findIndex(v=>v.vid==+x.dataset.vs);if(i<0)return;const nv=g.splice(i,1)[0];if(vOwned(c)){const keep=Object.assign({},c);delete keep.x;delete keep.y;keep.siren=0;g.push(keep)}const[gx,gy]=vGarPos();nv.x=gx;nv.y=gy;nv.dir='r';nv.h=true;S.car=nv;S.dr=0;infRebuild();msg(VEH[nv.t].ic+' '+VEH[nv.t].nm+'을(를) 꺼냈어요'+(vOwned(c)?' · 타던 차는 차고에':''));vGarage()})}
/* at the garage the repair can use the stash too */
function vRepairG(){const c=VC(),n=vFixCost(c);if(n<=0)return;const st=S.base.st||{},have=(S.p.inv.scrap|0)+(st.scrap|0);if(!have)return msg('🔧 고철이 필요해요 ('+n+'개)');const u=Math.min(have,n);vPay({scrap:u});c.hp=Math.min(vMaxHp(c),c.hp+Math.ceil(vMaxHp(c)*u/20));if(c.hp>=vMaxHp(c)*.25)c.broken=0;msg('🔧 고철 '+u+'개로 수리 · 체력 '+Math.round(c.hp)+'/'+vMaxHp(c))}
/* ---------- [상호작용] list ---------- */
{const _c=dmCtx;dmCtx=function(){const B=_c();try{if(!S||!run||S.dr||typeof DUN!='undefined'&&DUN)return B;const p=S.p,c=VC();
  {let o=null,bd=60;for(const q of W0.objs)if(q.t=='vwild'){const d=Math.hypot(q.x+q.w/2-p.x,q.y+q.h/2-p.y);if(d<bd){bd=d;o=q}}if(o){const has=p.inv['vk_'+o.vt]>0;B.unshift({t:(has?'🔑 차 문 열기 · ':'🔒 잠긴 차 · 열쇠 필요 · ')+VEH[o.vt].nm,f:()=>vClaim(o),off:!has,big:1})}}
  if(vOwned(c)&&Math.hypot(c.x-p.x,c.y-p.y)<50){const V=VEH[c.t],L=[];
   if(c.broken)L.push({t:'🔧 차 수리 · 고철 '+vFixCost(c),f:vRepair,off:!(p.inv.scrap>0),big:1});
   else{const ok=c.t=='lab'?(c.bat||0)>0:(p.inv.fuel||0)>0;L.push({t:V.ic+' 운전 · '+V.nm+(ok?'':c.t=='lab'?' · 배터리 없음':' · 연료 필요'),f:vBoard,off:!ok,big:1})}
   if(c.t=='lab'&&(c.bat||0)<100)L.push({t:'🔋 배터리 충전 · 전자부품 1',f:vCharge,off:!(p.inv.elec>0)});
   if(!c.broken&&c.hp<vMaxHp(c)&&!vGarNear())L.push({t:'🔧 차 수리 · 고철 '+vFixCost(c),f:vRepair,off:!(p.inv.scrap>0)});
   if(c.t=='pol')L.push({t:c.siren?'🚨 사이렌 끄기':'🚨 사이렌 켜기 (미끼)',f:vToggle});
   B.unshift(...L)}
  if(vGarNear())B.push({t:'🔧 차고 · 차 바꾸기 · 수리 · 개조',f:vGarage});}catch(e){}return B}}
/* the hint word */
if(typeof IAW!='undefined')IAW.unshift([/차 문 열기/,'차 열기'],[/잠긴 차/,'잠긴 차'],[/차고/,'차고'],[/차 수리/,'차 수리'],[/배터리 충전/,'충전'],[/사이렌/,'사이렌']);
/* ---------- the driving panel: health · fuel / battery · the special ---------- */
document.body.insertAdjacentHTML('beforeend','<div id="vHud"><span id="vHt"></span><button id="vHb"></button></div>');
document.head.insertAdjacentHTML('beforeend',`<style>
#vHud{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(env(safe-area-inset-bottom,0px) + 196px);z-index:4;display:none;align-items:center;gap:8px;padding:6px 10px;border-radius:12px;background:#0d1114e6;border:1px solid #ffffff22;font-size:12px;color:#e8e2d6;white-space:nowrap}
#vHud i{display:inline-block;width:54px;height:6px;border-radius:3px;background:#ffffff22;vertical-align:middle;margin:0 4px;overflow:hidden}#vHud i b{display:block;height:100%}
#vHud button{padding:4px 9px;font-size:12px}#vHud button.on{border-color:#ffd36a;color:#ffd36a}
#bm .vC{display:flex;gap:10px;align-items:center;padding:8px;margin:6px 0;border:1px solid #ffffff1a;border-radius:12px;background:#ffffff08}#bm .vC.on{border-color:#ffd36a66}
#bm .vC img{width:88px;image-rendering:pixelated;flex:none}#bm .vI{flex:1;display:flex;flex-direction:column;gap:3px;min-width:0}#bm .vI small{color:var(--mut);font-size:11px;line-height:1.4}
#bm .vB{height:6px;border-radius:3px;background:#ffffff1a;overflow:hidden}#bm .vB i{display:block;height:100%}
#bm .vR{display:flex;gap:6px;flex-wrap:wrap;margin:4px 0 8px}#bm .vH{margin:12px 0 4px;font-size:14px}
#bm .vM{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #ffffff10}#bm .vM span{flex:1;display:flex;flex-direction:column;gap:2px;font-size:12.5px}#bm .vM small{color:var(--mut);font-size:11px}
#bm .vM button.no{opacity:.45}</style>`);
let vHudK='';
function vHud(force){const el=$('vHud');if(!el)return;const c=VC();if(!S||!S.dr||!vOwned(c)||PAUSE){if(el.style.display!='none')el.style.display='none';return}const V=VEH[c.t],f=c.hp/vMaxHp(c),fu=c.t=='lab'?(c.bat||0)/100:Math.min(1,(S.p.inv.fuel||0)/10);
 const k=c.t+'|'+Math.round(f*30)+'|'+Math.round(fu*30)+'|'+c.siren+'|'+c.gun;if(k==vHudK&&!force&&el.style.display=='flex')return;vHudK=k;el.style.display='flex';
 $('vHt').innerHTML=V.ic+' 체력<i><b style="width:'+f*100+'%;background:'+(f>.5?'#5fe08a':f>.25?'#ffd36a':'#ff6a5a')+'"></b></i>'+(c.t=='lab'?'배터리':'연료')+'<i><b style="width:'+fu*100+'%;background:#6ab0ff"></b></i>';
 const b=$('vHb');if(c.t=='pol'){b.style.display='';b.textContent=c.siren?'🚨 사이렌 끄기':'🚨 사이렌';b.className=c.siren?'on':''}else if(c.t=='mil'){b.style.display='';b.textContent=c.gun===false?'🪖 기관총 켜기':'🪖 기관총 끄기';b.className=c.gun===false?'':'on'}else b.style.display='none'}
$('vHb').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();vToggle()});
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);vHud()}}
/* ---------- pixel art: one sprite per kind, drawn facing right, turned for the other directions ---------- */
const VSPR={};
function vArt(x,t,L,Wd,o){const r=(c,a,b,w,h)=>{x.fillStyle=c;x.fillRect(a,b,w,h)},X=4,Y=4,f=a=>X+Math.round(L*a);
 /* tyres */for(const a of[.16,.72]){r('#121212',f(a),Y-2,10,4);r('#121212',f(a),Y+Wd-2,10,4);r('#3a3a3a',f(a)+2,Y-2,6,1);r('#3a3a3a',f(a)+2,Y+Wd+1,6,1)}
 const C={civ:['#3a6ea5','#5a8ec5','#284a70','#2f5b88'],pol:['#e8ecf0','#ffffff','#a8b0ba','#dfe4ea'],med:['#efefe9','#ffffff','#b8b8b0','#e2e2da'],mil:['#5b6b3a','#75864a','#3e4a26','#4e5d31'],lab:['#e6f0f0','#ffffff','#a6b8b8','#d6e6e6']}[t];
 /* body */r('#141414',X,Y+1,L,Wd-2);r('#141414',X+1,Y,L-2,Wd);r(C[0],X+1,Y+1,L-2,Wd-2);r(C[1],X+2,Y+1,L-4,2);r(C[2],X+2,Y+Wd-3,L-4,2);
 if(t=='mil'){/* boxy armour · camo */r('#141414',X,Y,L,Wd);r(C[0],X+1,Y+1,L-2,Wd-2);r(C[1],X+1,Y+1,L-2,2);r(C[2],X+1,Y+Wd-3,L-2,2);for(const[a,b,w,h]of[[.12,.25,6,4],[.3,.6,8,5],[.55,.2,7,4],[.78,.62,6,4],[.42,.35,5,3]]){r('#48552c',f(a),Y+Math.round(Wd*b),w,h);r('#6d7c45',f(a)+1,Y+Math.round(Wd*b),w-2,1)}
  r('#2a3020',f(.74),Y+4,3,Wd-8);r('#2a3020',f(.22),Y+3,L*.5|0,2);r('#2a3020',f(.22),Y+Wd-5,L*.5|0,2);r('#1d1f1a',X-1,Y+Wd/2-4,3,8);r('#2b2b2b',X+1,Y+Wd/2-5,5,10);
  /* turret */const cx=f(.45),cy=Y+Wd/2;r('#141414',cx-7,cy-6,14,12);r('#3a4426',cx-6,cy-5,12,10);r('#4e5d31',cx-5,cy-5,10,2);r('#1d1f1a',cx+6,cy-1,15,3);r('#3a3a3a',cx+6,cy-1,15,1);r('#141414',cx-2,cy-2,4,4);
  r('#ffe9a0',X+L-2,Y+2,2,4);r('#ffe9a0',X+L-2,Y+Wd-6,2,4);r('#8a2a20',X,Y+2,2,3);r('#8a2a20',X,Y+Wd-5,2,3);return}
 if(t=='pol'){r('#1c1f26',X+1,Y+1,Math.round(L*.18),Wd-2);r('#1c1f26',f(.8),Y+1,Math.round(L*.2)-1,Wd-2);r('#2a4a9a',f(.3),Y+1,Math.round(L*.42),2);r('#2a4a9a',f(.3),Y+Wd-3,Math.round(L*.42),2)}
 if(t=='lab'){r('#2aa198',X+2,Y+2,L-4,2);r('#2aa198',X+2,Y+Wd-4,L-4,2)}
 if(t=='med'){/* box body */r(C[3],X+2,Y+3,Math.round(L*.66),Wd-6);r(C[1],X+2,Y+3,Math.round(L*.66),1);r('#c8302a',X+2,Y+1,Math.round(L*.66),2);r('#c8302a',X+2,Y+Wd-3,Math.round(L*.66),2);
  const cx=X+Math.round(L*.34),cy=Y+Wd/2;r('#c8302a',cx-5,cy-1.5|0,10,3);r('#c8302a',cx-1.5|0,cy-5,3,10);r('#ff9a3a',f(.66),Y+4,2,Wd-8);r('#ffc070',f(.66),Y+4,2,2);
  r('#7fb4d6',f(.73),Y+4,4,Wd-8);r('#c4e2f4',f(.73),Y+4,1,Wd-8);r('#ffe9a0',X+L-2,Y+3,2,4);r('#ffe9a0',X+L-2,Y+Wd-7,2,4);r('#d23a2a',X,Y+3,2,4);r('#d23a2a',X,Y+Wd-7,2,4);return}
 /* cabin · glass */const w0=f(.27),w1=f(.6);r('#7fb4d6',w0-4,Y+4,4,Wd-8);r(C[3],w0,Y+3,w1-w0,Wd-6);r(C[1],w0,Y+3,w1-w0,1);r('#7fb4d6',w1,Y+4,5,Wd-8);r('#c4e2f4',w1,Y+4,1,Wd-8);r('#141414',w1+5,Y+4,1,Wd-8);
 r('#141414',w1-1,Y,2,2);r('#141414',w1-1,Y+Wd-2,2,2);
 if(t=='pol'){const cx=f(.43);r('#141414',cx-1,Y+4,5,Wd-8);r(o&&o.blink?'#ff6a5a':'#c8302a',cx,Y+5,3,(Wd-10)/2|0);r(o&&o.blink?'#9ad0ff':'#2a5ac8',cx,Y+5+((Wd-10)/2|0),3,(Wd-10)/2|0)}
 if(t=='lab'){r('#1f3a5f',w0+1,Y+4,w1-w0-2,Wd-8);for(let i=w0+4;i<w1-1;i+=4)r('#3c6a9a',i,Y+4,1,Wd-8);r('#3c6a9a',w0+1,Y+Wd/2|0,w1-w0-2,1);r('#ffd36a',f(.12),Y+Wd/2-2|0,4,4);r('#1d1714',f(.12)+1,Y+Wd/2-1|0,2,2)}
 r('#ffe9a0',X+L-2,Y+3,2,4);r('#ffe9a0',X+L-2,Y+Wd-7,2,4);r('#d23a2a',X,Y+3,2,4);r('#d23a2a',X,Y+Wd-7,2,4)}
function vSprite(t,dir,o){const k=t+dir+(o&&o.blink?'b':'')+(o&&o.dmg?'d':'')+(o&&o.dust?'u':'');if(VSPR[k])return VSPR[k];const V=VEH[t],L=V.L,Wd=V.Wd,a=document.createElement('canvas');a.width=L+8;a.height=Wd+8;const x=a.getContext('2d');vArt(x,t,L,Wd,o);
 if(o&&(o.dmg||o.dust)){x.globalCompositeOperation='source-atop';if(o.dust){x.fillStyle='#8a7a5a';x.globalAlpha=.28;x.fillRect(0,0,a.width,a.height)}if(o.dmg){x.globalAlpha=1;x.fillStyle='#2a1e16';for(const[px,py,w]of[[.2,.3,4],[.5,.7,5],[.7,.25,3],[.35,.55,3],[.85,.6,4]])x.fillRect(4+L*px|0,4+Wd*py|0,w,w-1);x.fillStyle='#6a3a20';for(const[px,py]of[[.22,.32],[.52,.72],[.86,.62]])x.fillRect(4+L*px|0,4+Wd*py|0,2,1)}x.globalCompositeOperation='source-over';x.globalAlpha=1}
 let out=a;if(dir!='r'){const b=document.createElement('canvas'),v=dir=='u'||dir=='d';b.width=v?a.height:a.width;b.height=v?a.width:a.height;const y=b.getContext('2d');y.translate(b.width/2,b.height/2);y.rotate(dir=='l'?Math.PI:dir=='d'?Math.PI/2:-Math.PI/2);y.drawImage(a,-a.width/2,-a.height/2);out=b}
 return VSPR[k]=out}
/* the shadow has the car's own shape (a box shadow showed as a black square on the diagonals) */
const VSHD=new WeakMap();
function vShadow(s){let c=VSHD.get(s);if(c)return c;c=document.createElement('canvas');c.width=s.width;c.height=s.height;const x=c.getContext('2d');x.drawImage(s,0,0);x.globalCompositeOperation='source-in';x.fillStyle='#000';x.fillRect(0,0,c.width,c.height);VSHD.set(s,c);return c}
function vPaint(t,dir,cx,cy,o){const s=vSprite(t,dir||'r',o),X=Math.round(cx-s.width/2),Y=Math.round(cy-s.height/2);const a=g.globalAlpha;g.globalAlpha=a*.3;g.drawImage(vShadow(s),X+3,Y+4);g.globalAlpha=a;g.drawImage(s,X,Y)}
function vImg(t,dir){const s=vSprite(t,dir||'r');const c=document.createElement('canvas');c.width=s.width*2;c.height=s.height*2;const x=c.getContext('2d');x.imageSmoothingEnabled=false;x.drawImage(s,0,0,c.width,c.height);return c.toDataURL()}
function vDraw(c){if(!vOwned(c))return;const o={blink:c.t=='pol'&&c.siren&&(performance.now()/180|0)%2==0,dmg:c.hp<vMaxHp(c)*.4};let dir=c.dir||(c.h===false?'d':'r');vPaint(c.t,dir,c.x,c.y,o);
 if(c.broken){const t=performance.now()/300;for(let i=0;i<3;i++){const k=(t+i/3)%1;g.globalAlpha=.5*(1-k);R('#5a5a5a',c.x-3+i*3,c.y-12-k*22,5,5);g.globalAlpha=1}}}

/* ---------- the garage: built at the base · Lv1-5 = 1-5 cars · one car per kind ---------- */
const VDIR8=['r','dr','d','dl','l','ul','u','ur'];
const GCOST=[{wood:20,scrap:20},{scrap:30,steel:4},{scrap:40,steel:8,elec:4},{scrap:50,steel:12,elec:8},{scrap:60,steel:16,elec:12,tkn:20}];
const GW=210,GH=84,GBAY=40;
const vGLv=()=>(S&&S.base&&S.base.gar&&S.base.gar.lv)|0;
const vCap=()=>Math.max(1,vGLv());
const vAll=()=>[...(vOwned(VC())?[VC()]:[]),...VGAR()];
{const _bw=buildWorld;buildWorld=function(){const w=_bw.apply(this,arguments);try{const G=S&&S.base&&S.base.gar;if(G&&G.lv&&W0.base&&!(typeof DUN!='undefined'&&DUN)){const B=W0.base,x=B.ox+G.rx-GW/2,y=B.oy+G.ry-GH/2;
  W0.objs.push({t:'garage',x,y,w:GW,h:GH,lv:G.lv});W0.objs.push({t:'garwall',x,y:y-6,w:GW,h:10});
  VGAR().forEach((v,i)=>{if(i<5)W0.objs.push({t:'garcar',x:x+5+i*GBAY+GBAY/2-VEH[v.t].Wd/2,y:y+GH-6-VEH[v.t].L,w:VEH[v.t].Wd,h:VEH[v.t].L,vt:v.t,dmg:v.hp<vMaxHp(v)*.4})});
  W0.lights.push([x+GW/2,y+GH/2,130,.6,'#ffe9b0'])}}catch(e){}return w}}
FLAT.garage=1;
P('garage','차고',null,o=>{const{x,y,w,h}=o,lv=o.lv|0;R('#5a5a56',x,y,w,h);R('#7a7a74',x+2,y+2,w-4,h-4);for(let i=0;i<w;i+=7)R('#6e6e68',x+2+i,y+2+((i*13)%(h-6)),2,1);
 for(let i=0;i<5;i++){const bx=x+5+i*GBAY,on=i<lv;R(on?'#e8c84a':'#55554f',bx,y+10,2,h-14);R(on?'#e8c84a':'#55554f',bx+GBAY-2,y+10,2,h-14);if(!on){R('#5a5a54',bx+6,y+20,GBAY-12,h-30);R('#3a3a36',bx+9,y+h/2-1|0,GBAY-18,2)}
  else{R('#e8c84a',bx+GBAY/2-4|0,y+h-10,8,2)}}
 R('#e8c84a',x,y+h-3,w,1)},false);
P('garwall','차고 벽',null,o=>{const{x,y,w}=o;R('#1d1714',x-2,y-26,w+4,30);R('#6a3a2a',x,y-25,w,22);R('#8a4a34',x,y-25,w,4);for(let i=x+4;i<x+w-4;i+=12)R('#5a2e20',i,y-19,8,1);R('#3a3a3a',x+w/2-26,y-14,52,10);R('#e8c84a',x+w/2-24,y-13,48,1);
 R('#2a2a2a',x-2,y+4,5,82);R('#2a2a2a',x+w-3,y+4,5,82)},true);
P('garcar','주차된 차',null,o=>vPaint(o.vt,'u',o.x+o.w/2,o.y+o.h/2,{dmg:o.dmg}),true);
/* placing the garage (once) */
let GPL=false;
function gSpot(){const p=S.p,f=Math.hypot(p.fx||0,p.fy||0)||1;return[p.x+(p.fx||0)/f*(GH/2+30),p.y+(p.fy||1)/f*(GH/2+30)]}
function gOk(){const[x,y]=gSpot();for(const[a,b]of[[x-GW/2,y-GH/2-30],[x+GW/2,y-GH/2-30],[x-GW/2,y+GH/2],[x+GW/2,y+GH/2]])if(!(typeof inBase=='function'&&inBase(a,b)))return'거점 안에만 지을 수 있어요';
 for(let a=x-GW/2+8;a<x+GW/2;a+=24)for(let b=y-GH/2-24;b<y+GH/2;b+=24)if(blocker(a,b,6))return'자리가 좁아요 · 넓은 곳으로';if(!vHave(GCOST[0]))return'재료가 부족해요 · '+vCost(GCOST[0]);return''}
function gDo(){const bad=gOk();if(bad)return msg('🏗 '+bad);vPay(GCOST[0]);const[x,y]=gSpot(),B=W0.base;S.base.gar={lv:1,rx:Math.round(x-B.ox),ry:Math.round(y-B.oy)};GPL=false;infRebuild();msg('🏗 차고를 지었어요 · 주차 1대 · 차고에서 수리 · 개조 · 차고 올리기')}
if(typeof OVL!='undefined')OVL.push((g,sx,sy,k)=>{if(!GPL||!S||!S.p)return;const[x,y]=gSpot(),bad=gOk();g.save();g.fillStyle=bad?'#ff6a5a30':'#7fd07f30';g.strokeStyle=bad?'#ff6a5acc':'#7fd07fcc';g.lineWidth=2;g.setLineDash([6,4]);
 g.fillRect(sx(x-GW/2),sy(y-GH/2-30),GW*k,(GH+30)*k);g.strokeRect(sx(x-GW/2),sy(y-GH/2-30),GW*k,(GH+30)*k);g.setLineDash([]);g.font='600 13px system-ui,sans-serif';g.textAlign='center';g.lineWidth=3;g.strokeStyle='#000a';const t='🏗 '+(bad||'차고 여기에');g.strokeText(t,sx(x),sy(y-GH/2-30)-8);g.fillStyle='#fff';g.fillText(t,sx(x),sy(y-GH/2-30)-8);g.restore()});
{const _c=dmCtx;dmCtx=function(){if(GPL){const bad=gOk();return[{t:'✅ 차고 짓기'+(bad?' · '+bad:''),f:gDo,off:!!bad,big:1},{t:'✖ 취소',f:()=>{GPL=false;msg('🏗 취소')},sm:1}]}const B=_c();try{if(!S||!run||S.dr||typeof DUN!='undefined'&&DUN)return B;const p=S.p,c=VC();
  if(!vGLv()&&typeof rqNear=='function'&&rqNear())B.push({t:'🏗 차고 짓기 · '+vCost(GCOST[0]),f:()=>{GPL=true;msg('🏗 차고 자리를 정해요 · 넓은 곳으로 걸어가서 [차고 짓기] · 바라보는 쪽 앞에 지어져요')}});
  if(vGarNear()&&vOwned(c)&&!S.dr&&Math.hypot(c.x-p.x,c.y-p.y)<160&&VGAR().length<5)B.push({t:'🅿 '+VEH[c.t].nm+' 차고에 넣기',f:()=>{const keep=Object.assign({},c);delete keep.x;delete keep.y;keep.siren=0;VGAR().push(keep);S.car=vNone();infRebuild();msg('🅿 '+VEH[keep.t].nm+'을(를) 차고에 넣었어요')},sm:1})}catch(e){}return B}}
if(typeof IAW!='undefined')IAW.unshift([/차고 짓기/,'차고 짓기'],[/차고에 넣기/,'주차']);
/* ---------- 8 directions: diagonals are rotated with a supersampled majority vote, so the pixels stay clean ---------- */
function vRot45(a,ang){const w=a.width,h=a.height,src=a.getContext('2d').getImageData(0,0,w,h).data,D=Math.ceil((w+h)/Math.SQRT2)+2,b=document.createElement('canvas');b.width=D;b.height=D;const x=b.getContext('2d'),img=x.createImageData(D,D),out=img.data;
 const co=Math.cos(-ang),si=Math.sin(-ang),cx=D/2,cy=D/2,sx0=w/2,sy0=h/2,N=4;
 for(let py=0;py<D;py++)for(let px=0;px<D;px++){const cnt=new Map();let tr=0;for(let j=0;j<N;j++)for(let i=0;i<N;i++){const dx=px+(i+.5)/N-cx,dy=py+(j+.5)/N-cy,u=Math.floor(dx*co-dy*si+sx0),v=Math.floor(dx*si+dy*co+sy0);
   if(u<0||v<0||u>=w||v>=h){tr++;continue}const o=(v*w+u)*4;if(src[o+3]<128){tr++;continue}const key=(src[o]<<16)|(src[o+1]<<8)|src[o+2];cnt.set(key,(cnt.get(key)||0)+1)}
  if(tr>N*N/2)continue;let best=0,bk=0;for(const[k,n]of cnt)if(n>best){best=n;bk=k}const o=(py*D+px)*4;out[o]=bk>>16&255;out[o+1]=bk>>8&255;out[o+2]=bk&255;out[o+3]=255}
 x.putImageData(img,0,0);return b}
{const _vs=vSprite;vSprite=function(t,dir,o){if(!/^(dr|dl|ur|ul)$/.test(dir))return _vs(t,dir,o);const k=t+dir+(o&&o.blink?'b':'')+(o&&o.dmg?'d':'')+(o&&o.dust?'u':'');if(VSPR[k])return VSPR[k];
  const base=_vs(t,'r',o),ang={dr:Math.PI/4,dl:3*Math.PI/4,ul:-3*Math.PI/4,ur:-Math.PI/4}[dir];return VSPR[k]=vRot45(base,ang)}}
/* ---------- the trunk: slots like every box (8 to start · 🧳 trunk mod +4 a level, civilian +5) · each kind stacks one kind of cargo twice as high ---------- */
VMOD.trunk=['🧳','트렁크 확장',4,'트렁크 +4칸 (민간 승용차는 +5칸)',l=>({scrap:8*l,cloth:4*l})];
const VTR={civ:['넓은 트렁크','확장할 때마다 +5칸',null],pol:['장비 보관함','방어구 · 장비 한 칸에 2개',id=>!W_BY[id]&&catOf(id)=='e'],med:['의료 칸','음식 · 물 · 의료품 한 칸에 2배',id=>catOf(id)=='c'],
 mil:['무기고','무기 한 칸에 2개 · 탄약 한 칸에 600발',id=>!!W_BY[id]||catOf(id)=='a'],lab:['부품 선반','재료 (고철 · 전자부품 등) 한 칸에 2배',id=>catOf(id)=='m']};
const VTRCAT=[['m','🧱 재료',id=>!W_BY[id]&&catOf(id)=='m'],['c','🥫 음식·의료',id=>catOf(id)=='c'],['a','🔫 탄약',id=>catOf(id)=='a'],['w','🗡 무기',id=>!!W_BY[id]],['e','🦺 장비',id=>!W_BY[id]&&catOf(id)=='e']];
const vTrCap=c=>8+(vMods(c).trunk|0)*(c.t=='civ'?5:4);
const vTrK=(c,id)=>STK(id)*(VTR[c.t][2]&&VTR[c.t][2](id)?2:1);
const vTrBox=c=>{c.tr=c.tr||{};return c.tr};
const vTrUsed=c=>{let w=0;const T=vTrBox(c);for(const k in T)if((T[k]|0)>0)w+=Math.ceil((T[k]|0)/vTrK(c,k));return w};
const vEquipped=id=>{const e=S.p.eq||{};return Object.values(e).includes(id)};
function vTrPut(c,id,n){const p=S.p,have=p.inv[id]|0;if(have<=0)return;const T=vTrBox(c),k=vTrK(c,id),cur=T[id]|0,part=cur%k?k-cur%k:0,can=part+Math.max(0,vTrCap(c)-vTrUsed(c))*k;n=Math.min(n,have,can);if(n<=0)return msg('🧳 트렁크가 가득 찼어요 ('+vTrCap(c)+'칸)');invTake(p,id,n);T[id]=cur+n}
function vTrTake(c,id,n){const T=vTrBox(c);n=Math.min(n,T[id]|0);if(n<=0)return;T[id]-=n;if(T[id]<=0)delete T[id];invAdd(S.p,id,n)}
function vTrunk(){const c=VC();if(!vOwned(c))return;const b=$('bm'),p=S.p,T=vTrBox(c),R0=VTR[c.t],used=vTrUsed(c),cap=vTrCap(c);b.dataset.m='trunk';PAUSE=true;
 const row=(id,n,inT)=>{const kk=inT?vTrK(c,id):STK(id),dbl=R0[2]&&R0[2](id);return'<div class="tR"><img src="'+icon(id)+'"><span><b>'+NM2(id)+'</b> ×'+n+'<small>'+(inT?Math.ceil(n/kk)+'칸 · 한 칸에 '+kk:'한 칸에 '+STK(id))+(inT&&dbl?' · <b style="color:#9fe09f">2배</b>':(!inT&&dbl?' · 트렁크에선 2배':''))+'</small></span><button data-'+(inT?'to':'ti')+'="'+id+'" data-n="1">1</button><button data-'+(inT?'to':'ti')+'="'+id+'" data-n="'+n+'">전부</button></div>'};
 const bag=Object.keys(p.inv).filter(k=>(p.inv[k]|0)>0&&!vEquipped(k)&&!/^vk_/.test(k)).sort((a,b)=>catOf(a).localeCompare(catOf(b)));
 b.innerHTML='<div class="sh"><h2>🧳 '+VEH[c.t].nm+' 트렁크</h2><div class="wt">'+used+' / '+cap+'칸 · '+R0[0]+': '+R0[1]+'</div><button onclick="closeBase();PAUSE=false">✕</button></div>'+
  '<div class="vB" style="height:8px;margin:2px 0 8px"><i style="width:'+Math.min(100,used/cap*100)+'%;background:'+(used/cap>.9?'#ff8a5a':'#6ab0ff')+'"></i></div>'+
  '<h3 class="vH">트렁크</h3>'+(Object.keys(T).length?Object.keys(T).map(k=>row(k,T[k],true)).join('')+'<div class="vR"><button id="tAll">전부 꺼내기</button></div>':'<div class="sub">비어 있어요</div>')+
  (bag.length?'<div class="vR">'+VTRCAT.filter(([,,f])=>bag.some(f)).map(([k,nm])=>'<button data-tc="'+k+'">'+nm+' 전부 넣기</button>').join('')+'</div>':'')+'<h3 class="vH">내 가방 <small style="font-weight:400;color:var(--mut)">'+(+weight(p).toFixed(1))+'kg · 장착 중인 건 빼고</small></h3>'+(bag.length?bag.map(k=>row(k,p.inv[k]|0,false)).join(''):'<div class="sub">넣을 게 없어요</div>')+
  '<div class="sub" style="line-height:1.6;margin-top:6px">· 트렁크도 보관함과 같은 칸 규칙 (탄약 300 · 무기 · 방어구 1 …) · 기본 8칸 · 차고에서 <b>🧳 트렁크 확장</b> (Lv4까지, 한 번에 +4칸 · 민간 +5칸)<br>· 민간 넓은 트렁크 · 경찰 방어구·장비 2배 · 구급차 음식·의료품 2배 · 장갑차 무기 2개·탄약 600 · 전기 밴 재료 2배<br>· 차고에 넣은 차도 짐을 그대로 실고 있어요</div>';
 b.style.display='block';
 b.querySelectorAll('[data-ti]').forEach(x=>x.onclick=()=>{vTrPut(c,x.dataset.ti,+x.dataset.n);vTrunk()});b.querySelectorAll('[data-to]').forEach(x=>x.onclick=()=>{vTrTake(c,x.dataset.to,+x.dataset.n);vTrunk()});
 b.querySelectorAll('[data-tc]').forEach(x=>x.onclick=()=>{const f=VTRCAT.find(q=>q[0]==x.dataset.tc)[2];let n=0;for(const id of bag.filter(f)){const before=p.inv[id]|0;vTrPut(c,id,before);n+=before-(p.inv[id]|0)}if(n)msg('🧳 '+x.textContent.replace(' 전부 넣기','')+' '+n+'개 넣었어요');vTrunk()});
 const a=$('tAll');if(a)a.onclick=()=>{for(const k of Object.keys(T))vTrTake(c,k,T[k]|0);vTrunk()}}
{const _c=dmCtx;dmCtx=function(){const B=_c();try{if(!S||!run||S.dr||typeof DUN!='undefined'&&DUN||typeof GPL!='undefined'&&GPL)return B;const p=S.p,c=VC();if(vOwned(c)&&Math.hypot(c.x-p.x,c.y-p.y)<50){const i=B.findIndex(q=>/운전 ·|차 수리/.test(q.t));B.splice(i<0?0:i+1,0,{t:'🧳 트렁크 · '+vTrUsed(c)+'/'+vTrCap(c)+'칸',f:vTrunk})}}catch(e){}return B}}
if(typeof IAW!='undefined')IAW.unshift([/트렁크/,'트렁크']);
document.head.insertAdjacentHTML('beforeend',`<style>#bm .tR{display:flex;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid #ffffff10}#bm .tR img{width:28px;height:28px;image-rendering:pixelated}#bm .tR span{flex:1;display:flex;flex-direction:column;font-size:12.5px}#bm .tR small{font-size:11px;color:var(--mut)}#bm .tR button{padding:4px 9px;font-size:12px}</style>`);
/* the garage card shows the trunk and the kind's cargo trait */
{const _vg=vGarage;vGarage=function(){_vg.apply(this,arguments);try{const b=$('bm');const cards=b.querySelectorAll('.vC');const list=vAll();cards.forEach((el,i)=>{const v=list[i];if(!v)return;const s=el.querySelector('.vI');if(s)s.insertAdjacentHTML('beforeend','<small>🧳 트렁크 '+vTrUsed(v)+'/'+vTrCap(v)+'칸 · '+VTR[v.t][0]+' ('+VTR[v.t][1]+')</small>')})}catch(e){}}}
