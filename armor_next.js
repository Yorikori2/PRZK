/* PROJECT LEGACY — player armour in four parts, always in the order 머리 → 몸통 → 다리 → 신발.
   Every part comes in tiers T1–T5 (T1–T2 craftable, T3+ found or dropped). Parts multiply; total reduction is capped at 75%.
   Extra effects: blast reduction (안전모 · 폭발물 방호복 · 특수부대 헬멧), move speed, extra carry, crawler grab, knockdown, footsteps.
   Loaded after persist_next.js. */
'use strict';
const APARTS=[['head','머리'],['body','몸통'],['legs','다리'],['feet','신발']];
/* id: [slot, tier, name, weight, effects] — dr damage, blast, mov, cap(kg), grab, kd (knockdown shorter; 1 = immune), step (footstep noise) */
const ARMX={
 band:['head',1,'두건',.2,{dr:.03}],hardhat:['head',2,'공사장 안전모',.8,{dr:.08,blast:.25}],helmet:['head',3,'전투 헬멧',1.2,{dr:.10}],
 visor:['head',4,'바이저 헬멧',1.6,{dr:.18}],spechelm:['head',5,'특수부대 헬멧',1.8,{dr:.22,blast:.15}],
 jacket:['body',1,'가죽 재킷',2,{dr:.08}],tirevest:['body',2,'타이어 흉갑',4,{dr:.20,mov:-.05}],vest:['body',3,'경찰 방탄조끼',3,{dr:.30}],
 armor:['body',3,'제작 방탄복',4,{dr:.40}],milarmor:['body',4,'군용 방탄복',5,{dr:.55}],eod:['body',5,'폭발물 방호복',9,{dr:.60,blast:.70,mov:-.20}],
 jeans:['legs',1,'덧댄 청바지',1,{dr:.03,grab:.2}],kneepad:['legs',2,'무릎 보호대',.6,{dr:.06,kd:.3}],legguard:['legs',3,'진압용 다리 보호대',2,{dr:.10}],
 cpants:['legs',4,'전투 바지',1.5,{dr:.12,cap:3}],exo:['legs',5,'외골격 다리',4,{dr:.15,mov:.10,cap:10}],
 tboots:['feet',1,'테이프 감은 장화',1,{dr:.02,step:.10}],wboots:['feet',2,'작업화',1.2,{dr:.04,kd:.15}],tacboots:['feet',3,'전술 군화',1.2,{dr:.05,step:.30}],
 silboots:['feet',4,'소음 군화',1,{dr:.06,step:.50}],shockboots:['feet',5,'충격 흡수 부츠',1.5,{dr:.08,kd:1}]};
const ATIER_RAR=[null,'c','u','r','e','l'];
function armTxt(id){const e=ARMX[id][4],o=[];if(e.dr)o.push('받는 피해 -'+Math.round(e.dr*100)+'%');if(e.blast)o.push('폭발 피해 -'+Math.round(e.blast*100)+'%');if(e.mov)o.push('이동 '+(e.mov>0?'+':'')+Math.round(e.mov*100)+'%');
 if(e.cap)o.push('가방 +'+e.cap+'kg');if(e.grab)o.push('크롤러 붙잡힘 -'+Math.round(e.grab*100)+'%');if(e.kd)o.push(e.kd>=1?'넘어짐 · 감전 면역':'넘어짐 -'+Math.round(e.kd*100)+'%');if(e.step)o.push('발소리 -'+Math.round(e.step*100)+'%');
 return'['+APARTS.find(a=>a[0]==ARMX[id][0])[1]+' T'+ARMX[id][1]+'] '+o.join(' · ')}
