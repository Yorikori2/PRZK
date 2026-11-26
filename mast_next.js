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
const shdBlock=(id,M)=>SHD[id][3]+.02*mRank(M[id]|0);
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
