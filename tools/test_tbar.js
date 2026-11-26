// Toolbar styles sample checks.  usage: node tools/test_tbar.js <outdir>
const {chromium}=require('playwright');const OUT=process.argv[2]||'.';
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:412,height:860},hasTouch:true,isMobile:true});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+require('path').resolve(__dirname,'..','tbar-sample.html'));await p.waitForTimeout(1200);await p.screenshot({path:OUT+'/tb-menu.png'});
 const vis=()=>p.evaluate(()=>tbBtns().filter(b=>getComputedStyle(b).display!='none'&&getComputedStyle($('sd')).opacity!='0'&&getComputedStyle($('sd')).visibility!='hidden').map(b=>b.id));
 const ov=()=>p.evaluate(()=>{const R=id=>$(id).getBoundingClientRect(),hit=(a,c)=>Math.min(a.right,c.right)-Math.max(a.left,c.left)>1&&Math.min(a.bottom,c.bottom)-Math.max(a.top,c.top)>1;const L=['tbH','sd','r','wc','qk','st','atmo'].filter(id=>$(id)&&getComputedStyle($(id)).display!='none'&&getComputedStyle($(id)).opacity!='0');const bad=[];for(let i=0;i<L.length;i++)for(let j=i+1;j<L.length;j++)if(!(L[i]=='tbH'&&L[j]=='sd')&&hit(R(L[i]),R(L[j])))bad.push(L[i]+'×'+L[j]);return bad});
 // base
 await p.evaluate(()=>scene8('base'));let r=await vis();ok(r.length>=5,'base: all buttons on the left '+r);
 // A drawer: closed → swipe up opens → swipe down closes; using a button closes it
 await p.evaluate(()=>scene8('A'));await p.waitForTimeout(350);await p.evaluate(()=>{T8.forEach(clearTimeout);T8.length=0});r=await p.evaluate(()=>({h:getComputedStyle($('tbH')).display,op:getComputedStyle($('sd')).opacity}));ok(r.h!='none'&&r.op=='0','A: only the ☰ handle shows '+JSON.stringify(r));
 const hb=await p.evaluate(()=>{const r=$('tbH').getBoundingClientRect();return[r.left+r.width/2,r.top+r.height/2]});
 const cdp=await ctx.newCDPSession(p);const T=(type,x,y)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:type=='touchEnd'?[]:[{x,y,id:1}]});
 await T('touchStart',hb[0],hb[1]);for(let i=1;i<=6;i++)await T('touchMove',hb[0],hb[1]-i*8);await T('touchEnd');await p.waitForTimeout(350);r=await p.evaluate(()=>({open:TB.open,op:getComputedStyle($('sd')).opacity}));ok(r.open&&r.op=='1','A: swipe up on the handle opens the drawer '+JSON.stringify(r));
 r=await ov();ok(!r.length,'A open: no overlap '+r);await p.screenshot({path:OUT+'/tb-A.png'});
 await T('touchStart',hb[0],hb[1]);for(let i=1;i<=6;i++)await T('touchMove',hb[0],hb[1]+i*2.5);await T('touchEnd');await p.waitForTimeout(350);r=await p.evaluate(()=>TB.open);ok(!r,'A: swipe down on the handle closes it');
 await p.evaluate(()=>{TB.open=true;tbApply()});await p.waitForTimeout(250);const sb=await p.evaluate(()=>{const r=$('bCh').getBoundingClientRect();return[r.left+r.width/2,r.top+r.height/2]});await T('touchStart',sb[0],sb[1]);for(let i=1;i<=6;i++)await T('touchMove',sb[0],sb[1]+i*9);await T('touchEnd');await p.waitForTimeout(350);r=await p.evaluate(()=>({open:TB.open,m:$('bm').style.display}));ok(!r.open,'A: swipe down on the open drawer folds it too '+JSON.stringify(r));await p.evaluate(()=>closeBase());
 await p.evaluate(()=>{TB.open=true;tbApply()});await p.waitForTimeout(250);const bag=await p.evaluate(()=>{const r=$('bBag').getBoundingClientRect();return[r.left+r.width/2,r.top+r.height/2]});await p.touchscreen.tap(bag[0],bag[1]);await p.waitForTimeout(400);
 r=await p.evaluate(()=>({bag:$('bm').dataset.m,open:TB.open}));ok(r.bag=='bag'&&!r.open,'A: tapping 🎒 opens the bag and folds the drawer '+JSON.stringify(r));await p.evaluate(()=>closeBase());
 // B radial
 await p.evaluate(()=>scene8('B'));await p.waitForTimeout(300);r=await p.evaluate(()=>getComputedStyle($('sd')).visibility);ok(r=='hidden','B: toolbar hidden');
 const ab=await p.evaluate(()=>{const r=$('act').getBoundingClientRect();return[r.left+r.width/2,r.top+r.height/2]});
 await p.evaluate(()=>{tbFanClose();window.IA=0;const o=ia;ia=function(){IA++;return o.apply(this,arguments)}});await T('touchStart',ab[0],ab[1]);await p.waitForTimeout(120);await T('touchEnd');await p.waitForTimeout(200);r=await p.evaluate(()=>({ia:IA,fan:!!TB.fan}));ok(r.ia==1&&!r.fan,'B: short tap still interacts '+JSON.stringify(r));
 await T('touchStart',ab[0],ab[1]);await p.waitForTimeout(600);r=await p.evaluate(()=>TB.fan?TB.fan.querySelectorAll('[data-for]').length:0);ok(r>=5,'B: holding opens a fan of '+r+' buttons');await p.screenshot({path:OUT+'/tb-B.png'});
 const tgt=await p.evaluate(()=>{const f=TB.fan.querySelector('[data-for="bBag"]').getBoundingClientRect();return[f.left+f.width/2,f.top+f.height/2]});for(let i=1;i<=8;i++)await T('touchMove',ab[0]+(tgt[0]-ab[0])*i/8,ab[1]+(tgt[1]-ab[1])*i/8);await T('touchEnd');await p.waitForTimeout(300);
 r=await p.evaluate(()=>({bag:$('bm').dataset.m,fan:!!TB.fan}));ok(r.bag=='bag'&&!r.fan,'B: slide to 🎒 and release opens the bag '+JSON.stringify(r));await p.evaluate(()=>closeBase());
 // C contextual
 await p.evaluate(()=>scene8('C'));await p.waitForTimeout(400);const c0=await vis();let c1=c0;for(let i=0;i<30&&!c1.includes('bBd');i++){await p.waitForTimeout(250);c1=await vis()}await p.screenshot({path:OUT+'/tb-C.png'});let c2=c1;for(let i=0;i<40&&c2.includes('bse');i++){await p.waitForTimeout(250);c2=await vis()}
 ok(!c0.includes('bBd')&&c1.includes('bBd')&&c1.includes('cCr')&&c0.includes('bse')&&!c2.includes('bse'),'C: 🧱/🛠 appear with materials, 🏠 only in the base '+JSON.stringify({c0,c1,c2}));
 // D fold
 await p.evaluate(()=>scene8('D'));await p.waitForTimeout(1700);r=await vis();ok(r.length==0,'D: folded to one ▶ button');await p.screenshot({path:OUT+'/tb-D.png'});await p.evaluate(()=>{TB.fold=false;tbApply()});r=await vis();ok(r.length>=5,'D: unfolds again');
 // AC recommended
 await p.evaluate(()=>scene8('AC'));await p.waitForTimeout(1500);const a0=await vis();await p.waitForTimeout(2600);const a1=await vis();await p.screenshot({path:OUT+'/tb-AC.png'});
 ok(a0.length>0&&a0.length<a1.length&&!a0.includes('bBd')&&a1.includes('bBd'),'A+C: drawer shows only usable buttons, grows when you can build '+JSON.stringify({a0,a1}));r=await ov();ok(!r.length,'A+C open: no overlap '+r);
 await p.setViewportSize({width:740,height:360});await p.evaluate(()=>{TB.open=true;tbApply()});await p.waitForTimeout(300);r=await ov();ok(!r.length,'A+C small landscape: no overlap '+r);await p.screenshot({path:OUT+'/tb-AC-land.png'});
 ok(!errs.length,'no page errors '+errs.join(' | '));await b.close()})();
