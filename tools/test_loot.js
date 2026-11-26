// Timed searching (1–4 s, 손재주 skill, noise for epic/legendary) + wall checks (no looting / hitting / biting through walls).
// usage: node tools/test_loot.js <outdir> [page]   (default page: index.html)
// usage: node tools/test_loot.js <outdir>
const {chromium}=require('playwright');const PAGE=process.argv[3]||'index.html';const OUT=process.argv[2]||'.';const path=require('path');
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
const boot=`localStorage.clear();if(typeof rerollStart=='function')rerollStart(${process.env.SEED||4242});start('S',false);if(S.pg&&!S.pg.tr.length){S.pg.tr=['cop'];$('bm').dataset.m='';closeBase();PAUSE=false}`;
// find a container that touches a wall, and spots on both sides of that wall
const SCEN=`(()=>{const wallAt=(x,y)=>{const gx=x/GC|0,gy=y/GC|0;for(const s of GRID[gy*GX+gx]||[])if(s.wall&&x>=s.x&&x<=s.x+s.w&&y>=s.y&&y<=s.y+s.h)return true;return false};
 const thru=(ax,ay,bx,by)=>{const n=Math.ceil(Math.hypot(bx-ax,by-ay)/2);for(let i=1;i<n;i++)if(wallAt(ax+(bx-ax)*i/n,ay+(by-ay)*i/n))return true;return false};
 const near=(o,x,y)=>[Math.max(o.x+2,Math.min(o.x+o.w-2,x)),Math.max(o.y+2,Math.min(o.y+o.h-2,y))];
 for(const o of W0.objs){if(!LOOTT[o.t]||window.__only&&o.id!=window.__only)continue;let out=null,inn=null;
  for(let y=o.y-34;y<=o.y+o.h+34&&!(out&&inn);y+=3)for(let x=o.x-34;x<=o.x+o.w+34;x+=3){if(rdist(o,x,y)>=26||blocker(x,y,7))continue;const[nx,ny]=near(o,x,y);
   if(thru(x,y,nx,ny)){if(!out)out=[x,y]}else if(!inn){/* only a spot where this container is the one you would search */const px=S.p.x,py=S.p.y;S.p.x=x;S.p.y=y;const n=nearObj();S.p.x=px;S.p.y=py;if(n&&n.id==o.id)inn=[x,y]}}
  if(out&&inn)return{o:o.id,out,inn}}return null})()`;
