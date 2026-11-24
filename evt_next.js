/* PROJECT LEGACY — sample: merchants, world events, revenge raids on captured camps, and turret aim lines.
   · Merchant: a walking trader (8-way, like everyone else) who roams the roads; trade in scrap.
   · Events: airdrop · zombie horde · blood moon (big) / fog · helicopter crash · raiders-vs-zombies · merchant flare (small).
     A day gets one big and one or two small events.
   · Revenge: two days after you take a raider camp, raiders come back for it — and keep coming every few days.
   · Turrets show a red line to whatever they are aiming at.  Loaded after rvar_next.js. */
'use strict';
{const H=(o)=>Object.assign({},LOOKS.player,{pack:1},o);LOOKS.mer=H({p:'#5a4a2a',pd:'#4a3a1e',c:'#8a6a3a',cl:'#a07e4a',cd:'#6a5028',h:'#d8d0c0',cap:'#6a3a2a'})}
/* ---------- NPCs live in Z (so they walk, draw and get pushed like others) but nobody targets them ---------- */
{const _u=updTarget;updTarget=function(p){const keep=Z;Z=Z.filter(q=>!q.npc);try{return _u(p)}finally{Z=keep}}}
{const _c=cone;cone=function(){return _c.apply(this,arguments).filter(q=>!q.npc)}}
{const _hz=hitZ;hitZ=function(q,d,dx,dy,n){if(q&&q.npc)return;return _hz(q,d,dx,dy,n)}}
/* ---------- merchant ---------- */
const MSTOCK=[[['food',3],['water',3],['bandage',4],['a9mm',6,10],['a12g',8,6],['cloth',2]],[['medkit',15],['enh1',12],['a556',10,10],['bag2',30]],[['vest',45],['helmet',30],['enh2',30],['rn_fire2',40],['rn_hunt2',40],['dt2',50]],[['enh3',70],['milarmor',120],['rn_hunt3',90],['rn_exec3',90],['dt3',150],['dx1',60],['sniper',140]]];
const SELLR={c:2,u:6,r:15,e:35,l:80};
function sellV(k){if(k=='scrap')return 0;const it=I_BY[k]||W_BY[k];if(!it)return 1;const c=catOf(k);if(c=='a')return .15;if(W_BY[k])return SELLR[it[3]]||3;if(k.startsWith('rn_'))return 12*(+k.slice(-1));return{enh1:5,enh2:12,enh3:28,enhg:20,medkit:6,vest:18,helmet:12,milarmor:45,armor:25}[k]||Math.max(1,(SELLR[it[3]]||2)/2)}
function merSpawn(x,y,o={}){const zn=Math.max(0,zoneOf(...gOf(x,y))),st={};const tiers=Math.min(3,zn+ (o.rich?1:0));for(let t=0;t<=tiers;t++)for(const[k,pr,n]of MSTOCK[t])st[k]={pr:Math.round(pr*(1+.1*zn)),n:n?n*(3+t):(3+(Math.random()*4|0)),per:n||1};
 const m={x,y,hp:1e9,mhp:1e9,look:'mer',npc:'mer',g:1,stun:1e9,dir:'d',ph:0,mv:0,al:0,st,wait:o.wait||0,life:o.life||240,nm:'떠돌이 상인',zn};Z.push(m);S.merN=(S.merN||0)+1;return m}
function merThink(m,dt){m.stun=1e9;m.life-=dt;if(m.life<=0){m.hp=-1e-9;m.gone=1;msg('💰 상인이 떠났어요');return}m.walk=Math.max(0,(m.walk||0)-dt);
 if(m.wait>0||Math.hypot(S.p.x-m.x,S.p.y-m.y)<90){m.wait=Math.max(0,m.wait-dt);const dx=S.p.x-m.x,dy=S.p.y-m.y;m.fx=dx;m.fy=dy;return}
 if(!m.path||!m.path.length){const c=Math.floor((m.x-RD/2)/PX),r=Math.floor((m.y-RD/2)/PY),nc=Math.max(0,Math.min(NBX-1,c+(Math.random()*3|0)-1)),nr=Math.max(0,Math.min(NBY-1,r+(Math.random()*3|0)-1)),[ax,ay]=bo(nc,nr);const tx=ax-RD/2,ty=ay-RD/2;m.path=[[tx,m.y],[tx,ty]]}
 const[tx,ty]=m.path[0],dx=tx-m.x,dy=ty-m.y,d=Math.hypot(dx,dy);if(d<6){m.path.shift();return}const sp=60*dt;mv(m,dx/d*sp,dy/d*sp,7);m.fx=dx;m.fy=dy;m.walk=.15;m.ph=(m.ph||0)+sp/18}
