/* PROJECT LEGACY — sample: NPC companions.
   Survivors you rescue (radio tower signal) come to the base. At the base: take one along (up to 2), or give them a
   job — 경비 (guards the base and shoots), 수색 (goes out, comes back next day with loot), 치료 (heals you at the base).
   Three kinds: 🔫 사수 (shoots from range) · 🪓 돌격 (runs in with an axe, tough) · 💊 의무병 (heals you, weak gun).
   They level up from kills. If they go down: revive them with a bandage within 40 s, or they limp home and rest a day.
   Built like the travelling merchant: an entity in Z with npc set, so your aim and the zombies ignore it.
   Loaded after metro_next.js / bigmap_next.js. */
'use strict';
const AROLE={gun:{nm:'사수',ic:'🔫',wk:'pistol',dmg:16,cd:.75,rng:300,hp:90,spd:150,ds:'멀리서 권총으로 쏴요'},
 mel:{nm:'돌격',ic:'🪓',wk:'axe',dmg:28,cd:.65,rng:34,hp:150,spd:165,ds:'도끼를 들고 달려들어요 · 튼튼해요'},
 med:{nm:'의무병',ic:'💊',wk:'pistol',dmg:9,cd:1,rng:200,hp:90,spd:150,heal:1,ds:'체력이 70% 아래면 치료해 줘요 · 약한 권총'}};
const AJOB={guard:['🛡','경비','거점에서 다가오는 좀비를 쏴요'],scav:['🔍','수색','나가서 다음 날 아침 물자를 가져와요'],heal:['💊','치료','거점 안에 있으면 체력을 채워 줘요']};
const ACOL=[['#7a5a3a','#94704a','#5e4428'],['#3a5a7a','#4a7094','#2a445e'],['#5a3a6a','#704a84','#442a50'],['#6a6a3a','#84844a','#50502a'],['#3a6a4a','#4a845e','#2a5036'],['#7a3a3a','#944a4a','#5e2a2a']];
ACOL.forEach((c,i)=>{if(!LOOKS['ally'+i])LOOKS['ally'+i]={...LOOKS.player,c:c[0],cl:c[1],cd:c[2],cap:i%2?null:LOOKS.player.cap,pack:1}});
const ALLY=()=>{S.inf.allies=S.inf.allies||[];return S.inf.allies};
const aById=id=>ALLY().find(a=>a.id==id);
const aMhp=a=>Math.round(AROLE[a.role].hp*(1+.12*(a.lv-1)));
const aDmg=a=>AROLE[a.role].dmg*(1+.1*(a.lv-1));
const aNext=a=>60*a.lv;
function allyNew(nm,role){const L=ALLY(),id=(S.inf.allyN=(S.inf.allyN||0)+1);role=role||['gun','mel','med'][Math.random()*3|0];const a={id,nm,role,lv:1,xp:0,st:'base',job:null,look:'ally'+(id%ACOL.length)};a.hp=aMhp(a);L.push(a);return a}
/* rescued survivors join */
{const _ss=sosSave;sosSave=function(){const s=S.inf.sos;const nm=s&&s.nm;_ss.apply(this,arguments);if(!nm)return;const a=allyNew(nm);
  setTimeout(()=>sigMsg('🤝 '+nm+'이(가) 동료가 됐어요',AROLE[a.role].ic+' '+AROLE[a.role].nm+' · '+AROLE[a.role].ds,'거점에서 만나요 · 데려가기 · 경비 · 수색 · 치료'),1200)}}
