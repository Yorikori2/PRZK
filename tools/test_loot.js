// Timed searching + wall checks. Runs the same wall scenarios on the game (before) and the sample (after).
// usage: node tools/test_loot.js <outdir>
const {chromium}=require('playwright');const OUT=process.argv[2]||'.';const path=require('path');
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
const boot=`localStorage.clear();start('S',false);if(S.pg&&!S.pg.tr.length){S.pg.tr=['cop'];$('bm').dataset.m='';closeBase();PAUSE=false}`;
// find a container that touches a wall, and spots on both sides of that wall
const SCEN=`(()=>{const wallAt=(x,y)=>{const gx=x/GC|0,gy=y/GC|0;for(const s of GRID[gy*GX+gx]||[])if(s.wall&&x>=s.x&&x<=s.x+s.w&&y>=s.y&&y<=s.y+s.h)return true;return false};
 const thru=(ax,ay,bx,by)=>{const n=Math.ceil(Math.hypot(bx-ax,by-ay)/2);for(let i=1;i<n;i++)if(wallAt(ax+(bx-ax)*i/n,ay+(by-ay)*i/n))return true;return false};
 const near=(o,x,y)=>[Math.max(o.x+2,Math.min(o.x+o.w-2,x)),Math.max(o.y+2,Math.min(o.y+o.h-2,y))];
 for(const o of W0.objs){if(!LOOTT[o.t])continue;let out=null,inn=null;
  for(let y=o.y-34;y<=o.y+o.h+34&&!(out&&inn);y+=3)for(let x=o.x-34;x<=o.x+o.w+34;x+=3){if(rdist(o,x,y)>=26||blocker(x,y,7))continue;const[nx,ny]=near(o,x,y);
   if(thru(x,y,nx,ny)){if(!out)out=[x,y]}else if(!inn)inn=[x,y]}
  if(out&&inn)return{o:o.id,out,inn}}return null})()`;
async function walls(b,page){const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+path.resolve(__dirname,'..',page));await p.waitForTimeout(300);
 const r=await p.evaluate(`(()=>{${boot};const sc=${SCEN};if(!sc)return{none:1};const o=W0.objs.find(o=>o.id==sc.o),pl=S.p;
  [pl.x,pl.y]=sc.out;const near0=nearObj();const outside=near0&&near0.id==o.id;[pl.x,pl.y]=sc.inn;const near1=nearObj();const inside=near1&&near1.id==o.id;
  // zombie test: player at the outside spot's mirror is fiddly, so use the outside spot for the zombie and the inside spot for the player
  
  // a zombie on the other side of the wall, player inside
  Z.length=0;const [zx,zy]=sc.out;mk(zx,zy,{look:'heavy'});const z=Z[0];z.hp=z.mhp=9999;z.stun=0;give({bat:1});pl.eq.mel='bat';pl.as='mel';pl.ac=0;S.tg=null;
  const tg=updTarget(pl);const h0=z.hp;gearAct();const hit=h0-z.hp;
  // let the zombie try to bite through the wall for 2 s
  pl.hp=100;const hp0=pl.hp;for(let i=0;i<120;i++){z.x=zx;z.y=zy;z.al=0;upd(1/60)}
  return{o:o.t,outsideFinds:!!outside,insideFinds:!!inside,targets:!!tg,hit,bitten:hp0-pl.hp>0,d:Math.round(Math.hypot(zx-pl.x,zy-pl.y))}})()`);
 r.bite=await p.evaluate(()=>{const ws=[];for(const c of GRID)for(const s of c)if(s.wall&&s.w>60&&!ws.includes(s))ws.push(s);const pl=S.p;
  for(const w of ws){const x=w.x+w.w/2,py=w.y-5,zy=w.y+w.h+5;if(blocker(x,py,7)||blocker(x,zy,7))continue;
   Z.length=0;pl.x=x;pl.y=py;mk(x,zy,{look:'heavy'});const z=Z[0];z.hp=z.mhp=9999;pl.hp=100;pl.bleed=0;let n=0;for(let i=0;i<120;i++){z.x=x;z.y=zy;z.cd=Math.min(z.cd,0);upd(1/60)}
   return{d:Math.round(zy-py),lost:Math.round(100-pl.hp)}}return null});
 await p.close();return{...r,errs}}
