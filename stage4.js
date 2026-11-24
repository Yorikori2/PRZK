/* PROJECT LEGACY — stage 4: 66 fictional firearms (5 more waiting in G4_LATER), 11 new special zombies with their own behaviour, bestiary + gun catalogue,
   and the search warning (a zombie closing in while you search). Loaded after stage3.js / search.js; needs guns4.js + zombies.js.
   Page hooks: z.sm (speed), z.dmg (bite), zBite4(z) after a bite, zDraw4(z) for drawing. */
'use strict';
/* ================= guns ================= */
/* the 29 guns the game already had keep their ids (saves, loot tables, recipes stay valid) and take a new model, name and icon */
const GREMAP={pistol:'glock17',spistol:'p226',smg:'mp5',pump:'r870',dbarrel:'dbl',ar:'hk416',sniper:'m24',lmg:'m249',crossbow:'xbow',flamer:'flamer',revolver:'python',hpistol:'deagle',mpistol:'glock18',
 taser:'x26',flare:'flareg',nailgun:'nailg',ssmg:'mp5sd',pdw:'uzi',sawnoff:'sawn',autosg:'benelli',hunting:'r700',carbine:'m4a1',battle:'ak47',dmr:'svd',amr:'m82',minigun:'m134',gl:'m79',rpg:'rpg7',bow:'cbow'};
const G_OF={};for(const o in GREMAP)G_OF[GREMAP[o]]=o; // design id -> game id
const CALMAP={'762s':'762','762r':'762','50ae':'50','50bmg':'50'};
/* 나중에 추가: guns whose ammo would be used by that one gun only. Their data stays in guns4.js;
   take an id out of this list (and its calibre out of AMMO_LATER) to bring it into the game. */
/* ON/OFF switch for the 5 guns that use an ammo nobody else uses: set LATER_GUNS_ON to true (or run
   localStorage.setItem('pl_laterguns','1') in the browser and reload) to bring them and their ammo into the game */
const LATER_GUNS_ON=false||(()=>{try{return localStorage.getItem('pl_laterguns')=='1'}catch(e){return false}})();
const G4_LATER=LATER_GUNS_ON?[]:['m10','m500','mp7','ak74','awm'],AMMO_LATER=LATER_GUNS_ON?[]:['38','500','46','545','338'];
const NEWAMMO_ALL=[['45','.45 ACP','u',.02,'#5a4a3a','#d9a84a',[6,12]],['38','.38 스페셜','c',.015,'#6a5a4a','#c9ced3',[6,12]],['500','.500 매그넘','e',.05,'#3a3f45','#e0b050',[2,4]],
 ['57','5.7mm 탄','r',.01,'#3a3f45','#7fd0ff',[10,20]],['46','4.6mm 탄','r',.01,'#2a2f35','#9fe0b0',[10,20]],['545','5.45mm 탄','u',.015,'#4a5434','#c9a46a',[10,20]],['338','.338 매그넘','l',.06,'#2a2f35','#f0c84a',[2,4]]];
const NEWAMMO=NEWAMMO_ALL.filter(a=>!AMMO_LATER.includes(a[0]));
for(const[k,n,r,wt,c1,c2,am]of NEWAMMO){AMMO[k]=n;const id='a'+k;if(!I_BY[id]){const it=[id,n,'a',r,wt,'새 총기용 탄약'];ITEMS.push(it);I_BY[id]=it;I(id,()=>ammoBox(c1,c2))}AMN[id]=am}
const WHERE={경찰:'police',군부대:'mil',주택:'houses',교회:'church',연구소:'lab',철물점:'hard',소방서:'fire',학교:'school',은신처:'apt',주차장:'mart',사냥꾼:'houses',헬기:'mil',주유소:'mart',진료소:'clinic'};
const G4={};// game id -> design row
for(const row of GUNS){const[did,n,sub,rar,cal,org,s,desc,where,ic]=row;if(G4_LATER.includes(did))continue;const gid=G_OF[did]||did,old=W_BY[gid];
 const ammo=old&&old[2]=='g'?old[4].ammo:(CALMAP[cal]||cal),st={...s,cd:1/s.rps,ammo};delete st.rps;delete st.burst;
 if(old){old[1]=n;old[3]=rar;old[4]=Object.assign({},st,{nz:gid=='spistol'?1:st.nz});old[5]=desc;old[6]=where}
 else{const w=[gid,n,'g',rar,st,desc,where];WEAPONS.splice(WEAPONS.findIndex(x=>x[2]=='t'),0,w);W_BY[gid]=w;SUB[gid]=sub=='기관총'?'기관총':sub;
  if(sub=='권총')PISTOLS.add(gid);
  const ks=new Set();for(const k in WHERE)if(where.includes(k))ks.add(WHERE[k]);if(!ks.size)ks.add('mil');for(const k of ks){(WLOOT[k]=WLOOT[k]||[]).push(gid);const ai='a'+ammo;if(AMN[ai]){(AMLOOT[k]=AMLOOT[k]||[]).push(ai)}}}
 GINFO[gid]={org,sub,cal:CAL[cal]||cal};GSPEC[gid]=ic;G4[gid]=row;
 if(typeof GCLASS!='undefined'&&!GCLASS[gid]){const c=ic.t=='bullpup'?'rifle':ic.t=='ak'||ic.t=='sks'?(sub=='산탄총'?'shotgun':'rifle'):ic.t=='svd'||ic.t=='amr'?'sniper':SUBCLASS[sub];if(c&&(sub!='특수'||ic.t=='bow'||ic.t=='xbow')&&sub!='발사기')GCLASS[gid]=c}}
