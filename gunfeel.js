/* PROJECT LEGACY — gun personality: synthesized gun sounds (no audio files), one combat trait per gun, and feel
   (muzzle flash size, ejected casings, camera kick). Loaded after stage4.js. */
'use strict';
/* ================= traits ================= */
const GTR={burst:['3점사','3발씩 빠르게 끊어 쏩니다'],sil:['암살','눈치채지 못한 좀비에게 피해 +50%'],stag:['경직','맞은 좀비가 잠깐 멈칫합니다'],aim:['정조준','1.2초 쉬었다 쏜 첫 발 피해 +50%'],
 pierce:['관통 강화','관통 +1'],chain:['연속 명중','같은 좀비를 연속으로 맞히면 피해 +8%씩 (최대 +24%)'],close:['근접 사격','100px 안의 좀비에게 피해 +20%'],fast:['빠른 재장전','재장전 시간 -25%'],
 knock:['근거리 넉백','맞은 좀비를 뒤로 밀어냅니다'],supp:['제압 사격','맞은 좀비 이동 속도 -40% (1.2초)'],spin:['예열','계속 쏠수록 연사 속도가 올라갑니다 (40% → 100%)'],bull:['불펍','들고 있을 때 이동 속도 +5%'],
 arrow:['화살 회수','맞힌 화살의 절반을 돌려받습니다'],nail:['못 박기','맞은 좀비가 느려집니다 (1.5초)'],blast:['폭풍','폭발에 휘말린 좀비를 밀어냅니다'],fire:['화염','불길이 좀비를 태웁니다'],
 zap:['연쇄 기절','주변 좀비까지 기절시킵니다'],flare:['조명탄','맞은 곳을 밝히고 불태웁니다'],bolt:['조용한 한 방','소음 없이 묵직한 한 발 · 눈치채지 못한 좀비 피해 +50%']};
function gTrait(id){const r=typeof G4!='undefined'&&G4[id];if(!r)return null;const[did,,sub,,cal,,s,,,ic]=r,t=ic.t;
 if(id=='flamer')return'fire';if(id=='taser')return'zap';if(id=='flare')return'flare';if(id=='nailgun')return'nail';if(id=='crossbow')return'bolt';if(t=='bow')return'arrow';
 if(s.burst)return'burst';if(s.nz<=1)return'sil';if(s.aoe)return'blast';if(t=='minigun')return'spin';if(t=='bullpup'&&sub!='산탄총')return'bull';
 if(sub=='산탄총')return'knock';if(sub=='권총')return t=='revolver'||t=='deagle'||cal=='45'?'stag':'fast';if(sub=='기관단총')return'close';if(sub=='기관총')return'supp';
 if(sub=='저격')return t=='sniper'||t=='amr'?'aim':'pierce';if(sub=='소총')return t=='sks'||(s.rps<=5)?'pierce':'chain';return null}
const GT={};for(const id of GUN_IDS)GT[id]=gTrait(id);
/* ================= sound ================= */
let AC=null,OUT=null,NB=null,SND=true;try{SND=localStorage.getItem('pl_snd')!=='0'}catch(e){}
function acx(){if(!SND)return null;try{if(!AC){AC=new(window.AudioContext||window.webkitAudioContext)();const comp=AC.createDynamicsCompressor();OUT=AC.createGain();OUT.gain.value=.55;OUT.connect(comp);comp.connect(AC.destination);
  NB=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}if(AC.state=='suspended')AC.resume();return AC}catch(e){return null}}