function merNear(){return Z.find(q=>q.npc=='mer'&&q.hp>0&&Math.hypot(q.x-S.p.x,q.y-S.p.y)<100)}
let MERT=null;
function openMer(m){m=m||MERT;if(!m)return;MERT=m;{const zb=$('zoneb');if(zb)zb.classList.remove('on')}const b=$('bm'),p=S.p;b.dataset.m='mer';PAUSE=true;const tile=(k,top,bot,on,cls)=>'<div class="stT r'+((I_BY[k]||W_BY[k]||[])[3]||'c')+(cls||'')+'" onclick="'+on+'"><img src="'+icon(k)+'"><b>'+top+'</b><small>'+NM2(k)+'<br><span style="color:#ffd36a">'+bot+'</span></small></div>';
 let h='<div class="sh"><h2>💰 떠돌이 상인 · '+m.zn+'구역</h2><div class="wt">내 고철 <b style="color:#ffd36a">'+(p.inv.scrap|0)+'</b> · 고철이 돈이에요 · '+(m.wait>0?'⏳ '+Math.ceil(m.wait)+'초 더 기다려요':'곧 떠날 수도 있어요')+'</div><button onclick="closeBase()">✕</button></div>';
 h+='<h4>🛒 사기 (누를 때마다 1묶음)</h4><div class="stG">'+Object.entries(m.st).filter(([k,v])=>v.n>0).map(([k,v])=>tile(k,'×'+v.n,'🔩 '+v.pr+(v.per>1?' / '+v.per+'발':''),"merBuy('"+k+"')",(p.inv.scrap|0)<v.pr?' no':'')).join('')+'</div>';
 const sell=Object.keys(p.inv).filter(k=>(p.inv[k]|0)>0&&sellV(k)>0&&!p.quick.includes(k)&&!Object.values(p.eq).includes(k)).sort((a,b)=>sellV(b)-sellV(a));
 h+='<h4>💸 팔기 (장착·퀵슬롯 제외)</h4>'+(sell.length?'<div class="stG">'+sell.map(k=>tile(k,'×'+(p.inv[k]|0),'🔩 '+(sellV(k)<1?Math.round(sellV(k)*10)+' / 10개':Math.floor(sellV(k))),"merSell('"+k+"')")).join('')+'</div>':'<p class="mut">팔 물건이 없어요</p>');
 h+='<p class="mut" style="font-size:11px">구역이 높은 상인일수록 좋은 물건(상급 강화석 · 룬 · 군용 방탄복 · 유압 브레이커 · 폭약)을 팔아요 · 약탈자에게서 얻은 무기를 팔기 좋아요</p>';b.innerHTML=h;b.style.display='block'}