for(const id in ICN)delete ICN[id]; // re-render cached icons with the new models
const GUN_IDS=Object.keys(G4);
document.head.insertAdjacentHTML('beforeend','<style>.cell img,.wi,.slot img,.det>img,.qs img{object-fit:contain}</style>');
/* ================= zombies ================= */
const ZN={};for(const q of ZOMBIES)ZN[q[0]]=q;
const NEWZ=['crawler','spitter','bloater','stalker','dog','burner','shocker','sleeper','brute','brood','goliath'],BOSSZ=['brood','goliath'];
const S4={slow:0,kd:0,burn:0,proj:[],pud:[],gas:[],shake:0,warn:0,zapT:0,shockT:0};
function z4Init(z){const d=ZN[z.look][3];z.hp=z.mhp=d.hp*(typeof HM=='function'?HM():1);z.sm=z.look=='stalker'?1.3:d.spd/45;z.dmg=d.dmg;z.cd4=z.look=='stalker'?.5:1+Math.random()*2;if(z.look=='sleeper'){z.sleep=1;z.stun=99}}
{const _mk=mk;mk=function(x,y,o={}){_mk(x,y,o);const z=Z[Z.length-1];if(z&&NEWZ.includes(z.look))z4Init(z)}}
/* spawning: waves and dangerous buildings start to bring the new kinds */
{const _wl=waveLook;waveLook=function(n){const r=Math.random();if(n>=5&&r<.05)return'brute';if(n>=4&&r<.1)return['burner','shocker','stalker'][Math.random()*3|0];if(n>=3&&r<.16)return['spitter','bloater'][Math.random()*2|0];if(n>=2&&r<.24)return['dog','crawler'][Math.random()*2|0];return _wl(n)}}
{const _w=wave;wave=function(n){_w(n);if(n%5==0){const q=fr(420,620);if(q){mk(q[0],q[1],{w:1,look:n%10==0?'goliath':'brood'});msg((n%10==0?'👹 골리앗':'🪱 번식체')+'이(가) 웨이브와 함께 나타났습니다!')}}}}
const BZ={houses:['crawler','sleeper'],apt:['crawler','sleeper','dog'],mart:['bloater','crawler'],school:['stalker','sleeper'],clinic:['spitter','bloater'],police:['dog','shocker'],mil:['brute','dog','burner'],fire:['burner'],church:['stalker','sleeper'],lab:['spitter','shocker','bloater'],ware:['crawler','bloater'],hard:['burner','crawler']};
{const _st=start;start=function(d,load){const r=_st(d,load);if(!S)return r;S.bes=S.bes||{};S.gseen=S.gseen||{};
  for(const z of Z.slice()){if(!z.g)continue;const rf=W0.roofs.find(r=>z.x>r.x&&z.x<r.x+r.w&&z.y>r.y&&z.y<r.y+r.h),b=rf&&W0.b[rf.bi];const L=b&&BZ[b.kind];if(L&&Math.random()<.22){z.look=L[Math.random()*L.length|0];z4Init(z)}}
  if(typeof hud2=='function')hud2();return r}}
/* ---------- behaviour ---------- */
const am4=()=>typeof armMul=='function'?armMul(S.p):1;
function hurtP(n,why){const p=S.p;p.hp-=n*am4();blood(p.x,p.y,0,0,3);if(why)s4Msg(why)}
let S4MT=0;function s4Msg(t){if(performance.now()-S4MT>1500){S4MT=performance.now();msg(t)}}
function knock(fromX,fromY,dist){const p=S.p,d=Math.hypot(p.x-fromX,p.y-fromY)||1;mv(p,(p.x-fromX)/d*dist,(p.y-fromY)/d*dist,7,'p')}
function blowUp(z){if(z.ex)return;z.ex=1;const p=S.p,x=z.x,y=z.y;fx.push({k:'boom',x,y,r:70,l:.45,m:.45});S4.gas.push({x,y,r:62,t:4});noise(x,y,3);
 const d=Math.hypot(p.x-x,p.y-y);if(d<70&&seeZ(z,p))hurtP(40*(1-d/140),'💥 부머가 터졌습니다! 독가스를 피하세요');for(const q of Z)if(q!==z&&!q.ex&&Math.hypot(q.x-x,q.y-y)<70)q.hp-=40;z.hp=0}
