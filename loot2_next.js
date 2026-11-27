/* PROJECT LEGACY — leaner searching and heavier bags.
   Measured before (1,707 searches): 4.2 things a search · food 0.51 · water 0.44 · bandage 0.29 · fuel 0.36 · scrap 0.59 a search
   — one block of houses fed you for days, so food never mattered. Now every search is scaled per item (random rounding,
   so a "0.4" means 40 % of what used to drop), and bulky things weigh what they should.
   Weapons, armour, gear, parts, keys and quest items are not touched. Loaded last of the loot wrappers. */
'use strict';
const LMUL={food:.4,water:.4,bandage:.6,medkit:.7,pills:.7,meds:.7,coffee:.6,energy:.6,beans:.7,fuel:.35,scrap:.7,wood:.8,cloth:.8,elec:.85,steel:.85,enh1:.5,enh2:.6,tkn:.7,anail:.7,abolt:.8,aarrow:.8};
const LMUL_AMMO=.85;/* every kind of round */
function lScale(r){for(const id of Object.keys(r)){let m=LMUL[id];if(m==null&&!W_BY[id]&&catOf(id)=='a')m=LMUL_AMMO;if(m==null)continue;const v=(r[id]||0)*m,n=Math.floor(v)+(Math.random()<v-Math.floor(v)?1:0);if(n>0)r[id]=n;else delete r[id]}}
{const _sr=s3SearchRoll;s3SearchRoll=function(o,kind,tier,r){const pid=_sr.apply(this,arguments);try{lScale(r)}catch(e){}return pid}}
/* weights: what a thing really weighs (kg) */
const LWT={water:1,food:.5,medkit:.8,fuel:2,wood:1.5,steel:1,cloth:.3,coffee:.3,energy:.4,beans:.3};
for(const id in LWT)if(I_BY[id])I_BY[id][4]=LWT[id];
/* ---------- 1) the deeper the zone, the scarcer food and water, the richer ammo and rare things ---------- */
{const _sr=s3SearchRoll;s3SearchRoll=function(o,kind,tier,r){const pid=_sr.apply(this,arguments);try{if(typeof DUN!='undefined'&&DUN)return pid;const zn=Math.max(0,zoneOf(...gOf(o.x,o.y)));if(!zn)return pid;
  const lean=Math.max(.45,1-.07*zn),rich=Math.min(2,1+.08*zn);const sc=(id,m)=>{const v=(r[id]||0)*m,n=Math.floor(v)+(Math.random()<v-Math.floor(v)?1:0);if(n>0)r[id]=n;else delete r[id]};
  for(const id of Object.keys(r)){if(['food','water','meat','bread','coffee','energy','dwater'].includes(id))sc(id,lean);else if(!W_BY[id]&&(catOf(id)=='a'||/^enh|^rn_|^ao_|^orn|tkn/.test(id)))sc(id,rich)}}catch(e){}return pid}}
/* ---------- 2) fresh food that spoils · dirty water ---------- */
{const add=(id,nm,cat,rar,wt,ds,draw)=>{if(I_BY[id])return;const it=[id,nm,cat,rar,wt,ds];ITEMS.push(it);I_BY[id]=it;IC[id]=draw};
 add('meat','고기','c','u',.6,'허기 +50 · 신선 음식: 하루가 지날 때마다 35% 확률로 상해요',()=>{R('#1d1714',4,8,16,10);R('#c84a4a',5,9,14,8);R('#e86a6a',5,9,14,2);R('#f0e0d0',15,10,3,6);R('#a83a3a',8,13,4,2)});
 add('bread','빵','c','c',.3,'허기 +30 · 신선 음식: 하루가 지날 때마다 20% 확률로 상해요',()=>{R('#1d1714',3,9,18,9);R('#c88a3a',4,10,16,7);R('#e8b060',4,10,16,2);for(let x=7;x<18;x+=4)R('#a86a2a',x,11,2,4)});
 add('rotten','상한 음식','c','c',.4,'허기 +12 · 40% 확률로 식중독 (목마름 −15 · 체력 −8)',()=>{R('#1d1714',4,8,16,10);R('#6a7a3a',5,9,14,8);R('#8a9a4a',5,9,14,2);R('#3a4a1a',8,12,3,3);R('#3a4a1a',14,11,2,2);R('#c9d04a',16,6,2,2)});
 add('dwater','더러운 물','c','c',1,'갈증 +25 · 35% 확률로 배탈 (체력 −6) · 정수기로 거르면 깨끗한 물병',()=>{R('#1d1714',8,3,8,18);R('#6a6a4a',9,7,6,13);R('#8a8a5a',9,7,6,2);R('#c9ccd0',9,3,6,3);R('#4a4a2a',10,13,2,2)})}
if(typeof STK_ID!='undefined')Object.assign(STK_ID,{meat:10,bread:10,rotten:10,dwater:10});
const FRESH={meat:.35,bread:.2};
{const _u2=use2;use2=function(k){const p=S.p;if(!['meat','bread','rotten','dwater'].includes(k))return _u2.apply(this,arguments);if(!has(p,k))return msg(NM2(k)+' 없음');invTake(p,k,1);
  if(k=='meat'){p.food=Math.min(100,p.food+50);msg('🍖 고기 · 허기 +50')}else if(k=='bread'){p.food=Math.min(100,p.food+30);msg('🍞 빵 · 허기 +30')}
  else if(k=='rotten'){p.food=Math.min(100,p.food+12);if(Math.random()<.4){p.water=Math.max(0,p.water-15);p.hp=Math.max(1,p.hp-8);msg('🤢 식중독! 목마름 −15 · 체력 −8')}else msg('🤢 상한 음식 · 허기 +12 (운이 좋았어요)')}
  else{p.water=Math.min(100,p.water+25);if(Math.random()<.35){p.hp=Math.max(1,p.hp-6);msg('🤢 배탈! 체력 −6 · 정수기로 거르면 안전해요')}else msg('💧 더러운 물 · 갈증 +25')}if(typeof hud2=='function')hud2()}}
