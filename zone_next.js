/* PROJECT LEGACY — sample: zones in cycles of three.
   Strength: zones 0 · 1 · 2 rise slowly, zone 3 is three times zone 0, zones 4 · 5 rise slowly again, zone 6 is three
   times zone 3 … (zombies and raiders).
   Buildings: zone 0 = start town · zones 1 · 4 · 7 = calm again (reset) · 2 · 5 · 8 = rising · 3 · 6 · 9 = peak:
   dangerous buildings and rare loot.
   Also: demolition level follows the danger stars, gun shop · bank · prison alarms at 50 %.
   Loaded after blds2_next.js. */
'use strict';
/* ---------- strength ---------- */
const ZCYC=zn=>Math.floor(Math.max(0,zn)/3),ZSTEP=zn=>Math.max(0,zn)%3,ZPEAK=zn=>zn>=3&&zn%3==0;
/* the curve asked for: 0 ×1 · 1 ×1.4 · 2 ×2.4 · 3 ×3 · 4 ×3.9 · 5 ×4.7 · 6 ×6, then forever: every 3rd zone = zone number,
   the two zones between = +0.9 · +1.7 (7 ×6.9 · 8 ×7.7 · 9 ×9 · 12 ×12 · 30 ×30 …) */
const ZCURVE=[1,1.4,2.4];
const zMulHp=zn=>{const z=Math.max(0,zn);if(z<3)return ZCURVE[z];const c=ZCYC(z);return 3*c+[0,.9,1.7][ZSTEP(z)]};
const zMulAtk=zn=>1+(zMulHp(zn)-1)*.35;   /* attack rises a third as fast: 1 · 1.14 · 1.49 · 1.7 · 2.02 · 2.3 · 2.75 … */
const zMulRaid=zn=>zMulHp(zn);
{const _zp=zProf;zProf=function(zn){const P=_zp(zn),z=Math.max(0,zn),m=zMulHp(z);P.hp=m;P.ehp=1+(m-1)*.5;P.bhp=1+.5*m;P.atk=zMulAtk(z);
  /* the peak zones bring the special and elite zombies forward */if(ZPEAK(z)){P.sp=Math.min(.45,P.sp+.1);P.el=Math.min(.3,P.el+.08)}return P}}
/* the zombie attack multiplier is read through zAtkMul in a few places (const) → patch where zombies are made */
{const _mk=mk;mk=function(x,y,o){const n0=Z.length,r=_mk.apply(this,arguments),z=Z.length>n0?Z[Z.length-1]:null;if(z&&z.zone!=null&&!z._za&&!z.raider){z.dmg*=zMulAtk(z.zone)/zAtkMul(z.zone);z._za=1}return r}}
{const _rs=rSpawn;rSpawn=function(x,y,zn,goal){const out=_rs.apply(this,arguments),m=zMulRaid(zn),d=zMulAtk(zn);for(const r of out){r.hp*=m;r.mhp*=m;r.dmg*=d}return out}}
/* zone banner / message: the new numbers */
{const _zb=zoneBanner;zoneBanner=function(z,up){_zb(z,up);const el=$('zoneb');if(!el||!up)return;const s=el.querySelector('small');if(s)s.innerHTML='좀비 체력 ×'+(+zMulHp(z).toFixed(2))+' · 공격 ×'+zMulAtk(z).toFixed(2)+(ZPEAK(z)?' · <b style="color:#ffd36a">위험 구역 · 희귀템</b>':ZSTEP(z)==1&&z>1?' · 잠잠한 구역':'')}}
{const _zc=infZoneCheck;infZoneCheck=function(q){const _m=msg;msg=function(t){if(typeof t=='string'&&/구역 진입/.test(t)){const z=+(t.match(/(\d+)구역/)||[0,0])[1];t='⚠ '+z+'구역 진입 · 좀비 체력 ×'+(+zMulHp(z).toFixed(2))+(ZPEAK(z)?' · 위험 구역 · 희귀템이 많아요':'')}return _m.apply(this,[t,...[].slice.call(arguments,1)])};try{return _zc.apply(this,arguments)}finally{msg=_m}}}
/* ---------- buildings: one weight table per kind of zone ---------- */
const ZTAB={
 near:{houses:5,apt:3,park:2,mart:1.2,hard:1,pharm:.6},
 start:{houses:5,apt:3,park:2,mart:1.2,hard:1,pharm:.8,ware:.8,school:1,church:.8,fire:.6,garage:.6,clinic:.4,bank:.3,mall:.3,park2:.4,subway:.4},
 calm:{houses:4,apt:2.5,park:1.8,mart:1,hard:1,pharm:.8,ware:1,school:1,church:.7,fire:.8,garage:.9,clinic:.7,bank:.5,mall:.7,park2:.7,subway:.7,police:.4,gunshop:.35,radio:.3,hosp:.3,mil:.1,lab:.1,prison:.05},
 rise:{houses:3.2,apt:2.5,park:1.5,mart:.8,hard:.8,pharm:.7,ware:1,school:.8,church:.6,fire:.8,garage:1,clinic:.8,bank:.7,mall:.8,park2:.8,subway:.8,police:.8,gunshop:.7,radio:.5,hosp:.6,mil:.4,lab:.3,prison:.3},
 peak:{houses:2.2,apt:2,park:1,mart:.6,hard:.6,pharm:.6,ware:.8,school:.6,church:.5,fire:.6,garage:.8,clinic:.8,bank:1,mall:.8,park2:.7,subway:.8,police:1.2,gunshop:1.1,radio:.8,hosp:.9,mil:.9,lab:.8,prison:.8}};
