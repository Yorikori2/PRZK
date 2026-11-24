/* PROJECT LEGACY — sample: outposts on rubble lots. Leave one alone for two days without defences and the zombies
   start tearing it down at night; walls and turrets cut the risk. Loaded after demo_next.js. */
'use strict';
const OPCOST={wood:10,scrap:10,cloth:4},OPWALL=[null,{wood:8,scrap:4},{scrap:12,cement:4}],OPTUR={scrap:10,elec:4};
const OP0=()=>{S.inf.op=S.inf.op||{};return S.inf.op};
/* risk table: [base chance, per zone, damage] by defence */
function opDef(o){const t=o.tur>0&&(o.ammo|0)>=10?o.tur:0;return o.wall==0&&!t?0:t==0?1:t==1?2:3}
const OPRISK=[[.40,.10,35],[.25,.08,20],[.15,.06,10],[.10,.05,5]],OPDN=['아무것도 없음','방벽만','방벽 + 포탑 1','방벽 + 포탑 2'];
const opRisk=(o,zn)=>{const r=OPRISK[opDef(o)];return{ch:Math.min(.95,r[0]+r[1]*zn),dmg:r[2]}};
/* the lot builder draws the outpost on top of the rubble */
{const _lot=BUILDERS.lot;BUILDERS.lot=(c,r,sd)=>{const gx=OGX+c,gy=OGY+r,gk=gx+','+gy;let o=null;try{o=S&&S.inf&&S.inf.op&&S.inf.op[gk]}catch(e){}let ru=null;try{ru=S&&S.inf&&S.inf.ruin&&S.inf.ruin[gk]}catch(e){}
  _lot(c,r,sd);const A=Bld(o?'전초기지':'철거지 ',c,r,'outpost');const cx=BW/2,cy=BH/2+60;
  if(ru)A.o('crate',cx-12,cy,30,20,{ruin:1});if(!o)return;
  A.fl(cx-210,cy-120,420,230,'concrete');A.o('tentS',cx-48,cy-60,96,52);A.o('stash',cx+70,cy-40,30,18,{op:1});A.o('bench3',cx-170,cy-40,90,22,{lv:2,op:1});A.o('campfire',cx-15,cy+30,30,12);
  if(o.wall){const t=o.wall>=2?'cwall':'sandbag';for(let x=cx-230;x<cx+230;x+=60)if(Math.abs(x+30-cx)>50){A.o(t,x,cy-150,58,14);A.o(t,x,cy+130,58,14)}for(let y=cy-136;y<cy+130;y+=44){A.o(t,cx-240,y,14,42);A.o(t,cx+226,y,14,42)}}
  const tp=[[cx-200,cy-115],[cx+150,cy+80]];for(let i=0;i<(o.tur|0);i++)A.o('turret',tp[i][0],tp[i][1],44,30,{lv:1,tid:i});
  A.light(cx,cy,220,.35,'255,200,140')}}
TIER.outpost=1;
function opHere(){const[gx,gy]=gOf(S.p.x,S.p.y),gk=gx+','+gy,d=S.inf.demo&&S.inf.demo[gk];return{gk,gx,gy,lot:!!d,o:OP0()[gk]}}
function opBuild(){const h=opHere();if(!h.lot)return;if(h.o)return opOpen();const p=S.p;for(const k in OPCOST)if(((p.inv[k]|0)+(S.base.st[k]|0))<OPCOST[k])return msg('⛺ 전초기지 재료: '+Object.entries(OPCOST).map(([k,v])=>NM2(k)+' '+v).join(' · '));
 for(const k in OPCOST){const a=Math.min(p.inv[k]|0,OPCOST[k]);if(a)invTake(p,k,a);if(OPCOST[k]-a)S.base.st[k]-=OPCOST[k]-a}
 OP0()[h.gk]={hp:100,wall:0,tur:0,ammo:0,last:S.day,made:S.day,st:{},log:[],zone:zoneOf(h.gx,h.gy)};infRebuild();s3Xp(60,'전초기지');msg('⛺ '+h.gk+' 블록에 전초기지를 세웠어요 · 보관함 · 작업대(강화) · 모닥불 · 이틀 넘게 비우면 밤에 습격받을 수 있어요')}