async function walls(b,page){const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+path.resolve(__dirname,'..',page));await p.waitForTimeout(300);
 const r=await p.evaluate(`(()=>{${boot};let sc=${SCEN};if(!sc)return{none:1};/* centre the endless map on that block first, then find the spots again */if(typeof infGoto=='function'){const o0=W0.objs.find(o=>o.id==sc.o),g=gOf(o0.x+o0.w/2,o0.y+o0.h/2);infGoto(g[0],g[1]);window.__only=sc.o;sc=${SCEN};window.__only=null;if(!sc)return{none:1}}const o=W0.objs.find(o=>o.id==sc.o),pl=S.p;
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
 const after=await walls(b,PAGE);
 console.log('scenario: '+after.o+' against a wall, zombie '+after.d+'px away across it · '+JSON.stringify(after));
 ok(!after.outsideFinds,'cannot search a container through the wall');ok(after.insideFinds,'same container still searchable from inside');
 ok(!after.targets&&after.hit==0,'no auto-target / hit on a zombie behind the wall');
 ok(after.bite&&after.bite.lost==0,'zombie '+(after.bite||{}).d+'px away across a wall cannot bite (-'+(after.bite||{}).lost+' HP)');
 // timed searching
 const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+path.resolve(__dirname,'..',PAGE));await p.waitForTimeout(300);await p.evaluate(boot);
 let r=await p.evaluate(()=>({food:srchTime({food:1}).T,rare:srchTime({food:1,ar:1}).T,part:srchTime({food:1},'o_th').T,many:srchTime({food:1,water:1,scrap:2,wood:1,cloth:1,elec:1,cement:1,meds:1,bandage:1,pills:1,fuel:1,a9mm:1,a12g:1,a556:1}).T,arR:itemRar('ar')}));
 ok(r.food==1&&r.part==4&&r.rare>r.food&&r.many<=4,'search time 1–4 s by best item '+JSON.stringify(r));
 r=await p.evaluate(()=>{/* centre the endless map on a block with a fridge (teleporting into another block shifts the map mid-search), then take a container there you can stand in front of */
  const f0=W0.objs.find(o=>LOOTT[o.t]&&o.t=='fridge')||W0.objs.find(o=>LOOTT[o.t]&&o.w>16);if(typeof infGoto=='function'&&typeof gOf=='function'){const[gx,gy]=gOf(f0.x+f0.w/2,f0.y+f0.h/2);infGoto(gx,gy)}const pl=S.p,here=o=>typeof gOf!='function'||gOf(o.x+o.w/2,o.y+o.h/2).join()==gOf(pl.x,pl.y).join();
  let o=null;const C=W0.objs.filter(q=>LOOTT[q.t]&&q.w>16&&here(q)).sort((a,b)=>(b.t=='fridge')-(a.t=='fridge'));
  for(const q of C){for(const[dx,dy]of[[0,q.h+9],[0,-9],[q.w+9,q.h/2],[-9,q.h/2]]){pl.x=dx>0?q.x+q.w+9:dx<0?q.x-9:q.x+q.w/2;pl.y=dy>0?q.y+q.h+9:dy<0?q.y-9:q.y+q.h/2;if(!blocker(pl.x,pl.y,7)&&nearObj()==q){o=q;break}}if(o)break}
  Z.length=0;const inv0=JSON.stringify(pl.inv);ia();const started=!!SRCH,T=SRCH&&SRCH.ctx.T,same=JSON.stringify(pl.inv)==inv0;return{id:o.id,started,T,same,near:nearObj()==o}});
 ok(r.near&&r.started&&r.same&&r.T>=1&&r.T<=4,'search starts, nothing given yet, takes '+r.T+'s '+JSON.stringify(r));
 r=await p.evaluate(()=>{const pl=S.p;for(let i=0;i<30;i++)gearUpd(1/60);const t=S.pend[SRCH.id].t;pl.x+=12;gearUpd(1/60);const stopped=!SRCH;pl.x-=12;const r0=JSON.stringify(S.pend);ia();const resumed=!!SRCH&&JSON.stringify(S.pend)==r0;return{t:+t.toFixed(2),stopped,resumed,keep:S.pend[SRCH.id].t}});
 ok(r.stopped&&r.resumed&&r.keep>=r.t-.01,'moving stops the search; pressing again resumes with the same loot and progress '+JSON.stringify(r));
 r=await p.evaluate(()=>{const pl=S.p,inv0=JSON.stringify(pl.inv),id=SRCH.id,T=SRCH.ctx.T;let n=0;while(SRCH&&n<400){gearUpd(1/60);n++}return{done:!SRCH,secs:+(n/60).toFixed(2),T,got:JSON.stringify(pl.inv)!=inv0,lo:S.lo[id]!==undefined,pend:!!S.pend[id]}});
 ok(r.done&&r.got&&r.lo&&!r.pend,'search finishes and gives the loot '+JSON.stringify(r));
 await p.evaluate(()=>{const o=W0.objs.find(o=>LOOTT[o.t]&&avail(o)&&o.t=='gunrack')||W0.objs.find(o=>LOOTT[o.t]&&avail(o)&&o.w>20);const pl=S.p;pl.x=o.x+o.w/2;pl.y=o.y+o.h+9;Z.length=0;srchStart(o,{r:{a9mm:12,pistol:1},kind:'police',tier:4,note:'',first:false});SRCH.ctx.t=SRCH.ctx.T*.55;camX=pl.x;camY=pl.y});
 await p.waitForTimeout(300);await p.screenshot({path:OUT+'/loot-search.png'});
 r=await p.evaluate(()=>{const base=srchTime({ar:1}).T;S.pg.sk.surv5=3;const fast=srchTime({ar:1}).T;S.pg.sk.surv5=0;S.pg.lv=3;openChar('skill');const c=document.querySelector('[data-k="surv5"]');const lock=c.classList.contains('lock');S.pg.kp=1;c.click();return{base,fast,lock,rank:S.pg.sk.surv5|0}});
 ok(r.fast<r.base&&Math.abs(r.fast-r.base*.7)<.02&&!r.lock&&r.rank==1,'손재주: learnable at Lv 3 without earlier tiers, rank 3 = -30% search time '+JSON.stringify(r));
 r=await p.evaluate(()=>{closeBase();const pl=S.p,res={};for(const[k,item]of[['common',{food:1}],['epic',{ar:1}],['legend',{}]]){if(SRCH){SRCH=null}Z.length=0;mk(pl.x+250,pl.y,{look:'heavy'});mk(pl.x+130,pl.y,{look:'heavy'});for(const z of Z){z.al=0;z.stun=0}
   const o=W0.objs.find(o=>LOOTT[o.t]&&avail(o)&&!(S.pend||{})[o.id]&&o.id!=res.last);res.last=o.id;const ctx={r:Object.assign({},item),kind:'police',tier:4,note:'',first:false};
   const old=s3SearchRoll;if(k=='legend')s3SearchRoll=()=> 'o_th';else s3SearchRoll=()=>null;srchStart(o,ctx);s3SearchRoll=old;res[k]=Z.map(z=>z.al>0?1:0).join('');delete S.pend[o.id];SRCH=null}delete res.last;return res});
 ok(r.common=='00'&&r.epic=='01'&&r.legend=='11','loot noise: none for common, 160px for epic, 320px for legendary (zombies alerted '+JSON.stringify(r)+')');
 ok(!errs.length&&!after.errs.length,'no page errors '+errs.concat(after.errs).join(' | '));await b.close()})();
