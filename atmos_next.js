/* PROJECT LEGACY — sample: footsteps and ambience.
   Footsteps: walking (stick pushed part way) is quiet and shrinks how far zombies notice you to 55 %;
   running is loud — every step is a noise that pulls zombies within 160 px. Floor decides the sound (indoor tap / outdoor scuff).
   Ambience: day birds + breeze, night crickets + low wind, rain, a crackling base fire that gets louder as you get close,
   and indoors the outside is muffled with the odd drip. Needs gunfeel.js (audio, SND) and zsound.js. */
'use strict';
const AT={rain:0,step:0,lastPh:0,mode:'',run:false,ring:[],drops:[]};
/* ---------- movement state ---------- */
const moveMag=()=>Math.min(1,Math.hypot(jx,jy));
const isRun=()=>!!S&&!!S.p.mv&&!S.dr&&moveMag()>.75;
/* how far zombies notice you: walking 55 %, standing 70 %, running 100 % (used by the page's chase rule) */
function detMul(){if(!S||S.dr)return 1;if(!S.p.mv)return .7;return isRun()?1:.55}
/* ---------- footsteps ---------- */
function stepSound(run,indoor){const a=acx();if(!a)return;const t=a.currentTime,v=run?.32:.1;
 if(indoor){nz(a,t,{f:1300+Math.random()*300,q:4,v:v*1.2,d:.05});tone(a,t,{f0:180,f1:90,d:.06,v:v*.9})}
 else{nz(a,t,{type:'lowpass',f:900+Math.random()*400,q:.7,v:v,d:run?.12:.09});nz(a,t+.02,{f:2600,q:1.5,v:v*.25,d:.05})}}
function stepTick(){if(!S)return;const p=S.p;if(!p.mv||S.dr){AT.lastPh=p.ph||0;return}const ph=p.ph||0;if(Math.floor(ph/2.2)==Math.floor(AT.lastPh/2.2)){return}AT.lastPh=ph;
 const run=isRun(),indoor=S.inb>=0;stepSound(run,indoor);if(run){noise(p.x,p.y,1);AT.ring.push({x:p.x,y:p.y,t:.45})}}
/* ---------- ambience ---------- */
let AMB=null;
function ambInit(){const a=acx();if(!a||AMB)return AMB;const mk=(type,f,q)=>{const s=a.createBufferSource();s.buffer=NB;s.loop=true;const fl=a.createBiquadFilter();fl.type=type;fl.frequency.value=f;fl.Q.value=q||.7;const g2=a.createGain();g2.gain.value=0;s.connect(fl).connect(g2);s.start();return{s,f:fl,g:g2}};
 const bus=a.createGain();bus.gain.value=.9;const muff=a.createBiquadFilter();muff.type='lowpass';muff.frequency.value=20000;bus.connect(muff).connect(OUT);
 const wind=mk('bandpass',380,.6);wind.g.connect(bus);const lfo=a.createOscillator(),lg=a.createGain();lfo.frequency.value=.13;lg.gain.value=160;lfo.connect(lg).connect(wind.f.frequency);lfo.start();
 const rain=mk('highpass',1100,.5);const rl=a.createBiquadFilter();rl.type='lowpass';rl.frequency.value=7000;rain.g.disconnect();rain.g.connect(rl).connect(bus);
 /* crickets: a 4.4 kHz tone chopped twice: fast chirp and slow on/off */
 const cr=a.createOscillator();cr.frequency.value=4400;const c1=a.createGain(),c2=a.createGain(),cg=a.createGain();c1.gain.value=0;c2.gain.value=0;cg.gain.value=0;
 const f1=a.createOscillator();f1.type='square';f1.frequency.value=14;const f1g=a.createGain();f1g.gain.value=.5;f1.connect(f1g).connect(c1.gain);const f2=a.createOscillator();f2.type='square';f2.frequency.value=.7;const f2g=a.createGain();f2g.gain.value=.5;f2.connect(f2g).connect(c2.gain);
 cr.connect(c1).connect(c2).connect(cg).connect(bus);cr.start();f1.start();f2.start();
 const fire=mk('lowpass',420,.8);fire.g.connect(OUT);
 AMB={a,bus,muff,wind,rain,cg,fire,next:{bird:0,drip:0,crack:0,drop:0}};return AMB}
