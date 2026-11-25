// Sample: new buildings batch 1 — 약국 · 총포상 · 정비소 · 은행 appear in the city, build without errors, carry their furniture, loot and alarm.
const {chromium}=require('playwright');const path=require('path');const PAGE='file://'+path.resolve(__dirname,'..','inf-sample.html');
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(1800);await p.evaluate(()=>{closeBase();PAUSE=false;stop9()});
 const r=await p.evaluate(()=>{const out={};const cnt={};for(let gx=-12;gx<=12;gx++)for(let gy=-12;gy<=12;gy++){const k=kindAt(gx,gy);cnt[k]=(cnt[k]|0)+1}out.cnt=cnt;
  out.base=kindAt(0,0);out.near=['pharm','gunshop','garage','bank'].map(k=>{for(let gx=-2;gx<=2;gx++)for(let gy=-2;gy<=2;gy++)if(Math.max(Math.abs(gx),Math.abs(gy))<({pharm:1,garage:2,bank:3,gunshop:3})[k]&&kindAt(gx,gy)==k)return k+'@'+gx+','+gy;return null}).filter(Boolean);
  out.b={};for(const[k,f]of[['pharm',['counter','shelf']],['gunshop',['showcase']],['garage',['lift']],['bank',['vault']]]){const at=findKind([k]);if(!at){out.b[k]='none';continue}infGoto(at[0],at[1]);
   const os=W0.objs.filter(o=>o.bk==null||true);const ts=new Set(W0.objs.map(o=>o.t));out.b[k]={at,has:f.filter(t=>ts.has(t)),loot:W0.objs.filter(o=>LOOTT[o.t]).length,tier:TIER[k],alr:ALR[k]||0,spec:!!SPEC[k],name:KNAME?KNAME[k]:null}}
  out.carpart=!!I_BY.carpart;out.vaultLoot=LOOTT.vault;return out});
 console.log(JSON.stringify(r.cnt));ok(r.base=='base','the base block stays the base');ok(!r.near.length,'each kind keeps its minimum distance '+JSON.stringify(r.near));
 for(const k of['pharm','gunshop','garage','bank']){const B=r.b[k];ok(r.cnt[k]>0,k+' appears in the 25×25 city ('+(r.cnt[k]|0)+')');ok(B&&B!='none'&&B.has.length>0&&B.loot>3,k+' builds with its furniture and loot '+JSON.stringify(B));ok(B.tier>0&&B.spec,k+' has a tier and a first-visit bonus')}
 ok(r.b.gunshop.alr>0&&r.b.bank.alr>0,'gunshop and bank have an alarm chance');ok(r.carpart,'차량 부품 item exists');
 for(const s of['nbT','nb1','nb2','nb3','nb4']){await p.evaluate(s=>scene9(s),s);await p.waitForTimeout(400)}
 ok(!errs.length,'no page errors '+errs.slice(0,3).join(' | '));await b.close()})();
// a demolished block (빈터 / 전초기지) must stay a lot, never turn into a new building
(async()=>{const {chromium}=require('playwright');const b=await chromium.launch();const p=await b.newPage();await p.goto(PAGE);await p.waitForTimeout(1500);
 const r=await p.evaluate(()=>{const out=[];for(const k of['pharm','gunshop','garage','bank']){const at=findKind([k]);S.inf.demo=S.inf.demo||{};S.inf.demo[at.join()]=1;out.push(kindAt(at[0],at[1]));delete S.inf.demo[at.join()]}return out});
 ok(r.every(k=>k=='lot'),'a demolished block / outpost stays a lot (no shop on top) '+r);await b.close()})();
