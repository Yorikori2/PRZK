/* PROJECT LEGACY — sample: the big mine.
   · The mine under the base now spans 3×3 blocks (about 92 × 74 cells) on every floor.
   · Every cell breaks with the attack swing: it cracks, shakes and bursts into debris; the cell you will hit is outlined
     with its name and health.
   · The far exit (오른쪽 아래 끝) climbs out to the surface as far from the base shaft as the mine goes.
   · Floors: 1층 → (dig down far from the ladder) 2층 깊은 갱도 → 3층 심층.
   Loaded after mine_next.js. */
'use strict';
for(const[id,n,d]of[['hrock','단단한 암반','2층 · 곡괭이 Lv2 · 돌 2개'],['drock','심층암','3층 · 곡괭이 Lv3 · 돌 2개 · 석탄'],['gasr','가스 주머니','3층 · 깨면 독가스 (방독면)']])if(!I_BY[id]){const it=[id,n,'m','c',1,d];ITEMS.push(it);I_BY[id]=it}
Object.assign(MCOL,{hrock:['#4a4a52','#5c5c66','#36363c'],drock:['#3a3440','#4a4352','#2a2530'],gasr:['#3a3440','#4a4352','#2a2530']});
FLOORS.mineF2=(x,y,w,h)=>{R('#1c1a20',x,y,w,h);for(let i=0;i<w*h/140;i++)R(hh2(i,x,y)<.5?'#24222a':'#141218',x+hh2(i,3,x)*w|0,y+hh2(i,5,y)*h|0,3,2)};
FLOORS.mineF3=(x,y,w,h)=>{R('#18121c',x,y,w,h);for(let i=0;i<w*h/140;i++)R(hh2(i,x,y)<.5?'#22182a':'#100a14',x+hh2(i,3,x)*w|0,y+hh2(i,5,y)*h|0,3,2);for(let i=0;i<w*h/2200;i++)R('#5a3a7a',x+hh2(i,7,x)*w|0,y+hh2(i,9,y)*h|0,2,2)};
/* ---------- geometry: 3×3 blocks around the middle of the window ---------- */
function MREG(){const c=(NBX-1)/2|0,r=(NBY-1)/2|0,a=Math.max(0,c-1),b=Math.max(0,r-1),a1=Math.min(NBX-1,c+1),b1=Math.min(NBY-1,r+1),[x0,y0]=bo(a,b),[x1,y1]=bo(a1,b1);return{x0,y0,cols:Math.floor((x1+BW-x0)/TS),rows:Math.floor((y1+BH-y0)/TS),c,r}}
const mExit=()=>{const R0=MREG();return[R0.cols-4,R0.rows-3]};
const mLv=()=>DUN&&DUN.sh=='mine'?DUN.lv||1:1;
const mDug=lv=>{const M=MINE0();if(lv==1)return M.dug;M.dugF=M.dugF||{};return M.dugF[lv]=M.dugF[lv]||{}};
const mUp=lv=>lv==1?MLAD:(MINE0().down||{})[lv-1];
/* hooks other modules (the zombie hive) extend */
let mOpenX=(i,j,lv)=>false,mDecoX=(A,lv,R0,dx,dy)=>{},mSpawnX=lv=>{};
/* natural caves on 2층 and 3층 */
function mCaves(lv){if(lv<2)return[];const R0=MREG(),sd=MINE0().seed+lv*1000,L=mUp(lv),out=[];for(let k=0;k<(lv==2?10:12);k++){let c,r,t=0;do{c=3+hh2(k,t,sd)*(R0.cols-6)|0;r=3+hh2(t,k,sd+1)*(R0.rows-6)|0;t++}while(t<40&&Math.hypot(c-L[0],r-L[1])<9);out.push({c,r,rad:1.6+hh2(k,9,sd)*1.6})}return out}
const inCave=(cv,c,r)=>cv.some(q=>Math.hypot(c-q.c,(r-q.r)*1.2)<q.rad);
/* what is in each cell: ore gets likelier and rarer with distance from the way in, deeper floors richer */
mCell=function(c,r){const lv=mLv(),M=MINE0(),sd=M.seed+(lv-1)*77,L=mUp(lv),d=Math.hypot(c-L[0],r-L[1]),base=.04+Math.min(.22,d*.004);
 if(lv==3&&hh2(c,r,sd+11)<.035)return'gasr';
 if(hh2(c,r,sd+5)<Math.min(.6,base*lv)){const mx=lv==1?(d<18?1:d<40?2:3):lv==2?(d<8?2:3):3;return oreRoll(mulberry(sd*977+c*131+r*17),mx,lv==1?d/8:lv==2?d/5+2:d/4+6)}
 if(lv==2)return'hrock';if(lv==3)return'drock';return hh2(c,r,sd)<Math.max(.05,.9-d*.025)?'dirt':'stone'};
