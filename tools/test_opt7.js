// Rainy-day water + sound visualisation sample checks.  usage: node tools/test_opt7.js <outdir>
const {chromium}=require('playwright');const OUT=process.argv[2]||'.';
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+require('path').resolve(__dirname,'..','opt7-sample.html'));await p.waitForTimeout(1200);
 ok(await p.evaluate(()=>$('bm').dataset.m=='scene'),'opens on the scene list');
 let r=await p.evaluate(()=>{reset7();S.base.lv.water=2;const st=S.base.st;const run=rain=>{if(rain)setRain(true);else S.wx=null;const w=st.water||0;spd=16;for(let i=0;i<1000;i++)upd(.05);spd=1;return(st.water||0)-w};return{dry:run(false),wet:run(true)}});
 ok(r.dry>0&&r.wet==r.dry*2,'rain doubles rain-water module output '+JSON.stringify(r));
 r=await p.evaluate(()=>{setRain(true);openBase();const a=$('bm').querySelector('.rainw').textContent;S.wx=null;openBase();return{rain:a,dry:$('bm').querySelector('.rainw').textContent}});ok(/×2/.test(r.rain)&&/맑음/.test(r.dry),'base sheet shows the rain bonus: "'+r.rain+'"');
 await p.evaluate(()=>scene7('water'));await p.waitForTimeout(16500);r=await p.evaluate(()=>({m:$('msg').textContent,open:$('bm').dataset.m}));await p.screenshot({path:OUT+'/o7-water.png'});ok(/결과/.test(r.m)&&r.open=='base','water scene runs both phases and opens the base sheet: '+r.m);
 // switches
 r=await p.evaluate(()=>{closeBase();openMixer();const n=document.querySelectorAll('#bm [data-vs]').length;const c=document.querySelector('[data-vs="arrows"]');c.checked=false;c.dispatchEvent(new Event('change'));const a=getComputedStyle($('sdir')).display;
  c.checked=true;c.dispatchEvent(new Event('change'));const b2=getComputedStyle($('sdir')).display;return{n,off:a,on:b2,saved:JSON.parse(localStorage.getItem('pl_vis')).arrows}});
 ok(r.n==3&&r.off=='none'&&r.on!='none'&&r.saved==1,'mixer has 3 visual switches; arrows can be hidden and come back '+JSON.stringify(r));
 r=await p.evaluate(()=>{setVis('ring',0);const pl=S.p;AT.ring=[{x:pl.x,y:pl.y,t:.4,r:160}];drawGearFx();const a=AT.ring.length;setVis('ring',1);return a});ok(r==0,'footstep ring can be turned off');
 // captions, also with sound off
 await p.evaluate(()=>{closeBase();SND=false;scene7('vis')});await p.waitForTimeout(4200);r=await p.evaluate(()=>({n:document.querySelectorAll('#scap div').length,txt:$('scap').textContent}));await p.screenshot({path:OUT+'/o7-cap.png'});
 ok(r.n>0&&/(→|←|↑|↓|↗|↖|↘|↙)/.test(r.txt),'captions with direction show even with sound off: '+r.txt);
 r=await p.evaluate(()=>{setVis('cap',0);return getComputedStyle($('scap')).display});ok(r=='none','captions can be turned off');
 r=await p.evaluate(()=>{setVis('cap',1);CAP.length=0;for(const k in capLast)delete capLast[k];const pl=S.p;ev3('charge',pl.x+100,pl.y);ev3('charge',pl.x+100,pl.y);gearUpd(1/60);return{n:CAP.length,hot:document.querySelectorAll('#scap .hot').length,t:CAP[0]&&CAP[0].s}});ok(r.n==1&&r.hot==1,'danger captions stand out, repeats are merged '+JSON.stringify(r));
 r=await p.evaluate(()=>{const a=$('scap').getBoundingClientRect(),hit=['wc','qk','r','sd','st','tr'].filter(id=>{const y=$(id).getBoundingClientRect();return Math.min(a.right,y.right)-Math.max(a.left,y.left)>1&&Math.min(a.bottom,y.bottom)-Math.max(a.top,y.top)>1});return hit});ok(!r.length,'portrait: captions clear of every HUD panel '+r);
 await p.setViewportSize({width:740,height:360});await p.waitForTimeout(200);await p.evaluate(()=>{setVis('cap',1);CAP.length=0;for(const k in capLast)delete capLast[k];const pl=S.p;ev3('charge',pl.x+300,pl.y);ev3('leap',pl.x-300,pl.y);ev3('wake',pl.x,pl.y-300);gearUpd(1/60)});
 r=await p.evaluate(()=>{const a=$('scap').getBoundingClientRect(),q=$('r').getBoundingClientRect(),w=$('wc').getBoundingClientRect();const ov=(x,y)=>Math.min(x.right,y.right)-Math.max(x.left,y.left)>1&&Math.min(x.bottom,y.bottom)-Math.max(x.top,y.top)>1;return{r:ov(a,q),wc:ov(a,w),sd:ov(a,$('sd').getBoundingClientRect())}});
 ok(!r.r&&!r.wc&&!r.sd,'captions clear of buttons and toolbar in small landscape '+JSON.stringify(r));
 ok(!errs.length,'no page errors '+errs.join(' | '));await b.close()})();
