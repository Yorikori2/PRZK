// Player armour in four parts (머리 → 몸통 → 다리 → 신발): slots, tiers, crafting, loot, blast reduction, move/carry, knockdown, footsteps.
// usage: node tools/test_armor.js [page]
const {chromium}=require('playwright');const path=require('path');const PAGE='file://'+path.resolve(__dirname,'..',process.argv[2]||'index.html');
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(1500);
 await p.evaluate(()=>{if(!run){document.querySelector('[data-d=S]').click()}$('bm').dataset.m='';closeBase();PAUSE=false;if(S.pg&&!S.pg.tr.length)S.pg.tr=['cop'];if(typeof stop9=='function')stop9()});
 let r=await p.evaluate(()=>{const P=S.p;P.inv.band=1;P.inv.hardhat=1;openBag('band');const labels=[...document.querySelectorAll('#bm .eq .l')].map(e=>e.textContent.split(' ·')[0]);closeBase();return{order:SLOTS.map(s=>s[0]).join(','),labels,eq:Object.keys(P.eq).join(',')}});
 ok(/^prim,sec,mel,thr,head,body,legs,feet,(spec,)?bag$/.test(r.order),'slot order: weapons → head · body · legs · feet → bag ('+r.order+')');
 ok(r.labels.slice(4,8).join(',')=='머리,몸통,다리,신발','bag sheet shows 머리 · 몸통 · 다리 · 신발 in order ('+r.labels.join('/')+')');
 r=await p.evaluate(()=>{const parts={};for(const id in ARMX){const a=ARMX[id];(parts[a[0]]=parts[a[0]]||[]).push(a[1])}return{parts,slot:['jeans','tboots','eod','visor'].map(slotFor).join(',')}});
 ok(['head','body','legs','feet'].every(k=>[1,2,3,4,5].every(t=>r.parts[k].includes(t))),'every part has tiers T1–T5');ok(r.slot=='legs,feet,body,head','new items go to the right slot ('+r.slot+')');
 r=await p.evaluate(()=>{const P=S.p;for(const k of['head','body','legs','feet'])P.eq[k]='';const a0=armMul2(P);P.inv.jacket=1;P.inv.jeans=1;P.eq.body='jacket';P.eq.legs='jeans';const a1=armMul2(P);
  for(const id of['spechelm','eod','exo','shockboots'])P.inv[id]=1;P.eq.head='spechelm';P.eq.body='eod';P.eq.legs='exo';P.eq.feet='shockboots';const a2=armMul2(P);return{a0,a1,a2,s3:s3Arm()}});
 ok(Math.abs(r.a1/r.s3-.92*.97)<.001,'parts multiply: jacket + jeans = '+Math.round((1-r.a1/r.s3)*100)+'% less damage');ok(Math.abs(r.a2/r.s3-.25)<.001,'full T5 set is capped at -75% ('+(r.a2/r.s3).toFixed(3)+')');
 r=await p.evaluate(()=>{const P=S.p,hit=L=>{for(const k of['head','body','legs','feet'])P.eq[k]='';for(const id of L){P.inv[id]=1;P.eq[ARMX[id][0]]=id}P.hp=200;boom(P.x+20,P.y,70,40);return 200-P.hp};return{none:hit([]),hh:hit(['hardhat']),eod:hit(['eod']),both:hit(['hardhat','eod'])}});
 ok(r.none>0&&Math.abs(r.hh-r.none*.75)<.6&&Math.abs(r.eod-r.none*.3)<.6&&Math.abs(r.both-r.none*.225)<.6,'blast: none '+r.none+' · hardhat '+r.hh.toFixed(1)+' · EOD '+r.eod.toFixed(1)+' · both '+r.both.toFixed(1));
 r=await p.evaluate(()=>{const P=S.p;for(const k of['head','body','legs','feet'])P.eq[k]='';P.inv={eod:1,exo:1,cpants:1};const s0=speedMul(P),c0=capacity(P);P.eq.body='eod';const s1=speedMul(P);P.eq.legs='exo';const s2=speedMul(P),c2=capacity(P);P.eq.legs='cpants';const c3=capacity(P);return{s0,s1,s2,c0,c2,c3}});
 ok(Math.abs(r.s1/r.s0-.8)<.01&&Math.abs(r.s2/r.s0-.9)<.01,'EOD suit -20% move, exo legs +10% ('+(r.s1/r.s0).toFixed(2)+', '+(r.s2/r.s0).toFixed(2)+')');ok(r.c2-r.c0==10&&r.c3-r.c0==3,'carry: exo +10kg, combat pants +3kg ('+r.c0+'→'+r.c2+'/'+r.c3+')');
 r=await p.evaluate(()=>{const P=S.p;for(const k of['head','body','legs','feet'])P.eq[k]='';const bite=(L,look)=>{for(const k of['legs','feet'])P.eq[k]='';for(const id of L){P.inv[id]=1;P.eq[ARMX[id][0]]=id}S4.kd=0;S4.slow=0;zBite4({look,x:P.x+10,y:P.y});return look=='crawler'?S4.slow:S4.kd};
  return{g0:bite([],'crawler'),g1:bite(['jeans'],'crawler'),k0:bite([],'shocker'),k1:bite(['kneepad'],'shocker'),k2:bite(['shockboots'],'shocker'),k3:bite(['kneepad','wboots'],'shocker')}});
 ok(Math.abs(r.g1-r.g0*.8)<.01,'patched jeans: crawler grab -20% ('+r.g0+'→'+r.g1.toFixed(2)+'s)');ok(Math.abs(r.k1-r.k0*.7)<.01&&r.k2==0&&Math.abs(r.k3-r.k0*.7*.85)<.01,'knockdown: knee pads -30%, + work boots ×0.85, shock boots immune ('+[r.k0,r.k1,r.k3,r.k2].map(x=>x.toFixed(2)).join(' / ')+')');
 r=await p.evaluate(()=>{const P=S.p;for(const k of['head','body','legs','feet'])P.eq[k]='';S.dr=0;P.mv=1;const d0=detMul();P.inv.silboots=1;P.eq.feet='silboots';const d1=detMul();P.eq.feet='';return{d0,d1}});
 ok(Math.abs(r.d1/r.d0-.5)<.01,'silent boots halve footstep noise ('+r.d0.toFixed(2)+'→'+r.d1.toFixed(2)+')');
 r=await p.evaluate(()=>{const ids=RCP2.map(q=>q[0]);const req=id=>{const q=RCP2.find(x=>x[0]==id);return q&&q[2]?q[2][1]:0};return{armor:ids.includes('armor'),t1:['band','jacket','jeans','tboots'].every(i=>ids.includes(i)),t2:['hardhat','tirevest','kneepad','wboots'].every(i=>ids.includes(i)&&req(i)==2),t3:['helmet','legguard','tacboots','visor','eod','exo'].some(i=>ids.includes(i)),
  loot:{houses:GLOOT.houses.includes('jeans'),hard:GLOOT.hard.includes('hardhat'),police:GLOOT.police.includes('legguard'),mil:GLOOT.mil.includes('eod'),lab:GLOOT.lab.includes('shockboots')}}});
 ok(!r.armor&&r.t1&&r.t2&&!r.t3,'crafting: T1 + T2 (bench Lv2) only, 제작 방탄복 is drop-only');ok(Object.values(r.loot).every(Boolean),'loot tables by building '+JSON.stringify(r.loot));
 r=await p.evaluate(()=>{const P=S.p;P.inv={};for(const k of['head','body','legs','feet'])P.eq[k]='';invAdd(P,'jeans',1);invAdd(P,'legguard',1);const a=P.eq.legs;invAdd(P,'wboots',1);invAdd(P,'tboots',1);return{a,f:P.eq.feet}});
 ok(r.a=='legguard'&&r.f=='wboots','auto-equip keeps the better piece ('+r.a+', '+r.f+')');
 r=await p.evaluate(()=>{const P=S.p;P.inv={eod:1};P.eq.body='eod';const t=JSON.stringify({inv:P.inv,eq:P.eq});const o=JSON.parse(t);delete o.eq.legs;delete o.eq.feet;const q={inv:o.inv,eq:o.eq};gearInit(q);return q.eq.legs===''&&q.eq.feet===''});
 ok(r,'old saves get empty 다리 · 신발 slots');
 ok(!errs.length,'no page errors '+errs.slice(0,3).join(' | '));await b.close()})();
