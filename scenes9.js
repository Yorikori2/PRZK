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
 if(k=='cmp'){infGoto(0,0);setTimeout(openCmp,50);return}
 if(k=='prof'){setTimeout(openProf,50);return}
 if(k=='late'){giveDemo();const pg=EP();pg.enh.ar=10;pg.ench.ar=['rn_hunt4','rn_fire3','rn_shock3'];s3dirty();ZLAST=null;S.inf.zv={};S.inf.bb={};infGoto(75,0);S.sa=1;at9(1500,()=>{const c={};for(const z of Z){const k=ZN[z.look]?ZN[z.look][1]:'일반';c[k]=(c[k]||0)+1}msg('☠ 5구역 · 주변 좀비 '+Z.length+'마리: '+Object.entries(c).sort((a,b)=>b[1]-a[1]).map(([k,v])=>k+' '+v).join(' · ')+' · +10 소총 ☠Ⅳ🔥Ⅲ⚡Ⅲ')});return hud2()}
 if(k=='warn'){runAcross(13,1,0);msg('⚠ 13블록 → 14블록 · 경계 한 블록 전에 예고가 떠요');return hud2()}
 if(k=='bonus'){S.inf.fz={};infGoto(10,0);ZLAST=0;runAcross(14,1,200);at9(2000,()=>msg('🎁 15블록(1구역)에 처음 들어가면 보급이 들어와요'));at9(9000,()=>{const p=S.p;msg('🎒 가방: '+['enh1','enh2','enhg'].map(k=>NM2(k)+' '+(p.inv[k]|0)).join(' · '))});return hud2()}
 if(k=='enh'){infGoto(0,0);giveDemo();ENSEL='ar';ENRES=null;setTimeout(()=>openEnh('ar'),50);return}
 if(k=='ench'){infGoto(0,0);giveDemo();const pg=EP();pg.enh.ar=Math.max(5,pg.enh.ar|0);give({rn_fire2:1,rn_ice1:1,rn_shock3:1,rn_leech2:1,rn_hunt4:1,rn_exec3:1});s3dirty();ENSEL='ar';ENRES=['ok','+5 돌격소총 · 룬 칸 2개가 열려 있어요 · 룬을 눌러 새겨 보세요'];setTimeout(()=>openEnh('ar'),50);return}
 if(k=='fight'){infGoto(62,0);giveDemo();const pg=EP();pg.enh.ar=8;pg.ench.ar=['rn_hunt4','rn_fire3'];s3dirty();Z.length=0;S.sa=1e9;mk(p.x+600,p.y,{look:'civ1'});const z=Z[0],hp=z.mhp,d0=W_BY.ar[4].d,d1=wdef('ar')[4].d*huntMul(4,4);Z.length=0;
  const fm='⚔ 4구역 좀비 체력 '+Math.round(hp)+' · +0 돌격소총 '+Math.ceil(hp/d0)+'발 → +8 · ☠Ⅳ 구역 사냥꾼 '+Math.ceil(hp/d1)+'발 (+🔥 화염)';at9(1700,()=>msg(fm));at9(400,()=>{for(let i=0;i<5;i++){const a=i*1.26;mk(p.x+Math.cos(a)*280,p.y+Math.sin(a)*220,{look:'civ1',w:1})}});return hud2()}
 if(k=='walk'){infGoto(0,0);msg('🚶 거점에서 시작 · 아무 방향으로나 걸어가 보세요 · 위에 블록 좌표와 구역이 보여요 (조이스틱 끝까지 = 달리기)')}
 if(k=='edge'){infGoto(14,0);Z.length=0;S.sa=1e9;const[ox]=bo((NBX-1)/2|0,0);p.x=ox+BW-60;msg('⏩ 14블록 · 0구역 끝 · 오른쪽으로 달려서 15블록(1구역)에 들어가요');at9(800,()=>{jp=-1;jx=1;jy=0});at9(4500,()=>{jp=null;jx=0})}
 if(k=='zone'){const st=[];for(const g of[0,15,30,45,60]){infGoto(g,0);Z.length=0;mk(p.x+80,p.y,{look:'civ1'});const z=Z[Z.length-1];st.push(g+'블록 '+Math.round(z.mhp)+' / '+(z.dmg?z.dmg.toFixed(1):7))}
  msg('👹 같은 좀비 (체력 / 공격) → '+st.join(' · '));at9(200,()=>{Z.length=0;mk(p.x+150,p.y,{look:'civ1',w:1});mk(p.x-150,p.y,{look:'civ2',w:1})})}
 if(k=='same'){infGoto(7,3);const a=kindsHere();msg('🔁 (7,3) 주변을 기억 → 30블록 멀리 갔다가 돌아옵니다');at9(1800,()=>{infGoto(30,3);msg('🔁 (30,3) · 전혀 다른 동네')});at9(3600,()=>{infGoto(7,3);const b=kindsHere();msg(a==b?'✅ (7,3)으로 돌아왔어요 · 건물 '+W0.b.length+'곳 모두 처음과 같아요':'❌ 다름')})}
 if(k=='far'){infGoto(62,-8);Z.length=0;S.sa=1;msg('☠ 62블록 · 4구역 · 특수 좀비와 엘리트가 섞여 나와요 · 보상도 최고 등급');at9(300,()=>{for(let i=0;i<6;i++){const a=i*1.05;mk(p.x+Math.cos(a)*260,p.y+Math.sin(a)*200,{w:1})}})}
 hud2()}
