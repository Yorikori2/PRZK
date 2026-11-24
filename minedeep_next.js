/* PROJECT LEGACY — sample: deeper mine floors.
   1층 (today's mine) → dig a shaft down from deep in 1층 → 2층 깊은 갱도 → shaft again → 3층 심층.
   · 2층: no dirt, 단단한 암반 (pickaxe Lv2) · twice the ore · Lv3 ore from 5 cells out · natural caves with crawlers and sleepers.
   · 3층: 심층암 (Lv3) · dense rare ore · hidden 가스 주머니 (poison unless you wear a gas mask) · caves with brutes,
     and a 번식체 nest in the deepest cave.
   Loaded after mine_next.js. */
'use strict';
for(const[id,n,d]of[['hrock','단단한 암반','2층 · 곡괭이 Lv2 · 돌 2개'],['drock','심층암','3층 · 곡괭이 Lv3 · 돌 2개 · 석탄'],['gasr','가스 주머니','3층 · 깨면 독가스 (방독면)']])if(!I_BY[id]){const it=[id,n,'m','c',1,d];ITEMS.push(it);I_BY[id]=it}
Object.assign(MCOL,{hrock:['#4a4a52','#5c5c66','#36363c'],drock:['#3a3440','#4a4352','#2a2530'],gasr:['#3a3440','#4a4352','#2a2530']});
FLOORS.mineF2=(x,y,w,h)=>{R('#1c1a20',x,y,w,h);for(let i=0;i<w*h/140;i++)R(hh2(i,x,y)<.5?'#24222a':'#141218',x+hh2(i,3,x)*w|0,y+hh2(i,5,y)*h|0,3,2)};
FLOORS.mineF3=(x,y,w,h)=>{R('#18121c',x,y,w,h);for(let i=0;i<w*h/140;i++)R(hh2(i,x,y)<.5?'#22182a':'#100a14',x+hh2(i,3,x)*w|0,y+hh2(i,5,y)*h|0,3,2);for(let i=0;i<w*h/2200;i++)R('#5a3a7a',x+hh2(i,7,x)*w|0,y+hh2(i,9,y)*h|0,2,2)};
/* gas pockets look like deep rock with a faint green seam */
{const _d=D.mtile;D.mtile=function(o){_d(o);if(o.m=='gasr'){const{x,y}=o;R('#4a7a3a',x+8,y+10,14,1);R('#4a7a3a',x+12,y+15,9,1)}}}
const mLv=()=>DUN&&DUN.sh=='mine'?DUN.lv||1:1;
const mDug=lv=>{const M=MINE0();if(lv==1)return M.dug;M.dugF=M.dugF||{};return M.dugF[lv]=M.dugF[lv]||{}};
const mUp=lv=>lv==1?MLAD:(MINE0().down||{})[lv-1];
/* natural caves on 2층 and 3층 (same every visit) */
function mCaves(lv){if(lv<2)return[];const sd=MINE0().seed+lv*1000,L=mUp(lv),out=[];for(let k=0;k<(lv==2?4:5);k++){let c,r,t=0;do{c=2+hh2(k,t,sd)*(MCOLS-4)|0;r=2+hh2(t,k,sd+1)*(MROWS-4)|0;t++}while(t<40&&Math.hypot(c-L[0],r-L[1])<7);out.push({c,r,rad:1.4+hh2(k,9,sd)*1.3})}return out}
const inCave=(cv,c,r)=>cv.some(q=>Math.hypot(c-q.c,(r-q.r)*1.2)<q.rad);
{const _mc=mCell;mCell=function(c,r){const lv=mLv();if(lv==1)return _mc(c,r);const sd=MINE0().seed+lv*77,L=mUp(lv),d=Math.hypot(c-L[0],r-L[1]);
  if(lv==3&&hh2(c,r,sd+11)<.035)return'gasr';
  if(hh2(c,r,sd+5)<Math.min(.6,(.045+d*.006)*(lv==2?2:3))){const mx=lv==2?(d<5?2:3):3;return oreRoll(mulberry(sd*977+c*131+r*17),mx,lv==2?d/2+2:d/2+6)}
  return lv==2?'hrock':'drock'}}
