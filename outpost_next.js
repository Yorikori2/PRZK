/* PROJECT LEGACY — sample: outposts on rubble lots. Leave one alone for two days without defences and the zombies
   start tearing it down at night; walls and turrets cut the risk. Loaded after demo_next.js. */
'use strict';
const OPCOST={wood:10,scrap:10,cloth:4},OPWALL=[null,{wood:8,scrap:4},{scrap:12,cement:4}],OPTMAX=4;
/* turret types: ammo item, reach, arc (degrees), cooldown, damage, extras, build cost, ammo used per shot */
const TURT={mg:{nm:'기관총 포탑',ic:'🔫',am:'a9mm',use:1,rng:260,arc:120,cd:.25,dmg:14,cost:{scrap:10,elec:4},ds:'빠른 연사 · 무난함'},
 sg:{nm:'산탄 포탑',ic:'💥',am:'a12g',use:1,rng:160,arc:80,cd:.9,dmg:16,pel:3,cost:{scrap:12,elec:3},ds:'가까이 온 무리에 강함 · 밀쳐냄'},
 sn:{nm:'저격 포탑',ic:'🎯',am:'a308',use:1,rng:450,arc:50,cd:1.6,dmg:90,pierce:2,cost:{scrap:14,elec:6},ds:'멀리 · 한 줄 관통 · 느림'},
 fl:{nm:'화염 포탑',ic:'🔥',am:'fuel',use:.1,rng:120,arc:70,cd:.2,dmg:5,burn:1,cost:{scrap:10,elec:2,fuel:2},ds:'불을 붙임 · 짧은 사거리'},
 tz:{nm:'테슬라 코일',ic:'⚡',am:'elec',use:.05,rng:110,arc:360,cd:1.2,dmg:22,chain:2,cost:{scrap:8,elec:8},ds:'사방 · 감전 · 주변 2마리까지'}};
const tArmed=(o,q)=>{const T=TURT[q.t];return(o.st[T.am]|0)>=Math.max(1,Math.ceil(10*T.use))};
const OP0=()=>{S.inf.op=S.inf.op||{};return S.inf.op};
/* risk table: [base chance, per zone, damage] by defence */
function opDef(o){opMig(o);const t=o.turs.filter(q=>tArmed(o,q)).length;return o.wall==0&&!t?0:t==0?1:t==1?2:3}
function opMig(o){if(!o.turs){o.turs=[];const tp=[[BW/2-200,BH/2-55],[BW/2+150,BH/2+140]];for(let i=0;i<(o.tur|0);i++)o.turs.push({t:'mg',rx:tp[i][0],ry:tp[i][1],dir:i?Math.PI/2:-Math.PI/2});if(o.ammo){o.st.a9mm=(o.st.a9mm|0)+o.ammo;o.ammo=0}}}
const OPRISK=[[.40,.10,35],[.25,.08,20],[.15,.06,10],[.10,.05,5]],OPDN=['아무것도 없음','방벽만 (또는 탄약 있는 포탑 없음)','방벽 + 탄약 있는 포탑 1','방벽 + 탄약 있는 포탑 2개 이상'];
const opRisk=(o,zn)=>{const r=OPRISK[opDef(o)];return{ch:Math.min(.95,r[0]+r[1]*zn),dmg:r[2]}};
/* the lot builder draws the outpost on top of the rubble */
{const _lot=BUILDERS.lot;BUILDERS.lot=(c,r,sd)=>{const gx=OGX+c,gy=OGY+r,gk=gx+','+gy;let o=null;try{o=S&&S.inf&&S.inf.op&&S.inf.op[gk]}catch(e){}let ru=null;try{ru=S&&S.inf&&S.inf.ruin&&S.inf.ruin[gk]}catch(e){}
  _lot(c,r,sd);const A=Bld(o?'전초기지':'철거지 ',c,r,'outpost');const cx=BW/2,cy=BH/2+60;
  if(ru)A.o('crate',cx-12,cy,30,20,{ruin:1});if(!o)return;
  A.fl(cx-210,cy-120,420,230,'concrete');A.o('tentS',cx-48,cy-60,96,52);A.o('stash',cx+70,cy-40,30,18,{op:1});A.o('bench3',cx-170,cy-40,90,22,{lv:2,op:1});A.o('campfire',cx-15,cy+30,30,12);
  if(o.wall){const t=o.wall>=2?'cwall':'sandbag';for(let x=cx-230;x<cx+230;x+=60)if(Math.abs(x+30-cx)>50){A.o(t,x,cy-150,58,14);A.o(t,x,cy+130,58,14)}for(let y=cy-136;y<cy+130;y+=44){A.o(t,cx-240,y,14,42);A.o(t,cx+226,y,14,42)}}
  opMig(o);o.turs.forEach((q,i)=>A.o('turret',q.rx-22,q.ry-15,44,30,{lv:1,tid:i,tt:q.t}));
  A.light(cx,cy,220,.35,'255,200,140')}}
