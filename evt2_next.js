/* PROJECT LEGACY — sample: richer events and a proper merchant.
   · Merchant: wide-brim hat, walking stick, a huge rucksack (bedroll, pot, lantern) that sways with each heavy step.
   · Airdrop: plane flyover (engine sound) → "smoke rising to the north-east" → a supply container lands → hack it (5 s) →
     alarm + 60 s defence → it opens.
   · Horde: 15–20 zombies at level 1 up to 200 at level 50.
   · Blood moon: a red moon hangs in the sky and the ground goes red.  Fog: drifting banks of fog over the city.
   · Helicopter crash: you see it come down, spinning and smoking, then a burning wreck (new intact + wreck pixel art).
   · Raiders vs zombies: announced on the radio first.  Merchant flare: whistle… pop, a red glow in that direction.
   · Revenge: envoys come to warn you first (day 1: 1, day 2: 3, day 3: 5), the assault comes on day 4.
   · Turret range is now a faint dashed outline only.  Loaded last. */
'use strict';
/* ---------- sounds (synthesised) ---------- */
function sfx(fn){try{const a=acx();if(a)viaBus('gun',()=>fn(a,a.currentTime))}catch(e){}}
function sndPlane(){sfx((a,t)=>{const o=a.createOscillator(),o2=a.createOscillator(),gn=a.createGain(),f=a.createBiquadFilter(),pan=a.createStereoPanner?a.createStereoPanner():null;o.type='sawtooth';o2.type='sawtooth';o.frequency.setValueAtTime(62,t);o.frequency.linearRampToValueAtTime(54,t+7);o2.frequency.setValueAtTime(93,t);o2.frequency.linearRampToValueAtTime(80,t+7);
 f.type='lowpass';f.frequency.value=380;gn.gain.setValueAtTime(.0001,t);gn.gain.exponentialRampToValueAtTime(.22,t+3);gn.gain.exponentialRampToValueAtTime(.0001,t+7);o.connect(f);o2.connect(f);if(pan){pan.pan.setValueAtTime(-1,t);pan.pan.linearRampToValueAtTime(1,t+7);f.connect(gn).connect(pan).connect(OUT)}else f.connect(gn).connect(OUT);o.start(t);o2.start(t);o.stop(t+7.1);o2.stop(t+7.1)})}
function sndSiren(dur){sfx((a,t)=>{const o=a.createOscillator(),gn=a.createGain();o.type='square';for(let i=0;i<dur;i+=1.2){o.frequency.setValueAtTime(520,t+i);o.frequency.linearRampToValueAtTime(980,t+i+.6);o.frequency.linearRampToValueAtTime(520,t+i+1.2)}gn.gain.setValueAtTime(.09,t);gn.gain.setValueAtTime(.09,t+dur-.1);gn.gain.linearRampToValueAtTime(0,t+dur);o.connect(gn).connect(OUT);o.start(t);o.stop(t+dur)})}
function sndWhistle(){sfx((a,t)=>{const o=a.createOscillator(),gn=a.createGain();o.type='sine';o.frequency.setValueAtTime(700,t);o.frequency.exponentialRampToValueAtTime(2600,t+2.4);gn.gain.setValueAtTime(.0001,t);gn.gain.exponentialRampToValueAtTime(.12,t+.4);gn.gain.setValueAtTime(.12,t+2.3);gn.gain.exponentialRampToValueAtTime(.0001,t+2.5);o.connect(gn).connect(OUT);o.start(t);o.stop(t+2.6);
 nz(a,t+2.5,{f:900,q:.6,v:.5,d:.5,type:'lowpass'});nz(a,t+2.5,{f:2500,q:1,v:.25,d:.3})})}
