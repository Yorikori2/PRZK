/* PROJECT LEGACY — sample: random maps. Loaded after world_next.js, before the game script builds the world.
   MAPCFG (set by the page before world.js) = {nbx, nby, seed}. seed null → the hand-made classic map.
   Rules: base near the middle · dangerous places (lab, police, clinic, military) far from it · safe ones (houses, mart, church) near ·
   the 2-block military base takes two side-by-side blocks far away · leftover blocks become extra houses, apartments,
   schools, warehouses or a new park. Same seed → same map, so a save always rebuilds its own world. */
'use strict';
function mulberry(seed){let a=seed>>>0;return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
/* new block type: a small park with trees, benches, a couple of wrecks and barrels */
function buildPark(c,r,seed){const A=Bld('공원',c,r,'park'),R=mulberry(seed*7919+13);A.fl(0,0,BW,BH,'grass');
 A.fl(BW/2-40,0,80,BH,'walk');A.fl(0,BH/2-36,BW,72,'walk');
 for(let i=0;i<14;i++){const x=30+R()*(BW-90),y=40+R()*(BH-90);if(Math.abs(x+13-BW/2)<70||Math.abs(y+7-BH/2)<60)continue;A.o(R()<.6?'tree':'bush',x,y,R()<.6?26:24,14)}
 for(const[x,y]of[[BW/2-130,BH/2-80],[BW/2+60,BH/2-80],[BW/2-130,BH/2+70],[BW/2+60,BH/2+70]])if(R()<.75)A.o('bench',x,y,60,10);
 const cols=['#8a8f95','#c9a42a','#3a6ea8','#6b4a6b'];for(let i=0;i<2+(R()*2|0);i++){const x=60+R()*(BW-200),y=60+R()*(BH-160);if(Math.abs(x+28-BW/2)<90||Math.abs(y+14-BH/2)<80)continue;A.o('car',x,y,56,28,{c:cols[i%4],rust:1})}
 for(let i=0;i<3;i++){const x=80+R()*(BW-160),y=80+R()*(BH-160);if(Math.abs(x-BW/2)<60||Math.abs(y-BH/2)<56)continue;A.o('barrel',x,y,16,10,{c:'#4f5a35'})}
 for(let i=0;i<2+(R()*2|0);i++)A.z(['civ1','civ2','civ3'][i%3],BW/2-200+R()*400,BH/2-150+R()*300)}
const BUILDERS={police:(c,r)=>buildPolice(c,r),clinic:(c,r)=>buildClinic(c,r),school:(c,r)=>buildSchool(c,r),mart:(c,r)=>buildMart(c,r),hard:(c,r)=>buildHardware(c,r),
 fire:(c,r)=>buildFire(c,r),church:(c,r)=>buildChurch(c,r),ware:(c,r)=>buildWarehouse(c,r),lab:(c,r)=>buildLab(c,r),apt:(c,r)=>buildApts(c,r),houses:(c,r,s)=>buildHouses(c,r,s),park:(c,r,s)=>buildPark(c,r,s)};
const MAP_TIER={lab:5,police:4,clinic:3,fire:2,school:2,ware:2,hard:2,church:1,mart:1,apt:1};
/* plan: returns [{kind,c,r,seed}] */
function planMap(nbx,nby,seed){const R=mulberry(seed),cells=[];for(let r=0;r<nby;r++)for(let c=0;c<nbx;c++)cells.push([c,r]);const used=new Set(),key=(c,r)=>c+','+r,plan=[];
 const take=(kind,c,r,extra)=>{used.add(key(c,r));plan.push({kind,c,r,seed:(R()*1e6)|0,...extra})};
 /* base near the middle */
 const mid=cells.filter(([c,r])=>c>=1&&c<=nbx-2&&(nby<3||(r>=1&&r<=nby-2)));const [bc,br]=(mid.length?mid:cells)[R()*(mid.length||cells.length)|0];take('base',bc,br);
 const dist=(c,r)=>Math.hypot(c-bc,(r-br)*1.25);
 /* military: two side-by-side free blocks, among the farthest */
 const pairs=cells.filter(([c,r])=>c<nbx-1&&!used.has(key(c,r))&&!used.has(key(c+1,r))&&Math.max(Math.abs(c-bc),Math.abs(c+1-bc),Math.abs(r-br))>=2).sort((a,b)=>dist(b[0]+.5,b[1])-dist(a[0]+.5,a[1]));
 if(pairs.length){const p=pairs[R()*Math.max(1,Math.ceil(pairs.length/3))|0];take('mil',p[0],p[1]);used.add(key(p[0]+1,p[1]))}
 /* required places: dangerous far, safe near (with some shuffle) */
 const req=Object.keys(MAP_TIER).sort((a,b)=>MAP_TIER[b]-MAP_TIER[a]+(R()-.5)*.8);
 const maxD=Math.max(...cells.map(([c,r])=>dist(c,r)));
 for(const k of req){const free=cells.filter(([c,r])=>!used.has(key(c,r)));if(!free.length)break;const want=MAP_TIER[k]/5*maxD;
  free.sort((a,b)=>Math.abs(dist(a[0],a[1])-want)+R()*.9-(Math.abs(dist(b[0],b[1])-want)+R()*.9));take(k,free[0][0],free[0][1])}
 /* leftovers */
 const pool=[['houses',4],['park',3],['apt',2],['school',.7],['ware',.7],['hard',.45],['clinic',.4],['fire',.35],['church',.35]],tot=pool.reduce((a,b)=>a+b[1],0);
 for(const[c,r]of cells){if(used.has(key(c,r)))continue;let t=R()*tot,k='houses';for(const[n,w]of pool){t-=w;if(t<=0){k=n;break}}take(k,c,r)}
 return plan}
{const classic=buildWorld;buildWorld=function(){if(typeof MAPCFG=='undefined'||!MAPCFG||MAPCFG.seed==null)return classic();
  newWorld();const plan=planMap(NBX,NBY,MAPCFG.seed);W0.plan=plan;
  for(const b of plan){if(b.kind=='base')buildBaseLot(b.c,b.r);else if(b.kind=='mil')buildMil2(b.c,b.r);else BUILDERS[b.kind](b.c,b.r,b.seed%997)}
  W0.objs.forEach((o,i)=>o.id=i);return W0}}