function zBite4(z){const k=z.look;if(k=='crawler'){S4.slow=2;s4Msg('🦵 크롤러가 다리를 붙잡았습니다 · 이동 속도 절반')}if(k=='burner'){S4.burn=3;s4Msg('🔥 불이 옮겨 붙었습니다!')}
 if(k=='shocker'){S4.kd=Math.max(S4.kd,.8);S4.zapT=.3;s4Msg('⚡ 감전! 잠시 움직일 수 없습니다')}if(k=='brute')knock(z.x,z.y,26)}
{const _k=kill;kill=function(z){if(z.look=='bloater')blowUp(z);_k(z);if(!S)return;const b=S.bes=S.bes||{},e=b[z.look]=b[z.look]||{};if(!e.k&&ZN[z.look]&&z.look!='civ1')setTimeout(()=>msg('📖 도감: '+ZN[z.look][1]+' 첫 처치!'),600);e.k=(e.k||0)+1;e.s=1;if(ZN[z.look]&&(e.k==MST[0][0]||e.k==MST[1][0]))setTimeout(()=>msg('🏅 숙련 '+(e.k>=MST[1][0]?2:1)+'단계: '+ZN[z.look][1]+'에게 주는 피해 +'+Math.round(mstOf(z.look)*100)+'%'),900)}}
if(typeof XPK!='undefined')for(const q of ZOMBIES)XPK[q[0]]=q[3].xp;
{const _hz=hitZ;hitZ=function(q,dmg,dx,dy,n){if(q.look=='heavy'&&S3&&S3.ctx&&!S3.mel)dmg*=.7;if(q.look=='burner'&&S.fires&&!S3.ctx)dmg*=0;
  if(q.look=='shocker'&&S3&&S3.mel&&S4.shockT<=0){S4.shockT=.6;hurtP(5,'⚡ 감전 좀비를 맨손·근접으로 치면 감전됩니다');S4.zapT=.2}
  if(q.sleep){q.sleep=0;q.stun=0}return _hz(q,dmg,dx,dy,n)}}
{const _ga=gearAct;gearAct=function(){if(S4.kd>0)return;return _ga()}}
{const _sp=s3Spd;s3Spd=function(p){return _sp(p)*(S4.kd>0?0:S4.slow>0?.5:1)}}
function s4Upd(dt){const s=S,p=s.p,bes=s.bes=s.bes||{};S4.slow-=dt;S4.kd-=dt;S4.zapT-=dt;S4.shockT-=dt;S4.shake=Math.max(0,S4.shake-dt);
 if(S4.burn>0){S4.burn-=dt;p.hp-=5*dt}
 for(const z of Z){const L=z.look;if(!ZN[L])continue;const dx=p.x-z.x,dy=p.y-z.y,d=Math.hypot(dx,dy)||1;
  if(!(bes[L]&&bes[L].s)&&d<380&&seeZ(p,z)){bes[L]=bes[L]||{};bes[L].s=1;msg('📖 도감 등록: '+ZN[L][1]+' · 🧬 → 도감에서 약점 확인');if(typeof s3Xp=='function')s3Xp(20,'새 좀비')}
  if(z.hp<=0)continue;z.cd4=(z.cd4||0)-dt;
  if(L=='sleeper'&&z.sleep){z.stun=99;if(d<70){z.sleep=0;z.stun=0;z.cd=0;fx.push({k:'ring',x:z.x,y:z.y-14,l:.5});s4Msg('😱 잠복자가 벌떡 일어났습니다!')}continue}
  if(L=='spitter'&&d>60&&d<240&&z.cd4<=0&&seeZ(z,p)){z.cd4=3;S4.proj.push({x0:z.x,y0:z.y-22,x:p.x,y:p.y,t:0,T:d/260})}
  if(L=='bloater'&&d<30)blowUp(z);
  if(L=='stalker'){if(z.leap>0){z.leap-=dt;mv(z,z.lx*480*dt,z.ly*480*dt,7);if(Math.hypot(p.x-z.x,p.y-z.y)<24){z.leap=0;hurtP(12,'🐆 스토커가 덮쳤습니다! 넘어졌어요');S4.kd=1.5}}
   else if(d>28&&d<170&&z.cd4<=0&&seeZ(z,p)){z.leap=.35;z.lx=dx/d;z.ly=dy/d;z.cd4=4}}
  if(L=='brute'){if(z.ch>0){z.ch-=dt;mv(z,z.lx*360*dt,z.ly*360*dt,9);if(Math.hypot(p.x-z.x,p.y-z.y)<30){z.ch=0;hurtP(25,'🐂 브루트의 돌진! 튕겨 나갔습니다');knock(z.x,z.y,48);S4.kd=.6;S4.shake=.3}}
   else if(d>60&&d<220&&z.cd4<=0&&seeZ(z,p)){z.ch=.6;z.lx=dx/d;z.ly=dy/d;z.cd4=5;fx.push({k:'ring',x:z.x,y:z.y-20,l:.3})}}
  if(L=='brood'&&z.cd4<=0&&d<520){z.cd4=6;if(Z.filter(q=>q.look=='crawler').length<12)for(let i=0;i<2;i++){const a=Math.random()*6.28,x=z.x+Math.cos(a)*40,y=z.y+Math.sin(a)*30;if(!blocker(x,y,7))mk(x,y,{w:1,look:'crawler'})}fx.push({k:'ring',x:z.x,y:z.y-20,l:.4})}
  if(L=='goliath'&&d<100&&z.cd4<=0){z.cd4=4;S4.shake=.45;fx.push({k:'boom',x:z.x+dx/d*30,y:z.y+dy/d*20,r:95,l:.4,m:.4});if(d<95){hurtP(30*(1-d/160),'👹 골리앗의 내려찍기!');knock(z.x,z.y,40);S4.kd=.5}}}
 S4.proj=S4.proj.filter(q=>{q.t+=dt;if(q.t<q.T)return true;S4.pud.push({x:q.x,y:q.y,r:24,t:4});return false});
 S4.pud=S4.pud.filter(q=>{q.t-=dt;if(Math.hypot(p.x-q.x,p.y-q.y)<q.r){p.hp-=10*dt;if(q.t>3.8)s4Msg('🟢 산성 웅덩이! 빨리 벗어나세요')}return q.t>0});
 S4.gas=S4.gas.filter(q=>{q.t-=dt;if(Math.hypot(p.x-q.x,p.y-q.y)<q.r)p.hp-=6*dt;return q.t>0});
 /* gun catalogue: guns you have held */
 for(const id in p.inv)if(p.inv[id]>0&&G4[id]&&!s.gseen[id])gotGun(id)
 /* search warning (opinion): a zombie closing in while you search */
 S4.warn=0;if(typeof SRCH!='undefined'&&SRCH){let near=1e9;for(const z of Z)if(z.hp>0&&!z.sleep){const d=Math.hypot(z.x-p.x,z.y-p.y);if(d<near&&seeZ(p,z))near=d}
  if(near<200){S4.warn=near<110?2:1;if(!SRCH.warned){SRCH.warned=1;msg('⚠ 좀비가 다가옵니다! 수색을 계속할지 정하세요')}}}
 const a=$('act');if(a)a.classList.toggle('warn',S4.warn>0)}
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(S){s4Upd(dt);for(const e of S4.dn)e.t-=dt}}}
/* ---------- drawing ---------- */
const ZSZ={};for(const q of ZOMBIES)ZSZ[q[0]]=q[7];
function zDraw4(z){if(!NEWZ.includes(z.look))return false;const L=z.look,Sz=ZSZ[L]||48,fr=z.mv?(z.ph|0)%4:0,c=zs(L,fr,Sz),p=S.p,d=Math.hypot(p.x-z.x,p.y-z.y);
 shd(z.x-Sz*.22,z.y-1,Sz*.44,4,.3);g.save();if(L=='stalker'&&!(z.leap>0)&&d>150)g.globalAlpha=.22;
 if(z.sleep){g.translate(z.x,z.y-6);g.rotate(-Math.PI/2);g.globalAlpha=.9;g.drawImage(c,-Sz+8,-Sz/2)}
 else{if(z.dir=='l'){g.translate(z.x,0);g.scale(-1,1);g.drawImage(c,-Sz/2,z.y-Sz+5)}else g.drawImage(c,z.x-Sz/2,z.y-Sz+5)}
 g.restore();const t=performance.now()/120;
 if(L=='burner')for(let i=0;i<5;i++){const a=t+i*1.3;R(i%2?'#ff9a2e':'#ffd25a',z.x-8+((i*7)%16),z.y-30-((t*6+i*9)%18),2,3)}
 if(L=='shocker'&&Math.sin(t*3)>.3){g.strokeStyle='#9fe0ff';g.lineWidth=1;g.beginPath();g.moveTo(z.x-10,z.y-30);g.lineTo(z.x-4,z.y-24);g.lineTo(z.x-8,z.y-18);g.stroke()}
 if(L=='bloater'&&z.hp>0){g.globalAlpha=.25+.15*Math.sin(t);blob(z.x,z.y-20,16,14,'#9fc040');g.globalAlpha=1}
 if((BOSSZ.includes(L)||L=='brute')&&z.hp>0){const w=Sz*.7,k=Math.max(0,z.hp/z.mhp);R('#000c',z.x-w/2-1,z.y-Sz-2,w+2,5);R('#e0574f',z.x-w/2,z.y-Sz-1,w*k,3)}
 if(z.ch>0||z.leap>0){g.globalAlpha=.35;blob(z.x-z.lx*12,z.y-z.ly*8-10,10,6,'#ffffff');g.globalAlpha=1}
 return true}
{const _dfx=drawGearFx;drawGearFx=function(){_dfx();if(!S)return;const p=S.p,t=performance.now();
  S4.dn=S4.dn.filter(e=>e.t>0);g.save();g.textAlign='center';for(const e of S4.dn){const k=1-e.t/.9,y=e.y-k*26;g.globalAlpha=Math.min(1,e.t*2.2);g.font=(e.crit?'900 15px':'800 12px')+' system-ui,sans-serif';
   const tx=Math.round(e.v)+(e.crit?'!':'');g.lineWidth=3;g.strokeStyle='#000c';g.strokeText(tx,e.x,y);g.fillStyle=e.crit?'#ffd36a':e.v>=100?'#ff9a5a':'#ffffff';g.fillText(tx,e.x,y)}g.restore();g.globalAlpha=1;
  for(const q of S4.pud){g.globalAlpha=Math.min(.6,q.t/2);blob(q.x,q.y,q.r,q.r*.55,'#6fae2a');blob(q.x-3,q.y-1,q.r*.6,q.r*.3,'#9fe040');g.globalAlpha=1}
  for(const q of S4.gas){g.globalAlpha=Math.min(.35,q.t/6);blob(q.x,q.y-10,q.r,q.r*.7,'#9fc040');g.globalAlpha=1}
  for(const q of S4.proj){const k=q.t/q.T,x=q.x0+(q.x-q.x0)*k,y=q.y0+(q.y-q.y0)*k-Math.sin(k*Math.PI)*28;blob(x,y,3,3,'#9fe040')}
  if(S4.kd>0)for(let i=0;i<3;i++){const a=t/200+i*2.1;R('#ffd36a',p.x+Math.cos(a)*10-1,p.y-46+Math.sin(a)*3,3,3)}
  if(S4.burn>0)for(let i=0;i<4;i++)R(i%2?'#ff9a2e':'#ffd25a',p.x-6+i*4,p.y-24-((t/40+i*7)%14),2,3);
  if(S4.zapT>0){g.strokeStyle='#9fe0ff';g.beginPath();g.moveTo(p.x-8,p.y-34);g.lineTo(p.x,p.y-26);g.lineTo(p.x-4,p.y-18);g.lineTo(p.x+6,p.y-10);g.stroke()}
  if(typeof SRCH!='undefined'&&SRCH&&S4.warn){const o=SRCH.o,cx=o.x+o.w/2,y=o.y-20,w=52,on=Math.sin(t/(S4.warn>1?60:110))>0;if(on){g.strokeStyle='#ff4a3a';g.lineWidth=2;g.strokeRect(cx-w/2-3,y-3,w+6,12)}
   g.save();g.font='bold 11px system-ui,sans-serif';g.textAlign='center';g.fillStyle='#000a';g.fillText('⚠ 좀비 접근!',cx+1,y-17);g.fillStyle=on?'#ff6a5a':'#ffd36a';g.fillText('⚠ 좀비 접근!',cx,y-18);g.restore()}}}