/* ---------- entities ---------- */
const BPOST=[[330,520],[390,540],[450,520],[510,540],[570,520],[630,540]];
function aEnt(a){return Z.find(z=>z.npc=='ally'&&z.ally==a.id)}
function aSpawn(a,x,y){const z={x,y,hp:1e9,mhp:1e9,look:a.look,npc:'ally',ally:a.id,g:1,stun:1e9,dir:'d',ph:0,mv:0,al:0,nm:a.nm,cd2:0,fx:0,fy:1};Z.push(z);return z}
function aWhere(a){const p=S.p,dun=typeof DUN!='undefined'&&DUN;if(a.st=='follow'||a.st=='down')return'p';if(dun)return null;
 if(a.st=='wait'&&a.wait){const[ox,oy]=bo(a.wait.gx-OGX,a.wait.gy-OGY);if(a.wait.gx>=OGX&&a.wait.gx<OGX+NBX&&a.wait.gy>=OGY&&a.wait.gy<OGY+NBY)return[ox+a.wait.lx,oy+a.wait.ly];return null}
 if((a.st=='base'||a.st=='job'&&a.job!='scav')&&W0.base){const i=ALLY().filter(q=>q.st=='base'||q.st=='job').indexOf(a),P=BPOST[i%BPOST.length];return[W0.base.ox+P[0],W0.base.oy+P[1]]}return null}
function aSync(){for(const a of ALLY()){const w=aWhere(a);let z=aEnt(a);if(!w){if(z)Z.splice(Z.indexOf(z),1);continue}
  if(w=='p'){const p=S.p;if(!z)z=aSpawn(a,p.x-40,p.y+30);else if(Math.hypot(z.x-p.x,z.y-p.y)>900){z.x=p.x-40;z.y=p.y+30}}else if(!z)aSpawn(a,w[0],w[1]);else if(a.st!='follow'&&Math.hypot(z.x-w[0],z.y-w[1])>400){z.x=w[0];z.y=w[1]}}
 for(let i=Z.length-1;i>=0;i--){const z=Z[i];if(z.npc=='ally'&&!aById(z.ally))Z.splice(i,1)}}
const hostiles=()=>Z.filter(z=>!z.npc&&z.hp>0&&!z.gone&&!z.env);
function aShoot(a,z,q){const R0=AROLE[a.role],dx=q.x-z.x,dy=q.y-z.y,d=Math.hypot(dx,dy)||1;z.fx=dx;z.fy=dy;q.lastAlly=a.id;hitZ(q,aDmg(a),dx/d,dy/d,1);
 if(R0.rng>60){fx.push({k:'tr',a:[z.x+dx/d*10,z.y-16],b:[q.x,q.y-14],l:.07});fx.push({k:'fl',x:z.x+dx/d*14,y:z.y-16+dy/d*6,l:.05});try{sfx((A,t)=>tone(A,t,{w:'square',f0:420,f1:160,d:.06,v:.05}))}catch(e){}}
 else{try{sfx((A,t)=>tone(A,t,{w:'sawtooth',f0:140,f1:60,d:.08,v:.06}))}catch(e){}}}
