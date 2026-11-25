// Bugs found while play-testing: leaving the underground when not underground, dying underground, demolition mode after loading.
// usage: node tools/test_fix.js [page]
const {chromium}=require('playwright');const path=require('path');const PAGE='file://'+path.resolve(__dirname,'..',process.argv[2]||'index.html');
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(1500);
 await p.evaluate(()=>{if(!run)document.querySelector('[data-d=S]').click();if(S.pg&&!S.pg.tr.length)S.pg.tr=['cop'];closeBase();$('bm').dataset.m='';PAUSE=false;if(typeof stop9=='function')stop9()});
 let r=await p.evaluate(()=>{try{dunExit();return'ok'}catch(e){return e.message}});ok(r=='ok','leaving the underground while on the surface does nothing (no error)');
 r=await p.evaluate(()=>{const P=S.p;infGoto(0,0);MINE0().hole=1;rebuildBase();P.inv.pick2=1;P.x=BL.ox+MSPOT[0]+28;P.y=BL.oy+MSPOT[1]+70;mineEnter();P.hp=-5;return new Promise(res=>setTimeout(()=>res({dun:!!DUN,base:inBase(P.x,P.y),bp:BP.length,hp:P.hp>0}),800))});
 ok(!r.dun&&r.base&&r.bp>0&&r.hp,'dying underground: back on the surface, respawned at the base');
 r=await p.evaluate(()=>{const P=S.p;give({dt2:1,pistol:1});P.eq.sec='pistol';P.as='sec';demoMode(true);save();return 1});await p.reload();await p.waitForTimeout(1500);await p.evaluate(()=>{const l=$('ld');if(l&&l.style.display!='none'&&!run)l.click()});await p.waitForTimeout(1200);await p.evaluate(()=>{if($('bm').style.display=='block'){closeBase();PAUSE=false}});await p.waitForTimeout(400);
 r=await p.evaluate(()=>({w:actW(S.p),demo:DEMO}));ok(r.w=='dt2'&&r.demo,'loading a save made in demolition mode keeps demolition mode '+JSON.stringify(r));
 ok(!errs.length,'no page errors '+errs.slice(0,3).join(' | '));await b.close()})();
