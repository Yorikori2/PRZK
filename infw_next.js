/* PROJECT LEGACY — sample: endless city (part 1, loaded right after maprand_next.js: block rules + window builder). Only a 5×5-block window around the player exists; when the player leaves the
   middle block the window slides one block, new blocks are built from (seed, block x, block y) and everything in the
   world moves by the same amount, so the game keeps its fixed-size grids. Same seed + same block = same buildings.
   Danger zones: every 15 blocks (12 on Veteran, 10 on Nightmare) away from the base, along x or y, zombies get tougher
   and loot gets better. Needs maprand_next.js (builders, park) and MAPCFG {inf:1, seed, ogx, ogy} set before world.js. */
'use strict';
const INF=typeof MAPCFG!='undefined'&&MAPCFG&&MAPCFG.inf;
const PX=BW+RD,PY=BH+RD;
let OGX=INF?(MAPCFG.ogx??-2):0,OGY=INF?(MAPCFG.ogy??-2):0;
function bh(gx,gy,k){let h=(MAPCFG.seed|0)^Math.imul(gx|0,374761393)^Math.imul(gy|0,668265263)^Math.imul(k|0,2246822519);h=Math.imul(h^h>>>13,1274126177);return((h^h>>>16)>>>0)/4294967296}
/* ---------- what stands on each block ---------- */
function kindAt(gx,gy){if(gx==0&&gy==0)return'base';const d=Math.max(Math.abs(gx),Math.abs(gy));
 if((gx&1)!==0&&kindAt(gx-1,gy)=='mil')return'milR';
 const W=[['houses',4],['apt',2.5],['park',2.5],['mart',.8],['church',.7],['school',1],['hard',1],['ware',1],['fire',.8],['clinic',d>=2?.7:0],['police',d>=3?.6:0],['lab',d>=4?.4:0],['mil',(gx&1)==0&&d>=3?.5:0]];
 const tot=W.reduce((a,b)=>a+b[1],0);let t=bh(gx,gy,1)*tot;for(const[k,w]of W){t-=w;if(t<=0)return k}return'houses'}
/* S is declared later by the game script, so read it carefully while the first window is being built */
const curD=()=>{try{return S&&S.d||'S'}catch(e){return'S'}};
const zoneStep=()=>({S:15,V:12,N:10})[curD()],zoneHp=()=>({S:.25,V:.3,N:.4})[curD()];
function zoneOf(gx,gy){return Math.floor(Math.max(Math.abs(gx),Math.abs(gy))/zoneStep())+(curD()=='N'?1:0)}
const gOf=(x,y)=>[OGX+Math.floor((x-RD/2)/PX),OGY+Math.floor((y-RD/2)/PY)];
/* ---------- build the window ---------- */
if(INF){buildWorld=function(){newWorld();for(let r=0;r<NBY;r++)for(let c=0;c<NBX;c++){const gx=OGX+c,gy=OGY+r;let k=kindAt(gx,gy);
   if(k=='mil'&&c>NBX-2)k='park';if(k=='milR'){if(c==0)k='park';else continue}
   const b0=W0.b.length,o0=W0.objs.length,z0=W0.zs.length,sd=(bh(gx,gy,2)*997)|0;
   if(k=='base')buildBaseLot(c,r);else if(k=='mil')buildMil2(c,r);else BUILDERS[k](c,r,sd);
   for(let i=b0;i<W0.b.length;i++)Object.assign(W0.b[i],{gx,gy,zone:zoneOf(gx,gy),gk:gx+','+gy});
   for(let i=o0;i<W0.objs.length;i++)W0.objs[i].id=gx+','+gy+':'+(i-o0);for(let i=z0;i<W0.zs.length;i++)W0.zs[i].gk=gx+','+gy}
  if(!W0.base){const[ox,oy]=bo(-OGX,-OGY);W0.base={ox,oy,...BASE}}
  /* the car normally comes from the mart block; without one in view, park it next to the base */
  if(!W0.car){const B=W0.base;W0.car={x:B.ox+BW+RD/2,y:B.oy+BH-60,w:60,h:30,c:'#c43c32'}}return W0}}
