// In the mine, attack must still fight: a zombie in range is shot even with an unbreakable cell in front;
// attack digs only cells the pickaxe can break when nothing is being aimed at.  usage: node tools/test_mineatk.js [page]
const {chromium}=require('playwright');const path=require('path');const PAGE='file://'+path.resolve(__dirname,'..',process.argv[2]||'index.html');
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(1800);
 const r=await p.evaluate(()=>{if(!run)document.querySelector('[data-d=S]').click();document.getElementById('bm').dataset.m='';closeBase();PAUSE=false;if(typeof stop9=='function')stop9();const P=S.p;infGoto(0,0);const M=MINE0();M.hole=1;rebuildBase();for(const k of['pick2','pick3'])delete P.inv[k];P.inv.pick1=1;give({ar:1,a556:90});P.eq.prim='ar';P.as='prim';P.mag.ar=30;P.x=BL.ox+MSPOT[0]+28;P.y=BL.oy+MSPOT[1]+60;mineEnter();
  P.fx=0;P.fy=1;const o=mineTarget();o.m='olead';for(const q of W0.objs.slice())if(q.t=='mtile'&&q!==o&&q.x>P.x+12&&q.x<P.x+140&&Math.abs(q.y+16-P.y)<40)rmSolid(q);Z.length=0;mk(P.x+110,P.y-10,{look:'civ1'});const z=Z[0];z.hp=1e4;z.stun=1e9;
  const m0=P.mag.ar;for(let i=0;i<10;i++){P.ac=0;updTarget(P);gearAct()}const shot=m0-P.mag.ar;Z.length=0;S.tg=null;o.m='dirt';o.mhp=null;o.hp=null;const n0=W0.objs.includes(o);for(let i=0;i<15&&W0.objs.includes(o);i++){P.ac=0;updTarget(P);gearAct()}if(typeof MINE!='undefined'&&MINE){for(let i=0;i<200;i++){if(MINE){MINE.x=P.x;MINE.y=P.y}gearUpd(1/60)}}
  return{shot,dug:n0&&!W0.objs.includes(o)}});
 ok(r.shot>0,'a zombie in range is shot even with an unbreakable cell in front ('+r.shot+' shots)');ok(r.dug,'with nothing to aim at, attack digs a cell the pickaxe can break');
 ok(!errs.length,'no page errors '+errs.slice(0,3).join(' | '));await b.close()})();