for(const id in ARMX){const a=ARMX[id];let it=I_BY[id];if(!it){it=[id,a[2],'e',ATIER_RAR[a[1]],a[3],''];ITEMS.push(it);I_BY[id]=it}it[5]=armTxt(id)+(id=='helmet'?' · 출혈 확률 절반':'')}
/* ---------- slots: weapons, then 머리 · 몸통 · 다리 · 신발, then the bag ---------- */
{const i=SLOTS.findIndex(s=>s[0]=='body');if(!SLOTS.some(s=>s[0]=='legs'))SLOTS.splice(i+1,0,['legs','다리'],['feet','신발']);SLOTN.legs='다리';SLOTN.feet='신발'}
{const _gi=gearInit;gearInit=function(p){_gi(p);for(const[k]of APARTS)if(p.eq[k]==null)p.eq[k]=''}}
if(S&&S.p&&S.p.eq)for(const[k]of APARTS)if(S.p.eq[k]==null)S.p.eq[k]='';
{const _sf=slotFor;slotFor=function(id){return ARMX[id]?ARMX[id][0]:_sf(id)}}
const armScore=id=>{const e=(ARMX[id]||[])[4]||{};return(e.dr||0)+(e.blast||0)*.2+(e.kd||0)*.05+(e.step||0)*.05+(e.grab||0)*.05+(e.mov||0)*.3};
{const _ae=autoEquip;autoEquip=function(p,id,quiet){if(!ARMX[id])return _ae(p,id,quiet);const sl=ARMX[id][0],cur=p.eq[sl];
  if(!cur||armScore(id)>armScore(cur)){p.eq[sl]=id;if(!quiet&&typeof msg=='function')setTimeout(()=>msg('🎽 '+SLOTN[sl]+' 장착: '+NM2(id)),900)}}}
/* ---------- effects ---------- */
function armEq(p){p=p||S.p;return APARTS.map(([k])=>p.eq&&p.eq[k]).filter(id=>id&&ARMX[id]&&has(p,id))}
const armFx=(p,k)=>armEq(p).map(id=>ARMX[id][4][k]||0);
const ARMCAP=.25;/* total reduction capped at 75% */
const armProd=p=>armFx(p,'dr').reduce((m,v)=>m*(1-v),1);
function armPart(p){return Math.max(ARMCAP,armProd(p))}
/* everything that cuts damage (parts, perks, set bonuses) counts toward the one 75% cap */
function armRaw(p){return(typeof s3Arm=='function'?s3Arm():1)*armProd(p)}
armMul2=function(p){return Math.max(ARMCAP,armRaw(p))};
function blastMul(p){return armFx(p,'blast').reduce((m,v)=>m*(1-v),1)}
function kdMul(p){return armFx(p,'kd').reduce((m,v)=>m*(1-Math.min(1,v)),1)}
{const _sp=s3Spd;s3Spd=function(p){return _sp(p)*(1+armFx(p,'mov').reduce((a,v)=>a+v,0))}}
/* extra carry: the bag table answers with the armour bonus included (capacity() reads it) */
{const base=Object.assign({},BAGCAP);for(const k of Object.keys(base).concat(['']))Object.defineProperty(BAGCAP,k,{get:()=>(base[k]||0)+(S&&S.p?armFx(S.p,'cap').reduce((a,v)=>a+v,0):0),enumerable:k!='',configurable:true})}
{const _dm=detMul;detMul=function(){const m=_dm();if(!S||S.dr||!S.p.mv)return m;return m*armFx(S.p,'step').reduce((a,v)=>a*(1-v),1)}}
/* blasts: grenades, rockets, raider grenades and demolition charges */
{const _b=boom;boom=function(x,y,rad,dmg,fire){const p=S.p,h0=p.hp;_b(x,y,rad,dmg,fire);const lost=h0-p.hp;if(lost>0){const k=blastMul(p);if(k<1){p.hp+=lost*(1-k);if(typeof s3Float=='function')s3Float(p.x,p.y-60,'🦺 폭발 -'+Math.round((1-k)*100)+'%','#ffd36a')}}}}
if(typeof demoUpd=='function'){const _du=demoUpd;demoUpd=function(dt){const p=S&&S.p,h0=p&&p.hp;_du(dt);if(p&&p.hp<h0){const k=blastMul(p);p.hp+=(h0-p.hp)*(1-k)}}}
/* knockdowns and grabs */
{const _zb=zBite4;zBite4=function(z){const s0=S4.slow,k0=S4.kd;_zb(z);const p=S.p;if(S4.slow>s0){const g=armFx(p,'grab').reduce((a,v)=>a*(1-v),1);S4.slow=Math.max(0,s0)+(S4.slow-Math.max(0,s0))*g}
  if(S4.kd>k0){const m=kdMul(p);S4.kd=Math.max(0,k0)+(S4.kd-Math.max(0,k0))*m;if(m==0)S4.zapT=0}}}
{const _su=s4Upd;s4Upd=function(dt){const k0=S4.kd;_su(dt);const b=Math.max(0,k0-dt);if(S4.kd>b+1e-6){S4.kd=b+(S4.kd-b)*kdMul(S.p)}}}
/* ---------- crafting (T1 at bench Lv1, T2 at bench Lv2); 제작 방탄복 is now found only ---------- */
if(typeof RCP2!='undefined'){for(let i=RCP2.length-1;i>=0;i--)if(RCP2[i][0]=='armor')RCP2.splice(i,1);const add=r=>{if(!RCP2.some(q=>q[0]==r[0]))RCP2.push(r)},B1=['bench',1,'작업대 Lv1'],B2=['bench',2,'작업대 Lv2'];
 add(['band',{cloth:2},null]);add(['jacket',{cloth:5,scrap:1},B1]);add(['jeans',{cloth:4},B1]);add(['tboots',{cloth:2,scrap:2},B1]);
 add(['hardhat',{scrap:6,cloth:1},B2]);add(['tirevest',{scrap:10,cloth:3},B2]);add(['kneepad',{scrap:4,cloth:2},B2]);add(['wboots',{cloth:3,scrap:4},B2])}