function sndRotor(dur){sfx((a,t)=>{for(let i=0;i<dur*11;i++)nz(a,t+i/11,{f:140,q:1.2,v:.18*Math.min(1,(dur*11-i)/30+.2),d:.07,type:'lowpass'})})}
function sndCrash(){sfx((a,t)=>{nz(a,t,{f:120,q:.5,v:.9,d:1.4,type:'lowpass'});nz(a,t,{f:900,q:.7,v:.5,d:.6});nz(a,t+.15,{f:300,q:.6,v:.4,d:1})})}
function sndRadio(){sfx((a,t)=>{nz(a,t,{f:2200,q:.4,v:.18,d:.35});nz(a,t+.4,{f:1800,q:.5,v:.12,d:.25});const o=a.createOscillator(),gn=a.createGain();o.type='square';o.frequency.value=1200;gn.gain.setValueAtTime(.05,t+.7);gn.gain.setValueAtTime(0,t+.8);o.connect(gn).connect(OUT);o.start(t+.7);o.stop(t+.82)})}
/* compass words, screen-up = north */
function compass(dx,dy){const i=((Math.round(Math.atan2(dx,-dy)/(Math.PI/4))%8)+8)%8;return['북쪽','북동쪽','동쪽','남동쪽','남쪽','남서쪽','서쪽','북서쪽'][i]}
/* ---------- the merchant: hat, stick and a huge pack ---------- */
function packArt(fr,dir){const b=fr<0?0:-Math.round(Math.abs(Math.sin(fr/8*Math.PI*2))*1.5),sw=fr<0?0:Math.sin(fr/8*Math.PI*2);const P=(c,x,y,w,h)=>R(c,x+Math.round(sw),y+b,w,h);
 P('#1d1714',13,-1,22,27);P('#7a5a32',14,0,20,25);P('#8f6c3e',14,0,20,3);P('#5e4424',14,22,20,3);for(let i=0;i<4;i++)P('#6a4e2a',15+i*5,6,1,16);P('#4a3418',16,12,16,2);
 P('#2f5a8a',12,-6,24,7);P('#3f6fa0',12,-6,24,2);P('#24486e',12,-1,24,1);P('#c43c32',22,-6,4,7);
 P('#8a9096',8,12,7,6);P('#b8bec4',8,12,7,2);P('#1d1714',9,10,5,2);P('#d9b52a',34,13,4,6);P('#ffe27a',35,14,2,3);P('#5a4a2a',35,11,2,2);P('#c9a42a',30,-10,2,10)}
function merSprite(dir,fr){return sprite('merx_'+dir+'_'+fr,52,62,()=>{const back=dir[0]=='u',side=dir=='l'||dir=='r';g.save();
  if(!back){g.translate(side?(dir=='r'?-2:6):2,10);if(dir=='l'||dir=='dl'){g.translate(52,0);g.scale(-1,1);g.translate(2,0)}packArt(fr,dir);g.restore();g.save()}
  g.translate(8,18);person(LOOKS.mer,dir,fr,null);
  /* wide-brim hat + walking stick */R('#1d1714',5,2,26,3);R('#6a3a2a',6,2,24,2);R('#4a2a1e',11,-1,14,4);R('#c9a42a',11,1,14,1);
  if(!back){const sx=dir.includes('l')?6:27,st=fr<0?0:Math.round(Math.sin(fr/8*Math.PI*2)*2);R('#6b4426',sx+st,14,2,24);R('#8a5a32',sx+st,14,2,2)}
  g.restore();if(back){g.save();g.translate(2,14);packArt(fr,dir);g.restore()}})}