addEventListener('pointerdown',()=>{if(SND)acx()},{capture:true,passive:true});
function nz(a,t,o){const s=a.createBufferSource();s.buffer=NB;const f=a.createBiquadFilter();f.type=o.type||'bandpass';f.frequency.value=o.f;f.Q.value=o.q||.8;const g2=a.createGain();g2.gain.setValueAtTime(o.v,t);g2.gain.exponentialRampToValueAtTime(.0008,t+o.d);s.connect(f).connect(g2).connect(OUT);s.start(t,Math.random()*.5);s.stop(t+o.d+.05)}
function tone(a,t,o){const s=a.createOscillator();s.type=o.w||'sine';s.frequency.setValueAtTime(o.f0,t);s.frequency.exponentialRampToValueAtTime(Math.max(20,o.f1),t+o.d);const g2=a.createGain();g2.gain.setValueAtTime(o.v,t);g2.gain.exponentialRampToValueAtTime(.0008,t+o.d);s.connect(g2).connect(OUT);s.start(t);s.stop(t+o.d+.03)}
const click=(a,t,f,v)=>tone(a,t,{w:'square',f0:f,f1:f*.7,d:.025,v:v||.12});
/* one profile per kind of gun; heavier guns sound lower */
function gProf(id){const r=G4[id];if(!r)return'rifle';const sub=r[2],t=r[9].t,s=r[6];if(s.nz<=1&&sub!='특수')return'sil';
 return{pistol:'pistol',revolver:'revolver',deagle:'revolver',p90:'smg',smg:sub=='산탄총'?'shotgun':'smg',shotgun:'shotgun',dbarrel:'shotgun',ak:sub=='산탄총'?'shotgun':'rifle',bullpup:sub=='산탄총'?'shotgun':'rifle',rifle:sub=='저격'?'dmr':'rifle',sks:'dmr',svd:'dmr',sniper:'sniper',amr:'amr',lmg:'lmg',minigun:'minigun',gl1:'gl',mgl:'gl',rpg:'rocket',law:'rocket',flamer:'flamer',xbow:'xbow',bow:'bow',taser:'taser',flare:'flare',nail:'nail'}[t]||'rifle'}
const GP={};for(const id of GUN_IDS)GP[id]=gProf(id);
let lastSnd=0;
function gunSound(id){const a=acx();if(!a)return;const now=a.currentTime,pr=GP[id],w=W_BY[id],dmg=w?w[4].d:30,lowr=Math.max(.7,Math.min(1.25,1+(30-dmg)/220)),j=.93+Math.random()*.14,t=now;
 const minGap={minigun:.06,flamer:.1,smg:.045,lmg:.05}[pr]||0;if(minGap&&now-lastSnd<minGap)return;lastSnd=now;const F=f=>f*lowr*j;
 switch(pr){
  case'pistol':nz(a,t,{f:F(1900),q:.9,v:.55,d:.11});tone(a,t,{f0:F(260),f1:70,d:.08,v:.5});break;
  case'revolver':nz(a,t,{f:F(1150),q:.6,v:.8,d:.26});tone(a,t,{f0:F(170),f1:45,d:.22,v:.75});nz(a,t+.09,{type:'lowpass',f:700,v:.18,d:.35});break;
  case'smg':nz(a,t,{f:F(2300),q:1,v:.38,d:.07});tone(a,t,{f0:F(300),f1:90,d:.05,v:.35});break;
  case'shotgun':nz(a,t,{f:F(850),q:.5,v:.9,d:.32});tone(a,t,{f0:F(140),f1:38,d:.26,v:.85});if(w&&w[4].cd>=.5){click(a,t+.34,700,.14);click(a,t+.46,520,.16)}break;
  case'rifle':nz(a,t,{f:F(1650),q:.8,v:.6,d:.15});tone(a,t,{f0:F(210),f1:60,d:.12,v:.55});nz(a,t+.07,{type:'lowpass',f:900,v:.12,d:.22});break;
  case'dmr':nz(a,t,{f:F(1400),q:.7,v:.75,d:.22});tone(a,t,{f0:F(180),f1:50,d:.17,v:.65});nz(a,t+.1,{type:'lowpass',f:800,v:.16,d:.4});break;
  case'sniper':case'amr':nz(a,t,{f:F(pr=='amr'?800:1100),q:.6,v:.95,d:.36});tone(a,t,{f0:F(pr=='amr'?120:150),f1:30,d:.34,v:.9});nz(a,t+.14,{type:'lowpass',f:600,v:.22,d:.7});
   if(pr=='sniper'){click(a,t+.55,900,.13);click(a,t+.7,620,.13)}break;
  case'lmg':nz(a,t,{f:F(1500),q:.8,v:.55,d:.12});tone(a,t,{f0:F(200),f1:60,d:.1,v:.5});break;
  case'minigun':nz(a,t,{f:F(2600),q:1.2,v:.32,d:.05});break;
  case'sil':nz(a,t,{type:'lowpass',f:F(900),q:.7,v:.45,d:.08});click(a,t+.01,1400,.08);break;
  case'gl':tone(a,t,{f0:220,f1:70,d:.18,v:.75});nz(a,t,{type:'lowpass',f:500,v:.3,d:.12});break;
  case'rocket':nz(a,t,{type:'lowpass',f:700,q:.5,v:.6,d:.55});tone(a,t,{f0:90,f1:40,d:.3,v:.6});break;
  case'flamer':nz(a,t,{type:'lowpass',f:650,q:.4,v:.22,d:.14});break;
  case'xbow':tone(a,t,{f0:160,f1:60,d:.1,v:.5});click(a,t,1800,.1);break;
  case'bow':tone(a,t,{w:'triangle',f0:190,f1:120,d:.16,v:.35});nz(a,t,{f:3200,q:2,v:.12,d:.05});break;
  case'taser':nz(a,t,{f:5200,q:5,v:.25,d:.3});tone(a,t,{w:'square',f0:60,f1:55,d:.3,v:.06});break;
  case'flare':nz(a,t,{f:900,q:.6,v:.4,d:.1});nz(a,t+.05,{type:'highpass',f:2500,v:.1,d:.8});break;
  case'nail':nz(a,t,{f:3600,q:3,v:.3,d:.04});tone(a,t,{f0:320,f1:200,d:.03,v:.3});break}}