/* ---------- loot by building ---------- */
{const L={houses:['band','jacket','jeans','tboots'],apt:['band','jacket','jeans','tboots'],hard:['hardhat','tirevest','kneepad','wboots'],ware:['hardhat','kneepad','wboots'],fire:['hardhat','wboots','kneepad'],
  police:['legguard','tacboots','visor'],mil:['visor','cpants','silboots','eod'],rbase:['visor','cpants','tacboots'],lab:['eod','spechelm','exo','shockboots']};
 for(const k in L)GLOOT[k]=(GLOOT[k]||[]).concat(L[k].filter(x=>!(GLOOT[k]||[]).includes(x)))}
/* risen raiders keep some leg and foot gear too */
if(typeof EXARM!='undefined'){Object.assign(EXARM[2],{kneepad:.15});Object.assign(EXARM[3],{legguard:.15,tacboots:.15});Object.assign(EXARM[4],{cpants:.15,tacboots:.2});Object.assign(EXARM[5],{cpants:.2,silboots:.2})}
/* ---------- pixel icons ---------- */
{const K='#1d1714',st='#9aa0a6',sd='#6a7078';
 const helm=(c,c2,ex)=>()=>{blob(12,13,9,7,K);blob(12,13,8,6,c);R(c2,6,8,10,2);R(K,3,15,18,3);R(c,4,15,16,2);ex&&ex()};
 const top=(c,c2,ex)=>()=>{R(K,4,3,16,19);R(c,5,4,14,17);R(c2,5,4,14,2);R(K,9,3,6,4);ex&&ex()};
 const pants=(c,c2,ex)=>()=>{R(K,5,3,14,19);R(c,6,4,12,17);R(c2,6,4,12,2);R(K,11,9,2,13);ex&&ex()};
 const boots=(c,c2,ex)=>()=>{R(K,4,6,7,15);R(K,13,6,7,15);R(c,5,7,5,13);R(c,14,7,5,13);R(K,3,17,9,5);R(K,12,17,9,5);R(c2,4,18,7,3);R(c2,13,18,7,3);ex&&ex()};
 IC.band=()=>{blob(12,12,9,6,K);blob(12,12,8,5,'#b83a32');R('#d9564a',5,8,14,2);for(let i=0;i<4;i++)R('#f0e0c0',7+i*3,11,1,1);R(K,18,13,4,6);R('#b83a32',19,14,2,4)};
 IC.hardhat=helm('#e0b03a','#f4d36a',()=>{R('#a8781e',11,7,2,8);R('#c43c32',7,12,10,1)});
 IC.visor=helm('#3e4652','#5a6470',()=>{R('#2a8acf',5,12,14,3);R('#7ec8f0',6,12,5,1)});
 IC.spechelm=helm('#2a2e33','#454b52',()=>{R(K,17,7,3,5);R('#5fbf6a',18,8,1,2);R(sd,5,12,14,2)});
 IC.jacket=top('#6b4426','#8a5a34',()=>{R('#4a2e18',11,7,2,14);R(st,12,9,1,1);R(st,12,13,1,1);R('#4a2e18',5,12,3,2);R('#4a2e18',16,12,3,2)});
 IC.tirevest=top('#2a2a2a','#444',()=>{for(let y=6;y<20;y+=3)R('#555',6,y,12,1);R('#e0b03a',8,9,2,2)});
 IC.eod=()=>{R(K,3,2,18,21);R('#4f6a8a',4,3,16,19);R('#6a86a8',4,3,16,2);R('#3a5068',6,7,12,9);R('#7ec8f0',8,4,8,2);R('#e0b03a',5,17,14,2);R(K,11,8,2,8)};
 IC.jeans=pants('#3a5a8a','#4f74aa',()=>{R('#8a6a42',7,14,3,3);R('#c9b48f',14,8,3,3)});
 IC.kneepad=()=>{R(K,3,5,8,14);R(K,13,5,8,14);R('#2a2e33',4,6,6,12);R('#2a2e33',14,6,6,12);blob(7,12,3,3,st);blob(17,12,3,3,st);R(sd,6,11,2,1);R(sd,16,11,2,1)};
 IC.legguard=pants('#2a2e33','#3e4652',()=>{R(st,7,12,4,6);R(st,13,12,4,6);R(sd,7,12,4,1);R(sd,13,12,4,1)});
 IC.cpants=pants('#4f5a35','#6b7650',()=>{R('#3e4729',6,11,4,4);R('#3e4729',14,11,4,4);R(K,6,11,4,1);R(K,14,11,4,1)});
 IC.exo=pants('#3a3f45','#555b62',()=>{R('#e0b03a',7,6,2,15);R('#e0b03a',15,6,2,15);blob(8,13,2,2,'#7ec8f0');blob(16,13,2,2,'#7ec8f0')});
 IC.tboots=boots('#3a5a3a','#556b55',()=>{R('#c9ced3',5,11,5,2);R('#c9ced3',14,9,5,2)});
 IC.wboots=boots('#8a5a2a','#a8783e',()=>{R('#e0b03a',5,8,5,1);R('#e0b03a',14,8,5,1)});
 IC.tacboots=boots('#2a2a2a','#3e3e3e',()=>{for(let y=9;y<16;y+=2){R(st,6,y,3,1);R(st,15,y,3,1)}});
 IC.silboots=boots('#2a2e33','#2a2e33',()=>{R('#5a6470',3,20,9,2);R('#5a6470',12,20,9,2)});
 IC.shockboots=boots('#3e4652','#c43c32',()=>{R('#7ec8f0',5,14,5,2);R('#7ec8f0',14,14,5,2);R('#e0b03a',6,9,3,2);R('#e0b03a',15,9,3,2)})}