/* visiting keeps it safe; every new day the empty ones roll for a night attack */
let OPDAY=null;
function opNight(){const ops=OP0(),[pgx,pgy]=gOf(S.p.x,S.p.y),here=pgx+','+pgy,out=[];
 for(const gk in ops){const o=ops[gk],[gx,gy]=gk.split(',').map(Number),zn=zoneOf(gx,gy),away=S.day-o.last;if(gk==here){o.last=S.day;continue}if(away<2)continue;
  const R=opRisk(o,zn);if(Math.random()>=R.ch){o.log.unshift('Day '+S.day+' · 조용한 밤');continue}
  if(o.tur>0&&(o.ammo|0)>=10)o.ammo-=10;o.hp=Math.max(0,o.hp-R.dmg);o.log.unshift('Day '+S.day+' · 습격 −'+R.dmg+'% (내구 '+o.hp+'%)');o.log.length=Math.min(o.log.length,6);
  if(o.hp<=0){S.inf.ruin=S.inf.ruin||{};const half={};for(const k in o.st){const n=Math.floor(o.st[k]/2);if(n)half[k]=n}S.inf.ruin[gk]=half;delete ops[gk];out.push('💥 '+zn+'구역 전초기지 ('+gk+')가 무너졌어요 · 잔해 상자에 물건 절반이 남았어요')}
  else out.push('⚠ '+zn+'구역 전초기지 ('+gk+')가 공격받았어요 · 내구 '+o.hp+'%')}
 if(out.length){msg(out.join(' · '));infRebuild()}return out}
/* standing in your own outpost when night falls → defend it yourself */
function opDefend(){const h=opHere();if(!h.o)return;const zn=zoneOf(h.gx,h.gy),[ox,oy]=bo(h.gx-OGX,h.gy-OGY),n=8+zn*3;for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2;mk(ox+BW/2+Math.cos(a)*520,oy+BH/2+60+Math.sin(a)*420,{w:1})}msg('🌙 밤이 되자 좀비 '+n+'마리가 전초기지로 몰려옵니다 · 막아내세요!')}
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!S||!S.inf)return;if(OPDAY==null)OPDAY=S.day;if(S.day!=OPDAY){OPDAY=S.day;opNight()}const h=opHere();if(h.o)h.o.last=S.day}}
/* ---------- outpost window ---------- */
function opOpen(){const h=opHere(),o=h.o;if(!o)return;const zn=zoneOf(h.gx,h.gy),R=opRisk(o,zn),b=$('bm');b.dataset.m='op';PAUSE=true;const have=c=>Object.entries(c).every(([k,v])=>((S.p.inv[k]|0)+(S.base.st[k]|0))>=v),ct=c=>Object.entries(c).map(([k,v])=>NM2(k)+' '+v).join(' · ');
 let x='<div class="sh"><h2>⛺ 전초기지 · '+zn+'구역 ('+h.gk+')</h2><div class="wt">마지막 방문 Day '+o.last+' · 지금 Day '+S.day+'</div><button onclick="closeBase()">✕</button></div>';
 x+='<div class="opHp"><b>내구 '+o.hp+'%</b><span><i style="width:'+o.hp+'%;background:'+(o.hp>60?'#7fd07f':o.hp>30?'#ffd36a':'#ff6a5a')+'"></i></span></div>';
 x+='<table class="cmpT"><tr><th>방어 상태</th><th>밤마다 습격 확률</th><th>습격당 피해</th></tr>'+OPRISK.map((r,i)=>'<tr'+(i==opDef(o)?' class="me"':'')+'><td>'+OPDN[i]+'</td><td>'+Math.round(Math.min(.95,r[0]+r[1]*zn)*100)+'%</td><td>−'+r[2]+'%</td></tr>').join('')+'</table>';
 x+='<p class="mut" style="font-size:11.5px">이틀 넘게 오지 않으면 밤마다 습격을 굴려요 · 지금: <b>'+OPDN[opDef(o)]+'</b> · 포탑은 습격마다 9mm 탄 10발을 써요 (남은 '+(o.ammo|0)+'발)</p>';
 x+='<div class="opB">'+(o.wall<2?'<button '+(have(OPWALL[o.wall+1])?'':'disabled ')+'onclick="opUp(\'wall\')">🧱 방벽 '+(o.wall?'강화 (금속)':'설치 (모래주머니)')+'<small>'+ct(OPWALL[o.wall+1])+'</small></button>':'<button disabled>🧱 방벽 최고 단계</button>')+
  (o.tur<2?'<button '+(have(OPTUR)?'':'disabled ')+'onclick="opUp(\'tur\')">🔫 포탑 설치 ('+o.tur+'/2)<small>'+ct(OPTUR)+'</small></button>':'<button disabled>🔫 포탑 2/2</button>')+
  '<button '+((S.p.inv.a9mm|0)>=10?'':'disabled ')+'onclick="opUp(\'ammo\')">📦 포탑 탄약 넣기<small>9mm 탄 30 (가방 '+(S.p.inv.a9mm|0)+')</small></button>'+
  '<button '+(o.hp<100&&(S.p.inv.scrap|0)>=2?'':'disabled ')+'onclick="opUp(\'fix\')">🔧 수리 +10%<small>고철 2</small></button>'+
  '<button onclick="openStash(\'op\')">🗄 보관함 열기<small>'+Object.values(o.st).reduce((a,b)=>a+b,0)+'개 보관 중</small></button><button onclick="openEnh()">🔨 작업대 · 강화<small>강화석 · 룬</small></button></div>';
 x+='<h4>기록</h4>'+(o.log.length?o.log.map(l=>'<div class="mut" style="font-size:12px">'+l+'</div>').join(''):'<p class="mut">아직 습격이 없어요</p>');b.innerHTML=x;b.style.display='block'}