function reloadSound(id,end){const a=acx();if(!a)return;const t=a.currentTime,pr=GP[id];if(pr=='bow'||pr=='xbow'){tone(a,t,{w:'triangle',f0:end?260:140,f1:end?300:120,d:.1,v:.18});return}
 if(pr=='revolver'){for(let i=0;i<3;i++)click(a,t+i*.08,1500,.08);return}if(end){click(a,t,900,.16);click(a,t+.07,1300,.12)}else{click(a,t,600,.14);nz(a,t+.03,{f:2000,q:2,v:.08,d:.05})}}
function emptySound(){const a=acx();if(a)click(a,a.currentTime,2200,.1)}
/* ================= feel: flash, casings, kick ================= */
const S5={fx:[],cas:[],lastShot:0,aimReady:false,chainQ:null,chainN:0,spin:0,spinT:0,bc:0,emptyT:0,arrows:0};
const FLASH={pistol:1,revolver:1.5,smg:.8,shotgun:2,rifle:1.2,dmr:1.5,sniper:2.1,amr:2.6,lmg:1.3,minigun:1,sil:.35,gl:1.4,rocket:2,flamer:0,xbow:0,bow:0,taser:.4,flare:1.2,nail:.3};
const KICK={shotgun:.07,dmr:.06,sniper:.12,amr:.2,revolver:.06,gl:.1,rocket:.22};
const NOCASE=['revolver','bow','xbow','gl','rocket','flamer','taser','flare','nail'];
function shotFeel(id){const p=S.p,pr=GP[id],k=FLASH[pr]??1,mx=p.x+p.fx*16,my=p.y-17;if(k>0)S5.fx.push({x:mx,y:my,k,t:.08,fx:p.fx,fy:p.fy});
 if(pr=='shotgun'||pr=='sniper'||pr=='amr'||pr=='rocket')S5.fx.push({x:mx+p.fx*6,y:my,k:k*.8,t:.6,smoke:1});
 if(!NOCASE.includes(pr)){const s=p.fx>=0?-1:1;S5.cas.push({x:p.x+s*4,y:p.y-16,vx:s*(40+Math.random()*30),vy:-60-Math.random()*30,t:.5,big:pr=='shotgun'?1:0})}
 if(KICK[pr]&&typeof S4!='undefined')S4.shake=Math.max(S4.shake,KICK[pr])}
