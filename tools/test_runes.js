// Sample: one 옵션의 룬 for weapons, armour and special gear; old option vanishes on re-roll; locks; one bag tab.
const {chromium}=require('playwright');const path=require('path');const PAGE='file://'+path.resolve(__dirname,'..','inf-sample.html');
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(1800);await p.evaluate(()=>{closeBase();PAUSE=false;stop9();scene9('ru')});await p.waitForTimeout(200);
 let r=await p.evaluate(()=>{const P=S.p,inv0=JSON.stringify(P.inv);P.inv.orn1=500;const n0=Object.keys(P.inv).filter(k=>/^(rn_|ao_|so_)/.test(k)).length;
  oRoll('w','ar',[0]);const w=EP().ench.ar[0];oRoll('a','vest',[0]);const a=AE().aopt.vest[0];oRoll('s','nvg',[0]);const s=SE().sopt.nvg[0];
  for(let i=0;i<60;i++){oRoll('w','ar',[0]);oRoll('a','vest',[0]);oRoll('s','nvg',[0])}const n1=Object.keys(P.inv).filter(k=>/^(rn_|ao_|so_)/.test(k)).length;
  return{w,a,s,n0,n1,used:500-P.inv.orn1}});
 ok(/^rn_/.test(r.w)&&/^ao_/.test(r.a)&&/^so_/.test(r.s),'the same rune gives a weapon rune, an armour option and a special-gear option');ok(r.n1==r.n0&&r.used==183,'re-rolled options vanish — nothing comes back to the bag (183 runes used)');
 r=await p.evaluate(()=>{const P=S.p;P.inv.orn3=4000;ORS='orn3';const cw={},ca={};for(let i=0;i<1500;i++){oRoll('w','ar',[1]);const g=+EP().ench.ar[1].slice(-1);cw[g]=(cw[g]|0)+1;oRoll('a','vest',[1]);const h=+AE().aopt.vest[1].slice(-1);ca[h]=(ca[h]|0)+1}
  let bad=0;for(let i=0;i<300;i++){oRoll('a','tacboots',[0]);const k=AE().aopt.tacboots[0].slice(3,-1);if(!AOPT[k][2].includes('feet'))bad++}return{cw,ca,bad}});
 ok(r.cw[4]>250&&!r.cw[1],'weapons can roll Ⅳ '+JSON.stringify(r.cw));ok(!r.ca[4]&&r.ca[3]>900,'armour caps at Ⅲ '+JSON.stringify(r.ca));ok(r.bad==0,'armour options still fit the part');
 r=await p.evaluate(()=>{const P=S.p;P.inv.orn1=50;P.inv.enhg=20;ORS='orn1';const a=AE().aopt.vest;oLock('a','vest')[0]=true;const keep=a[0];let dup=0;for(let i=0;i<15;i++){oRoll('a','vest',[1,2]);const ks=a.filter(Boolean).map(x=>x.slice(3,-1));if(new Set(ks).size<ks.length)dup++}return{same:a[0]==keep,dup,charm:20-P.inv.enhg}});
 ok(r.same&&r.dup==0&&r.charm==15,'locks and roll-all work the same (charm per locked slot)');
 r=await p.evaluate(()=>{const P=S.p;P.inv.aor2=3;P.inv.wor1=2;P.ornMig=0;ornMigrate();const m={aor:P.inv.aor2|0,o2:P.inv.orn2|0};BF='r';openBag();const tabs=[...document.querySelectorAll('#bm .flt [data-f]')].map(e=>e.textContent).join(',');const ids=[...document.querySelectorAll('#bm [data-i]')].map(e=>e.dataset.i);BF='all';closeBase();
  P.inv.flashl=1;P.eq.spec='flashl';SE().sopt.flashl=['so_amp3'];S.t=1800;NIGHT=true;const br=myBeams()[0].r;SE().sopt.flashl=[];const b0=myBeams()[0].r;return{m,tabs,ids,br,b0}});
 ok(r.m.aor==0&&r.m.o2>=3,'old option runes turn into the unified ones');ok(/룬/.test(r.tabs)&&!/방어구 룬/.test(r.tabs)&&r.ids.includes('orn1'),'one 룬 tab in the bag');ok(Math.abs(r.br/r.b0-1.3)<.01,'광원 증폭 Ⅲ on a flashlight: +30% beam');
 ok(!errs.length,'no page errors '+errs.slice(0,3).join(' | '));await b.close()})();
