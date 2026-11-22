/* PROJECT LEGACY — footsteps, ambience, weather and a sound mixer.
   Footsteps: walking (stick part way) is quiet and zombies notice you from 55 % as far; running is loud and every step
   pulls zombies within 160 px. Indoor tap / outdoor scuff, in the 0.8–3 kHz band so phone speakers play them.
   Ambience (no wind bed): day birds, night crickets (synthesized chirps, go quiet when zombies are close), rain, base campfire crackle, muffled outside + drips indoors.
   Weather: a day can be rainy — zombies hear 30 % less and the edges of the view get darker.
   Mixer: tap 🔊 = on/off, hold 🔊 = separate volumes for guns, zombies, footsteps, ambience (saved in this browser).
   Needs gunfeel.js (audio, SND) and zsound.js. */
'use strict';
const AT={step:0,lastPh:0,mode:'',run:false,ring:[],drops:[]};
/* ================= mixer ================= */
const VOLK=[['gun','🔫 총소리 · 효과음'],['zom','🧟 좀비 소리'],['step','👣 발소리'],['amb','🌙 환경음']];
let VOL={gun:1,zom:1,step:1,amb:1};try{Object.assign(VOL,JSON.parse(localStorage.getItem('pl_vol')||'{}'))}catch(e){}
const BUS={};
function bus(k){const a=acx();if(!a)return null;if(!BUS[k]){BUS[k]=a.createGain();BUS[k].gain.value=VOL[k];BUS[k].connect(OUT)}return BUS[k]}
function viaBus(k,fn){const b=bus(k);if(!b)return fn();const o=OUT;OUT=b;try{return fn()}finally{OUT=o}}
{const g0=gunSound;gunSound=function(...a){return viaBus('gun',()=>g0.apply(this,a))}}
{const r0=reloadSound;reloadSound=function(...a){return viaBus('gun',()=>r0.apply(this,a))}}
{const e0=emptySound;emptySound=function(...a){return viaBus('gun',()=>e0.apply(this,a))}}
{const v0=voice;voice=function(...a){return viaBus('zom',()=>v0.apply(this,a))}}
{const x0=ev3;ev3=function(...a){return viaBus('zom',()=>x0.apply(this,a))}}
function setVol(k,v){VOL[k]=v;try{localStorage.setItem('pl_vol',JSON.stringify(VOL))}catch(e){}const b=BUS[k];if(b)b.gain.value=v}
function openMixer(){const b=$('bm');b.dataset.m='mixer';
 b.innerHTML='<div class="sh"><h2>🎚 소리 설정</h2><div class="wt">종류별로 크기를 따로 맞춰요 · 이 브라우저에 저장</div><button onclick="closeBase()">✕</button></div>'+
 '<label class="mxr mxon"><span>🔊 전체 소리</span><input type="checkbox" id="mxAll"'+(SND?' checked':'')+'><b>'+(SND?'켜짐':'꺼짐')+'</b></label>'+
 VOLK.map(([k,n])=>'<label class="mxr"><span>'+n+'</span><input type="range" min="0" max="100" step="5" value="'+Math.round(VOL[k]*100)+'" data-vk="'+k+'"><b>'+Math.round(VOL[k]*100)+'%</b><button data-vt="'+k+'">▶</button></label>').join('');
 b.style.display='block';
 $('mxAll').onchange=e=>{SND=e.target.checked;try{localStorage.setItem('pl_snd',SND?'1':'0')}catch(_){}$('snd').textContent=SND?'🔊':'🔇';if(SND)acx();openMixer()};
 b.querySelectorAll('[data-vk]').forEach(r=>r.oninput=()=>{setVol(r.dataset.vk,r.value/100);r.nextElementSibling.textContent=r.value+'%'});
 b.querySelectorAll('[data-vt]').forEach(c=>c.onclick=e=>{e.preventDefault();const k=c.dataset.vt,p=S.p;if(k=='gun')gunSound('pistol');if(k=='zom')voice({x:p.x+120,y:p.y,look:'civ1'},1);if(k=='step')stepSound(true,false);if(k=='amb'){AT.preview=2}})}