/* shots-to-kill table: same zombie in every zone, against base / enhanced / zone-hunter weapons */
const CMPW=[['권총<br>+0','pistol',0,0],['소총<br>+0','ar',0,0],['소총<br>+5','ar',5,0],['소총<br>+10','ar',10,0],['+10 ☠Ⅳ<br><s>이전</s>','ar',10,-4],['+10 ☠Ⅳ<br>변경','ar',10,4]];
function cmpRows(){const p=S.p,rows=[],o=infZoneCheck,g0=gOf(p.x,p.y);infZoneCheck=()=>{};try{for(let zn=0;zn<=6;zn++){infGoto(zn*zoneStep()+(S.d=='N'?-zoneStep():0),0);Z.length=0;mk(p.x+600,p.y,{look:'civ1'});const z=Z[0],hp=Math.round(z.mhp),zz=z.zone|0;Z.length=0;
  rows.push([zn,hp,+(z.dmg||7).toFixed(1),CMPW.map(([n,id,lv,h])=>{const d=W_BY[id][4].d*(1+ENH.per*lv)*(h>0&&zz?huntMul(h,zz):h<0&&zz?1+.1*-h*zz:1);return Math.ceil(hp/d)})])}infGoto(g0[0],g0[1])}finally{infZoneCheck=o}return rows}
