// The game page with the waiting features applied: special slot, sets, family looks, darkness + lights + gun-light slot,
// base mine (dirt · stone · ore) + pixel workshop, special ammo.  usage: node tools/test_apply2.js [page]
const {chromium}=require('playwright');const path=require('path');const PAGE='file://'+path.resolve(__dirname,'..',process.argv[2]||'index.html');
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(1500);
 await p.evaluate(()=>{if(!run){document.querySelector('[data-d=S]').click()}$('bm').dataset.m='';closeBase();PAUSE=false;if(S.pg&&!S.pg.tr.length)S.pg.tr=['cop'];if(typeof stop9=='function')stop9()});
 let r=await p.evaluate(()=>({slots:SLOTS.map(s=>s[0]).join(','),fany:FANY,sets:Object.keys(ASETS).length,light:Object.keys(CSLOT).every(c=>CSLOT[c].includes('light')),ammo:Object.keys(AVAR).length}));
 ok(r.slots=='prim,sec,mel,thr,head,body,legs,feet,spec,bag'&&r.sets==5&&r.light&&r.ammo==29&&r.fany===false,'all modules are in the game '+JSON.stringify(r));
 r=await p.evaluate(()=>{const P=S.p;S.t=1800;NIGHT=true;const d=darkLv();P.inv.flashl=1;P.eq.spec='flashl';const b2=myBeams().length;P.eq.spec='';S.t=600;NIGHT=false;return{d,b2}});ok(r.d>=.75&&r.b2==1,'dark nights and a flashlight beam');
 r=await p.evaluate(()=>{const P=S.p;for(const id of['visor','milarmor','cpants','silboots'])P.inv[id]=1;for(const id of['visor','milarmor','cpants','silboots'])P.eq[ARMX[id][0]]=id;const on=setOn('mil'),k=plLook();for(const s of['head','body','legs','feet'])P.eq[s]='';return{on,k}});
 ok(r.on&&/^pa_/.test(r.k),'military set is on and changes the look');
 r=await p.evaluate(()=>{const P=S.p;P.x=BL.ox+MSPOT[0]+28;P.y=BL.oy+MSPOT[1]+70;P.inv.pick1=1;const a=dmCtx().find(q=>/땅 파고/.test(q.t));if(!a)return{a:false};a.f();for(let i=0;i<420;i++)gearUpd(1/60);const d=dmCtx().find(q=>/내려가기/.test(q.t));if(!d)return{a:true,d:false};d.f();
  const n=W0.objs.filter(o=>o.t=='mtile').length;P.fx=0;P.fy=1;const o=mineTarget();for(let i=0;i<12&&W0.objs.includes(o);i++){P.ac=0;gearAct()}for(let i=0;i<120;i++)gearUpd(1/60);const dug=!W0.objs.includes(o);dunExit();return{a:true,d:true,n,dug,back:!DUN&&BP.some(o2=>o2.t=='mshaft')}});
 ok(r.a&&r.d&&r.n>400&&r.dug&&r.back,'dig a shaft at the base, mine a cell, climb back up '+JSON.stringify(r));
 r=await p.evaluate(()=>{const P=S.p;give({cement:4,scrap:20});P.x=BL.ox+FPOS.forge[0]+27;P.y=BL.oy+FPOS.forge[1]+70;const c=dmCtx().find(q=>/제작소 짓기/.test(q.t));if(c)c.f();const bb=document.querySelector('[data-fb]');if(bb)bb.click();closeBase();return{c:!!c,st:BP.some(o=>o.t=='st_forge')}});
 ok(r.c&&r.st,'build the smelter at the base and it stands there');
 r=await p.evaluate(()=>{const P=S.p;give({ar:1});P.eq.prim='ar';P.as='prim';P.mag.ar=0;P.inv.a556_ap=30;ammoLoad('a556_ap');reload(P,true);for(let i=0;i<200&&P.rl>0;i++)reloadTick(P,.05);return P.magT.ar=='a556_ap'&&P.mag.ar==30});ok(r,'special ammo loads in the game');
 ok(!errs.length,'no page errors '+errs.slice(0,3).join(' | '));await b.close()})();