/* screen shake for boss slams / brute charges */
{const _dr=draw;draw=function(){if(S4.shake>0){const k=S4.shake*14;ctx.save();ctx.translate((Math.random()-.5)*k,(Math.random()-.5)*k);_dr();ctx.restore()}else _dr()}}
/* boss bar */
document.body.insertAdjacentHTML('beforeend','<div id="bossbar" style="display:none"><b></b><div><i></i></div></div>');
/* top health bar: bosses within 700 px, otherwise the nearest elite (or wave boss) within 320 px */
const ELITEZ=['brute','heavy','stalker','shocker'];
function topFoe(){const p=S.p;let best=null,bd=1e9;for(const z of Z){if(z.hp<=0||z.sleep)continue;const d=Math.hypot(z.x-p.x,z.y-p.y),boss=BOSSZ.includes(z.look),el=ELITEZ.includes(z.look)||z.b;
  if(!(boss&&d<700)&&!(el&&d<320))continue;const sc=d-(boss?5000:0);if(sc<bd){bd=sc;best=z}}return best}
{const _h=hud2;hud2=function(){_h();if(!S)return;const b=topFoe(),el=$('bossbar');el.style.display=b?'':'none';
  if(b){const boss=BOSSZ.includes(b.look),q=ZN[b.look],cat=boss?'보스':'엘리트',nm=q?q[1]:'거대 좀비',ic=boss?(b.look=='goliath'?'👹':'🪱'):'⚠';
   el.classList.toggle('elite',!boss);el.querySelector('b').textContent=ic+' '+cat+' · '+nm+' · '+Math.ceil(b.hp)+' / '+Math.round(b.mhp);el.querySelector('i').style.width=Math.max(0,b.hp/b.mhp*100)+'%'}}}
