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
 ok(JSON.stringify(r.dlv)=='[1,2,3,3,3,3,3,3]','demolition level follows the stars (tools stop at Lv3) '+r.dlv);ok(r.alr.every(a=>a==.5),'gun shop · bank · prison alarms 50 %');
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
 const rd=await p.evaluate(()=>{const L=iaList().map(q=>q.t);const n0=Object.keys(S.inf.seen||{}).length;iaList().find(q=>/지도 받기/.test(q.t)).f();const x=[...document.querySelectorAll('#bm button')].find(b=>/✕/.test(b.textContent));x.click();const unp=!PAUSE;const n1=Object.keys(S.inf.seen).length;iaList().find(q=>/생존자 신호/.test(q.t)).f();const s=S.inf.sos;infGoto(s.gx,s.gy);sosPlace();const o=W0.objs.find(o=>o.t=='sosnpc');S.p.x=o.x+10;S.p.y=o.y+30;const q=iaList().find(q=>/구출/.test(q.t));const tk=S.p.inv.tkn|0;q.f();return{unp,L,map:n1-n0,saved:S.inf.saved,tk:(S.p.inv.tkn|0)-tk,again:iaList().length}});
 ok(rd.L.some(t=>/지도/.test(t))&&rd.L.some(t=>/생존자/.test(t)),'console: two choices '+rd.L);ok(rd.unp,'closing the map after the console: the game is not stuck');ok(rd.map>=100,'map: '+rd.map+' new blocks seen');ok(rd.saved==1&&rd.tk==15,'survivor found and rescued (reward)');
 for(const s of['zs','zg','zp','op','zb']){await p.evaluate(s=>scene9(s),s);await p.waitForTimeout(300)}
 ok(!errs.length,'no page errors '+errs.slice(0,3).join(' | '));await b.close()})();
