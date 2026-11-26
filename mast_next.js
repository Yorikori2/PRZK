/* PROJECT LEGACY — sample: weapon mastery (you and your companions) and shields.
   Mastery: every weapon and tool has its own rank F · E · D · C · B · A · S. Using it raises it.
   Each rank aims better: guns · bows · melee hit more often (shots used to always hit — now F misses a fair share,
   S almost never; far shots miss more at low ranks), throws land closer to the target, demolition tools reach further.
   Shields: 합판 방패 (일반) · 진압 방패 (고급) · 강화 진압 방패 (희귀) · 방탄 방패 (영웅) · 티타늄 방패 (전설), the same grades
   as weapons. A shield takes part of every hit; its own mastery adds to it. While you hold a shield you can only use
   pistols (one hand). Loaded after ally_next.js. */
'use strict';
/* ---------- ranks ---------- */
const MRK=['F','E','D','C','B','A','S'],MXP=[0,40,120,280,550,950,1500],MRCOL=['#9aa3aa','#a8c4a0','#7fd07f','#5aa8ff','#b06ae0','#ff9a3a','#ffd36a'];
const mRank=xp=>{let r=0;for(let i=0;i<MXP.length;i++)if(xp>=MXP[i])r=i;return r};
const MAST=()=>{const pg=S.pg||(S.pg={});pg.mast=pg.mast||{};return pg.mast};
/* base hit chance at rank F by weapon class (rises to 97 % at S) */
const MBASE={pistol:.72,smg:.62,rifle:.68,shotgun:.8,sniper:.7,bow:.65,melee:.82};
const mClass=id=>{const w=W_BY[id];if(!w)return null;if(w[2]=='m')return DT&&DT[id]?'tool':'melee';if(w[2]=='t')return'throw';if(/^shd\d$/.test(id))return'shield';return GCLASS[id]||'rifle'};
function mHit(id,rank,d,rng){const c=mClass(id),b=MBASE[c]||(c=='melee'?.82:.7);let h=b+(.97-b)*rank/6;if(rng&&d>rng*.6)h-=.18*(1-rank/6)*Math.min(1,(d-rng*.6)/(rng*.4));return Math.max(.2,Math.min(.97,h))}
const MDESC=c=>c=='tool'?'철거 사거리 +3%씩':c=='throw'?'떨어지는 곳이 목표에 더 가까이':c=='shield'?'막는 피해 +2%씩':'명중률이 올라가요 (멀리 쏠 때 특히)';
/* gain */
function mGain(who,id,n){if(!id||id=='fist')return;const M=who=='p'?MAST():(who.mast=who.mast||{});const r0=mRank(M[id]|0);M[id]=(M[id]|0)+n;const r1=mRank(M[id]);
 if(r1>r0){const nm=NM2(id);if(who=='p'){mFloat(S.p.x,S.p.y-56,'🎖 '+nm+' 숙련도 '+MRK[r1],MRCOL[r1],2.2);msg('🎖 '+nm+' 숙련도 '+MRK[r0]+' → '+MRK[r1]+' · '+MDESC(mClass(id)));try{sfx((A,t)=>{[660,880,1175].forEach((f,i)=>tone(A,t+i*.08,{w:'triangle',f0:f,f1:f,d:.18,v:.1}))})}catch(e){}}
  else{const z=typeof aEnt=='function'&&aEnt(who);if(z)mFloat(z.x,z.y-60,'🎖 '+who.nm+' · '+nm+' '+MRK[r1],MRCOL[r1],2)}}}
