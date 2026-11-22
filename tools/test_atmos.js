// Footsteps + ambience sample checks.  usage: node tools/test_atmos.js <outdir> [page]
const {chromium}=require('playwright');const OUT=process.argv[2]||'.';const PAGE=process.argv[3]||'atmos-sample.html';
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+require('path').resolve(__dirname,'..',PAGE));await p.waitForTimeout(1200);
 ok(await p.evaluate(()=>$('bm').dataset.m=='scene'),'opens on the scene list');await p.screenshot({path:OUT+'/at-menu.png'});
 // walk vs run: the scripted scene in real time
 await p.evaluate(()=>{acx();ambInit();scene6('walk')});await p.waitForTimeout(5500);
 let r=await p.evaluate(()=>({noticed:Z.filter(z=>z.demo&&(z.al>0||Math.hypot(z.x-S.p.x,z.y-S.p.y)<(S.t>=1500?420:280)*.55)).length,n:Z.filter(z=>z.demo).length,mv:S.p.mv,lab:$('atmo').textContent}));
 ok(r.n==3&&r.noticed==0&&/걷기/.test(r.lab),'walking past 3 zombies at 175px: none notice '+JSON.stringify(r));await p.screenshot({path:OUT+'/at-walk.png'});
 await p.waitForTimeout(3300);r=await p.evaluate(()=>({run:AT.run,rings:AT.ring.length,lab:$('atmo').textContent,chasing:Z.filter(z=>z.al>0).length}));await p.screenshot({path:OUT+'/at-run.png'});
 await p.waitForTimeout(1200);const r2=await p.evaluate(()=>Z.filter(z=>z.demo&&(z.al>0||Math.hypot(z.x-S.p.x,z.y-S.p.y)<280)).length);
 ok(/달리기/.test(r.lab)&&r2>=2,'running back: footstep noise rings and zombies come '+JSON.stringify(r)+' noticed '+r2);
 r=await p.evaluate(()=>{const o={};S.p.mv=1;jp=-1;jx=.5;jy=0;o.walk=detMul();jx=1;o.run=detMul();S.p.mv=0;o.stand=detMul();jp=null;jx=0;return o});ok(r.walk==.55&&r.run==1&&r.stand==.7,'detection range: walk 55%, stand 70%, run 100% '+JSON.stringify(r));
 // step sounds differ by floor and by gait
 r=await p.evaluate(()=>{const a=acx();const ob=a.createBiquadFilter.bind(a);const fs=[];a.createBiquadFilter=()=>{const f=ob();fs.push(f);return f};stepSound(false,true);const ind=fs.map(f=>f.type);fs.length=0;stepSound(true,false);const out=fs.map(f=>f.type);a.createBiquadFilter=ob;return{ind,out}});
 ok(r.ind.join()!=r.out.join(),'indoor and outdoor steps use different sounds '+JSON.stringify(r));
 // ambience levels per scene
 const lv=async k=>{await p.evaluate(k=>scene6(k),k);await p.waitForTimeout(1600);return p.evaluate(()=>({wind:+AMB.wind.g.gain.value.toFixed(3),rain:+AMB.rain.g.gain.value.toFixed(3),crick:+AMB.cg.gain.value.toFixed(3),fire:+AMB.fire.g.gain.value.toFixed(3),muff:Math.round(AMB.muff.frequency.value),mode:AT.mode}))};
 const day=await lv('day'),night=await lv('night');await p.screenshot({path:OUT+'/at-night.png'});const rain=await lv('rain');await p.screenshot({path:OUT+'/at-rain.png'});const fire=await lv('fire');const indoor=await lv('indoor');
 ok(day.crick<.005&&night.crick>.02,'crickets at night only '+day.crick+' / '+night.crick);ok(rain.rain>.1&&day.rain<.01,'rain layer on rainy days '+rain.rain);ok(fire.fire>.03&&day.fire<.01,'campfire loud near the base fire '+fire.fire);
 ok(indoor.muff<1000&&day.muff>10000&&/실내/.test(indoor.mode),'indoors the outside is muffled ('+indoor.muff+'Hz) · '+indoor.mode);
 r=await p.evaluate(()=>AT.drops.length);ok(r==0,'rain stops when another scene is picked');
 await p.evaluate(()=>scene6('rain'));await p.waitForTimeout(500);r=await p.evaluate(()=>AT.drops.length);ok(r>50,'rain draws falling drops: '+r);
 r=await p.evaluate(()=>{SND=false;ambTick(1/60);return new Promise(res=>setTimeout(()=>{res(+AMB.rain.g.gain.value.toFixed(3));SND=true},1500))});ok(r<.01,'sound off silences ambience '+r);
 ok(!errs.length,'no page errors '+errs.join(' | '));await b.close()})();
