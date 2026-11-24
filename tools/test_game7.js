// Game with the endless city applied: title preview + re-roll, saves, old fixed saves, crafting/loot hooks, bench-only enhancing,
// bulldozer key, pick-list toggle, held-back guns switch.  usage: node tools/test_game7.js <outdir>
const {chromium}=require('playwright');const OUT=process.argv[2]||'.';const PAGE='file://'+require('path').resolve(__dirname,'..','index.html');
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(900);
 let r=await p.evaluate(()=>{const a=MAPCFG.seed,k0=W0.b.map(b=>b.kind).join();$('reroll').click();const b2=MAPCFG.seed,k1=W0.b.map(b=>b.kind).join();return{inf:INF,pre:!!$('stsel').querySelector('canvas'),a,b2,changed:k0!=k1,base:W0.b.some(b=>b.kind=='base')}});
 ok(r.inf&&r.pre&&r.a!=r.b2&&r.changed&&r.base,'title shows the start area and re-rolling changes it '+JSON.stringify(r));
 await p.screenshot({path:OUT+'/g7-title.png'});
 r=await p.evaluate(()=>{const want=MAPCFG.seed,kinds=W0.b.map(b=>b.kind).join();document.querySelector('[data-d=S]').click();return{run,seed:S.inf.seed,same:W0.b.map(b=>b.kind).join()==kinds,want,zonec:!!$('zonec'),stsel:!!$('stsel')}});
 ok(r.run&&r.seed==r.want&&r.same&&r.zonec&&!r.stsel,'new game starts on the previewed start area (seed '+r.seed+'), endless beyond');
 // walk far, save, reload: title offers to continue that save; re-rolling then continuing still loads the save's world
 r=await p.evaluate(()=>{$('bm').dataset.m='';closeBase();PAUSE=false;infGoto(9,3);save();return{g:gOf(S.p.x,S.p.y),seed:S.inf.seed}});await p.reload();await p.waitForTimeout(900);
 const r2=await p.evaluate(()=>{const ld=$('ld').style.display!='none';$('reroll').click();const rolled=MAPCFG.seed;$('ld').click();return{ld,rolled,seed:MAPCFG.seed,g:gOf(S.p.x,S.p.y)}});
 ok(r2.ld&&r2.seed==r.seed&&r2.g.join()==r.g.join(),'continue after a re-roll still loads the saved world at block '+r2.g);
 // old fixed-map save keeps working; the title offers a new endless game
 await p.evaluate(()=>{const s=JSON.parse(localStorage.getItem(SAVE));delete s.map;delete s.inf;localStorage.setItem(SAVE,JSON.stringify(s))});await p.reload();await p.waitForTimeout(900);
 r=await p.evaluate(()=>({inf:INF,fixed:FIXEDSAVE,txt:$('stsel').textContent,nbx:NBX,nby:NBY}));ok(!r.inf&&r.fixed&&/이어하기/.test(r.txt)&&r.nby==3,'an old fixed-map save boots the old 5×3 map and offers a new endless game');
 await p.evaluate(()=>{$('ld').click()});await p.waitForTimeout(600);r=await p.evaluate(()=>{for(let i=0;i<120;i++)gearUpd(1/60);return{run,dm:$('dmBox').innerHTML==''}});ok(r.run&&r.dm,'old save plays without errors (endless-only buttons stay hidden)');
 await p.evaluate(()=>{$('newInf')&&0});await p.goto(PAGE);await p.waitForTimeout(600);await p.evaluate(()=>{$('newInf').click()});await p.waitForTimeout(1200);
 r=await p.evaluate(()=>({inf:INF,pre:!!$('reroll')}));ok(r.inf&&r.pre,'[무한 지형으로 새 게임 준비] reloads into the endless start preview');
 // game hooks
 await p.evaluate(()=>{localStorage.clear()});await p.reload();await p.waitForTimeout(900);await p.evaluate(()=>{document.querySelector('[data-d=S]').click();$('bm').dataset.m='';closeBase();PAUSE=false;if(S.pg&&!S.pg.tr.length)S.pg.tr=['cop']});
 r=await p.evaluate(()=>({rc:['dt1','dt1f','dt2'].every(k=>RCP2.some(q=>q[0]==k)),wl:WLOOT.mil.includes('dt3')&&WLOOT.hard.includes('dt1f'),gl:GLOOT.mil.includes('dx1')&&GLOOT.ware.includes('dx2'),later:G4_LATER.length,noGun:!W_BY.m500&&!W_BY.awm}));
 ok(r.rc&&r.wl&&r.gl,'demolition tools are craftable / lootable; explosives and the bulldozer key drop');ok(r.later==5&&r.noGun,'the 5 single-ammo guns stay out (switch: LATER_GUNS_ON)');
 r=await p.evaluate(()=>{give({enh1:2});const p=S.p;p.x+=PX*1.2;gearUpd(1/60);use2('enh1');const far=$('msg').textContent,openFar=$('bm').dataset.m=='enh';closeBase();S.base.lv.bench=1;rebuildBase();p.x=BL.ox+470;p.y=BL.oy+430;use2('enh1');const near=$('bm').dataset.m=='enh';closeBase();PAUSE=false;return{far,openFar,near}});
 ok(!r.openFar&&/작업대/.test(r.far)&&r.near,'enhancing opens only at a workbench ('+r.far+')');
 r=await p.evaluate(()=>{delete S.inf.dz;give({dx2:1});const o=dozerObj();return{dz:!!S.inf.dz,obj:!!o,fuel:S.inf.dzF}});ok(r.dz&&r.obj&&r.fuel==20,'finding the bulldozer key parks a bulldozer nearby with a full tank');
 r=await p.evaluate(()=>{Object.assign(S.base.st,{a9mm:50,food:5});openStash('base');STPICK={};stPick('a9mm','box');const a=STPICK.a9mm;stPick('a9mm','box');const b=STPICK.a9mm;stPick('food','box');stAmt('food',10);const c=STPICK.food;stAmt('food',-99);const d=STPICK.food;closeBase();PAUSE=false;return{a,b,c,d}});
 ok(r.a==1&&r.b===undefined&&r.c==5&&r.d===undefined,'pick list: tap adds, tap again removes; amount via − ＋ +10 (capped by the box) '+JSON.stringify(r));
 // a minute of walking across blocks stays smooth
 await p.evaluate(()=>{Z.length=0;S.p.hp=1e9;jp=-1;jx=1;jy=0});const fps=await p.evaluate(()=>new Promise(res=>{let n=0;const t0=performance.now();(function f(){n++;if(performance.now()-t0<4000)requestAnimationFrame(f);else res(Math.round(n/4))})()}));
 r=await p.evaluate(()=>{jp=null;jx=0;return gOf(S.p.x,S.p.y)});ok(fps>40,'walking east across blocks: '+fps+' fps, now at '+r);
 ok(!errs.length,'no page errors '+errs.join(' | '));await b.close()})();
