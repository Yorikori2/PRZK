// Auto-targeting + range ring checks (node tools/test_target.js <outdir>)
const {chromium}=require('playwright');const fs=require('fs');const OUT=process.argv[2]||'.';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:860,height:412},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+require('path').resolve(__dirname,'..','index.html'));await p.waitForTimeout(400);await p.evaluate(()=>{localStorage.clear();start('S',false)});
const R={};const put=(o)=>p.evaluate(o=>{const P=S.p;P.x=BL.ox+470;P.y=BL.oy+430;P.fx=o.fx||1;P.fy=0;Z=[];S.tg=null;P.inv={};invAdd(P,o.w,1);const sl=slotFor(o.w);P.eq[sl]=o.w;P.as=sl;if(W_BY[o.w][4].ammo){invAdd(P,AMMO_ITEM(W_BY[o.w][4].ammo),100);P.mag[o.w]=W_BY[o.w][4].mag}
 o.z.forEach(([dx,dy,lk])=>mk(P.x+dx,P.y+dy,{look:lk||'civ1'}));Z.forEach(z=>z.stun=99);return true},o);
// 1. nearest in front wins over slightly nearer behind
await put({w:'pistol',fx:1,z:[[120,0],[-100,0]]});R.front=await p.evaluate(()=>{const t=updTarget(S.p);return t===Z[0]});
// 2. out of range: shown (dim) but not "in range"; attack does not fire
await put({w:'knife',z:[[56,0]]});R.outRange=await p.evaluate(()=>{const t=updTarget(S.p);S.p.ac=0;const hp=Z[0].hp;gearAct();return{target:!!t,inRange:S.tgIn,hit:Z[0].hp<hp}});
// 3. in range: attack hits the locked target
await put({w:'knife',z:[[30,0]]});R.inRange=await p.evaluate(()=>{updTarget(S.p);S.p.ac=0;const hp=Z[0].hp;gearAct();return{inRange:S.tgIn,hit:Z[0].hp<hp}});
// 4. sticky: keeps target unless another is much closer
await put({w:'ar',z:[[200,0],[180,10]]});R.sticky=await p.evaluate(()=>{S.tg=Z[0];const t=updTarget(S.p);const keep=t===Z[0];Z[1].x=S.p.x+60;const t2=updTarget(S.p);return{keep,switchWhenMuchCloser:t2===Z[1]}});
// 5. line of sight: zombie behind a wall is not targeted (clinic wall)
R.los=await p.evaluate(()=>{const P=S.p,b=W0.b.find(b=>b.kind=='clinic'),h=W0.hw.find(h=>h.x1-h.x0>300&&h.y>b.oy+200&&h.y<b.oy+600);P.x=(h.x0+h.x1)/2;P.y=h.y+40;Z=[];S.tg=null;mk(P.x,h.y-40,{look:'civ1'});Z[0].stun=99;return{targeted:!!updTarget(P)}});
// 6. switching weapon changes the range ring radius used
R.rangeBySlot=await p.evaluate(()=>{const P=S.p;P.inv={};invAdd(P,'knife',1);invAdd(P,'sniper',1);P.eq.mel='knife';P.eq.prim='sniper';P.as='mel';const a=wdef(actW(P))[4].r;P.as='prim';const c=wdef(actW(P))[4].r;return[a,c]});
// screenshot with a gun target and a melee ring
await p.evaluate(()=>{const P=S.p;P.x=BL.ox+470;P.y=BL.oy+430;Z=[];P.inv={};invAdd(P,'ar',1);invAdd(P,'a556',60);P.eq.prim='ar';P.as='prim';P.mag.ar=30;mk(P.x+150,P.y-30,{look:'civ2'});mk(P.x+260,P.y+40,{look:'runner'});Z.forEach(z=>{z.stun=99});Z[0].hp=Z[0].mhp*.6});
await p.waitForTimeout(500);await p.screenshot({path:OUT+'/target-gun.png'});
await p.evaluate(()=>{const P=S.p;P.as='mel';P.inv.knife=1;P.eq.mel='knife';Z=[];mk(P.x+30,P.y+6,{look:'civ1'});Z[0].stun=99});await p.waitForTimeout(400);await p.screenshot({path:OUT+'/target-melee.png'});
R.fps=await p.evaluate(()=>new Promise(res=>{const P=S.p;Z=[];for(let i=0;i<80;i++)mk(P.x+(Math.random()-.5)*700,P.y+(Math.random()-.5)*500,{look:'civ1'});let n=0,t0=performance.now();(function f(){n++;if(performance.now()-t0<1500)requestAnimationFrame(f);else res(Math.round(n/1.5))})()}));
R.errors=errs;fs.writeFileSync(OUT+'/target.json',JSON.stringify(R,null,1));console.log(JSON.stringify(R));await b.close()})();
