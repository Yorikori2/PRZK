/* PROJECT LEGACY — sample: underground mining and the ore → ingot → powder → ammo / gun chain.
   · Ore veins in underground shelters (Lv1–2 ores) and bunkers (Lv1–3); deeper zones roll rarer ores.
   · Pickaxe Lv1 (coal · iron · copper) / Lv2 (+ lead · zinc · sulfur · saltpeter) / Lv3 (+ tungsten · titanium · rare earth).
   · Mining is loud and slow; burrowing crawlers sometimes come up.
   · 제작소 at the base: ① 제련로 ② 화약 제작대 ③ 탄약 제작대 ④ 총기 제작대 (each built once).
   Loaded after demo_next.js. */
'use strict';
const ORES=[['coal','석탄',1,'#2a2a2a','#555'],['oiron','철광석',1,'#9a6a4a','#c08a6a'],['ocopper','구리광석',1,'#c07a3a','#e0a060'],['olead','납광석',2,'#6a7078','#9aa0a6'],['ozinc','아연광석',2,'#a8b0b8','#d8e0e8'],
 ['sulfur','유황',2,'#d8c830','#f4e870'],['salpet','초석',2,'#d8d8d0','#ffffff'],['otung','텅스텐',3,'#3e4250','#7a8090'],['otitan','티타늄',3,'#a8b8c8','#e0ecf8'],['orare','희토류',3,'#7a4ab0','#c08af0']];
const ORE_BY=Object.fromEntries(ORES.map(o=>[o[0],o]));
const MAT2=[['iiron','철괴',.5,'제련'],['icopper','구리괴',.5,'제련'],['ilead','납괴',.5,'제련'],['izinc','아연괴',.5,'제련'],['steel','강철',.6,'제련 · 총기 몸체'],['brass','황동',.4,'제련 · 탄피'],
 ['bpow','흑색화약',.05,'화약 · 소음 조금 더'],['spow','무연화약',.05,'고급 화약 · 소총탄'],['case','탄피',.01,'탄약 부품'],['primer','뇌관',.01,'탄약 부품'],['blead','납 탄두',.01,'기본 탄두'],['bcop','구리 피복 탄두',.01,'소총 탄두'],['btung','텅스텐 탄두',.02,'관통 탄두'],
 ['pick1','곡괭이',2,'채굴 Lv1 · 석탄 · 철 · 구리'],['pick2','강철 곡괭이',2.2,'채굴 Lv2 · + 납 · 아연 · 유황 · 초석 · 더 빠름'],['pick3','전동 채굴 드릴',3,'채굴 Lv3 · + 텅스텐 · 티타늄 · 희토류 · 가장 빠름']];
for(const[id,n,lv]of ORES){if(!I_BY[id]){const it=[id,n,'m',lv==1?'c':lv==2?'u':'r',.6,'광물 Lv'+lv+' · 지하에서 채굴'];ITEMS.push(it);I_BY[id]=it}}
for(const[id,n,w,d]of MAT2){if(!I_BY[id]){const it=[id,n,'m',/pick3|steel|spow|btung/.test(id)?'r':'u',w,d];ITEMS.push(it);I_BY[id]=it}}
const pickLv=p=>has(p,'pick3')?3:has(p,'pick2')?2:has(p,'pick1')?1:0;
/* ---------- veins in the underground ---------- */
function oreRoll(Rn,maxLv,zn){const w=ORES.filter(o=>o[2]<=maxLv).map(o=>[o,o[2]==1?10:o[2]==2?5+zn:Math.min(8,1+zn*1.2)]),t=w.reduce((a,b)=>a+b[1],0);let r=Rn()*t;for(const[o,v]of w){r-=v;if(r<=0)return o[0]}return w[0][0][0]}
{const _bd=buildDungeon;buildDungeon=function(){const w=_bd();try{const c=(NBX-1)/2|0,r=(NBY-1)/2|0,[ox,oy]=bo(c,r),Rn=mulberry(DUN.seed+77),bk=DUN.sh=='bunker',zn=Math.max(1,zoneOf(OGX+c,OGY+r)),RW=BW/3,RH=BH/3,M=(S.inf.mined=S.inf.mined||{})[DUN.gk]||{};
  W0.ores=[];const n=bk?9:7;for(let k=0;k<n;k++){const i=k%3,j=(k/3|0)%3;if(!i&&!j&&k<3)continue;const x=ox+i*RW+[30,RW-60][k%2]+Rn()*20,y=oy+j*RH+[RH*.45,RH*.6][(k>>1)%2];
   const id=oreRoll(Rn,bk?3:2,zn),v={k,x,y,id,n:3+(Rn()*3|0)};v.n-=M[k]|0;W0.ores.push(v);
   W0.dec.push({x:x-26,y:y-18,w:52,h:36,f:()=>oreDraw(v)})}}catch(e){}return w}}
