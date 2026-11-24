// Balance pass: enhancement cap by zone, first wave +30%, armour overflow → bleed/knockdown, ammo cheaper further out.
// usage: node tools/test_bal.js [page]
const {chromium}=require('playwright');const path=require('path');const PAGE='file://'+path.resolve(__dirname,'..',process.argv[2]||'index.html');
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(1500);
 await p.evaluate(()=>{if(!run){document.querySelector('[data-d=S]').click()}$('bm').dataset.m='';closeBase();PAUSE=false;if(S.pg&&!S.pg.tr.length)S.pg.tr=['cop'];if(typeof stop9=='function')stop9()});
 let r=await p.evaluate(()=>{const c=z=>{S.inf.fz={};for(let i=1;i<=z;i++)S.inf.fz[i]=1;return ENH.max};const v=[0,5,6,8,9,12,15].map(c);S.inf.fz={};return{v,r11:ENH.rate[11],r10:ENH.rate[10],c11:ENH.cost(11),c9:ENH.cost(9)}});
 ok(r.v.join()=='10,10,12,12,15,18,21','enhancement cap: '+r.v.join(' → '));ok(r.r11>0&&r.r11<r.r10&&r.c11.enh4==1&&!r.c9.enh4,'+11 and up use 초월 강화석 with lower odds ('+r.r11+'%)');
 r=await p.evaluate(()=>{const P=S.p;give({ar:1,enh4:3,enh3:3,scrap:20});S.inf.fz={};for(let i=1;i<=6;i++)S.inf.fz[i]=1;const pg=EP();pg.enh.ar=10;openEnh('ar');const R=Math.random;Math.random=()=>0;try{doEnh()}finally{Math.random=R}const lv=pg.enh.ar;closeBase();return{lv,left:P.inv.enh4|0}});
 ok(r.lv==11&&r.left==2,'a +10 gun goes to +11 past zone 6');
 r=await p.evaluate(()=>{S.inf.fz={1:1,2:1,3:1,4:1,5:1};ZLAST=5;const n0=S.p.inv.enh4|0;infGoto(95,0);infZoneCheck(false);return{z:ZLAST,got:(S.p.inv.enh4|0)-n0,cap:ENH.max}});
 ok(r.z==6&&r.got==2&&r.cap==12,'first visit to zone 6: 초월 강화석 ×2 and cap +12 ('+JSON.stringify(r)+')');
 r=await p.evaluate(()=>{infGoto(0,0);Z.length=0;wave(1);const a=Z.length;Z.length=0;wave(2);const b2=Z.length;Z.length=0;return{a,b2}});
 ok(r.a>=10&&r.a<=11&&r.b2==10,'first wave has 30% more zombies ('+r.a+' vs normally 8 · wave 2: '+r.b2+')');
 r=await p.evaluate(()=>{const P=S.p;for(const id of['spechelm','eod','exo','shockboots'])P.inv[id]=1;P.eq.head='spechelm';P.eq.body='eod';P.eq.legs='exo';P.eq.feet='shockboots';const am=armMul2(P),ov=armOver(P),cut=overCut(P);
  let n=0;const R=Math.random;try{for(let i=0;i<400;i++){P.bleed=0;BLD0=0;Math.random=()=>.0;P.bleed=1;Math.random=()=>.001;zBite4({look:'civ1',x:P.x,y:P.y});if(!P.bleed)n++}}finally{Math.random=R}
  for(const k of['head','body','legs','feet'])P.eq[k]='';const ov0=armOver(P);P.bleed=0;return{am,ov,cut,stopped:n,ov0}});
 ok(Math.abs(r.am-.25)<1e-9&&r.ov>0&&r.ov0==0,'armour stays capped at -75%, the overflow is counted ('+(r.ov*100).toFixed(2)+'%p)');ok(r.stopped>0,'overflow can stop a bleed ('+r.stopped+'/400 with a forced roll)');
 r=await p.evaluate(()=>{const out={};for(const z of[0,3,6,9]){Z.length=0;const gx=z?15*z+2:2;infGoto(gx,1);Z.length=0;merSpawn(S.p.x+60,S.p.y,{life:300});const m=Z.find(q=>q.npc=='mer');out[z]={a9mm:m.st.a9mm&&m.st.a9mm.pr,food:m.st.food&&m.st.food.pr,enh4:!!m.st.enh4}}Z.length=0;infGoto(0,0);return out});
 ok(r[0].a9mm>r[3].a9mm&&r[3].a9mm>r[9].a9mm&&r[9].food>r[0].food,'ammo gets cheaper with zone while other goods get dearer '+JSON.stringify(r));ok(!r[3].enh4&&r[6].enh4,'zone 6+ merchants sell 초월 강화석');
 ok(!errs.length,'no page errors '+errs.slice(0,3).join(' | '));await b.close()})();
