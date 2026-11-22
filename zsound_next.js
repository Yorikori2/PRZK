/* PROJECT LEGACY — sample: zombie voices and positional sound.
   Every sound that happens in the world gets quieter with distance (silent past 1000 px) and is panned left/right by where it is,
   so danger off-screen can be heard before it is seen. The player's own guns stay full volume and centred.
   Needs gunfeel.js (audio context, SND switch). */
'use strict';
const ZS5={last:new Map(),on:true};
/* a sound placed in the world: returns [destination node, gain] or null when too far */
function at3(x,y,vol){const a=acx();if(!a||!S)return null;const p=S.p,d=Math.hypot(x-p.x,y-p.y),k=Math.pow(Math.max(0,1-d/1000),1.4);if(k<.01)return null;
 const g2=a.createGain();g2.gain.value=k*(vol||1);let dest=g2;if(a.createStereoPanner){const pn=a.createStereoPanner();pn.pan.value=Math.max(-1,Math.min(1,(x-p.x)/420));g2.connect(pn);pn.connect(OUT)}else g2.connect(OUT);return[dest,k]}
function n3(a,dest,t,o){const s=a.createBufferSource();s.buffer=NB;const f=a.createBiquadFilter();f.type=o.type||'bandpass';f.frequency.value=o.f;f.Q.value=o.q||.8;const g2=a.createGain();g2.gain.setValueAtTime(.0008,t);g2.gain.linearRampToValueAtTime(o.v,t+(o.a||.01));g2.gain.exponentialRampToValueAtTime(.0008,t+o.d);
 if(o.trem){const l=a.createOscillator(),lg=a.createGain();l.frequency.value=o.trem;lg.gain.value=o.v*.6;l.connect(lg).connect(g2.gain);l.start(t);l.stop(t+o.d)}s.connect(f).connect(g2).connect(dest);s.start(t,Math.random()*.5);s.stop(t+o.d+.05)}
function o3(a,dest,t,o){const s=a.createOscillator();s.type=o.w||'sawtooth';s.frequency.setValueAtTime(o.f0,t);if(o.fm)s.frequency.linearRampToValueAtTime(o.fm,t+o.d*.4);s.frequency.exponentialRampToValueAtTime(Math.max(20,o.f1),t+o.d);
 if(o.vib){const l=a.createOscillator(),lg=a.createGain();l.frequency.value=o.vib;lg.gain.value=o.f0*.06;l.connect(lg).connect(s.frequency);l.start(t);l.stop(t+o.d)}
 const f=a.createBiquadFilter();f.type='lowpass';f.frequency.value=o.lp||1200;const g2=a.createGain();g2.gain.setValueAtTime(.0008,t);g2.gain.linearRampToValueAtTime(o.v,t+(o.a||.05));g2.gain.exponentialRampToValueAtTime(.0008,t+o.d);s.connect(f).connect(g2).connect(dest);s.start(t);s.stop(t+o.d+.05)}
/* voices: one short call per kind */
/* zombie voice: a buzzy vocal source (pitch with jitter) + raspy breath, shaped by vowel formants that glide (ㅡ → ㅓ gives "그어어"),
   with a fast amplitude flutter for the throat-rattle ("그르르"). */