/* floating texts (MISS, rank up) */
function mFloat(x,y,t,c,l){(S.mfx=S.mfx||[]).push({x,y,t,c,l:l||.7,L:l||.7})}
OVL.push((g2,sx,sy,k)=>{if(!S||!S.mfx)return;S.mfx=S.mfx.filter(f=>{f.l-=.016;if(f.l<=0)return false;const a=Math.min(1,f.l/f.L*1.6);g2.globalAlpha=a;g2.font='bold '+(f.t.length>6?12:11)+'px sans-serif';g2.textAlign='center';g2.lineWidth=3;g2.strokeStyle='#000c';const Y=sy(f.y)-(1-f.l/f.L)*18*k;g2.strokeText(f.t,sx(f.x),Y);g2.fillStyle=f.c;g2.fillText(f.t,sx(f.x),Y);g2.globalAlpha=1;return true})});
/* ---------- your shots and swings roll against your rank ---------- */
let MCTX=null;/* {who,id,x,y,rng} while one attack is being made */
{const _ga=gearAct;gearAct=function(){const p=S.p,id=actW(p),w=W_BY[id];MCTX=w&&w[2]!='t'&&!(DT&&DT[id])?{who:'p',id,x:p.x,y:p.y,rng:w[4].r||42}:null;try{return _ga.apply(this,arguments)}finally{MCTX=null}}}
{const _hz=hitZ;hitZ=function(q,dmg,dx,dy,n){const C=MCTX;if(C&&q&&!q.npc&&C.id!='flamer'&&!(W_BY[C.id]&&W_BY[C.id][4].aoe)){const M=C.who=='p'?MAST():(C.who.mast||{}),r=mRank(M[C.id]|0),d=Math.hypot(q.x-C.x,q.y-C.y);
  if(Math.random()>mHit(C.id,r,d,C.rng)){mFloat(q.x+(Math.random()-.5)*10,q.y-40,'MISS','#c9ccd0',.6);return}q.lastW=C.id;q.lastBy=C.who=='p'?'p':C.who.id;mGain(C.who,C.id,1)}return _hz.apply(this,arguments)}}
{const _k=kill;kill=function(z){const r=_k(z);if(z&&z.lastW){if(z.lastBy=='p')mGain('p',z.lastW,4);else if(typeof aById=='function'){const a=aById(z.lastBy);if(a)mGain(a,z.lastW,4)}}return r}}
/* throws: land off target at low ranks */
{const _t=throwIt;throwIt=function(p,id,s){const n0=(S.thr||[]).length;const r=_t.apply(this,arguments);const T=S.thr||[];if(T.length>n0){const t=T[T.length-1],rk=mRank(MAST()[id]|0),off=60*(1-rk/6),a=Math.random()*Math.PI*2,m=Math.random()*off;t.x+=Math.cos(a)*m;t.y+=Math.sin(a)*m;mGain('p',id,2)}return r}}
/* tools: reach grows with rank, xp from each demolition hit */
for(const id in DT){const T=DT[id],d=Object.getOwnPropertyDescriptor(T,'rng');if(!d)continue;const get=d.get||(()=>d.value);Object.defineProperty(T,'rng',{get:()=>get()*(1+.03*mRank(MAST&&S&&S.pg?(MAST()[id]|0):0)),enumerable:true,configurable:true})}
if(typeof dHitWith=='function'){const _dh=dHitWith;dHitWith=function(tool,z){mGain('p',tool.id,1);return _dh.apply(this,arguments)}}
/* ---------- shields ---------- */
const SHD={shd1:['합판 방패','c',2,.15,'#8a6a42'],shd2:['진압 방패','u',2.5,.22,'#3a4a5a'],shd3:['강화 진압 방패','r',3,.3,'#2a3a4a'],shd4:['방탄 방패','e',4,.38,'#1d2a3a'],shd5:['티타늄 방패','l',4.5,.45,'#8a9096']};
for(const id in SHD){const[n,rar,wt,bl]=SHD[id];if(!I_BY[id]){const it=[id,n,'e',rar,wt,'받는 피해 -'+Math.round(bl*100)+'% (방패 숙련도마다 +2%) · 드는 동안 권총만 쓸 수 있어요'];ITEMS.push(it);I_BY[id]=it}
 const c=SHD[id][4];IC[id]=()=>{R('#1d1714',5,2,14,20);R(c,6,3,12,18);R('#ffffff33',6,3,12,2);if(id!='shd1'){R('#9ad0f088',8,6,8,3)}R('#00000044',6,18,12,3);if(id=='shd5'){R('#c9ccd0',11,4,2,16)}}}
