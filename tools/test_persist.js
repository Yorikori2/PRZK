// Places stay as you left them: first-visit-only raiders/merchants, trimmed blood and bodies per block, raider bodies rising,
// explosive countdown chip.  usage: node tools/test_persist.js [page]
const {chromium}=require('playwright');const path=require('path');const PAGE='file://'+path.resolve(__dirname,'..',process.argv[2]||'index.html');
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(1500);
 await p.evaluate(()=>{if(!run){document.querySelector('[data-d=S]').click()}$('bm').dataset.m='';closeBase();PAUSE=false;if(S.pg&&!S.pg.tr.length)S.pg.tr=['cop'];if(typeof stop9=='function')stop9()});
 // raiders only in never-seen blocks
 let r=await p.evaluate(()=>{const R=Math.random;Math.random=()=>0;let a=0,bb=0;try{infGoto(20,0);S.inf.seen={};Z.length=0;infShift(1,0);a=Z.filter(z=>z.raider).length;Z.length=0;for(let x=10;x<40;x++)for(let y=-5;y<6;y++)S.inf.seen[x+','+y]='houses';infShift(1,0);bb=Z.filter(z=>z.raider).length}finally{Math.random=R}return{a,bb}});
 ok(r.a>0&&r.bb==0,'a raider group turns up in a new block ('+r.a+') but not in blocks you have seen ('+r.bb+')');
 // blood and bodies: kept per block, trimmed
 r=await p.evaluate(()=>{infGoto(5,0);Z.length=0;dec.length=0;const x=S.p.x,y=S.p.y;for(let i=0;i<50;i++){dec.push({k:'p',x:x+i,y:y+20,r:4+i%9});dec.push({k:'b',x:x+i,y:y+30,c:'#7d1212',s:2})}for(let i=0;i<20;i++)dec.push({k:'c',x:x+i*3,y:y+40,look:'civ1',f:false});
  const n0=dec.length;infGoto(5+9,0);const away=dec.filter(d=>Math.abs(d.y-(S.p.y+20))<40).length;infGoto(5,0);const back={p:dec.filter(d=>d.k=='p').length,b:dec.filter(d=>d.k=='b').length,c:dec.filter(d=>d.k=='c').length};return{n0,back}});
 ok(r.back.p>0&&r.back.p<=8&&r.back.b<=10&&r.back.c>0&&r.back.c<=6,'coming back: blood and bodies are still there but trimmed ('+JSON.stringify(r.back)+' of 50/50/20)');
 // raider bodies rise as zombies after a couple of game hours, not right away
 r=await p.evaluate(()=>{infGoto(6,0);Z.length=0;dec.length=0;S.sa=1e9;S.p.hp=1e5;const L=rSpawn(S.p.x+120,S.p.y,1);L.forEach(q=>q.hp=0);return new Promise(res=>setTimeout(()=>{const bodies=dec.filter(d=>d.k=='c'&&d.rz).length;infGoto(16,0);infGoto(6,0);const soon=Z.filter(z=>/Z$/.test(z.look)).length;const still=dec.filter(d=>d.k=='c'&&d.rz).length;
  infGoto(16,0);S.tt=(S.tt||0)+130;infGoto(6,0);const risen=Z.filter(z=>/Z$/.test(z.look));res({bodies,soon,still,risen:risen.length,look:risen[0]&&risen[0].look,zb:!!(risen[0]&&LOOKS[risen[0].look].zb)})},300))});
 ok(r.bodies>=2&&r.soon==0&&r.still==r.bodies,'raider bodies stay put if you come back soon ('+r.bodies+')');ok(r.risen==r.bodies&&r.zb,'two game hours later they rise as zombies ('+r.risen+', look '+r.look+')');
 // explosive countdown chip shows time and direction
 r=await p.evaluate(()=>{for(let d=1;d<30;d++)for(let a=-d;a<=d;a++)for(const[x,y]of[[a,-d],[a,d],[-d,a],[d,a]])if(['houses','apt'].includes(kindAt(x,y))){window.HB=[x,y];d=99;break}const[gx,gy]=HB;infGoto(gx,gy);Z.length=0;const bi=W0.b.findIndex(b=>b.gk==gx+','+gy&&DLV[b.kind]);const rf=W0.roofs.find(q=>q.bi==bi);S.p.x=rf.x+rf.w/2;S.p.y=rf.y+rf.h/2;give({dx1:1});demoWhole('boom');gearUpd(1/60);const near=$('boomc').textContent;infGoto(gx+3,gy);gearUpd(1/60);const far=$('boomc').textContent,shown=$('boomc').style.display;for(let i=0;i<60*11;i++)gearUpd(1/60);return{near,far,shown,after:$('boomc').style.display}});
 ok(/초/.test(r.near)&&/바로 여기/.test(r.near),'the countdown chip warns when you are right there ('+r.near+')');ok(/서쪽|북서쪽|남서쪽/.test(r.far)&&/m/.test(r.far)&&r.shown=='block'&&r.after=='none','far away it shows direction and distance, then hides after the blast ('+r.far+')');
 ok(!errs.length,'no page errors '+errs.join(' | '));await b.close()})();
