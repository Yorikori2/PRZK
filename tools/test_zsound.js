// Zombie voices + positional sound sample checks.  usage: node tools/test_zsound.js <outdir> [page]
const {chromium}=require('playwright');const OUT=process.argv[2]||'.';const PAGE=process.argv[3]||'sound-sample.html';
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+require('path').resolve(__dirname,'..',PAGE));await p.waitForTimeout(1200);
 ok(await p.evaluate(()=>$('bm').dataset.m=='scene'),'opens on the sound scene list');await p.screenshot({path:OUT+'/zs-menu.png'});
 // every kind has a voice that schedules nodes
 let r=await p.evaluate(()=>{scene5('voice','civ1');const a=acx();let n=0;const oc=a.createOscillator.bind(a),ob=a.createBufferSource.bind(a);a.createOscillator=()=>{n++;return oc()};a.createBufferSource=()=>{n++;return ob()};
  const mute=[];for(const[id]of VZ){const z={x:S.p.x+100,y:S.p.y,look:id};const n0=n;voice(z,1);if(n==n0)mute.push(id)}for(const k of Object.keys(EV)){const n0=n;ev3(k,S.p.x+50,S.p.y,1,80);if(n==n0)mute.push('ev:'+k)}a.createOscillator=oc;a.createBufferSource=ob;return mute});
 ok(!r.length,'15 zombie voices and 8 event sounds all play '+r);
 // distance + pan
 r=await p.evaluate(()=>{const p=S.p,g=d=>{const at=at3(p.x+d,p.y,1);return at?+at[1].toFixed(3):0};const a=acx();let pans=[];const op=a.createStereoPanner.bind(a);a.createStereoPanner=()=>{const s=op();pans.push(s);return s};at3(p.x+400,p.y,1);at3(p.x-400,p.y,1);a.createStereoPanner=op;
  return{g:[g(0),g(120),g(350),g(600),g(850),g(1050)],pan:pans.map(s=>+s.pan.value.toFixed(2))}});
 ok(r.g[0]==1&&r.g[1]>r.g[2]&&r.g[2]>r.g[3]&&r.g[3]>r.g[4]&&r.g[5]==0,'volume falls with distance, silent past 1000px '+JSON.stringify(r.g));ok(r.pan[0]>.9&&r.pan[1]<-.9,'sound pans right/left by position '+JSON.stringify(r.pan));
 // off-screen arrows, even when muted
 await p.evaluate(()=>{SND=false;scene5('off')});await p.waitForTimeout(3500);r=await p.evaluate(()=>{const n=document.querySelectorAll('#sdir i').length;const right=[...document.querySelectorAll('#sdir i')].some(e=>parseFloat(e.style.left)>innerWidth*.7);SND=true;return{n,right}});
 ok(r.n>0&&r.right,'off-screen runners show an edge arrow on the right (sound off too) '+JSON.stringify(r));
 await p.evaluate(()=>{scene5('off')});await p.waitForTimeout(2200);await p.screenshot({path:OUT+'/zs-off.png'});
 // events from behaviour
 r=await p.evaluate(()=>{const seen={};const o=ev3;ev3=function(k,...a){seen[k]=(seen[k]||0)+1;return o.call(this,k,...a)};
  reset5(true);const pl=S.p;const sl=put('sleeper',90,-Math.PI/2,{al:0});for(let i=0;i<30;i++)upd(1/60);pl.x=sl.x;pl.y=sl.y+55;for(let i=0;i<60;i++)upd(1/60);
  reset5(true);put('stalker',160,0,{cd4:0,al:8});for(let i=0;i<120;i++){upd(1/60);if(pl.hp<50)pl.hp=100}reset5(false);put('brute',200,Math.PI,{cd4:0,al:8});for(let i=0;i<240;i++){upd(1/60);if(pl.hp<50)pl.hp=100}
  reset5(false);const gz=put('goliath',90,0,{cd4:0,al:8});for(let i=0;i<300;i++){upd(1/60);if(pl.hp<50)pl.hp=100}ev3=o;boom(pl.x+300,pl.y,60,0);return seen});
 ok(r.wake&&r.leap&&r.charge&&r.slam,'wake, leap, charge and slam make their sounds '+JSON.stringify(r));
 r=await p.evaluate(()=>{let n=0;const o=ev3;ev3=function(k,...a){if(k=='boom')n++;return o.call(this,k,...a)};boom(S.p.x+100,S.p.y,60,0);ev3=o;return n});ok(r==1,'explosions anywhere make a positioned boom');
 await p.evaluate(()=>scene5('dist'));await p.waitForTimeout(2400);await p.screenshot({path:OUT+'/zs-dist.png'});
 await p.evaluate(()=>scene5('boss'));const d0=await p.evaluate(()=>{const g=Z.find(z=>z.look=='goliath');return g?Math.hypot(g.x-S.p.x,g.y-S.p.y):-1});await p.waitForTimeout(3000);
 r=await p.evaluate(()=>{const g=Z.find(z=>z.look=='goliath');return{d:g?Math.round(Math.hypot(g.x-S.p.x,g.y-S.p.y)):-1,bar:getComputedStyle($('bossbar')).display!='none',w:+(weight(S.p)/capacity(S.p)).toFixed(2)}});
 ok(d0>0&&d0<=330&&r.d<d0-60&&r.bar&&r.w<=1,'boss scene: goliath appears '+Math.round(d0)+'px away, walks in, boss bar shown, not overweight '+JSON.stringify(r));await p.screenshot({path:OUT+'/zs-boss.png'});
 ok(!errs.length,'no page errors '+errs.join(' | '));await b.close()})();