if(!SLOTS.some(s=>s[0]=='shd')){const i=SLOTS.findIndex(s=>s[0]=='bag');SLOTS.splice(i<0?SLOTS.length:i,0,['shd','방패']);SLOTN.shd='방패'}
{const _sf=slotFor;slotFor=function(id){return /^shd\d$/.test(id)?'shd':_sf(id)}}
const shdOn=p=>{const id=p&&p.eq&&p.eq.shd;return id&&SHD[id]&&has(p,id)?id:null};
let shdBlock=(id,M)=>SHD[id][3]+.02*mRank(M[id]|0);
{const _h=hurtP;hurtP=function(n,why){const p=S&&S.p,id=shdOn(p);if(id&&n>0){const b=shdBlock(id,MAST());n*=1-b;mGain('p',id,1);if(Math.random()<.3)mFloat(p.x+(p.fx||0)*12,p.y-30,'🛡','#9ad0f0',.4)}return _h.call(this,n,why)}}
const isPistol=id=>GCLASS[id]=='pistol';
/* holding a shield: pistols only */
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);const p=S&&S.p;if(!p||!run||!shdOn(p))return;const id=actW(p);if(isPistol(id))return;
  if(p.eq.sec&&has(p,p.eq.sec)&&isPistol(p.eq.sec)){p.as='sec'}else p.as='fist';if(typeof DEMO!='undefined'&&DEMO){try{demoMode(false)}catch(e){}}const t=performance.now();if(!S.shdMsg||t-S.shdMsg>4000){S.shdMsg=t;msg('🛡 방패를 든 동안은 권총만 쓸 수 있어요')}}}
/* draw the shield on you (and on a shield-bearer companion) */
function shdDraw(x,y,fx,fy,id,dir){const c=SHD[id]?SHD[id][4]:'#3a4a5a';let side=Math.abs(fx)>Math.abs(fy)?Math.sign(fx):0,up=fy<-.5;if(typeof dir=='string'){side=/r/.test(dir)?1:/l/.test(dir)?-1:0;up=dir[0]=='u'}if(up)return;const X=x+side*8+(side?0:-5),Y=y-26;
 R('#1d1714',X-6,Y-1,12,20);R(c,X-5,Y,10,18);R('#ffffff30',X-5,Y,10,2);if(id!='shd1')R('#9ad0f088',X-3,Y+3,6,3);R('#00000040',X-5,Y+15,10,3)}
{const _dc=drawChar;drawChar=function(look,x,y,dir,fr,wpn,scale){const r=_dc.apply(this,arguments);try{if(S&&S.p&&run&&(look=='player')&&Math.abs(x-S.p.x)<2&&Math.abs(y-S.p.y)<2){const id=shdOn(S.p);if(id)shdDraw(x,y,S.p.fx||0,S.p.fy||1,id,dir)}}catch(e){}return r}}
/* ---------- the mastery sheet ---------- */
function mastOpen(who){const b=$('bm'),p=S.p,a=who&&who!='p'?who:null,M=a?(a.mast||{}):MAST();b.dataset.m='mast';PAUSE=true;
 const ids=[...new Set([...Object.keys(M),...(a?[]:ownedW()),...Object.keys(SHD).filter(k=>has(p,k)),...Object.keys(DT||{}).filter(k=>has(p,k))])].filter(id=>W_BY[id]||SHD[id]);
 ids.sort((x,y)=>(M[y]|0)-(M[x]|0));
 const row=id=>{const xp=M[id]|0,r=mRank(xp),nx=MXP[r+1],c=mClass(id),hit=['tool','throw','shield'].includes(c)?'':' · 명중 '+Math.round(mHit(id,r)*100)+'%';
  return'<div class="mR"><img src="'+icon(id)+'"><div class="mN"><b>'+NM2(id)+'</b><small>'+({pistol:'권총',smg:'기관단총',rifle:'소총',shotgun:'산탄총',sniper:'저격총',bow:'활',melee:'근접',tool:'철거 도구',throw:'투척',shield:'방패'}[c]||'무기')+hit+(c=='shield'?' · 막기 '+Math.round(shdBlock(id,M)*100)+'%':'')+'</small><div class="mB"><i style="width:'+(nx?(xp-MXP[r])/(nx-MXP[r])*100:100)+'%;background:'+MRCOL[r]+'"></i></div></div><span class="mK" style="color:'+MRCOL[r]+';border-color:'+MRCOL[r]+'">'+MRK[r]+'</span></div>'};
 b.innerHTML='<div class="sh"><h2>🎖 무기 숙련도'+(a?' · '+a.nm:'')+'</h2><div class="wt">쓸수록 F → E → D → C → B → A → S · 랭크마다 조준이 좋아져요</div><button onclick="closeBase();PAUSE=false">✕</button></div>'+
  (ids.length?ids.map(row).join(''):'<div class="sub">아직 쓴 무기가 없어요</div>')+
  '<div class="sub" style="line-height:1.6;margin-top:6px">· 맞히면 +1 · 그 무기로 처치하면 +4 · 던지면 +2 · 철거로 부수면 +1 · 방패로 막으면 +1<br>· 총 · 활 · 근접: F랭크는 꽤 빗나가요 (멀수록 더) · S랭크는 거의 다 맞아요 (97%)<br>· 투척: 낮은 랭크는 목표에서 최대 60 떨어져 떨어져요 · 철거 도구: 랭크마다 사거리 +3% · 방패: 랭크마다 막는 피해 +2%<br>· 필요한 경험치: E 40 · D 120 · C 280 · B 550 · A 950 · S 1500</div>';
 b.style.display='block'}
