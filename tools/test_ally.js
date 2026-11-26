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
// variety: 9 roles with their own skills, 10 traits, grades, jobs-before, looks, lines
(async()=>{const {chromium,devices}=require('playwright');const b=await chromium.launch();const ctx=await b.newContext({...devices['Pixel 7']});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(1800);await p.evaluate(()=>{closeBase();scene9('al5')});await p.waitForTimeout(500);
 const r=await p.evaluate(()=>{const out={};const P=S.p;S.inf.allies=[];Z=Z.filter(z=>z.npc!='ally');const mkA=(role,gr)=>{const a=allyNew(null,role,gr);a.st='follow';aSync();return[a,aEnt(a)]};
  const ring=(z,n,d)=>{const L=[];for(let i=0;i<n;i++){mk(z.x+d+i*14,z.y+(i%2?8:-8),{look:'civ1'});L.push(Z[Z.length-1])}return L};
  /* shotgun hits several */{const[a,z]=mkA('sg');const L=ring(z,4,60);const h0=L.map(q=>q.hp);aShoot(a,z,L[0]);out.sg=L.filter((q,i)=>q.hp<h0[i]).length;L.forEach(q=>q.hp=0)}
  /* sniper pierces */{const[a,z]=mkA('snp');mk(z.x+200,z.y,{look:'civ1'});const q1=Z[Z.length-1];mk(z.x+260,z.y+4,{look:'civ1'});const q2=Z[Z.length-1];const h=[q1.hp,q2.hp];aShoot(a,z,q1);out.snp=[q1.hp<h[0],q2.hp<h[1]];q1.hp=0;q2.hp=0}
  /* scout finds things, engineer makes ammo */{const[a,z]=mkA('scout');z.skT=0;const n0=JSON.stringify(P.inv);aSkill(a,z,.016,[]);out.scout=JSON.stringify(P.inv)!=n0}
  {P.eq.sec='pistol';P.as='sec';const[a,z]=mkA('eng');z.skT=0;const am=AMMO_ITEM(W_BY.pistol[4].ammo),n0=P.inv[am]|0;aSkill(a,z,.016,[]);out.eng=(P.inv[am]|0)-n0}
  /* demolitionist throws at a group away from you */{const[a,z]=mkA('demo');z.skT=0;const L=ring({x:z.x+200,y:z.y},3,0);aSkill(a,z,.016,hostiles());out.demo=(S.aNade||[]).length;L.forEach(q=>q.hp=0)}
  /* shield slows what is next to him */{const[a,z]=mkA('shield');mk(z.x+30,z.y,{look:'civ1'});const q=Z[Z.length-1];aSkill(a,z,.016,[q]);out.shield=q.sm<1;q.hp=0}
  /* traits change numbers */{const a=allyNew(null,'gun',1);a.tr=[];const base=aMhp(a);a.tr=['tough'];out.tough=aMhp(a)>base;a.tr=['marks'];out.marks=aRng(a)>AROLE.gun.rng}
  /* variety: grades, traits, bios, looks */const G={},T=new Set(),B=new Set(),LK=new Set(),RO=new Set();for(let i=0;i<120;i++){const a=allyNew();G[a.gr]=(G[a.gr]|0)+1;a.tr.forEach(t=>T.add(t));B.add(a.bio);LK.add(JSON.stringify(a.app));RO.add(a.role);if(a.tr.length!=a.gr)out.trBad=1}
  out.var={G,traits:T.size,bios:B.size,looks:LK.size,roles:RO.size};return out});
 ok(r.sg>=3,'🔥 산탄수 hits several in a cone ('+r.sg+')');ok(r.snp[0]&&r.snp[1],'🎯 저격수 goes through two in a line');ok(r.scout,'🧭 정찰병 brings things');ok(r.eng>0,'🔧 정비공 makes ammo for your gun ('+r.eng+')');
 ok(r.demo>=1,'🧨 폭파병 throws a grenade at a group');ok(r.shield,'🛡 방패병 slows what is next to him');ok(r.tough&&r.marks,'traits change the numbers');
 ok(!r.trBad&&r.var.traits>=9&&r.var.bios>=15&&r.var.looks>=100&&r.var.roles==9&&r.var.G[1]>r.var.G[2]&&r.var.G[2]>(r.var.G[3]|0),'variety: '+JSON.stringify(r.var));
 await p.evaluate(()=>{closeBase();scene9('al4')});const dex=await p.evaluate(()=>document.querySelectorAll('#bm canvas[data-dl]').length);ok(dex==9,'companion guide shows all 9 roles');
 ok(!errs.length,'no page errors (variety) '+errs.slice(0,2));await b.close()})();
