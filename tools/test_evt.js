// Merchant, world events, revenge raids, turret aim lines (endless city sample). usage: node tools/test_evt.js <outdir>
const {chromium}=require('playwright');const OUT=process.argv[2]||'.';const PAGE='file://'+require('path').resolve(__dirname,'..','inf-sample.html');
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);await p.evaluate(()=>{try{localStorage.clear()}catch(e){}});await p.reload();await p.waitForTimeout(1500);await p.evaluate(()=>stop9());
 // merchant: trade, never a target, walks
 let r=await p.evaluate(()=>{scene9('m1');const m=Z.find(z=>z.npc);const c=dmCtx().map(q=>q.t).join('|');openMer(m);const cur=typeof I_BY.tkn!='undefined'&&I_BY.tkn?'tkn':'scrap';give({[cur]:300});const s0=S.p.inv[cur]|0,k=Object.keys(m.st).find(x=>m.st[x].pr<=s0);const pr=m.st[k].pr;merBuy(k);const s1=S.p.inv[cur]|0;merSell('pistol');const s2=S.p.inv[cur]|0;closeBase();PAUSE=false;
  const tg=updTarget(S.p);return{c,paid:s0-s1==pr,sold:s2>s1,tgt:tg===m,hi:m.st.enh3!=null||m.st.milarmor!=null}});
 ok(/상인과 거래/.test(r.c)&&r.paid&&r.sold,'trade with the merchant: buy and sell for the trade currency');ok(!r.tgt&&r.hi,'the merchant is never auto-targeted; a zone 3 merchant sells high-tier goods');
 r=await p.evaluate(()=>{const m=Z.find(z=>z.npc);S.p.x-=400;const x0=m.x,y0=m.y;return new Promise(res=>setTimeout(()=>res({moved:Math.hypot(m.x-x0,m.y-y0)>20,ph:m.ph>0}),5000))});ok(r.moved&&r.ph,'the merchant walks the roads');
 // flare merchant waits, then leaves
 r=await p.evaluate(()=>{stop9();for(const e of WEV.slice())evEnd(e);const e=evStart('merf');const m=e.m;for(let i=0;i<60*20;i++){gearUpd(1/60)}const waited=m.wait>0;m.life=0.01;gearUpd(.1);return{waited,gone:m.hp<0}});ok(r.waited&&r.gone,'a flare merchant waits on the spot and later leaves');
 // events
 r=await p.evaluate(()=>{stop9();infGoto(31,0);Z.length=0;S.sa=1e9;for(const e of WEV.slice())evEnd(e);const o={};const a=evStart('air');o.air=[!!a.x,a.fall>0];a.fall=0;S.p.x=a.x;S.p.y=a.y+30;const c=dmCtx().map(q=>q.t).join('|');const s0=JSON.stringify(S.p.inv);const q=dmCtx().find(q=>/보급 상자/.test(q.t));q&&q.f();o.airOpen=JSON.stringify(S.p.inv)!=s0&&/보급 상자/.test(c);
  Z.length=0;evStart('horde');o.horde=Z.filter(z=>z.horde).length;evStart('moon');o.moon=S.moon==1&&document.body.dataset.moon=='1';evStart('fog');o.fog=document.body.dataset.fog=='1';const h=evStart('heli');o.heli=W0.objs.some(x=>x.t=='heli');const f=evStart('fight');o.fight=Z.some(z=>z.raider);return o});
 ok(r.air[0]&&r.air[1]&&r.airOpen,'airdrop falls, then the crate opens for loot');ok(r.horde>=30,'zombie horde of '+r.horde);ok(r.moon&&r.fog,'blood moon and fog change the mood');ok(r.heli&&r.fight,'helicopter crash site and a raiders-vs-zombies fight appear');
 r=await p.evaluate(()=>{for(const e of WEV.slice())evEnd(e);const pl=evDay(true);return{big:['air','horde','moon'].includes(pl.big),n:pl.sm.length}});ok(r.big&&r.n>=1&&r.n<=2,'a day plans one big and '+r.n+' small events');
 // revenge on a taken camp
 r=await p.evaluate(()=>{stop9();for(const e of WEV.slice())evEnd(e);S.moon=0;let f=null;for(let d=40;d<100&&!f;d++)for(let a=-d;a<=d&&!f;a++)for(const[x,y]of[[a,-d],[a,d],[-d,a],[d,a]])if(kindAt(x,y)=='rbase'){f=[x,y];break}infGoto(f[0],f[1]);Z.length=0;S.sa=1e9;rbTick();for(const z of Z)if(z.rbase)z.hp=0;return f.join()});
 await p.waitForTimeout(400);r=await p.evaluate(gk=>{const[gx,gy]=gk.split(',').map(Number),[ox,oy]=bo(gx-OGX,gy-OGY);S.p.x=ox+BW/2;S.p.y=oy+BH/2+120;rbTake();const st=S.inf.rb[gk];const d0=S.day;gearUpd(1/60);const n0=Z.filter(z=>z.raider).length;S.day=d0+1;gearUpd(1/60);const n1=Z.filter(z=>z.raider).length;S.day=d0+2;gearUpd(1/60);const n2=Z.filter(z=>z.raider).length;
  const o=OP0()[gk];Z.length=0;S.p.x+=PX*3;gearUpd(1/60);const hp0=o.hp;S.day=st.rv.next;gearUpd(1/60);return{n0,n1,n2,goal:Z.length==0,away:hp0-o.hp,log:o.log[0]}},r);
 ok(r.n1==r.n0&&r.n2>r.n1,'revenge squads arrive two days after taking the camp ('+r.n2+' raiders)');ok(r.away>0&&/복수/.test(r.log),'while you are away the turrets fight it out: −'+r.away+'% ('+r.log+')');
 // turret aim lines
 r=await p.evaluate(()=>{stop9();const gk=mkOp(['houses','apt'],{});const o=OP0()[gk];o.st.a9mm=200;o.turs=[{t:'mg',rx:BW/2,ry:BH/2-120,dir:0}];infRebuild();const[gx,gy]=gk.split(',').map(Number),[ox,oy]=bo(gx-OGX,gy-OGY);Z.length=0;mk(ox+BW/2+180,oy+BH/2-134,{look:'civ1'});const z=Z[0];z.hp=z.mhp=1e4;z.sm=0;for(let i=0;i<30;i++)gearUpd(1/60);return o.turs[0].tg===z});
 ok(r,'a turret remembers what it is aiming at (drawn as a red line)');
 await p.evaluate(()=>scene9('tart'));await p.waitForTimeout(4500);await p.screenshot({path:OUT+'/aim.png'});await p.evaluate(()=>scene9('m1'));await p.waitForTimeout(700);await p.evaluate(()=>{const m=Z.find(z=>z.npc);openMer(m)});await p.waitForTimeout(300);await p.screenshot({path:OUT+'/mer.png'});
 await p.evaluate(()=>{closeBase();PAUSE=false;scene9('eair')});await p.waitForTimeout(2500);await p.screenshot({path:OUT+'/eair.png'});await p.evaluate(()=>scene9('emoon'));await p.waitForTimeout(1500);await p.screenshot({path:OUT+'/emoon.png'});
 ok(!errs.length,'no page errors '+errs.join(' | '));await b.close()})();
