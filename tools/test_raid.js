// Raiders (endless city sample). usage: node tools/test_raid.js <outdir>
const {chromium}=require('playwright');const OUT=process.argv[2]||'.';const PAGE='file://'+require('path').resolve(__dirname,'..','inf-sample.html');
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);await p.evaluate(()=>{try{localStorage.clear()}catch(e){}});await p.reload();await p.waitForTimeout(1500);await p.evaluate(()=>stop9());
 let r=await p.evaluate(()=>{const o={};for(const zn of[1,2,3,4,5,7]){infGoto(zn*zoneStep()+1,0);Z.length=0;const L=rSpawn(S.p.x+300,S.p.y,zn);o[zn]={n:L.length,hp:L.map(q=>q.mhp),arm:L[0].arm,w:L.map(q=>q.wid).join(','),lead:L.some(q=>q.lead)}}Z.length=0;return o});
 ok(r[1].w.split(',').every(w=>['pipe','machete','bat'].includes(w))&&r[1].arm==1&&r[1].hp[0]==100,'zone 1: melee only, no armour, 100 HP (as much as the player) '+r[1].w);
 ok(/pistol|pump/.test(r[2].w)&&r[2].arm==.85&&r[3].arm==.75&&r[4].arm==.65,'zones 2-4: guns and better armour '+[r[2].w,r[3].w,r[4].w].join(' | '));
 ok(/sniper/.test(r[4].w)&&r[5].lead&&/lmg/.test(r[5].w)&&r[7].hp[0]==r[5].hp[0],'zone 4 brings a sniper, zone 5+ a machine gun and a leader (no extra strengthening after that)');
 // fight: they shoot the player, armour cuts damage, kills drop loot
 r=await p.evaluate(()=>{stop9();infGoto(2*zoneStep()+1,0);Z.length=0;S.sa=1e9;const pl=S.p;pl.hp=1e5;const L=rSpawn(pl.x+170,pl.y,2);const q=L[0];const h0=q.hp;hitZ(q,100,1,0,1);const took=h0-q.hp;return{took}});
 ok(Math.abs(r.took-85)<1,'armour: 100 damage → '+r.took+' on a zone 2 raider');
 await p.waitForTimeout(4000);r=await p.evaluate(()=>({hit:S.rHitP|0,alive:Z.filter(z=>z.raider).length}));ok(r.hit>0,'raiders shoot the player ('+r.hit+' hits in 4 s)');
 r=await p.evaluate(()=>{if(!Z.some(z=>z.raider))rSpawn(S.p.x+170,S.p.y,2);const k0=S.rKills|0;const inv0=JSON.stringify(S.p.inv);for(const z of Z)if(z.raider)z.hp=0;return new Promise(res=>setTimeout(()=>res({kills:(S.rKills|0)-k0,got:JSON.stringify(S.p.inv)!=inv0,left:Z.filter(z=>z.raider).length}),300))});ok(r.kills>=3&&r.got&&r.left==0,'killed raiders leave loot ('+r.kills+' kills)');
 // leader down → the rest run off
 r=await p.evaluate(()=>{stop9();infGoto(5*zoneStep()+1,0);Z.length=0;S.sa=1e9;S.p.hp=1e5;const L=rSpawn(S.p.x+250,S.p.y,5);const ld=L.find(q=>q.lead);ld.hp=0;return new Promise(res=>setTimeout(()=>res({fled:L.filter(q=>!q.lead).every(q=>q.grp.fled)}),400))});ok(r.fled,'when the leader falls the rest flee');
 // zombies fight raiders
 r=await p.evaluate(()=>{stop9();infGoto(16,0);Z.length=0;S.sa=1e9;S.p.hp=1e5;const pl=S.p;const L=rSpawn(pl.x+600,pl.y,1);const h=L.reduce((a,q)=>a+q.hp,0);for(let i=0;i<6;i++)mk(L[0].x+10+i*4,L[0].y+6,{look:'civ1'});window.RL=L;window.RH=h;return 1});await p.waitForTimeout(3500);
 r=await p.evaluate(()=>({lost:RH-RL.reduce((a,q)=>a+Math.max(0,q.hp),0),zhurt:Z.filter(z=>!z.raider&&z.hp<z.mhp).length+(S.kills|0)}));ok(r.lost>0&&r.zhurt>0,'raiders and zombies hurt each other ('+Math.round(r.lost)+' raider HP lost)');
 // turrets shoot raiders at an outpost
 await p.evaluate(()=>{stop9();scene9('rop')});await p.waitForTimeout(9000);r=await p.evaluate(()=>{const o=Object.values(OP0())[0];return{kills:S.rKills|0,hp:o.hp,dn:Z.filter(z=>z.raider).length}});ok(r.kills>0||r.dn<3,'outpost turrets fight off raiders (kills '+r.kills+', outpost '+Math.round(r.hp)+'%)');
 await p.screenshot({path:OUT+'/raid-op.png'});await p.evaluate(()=>{stop9();scene9('r4')});await p.waitForTimeout(3500);await p.screenshot({path:OUT+'/raid-r4.png'});
 r=await p.evaluate(()=>{stop9();infGoto(16,0);Z.length=0;S.sa=1e9;S.p.hp=1e5;const L=rSpawn(S.p.x+260,S.p.y,1);L.forEach(q=>q.state='fight');window.QSEEN=new Set();window.QDC=drawChar;drawChar=function(look,x,y,dir,fr){if(/^rd/.test(look))QSEEN.add(dir+':'+fr);return QDC.apply(this,arguments)};return 1});
 await p.waitForTimeout(2500);r=await p.evaluate(()=>{drawChar=QDC;const fr=new Set([...QSEEN].map(s=>s.split(':')[1]));return{frames:fr.size,walking:[...fr].some(f=>+f>=0)}});ok(r.walking&&r.frames>=4,'raiders are drawn walking ('+r.frames+' different frames while they approach)');
 ok(!errs.length,'no page errors '+errs.join(' | '));await b.close()})();
