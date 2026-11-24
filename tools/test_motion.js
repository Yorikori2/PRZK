// 8-way facing + walk cycle, new turret art (endless city sample). usage: node tools/test_motion.js <outdir>
const {chromium}=require('playwright');const OUT=process.argv[2]||'.';const PAGE='file://'+require('path').resolve(__dirname,'..','inf-sample.html');
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);await p.evaluate(()=>{try{localStorage.clear()}catch(e){}});await p.reload();await p.waitForTimeout(1500);await p.evaluate(()=>stop9());
 let r=await p.evaluate(()=>{const m=[[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]].map(([x,y])=>dir8(x,y));const keep=dir8(1,.45,'r');return{m:m.join(','),keep}});
 ok(r.m=='r,dr,d,dl,l,ul,u,ur'&&r.keep=='r','8 facings, with a little stickiness on the borders '+r.m);
 r=await p.evaluate(()=>{const px=(d,f)=>{const c=document.createElement('canvas');c.width=36;c.height=40;const o=g;g=c.getContext('2d');person(LOOKS.player,d,f,'rifle');g=o;return c.toDataURL()};const dirs=new Set(D8.map(d=>px(d,0))),walk=new Set([0,1,2,3].map(f=>px('dr',f))),walk4=new Set([0,1,2,3].map(f=>px('d',f)));return{dirs:dirs.size,walk:walk.size,walk4:walk4.size}});
 ok(r.dirs==8,'8 different drawings for the 8 facings');ok(r.walk>=3&&r.walk4>=3,'walk cycle frames differ (diagonal '+r.walk+', front '+r.walk4+')');
 r=await p.evaluate(()=>{infGoto(0,0);Z.length=0;S.sa=1e9;mk(S.p.x+300,S.p.y+300,{look:'civ1',w:1});const z=Z[0];return new Promise(res=>setTimeout(()=>res({d8:z.d8,ph:z.ph>0}),1500))});ok(r.d8=='ul'&&r.ph,'a zombie walking up-left faces up-left and animates ('+r.d8+')');
 r=await p.evaluate(()=>{S.p.fx=-.7;S.p.fy=.7;return new Promise(res=>setTimeout(()=>res(S.p.d8),200))});ok(r=='dl','player faces down-left when aiming there ('+r+')');
 r=await p.evaluate(()=>{const o={};for(const t of['mg','sg','sn','fl','tz']){const c=document.createElement('canvas');c.width=60;c.height=60;const x=g;g=c.getContext('2d');turD({t:'turret',tt:t,x:8,y:20,w:44,h:30,tid:0,gk:'none'});g=x;o[t]=c.toDataURL()}return new Set(Object.values(o)).size});ok(r==5,'five turrets, five different drawings');
 r=await p.evaluate(()=>{const px=(d,f)=>{const c=document.createElement('canvas');c.width=36;c.height=40;const o=g;g=c.getContext('2d');person(LOOKS.civ1,d,f,null);g=o;return c.toDataURL()};return new Set([0,1,2,3,4,5,6,7].map(f=>px('d',f))).size});ok(r>=5,'walk cycle uses 8 smooth steps ('+r+' distinct)');
 r=await p.evaluate(()=>{const o={};for(const L of['spitter','burner','shocker','dog','crawler','bloater','brute','goliath','brood']){const set=new Set();for(const d of D8){const c=document.createElement('canvas');c.width=140;c.height=140;const x=g;g=c.getContext('2d');zDraw8({look:L,x:70,y:120,d8:d,mv:0,ph:0,dir:'r',hp:10,mhp:10});g=x;set.add(c.toDataURL())}o[L]=set.size}return o});
 ok(Object.values(r).every(n=>n>=5),'special zombies and bosses turn with their facing '+JSON.stringify(r));
 r=await p.evaluate(()=>{stop9();const gk=mkOp(['houses','apt'],{});const o=OP0()[gk];o.st.a9mm=100;o.turs=[{t:'mg',rx:BW/2,ry:BH/2-120,dir:0}];infRebuild();const q=o.turs[0];const a=[];for(let i=0;i<120;i++){gearUpd(1/60);if(i%30==0)a.push(+q.ha.toFixed(2))}
  opOpen();opTurRot(0,1);const d1=q.dir;closeBase();PAUSE=false;return{a,d1,moved:new Set(a).size>1}});
 ok(r.moved&&Math.abs(r.d1-Math.PI/4)<1e-6,'turret heads sweep on their own, and ↻ turns a turret 45° '+JSON.stringify(r));
 await p.evaluate(()=>scene9('mv8'));await p.waitForTimeout(3000);await p.screenshot({path:OUT+'/mv8.png'});await p.evaluate(()=>scene9('tart'));await p.waitForTimeout(4000);await p.screenshot({path:OUT+'/tart.png'});
 ok(!errs.length,'no page errors '+errs.join(' | '));await b.close()})();
