// Game checks for the zombie sound + top health bar release.  usage: node tools/test_game5.js <outdir>
const {chromium}=require('playwright');const OUT=process.argv[2]||'.';
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+require('path').resolve(__dirname,'..','index.html'));await p.waitForTimeout(600);
 await p.evaluate(()=>{localStorage.clear();start('S',false);S.pg.tr=['cop'];$('bm').dataset.m='';closeBase();PAUSE=false;Z.length=0});
 const bar=()=>p.evaluate(()=>{hud2();const e=$('bossbar');return{on:getComputedStyle(e).display!='none',txt:e.textContent,elite:e.classList.contains('elite')}});
 const at=(look,d)=>p.evaluate(([look,d])=>{Z.length=0;const pl=S.p;mk(pl.x,pl.y-d,{look});const z=Z[Z.length-1];z.x=pl.x;z.y=pl.y-d;return Z.length},[look,d]);
 await at('brute',500);let r=await bar();ok(!r.on,'elite far away (500px): no bar');
 await at('brute',250);r=await bar();ok(r.on&&r.elite&&/엘리트 · 브루트/.test(r.txt),'elite near (250px): purple bar "'+r.txt+'"');await p.screenshot({path:OUT+'/g5-elite.png'});
 for(const l of['heavy','stalker','shocker']){await at(l,200);r=await bar();ok(r.on&&r.elite,l+' near: elite bar')}
 await at('runner',100);r=await bar();ok(!r.on,'ordinary special zombie: no bar');
 r=await p.evaluate(()=>{Z.length=0;const pl=S.p;mk(pl.x,pl.y-250,{look:'brute'});mk(pl.x,pl.y-600,{look:'goliath'});for(const z of Z){z.x=pl.x}Z[0].y=pl.y-250;Z[1].y=pl.y-600;hud2();const e=$('bossbar');return{txt:e.textContent,elite:e.classList.contains('elite')}});
 ok(/보스 · 골리앗/.test(r.txt)&&!r.elite,'boss within 700px wins over a nearer elite: "'+r.txt+'"');
 r=await p.evaluate(()=>{const z=Z[1];z.hp=z.mhp/2;hud2();return $('bossbar').querySelector('i').style.width});ok(r=='50%','bar follows HP: '+r);
 r=await p.evaluate(()=>typeof voice=='function'&&typeof at3=='function'&&!!document.getElementById('sdir')&&!document.getElementById('scB'));ok(r,'zombie voices + sound arrows in the game, no sample scene button');
 r=await p.evaluate(()=>{Z.length=0;const pl=S.p;mk(pl.x+600,pl.y,{look:'runner',w:1});ZS5.last.clear();return new Promise(res=>{let n=0,k=0;const iv=setInterval(()=>{n=Math.max(n,document.querySelectorAll('#sdir i').length);if(++k>24){clearInterval(iv);res(n)}},250)})});ok(r>0,'off-screen zombie shows a sound arrow in the game');
 ok(!errs.length,'no page errors '+errs.join(' | '));await b.close()})();