TIER.outpost=1;
function opHere(){const[gx,gy]=gOf(S.p.x,S.p.y),gk=gx+','+gy,d=S.inf.demo&&S.inf.demo[gk];return{gk,gx,gy,lot:!!d,o:OP0()[gk]}}
function opBuild(){const h=opHere();if(!h.lot)return;if(h.o)return opOpen();const p=S.p;for(const k in OPCOST)if(((p.inv[k]|0)+(S.base.st[k]|0))<OPCOST[k])return msg('⛺ 전초기지 재료: '+Object.entries(OPCOST).map(([k,v])=>NM2(k)+' '+v).join(' · '));
 for(const k in OPCOST){const a=Math.min(p.inv[k]|0,OPCOST[k]);if(a)invTake(p,k,a);if(OPCOST[k]-a)S.base.st[k]-=OPCOST[k]-a}
 OP0()[h.gk]={hp:100,wall:0,turs:[],last:S.day,made:S.day,st:{},log:[],zone:zoneOf(h.gx,h.gy)};infRebuild();s3Xp(60,'전초기지');msg('⛺ '+h.gk+' 블록에 전초기지를 세웠어요 · 보관함 · 작업대(강화) · 모닥불 · 이틀 넘게 비우면 밤에 습격받을 수 있어요')}
/* visiting keeps it safe; every new day the empty ones roll for a night attack */
let OPDAY=null;
function opNight(){const ops=OP0(),[pgx,pgy]=gOf(S.p.x,S.p.y),here=pgx+','+pgy,out=[];
 for(const gk in ops){const o=ops[gk],[gx,gy]=gk.split(',').map(Number),zn=zoneOf(gx,gy),away=S.day-o.last;if(gk==here){o.last=S.day;continue}if(away<2)continue;
  const R=opRisk(o,zn);if(Math.random()>=R.ch){o.log.unshift('Day '+S.day+' · 조용한 밤');continue}
  for(const q of o.turs)if(tArmed(o,q)){const T=TURT[q.t];o.st[T.am]-=Math.max(1,Math.ceil(10*T.use))}o.hp=Math.max(0,o.hp-R.dmg);o.log.unshift('Day '+S.day+' · 습격 −'+R.dmg+'% (내구 '+o.hp+'%)');o.log.length=Math.min(o.log.length,6);
  if(o.hp<=0){S.inf.ruin=S.inf.ruin||{};const half={};for(const k in o.st){const n=Math.floor(o.st[k]/2);if(n)half[k]=n}S.inf.ruin[gk]=half;delete ops[gk];out.push('💥 '+zn+'구역 전초기지 ('+gk+')가 무너졌어요 · 잔해 상자에 물건 절반이 남았어요')}
  else out.push('⚠ '+zn+'구역 전초기지 ('+gk+')가 공격받았어요 · 내구 '+o.hp+'%')}
 if(out.length){msg(out.join(' · '));infRebuild()}return out}