document.head.insertAdjacentHTML('beforeend',`<style>#bm .mR{display:flex;align-items:center;gap:9px;padding:7px 9px;margin:5px 0;border-radius:10px;background:#ffffff0c}#bm .mR img{width:32px;height:32px;image-rendering:pixelated;background:#0006;border-radius:6px}#bm .mN{flex:1}#bm .mN small{display:block;color:var(--mut);font-size:11px}
#bm .mB{height:5px;border-radius:3px;background:#ffffff14;margin-top:3px;overflow:hidden}#bm .mB i{display:block;height:100%}#bm .mK{font:900 20px system-ui;width:34px;height:34px;display:flex;align-items:center;justify-content:center;border:2px solid;border-radius:9px}
#wc2 .sl .mk2{position:absolute;left:2px;top:1px;font:900 10px system-ui;text-shadow:0 1px 0 #000}</style>`);
/* rank letter on the weapon slots */
{const _gu=gearUpd;let T=0;gearUpd=function(dt){_gu(dt);T-=dt;if(T>0||!S||!S.p)return;T=.5;const M=MAST();document.querySelectorAll('#wc2 .sl[data-s]').forEach(el=>{const s=el.dataset.s,id=s=='dm'?null:S.p.eq[s];let m=el.querySelector('.mk2');if(!id||!W_BY[id]){if(m)m.remove();return}const r=mRank(M[id]|0);if(!m){el.insertAdjacentHTML('beforeend','<i class="mk2"></i>');m=el.querySelector('.mk2')}m.textContent=MRK[r];m.style.color=MRCOL[r]})}}
if(typeof IAW!='undefined')IAW.unshift([/숙련도/,'숙련도']);
/* a way in: the bag's weapon detail, and the companion sheet */
{const _ob=openBag;openBag=function(id){_ob(id);const ba=$('bm').querySelector('.det .ba');if(ba&&BSEL&&(W_BY[BSEL]||SHD[BSEL]))ba.insertAdjacentHTML('afterbegin','<button onclick="mastOpen()">🎖 숙련도 '+MRK[mRank(MAST()[BSEL]|0)]+'</button>')}}
/* ================= S-rank bonus: one special effect per kind of weapon ================= */
const SBON={pistol:['🎯','헤드샷','15% 확률로 피해 ×2.5'],smg:['🔁','탄 절약','20% 확률로 탄을 쓰지 않아요'],rifle:['➡','관통 +1','맞힌 좀비 뒤의 한 마리도 맞아요 (피해 60%)'],shotgun:['💥','강한 반동','피해 +15% · 더 멀리 밀쳐내요'],
 sniper:['💀','거물 사냥','정예 · 보스에게 피해 +60%'],bow:['🏹','화살 회수','40% 확률로 화살을 쓰지 않아요'],melee:['⚔','처형','맞고 체력이 15% 아래로 남으면 바로 쓰러뜨려요'],throw:['🎁','하나 더','30% 확률로 던진 게 줄지 않아요'],
 tool:['⚡','숙련 철거','자동 철거 간격 -25%'],shield:['🔰','완벽한 막기','25% 확률로 피해를 모두 막고 주변 좀비를 밀쳐내요']};