/* ================= collection rewards ================= */
/* 도감 숙련: 10 kills of a kind = +5 % damage to that kind, 50 kills = +10 % */
const MST=[[10,.05],[50,.1]];
const mstOf=look=>{const e=S&&S.bes&&S.bes[look];const k=e&&e.k||0;return k>=MST[1][0]?MST[1][1]:k>=MST[0][0]?MST[0][1]:0};
{const _hz=hitZ;hitZ=function(q,dmg,dx,dy,n){if(S3&&S3.ctx&&ZN[q.look])dmg*=1+mstOf(q.look);return _hz(q,dmg,dx,dy,n)}}
/* 총기 수집: own every gun of a class once = that class reloads 15 % faster */
const GSUBS=['권총','기관단총','산탄총','소총','저격','기관총','발사기','특수'];
const subDone=sb=>!!S&&!!S.gseen&&GUN_IDS.every(i=>G4[i][2]!=sb||S.gseen[i]);
{const _w=s3W;s3W=function(id){const w=_w(id);if(w&&w!==W_BY[id]&&!w._c4){w._c4=1;const sb=G4[id]&&G4[id][2];if(sb&&subDone(sb))w[4].rlm=(w[4].rlm||1)*.85}return w}}
function gotGun(id){S.gseen[id]=1;const sb=G4[id][2];if(subDone(sb)){s3dirty();setTimeout(()=>msg('🗂 '+sb+' '+GUN_IDS.filter(i=>G4[i][2]==sb).length+'종 수집 완료! '+sb+' 재장전 -15%'),700)}}
/* ================= ghost clicks ================= */
/* sheets open on pointerdown; the click that follows the same tap must not press whatever just appeared under the finger */
{let opened=0;new MutationObserver(()=>{const b=$('bm');if(b.style.display=='block'&&!b.dataset.open){b.dataset.open=1;opened=performance.now()}else if(b.style.display!='block')delete b.dataset.open}).observe($('bm'),{attributes:true,attributeFilter:['style']});
 document.addEventListener('click',e=>{if(e.isTrusted&&performance.now()-opened<450&&e.target.closest('#bm')&&!e.target.closest('.sh button')){e.preventDefault();e.stopPropagation()}},true)}
