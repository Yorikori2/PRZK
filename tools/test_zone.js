// Sample: zones in cycles of three (strength · buildings · rare loot), demolition level = danger, alarms 50 %,
// subway tunnel to the next station, radio console (map · survivor signal → rescue).
const {chromium}=require('playwright');const path=require('path');const PAGE='file://'+path.resolve(__dirname,'..','inf-sample.html');
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(1800);await p.evaluate(()=>{closeBase();PAUSE=false;stop9()});
 const r=await p.evaluate(()=>{const hp=[0,1,2,3,4,5,6,9,30].map(z=>+zProf(z).hp.toFixed(2)),A=zCount(OLDK),B=zCount(kindAt),dz=c=>['gunshop','police','mil','prison','lab'].reduce((a,k)=>a+(c[k]|0),0)/zTot(c);
  /* peak-zone loot: search the same box many times in zone 0 and zone 3 */const st=zoneStep(),roll=zn=>{const o={x:0,y:0,w:20,h:20,t:'crate'},[ox,oy]=bo(zn*st-OGX,-OGY);o.x=ox+100;o.y=oy+100;let n=0;for(let i=0;i<400;i++){const r={};s3SearchRoll(o,'police',4,r);for(const k in r)if(/^(enh|orn|tkn)/.test(k))n++}return n};
  return{hp,near:dz(B.near),z0:dz(B[0]),z3:dz(B[3]),old0:dz(A[0]),avg:[0,1,2,3].map(z=>+zAvg(B[z]).toFixed(2)),l0:roll(0),l3:roll(3),dlv:['houses','school','clinic','police','mil','prison','gunshop','radio'].map(k=>DLV[k]),alr:[ALR.gunshop,ALR.bank,ALR.prison]}});
 ok(JSON.stringify(r.hp)==JSON.stringify([1,1.4,2.4,3,3.9,4.7,6,9,30]),'zombie health curve 1 · 1.4 · 2.4 · 3 · 3.9 · 4.7 · 6 … endless '+r.hp);
 ok(r.near==0&&r.z0==0&&r.old0>.05,'no dangerous buildings around the base or in zone 0 (was '+(r.old0*100).toFixed(0)+'%)');ok(r.z3>.12,'zone 3 (peak) has many dangerous buildings '+(r.z3*100).toFixed(0)+'%');
 ok(r.avg[0]<r.avg[1]&&r.avg[1]<r.avg[3],'average danger rises toward zone 3 '+r.avg);ok(r.l3>r.l0+20,'peak zones give rare loot (stones · runes · tokens) '+r.l0+' → '+r.l3);
 ok(JSON.stringify(r.dlv)=='[1,2,3,4,5,4,3,3]','demolition level follows the stars (Lv1 ~ Lv5) '+r.dlv);ok(r.alr.every(a=>a==.5),'gun shop · bank · prison alarms 50 %');
 /* subway tunnel */
 await p.evaluate(()=>scene9('mt'));await p.waitForTimeout(500);
 const m=await p.evaluate(()=>{const q=iaList().find(q=>/지하 터널/.test(q.t));if(!q)return{err:'no entry'};q.f();Z.length=0;const to=DUN.to.join(),up=W0.objs.find(o=>o.go);S.p.x=up.x+30;S.p.y=up.y+60;const u=iaList().find(q=>/다음 역/.test(q.t));if(!u)return{err:'no up'};u.f();return{to,at:gOf(S.p.x,S.p.y).join(),dun:!!DUN,stuck:!!blocker(S.p.x,S.p.y,7),kind:kindAt(...gOf(S.p.x,S.p.y))}});
 ok(m.to&&m.to==m.at&&!m.dun&&!m.stuck&&m.kind=='subway','tunnel: down at one station, up at the next station '+JSON.stringify(m));
 await p.evaluate(()=>{spd=1;scene9('mt')});await p.waitForTimeout(400);const w=await p.evaluate(()=>{iaList().find(q=>/지하 터널/.test(q.t)).f();Z.length=0;ky.d=1;return S.p.x});await p.waitForTimeout(1500);
 const w2=await p.evaluate(()=>{delete ky.d;const x=S.p.x;dunExit();return x});ok(w2-w>100,'you can walk along the tunnel');
 const hard=await p.evaluate(()=>{scene9('mt');const q=iaList().find(q=>/지하 터널/.test(q.t));q.f();const zn=Math.max(0,zoneOf(...DUN.from)),L=Z.filter(z=>z.metro),civ=L.find(z=>z.look=='civ1'||z.look=='civ2');const n=L.length;
  S.p.x=DUN.ox+DUN.W*.5;S.p.y=DUN.oy+300;gearUpd(.016);const amb=Z.filter(z=>z.metro).length-n;const brute=L.some(z=>z.look=='brute'&&z.x>DUN.ox+DUN.W-300);dunExit();return{n,amb,brute,zn}});
 ok(hard.n>=22&&hard.amb>=10&&hard.brute,'tunnel is hard: '+hard.n+' zombies two zones stronger, an ambush of '+hard.amb+' halfway, a brute at the exit');
 /* radio */
 await p.evaluate(()=>scene9('rd'));await p.waitForTimeout(400);
 const rd=await p.evaluate(()=>{S.p.inv.fuel=2;S.p.inv.elec=20;iaList().find(q=>/연료 넣기/.test(q.t)).f();const L=iaList().map(q=>q.t);const n0=Object.keys(S.inf.seen||{}).length;iaList().find(q=>/지도 받기/.test(q.t)).f();const x=[...document.querySelectorAll('#bm button')].find(b=>/✕/.test(b.textContent));x.click();const unp=!PAUSE;const n1=Object.keys(S.inf.seen).length;iaList().find(q=>/생존자 신호/.test(q.t)).f();const s=S.inf.sos;infGoto(s.gx,s.gy);sosPlace();const o=W0.objs.find(o=>o.t=='sosnpc');S.p.x=o.x+10;S.p.y=o.y+30;const q=iaList().find(q=>/구출/.test(q.t));const tk=S.p.inv.tkn|0;q.f();return{unp,L,map:n1-n0,saved:S.inf.saved,tk:(S.p.inv.tkn|0)-tk,again:iaList().length}});
 ok(rd.L.some(t=>/지도/.test(t))&&rd.L.some(t=>/생존자/.test(t)),'transmission tower: two choices '+rd.L);ok(rd.unp,'closing the map after the console: the game is not stuck');ok(rd.map>=100,'map: '+rd.map+' new blocks seen');ok(rd.saved==1&&rd.tk==15,'survivor found and rescued (reward)');
 for(const s of['zs','zg','zp','op','zb']){await p.evaluate(s=>scene9(s),s);await p.waitForTimeout(300)}
 ok(!errs.length,'no page errors '+errs.slice(0,3).join(' | '));await b.close()})();