/* standing in your own outpost when night falls → defend it yourself */
function opDefend(){const h=opHere();if(!h.o)return;const zn=zoneOf(h.gx,h.gy),[ox,oy]=bo(h.gx-OGX,h.gy-OGY),n=8+zn*3;for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2;mk(ox+BW/2+Math.cos(a)*520,oy+BH/2+60+Math.sin(a)*420,{w:1})}msg('🌙 밤이 되자 좀비 '+n+'마리가 전초기지로 몰려옵니다 · 막아내세요!')}
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!S||!S.inf)return;if(OPDAY==null)OPDAY=S.day;if(S.day!=OPDAY){OPDAY=S.day;opNight()}const h=opHere();if(h.o)h.o.last=S.day;turTick(dt)}}
/* ---------- outpost window ---------- */
function opOpen(){const h=opHere(),o=h.o;if(!o)return;opMig(o);const zn=zoneOf(h.gx,h.gy),b=$('bm');b.dataset.m='op';PAUSE=true;const have=c=>Object.entries(c).every(([k,v])=>((S.p.inv[k]|0)+(S.base.st[k]|0))>=v),ct=c=>Object.entries(c).map(([k,v])=>NM2(k)+' '+v).join(' · ');
 let x='<div class="sh"><h2>⛺ 전초기지 · '+zn+'구역 ('+h.gk+')</h2><div class="wt">마지막 방문 Day '+o.last+' · 지금 Day '+S.day+'</div><button onclick="closeBase()">✕</button></div>';
 x+='<div class="opHp"><b>내구 '+o.hp+'%</b><span><i style="width:'+o.hp+'%;background:'+(o.hp>60?'#7fd07f':o.hp>30?'#ffd36a':'#ff6a5a')+'"></i></span></div>';
 x+='<table class="cmpT"><tr><th>방어 상태</th><th>밤마다 습격</th><th>피해</th></tr>'+OPRISK.map((r,i)=>'<tr'+(i==opDef(o)?' class="me"':'')+'><td>'+OPDN[i]+'</td><td>'+Math.round(Math.min(.95,r[0]+r[1]*zn)*100)+'%</td><td>−'+r[2]+'%</td></tr>').join('')+'</table>';
 x+='<p class="mut" style="font-size:11.5px">이틀 넘게 오지 않으면 밤마다 습격을 굴려요 · 포탑 탄약은 <b>이 기지 보관함</b>에서 꺼내 써요</p>';
 x+='<h4>🔫 포탑 '+o.turs.length+'/'+OPTMAX+'</h4>'+(o.turs.length?'<div class="opTl">'+o.turs.map((q,i)=>{const T=TURT[q.t],ar=tArmed(o,q);return'<div><b>'+T.ic+' '+T.nm+'</b><small>'+NM2(T.am)+' '+(o.st[T.am]|0)+(ar?'':' · <span style="color:#ff6a5a">탄약 부족</span>')+'</small><button onclick="opTurDel('+i+')">회수</button></div>'}).join('')+'</div>':'<p class="mut">아직 없어요 · 아래에서 골라 원하는 곳에 설치하세요</p>');
 x+='<div class="opTt">'+Object.entries(TURT).map(([k,T])=>'<button '+(have(T.cost)&&o.turs.length<OPTMAX?'':'disabled ')+'onclick="placeStart(\''+k+'\')"><b>'+T.ic+' '+T.nm+'</b><small>사거리 '+T.rng+' · '+(T.arc>=360?'사방':T.arc+'°')+' · 피해 '+T.dmg+(T.pel?'×'+T.pel:'')+'<br>'+NM2(T.am)+' 사용 · '+T.ds+'<br>재료 '+ct(T.cost)+'</small></button>').join('')+'</div>';
 x+='<div class="opB">'+(o.wall<2?'<button '+(have(OPWALL[o.wall+1])?'':'disabled ')+'onclick="opUp(\'wall\')">🧱 방벽 '+(o.wall?'강화 (금속)':'설치 (모래주머니)')+'<small>'+ct(OPWALL[o.wall+1])+'</small></button>':'<button disabled>🧱 방벽 최고 단계</button>')+
  '<button '+(o.hp<100&&(S.p.inv.scrap|0)>=2?'':'disabled ')+'onclick="opUp(\'fix\')">🔧 수리 +10%<small>고철 2</small></button>'+
  '<button onclick="openStash(\'op\')">🗄 보관함 열기<small>'+Object.values(o.st).reduce((a,b)=>a+b,0)+'개 · 포탑 탄약도 여기서</small></button><button onclick="openEnh()">🔨 작업대 · 강화<small>강화석 · 룬</small></button></div>';
 x+='<h4>기록</h4>'+(o.log.length?o.log.map(l=>'<div class="mut" style="font-size:12px">'+l+'</div>').join(''):'<p class="mut">아직 습격이 없어요</p>');b.innerHTML=x;b.style.display='block'}