function merDraw(z){const dir=z.d8m||'d',fr=z.walk>0?((z.ph*2)|0)%8:-1;shd(z.x-12,z.y-1,24,5,.35);g.drawImage(merSprite(dir,fr),Math.round(z.x-26),Math.round(z.y-55));g.font='9px sans-serif';g.textAlign='center';g.fillStyle='#ffe0a0';g.fillText('💰 '+z.nm,z.x,z.y-60)}
/* steadier walking: face along the road you walk, slower heavier steps; face you when you come close */
{const _mt=merThink;merThink=function(m,dt){const x0=m.x,y0=m.y;_mt(m,dt);const dx=m.x-x0,dy=m.y-y0;if(Math.hypot(dx,dy)>.2){m.d8m=dir8(dx,dy,m.d8m);m.ph=(m.ph||0)-Math.hypot(dx,dy)/18+Math.hypot(dx,dy)/24}else if(Math.hypot(S.p.x-m.x,S.p.y-m.y)<140)m.d8m=dir8(S.p.x-m.x,S.p.y-m.y,m.d8m)}}
{const _zd=zDraw4;zDraw4=function(z){if(z.npc=='mer'){merDraw(z);return true}return _zd(z)}}
/* ---------- helicopter art (intact + wreck) ---------- */
function heliArt(wreck){return sprite('heli2_'+(wreck?1:0),120,72,()=>{const B='#1d1714',O='#4f5a35',L='#6b7650',D='#3e4729',G='#7fb0c8';
 if(!wreck){R(B,36,24,50,26);R(O,37,25,48,24);R(L,37,25,48,4);R(D,37,45,48,4);R(B,8,33,32,8);R(O,9,34,30,6);R(B,4,26,8,16);R(O,5,27,6,14);R(B,80,28,16,18);R(G,81,29,14,16);R('#a8d0e0',81,29,14,4);
  R('#2a2e33',40,52,44,3);R('#2a2e33',44,49,3,4);R('#2a2e33',76,49,3,4);R('#e8e8e0',48,30,10,4);R('#2a2e33',58,20,6,6)}
 else{g.save();g.translate(60,36);g.rotate(.22);R(B,-26,-14,50,26);R(O,-25,-13,48,24);R(D,-25,7,48,4);R('#1d1714',-12,-6,10,8);R('#2a2e33',-6,-10,20,6);R(B,18,-10,16,18);R('#3a4a52',19,-9,14,16);for(let i=0;i<6;i++)R('#7fb0c8',20+i*2,-8+((i*3)%10),2,2);g.restore();
  g.save();g.translate(16,52);g.rotate(-.5);R(B,-14,-4,30,8);R(D,-13,-3,28,6);R(B,-18,-8,8,16);R(O,-17,-7,6,14);g.restore();
  R('#2a2e33',70,8,40,3);R('#2a2e33',92,10,3,22);R('#2a2e33',20,10,30,3);for(let i=0;i<8;i++)R(i%2?'#1d1714':'#2a2e33',30+i*9,58+(i%3),6,3)}})}