buildMine=function(){newWorld();const R0=MREG(),lv=mLv(),A=Bld(['','지하 광산 1층','깊은 갱도 2층','심층 3층'][lv],R0.c,R0.r,'dun'),[ox,oy]=bo(R0.c,R0.r),dx=R0.x0-ox,dy=R0.y0-oy,gx=OGX+R0.c,gy=OGY+R0.r,M=MINE0(),L=mUp(lv),dug=mDug(lv),cv=mCaves(lv),dn=(M.down||{})[lv],EX=mExit();
 A.fl(dx,dy,R0.cols*TS,R0.rows*TS,lv==1?'mineF':'mineF'+lv);
 const open=(i,j)=>(Math.abs(i-L[0])<=1&&j>=L[1]-1&&j<=L[1]+2)||(dn&&Math.abs(i-dn[0])<=1&&Math.abs(j-dn[1])<=1)||(lv==1&&Math.abs(i-EX[0])<=1&&Math.abs(j-EX[1])<=1)||dug[i+','+j]||inCave(cv,i,j)||mOpenX(i,j,lv);
 for(let j=0;j<R0.rows;j++)for(let i=0;i<R0.cols;i++){if(open(i,j))continue;A.o('mtile',dx+i*TS,dy+j*TS,TS,TS,{m:mCell(i,j),mc:i,mr:j})}
 A.o('ladder',dx+L[0]*TS+2,dy+L[1]*TS-4,28,22);A.light(dx+L[0]*TS+16,dy+L[1]*TS+20,150,.55,'255,220,160');
 if(dn){A.o('mhole',dx+dn[0]*TS,dy+dn[1]*TS,TS,TS);A.light(dx+dn[0]*TS+16,dy+dn[1]*TS+16,90,.3,'255,200,140')}
 if(lv==1){A.o('mexit',dx+EX[0]*TS+2,dy+EX[1]*TS-4,28,22);A.light(dx+EX[0]*TS+16,dy+EX[1]*TS+16,170,.55,'140,255,170')}
 mDecoX(A,lv,R0,dx,dy);
 for(const[x,y,w,h]of[[0,0,WW,R0.y0-4],[0,R0.y0+R0.rows*TS+4,WW,WH],[0,0,R0.x0-4,WH],[R0.x0+R0.cols*TS+4,0,WW,WH]])W0.dec.push({x,y,w,h,f:()=>R('#0b0c0e',x,y,w,h)});
 for(const b of W0.b)Object.assign(b,{gx,gy,zone:0,gk:'mine'+lv});W0.objs.forEach(o=>o.id='mine'+lv+':'+(o.mc!=null?o.mc+','+o.mr:o.t));
 W0.base=Object.assign({},W0.base||{},(()=>{const[bx,by]=bo(-OGX,-OGY);return{ox:bx,oy:by,...BASE}})());W0.car=SURF?SURF.carW:W0.car;return W0};
