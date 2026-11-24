// Hands-on demolition, whole-building demolition, outposts and the storage window (endless city sample).
// usage: node tools/test_demo.js <outdir>
const {chromium}=require('playwright');const OUT=process.argv[2]||'.';const PAGE='file://'+require('path').resolve(__dirname,'..','inf-sample.html');
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);await p.evaluate(()=>{try{localStorage.clear()}catch(e){}});await p.reload();await p.waitForTimeout(1500);await p.evaluate(()=>{stop9()});
 // tool level gates (clinic needs Lv3), explosives work anywhere
 let r=await p.evaluate(()=>{const g=goInside(['clinic','police'],{dt1:1});for(const k of['dt2','dt3'])delete S.p.inv[k];Z=Z.filter(z=>!inBld(g.bi,z.x,z.y));dmodeOn();const a=!!DMODE,m=$('msg').textContent;give({dt3:1});dmodeOn();return[a,m,!!DMODE]});
 ok(!r[0]&&/Lv3/.test(r[1])&&r[2],'clinic needs a Lv3 tool for hands-on demolition: '+r[1]);
 // Lv1: every tap hits once; appliances give electronics; floors wait until furniture is gone
 r=await p.evaluate(()=>{DMODE=null;const g=goInside(['houses','apt'],{dt1:1});for(const k of['dt2','dt3'])delete S.p.inv[k];Z.length=0;dmodeOn();const lv=DMODE.lv;
  const fr=W0.objs.find(o=>o.b==g.bi&&['fridge','kitchen','tv','vending','drinks','washer'].includes(o.t));let elec=null;if(fr){S.p.x=fr.x+fr.w/2;S.p.y=fr.y+fr.h+14;const e0=S.p.inv.elec|0;for(let i=0;i<12&&W0.objs.includes(fr);i++)dHit();elec=(S.p.inv.elec|0)-e0}
  const T=dTargets(g.bi),fl=T.filter(t=>t.k=='f'),blocked=fl.some(f=>{const n=dNear(g.bi,99,9999);return!n.includes(f)});return{lv,elec,fr:fr&&fr.t,blocked,nT:T.length}});
 ok(r.lv==1&&r.fr&&r.elec>=1,'Lv1 tapping a '+r.fr+' takes it apart for '+r.elec+' electronics');ok(r.blocked,'floors under furniture stay until the furniture is gone ('+r.nT+' pieces in the building)');
 // taken-apart pieces stay gone after leaving and coming back
 r=await p.evaluate(()=>{const gk=DMODE.gk,n0=dTargets(DMODE.bi).length,broke=S.dBroke|0;const[gx,gy]=gk.split(',').map(Number);DMODE=null;infGoto(gx+9,gy);infGoto(gx,gy);const bi=W0.b.findIndex(b=>b.gk==gk&&DLV[b.kind]);return{n0,n1:dTargets(bi).length,broke}});
 ok(r.n1==r.n0&&r.broke>=1,'removed pieces stay removed after a window slide ('+r.n0+' → '+r.n1+')');
 // Lv2 drill works on its own; Lv3 hits two at a time and finishes a building into a lot
 r=await p.evaluate(()=>{const g=goInside(['school','hard','ware','fire'],{dt2:1});delete S.p.inv.dt3;Z=Z.filter(z=>!inBld(g.bi,z.x,z.y));dmodeOn();const h0=S.dHits|0;for(let i=0;i<120;i++)gearUpd(1/60);return{lv:DMODE&&DMODE.lv,hits:(S.dHits|0)-h0}});
 ok(r.lv==2&&r.hits>=3,'Lv2 drill hits on its own ('+r.hits+' hits in 2 s, no taps)');
 r=await p.evaluate(()=>{const g=goInside(['clinic','police'],{dt3:1});Z=Z.filter(z=>!inBld(g.bi,z.x,z.y));dmodeOn();const gk=g.b.gk,z0=Z.length;let n=0,rose=0;const s0=JSON.stringify(['wood','scrap','cement','elec'].map(k=>S.p.inv[k]|0));
  while(DMODE&&n<3000){n++;const L=dNear(DMODE.bi,1,99999);if(!L.length)break;const t=L[0];S.p.x=Math.max(t.x-4,Math.min(t.x+t.w+4,S.p.x));S.p.y=Math.max(t.y-4,Math.min(t.y+t.h+4,S.p.y));if(blocker(S.p.x,S.p.y,7)){S.p.x=t.x+t.w/2;S.p.y=t.y+t.h+12}const h0=S.dHits|0;dHit();if(DMODE&&DIS0(gk)._up&&!rose)rose=Z.length-z0;for(const z of Z)z.hp=0;Z.length=0}
  const lot=W0.b.find(b=>b.gk==gk);return{n,kind:lot&&lot.kind,rose,got:s0+' → '+JSON.stringify(['wood','scrap','cement','elec'].map(k=>S.p.inv[k]|0))}});
 ok(r.kind=='lot','Lv3 takes a whole clinic/police apart into a lot in '+r.n+' hits · '+r.got);ok(r.rose>=6,'half way through a large building, '+r.rose+' zombies rise from below');
 r=await p.evaluate(()=>{const g=goInside(['clinic','police'],{dt3:1});Z=Z.filter(z=>!inBld(g.bi,z.x,z.y));dmodeOn();const t=dNear(DMODE.bi,5,DTOOL[3].rng),h={};for(const q of t.slice(0,2))h[q.id]=DH[q.id];dHit();return t.slice(0,2).filter(q=>DH[q.id]!=null||!W0.objs.includes(q.r)).length});ok(r==2,'Lv3 hits two pieces at once');
 // explosives: 10 s, zombies inside die, building gone, little material; bulldozer keeps half
 r=await p.evaluate(()=>{DMODE=null;const g=goInside(['houses','apt'],{dx1:1});Z=Z.filter(z=>!inBld(g.bi,z.x,z.y));const T=dTargets(g.bi);let tot=0;for(const t of T){const q=tgtDrop(t);for(const k in q)tot+=q[k]}
  demoWhole('boom');const rf=W0.roofs.filter(q=>q.bi==g.bi)[0];mk(rf.x+rf.w/2,rf.y+rf.h/2,{look:'civ1'});const zz=Z[Z.length-1];S.p.x=rf.x+rf.w/2;S.p.y=rf.y+rf.h+260;const inv0=['wood','scrap','cement','elec','cloth','fuel'].reduce((a,k)=>a+(S.p.inv[k]|0),0);
  for(let i=0;i<11*60;i++){gearUpd(1/60);S.p.hp=100}const got=['wood','scrap','cement','elec','cloth','fuel'].reduce((a,k)=>a+(S.p.inv[k]|0),0)-inv0;return{lot:W0.b.find(b=>b.gk==g.b.gk).kind,dead:zz.hp<=0,got,tot,dx:S.p.inv.dx1|0}});
 ok(r.lot=='lot'&&r.dead&&r.dx==0,'explosives level the building after 10 s and kill zombies inside');ok(r.got<=Math.ceil(r.tot*.15),'explosives keep only ~10% of the material ('+r.got+' of '+r.tot+')');
 r=await p.evaluate(()=>{const g=goInside(['police','clinic'],{dx2:1,fuel:5});Z=Z.filter(z=>!inBld(g.bi,z.x,z.y));const T=dTargets(g.bi);let tot=0;for(const t of T){const q=tgtDrop(t);for(const k in q)tot+=q[k]}const f0=S.p.inv.fuel|0;demoWhole('dozer');const spent=f0-(S.p.inv.fuel|0);const inv0=['wood','scrap','cement','elec','cloth','fuel'].reduce((a,k)=>a+(S.p.inv[k]|0),0);
  for(let i=0;i<31*60;i++){gearUpd(1/60);S.p.hp=100;for(const z of Z)z.hp=0}const got=['wood','scrap','cement','elec','cloth','fuel'].reduce((a,k)=>a+(S.p.inv[k]|0),0)-inv0;return{lot:W0.b.find(b=>b.gk==g.b.gk).kind,got,tot,fuel:spent}});
 ok(r.lot=='lot'&&r.fuel==5&&Math.abs(r.got-r.tot*.5)<=r.tot*.12,'bulldozer: 30 s, fuel '+r.fuel+', keeps about half ('+r.got+' of '+r.tot+') '+r.lot);
 // outposts: build on a lot, costs, nights while away
 r=await p.evaluate(()=>{stop9();const gk=mkLot(['houses','apt']);const c=dmCtx().map(q=>q.t).join('|');give({wood:10,scrap:10,cloth:4});const w0=S.p.inv.wood|0;opBuild();const o=OP0()[gk];return{c,ok:!!o,paid:w0-(S.p.inv.wood|0),objs:['tentS','stash','bench3','campfire'].every(t=>W0.objs.some(q=>q.t==t&&q.b!=null))}});
 ok(/전초기지 세우기/.test(r.c)&&r.ok&&r.paid==10&&r.objs,'a rubble lot offers an outpost; building it costs wood 10 and puts up tent, stash, bench, fire');
 r=await p.evaluate(()=>{const ops=OP0(),gk=Object.keys(ops)[0],o=ops[gk];const sim=(def)=>{let dead=0,hp=0;for(let t=0;t<400;t++){const q=Object.assign({hp:100,wall:0,tur:0,ammo:0,last:0,st:{},log:[]},def);for(let d=2;d<=5;d++){const R=opRisk(q,0);if(Math.random()<R.ch){q.hp-=R.dmg;if(q.tur&&q.ammo>=10)q.ammo-=10}}if(q.hp<=0)dead++;hp+=Math.max(0,q.hp)}return{dead:dead/400,hp:Math.round(hp/400)}};
  const a=sim({}),b=sim({wall:2,tur:2,ammo:60});o.last=S.day;const n0=o.log.length;S.p.x+=PX*3;gearUpd(1/60);S.day++;OPDAY=S.day;opNight();const n1=o.log.length;S.day++;OPDAY=S.day;opNight();const n2=OP0()[gk]?OP0()[gk].log.length:-1;return{a,b,n1:n1-n0,n2}});
 ok(r.a.hp<r.b.hp-20&&r.b.dead==0,'undefended outposts lose far more over 4 risky nights ('+r.a.hp+'% vs '+r.b.hp+'%, '+Math.round(r.a.dead*100)+'% fall)');ok(r.n1==0&&r.n2==1,'no attack roll until two days away');
 r=await p.evaluate(()=>{stop9();scene9('op5');const c=W0.objs.find(q=>q.ruin),h=opHere();const b=dmCtx().map(q=>q.t).join('|');const a0=S.p.inv.a9mm|0;const q=dmCtx().find(q=>/잔해/.test(q.t));if(q)q.f();return{c:!!c,op:!!h.o,b,got:(S.p.inv.a9mm|0)-a0}});
 ok(r.c&&!r.op&&/잔해 상자/.test(r.b)&&r.got==30,'a fallen outpost leaves a crate with half the stash (got 30 of 60 rounds)');
 await p.evaluate(()=>scene9('op2'));await p.waitForTimeout(500);await p.screenshot({path:OUT+'/op-panel.png'});await p.evaluate(()=>{closeBase();PAUSE=false});await p.waitForTimeout(300);await p.screenshot({path:OUT+'/op-world.png'});
 // storage window: tiles with icons, move 1 / 10 / all, pick list with weight
 r=await p.evaluate(()=>{scene9('st1');return new Promise(res=>setTimeout(()=>{const tiles=document.querySelectorAll('#bm .stT img').length;const st=S.base.st,a0=st.a9mm,b0=S.p.inv.a9mm|0;stPick('a9mm','box');stMove(10);const one=[a0-st.a9mm,(S.p.inv.a9mm|0)-b0];stPick('scrap','box');const s0=st.scrap;stMove(s0);res({tiles,one,scrapGone:!st.scrap})},150))});
 ok(r.tiles>=20&&r.one.join()=='10,10'&&r.scrapGone,'storage shows '+r.tiles+' pixel tiles; take 10 rounds, take all scrap');
 await p.screenshot({path:OUT+'/stash.png'});
 r=await p.evaluate(()=>{scene9('st2');return new Promise(res=>setTimeout(()=>{const st=S.base.st,b={a9mm:S.p.inv.a9mm|0,medkit:S.p.inv.medkit|0,enh1:S.p.inv.enh1|0};const wtxt=document.querySelector('#bm .stPkB b').textContent;stTakeList();res({got:[(S.p.inv.a9mm|0)-b.a9mm,(S.p.inv.medkit|0)-b.medkit,(S.p.inv.enh1|0)-b.enh1],wtxt,left:st.a9mm})},150))});
 ok(r.got.join()=='30,1,4'&&/kg/.test(r.wtxt),'pick list takes exactly 30 rounds, 1 medkit, 4 stones at once (weight preview '+r.wtxt+')');
 await p.evaluate(()=>scene9('st2'));await p.waitForTimeout(300);await p.screenshot({path:OUT+'/stash-pick.png'});
 await p.evaluate(()=>scene9('d1'));await p.waitForTimeout(400);await p.evaluate(()=>{for(let i=0;i<4;i++)dHit()});await p.waitForTimeout(200);await p.screenshot({path:OUT+'/demo-d1.png'});
 ok(!errs.length,'no page errors '+errs.join(' | '));await b.close()})();