(async()=>{const b=await chromium.launch();
 const before=await walls(b,'index.html'),after=await walls(b,'loot-sample.html');
 console.log('scenario: '+before.o+' against a wall, zombie '+before.d+'px away across it');
 console.log('game now  : '+JSON.stringify(before));console.log('sample    : '+JSON.stringify(after));
 ok(before.outsideFinds&&!after.outsideFinds,'searching through the wall: game allows it, sample blocks it');ok(after.insideFinds,'sample: same container still searchable from inside');
 ok(!after.targets&&after.hit==0,'sample: no auto-target / hit on a zombie behind the wall (game: target '+before.targets+', hit '+Math.round(before.hit)+')');
 ok(before.bite&&before.bite.lost>0&&after.bite&&after.bite.lost==0,'zombie '+(after.bite||{}).d+'px away across a wall: game bites (-'+(before.bite||{}).lost+' HP), sample does not (-'+(after.bite||{}).lost+')');
 // timed searching
 const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+path.resolve(__dirname,'..','loot-sample.html'));await p.waitForTimeout(300);await p.evaluate(boot);
 let r=await p.evaluate(()=>({food:srchTime({food:1}).T,rare:srchTime({food:1,ar:1}).T,part:srchTime({food:1},'o_th').T,many:srchTime({food:1,water:1,scrap:2,wood:1,cloth:1,elec:1,cement:1,meds:1,bandage:1,pills:1,fuel:1,a9mm:1,a12g:1,a556:1}).T,arR:itemRar('ar')}));
 ok(r.food==1&&r.part==4&&r.rare>r.food&&r.many<=4,'search time 1–4 s by best item '+JSON.stringify(r));
 r=await p.evaluate(()=>{const o=W0.objs.find(o=>LOOTT[o.t]&&o.t=='fridge')||W0.objs.find(o=>LOOTT[o.t]);const pl=S.p;
  // stand in front of it with a clear line
  for(const[dx,dy]of[[0,o.h+9],[0,-9],[o.w+9,o.h/2],[-9,o.h/2]]){const x=o.x+(dx>=0&&dy?o.w/2:dx>0?dx:dx<0?-9:o.w/2),y=o.y+(dy||o.h/2);pl.x=dx>0?o.x+o.w+9:dx<0?o.x-9:o.x+o.w/2;pl.y=dy>0?o.y+o.h+9:dy<0?o.y-9:o.y+o.h/2;if(!blocker(pl.x,pl.y,7)&&nearObj()==o)break}
  Z.length=0;const inv0=JSON.stringify(pl.inv);ia();const started=!!SRCH,T=SRCH&&SRCH.ctx.T,same=JSON.stringify(pl.inv)==inv0;return{id:o.id,started,T,same,near:nearObj()==o}});
 ok(r.near&&r.started&&r.same&&r.T>=1&&r.T<=4,'search starts, nothing given yet, takes '+r.T+'s '+JSON.stringify(r));
 r=await p.evaluate(()=>{const pl=S.p;for(let i=0;i<30;i++)gearUpd(1/60);const t=S.pend[SRCH.id].t;pl.x+=12;gearUpd(1/60);const stopped=!SRCH;pl.x-=12;const r0=JSON.stringify(S.pend);ia();const resumed=!!SRCH&&JSON.stringify(S.pend)==r0;return{t:+t.toFixed(2),stopped,resumed,keep:S.pend[SRCH.id].t}});
 ok(r.stopped&&r.resumed&&r.keep>=r.t-.01,'moving stops the search; pressing again resumes with the same loot and progress '+JSON.stringify(r));
 r=await p.evaluate(()=>{const pl=S.p,inv0=JSON.stringify(pl.inv),id=SRCH.id,T=SRCH.ctx.T;let n=0;while(SRCH&&n<400){gearUpd(1/60);n++}return{done:!SRCH,secs:+(n/60).toFixed(2),T,got:JSON.stringify(pl.inv)!=inv0,lo:S.lo[id]!==undefined,pend:!!S.pend[id]}});
 ok(r.done&&r.got&&r.lo&&!r.pend,'search finishes and gives the loot '+JSON.stringify(r));
 await p.evaluate(()=>{const o=W0.objs.find(o=>LOOTT[o.t]&&avail(o)&&o.t=='gunrack')||W0.objs.find(o=>LOOTT[o.t]&&avail(o)&&o.w>20);const pl=S.p;pl.x=o.x+o.w/2;pl.y=o.y+o.h+9;Z.length=0;srchStart(o,{r:{a9mm:12,pistol:1},kind:'police',tier:4,note:'',first:false});SRCH.ctx.t=SRCH.ctx.T*.55;camX=pl.x;camY=pl.y});
 await p.waitForTimeout(300);await p.screenshot({path:OUT+'/loot-search.png'});
 ok(!errs.length&&!before.errs.length&&!after.errs.length,'no page errors '+errs.concat(after.errs).join(' | '));await b.close()})();
