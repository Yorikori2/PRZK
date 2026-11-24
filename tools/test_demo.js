// Demolition + shelters/bunkers sample checks. usage: node tools/test_demo.js <outdir>
const {chromium}=require('playwright');const OUT=process.argv[2]||'.';const PAGE='file://'+require('path').resolve(__dirname,'..','inf-sample.html');
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);await p.evaluate(()=>{try{localStorage.clear()}catch(e){}});await p.reload();await p.waitForTimeout(1500);await p.evaluate(()=>{stop9()});
 // tool level gates
 let r=await p.evaluate(()=>{const g=goInside(['clinic','police'],{});const out=[];for(const k of['dt1','dt2','dt3'])delete S.p.inv[k];demoTry();out.push(!!DM,$('msg').textContent);give({dt1:1});demoTry();out.push(!!DM);give({dt3:1});Z.push(...[]);demoTry();out.push(!!DM,$('msg').textContent);return out});
 ok(!r[0]&&/Lv3/.test(r[1])&&!r[2],'clinic/police needs a Lv3 tool: '+r[1]);
 // large building needs it cleared first
 r=await p.evaluate(()=>{DM=null;const g=goInside(['clinic','police'],{dt3:1});const n=zInside(g.bi).length;demoTry();const blocked=!DM,m=$('msg').textContent;Z=Z.filter(z=>!inBld(g.bi,z.x,z.y));demoTry();return{n,blocked,m,started:!!DM}});
 ok(r.n>0&&r.blocked&&/모두 처치/.test(r.m)&&r.started,'large demolition is blocked while '+r.n+' zombies are inside, starts once cleared');
 // during: noise pulls zombies, zombies rise from below, leaving cancels
 r=await p.evaluate(()=>{const p=S.p;Z.length=0;mk(p.x+500,p.y,{look:'civ1'});const far=Z[0];const z0=Z.length;for(let i=0;i<300;i++){gearUpd(1/60);p.hp=MHP(p)}return{al:far.al>0,up:Z.length-z0,pct:Math.round(DM.t/DM.T*100)}});
 ok(r.al&&r.up>=2,'noise alerts zombies and '+r.up+' rise from below in 5 s ('+r.pct+'%)');
 r=await p.evaluate(()=>{const p=S.p,x=p.x;p.x+=2000;gearUpd(1/60);const stopped=!DM;p.x=x;return stopped});ok(r,'walking away stops the demolition');
 // finishing turns the block into a rubble lot that stays after leaving
 r=await p.evaluate(()=>{const g=goInside(['houses','apt'],{dt1:1});Z.length=0;demoTry();const gk=g.b.gk,s0=S.p.inv.scrap|0;DM.t=DM.T;gearUpd(1/60);const lot=W0.b.find(b=>b.gk==gk);const[gx,gy]=gk.split(',').map(Number);infGoto(gx+12,gy);infGoto(gx,gy);const lot2=W0.b.find(b=>b.gk==gk);return{k:lot&&lot.kind,k2:lot2&&lot2.kind,scrap:(S.p.inv.scrap|0)-s0,rub:W0.objs.filter(o=>o.t=='rubble').length}});
 ok(r.k=='lot'&&r.k2=='lot'&&r.scrap>=6&&r.rub>=3,'demolished block becomes a rubble lot and stays one '+JSON.stringify(r));
 // shelter chances roughly match the table
 r=await p.evaluate(()=>{const R=Math.random;let o={};for(const[k,n]of[['houses',0],['mil',0]]){let sh=0,bk=0;for(let i=0;i<2000;i++){const c=DSH[k],x=R();if(x<c[1])bk++;else if(x<c[0]+c[1])sh++}o[k]=[sh/2000,bk/2000]}return o});ok(Math.abs(r.houses[0]-.15)<.03&&Math.abs(r.mil[1]-.5)<.04,'shelter/bunker chances '+JSON.stringify(r));
 // shelter: hatch appears, going down builds a closed dungeon, coming back restores the surface
 await p.evaluate(()=>scene9('shelter'));await p.waitForTimeout(600);await p.screenshot({path:OUT+'/demo-shelter.png'});
 r=await p.evaluate(()=>{const h=W0.objs.find(o=>o.t=='hatch');const sx=S.p.x,sy=S.p.y,zs=Z.length;const c=dmCtx();c.f();const inD=!!DUN,k=W0.b[0].kind,nz=Z.length,lad=!!W0.objs.find(o=>o.t=='ladder');
  const p=S.p,bx=p.x;let moved=0;jp=-1;jx=-1;jy=0;for(let i=0;i<600;i++)gearUpd(1/60);jp=null;jx=0;const left=p.x;return{h:!!h,inD,k,nz,lad,sx,sy,left,bx}});
 ok(r.h&&r.inD&&r.k=='dun'&&r.nz>=10&&r.lad,'going down the hatch opens a dungeon with '+r.nz+' zombies and a ladder');ok(r.left>r.bx-200,'dungeon walls keep the player inside');
 await p.screenshot({path:OUT+'/demo-dungeon.png'});
 r=await p.evaluate(()=>{const o=W0.objs.find(o=>LOOTT[o.t]);const rr={};s3SearchRoll(o,'dun',3,rr);let st=0;for(let i=0;i<400;i++){const q={};s3SearchRoll(o,'dun',3,q);if(q.enh1||q.enh2||q.enh3)st++}save();const sv=JSON.parse(localStorage.getItem(SAVE));const l=W0.objs.find(o=>o.t=='ladder');S.p.x=l.x+14;S.p.y=l.y+40;dmCtx().f();
  return{st:st/400,out:!DUN,k:W0.b.some(b=>b.kind=='lot'),saveY:Math.round(sv.p?sv.p.y:0)}});
 ok(r.st>.2,'dungeon searches give stones '+Math.round(r.st*100)+'%');ok(r.out&&r.k,'climbing the ladder returns to the surface lot');
 await p.evaluate(()=>scene9('bunker'));await p.waitForTimeout(2200);await p.screenshot({path:OUT+'/demo-bunker.png'});
 r=await p.evaluate(()=>({d:DUN&&DUN.sh,boss:Z.some(z=>z.look=='brute')}));ok(r.d=='bunker'&&r.boss,'bunker scene: dark bunker with a brute in the deepest room');
 await p.evaluate(()=>scene9('big'));await p.waitForTimeout(6000);await p.screenshot({path:OUT+'/demo-big.png'});r=await p.evaluate(()=>({dm:!!DM,z:Z.length}));ok(r.dm,'big demolition scene is running ('+r.z+' zombies around)');
 await p.evaluate(()=>scene9('dtools'));await p.waitForTimeout(300);await p.screenshot({path:OUT+'/demo-tools.png'});
 ok(!errs.length,'no page errors '+errs.join(' | '));await b.close()})();
