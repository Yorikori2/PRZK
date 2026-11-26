// Zone ×2/4/6/8, zone warning, first-entry supply, enhancement and enchant runes (endless city sample). usage: node tools/test_enh.js <outdir>
const zMulAtkT=1+(3.9-1)*.35;const {chromium}=require('playwright');const OUT=process.argv[2]||'.';const PAGE='file://'+require('path').resolve(__dirname,'..','inf-sample.html');
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);await p.evaluate(()=>{try{localStorage.clear()}catch(e){}});await p.reload();await p.waitForTimeout(1500);await p.evaluate(()=>{stop9()});
 // HP and attack per zone
 let r=await p.evaluate(()=>{const o=[];for(const g of[0,15,30,45,60,75]){infGoto(g,0);Z.length=0;mk(S.p.x+80,S.p.y,{look:'civ1'});o.push([Math.round(Z[0].mhp),+(Z[0].dmg||7).toFixed(1)])}Z.length=0;return o});
 ok(r.map(x=>+(x[0]/r[0][0]).toFixed(2)).join()=='1,1.4,2.4,3,3.9,4.7','zombie HP curve ×1 · 1.4 · 2.4 · 3 · 3.9 · 4.7 (zones 0-5) '+JSON.stringify(r));ok(r[4][1]==+(7*zMulAtkT).toFixed(1),'zone 4 attack ×'+zMulAtkT.toFixed(2)+' ('+r[4][1]+')');
 // warning one block before the edge, not before
 r=await p.evaluate(()=>{const n0=S.enW|0;infGoto(12,0);gearUpd(1/60);const a=(S.enW|0)-n0;infGoto(14,0);gearUpd(1/60);const b=(S.enW|0)-n0;return[a,b,$('zoneb').textContent]});
 ok(r[0]==0&&r[1]==1&&/다음 블록부터 1구역/.test(r[2]),'warning appears at block 14, not at 12: '+r[2]);
 // first entry supply, only once
 r=await p.evaluate(()=>{S.inf.fz={};infGoto(10,0);const inv=()=>JSON.stringify(['enh1','enh2','enhg'].map(k=>S.p.inv[k]|0));const a=inv(),xp=S.pg.xp+S.pg.lv*1e6;infGoto(16,0);const b=inv(),t=$('zoneb').textContent;infGoto(10,0);infGoto(16,0);const c=inv();return{a,b,c,t,runes:Object.keys(S.p.inv).filter(k=>k.startsWith('rn_')&&S.p.inv[k]>0)}});
 ok(r.a!=r.b&&r.b==r.c&&/첫 진입 보급/.test(r.t)&&r.runes.length>=1,'first entry into zone 1 gives stones + a rune once '+JSON.stringify(r));
 // enhancement: damage +15% per level, rates, failure rules, protection charm
 r=await p.evaluate(()=>{giveDemo();const pg=EP();pg.enh={};s3dirty();const d0=wdef('ar')[4].d;pg.enh.ar=4;s3dirty();const d4=wdef('ar')[4].d;
  const R=Math.random;Math.random=()=>.999;pg.enh.ar=3;ENSEL='ar';const s1=S.p.inv.enh1;doEnh();const after3=pg.enh.ar,used=s1-S.p.inv.enh1; // +4 fail: stays, stone used
  pg.enh.ar=6;ENPROT=false;doEnh();const drop=pg.enh.ar; // +7 fail: drops to 5
  pg.enh.ar=6;ENPROT=true;const g0=S.p.inv.enhg;doEnh();const kept=pg.enh.ar,gUsed=g0-S.p.inv.enhg;
  Math.random=()=>0;pg.enh.ar=9;doEnh();const top=pg.enh.ar;doEnh();const over=pg.enh.ar;Math.random=R;closeBase();
  return{d0,d4,after3,used,drop,kept,gUsed,top,over}});
 ok(Math.abs(r.d4/r.d0-1.6)<.01,'+4 = damage ×1.6 ('+r.d0.toFixed(1)+' → '+r.d4.toFixed(1)+')');ok(r.after3==3&&r.used==0,'+1~+5 failure keeps the level');
 ok(r.drop==5,'+6 and up failure drops one level');ok(r.kept==6&&r.gUsed==1,'protection charm blocks the drop and is used up');ok(r.top==10&&r.over==10,'max +10');
 // enchant slots and effects
 r=await p.evaluate(()=>{const pg=EP();pg.enh.ar=4;pg.ench.ar=[];give({rn_hunt4:2,rn_fire2:1,rn_ice1:1,rn_hunt2:1});ENSLOT=0;doEnch('rn_hunt4');doEnch('rn_fire2');const s4=pg.ench.ar.join();
  pg.enh.ar=5;doEnch('rn_hunt4');const s5=pg.ench.ar.join();doEnch('rn_hunt2');const keep=pg.ench.ar.join();closeBase();
  infGoto(60,0);Z.length=0;mk(S.p.x+100,S.p.y,{look:'civ1'});const z=Z[0],hp0=z.hp;S3.ctx='ar';hitZ(z,10,1,0,0);S3.ctx=null;const hit=hp0-z.hp,burn=z.enB>0;
  pg.ench.ar=['rn_ice1'];Z.length=0;mk(S.p.x+100,S.p.y,{look:'civ1'});const q=Z[0],sm=q.sm||1;S3.ctx='ar';hitZ(q,1,1,0,0);S3.ctx=null;const slow=(q.sm/sm);for(let i=0;i<130;i++)gearUpd(1/60);const back=(q.sm/sm);Z.length=0;
  return{s4,s5,keep,hit,burn,slow,back}});
 ok(r.s4=='rn_fire2'&&r.s5=='rn_fire2,rn_hunt4','one rune slot below +5 (new rune replaces), two at +5 '+r.s4+' | '+r.s5);
 ok(r.keep==r.s5,'a lower rune of the same kind does not replace a higher one');ok(r.burn&&r.hit>=10,'fire rune sets the zombie on fire (hit '+r.hit.toFixed(1)+' with zone hunter)');
 r.slow=Math.round(r.slow*100)/100;ok(r.slow==.75&&r.back==1,'ice rune slows 25% for 2 s then wears off ('+r.slow+','+r.back+')');
 r=await p.evaluate(()=>{const pg=EP();pg.ench.ar=['rn_hunt4'];infGoto(60,0);Z.length=0;mk(S.p.x+100,S.p.y,{look:'civ1'});const z=Z[0],h=z.hp;S3.ctx='ar';hitZ(z,10,1,0,0);S3.ctx=null;return h-z.hp});ok(Math.abs(r-19.6)<.3,'zone hunter Ⅳ in zone 4: 10 damage → '+r.toFixed(1)+' (+6% × 4 × 4)');
 r=await p.evaluate(()=>[huntMul(4,4),huntMul(4,6),huntMul(2,1)]);ok(r[0]==r[1]&&Math.abs(r[2]-1.12)<1e-9,'zone hunter stops growing after zone 4 '+r);
 // drops: zone zombies drop stones sometimes
 r=await p.evaluate(()=>{infGoto(60,0);const n0=['enh1','enh2','enh3'].reduce((a,k)=>a+(S.p.inv[k]|0),0);for(let i=0;i<300;i++){Z.length=0;mk(S.p.x+200,S.p.y,{look:'civ1'});kill(Z[0])}Z.length=0;return['enh1','enh2','enh3'].reduce((a,k)=>a+(S.p.inv[k]|0),0)-n0});ok(r>=10&&r<=50,'300 kills in zone 4 drop '+r+' stones (~10%)');
 r=await p.evaluate(()=>{const rows=cmpRows();closeBase();return rows});console.log(JSON.stringify(r));ok(r.length==7&&r[6][3][5]>r[4][3][5]&&Math.abs(r[4][1]-r[0][1]*3.9)<1&&r[4][3][1]==Math.ceil(r[4][1]/33),'comparison table rows');
 await p.evaluate(()=>scene9('cmp'));await p.waitForTimeout(400);await p.screenshot({path:OUT+'/enh-cmp.png'});
 // zone 0 stone drops raised (6% per kill)
 r=await p.evaluate(()=>{infGoto(0,0);const n0=S.p.inv.enh1|0;for(let i=0;i<1000;i++){Z.length=0;mk(S.p.x+200,S.p.y,{look:'civ1'});kill(Z[0])}Z.length=0;return(S.p.inv.enh1|0)-n0});ok(r>=35&&r<=90,'zone 0: 1000 kills drop '+r+' low stones (~6%)');
 // zone profile: specials, elites, density, roaming bosses, scaled-down boss HP
 r=await p.evaluate(()=>{const o={};for(const zn of[1,3,5]){let sp=0,el=0;for(let i=0;i<2000;i++){const k=zPick(zn);if(k&&ELITEZ.includes(k))el++;else if(k)sp++}o[zn]=[sp/2000,el/2000]}
  const cnt=g=>{S.inf.zv={};S.inf.bb={};infGoto(g,0);infGoto(g+5,0);const n=Z.length;return n};const z0=cnt(3),z4=cnt(63);let bn0=S.inf.bn|0;for(let i=0;i<6;i++){infGoto(70+i*5,0)}const bosses=(S.inf.bn|0)-bn0;
  Z.length=0;infGoto(60,0);Z.length=0;mk(S.p.x+300,S.p.y,{look:'goliath'});const gh=Z[0].mhp;Z.length=0;mk(S.p.x+300,S.p.y,{look:'brute'});const bh=Z[0].mhp;Z.length=0;return{o,z0,z4,bosses,gh,bh}});
 ok(r.o[1][1]==0&&r.o[3][1]>.05&&r.o[5][0]>r.o[1][0],'specials and elites rise with the zone '+JSON.stringify(r.o));ok(r.z4>r.z0*1.6,'zone 4 blocks hold about twice the zombies ('+r.z0+' → '+r.z4+')');
 ok(r.bosses>=1,'roaming bosses appear past zone 4 ('+r.bosses+' in 30 new blocks)');ok(Math.round(r.gh)==Math.round(1500*(1+.5*3.9))&&Math.round(r.bh)==Math.round(600*(1+2.9*.5)),'zone 4 (×3.9): boss HP ×2.95 · elite HP ×2.45 (goliath '+r.gh+', brute '+r.bh+')');
 const fps=await p.evaluate(()=>{stop9();S.inf.zv={};S.inf.bb={};infGoto(80,0);S.p.hp=1e9;S.p.mhp=1e9;return new Promise(res=>{let n=0;const t0=performance.now();(function f(){n++;if(performance.now()-t0<3000)requestAnimationFrame(f);else res([Math.round(n/3),Z.length])})()})});ok(fps[0]>40,'zone 5 crowd: '+fps[1]+' zombies at '+fps[0]+'fps');
 await p.evaluate(()=>{Z.length=0;S.p.hp=100;scene9('prof')});await p.waitForTimeout(300);await p.screenshot({path:OUT+'/enh-prof.png'});
 // the window renders, scenes run
 await p.evaluate(()=>scene9('ench'));await p.waitForTimeout(300);await p.evaluate(()=>doEnch('rn_hunt4'));await p.waitForTimeout(400);await p.screenshot({path:OUT+'/enh-panel.png'});
 await p.evaluate(()=>scene9('fight'));await p.waitForTimeout(1500);await p.screenshot({path:OUT+'/enh-fight.png'});
 await p.evaluate(()=>scene9('bonus'));await p.waitForTimeout(5600);await p.screenshot({path:OUT+'/enh-bonus.png'});
 await p.evaluate(()=>scene9('warn'));await p.waitForTimeout(3600);await p.screenshot({path:OUT+'/enh-warn.png'});
 ok(!errs.length,'no page errors '+errs.join(' | '));await b.close()})();