function aThink(a,z,dt){const p=S.p,R0=AROLE[a.role],dp=Math.hypot(p.x-z.x,p.y-z.y);z.cd2=Math.max(0,(z.cd2||0)-dt);z.mv=0;
 if(a.st=='down'){a.downT-=dt;if(a.downT<=0){a.st='hurt';a.hurtDay=S.day;a.hp=Math.round(aMhp(a)*.5);msg('🩹 '+a.nm+'이(가) 거점으로 피신했어요 · 하루 쉬어야 해요')}return}
 const H=hostiles();let tgt=null,bd=1e9;const scan=a.st=='follow'?Math.max(R0.rng,260):a.job=='guard'?320:R0.rng;
 for(const q of H){const d=Math.hypot(q.x-z.x,q.y-z.y);if(d<scan&&d<bd&&(typeof rSee!='function'||rSee(z,q))){bd=d;tgt=q}}
 /* move */let gx=null,gy=null;if(a.st=='follow'){const i=ALLY().filter(q=>q.st=='follow').indexOf(a),bx=p.x-(p.fx||0)*50+(i?28:-28),by=p.y-(p.fy||1)*50;
   if(R0.rng<60&&tgt&&dp<260){gx=tgt.x;gy=tgt.y}else if(Math.hypot(bx-z.x,by-z.y)>36){gx=bx;gy=by}}
 if(gx!=null){const dx=gx-z.x,dy=gy-z.y,d=Math.hypot(dx,dy)||1,sp=R0.spd*(dp>320?1.7:1);if(d>(R0.rng<60&&tgt?R0.rng-6:8)){mv(z,dx/d*sp*dt,dy/d*sp*dt,7,'p');z.mv=1;z.fx=dx;z.fy=dy}}
 z.walk=z.mv?.15:Math.max(0,(z.walk||0)-dt);if(z.mv)z.ph=(z.ph||0)+dt*R0.spd/18;
 /* fight */if(tgt&&z.cd2<=0&&bd<=R0.rng+(R0.rng<60?6:0)){z.cd2=R0.cd;aShoot(a,z,tgt);a.fight=4}
 /* heal you */if((R0.heal&&a.st=='follow'||a.job=='heal'&&inBase(p.x,p.y))&&p.hp<MHP(p)*.7&&dp<160){p.hp=Math.min(MHP(p),p.hp+(a.job=='heal'?3:4)*dt);if(Math.random()<dt*3)fx.push({k:'ember',x:p.x+(Math.random()-.5)*16,y:p.y-20-Math.random()*16,l:.4,c:'#7fd07f'})}
 /* get hurt by what is next to you */for(const q of H)if(!q.mnest&&!q.hive&&Math.hypot(q.x-z.x,q.y-z.y)<26){a.hp-=(q.dmg||7)*.55*dt;z.hurt=.15;a.fight=4}
 a.fight=Math.max(0,(a.fight||0)-dt);if(!a.fight)a.hp=Math.min(aMhp(a),a.hp+2*dt);
 if(a.hp<=0){a.hp=0;a.st='down';a.downT=40;msg('🆘 '+a.nm+'이(가) 쓰러졌어요! 40초 안에 다가가서 일으켜 주세요 (붕대)')}}
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!S||!S.inf||!run||PAUSE)return;aSync();for(const z of Z)if(z.npc=='ally'){const a=aById(z.ally);if(a)aThink(a,z,dt)}aDaily()}}
/* your shots and blasts never hurt them */
{const _hz=hitZ;hitZ=function(q,dmg,dx,dy,n){if(q&&q.npc=='ally')return;return _hz(q,dmg,dx,dy,n)}}
/* experience from their kills */
{const _k=kill;kill=function(z){const r=_k(z);if(z&&z.lastAlly){const a=aById(z.lastAlly);if(a){a.xp+=z.tboss?120:z.b||z.raider?25:8;while(a.xp>=aNext(a)){a.xp-=aNext(a);a.lv++;a.hp=aMhp(a);msg('⭐ '+a.nm+' 레벨 업! Lv'+a.lv+' · 피해 +10% · 체력 +12%')}}}return r}}
/* the morning: scavengers come back, the hurt are rested */
function aDaily(){if(S.inf.allyDay==null)S.inf.allyDay=S.day;if(S.day<=S.inf.allyDay)return;S.inf.allyDay=S.day;const got={},who=[];
 for(const a of ALLY()){if(a.st=='hurt'&&S.day>a.hurtDay){a.st='base';a.hp=aMhp(a)}
  if(a.st=='job'&&a.job=='scav'){const P=['food','water','bandage','scrap','scrap','wood','cloth','elec','a9mm','fuel'];const n=2+a.lv+(Math.random()*3|0);for(let i=0;i<n;i++){const k=P[Math.random()*P.length|0];got[k]=(got[k]||0)+(k=='a9mm'?6:1)}a.xp+=15;who.push(a.nm)}}
 if(who.length){give(got);sigMsg('🔍 수색조 귀환',who.join(' · ')+'이(가) 물자를 가져왔어요',Object.entries(got).map(([k,n])=>NM2(k)+' '+n).join(' · '))}}
