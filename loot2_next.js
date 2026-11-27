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