P('heliW','추락한 헬기',['fuel','scrap','scrap','ammo','milpart'],o=>{const T=performance.now()/1000;g.drawImage(heliArt(1),o.x+o.w/2-60,o.y+o.h/2-46);for(let i=0;i<9;i++){const a=i*1.7+T*3,r=8+((i*13)%16);R(i%3?'#ff8a2a':'#ffd36a',o.x+o.w/2-6+Math.cos(a)*r,o.y+o.h/2-20-((T*28+i*11)%26),3,4)}});
/* ---------- events, upgraded ---------- */
const LVL=()=>S&&S.pg?S.pg.lv|0||1:1;
const hordeN=()=>{const lv=Math.max(1,Math.min(50,LVL()));return Math.min(200,Math.round(15+(lv-1)/49*185+Math.random()*5))};
{const _es=evStart;evStart=function(k){const p=S.p,zn=Math.max(0,zoneOf(...gOf(p.x,p.y)));
  if(k=='air'){const e={k,t:600,zn,ph:'plane',pt:0};WEV.push(e);S.evN=(S.evN||0)+1;[e.x,e.y]=evAt(700);const a=Math.atan2(e.y-p.y,e.x-p.x)+(Math.random()-.5)*.6,mx=p.x+Math.cos(a)*60,my=p.y+Math.sin(a)*60;e.px0=mx-Math.cos(a)*1300;e.py0=my-Math.sin(a)*1300;e.px1=mx+Math.cos(a)*1300;e.py1=my+Math.sin(a)*1300;sndPlane();evBanner('✈ 수송기 소리','머리 위로 비행기가 지나가요 · 무언가를 떨어뜨리는 것 같아요');return e}
  if(k=='horde'){const n=hordeN(),side=Math.random()<.5?-1:1,ox=p.x+side*950,e={k,t:120,zn,n};WEV.push(e);S.evN=(S.evN||0)+1;for(let i=0;i<n;i++){mk(ox+(Math.random()-.5)*(180+n*1.5),p.y-460+(i%40)*24+(Math.random()-.5)*10,{w:1});const z=Z[Z.length-1];z.horde=1;z.al=40;z.nx=p.x-side*1500;z.ny=z.y}
   evBanner('🌊 좀비 대이동 · '+n+'마리','레벨 '+LVL()+' 기준 · '+compass(side,0)+'에서 몰려와요 · 길을 비키세요');return e}
  if(k=='heli'){const e={k,t:240,zn,ph:'fly',pt:0};WEV.push(e);S.evN=(S.evN||0)+1;[e.x,e.y]=evAt(650);const a=Math.random()*Math.PI*2;e.sx=e.x-Math.cos(a)*1100;e.sy=e.y-Math.sin(a)*1100-200;sndRotor(5);evBanner('🚁 헬기 소리','연기를 뿜으며 '+compass(e.x-p.x,e.y-p.y)+'으로 떨어지고 있어요!');return e}
  if(k=='fight'){const e={k,t:200,zn,ph:'radio',pt:0};WEV.push(e);S.evN=(S.evN||0)+1;[e.x,e.y]=evAt(560);sndRadio();const who=['블랙독','북부 생존단','철새'][Math.random()*3|0];
   evBanner('📻 무전 (치직…)','"여기는 '+who+'… '+compass(e.x-p.x,e.y-p.y)+' 블록에서 놈들한테 포위됐다… 누구든…"');return e}
  if(k=='merf'){const e={k,t:330,zn,ph:'flare',pt:0};WEV.push(e);S.evN=(S.evN||0)+1;[e.x,e.y]=evAt(520);sndWhistle();e.m=null;setTimeout(()=>{if(!WEV.includes(e))return;e.m=merSpawn(e.x,e.y,{wait:300,life:320,rich:1})},2500);
   evBanner('📡 휘이이잉… 펑!',compass(e.x-p.x,e.y-p.y)+' 하늘에 붉은 신호탄 · 상인이 5분 동안 기다려요');return e}
  return _es(k)}}
