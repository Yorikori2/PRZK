// Small ideas bundle (endless city sample). usage: node tools/test_opin.js <outdir>
const {chromium}=require('playwright');const OUT=process.argv[2]||'.';const PAGE='file://'+require('path').resolve(__dirname,'..','inf-sample.html');
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);await p.evaluate(()=>{try{localStorage.clear()}catch(e){}});await p.reload();await p.waitForTimeout(1500);await p.evaluate(()=>stop9());
 // 1 exploration map + arrow
 let r=await p.evaluate(()=>{scene9('o1');const n=Object.keys(S.inf.seen).length;openMap();const cv=$('xmc');const a=$('hmA');closeBase();PAUSE=false;baseArrow();return{n,cv:!!cv&&cv.width>100,arrow:a.style.display=='block',txt:a.textContent,save:(save(),!!JSON.parse(localStorage.getItem(SAVE)).inf.seen)}});
 ok(r.n>=40&&r.cv,'walked blocks and their neighbours are recorded ('+r.n+') and drawn on the map');ok(r.arrow&&/22/.test(r.txt),'home arrow shows the way and distance ('+r.txt+')');ok(r.save,'the explored map is saved');
 await p.evaluate(()=>{stop9();scene9('o1')});await p.waitForTimeout(2200);await p.screenshot({path:OUT+'/op-map.png'});await p.evaluate(()=>{closeBase();PAUSE=false});await p.waitForTimeout(300);await p.screenshot({path:OUT+'/op-arrow.png'});
 // 2 crowd cap
 r=await p.evaluate(()=>[4,5,8].map(z=>zProf(z).dens));ok(r.every(x=>x==2),'crowd size stops at ×2 from zone 4 on '+r);
 // 3 weapon card
 r=await p.evaluate(()=>{stop9();giveDemo();S.p.eq.prim='ar';S.p.as='prim';const pg=EP();const o={};for(const n of[0,3,5,10]){pg.enh.ar=n;s3dirty();hud2();const el=$('wc');o[n]=[el.querySelector('.wn').textContent.slice(0,4),el.classList.contains('enh5'),el.classList.contains('enh10')]}return o});
 ok(!/\+/.test(r[0][0])&&/\+3/.test(r[3][0])&&!r[3][1]&&r[5][1]&&r[10][2],'weapon card: +3 number only, +5 gold frame, +10 glowing '+JSON.stringify(r));
 await p.screenshot({path:OUT+'/op-card.png',clip:{x:180,y:620,width:232,height:150}});
 // 4 first-entry ammo
 r=await p.evaluate(()=>{stop9();S.inf.fz={};giveDemo();S.p.eq.prim='ar';S.p.eq.sec='pistol';infGoto(10,0);const a=S.p.inv.a556|0,b=S.p.inv.a9mm|0;infGoto(16,0);const got=[(S.p.inv.a556|0)-a,(S.p.inv.a9mm|0)-b];const t=$('zoneb').textContent;infGoto(10,0);infGoto(16,0);return{got,t,again:(S.p.inv.a556|0)-a}});
 ok(r.got[0]>=30&&r.got[1]>=30&&/탄약 상자/.test(r.t)&&r.again==r.got[0],'first entry gives ammo for both equipped guns, once ('+r.got+')');
 // 6 saved pick lists
 r=await p.evaluate(()=>{stop9();scene9('o6');return new Promise(res=>setTimeout(()=>{const btn=[...document.querySelectorAll('#bm .stPre button')].map(b=>b.textContent);stPreUse(0);const pk=Object.assign({},STPICK);stTakeList();STPICK={wood:3};stPreSave(1);res({btn,pk,saved:S.stPre[1]&&S.stPre[1].wood==3})},120))});
 ok(/탐험 세트/.test(r.btn[0])&&r.pk.a9mm==60&&r.pk.medkit==2&&r.saved,'one tap fills the pick list from a saved set; the current list can be saved as a set');
 await p.evaluate(()=>{scene9('o6')});await p.waitForTimeout(300);await p.screenshot({path:OUT+'/op-stash.png'});
 // 9 turret alert
 r=await p.evaluate(()=>{stop9();scene9('o9');const gk=Object.keys(OP0()).find(k=>OP0()[k].turs.length==2),o=OP0()[gk];o.st.a9mm=8;S.tAlerts=0;TALT=0;turAlerts(1);const m=$('msg').textContent,n1=S.tAlerts;TALT=0;turAlerts(1);const n2=S.tAlerts;o.st.a9mm=40;TALT=0;turAlerts(1);o.st.a9mm=5;TALT=0;turAlerts(1);return{m,n1,n2,n3:S.tAlerts}});
 ok(/기관총 포탑 탄약 부족/.test(r.m)&&r.n1==1&&r.n2==1&&r.n3==2,'low ammo alert fires once, and again after refilling then running low ('+r.m+')');
 // 10 bulldozer tank
 r=await p.evaluate(()=>{stop9();scene9('dozer');S.inf.dzF=3;S.p.inv.fuel=7;dozerBoard();const inTank=S.p.inv.fuel,bag=DOZ.bagFuel;save();const sv=JSON.parse(localStorage.getItem(SAVE));S.p.inv.fuel=.5;ia();gearUpd(1/60);const after=[S.p.inv.fuel,S.inf.dzF];const c=dmCtx().map(q=>q.t).join('|');dozerFill();return{inTank,bag,savedBag:sv.p.inv.fuel,after,c,filled:S.inf.dzF,bagLeft:S.p.inv.fuel|0}});
 ok(r.inTank==3&&r.bag==7&&r.savedBag==7,'driving uses the 3-unit tank; the 7 bag fuel is kept aside (and saved as bag fuel)');ok(r.after[0]==7&&r.after[1]==.5&&/연료 넣기/.test(r.c)&&r.filled>=7.4&&r.bagLeft==0,'getting out returns bag fuel; [연료 넣기] moves bag fuel into the tank '+JSON.stringify(r));
 ok(!errs.length,'no page errors '+errs.join(' | '));await b.close()})();