// the tower's survivor signal is the [상호작용] action, its message stays ~8 s then goes; the minimap opens a big map
(async()=>{const {chromium,devices}=require('playwright');const b=await chromium.launch();const ctx=await b.newContext({...devices['Pixel 7']});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(1800);await p.evaluate(()=>{closeBase();scene9('rd')});await p.waitForTimeout(500);
 await p.evaluate(()=>{S.p.inv.fuel=2;S.p.inv.elec=20;iaList().find(q=>/연료 넣기/.test(q.t)).f();const e=$('sigM');if(e)e.remove()});await p.waitForTimeout(400);const hint=await p.evaluate(()=>$('iaHint').textContent);await p.evaluate(()=>ia());await p.waitForTimeout(300);const a=await p.evaluate(()=>({sos:!!S.inf.sos,box:!!$('sigM')}));
 await p.waitForTimeout(6500);const mid=await p.evaluate(()=>!!$('sigM'));await p.waitForTimeout(2500);const gone=await p.evaluate(()=>!$('sigM'));
 ok(/신호 찾기/.test(hint)&&a.sos&&a.box,'[상호작용] at the tower = find the survivor signal ('+hint+')');ok(mid&&gone,'the signal message stays about 8 s, then disappears');
 await p.tap('#mmw');await p.waitForTimeout(500);const m=await p.evaluate(()=>({open:!!$('bmap'),PAUSE,names:W0.b.filter(b=>KNAME[b.kind]).length}));await p.click('#bmX');await p.waitForTimeout(200);const c=await p.evaluate(()=>({open:!!$('bmap'),PAUSE}));
 ok(m.open&&m.PAUSE&&!c.open&&!c.PAUSE,'tapping the minimap opens the big map; ✕ closes it and the game goes on');ok(!errs.length,'no page errors (big map) '+errs.slice(0,2));await b.close()})();