P('mhole','아래층 구멍',null,o=>{const{x,y,w,h}=o;R('#000',x+2,y+2,w-4,h-4);R('#3a2818',x,y,w,3);R('#3a2818',x,y,3,h);R('#3a2818',x+w-3,y,3,h);R('#8a9096',x+9,y+2,2,h-4);R('#8a9096',x+w-11,y+2,2,h-4);for(let i=0;i<3;i++)R('#6a7076',x+9,y+6+i*8,w-18,2)},false);
P('mexit','먼 출구',null,o=>{const{x,y,w,h}=o;R('#0c0d10',x-4,y-4,w+8,h+8);R('#7fd07f',x+3,y-44,3,h+44);R('#7fd07f',x+w-6,y-44,3,h+44);for(let i=0;i<6;i++)R('#5aa05a',x+3,y-40+i*9,w-6,2);R('#e8e8e0',x-10,y-56,48,10);R('#2f5a2a',x-9,y-55,46,8);R('#e8e8e0',x-5,y-52,4,2);R('#e8e8e0',x+1,y-52,30,2)},false);
/* ---------- moving around ---------- */
let MDOWN=null;
function mSolids(){const R0=MREG(),x1=R0.x0+R0.cols*TS,y1=R0.y0+R0.rows*TS;addSolid({x:0,y:0,w:WW,h:R0.y0,wall:1});addSolid({x:0,y:y1,w:WW,h:WH-y1,wall:1});addSolid({x:0,y:R0.y0,w:R0.x0,h:y1-R0.y0,wall:1});addSolid({x:x1,y:R0.y0,w:WW-x1,h:y1-R0.y0,wall:1})}
function mineGo(lv,cell){const p=S.p,R0=MREG();DUN.lv=lv;MINE=null;MDOWN=null;S.mgas=[];S.mdeb=[];Z=[];dec=[];buildWorld();infDerived();mSolids();
 const isL=cell==mUp(lv)||(cell&&mUp(lv)&&cell[0]==mUp(lv)[0]&&cell[1]==mUp(lv)[1]);p.x=R0.x0+cell[0]*TS+16;p.y=R0.y0+cell[1]*TS+(isL?2*TS+8:28);
 const cv=mCaves(lv);cv.forEach((q,i)=>{const n=lv==2?2+(i%2):2;for(let k=0;k<n;k++){mk(R0.x0+q.c*TS+16+(k-1)*14,R0.y0+q.r*TS+16,{look:lv==3&&k==0?'brute':k%2?'sleeper':'crawler'});Z[Z.length-1].g=1}});
 mSpawnX(lv);
 msg(['','⛏ 지하 광산 1층 · 3×3블록 크기 · 공격 버튼으로 앞의 칸을 깨요 · 반대편 끝(오른쪽 아래)에 초록 출구','⛏ 2층 깊은 갱도 · 단단한 암반 (곡괭이 Lv2) · 광석 2배 · 동굴 10곳','⛏ 3층 심층 · 심층암 (곡괭이 Lv3) · 희귀 광석 · 가스 주머니 (방독면) · 거대 둥지'][lv])}
mineEnter=function(){const p=S.p;SURF={x:p.x,y:p.y,Z,dec,carW:W0.car};DUN={sh:'mine',seed:MINE0().seed,gk:'mine',lv:1};document.body.dataset.dun='mine';mineGo(1,MLAD)};
function mineExitFar(){const R0=MREG(),EX=mExit(),x=R0.x0+EX[0]*TS+16,y=R0.y0+EX[1]*TS+40;SURF.x=x;SURF.y=y;dunExit();const p=S.p;for(let i=0;i<80&&blocker(p.x,p.y,10);i++){const a=i*.7,r=10+i*6;p.x=x+Math.cos(a)*r;p.y=y+Math.sin(a)*r}
 const[bx,by]=bo(-OGX,-OGY);msg('🌄 광산 반대편 출구로 나왔어요 · 거점에서 '+Math.round(Math.hypot(p.x-bx-BW/2,p.y-by-BH/2)/(BW+RD)*10)/10+'블록 떨어진 곳')}
