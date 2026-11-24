/* PROJECT LEGACY — sample: a mine dug down from the base, and the ore → ingot → powder → ammo / gun chain.
   · At the base, dig a shaft (pickaxe) and climb down: the whole block underground is solid dirt and stone you tunnel through.
     Ores sit in the rock; the further you dig from the ladder, the rarer they get.
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
/* ---------- the base mine: a block of dirt and stone under the base ---------- */
for(const[id,n,w,d]of[['dirt','흙',.5,'광산에서 파낸 흙 · 시멘트 재료'],['stone','돌',1,'광산에서 캔 돌 · 시멘트 · 벽 재료']])if(!I_BY[id]){const it=[id,n,'m','c',w,d];ITEMS.push(it);I_BY[id]=it}
const TS=32,MCOLS=BW/TS|0,MROWS=BH/TS|0,MLAD=[2,1];
const MINE0=()=>S.base.mine=S.base.mine||{seed:1+(Math.random()*9999|0),dug:{},hole:0};
function oreRoll(Rn,maxLv,zn){const w=ORES.filter(o=>o[2]<=maxLv).map(o=>[o,o[2]==1?10:o[2]==2?5+zn:Math.min(8,1+zn*1.2)]),t=w.reduce((a,b)=>a+b[1],0);let r=Rn()*t;for(const[o,v]of w){r-=v;if(r<=0)return o[0]}return w[0][0][0]}
/* what sits in each cell: dirt near the ladder, stone further down, ores get likelier and rarer with distance */
function mCell(c,r){const sd=MINE0().seed,d=Math.hypot(c-MLAD[0],r-MLAD[1]);if(hh2(c,r,sd+5)<.045+d*.006){const lv=d<7?1:d<14?2:3;return oreRoll(mulberry(sd*977+c*131+r*17),lv,d/4)}
 return hh2(c,r,sd)<Math.max(.08,.85-d*.045)?'dirt':'stone'}
const mOpen=(c,r)=>Math.abs(c-MLAD[0])<=1&&r>=MLAD[1]-1&&r<=MLAD[1]+2;
FLOORS.mineF=(x,y,w,h)=>{R('#241a13',x,y,w,h);for(let i=0;i<w*h/140;i++)R(hh2(i,x,y)<.5?'#2e2219':'#1c140e',x+hh2(i,3,x)*w|0,y+hh2(i,5,y)*h|0,3,2)};
const MCOL={dirt:['#5a4030','#6e5040','#3e2a1c'],stone:['#5c5852','#706b63','#45423d']};
P('mtile','암반',null,o=>{const{x,y,w,h}=o,m=o.m,ore=ORE_BY[m],C=MCOL[ore?'stone':m];R(C[2],x,y,w,h);R(C[0],x,y,w,h-5);R(C[1],x,y,w,4);
 for(let i=0;i<4;i++){const px=x+3+hh2(o.mc,o.mr,i)*(w-8)|0,py=y+6+hh2(o.mr,o.mc,i+9)*(h-16)|0;R(C[2],px,py,3,2)}
 if(ore)for(let i=0;i<5;i++){const px=x+4+hh2(o.mc,o.mr,i+20)*(w-10)|0,py=y+5+hh2(o.mr,o.mc,i+30)*(h-14)|0;R('#1d1714',px-1,py-1,6,5);R(ore[3],px,py,4,3);R(ore[4],px,py,2,1)}
 if(o.crack){const k=o.crack;R('#1d1714',x+w/2-1,y+4,2,h*k*.7);R('#1d1714',x+6,y+h/2,w*k*.6,2)}});
P('mshaft','광산 입구',null,o=>{const{x,y,w,h}=o;R('#3a2818',x-6,y-4,w+12,h+10);R('#0c0806',x+4,y+4,w-8,h-6);R('#7a5a34',x,y,w,5);R('#7a5a34',x,y,5,h);R('#7a5a34',x+w-5,y,5,h);R('#5a4024',x,y+4,w,2);
 R('#8a9096',x+w/2-8,y-26,3,h+18);R('#8a9096',x+w/2+5,y-26,3,h+18);for(let i=0;i<5;i++)R('#6a7076',x+w/2-8,y-22+i*8,16,2);R('#e0b03a',x+w-12,y-14,8,10);R('#1d1714',x+w-11,y-13,6,1)});