function opUp(k){const o=opHere().o,p=S.p;if(k=='wall'){opPay(OPWALL[o.wall+1]);o.wall++}if(k=='fix'){invTake(p,'scrap',2);o.hp=Math.min(100,o.hp+10)}infRebuild();opOpen()}
function opPay(c){const p=S.p;for(const q in c){const a=Math.min(p.inv[q]|0,c[q]);if(a)invTake(p,q,a);if(c[q]-a)S.base.st[q]-=c[q]-a}}
function opTurDel(i){const o=opHere().o,q=o.turs[i];if(!q)return;const c=TURT[q.t].cost;for(const k in c)invAdd(S.p,k,Math.floor(c[k]/2));o.turs.splice(i,1);infRebuild();msg('🔧 포탑을 회수했어요 · 재료 절반을 돌려받았어요');opOpen()}
/* ---------- placing a turret where you want it ---------- */
let PLACE=null;
function placeStart(t){const h=opHere();if(!h.o)return;PLACE={t,dir:Math.atan2(S.p.fy||1,S.p.fx||0),gk:h.gk};closeBase();PAUSE=false;msg('📍 '+TURT[t].nm+' 설치 · 원하는 곳으로 걸어가서 ↺ ↻로 방향을 정하고 [설치]를 누르세요 · 부채꼴이 지키는 범위예요')}
function placeSpot(){const p=S.p,f=Math.hypot(p.fx||0,p.fy||0)||1;return[p.x+(p.fx||0)/f*44,p.y+(p.fy||1)/f*44]}
function placeOk(){const h=opHere();if(!PLACE||h.gk!=PLACE.gk||!h.o)return'전초기지 블록 안에서만 설치할 수 있어요';const[x,y]=placeSpot();if(blocker(x,y,16))return'여기는 막혀 있어요';
 const[ox,oy]=bo(h.gx-OGX,h.gy-OGY);if(h.o.turs.some(q=>Math.hypot(ox+q.rx-x,oy+q.ry-y)<46))return'다른 포탑과 너무 가까워요';return''}
function placeDo(){const why=placeOk();if(why)return msg('📍 '+why);const h=opHere(),o=h.o,T=TURT[PLACE.t];const have=Object.entries(T.cost).every(([k,v])=>((S.p.inv[k]|0)+(S.base.st[k]|0))>=v);if(!have)return msg('재료가 부족해요');
 opPay(T.cost);const[x,y]=placeSpot(),[ox,oy]=bo(h.gx-OGX,h.gy-OGY);o.turs.push({t:PLACE.t,rx:Math.round(x-ox),ry:Math.round(y-oy),dir:PLACE.dir});PLACE=null;S.p.y+=0;infRebuild();
 const p=S.p;if(blocker(p.x,p.y,7)){p.y+=40}msg('🔫 '+T.nm+' 설치 완료 · 탄약('+NM2(T.am)+')은 기지 보관함에서 써요')}