function merBuy(k){const m=MERT,v=m.st[k],p=S.p;if(!v||v.n<=0)return;if((p.inv.scrap|0)<v.pr)return msg('🔩 고철이 모자라요');invTake(p,'scrap',v.pr);invAdd(p,k,v.per);v.n--;S.merBuy=(S.merBuy||0)+1;openMer();hud2()}
function merSell(k){const p=S.p,v=sellV(k);if(v<1){const n=Math.min(10,p.inv[k]|0);invTake(p,k,n);invAdd(p,'scrap',Math.round(v*n))}else{invTake(p,k,1);invAdd(p,'scrap',Math.floor(v))}S.merSell=(S.merSell||0)+1;openMer();hud2()}
/* ---------- world events ---------- */
const EVB=[['air','🪂 에어드랍','보급 상자가 떨어져요 · 연기를 따라가세요 · 좀비와 약탈자도 몰려와요'],['horde','🌊 좀비 대이동','수십 마리 무리가 지도를 가로질러요 · 숨거나 돌아가세요'],['moon','🌕 핏빛 달','오늘 밤 좀비가 빠르고 특수 좀비 2배 · 처치 보상 2배']];
const EVS=[['fog','🌫 짙은 안개','앞이 잘 안 보여요 · 좀비도 늦게 알아채요'],['heli','🚁 헬기 추락','군용 보급품과 군인 좀비'],['fight','⚔ 약탈자 vs 좀비','멀리서 총소리 · 끝나면 전리품 가방'],['merf','📡 상인 신호탄','상인이 잠깐 기다려요 · 늦으면 떠나요']];
let WEV=[];const EVOUT={air:120,horde:90,moon:0,fog:150,heli:180,fight:150,merf:90};
function evAt(dist){const p=S.p,a=Math.random()*Math.PI*2;let x=p.x+Math.cos(a)*dist,y=p.y+Math.sin(a)*dist;x=Math.max(RD,Math.min(WW-RD,x));y=Math.max(RD,Math.min(WH-RD,y));for(let i=0;i<40&&blocker(x,y,20);i++){x+=(Math.random()-.5)*80;y+=(Math.random()-.5)*80}return[x,y]}
function evStart(k){const p=S.p,zn=Math.max(0,zoneOf(...gOf(p.x,p.y))),e={k,t:EVOUT[k]||120,zn};WEV.push(e);S.evN=(S.evN||0)+1;const nm=[...EVB,...EVS].find(q=>q[0]==k);evBanner(nm[1],nm[2]);
 if(k=='air'){[e.x,e.y]=evAt(700);e.fall=4;noise(e.x,e.y,5);setTimeout(()=>{if(!WEV.includes(e))return;for(let i=0;i<6;i++)mk(e.x+(Math.random()-.5)*300,e.y+(Math.random()-.5)*300,{w:1});if(zn>=1&&Math.random()<.6)rSquad(e.x+250,e.y,zn,{x:e.x,y:e.y})},4000)}
 if(k=='horde'){const side=Math.random()<.5?-1:1,ox=p.x+side*900;e.dir=-side;for(let i=0;i<36;i++){mk(ox+(Math.random()-.5)*160,p.y-420+i*24,{w:1});const z=Z[Z.length-1];z.horde=1;z.al=30;z.nx=p.x-side*1400;z.ny=z.y}}
 if(k=='moon'){S.moon=1;S.t=Math.max(S.t,1850);document.body.dataset.moon=1;for(const z of Z)if(!z.raider&&!z.npc)z.sm=(z.sm||1)*1.2}
 if(k=='fog'){document.body.dataset.fog=1}
 if(k=='heli'){[e.x,e.y]=evAt(650);W0.objs.push({t:'heli',x:e.x-60,y:e.y-30,w:120,h:60,id:'evheli'},{t:'truck',x:e.x+80,y:e.y+40,w:70,h:34,id:'evtruck',c:'#4f5a35'},{t:'ammo',x:e.x-40,y:e.y+60,w:34,h:20,id:'evammo'});infDerived();
  S.fires=(S.fires||[]).concat([{x:e.x+20,y:e.y,r:45,t:EVOUT.heli}]);for(let i=0;i<6;i++)mk(e.x+(Math.random()-.5)*260,e.y+(Math.random()-.5)*200,{look:i%2?'soldier':'heavy'})}
 if(k=='fight'){[e.x,e.y]=evAt(560);const L=rSquad(e.x,e.y,Math.max(1,zn));L.forEach(q=>q.state='fight');for(let i=0;i<10;i++)mk(e.x+(Math.random()<.5?-1:1)*(120+Math.random()*80),e.y+(Math.random()-.5)*160,{w:1});const z=Z[Z.length-1];for(const q of Z)if(!q.raider&&!q.npc&&Math.hypot(q.x-e.x,q.y-e.y)<300){q.al=10;q.nx=e.x;q.ny=e.y}}
 if(k=='merf'){[e.x,e.y]=evAt(520);e.m=merSpawn(e.x,e.y,{wait:EVOUT.merf,life:EVOUT.merf+20,rich:1})}
 return e}