function opUp(k){const o=opHere().o,p=S.p,pay=c=>{for(const q in c){const a=Math.min(p.inv[q]|0,c[q]);if(a)invTake(p,q,a);if(c[q]-a)S.base.st[q]-=c[q]-a}};
 if(k=='wall'){pay(OPWALL[o.wall+1]);o.wall++}if(k=='tur'){pay(OPTUR);o.tur++}if(k=='ammo'){const n=Math.min(30,p.inv.a9mm|0);invTake(p,'a9mm',n);o.ammo=(o.ammo|0)+n}if(k=='fix'){invTake(p,'scrap',2);o.hp=Math.min(100,o.hp+10)}
 infRebuild();opOpen()}
/* ---------- buttons ---------- */
{const _c=dmCtx;dmCtx=function(){const B=_c();if(B.length||DUN||DM)return B;const p=S.p,h=opHere();
  const ru=S.inf.ruin&&S.inf.ruin[h.gk]&&W0.objs.find(o=>o.ruin&&Math.hypot(o.x+15-p.x,o.y+10-p.y)<60);if(ru){B.push({t:'📦 잔해 상자 열기',f:()=>{give(S.inf.ruin[h.gk]);delete S.inf.ruin[h.gk];infRebuild()}});return B}
  if(h.lot&&!h.o){B.push({t:'⛺ 전초기지 세우기 · '+Object.entries(OPCOST).map(([k,v])=>NM2(k)+' '+v).join(' '),f:opBuild});return B}
  if(h.o){const near=t=>W0.objs.find(o=>o.t==t&&o.op!=null&&Math.hypot(o.x+o.w/2-p.x,o.y+o.h/2-p.y)<70);if(near('stash'))B.push({t:'🗄 전초기지 보관함',f:()=>openStash('op')});else if(near('bench3'))B.push({t:'🔨 작업대 · 강화',f:()=>openEnh()});
   B.push({t:'⛺ 전초기지 관리 · 내구 '+h.o.hp+'%',f:opOpen,sm:B.length?1:0})}return B}}
document.head.insertAdjacentHTML('beforeend',`<style>#bm .opHp{display:flex;gap:8px;align-items:center;margin:6px 0}#bm .opHp span{flex:1;height:10px;border-radius:5px;background:#ffffff18;overflow:hidden}#bm .opHp i{display:block;height:100%}
#bm .opB{display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-top:6px}#bm .opB button{padding:8px;font-size:13px;border-radius:10px;text-align:left}#bm .opB small{display:block;font-size:11px;color:var(--mut)}#bm .opB button[disabled]{opacity:.45}#bm .cmpT tr.me td{background:#e0b03a22;font-weight:bold}</style>`);
