/* PROJECT LEGACY — endless city sample: scene picker. */
'use strict';
const T9=[];const at9=(ms,f)=>T9.push(setTimeout(f,ms));
/* keep the endless-city game saved every few seconds so reopening the sample continues where you were */
setInterval(()=>{if(run&&S&&S.inf)try{save()}catch(e){}},8000);
function stop9(){T9.forEach(clearTimeout);T9.length=0;jp=null;jx=jy=0;$('bm').dataset.m='';closeBase();PAUSE=false;const p=S.p;p.hp=MHP(p);p.food=p.water=100}
/* zone alert log shown in the corner while the tour runs */
let ZLOG=null;function onZoneAlert(z,up,t){if(!ZLOG)return;ZLOG.push((up?'⚠ ':'🛡 ')+z+'구역 '+(up?'진입':'복귀')+' ✓');const el=$('zlog');if(el)el.innerHTML='<b>알림 기록</b>'+ZLOG.map(x=>'<div>'+x+'</div>').join('')}
function runAcross(g,dir,t0){at9(t0,()=>{infGoto(g,0);Z.length=0;S.sa=1e9;const p=S.p,[ox]=bo((NBX-1)/2|0,0);p.x=dir>0?ox+BW-60:ox+20});at9(t0+1500,()=>{jp=-1;jx=dir;jy=0});at9(t0+5400,()=>{jp=null;jx=0})}
function giveDemo(){const p=S.p,T={pistol:1,a9mm:60,ar:1,a556:120,enh1:6,enh2:6,enh3:6,enhg:2,scrap:20};for(const k in T)if((p.inv[k]|0)<T[k])invAdd(p,k,T[k]-(p.inv[k]|0));p.eq.prim='ar';p.eq.sec='pistol';p.as='prim';s3dirty();p.mag.ar=wdef('ar')[4].mag}
function kindsHere(){return W0.b.map(b=>b.gk+'='+b.kind).sort().join('|')}
function scene9(k){stop9();const p=S.p;ZLOG=null;const zl=$('zlog');if(zl)zl.remove();
 if(k=='tour'){infGoto(0,0);ZLOG=[];document.body.insertAdjacentHTML('beforeend','<div id="zlog"><b>알림 기록</b><div style="color:var(--mut)">아직 없음</div></div>');msg('🚨 0구역 → 4구역까지 경계 4곳을 차례로 넘어가요 (약 25초)');
  S.inf.fz={};[14,29,44,59].forEach((g,i)=>runAcross(g,1,800+i*7000));runAcross(60,-1,800+4*7000);at9(800+5*7000,()=>{msg('✅ 알림 '+ZLOG.length+'번: '+ZLOG.join(' · '))});return hud2()}
 if(k=='warn'){runAcross(13,1,0);msg('⚠ 13블록 → 14블록 · 경계 한 블록 전에 예고가 떠요');return hud2()}
 if(k=='bonus'){S.inf.fz={};infGoto(10,0);ZLAST=0;runAcross(14,1,200);at9(2000,()=>msg('🎁 15블록(1구역)에 처음 들어가면 보급이 들어와요'));at9(9000,()=>{const p=S.p;msg('🎒 가방: '+['enh1','enh2','enhg'].map(k=>NM2(k)+' '+(p.inv[k]|0)).join(' · '))});return hud2()}
 if(k=='enh'){infGoto(0,0);giveDemo();ENSEL='ar';ENRES=null;setTimeout(()=>openEnh('ar'),50);return}
 if(k=='ench'){infGoto(0,0);giveDemo();const pg=EP();pg.enh.ar=Math.max(5,pg.enh.ar|0);give({rn_fire2:1,rn_ice1:1,rn_shock3:1,rn_leech2:1,rn_hunt4:1,rn_exec3:1});s3dirty();ENSEL='ar';ENRES=['ok','+5 돌격소총 · 룬 칸 2개가 열려 있어요 · 룬을 눌러 새겨 보세요'];setTimeout(()=>openEnh('ar'),50);return}
 if(k=='fight'){infGoto(62,0);giveDemo();const pg=EP();pg.enh.ar=8;pg.ench.ar=['rn_hunt4','rn_fire3'];s3dirty();Z.length=0;S.sa=1e9;mk(p.x+600,p.y,{look:'civ1'});const z=Z[0],hp=z.mhp,d0=W_BY.ar[4].d,d1=wdef('ar')[4].d*(1+.1*4*4);Z.length=0;
  const fm='⚔ 4구역 좀비 체력 '+Math.round(hp)+' · +0 돌격소총 '+Math.ceil(hp/d0)+'발 → +8 · ☠Ⅳ 구역 사냥꾼 '+Math.ceil(hp/d1)+'발 (+🔥 화염)';at9(1700,()=>msg(fm));at9(400,()=>{for(let i=0;i<5;i++){const a=i*1.26;mk(p.x+Math.cos(a)*280,p.y+Math.sin(a)*220,{look:'civ1',w:1})}});return hud2()}
 if(k=='walk'){infGoto(0,0);msg('🚶 거점에서 시작 · 아무 방향으로나 걸어가 보세요 · 위에 블록 좌표와 구역이 보여요 (조이스틱 끝까지 = 달리기)')}
 if(k=='edge'){infGoto(14,0);Z.length=0;S.sa=1e9;const[ox]=bo((NBX-1)/2|0,0);p.x=ox+BW-60;msg('⏩ 14블록 · 0구역 끝 · 오른쪽으로 달려서 15블록(1구역)에 들어가요');at9(800,()=>{jp=-1;jx=1;jy=0});at9(4500,()=>{jp=null;jx=0})}
 if(k=='zone'){const st=[];for(const g of[0,15,30,45,60]){infGoto(g,0);Z.length=0;mk(p.x+80,p.y,{look:'civ1'});const z=Z[Z.length-1];st.push(g+'블록 '+Math.round(z.mhp)+' / '+(z.dmg?z.dmg.toFixed(1):7))}
  msg('👹 같은 좀비 (체력 / 공격) → '+st.join(' · '));at9(200,()=>{Z.length=0;mk(p.x+150,p.y,{look:'civ1',w:1});mk(p.x-150,p.y,{look:'civ2',w:1})})}
 if(k=='same'){infGoto(7,3);const a=kindsHere();msg('🔁 (7,3) 주변을 기억 → 30블록 멀리 갔다가 돌아옵니다');at9(1800,()=>{infGoto(30,3);msg('🔁 (30,3) · 전혀 다른 동네')});at9(3600,()=>{infGoto(7,3);const b=kindsHere();msg(a==b?'✅ (7,3)으로 돌아왔어요 · 건물 '+W0.b.length+'곳 모두 처음과 같아요':'❌ 다름')})}
 if(k=='far'){infGoto(62,-8);Z.length=0;S.sa=1;msg('☠ 62블록 · 4구역 · 특수 좀비와 엘리트가 섞여 나와요 · 보상도 최고 등급');at9(300,()=>{for(let i=0;i<6;i++){const a=i*1.05;mk(p.x+Math.cos(a)*260,p.y+Math.sin(a)*200,{w:1})}})}
 hud2()}
