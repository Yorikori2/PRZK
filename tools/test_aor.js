// Sample: 옵션의 룬 — random armour options by part, grade odds per rune, re-roll, no duplicates on a piece.
const {chromium}=require('playwright');const path=require('path');const PAGE='file://'+path.resolve(__dirname,'..','inf-sample.html');
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(1800);await p.evaluate(()=>{closeBase();PAUSE=false;stop9();scene9('aor')});await p.waitForTimeout(200);
 const r=await p.evaluate(()=>{const P=S.p,pg=AE(),out={};for(const rn of['aor1','aor2','aor3']){AORSEL=rn;P.inv[rn]=3000;const c={1:0,2:0,3:0};let bad=0;for(let i=0;i<2000;i++){aRoll('tacboots',0);const v=pg.aopt.tacboots[0];c[+v.slice(-1)]++;if(!AOPT[v.slice(3,-1)][2].includes('feet'))bad++}out[rn]={c,bad,used:3000-P.inv[rn]}}
  AORSEL='aor1';pg.aopt.vest=['ao_regen1','ao_thorn2'];let dup=0;for(let i=0;i<300;i++){aRoll('vest',0);if(pg.aopt.vest[0].slice(3,-1)=='thorn')dup++}
  const btn=document.querySelectorAll('#bm [data-roll]').length,drop=[...Array(400)].map(()=>aRune(3));closeBase();return{out,dup,btn,drops:{a1:drop.filter(x=>x=='aor1').length,a3:drop.filter(x=>x=='aor3').length,fixed:drop.filter(x=>/^ao_/.test(x)).length}}});
 const pc=(o,g)=>o.c[g]/20;
 ok(Math.abs(pc(r.out.aor1,1)-70)<5&&Math.abs(pc(r.out.aor1,3)-5)<3,'옵션의 룬 grades ≈ 70 / 25 / 5% '+JSON.stringify(r.out.aor1.c));ok(r.out.aor3.c[1]==0&&Math.abs(pc(r.out.aor3,3)-40)<5,'찬란한 옵션의 룬 never gives Ⅰ, Ⅲ ≈ 40%');
 ok(['aor1','aor2','aor3'].every(k=>r.out[k].bad==0&&r.out[k].used==2000),'every roll fits the part and uses one rune');ok(r.dup==0,'never rolls an option the piece already has');ok(r.btn==2,'each open slot has a roll button');
 ok(r.drops.fixed==0&&r.drops.a1>r.drops.a3,'drops are 옵션의 룬 now '+JSON.stringify(r.drops));ok(!errs.length,'no page errors '+errs.slice(0,3).join(' | '));await b.close()})();
