// HUD editor sample checks: panel lock (drag/scale/reset/preset keep it) and danger auto-sharpen of a faded HUD
// usage: node tools/test_uiedit3.js <outdir> [page]
const {chromium}=require('playwright');const OUT=process.argv[2]||'.';const PAGE=process.argv[3]||'uifix-sample.html';
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
const box=(p,id)=>p.evaluate(id=>{const r=document.getElementById(id).getBoundingClientRect();return{x:Math.round(r.left),y:Math.round(r.top),w:Math.round(r.width)}},id);
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+require('path').resolve(__dirname,'..',PAGE));await p.waitForTimeout(300);
 await p.evaluate(()=>{localStorage.clear();start('S',false);if(S.pg&&!S.pg.tr.length){S.pg.tr=['cop'];$('bm').dataset.m='';closeBase();PAUSE=false}uiEdit(true)});await p.waitForTimeout(200);
 // move the weapon card, then lock it
 const w0=await box(p,'wc');await p.mouse.move(w0.x+30,w0.y+20);await p.mouse.down();await p.mouse.move(w0.x-70,w0.y-200,{steps:8});await p.mouse.up();await p.waitForTimeout(100);const w1=await box(p,'wc');
 await p.evaluate(()=>{UIE.sel='wc';uiMark();uiLock()});
 let r=await p.evaluate(()=>({lab:document.getElementById('wc').dataset.ul,btn:document.getElementById('uiLock').textContent,sel:document.getElementById('uiSel').textContent}));
 ok(/🔒/.test(r.lab)&&/풀기/.test(r.btn)&&/잠김/.test(r.sel),'locked card shows 🔒 label and unlock button '+JSON.stringify(r));
 await p.mouse.move(w1.x+30,w1.y+20);await p.mouse.down();await p.mouse.move(w1.x+120,w1.y+150,{steps:8});await p.mouse.up();await p.waitForTimeout(100);let w2=await box(p,'wc');
 ok(w2.x==w1.x&&w2.y==w1.y,'locked card cannot be dragged');
 r=await p.evaluate(()=>{UIE.sel='wc';const before=document.getElementById('wc').getBoundingClientRect().width;uiScale(.2);return before==document.getElementById('wc').getBoundingClientRect().width});ok(r,'locked card cannot be resized');
 await p.evaluate(()=>{UIE.sel='wc';uiReset(false);uiReset(true)});w2=await box(p,'wc');ok(w2.x==w1.x&&w2.y==w1.y,'reset keeps the locked card in place');
 r=await p.evaluate(()=>{const st0=document.getElementById('st').getBoundingClientRect().width;uiPreset('wide');return{st:document.getElementById('st').getBoundingClientRect().width<st0}});w2=await box(p,'wc');
 ok(r.st&&w2.x==w1.x&&w2.y==w1.y,'preset changes other panels but keeps the locked card');
 await p.evaluate(()=>{uiEdit(false);save()});await p.reload();await p.waitForTimeout(300);await p.evaluate(()=>{start(0,true)});await p.waitForTimeout(300);
 w2=await box(p,'wc');r=await p.evaluate(()=>JSON.parse(localStorage.getItem('pl_ui')).p._lock);ok(w2.x==w1.x&&w2.y==w1.y&&r.wc==1,'lock and position saved after reload');
 await p.evaluate(()=>{uiEdit(true);uiBarMove();UIE.sel='wc';uiMark();uiLock()});w2=await box(p,'wc');await p.mouse.move(w2.x+30,w2.y+20);await p.mouse.down();await p.mouse.move(w2.x+60,w2.y+80,{steps:6});await p.mouse.up();await p.waitForTimeout(100);
 const w3=await box(p,'wc');ok(w3.x!=w2.x||w3.y!=w2.y,'unlocked card moves again');
 await p.screenshot({path:OUT+'/u3-edit.png'});
 // danger auto-sharpen
 await p.evaluate(()=>{uiOpacity(50);uiEdit(false);Z.length=0;S.p.hp=MHP(S.p);S.alarm=null});await p.waitForTimeout(400);
 const op=()=>p.evaluate(()=>['st','wc','r','qk','tr'].map(id=>getComputedStyle(document.getElementById(id)).opacity));
 r=await op();ok(r.every(v=>v=='0.5'),'calm: whole HUD at 50% '+r);
 await p.evaluate(()=>{const pl=S.p;mk(pl.x+120,pl.y,{look:'runner'});Z[Z.length-1].stun=99});await p.waitForTimeout(700);r=await op();
 ok(r.slice(0,4).every(v=>v=='1')&&r[4]=='0.5','zombie within 200px: status, weapon, attack, quick slots turn solid; minimap stays faded '+r);await p.screenshot({path:OUT+'/u3-danger.png'});
 await p.evaluate(()=>{Z.length=0});await p.waitForTimeout(700);r=await op();ok(r.every(v=>v=='0.5'),'danger gone: back to 50% '+r);
 await p.evaluate(()=>{S.p.hp=MHP(S.p)*.2});await p.waitForTimeout(700);r=await op();ok(r[0]=='1','low HP turns HUD solid');
 await p.evaluate(()=>{uiEdit(true);uiCombat(false);uiEdit(false)});await p.waitForTimeout(700);r=await op();ok(r[0]=='0.5','toggle off: stays faded even at low HP '+r);
 r=await p.evaluate(()=>JSON.parse(localStorage.getItem('pl_ui')).cb);ok(r===0,'danger toggle saved');
 ok(!errs.length,'no page errors '+errs.join(' | '));await b.close()})();