/* phases */
{const _et=evTick;evTick=function(dt){_et(dt);for(const e of WEV.slice()){e.pt+=dt;
  if(e.k=='air'){if(e.ph=='plane'&&e.pt>3.5&&!e.dropped){e.dropped=1;e.fall=4;setTimeout(()=>{if(WEV.includes(e))evBanner('🪂 보급품 투하','연기가 '+compass(e.x-S.p.x,e.y-S.p.y)+'에서 피어오르고 있어요')},1500)}if(e.ph=='plane'&&e.pt>7)e.ph='ground';
   if(e.ph=='def'){const near=Math.hypot(S.p.x-e.x,S.p.y-e.y)<300;if(near)e.left-=dt;e.wv-=dt;if(e.wv<=0){e.wv=8;const n=6+Math.round(LVL()/5);for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2;mk(e.x+Math.cos(a)*520,e.y+Math.sin(a)*420,{w:1});const z=Z[Z.length-1];z.al=20;z.nx=e.x;z.ny=e.y}noise(e.x,e.y,5)}
    if(e.left<=0){e.ph='open';e.opened=0;S.airDone=(S.airDone||0)+1;evBanner('🔓 해킹 완료!','경보가 멈췄어요 · 컨테이너를 열 수 있어요')}}}
  if(e.k=='heli'&&e.ph=='fly'&&e.pt>5){e.ph='down';noise(e.x,e.y,5);sndCrash();fx.push({k:'boom',x:e.x,y:e.y,r:120,l:.7,m:.7});if(typeof S4!='undefined')S4.shake=.6;W0.objs.push({t:'heliW',x:e.x-60,y:e.y-30,w:120,h:60,id:'evheliW'},{t:'ammo',x:e.x+70,y:e.y+40,w:34,h:20,id:'evammo'},{t:'truck',x:e.x-150,y:e.y+50,w:70,h:34,id:'evtruck',c:'#4f5a35'});infDerived();
   S.fires=(S.fires||[]).concat([{x:e.x+10,y:e.y,r:50,t:120}]);for(let i=0;i<6;i++)mk(e.x+(Math.random()-.5)*300,e.y+(Math.random()-.5)*220,{look:i%2?'soldier':'heavy'});evBanner('💥 헬기 추락','불타는 잔해 · 군용 보급품 · 군인 좀비')}
  if(e.k=='fight'&&e.ph=='radio'&&e.pt>8){e.ph='on';const L=rSquad(e.x,e.y,Math.max(1,e.zn));L.forEach(q=>q.state='fight');for(let i=0;i<12;i++)mk(e.x+(Math.random()<.5?-1:1)*(120+Math.random()*80),e.y+(Math.random()-.5)*160,{w:1});for(const q of Z)if(!q.raider&&!q.npc&&Math.hypot(q.x-e.x,q.y-e.y)<320){q.al=10;q.nx=e.x;q.ny=e.y}
   sndRadio();msg('⚔ '+compass(e.x-S.p.x,e.y-S.p.y)+'에서 총소리가 들려요')}}}}
{const _ee=evEnd;evEnd=function(e){_ee(e);if(e.k=='heli'){W0.objs=W0.objs.filter(o=>!/^ev/.test(o.id||''));infDerived()}}}
/* the crate: hack → alarm → defend 60 s → open */
function airHack(e){if(e.ph!='ground')return;e.ph='hack';e.hk=0;msg('💻 해킹 중… 컨테이너 곁에 있어요 (5초)')}
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!S||!S.inf)return;for(const e of WEV)if(e.k=='air'&&e.ph=='hack'){if(Math.hypot(S.p.x-e.x,S.p.y-e.y)<70){e.hk+=dt;if(e.hk>=5){e.ph='def';e.left=60;e.wv=1;sndSiren(60);noise(e.x,e.y,5);evBanner('🚨 경보! 60초 동안 버티세요','해킹이 경보를 울렸어요 · 컨테이너 근처(300)에 있어야 시간이 흘러요')}}else{e.ph='ground';msg('💻 컨테이너에서 멀어져 해킹이 멈췄어요')}}}}
/* ---------- revenge: envoys warn you first, the assault comes on day 4 ---------- */
const RSAY=['빼앗긴 기지는 꼭 돌려받겠다.','두목의 원한을 잊지 않았다.','다음에 올 땐 혼자가 아닐 거다.','기지를 비워 둬라. 그게 살 길이다.','곧 우리 깃발을 다시 꽂겠다.'];
revengeCheck=function(){const rb=S.inf.rb||{};for(const gk in rb){const st=rb[gk];if(!st.taken||!OP0()[gk])continue;const d=S.day-(st.takenDay!=null?st.takenDay:S.day);st.rv=st.rv||{n:0};const cyc=((d-1)%4)+1;if(d<1||st.rv.last==S.day)continue;st.rv.last=S.day;
  const[gx,gy]=gk.split(',').map(Number),zn=Math.max(2,zoneOf(gx,gy)),o=OP0()[gk];
  if(cyc<=3){const n=[1,3,5][cyc-1],p=S.p,a=Math.random()*Math.PI*2;let L=[];while(L.length<n)L=L.concat(rSpawn(p.x+Math.cos(a)*520+(L.length*30),p.y+Math.sin(a)*420,zn));L.slice(n).forEach(q=>{q.hp=-1e-9;q.gone=1});L.slice(0,n).forEach((q,i)=>{q.env=1;q.say=RSAY[(cyc+i)%RSAY.length];q.lead=0;q.nm='약탈자 전령'});
   evBanner('🏴 약탈자 전령 '+n+'명','"'+RSAY[cyc-1]+'" · '+(4-cyc)+'일 뒤 습격이 와요');o.log.unshift('Day '+S.day+' · 전령 '+n+'명이 경고하고 갔어요');S.rEnv=(S.rEnv||0)+n;continue}
  st.rv.n++;const[pgx,pgy]=gOf(S.p.x,S.p.y);if(Math.max(Math.abs(pgx-gx),Math.abs(pgy-gy))<=1){const[ox,oy]=bo(gx-OGX,gy-OGY),c={x:ox+BW/2,y:oy+BH/2+60,hit:dt=>{o.hp=Math.max(0,o.hp-dt*4)}};for(let i=0;i<Math.min(3,1+st.rv.n);i++)rSquad(ox+BW/2+(i-1)*300,oy-RD/2-60,zn+Math.floor(st.rv.n/2),c);
   evBanner('🏴 습격! ('+st.rv.n+'번째)','"기지를 돌려받으러 왔다!" · 막아내세요');o.log.unshift('Day '+S.day+' · 습격 '+st.rv.n+'번째 (직접 방어)')}
  else{const armed=o.turs.filter(q=>tArmed(o,q)).length,dmg=Math.max(5,40-armed*12-o.wall*5)+st.rv.n*5;o.hp=Math.max(0,o.hp-dmg);o.log.unshift('Day '+S.day+' · 습격 '+st.rv.n+'번째 · −'+dmg+'% (포탑 '+armed+'개)');msg('🏴 점령 기지 습격 · 내구 '+o.hp+'%');if(o.hp<=0){delete OP0()[gk];st.taken=0;st.clear=0;st.left=st.tot;infRebuild()}}}};