const VOW={eu:[330,1350,2450],eo:[600,1000,2500],a:[780,1250,2600],u:[360,820,2350],ae:[650,1700,2550]};
function growl(a,dest,t,o){const d=o.d,p0=o.p0,p1=o.p1||p0*.75,V=o.v||.3,from=VOW[o.from||'eu'],to=VOW[o.to||'eo'];
 const out=a.createGain();out.gain.setValueAtTime(.0008,t);out.gain.linearRampToValueAtTime(V,t+(o.a||.12));out.gain.setValueAtTime(V*.9,t+d*.7);out.gain.exponentialRampToValueAtTime(.0008,t+d);
 /* throat rattle: amplitude flutter */
 const am=a.createGain();am.gain.value=1-(o.fryD??.55)/2;if(o.fry){const l=a.createOscillator(),lg=a.createGain();l.type='triangle';l.frequency.setValueAtTime(o.fry,t);l.frequency.linearRampToValueAtTime(o.fry*.8,t+d);lg.gain.value=(o.fryD??.55)/2;l.connect(lg).connect(am.gain);l.start(t);l.stop(t+d+.05)}
 am.connect(out).connect(dest);
 /* formant bank */
 const F=[0,1,2].map(i=>{const f=a.createBiquadFilter();f.type='bandpass';f.Q.value=[7,9,12][i];f.frequency.setValueAtTime(from[i]*(o.fs||1),t);f.frequency.linearRampToValueAtTime(to[i]*(o.fs||1),t+d*(o.glide||.45));const g2=a.createGain();g2.gain.value=[1,.7,.28][i]*(o.bright||1);f.connect(g2).connect(am);return f});
 /* voice source: sawtooth with jitter, plus pitch glide */
 const src=a.createOscillator();src.type='sawtooth';src.frequency.setValueAtTime(p0,t);if(o.pm)src.frequency.linearRampToValueAtTime(o.pm,t+d*.35);src.frequency.exponentialRampToValueAtTime(Math.max(30,p1),t+d);
 const jit=a.createOscillator(),jg=a.createGain();jit.type='sine';jit.frequency.value=5+Math.random()*3;jg.gain.value=p0*(o.jit||.04);jit.connect(jg).connect(src.frequency);
 const sg=a.createGain();sg.gain.value=1;src.connect(sg);F.forEach(f=>sg.connect(f));
 /* breath / rasp */
 const nb=a.createBufferSource();nb.buffer=NB;const ng=a.createGain();ng.gain.value=o.rasp??.35;nb.connect(ng);F.forEach(f=>ng.connect(f));
 for(const n of[src,jit,nb]){n.start(t,n===nb?Math.random()*.5:0);n.stop(t+d+.05)}}
const ZV={
 civ:(a,d,t,j)=>growl(a,d,t,{p0:118*j,p1:88*j,d:1.25+Math.random()*.35,v:.32,fry:26,from:'eu',to:'eo',rasp:.4}),
 runner:(a,d,t,j)=>growl(a,d,t,{p0:175*j,pm:200*j,p1:130*j,d:.6,v:.36,fry:38,from:'eo',to:'a',a:.04,rasp:.5}),
 screamer:(a,d,t)=>{growl(a,d,t,{p0:560,pm:880,p1:480,d:1.3,v:.42,fry:0,from:'ae',to:'a',a:.06,rasp:.25,bright:1.5,jit:.08});n3(a,d,t,{type:'highpass',f:2600,v:.08,d:1.1})},
 heavy:(a,d,t,j)=>growl(a,d,t,{p0:90*j,p1:66*j,d:1.4,v:.34,fry:20,fryD:.7,from:'eu',to:'eo',rasp:.55,fs:.9}),
 crawler:(a,d,t,j)=>growl(a,d,t,{p0:105*j,p1:80*j,d:1,v:.3,fry:14,fryD:.8,from:'u',to:'eo',rasp:.6,fs:.85}),
 spitter:(a,d,t)=>{growl(a,d,t,{p0:130,p1:100,d:.7,v:.28,fry:16,fryD:.8,from:'u',to:'eu',rasp:.6});n3(a,d,t+.62,{f:1600,q:2,v:.22,d:.12})},
 bloater:(a,d,t)=>{growl(a,d,t,{p0:95,p1:72,d:1.2,v:.26,fry:9,fryD:.85,from:'u',to:'eo',rasp:.4,fs:.8});for(let i=0;i<3;i++)o3(a,d,t+.3+i*.16,{w:'sine',f0:150+Math.random()*60,f1:80,d:.1,v:.1,lp:600})},
 stalker:(a,d,t)=>{n3(a,d,t,{type:'highpass',f:3000,v:.12,d:.8,a:.2});growl(a,d,t+.1,{p0:140,p1:120,d:.7,v:.14,fry:30,from:'eu',to:'eu',rasp:1.2,bright:.6})},
 dog:(a,d,t,j)=>{growl(a,d,t,{p0:330*j,p1:250*j,d:.17,v:.36,fry:0,from:'eo',to:'u',a:.01,rasp:.4,fs:1.1});growl(a,d,t+.24,{p0:310*j,p1:230*j,d:.16,v:.33,fry:0,from:'eo',to:'u',a:.01,rasp:.4,fs:1.1})},
 burner:(a,d,t)=>{growl(a,d,t,{p0:150,pm:190,p1:110,d:1.1,v:.32,fry:34,from:'ae',to:'eo',rasp:.6});for(let i=0;i<6;i++)n3(a,d,t+Math.random()*.8,{f:2200+Math.random()*1500,q:3,v:.07,d:.04})},
 shocker:(a,d,t)=>{growl(a,d,t,{p0:120,p1:95,d:1,v:.28,fry:60,fryD:.7,from:'eu',to:'eo',rasp:.4});n3(a,d,t+.2,{f:4800,q:5,v:.12,d:.25})},
 sleeper:(a,d,t)=>growl(a,d,t,{p0:95,p1:85,d:1.4,v:.16,fry:12,fryD:.8,from:'u',to:'eu',rasp:.8,a:.4}),
 brute:(a,d,t)=>growl(a,d,t,{p0:78,pm:92,p1:55,d:1.5,v:.42,fry:22,fryD:.7,from:'eo',to:'a',rasp:.6,fs:.8}),
 brood:(a,d,t)=>{growl(a,d,t,{p0:85,p1:62,d:1.3,v:.3,fry:10,fryD:.9,from:'u',to:'eo',rasp:.8,fs:.75});n3(a,d,t,{type:'lowpass',f:320,v:.12,d:.9,trem:9})},
 goliath:(a,d,t)=>{growl(a,d,t,{p0:62,pm:80,p1:42,d:2,v:.5,fry:18,fryD:.75,from:'eo',to:'a',rasp:.7,fs:.7,a:.25});n3(a,d,t,{type:'lowpass',f:260,v:.2,d:1.6,a:.2})}};