/* ---------- turrets fire ---------- */
const TCD={};
function turTick(dt){const ops=S.inf.op;if(!ops||DUN)return;for(const gk in ops){const o=ops[gk];opMig(o);if(!o.turs.length)continue;const[gx,gy]=gk.split(',').map(Number),c=gx-OGX,r=gy-OGY;if(c<0||r<0||c>=NBX||r>=NBY)continue;const[ox,oy]=bo(c,r);
  o.turs.forEach((q,i)=>{const T=TURT[q.t],k=gk+':'+i;TCD[k]=(TCD[k]||0)-dt;if(TCD[k]>0)return;const x=ox+q.rx,y=oy+q.ry-14;let best=null,bd=1e9;
   for(const z of Z){if(z.hp<=0)continue;const d=Math.hypot(z.x-x,z.y-y);if(d>T.rng||d>=bd)continue;if(T.arc<360){let a=Math.atan2(z.y-y,z.x-x)-q.dir;a=Math.atan2(Math.sin(a),Math.cos(a));if(Math.abs(a)>T.arc/360*Math.PI)continue}best=z;bd=d}
   if(!best)return;o.fr=o.fr||{};o.fr[T.am]=(o.fr[T.am]||0)+T.use;if((o.st[T.am]|0)<Math.ceil(o.fr[T.am])){q.dry=1;return}q.dry=0;if(o.fr[T.am]>=1){const n=Math.floor(o.fr[T.am]);o.st[T.am]-=n;o.fr[T.am]-=n}
   TCD[k]=T.cd;q.aim=Math.atan2(best.y-y,best.x-x);const dx=(best.x-x)/(bd||1),dy=(best.y-y)/(bd||1);noise(x,y,3);
   if(q.t=='tz'){hitZ(best,T.dmg,dx,dy,1);best.stun=1;fx.push({k:'zap',a:[x,y],b:[best.x,best.y-14],l:.2});let n=0;for(const z of Z)if(z!==best&&z.hp>0&&n<T.chain&&Math.hypot(z.x-best.x,z.y-best.y)<70){n++;hitZ(z,T.dmg*.6,0,0,1);z.stun=.8;fx.push({k:'zap',a:[best.x,best.y-14],b:[z.x,z.y-14],l:.2})}return}
   if(q.t=='fl'){for(const z of Z)if(z.hp>0&&Math.hypot(z.x-best.x,z.y-best.y)<40){hitZ(z,T.dmg,dx,dy,1);z.burn=Math.max(z.burn||0,2)}fx.push({k:'flame',x,y,dx,dy,r:Math.min(T.rng,bd+20),l:.12});return}
   const tg=[best];if(T.pel||T.pierce)for(const z of Z){if(tg.length>=(T.pel||T.pierce))break;if(z===best||z.hp<=0)continue;const d=Math.hypot(z.x-x,z.y-y);if(d>T.rng)continue;const a=Math.atan2(z.y-y,z.x-x)-q.aim;if(Math.abs(Math.atan2(Math.sin(a),Math.cos(a)))<(T.pel?.35:.08))tg.push(z)}
   for(const z of tg){hitZ(z,T.dmg,dx,dy,3);if(q.t=='sg')mv(z,dx*14,dy*14,7);fx.push({k:'tr',a:[x,y],b:[z.x,z.y-14],l:.08})}fx.push({k:'fl',x:x+Math.cos(q.aim)*18,y:y+Math.sin(q.aim)*18,l:.06})})}}
/* arcs on the overlay: show while you're in the outpost block or placing */
OVL.push((g,sx,sy,k)=>{const ops=S.inf&&S.inf.op;if(!ops||DUN)return;const h=opHere();const wedge=(x,y,T,dir,col,fill)=>{g.beginPath();if(T.arc>=360)g.arc(sx(x),sy(y),T.rng*k,0,Math.PI*2);else{g.moveTo(sx(x),sy(y));g.arc(sx(x),sy(y),T.rng*k,dir-T.arc/360*Math.PI,dir+T.arc/360*Math.PI);g.closePath()}g.fillStyle=fill;g.fill();g.strokeStyle=col;g.lineWidth=1.5;g.stroke();
  g.beginPath();g.moveTo(sx(x),sy(y));g.lineTo(sx(x+Math.cos(dir)*Math.min(T.rng,90)),sy(y+Math.sin(dir)*Math.min(T.rng,90)));g.strokeStyle=col;g.lineWidth=2.5;g.stroke()};
 if(h.o){const[ox,oy]=bo(h.gx-OGX,h.gy-OGY);h.o.turs.forEach(q=>{const T=TURT[q.t],x=ox+q.rx,y=oy+q.ry-14,dry=!tArmed(h.o,q);wedge(x,y,T,q.dir,dry?'#ff6a5aaa':'#7fd0ffaa',dry?'#ff6a5a12':'#7fd0ff14');g.font='bold 12px sans-serif';g.textAlign='center';g.fillStyle='#fff';g.fillText(T.ic+(dry?' 탄약 없음':''),sx(x),sy(y)-22*k)})}
 if(PLACE){const T=TURT[PLACE.t],[x,y]=placeSpot(),bad=placeOk();wedge(x,y-14,T,PLACE.dir,bad?'#ff6a5acc':'#ffd36acc',bad?'#ff6a5a18':'#ffd36a20');g.fillStyle=bad?'#ff6a5a88':'#ffd36a88';g.fillRect(sx(x-22),sy(y-15),44*k,30*k);g.font='bold 12px sans-serif';g.textAlign='center';g.fillStyle='#fff';g.fillText(T.ic+' '+(bad||'여기에 설치'),sx(x),sy(y)-30*k)}});