P('mspot','팔 자리',null,o=>{const{x,y,w,h}=o;R('#5a4030',x,y,w,h);R('#6e5040',x+4,y+4,w-8,h-10);R('#3e2a1c',x,y+h-4,w,4);R('#c9ced3',x+w/2-1,y-18,2,22);R('#e0b03a',x+w/2-8,y-20,16,5);R('#1d1714',x+w/2-8,y-16,16,1)});
function buildMine(){newWorld();const c=(NBX-1)/2|0,r=(NBY-1)/2|0,A=Bld('지하 광산',c,r,'dun'),gx=OGX+c,gy=OGY+r,M=MINE0();A.fl(0,0,BW,BH,'mineF');
 for(let j=0;j<MROWS;j++)for(let i=0;i<MCOLS;i++){if(mOpen(i,j)||M.dug[i+','+j])continue;A.o('mtile',i*TS,j*TS,TS,TS,{m:mCell(i,j),mc:i,mr:j})}
 A.o('ladder',MLAD[0]*TS+2,MLAD[1]*TS-4,28,22);A.light(MLAD[0]*TS+16,MLAD[1]*TS+20,150,.55,'255,220,160');
 {const[ox,oy]=bo(c,r);for(const[x,y,w,h]of[[0,0,WW,oy-4],[0,oy+BH+4,WW,WH],[0,0,ox-4,WH],[ox+BW+4,0,WW,WH]])W0.dec.push({x,y,w,h,f:()=>R('#0b0c0e',x,y,w,h)})}
 for(const b of W0.b)Object.assign(b,{gx,gy,zone:0,gk:'mine'});W0.objs.forEach(o=>o.id='mine:'+(o.mc!=null?o.mc+','+o.mr:o.t));
 W0.base=Object.assign({},W0.base||{},(()=>{const[ox,oy]=bo(-OGX,-OGY);return{ox,oy,...BASE}})());W0.car=SURF?SURF.carW:W0.car;return W0}
{const _bd=buildDungeon;buildDungeon=function(){if(DUN&&DUN.sh=='mine')return buildMine();return _bd()}}
function mineEnter(){const p=S.p,c=(NBX-1)/2|0,r=(NBY-1)/2|0,[ox,oy]=bo(c,r);SURF={x:p.x,y:p.y,Z,dec,carW:W0.car};DUN={sh:'mine',seed:MINE0().seed,gk:'mine'};Z=[];dec=[];
 buildWorld();infDerived();addSolid({x:0,y:0,w:WW,h:oy,wall:1});addSolid({x:0,y:oy+BH,w:WW,h:WH-oy-BH,wall:1});addSolid({x:0,y:oy,w:ox,h:BH,wall:1});addSolid({x:ox+BW,y:oy,w:WW-ox-BW,h:BH,wall:1});
 p.x=ox+MLAD[0]*TS+16;p.y=oy+(MLAD[1]+2)*TS+8;document.body.dataset.dun='mine';msg('⛏ 지하 광산 · 아주 어두워요 (조명 필수) · 공격 버튼이나 [⛏ 파기]로 앞의 흙 · 돌 · 광석을 캐요 · 사다리에서 [⬆ 지상으로]')}
{const _de=dunExit;dunExit=function(){const mine=DUN&&DUN.sh=='mine';_de();if(mine)rebuildBase()}}
/* ---------- digging ---------- */
let MINE=null,DIGS=null;
function mineTarget(){if(!DUN||DUN.sh!='mine')return null;const p=S.p,fx=p.fx||0,fy=p.fy||1,n=Math.hypot(fx,fy)||1;let b=null,bs=1e9;
 for(const o of W0.objs){if(o.t!='mtile')continue;const cx=o.x+TS/2,cy=o.y+TS/2,d=Math.hypot(cx-p.x,cy-(p.y-8));if(d>50)continue;const dot=((cx-p.x)*fx+(cy-(p.y-8))*fy)/(d*n||1),s=d-dot*24;if(s<bs){bs=s;b=o}}return b}