/* tap = on/off (as before), hold = mixer */
{let t0=0,held=null;const sb=$('snd');sb.title='누르면 켜기·끄기 · 길게 누르면 소리 설정';
 sb.addEventListener('pointerdown',e=>{e.stopImmediatePropagation();e.preventDefault();t0=performance.now();held=setTimeout(()=>{held=null;openMixer()},450)},true);
 sb.addEventListener('pointerup',e=>{e.stopImmediatePropagation();if(held){clearTimeout(held);held=null;SND=!SND;try{localStorage.setItem('pl_snd',SND?'1':'0')}catch(_){}sb.textContent=SND?'🔊':'🔇';if(SND){acx();gunSound('pistol')}msg((SND?'🔊 효과음 켜짐':'🔇 효과음 꺼짐')+' · 길게 누르면 종류별 소리 설정')}},true);
 sb.addEventListener('pointercancel',()=>{if(held){clearTimeout(held);held=null}},true)}
/* ================= weather ================= */
/* each new day has a 30 % chance of rain lasting 600–1600 game time; scenes can force it */
const rainNow=()=>!!S&&!!S.wx&&S.wx.rain&&(S.wx.until==null||S.tt<S.wx.until);
function setRain(on,len){if(!S)return;S.wx={rain:on,until:on&&len?S.tt+len:null};msg(on?'🌧 비가 내리기 시작합니다 · 좀비 청각 -30% · 시야 어두움':'⛅ 비가 그쳤습니다')}
/* ================= footsteps ================= */
const moveMag=()=>Math.min(1,Math.hypot(jx,jy));
const isRun=()=>!!S&&!!S.p.mv&&!S.dr&&moveMag()>.75;
/* how far zombies notice you (used by the page's chase rule): walk 55 %, stand 70 %, run 100 %; rain ×0.7 */
function detMul(){if(!S||S.dr)return 1;const m=!S.p.mv?.7:isRun()?1:.55;return m*(rainNow()?.7:1)}
function stepSound(run,indoor){viaBus('step',()=>{const a=acx();if(!a)return;const t=a.currentTime,v=run?.85:.26;
 if(indoor){nz(a,t,{f:1500+Math.random()*400,q:3,v:v,d:.06});nz(a,t+.005,{f:900,q:2,v:v*.6,d:.05})}
 else{nz(a,t,{f:1100+Math.random()*500,q:1.2,v:v,d:run?.11:.08});nz(a,t+.03,{f:2600+Math.random()*600,q:1.5,v:v*.45,d:.06})}})}
function stepTick(){if(!S)return;const p=S.p;if(!p.mv||S.dr){AT.lastPh=p.ph||0;return}const ph=p.ph||0;if(Math.floor(ph/2.2)==Math.floor(AT.lastPh/2.2))return;AT.lastPh=ph;
 const run=isRun();AT.step++;stepSound(run,S.inb>=0);if(run){const r=rainNow()?112:160;for(const q of Z)if(Math.hypot(q.x-p.x,q.y-p.y)<r){q.al=8;q.nx=p.x;q.ny=p.y}AT.ring.push({x:p.x,y:p.y,t:.45,r})}}
/* ================= ambience (no wind bed) ================= */
let AMB=null;
function ambInit(){const a=acx();if(!a)return null;if(AMB)return AMB;const ab=bus('amb');
 const muff=a.createBiquadFilter();muff.type='lowpass';muff.frequency.value=20000;const bed=a.createGain();bed.connect(muff).connect(ab);
 const rainS=a.createBufferSource();rainS.buffer=NB;rainS.loop=true;const rh=a.createBiquadFilter();rh.type='bandpass';rh.frequency.value=3500;rh.Q.value=.6;const rg=a.createGain();rg.gain.value=0;rainS.connect(rh).connect(rg).connect(bed);rainS.start();
 /* 4 crickets around the player: each chirp = 3-4 short sine pulses (~30 ms) at 4.3-5.2 kHz, one chirp every 1.6-2.6 s, and now and then a skipped chirp */
 const crk=[0,1,2,3].map(i=>({f:4300+Math.random()*900,pulses:3+(i%2),gap:1.6+Math.random()*.6,v:.012+Math.random()*.01,pan:[-.8,-.3,.35,.85][i],next:0}));
 AMB={a,bed,muff,rain:{g:rg},crk,quiet:0,next:{bird:0,drip:0,crack:0,drop:0}};return AMB}