const VKEY=look=>ZV[look]?look:'civ';
/* off-screen sounds also show an arrow at the screen edge (works with the sound off too) */
const SDIR=[];function sdir(x,y,ic){if(!S)return;const p=S.p,d=Math.hypot(x-p.x,y-p.y);if(d<300||d>1000)return;const a=Math.atan2(y-p.y,x-p.x),old=SDIR.find(o=>Math.abs(Math.atan2(Math.sin(o.a-a),Math.cos(o.a-a)))<.35);
 if(old){old.t=1.4;old.a=a;old.ic=ic;old.k=1-d/1000}else SDIR.push({a,t:1.4,ic,k:1-d/1000})}
function voice(z,vol){sdir(z.x,z.y,ZD5[z.look]||'🧟');const a=acx();if(!a)return false;const at=at3(z.x,z.y,vol);if(!at)return false;ZV[VKEY(z.look)](a,at[0],a.currentTime,.9+Math.random()*.2);return true}
const ZD5={screamer:'😱',dog:'🐕',stalker:'👁',burner:'🔥',shocker:'⚡',bloater:'🫧',brute:'🐂',goliath:'👹',brood:'🪱'};
/* special moments */
const EV={
 leap:(a,d,t)=>growl(a,d,t,{p0:380,pm:620,p1:300,d:.5,v:.38,fry:0,from:'ae',to:'a',a:.03,rasp:.6,bright:1.4}),
 charge:(a,d,t)=>{ZV.brute(a,d,t);for(let i=0;i<4;i++)o3(a,d,t+.1+i*.15,{w:'sine',f0:70,f1:40,d:.12,v:.3,lp:200})},
 wake:(a,d,t)=>growl(a,d,t,{p0:260,pm:420,p1:200,d:.7,v:.4,fry:30,from:'eu',to:'a',a:.03,rasp:.6,bright:1.2}),
 slam:(a,d,t)=>{o3(a,d,t,{w:'sine',f0:70,f1:28,d:.7,v:.6,lp:200});n3(a,d,t,{type:'lowpass',f:500,v:.35,d:.6})},
 spawn:(a,d,t)=>{n3(a,d,t,{type:'lowpass',f:700,v:.22,d:.4,trem:22})},
 spit:(a,d,t)=>{n3(a,d,t,{f:1500,q:2,v:.2,d:.12})},
 boom:(a,d,t,r)=>{const big=Math.min(1.6,(r||80)/80);o3(a,d,t,{w:'sine',f0:90,f1:30,d:.6*big,v:.6,lp:220});n3(a,d,t,{type:'lowpass',f:900,v:.45,d:.5*big});n3(a,d,t+.12,{type:'lowpass',f:400,v:.18,d:.9*big})},
 roar:(a,d,t)=>ZV.goliath(a,d,t)};