const needLv=o=>ORE_BY[o.m]?ORE_BY[o.m][2]:1,digT=(o,lv)=>(o.m=='dirt'?.7:ORE_BY[o.m]?1.5:1.1)*[0,1,.75,.5][lv];
function startDig(o){const p=S.p,lv=pickLv(p);if(!lv)return msg('⛏ 곡괭이가 필요해요 (작업대 Lv1에서 제작)');if(lv<needLv(o))return msg('⛏ '+NM2(o.m)+'은(는) 곡괭이 Lv'+needLv(o)+'이 필요해요');MINE={o,t:0,T:digT(o,lv),x:p.x,y:p.y}}
function rmSolid(o){for(let i=SOL.length-1;i>=0;i--)if(SOL[i].o===o){const r=SOL[i];SOL.splice(i,1);for(const c of GRID){const k=c.indexOf(r);if(k>=0)c.splice(k,1)}}const i=W0.objs.indexOf(o);if(i>=0)W0.objs.splice(i,1)}
function digDone(o){const p=S.p,M=MINE0(),ore=ORE_BY[o.m];rmSolid(o);M.dug[o.mc+','+o.mr]=1;noise(o.x+16,o.y+16,ore?3:2);try{sfx((a,t)=>{nz(a,t,{f:ore?2200:900,q:2,v:.25,d:.1,type:'bandpass'})})}catch(e){}
 const got={};if(ore){got[o.m]=1+(Math.random()<.35?1:0);got.stone=1}else got[o.m]=1;if(o.m=='stone'&&Math.random()<.12)got.coal=1;for(const k in got)invAdd(p,k,got[k]);
 s3Float(o.x+16,o.y-6,Object.entries(got).map(([k,n])=>'+'+n+' '+NM2(k)).join(' '),ore?ore[4]:'#e8d7a8');if(typeof s3Xp=='function')s3Xp(ore?5*ore[2]:1,'채굴');S.mineN=(S.mineN||0)+1;
 if(Math.random()<.05){mk(o.x+16,o.y+20,{look:'crawler'});msg('🕳 바위 속에서 크롤러가 튀어나왔어요!')}}
{const _c=dmCtx;dmCtx=function(){const B=_c();const p=S.p;
  if(DUN&&DUN.sh=='mine'){if(MINE)B.unshift({t:'⛏ 파는 중… '+Math.round(MINE.t/MINE.T*100)+'%',f:()=>{MINE=null},big:1});else{const o=mineTarget();if(o){const lv=pickLv(p),nl=needLv(o);B.unshift(!lv?{t:'⛏ '+NM2(o.m)+' · 곡괭이가 필요해요',f:null,info:1}:lv<nl?{t:'⛏ '+NM2(o.m)+' · 곡괭이 Lv'+nl+' 필요',f:null,info:1}:{t:'⛏ 파기 · '+NM2(o.m),f:()=>startDig(o),big:1})}}return B}
  if(DUN||!S.base||!inBase(p.x,p.y))return B;const M=MINE0(),sx=BL.ox+MSPOT[0]+28,sy=BL.oy+MSPOT[1]+20;
  if(Math.hypot(p.x-sx,p.y-sy)<70){if(M.hole)B.unshift({t:'⛏ 광산으로 내려가기',f:mineEnter,big:1});else if(DIGS)B.unshift({t:'⛏ 땅 파는 중… '+Math.round(DIGS.t/DIGS.T*100)+'%',f:null,info:1});else B.unshift(pickLv(p)?{t:'⛏ 땅 파고 광산 만들기 (6초)',f:()=>{DIGS={t:0,T:6,x:p.x,y:p.y}},big:1}:{t:'⛏ 광산 자리 · 곡괭이가 필요해요 (작업대 Lv1)',f:null,info:1})}
  for(const[k,n]of FST){const L=FPOS[k];if(!fBuilt(k))continue;if(Math.hypot(p.x-(BL.ox+L[0]+L[2]/2),p.y-(BL.oy+L[1]+L[3]/2))<70)B.unshift({t:'⚒ '+n.slice(2),f:()=>openForge(k),big:1})}
  if(Math.hypot(p.x-(BL.ox+FPOS.forge[0]),p.y-(BL.oy+FPOS.forge[1]))<120&&!FST.every(([k])=>fBuilt(k)))B.push({t:'⚒ 제작소 짓기',f:()=>openForge(FST.find(([k])=>!fBuilt(k))[0])});return B}}
{const _ga=gearAct;gearAct=function(){if(DUN&&DUN.sh=='mine'&&!MINE&&pickLv(S.p)){const p=S.p,o=mineTarget(),z=Z.some(q=>Math.hypot(q.x-p.x,q.y-p.y)<70);if(o&&!z){startDig(o);return}}return _ga()}}
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!S)return;const p=S.p;
  if(DIGS){if(Math.hypot(p.x-DIGS.x,p.y-DIGS.y)>24){DIGS=null}else{DIGS.t+=dt;if((DIGS.t*2|0)!=((DIGS.t-dt)*2|0))noise(p.x,p.y,2);if(DIGS.t>=DIGS.T){DIGS=null;MINE0().hole=1;rebuildBase();msg('⛏ 광산 입구를 팠어요 · [⛏ 광산으로 내려가기]')}}}
  if(!MINE)return;if(!DUN||Math.hypot(p.x-MINE.x,p.y-MINE.y)>24||!W0.objs.includes(MINE.o)){if(MINE.o)MINE.o.crack=0;MINE=null;return}
  MINE.t+=dt;MINE.o.crack=Math.min(1,MINE.t/MINE.T);if(MINE.t>=MINE.T){const o=MINE.o;MINE=null;digDone(o)}}}