/* envoys: walk up, speak, walk away — unless you start shooting */
{const _rt=rThink;rThink=function(r,dt){if(!r.env)return _rt(r,dt);const p=S.p,dx=p.x-r.x,dy=p.y-r.y,d=Math.hypot(dx,dy)||1;r.stun=1e9;r.mv=0;
  if(!r.said&&d>150){mv(r,dx/d*r.spd*.7*dt,dy/d*r.spd*.7*dt,7);r.mv=1;r.fx=dx;r.fy=dy}else if(!r.said){r.said=1;r.talk=4.5;r.fx=dx;r.fy=dy}else if(r.talk>0){r.talk-=dt;r.fx=dx;r.fy=dy}else{mv(r,-dx/d*r.spd*.8*dt,-dy/d*r.spd*.8*dt,7);r.mv=1;r.fx=-dx;r.fy=-dy;r.out=(r.out||0)+dt;if(r.out>6){r.hp=-1e-9;r.gone=1}}
  r.walk=r.mv?.15:Math.max(0,(r.walk||0)-dt);if(r.mv)r.ph=(r.ph||0)+dt*r.spd/18}}
{const _hz=hitZ;hitZ=function(q,dmg,dx,dy,n){if(q&&q.env){q.env=0;q.state='fight';q.nm='약탈자'}return _hz(q,dmg,dx,dy,n)}}
{const _zd=zDraw4;zDraw4=function(z){const r=_zd(z);if(z.env&&z.said&&z.talk>0){g.font='bold 10px sans-serif';const w=g.measureText(z.say).width+12;R('#000c',z.x-w/2,z.y-82,w,18);R('#000c',z.x-3,z.y-64,6,4);g.fillStyle='#fff';g.textAlign='center';g.fillText(z.say,z.x,z.y-69)}return r}}
/* ---------- overlays: plane, falling crate, container, alarm ring, heli fall, fog, blood moon, flare glow ---------- */
const FOGB=Array.from({length:22},(_,i)=>({x:Math.random()*3000,y:Math.random()*3000,r:160+Math.random()*220,v:8+Math.random()*14}));
OVL.unshift((g2,sx,sy,k)=>{const W=innerWidth,H=innerHeight,T=performance.now()/1000;
 if(S.moon){g2.save();g2.globalCompositeOperation='multiply';g2.fillStyle='rgba(255,90,80,.55)';g2.fillRect(0,0,W,H);g2.restore();const mx=W-70,my=150;const gr=g2.createRadialGradient(mx,my,10,mx,my,140);gr.addColorStop(0,'rgba(255,60,40,.55)');gr.addColorStop(1,'rgba(255,60,40,0)');g2.fillStyle=gr;g2.fillRect(mx-140,my-140,280,280);
  g2.fillStyle='#d8382a';g2.beginPath();g2.arc(mx,my,30,0,7);g2.fill();g2.fillStyle='#b82a1e';g2.beginPath();g2.arc(mx-8,my-6,7,0,7);g2.arc(mx+9,my+8,5,0,7);g2.fill();
  const lg=g2.createRadialGradient(W/2,H/2,40,W/2,H/2,Math.max(W,H)*.7);lg.addColorStop(0,'rgba(255,40,30,.12)');lg.addColorStop(1,'rgba(60,0,0,.35)');g2.fillStyle=lg;g2.fillRect(0,0,W,H)}
 if(document.body.dataset.fog2){g2.fillStyle='rgba(215,220,224,.36)';g2.fillRect(0,0,W,H);for(const b of FOGB){const x=((b.x+T*b.v-camX*.6)%3000+3000)%3000-600,y=((b.y+T*b.v*.3-camY*.6)%2400+2400)%2400-500;const gr=g2.createRadialGradient(x,y,10,x,y,b.r);gr.addColorStop(0,'rgba(230,234,238,.7)');gr.addColorStop(1,'rgba(230,234,238,0)');g2.fillStyle=gr;g2.fillRect(x-b.r,y-b.r,b.r*2,b.r*2)}}});