/* ---------- drawing ---------- */
{const _zd=zDraw4;zDraw4=function(z){if(z.npc!='ally')return _zd(z);const a=aById(z.ally);if(!a)return true;const R0=AROLE[a.role];
  g.save();g.globalAlpha=.55;g.strokeStyle='#5aa8ff';g.lineWidth=2;g.beginPath();g.ellipse(z.x,z.y+1,14,5,0,0,6.28);g.stroke();g.restore();
  if(a.st=='down'){g.save();g.globalAlpha=.75;g.translate(z.x,z.y);g.rotate(Math.PI/2);drawChar(a.look,0,0,'d',-1);g.restore();const t=performance.now()/300;g.font='bold 10px sans-serif';g.textAlign='center';g.fillStyle='#ff8a7a';g.fillText('🆘 '+a.nm+' · '+Math.ceil(a.downT)+'초',z.x,z.y-34+Math.sin(t)*2);return true}
  const fr=z.walk>0?(typeof F8=='function'?F8(z.ph||0):(z.ph|0)%4):-1,dir=typeof dir8=='function'?(z.d8=dir8(z.fx,z.fy,z.d8)):'d';drawChar(a.look,z.x,z.y,dir,fr,R0.wk);
  if(z.hurt>0){z.hurt-=.016;g.globalAlpha=.45;R('#ff3a2a',z.x-9,z.y-36,18,34);g.globalAlpha=1}
  const w=26,f=Math.max(0,a.hp/aMhp(a));R('#000a',z.x-w/2-1,z.y-48,w+2,5);R(f>.5?'#5fe08a':f>.25?'#ffd36a':'#ff6a5a',z.x-w/2,z.y-47,w*f,3);
  g.font='bold 9px sans-serif';g.textAlign='center';g.fillStyle='#9ad0ff';g.fillText(R0.ic+' '+a.nm+' Lv'+a.lv+(a.st=='job'?' · '+AJOB[a.job][1]:a.st=='wait'?' · 대기':''),z.x,z.y-52);return true}}
/* allies on the minimap and the map (always, in blue) */
{const _mm=mm2;mm2=function(){_mm();if(!S||!S.p||typeof DUN!='undefined'&&DUN&&DUN.sh=='mine')return;const c=$('mm2');if(!c||$('mmw').style.display=='none')return;const x=c.getContext('2d'),W2=c.width,sc=MMBIG?.35:1,k=MK*sc,cx=S.p.x*k-W2/2,cy=S.p.y*k-W2/2;
  x.fillStyle='#5aa8ff';for(const z of Z)if(z.npc=='ally')x.fillRect(z.x*k-cx-1.5,z.y*k-cy-1.5,3,3)}}
if(typeof bmDraw=='function'){const _bd=bmDraw;bmDraw=function(){_bd();const c=$('bmC');if(!c||!BM)return;const x=c.getContext('2d'),cw=c.clientWidth,ch=c.clientHeight,k=BM.k;for(const z of Z)if(z.npc=='ally'){const a=aById(z.ally),X=cw/2+(z.x-BM.vx)*k,Y=ch/2+(z.y-BM.vy)*k;
  x.fillStyle='#5aa8ff';x.strokeStyle='#000';x.lineWidth=1.5;x.beginPath();x.arc(X,Y,5,0,7);x.fill();x.stroke();if(a&&PX*k>50){x.font='bold 10px sans-serif';x.textAlign='center';x.fillStyle='#9ad0ff';x.fillText(a.nm,X,Y-9)}}}}