/* ---------- breaking cells with the attack swing ---------- */
const needLv2=o=>o.m=='hrock'?2:o.m=='drock'||o.m=='gasr'?3:ORE_BY[o.m]?ORE_BY[o.m][2]:1;
const MHPB={dirt:2,stone:3,hrock:4.5,drock:6,gasr:4,flesh:3};
const cellHp=o=>MHPB[o.m]||(ORE_BY[o.m]?2.5+ORE_BY[o.m][2]:3);
startDig=function(o){const p=S.p,lv=pickLv(p),nl=needLv2(o);if(!lv)return msg('⛏ 곡괭이가 필요해요 (작업대 Lv1에서 제작)');if(lv<nl)return msg('⛏ '+NM2(o.m)+'은(는) 곡괭이 Lv'+nl+'이 필요해요');if(p.ac>0)return;
 const cx=o.x+TS/2,cy=o.y+TS/2,dx=cx-p.x,dy=cy-(p.y-8),d=Math.hypot(dx,dy)||1;p.fx=dx/d;p.fy=dy/d;p.ac=.34;S.mswing=.3;fx.push({k:'sw',x:p.x,y:p.y,fx:p.fx,fy:p.fy,l:.15});
 if(o.mhp==null){o.mhp=cellHp(o);o.hp=o.mhp}o.hp-=[0,1,1.6,2.4][lv]*(mLv()==3?.85:1);o.crack=Math.max(0,1-o.hp/o.mhp);o.shk=.12;noise(cx,cy,1);
 const C=MCOL[ORE_BY[o.m]?'stone':o.m]||MCOL.stone;mDebris(cx-dx/d*12,cy-dy/d*12,3,C[1],-dx/d,-dy/d);
 try{sfx((a,t)=>{nz(a,t,{f:o.hp>0?1500:700,q:2.5,v:.22,d:o.hp>0?.05:.14,type:'bandpass'})})}catch(e){}
 if(o.hp<=0){mDebris(cx,cy,12,C[0],0,0);if(ORE_BY[o.m])mDebris(cx,cy,6,ORE_BY[o.m][3],0,0);if(S4)S4.shake=Math.max(S4.shake||0,.05);digDone(o)}};