OVL.push((g2,sx,sy,k)=>{const T=performance.now()/1000,W=innerWidth,H=innerHeight;for(const e of WEV){
 if(e.k=='air'){if(e.ph=='plane'){const f=Math.min(1,e.pt/7),x=e.px0+(e.px1-e.px0)*f,y=e.py0+(e.py1-e.py0)*f,a=Math.atan2(e.py1-e.py0,e.px1-e.px0);g2.save();g2.translate(sx(x),sy(y));g2.rotate(a);g2.fillStyle='rgba(0,0,0,.25)';g2.fillRect(-30*k+14,-6*k+30,60*k,12*k);g2.fillStyle='#5a6470';g2.fillRect(-30*k,-6*k,60*k,12*k);g2.fillRect(-6*k,-34*k,14*k,68*k);g2.fillRect(-28*k,-14*k,8*k,28*k);g2.fillStyle='#8a949e';g2.fillRect(-30*k,-6*k,60*k,3*k);g2.restore()}
  if(e.ph=='ground'||e.ph=='hack'||e.ph=='def'||e.ph=='open'){const X=sx(e.x),Y=sy(e.y);g2.fillStyle='#2a3a24';g2.fillRect(X-22*k,Y-16*k,44*k,26*k);g2.fillStyle='#4f5a35';g2.fillRect(X-20*k,Y-14*k,40*k,22*k);g2.fillStyle='#e8e8e0';g2.font=Math.round(7*k)+'px monospace';g2.textAlign='center';g2.fillText('SUPPLY',X,Y);
   g2.fillStyle=(T*2|0)%2&&e.ph!='open'?'#ff3a2a':'#7a1a1a';g2.fillRect(X+14*k,Y-14*k,4*k,4*k);if(e.ph=='hack'){g2.fillStyle='#000a';g2.fillRect(X-24*k,Y-30*k,48*k,6*k);g2.fillStyle='#7fd0ff';g2.fillRect(X-24*k,Y-30*k,48*k*Math.min(1,e.hk/5),6*k)}
   if(e.ph=='def'){g2.strokeStyle='rgba(255,60,40,'+(.4+.3*Math.sin(T*8))+')';g2.lineWidth=2;g2.setLineDash([6,5]);g2.beginPath();g2.arc(X,Y,300*k,0,7);g2.stroke();g2.setLineDash([]);g2.font='bold 16px sans-serif';g2.fillStyle='#ff6a5a';g2.fillText('🚨 '+Math.ceil(e.left)+'초',X,Y-40*k)}}}
 if(e.k=='heli'&&e.ph=='fly'){const f=Math.min(1,e.pt/5),x=e.sx+(e.x-e.sx)*f,y=e.sy+(e.y-e.sy)*f,alt=(1-f)*80,spin=f>.55?(f-.55)*14:0;g2.save();g2.fillStyle='rgba(0,0,0,.3)';g2.beginPath();g2.ellipse(sx(x),sy(y),40*k*(1-f*.3),12*k,0,0,7);g2.fill();g2.translate(sx(x),sy(y-alt));g2.rotate(Math.atan2(e.y-e.sy,e.x-e.sx)+spin);g2.imageSmoothingEnabled=false;g2.drawImage(heliArt(0),-60*k*.8,-36*k*.8,120*k*.8,72*k*.8);
  g2.strokeStyle='rgba(30,30,30,.7)';g2.lineWidth=3;const ra=T*30;g2.beginPath();g2.moveTo(Math.cos(ra)*50*k,Math.sin(ra)*50*k);g2.lineTo(-Math.cos(ra)*50*k,-Math.sin(ra)*50*k);g2.stroke();g2.restore();for(let i=0;i<6;i++){g2.fillStyle='rgba(50,50,50,'+(.4-i*.06)+')';g2.beginPath();g2.arc(sx(x-(e.x-e.sx)/1100*i*30),sy(y-alt-(e.y-e.sy)/1100*i*30),(8+i*4)*k,0,7);g2.fill()}}
 if(e.k=='merf'&&e.pt<10){const X=sx(e.x),Y=sy(e.y),f=Math.min(1,e.pt/2.5),fy=Y-260*f+Math.max(0,e.pt-2.5)*18;const cx=Math.max(20,Math.min(W-20,X)),cy=Math.max(90,Math.min(H-300,fy));const gr=g2.createRadialGradient(cx,cy,2,cx,cy,90);gr.addColorStop(0,'rgba(255,120,90,.9)');gr.addColorStop(.25,'rgba(255,70,50,.45)');gr.addColorStop(1,'rgba(255,40,30,0)');g2.fillStyle=gr;g2.fillRect(cx-90,cy-90,180,180)}}});