/* ================= damage numbers ================= */
/* every hit shows the real damage dealt over the zombie (pellets of one shot add up); crits are bigger and yellow */
S4.dn=[];
{const _hz=hitZ;hitZ=function(q,dmg,dx,dy,n){const h0=q.hp;const r=_hz(q,dmg,dx,dy,n);const dealt=h0-q.hp;if(dealt>0.05&&S){const now=performance.now(),crit=dealt>dmg*1.6&&dmg>0,last=S4.dn.find(e=>e.q===q&&now-e.t0<90);
  if(last){last.v+=dealt;last.crit=last.crit||crit}else S4.dn.push({q,x:q.x+(Math.random()-.5)*10,y:q.y-34,v:dealt,t:.9,t0:now,crit})}return r}}
/* the weapon card shows the gun's current damage (stats, skills, traits and parts included) */
{const _wc=wcard;wcard=function(){_wc();if(!S)return;const p=S.p,id=actW(p),s=wdef(id)[4],el=$('wc');if(!el)return;const d=Math.round(s.d),rof=1/s.cd;
  el.insertAdjacentHTML('beforeend','<div class="wdm"><b>⚔ '+d+(s.pel?'×'+s.pel:'')+'</b><span>'+(rof>=1?rof.toFixed(1)+'발/s':(s.cd).toFixed(1)+'초/발')+' · 사거리 '+Math.round(s.r||0)+'</span></div>')}}