function chirp(A,c,t){const a=A.a;let dest=A.bed;if(a.createStereoPanner){const pn=a.createStereoPanner();pn.pan.value=c.pan;pn.connect(A.bed);dest=pn}
 for(let i=0;i<c.pulses;i++){const tt=t+i*.065,o=a.createOscillator(),g2=a.createGain();o.type='sine';o.frequency.setValueAtTime(c.f,tt);o.frequency.linearRampToValueAtTime(c.f*.985,tt+.03);
  g2.gain.setValueAtTime(.0001,tt);g2.gain.linearRampToValueAtTime(c.v,tt+.008);g2.gain.linearRampToValueAtTime(c.v*.7,tt+.022);g2.gain.exponentialRampToValueAtTime(.0001,tt+.032);o.connect(g2).connect(dest);o.start(tt);o.stop(tt+.04)}
 AMB.chirps=(AMB.chirps||0)+1}
const lvl=(node,v,a)=>node.gain.setTargetAtTime(v,a.currentTime,.4);
function baseFire(){const c=BP.find(o=>o.t=='tentS'||o.t=='container'||o.t=='hq');return c?{x:c.x+c.w/2,y:c.y+c.h+24}:null}
function ambTick(dt){if(!SND||!S){if(AMB)lvl(AMB.rain.g,0,AMB.a);return}const A=ambInit();if(!A)return;const a=A.a,t=a.currentTime,p=S.p;
 const night=S.t>=1500||S.t<100,indoor=S.inb>=0,rain=rainNow(),fp=baseFire(),fd=fp?Math.hypot(fp.x-p.x,fp.y-p.y):1e9;
 AT.mode=(indoor?'실내':'실외')+' · '+(night?'밤':'낮')+(rain?' · 🌧 비':'')+(fd<500?' · 모닥불':'');
 A.muff.frequency.setTargetAtTime(indoor?700:20000,t,.3);lvl(A.rain.g,rain?(indoor?.05:.09):0,a);
 const N=A.next,now=performance.now(),bed=A.bed,go=f=>viaBus('amb',f);
 if(!night&&!rain&&now>N.bird){N.bird=now+1800+Math.random()*4000;const n=2+Math.random()*3|0,b0=2400+Math.random()*900;for(let i=0;i<n;i++){const s=a.createOscillator(),g2=a.createGain(),tt=t+i*.13;s.type='sine';s.frequency.setValueAtTime(b0,tt);s.frequency.exponentialRampToValueAtTime(b0*1.35,tt+.07);g2.gain.setValueAtTime(.0008,tt);g2.gain.linearRampToValueAtTime(indoor?.01:.035,tt+.01);g2.gain.exponentialRampToValueAtTime(.0008,tt+.09);s.connect(g2).connect(bed);s.start(tt);s.stop(tt+.1)}}
 /* crickets: night, not raining; they fall silent while a zombie is within 220 px and start again a few seconds later */
 if(Z.some(z=>z.hp>0&&Math.hypot(z.x-p.x,z.y-p.y)<220))A.quiet=now+4000;
 if(night&&!rain&&now>A.quiet)for(const c of A.crk){if(now>c.next){if(c.next&&Math.random()>.25)chirp(A,c,t+Math.random()*.05);c.next=now+(c.gap+Math.random()*.4)*1000}}
 if(indoor&&now>N.drip){N.drip=now+1500+Math.random()*3500;go(()=>tone(a,t,{f0:1500+Math.random()*600,f1:700,d:.08,v:.06}))}
 if(fd<500&&now>N.crack){N.crack=now+50+Math.random()*200;const k=Math.pow(1-fd/500,1.5);go(()=>nz(a,t,{f:1800+Math.random()*2200,q:4,v:.22*k,d:.03}))}
 if(rain&&now>N.drop){N.drop=now+50+Math.random()*120;go(()=>nz(a,t,{f:3000+Math.random()*3000,q:6,v:.035,d:.02}))}}