document.head.insertAdjacentHTML('beforeend',`<style>body[data-moon] #c{filter:none}body[data-moon]::after{display:none}body[data-fog]::before{display:none}</style>`);
/* fog and moon flags from the original events */
{const _es2=evStart;evStart=function(k){const e=_es2(k);if(k=='fog')document.body.dataset.fog2=1;return e}}
{const _ee2=evEnd;evEnd=function(e){_ee2(e);if(e.k=='fog')delete document.body.dataset.fog2}}
/* buttons: hack the container, then open it */
{const _c=dmCtx;dmCtx=function(){const B=_c().filter(q=>!/보급 상자 열기/.test(q.t));const p=S.p;for(const e of WEV){if(e.k!='air'||Math.hypot(e.x-p.x,e.y-p.y)>70)continue;if(e.ph=='ground')B.unshift({t:'💻 보급 컨테이너 해킹 (5초)',f:()=>airHack(e),big:1});if(e.ph=='hack')B.unshift({t:'💻 해킹 중 '+Math.round(e.hk/5*100)+'%',f:null,info:1,pr:e.hk/5});
  if(e.ph=='open'&&!e.opened)B.unshift({t:'📦 컨테이너 열기',f:()=>{e.opened=1;const zn=e.zn,r={a556:60+15*zn,a9mm:40,medkit:2,[stoneFor(Math.max(1,zn))]:3,[runeFor(Math.max(1,zn+1))]:1};r[['ar','smg','sniper','lmg'][Math.random()*4|0]]=1;if(zn>=2)r.milarmor=1;give(r);s3Xp(150,'보급 방어');e.t=3},big:1})}return B}}
/* the old instant crate/arrow markers are replaced by the phases above */
{const _ev=evTick;evTick=function(dt){for(const e of WEV)if(e.k=='air'&&e.ph!='plane'&&e.fall>0)e.fall=0;_ev(dt)}}

/* events live in window coordinates: move them with the window */
{const _sh=infShift;infShift=function(dc,dr,q){_sh(dc,dr,q);if(!dc&&!dr)return;const dx=dc*PX,dy=dr*PY,mvp=o=>{if(!o)return;for(const[a,b]of[['x','y'],['px0','py0'],['px1','py1'],['sx','sy']])if(o[a]!=null){o[a]-=dx;o[b]-=dy}};
  for(const e of WEV)mvp(e);for(const L of[S.bags,S.rMolo,S.rNade])for(const o of L||[])mvp(o)}}
