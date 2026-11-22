// Zone-crossing alert tour on the endless city sample. usage: node tools/test_infzone.js <outdir>
const {chromium}=require('playwright');const OUT=process.argv[2]||'.';const PAGE='file://'+require('path').resolve(__dirname,'..','inf-sample.html');
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);await p.evaluate(()=>{try{localStorage.clear()}catch(e){}});await p.reload();await p.waitForTimeout(1500);
 await p.evaluate(()=>{window.BN=[];const o=zoneBanner;zoneBanner=function(z,up){BN.push([z,up,performance.now()]);return o(z,up)};scene9('tour')});
 const shots={};for(let i=0;i<5;i++){await p.waitForFunction(n=>BN.length>n,i,{timeout:9000}).catch(()=>{});await p.waitForTimeout(350);const r=await p.evaluate(()=>[BN.length,$('zoneb').classList.contains('on'),$('zoneb').textContent,document.body.dataset.zone]);shots[i]=r;await p.screenshot({path:OUT+'/zone-'+(i+1)+'.png'})}
 const r=await p.evaluate(()=>({bn:BN.map(x=>x[0]+(x[1]?'up':'down')),log:ZLOG}));
 ok(r.bn.join()=='1up,2up,3up,4up,3down','alerts in order '+r.bn.join());
 for(let i=0;i<5;i++)ok(shots[i][1],'banner visible: '+shots[i][2]+' (body zone '+shots[i][3]+')');
 ok(r.log&&r.log.length==5,'log has 5 entries');ok(!errs.length,'no page errors '+errs.join('|'));await b.close()})();
