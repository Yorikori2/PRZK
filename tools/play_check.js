// Play-through bug hunt: starts a new game through the real title / trait screens, then plays scripted sessions
// (walk, fight, search, base, workshop, enhance, runes, mine, nests, night + wave, death, save / reload) at game speed,
// checking invariants every step and collecting page errors. Writes screenshots to the given folder.
// usage: node tools/play_check.js <outdir> [page]
const {chromium,devices}=require('playwright');const path=require('path');const fs=require('fs');
const OUT=process.argv[2]||'.';const PAGE='file://'+path.resolve(__dirname,'..',process.argv[3]||'index.html');fs.mkdirSync(OUT,{recursive:true});
const issues=[];const note=(k,m)=>{issues.push(k+': '+m);console.log('⚠ '+k+': '+m)};
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({...devices['Pixel 7']});const p=await ctx.newPage();
 p.on('pageerror',e=>note('pageerror',e.message+' @ '+(e.stack||'').split('\n')[1]));p.on('console',m=>{if(m.type()=='error')note('console',m.text())});
 const shot=async n=>{await p.screenshot({path:path.join(OUT,n+'.png')})};
 /* invariants, checked in the page */
 const check=async tag=>{const r=await p.evaluate(()=>{const out=[];if(!S||!S.p)return['no state'];const P=S.p,num=(v,n)=>{if(typeof v!='number'||!isFinite(v))out.push(n+'='+v)};
   num(P.x,'p.x');num(P.y,'p.y');num(P.hp,'hp');num(P.food,'food');num(P.water,'water');if(P.hp>MHP(P)+.01)out.push('hp>max '+P.hp+'/'+MHP(P));
   for(const k in P.inv){const v=P.inv[k];if(typeof v!='number'||!isFinite(v)||v<0)out.push('inv '+k+'='+v);if(!I_BY[k]&&!W_BY[k])out.push('unknown item '+k)}
   for(const k in P.mag){const v=P.mag[k];if(typeof v!='number'||v<0||!isFinite(v))out.push('mag '+k+'='+v)}
   for(const s in P.eq){const id=P.eq[s];if(id&&!has(P,id)&&!['bag'].includes(s))out.push('equipped but not owned '+s+'='+id)}
   for(const z of Z){if(!isFinite(z.x)||!isFinite(z.y))out.push('zombie pos NaN '+z.look);if(!isFinite(z.hp))out.push('zombie hp '+z.look+'='+z.hp)}
   if(typeof blocker=='function'&&!S.dr&&blocker(P.x,P.y,6)&&!(typeof DUN!='undefined'&&DUN))out.push('player inside a wall at '+Math.round(P.x)+','+Math.round(P.y));
   const bm=$('bm');if(PAUSE&&(!bm||bm.style.display=='none')&&!(typeof UIE!='undefined'&&UIE.on))out.push('paused with no window open');
   if(weight(P)<0)out.push('weight<0');return out});for(const m of r)note('state['+tag+']',m)};
 const step=async(ms,tag)=>{const t=Date.now();while(Date.now()-t<ms){await p.waitForTimeout(250);await check(tag)}};
 const ev=(f,a)=>p.evaluate(f,a);
 /* 1) title → new game → trait */
 await p.goto(PAGE);await ev(()=>localStorage.clear());await p.reload();await p.waitForTimeout(1500);await shot('01_title');
 await p.click('[data-d=S]');await p.waitForTimeout(600);await shot('02_trait');
 const tr=await ev(()=>{const b2=document.querySelector('#bm [data-tr],#bm .trc,#bm [data-t]');if(b2){b2.click();return b2.textContent.slice(0,20)}return null});
 await p.waitForTimeout(300);await ev(()=>{const go=[...document.querySelectorAll('#bm button')].find(x=>!x.disabled&&/시작|확인|결정|선택/.test(x.textContent));if(go)go.click()});await p.waitForTimeout(500);
 const st=await ev(()=>({run,m:$('bm').dataset.m,vis:$('bm').style.display,paused:PAUSE,tr:S&&S.pg&&S.pg.tr}));console.log('after trait',JSON.stringify(st),tr);if(st.vis=='block'){await shot('02b_stuck_trait');await ev(()=>{if(S.pg&&!S.pg.tr.length)S.pg.tr=['cop'];closeBase();PAUSE=false})}
 await step(1500,'start');await shot('03_start');
 /* 2) walk around the city, attacking while walking (game speed ×4) */
 await ev(()=>{spd=4});const dirs=[[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]];
 for(let i=0;i<16;i++){await ev(d=>{for(const k of['w','a','s','d'])delete ky[k];if(d[0]>0)ky.d=1;if(d[0]<0)ky.a=1;if(d[1]>0)ky.s=1;if(d[1]<0)ky.w=1;atk=Math.random()<.5},dirs[i%8]);await step(700,'walk')}const wk=await ev(()=>{for(const k of['w','a','s','d'])delete ky[k];atk=false;return[Math.round(S.p.x),Math.round(S.p.y)]});console.log('walked to',wk);await shot('04_walk');
 /* 3) fight: zombies around the player */
 await ev(()=>{give({ar:1,a556:200,pistol:1,a9mm:60,medkit:3,bandage:5,food:4,water:4});const P=S.p;P.eq.prim='ar';P.as='prim';for(let i=0;i<10;i++)mk(P.x+Math.cos(i)*140,P.y+Math.sin(i)*120,{look:i%3?'civ1':'runner'})});
 await ev(()=>{atk=true});await step(4000,'fight');await ev(()=>{atk=false});await shot('05_fight');
 /* 4) search furniture with [상호작용] in the nearest building */
 const sr=await ev(()=>{const P=S.p;let best=null,bd=1e9;for(const o of W0.objs)if(LOOTT[o.t]&&avail(o)){const d=Math.hypot(o.x-P.x,o.y-P.y);if(d<bd){bd=d;best=o}}if(!best)return null;P.x=best.x+best.w/2;P.y=best.y+best.h+16;const inv0=JSON.stringify(P.inv);ia();return{t:best.t,inv0}});
 await step(4500,'search');const sr2=await ev(()=>({busy:typeof SRCH!='undefined'&&!!SRCH,m:$('msg').textContent}));if(sr&&sr2.busy)note('search','searching '+sr.t+' did not finish');await shot('06_search');
 /* 5) base: build workshop stations, enhance bench, enhance and runes */
 const base=await ev(()=>{const P=S.p;infGoto(0,0);P.x=BL.ox+470;P.y=BL.oy+430;give({cement:20,scrap:120,wood:30,cloth:10,elec:20,steel:10,enh1:6,enh2:6,enh3:6,orn1:4,orn2:2});FTAB='forge';const out={};
  for(const[k]of FST){openForge(k);const bt=document.querySelector('[data-fb]');out[k]=!!bt&&!bt.disabled;if(bt&&!bt.disabled)bt.click()}closeBase();PAUSE=false;out.built=FST.filter(([k])=>fBuilt(k)).map(([k])=>k).join(',');
  const L=FPOS.enhb;P.x=BL.ox+L[0]+L[2]/2;P.y=BL.oy+L[1]+L[3]+44;ia();out.win=$('bm').dataset.m;if(out.win=='enh'){ENSEL='ar';openEnh('ar');const lv0=enhLv('ar');doEnh();out.enh=lv0+'→'+enhLv('ar')}closeBase();PAUSE=false;
  openRunes('w','ar');out.rw=$('bm').dataset.m;closeBase();PAUSE=false;return out});console.log('base',JSON.stringify(base));if(!/enhb/.test(base.built))note('base','could not build all stations: '+base.built);
 await step(800,'base');await shot('07_base');
 /* 6) mine: dig a shaft, go down, swing, walk the tunnel, down a floor, back up, far exit */
 const mine=await ev(()=>{const P=S.p,M=MINE0();P.inv.pick3=1;P.inv.headlamp=1;P.eq.spec='headlamp';P.x=BL.ox+MSPOT[0]+28;P.y=BL.oy+MSPOT[1]+70;const a=iaList().find(q=>/땅 파고|내려가기/.test(q.t));if(!a)return{err:'no shaft action'};a.f();return{ok:1}});
 await step(7000,'shaft');await ev(()=>{const q=iaList().find(q=>/내려가기/.test(q.t));if(q)q.f()});await step(600,'mine-in');
 const m2=await ev(()=>({dun:DUN&&DUN.sh,lv:typeof mLv=='function'?mLv():0}));if(m2.dun!='mine')note('mine','did not enter the mine '+JSON.stringify(mine));
 await ev(()=>{S.p.fy=1;S.p.fx=0;atk=true;ky.s=1});await step(5000,'dig');await ev(()=>{atk=false;delete ky.s});await shot('08_mine');
 const m3=await ev(()=>{const M=MINE0();return{dug:Object.keys(M.dug).length,x:S.p.x,y:S.p.y}});if(m3.dug<3)note('mine','holding attack while walking dug only '+m3.dug+' cells');
 await ev(()=>{dunExit()});await step(800,'mine-out');
 /* 7) night + wave */
 await ev(()=>{S.t=1700;wave(1)});await ev(()=>{atk=true});await step(5000,'wave');await ev(()=>{atk=false});await shot('09_night_wave');
 /* 8) death and respawn (Survival) */
 await ev(()=>{S.p.hp=-1});await step(1500,'death');await shot('10_after_death');const dd=await ev(()=>({hp:S.p.hp,run,inBase:inBase(S.p.x,S.p.y)}));if(!(dd.hp>0&&dd.run))note('death','after death: '+JSON.stringify(dd));
 /* 9) save, reload, continue */
 const before=await ev(()=>{save();return{day:S.day,inv:Object.keys(S.p.inv).length,lv:S.pg.lv,fst:JSON.stringify(S.base.lv.fst||{}),enh:enhLv('ar')}});
 await p.reload();await p.waitForTimeout(1500);await shot('11_title_again');const ld=await ev(()=>{const b2=$('ld');const v=b2&&b2.style.display!='none';if(v)b2.click();return v});await p.waitForTimeout(1200);
 const after=await ev(()=>S&&run?{day:S.day,inv:Object.keys(S.p.inv).length,lv:S.pg.lv,fst:JSON.stringify(S.base.lv.fst||{}),enh:enhLv('ar')}:null);
 if(!ld)note('load','no 이어하기 button after saving');else if(!after||JSON.stringify(after)!=JSON.stringify(before))note('load','state changed after reload: '+JSON.stringify(before)+' → '+JSON.stringify(after));
 await step(1500,'loaded');await shot('12_loaded');
 /* 10) UI: open every main window once */
 for(const f of['openBag','openCraft','openBase','openChar','openStash','openRunes','openAEnh','openMixer']){const r=await ev(f=>{try{window[f]();const m=$('bm').dataset.m,vis=$('bm').style.display;closeBase();PAUSE=false;return m+'/'+vis}catch(e){return'ERR '+e.message}},f);if(/ERR/.test(r))note('ui',f+' '+r)}
 console.log('\n=== '+issues.length+' issue(s) ===');const seen={};for(const i of issues){seen[i]=(seen[i]|0)+1}for(const k in seen)console.log((seen[k]>1?seen[k]+'× ':'')+k);await b.close()})();