/* ---------- buttons ---------- */
{const _c=dmCtx;dmCtx=function(){if(PLACE){const T=TURT[PLACE.t],bad=placeOk();return[{t:'✅ '+T.nm+' 설치'+(bad?' · '+bad:''),f:placeDo,off:!!bad,big:1},{t:'↺ 왼쪽으로',f:()=>{PLACE.dir-=Math.PI/4},sm:1},{t:'↻ 오른쪽으로',f:()=>{PLACE.dir+=Math.PI/4},sm:1},{t:'✖ 취소',f:()=>{PLACE=null},sm:1}]}const B=_c();if(B.some(q=>!q.dz)||DUN||DM)return B;const p=S.p,h=opHere();
  const ru=S.inf.ruin&&S.inf.ruin[h.gk]&&W0.objs.find(o=>o.ruin&&Math.hypot(o.x+15-p.x,o.y+10-p.y)<60);if(ru){B.push({t:'📦 잔해 상자 열기',f:()=>{give(S.inf.ruin[h.gk]);delete S.inf.ruin[h.gk];infRebuild()}});return B}
  if(h.lot&&!h.o){B.push({t:'⛺ 전초기지 세우기 · '+Object.entries(OPCOST).map(([k,v])=>NM2(k)+' '+v).join(' '),f:opBuild});return B}
  if(h.o){const near=t=>W0.objs.find(o=>o.t==t&&o.op!=null&&Math.hypot(o.x+o.w/2-p.x,o.y+o.h/2-p.y)<70);if(near('stash'))B.push({t:'🗄 전초기지 보관함',f:()=>openStash('op')});else if(near('bench3'))B.push({t:'🔨 작업대 · 강화',f:()=>openEnh()});
   B.push({t:'⛺ 전초기지 관리 · 내구 '+h.o.hp+'%',f:opOpen,sm:B.length?1:0})}return B}}
document.head.insertAdjacentHTML('beforeend',`<style>#bm .opHp{display:flex;gap:8px;align-items:center;margin:6px 0}#bm .opHp span{flex:1;height:10px;border-radius:5px;background:#ffffff18;overflow:hidden}#bm .opHp i{display:block;height:100%}
#bm .opB{display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-top:6px}#bm .opB button{padding:8px;font-size:13px;border-radius:10px;text-align:left}#bm .opB small{display:block;font-size:11px;color:var(--mut)}#bm .opB button[disabled]{opacity:.45}#bm .cmpT tr.me td{background:#e0b03a22;font-weight:bold}#bm .opTl>div{display:flex;align-items:center;gap:6px;padding:4px 6px;border-radius:8px;background:#ffffff0a;margin-bottom:3px;font-size:12.5px}#bm .opTl small{color:var(--mut);margin-left:auto}#bm .opTl button{padding:3px 8px;font-size:11px}
#bm .opTt{display:grid;grid-template-columns:1fr 1fr;gap:5px;margin:6px 0}#bm .opTt button{text-align:left;padding:7px;border-radius:10px;font-size:12.5px}#bm .opTt small{display:block;font-size:10.5px;color:var(--mut);line-height:1.35}#bm .opTt button[disabled]{opacity:.45}</style>`);
