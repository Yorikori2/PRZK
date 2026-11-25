// The game page with the second batch applied: weapon/quick-slot panel, one interact button, demolition mode,
// enhance bench (enhancing only there), armour enhancing, option runes, glow, big mine + floors + nests + minimap + reset,
// quick ammo switch, big-enhance effect.  usage: node tools/test_apply3.js [page]
const {chromium}=require('playwright');const path=require('path');const PAGE='file://'+path.resolve(__dirname,'..',process.argv[2]||'index.html');
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(1500);
 await p.evaluate(()=>{if(!run){document.querySelector('[data-d=S]').click()}$('bm').dataset.m='';closeBase();PAUSE=false;if(S.pg&&!S.pg.tr.length)S.pg.tr=['cop'];if(typeof stop9=='function')stop9()});await p.waitForTimeout(400);
 let r=await p.evaluate(()=>{const P=S.p;give({ar:1,a556:60,pistol:1,dt2:1});P.eq.prim='ar';P.as='prim';hud2();WCK='';wcRender();return{wcs:document.body.dataset.wcs,rc:getComputedStyle($('rc')).display,slots:[...document.querySelectorAll('#wc2 .sl')].map(e=>e.dataset.s).join(),quick:document.querySelectorAll('#wc2 .qr .q').length,handle:!!$('wcH'),dmBox:getComputedStyle($('dmBox')).display,demoB:getComputedStyle($('demoB')).display}});
 ok(r.wcs=='C'&&r.rc=='none'&&/prim/.test(r.slots)&&/dm/.test(r.slots)&&r.quick==4&&r.handle,'weapon + quick-slot panel on the right (tuckable) '+r.slots);ok(r.dmBox=='none'&&r.demoB=='none','no button stack, no 🔨 bubble');
 r=await p.evaluate(()=>{const P=S.p;infGoto(0,0);S.base.lv.fst={forge:1,powder:1,ammob:1,gunb:1,enhb:1};rebuildBase();const L=FPOS.enhb;P.x=BL.ox+L[0]+L[2]/2;P.y=BL.oy+L[1]+L[3]+44;IAK='';iaRefresh();const hint=$('iaHint').textContent;ia();const m=$('bm').dataset.m;closeBase();PAUSE=false;
  P.x+=700;$('bm').dataset.m='';give({enh1:1});const n=P.inv.enh1;use2('enh1');const refused=P.inv.enh1==n&&$('bm').dataset.m!='enh';closeBase();PAUSE=false;return{hint,m,refused}});
 ok(/무기 강화/.test(r.hint)&&r.m=='enh','enhance bench at the base: [상호작용] opens it');ok(r.refused,'enhancing away from the bench is refused (no more base-menu shortcut)');
 r=await p.evaluate(()=>{const P=S.p,w0=actW(P);demoMode(true);const w1=actW(P),on=DEMO;demoMode(false);return{w0,w1,on,back:actW(P)}});ok(r.on&&r.w1=='dt2'&&r.back==r.w0,'demolition mode wields the tool and gives the gun back');
 r=await p.evaluate(()=>{const P=S.p,pg=AE();P.inv.vest=1;P.eq.body='vest';pg.aenh.vest=10;const am=armMul2(P);give({orn3:3});ORS='orn3';openRunes('a','vest');const R=Math.random;oRoll('a','vest',[0]);const opt=pg.aopt.vest[0];closeBase();PAUSE=false;return{am,opt,tier:aTier(),glow:typeof glowFx}});
 ok(Math.abs(r.am-.55)<1e-6,'+10 armour cuts more (vest -45%)');ok(/^ao_/.test(r.opt||''),'option runes roll armour options ('+r.opt+')');ok(r.glow=='function','enhancement glow is in');
 r=await p.evaluate(()=>{const P=S.p;infGoto(0,0);const M=MINE0();M.hole=1;rebuildBase();P.inv.pick3=1;P.inv.antenna=1;P.x=BL.ox+MSPOT[0]+28;P.y=BL.oy+MSPOT[1]+60;mineEnter();const R0=MREG(),n=W0.objs.filter(o=>o.t=='mtile').length,flesh=W0.objs.filter(o=>o.m=='flesh').length,hive=Z.some(z=>z.hive=='heart');
  mm2();const mm=$('mmw').style.display!='none';const left=wavesToReset();dunExit();return{cols:R0.cols,n,flesh,hive,mm,left}});
 ok(r.cols>=80&&r.n>5000,'the big mine ('+r.cols+' cols, '+r.n+' cells)');ok(r.hive&&r.flesh>40,'the zombie nest sits in floor 1');ok(r.mm,'mine map on the minimap (antenna)');ok(r.left>=1&&r.left<=7,'mine reset countdown ('+r.left+' waves)');
 r=await p.evaluate(()=>{const P=S.p;S.inf.fz={};for(let i=1;i<=9;i++)S.inf.fz[i]=1;give({enh3:3,scrap:10});const pg=EP();pg.enh.ar=9;ENSEL='ar';const R=Math.random;Math.random=()=>0;try{doEnh()}finally{Math.random=R}const fx=!!$('enhFx');closeBase();PAUSE=false;return{lv:enhLv('ar'),fx}});
 ok(r.lv==10&&r.fx,'+10 plays the success effect');
 r=await p.evaluate(()=>{const P=S.p;give({a556_ap:30});P.eq.prim='ar';P.as='prim';P.mag.ar=10;delete(P.magT||{}).ar;aqNext();for(let i=0;i<200&&P.rl>0;i++)reloadTick(P,.05);return P.magT&&P.magT.ar});ok(r=='a556_ap','quick ammo switch loads the next kind');
 ok(!errs.length,'no page errors '+errs.slice(0,3).join(' | '));await b.close()})();