function evEnd(e){WEV=WEV.filter(q=>q!==e);if(e.k=='fog')delete document.body.dataset.fog;if(e.k=='moon'){S.moon=0;delete document.body.dataset.moon}if(e.k=='air'&&!e.opened)msg('🪂 보급 상자가 사라졌어요');if(e.k=='heli')W0.objs=W0.objs.filter(o=>!/^ev/.test(o.id||'')),infDerived()}
function evTick(dt){for(const e of WEV.slice()){if(e.t>0){e.t-=dt;if(e.t<=0&&e.k!='moon'){evEnd(e);continue}}if(e.k=='air'&&e.fall>0)e.fall-=dt;if(e.k=='moon'&&S.t>=360&&S.t<1500)evEnd(e)}
 /* raiders killed far from you leave a loot bag */}
{const _k=kill;kill=function(z){if(z.npc)return;_k(z);if(z.raider&&!z.gone&&S&&Math.hypot(z.x-S.p.x,z.y-S.p.y)>350){S.bags=(S.bags||[]).concat([{x:z.x,y:z.y,r:{[z.wid]:Math.random()<.6?1:0,[stoneFor(z.raider)]:Math.random()<.4?1:0,a9mm:12}}])}
  if(S&&S.moon&&!z.raider&&!z.npc&&Math.random()<.25)invAdd(S.p,stoneFor(Math.max(1,zoneOf(...gOf(z.x,z.y)))),1)}}
{const _zp=zPick;zPick=function(zn){const r=_zp(zn);if(r||!S||!S.moon)return r;return _zp(zn)}}
function evBanner(t,d){const el=$('zoneb');if(!el)return msg(t+' · '+d);zoneRaw('<b style="color:#ffd36a;font-size:19px">'+t+'</b><small>'+d+'</small>','#e0b03a',4200)}
/* ---------- revenge raids on camps you took ---------- */
function revengeCheck(){const rb=S.inf.rb||{};for(const gk in rb){const st=rb[gk];if(!st.taken)continue;const o=OP0()[gk];if(!o){continue}st.rv=st.rv||{n:0,next:(st.takenDay!=null?st.takenDay:S.day)+2};if(S.day<st.rv.next)continue;
  st.rv.next=S.day+3+(Math.random()*2|0);st.rv.n++;const[gx,gy]=gk.split(',').map(Number),zn=Math.max(2,zoneOf(gx,gy)),[pgx,pgy]=gOf(S.p.x,S.p.y);
  if(Math.max(Math.abs(pgx-gx),Math.abs(pgy-gy))<=1){const[ox,oy]=bo(gx-OGX,gy-OGY),c={x:ox+BW/2,y:oy+BH/2+60,hit:dt=>{o.hp=Math.max(0,o.hp-dt*4)}};for(let i=0;i<Math.min(3,st.rv.n);i++)rSquad(ox+BW/2+(i-1)*300,oy-RD/2-60,zn+Math.floor(st.rv.n/2),c);
   evBanner('🏴 복수 습격! ('+st.rv.n+'번째)','약탈자가 빼앗긴 기지를 되찾으러 왔어요 · 막아내세요');o.log.unshift('Day '+S.day+' · 복수 습격 '+st.rv.n+'번째 (직접 방어)')}
  else{const armed=o.turs.filter(q=>tArmed(o,q)).length,dmg=Math.max(5,40-armed*12-o.wall*5)+st.rv.n*5;o.hp=Math.max(0,o.hp-dmg);for(const q of o.turs)if(tArmed(o,q)){const T=TURT[q.t];o.st[T.am]-=Math.max(1,Math.ceil(15*T.use))}
   o.log.unshift('Day '+S.day+' · 복수 습격 '+st.rv.n+'번째 · −'+dmg+'% (포탑 '+armed+'개)');msg('🏴 '+gk+' 점령 기지에 복수 습격 · 내구 '+o.hp+'%'+(o.hp<=0?' · 무너졌어요':''));if(o.hp<=0){delete OP0()[gk];st.taken=0;st.clear=0;st.left=st.tot;infRebuild()}}}}
{const _tk=rbTake;rbTake=function(){const[gx,gy]=gOf(S.p.x,S.p.y),st=rbState(gx+','+gy);_tk();if(st&&st.taken){st.takenDay=S.day;st.rv={n:0,next:S.day+2};msg('⛺ 약탈자 기지를 점령했어요 · ⚠ 이틀 뒤부터 약탈자가 되찾으러 올 거예요')}}}
let RVDAY=null;
/* ---------- turret aim lines ---------- */
OVL.push((g2,sx,sy,k)=>{const ops=S.inf&&S.inf.op;if(!ops||DUN)return;for(const gk in ops){const o=ops[gk];if(!o.turs)continue;const[gx,gy]=gk.split(',').map(Number),c=gx-OGX,r=gy-OGY;if(c<0||r<0||c>=NBX||r>=NBY)continue;const[ox,oy]=bo(c,r);
  for(const q of o.turs){const t=q.tg;if(!t||t.hp<=0||q.want==null||!Z.includes(t))continue;const x=ox+q.rx,y=oy+q.ry-14,P=TURT[q.t];let df=q.want-(q.ha!=null?q.ha:q.want);df=Math.abs(Math.atan2(Math.sin(df),Math.cos(df)));const on=df<=Math.min(.3,P.arc/360*Math.PI)||P.arc>=360;
   g2.strokeStyle=on?'rgba(255,50,40,.85)':'rgba(255,120,60,.45)';g2.lineWidth=on?2:1;g2.setLineDash(on?[]:[5,4]);g2.beginPath();g2.moveTo(sx(x),sy(y));g2.lineTo(sx(t.x),sy(t.y-14));g2.stroke();g2.setLineDash([]);if(on){g2.strokeStyle='rgba(255,50,40,.9)';g2.beginPath();g2.arc(sx(t.x),sy(t.y-14),7*k,0,7);g2.stroke()}}}});