const lvl=(node,v,a)=>node.gain.setTargetAtTime(v,a.currentTime,.4);
function baseFire(){const c=BP.find(o=>o.t=='tentS'||o.t=='container'||o.t=='hq');return c?{x:c.x+c.w/2,y:c.y+c.h+24}:null}
function ambTick(dt){if(!SND||!S){if(AMB){for(const n of[AMB.wind.g,AMB.rain.g,AMB.cg,AMB.fire.g])lvl(n,0,AMB.a)}return}const A=ambInit();if(!A)return;const a=A.a,t=a.currentTime,p=S.p;
 const night=S.t>=1500||S.t<100,indoor=S.inb>=0,rain=AT.rain>0,fp=baseFire(),fd=fp?Math.hypot(fp.x-p.x,fp.y-p.y):1e9;
 AT.mode=(indoor?'실내':'실외')+' · '+(night?'밤':'낮')+(rain?' · 비':'')+(fd<500?' · 모닥불':'');
 A.muff.frequency.setTargetAtTime(indoor?650:20000,t,.3);
 lvl(A.wind.g,(night?.10:.06)+(rain?.04:0),a);lvl(A.rain.g,rain?.16:0,a);lvl(A.cg,night&&!rain?.035:0,a);lvl(A.fire.g,fd<500?.12*Math.pow(1-fd/500,1.5):0,a);
 const N=A.next,now=performance.now();
 if(!night&&!rain&&now>N.bird){N.bird=now+1800+Math.random()*4000;const n=2+Math.random()*3|0,b0=2400+Math.random()*900;for(let i=0;i<n;i++){const s=a.createOscillator(),g2=a.createGain(),tt=t+i*.13;s.type='sine';s.frequency.setValueAtTime(b0,tt);s.frequency.exponentialRampToValueAtTime(b0*1.35,tt+.07);g2.gain.setValueAtTime(.0008,tt);g2.gain.linearRampToValueAtTime(indoor?.008:.03,tt+.01);g2.gain.exponentialRampToValueAtTime(.0008,tt+.09);s.connect(g2).connect(A.bus);s.start(tt);s.stop(tt+.1)}}
 if(indoor&&now>N.drip){N.drip=now+1500+Math.random()*3500;tone(a,t,{f0:1500+Math.random()*600,f1:700,d:.08,v:.05})}
 if(fd<500&&now>N.crack){N.crack=now+60+Math.random()*240;const k=Math.pow(1-fd/500,1.5);nz(a,t,{f:1800+Math.random()*2000,q:4,v:.12*k,d:.03})}
 if(rain&&now>N.drop){N.drop=now+40+Math.random()*90;nz(a,t,{f:3000+Math.random()*3000,q:6,v:.03,d:.02})}}
/* ---------- hooks + visuals ---------- */
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!S)return;stepTick();ambTick(dt);AT.ring=AT.ring.filter(r=>(r.t-=dt)>0);AT.run=isRun();
  if(AT.rain>0){const W=innerWidth,H=innerHeight;while(AT.drops.length<90)AT.drops.push({x:Math.random()*W,y:Math.random()*H,v:500+Math.random()*300});for(const d of AT.drops){d.y+=d.v*dt;d.x-=d.v*dt*.15;if(d.y>H){d.y=-10;d.x=Math.random()*(W+60)}}}else AT.drops.length=0;
  const st=$('atmo');if(st)st.innerHTML=(S.p.mv?(AT.run?'🏃 달리기 · 발소리 160px':'🤫 걷기 · 조용함'):'🧍 정지')+' <small>'+AT.mode+'</small>'}}
{const _dfx=drawGearFx;drawGearFx=function(){_dfx();for(const r of AT.ring){const k=1-r.t/.45;g.globalAlpha=(1-k)*.35;g.strokeStyle='#ffd36a';g.lineWidth=1.5;g.beginPath();g.ellipse(r.x,r.y,160*k,160*k*.55,0,0,7);g.stroke();g.globalAlpha=1}}}
{const _dr=draw;draw=function(){_dr();if(!AT.drops.length)return;ctx.save();ctx.setTransform(1,0,0,1,0,0);const s=(typeof dpr!='undefined'?dpr:1);ctx.strokeStyle='rgba(180,200,230,.45)';ctx.lineWidth=1*s;ctx.beginPath();for(const d of AT.drops){ctx.moveTo(d.x*s,d.y*s);ctx.lineTo((d.x-3)*s,(d.y+14)*s)}ctx.stroke();ctx.fillStyle='rgba(30,40,60,.18)';ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);ctx.restore()}}
document.body.insertAdjacentHTML('beforeend','<div id="atmo"></div>');
document.head.insertAdjacentHTML('beforeend','<style>#atmo{position:fixed;left:50%;transform:translateX(-50%);top:calc(env(safe-area-inset-top,0px) + 118px);z-index:3;pointer-events:none;font-size:12px;padding:3px 10px;border-radius:99px;background:#000a;border:1px solid #ffffff22;white-space:nowrap}#atmo small{color:var(--mut);margin-left:4px}</style>');