function mDebris(x,y,n,c,vx,vy){S.mdeb=S.mdeb||[];for(let i=0;i<n;i++)S.mdeb.push({x,y,vx:(vx*60)+(Math.random()-.5)*120,vy:(vy*60)-40-Math.random()*80,t:.5+Math.random()*.4,c,s:1+(Math.random()*3|0),gy:y+8+Math.random()*14})}
{const _d=D.mtile;D.mtile=function(o){let ox=0;if(o.shk>0){o.shk-=1/60;ox=(Math.random()<.5?-1:1)}o.x+=ox;try{_d(o);if(o.crack>0){const{x,y}=o,k=o.crack,K='#120e0a';R(K,x+14,y+3,2,6+k*12);R(K,x+10,y+8+k*6,5,2);if(k>.35){R(K,x+4,y+16,8*k+4,2);R(K,x+22,y+12,2,10*k)}if(k>.65){R(K,x+18,y+20,10,2);R(K,x+6,y+6,2,8);R('#ffffff22',x+2,y+2,TS-4,2)}}}finally{o.x-=ox}}}
{const _w=wpnOf2;wpnOf2=function(p){if(DUN&&DUN.sh=='mine'&&pickLv(p)&&(S.mswing>0||!Z.some(q=>Math.hypot(q.x-p.x,q.y-p.y)<90)))return'axe';return _w(p)}}
/* target outline, health, debris */
OVL.push((g2,sx,sy,k)=>{if(!DUN||DUN.sh!='mine')return;const p=S.p,o=mineTarget();
 if(o){const can=pickLv(p)>=needLv2(o),X=sx(o.x),Y=sy(o.y),w=TS*k;g2.save();g2.setLineDash([5,4]);g2.lineWidth=2;g2.strokeStyle=can?'#ffd36a':'#ff6a5a';g2.strokeRect(X+1,Y+1,w-2,w-2);g2.setLineDash([]);
  const nm=NM2(o.m)+(needLv2(o)>1?' · Lv'+needLv2(o):'');g2.font='600 11px system-ui';const tw=g2.measureText(nm).width+10;g2.fillStyle='#000b';g2.fillRect(X+w/2-tw/2,Y-20,tw,15);g2.fillStyle=ORE_BY[o.m]?ORE_BY[o.m][4]:'#fff';g2.textAlign='center';g2.fillText(nm,X+w/2,Y-9);
  if(o.mhp){g2.fillStyle='#000a';g2.fillRect(X+2,Y+w-6,w-4,4);g2.fillStyle=can?'#ffd36a':'#ff6a5a';g2.fillRect(X+2,Y+w-6,(w-4)*Math.max(0,o.hp/o.mhp),4)}g2.restore()}
 for(const q of S.mdeb||[]){g2.fillStyle=q.c;g2.globalAlpha=Math.min(1,q.t*2);g2.fillRect(sx(q.x),sy(q.y),q.s*k,q.s*k)}g2.globalAlpha=1});
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!S)return;if(S.mswing>0)S.mswing-=dt;if(S.mdeb&&S.mdeb.length){S.mdeb=S.mdeb.filter(q=>{q.t-=dt;q.vy+=420*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;if(q.y>q.gy){q.y=q.gy;q.vy*=-.3;q.vx*=.5}return q.t>0})}}}
/* ---------- what each broken cell gives (deeper floors, special rock) ---------- */
{const _dd=digDone;digDone=function(o){const lv=mLv();if(lv==1&&!/rock|gasr|flesh/.test(o.m))return _dd(o);const p=S.p,ore=ORE_BY[o.m];rmSolid(o);mDug(lv)[o.mc+','+o.mr]=1;noise(o.x+16,o.y+16,ore?3:2);
  const got={};if(o.m=='flesh'){if(Math.random()<.3)got.cloth=1}else if(o.m=='gasr'){S.mgas=(S.mgas||[]).concat([{x:o.x+16,y:o.y+16,t:10}]);msg(spec('gasmask')?'😷 가스 주머니가 터졌어요 · 방독면이 막아 줘요':'☠ 가스 주머니가 터졌어요! 방독면이 없으면 피하세요')}
  else if(ore){got[o.m]=1+(Math.random()<(lv==3?.6:.45)?1:0);got.stone=1}else{got.stone=2;if(o.m=='drock'&&Math.random()<.15)got.coal=1}
  if(lv==3&&Math.random()<.02)got[aRune(3)]=1;for(const k in got)invAdd(p,k,got[k]);if(Object.keys(got).length)s3Float(o.x+16,o.y-6,Object.entries(got).map(([k,n])=>'+'+n+' '+NM2(k)).join(' '),ore?ore[4]:'#c9c4d8');
  if(typeof s3Xp=='function')s3Xp(ore?5*ore[2]*lv:lv,'채굴');if(o.m!='flesh'&&Math.random()<.04*lv){mk(o.x+16,o.y+20,{look:lv==3&&Math.random()<.3?'brute':'crawler'});Z[Z.length-1].g=1;msg('🕳 바위 속에서 좀비가 튀어나왔어요!')}}}