/* ---------- event markers: smoke, parachute, bags, merchant ---------- */
OVL.push((g2,sx,sy,k)=>{const T=performance.now()/1000,W=innerWidth,H=innerHeight;const mark=(x,y,ic,lbl)=>{const X=sx(x),Y=sy(y);if(X>10&&Y>60&&X<W-10&&Y<H-10)return;const a=Math.atan2(Y-H/2,X-W/2),r=Math.min(W,H)*.42,ex=Math.max(24,Math.min(W-24,W/2+Math.cos(a)*r)),ey=Math.max(150,Math.min(H-320,H/2+Math.sin(a)*r*1.3));g2.fillStyle='#000a';g2.beginPath();g2.arc(ex,ey-5,15,0,7);g2.fill();g2.font='16px sans-serif';g2.textAlign='center';g2.fillStyle='#fff';g2.fillText(ic,ex,ey);g2.font='10px sans-serif';g2.fillStyle='#ffd36a';g2.fillText(lbl,ex,ey+13)};
 for(const e of WEV){if(e.k=='air'){const fy=e.fall>0?e.fall*90:0;if(e.fall>0){g2.fillStyle='#e8e8e0';g2.beginPath();g2.arc(sx(e.x),sy(e.y-30-fy),16*k,Math.PI,0);g2.fill();g2.strokeStyle='#bbb';g2.beginPath();g2.moveTo(sx(e.x-14),sy(e.y-30-fy));g2.lineTo(sx(e.x),sy(e.y-10-fy));g2.lineTo(sx(e.x+14),sy(e.y-30-fy));g2.stroke()}
   if(e.ph=='plane'&&!e.dropped)continue;if(e.fall>0){g2.fillStyle='#4f5a35';g2.fillRect(sx(e.x-12),sy(e.y-12-fy),24*k,18*k)}if(!e.opened){for(let i=0;i<6;i++){const s=((T*.4+i/6)%1);g2.fillStyle='rgba(220,60,60,'+(.5*(1-s))+')';g2.beginPath();g2.arc(sx(e.x+Math.sin(i*2+T)*8*s),sy(e.y-30-s*160),(6+s*18)*k,0,7);g2.fill()}mark(e.x,e.y,'🪂',Math.ceil(e.t)+'초')}}
  if(e.k=='heli'){for(let i=0;i<5;i++){const s=((T*.3+i/5)%1);g2.fillStyle='rgba(60,60,60,'+(.45*(1-s))+')';g2.beginPath();g2.arc(sx(e.x+s*30),sy(e.y-20-s*170),(8+s*22)*k,0,7);g2.fill()}mark(e.x,e.y,'🚁','추락')}
  if(e.k=='fight')mark(e.x,e.y,'⚔','교전');if(e.k=='merf'&&e.m&&e.m.hp>0){for(let i=0;i<5;i++){const s=((T*.5+i/5)%1);g2.fillStyle='rgba(255,90,60,'+(.5*(1-s))+')';g2.beginPath();g2.arc(sx(e.m.x+10),sy(e.m.y-20-s*140),(5+s*14)*k,0,7);g2.fill()}mark(e.m.x,e.m.y,'💰',Math.ceil(e.m.wait)+'초')}
  if(e.k=='horde'){const L=Z.filter(z=>z.horde&&z.hp>0);if(L.length){const cx=L.reduce((a,z)=>a+z.x,0)/L.length,cy=L.reduce((a,z)=>a+z.y,0)/L.length;mark(cx,cy,'🌊',L.length+'마리')}}}
 for(const b of S.bags||[]){g2.font='14px sans-serif';g2.textAlign='center';g2.fillText('🎒',sx(b.x),sy(b.y-6))}});