/* ---------- talking to them ---------- */
const nFollow=()=>ALLY().filter(a=>a.st=='follow'||a.st=='down').length;
function aSet(a,st,job){const was=a.st;a.st=st;a.job=job||null;if(st=='wait'){const z=aEnt(a),[gx,gy]=gOf(z.x,z.y),[ox,oy]=bo(gx-OGX,gy-OGY);a.wait={gx,gy,lx:z.x-ox,ly:z.y-oy}}
 const say={follow:'🤝 '+a.nm+': "같이 가요!"',wait:'✋ '+a.nm+': "여기서 기다릴게요"',base:'🏠 '+a.nm+'이(가) 거점으로 돌아가요',job:{guard:'🛡 '+a.nm+': "거점은 제가 지킬게요"',scav:'🔍 '+a.nm+': "내일 아침에 돌아올게요"',heal:'💊 '+a.nm+': "다치면 거점으로 오세요"'}[job]};msg(st=='job'?say.job:say[st])}
function aRevive(a){const p=S.p,k=p.inv.medkit>0&&!(p.inv.bandage>0)?'medkit':'bandage';if(!(p.inv[k]>0))return msg('🩹 붕대나 구급상자가 있어야 일으킬 수 있어요');p.inv[k]--;a.st='follow';a.hp=Math.round(aMhp(a)*(k=='medkit'?.8:.45));msg('🩹 '+a.nm+'을(를) 일으켰어요!')}
{const _c=dmCtx;dmCtx=function(){const B=_c();if(!S||!run)return B;const p=S.p;for(const z of Z){if(z.npc!='ally')continue;const a=aById(z.ally);if(!a||Math.hypot(z.x-p.x,z.y-p.y)>64)continue;const nm=' · '+a.nm;
  if(a.st=='down'){B.unshift({t:'🩹 일으키기'+nm+' · 붕대 1',f:()=>aRevive(a),big:1});continue}
  if(a.st=='follow'){B.push({t:'✋ 여기서 기다려'+nm,f:()=>aSet(a,'wait'),sm:1},{t:'🏠 거점으로 보내기'+nm,f:()=>aSet(a,'base'),sm:1})}
  else if(a.st=='wait'){B.unshift({t:'🤝 따라와'+nm,f:()=>aSet(a,'follow'),big:1});B.push({t:'🏠 거점으로 보내기'+nm,f:()=>aSet(a,'base'),sm:1})}
  else{B.unshift({t:nFollow()>=2?'🤝 같이 가자 (동료 2명까지)':'🤝 같이 가자'+nm,f:()=>aSet(a,'follow'),off:nFollow()>=2,big:1});for(const j in AJOB)if(a.job!=j)B.push({t:AJOB[j][0]+' '+AJOB[j][1]+' 맡기기'+nm,f:()=>aSet(a,'job',j),sm:1});if(a.st=='job')B.push({t:'😴 쉬게 하기'+nm,f:()=>aSet(a,'base'),sm:1})}
  B.push({t:'📋 동료 관리',f:aOpen,sm:1})}return B}}
