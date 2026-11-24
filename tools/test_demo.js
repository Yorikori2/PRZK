// Hands-on demolition, whole-building demolition, outposts and the storage window (endless city sample).
// usage: node tools/test_demo.js <outdir>
const {chromium}=require('playwright');const OUT=process.argv[2]||'.';const PAGE='file://'+require('path').resolve(__dirname,'..','inf-sample.html');
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);await p.evaluate(()=>{try{localStorage.clear()}catch(e){}});await p.reload();await p.waitForTimeout(1500);await p.evaluate(()=>{stop9()});
 // tool level gates: a Lv1 hammer can't touch a clinic
 let r=await p.evaluate(()=>{const g=goInside(['clinic','police'],{});Z=Z.filter(z=>!inBld(g.bi,z.x,z.y));wield('dt1');const h0=S.dHits|0;dHit();const m=$('msg').textContent;return[(S.dHits|0)-h0,m]});
 ok(r[0]==0&&/Lv3/.test(r[1]),'a Lv1 hammer cannot take apart a clinic: '+r[1]);
 // Lv1 hammer: equip, press attack; appliances give electronics; hammer never lifts floors, the pry bar only lifts floors
 r=await p.evaluate(()=>{const g=goInside(['houses','apt'],{});Z.length=0;wield('dt1');const z=dZone();
  const fr=W0.objs.find(o=>o.b==g.bi&&['fridge','kitchen','tv','vending','drinks','washer'].includes(o.t));let elec=null;if(fr){S.p.x=fr.x+fr.w/2;S.p.y=fr.y+fr.h+14;const e0=S.p.inv.elec|0;for(let i=0;i<14&&W0.objs.includes(fr);i++){S.p.ac=0;gearAct()}elec=(S.p.inv.elec|0)-e0}
  const hammer=dNear(z,DT.dt1,999,9999),bar=dNear(z,DT.dt1f,999,9999);return{elec,fr:fr&&fr.t,hf:hammer.some(t=>t.fl),bo:bar.every(t=>t.fl),nb:bar.length}});
 ok(r.fr&&r.elec>=1,'Lv1 hammer: swinging at a '+r.fr+' takes it apart for '+r.elec+' electronics');ok(!r.hf&&r.bo,'hammer never lifts floors; pry bar only lifts floors ('+r.nb+' free floors)');
 r=await p.evaluate(()=>{const z=dZone();wield('dt1f');let t=dNear(z,DT.dt1f,1,9999)[0];if(!t){const f=z.T().find(q=>q.fl);W0.objs=W0.objs.filter(o=>!(o.x<f.x+f.w&&o.x+o.w>f.x&&o.y<f.y+f.h&&o.y+o.h>f.y));infDerived();t=dNear(z,DT.dt1f,1,9999)[0]}if(!t)return null;S.p.x=t.x+t.w/2;S.p.y=t.y+t.h/2;const w0=S.p.inv.wood|0,c0=S.p.inv.cement|0,cl=S.p.inv.cloth|0;for(let i=0;i<10;i++){S.p.ac=0;gearAct()}return{gone:!W0.fl.includes(t.r),got:(S.p.inv.wood|0)-w0+(S.p.inv.cement|0)-c0+(S.p.inv.cloth|0)-cl}});
 ok(r&&r.gone&&r.got>=1,'pry bar lifts a free floor tile for materials '+JSON.stringify(r));
 // taken-apart pieces stay gone after leaving and coming back
 r=await p.evaluate(()=>{const z=dZone(),gk=z.gk,n0=z.T().length;const[gx,gy]=gk.split(',').map(Number);infGoto(gx+9,gy);infGoto(gx,gy);const bi=W0.b.findIndex(b=>b.gk==gk&&DLV[b.kind]);return{n0,n1:dTargets(bi).length}});
 ok(r.n1==r.n0,'removed pieces stay removed after a window slide ('+r.n0+' → '+r.n1+')');
 // Lv2 drill: only what is inside the ring comes apart while you stand still; walking on brings more
 r=await p.evaluate(()=>{const g=goInside(['school','hard','ware','fire'],{});Z=Z.filter(z=>!inBld(g.bi,z.x,z.y));wield('dt2');const z=dZone();const tot=z.T().length;const h0=S.dHits|0;for(let i=0;i<60*25;i++){gearUpd(1/60);Z.length=0}const still=(S.dHits|0)-h0,left=z.T().length,inReach=dNear(z,DT.dt2,99,DT.dt2.rng).length;
  const far=z.T().filter(t=>rDist(t,S.p.x,S.p.y)>DT.dt2.rng+5).length;return{still,tot,left,inReach,far}});
 ok(r.still>=3&&r.inReach==0&&r.far>0&&r.left>r.tot*.5,'Lv2 drill standing still: '+r.still+' hits, then stops when nothing is left in its ring ('+r.far+' pieces still out of reach)');
 // Lv3: two pieces per tick, whole clinic comes down, zombies rise half way
 r=await p.evaluate(()=>{const g=goInside(['clinic','police'],{});Z=Z.filter(z=>!inBld(g.bi,z.x,z.y));wield('dt3');const z=dZone(),t=dNear(z,DT.dt3,2,DT.dt3.rng);const ids=t.map(q=>q.id);dHit();return ids.filter(id=>DH[id]!=null||!z.T().some(q=>q.id==id)).length});ok(r==2,'Lv3 hits two pieces at once');
 r=await p.evaluate(()=>{const g=goInside(['clinic','police'],{});Z=Z.filter(z=>!inBld(g.bi,z.x,z.y));wield('dt3');const gk=g.b.gk,z0=Z.length;let n=0,rose=0;const s0=JSON.stringify(['wood','scrap','cement','elec'].map(k=>S.p.inv[k]|0));
  while(n<3000){n++;const z=dZone();if(!z||z.kind=='lot')break;const L=dNear(z,{mode:'all'},1,99999);if(!L.length)break;const t=L[0],cx=t.x+t.w/2,cy=t.y+t.h/2,rs=W0.roofs.filter(q=>q.bi==z.bi).sort((a,b)=>Math.hypot(a.x+a.w/2-cx,a.y+a.h/2-cy)-Math.hypot(b.x+b.w/2-cx,b.y+b.h/2-cy))[0];S.p.x=Math.max(rs.x+12,Math.min(rs.x+rs.w-12,cx));S.p.y=Math.max(rs.y+12,Math.min(rs.y+rs.h-12,cy));dHit();if(DIS0(gk)._up&&!rose)rose=Z.length-z0;for(const q of Z)q.hp=0;Z.length=0}
  const lot=W0.b.find(b=>b.gk==gk);return{n,kind:lot&&lot.kind,rose,got:s0+' → '+JSON.stringify(['wood','scrap','cement','elec'].map(k=>S.p.inv[k]|0))}});
 ok(r.kind=='lot','Lv3 takes a whole clinic/police apart into a lot in '+r.n+' ticks · '+r.got);ok(r.rose>=6,'half way through a large building, '+r.rose+' zombies rise from below');
 // rubble and the ruin crate on a lot can be smashed
 r=await p.evaluate(()=>{scene9('junk');const z=dZone(),T=z.T(),c=T.find(t=>t.ruin),a0=S.p.inv.a9mm|0;S.p.x=c.x+c.w/2;S.p.y=c.y+c.h+8;for(let i=0;i<12&&z.T().some(t=>t.ruin);i++){S.p.ac=0;gearAct()}const rub=z.T().filter(t=>t.r.t=='rubble').length;return{kind:z.kind,n:T.length,crate:!z.T().some(t=>t.ruin),got:(S.p.inv.a9mm|0)-a0,rub}});
 ok(r.kind=='lot'&&r.crate&&r.got==40&&r.rub>=2,'on a lot the hammer smashes rubble ('+r.rub+' piles) and the ruin crate (got its 40 rounds)');
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
 r=await p.evaluate(()=>{const sim=(def)=>{let dead=0,hp=0;for(let t=0;t<400;t++){const q=Object.assign({hp:100,wall:0,turs:[],last:0,st:{a9mm:200},log:[]},def);for(let d=2;d<=5;d++){const R=opRisk(q,0);if(Math.random()<R.ch)q.hp-=R.dmg}if(q.hp<=0)dead++;hp+=Math.max(0,q.hp)}return{dead:dead/400,hp:Math.round(hp/400)}};
  const a=sim({}),b=sim({wall:2,turs:[{t:'mg'},{t:'mg'}]});const ops=OP0(),gk=Object.keys(ops)[0],o=ops[gk];o.last=S.day;const n0=o.log.length;S.p.x+=PX*3;gearUpd(1/60);S.day++;OPDAY=S.day;opNight();const n1=o.log.length;S.day++;OPDAY=S.day;opNight();const n2=OP0()[gk]?OP0()[gk].log.length:-1;return{a,b,n1:n1-n0,n2}});
 ok(r.a.hp<r.b.hp-20&&r.b.dead==0,'undefended outposts lose far more over 4 risky nights ('+r.a.hp+'% vs '+r.b.hp+'%, '+Math.round(r.a.dead*100)+'% fall)');ok(r.n1==0&&r.n2==1,'no attack roll until two days away');
 r=await p.evaluate(()=>{stop9();scene9('op5');const c=W0.objs.find(q=>q.ruin),h=opHere();return{c:!!c,op:!!h.o,left:S.inf.ruin&&S.inf.ruin[h.gk]&&S.inf.ruin[h.gk].a9mm}});
 ok(r.c&&!r.op&&r.left==30,'a fallen outpost leaves a crate with half the stash (30 of 60 rounds)');
 // turrets: place where you stand/face, arc limits, ammo from the outpost stash, dry turret shows
 r=await p.evaluate(()=>{stop9();const gk=mkOp(['houses','apt'],{});const o=OP0()[gk];give({scrap:40,elec:20});o.st.a9mm=50;const[gx,gy]=gk.split(',').map(Number),[ox,oy]=bo(gx-OGX,gy-OGY);
  S.p.x=ox+120;S.p.y=oy+BH/2+200;S.p.fx=1;S.p.fy=0;placeStart('mg');const bad=placeOk();PLACE.dir=0;placeDo();const q=o.turs[0];const tx=ox+q.rx,ty=oy+q.ry-14;
  Z.length=0;mk(tx+200,ty,{look:'civ1'});mk(tx-200,ty,{look:'civ1'});const front=Z[0],back=Z[1];for(const z of Z){z.sm=0}for(let i=0;i<60*4;i++){gearUpd(1/60);for(const z of Z){z.x=z===front?tx+200:tx-200;z.y=ty}}
  const used=50-(o.st.a9mm|0);o.st.a9mm=0;Z.length=0;mk(tx+150,ty,{look:'civ1'});for(let i=0;i<60;i++)gearUpd(1/60);const dry=!!q.dry;return{bad,n:o.turs.length,front:front.hp<=0||front.hp<front.mhp,back:back.hp==back.mhp,used,dry,rel:[q.rx,q.ry]}});
 ok(r.bad==''&&r.n==1,'turret placed where the player faces '+JSON.stringify(r.rel));ok(r.front&&r.back,'it shoots what is inside its 120° arc and ignores the zombie behind it');ok(r.used>0&&r.dry,'it spends 9mm from the outpost stash ('+r.used+') and goes dry when the stash is empty');
 r=await p.evaluate(()=>{const h=opHere(),o=h.o,[ox,oy]=bo(h.gx-OGX,h.gy-OGY);o.st.elec=20;o.turs=[{t:'tz',rx:BW/2,ry:BH/2+100,dir:0}];infRebuild();const x=ox+BW/2,y=oy+BH/2+86;Z.length=0;mk(x,y-80,{look:'civ1'});mk(x,y+80,{look:'civ1'});mk(x-75,y,{look:'civ1'});for(let i=0;i<60*3;i++){gearUpd(1/60)}return Z.filter(z=>z.hp<z.mhp).length});
 ok(r>=2,'tesla coil covers all around ('+r+' zombies hit)');
 await p.evaluate(()=>scene9('tur2'));await p.waitForTimeout(3500);await p.screenshot({path:OUT+'/tur-battle.png'});
 await p.evaluate(()=>{scene9('tur1')});await p.waitForTimeout(400);await p.screenshot({path:OUT+'/tur-panel.png'});await p.evaluate(()=>{placeStart('sn');PLACE.dir=-Math.PI/2});await p.waitForTimeout(400);await p.screenshot({path:OUT+'/tur-place.png'});await p.evaluate(()=>{PLACE=null});
 // storage window: tiles with icons, move 1 / 10 / all, pick list with weight
 r=await p.evaluate(()=>{scene9('st1');return new Promise(res=>setTimeout(()=>{const tiles=document.querySelectorAll('#bm .stT img').length;const st=S.base.st,a0=st.a9mm,b0=S.p.inv.a9mm|0;stPick('a9mm','box');stMove(10);const one=[a0-st.a9mm,(S.p.inv.a9mm|0)-b0];stPick('scrap','box');const s0=st.scrap;stMove(s0);res({tiles,one,scrapGone:!st.scrap})},150))});
 ok(r.tiles>=20&&r.one.join()=='10,10'&&r.scrapGone,'storage shows '+r.tiles+' pixel tiles; take 10 rounds, take all scrap');
 await p.screenshot({path:OUT+'/stash.png'});
 r=await p.evaluate(()=>{scene9('st2');return new Promise(res=>setTimeout(()=>{const st=S.base.st,b={a9mm:S.p.inv.a9mm|0,medkit:S.p.inv.medkit|0,enh1:S.p.inv.enh1|0};const wtxt=document.querySelector('#bm .stPkB b').textContent;stTakeList();res({got:[(S.p.inv.a9mm|0)-b.a9mm,(S.p.inv.medkit|0)-b.medkit,(S.p.inv.enh1|0)-b.enh1],wtxt,left:st.a9mm})},150))});
 ok(r.got.join()=='30,1,4'&&/kg/.test(r.wtxt),'pick list takes exactly 30 rounds, 1 medkit, 4 stones at once (weight preview '+r.wtxt+')');
 await p.evaluate(()=>scene9('st2'));await p.waitForTimeout(300);await p.screenshot({path:OUT+'/stash-pick.png'});
 await p.evaluate(()=>scene9('d2'));await p.waitForTimeout(2500);await p.screenshot({path:OUT+'/demo-d2.png'});
 ok(!errs.length,'no page errors '+errs.join(' | '));await b.close()})();
