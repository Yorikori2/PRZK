// Game toolbar (☰ drawer + only usable buttons) checks.  usage: node tools/test_toolbar.js <outdir>
const {chromium}=require('playwright');const OUT=process.argv[2]||'.';
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:412,height:860},hasTouch:true,isMobile:true});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+require('path').resolve(__dirname,'..','index.html'));await p.waitForTimeout(600);
 await p.evaluate(()=>{localStorage.clear();start('S',false);S.pg.tr=['cop'];$('bm').dataset.m='';closeBase();PAUSE=false;Z.length=0;S.sa=1e9;const p=S.p;p.inv.wood=0});await p.waitForTimeout(700);
 let r=await p.evaluate(()=>({mode:TB.mode,h:getComputedStyle($('tbH')).display,op:getComputedStyle($('sd')).opacity,scB:!!$('scB')}));ok(r.mode=='AC'&&r.h!='none'&&r.op=='0'&&!r.scB,'game starts with the ☰ handle only '+JSON.stringify(r));
 const hb=await p.evaluate(()=>{const r=$('tbH').getBoundingClientRect();return[r.left+r.width/2,r.top+r.height/2]});await p.touchscreen.tap(hb[0],hb[1]);await p.waitForTimeout(350);
 const vis=()=>p.evaluate(()=>tbBtns().filter(b=>getComputedStyle(b).display!='none').map(b=>b.id));r=await vis();const op=await p.evaluate(()=>getComputedStyle($('sd')).opacity);
 ok(op=='1'&&!r.includes('bBd')&&r.includes('bse'),'tap opens the drawer; no 🧱 without wood, 🏠 in the base '+r);await p.screenshot({path:OUT+'/tg-open.png'});
 r=await p.evaluate(()=>{const h=$('tbH').getBoundingClientRect(),s=$('sd').getBoundingClientRect();return{above:s.bottom<=h.top+1,left:Math.abs(s.left-h.left)<3}});ok(r.above&&r.left,'drawer opens right above the handle '+JSON.stringify(r));
 await p.evaluate(()=>{give({wood:3})});await p.waitForTimeout(700);r=await vis();ok(r.includes('bBd'),'🧱 appears once you carry wood');
 // UI editor moves the handle; drawer follows (upwards / downwards)
 r=await p.evaluate(()=>{uiEdit(true);const d=uiCur();d.tbH={x:.45,y:.2,s:1};uiApply();uiEdit(false);TB.open=true;tbApply();const h=$('tbH').getBoundingClientRect(),s=$('sd').getBoundingClientRect();return{hx:Math.round(h.left),sx:Math.round(s.left),below:s.top>=h.bottom-1}});
 ok(Math.abs(r.hx-r.sx)<3&&r.below,'handle moved high up: drawer follows it and opens downwards '+JSON.stringify(r));await p.screenshot({path:OUT+'/tg-moved.png'});
 r=await p.evaluate(()=>{uiEdit(true);uiPreset('left');uiEdit(false);TB.open=true;tbApply();const h=$('tbH').getBoundingClientRect();return{hx:Math.round(h.left),right:h.left>innerWidth/2}});ok(r.right,'left-handed preset puts the handle on the right '+JSON.stringify(r));
 await p.evaluate(()=>{uiEdit(true);uiReset(true);uiEdit(false)});
 // using a button closes the drawer
 await p.evaluate(()=>{TB.open=true;tbApply()});await p.waitForTimeout(300);const bag=await p.evaluate(()=>{const r=$('bBag').getBoundingClientRect();return[r.left+r.width/2,r.top+r.height/2]});await p.touchscreen.tap(bag[0],bag[1]);await p.waitForTimeout(400);
 r=await p.evaluate(()=>({bag:$('bm').dataset.m,open:TB.open}));ok(r.bag=='bag'&&!r.open,'🎒 opens the bag and the drawer folds '+JSON.stringify(r));
 ok(!errs.length,'no page errors '+errs.join(' | '));await b.close()})();