const colN=n=>n<=2?'#7fd07f':n<=5?'#ffd36a':n<=10?'#ff9a5a':'#ff6a5a';
function sheet(title,sub,body){const b=$('bm');b.dataset.m='scene';PAUSE=true;b.innerHTML='<div class="sh"><h2>'+title+'</h2><div class="wt">'+sub+'</div><button onclick="closeBase()">✕</button></div>'+body;b.style.display='block';const zb=$('zoneb');if(zb)zb.classList.remove('on')}
function openCmp(){const rows=cmpRows();
 sheet('📊 의견 1 · 3 적용 비교표','일반 좀비를 쓰러뜨리는 데 필요한 발수 · 기본 피해 권총 '+W_BY.pistol[4].d+' · 돌격소총 '+W_BY.ar[4].d+' (레벨·스킬·파츠·치명타·화염 제외)',
 '<h4>1번 · 구역 사냥꾼 +10% → +6% (4구역까지만)</h4><div style="overflow-x:auto"><table class="cmpT"><tr><th>구역</th><th>체력</th><th>공격</th>'+CMPW.map(c=>'<th>'+c[0]+'</th>').join('')+'</tr>'+rows.map(r=>'<tr><td><b>'+r[0]+'</b></td><td>'+r[1]+'</td><td>'+r[2]+'</td>'+r[3].map((n,i)=>'<td style="color:'+colN(n)+(i==4?';opacity:.55':'')+'"><b>'+n+'</b></td>').join('')+'</tr>').join('')+'</table></div>'+
 '<p class="mut" style="font-size:11.5px">숫자 = 발수 · 소총 = 돌격소총 · 초록 1~2 · 노랑 3~5 · 주황 6~10 · 빨강 11 이상 · 이전 방식은 멀리 갈수록 3발에 머물렀지만, 변경 후에는 5구역부터 다시 늘어나요</p>'+
 '<h4>3번 · 0구역 하급 강화석</h4><table class="cmpT"><tr><th></th><th>좀비 처치</th><th>수색</th><th>+3까지 (강화석 3개)</th></tr><tr><td><s>이전</s></td><td>2%</td><td>6%</td><td>좀비 약 150마리 또는 수색 50번</td></tr><tr><td><b>변경</b></td><td style="color:#7fd07f"><b>6%</b></td><td style="color:#7fd07f"><b>12%</b></td><td style="color:#7fd07f"><b>좀비 약 50마리 또는 수색 25번</b></td></tr></table>'+
 '<p class="mut" style="font-size:11.5px">+3 돌격소총이면 1구역(체력 120) 일반 좀비가 4발 → 3발 · 첫 진입 보급(하급 3개)까지 합치면 1구역 들어가자마자 +3~+4가 돼요</p>')}
function openProf(){const R=[];for(let zn=0;zn<=6;zn++){const P=zProf(zn),pc=x=>x?Math.round(x*100)+'%':'—',nw=[...(ZSP[zn]||[]),...(ZEL[zn]||[])].map(k=>ZN[k]?ZN[k][1]:k);
  R.push('<tr><td><b>'+zn+'</b><br><small>'+(zn*zoneStep())+'블록~</small></td><td>×'+P.hp+'</td><td>×'+P.ehp.toFixed(1)+'</td><td>×'+P.bhp.toFixed(1)+'</td><td>×'+P.atk.toFixed(1)+'</td><td>×'+P.spd.toFixed(2)+'</td><td>'+pc(P.sp)+'</td><td>'+pc(P.el)+'</td><td>×'+P.dens.toFixed(2)+'</td><td>'+pc(P.boss)+'</td><td class="nw">'+(zn==4?'브루트 · 보스(번식체·골리앗)':nw.join(' · ')||(zn?'—':'지금 게임과 같음'))+'</td></tr>')}
 sheet('👹 구역별 좀비 변화','생존 난이도 기준 · 체력은 각 좀비의 원래 체력에 곱해요',
 '<div style="overflow-x:auto"><table class="cmpT zp"><tr><th>구역</th><th>일반<br>체력</th><th>엘리트<br>체력</th><th>보스<br>체력</th><th>공격</th><th>속도</th><th>특수<br>비율</th><th>엘리트<br>비율</th><th>좀비 수</th><th>떠돌이<br>보스</th><th>새로 나오는 좀비</th></tr>'+R.join('')+'</table></div>'+
 '<p class="mut" style="font-size:11.5px">특수·엘리트 비율 = 블록 좀비 중 바뀌는 몫 · 좀비 수 = 블록당 좀비 배수 · 떠돌이 보스 = 4구역부터 블록마다 보스가 있을 확률 · 엘리트는 체력 증가를 절반만, 보스는 구역당 +50%만 받아요 (안 그러면 4구역 골리앗이 체력 18000)</p>')}