if(typeof IAW!='undefined')IAW.unshift([/일으키기/,'일으키기'],[/같이 가자|따라와/,'같이 가기'],[/기다려/,'기다려'],[/거점으로 보내기/,'돌려보내기'],[/맡기기/,'일 맡기기'],[/동료 관리/,'동료']);
/* ---------- the management sheet ---------- */
function aOpen(){const b=$('bm'),L=ALLY();b.dataset.m='ally';PAUSE=true;const stT=a=>a.st=='follow'?'🤝 같이 다니는 중':a.st=='wait'?'✋ 기다리는 중':a.st=='down'?'🆘 쓰러짐':a.st=='hurt'?'🩹 쉬는 중 (내일)':a.st=='job'?AJOB[a.job][0]+' '+AJOB[a.job][1]+' 중':'🏠 거점';
 b.innerHTML='<div class="sh"><h2>👥 동료</h2><div class="wt">'+L.length+'명 · 같이 다니기 '+nFollow()+'/2 · 거점에서 일을 맡길 수 있어요</div><button onclick="closeBase();PAUSE=false">✕</button></div>'+
  (L.length?L.map(a=>{const R0=AROLE[a.role],hp=a.hp/aMhp(a),busy=a.st=='down'||a.st=='hurt';return'<div class="alC"><div class="alH"><canvas data-al="'+a.id+'" width="40" height="48"></canvas><div class="alN"><b>'+R0.ic+' '+a.nm+'</b> <small>'+R0.nm+' · Lv'+a.lv+'</small><div class="mut">'+stT(a)+'</div>'+
   '<div class="alB"><i style="width:'+(hp*100)+'%;background:'+(hp>.5?'#5fe08a':'#ffd36a')+'"></i></div><div class="alX"><i style="width:'+(a.xp/aNext(a)*100)+'%"></i></div><small class="mut">체력 '+Math.round(a.hp)+'/'+aMhp(a)+' · 피해 '+Math.round(aDmg(a))+' · 경험치 '+a.xp+'/'+aNext(a)+'</small></div></div>'+
   '<div class="alA">'+(busy?'':'<button data-a="'+a.id+'" data-s="follow"'+(a.st=='follow'||nFollow()>=2?' disabled':'')+'>🤝 데려가기</button>'+Object.keys(AJOB).map(j=>'<button data-a="'+a.id+'" data-s="job" data-j="'+j+'"'+(a.st=='job'&&a.job==j?' disabled':'')+'>'+AJOB[j][0]+' '+AJOB[j][1]+'</button>').join('')+'<button data-a="'+a.id+'" data-s="base"'+(a.st=='base'?' disabled':'')+'>😴 쉬기</button>')+'</div></div>'}).join(''):'<div class="sub">아직 동료가 없어요 · 방송국 송신탑에서 생존자 신호를 찾아 구출하면 동료가 돼요</div>')+
  '<div class="sub" style="line-height:1.6;margin-top:6px">· 🔫 사수: 멀리서 쏴요 · 🪓 돌격: 달려들어 도끼 · 튼튼 · 💊 의무병: 체력 70% 아래면 치료<br>· 🛡 경비: 거점에서 좀비를 쏴요 · 🔍 수색: 다음 날 아침 물자 · 💊 치료: 거점에 있으면 회복<br>· 쓰러지면 40초 안에 붕대로 일으키기 · 못 하면 거점에서 하루 쉬어요 · 처치하면 경험치 → 레벨 업 · 탄약은 쓰지 않아요</div>';
 b.style.display='block';b.querySelectorAll('canvas[data-al]').forEach(c=>{const a=aById(+c.dataset.al);try{const x=c.getContext('2d'),g0=g;g=x;x.translate(20,44);drawChar(a.look,0,0,'d',-1,AROLE[a.role].wk);g=g0}catch(e){}});
 b.querySelectorAll('[data-a]').forEach(bt=>bt.onclick=()=>{const a=aById(+bt.dataset.a);if(bt.dataset.s=='follow'&&!inBase(S.p.x,S.p.y)&&a.st!='wait'){msg('🤝 거점에 있는 동료는 거점에서 데려가요');return}aSet(a,bt.dataset.s,bt.dataset.j);aOpen()})}
document.head.insertAdjacentHTML('beforeend',`<style>#bm .alC{padding:9px;margin:7px 0;border-radius:12px;background:#ffffff0c;border:1px solid #5aa8ff33}#bm .alH{display:flex;gap:10px}#bm .alH canvas{width:40px;height:48px;image-rendering:pixelated;background:#0006;border-radius:8px}#bm .alN{flex:1}#bm .alN small{color:var(--mut)}
#bm .alB,#bm .alX{height:6px;border-radius:3px;background:#ffffff14;margin:4px 0 2px;overflow:hidden}#bm .alB i,#bm .alX i{display:block;height:100%}#bm .alX{height:4px}#bm .alX i{background:#5aa8ff}#bm .alA{display:flex;flex-wrap:wrap;gap:5px;margin-top:7px}#bm .alA button{flex:1;min-width:70px;padding:6px 4px;font-size:12px}</style>`);