function oreDraw(v){const o=ORE_BY[v.id],x=Math.round(v.x),y=Math.round(v.y);if(v.n<=0){for(let i=0;i<6;i++)R(i%2?'#4a463e':'#5a554b',x-18+i*6,y+6-(i%3)*3,6,5);return}
 R('#1d1714',x-25,y-17,50,35);R('#4a463e',x-24,y-16,48,33);R('#5d574c',x-24,y-16,48,6);R('#3a362f',x-24,y+11,48,6);R('#1d1714',x-8,y-17,3,10);R('#1d1714',x+10,y+4,10,2);
 for(let i=0;i<9;i++){const a=i*2.1,px=x+Math.round(Math.cos(a)*(6+i*2)),py=y+Math.round(Math.sin(a)*(4+i*1.2))-1;R('#1d1714',px-3,py-3,7,6);R(o[3],px-2,py-2,5,4);R(o[4],px-2,py-2,3,1)}}
/* ---------- mining: stand next to a vein and press 캐기 ---------- */
let MINE=null;
function oreNear(){if(!DUN||!W0.ores)return null;const p=S.p;let b=null,bd=64;for(const v of W0.ores){if(v.n<=0)continue;const d=Math.hypot(v.x-p.x,v.y-p.y);if(d<bd){bd=d;b=v}}return b}
{const _c=dmCtx;dmCtx=function(){const B=_c();const v=oreNear();if(!v)return B;const p=S.p,o=ORE_BY[v.id],lv=pickLv(p);
  if(MINE)B.unshift({t:'⛏ 캐는 중… '+Math.round(MINE.t/MINE.T*100)+'% · 멈추기',f:()=>{MINE=null;msg('⛏ 채굴을 멈췄어요')},big:1});
  else if(!lv)B.unshift({t:'⛏ '+o[1]+' 광맥 · 곡괭이가 필요해요',f:null,info:1});
  else if(lv<o[2])B.unshift({t:'⛏ '+o[1]+' · 곡괭이 Lv'+o[2]+' 필요 (지금 Lv'+lv+')',f:null,info:1});
  else B.unshift({t:'⛏ '+o[1]+' 캐기 (남은 '+v.n+')',f:()=>{MINE={v,t:0,T:[0,1.8,1.3,.9][lv],x:p.x,y:p.y}},big:1});return B}}
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!MINE||!S)return;const p=S.p,v=MINE.v;if(!DUN||Math.hypot(p.x-MINE.x,p.y-MINE.y)>24){MINE=null;return}
  MINE.t+=dt;if(MINE.t<MINE.T)return;MINE.t=0;noise(v.x,v.y,3);try{sfx((a,t)=>{nz(a,t,{f:1800,q:2,v:.25,d:.08,type:'bandpass'})})}catch(e){}
  const n=1+(Math.random()<.35?1:0);invAdd(p,v.id,n);s3Float(v.x,v.y-30,'+'+n+' '+NM2(v.id),ORE_BY[v.id][4]);if(v.id!='coal'&&Math.random()<.25){invAdd(p,'coal',1)}
  v.n--;const M=(S.inf.mined=S.inf.mined||{})[DUN.gk]=S.inf.mined[DUN.gk]||{};M[v.k]=(M[v.k]|0)+1;if(typeof s3Xp=='function')s3Xp(4*ORE_BY[v.id][2],'채굴');
  if(Math.random()<.12){const a=Math.random()*6.28;mk(v.x+Math.cos(a)*90,v.y+Math.sin(a)*70,{look:'crawler'});msg('🕳 땅을 파고 크롤러가 올라왔어요!')}
  if(v.n<=0){MINE=null;msg('⛏ 광맥을 다 캤어요')}}}