// tower power (fuel → running, parts per use) · tunnel nests and the conductor boss · Lv4 / Lv5 tools · enemies on the map only with the radar · map pan and marks
(async()=>{const {chromium,devices}=require('playwright');const b=await chromium.launch();const ctx=await b.newContext({...devices['Pixel 7']});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(1800);await p.evaluate(()=>{closeBase();scene9('rd')});await p.waitForTimeout(400);
 const tw=await p.evaluate(()=>{const P=S.p;P.inv.fuel=1;P.inv.elec=10;const off=iaList().map(q=>q.t);iaList().find(q=>/연료 넣기/.test(q.t)).f();const on=iaList().map(q=>q.t);const e0=P.inv.elec;iaList().find(q=>/신호 찾기/.test(q.t)).f();return{off,on,fuel:P.inv.fuel,used:e0-P.inv.elec,sos:!!S.inf.sos}});
 ok(tw.off.some(t=>/연료 넣기/.test(t))&&!tw.off.some(t=>/신호 찾기 ·/.test(t)),'tower off: only "put fuel in" '+tw.off[0]);ok(tw.fuel==0&&tw.on.some(t=>/전자부품 3/.test(t))&&tw.used==3&&tw.sos,'fuel turns it on; the signal costs 3 parts');
 const mt=await p.evaluate(()=>{scene9('mt');iaList().find(q=>/지하 터널/.test(q.t)).f();const n=Z.filter(z=>z.mnest).length,bz=Z.find(z=>z.tboss);const t0=S.p.inv.tkn|0;hitZ(bz,1e9,0,0,1);return{n,boss:!!bz}});
 await p.waitForTimeout(500);const mt2=await p.evaluate(()=>({tkn:S.p.inv.tkn|0,alive:Z.some(z=>z.tboss&&z.hp>0)}));ok(mt.n>=2&&mt.boss&&!mt2.alive&&mt2.tkn>=30,'tunnel: '+mt.n+' nests, the conductor boss guards the exit and pays out when killed');
 const t45=await p.evaluate(()=>{dunExit();return{w:!!(W_BY.dt4&&W_BY.dt5),lv:[DT.dt4.lv,DT.dt5.lv],dlv:['police','prison','mil','lab','hosp'].map(k=>DLV[k])}});
 ok(t45.w&&t45.lv.join()=='4,5'&&t45.dlv.join()=='4,4,5,5,3','Lv4 / Lv5 tools; demolition level = stars '+t45.dlv);
 const hv=await p.evaluate(()=>{const P=S.p;P.eq.spec='';const a=hostileVis();give({radar:1});P.eq.spec='radar';const b2=hostileVis();return[a,b2]});ok(!hv[0]&&hv[1],'enemies show only with the tactical radar (or max watchtower)');
 await p.evaluate(()=>{closeBase();scene9('bm')});await p.waitForTimeout(1000);const box=await p.locator('#bmC').boundingBox();const v0=await p.evaluate(()=>[BM.vx,BM.vy]);
 await p.mouse.move(box.x+200,box.y+300);await p.mouse.down();await p.mouse.move(box.x+80,box.y+200,{steps:6});await p.mouse.up();const v1=await p.evaluate(()=>[BM.vx,BM.vy]);
 await p.click('#bmM');await p.mouse.click(box.x+150,box.y+150);const n1=await p.evaluate(()=>S.inf.marks.length);await p.mouse.click(box.x+150,box.y+150);const n2=await p.evaluate(()=>S.inf.marks.length);
 ok(Math.abs(v1[0]-v0[0])>50,'the map moves when you drag it');ok(n1==1&&n2==0,'mark mode: tap adds a mark, tap it again removes it');ok(!errs.length,'no page errors (tower · tunnel · map) '+errs.slice(0,2));await b.close()})();
