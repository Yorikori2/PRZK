// Endless city sample checks.  usage: node tools/test_inf.js <outdir>
const {chromium}=require('playwright');const OUT=process.argv[2]||'.';const PAGE='file://'+require('path').resolve(__dirname,'..','inf-sample.html');
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);await p.waitForTimeout(1500);await p.evaluate(()=>{$('bm').dataset.m='';closeBase();PAUSE=false;stop9()});
 let r=await p.evaluate(()=>({run,base:W0.b.find(b=>b.kind=='base').gk,b:W0.b.length,size:NBX+'x'+NBY,zc:$('zonec').textContent}));ok(r.run&&r.base=='0,0'&&r.b>=20,'starts at the base in block (0,0) with a 5x5 window '+JSON.stringify(r));
 // walking across a block edge slides the window and keeps the true (global) position
 r=await p.evaluate(()=>{infGoto(0,0);const pl=S.p,G=()=>{const[gx,gy]=gOf(pl.x,pl.y);return[gx,gy,Math.round(pl.x-RD/2-(gx-OGX)*PX),Math.round(pl.y-RD/2-(gy-OGY)*PY)]};pl.x+=PX*1.1;const before=G(),og0=OGX;gearUpd(1/60);const after=G();return{before,after,shifted:OGX-og0}});
 ok(r.shifted==1&&r.before.join()==r.after.join(),'crossing into the next block slides the window by one and keeps the global spot '+JSON.stringify(r));
 // searched containers stay searched, zombies don't come back, the car stays where it was
 r=await p.evaluate(()=>{infGoto(3,2);const o=W0.objs.find(o=>LOOTT[o.t]);const id=o.id;S.lo[id]=S.tt;const car=S.car;const cg=gOf(car.x,car.y),cOff=[car.x-RD/2-(cg[0]-OGX)*PX,car.y-RD/2-(cg[1]-OGY)*PY].map(Math.round);
  const zb=W0.zs.length;Z.length=0;infGoto(20,2);const nz=Z.length;Z.length=0;infGoto(3,2);const back=Z.length;const o2=W0.objs.find(q=>q.id==id);const cg2=gOf(S.car.x,S.car.y),cOff2=[S.car.x-RD/2-(cg2[0]-OGX)*PX,S.car.y-RD/2-(cg2[1]-OGY)*PY].map(Math.round);
  return{same:!!o2&&o2.t==o.t&&o2.x==o.x,looted:!avail(o2),newZ:nz,backZ:back,car:[cg.join(),cg2.join()],off:[cOff.join(),cOff2.join()]}});
 ok(r.same&&r.looted,'a searched container is still searched after going away and back');ok(r.newZ>5&&r.backZ==0,'new blocks bring zombies ('+r.newZ+'), visited blocks do not respawn them ('+r.backZ+')');
 ok(r.car[0]==r.car[1]&&r.off[0]==r.off[1],'the car stays at its global spot '+JSON.stringify(r.car));
 // first-visit XP is not paid twice
 r=await p.evaluate(()=>{infGoto(2,1);const i=W0.b.findIndex(b=>b.gk=='2,1');S.pg.vis={};S.pg.vis[i]=1;infGoto(25,1);infGoto(2,1);const j=W0.b.findIndex(b=>b.gk=='2,1');return!!S.pg.vis[j]});ok(r,'building visits are remembered across window slides (no repeated first-visit XP)');
 // danger zones
 r=await p.evaluate(()=>{const o={};for(const g of[0,14,15,30,45,60]){infGoto(g,0);Z.length=0;mk(S.p.x+80,S.p.y,{look:'civ1'});o[g]=[zoneOf(g,0),Math.round(Z[0].mhp)]}let sp=0;infGoto(45,0);for(let i=0;i<400;i++){Z.length=0;mk(S.p.x+80,S.p.y,{});if(Z[0].look&&!LOOKZ.includes(Z[0].look))sp++}return{o,special45:sp/400}});
 ok(r.o[0][0]==0&&r.o[14][0]==0&&r.o[15][0]==1&&r.o[30][0]==2&&r.o[45][0]==3&&r.o[60][0]==4,'zone goes up every 15 blocks '+JSON.stringify(r.o));
 ok([[15,1.4],[30,2.4],[45,3],[60,3.9]].every(([d,m])=>Math.abs(r.o[d][1]-r.o[0][1]*m)<1),'zombie HP ×1.4 / ×2.4 / ×3 / ×3.9 in zones 1-4 '+JSON.stringify(r.o));ok(r.special45>.12,'more special zombies far out ('+Math.round(r.special45*100)+'% in zone 3)');
 r=await p.evaluate(()=>{infGoto(45,0);return W0.b.every(b=>b.zone==zoneOf(b.gx,b.gy))&&W0.b.find(b=>b.gx==45).zone==3&&W0.b.find(b=>b.gx==43).zone==2});ok(r,'buildings carry their zone (loot tier goes up with it)');
 // diagonal: the farther axis decides
 r=await p.evaluate(()=>[zoneOf(16,-3),zoneOf(-2,31),zoneOf(-46,-46)]);ok(r.join()=='1,2,3','zone uses the farther of x and y '+r);
 // everything in a far window can be reached on foot
 r=await p.evaluate(()=>{infGoto(33,-12);const C=8,GXn=Math.ceil(WW/C),GYn=Math.ceil(WH/C),seen=new Uint8Array(GXn*GYn),q=[];const sx=S.p.x/C|0,sy=S.p.y/C|0;seen[sy*GXn+sx]=1;q.push(sx,sy);
  for(let i=0;i<q.length;i+=2){const x=q[i],y=q[i+1];for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const X=x+dx,Y=y+dy;if(X<0||Y<0||X>=GXn||Y>=GYn)continue;const k=Y*GXn+X;if(seen[k])continue;if(blocker(X*C+4,Y*C+4,7)){seen[k]=2;continue}seen[k]=1;q.push(X,Y)}}
  const L=W0.objs.filter(o=>LOOTT[o.t]);let n=0;for(const o of L){let hit=false;const x0=Math.max(0,(o.x-30)/C|0),x1=Math.min(GXn-1,(o.x+o.w+30)/C|0),y0=Math.max(0,(o.y-30)/C|0),y1=Math.min(GYn-1,(o.y+o.h+30)/C|0);for(let y=y0;y<=y1&&!hit;y++)for(let x=x0;x<=x1&&!hit;x++)if(seen[y*GXn+x]==1&&rdist(o,x*C+4,y*C+4)<29)hit=true;if(hit)n++}return[n,L.length]});
 ok(r[0]==r[1],'far window (33,-12): '+r[0]+'/'+r[1]+' containers reachable');
 // save far away, reload, continue in the same place
 r=await p.evaluate(()=>{infGoto(17,-4);S.p.x+=30;const g=gOf(S.p.x,S.p.y);save();return g});await p.reload();await p.waitForTimeout(1300);
 const r2=await p.evaluate(()=>{$('bm').dataset.m='';closeBase();PAUSE=false;return gOf(S.p.x,S.p.y)});ok(r.join()==r2.join(),'reopening continues the save in the same block '+r2);
 await p.evaluate(()=>{try{localStorage.removeItem(SAVE)}catch(e){}});
 // performance: drive east across several blocks
 await p.evaluate(()=>{stop9();infGoto(0,0);Z.length=0;S.sa=1e9;window.SH=[];const o=infShift;infShift=function(...a){const t=performance.now();o.apply(this,a);SH.push(performance.now()-t)};for(let i=0;i<10;i++)infShift(1,0,true);infGoto(0,0);Z.length=0;const[ox]=bo((NBX-1)/2|0,0);S.p.x=ox+BW-30;jp=-1;jx=1;jy=0});
 const fps=await p.evaluate(()=>new Promise(res=>{let n=0;const t0=performance.now();(function f(){n++;if(performance.now()-t0<4000)requestAnimationFrame(f);else res(Math.round(n/4))})()}));
 r=await p.evaluate(()=>{jp=null;jx=0;return{shifts:SH.length,maxMs:Math.round(Math.max(0,...SH)),og:OGX}});ok(fps>40,'frame rate while walking across blocks: '+fps+'fps');ok(r.maxMs<120,'window slide cost '+r.maxMs+'ms ('+r.shifts+' slides)');
 await p.evaluate(()=>scene9('far'));await p.waitForTimeout(1200);await p.screenshot({path:OUT+'/inf-far.png'});await p.evaluate(()=>scene9('edge'));await p.waitForTimeout(4800);await p.screenshot({path:OUT+'/inf-edge.png'});
 ok(!errs.length,'no page errors '+errs.join(' | '));await b.close()})();
