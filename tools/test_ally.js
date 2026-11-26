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
 const d=await p.evaluate(()=>{const a=S.inf.allies[0],z=Z.find(q=>q.npc=='ally'&&q.ally==a.id);const h0=a.hp;hitZ(z,9999,0,0,1);const safe=a.hp==h0;a.hp=0;gearUpd(.016);const down=a.st;S.p.x=z.x+10;S.p.y=z.y+10;S.p.inv.bandage=2;const q=iaList().find(q=>/일으키기/.test(q.t));if(q)q.f();return{safe,down,after:a.st,hp:a.hp}});
 ok(d.safe,'your shots never hurt a companion');ok(d.down=='down'&&d.after=='follow'&&d.hp>0,'down at 0 hp → revived with a bandage');
 /* base: jobs */
 await p.evaluate(()=>{closeBase();scene9('al2')});await p.waitForTimeout(500);
 const j=await p.evaluate(()=>{closeBase();PAUSE=false;const L=S.inf.allies;const h0=S.p.hp;aSet(L[0],'job','scav');aSet(L[1],'job','guard');const inv0=JSON.stringify(S.p.inv);S.day++;gearUpd(.016);const got=JSON.stringify(S.p.inv)!=inv0;return{h0,got,ents:Z.filter(z=>z.npc=='ally').length}});
 await p.waitForTimeout(2000);const h1=await p.evaluate(()=>S.p.hp);ok(j.got,'scavenger comes back next morning with supplies');ok(h1>j.h0+3,'medic on the heal job refills you at the base '+Math.round(j.h0)+' → '+Math.round(h1));ok(j.ents==2,'scavenger is away, the other two stand at the base');
 const lv=await p.evaluate(()=>{const a=S.inf.allies[1];const l0=a.lv;a.xp=aNext(a)-1;const z={x:0,y:0,lastAlly:a.id,look:'civ1'};kill(z);return[l0,a.lv]});ok(lv[1]==lv[0]+1,'companions level up from their kills');
 await p.evaluate(()=>{aOpen()});const sheet=await p.evaluate(()=>$('bm').dataset.m);ok(sheet=='ally','companion sheet opens');
 ok(!errs.length,'no page errors '+errs.slice(0,3).join(' | '));await b.close()})();