const isS=(M,id)=>mRank(M[id]|0)==6;
const ELITE=z=>!!(z.b||z.tboss||['heavy','stalker','shocker','brute','brood','goliath'].includes(z.look));
let SB_PIERCE=false;
{const _hz=hitZ;hitZ=function(q,dmg,dx,dy,n){const C=MCTX;if(C&&q&&!q.npc&&!SB_PIERCE){const M=C.who=='p'?MAST():(C.who.mast||{});if(isS(M,C.id)){const c=mClass(C.id);
   if(c=='pistol'&&Math.random()<.15){dmg*=2.5;mFloat(q.x,q.y-50,'HEADSHOT','#ff6a5a',.7)}
   if(c=='shotgun'){dmg*=1.15;const d=Math.hypot(q.x-C.x,q.y-C.y)||1;mv(q,(q.x-C.x)/d*12,(q.y-C.y)/d*12,7)}
   if(c=='sniper'&&ELITE(q))dmg*=1.6;
   if(c=='melee'){const r=_hz.apply(this,[q,dmg,dx,dy,n]);if(q.hp>0&&q.hp<q.mhp*.15&&!ELITE(q)){q.hp=0;mFloat(q.x,q.y-50,'처형','#ffd36a',.7)}return r}
   if(c=='rifle'){const r=_hz.apply(this,[q,dmg,dx,dy,n]);const ux=dx||((q.x-C.x)/(Math.hypot(q.x-C.x,q.y-C.y)||1)),uy=dy||((q.y-C.y)/(Math.hypot(q.x-C.x,q.y-C.y)||1));
    for(const t of Z){if(t===q||t.npc||!(t.hp>0))continue;const ex=t.x-q.x,ey=t.y-q.y,along=ex*ux+ey*uy,side=Math.abs(ex*uy-ey*ux);if(along>0&&along<120&&side<18){SB_PIERCE=true;try{_hz.call(this,t,dmg*.6,dx,dy,n)}finally{SB_PIERCE=false}fx.push({k:'tr',a:[q.x,q.y-14],b:[t.x,t.y-14],l:.06});break}}return r}}}
  return _hz.call(this,q,dmg,dx,dy,n)}}
/* smg · bow: the round may not be spent */
{const _ga=gearAct;gearAct=function(){const p=S.p,id=actW(p),m0=p.mag[id];const r=_ga.apply(this,arguments);const c=mClass(id);if((c=='smg'&&Math.random()<.2||c=='bow'&&Math.random()<.4)&&isS(MAST(),id)&&p.mag[id]==m0-1){p.mag[id]++;if(Math.random()<.3)mFloat(p.x,p.y-48,c=='bow'?'🏹 회수':'🔁 절약','#9ad0f0',.5)}return r}}
/* throws: one more */
{const _t=throwIt;throwIt=function(p,id,s){const n0=p.inv[id]|0;const r=_t.apply(this,arguments);if(isS(MAST(),id)&&(p.inv[id]|0)<n0&&Math.random()<.3){p.inv[id]=n0;if(p.eq.thr!=id&&has(p,id))p.eq.thr=id;mFloat(p.x,p.y-48,'🎁 하나 더','#9ad0f0',.6)}return r}}
/* tools: faster automatic demolition */
for(const id in DT){const T=DT[id],d=Object.getOwnPropertyDescriptor(T,'auto');if(!d)continue;const get=d.get||(()=>d.value);Object.defineProperty(T,'auto',{get:()=>{const v=get();return v&&S&&S.pg&&isS(MAST(),id)?v*.75:v},enumerable:true,configurable:true})}
/* ================= shield durability: blocks wear it down, repair at the workbench ================= */
const SHDHP={shd1:100,shd2:150,shd3:220,shd4:300,shd5:400};
const SHDST=()=>{const pg=S.pg||(S.pg={});pg.shdHp=pg.shdHp||{};return pg.shdHp};
const shdHp=id=>{const H=SHDST();if(H[id]==null)H[id]=SHDHP[id];return H[id]};
{const _sb=shdBlock;shdBlock=function(id,M){/* a broken shield blocks nothing; a worn one a bit less */if(M===MAST()){const h=shdHp(id),mx=SHDHP[id];if(h<=0)return 0;return _sb(id,M)*(h<mx*.25?.7:1)}return _sb(id,M)}}
/* the hurt wrapper above reads shdBlock; wear and the S-rank perfect block live here */
{const _h=hurtP;hurtP=function(n,why){const p=S&&S.p,id=shdOn(p);if(id&&n>0&&shdHp(id)>0){const M=MAST();if(isS(M,id)&&Math.random()<.25){mFloat(p.x,p.y-48,'🔰 완벽한 막기','#9ad0ff',.7);for(const z of Z)if(!z.npc&&z.hp>0&&Math.hypot(z.x-p.x,z.y-p.y)<60){const d=Math.hypot(z.x-p.x,z.y-p.y)||1;mv(z,(z.x-p.x)/d*30,(z.y-p.y)/d*30,7);z.stun=Math.max(z.stun||0,.6)}SHDST()[id]=Math.max(0,shdHp(id)-1);return}
  const before=shdHp(id);SHDST()[id]=Math.max(0,before-Math.max(1,Math.round(n*.25)));if(SHDST()[id]==0&&before>0){msg('💥 '+NM2(id)+'이(가) 부서졌어요! 작업대에서 고쳐야 다시 막아요');try{sfx((A,t)=>tone(A,t,{w:'sawtooth',f0:300,f1:60,d:.4,v:.12}))}catch(e){}}
  else if(SHDST()[id]<SHDHP[id]*.25&&before>=SHDHP[id]*.25)msg('⚠ '+NM2(id)+' 내구도가 25% 아래예요 · 막는 힘이 줄어요')}return _h.call(this,n,why)}}
