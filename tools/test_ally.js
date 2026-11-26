// Sample: NPC companions — rescue → join, follow and fight, never your target, go down → revive, base jobs (guard · scavenge · heal), level up.
const {chromium,devices}=require('playwright');const path=require('path');const PAGE='file://'+path.resolve(__dirname,'..','inf-sample.html');
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({...devices['Pixel 7']});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(1800);
 /* rescue → companion */
 await p.evaluate(()=>{closeBase();scene9('al3')});await p.waitForTimeout(400);
 const r=await p.evaluate(()=>{iaList().find(q=>/연료 넣기/.test(q.t)).f();iaList().find(q=>/신호 찾기/.test(q.t)).f();const s=S.inf.sos;infGoto(s.gx,s.gy);sosPlace();const o=W0.objs.find(o=>o.t=='sosnpc');S.p.x=o.x+10;S.p.y=o.y+30;iaList().find(q=>/구출/.test(q.t)).f();return{n:S.inf.allies.length,nm:S.inf.allies[0]&&S.inf.allies[0].nm,st:S.inf.allies[0]&&S.inf.allies[0].st}});
 ok(r.n==1&&r.st=='base','a rescued survivor joins as a companion at the base ('+r.nm+')');
 /* follow and fight */
 await p.evaluate(()=>{closeBase();scene9('al')});await p.waitForTimeout(1800);const z0=await p.evaluate(()=>Z.filter(z=>!z.npc&&z.hp>0).length);await p.waitForTimeout(7000);
 const f=await p.evaluate(()=>({z:Z.filter(z=>!z.npc&&z.hp>0).length,ents:Z.filter(z=>z.npc=='ally').map(z=>Math.round(Math.hypot(z.x-S.p.x,z.y-S.p.y))),xp:S.inf.allies.slice(0,2).map(a=>a.xp+a.lv*1000),tgAlly:!!(S.tg&&S.tg.npc)}));
 ok(f.ents.filter(d=>d<400).length>=2,'two companions stay with you '+f.ents);ok(f.z<z0,'they fight: zombies '+z0+' → '+f.z);ok(!f.tgAlly,'your aim never picks a companion');
 /* your shots do not hurt them, they can go down and be revived */
 const d=await p.evaluate(()=>{const a=S.inf.allies[0];a.st='follow';a.hp=aMhp(a);aSync();const z=Z.find(q=>q.npc=='ally'&&q.ally==a.id);const h0=a.hp;hitZ(z,9999,0,0,1);const safe=a.hp==h0;a.hp=0;gearUpd(.016);const down=a.st;S.p.x=z.x+10;S.p.y=z.y+10;S.p.inv.bandage=2;const q=iaList().find(q=>/일으키기/.test(q.t));if(q)q.f();return{safe,down,after:a.st,hp:a.hp}});
 ok(d.safe,'your shots never hurt a companion');ok(d.down=='down'&&d.after=='follow'&&d.hp>0,'down at 0 hp → revived with a bandage');
 /* base: jobs */
 await p.evaluate(()=>{closeBase();scene9('al2')});await p.waitForTimeout(500);
 const j=await p.evaluate(()=>{closeBase();PAUSE=false;const L=S.inf.allies;const h0=S.p.hp;aSet(L[0],'job','scav');aSet(L[1],'job','guard');const inv0=JSON.stringify(S.p.inv);S.day++;gearUpd(.016);const got=JSON.stringify(S.p.inv)!=inv0;return{h0,got,ents:Z.filter(z=>z.npc=='ally').length}});
 await p.waitForTimeout(2000);const h1=await p.evaluate(()=>S.p.hp);ok(j.got,'scavenger comes back next morning with supplies');ok(h1>j.h0+3,'medic on the heal job refills you at the base '+Math.round(j.h0)+' → '+Math.round(h1));ok(j.ents==2,'scavenger is away, the other two stand at the base');
 const lv=await p.evaluate(()=>{const a=S.inf.allies[1];const l0=a.lv;a.xp=aNext(a)-1;const z={x:0,y:0,lastAlly:a.id,look:'civ1'};kill(z);return[l0,a.lv]});ok(lv[1]==lv[0]+1,'companions level up from their kills');
 await p.evaluate(()=>{aOpen()});const sheet=await p.evaluate(()=>$('bm').dataset.m);ok(sheet=='ally','companion sheet opens');
 ok(!errs.length,'no page errors '+errs.slice(0,3).join(' | '));await b.close()})();
