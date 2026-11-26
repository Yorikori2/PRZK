// Play the newly applied features in the real game (index.html, no sample scenes): new buildings, zones, radio tower,
// survivor → companion, subway tunnel, big map, mastery, shields, Lv4/Lv5 tools. Checks invariants all along and
// collects page errors. usage: node tools/play_new.js [outdir]
const {chromium,devices}=require('playwright');const path=require('path');const fs=require('fs');
const OUT=process.argv[2]||'.';fs.mkdirSync(OUT,{recursive:true});const PAGE='file://'+path.resolve(__dirname,'..','index.html');
const issues=[];const note=(k,m)=>{issues.push(k+': '+m);console.log('⚠ '+k+': '+m)};const okk=(c,k,m)=>{if(!c)note(k,m);else console.log('✓ '+k)};
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({...devices['Pixel 7']});const p=await ctx.newPage();
 p.on('pageerror',e=>note('pageerror',e.message+' @ '+(e.stack||'').split('\n')[1]));p.on('console',m=>{if(m.type()=='error')note('console',m.text())});
 const ev=(f,a)=>p.evaluate(f,a);const shot=n=>p.screenshot({path:path.join(OUT,n+'.png')});
 const check=async tag=>{const r=await ev(()=>{const o=[];if(!S||!S.p)return['no state'];const P=S.p;for(const k of['x','y','hp'])if(!isFinite(P[k]))o.push('p.'+k+'='+P[k]);for(const z of Z){if(!isFinite(z.x)||!isFinite(z.y))o.push('zombie NaN '+z.look);if(!(z.npc)&&!isFinite(z.hp))o.push('zombie hp '+z.look)}
   const bm=$('bm');if(PAUSE&&(!bm||bm.style.display=='none')&&!$('bmap')&&!(typeof UIE!='undefined'&&UIE.on))o.push('paused with no window open');for(const k in P.inv)if(!isFinite(P.inv[k])||P.inv[k]<0)o.push('inv '+k+'='+P.inv[k]);return o});for(const m of r)note('state['+tag+']',m)};
 const step=async(ms,tag)=>{const t=Date.now();while(Date.now()-t<ms){await p.waitForTimeout(250);await check(tag)}};
 /* new game */
 await p.goto(PAGE);await ev(()=>localStorage.clear());await p.reload();await p.waitForTimeout(1500);await p.click('[data-d=S]').catch(()=>{});await p.waitForTimeout(600);
 await ev(()=>{const b2=document.querySelector('#bm [data-tr],#bm .trc,#bm [data-t]');if(b2)b2.click();const go=[...document.querySelectorAll('#bm button')].find(x=>!x.disabled&&/시작|확인|결정|선택/.test(x.textContent));if(go)go.click()});await p.waitForTimeout(600);
 await ev(()=>{if($('bm').style.display=='block'){if(S.pg&&!S.pg.tr.length)S.pg.tr=['cop'];closeBase();PAUSE=false}});await step(800,'start');
 const findK=(L,from)=>ev(([L,from])=>{for(let d=from||1;d<60;d++)for(let a=-d;a<=d;a++)for(const[gx,gy]of[[a,-d],[a,d],[-d,a],[d,a]])if(L.includes(kindAt(gx,gy)))return[gx,gy];return null},[L,from]);
 /* 1) the city mix: no dangerous buildings in zone 0, they appear further out; every kind builds */
 const mix=await ev(()=>{const st=zoneStep(),c={0:{},3:{}};for(let gx=-4*st;gx<4*st;gx+=2)for(let gy=-4*st;gy<4*st;gy+=2){const z=zoneOf(gx,gy);if(z!=0&&z!=3)continue;const k=kindAt(gx,gy);c[z][k]=(c[z][k]|0)+1}const bad=['gunshop','police','mil','prison','lab'];
   return{z0:bad.reduce((a,k)=>a+(c[0][k]|0),0),z3:bad.reduce((a,k)=>a+(c[3][k]|0),0)}});okk(mix.z0==0&&mix.z3>0,'zones','zone 0 dangerous '+mix.z0+' · zone 3 '+mix.z3);
 for(const k of['pharm','gunshop','garage','bank','hosp','mall','park2','subway','prison','radio']){const f=await findK([k],1);if(!f){note('build',k+' not found');continue}const r=await ev(([f,k])=>{infGoto(f[0]+(k=='hosp'?1:0),f[1]);const b2=W0.b.find(q=>q.gk==f.join());return b2?{n:W0.objs.filter(o=>o.b==W0.b.indexOf(b2)).length}:null},[f,k]);okk(r&&r.n>10,'build '+k,JSON.stringify(r))}
 await step(500,'buildings');
 /* 2) walk through a hospital and fight there with the starting weapon (mastery should grow) */
 const hf=await findK(['hosp'],1);await ev(f=>{infGoto(f[0]+1,f[1]);const b2=W0.b.find(q=>q.gk==f.join());S.p.x=b2.ox+BW+RD/2;S.p.y=b2.oy+BH-60;give({pistol:1,a9mm:200});S.p.eq.sec='pistol';S.p.as='sec';spd=2;for(let i=0;i<6;i++)mk(S.p.x+120+i*20,S.p.y-60,{look:'civ1'})},hf);
 await ev(()=>{atk=true});await step(5000,'fight');await ev(()=>{atk=false});const m1=await ev(()=>MAST().pistol|0);okk(m1>0,'mastery grows in the game','pistol xp '+m1);await shot('n1_hospital');
 /* 3) radio tower: fuel, signal, the arrow, find and rescue → companion at the base */
 const rf=await findK(['radio'],1);const tw=await ev(f=>{infGoto(f[0],f[1]);Z.length=0;const b2=W0.b.find(q=>q.gk==f.join()),m=W0.objs.find(o=>o.t=='mast'&&o.b==W0.b.indexOf(b2));S.p.x=m.x-40;S.p.y=m.y+m.h+20;give({fuel:2,elec:10});
   const L0=iaList().map(q=>q.t);ia();const L1=iaList().map(q=>q.t);ia();return{L0,L1,sos:S.inf.sos}},rf);okk(tw.sos,'tower signal via [상호작용]',JSON.stringify(tw).slice(0,200));
 await step(1500,'signal');await shot('n2_signal');
 if(tw.sos){const sv=await ev(()=>{const s=S.inf.sos;infGoto(s.gx,s.gy);sosPlace();const o=W0.objs.find(o=>o.t=='sosnpc');if(!o)return'no survivor';S.p.x=o.x+10;S.p.y=o.y+30;Z=Z.filter(z=>z.npc);const q=iaList().find(q=>/구출/.test(q.t));if(!q)return'no rescue entry';q.f();return(S.inf.allies||[]).length});okk(sv==1,'rescue → companion',String(sv))}
 await step(1500,'rescued');
 /* 4) take the companion along from the base and fight together */
 const al=await ev(()=>{infGoto(0,0);const a=S.inf.allies&&S.inf.allies[0];if(!a)return'none';Z=Z.filter(z=>z.npc);aSync();const z=aEnt(a);if(!z)return'no entity at base';S.p.x=z.x+20;S.p.y=z.y+20;const q=iaList().find(q=>/같이 가자/.test(q.t));if(!q)return'no take-along entry';q.f();return a.st},null);okk(al=='follow','companion follows',String(al));
 await ev(()=>{const f=[2,2];infGoto(3,0);for(let i=0;i<6;i++)mk(S.p.x+160+i*18,S.p.y,{look:'civ1'})});await ev(()=>{atk=true});await step(6000,'squad');await ev(()=>{atk=false});
 const sq=await ev(()=>{const a=S.inf.allies[0],z=aEnt(a);return{near:z?Math.round(Math.hypot(z.x-S.p.x,z.y-S.p.y)):-1,st:a.st,xp:a.xp,hp:Math.round(a.hp)}});okk(sq.near>=0&&sq.near<500,'companion stays with you',JSON.stringify(sq));await shot('n3_squad');
 /* 5) subway tunnel: down, walk, up at the next station; the companion comes along */
 const sf=await findK(['subway'],1);const tn=await ev(f=>{infGoto(f[0],f[1]);Z=Z.filter(z=>z.npc);const b2=W0.b.find(q=>q.gk==f.join()),m=W0.objs.find(o=>o.t=='tmouth'&&o.b==W0.b.indexOf(b2));if(!m)return'no mouth';S.p.x=m.x-30;S.p.y=m.y+50;const q=iaList().find(q=>/지하 터널/.test(q.t));if(!q)return'no entry';q.f();return DUN&&DUN.sh},sf);okk(tn=='metro','into the tunnel',String(tn));
 await ev(()=>{ky.d=1;S.p.hp=1e3});await step(3000,'tunnel');await ev(()=>{delete ky.d});const ally2=await ev(()=>Z.some(z=>z.npc=='ally'));okk(ally2,'companion is in the tunnel too','');await shot('n4_tunnel');
 const up=await ev(()=>{const m=W0.objs.find(o=>o.go);S.p.x=m.x+30;S.p.y=m.y+60;const q=iaList().find(q=>/다음 역/.test(q.t));if(!q)return'no up';const to=DUN.to.join();q.f();return to==gOf(S.p.x,S.p.y).join()&&!DUN});okk(up===true,'up at the next station',String(up));await ev(()=>{S.p.hp=100});await step(1000,'after tunnel');
 /* 6) big map from the minimap (needs the antenna), mark, close: game not stuck */
 await ev(()=>{give({antenna:1});closeBase();PAUSE=false});await step(600,'mm');await p.tap('#mmw').catch(()=>note('map','minimap not visible'));await p.waitForTimeout(500);const mp=await ev(()=>!!$('bmap'));okk(mp,'big map opens from the minimap','');
 if(mp){await shot('n5_map');await p.click('#bmX');await p.waitForTimeout(300);const st=await ev(()=>({PAUSE,open:!!$('bmap')}));okk(!st.PAUSE&&!st.open,'map closes, game goes on',JSON.stringify(st))}
 /* 7) shield from the bag: pistols only, takes part of a hit, wears */
 const sh=await ev(()=>{const P=S.p;give({shd2:1,ar:1,a556:60});P.eq.prim='ar';const it=P.eq.shd;P.eq.shd='shd2';P.as='prim';gearUpd(.016);const act=actW(P);P.hp=100;hurtP(20,'t');return{act,hp:P.hp,dur:shdHp('shd2')}});okk(sh.act=='pistol'&&sh.hp>80&&sh.dur<150,'shield',JSON.stringify(sh));
 await ev(()=>{S.p.eq.shd=''});
 /* 8) Lv4 tool can take on a police station, Lv3 cannot */
 const pf=await findK(['police'],1);const dt=await ev(f=>{infGoto(f[0],f[1]);Z=Z.filter(z=>z.npc);give({dt3:1,dt4:1});return{need:DLV.police,lv3:DT.dt3.lv,lv4:DT.dt4.lv}},pf);okk(dt.need==4&&dt.lv3<dt.need&&dt.lv4>=dt.need,'demolition levels',JSON.stringify(dt));
 /* 8b) every window closes with the floating ✕ above it and the game is never left paused */
 for(const f of['openBag','openStash','openCraft','openBase','openChar','openRunes','openAEnh','openMixer','aOpen','mastOpen']){const ok2=await ev(f=>{try{window[f]();return $('bm').style.display=='block'}catch(e){return'ERR '+e.message}},f);if(ok2!==true){note('window',f+' '+ok2);continue}
  await p.waitForTimeout(150);const vis=await ev(()=>getComputedStyle($('bmX2')).display!='none');await p.click('#bmX2').catch(()=>{});await p.waitForTimeout(150);const st=await ev(()=>({open:$('bm').style.display,PAUSE}));okk(vis&&st.open=='none'&&!st.PAUSE,'✕ closes '+f,JSON.stringify(st))}
 /* 9) save → reload → continue keeps the companion, mastery and marks */
 const before=await ev(()=>{(S.inf.marks=S.inf.marks||[]).push({gx:0,gy:0,lx:100,ly:100,ic:1,nm:'집'});save();return{al:(S.inf.allies||[]).length,m:MAST().pistol|0,mk:S.inf.marks.length}});
 await p.reload();await p.waitForTimeout(1500);await ev(()=>{const b2=$('ld');if(b2&&b2.style.display!='none')b2.click()});await p.waitForTimeout(1200);
 const after=await ev(()=>S&&run?{al:(S.inf.allies||[]).length,m:(S.pg.mast||{}).pistol|0,mk:(S.inf.marks||[]).length}:null);okk(after&&JSON.stringify(after)==JSON.stringify(before),'save / load keeps companions · mastery · marks',JSON.stringify(before)+' → '+JSON.stringify(after));
 await step(1500,'loaded');await shot('n6_loaded');
 console.log('\n=== '+issues.length+' issue(s) ===');const seen={};for(const i of issues)seen[i]=(seen[i]|0)+1;for(const k in seen)console.log((seen[k]>1?seen[k]+'× ':'')+k);await b.close()})();