const SC9=[['prof','👹 구역별 좀비 변화표','체력·공격·속도·특수·엘리트·수·보스 (0~6구역)'],['cmp','📊 의견 1·3 적용 비교표','구역 사냥꾼 +6% · 0구역 강화석 증가'],['late','☠ 5구역 직접 보기','75블록 · 특수·엘리트가 섞인 무리'],['tour','🚨 1→4구역 경계 알림','체력 ×3 · ×6 · ×9 · ×12 · 예고 + 첫 진입 보급까지 (약 35초)'],['warn','⚠ 경계 1블록 전 예고','13 → 14블록 · "다음 블록부터 1구역"'],['bonus','🎁 구역 첫 진입 보급','15블록 첫 진입 · 강화석·룬·경험치'],['zone','👹 구역별 좀비 체력','0 · 15 · 30 · 45 · 60블록 같은 좀비 비교'],['enh','🔨 무기 강화 +1~+10','강화석으로 강화 · 성공률 · 보호 부적'],['ench','✨ 인챈트 (룬 새기기)','룬 6종 × 4등급 · +5에서 칸 2개'],['fight','⚔ 4구역에서 시험','+8 돌격소총 + 구역 사냥꾼 Ⅳ · 화염 Ⅲ']];
function open9(){const b=$('bm');b.dataset.m='scene';PAUSE=true;
 b.innerHTML='<div class="sh"><h2>♾ 무한 지형</h2><div class="wt">시드 #'+MAPCFG.seed+' · 거점에서 '+zoneStep()+'블록마다 구역이 올라가요</div><button id="s9X">✕</button></div><div class="scl">'+SC9.map(([k,n,d])=>'<div class="scc" data-s9="'+k+'"><b>'+n+'</b><small>'+d+'</small></div>').join('')+'</div>';
 b.style.display='block';b.querySelectorAll('[data-s9]').forEach(c=>c.onclick=()=>scene9(c.dataset.s9));$('s9X').onclick=()=>{$('bm').dataset.m='';closeBase();PAUSE=false}}
document.body.insertAdjacentHTML('beforeend','<button id="scB">♾ 장면</button>');
$('scB').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation()});$('scB').addEventListener('click',e=>{e.preventDefault();e.stopPropagation();if(run)open9()});
document.head.insertAdjacentHTML('beforeend',`<style>#scB{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(env(safe-area-inset-bottom,0px) + 8px);z-index:4;padding:6px 14px;font-size:13px;border-radius:99px;background:#4a3c14;border-color:#e0b03a;width:auto;max-width:none}
#bm .scl{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:5px;margin-top:8px}#bm .scc{padding:8px 10px;border-radius:10px;border:1px solid #ffffff1f;background:#ffffff0a;cursor:pointer}#bm .scc b{display:block;font-size:13px}#bm .scc small{font-size:11px;color:var(--mut)}#bm .cmpT{border-collapse:collapse;font-size:12px;width:100%;margin:8px 0;white-space:nowrap}#bm .cmpT th,#bm .cmpT td{padding:5px 6px;border-bottom:1px solid #ffffff18;text-align:center}#bm .cmpT th{font-size:11px;color:var(--mut)}#bm .cmpT.zp td{font-size:11.5px}#bm .cmpT td.nw{text-align:left;white-space:normal;min-width:130px;font-size:11px}#zlog{position:fixed;right:8px;top:calc(env(safe-area-inset-top,0px) + 150px);z-index:5;pointer-events:none;font-size:12px;padding:6px 10px;border-radius:10px;background:#000b;border:1px solid #ffffff2a;line-height:1.5}</style>`);
addEventListener('load',()=>setTimeout(()=>{let sv=null;try{sv=JSON.parse(localStorage.getItem(SAVE)||'null')}catch(e){}if(sv&&sv.map&&sv.map.inf){start(0,true);msg('♾ 지난번 그 자리에서 이어서 시작해요');return open9()}start('S',false);const pg=S.pg;if(pg&&!pg.tr.length){pg.tr=['runner'];$('bm').dataset.m='';closeBase();PAUSE=false}open9()},50));
