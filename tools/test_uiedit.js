// HUD customisation check: open editor, game pauses, drag + resize panels, save per orientation, reload keeps it, reset restores
// usage: node tools/test_uiedit.js <outdir>
const {chromium}=require('playwright');const OUT=process.argv[2]||'.';const url='file://'+require('path').resolve(__dirname,'..','index.html');
const box=(p,id)=>p.evaluate(id=>{const r=document.getElementById(id).getBoundingClientRect();return{x:Math.round(r.left),y:Math.round(r.top),w:Math.round(r.width),h:Math.round(r.height)}},id);
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:412,height:860}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(url);await p.waitForTimeout(300);await p.evaluate(()=>{localStorage.clear();start('S',false)});await p.waitForTimeout(500);
 const wc0=await box(p,'wc'),st0=await box(p,'st'),sd0=await box(p,'sd');
 const ub=await box(p,'uiE');await p.mouse.click(ub.x+ub.w/2,ub.y+ub.h/2);await p.waitForTimeout(200);
 ok(await p.evaluate(()=>UIE.on&&PAUSE&&document.body.classList.contains('uied')),'editor opens and pauses game');
 const t0=await p.evaluate(()=>S.t);await p.waitForTimeout(600);ok(await p.evaluate(t=>S.t==t,t0),'game clock frozen while editing');
 // drag weapon card to the upper middle
 await p.mouse.move(wc0.x+20,wc0.y+15);await p.mouse.down();await p.mouse.move(150,300,{steps:8});await p.mouse.up();
 let wc1=await box(p,'wc');ok(Math.abs(wc1.x-130)<4&&Math.abs(wc1.y-285)<4,'weapon card dragged to '+wc1.x+','+wc1.y);
 // drag past screen edge clamps inside
 const qk0=await box(p,'qk');await p.mouse.move(qk0.x+5,qk0.y+5);await p.mouse.down();await p.mouse.move(405,855,{steps:6});await p.mouse.up();
 const qk1=await box(p,'qk');ok(qk1.x+qk1.w<=413&&qk1.y+qk1.h<=861,'quick slots clamped on screen '+JSON.stringify(qk1));
 // drag toolbar
 await p.mouse.move(sd0.x+10,sd0.y+10);await p.mouse.down();await p.mouse.move(200,600,{steps:6});await p.mouse.up();
 const sd1=await box(p,'sd');ok(Math.abs(sd1.x-190)<4&&Math.abs(sd1.y-590)<4,'toolbar dragged to '+sd1.x+','+sd1.y);
 // select status panel and enlarge
 await p.mouse.click(st0.x+60,st0.y+20);await p.evaluate(()=>{uiScale(.1);uiScale(.1)});const st1=await box(p,'st');
 ok(st1.w>st0.w*1.15,'status panel scaled '+st0.w+'→'+st1.w);ok(await p.evaluate(()=>document.getElementById('uiSel').textContent)=='상태창','selection label');
 await p.screenshot({path:OUT+'/uiedit-editing.png'});
 // tapping a toolbar button in edit mode must not open the bag
 await p.mouse.click(sd1.x+20,sd1.y+20);ok(await p.evaluate(()=>getComputedStyle(document.getElementById('bm')).display=='none'),'buttons inert in edit mode');
 await p.evaluate(()=>uiEdit(false));await p.waitForTimeout(400);
 ok(await p.evaluate(()=>!UIE.on&&!PAUSE),'editor closes and game resumes');ok(await p.evaluate(t=>S.t>t,t0),'clock running again');
 const saved=await p.evaluate(()=>JSON.parse(localStorage.getItem('pl_ui')));ok(saved.p&&saved.p.wc&&saved.p.sd&&saved.p.st.s==1.2&&saved.p.qk&&!saved.l,'saved portrait layout only '+JSON.stringify(saved));
 await p.screenshot({path:OUT+'/uiedit-portrait.png'});
 // landscape uses its own (default) layout
 await p.setViewportSize({width:860,height:412});await p.waitForTimeout(300);const wcL=await box(p,'wc');ok(wcL.x>600,'landscape keeps default weapon card '+wcL.x);
 await p.setViewportSize({width:412,height:860});await p.waitForTimeout(300);wc1=await box(p,'wc');ok(Math.abs(wc1.x-130)<4,'portrait layout returns after rotate');
 // reload: layout persists after start
 await p.reload();await p.waitForTimeout(300);await p.evaluate(()=>start('S',false));await p.waitForTimeout(400);
 const wc2=await box(p,'wc');ok(Math.abs(wc2.x-130)<4&&Math.abs(wc2.y-285)<4,'layout persists after reload');
 // play actions still work after customisation
 await p.evaluate(()=>{give({pistol:1,a9mm:20});});const bag=await box(p,'bBag');await p.mouse.click(bag.x+bag.w/2,bag.y+bag.h/2);await p.waitForTimeout(200);
 ok(await p.evaluate(()=>getComputedStyle(document.getElementById('bm')).display!='none'),'moved toolbar bag button opens bag');await p.evaluate(()=>closeBase());
 // reset all
 await p.evaluate(()=>{uiEdit(true);uiReset(true);uiEdit(false)});await p.waitForTimeout(300);const wc3=await box(p,'wc'),sd3=await box(p,'sd');
 ok(Math.abs(wc3.x-wc0.x)<2&&Math.abs(wc3.y-wc0.y)<2&&Math.abs(sd3.y-sd0.y)<2,'reset restores defaults');
 ok(errs.length==0,'no page errors '+errs.join('|'));await b.close()})();