/* ---------- 제작소: four stations ---------- */
const FST=[['forge','① 제련로','🔥',{cement:4,scrap:10}],['powder','② 화약 제작대','🧪',{wood:6,scrap:6,cloth:2}],['ammob','③ 탄약 제작대','🔩',{scrap:12,elec:2}],['gunb','④ 총기 제작대','🔫',{scrap:15,elec:4,steel:4}]];
const FRC={forge:[['iiron',1,{oiron:2,coal:1}],['icopper',1,{ocopper:2,coal:1}],['ilead',1,{olead:2,coal:1}],['izinc',1,{ozinc:2,coal:1}],['steel',1,{iiron:2,coal:2}],['brass',1,{icopper:1,izinc:1}]],
 powder:[['bpow',5,{salpet:3,coal:1,sulfur:1}],['spow',3,{bpow:3,pills:1}]],
 ammob:[['case',10,{brass:1}],['primer',10,{icopper:1,bpow:1}],['blead',10,{ilead:1}],['bcop',10,{ilead:1,icopper:1}],['btung',5,{otung:1}],
  ['a9mm',10,{case:10,blead:10,primer:10,bpow:1}],['a12g',6,{case:6,blead:12,primer:6,bpow:1}],['a556',10,{case:10,bcop:10,primer:10,spow:1}],['a762',8,{case:8,bcop:8,primer:8,spow:1}],['a308',5,{case:5,btung:5,primer:5,spow:1}]],
 gunb:[['pick2',1,{steel:3,wood:2}],['pick3',1,{steel:8,elec:3}],['pistol',1,{steel:3,scrap:4}],['pump',1,{steel:5,wood:2}],['smg',1,{steel:6,elec:1}],['ar',1,{steel:8,otitan:2,elec:2}],['sniper',1,{steel:8,otitan:3,orare:1}]]};
let FTAB='forge',FANY=false;/* FANY: sample switch, use the 제작소 anywhere */
const fBuilt=k=>((S.base.lv.fst||{})[k]|0)>0;
function openForge(tab){if(tab)FTAB=tab;const b=$('bm');b.dataset.m='forge';const ok=FANY||inBase(S.p.x,S.p.y);
 let h='<div class="sh"><h2>⚒ 제작소</h2><div class="wt">광석 → 금속 → 화약 → 탄약 · 총기'+(ok?'':' · <b style="color:#ff6a5a">거점 안에서만</b>')+'</div><button onclick="closeBase()">✕</button></div>';
 h+='<div class="flt">'+FST.map(([k,n,e])=>'<span class="chip'+(FTAB==k?' on':'')+'" data-ft="'+k+'">'+e+' '+n.slice(2)+(fBuilt(k)?'':' 🔒')+'</span>').join('')+'</div>';
 const st=FST.find(x=>x[0]==FTAB);
 if(!fBuilt(FTAB))h+='<div class="mod"><div class="ic" style="font-size:26px;text-align:center">'+st[2]+'</div><div><b>'+st[1]+' 짓기</b><div class="cost">'+costTxt(st[3])+'</div></div><button data-fb="1" '+(ok&&canPay(st[3])?'':'disabled')+'>짓기</button></div>';
 else for(const[id,n,c]of FRC[FTAB]){const can=ok&&canPay(c);h+='<div class="mod"><div class="ic"><img src="'+icon(id)+'"></div><div><b>'+NM2(id)+'</b>'+(n>1?'<span class="lv">×'+n+'</span>':'')+'<div class="cost">'+costTxt(c)+'</div></div><button data-fc="'+id+'" '+(can?'':'disabled')+'>제작</button></div>'}
 b.innerHTML=h;b.style.display='block';
 b.querySelectorAll('[data-ft]').forEach(e=>e.onclick=()=>openForge(e.dataset.ft));
 const fb=b.querySelector('[data-fb]');if(fb)fb.onclick=()=>{if(!canPay(st[3]))return;fPay(st[3]);S.base.lv.fst=S.base.lv.fst||{};S.base.lv.fst[FTAB]=1;msg('⚒ '+st[1]+'을 지었어요');openForge()};
 b.querySelectorAll('[data-fc]').forEach(e=>e.onclick=()=>{const r=FRC[FTAB].find(x=>x[0]==e.dataset.fc);if(!canPay(r[2]))return msg('재료 부족');fPay(r[2]);invAdd(S.p,r[0],r[1]);msg('⚒ '+NM2(r[0])+(r[1]>1?' ×'+r[1]:'')+' 제작');openForge()})}
