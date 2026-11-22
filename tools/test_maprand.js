// Random map sample checks: required places, danger far / safe near, everything reachable, same seed = same map,
// save remembers its map, continue reloads the right map, frame rate on the biggest map.  usage: node tools/test_maprand.js <outdir>
const {chromium}=require('playwright');const OUT=process.argv[2]||'.';const PAGE='file://'+require('path').resolve(__dirname,'..','map-sample.html');
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
const REQ=['base','mil','lab','police','clinic','fire','school','ware','hard','church','mart','apt'];
async function open(b,cfg,clear=true){const ctx=await b.newContext({viewport:{width:412,height:860}});const p=await ctx.newPage();p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));
 await p.goto(PAGE);await p.evaluate(([c,clear])=>{if(clear)localStorage.clear();if(c)localStorage.setItem('pl_mapnext',JSON.stringify(c));else localStorage.removeItem('pl_mapnext')},[cfg,clear]);await p.reload();await p.waitForTimeout(700);return[ctx,p]}
const info=p=>p.evaluate(()=>{if(!S){start('S',false);S.pg.tr=['cop'];$('bm').dataset.m='';closeBase();PAUSE=false}const B=W0.b.find(b=>b.kind=='base'),bc=[B.c,B.r],d=b=>Math.hypot(b.c-bc[0],(b.r-bc[1])*1.25),avg=ks=>{const L=W0.b.filter(b=>ks.includes(b.kind));return L.reduce((a,b)=>a+d(b),0)/L.length};
 let h=0;for(const o of W0.objs)h=(h*31+o.x*7+o.y*13+o.t.length)%1e9;
 /* walkability: the same flood fill as the stage 1 check (8 px grid, the game's own collision test, from the start spot) */
 const C=8,GXn=Math.ceil(WW/C),GYn=Math.ceil(WH/C),seen=new Uint8Array(GXn*GYn),q=[];const sx=S.p.x/C|0,sy=S.p.y/C|0;
 const okc=(x,y)=>x>=0&&y>=0&&x<GXn&&y<GYn&&!blocker(x*C+4,y*C+4,7);seen[sy*GXn+sx]=1;q.push(sx,sy);
 for(let i=0;i<q.length;i+=2){const x=q[i],y=q[i+1];for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const X=x+dx,Y=y+dy;if(X<0||Y<0||X>=GXn||Y>=GYn)continue;const k=Y*GXn+X;if(seen[k])continue;if(!okc(X,Y)){seen[k]=2;continue}seen[k]=1;q.push(X,Y)}}
 const loot=W0.objs.filter(o=>LOOTT[o.t]);let reach=0;const miss=[];for(const o of loot){let hit=false;const x0=Math.max(0,(o.x-30)/C|0),x1=Math.min(GXn-1,(o.x+o.w+30)/C|0),y0=Math.max(0,(o.y-30)/C|0),y1=Math.min(GYn-1,(o.y+o.h+30)/C|0);
  for(let y=y0;y<=y1&&!hit;y++)for(let x=x0;x<=x1&&!hit;x++)if(seen[y*GXn+x]==1&&rdist(o,x*C+4,y*C+4)<29)hit=true;if(hit)reach++;else miss.push((W0.b[o.b]||{}).name+':'+o.t)}
 const midC=B.c>=1&&B.c<=NBX-2;return{size:NBX+'x'+NBY,kinds:W0.b.map(b=>b.kind),hash:h,far:+avg(['lab','police','mil']).toFixed(2),near:+avg(['mart','church','houses','park']).toFixed(2),midC,reach,loot:loot.length,miss:miss.slice(0,6)}});
(async()=>{const b=await chromium.launch();
 const runs=[[5,3,101],[5,3,202],[7,4,303],[7,4,404],[8,5,505],[8,5,606]];const res=[];
 for(const[nx,ny,seed]of runs){const[ctx,p]=await open(b,{nbx:nx,nby:ny,seed});const r=await info(p);res.push(r);
  ok(REQ.every(k=>r.kinds.includes(k)),r.size+' #'+seed+': all '+REQ.length+' required places present ('+r.kinds.length+' blocks)');
  ok(r.midC&&r.far>r.near,r.size+' #'+seed+': base near the middle, dangerous places farther ('+r.far+') than safe ones ('+r.near+')');
  ok(r.reach==r.loot,r.size+' #'+seed+': '+r.reach+'/'+r.loot+' containers reachable on foot '+(r.miss.length?r.miss:''));
  if(seed==505){await p.screenshot({path:OUT+'/mr-menu.png'})}
  ok(!p.errs.length,r.size+' #'+seed+': no errors '+p.errs.join('|'));await ctx.close()}
 ok(new Set(res.map(r=>r.hash)).size==res.length,'every seed gives a different map');
 let[ctx,p]=await open(b,{nbx:7,nby:4,seed:303});const again=await info(p);ok(again.hash==res[2].hash,'same seed → the same map again');
 // new game saves its map; reload without a pending map rebuilds it; continue works
 await p.evaluate(()=>{start('S',false);S.pg.tr=['cop'];$('bm').dataset.m='';closeBase();PAUSE=false;save()});let r=await p.evaluate(()=>({map:S.map,pending:localStorage.getItem('pl_mapnext')}));
 ok(r.map&&r.map.seed==303&&r.map.nbx==7&&!r.pending,'new game stores its map in the save '+JSON.stringify(r));
 await p.reload();await p.waitForTimeout(700);const back=await info(p);ok(back.hash==again.hash,'page reload rebuilds the saved map');
 await p.evaluate(()=>start(0,true));await p.waitForTimeout(300);r=await p.evaluate(()=>({run,map:S.map.seed}));ok(r.run&&r.map==303,'continue works on the random map');
 // pending a different map, then continue → reloads into the save's map
 await p.evaluate(()=>{localStorage.setItem('pl_mapnext',JSON.stringify({nbx:8,nby:5,seed:999}))});await p.reload();await p.waitForTimeout(700);const pend=await p.evaluate(()=>NBX+'x'+NBY);
 await p.evaluate(()=>start(0,true)).catch(()=>{});await p.waitForTimeout(1500);r=await p.evaluate(()=>({size:NBX+'x'+NBY,run,seed:S&&S.map&&S.map.seed}));
 ok(pend=='8x5'&&r.size=='7x4'&&r.run&&r.seed==303,'continuing from another map reloads into the save\'s own map '+JSON.stringify(r));await ctx.close();
 // old saves without a map keep the classic map
 [ctx,p]=await open(b,null);r=await p.evaluate(()=>{start('S',false);S.pg.tr=['cop'];delete S.map;save();return W0.b.length});await p.reload();await p.waitForTimeout(700);
 const cl=await p.evaluate(()=>({b:W0.b.length,size:NBX+'x'+NBY,names:W0.b[0].name}));ok(cl.b==14&&cl.size=='5x3'&&cl.names=='경찰서','save without a map keeps the classic hand-made map '+JSON.stringify(cl));await ctx.close();
 // biggest map: frame rate
 [ctx,p]=await open(b,{nbx:8,nby:5,seed:505});await p.evaluate(()=>{start('S',false);S.pg.tr=['cop'];$('bm').dataset.m='';closeBase();PAUSE=false});await p.waitForTimeout(500);
 const fps=await p.evaluate(()=>new Promise(res=>{let n=0;const t0=performance.now();(function f(){n++;if(performance.now()-t0<2000)requestAnimationFrame(f);else res(Math.round(n/2))})()}));ok(fps>40,'8x5 map frame rate '+fps);await p.screenshot({path:OUT+'/mr-game.png'});await ctx.close();
 await b.close()})();