const SC9=[['tour','🚨 1→4구역 경계 알림','체력 ×2 · ×4 · ×6 · ×8 · 예고 + 첫 진입 보급까지 (약 35초)'],['warn','⚠ 경계 1블록 전 예고','13 → 14블록 · "다음 블록부터 1구역"'],['bonus','🎁 구역 첫 진입 보급','15블록 첫 진입 · 강화석·룬·경험치'],['zone','👹 구역별 좀비 체력','0 · 15 · 30 · 45 · 60블록 같은 좀비 비교'],['enh','🔨 무기 강화 +1~+10','강화석으로 강화 · 성공률 · 보호 부적'],['ench','✨ 인챈트 (룬 새기기)','룬 6종 × 4등급 · +5에서 칸 2개'],['fight','⚔ 4구역에서 시험','+8 돌격소총 + 구역 사냥꾼 Ⅳ · 화염 Ⅲ']];
function open9(){const b=$('bm');b.dataset.m='scene';PAUSE=true;
 b.innerHTML='<div class="sh"><h2>♾ 무한 지형</h2><div class="wt">시드 #'+MAPCFG.seed+' · 거점에서 '+zoneStep()+'블록마다 구역이 올라가요</div><button id="s9X">✕</button></div><div class="scl">'+SC9.map(([k,n,d])=>'<div class="scc" data-s9="'+k+'"><b>'+n+'</b><small>'+d+'</small></div>').join('')+'</div>';
 b.style.display='block';b.querySelectorAll('[data-s9]').forEach(c=>c.onclick=()=>scene9(c.dataset.s9));$('s9X').onclick=()=>{$('bm').dataset.m='';closeBase();PAUSE=false}}
document.body.insertAdjacentHTML('beforeend','<button id="scB">♾ 장면</button>');
$('scB').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation()});$('scB').addEventListener('click',e=>{e.preventDefault();e.stopPropagation();if(run)open9()});
document.head.insertAdjacentHTML('beforeend',`<style>#scB{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(env(safe-area-inset-bottom,0px) + 8px);z-index:4;padding:6px 14px;font-size:13px;border-radius:99px;background:#4a3c14;border-color:#e0b03a;width:auto;max-width:none}
#bm .scl{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:5px;margin-top:8px}#bm .scc{padding:8px 10px;border-radius:10px;border:1px solid #ffffff1f;background:#ffffff0a;cursor:pointer}#bm .scc b{display:block;font-size:13px}#bm .scc small{font-size:11px;color:var(--mut)}#zlog{position:fixed;right:8px;top:calc(env(safe-area-inset-top,0px) + 150px);z-index:5;pointer-events:none;font-size:12px;padding:6px 10px;border-radius:10px;background:#000b;border:1px solid #ffffff2a;line-height:1.5}</style>`);
addEventListener('load',()=>setTimeout(()=>{let sv=null;try{sv=JSON.parse(localStorage.getItem(SAVE)||'null')}catch(e){}if(sv&&sv.map&&sv.map.inf){start(0,true);msg('♾ 지난번 그 자리에서 이어서 시작해요');return open9()}start('S',false);const pg=S.pg;if(pg&&!pg.tr.length){pg.tr=['runner'];$('bm').dataset.m='';closeBase();PAUSE=false}open9()},50));