// Lv4 / Lv5 crafting at the enh bench · option slots and demolition slot with only Lv4/Lv5 · the conductor's own drawing · subway line + fast travel · mark memo
(async()=>{const {chromium,devices}=require('playwright');const b=await chromium.launch();const ctx=await b.newContext({...devices['Pixel 7']});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(1800);await p.evaluate(()=>{closeBase();scene9('t45')});await p.waitForTimeout(800);
 const c=await p.evaluate(()=>{const L=dmCtx().map(q=>q.t);document.querySelector('[data-t45="dt4"]').click();const four=has(S.p,'dt4')&&!has(S.p,'dt3');document.querySelector('[data-t45="dt5"]').click();closeBase();PAUSE=false;
  for(const id of['dt1','dt1f','dt2','dt3'])delete S.p.inv[id];return{L,four,five:has(S.p,'dt5')&&!has(S.p,'dt4'),best:bestTool(),slots:[dSlots('dt4'),dSlots('dt5')],bind:!!Object.getOwnPropertyDescriptor(DT.dt5,'rng').get}});
 ok(c.L.some(t=>/철거 도구 제작/.test(t))&&c.four&&c.five,'enh bench: Lv3 → Lv4 → Lv5 by rebuilding the old tool');ok(c.best=='dt5'&&c.slots.join()=='4,4'&&c.bind,'with only Lv5: the demolition slot uses it, 4 option slots, options apply');
 const dm=await p.evaluate(()=>{demoMode(true);const r={mel:S.p.eq.mel,DEMO};demoMode(false);return r});ok(dm.mel=='dt5'&&dm.DEMO,'demolition mode with only the Lv5 tool');
 const tr=await p.evaluate(()=>{scene9('mt');const L=iaList().map(q=>q.t);const q=iaList().find(q=>/노선도/.test(q.t));q.f();const btn=document.querySelector('#bm [data-go]');const go=btn&&btn.dataset.go;btn.click();return{L,go}});
 await p.waitForTimeout(1600);const at=await p.evaluate(()=>gOf(S.p.x,S.p.y).join());ok(tr.go&&at==tr.go,'line map: fast travel along a cleared tunnel '+tr.go+' → '+at);
 const cd=await p.evaluate(()=>{scene9('mt');iaList().find(q=>/지하 터널/.test(q.t)).f();const bz=Z.find(z=>z.tboss);try{drawConductor(bz);return true}catch(e){return e.message}});ok(cd===true,'the conductor has its own drawing');
 await p.evaluate(()=>{dunExit();closeBase();scene9('bm')});await p.waitForTimeout(900);const box=await p.locator('#bmC').boundingBox();await p.click('#bmM');await p.fill('#bmN','약국 털기');await p.mouse.click(box.x+150,box.y+200);
 const mk2=await p.evaluate(()=>S.inf.marks.slice(-1)[0]);ok(mk2&&mk2.nm=='약국 털기','a mark keeps its memo');ok(!errs.length,'no page errors (tools · line · marks) '+errs.slice(0,2));await b.close()})();