buildMine=function(){newWorld();const c=(NBX-1)/2|0,r=(NBY-1)/2|0,lv=mLv(),A=Bld(['','지하 광산 1층','깊은 갱도 2층','심층 3층'][lv],c,r,'dun'),gx=OGX+c,gy=OGY+r,M=MINE0(),L=mUp(lv),dug=mDug(lv),cv=mCaves(lv),dn=(M.down||{})[lv];
 A.fl(0,0,BW,BH,lv==1?'mineF':'mineF'+lv);
 const open=(i,j)=>(Math.abs(i-L[0])<=1&&j>=L[1]-1&&j<=L[1]+2)||(dn&&Math.abs(i-dn[0])<=1&&Math.abs(j-dn[1])<=1)||dug[i+','+j]||inCave(cv,i,j);
 for(let j=0;j<MROWS;j++)for(let i=0;i<MCOLS;i++){if(open(i,j))continue;A.o('mtile',i*TS,j*TS,TS,TS,{m:mCell(i,j),mc:i,mr:j})}
 A.o('ladder',L[0]*TS+2,L[1]*TS-4,28,22);A.light(L[0]*TS+16,L[1]*TS+20,150,.55,'255,220,160');if(dn){A.o('mhole',dn[0]*TS,dn[1]*TS,TS,TS);A.light(dn[0]*TS+16,dn[1]*TS+16,90,.3,'255,200,140')}
 {const[ox,oy]=bo(c,r);for(const[x,y,w,h]of[[0,0,WW,oy-4],[0,oy+BH+4,WW,WH],[0,0,ox-4,WH],[ox+BW+4,0,WW,WH]])W0.dec.push({x,y,w,h,f:()=>R('#0b0c0e',x,y,w,h)})}
 for(const b of W0.b)Object.assign(b,{gx,gy,zone:0,gk:'mine'+lv});W0.objs.forEach(o=>o.id='mine'+lv+':'+(o.mc!=null?o.mc+','+o.mr:o.t));
 W0.base=Object.assign({},W0.base||{},(()=>{const[ox,oy]=bo(-OGX,-OGY);return{ox,oy,...BASE}})());W0.car=SURF?SURF.carW:W0.car;return W0};
P('mhole','아래층 구멍',null,o=>{const{x,y,w,h}=o;R('#000',x+2,y+2,w-4,h-4);R('#3a2818',x,y,w,3);R('#3a2818',x,y,3,h);R('#3a2818',x+w-3,y,3,h);R('#8a9096',x+9,y+2,2,h-4);R('#8a9096',x+w-11,y+2,2,h-4);for(let i=0;i<3;i++)R('#6a7076',x+9,y+6+i*8,w-18,2)},false);
/* digging: harder rock needs better picks; what each cell gives */
const needLv2=o=>o.m=='hrock'?2:o.m=='drock'||o.m=='gasr'?3:ORE_BY[o.m]?ORE_BY[o.m][2]:1;
startDig=function(o){const p=S.p,lv=pickLv(p),nl=needLv2(o);if(!lv)return msg('⛏ 곡괭이가 필요해요 (작업대 Lv1에서 제작)');if(lv<nl)return msg('⛏ '+NM2(o.m)+'은(는) 곡괭이 Lv'+nl+'이 필요해요');
 MINE={o,t:0,T:(o.m=='dirt'?.7:ORE_BY[o.m]?1.5:o.m=='stone'?1.1:1.4)*[0,1,.75,.5][lv]*(mLv()==3?1.2:1),x:p.x,y:p.y}};
{const _dd=digDone;digDone=function(o){const lv=mLv();if(lv==1&&!/rock|gasr/.test(o.m))return _dd(o);const p=S.p,ore=ORE_BY[o.m];rmSolid(o);mDug(lv)[o.mc+','+o.mr]=1;noise(o.x+16,o.y+16,ore?3:2);
  const got={};if(o.m=='gasr'){S.mgas=(S.mgas||[]).concat([{x:o.x+16,y:o.y+16,t:10}]);msg(spec('gasmask')?'😷 가스 주머니가 터졌어요 · 방독면이 막아 줘요':'☠ 가스 주머니가 터졌어요! 방독면이 없으면 피하세요')}
  else if(ore){got[o.m]=1+(Math.random()<(lv==3?.6:.45)?1:0);got.stone=1}else{got.stone=2;if(o.m=='drock'&&Math.random()<.15)got.coal=1}
  for(const k in got)invAdd(p,k,got[k]);if(Object.keys(got).length)s3Float(o.x+16,o.y-6,Object.entries(got).map(([k,n])=>'+'+n+' '+NM2(k)).join(' '),ore?ore[4]:'#c9c4d8');
  if(typeof s3Xp=='function')s3Xp(ore?5*ore[2]*lv:lv,'채굴');if(Math.random()<.04*lv){mk(o.x+16,o.y+20,{look:lv==3&&Math.random()<.3?'brute':'crawler'});msg('🕳 바위 속에서 좀비가 튀어나왔어요!')}}}