// variety: 5 roles (사수 · 돌격 · 의무병 · 정찰병 · 방패병), traits, grades, looks · 사수 uses any weapon · mastery F → S for you and them · shields (5 grades, pistols only)
(async()=>{const {chromium,devices}=require('playwright');const b=await chromium.launch();const ctx=await b.newContext({...devices['Pixel 7']});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(1800);await p.evaluate(()=>{closeBase();scene9('al5')});await p.waitForTimeout(500);
 const r=await p.evaluate(()=>{const out={};const P=S.p;S.inf.allies=[];Z=Z.filter(z=>z.npc!='ally');const mkA=(role,gr)=>{const a=allyNew(null,role,gr);a.st='follow';aSync();return[a,aEnt(a)]};
  out.roles=Object.keys(AROLE).sort().join();
  /* gunner with a shotgun hits several, and learns it */{const[a,z]=mkA('gun');a.wpn='pump';a.mast={pump:MXP[6]};const L=[];for(let i=0;i<4;i++){mk(z.x+60+i*14,z.y+(i%2?8:-8),{look:'civ1'});L.push(Z[Z.length-1])}const h0=L.map(q=>q.hp);aShoot(a,z,L[0]);out.sg=L.filter((q,i)=>q.hp<h0[i]).length;L.forEach(q=>q.hp=0)}
  {const[a,z]=mkA('gun');a.mast={};mk(z.x+80,z.y,{look:'civ1'});const q=Z[Z.length-1];for(let i=0;i<10;i++){q.hp=1e6;aShoot(a,z,q)}out.gunXp=a.mast[aWid(a)]|0;q.hp=0}
  /* scout finds things · shield bearer has a shield and slows */{const[a,z]=mkA('scout');z.skT=0;const n0=JSON.stringify(P.inv);aSkill(a,z,.016,[]);out.scout=JSON.stringify(P.inv)!=n0}
  {const[a,z]=mkA('shield');mk(z.x+30,z.y,{look:'civ1'});const q=Z[Z.length-1];aSkill(a,z,.016,[q]);out.shield=q.sm<1&&a.shd=='shd2';q.hp=0}
  /* mastery: hit chance F → S, ranks */out.hit=[mHit('pistol',0),mHit('pistol',6),mHit('pistol',0,280,300)];out.ranks=MRK.join('');
  /* misses at F happen, almost never at S */{const roll=rk=>{let miss=0;const M=MAST();M.pistol=MXP[rk];for(let i=0;i<300;i++){mk(P.x+60,P.y,{look:'civ1'});const q=Z[Z.length-1];q.hp=1e6;const h=q.hp;MCTX={who:'p',id:'pistol',x:P.x,y:P.y,rng:200};hitZ(q,5,1,0,1);MCTX=null;if(q.hp==h)miss++;q.hp=0}return miss};out.missF=roll(0);out.missS=roll(6)}
  /* shields */out.shd=Object.keys(SHD).map(k=>I_BY[k][3]).join('');give({shd1:1,ar:1,pistol:1});P.eq.shd='shd1';P.eq.prim='ar';P.eq.sec='pistol';P.as='prim';gearUpd(.016);out.only=actW(P);P.hp=100;hurtP(20,'t');out.blk=Math.round(100-P.hp);P.eq.shd='';
  const G={},T=new Set(),LK=new Set(),RO=new Set();for(let i=0;i<120;i++){const a=allyNew();G[a.gr]=(G[a.gr]|0)+1;a.tr.forEach(t=>T.add(t));LK.add(JSON.stringify(a.app));RO.add(a.role);if(a.tr.length!=a.gr)out.trBad=1}out.var={G,traits:T.size,looks:LK.size,roles:RO.size};return out});
 ok(r.roles=='gun,med,mel,scout,shield','roles: 사수 · 돌격 · 의무병 + 정찰병 · 방패병 only ('+r.roles+')');ok(r.sg>=3,'a gunner given a shotgun hits several ('+r.sg+')');ok(r.gunXp>=5,'the gunner gains mastery with the weapon in hand ('+r.gunXp+')');
 ok(r.scout,'정찰병 brings things');ok(r.shield,'방패병 carries a shield and slows');ok(r.ranks=='FEDCBAS'&&r.hit[0]<.8&&r.hit[1]>.95&&r.hit[2]<r.hit[0],'hit chance rises F → S, far shots miss more at low rank '+r.hit.map(x=>x.toFixed(2)));
 ok(r.missF>40&&r.missS<25,'misses: F '+r.missF+'/300 · S '+r.missS+'/300');ok(r.shd=='curel','shields in the weapon grades (일반 → 전설)');ok(r.only=='pistol','holding a shield: pistols only');ok(r.blk<20,'the shield takes part of the hit (20 → '+r.blk+')');
 ok(!r.trBad&&r.var.traits>=9&&r.var.looks>=100&&r.var.roles==5,'variety: '+JSON.stringify(r.var));
 await p.evaluate(()=>{closeBase();scene9('ms')});await p.waitForTimeout(600);const ms=await p.evaluate(()=>({m:$('bm').dataset.m,rows:document.querySelectorAll('#bm .mR').length}));ok(ms.m=='mast'&&ms.rows>=5,'mastery sheet lists your weapons and tools ('+ms.rows+')');
 await p.evaluate(()=>{closeBase();scene9('al4')});const dex=await p.evaluate(()=>document.querySelectorAll('#bm canvas[data-dl]').length);ok(dex==5,'companion guide shows the 5 roles');
 ok(!errs.length,'no page errors (variety · mastery · shields) '+errs.slice(0,2));await b.close()})();
