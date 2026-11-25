// Sample: the 강화 · 룬 작업대 — built in the 제작소, stands at the base, opens weapon/armour enhancing and runes.
const {chromium}=require('playwright');const path=require('path');const PAGE='file://'+path.resolve(__dirname,'..','inf-sample.html');
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(1800);await p.evaluate(()=>{closeBase();PAUSE=false;stop9()});
 await p.evaluate(()=>scene9('eb2'));await p.waitForTimeout(300);
 const r=await p.evaluate(()=>{const bt=document.querySelector('[data-fb]');const can=bt&&!bt.disabled;if(bt)bt.click();const built=fBuilt('enhb'),stand=BP.some(o=>o.t=='st_enhb');closeBase();
  scene9('eb1');const B=dmCtx().map(q=>q.t);const f=dmCtx().find(q=>/무기 강화/.test(q.t));f.f();const enh=$('bm').dataset.m;closeBase();dmCtx().find(q=>/룬 · 옵션/.test(q.t)).f();const ru=$('bm').dataset.m;closeBase();
  return{can,built,stand,B,enh,ru,rate:[ENH.rate[1],ENH.rate[10],AERATE(10)]}});
 ok(r.can&&r.built&&r.stand,'build the bench in the 제작소 and it stands at the base');ok(['🔨 무기 강화','🛡 방어구 강화','🔮 룬 · 옵션'].every(t=>r.B.includes(t)),'walking up shows the three buttons '+JSON.stringify(r.B));ok(r.enh=='enh'&&r.ru=='runes','they open the enhance and rune windows');
 ok(r.rate.join()=='100,20,16','odds: weapon +1 100%, +10 20%, armour +10 16%');ok(!errs.length,'no page errors '+errs.slice(0,3).join(' | '));await b.close()})();
