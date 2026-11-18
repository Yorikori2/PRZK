// Stage 3 sample checks: traits at new game, XP + levels, stats, skills, perks, gun parts (loot only, rarity gate, stat changes),
// combat multipliers, save/load, character sheet UI on phone portrait/landscape.  usage: node tools/test_stage3.js <outdir> [page]
const {chromium}=require('playwright');const OUT=process.argv[2]||'.';const PAGE=process.argv[3]||'stage3-sample.html';
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+require('path').resolve(__dirname,'..',PAGE));await p.waitForTimeout(400);
 await p.evaluate(()=>{localStorage.clear();start('S',false)});await p.waitForTimeout(300);
 ok(await p.evaluate(()=>$('bm').style.display=='block'&&$('bm').dataset.m=='traits'&&PAUSE),'new game opens trait picker and pauses');
 await p.screenshot({path:OUT+'/s3-traits.png'});
 await p.evaluate(()=>{closeBase()});ok(await p.evaluate(()=>$('bm').style.display=='block'),'trait picker cannot be skipped');
 await p.click('[data-t="soldier"]');await p.click('[data-t="glut"]');await p.click('#tGo');
 let r=await p.evaluate(()=>({tr:S.pg.tr,sp:S.pg.sp,pause:PAUSE,open:$('bm').style.display}));ok(r.tr.join()=='soldier,glut'&&r.sp==3&&!r.pause&&r.open=='none','job + weakness chosen, +3 stat points '+JSON.stringify(r));
 // XP from a kill and level-ups
 r=await p.evaluate(()=>{const q=Z[0];q.hp=0;q.look='runner';const x0=S.pg.xp;upd(.016);return{dx:S.pg.xp-x0}});ok(r.dx==15,'runner kill gives 15 XP ('+r.dx+')');
 r=await p.evaluate(()=>{s3Xp(5000);return{lv:S.pg.lv,sp:S.pg.sp,kp:S.pg.kp}});ok(r.lv>=8&&r.sp==3+(r.lv-1)&&r.kp==Math.floor(r.lv/2),'levels from XP: '+JSON.stringify(r));
 r=await p.evaluate(()=>{let t=0;for(let L=1;L<50;L++)t+=xpNeed(L);s3Xp(t*2);return{lv:S.pg.lv,xp:S.pg.xp}});ok(r.lv==50&&r.xp==0,'level cap 50');
 r=await p.evaluate(()=>s3PerkPend());ok(r.join()=='10,20,30,40,50','perk choices unlocked at 10/20/30/40/50');
 // stats
 r=await p.evaluate(()=>{const p=S.p,h0=MHP(p),c0=capacity(p);openChar('stat');document.querySelector('[data-st="vit"]').click();document.querySelector('[data-st="str"]').click();return{dh:MHP(p)-h0,dc:capacity(p)-c0,txt:document.querySelector('#st b').textContent}});
 ok(r.dh==4&&r.dc==1,'vitality +4 max HP, strength +1 kg '+JSON.stringify(r));ok(/\/ 104/.test(r.txt),'HUD shows new max HP '+r.txt);
 // skills: lock rules
 r=await p.evaluate(()=>{S.pg.lv=4;openChar('skill');const k0=S.pg.kp;document.querySelector('[data-k="combat1"]').click();const lockedT=!S.pg.sk.combat1;S.pg.lv=50;openChar('skill');document.querySelector('[data-k="combat1"]').click();const needPrev=!S.pg.sk.combat1;
  document.querySelector('[data-k="combat0"]').click();document.querySelector('[data-k="combat1"]').click();return{lockedT,needPrev,c0:S.pg.sk.combat0,c1:S.pg.sk.combat1,used:k0-S.pg.kp}});
 ok(r.lockedT&&r.needPrev&&r.c0==1&&r.c1==1&&r.used==2,'skill tiers need level and previous tier '+JSON.stringify(r));
 // weapon numbers: soldier + aim + skill
 r=await p.evaluate(()=>{give({ar:1,a556:200,a40mm:3});S.p.eq.prim='ar';S.p.as='prim';s3dirty();return{base:W_BY.ar[4].d,now:wdef('ar')[4].d,rlm:wdef('ar')[4].rlm}});
 ok(r.now>r.base*1.15&&r.rlm<1,'rifle damage/reload boosted by stats, skill, soldier trait '+JSON.stringify(r));
 // parts: loot only, rarity gate, effects
 r=await p.evaluate(()=>{let n=0;const o=W0.objs.find(o=>o.t=='gunrack')||{t:'gunrack'};for(let i=0;i<300;i++){const x={};s3Search(o,'mil',5,x)}return Object.values(S.pg.parts).reduce((a,b)=>a+b,0)});
 ok(r>60,'searching military gun racks finds parts ('+r+' from 300)');
 r=await p.evaluate(()=>{const pg=S.pg;pg.parts={o_4x:1,m_ext:2,u_gl:1,sup_r:1};pg.sk.tech1=0;s3dirty();MGUN='ar';MSLOT='optic';openChar('mod');const locked=!!document.querySelector('.pi em')&&/스킬 필요/.test(document.querySelector('.pl').textContent)&&!document.querySelector('[data-pu="o_4x"]');
  pg.sk.tech1=1;openChar('mod');document.querySelector('[data-pu="o_4x"]').click();MSLOT='mag';openChar('mod');document.querySelector('[data-pu="m_ext"]').click();const s=wdef('ar')[4];return{locked,optic:pg.mods.ar.optic,mag:s.mag,r:s.r,base:W_BY.ar[4]}});
 ok(r.locked,'rare scope locked without the 총기 개조 skill');ok(r.optic=='o_4x'&&r.mag==45&&Math.abs(r.r-r.base.r*1.25*(1))<1,'scope +25% range, extended mag 45 rounds '+JSON.stringify({mag:r.mag,r:r.r}));
 await p.screenshot({path:OUT+'/s3-mod.png'});
 r=await p.evaluate(()=>{S.pg.parts.m_ext=1;MGUN='ar';openChar('mod');return document.querySelector('.pg').textContent});ok(/확장 탄창/.test(r),'parts list shows collected parts');
 // combat: damage, crit, grenade launcher part
 r=await p.evaluate(()=>{Z.length=0;const pl=S.p;mk(pl.x+60,pl.y,{look:'heavy'});const z=Z[0];z.hp=z.mhp=5000;pl.mag.ar=30;pl.ac=0;pl.rl=0;S.tg=null;updTarget(pl);const h0=z.hp;gearAct();return{dealt:h0-z.hp,exp:wdef('ar')[4].d}});
 ok(r.dealt>=r.exp*.99,'rifle shot deals boosted damage '+JSON.stringify(r));
 r=await p.evaluate(()=>{const pl=S.p,pg=S.pg;pg.sk.tech1=3;pg.mods.ar.under='u_gl';s3dirty();const z=Z[0];z.hp=5000;S3.glcd=0;pl.ac=0;pl.mag.ar=30;const a=pl.inv.a40mm|0;updTarget(pl);gearAct();return{used:a-(pl.inv.a40mm|0),cd:S3.glcd>0}});
 ok(r.used==1&&r.cd,'under-barrel grenade launcher fires and uses 40mm ammo '+JSON.stringify(r));
 // perks
 r=await p.evaluate(()=>{openChar('trait');document.querySelector('[data-p="40|불굴"]').click();const pl=S.p;pl.hp=0;die();const surv=pl.hp==1;pl.hp=0;die();return{surv,second:pl.hp}});
 ok(r.surv&&r.second==60,'불굴 saves once per day, then normal death '+JSON.stringify(r));
 // XP sources: first building visit, crafting
 r=await p.evaluate(()=>{const i=W0.b.findIndex(b=>b.kind=='police');S.inb=i;const x0=S.pg.xp+S.pg.lv*1e6;S.pg.lv=1;S.pg.xp=0;gearUpd(.016);return{xp:S.pg.xp,lv:S.pg.lv}});ok(r.lv>1||r.xp==200,'first police station visit gives 200 XP');
 // save / load keeps progression, no trait picker
 r=await p.evaluate(()=>{save();const k=JSON.parse(localStorage.getItem(SAVE)).pg;return{tr:k.tr,mods:k.mods.ar}});ok(r.tr.length==2&&r.mods.optic=='o_4x','progression saved '+JSON.stringify(r));
 await p.reload();await p.waitForTimeout(400);await p.evaluate(()=>start(0,true));await p.waitForTimeout(300);
 r=await p.evaluate(()=>({open:$('bm').style.display,mods:S.pg.mods.ar,lv:S.pg.lv,mag:wdef('ar')[4].mag}));ok(r.open!='block'&&r.mods.optic=='o_4x'&&r.mag==45,'loaded save keeps parts and skips trait picker '+JSON.stringify(r));
 // UI screenshots
 for(const t of['stat','skill','trait','mod']){await p.evaluate(t=>openChar(t),t);await p.waitForTimeout(80);await p.screenshot({path:OUT+'/s3-'+t+'.png'})}
 await p.evaluate(()=>closeBase());await p.waitForTimeout(400);await p.screenshot({path:OUT+'/s3-hud.png'});
 // old save without progression -> trait picker
 r=await p.evaluate(()=>{const s=JSON.parse(localStorage.getItem(SAVE));delete s.pg;localStorage.setItem(SAVE,JSON.stringify(s));start(0,true);return{open:$('bm').dataset.m,lv:S.pg.lv}});ok(r.open=='traits'&&r.lv==1,'old save gets trait picker and starts at Lv 1');
 await p.setViewportSize({width:860,height:412});await p.evaluate(()=>{$('bm').dataset.m='';closeBase();PAUSE=false;S.pg.tr=['cop'];openChar('mod')});await p.waitForTimeout(150);await p.screenshot({path:OUT+'/s3-mod-land.png'});
 const fps=await p.evaluate(()=>new Promise(r=>{closeBase();let n=0;const t0=performance.now();(function f(){n++;if(performance.now()-t0<1500)requestAnimationFrame(f);else r(Math.round(n/1.5))})()}));ok(fps>40,'frame rate '+fps);
 ok(!errs.length,'no page errors '+errs.join(' | '));await b.close()})();
