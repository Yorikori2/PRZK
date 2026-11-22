// Gun personality checks: every gun has a trait + sound, each trait does what it says, casings/flash, mute toggle.
// usage: node tools/test_gunfeel.js <outdir> [page]
const {chromium}=require('playwright');const OUT=process.argv[2]||'.';const PAGE=process.argv[3]||'stage4-sample.html';
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+require('path').resolve(__dirname,'..',PAGE));await p.waitForTimeout(1200);await p.evaluate(()=>{$('bm').dataset.m='';closeBase();PAUSE=false});
 let r=await p.evaluate(()=>{const none=GUN_IDS.filter(i=>!GT[i]),cnt={};for(const i of GUN_IDS)cnt[GT[i]]=(cnt[GT[i]]||0)+1;const prof={};for(const i of GUN_IDS)prof[GP[i]]=(prof[GP[i]]||0)+1;return{none,cnt,prof}});
 ok(!r.none.length,'every gun has a trait '+JSON.stringify(r.cnt));ok(Object.keys(r.prof).length>=16,'sound profiles: '+Object.keys(r.prof).length+' '+JSON.stringify(r.prof));
 // every gun schedules sound nodes
 r=await p.evaluate(()=>{const a=acx();let n=0;const oc=a.createOscillator.bind(a),ob=a.createBufferSource.bind(a);a.createOscillator=()=>{n++;return oc()};a.createBufferSource=()=>{n++;return ob()};const silent=[];
  for(const id of GUN_IDS){const n0=n;lastSnd=-1;gunSound(id);if(n==n0)silent.push(id)}const n1=n;reloadSound('pistol',false);reloadSound('pistol',true);emptySound();a.createOscillator=oc;a.createBufferSource=ob;return{silent,extra:n-n1,state:a.state}});
 ok(!r.silent.length&&r.extra>=4,'all 66 guns + reload + empty click make sound '+JSON.stringify(r));
 const rig=`(gun,look)=>{scene('range',gun);const pl=S.p;for(const z of Z){z.hp=z.mhp=9000}S4.dn=[];return pl}`;
 const fire=`(pl,id,z)=>{S.tg=z;S.tgIn=true;pl.ac=0;pl.rl=0;pl.mag[id]=Math.max(pl.mag[id]|0,5);S3.cc=0;const h=z.hp;const old=Math.random;Math.random=()=>.99;gearAct();Math.random=old;return +(h-z.hp).toFixed(2)}`;
 const T=async(name,code)=>{const res=await p.evaluate(`(()=>{const rig=${rig},fire=${fire};${code}})()`);return res};
 r=await T('burst',"const pl=rig('pistol');const id='b93r';give({b93r:1,a9mm:90});pl.eq.sec=id;pl.as='sec';pl.mag[id]=20;const z=Z[0];const acs=[];for(let i=0;i<4;i++){fire(pl,id,z);acs.push(+pl.ac.toFixed(3))}return{tr:GT[id],acs}");
 ok(r.tr=='burst'&&r.acs[0]<.1&&r.acs[1]<.1&&r.acs[2]>.2&&r.acs[3]<.1,'3점사: two quick shots then a pause '+JSON.stringify(r));
 r=await T('sil',"const pl=rig('ssmg');const z=Z[0];z.aw=0;const a=fire(pl,'ssmg',z),b2=fire(pl,'ssmg',z);return{tr:GT.ssmg,a,b:b2}");ok(r.tr=='sil'&&Math.abs(r.a/r.b-1.5)<.02,'암살: first hit on an unaware zombie ×1.5 '+JSON.stringify(r));
 r=await T('stag',"const pl=rig('revolver');const z=Z[0];z.stun=0;fire(pl,'revolver',z);return{tr:GT.revolver,stun:+z.stun.toFixed(2)}");ok(r.tr=='stag'&&r.stun>=.34,'경직: revolver hit stuns '+JSON.stringify(r));
 r=await T('aim',"const pl=rig('sniper');const z=Z[0];S5.lastShot=0;const a=fire(pl,'sniper',z),b2=fire(pl,'sniper',z);return{tr:GT.sniper,a,b:b2}");ok(r.tr=='aim'&&Math.abs(r.a/r.b-1.5)<.02,'정조준: rested first shot ×1.5 '+JSON.stringify(r));
 r=await p.evaluate(()=>{scene('range','dmr');return{tr:GT.dmr,base:W_BY.dmr[4].pierce,now:wdef('dmr')[4].pierce}});ok(r.tr=='pierce'&&r.now==r.base+1,'관통 강화: DMR pierce +1 '+JSON.stringify(r));
 r=await T('chain',"const pl=rig('ar');const z=Z[0];const d=[];for(let i=0;i<5;i++)d.push(fire(pl,'ar',z));return{tr:GT.ar,m:d.map(x=>+(x/d[0]).toFixed(2))}");ok(r.tr=='chain'&&r.m.join()=='1,1.08,1.16,1.24,1.24','연속 명중: +8% per hit up to +24% '+JSON.stringify(r));
 r=await T('close',"const pl=rig('smg');Z.splice(1);const z=Z[0];z.x=pl.x;z.y=pl.y-80;const n=fire(pl,'smg',z);z.y=pl.y-170;const f=fire(pl,'smg',z);return{tr:GT.smg,f,n}");ok(r.tr=='close'&&Math.abs(r.n/r.f-1.2)<.02,'근접 사격: +20% inside 100px '+JSON.stringify(r));
 r=await p.evaluate(()=>{scene('range','pistol');return{tr:GT.pistol,rlm:+wdef('pistol')[4].rlm.toFixed(3),other:+wdef('revolver')[4].rlm.toFixed(3)}});ok(r.tr=='fast'&&Math.abs(r.rlm/r.other-.75)<.01,'빠른 재장전: pistol reload ×0.75 '+JSON.stringify(r));
 r=await T('knock',"const pl=rig('pump');const z=Z[0];const x=z.x,y=z.y;fire(pl,'pump',z);return{tr:GT.pump,moved:Math.round(Math.hypot(z.x-x,z.y-y))}");ok(r.tr=='knock'&&r.moved>=8,'근거리 넉백: shotgun pushes zombies '+JSON.stringify(r));
 r=await T('supp',"const pl=rig('lmg');const z=Z[0];z.stun=0;fire(pl,'lmg',z);gearUpd(1/60);return{tr:GT.lmg,slow:z.slow5>0,sm:+(z.sm/z.sm0).toFixed(2)}");ok(r.tr=='supp'&&r.slow&&r.sm==.6,'제압 사격: hit zombie moves at 60% '+JSON.stringify(r));
 r=await T('spin',"const pl=rig('minigun');const z=Z[0];S5.spin=0;const a=[];for(let i=0;i<12;i++){fire(pl,'minigun',z);a.push(pl.ac)}return{tr:GT.minigun,first:+a[0].toFixed(4),last:+a[11].toFixed(4)}");ok(r.tr=='spin'&&r.last<r.first*.8,'예열: minigun fires faster as it spins '+JSON.stringify(r));
 r=await p.evaluate(()=>{scene('range','famas');const a=s3Spd(S.p);S.p.as='fist';const b2=s3Spd(S.p);return{tr:GT.famas,r:+(a/b2).toFixed(3)}});ok(r.tr=='bull'&&r.r==1.05,'불펍: +5% move speed while held '+JSON.stringify(r));
 r=await T('arrow',"const pl=rig('bow');const z=Z[0];const a0=pl.inv.aarrow|0;let shots=0;for(let i=0;i<40;i++){pl.ac=0;pl.mag.bow=1;S.tg=z;S.tgIn=true;gearAct();shots++}return{tr:GT.bow,back:(pl.inv.aarrow|0)-a0+shots*0,shots,ret:S5.arrows}");ok(r.tr=='arrow'&&r.ret>8&&r.ret<32,'화살 회수: about half the arrows come back '+JSON.stringify(r));
 r=await T('nail',"const pl=rig('nailgun');const z=Z[0];fire(pl,'nailgun',z);return{tr:GT.nailgun,slow:z.slow5}");ok(r.tr=='nail'&&r.slow>1,'못 박기: nailed zombie slowed '+JSON.stringify(r));
 r=await T('blast',"const pl=rig('gl');give({a40mm:5});const z=Z[0];const x=z.x,y=z.y;fire(pl,'gl',z);return{tr:GT.gl,moved:Math.round(Math.hypot(z.x-x,z.y-y))}");ok(r.tr=='blast'&&r.moved>5,'폭풍: explosion pushes zombies '+JSON.stringify(r));
 // feel: casings for pistols, none for revolvers; flash; card shows trait
 r=await T('feel',"let pl=rig('pistol');S5.cas=[];S5.fx=[];fire(pl,'pistol',Z[0]);const a=S5.cas.length,f=S5.fx.length;pl=rig('revolver');S5.cas=[];fire(pl,'revolver',Z[0]);hud2();return{pistolCase:a,flash:f,revCase:S5.cas.length,card:$('wc').querySelector('.wtr').textContent}");
 ok(r.pistolCase==1&&r.revCase==0&&r.flash>0,'casings fly from pistols, not revolvers; muzzle flash drawn '+JSON.stringify(r));ok(/경직/.test(r.card),'weapon card shows the trait: '+r.card);
 await p.evaluate(()=>{scene('range','sniper')});for(let i=0;i<3;i++){await p.evaluate(()=>{const pl=S.p;pl.ac=0;pl.mag.sniper=5;S.tg=Z[0];S.tgIn=true;gearAct()});await p.waitForTimeout(40)}await p.screenshot({path:OUT+'/gf-sniper.png'});
 await p.evaluate(()=>{scene('range','pump')});for(let i=0;i<2;i++){await p.evaluate(()=>{const pl=S.p;pl.ac=0;pl.mag.pump=6;S.tg=Z[0];S.tgIn=true;gearAct()});await p.waitForTimeout(30)}await p.screenshot({path:OUT+'/gf-pump.png'});
 await p.evaluate(()=>{openScenes();const el=document.querySelector('#bm [data-sg]');el.parentElement.previousElementSibling.scrollIntoView({block:'start'})});await p.waitForTimeout(150);await p.screenshot({path:OUT+'/gf-list.png'});await p.evaluate(()=>{$('bm').dataset.m='';closeBase();PAUSE=false});
 // mute
 r=await p.evaluate(()=>{const b=$('snd');b.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));const off=localStorage.getItem('pl_snd'),txt=b.textContent;b.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));return{off,txt,on:localStorage.getItem('pl_snd')}});
 ok(r.off=='0'&&r.txt=='🔇'&&r.on=='1','🔊 button mutes and remembers it '+JSON.stringify(r));
 ok(!errs.length,'no page errors '+errs.slice(0,3).join(' | '));await b.close()})();