/* every morning fresh food may go off — in the bag, the base boxes, outposts and car trunks */
let FDAY=null;
function spoil(box){let n=0;for(const id in FRESH){const c=box[id]|0;if(!c)continue;let bad=0;for(let i=0;i<c;i++)if(Math.random()<FRESH[id])bad++;if(bad){box[id]=c-bad;if(!box[id])delete box[id];box.rotten=(box.rotten|0)+bad;n+=bad}}return n}
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!S||!S.p||!run)return;if(FDAY==null)FDAY=S.day;if(S.day<=FDAY)return;FDAY=S.day;let n=spoil(S.p.inv);if(S.base&&S.base.st)n+=spoil(S.base.st);for(const o of Object.values((S.inf&&S.inf.op)||{}))if(o&&o.st)n+=spoil(o.st);
  try{for(const v of[S.car,...((S.inf&&S.inf.vgar)||[])])if(v&&v.tr)n+=spoil(v.tr)}catch(e){}if(n)setTimeout(()=>msg('🤢 밤새 신선 음식 '+n+'개가 상했어요 · 통조림은 상하지 않아요'),2200)}}
/* where they turn up (after the lean scaling, so these are the real chances) */
{const _sr=s3SearchRoll;s3SearchRoll=function(o,kind,tier,r){const pid=_sr.apply(this,arguments);try{if(typeof DUN!='undefined'&&DUN)return pid;
  const F={houses:[.07,.08,.25],apt:[.07,.08,.25],mart:[.12,.14,.1],mall:[.1,.12,.1],school:[.03,.1,.2],church:[.02,.1,.2],hard:[0,.02,.15],ware:[.02,.03,.15],fire:[.03,.04,.2],police:[.02,.05,.15],clinic:[0,.02,.15],hosp:[.01,.03,.12]}[kind];
  if(F){if(Math.random()<F[0])r.meat=(r.meat|0)+1;if(Math.random()<F[1])r.bread=(r.bread|0)+1;if(Math.random()<F[2])r.dwater=(r.dwater|0)+1}}catch(e){}return pid}}
/* the rain barrel and the pond now collect dirty water */
if(typeof DPROD!='undefined'){DPROD.barrel='dwater';DPROD.pond='dwater';if(DECO.barrel)DECO.barrel[7]='매일 아침 더러운 물 1 (정수기로 거르기)';if(DECO.pond)DECO.pond[7]='물고기가 헤엄쳐요 · 매일 아침 더러운 물 1'}
/* ---------- 3) the water purifier: dirty water → clean bottles (a cloth filter cleans 3) ---------- */
if(typeof DECO!='undefined'&&!DECO.purifier){DECO.purifier=['💧','정수기',{elec:6,scrap:10,steel:2},0,24,30,true,'더러운 물 → 깨끗한 물병 · 천 1장으로 3병'];DLIST.push('purifier');
 dArt.purifier=(x,y,w,h)=>{const t=performance.now()/500,K='#1d1714';/* tank */R(K,x+2,y-14,w-4,h+12);R('#3a6a8a',x+3,y-13,w-6,h+10);R('#5a8aaa',x+3,y-13,w-6,2);/* water level */R('#7ab8e0',x+5,y-6,w-10,h-2);R('#a8d8f4',x+5,y-6,w-10,1);
  /* bubbles */for(let i=0;i<3;i++){const k=(t+i*.33)%1;R('#e8f4ff',x+7+i*4,y+h-6-Math.round(k*(h)),2,2)}/* filter box + tap */R(K,x+w-6,y+4,8,8);R('#c9ccd0',x+w-5,y+5,6,6);R('#e8c84a',x+w-4,y+7,4,2);R('#8a9096',x+w-2,y+12,3,2);R('#7ab8e0',x+w-1,y+14,1,2);R(K,x,y+h-2,w,2)};
 P('deco_purifier','정수기',null,o=>dArt.purifier(o.x,o.y,o.w,o.h,o),true)}
function purify(){const p=S.p,st=(S.base&&S.base.st)||{},have=k=>(p.inv[k]|0)+(st[k]|0);const dw=have('dwater');if(!dw)return msg('💧 더러운 물이 없어요 · 빗물 통 · 연못 · 수색에서 모여요');const n=Math.min(dw,have('cloth')*3);if(!n)return msg('💧 필터로 쓸 천이 필요해요 (천 1장 = 3병)');
 const take=(k,c)=>{const a=Math.min(p.inv[k]|0,c);if(a)invTake(p,k,a);if(c-a)st[k]-=c-a};take('dwater',n);take('cloth',Math.ceil(n/3));invAdd(p,'water',n);msg('💧 정수 완료 · 깨끗한 물병 +'+n+' (천 '+Math.ceil(n/3)+'장)')}
/* the purifier's own window gets the action (one line in the list, like every facility) */
if(typeof ia2Deco=='function'){const _id=ia2Deco;ia2Deco=function(o,t,acts){if(t=='purifier'){const st=S.base.st||{},n=(S.p.inv.dwater|0)+(st.dwater|0);acts=[{t:'💧 물 거르기 · 더러운 물 '+n+'개',f:purify,off:!n},...acts]}return _id.call(this,o,t,acts)}}
if(typeof IAW!='undefined')IAW.unshift([/물 거르기/,'정수']);