const ZTN={near:'거점 2블록 안',start:'시작 동네',calm:'잠잠 (리셋)',rise:'위험 증가',peak:'위험 · 희귀'};
const zType=(zn,d)=>d<=2?'near':zn<=0?'start':ZPEAK(zn)?'peak':ZSTEP(zn)==1?'calm':ZSTEP(zn)==2?'rise':'start';
const ZPAIR={hosp:'hospR',mil:'milR'};
const OLDK=kindAt;/* the rule before this sample (kept to compare) */
function zPick(gx,gy,noPair){const d=Math.max(Math.abs(gx),Math.abs(gy)),W=ZTAB[zType(zoneOf(gx,gy),d)];let tot=0;const ok=k=>!(ZPAIR[k]&&(noPair||(gx&1)));for(const k in W)if(ok(k))tot+=W[k];
 let t=bh(gx,gy,41)*tot;for(const k in W){if(!ok(k))continue;t-=W[k];if(t<=0)return k}return'houses'}
const ZKEEP=['base','lot','rbase'];
let ZG=0;/* the old chain asks kindAt about its neighbours: inside, answer with the old rule */
kindAt=function(gx,gy){if(ZG)return OLDK(gx,gy);ZG=1;try{return zKind(gx,gy)}finally{ZG=0}};
function zKind(gx,gy){const cur=OLDK(gx,gy);if(ZKEEP.includes(cur))return cur;
 if(gx&1){const L=OLDK(gx-1,gy);if(!ZKEEP.includes(L)&&!(gx-1==0&&gy==0)){const lk=zPick(gx-1,gy,false);if(ZPAIR[lk])return ZPAIR[lk]}return zPick(gx,gy,true)}
 const k=zPick(gx,gy,false);if(ZPAIR[k]){const R=OLDK(gx+1,gy);if(ZKEEP.includes(R)||(gx+1==0&&gy==0))return zPick(gx,gy,true)}return k}
/* ---------- rare loot in the peak zones (3 · 6 · 9 …) ---------- */
{const _sr=s3SearchRoll;s3SearchRoll=function(o,kind,tier,r){const pid=_sr.apply(this,arguments);if(typeof DUN!='undefined'&&DUN)return pid;let zn=0;try{zn=zoneOf(...gOf(o.x,o.y))}catch(e){}
  if(ZPEAK(zn)){const c=ZCYC(zn),hot=(TIER[kind]||1)>=3?2:1;if(Math.random()<(.18+.06*c)*hot)r[stoneFor(zn)]=(r[stoneFor(zn)]||0)+1;if(Math.random()<(.05+.02*c)*hot){const rn=c<=1?'orn1':c==2?'orn2':'orn3';r[rn]=(r[rn]||0)+1}
   if(Math.random()<.04*c*hot){const g=['enh3','enh2','tkn'][Math.random()*3|0];r[g]=(r[g]||0)+(g=='tkn'?10:1)}}return pid}}
/* ---------- demolition level = danger stars (tools go up to Lv3, so ★4 · ★5 stay Lv3 for now) ---------- */
for(const k in TIER)if(DLV[k]!=null||['pharm','gunshop','garage','bank','hosp','mall','park2','subway','prison','radio'].includes(k))DLV[k]=Math.min(3,TIER[k]||1);
/* ---------- alarms: gun shop · bank · prison 50 % ---------- */
Object.assign(ALR,{gunshop:.5,bank:.5,prison:.5});
/* the block chip at the top and the "next zone" warning showed the old numbers */
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);const el=$('zonec');if(!el||!S||!S.p)return;const zn=zoneOf(...gOf(S.p.x,S.p.y)),h=el.innerHTML.replace(/좀비 체력 ×[\d.]+/,'좀비 체력 ×'+(+zMulHp(zn).toFixed(2))+(ZPEAK(zn)?' · 위험 · 희귀':''));if(h!=el.innerHTML)el.innerHTML=h}}
{const _zr=zoneRaw;zoneRaw=function(h){const a=[].slice.call(arguments);if(typeof h=='string'){const m=h.match(/(\d+)구역/);if(m){const z=+m[1];a[0]=h.replace(/좀비 체력 ×[\d.]+/,'좀비 체력 ×'+(+zMulHp(z).toFixed(2))).replace(/공격 ×[\d.]+/,'공격 ×'+zMulAtk(z).toFixed(2))}}return _zr.apply(this,a)}}