// S-rank bonuses per weapon kind · shield durability (wear, worn, broken, repair at the workbench)
(async()=>{const {chromium,devices}=require('playwright');const b=await chromium.launch();const ctx=await b.newContext({...devices['Pixel 7']});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(1800);await p.evaluate(()=>{closeBase();scene9('msS')});await p.waitForTimeout(700);
 const r=await p.evaluate(()=>{closeBase();PAUSE=false;const P=S.p,M=MAST(),out={};const one=(id,setup)=>{mk(P.x+60,P.y,{look:'civ1'});const q=Z[Z.length-1];setup&&setup(q);MCTX={who:'p',id,x:P.x,y:P.y,rng:300};try{hitZ(q,10,1,0,1)}finally{MCTX=null}return q};
  /* pistol S: some headshots (x2.5) */let big=0;for(let i=0;i<200;i++){const q=one('pistol',q=>{q.hp=1e6;q.mhp=1e6});if(1e6-q.hp>20)big++;q.hp=0}out.head=big;
  /* pistol F: none */M.pistol=0;big=0;for(let i=0;i<200;i++){const q=one('pistol',q=>{q.hp=1e6;q.mhp=1e6});if(1e6-q.hp>20)big++;q.hp=0}out.headF=big;M.pistol=MXP[6];
  /* machete S: execute */{const q=one('machete',q=>{q.mhp=100;q.hp=24});out.exec=q.hp<=0}
  /* rifle S: the one behind is hit too */{mk(P.x+60,P.y,{look:'civ1'});const q=Z[Z.length-1];mk(P.x+120,P.y,{look:'civ1'});const t=Z[Z.length-1];q.hp=t.hp=1e6;const h=t.hp;MCTX={who:'p',id:'ar',x:P.x,y:P.y,rng:300};try{for(let i=0;i<6;i++)hitZ(q,10,1,0,1)}finally{MCTX=null}out.pierce=t.hp<h;q.hp=t.hp=0}
  /* sniper S vs elite */{mk(P.x+60,P.y,{look:'heavy'});const q=Z[Z.length-1];q.hp=1e6;let mx=0;for(let i=0;i<8;i++){const h=q.hp;MCTX={who:'p',id:'hunting',x:P.x,y:P.y,rng:400};try{hitZ(q,10,1,0,1)}finally{MCTX=null}mx=Math.max(mx,h-q.hp)}out.elite=mx;q.hp=0}
  return out});
 ok(r.head>10&&r.headF==0,'pistol S: headshots ('+r.head+'/200) · at F none');ok(r.exec,'melee S: a nearly-dead zombie is executed');ok(r.pierce,'rifle S: the zombie behind is hit too');ok(r.elite>=15,'sniper S: +60% on elites ('+r.elite+' from 10)');
 await p.evaluate(()=>{closeBase();scene9('shd2')});await p.waitForTimeout(600);
 const s=await p.evaluate(()=>{const P=S.p,M=MAST();const worn=shdBlock('shd3',M);P.hp=100;const d0=shdHp('shd3');hurtP(40,'t');const d1=shdHp('shd3');SHDST().shd3=1;hurtP(40,'t');const broke=shdHp('shd3')==0&&shdBlock('shd3',M)==0;const L=iaList().map(q=>q.t);const sc=P.inv.scrap;iaList().find(q=>/방패 수리 · 강화/.test(q.t)).f();return{worn,wear:d0-d1,broke,menu:L.some(t=>/방패 수리/.test(t)),fixed:shdHp('shd3')==SHDHP.shd3,paid:sc-P.inv.scrap,full:shdBlock('shd3',M),hud:!!$('shdHud')}});
 ok(s.wear>0,'a block wears the shield ('+s.wear+')');ok(s.worn<s.full,'below 25%: blocks less ('+s.worn.toFixed(2)+' < '+s.full.toFixed(2)+')');ok(s.broke,'at 0 the shield is broken and blocks nothing');
 ok(s.menu&&s.fixed&&s.paid>0,'repair at the base workbench for scrap (+steel / parts by grade)');ok(s.hud,'shield durability shows on screen');ok(!errs.length,'no page errors (S bonus · durability) '+errs.slice(0,2));await b.close()})();