/* gas clouds */
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!S||!S.mgas||!S.mgas.length)return;const p=S.p;S.mgas=S.mgas.filter(g2=>{g2.t-=dt;if(Math.hypot(p.x-g2.x,p.y-g2.y)<80&&!spec('gasmask'))p.hp-=6*dt;return g2.t>0&&DUN})}}
OVL.push((g2,sx,sy,k)=>{for(const q of S.mgas||[]){const a=Math.min(.45,q.t/10*.5),X=sx(q.x),Y=sy(q.y);const gr=g2.createRadialGradient(X,Y,0,X,Y,85*k);gr.addColorStop(0,'rgba(120,200,60,'+a+')');gr.addColorStop(1,'rgba(120,200,60,0)');g2.fillStyle=gr;g2.fillRect(X-85*k,Y-85*k,170*k,170*k)}});
{const _dl=darkLv;darkLv=function(){const d=_dl();return DUN&&DUN.sh=='mine'?Math.max(d,[0,.85,.9,.94][mLv()]):d}}
/* ---------- ladders, holes, the far exit ---------- */
{const _c=dmCtx;dmCtx=function(){let B=_c();if(!DUN||DUN.sh!='mine')return B;const p=S.p,lv=mLv(),M=MINE0(),R0=MREG(),cx=x=>R0.x0+x*TS+16,cy=y=>R0.y0+y*TS,pc=[(p.x-R0.x0)/TS|0,(p.y-8-R0.y0)/TS|0],L=mUp(lv),dn=(M.down||{})[lv],EX=mExit();
  const o=!MINE&&mineTarget();B=B.filter(q=>!/^⛏ (파기|.*곡괭이)/.test(q.t));if(o){const pl=pickLv(p),nl=needLv2(o);B.unshift(!pl?{t:'⛏ '+NM2(o.m)+' · 곡괭이가 필요해요',f:null,info:1}:pl<nl?{t:'⛏ '+NM2(o.m)+' · 곡괭이 Lv'+nl+' 필요',f:null,info:1}:{t:'⛏ 깨기 · '+NM2(o.m)+' (공격 버튼)',f:()=>startDig(o)})}
  if(lv>1){B=B.filter(q=>!/지상으로/.test(q.t));if(Math.hypot(p.x-cx(L[0]),p.y-cy(L[1])-10)<85)B.unshift({t:'⬆ '+(lv-1)+'층으로',f:()=>mineGo(lv-1,M.down[lv-1]),big:1})}
  if(lv==1&&Math.hypot(p.x-cx(EX[0]),p.y-cy(EX[1])-10)<85)B.unshift({t:'⬆ 먼 출구로 나가기',f:mineExitFar,big:1});
  if(dn&&Math.hypot(p.x-cx(dn[0]),p.y-cy(dn[1])-16)<50)B.unshift({t:'⬇ '+(lv+1)+'층으로',f:()=>mineGo(lv+1,dn),big:1});
  else if(!dn&&lv<3){const far=Math.hypot(pc[0]-L[0],pc[1]-L[1]);if(MDOWN)B.unshift({t:'⬇ 아래로 파는 중… '+Math.round(MDOWN.t/MDOWN.T*100)+'%',f:null,info:1});
   else if(far>=12)B.push(pickLv(p)>lv?{t:'⬇ 여기서 '+(lv+1)+'층으로 파 내려가기 (8초)',f:()=>{MDOWN={t:0,T:8,x:p.x,y:p.y,c:pc}}}:{t:'⬇ 아래층으로 파려면 곡괭이 Lv'+(lv+1),f:null,info:1})}
  return B}}
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!MDOWN||!S)return;const p=S.p;if(Math.hypot(p.x-MDOWN.x,p.y-MDOWN.y)>24){MDOWN=null;return}MDOWN.t+=dt;if((MDOWN.t*2|0)!=((MDOWN.t-dt)*2|0))noise(p.x,p.y,3);
  if(MDOWN.t>=MDOWN.T){const lv=mLv(),M=MINE0();M.down=M.down||{};M.down[lv]=MDOWN.c;mDug(lv)[MDOWN.c[0]+','+MDOWN.c[1]]=1;MDOWN=null;mineGo(lv+1,M.down[lv])}}}
{const _de=dunExit;dunExit=function(){if(DUN&&DUN.sh=='mine')DUN.lv=1;MDOWN=null;if(S)S.mdeb=[];return _de()}}
