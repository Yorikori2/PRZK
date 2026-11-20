// Stage 4 sample checks: 71 guns registered + all fire, new ammo/loot, 11 new zombies do their thing, bosses, bestiary, gun catalogue,
// search warning, screenshots of every scene.  usage: node tools/test_stage4.js <outdir> [page]
const {chromium}=require('playwright');const OUT=process.argv[2]||'.';const PAGE=process.argv[3]||'stage4-sample.html';
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+require('path').resolve(__dirname,'..',PAGE));await p.waitForTimeout(1200);
 await p.screenshot({path:OUT+'/s4-menu.png'});
 let r=await p.evaluate(()=>{const G=WEAPONS.filter(w=>w[2]=='g'),names=new Set(G.map(w=>w[1]));const badAmmo=G.filter(w=>{const a=AMMO_ITEM(w[4].ammo);return!I_BY[a]&&a!='fuel'}).map(w=>w[0]);
  const badIcon=G.filter(w=>{try{return icon(w[0]).length<200}catch(e){return true}}).map(w=>w[0]);const inLoot=G.filter(w=>Object.values(WLOOT).some(L=>L.includes(w[0]))).length;
  return{n:G.length,uniq:names.size,badAmmo,badIcon,inLoot,ar:W_BY.ar[1],pistol:W_BY.pistol[1],newAmmo:['a45','a38','a500','a57','a46','a545','a338'].filter(a=>I_BY[a]).length,parts:G.filter(w=>GCLASS[w[0]]).length}});
 ok(r.n==71&&r.uniq==71,'71 guns with unique fictional names ('+r.ar+', '+r.pistol+' …)');ok(!r.badAmmo.length,'every gun has an ammo item '+r.badAmmo);ok(!r.badIcon.length,'every gun has an icon '+r.badIcon);
 ok(r.newAmmo==7,'7 new ammo types');ok(r.inLoot>=60,'guns found in building loot tables: '+r.inLoot+'/71');ok(r.parts>=55,'guns that take parts: '+r.parts);
 // every gun fires and hurts a target
 r=await p.evaluate(()=>{const bad=[];for(const id of GUN_IDS){scene('range',id);const pl=S.p;let h0=Z.reduce((a,z)=>a+z.hp,0);for(let i=0;i<40;i++){pl.ac=0;pl.rl=0;S.tg=null;updTarget(pl);gearAct();gearUpd(1/30);if(pl.mag[id]<=0)pl.mag[id]=wdef(id)[4].mag}
   for(let i=0;i<30;i++)gearUpd(1/30);const h1=Z.reduce((a,z)=>a+Math.max(0,z.hp),0);if(!(h1<h0))bad.push(id)}return bad});
 ok(!r.length,'all 71 guns hit the range targets '+r);
 await p.evaluate(()=>scene('range','amr'));await p.waitForTimeout(500);await p.screenshot({path:OUT+'/s4-range.png'});
 // zombies: run each scene in real time-steps and watch for its behaviour
 const Zs={crawler:'S4.slow>0',spitter:'S4.pud.length>0||S4.proj.length>0',bloater:'S4.gas.length>0',stalker:'S4.kd>0',dog:"Z.filter(z=>z.look=='dog').length>=4",burner:'S4.burn>0',shocker:'S4.kd>0',
  sleeper:"Z.some(z=>z.look=='sleeper'&&!z.sleep)",brute:'S4.kd>0',brood:"Z.filter(z=>z.look=='crawler').length>0",goliath:'S4.shake>0'};
 for(const[id,cond]of Object.entries(Zs)){const boss=id=='brood'||id=='goliath';
  r=await p.evaluate(([id,cond,boss])=>{scene(boss?'boss':'zom',id);const pl=S.p;pl.as='mel';let hit=false,seen=false,t=0;const sx=pl.x,sy=pl.y;
   for(let i=0;i<900&&!hit;i++){if(id=='sleeper'&&i==60){const z=Z.find(z=>z.look=='sleeper');pl.x=z.x;pl.y=z.y+60}if(id=='shocker'||id=='burner'||id=='crawler')pl.as='fist';atk=false;upd(1/60);t=i;if(pl.hp<40)pl.hp=MHP(pl);if(eval(cond))hit=true;seen=seen||!!(S.bes[id]&&S.bes[id].s)}
   return{hit,seen,secs:+(t/60).toFixed(1),n:Z.length}},[id,cond,boss]);
  ok(r.hit,id+': behaviour happens ('+r.secs+'s) · '+cond);ok(r.seen,id+': bestiary entry recorded when seen')}
 for(const id of['spitter','bloater','stalker','brute']){await p.evaluate(id=>scene('zom',id),id);await p.waitForTimeout(id=='stalker'?1500:1800);await p.screenshot({path:OUT+'/s4-z-'+id+'.png'})}
 await p.evaluate(()=>scene('boss','goliath'));await p.waitForTimeout(1500);await p.screenshot({path:OUT+'/s4-boss.png'});
 r=await p.evaluate(()=>({bar:getComputedStyle($('bossbar')).display!='none',txt:$('bossbar').textContent}));ok(r.bar,'boss health bar shown: '+r.txt);
 r=await p.evaluate(()=>{const z=Z.find(z=>z.look=='goliath');const k0=(S.bes.goliath||{}).k|0,xp=S.pg.xp+S.pg.lv*1e5;z.hp=0;upd(1/60);return{k:S.bes.goliath.k-k0,xp:S.pg.xp+S.pg.lv*1e5>xp}});ok(r.k==1&&r.xp,'boss kill counted in bestiary and gives XP');
 // waves bring them
 r=await p.evaluate(()=>{scReset(false);const c={};for(let i=0;i<2000;i++){const l=waveLook(6);if(l)c[l]=(c[l]||0)+1}Z.length=0;wave(10);return{c,boss:Z.some(z=>z.look=='goliath')}});
 ok(['dog','spitter','burner','brute'].every(k=>r.c[k])&&r.boss,'wave 6 mixes in new kinds, wave 10 brings a goliath '+JSON.stringify(r.c));
 // search warning
 r=await p.evaluate(()=>{scene('warn');let w=0;for(let i=0;i<400&&SRCH;i++){gearUpd(1/60);upd(1/60);if(S4.warn)w=Math.max(w,S4.warn);if(w)break}return{w,act:$('act').classList.contains('warn')}});
 ok(r.w>0&&r.act,'search warning: zombie in sight within 200px flashes the bar and the act button '+JSON.stringify(r));
 await p.evaluate(()=>{scene('warn');for(let i=0;i<200;i++){upd(1/60);if(S4.warn)break}});await p.waitForTimeout(200);await p.screenshot({path:OUT+'/s4-warn.png'});
 // catalogues
 await p.evaluate(()=>scene('dexz'));await p.waitForTimeout(200);r=await p.evaluate(()=>({cards:document.querySelectorAll('.dzc').length,un:document.querySelectorAll('.dzc.un').length,det:!!document.querySelector('.dzd h3')&&document.querySelector('.dzd h3').textContent}));
 ok(r.cards==14&&r.un==4&&/스피터/.test(r.det),'bestiary: 14 entries, unseen hidden, detail '+JSON.stringify(r));await p.screenshot({path:OUT+'/s4-dexz.png'});
 await p.evaluate(()=>scene('dexg'));await p.waitForTimeout(200);r=await p.evaluate(()=>({cards:document.querySelectorAll('.dgc').length,un:document.querySelectorAll('.dgc.un').length,det:document.querySelector('.dzd h3').textContent}));
 ok(r.cards==71&&r.un>20&&/그리폰/.test(r.det),'gun catalogue: 71 entries, unfound silhouetted '+JSON.stringify(r));await p.screenshot({path:OUT+'/s4-dexg.png'});
 r=await p.evaluate(()=>{closeBase();scReset(false);S.gseen={};give({k2:1});gearUpd(1/60);return!!S.gseen.k2});ok(r,'picking up a gun records it in the catalogue');
 // tabs keep working
 r=await p.evaluate(()=>{openChar('stat');const a=document.querySelectorAll('.flt .chip').length;openChar('dex');const b=!!document.querySelector('.dz,.dg');openChar('mod');return{a,b,mod:!!document.querySelector('.s3h')}});ok(r.a==5&&r.b&&r.mod,'🧬 sheet: 능력치·스킬·특성·총기 개조·도감 tabs');
 await p.setViewportSize({width:860,height:412});await p.evaluate(()=>{closeBase();scene('dexz')});await p.waitForTimeout(200);await p.screenshot({path:OUT+'/s4-dexz-land.png'});
 const fps=await p.evaluate(()=>new Promise(res=>{scene('boss','brood');let n=0;const t0=performance.now();(function f(){n++;if(performance.now()-t0<1500)requestAnimationFrame(f);else res(Math.round(n/1.5))})()}));ok(fps>40,'boss fight frame rate '+fps);
 ok(!errs.length,'no page errors '+errs.slice(0,3).join(' | '));await b.close()})();