/* ---------- the workshop and the shaft at the base ---------- */
const MSPOT=[690,140],FPOS={forge:[190,128,54,44],powder:[262,142,60,30],ammob:[340,138,50,36],gunb:[540,142,90,30]};
{const _bp=baseProps;baseProps=function(lv,wh){const out=_bp(lv,wh),b=W0.base;if(!b||!S||!S.base)return out;const o=(t,x,y,w,h,q={})=>out.push({t,x:b.ox+x,y:b.oy+y,w,h,base:1,...q});const M=MINE0();
  o(M.hole?'mshaft':'mspot',MSPOT[0],MSPOT[1],56,40);for(const[k]of FST)if(fBuilt(k)){const L=FPOS[k];o('st_'+k,L[0],L[1],L[2],L[3])}return out}}
{const _rb=rebuildBase;rebuildBase=function(){_rb();if(DUN&&DUN.sh=='mine'){BP=[];BSOL=[];return}for(let i=BSOL.length-1;i>=0;i--)if(BSOL[i].o&&BSOL[i].o.t=='mspot')BSOL.splice(i,1)}}
/* ---------- 제작소: four stations ---------- */
const FST=[['forge','① 제련로','🔥',{cement:4,scrap:10}],['powder','② 화약 제작대','🧪',{wood:6,scrap:6,cloth:2}],['ammob','③ 탄약 제작대','🔩',{scrap:12,elec:2}],['gunb','④ 총기 제작대','🔫',{scrap:15,elec:4,steel:4}]];
const FRC={forge:[['iiron',1,{oiron:2,coal:1}],['icopper',1,{ocopper:2,coal:1}],['ilead',1,{olead:2,coal:1}],['izinc',1,{ozinc:2,coal:1}],['steel',1,{iiron:2,coal:2}],['brass',1,{icopper:1,izinc:1}],['cement',1,{stone:3,dirt:1}]],
 powder:[['bpow',5,{salpet:3,coal:1,sulfur:1}],['spow',3,{bpow:3,pills:1}]],
 ammob:[['case',10,{brass:1}],['primer',10,{icopper:1,bpow:1}],['blead',10,{ilead:1}],['bcop',10,{ilead:1,icopper:1}],['btung',5,{otung:1}],
  ['a9mm',10,{case:10,blead:10,primer:10,bpow:1}],['a12g',6,{case:6,blead:12,primer:6,bpow:1}],['a556',10,{case:10,bcop:10,primer:10,spow:1}],['a762',8,{case:8,bcop:8,primer:8,spow:1}],['a308',5,{case:5,btung:5,primer:5,spow:1}]],
 gunb:[['pick2',1,{steel:3,wood:2}],['pick3',1,{steel:8,elec:3}],['pistol',1,{steel:3,scrap:4}],['pump',1,{steel:5,wood:2}],['smg',1,{steel:6,elec:1}],['ar',1,{steel:8,otitan:2,elec:2}],['sniper',1,{steel:8,otitan:3,orare:1}]]};