const shdCost=id=>{const miss=SHDHP[id]-shdHp(id),c={scrap:Math.ceil(miss/10)};const tier=+id.slice(3);if(tier>=3)c.steel=Math.ceil(miss/60);if(tier>=5)c.elec=Math.ceil(miss/100);return c};
function shdRepair(id){const p=S.p,c=shdCost(id);for(const k in c)if((p.inv[k]|0)<c[k])return msg('🛠 재료가 모자라요 · '+Object.entries(c).map(([k,n])=>NM2(k)+' '+n).join(' · '));for(const k in c)p.inv[k]-=c[k];SHDST()[id]=SHDHP[id];msg('🛠 '+NM2(id)+' 수리 완료 · 내구 '+SHDHP[id]+'/'+SHDHP[id])}
{const _c=dmCtx;dmCtx=function(){const B=_c();try{if(!S||typeof DUN!='undefined'&&DUN||!S.base||!inBase(S.p.x,S.p.y))return B;const p=S.p,nb=BP.find(o=>o.t=='bench3'&&Math.hypot(o.x+o.w/2-p.x,o.y+o.h/2-p.y)<70);if(!nb)return B;
  for(const id in SHD){if(!has(p,id))continue;const h=shdHp(id);if(h>=SHDHP[id])continue;const c=shdCost(id);B.push({t:'🛠 방패 수리 · '+NM2(id)+' '+h+'/'+SHDHP[id]+' · '+Object.entries(c).map(([k,n])=>NM2(k)+' '+n).join(' · '),f:()=>shdRepair(id),big:h<=0})}}catch(e){}return B}}
if(typeof IAW!='undefined')IAW.unshift([/방패 수리/,'방패 수리']);
/* the shield looks cracked when worn, and a durability bar shows under the weapon card */
{const _sd=shdDraw;shdDraw=function(x,y,fx,fy,id,dir){_sd(x,y,fx,fy,id,dir);if(!S||!S.p||!shdOn(S.p)||Math.abs(x-S.p.x)>2)return;const h=shdHp(id),mx=SHDHP[id];if(h>=mx*.5)return;
  let side=/r/.test(dir||'')?1:/l/.test(dir||'')?-1:0;const X=x+side*8+(side?0:-5),Y=y-26;R('#1d1714',X-3,Y+4,1,6);R('#1d1714',X-2,Y+9,3,1);R('#1d1714',X+1,Y+9,1,5);if(h<=0){R('#1d1714',X+2,Y+2,1,8);R('#ff6a5a',X-5,Y+17,10,1)}}}
{const _gu=gearUpd;let T=0;gearUpd=function(dt){_gu(dt);T-=dt;if(T>0||!S||!S.p)return;T=.4;let el=$('shdHud');const id=shdOn(S.p);if(!id){if(el)el.remove();return}
  if(!el){document.body.insertAdjacentHTML('beforeend','<div id="shdHud"><img><span><b></b><i><u></u></i></span></div>');el=$('shdHud');el.querySelector('img').src=icon(id)}const h=shdHp(id),mx=SHDHP[id],f=h/mx;
  el.querySelector('b').textContent='🛡 '+h+'/'+mx+(h<=0?' 부서짐':'');const u=el.querySelector('u');u.style.width=(f*100)+'%';u.style.background=f>.5?'#5fe08a':f>.25?'#ffd36a':'#ff6a5a';el.classList.toggle('broken',h<=0)}}