// the shield bearer's shield wears and is mended overnight at the base · mastery belongs to each person (giving your S-rank weapon does not give your rank)
(async()=>{const {chromium,devices}=require('playwright');const b=await chromium.launch();const ctx=await b.newContext({...devices['Pixel 7']});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(1800);await p.evaluate(()=>{closeBase();scene9('al2')});await p.waitForTimeout(500);
 const r=await p.evaluate(()=>{closeBase();PAUSE=false;const out={};S.inf.allies=[];Z=Z.filter(z=>z.npc!='ally');const a=allyNew('경호','shield',1);a.st='follow';aSync();const z=aEnt(a);
  mk(z.x+15,z.y,{look:'civ1'});const q=Z[Z.length-1];q.dmg=40;const d0=shdRatioAlly(a);for(let i=0;i<120;i++)aThink(a,z,.05);out.wore=shdRatioAlly(a)<d0;q.hp=0;
  a.shdHp=0;out.broken=shdBlockAlly(a)==0;a.hp=aMhp(a);a.st='base';S.inf.allyDay=S.day;S.day++;aDaily();out.mended=a.shdHp==SHDHP[a.shd];
  /* mastery is personal */const g=allyNew('사수','gun',1);MAST().pump=MXP[6];give({pump:1});g.wpn='pump';out.playerRank=mRank(MAST().pump);out.allyRank=mRank((g.mast||{}).pump|0);
  out.allyHit=mHit('pump',out.allyRank);out.playerHit=mHit('pump',out.playerRank);return out});
 ok(r.wore,'the shield bearer\'s shield wears while blocking');ok(r.broken,'a broken companion shield blocks nothing');ok(r.mended,'a night at the base mends it');
 ok(r.playerRank==6&&r.allyRank==0&&r.allyHit<r.playerHit,'mastery is personal: your S-rank shotgun given to a gunner starts at their F ('+r.allyHit.toFixed(2)+' vs your '+r.playerHit.toFixed(2)+')');
 ok(!errs.length,'no page errors (companion shield) '+errs.slice(0,2));await b.close()})();
// mastery does not double-count: a real shot = +1, the killing shot = +1 +4, nothing goes to the player's level xp, a companion's hit only to the companion
(async()=>{const {chromium,devices}=require('playwright');const b=await chromium.launch();const ctx=await b.newContext({...devices['Pixel 7']});const p=await ctx.newPage();
 await p.goto(PAGE);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(1800);
 await p.evaluate(()=>{closeBase();scene9('al');PAUSE=false;const P=S.p,M=MAST();for(const k in M)delete M[k];give({pistol:1,a9mm:50});P.eq.sec='pistol';P.as='sec';P.mag.pistol=12;M.pistol=MXP[6];window.__m0=M.pistol;window.__x0=S.pg.xp;
  mk(P.x+80,P.y,{look:'civ1'});const q=Z[Z.length-1];q.hp=q.mhp=1e6;S.tg=q;S.tgIn=true;const _r=Math.random;Math.random=()=>.5;try{for(let i=0;i<5;i++){P.ac=0;P.rl=0;gearAct()}window.__h=M.pistol-__m0;window.__k0=M.pistol;q.hp=1;P.ac=0;gearAct()}finally{Math.random=_r}
  const a=S.inf.allies[0];aSync();const z=aEnt(a);a.mast={};window.__pm=M[aWid(a)]|0;mk(z.x+60,z.y,{look:'civ1'});const q2=Z[Z.length-1];q2.hp=q2.mhp=1e6;Math.random=()=>.01;try{aShoot(a,z,q2)}finally{Math.random=_r}window.__a=a});
 await p.waitForTimeout(800);const r=await p.evaluate(()=>({hits:__h,kill:MAST().pistol-__k0,lvl:S.pg.xp-__x0,ally:__a.mast[aWid(__a)]|0,toPlayer:(MAST()[aWid(__a)]|0)-__pm}));
 ok(r.hits==5,'5 hits = +5 mastery (no double count)');ok(r.kill==5,'the killing shot = +1 hit +4 kill, once');ok(r.toPlayer==0&&r.ally==1,'a companion\'s hit goes only to the companion');await b.close()})();
