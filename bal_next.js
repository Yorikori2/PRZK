/* PROJECT LEGACY — balance pass (opinions 1, 2, 3, 4).
   1) Enhancement cap grows with the zones you reach: +10 → +12 (zone 6) → +15 (zone 9) → +18 (zone 12) … +3 every 3 zones.
      Levels past +10 use the new 초월 강화석 (first visit to zone 6, 9, 12 … gives 2; merchants in zone 6+ sell it).
   2) The first night wave is 30% bigger.
   3) Armour past the 75% cap is not wasted: what's left over cuts bleeding and knockdowns.
   4) Merchants sell ammo cheaper the further out you are (everything else still costs more).
   Loaded after armor_next.js. */
'use strict';
/* ---------- 1) enhancement cap by zone ---------- */
{const it=['enh4','초월 강화석','c','l',.2,'+11 이상 강화에 사용 · 6 · 9 · 12 … 구역 첫 진입 보급 · 6구역 이후 상인'];if(!I_BY.enh4){ITEMS.push(it);I_BY.enh4=it}
 IC.enh4=()=>{R('#1d2226',6,5,12,15);R('#ff8a3a',7,6,10,13);R('#ffd36a',9,8,6,9);R('#ffffffaa',8,7,3,3);R('#00000044',7,15,10,4);R('#fff',11,10,2,2)}}
const zMaxSeen=()=>{let m=0;const f=S&&S.inf&&S.inf.fz;if(f)for(const k in f)if(f[k])m=Math.max(m,+k);return m};
function enhCap(){const z=zMaxSeen();return z<6?10:12+3*Math.floor((z-6)/3)}
Object.defineProperty(ENH,'max',{get:enhCap,configurable:true});
{const R0=ENH.rate.slice(),C0=ENH.cost;ENH.rate=new Proxy(R0,{get:(t,k)=>{const n=+k;if(!isNaN(n)&&n>10)return Math.max(3,[18,15,12,10,8][n-11]??Math.max(3,8-(n-15)));return t[k]}});
 ENH.cost=lv=>lv<=10?C0(lv):{enh4:1,enh3:1,scrap:4+Math.floor((lv-10)/3)*2}}
const ENHCAP_MSG={};
{const _zc=infZoneCheck;infZoneCheck=function(quiet){const was=S&&S.inf&&S.inf.fz?Object.assign({},S.inf.fz):{};const c0=S&&S.inf?enhCap():10;_zc(quiet);if(!S||!S.inf||quiet)return;
  const z=ZLAST;if(z>=6&&z%3==0&&!was[z]&&S.inf.fz&&S.inf.fz[z]){invAdd(S.p,'enh4',2);const c1=enhCap();setTimeout(()=>msg('✨ '+z+'구역 첫 진입 · 강화 한도 +'+c0+' → +'+c1+' · 초월 강화석 ×2'),4600)}}}
/* merchants out past zone 6 also carry 초월 강화석 */
{const _ms=merSpawn;merSpawn=function(x,y,o){const n0=Z.length,r=_ms.apply(this,arguments);const zn=Math.max(0,zoneOf(...gOf(x,y)));for(const m of Z.slice(n0))if(m.npc=='mer'&&m.st){
  for(const k in m.st)if(catOf(k)=='a'){const base=MSTOCK.flat().find(q=>q[0]==k);if(base)m.st[k].pr=Math.max(1,Math.round(base[1]*ammoDisc(zn)))}
  if(zn>=6&&!m.st.enh4)m.st.enh4={pr:160,n:2,per:1}}return r}}
/* ---------- 4) ammo gets cheaper further out: -6% per zone, at most -50% ---------- */
const ammoDisc=zn=>Math.max(.5,1-.06*zn);
/* ---------- 2) the first night wave is 30% bigger ---------- */
{const _w=wave;wave=function(n){const z0=Z.length;_w(n);if(n!=1)return;const add=Math.round((Z.length-z0)*.3);for(let i=0;i<add;i++){const q=fr(420,620);if(q)mk(q[0],q[1],{w:1,look:Math.random()<.3?'runner':null})}if(add)msg('🧟 첫 웨이브 · 평소보다 '+add+'마리 더 몰려와요!')}}
/* ---------- 3) armour beyond the cap → less bleeding and shorter knockdowns ---------- */
const armOver=p=>Math.max(0,ARMCAP-armRaw(p));
const overCut=p=>Math.min(.6,armOver(p)*5);/* every 1%p past the cap = 5% less bleeding / knockdown, up to 60% */
let BLD0=0;
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(S&&S.p)BLD0=S.p.bleed}}
{const _zb=zBite4;zBite4=function(z){const p=S.p,b0=BLD0;_zb(z);if(!b0&&p.bleed&&Math.random()<overCut(p)){p.bleed=0;if(typeof s3Float=='function')s3Float(p.x,p.y-60,'🛡 출혈 막음','#9ad0f0')}BLD0=p.bleed}}
{const _k=kdMul;kdMul=function(p){return _k(p)*(1-overCut(p))}}
/* show it in the bag */
{const _ob=openBag;openBag=function(id){_ob(id);if(!S)return;const p=S.p,o=armOver(p);if(o<=0)return;const eq=$('bm').querySelector('.eq');if(!eq)return;const c=Math.round(overCut(p)*100);
  eq.insertAdjacentHTML('afterend','<div class="aover">🛡 받는 피해 -75% (최대) · 넘친 방어 '+(o*100).toFixed(1)+'%p → 출혈 -'+c+'% · 넘어짐 -'+c+'%</div>')}}
document.head.insertAdjacentHTML('beforeend','<style>#bm .aover{margin:4px 0 6px;font-size:11px;padding:4px 8px;border-radius:8px;background:#1e3a4e;color:#cfe8ff}</style>');