/* ================= hooks + visuals ================= */
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!S)return;
  if(S.wx&&S.wx.rain&&S.wx.until!=null&&S.tt>=S.wx.until){S.wx.rain=false;msg('⛅ 비가 그쳤습니다')}
  if(S.day!==AT.day){if(AT.day!=null&&!rainNow()&&Math.random()<.3)setRain(true,600+Math.random()*1000);AT.day=S.day}
  stepTick();ambTick(dt);AT.ring=AT.ring.filter(r=>(r.t-=dt)>0);AT.run=isRun();
  if(rainNow()){const W=innerWidth,H=innerHeight;while(AT.drops.length<110)AT.drops.push({x:Math.random()*W,y:Math.random()*H,v:520+Math.random()*320});for(const d of AT.drops){d.y+=d.v*dt;d.x-=d.v*dt*.15;if(d.y>H){d.y=-10;d.x=Math.random()*(W+60)}}}else AT.drops.length=0;
  const st=$('atmo');if(st)st.innerHTML=(S.p.mv?(AT.run?'🏃 달리기 · 발소리 '+(rainNow()?112:160)+'px':'🤫 걷기 · 조용함'):'🧍 정지')+' <small>'+AT.mode+(rainNow()?' · 좀비 청각 -30%':'')+'</small>'}}
{const _dfx=drawGearFx;drawGearFx=function(){_dfx();for(const r of AT.ring){const k=1-r.t/.45;g.globalAlpha=(1-k)*.35;g.strokeStyle='#ffd36a';g.lineWidth=1.5;g.beginPath();g.ellipse(r.x,r.y,r.r*k,r.r*k*.55,0,0,7);g.stroke();g.globalAlpha=1}}}
{const _dr=draw;draw=function(){_dr();if(!rainNow())return;ctx.save();ctx.setTransform(1,0,0,1,0,0);const s=(typeof dpr!='undefined'?dpr:1),W=ctx.canvas.width,H=ctx.canvas.height;
  const v=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*.28,W/2,H/2,Math.max(W,H)*.62);v.addColorStop(0,'rgba(10,16,26,0)');v.addColorStop(1,'rgba(10,16,26,.55)');ctx.fillStyle=v;ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='rgba(190,210,240,.55)';ctx.lineWidth=1.2*s;ctx.beginPath();for(const d of AT.drops){ctx.moveTo(d.x*s,d.y*s);ctx.lineTo((d.x-3)*s,(d.y+15)*s)}ctx.stroke();ctx.restore()}}
document.body.insertAdjacentHTML('beforeend','<div id="atmo"></div>');
document.head.insertAdjacentHTML('beforeend',`<style>#atmo{position:fixed;left:50%;transform:translateX(-50%);top:calc(env(safe-area-inset-top,0px) + 118px);z-index:3;pointer-events:none;font-size:12px;padding:3px 10px;border-radius:99px;background:#000a;border:1px solid #ffffff22;white-space:nowrap}#atmo small{color:var(--mut);margin-left:4px}
#bm .mxr{display:grid;grid-template-columns:minmax(110px,auto) 1fr 44px 36px;gap:8px;align-items:center;padding:8px;border-radius:10px;background:#ffffff08;margin-top:6px;font-size:12.5px}#bm .mxr input[type=range]{width:100%;accent-color:#ffd36a}#bm .mxr b{text-align:right;font-size:12px}#bm .mxr button{padding:4px 0;width:36px;max-width:none}
#bm .mxon{grid-template-columns:minmax(110px,auto) auto 1fr}#bm .mxon input{width:20px;height:20px;accent-color:#5fbf6a}#bm .mxon b{text-align:left}</style>`);
