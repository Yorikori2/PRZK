// Explosive demolition keeps going when you walk away (window slides), and finishes properly when you come back.
// usage: node tools/test_boom.js
const {chromium}=require('playwright');const path=require('path');const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:860}});const E=[];p.on('pageerror',e=>E.push(e.message));
for(const page of['inf-sample.html','index.html']){await p.goto('file://'+path.resolve(__dirname,'..',page));await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(1500);
 const r=await p.evaluate(async()=>{if(!run){document.querySelector('[data-d=S]').click();$('bm').dataset.m='';closeBase();PAUSE=false}const f=(L)=>{for(let d=1;d<30;d++)for(let a=-d;a<=d;a++)for(const[x,y]of[[a,-d],[a,d],[-d,a],[d,a]])if(L.includes(kindAt(x,y)))return[x,y]};
  const res={};for(const mode of['near','far','back']){const[gx,gy]=f(['houses','apt']);infGoto(gx,gy);Z.length=0;S.p.hp=1e5;const bi=W0.b.findIndex(b=>b.gk==gx+','+gy&&DLV[b.kind]);const rf=W0.roofs.find(q=>q.bi==bi);S.p.x=rf.x+rf.w/2;S.p.y=rf.y+rf.h/2;
   give({dx1:1});demoWhole('boom');const gk=gx+','+gy;if(mode=='far')infGoto(gx+6,gy);if(mode=='back'){infGoto(gx+6,gy);for(let i=0;i<60*4;i++)gearUpd(1/60);infGoto(gx,gy)}
   for(let i=0;i<60*12;i++){gearUpd(1/60);S.p.hp=1e5}const done=!!(S.inf.demo&&S.inf.demo[gk]);if(mode!='near')infGoto(gx,gy);res[mode]=done&&W0.b.some(b=>b.gk==gk&&b.kind=='lot')}return res});
 ok(r.near,page+': explosives level the building');ok(r.far,page+': walking far away does not cancel the blast (it finishes out of view)');ok(r.back,page+': walking away and coming back before the blast still levels it')}
ok(!E.length,'no page errors '+E.join(' | '));await b.close()})();
