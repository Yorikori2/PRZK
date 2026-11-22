/* PROJECT LEGACY — endless city sample: scene picker. */
'use strict';
const T9=[];const at9=(ms,f)=>T9.push(setTimeout(f,ms));
/* keep the endless-city game saved every few seconds so reopening the sample continues where you were */
setInterval(()=>{if(run&&S&&S.inf)try{save()}catch(e){}},8000);
function stop9(){T9.forEach(clearTimeout);T9.length=0;jp=null;jx=jy=0;$('bm').dataset.m='';closeBase();PAUSE=false;const p=S.p;p.hp=MHP(p);p.food=p.water=100}
/* zone alert log shown in the corner while the tour runs */
let ZLOG=null;function onZoneAlert(z,up,t){if(!ZLOG)return;ZLOG.push((up?'⚠ ':'🛡 ')+z+'구역 '+(up?'진입':'복귀')+' ✓');const el=$('zlog');if(el)el.innerHTML='<b>알림 기록</b>'+ZLOG.map(x=>'<div>'+x+'</div>').join('')}
function runAcross(g,dir,t0){at9(t0,()=>{infGoto(g,0);Z.length=0;S.sa=1e9;const p=S.p,[ox]=bo((NBX-1)/2|0,0);p.x=dir>0?ox+BW-60:ox+20;jp=-1;jx=dir;jy=0;msg((dir>0?'➡ ':'⬅ ')+g+'블록에서 '+(g+dir)+'블록으로 달려가요')});at9(t0+3900,()=>{jp=null;jx=0})}
function kindsHere(){return W0.b.map(b=>b.gk+'='+b.kind).sort().join('|')}
function scene9(k){stop9();const p=S.p;ZLOG=null;const zl=$('zlog');if(zl)zl.remove();
 if(k=='tour'){infGoto(0,0);ZLOG=[];document.body.insertAdjacentHTML('beforeend','<div id="zlog"><b>알림 기록</b><div style="color:var(--mut)">아직 없음</div></div>');msg('🚨 0구역 → 4구역까지 경계 4곳을 차례로 넘어가요 (약 25초)');
  [14,29,44,59].forEach((g,i)=>runAcross(g,1,1200+i*5200));runAcross(60,-1,1200+4*5200);at9(1200+5*5200,()=>{msg('✅ 알림 '+ZLOG.length+'번: '+ZLOG.join(' · '))});return hud2()}
 if(k=='walk'){infGoto(0,0);msg('🚶 거점에서 시작 · 아무 방향으로나 걸어가 보세요 · 위에 블록 좌표와 구역이 보여요 (조이스틱 끝까지 = 달리기)')}
 if(k=='edge'){infGoto(14,0);Z.length=0;S.sa=1e9;const[ox]=bo((NBX-1)/2|0,0);p.x=ox+BW-60;msg('⏩ 14블록 · 0구역 끝 · 오른쪽으로 달려서 15블록(1구역)에 들어가요');at9(800,()=>{jp=-1;jx=1;jy=0});at9(4500,()=>{jp=null;jx=0})}
 if(k=='zone'){const st=[];for(const g of[0,20,45]){infGoto(g,0);Z.length=0;mk(p.x+80,p.y,{look:'civ1'});const z=Z[Z.length-1];st.push(g+'블록: 체력 '+Math.round(z.mhp)+' · 공격 '+(z.dmg?z.dmg.toFixed(1):7))}
  msg('👹 같은 좀비, 다른 구역 → '+st.join(' / '));at9(200,()=>{Z.length=0;mk(p.x+150,p.y,{look:'civ1',w:1});mk(p.x-150,p.y,{look:'civ2',w:1})})}
 if(k=='same'){infGoto(7,3);const a=kindsHere();msg('🔁 (7,3) 주변을 기억 → 30블록 멀리 갔다가 돌아옵니다');at9(1800,()=>{infGoto(30,3);msg('🔁 (30,3) · 전혀 다른 동네')});at9(3600,()=>{infGoto(7,3);const b=kindsHere();msg(a==b?'✅ (7,3)으로 돌아왔어요 · 건물 '+W0.b.length+'곳 모두 처음과 같아요':'❌ 다름')})}
 if(k=='far'){infGoto(62,-8);Z.length=0;S.sa=1;msg('☠ 62블록 · 4구역 · 특수 좀비와 엘리트가 섞여 나와요 · 보상도 최고 등급');at9(300,()=>{for(let i=0;i<6;i++){const a=i*1.05;mk(p.x+Math.cos(a)*260,p.y+Math.sin(a)*200,{w:1})}})}
 hud2()}
const SC9=[['tour','🚨 1→4구역 경계 알림','14·29·44·59블록 경계를 달려서 넘기 · 마지막에 되돌아오기'],['walk','🚶 직접 걸어가기','거점에서 출발 · 어느 방향이든 끝없이'],['edge','⏩ 1구역 경계 넘기','14블록 → 15블록 · 경고가 떠요'],['zone','👹 구역별 좀비 비교','0 · 20 · 45블록에서 같은 좀비의 체력·공격'],['same','🔁 돌아와도 같은 건물','30블록 멀리 갔다가 돌아오기'],['far','☠ 4구역 (62블록)','특수·엘리트 좀비 · 붉은 화면 가장자리']];
function open9(){const b=$('bm');b.dataset.m='scene';PAUSE=true;
 b.innerHTML='<div class="sh"><h2>♾ 무한 지형</h2><div class="wt">시드 #'+MAPCFG.seed+' · 거점에서 '+zoneStep()+'블록마다 구역이 올라가요</div><button id="s9X">✕</button></div><div class="scl">'+SC9.map(([k,n,d])=>'<div class="scc" data-s9="'+k+'"><b>'+n+'</b><small>'+d+'</small></div>').join('')+'</div>';
 b.style.display='block';b.querySelectorAll('[data-s9]').forEach(c=>c.onclick=()=>scene9(c.dataset.s9));$('s9X').onclick=()=>{$('bm').dataset.m='';closeBase();PAUSE=false}}
document.body.insertAdjacentHTML('beforeend','<button id="scB">♾ 장면</button>');
$('scB').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation()});$('scB').addEventListener('click',e=>{e.preventDefault();e.stopPropagation();if(run)open9()});
document.head.insertAdjacentHTML('beforeend',`<style>#scB{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(env(safe-area-inset-bottom,0px) + 8px);z-index:4;padding:6px 14px;font-size:13px;border-radius:99px;background:#4a3c14;border-color:#e0b03a;width:auto;max-width:none}
#bm .scl{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:5px;margin-top:8px}#bm .scc{padding:8px 10px;border-radius:10px;border:1px solid #ffffff1f;background:#ffffff0a;cursor:pointer}#bm .scc b{display:block;font-size:13px}#bm .scc small{font-size:11px;color:var(--mut)}#zlog{position:fixed;right:8px;top:calc(env(safe-area-inset-top,0px) + 150px);z-index:5;pointer-events:none;font-size:12px;padding:6px 10px;border-radius:10px;background:#000b;border:1px solid #ffffff2a;line-height:1.5}</style>`);
addEventListener('load',()=>setTimeout(()=>{let sv=null;try{sv=JSON.parse(localStorage.getItem(SAVE)||'null')}catch(e){}if(sv&&sv.map&&sv.map.inf){start(0,true);msg('♾ 지난번 그 자리에서 이어서 시작해요');return open9()}start('S',false);const pg=S.pg;if(pg&&!pg.tr.length){pg.tr=['runner'];$('bm').dataset.m='';closeBase();PAUSE=false}open9()},50));