/* ================= bestiary + gun catalogue (tab in the 🧬 sheet) ================= */
let DEXT='z',DEXSEL=null;
const ZCV={};function zIcon(id,shadow){const k=id+(shadow?'s':'');if(!ZCV[k]){const q=ZN[id],c=zCanvas(id,0,q[7]);if(shadow){const x=c.getContext('2d');x.globalCompositeOperation='source-in';x.fillStyle='#46525c';x.fillRect(0,0,c.width,c.height)}ZCV[k]=c.toDataURL()}return ZCV[k]}
function dexView(){const s=S,b=s.bes||{};let h='<div class="flt"><span class="chip'+(DEXT=='z'?' on':'')+'" data-dx="z">🧟 좀비 도감 '+ZOMBIES.filter(q=>b[q[0]]&&b[q[0]].s).length+'/'+ZOMBIES.length+'</span><span class="chip'+(DEXT=='g'?' on':'')+'" data-dx="g">🔫 총기 도감 '+GUN_IDS.filter(i=>s.gseen[i]).length+'/'+GUN_IDS.length+'</span></div>';
 if(DEXT=='z'){h+='<div class="dz">'+ZOMBIES.map(q=>{const e=b[q[0]]||{},seen=e.s;return'<div class="dzc'+(seen?'':' un')+(DEXSEL==q[0]?' on':'')+'" data-zid="'+q[0]+'"><img src="'+zIcon(q[0],!seen)+'"><b>'+(seen?q[1]:'???')+'</b><small style="color:'+ZCAT[q[2]][1]+'">'+ZCAT[q[2]][0]+(e.k?' · 처치 '+e.k:'')+'</small>'+(mstOf(q[0])?'<i class="mb">🏅'+(e.k>=50?2:1)+'</i>':'')+'</div>'}).join('')+'</div>';
  const q=DEXSEL&&ZN[DEXSEL],e=q&&b[q[0]]||{};
  if(q)h+=e.s?'<div class="dzd"><img src="'+zIcon(q[0])+'"><div><h3>'+q[1]+' <span class="badge" style="color:'+ZCAT[q[2]][1]+';border-color:'+ZCAT[q[2]][1]+'">'+ZCAT[q[2]][0]+'</span></h3>'+
   ['체력:hp:1500','속도:spd:140','공격:dmg:40'].map(t=>{const[n,k,m]=t.split(':');return'<div class="zb"><span>'+n+'</span>'+bar2(q[3][k]/m*100,k=='hp'?'#e0574f':k=='spd'?'#4aa0e0':'#e0a030')+'<b>'+q[3][k]+'</b></div>'}).join('')+
   '<p><b>능력</b> '+q[4]+'</p><p><b>약점</b> '+q[5]+'</p><p><b>출현</b> '+q[6]+'</p><div class="mst4"><span>🏅 숙련 '+(e.k>=50?'2단계 (최고)':e.k>=10?'1단계':'없음')+' · 이 좀비에게 주는 피해 +'+Math.round(mstOf(q[0])*100)+'%</span>'+bar2(Math.min(100,(e.k||0)/(e.k>=10?50:10)*100),'#ffd36a')+'<small>'+(e.k>=50?'최고 단계 달성':'다음 단계까지 '+((e.k>=10?50:10)-(e.k||0))+'마리 · 10마리 +5% · 50마리 +10%')+'</small></div><p class="mut">처치 '+(e.k||0)+' · 경험치 '+q[3].xp+' · 위험도 '+'★'.repeat(q[3].th)+'</p></div></div>':'<div class="dzd un"><div><h3>???</h3><p class="mut">아직 만나지 못한 좀비예요. 눈으로 확인하면 능력과 약점이 기록돼요.</p><p><b>출현</b> '+q[6]+'</p></div></div>'}
 else{const subs=['권총','기관단총','산탄총','소총','저격','기관총','발사기','특수'];for(const sb of subs){const L=GUN_IDS.filter(i=>G4[i][2]==sb);const dn=subDone(sb);h+='<div class="s3h gsh'+(dn?' done':'')+'">'+sb+' '+L.filter(i=>s.gseen[i]).length+'/'+L.length+(dn?' · <b>✓ 수집 완료 · 재장전 -15%</b>':' · 모두 모으면 재장전 -15%')+'</div><div class="dg">'+L.map(i=>{const seen=s.gseen[i],r=RAR[G4[i][3]];return'<div class="dgc'+(seen?'':' un')+(DEXSEL==i?' on':'')+'" data-gid="'+i+'"><img src="'+icon(i)+'"><b style="color:'+(seen?r[1]:'#ffffff55')+'">'+(seen?W_BY[i][1]:'???')+'</b></div>'}).join('')+'</div>'}
  const i=DEXSEL&&G4[DEXSEL]?DEXSEL:null;if(i){const w=W_BY[i],st=w[4],r=RAR[w[3]],seen=s.gseen[i];
   h+='<div class="dzd gun'+(seen?'':' un')+'"><img src="'+icon(i)+'"><div><h3>'+(seen?w[1]:'???')+' <span class="badge" style="color:'+r[1]+';border-color:'+r[1]+'">'+r[0]+'</span></h3>'+
   (seen?'<p class="mut">'+GINFO[i].sub+' · '+NM2(AMMO_ITEM(st.ammo))+' · '+w[5]+'</p><div class="gs4">'+[['피해',Math.round(st.d)+(st.pel?'×'+st.pel:'')],['연사',(1/st.cd).toFixed(1)+'/s'],['사거리',st.r],['장탄',st.mag],['소음',st.nz+'/5'],['무게',st.wt+'kg']].concat(st.pierce?[['관통',st.pierce]]:[]).concat(st.aoe?[['폭발',st.aoe]]:[]).map(([a,v])=>'<div><span>'+a+'</span><b>'+v+'</b></div>').join('')+'</div>':'<p class="mut">아직 손에 넣지 못한 총이에요.</p>')+'<p><b>획득처</b> '+w[6]+'</p></div></div>'}}
 return h}
