// HUD editor sample checks: smooth transform drag, edit bar fades while dragging, presets (default / left-handed / wide), HUD opacity
// usage: PG=uifix-sample.html node tools/test_uiedit2.js <outdir>
const {chromium}=require('playwright');const OUT=process.argv[2]||'.';const url='file://'+require('path').resolve(__dirname,'..',process.env.PG||'uifix-sample.html');
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
const box=(p,id)=>p.evaluate(id=>{const r=document.getElementById(id).getBoundingClientRect();return{x:Math.round(r.left),y:Math.round(r.top),w:Math.round(r.width),h:Math.round(r.height),r:Math.round(r.right),b:Math.round(r.bottom)}},id);
(async()=>{const b=await chromium.launch();
for(const[W,H]of[[412,860],[860,412]]){const tag=W<H?'세로':'가로';const p=await b.newPage({viewport:{width:W,height:H}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(url);await p.waitForTimeout(300);await p.evaluate(()=>{localStorage.clear();start('S',false);uiEdit(true)});await p.waitForTimeout(300);
 // smooth drag: left/top untouched mid-drag, transform follows the finger, bar fades
 const wc0=await box(p,'wc');await p.mouse.move(wc0.x+30,wc0.y+20);await p.mouse.down();await p.mouse.move(wc0.x+20,wc0.y+5,{steps:3});
 const L0=await p.evaluate(()=>document.getElementById('wc').style.left);let maxDev=0;
 for(let i=1;i<=30;i++){const tx=wc0.x+30-i*5,ty=wc0.y+20-i*6;await p.mouse.move(tx,ty);await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>r())));const c=await box(p,'wc');maxDev=Math.max(maxDev,Math.abs(c.x-(tx-30))+Math.abs(c.y-(ty-20)))}
 const mid=await p.evaluate(()=>({left:document.getElementById('wc').style.left,tf:document.getElementById('wc').style.transform,bar:getComputedStyle(document.getElementById('uiBar')).opacity,lift:document.getElementById('wc').classList.contains('uilift')}));
 ok(mid.left==L0&&/translate3d/.test(mid.tf),tag+' drag moves by transform only (no layout writes) '+mid.tf);ok(maxDev<=2,tag+' card follows finger every frame, max offset '+maxDev+'px');
 ok(mid.lift&&+mid.bar<.5,tag+' card lifted, edit bar faded to '+mid.bar);await p.screenshot({path:OUT+'/s2-drag-'+(W<H?'p':'l')+'.png'});
 await p.mouse.up();await p.waitForTimeout(250);const wc1=await box(p,'wc');
 ok(Math.abs(wc1.x-(wc0.x-150))<3&&Math.abs(wc1.y-(wc0.y-180))<3,tag+' drop position kept '+wc1.x+','+wc1.y);
 ok(await p.evaluate(()=>!document.body.classList.contains('uidrag')&&getComputedStyle(document.getElementById('uiBar')).opacity=='1'),tag+' edit bar back after release');
 // drag towards the corner is clamped inside the screen
 await p.mouse.move(wc1.x+10,wc1.y+10);await p.mouse.down();await p.mouse.move(W+50,H+50,{steps:10});await p.mouse.up();await p.waitForTimeout(200);const wc2=await box(p,'wc');
 ok(wc2.r<=W+1&&wc2.b<=H+1,tag+' clamped to screen '+JSON.stringify(wc2));
 // presets
 const def={};await p.evaluate(()=>uiPreset('def'));for(const id of['st','tr','sd','wc','qk','r'])def[id]=await box(p,id);
 await p.evaluate(()=>uiPreset('left'));await p.waitForTimeout(100);const L={};for(const id of['st','tr','sd','wc','qk','r'])L[id]=await box(p,id);
 ok(['st','tr','sd','wc','r'].every(id=>Math.abs(L[id].x-(W-def[id].r))<3&&Math.abs(L[id].y-def[id].y)<3),tag+' left-handed mirrors every panel');
 const atkL=await p.evaluate(()=>{const a=document.getElementById('atk').getBoundingClientRect(),c=document.getElementById('act').getBoundingClientRect();return a.left<c.left});ok(atkL,tag+' left-handed: attack button on the outer (left) side');
 await p.screenshot({path:OUT+'/s2-left-'+(W<H?'p':'l')+'.png'});
 await p.evaluate(()=>uiPreset('wide'));await p.waitForTimeout(100);const Wd={};for(const id of['st','tr','wc','qk','r'])Wd[id]=await box(p,id);
 ok(['st','tr','wc','r'].every(id=>Wd[id].w<def[id].w*.85),tag+' wide view shrinks panels');
 ok(Math.abs(Wd.st.x-def.st.x)<3&&Math.abs(Wd.tr.r-def.tr.r)<3&&Math.abs(Wd.r.b-def.r.b)<3,tag+' wide view keeps panels on their screen edges');
 ok(Wd.qk.b<=Wd.wc.y+1&&Wd.wc.y-Wd.qk.b<12,tag+' wide view: quick slots sit just above weapon card');
 await p.screenshot({path:OUT+'/s2-wide-'+(W<H?'p':'l')+'.png'});
 // overlap check for presets
 const ov=await p.evaluate(()=>{const out={};for(const k of['left','wide']){uiPreset(k);const rs=['st','tr','sd','qk','wc','r'].map(id=>[id,document.getElementById(id).getBoundingClientRect()]);const bad=[];
  for(let i=0;i<rs.length;i++)for(let j=i+1;j<rs.length;j++){const a=rs[i][1],c=rs[j][1];if(Math.min(a.right,c.right)-Math.max(a.left,c.left)>2&&Math.min(a.bottom,c.bottom)-Math.max(a.top,c.top)>2)bad.push(rs[i][0]+'×'+rs[j][0])}out[k]=bad}return out});
 ok(!ov.left.length&&!ov.wide.length,tag+' presets have no overlaps '+JSON.stringify(ov));
 // opacity
 await p.evaluate(()=>{const o=document.getElementById('uiOp');o.value=60;o.dispatchEvent(new Event('input'))});
 ok(await p.evaluate(()=>getComputedStyle(document.getElementById('wc')).opacity=='0.6'&&document.getElementById('uiOpV').textContent=='60%'),tag+' opacity slider 60%');
 await p.evaluate(()=>uiEdit(false));await p.waitForTimeout(200);
 // saved and restored after reload, left-handed flag per orientation
 await p.evaluate(()=>{uiEdit(true);uiPreset('left');uiEdit(false)});await p.reload();await p.waitForTimeout(300);await p.evaluate(()=>start('S',false));await p.waitForTimeout(300);
 const rel=await p.evaluate(()=>({op:getComputedStyle(document.getElementById('st')).opacity,left:document.body.classList.contains('uileft')}));ok(rel.op=='0.6'&&rel.left,tag+' opacity and left-handed layout persist after reload');
 const sdx=(await box(p,'sd')).x;ok(sdx>W/2,tag+' toolbar on the right after reload');
 ok(!errs.length,tag+' no page errors '+errs.join('|'));await p.close()}
await b.close()})();
