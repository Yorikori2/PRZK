// Stage 2 behaviour checks
const {chromium}=require('playwright');const fs=require('fs');const OUT=process.argv[2]||'.';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()=='error')errs.push(m.text())});
await p.goto('file:///home/user/PRZK/index.html');await p.waitForTimeout(400);await p.evaluate(()=>{localStorage.clear();start('S',false);if(typeof S!='undefined'&&S&&S.pg&&!S.pg.tr.length){S.pg.tr=['cop'];$('bm').dataset.m='';closeBase();PAUSE=false}});
const R={};
// fire every weapon once at a dummy zombie in front of the player (logic level)
R.weapons=await p.evaluate(()=>{const P=S.p,out={};for(const w of WEAPONS){Z=[];P.x=BL.ox+470;P.y=BL.oy+430;P.fx=1;P.fy=0;P.ac=0;P.rl=0;P.st=100;
  const id=w[0],sl=slotFor(id);P.inv={};invAdd(P,id,3);P.eq[sl]=id;P.as=sl;if(w[4].ammo){const ai=AMMO_ITEM(w[4].ammo);invAdd(P,ai,200);P.mag[id]=w[4].mag||1}
  mk(P.x+Math.min(60,w[4].r*.5),P.y,{look:'civ1'});mk(P.x+Math.min(80,w[4].r*.6),P.y+4,{look:'civ2'});const z=Z[0],hp0=Z.reduce((a,q)=>a+q.hp,0);
  gearAct();for(let i=0;i<40;i++)gearUpd(.05);const hp1=Z.reduce((a,q)=>a+q.hp,0);
  out[id]={dmg:Math.round(hp0-hp1),mag:P.mag[id],left:P.inv[id]|0}}return out});
// reload from reserve
R.reload=await p.evaluate(()=>{const P=S.p;P.inv={};invAdd(P,'pistol',1);invAdd(P,'a9mm',20);P.eq.sec='pistol';P.as='sec';P.mag.pistol=0;P.rl=0;reload(P,true);const during=P.rl>0;for(let i=0;i<30;i++)reloadTick(P,.05);return{during,mag:P.mag.pistol,reserve:P.inv.a9mm}});
// melee durability break
R.durability=await p.evaluate(()=>{const P=S.p;P.inv={};invAdd(P,'knife',1);P.eq.mel='knife';P.as='mel';P.dur.knife=1;Z=[];mk(P.x+20,P.y,{look:'heavy'});P.ac=0;P.st=100;gearAct();return{has:P.inv.knife|0,as:P.as}});
// loot gives typed ammo, no generic 'ammo' left in inventory
R.loot=await p.evaluate(()=>{const P=S.p;P.inv={};let generic=0,typed={},weapons={};for(const kind of['police','mil','houses','hard','church','lab']){for(let i=0;i<60;i++){const r=resolveAmmo(roll(3,['ammo','scrap']),kind);lootExtra(r,kind,TIER[kind]||1,{});if(r.ammo)generic++;for(const k in r){if(k[0]=='a'&&I_BY[k])typed[k]=(typed[k]||0)+1;if(W_BY[k])weapons[k]=(weapons[k]||0)+1}}}return{generic,typed,weapons:Object.keys(weapons).length}});
// crafting with new recipes
R.craft=await p.evaluate(()=>{const P=S.p;P.inv={scrap:30,wood:10,cloth:10,fuel:3,elec:4};S.base.lv.bench=1;const before={...P.inv};['a9mm','a12g','molotov','pipe','bag1','aarrow','lure'].forEach(k=>cr(k));return{a9mm:P.inv.a9mm,a12g:P.inv.a12g,molotov:P.inv.molotov,pipe:P.inv.pipe,bag1:P.inv.bag1,aarrow:P.inv.aarrow,lure:P.inv.lure,scrapLeft:P.inv.scrap,eqBag:P.eq.bag}});
// weight slows movement
R.weight=await p.evaluate(()=>{const P=S.p;P.inv={};P.eq.bag='';invAdd(P,'scrap',80);return{w:weight(P),cap:capacity(P),mul:+speedMul(P).toFixed(2)}});
// turret uses typed ammo from stash
R.turret=await p.evaluate(()=>{S.base.lv.turret=1;S.base.lv.gen=1;rebuildBase();S.base.st={a556:5};const t=BP.find(o=>o.t=='turret');Z=[];mk(t.x+40,t.y+30,{look:'civ1'});for(let i=0;i<40;i++)upd(.05);return{left:S.base.st.a556,turrets:BP.filter(o=>o.t=='turret').length}});
// quick slot use + throwables
R.quick=await p.evaluate(()=>{const P=S.p;P.inv={bandage:2,grenade:1};P.hp=50;P.quick=['bandage','grenade','',''];useQuick(0);const hp=P.hp;useQuick(1);return{hp,as:P.as,thr:P.eq.thr}});
// old stage-1 save migrates
R.migrate=await p.evaluate(()=>{const old={...S,gv:undefined,p:{...S.p,inv:{ammo:30,rifle:1,shotgun:1,pistol:1,bat:1,vest:1,helmet:1,wood:5},eq:undefined,mag:undefined,dur:undefined,quick:undefined}};old.base={...S.base,st:{ammo:12,wood:3}};delete old.gv;localStorage.setItem(SAVE,JSON.stringify(old));start('S',true);
  return{inv:S.p.inv,eq:S.p.eq,stash:S.base.st,gv:S.gv}});
// save/load round trip keeps equipment and magazines
R.roundtrip=await p.evaluate(()=>{S.p.mag.ar=17;save();start('S',true);return{eq:S.p.eq,mag:S.p.mag.ar}});
// HUD renders and bag opens for every filter
R.ui=await p.evaluate(()=>{hud2();const ok=[];for(const f of['all','w','a','c','m','e']){BF=f;openBag();ok.push(document.querySelectorAll('#bm .cell').length)}closeBase();openCraft();const cr2=document.querySelectorAll('#bm .mod').length;closeBase();return{cells:ok,craftRows:cr2,wc:!!document.querySelector('#wc .wn'),qk:document.querySelectorAll('#qk .qs').length}});
// play: hold attack with rifle near zombies for a few seconds
await p.evaluate(()=>{const P=S.p;give({ar:1,a556:90});P.as='prim';P.mag.ar=30;P.hp=999;Z=[];for(let i=0;i<6;i++)mk(P.x+120+i*10,P.y-20+i*8,{look:'civ1',w:1})});
await p.evaluate(()=>{atk=true});await p.waitForTimeout(3000);await p.evaluate(()=>{atk=false});await p.screenshot({path:OUT+'/play.png'});
R.play=await p.evaluate(()=>({kills:S.kills,mag:S.p.mag.ar,res:S.p.inv.a556}));
R.errors=errs;fs.writeFileSync(OUT+'/s2b.json',JSON.stringify(R,null,1));console.log(JSON.stringify(R,null,1));await b.close()})();