/* ================= hooks ================= */
{const _ga=gearAct;gearAct=function(){const p=S.p,id=actW(p),w=wdef(id),s=w[4],isG=w[2]=='g'&&GT[id]!==undefined,m0=p.mag[id],now=performance.now(),ac0=p.ac,rl0=p.rl;
  S5.aimReady=isG&&GT[id]=='aim'&&now-S5.lastShot>1200;S5.cur=id;
  if(isG&&(m0|0)<=0&&p.ac<=0&&now-S5.emptyT>400){S5.emptyT=now;emptySound()}
  _ga();S5.cur=null;
  if(!isG)return;if(p.rl>0&&!(rl0>0))reloadSound(id,false);if(!(m0!=null&&(p.mag[id]|0)<m0))return;
  S5.lastShot=now;gunSound(id);shotFeel(id);const tr=GT[id];
  if(tr=='burst'){S5.bc++;p.ac=S5.bc%3?.065:s.cd*2.6}
  if(tr=='spin'){S5.spin=Math.min(1,S5.spin+.06);S5.spinT=.25;p.ac=s.cd/(.4+.6*S5.spin)}}}
{const _rt=reloadTick;reloadTick=function(p,dt){const was=p.rl>0,id=p.rlw;_rt(p,dt);if(was&&!(p.rl>0)&&id&&GT[id]!==undefined)reloadSound(id,true)}}
{const _hz=hitZ;hitZ=function(q,dmg,dx,dy,n){const id=S3&&S3.ctx,tr=id&&GT[id];if(tr&&S){const p=S.p,d=Math.hypot(q.x-p.x,q.y-p.y);
   if((tr=='sil'||tr=='bolt')&&!q.aw){dmg*=1.5;S5.fx.push({x:q.x,y:q.y-46,t:.8,txt:'암살!'})}
   if(tr=='aim'&&S5.aimReady){dmg*=1.5;S5.fx.push({x:q.x,y:q.y-46,t:.8,txt:'정조준!'})}
   if(tr=='chain'){if(S5.chainQ===q)S5.chainN=Math.min(3,S5.chainN+1);else{S5.chainQ=q;S5.chainN=0}dmg*=1+.08*S5.chainN}
   if(tr=='close'&&d<100)dmg*=1.2}
  q.aw=1;const r=_hz(q,dmg,dx,dy,n);
  if(tr&&S&&q.hp>0){if(Math.abs(dx||0)+Math.abs(dy||0)<.01){const p=S.p,d=Math.hypot(q.x-p.x,q.y-p.y)||1;dx=(q.x-p.x)/d;dy=(q.y-p.y)/d}if(tr=='stag')q.stun=Math.max(q.stun||0,.35);if(tr=='knock'&&Math.hypot(q.x-S.p.x,q.y-S.p.y)<120)mv(q,(dx||0)*14,(dy||0)*14,7);if(tr=='supp')q.slow5=1.2;if(tr=='nail')q.slow5=1.5;if(tr=='blast')mv(q,(dx||0)*22,(dy||0)*22,7)}
  if(tr=='arrow'&&Math.random()<.5){invAdd(S.p,'aarrow',1);S5.arrows++}return r}}
{const _w=s3W;s3W=function(id){const w=_w(id);if(w&&w!==W_BY[id]&&!w._g5){w._g5=1;const tr=GT[id];if(tr=='fast')w[4].rlm=(w[4].rlm||1)*.75;if(tr=='pierce')w[4].pierce=(w[4].pierce||1)+1}return w}}
{const _sp=s3Spd;s3Spd=function(p){const id=S&&S.p?actW(S.p):null;return _sp(p)*(id&&GT[id]=='bull'?1.05:1)}}
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!S)return;const p=S.p,nt=S.t>=1500||S.t<100;S5.spinT-=dt;if(S5.spinT<=0)S5.spin=Math.max(0,S5.spin-dt*1.5);
  for(const z of Z){if(z.slow5>0){z.slow5-=dt;if(z.sm0==null)z.sm0=z.sm||1;z.sm=z.sm0*.6}else if(z.sm0!=null){z.sm=z.sm0;delete z.sm0}
   if(!z.aw&&(z.al>0||z.w||(!z.stun&&Math.hypot(z.x-p.x,z.y-p.y)<(nt?420:280)&&seeZ(p,z))))z.aw=1}
  S5.fx=S5.fx.filter(f=>(f.t-=dt)>0);S5.cas=S5.cas.filter(c=>{c.t-=dt;c.x+=c.vx*dt;c.y+=c.vy*dt;c.vy+=420*dt;return c.t>0})}}
{const _dfx=drawGearFx;drawGearFx=function(){_dfx();if(!S)return;
  for(const f of S5.fx){if(f.txt){g.save();g.font='900 12px system-ui,sans-serif';g.textAlign='center';g.globalAlpha=Math.min(1,f.t*2);g.lineWidth=3;g.strokeStyle='#000c';const y=f.y-(1-f.t/.8)*14;g.strokeText(f.txt,f.x,y);g.fillStyle='#ff9a5a';g.fillText(f.txt,f.x,y);g.restore();continue}
   if(f.smoke){g.globalAlpha=Math.min(.35,f.t*.6);blob(f.x,f.y-(.6-f.t)*20,5+(.6-f.t)*14,4+(.6-f.t)*10,'#c9ced3');g.globalAlpha=1;continue}
   const r=6*f.k;g.globalAlpha=.75;blob(f.x+f.fx*r*.6,f.y,r,r*.7,'#ffb52e');g.globalAlpha=1;blob(f.x+f.fx*r*.4,f.y,r*.45,r*.35,'#fff6c0')}
  for(const c of S5.cas){g.globalAlpha=Math.min(1,c.t*3);R(c.big?'#c43c32':'#d9b52a',c.x,c.y,c.big?3:2,c.big?2:1);g.globalAlpha=1}}}
