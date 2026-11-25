// Sample: option lock + roll-all (armour and weapons) and weapon option runes.
const {chromium}=require('playwright');const path=require('path');const PAGE='file://'+path.resolve(__dirname,'..','inf-sample.html');
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(1800);await p.evaluate(()=>{closeBase();PAUSE=false;stop9();scene9('olA')});await p.waitForTimeout(200);
 let r=await p.evaluate(()=>{const P=S.p,pg=AE();P.inv.aor2=200;P.inv.enhg=50;aLock('vest')[0]=true;let kept=0,dup=0;for(let i=0;i<40;i++){aRollAll('vest');const a=pg.aopt.vest;if(a[0]=='ao_regen3')kept++;const ks=a.map(x=>x.slice(3,-1));if(new Set(ks).size<3)dup++}
  const used={rune:200-P.inv.aor2,charm:50-P.inv.enhg};P.inv.enhg=0;const before=JSON.stringify(pg.aopt.vest);aRollAll('vest');const blocked=JSON.stringify(pg.aopt.vest)==before;closeBase();return{kept,dup,used,blocked}});
 ok(r.kept==40&&r.dup==0,'locked option stays, the others re-roll without duplicates');ok(r.used.rune==40&&r.used.charm==40,'roll-all costs 1 rune + 1 charm per locked slot');ok(r.blocked,'no charm, no roll-all with a lock');
 r=await p.evaluate(()=>{scene9('olW');const P=S.p,pg=EP();P.inv.wor1=3000;P.inv.wor3=3000;const c1={1:0,2:0,3:0,4:0},c3={1:0,2:0,3:0,4:0};WORSEL='wor1';for(let i=0;i<2000;i++){wRoll('ar',[2]);c1[+pg.ench.ar[2].slice(-1)]++}WORSEL='wor3';for(let i=0;i<2000;i++){wRoll('ar',[2]);c3[+pg.ench.ar[2].slice(-1)]++}
  let dup=0;WORSEL='wor1';wLock('ar')[0]=true;P.inv.enhg=100;for(let i=0;i<50;i++){wRoll('ar',[1,2]);const ks=pg.ench.ar.map(x=>x.slice(3,-1));if(new Set(ks).size<3)dup++}const keep=pg.ench.ar[0];const btn=document.querySelectorAll('[data-wroll]').length;closeBase();return{c1,c3,dup,keep,btn,cat:catOf('wor1')}});
 ok(Math.abs(r.c1[1]/20-60)<5&&r.c1[4]<60,'무기 옵션의 룬 grades ≈ 60/30/9/1 '+JSON.stringify(r.c1));ok(r.c3[1]==0&&Math.abs(r.c3[4]/20-25)<5,'찬란한 무기 옵션의 룬: no Ⅰ, Ⅳ ≈ 25%');
 ok(r.dup==0&&r.keep=='rn_fire2','weapon roll-all keeps the locked rune, no duplicates');ok(r.btn==3&&r.cat=='r','each weapon rune slot has a roll button; the runes sit in the 무기 룬 tab');
 ok(!errs.length,'no page errors '+errs.slice(0,3).join(' | '));await b.close()})();