function fPay(c){if(useStash())pay(c);else for(const k in c)invTake(S.p,k,c[k])}
{const _ob=openBase;openBase=function(){_ob.apply(this,arguments);if(!S||$('forgeOpen'))return;const h=$('bm').querySelector('h2');if(h)h.insertAdjacentHTML('afterend','<button id="forgeOpen" style="float:right;padding:4px 10px;font-size:12px;width:auto;margin-left:4px" onclick="openForge()">⚒ 제작소</button>')}}
if(typeof RCP2!='undefined'&&!RCP2.some(q=>q[0]=='pick1'))RCP2.push(['pick1',{scrap:6,wood:3},['bench',1,'작업대 Lv1']]);
if(typeof GLOOT!='undefined'){GLOOT.hard=(GLOOT.hard||[]).concat(['pick1']);GLOOT.ware=(GLOOT.ware||[]).concat(['pick1'])}
/* ---------- icons ---------- */
{const K='#1d1714';for(const[id,,lv,c,c2]of ORES)IC[id]=()=>{blob(12,13,9,7,K);blob(12,13,8,6,'#5a554b');R('#6b6558',6,8,12,2);for(let i=0;i<5;i++){const x=6+(i*5)%12,y=10+(i*3)%7;R(c,x,y,4,3);R(c2,x,y,2,1)}};
 const bar=(c,c2)=>()=>{R(K,3,9,18,10);R(c,4,10,16,8);R(c2,6,10,12,2);R(K,4,17,16,1)};
 IC.iiron=bar('#8a8e94','#c0c4c8');IC.icopper=bar('#c07a3a','#e8a868');IC.ilead=bar('#5a6068','#8a9098');IC.izinc=bar('#a8b0b8','#e0e8f0');IC.steel=()=>{bar('#5a6470','#9aa6b4')();R('#c9ced3',8,13,8,1)};IC.brass=bar('#c9a030','#f0d070');
 const sack=c=>()=>{R(K,5,6,14,16);R('#c9b48f',6,7,12,14);R('#b8a47f',6,7,12,2);R(K,9,4,6,3);blob(12,15,4,3,c)};IC.bpow=sack('#2a2a2a');IC.spow=sack('#7a8a9a');
 IC.case=()=>{for(let i=0;i<3;i++){R(K,4+i*6,6,5,14);R('#c9a030',5+i*6,7,3,12);R('#f0d070',5+i*6,7,1,12)}};IC.primer=()=>{for(let i=0;i<4;i++){blob(7+(i%2)*10,8+(i>>1)*9,4,4,K);blob(7+(i%2)*10,8+(i>>1)*9,3,3,'#c07a3a');R('#e8c060',6+(i%2)*10,7+(i>>1)*9,2,2)}};
 const bul=c=>()=>{for(let i=0;i<3;i++){R(K,4+i*6,8,5,12);R(c,5+i*6,9,3,10);R(K,5+i*6,6,3,3);R(c,6+i*6,7,1,2)}};IC.blead=bul('#7a8088');IC.bcop=bul('#c07a3a');IC.btung=bul('#3e4250');
 const pk=(h,s)=>()=>{R(K,10,6,4,17);R('#8a5a34',11,7,2,15);R(K,2,3,20,6);R(h,3,4,18,4);R(s,3,4,18,1);R(K,2,8,3,3);R(K,19,8,3,3)};IC.pick1=pk('#7a7e84','#a8acb2');IC.pick2=pk('#4a5460','#9aa6b4');
 IC.pick3=()=>{R(K,4,8,12,10);R('#e0b03a',5,9,10,8);R('#f4d36a',5,9,10,2);R(K,15,11,7,4);R('#9aa0a6',16,12,6,2);R(K,7,17,4,6);R('#3a3f45',8,18,2,4)}}
