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
 r=await p.evaluate(()=>{const a=acx();const ob=a.createBiquadFilter.bind(a);const fs=[];a.createBiquadFilter=()=>{const f=ob();fs.push(f);return f};stepSound(false,true);const ind=fs.map(f=>Math.round(f.frequency.value/100));fs.length=0;stepSound(true,false);const out=fs.map(f=>Math.round(f.frequency.value/100));a.createBiquadFilter=ob;return{ind,out}});
 ok(r.ind.join()!=r.out.join(),'indoor and outdoor steps use different sounds '+JSON.stringify(r));
 // ambience levels per scene
 const lv=async k=>{await p.evaluate(k=>scene6(k),k);await p.waitForTimeout(1600);return p.evaluate(()=>({rain:+AMB.rain.g.gain.value.toFixed(3),crick:+AMB.cg.gain.value.toFixed(3),fire:/모닥불/.test(AT.mode)?1:0,muff:Math.round(AMB.muff.frequency.value),mode:AT.mode}))};
 const day=await lv('day'),night=await lv('night');await p.screenshot({path:OUT+'/at-night.png'});const rain=await lv('rain');await p.screenshot({path:OUT+'/at-rain.png'});const fire=await lv('fire');const indoor=await lv('indoor');
 ok(day.crick<.005&&night.crick>.02,'crickets at night only '+day.crick+' / '+night.crick);ok(rain.rain>.05&&day.rain<.01,'rain layer on rainy days '+rain.rain);ok(fire.fire>.03&&day.fire<.01,'campfire loud near the base fire '+fire.fire);
 ok(indoor.muff<1000&&day.muff>10000&&/실내/.test(indoor.mode),'indoors the outside is muffled ('+indoor.muff+'Hz) · '+indoor.mode);
 r=await p.evaluate(()=>({d:AT.drops.length,r:rainNow()}));ok(r.d==0&&!r.r,'rain stops when another scene is picked');
 await p.evaluate(()=>scene6('rain'));await p.waitForTimeout(500);r=await p.evaluate(()=>AT.drops.length);ok(r>50,'rain draws falling drops: '+r);
 r=await p.evaluate(()=>{SND=false;ambTick(1/60);return new Promise(res=>setTimeout(()=>{res(+AMB.rain.g.gain.value.toFixed(3));SND=true},1500))});ok(r<.01,'sound off silences ambience '+r);
 r=await p.evaluate(()=>{scene6('day');return !('wind' in AMB)});ok(r,'no constant wind noise layer');
 r=await p.evaluate(async()=>{const res={};for(const run of[false,true]){const sr=AC.sampleRate,oc=new OfflineAudioContext(1,sr*.3|0,sr);const ko=OUT,kb=BUS.step;delete BUS.step;const a0=acx;acx=()=>oc;OUT=oc.destination;
   try{stepSound(run,false)}finally{acx=a0;OUT=ko;BUS.step=kb}const x=(await oc.startRendering()).getChannelData(0);let pk=0;for(const v of x)pk=Math.max(pk,Math.abs(v));res[run?'run':'walk']=+pk.toFixed(3)}return res});
 ok(r.walk>.08&&r.run>r.walk*2,'footsteps are audible and running is louder (peak '+JSON.stringify(r)+')');
 r=await p.evaluate(()=>{scene6('walk');S.p.mv=1;jp=-1;jx=1;jy=0;const dry=detMul();setRain(true);const wet=detMul();jp=null;jx=0;return{dry,wet:+wet.toFixed(2)}});ok(r.dry==1&&r.wet==.7,'rain: zombies notice you from 70% as far '+JSON.stringify(r));
 await p.evaluate(()=>scene6('rainwalk'));await p.waitForTimeout(8200);r=await p.evaluate(()=>$('atmo').textContent);await p.screenshot({path:OUT+'/at-rainrun.png'});ok(/112px/.test(r),'rain: running footsteps reach only 112px · '+r);
 r=await p.evaluate(()=>{let n=0;const s0=setRain;setRain=(...a)=>{n++;return s0(...a)};for(let d=0;d<200;d++){S.wx=null;S.day++;gearUpd(1/60)}setRain=s0;S.wx=null;return n});ok(r>35&&r<85,'about 30% of days start rainy: '+r+'/200');
 r=await p.evaluate(()=>{scene6('mixer');const rows=document.querySelectorAll('#bm [data-vk]').length;const sl=document.querySelector('[data-vk="zom"]');sl.value=40;sl.dispatchEvent(new Event('input'));return{rows,zom:VOL.zom,saved:JSON.parse(localStorage.getItem('pl_vol')).zom,bus:BUS.zom?+BUS.zom.gain.value.toFixed(2):null}});
 ok(r.rows==4&&r.zom==.4&&r.saved==.4&&r.bus==.4,'mixer: 4 sliders, zombie volume 40% applied and saved '+JSON.stringify(r));await p.screenshot({path:OUT+'/at-mixer.png'});
 r=await p.evaluate(()=>new Promise(res=>{closeBase();const b=$('snd');const was=SND;b.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));setTimeout(()=>{b.dispatchEvent(new PointerEvent('pointerup',{bubbles:true}));const tap=SND!==was;SND=was;
   b.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));setTimeout(()=>{b.dispatchEvent(new PointerEvent('pointerup',{bubbles:true}));res({tap,hold:$('bm').dataset.m})},650)},100)}));
 ok(r.tap&&r.hold=='mixer','🔊 tap toggles, hold opens the mixer '+JSON.stringify(r));
 ok(!errs.length,'no page errors '+errs.join(' | '));await b.close()})();
