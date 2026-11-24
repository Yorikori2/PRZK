// Richer events, merchant art, revenge envoys (endless city sample). usage: node tools/test_evt2.js <outdir>
const {chromium}=require('playwright');const OUT=process.argv[2]||'.';const PAGE='file://'+require('path').resolve(__dirname,'..','inf-sample.html');
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);await p.evaluate(()=>{try{localStorage.clear()}catch(e){}});await p.reload();await p.waitForTimeout(1500);await p.evaluate(()=>stop9());
 let r=await p.evaluate(()=>{const set=new Set();for(const d of D8)for(const f of[-1,2,6]){const c=merSprite(d,f);set.add(c.toDataURL())}return set.size});ok(r>=20,'merchant has its own sprite in 8 facings and walk steps ('+r+')');
 // airdrop phases
 r=await p.evaluate(()=>{stop9();infGoto(31,0);Z.length=0;S.sa=1e9;S.p.hp=1e5;const e=evStart('air');const ph0=e.ph;for(let i=0;i<60*8;i++)gearUpd(1/60);const ph1=e.ph,dropped=!!e.dropped;S.p.x=e.x;S.p.y=e.y+40;const c=dmCtx().map(q=>q.t).join('|');airHack(e);for(let i=0;i<60*5.2;i++)gearUpd(1/60);const ph2=e.ph,z0=Z.length;
  for(let i=0;i<60*61;i++){gearUpd(1/60);S.p.x=e.x;S.p.y=e.y+40;S.p.hp=1e5}const ph3=e.ph;const s0=JSON.stringify(S.p.inv);const q=dmCtx().find(q=>/컨테이너 열기/.test(q.t));q&&q.f();return{ph0,ph1,dropped,c,ph2,waves:Z.length-z0,ph3,got:JSON.stringify(S.p.inv)!=s0}});
 ok(r.ph0=='plane'&&r.dropped&&r.ph1=='ground','airdrop: plane passes, then the container is on the ground');ok(/해킹/.test(r.c)&&r.ph2=='def','hacking takes 5 s and sets off the alarm '+r.c+' '+r.ph2);ok(r.waves>=20&&r.ph3=='open'&&r.got,'60 s of waves ('+r.waves+' zombies), then the container opens with loot');
 // horde scales with level
 r=await p.evaluate(()=>{const o={};for(const lv of[1,25,50]){S.pg.lv=lv;o[lv]=[];for(let i=0;i<4;i++)o[lv].push(hordeN())}return o});ok(Math.min(...r[1])>=15&&Math.max(...r[1])<=20&&Math.max(...r[50])==200&&r[25][0]>90&&r[25][0]<120,'horde size by level: Lv1 '+r[1]+' · Lv25 '+r[25]+' · Lv50 '+r[50]);
 // heli falls then wreck; radio before the fight; flare whistle then merchant
 r=await p.evaluate(()=>{stop9();Z.length=0;S.sa=1e9;S.p.hp=1e5;const h=evStart('heli');gearUpd(1/60);const fly=h.ph=='fly'&&!W0.objs.some(o=>o.t=='heliW');for(let i=0;i<60*5.5;i++)gearUpd(1/60);const wreck=W0.objs.some(o=>o.t=='heliW');
  const f=evStart('fight');const r0=Z.filter(z=>z.raider).length;for(let i=0;i<60*4;i++)gearUpd(1/60);const r1=Z.filter(z=>z.raider).length;for(let i=0;i<60*5;i++)gearUpd(1/60);const r2=Z.filter(z=>z.raider).length;
  const m=evStart('merf');const m0=!!m.m;return new Promise(res=>setTimeout(()=>res({fly,wreck,radio:r1==r0,fight:r2>r1,m0,m1:!!m.m&&m.m.wait>200}),3000))});
 ok(r.fly&&r.wreck,'the helicopter is seen falling, then a burning wreck lies there');ok(r.radio&&r.fight,'the raiders-vs-zombies fight is announced on the radio first, then starts');ok(!r.m0&&r.m1,'flare first (whistle… pop), then the merchant waits 5 min');
 // revenge envoys 1/3/5 then the assault
 r=await p.evaluate(()=>{stop9();let f=null;for(let d=6;d<60&&!f;d++)for(let a=-d;a<=d&&!f;a++)for(const[x,y]of[[a,-d],[a,d],[-d,a],[d,a]])if(kindAt(x,y)=='rbase'){f=[x,y];break}infGoto(f[0],f[1]);Z.length=0;S.sa=1e9;rbTick();for(const z of Z)if(z.rbase)z.hp=0;return f.join()});
 await p.waitForTimeout(400);r=await p.evaluate(gk=>{const[gx,gy]=gk.split(',').map(Number),[ox,oy]=bo(gx-OGX,gy-OGY);S.p.x=ox+BW/2;S.p.y=oy+BH/2+120;S.p.hp=1e5;rbTake();const d0=S.day,out=[];
  for(let d=1;d<=4;d++){Z=Z.filter(z=>!z.raider);S.day=d0+d;gearUpd(1/60);out.push([Z.filter(z=>z.env&&z.hp>0).length,Z.filter(z=>z.raider&&!z.env&&z.hp>0).length])}return out},r);
 ok(r[0][0]==1&&r[1][0]==3&&r[2][0]==5&&r[3][0]==0&&r[3][1]>=4,'envoys 1 → 3 → 5, then the assault on day 4 '+JSON.stringify(r));
 r=await p.evaluate(()=>{infGoto(1,0);Z.length=0;S.sa=1e9;S.p.hp=1e5;const L=rSpawn(S.p.x+300,S.p.y,2);L.slice(1).forEach(q=>q.hp=-1e-9);const e=L[0];e.env=1;e.say='빼앗긴 기지는 꼭 돌려받겠다.';let saw=false;for(let i=0;i<60*6;i++){gearUpd(1/60);if(e.said&&e.talk>0)saw=true}const peace=S.p.hp>=1e5-1;hitZ(e,10,1,0,1);return{saw,peace,hostile:!e.env,hp:S.p.hp}});
 ok(r.saw&&r.peace&&r.hostile,'an envoy walks up, speaks, leaves in peace — and fights back if shot '+JSON.stringify(r));
 await p.evaluate(()=>{stop9();scene9('mer8')});await p.waitForTimeout(3000);await p.screenshot({path:OUT+'/mer8.png'});
 await p.evaluate(()=>{stop9();scene9('emoon')});await p.waitForTimeout(1500);await p.screenshot({path:OUT+'/moon.png'});await p.evaluate(()=>{stop9();scene9('efog')});await p.waitForTimeout(1500);await p.screenshot({path:OUT+'/fog.png'});
 await p.evaluate(()=>{stop9();scene9('eheli');});await p.waitForTimeout(3200);await p.evaluate(()=>{const e=WEV.find(q=>q.k=='heli');if(e){S.p.x=e.x-120;S.p.y=e.y+140}});await p.waitForTimeout(400);await p.screenshot({path:OUT+'/heli-fall.png'});await p.waitForTimeout(3000);await p.screenshot({path:OUT+'/heli-wreck.png'});
 await p.evaluate(()=>{stop9();scene9('eair')});await p.waitForTimeout(3000);await p.screenshot({path:OUT+'/plane.png'});
 ok(!errs.length,'no page errors '+errs.join(' | '));await b.close()})();
