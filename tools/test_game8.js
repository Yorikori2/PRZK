// Game with raiders, 8-way motion, new turrets, merchant + events, vouchers applied. usage: node tools/test_game8.js <outdir>
const {chromium}=require('playwright');const OUT=process.argv[2]||'.';const PAGE='file://'+require('path').resolve(__dirname,'..','index.html');
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(900);await p.evaluate(()=>{document.querySelector('[data-d=S]').click();$('bm').dataset.m='';closeBase();PAUSE=false;if(S.pg&&!S.pg.tr.length)S.pg.tr=['cop']});
 let r=await p.evaluate(()=>{const fns=['rSpawn','rSquad','rbTick','merSpawn','openMer','evStart','evDay','dir8','person3q','turD','airHack','hordeN'].filter(f=>typeof window[f]!='function'&&typeof eval(f)!='function');return{fns,tk:!!I_BY.tkn,later:G4_LATER.length}});
 ok(!r.fns.length&&r.tk&&r.later==5,'all new systems are in the game '+(r.fns.join(',')||''));
 // raiders in a far zone walk, shoot and drop vouchers
 r=await p.evaluate(()=>{infGoto(2*zoneStep()+1,0);Z.length=0;window.__tk0=S.p.inv.tkn|0;clearInterval(window.__hpI);window.__hpI=setInterval(()=>{S.p.hp=Math.max(S.p.hp,90)},50);S.sa=1e9;S.p.hp=1e5;const L=rSquad(S.p.x+260,S.p.y,2);L.forEach(q=>q.state='fight');return L.length});await p.waitForTimeout(3000);
 r=await p.evaluate(()=>{const hit=S.rHitP|0,t=window.__tk0;for(const z of Z.slice())if(z.raider&&z.hp>0)hitZ(z,1e7,1,0,1);clearInterval(window.__hpI);return new Promise(res=>setTimeout(()=>res({hit,tk:(S.p.inv.tkn|0)-t,d8:Z.length>=0}),500))});ok(r.hit>0&&r.tk>0,'raiders fight and drop vouchers ('+r.hit+' hits, +'+r.tk+' 🎫)');
 // a day passes → today's events get planned
 r=await p.evaluate(()=>{S.p.hp=1e5;const d=S.day;S.day=d+1;gearUpd(1/60);return S.evPlan&&S.evPlan.day==S.day?S.evPlan:null});ok(!!r&&r.sm.length>=1,'each new day plans events '+JSON.stringify(r));
 // merchant trades in vouchers
 r=await p.evaluate(()=>{evCancel();for(const e of WEV.slice())evEnd(e);infGoto(3*zoneStep()+1,0);Z.length=0;const m=merSpawn(S.p.x+60,S.p.y,{life:300});give({tkn:200});openMer(m);const t0=S.p.inv.tkn,k=Object.keys(m.st)[0];merBuy(k);const spent=t0-S.p.inv.tkn;closeBase();PAUSE=false;return spent>0});ok(r,'the merchant sells for vouchers');
 // walking across blocks with all of it still runs smoothly
 await p.evaluate(()=>{Z.length=0;S.p.hp=1e9;jp=-1;jx=1;jy=0});const fps=await p.evaluate(()=>new Promise(res=>{let n=0;const t0=performance.now();(function f(){n++;if(performance.now()-t0<4000)requestAnimationFrame(f);else res(Math.round(n/4))})()}));await p.evaluate(()=>{jp=null;jx=0});ok(fps>40,'walking in zone 3: '+fps+' fps');
 await p.screenshot({path:OUT+'/g8.png'});ok(!errs.length,'no page errors '+errs.join(' | '));await b.close()})();