/* ---------- drawing the merchant ---------- */
{const _zd=zDraw4;zDraw4=function(z){if(!z.npc)return _zd(z);drawChar(z.look,z.x,z.y,z.d8||'d',z.walk>0?F8(z.ph||0):-1,null);g.font='9px sans-serif';g.textAlign='center';g.fillStyle='#ffe0a0';g.fillText('💰 '+z.nm,z.x,z.y-46);return true}}
/* ---------- buttons, ticks ---------- */
{const _c=dmCtx;dmCtx=function(){const B=_c();if(B.some(q=>!q.dz&&!q.info)||DUN||DM||!S.inf)return B;const p=S.p,m=merNear();if(m)B.unshift({t:'💰 상인과 거래',f:()=>openMer(m),big:1});
  const air=WEV.find(e=>e.k=='air'&&!e.opened&&!(e.fall>0)&&Math.hypot(e.x-p.x,e.y-p.y)<60);if(air)B.unshift({t:'🪂 보급 상자 열기',f:()=>{air.opened=1;const zn=air.zn,r={a556:30+10*zn,a9mm:30,medkit:1+(zn>1?1:0),[stoneFor(Math.max(1,zn))]:2};if(Math.random()<.5)r[runeFor(Math.max(1,zn))]=1;if(Math.random()<.4)r[['ar','smg','pump','sniper'][Math.random()*4|0]]=1;give(r);S.airOpen=(S.airOpen||0)+1;air.t=Math.min(air.t,2)},big:1});
  const bi=(S.bags||[]).findIndex(b=>Math.hypot(b.x-p.x,b.y-p.y)<50);if(bi>=0)B.unshift({t:'🎒 전리품 가방 줍기',f:()=>{const b=S.bags.splice(bi,1)[0];const r={};for(const k in b.r)if(b.r[k])r[k]=b.r[k];give(r)}});return B}}
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!S||!S.inf)return;for(const z of Z)if(z.npc=='mer'&&z.hp>0)merThink(z,dt);evTick(dt);if(RVDAY!==S.day){RVDAY=S.day;revengeCheck()}if(S.moon)for(const z of Z)if(!z.mb&&!z.raider&&!z.npc){z.mb=1;z.sm=(z.sm||1)*1.2}}}
/* turTick: remember the target for the aim line */
{const _tt=turTick;turTick=function(dt){_tt(dt);const ops=S.inf&&S.inf.op;if(!ops)return;for(const gk in ops){const o=ops[gk];if(!o.turs)continue;const[gx,gy]=gk.split(',').map(Number),[ox,oy]=bo(gx-OGX,gy-OGY);for(const q of o.turs){if(q.want==null){q.tg=null;continue}const x=ox+q.rx,y=oy+q.ry-14;let best=null,bd=1e9;for(const z of Z){if(z.hp<=0||z.npc)continue;const a=Math.atan2(z.y-y,z.x-x);let df=a-q.want;df=Math.abs(Math.atan2(Math.sin(df),Math.cos(df)));const d=Math.hypot(z.x-x,z.y-y);if(df<.05&&d<bd){bd=d;best=z}}q.tg=best}}}}
document.head.insertAdjacentHTML('beforeend',`<style>body[data-moon] #c{filter:saturate(1.3) hue-rotate(-12deg)}body[data-moon]::after{content:'';position:fixed;inset:0;pointer-events:none;z-index:1;background:radial-gradient(circle at 50% 40%,transparent 30%,#6a0a0a55 90%)}
body[data-fog]::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:1;background:radial-gradient(circle at 50% 50%,transparent 110px,#cfd4d8cc 260px,#dfe3e6f2 420px)}#bm .stT.no{opacity:.45}</style>`);
/* ---------- daily schedule: one big event and one or two small ones (sample: they start within a minute) ---------- */
function evDay(fast){const big=EVB[Math.random()*EVB.length|0][0],sm=EVS.slice().sort(()=>Math.random()-.5).slice(0,1+(Math.random()<.5?1:0)).map(q=>q[0]);S.evPlan={day:S.day,big,sm};
 const at=fast?[3,12,30]:[60*3,60*8,60*12];sm.forEach((k,i)=>EVTM.push(setTimeout(()=>{if(run)evStart(k)},at[i]*1000)));EVTM.push(setTimeout(()=>{if(run)evStart(big)},at[2]*1000));return S.evPlan}
const EVTM=[];function evCancel(){EVTM.forEach(clearTimeout);EVTM.length=0}