function ev3(k,x,y,vol,arg){sdir(x,y,k=='boom'?'💥':k=='slam'?'👹':'❗');const a=acx();if(!a)return false;const at=at3(x,y,vol);if(!at)return false;EV[k](a,at[0],a.currentTime,arg);return true}
/* hooks: explosions and screams through the game's own functions */
{const _b=boom;boom=function(x,y,rad,dmg,fire){ev3('boom',x,y,1,rad);return _b(x,y,rad,dmg,fire)}}
{const _sc=scream;scream=function(z){voice(Object.assign({},z,{look:'screamer'}),1.4);return _sc(z)}}
/* per frame: voices on a timer, state changes become sound events */
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!S)return;const p=S.p,now=performance.now();let calls=0;
  for(const z of Z){if(z.hp<=0)continue;const d=Math.hypot(z.x-p.x,z.y-p.y);if(d>1000)continue;
   const L=z.look,st=ZS5.last.get(z)||{t:now+Math.random()*3000,lp:0,ch:0,sl:z.sleep,cd:z.cd4||0};
   if(z.leap>0&&!st.lp)ev3('leap',z.x,z.y);st.lp=z.leap>0;if(z.ch>0&&!st.ch)ev3('charge',z.x,z.y);st.ch=z.ch>0;if(st.sl&&!z.sleep)ev3('wake',z.x,z.y,1.2);st.sl=z.sleep;
   if(L=='goliath'&&(z.cd4||0)>st.cd+2&&d<300)ev3('slam',z.x,z.y,1.2);if(L=='brood'&&(z.cd4||0)>st.cd+2)ev3('spawn',z.x,z.y);if(L=='spitter'&&(z.cd4||0)>st.cd+1.5)ev3('spit',z.x,z.y);st.cd=z.cd4||0;
   if(now>st.t&&calls<3&&!z.sleep){const aw=z.al>0||z.w||d<420;if(aw||Math.random()<.3){if(voice(z))calls++}st.t=now+(L=='goliath'?5000:L=='dog'?1600:L=='burner'||L=='shocker'?2500:3500)+Math.random()*4000}
   ZS5.last.set(z,st)}
  const box=$('sdir');if(box){for(const o of SDIR)o.t-=dt;for(let i=SDIR.length-1;i>=0;i--)if(SDIR[i].t<=0)SDIR.splice(i,1);
   box.innerHTML=SDIR.map(o=>{const r=Math.min(innerWidth,innerHeight)*.42,x=innerWidth/2+Math.cos(o.a)*r*(innerWidth/Math.min(innerWidth,innerHeight))*.95,y=innerHeight/2+Math.sin(o.a)*r;return'<i style="left:'+Math.max(18,Math.min(innerWidth-18,x))+'px;top:'+Math.max(18,Math.min(innerHeight-18,y))+'px;opacity:'+Math.min(1,o.t)*(.45+.55*o.k)+'"><b style="transform:rotate('+o.a+'rad)">➤</b>'+o.ic+'</i>'}).join('')}
  if(ZS5.last.size>400)for(const k of ZS5.last.keys())if(!Z.includes(k))ZS5.last.delete(k)}}
/* boss entrance */
{const _mk=mk;mk=function(x,y,o={}){_mk(x,y,o);const z=Z[Z.length-1];if(z&&(z.look=='goliath'||z.look=='brood'))setTimeout(()=>{const a=acx();if(a){const at=at3(z.x,z.y,1)||[OUT];(z.look=='goliath'?ZV.goliath:ZV.brood)(a,at[0],a.currentTime,1)}},200)}}
document.body.insertAdjacentHTML('beforeend','<div id="sdir"></div>');
document.head.insertAdjacentHTML('beforeend','<style>#sdir{position:fixed;inset:0;pointer-events:none;z-index:3}#sdir i{position:absolute;transform:translate(-50%,-50%);font-style:normal;font-size:15px;display:flex;align-items:center;gap:1px;padding:2px 5px;border-radius:99px;background:#000a;border:1px solid #ffd36a88;transition:opacity .2s}#sdir b{display:inline-block;color:#ffd36a;font-size:12px}</style>');