let FTAB='forge',FANY=false;/* FANY: sample switch, use the 제작소 anywhere */
const fBuilt=k=>((S.base.lv.fst||{})[k]|0)>0;
function openForge(tab){if(tab)FTAB=tab;const b=$('bm');b.dataset.m='forge';const ok=FANY||inBase(S.p.x,S.p.y);
 let h='<div class="sh"><h2>⚒ 제작소</h2><div class="wt">광석 → 금속 → 화약 → 탄약 · 총기'+(ok?'':' · <b style="color:#ff6a5a">거점 안에서만</b>')+'</div><button onclick="closeBase()">✕</button></div>';
 h+='<div class="flt">'+FST.map(([k,n,e])=>'<span class="chip'+(FTAB==k?' on':'')+'" data-ft="'+k+'">'+e+' '+n.slice(2)+(fBuilt(k)?'':' 🔒')+'</span>').join('')+'</div>';
 const st=FST.find(x=>x[0]==FTAB);h+='<div class="fpic"><img src="'+stPic(FTAB,!fBuilt(FTAB))+'"><div><b>'+st[1]+'</b><small>'+FDESC[FTAB]+'</small></div></div>';
 if(!fBuilt(FTAB))h+='<div class="mod"><div class="ic" style="font-size:26px;text-align:center">'+st[2]+'</div><div><b>'+st[1]+' 짓기</b><div class="cost">'+costTxt(st[3])+'</div></div><button data-fb="1" '+(ok&&canPay(st[3])?'':'disabled')+'>짓기</button></div>';
 else for(const[id,n,c]of FRC[FTAB]){const can=ok&&canPay(c);h+='<div class="mod"><div class="ic"><img src="'+icon(id)+'"></div><div><b>'+NM2(id)+'</b>'+(n>1?'<span class="lv">×'+n+'</span>':'')+'<div class="cost">'+costTxt(c)+'</div></div><button data-fc="'+id+'" '+(can?'':'disabled')+'>제작</button></div>'}
 b.innerHTML=h;b.style.display='block';
 b.querySelectorAll('[data-ft]').forEach(e=>e.onclick=()=>openForge(e.dataset.ft));
 const fb=b.querySelector('[data-fb]');if(fb)fb.onclick=()=>{if(!canPay(st[3]))return;fPay(st[3]);S.base.lv.fst=S.base.lv.fst||{};S.base.lv.fst[FTAB]=1;rebuildBase();msg('⚒ '+st[1]+'을 지었어요 · 거점에 놓였어요');openForge()};
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

/* ---------- pixel-art stations (drawn at the base, and big in the window) ---------- */
const FDESC={forge:'광석 + 석탄 → 금속 덩어리 · 강철 · 황동 · 시멘트',powder:'초석 · 석탄 · 유황을 빻아 화약을 만들어요',ammob:'탄피 · 뇌관 · 탄두 · 화약을 눌러 완성탄으로',gunb:'강철 · 티타늄으로 총과 곡괭이를 만들어요'};
const K0='#1d1714';
P('st_forge','제련로',null,o=>{const{x,y,w}=o,f=(performance.now()/120|0)%3;
 R(K0,x+2,y-34,w-4,o.h+34);for(let j=0;j<8;j++)for(let i=0;i<4;i++)R(j%2^i%2?'#8a3e2a':'#7a3424',x+4+i*12+(j%2)*6-((j%2)&&i==3?6:0),y-32+j*9,11,8);
 R('#3a2a22',x+w-18,y-58,12,26);R('#5a4034',x+w-18,y-58,12,3);R('#888',x+w-16,y-66+f,4,4);R('#666',x+w-13,y-72-f,5,5);
 R(K0,x+12,y-8,w-24,18);R(['#ff9a2e','#ffb84a','#ff7a1a'][f],x+14,y-6,w-28,14);R('#ffe08a',x+18,y-2,w-36,6);R('#3a2a22',x+2,y+o.h-8,w-4,8);
 for(let i=0;i<5;i++)R('#2a2a2a',x-10+i*4,y+o.h-6-(i%2)*3,5,4)},true);
P('st_powder','화약 제작대',null,o=>{const{x,y,w,h}=o;R(K0,x,y-14,w,h+14);R('#8a5a34',x+1,y-13,w-2,8);R('#6b4426',x+1,y-5,w-2,h+3);R('#4a2e18',x+4,y+h-8,5,8);R('#4a2e18',x+w-9,y+h-8,5,8);
 R(K0,x+8,y-26,14,13);R('#9aa0a6',x+9,y-25,12,11);R('#6a7078',x+10,y-22,10,2);R('#c9b48f',x+17,y-34,3,14);R(K0,x+26,y-24,9,11);R('#e0d040',x+27,y-23,7,9);R(K0,x+38,y-24,9,11);R('#e8e8e0',x+39,y-23,7,9);
 R(K0,x+w-12,y-30,12,17);R('#c9b48f',x+w-11,y-29,10,15);blob(x+w-6,y-21,3,3,'#2a2a2a')},true);
P('st_ammob','탄약 제작대',null,o=>{const{x,y,w,h}=o;R(K0,x,y-12,w,h+12);R('#5a6470',x+1,y-11,w-2,7);R('#3a3f45',x+1,y-4,w-2,h+2);
 R(K0,x+8,y-46,10,36);R('#9aa0a6',x+9,y-45,8,34);R('#c9ced3',x+9,y-45,2,34);R(K0,x+4,y-50,26,6);R('#c43c32',x+5,y-49,24,4);R(K0,x+26,y-56,3,10);blob(x+27,y-57,3,3,'#1d1714');
 for(let i=0;i<3;i++)for(let j=0;j<2;j++){R('#c9a030',x+24+i*6,y-20+j*5,4,4);R('#f0d070',x+24+i*6,y-20+j*5,4,1)}},true);
P('st_gunb','총기 제작대',null,o=>{const{x,y,w,h}=o;R(K0,x,y-14,w,h+14);R('#7a5a34',x+1,y-13,w-2,8);R('#5a4024',x+1,y-5,w-2,h+3);R('#3a2818',x+4,y+h-8,6,8);R('#3a2818',x+w-10,y+h-8,6,8);
 R(K0,x+6,y-40,w-12,24);R('#8a6a42',x+7,y-39,w-14,22);for(let i=0;i<6;i++)R('#5a4024',x+10+i*12,y-36,2,2);R('#3a3f45',x+12,y-32,18,3);R('#9aa0a6',x+38,y-33,3,12);R('#c43c32',x+50,y-32,10,4);
 R(K0,x+14,y-22,46,7);R('#3a3f45',x+15,y-21,44,5);R('#6b4426',x+50,y-21,9,5);R(K0,x+w-22,y-24,14,10);R('#6a7078',x+w-21,y-23,12,8);R('#9aa0a6',x+w-18,y-30,6,7)},true);
const STPIC={};
function stPic(k,ghost){const key=k+(ghost?'g':'');if(STPIC[key])return STPIC[key];const L=FPOS[k],c=document.createElement('canvas');c.width=(L[2]+40)*2;c.height=(L[3]+80)*2;const o=g;g=c.getContext('2d');g.imageSmoothingEnabled=false;g.scale(2,2);
 if(ghost)g.globalAlpha=.35;try{D['st_'+k]({x:20,y:72,w:L[2],h:L[3]})}catch(e){}g=o;return STPIC[key]=c.toDataURL()}
document.head.insertAdjacentHTML('beforeend','<style>#bm .fpic{display:flex;gap:10px;align-items:center;margin:8px 0;padding:8px;border-radius:10px;background:#ffffff0a}#bm .fpic img{height:96px;image-rendering:pixelated}#bm .fpic b{display:block}#bm .fpic small{color:var(--mut);font-size:11px}</style>');