function bindDex(b){b.querySelectorAll('[data-dx]').forEach(c=>c.onclick=()=>{DEXT=c.dataset.dx;DEXSEL=null;openChar('dex')});
 b.querySelectorAll('[data-zid]').forEach(c=>c.onclick=()=>{DEXSEL=c.dataset.zid;openChar('dex')});b.querySelectorAll('[data-gid]').forEach(c=>c.onclick=()=>{DEXSEL=c.dataset.gid;openChar('dex')})}
{const _oc=openChar;openChar=function(tab){if(tab)CTAB=tab;if(CTAB!='dex'){_oc(tab);const f=$('bm').querySelector('.flt');if(f)f.insertAdjacentHTML('beforeend','<span class="chip" data-c="dex">📖 도감</span>'),f.lastChild.onclick=()=>openChar('dex');return}
  _oc('stat');const b=$('bm'),f=b.querySelector('.flt');f.querySelectorAll('.chip').forEach(c=>c.classList.remove('on'));f.insertAdjacentHTML('beforeend','<span class="chip on" data-c="dex">📖 도감</span>');
  let n=f.nextSibling;while(n&&!(n.classList&&n.classList.contains('s3t'))){const x=n.nextSibling;n.remove();n=x}f.insertAdjacentHTML('afterend',dexView());bindDex(b);CTAB='dex'}}
document.head.insertAdjacentHTML('beforeend',`<style>
#act.warn{animation:s4w .5s steps(2) infinite;box-shadow:0 0 0 3px #ff4a3a}@keyframes s4w{50%{box-shadow:0 0 0 3px #ff4a3a00}}#act.srch.warn{background-image:conic-gradient(#ff6a5acc var(--k),#ffffff14 0)}
#bossbar{position:fixed;left:50%;transform:translateX(-50%);top:calc(env(safe-area-inset-top,0px) + 140px);width:min(60vw,360px);z-index:4;pointer-events:none;text-align:center;font-size:12px;text-shadow:0 1px 2px #000}
#bossbar div{height:8px;border-radius:5px;background:#000a;border:1px solid #ffffff33;overflow:hidden;margin-top:2px}#bossbar i{display:block;height:100%;background:linear-gradient(90deg,#a8221c,#e0574f)}#bossbar.elite{width:min(46vw,260px)}#bossbar.elite i{background:linear-gradient(90deg,#6a3aa8,#b06ae0)}#bossbar.elite div{height:6px}
#bm .flt{flex-wrap:wrap}#bm .dzc{position:relative}#bm .dzc .mb{position:absolute;right:4px;top:3px;font-style:normal;font-size:10px}#bm .mst4{margin:6px 0;font-size:11.5px}#bm .mst4 small{display:block;color:var(--mut);font-size:10.5px}#bm .gsh.done{color:#9fe0a0}#bm .gsh b{color:#9fe0a0}#wc .wdm{grid-column:1/3;display:flex;justify-content:space-between;gap:6px;font-size:10.5px;color:var(--mut);margin-top:-1px}#wc .wdm b{color:#ffb070;font-size:11.5px}#bm .dz{display:grid;grid-template-columns:repeat(auto-fill,minmax(86px,1fr));gap:5px}#bm .dzc,#bm .dgc{padding:5px;border-radius:10px;border:1px solid #ffffff1a;background:#ffffff08;text-align:center;cursor:pointer}
#bm .dzc img{width:56px;height:56px;image-rendering:pixelated;display:block;margin:0 auto}#bm .dzc b,#bm .dgc b{display:block;font-size:11.5px}#bm .dzc small{font-size:10px}#bm .dzc.un img{opacity:.8}#bm .dzc.on,#bm .dgc.on{border-color:#ffd36a}
#bm .dg{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:4px}#bm .dgc img{width:100%;height:32px;object-fit:contain;image-rendering:pixelated}#bm .dgc.un img{filter:brightness(0) opacity(.35)}
#bm .dzd{display:grid;grid-template-columns:96px 1fr;gap:10px;margin-top:8px;padding:9px;border-radius:12px;background:#ffffff0a;border:1px solid #ffffff1f}#bm .dzd img{width:96px;height:96px;image-rendering:pixelated;object-fit:contain}
#bm .dzd.gun{grid-template-columns:120px 1fr}#bm .dzd.gun img{width:120px;height:60px}#bm .dzd.un{grid-template-columns:1fr}#bm .dzd.gun.un{grid-template-columns:120px 1fr}#bm .dzd.gun.un img{filter:brightness(0) opacity(.35)}
#bm .dzd h3{margin:0 0 4px;font-size:15px}#bm .dzd p{margin:4px 0;font-size:12px}#bm .dzd p b{color:#ffd36a;margin-right:4px}#bm .mut{color:var(--mut)}
#bm .zb{display:grid;grid-template-columns:34px 1fr 40px;gap:6px;align-items:center;font-size:11px}#bm .zb b{text-align:right}
#bm .gs4{display:grid;grid-template-columns:repeat(auto-fill,minmax(88px,1fr));gap:3px;margin:4px 0}#bm .gs4 div{display:flex;justify-content:space-between;padding:3px 6px;border-radius:6px;background:#ffffff08;font-size:11.5px}#bm .gs4 span{color:var(--mut)}
@media (max-width:420px){#bm .dzd{grid-template-columns:72px 1fr}#bm .dzd img{width:72px;height:72px}}
@media (prefers-reduced-motion:reduce){#act.warn{animation:none}}
</style>`);
