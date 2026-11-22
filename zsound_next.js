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
const ZV={
 civ:(a,d,t,j)=>{o3(a,d,t,{f0:95*j,f1:70*j,d:.9+Math.random()*.4,v:.22,vib:5,lp:420,a:.15})},
 runner:(a,d,t,j)=>{o3(a,d,t,{f0:170*j,f1:110*j,d:.35,v:.25,vib:9,lp:900});n3(a,d,t,{f:900,v:.08,d:.3})},
 screamer:(a,d,t)=>{o3(a,d,t,{f0:640,fm:1150,f1:560,d:1.3,v:.38,vib:7,lp:3200,a:.08});n3(a,d,t,{type:'highpass',f:2500,v:.12,d:1.1})},
 heavy:(a,d,t,j)=>{o3(a,d,t,{f0:75*j,f1:55*j,d:1.1,v:.26,vib:3,lp:300,a:.2})},
 crawler:(a,d,t,j)=>{n3(a,d,t,{type:'lowpass',f:380*j,v:.22,d:.7,trem:14,a:.05})},
 spitter:(a,d,t)=>{n3(a,d,t,{type:'lowpass',f:500,v:.18,d:.5,trem:18});n3(a,d,t+.45,{f:1600,q:2,v:.22,d:.12})},
 bloater:(a,d,t)=>{for(let i=0;i<4;i++)o3(a,d,t+i*.13,{w:'sine',f0:120+Math.random()*60,f1:60,d:.12,v:.16,lp:500})},
 stalker:(a,d,t)=>{n3(a,d,t,{type:'highpass',f:3000,v:.12,d:.8,a:.2})},
 dog:(a,d,t,j)=>{o3(a,d,t,{f0:380*j,f1:220*j,d:.13,v:.3,lp:1600});o3(a,d,t+.22,{f0:360*j,f1:200*j,d:.13,v:.28,lp:1600})},
 burner:(a,d,t)=>{for(let i=0;i<6;i++)n3(a,d,t+Math.random()*.6,{f:2200+Math.random()*1500,q:3,v:.08,d:.04});n3(a,d,t,{type:'lowpass',f:400,v:.12,d:.7})},
 shocker:(a,d,t)=>{o3(a,d,t,{w:'square',f0:118,f1:122,d:.5,v:.08,lp:1800});n3(a,d,t+.1,{f:4800,q:5,v:.14,d:.25})},
 sleeper:(a,d,t)=>{n3(a,d,t,{type:'lowpass',f:260,v:.1,d:1.2,a:.4})},
 brute:(a,d,t)=>{o3(a,d,t,{f0:62,f1:44,d:1.2,v:.32,vib:4,lp:260,a:.2});n3(a,d,t,{type:'lowpass',f:300,v:.14,d:.9})},
 brood:(a,d,t)=>{n3(a,d,t,{type:'lowpass',f:320,v:.2,d:.9,trem:9});o3(a,d,t+.2,{w:'sine',f0:90,f1:50,d:.5,v:.14,lp:300})},
 goliath:(a,d,t)=>{o3(a,d,t,{f0:52,fm:70,f1:38,d:1.8,v:.42,vib:3,lp:240,a:.25});n3(a,d,t,{type:'lowpass',f:260,v:.25,d:1.5,a:.2})}};
const VKEY=look=>ZV[look]?look:'civ';
/* off-screen sounds also show an arrow at the screen edge (works with the sound off too) */
const SDIR=[];function sdir(x,y,ic){if(!S)return;const p=S.p,d=Math.hypot(x-p.x,y-p.y);if(d<300||d>1000)return;const a=Math.atan2(y-p.y,x-p.x),old=SDIR.find(o=>Math.abs(Math.atan2(Math.sin(o.a-a),Math.cos(o.a-a)))<.35);
 if(old){old.t=1.4;old.a=a;old.ic=ic;old.k=1-d/1000}else SDIR.push({a,t:1.4,ic,k:1-d/1000})}
function voice(z,vol){sdir(z.x,z.y,ZD5[z.look]||'🧟');const a=acx();if(!a)return false;const at=at3(z.x,z.y,vol);if(!at)return false;ZV[VKEY(z.look)](a,at[0],a.currentTime,.9+Math.random()*.2);return true}
const ZD5={screamer:'😱',dog:'🐕',stalker:'👁',burner:'🔥',shocker:'⚡',bloater:'🫧',brute:'🐂',goliath:'👹',brood:'🪱'};
/* special moments */
const EV={
 leap:(a,d,t)=>{o3(a,d,t,{f0:500,fm:900,f1:300,d:.45,v:.3,vib:10,lp:2600})},
 charge:(a,d,t)=>{o3(a,d,t,{f0:70,f1:50,d:.8,v:.35,lp:260});for(let i=0;i<4;i++)o3(a,d,t+.1+i*.15,{w:'sine',f0:70,f1:40,d:.12,v:.3,lp:200})},
 wake:(a,d,t)=>{o3(a,d,t,{f0:300,fm:700,f1:240,d:.6,v:.34,vib:12,lp:2200})},
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