/* gas clouds */
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!S||!S.mgas||!S.mgas.length)return;const p=S.p;S.mgas=S.mgas.filter(g2=>{g2.t-=dt;if(mLv()==3&&Math.hypot(p.x-g2.x,p.y-g2.y)<80&&!spec('gasmask'))p.hp-=6*dt;return g2.t>0&&DUN})}}
OVL.push((g2,sx,sy,k)=>{for(const q of S.mgas||[]){const a=Math.min(.45,q.t/10*.5),X=sx(q.x),Y=sy(q.y);const gr=g2.createRadialGradient(X,Y,0,X,Y,85*k);gr.addColorStop(0,'rgba(120,200,60,'+a+')');gr.addColorStop(1,'rgba(120,200,60,0)');g2.fillStyle=gr;g2.fillRect(X-85*k,Y-85*k,170*k,170*k)}});
/* floors are darker the deeper you go */
{const _dl=darkLv;darkLv=function(){const d=_dl();return DUN&&DUN.sh=='mine'?Math.max(d,[0,.85,.9,.94][mLv()]):d}}
/* ---------- moving between floors ---------- */
let MDOWN=null;
function mineGo(lv,cell){const p=S.p,c=(NBX-1)/2|0,r=(NBY-1)/2|0,[ox,oy]=bo(c,r);DUN.lv=lv;MINE=null;MDOWN=null;S.mgas=[];Z=[];dec=[];buildWorld();infDerived();
 addSolid({x:0,y:0,w:WW,h:oy,wall:1});addSolid({x:0,y:oy+BH,w:WW,h:WH-oy-BH,wall:1});addSolid({x:0,y:oy,w:ox,h:BH,wall:1});addSolid({x:ox+BW,y:oy,w:WW-ox-BW,h:BH,wall:1});
 p.x=ox+cell[0]*TS+16;p.y=oy+cell[1]*TS+(cell===MLAD||cell==mUp(lv)?2*TS+8:28);
 const cv=mCaves(lv);cv.forEach((q,i)=>{const n=lv==2?2+(i%2):2;for(let k=0;k<n;k++)mk(ox+q.c*TS+16+(k-1)*14,oy+q.r*TS+16,{look:lv==3&&k==0?'brute':k%2?'sleeper':'crawler'})});
 if(lv==3&&cv.length){const L=mUp(3),far=cv.slice().sort((a,b)=>Math.hypot(b.c-L[0],b.r-L[1])-Math.hypot(a.c-L[0],a.r-L[1]))[0];mk(ox+far.c*TS+16,oy+far.r*TS+16,{look:'brood'})}
 for(const z of Z)z.sleep=z.look=='sleeper'?1:z.sleep;
 msg(['','⛏ 1층으로 올라왔어요','⛏ 2층 깊은 갱도 · 단단한 암반 (곡괭이 Lv2) · 광석 2배 · 천연 동굴에 크롤러와 잠복자','⛏ 3층 심층 · 심층암 (곡괭이 Lv3) · 희귀 광석이 많아요 · 가스 주머니 조심 (방독면) · 가장 깊은 동굴에 번식체 둥지'][lv])}
{const _c=dmCtx;dmCtx=function(){let B=_c();if(!DUN||DUN.sh!='mine')return B;const p=S.p,lv=mLv(),M=MINE0(),[ox,oy]=bo((NBX-1)/2|0,(NBY-1)/2|0),pc=[(p.x-ox)/TS|0,(p.y-8-oy)/TS|0],L=mUp(lv),dn=(M.down||{})[lv];
  /* fix the dig prompt for the new rock */
  const o=!MINE&&mineTarget();if(o)B=B.filter(q=>!/^⛏ (파기|.*곡괭이)/.test(q.t)).concat([]);if(o){const pl=pickLv(p),nl=needLv2(o);B.unshift(!pl?{t:'⛏ '+NM2(o.m)+' · 곡괭이가 필요해요',f:null,info:1}:pl<nl?{t:'⛏ '+NM2(o.m)+' · 곡괭이 Lv'+nl+' 필요',f:null,info:1}:{t:'⛏ 파기 · '+NM2(o.m),f:()=>startDig(o),big:1})}
  if(lv>1){B=B.filter(q=>!/지상으로/.test(q.t));if(Math.hypot(p.x-(ox+L[0]*TS+16),p.y-(oy+L[1]*TS+10))<85)B.unshift({t:'⬆ '+(lv-1)+'층으로',f:()=>mineGo(lv-1,M.down[lv-1]),big:1})}
  if(dn&&Math.hypot(p.x-(ox+dn[0]*TS+16),p.y-(oy+dn[1]*TS+16))<50)B.unshift({t:'⬇ '+(lv+1)+'층으로',f:()=>mineGo(lv+1,dn),big:1});
  else if(!dn&&lv<3){const far=Math.hypot(pc[0]-L[0],pc[1]-L[1]);if(MDOWN)B.unshift({t:'⬇ 아래로 파는 중… '+Math.round(MDOWN.t/MDOWN.T*100)+'%',f:null,info:1});
   else if(far>=10)B.push(pickLv(p)>lv?{t:'⬇ 여기서 '+(lv+1)+'층으로 파 내려가기 (8초)',f:()=>{MDOWN={t:0,T:8,x:p.x,y:p.y,c:pc}}}:{t:'⬇ 아래층으로 파려면 곡괭이 Lv'+(lv+1),f:null,info:1})}
  return B}}
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!MDOWN||!S)return;const p=S.p;if(Math.hypot(p.x-MDOWN.x,p.y-MDOWN.y)>24){MDOWN=null;return}MDOWN.t+=dt;if((MDOWN.t*2|0)!=((MDOWN.t-dt)*2|0))noise(p.x,p.y,3);
  if(MDOWN.t>=MDOWN.T){const lv=mLv(),M=MINE0();M.down=M.down||{};M.down[lv]=MDOWN.c;mDug(lv)[MDOWN.c[0]+','+MDOWN.c[1]]=1;MDOWN=null;mineGo(lv+1,M.down[lv])}}}
{const _de=dunExit;dunExit=function(){if(DUN&&DUN.sh=='mine')DUN.lv=1;MDOWN=null;return _de()}}