/* trait on the weapon card and in the gun catalogue */
{const _wc=wcard;wcard=function(){_wc();if(!S)return;const id=actW(S.p),tr=GT[id];const el=$('wc');if(tr&&el&&GTR[tr])el.insertAdjacentHTML('beforeend','<div class="wtr">✦ '+GTR[tr][0]+' <span>'+GTR[tr][1]+'</span></div>')}}
{const _dv=dexView;dexView=function(){let h=_dv();if(DEXT=='g'&&DEXSEL&&GT[DEXSEL]&&S.gseen[DEXSEL]){const t=GTR[GT[DEXSEL]];h=h.replace('<p><b>획득처</b>','<p><b>특징</b>✦ '+t[0]+' · '+t[1]+'</p><p><b>획득처</b>')}return h}}
/* sound on/off */
$('sd').insertAdjacentHTML('beforeend','<button class="g rb" id="snd" title="효과음 켜기·끄기">'+(SND?'🔊':'🔇')+'</button>');
$('snd').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();SND=!SND;try{localStorage.setItem('pl_snd',SND?'1':'0')}catch(_){}$('snd').textContent=SND?'🔊':'🔇';if(SND){acx();gunSound('pistol')}msg(SND?'🔊 효과음 켜짐':'🔇 효과음 꺼짐')});
document.head.insertAdjacentHTML('beforeend','<style>#wc .wtr{grid-column:1/3;font-size:10.5px;color:#9fe0ff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#wc .wtr span{color:var(--mut)}@media (orientation:landscape) and (max-height:420px){#wc .wtr{display:none}}</style>');