document.head.insertAdjacentHTML('beforeend',`<style>#shdHud{position:fixed;left:12px;bottom:calc(env(safe-area-inset-bottom,0px) + 64px);z-index:5;display:flex;align-items:center;gap:6px;padding:4px 8px;border-radius:10px;background:#141a20d9;border:1px solid #ffffff22;font-size:11px;pointer-events:none}#shdHud img{width:20px;height:20px;image-rendering:pixelated}
#shdHud i{display:block;width:70px;height:5px;border-radius:3px;background:#ffffff18;overflow:hidden;margin-top:2px}#shdHud u{display:block;height:100%}#shdHud.broken{border-color:#ff6a5a;animation:shdB 1s infinite}@keyframes shdB{50%{background:#5a1414d9}}</style>`);
/* the mastery sheet shows each weapon's S-rank bonus (locked until S) and shield durability */
{const _mo=mastOpen;mastOpen=function(who){_mo(who);const a=who&&who!='p'?who:null,M=a?(a.mast||{}):MAST();document.querySelectorAll('#bm .mR').forEach(el=>{const img=el.querySelector('img');if(!img)return;const nm=el.querySelector('.mN b').textContent;
  const id=Object.keys(W_BY).concat(Object.keys(SHD)).find(k=>NM2(k)==nm);if(!id)return;const c=mClass(id),B=SBON[c];if(!B)return;const on=isS(M,id);
  el.querySelector('.mN').insertAdjacentHTML('beforeend','<div class="sbn'+(on?' on':'')+'">'+(on?'':'🔒 S랭크: ')+B[0]+' '+B[1]+' · '+B[2]+'</div>'+(SHD[id]&&!a?'<div class="sbn">내구 '+shdHp(id)+'/'+SHDHP[id]+(shdHp(id)<=0?' · 부서짐':'')+'</div>':''))});
  const sub=document.querySelector('#bm .sub:last-child');if(sub)sub.insertAdjacentHTML('beforeend','<br>· <b>S랭크 보너스</b>: 무기 종류마다 하나씩 (권총 헤드샷 · 기관단총 탄 절약 · 소총 관통 · 산탄총 강한 반동 · 저격총 거물 사냥 · 활 화살 회수 · 근접 처형 · 투척 하나 더 · 철거 숙련 철거 · 방패 완벽한 막기)<br>· <b>방패 내구도</b>: 막을 때마다 닳아요 · 25% 아래면 막는 힘 70% · 0이면 부서져서 못 막아요 · 거점 작업대에서 고철(희귀 이상 강철 · 전설 전자부품)로 수리')}}
document.head.insertAdjacentHTML('beforeend',`<style>#bm .sbn{font-size:10.5px;color:#8a9096;margin-top:2px}#bm .sbn.on{color:#ffd36a;font-weight:700}</style>`);
/* ================= the shield bearer's shield wears too, and is mended overnight at the base ================= */
function shdRatioAlly(a){const mx=SHDHP[a.shd];if(a.shdHp==null)a.shdHp=mx;return a.shdHp/mx}
function shdBlockAlly(a){const r=shdRatioAlly(a);if(r<=0)return 0;return shdBlock(a.shd,a.mast||{})*(r<.25?.7:1)}
function shdWearAlly(a,blocked){const mx=SHDHP[a.shd],b0=a.shdHp;a.shdHp=Math.max(0,a.shdHp-blocked*.5);if(b0>0&&a.shdHp<=0){msg('💥 '+a.nm+'의 '+NM2(a.shd)+'이(가) 부서졌어요 · 거점에서 하룻밤 쉬면 고쳐져요');if(typeof aSay=='function'){const z=aEnt(a);if(z){z.say='방패가… 부서졌어요!';z.sayT=3}}}
 else if(b0>=mx*.25&&a.shdHp<mx*.25){const z=typeof aEnt=='function'&&aEnt(a);if(z){z.say='방패가 많이 상했어요…';z.sayT=3}}}
/* cracks on a worn shield (yours or a companion's) */
function shdCrack(x,y,dir,ratio){if(ratio>=.5)return;const side=/r/.test(dir||'')?1:/l/.test(dir||'')?-1:0;if((dir||'')[0]=='u')return;const X=x+side*8+(side?0:-5),Y=y-26;R('#1d1714',X-3,Y+4,1,6);R('#1d1714',X-2,Y+9,3,1);R('#1d1714',X+1,Y+9,1,5);if(ratio<=0){R('#1d1714',X+2,Y+2,1,8);R('#ff6a5a',X-5,Y+17,10,1)}}
