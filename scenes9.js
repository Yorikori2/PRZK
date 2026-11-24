/* PROJECT LEGACY — endless city sample: scene picker. */
'use strict';
const T9=[];const at9=(ms,f)=>T9.push(setTimeout(f,ms));
/* keep the endless-city game saved every few seconds so reopening the sample continues where you were */
setInterval(()=>{if(run&&S&&S.inf)try{save()}catch(e){}},8000);
function stop9(){if(typeof DM!='undefined')DM=null;if(typeof DUN!='undefined'&&DUN)dunExit();window.DSPEED=1;T9.forEach(clearTimeout);T9.length=0;jp=null;jx=jy=0;$('bm').dataset.m='';closeBase();PAUSE=false;const p=S.p;p.hp=MHP(p);p.food=p.water=100}
/* zone alert log shown in the corner while the tour runs */
let ZLOG=null;function onZoneAlert(z,up,t){if(!ZLOG)return;ZLOG.push((up?'⚠ ':'🛡 ')+z+'구역 '+(up?'진입':'복귀')+' ✓');const el=$('zlog');if(el)el.innerHTML='<b>알림 기록</b>'+ZLOG.map(x=>'<div>'+x+'</div>').join('')}
function runAcross(g,dir,t0){at9(t0,()=>{infGoto(g,0);Z.length=0;S.sa=1e9;const p=S.p,[ox]=bo((NBX-1)/2|0,0);p.x=dir>0?ox+BW-60:ox+20});at9(t0+1500,()=>{jp=-1;jx=dir;jy=0});at9(t0+5400,()=>{jp=null;jx=0})}
function giveDemo(){const p=S.p,T={pistol:1,a9mm:60,ar:1,a556:120,enh1:6,enh2:6,enh3:6,enhg:2,scrap:20};for(const k in T)if((p.inv[k]|0)<T[k])invAdd(p,k,T[k]-(p.inv[k]|0));p.eq.prim='ar';p.eq.sec='pistol';p.as='prim';s3dirty();p.mag.ar=wdef('ar')[4].mag}
function kindsHere(){return W0.b.map(b=>b.gk+'='+b.kind).sort().join('|')}
function scene9(k){stop9();const p=S.p;ZLOG=null;const zl=$('zlog');if(zl)zl.remove();
 if(k=='tour'){infGoto(0,0);ZLOG=[];document.body.insertAdjacentHTML('beforeend','<div id="zlog"><b>알림 기록</b><div style="color:var(--mut)">아직 없음</div></div>');msg('🚨 0구역 → 4구역까지 경계 4곳을 차례로 넘어가요 (약 25초)');
  S.inf.fz={};[14,29,44,59].forEach((g,i)=>runAcross(g,1,800+i*7000));runAcross(60,-1,800+4*7000);at9(800+5*7000,()=>{msg('✅ 알림 '+ZLOG.length+'번: '+ZLOG.join(' · '))});return hud2()}
 if(k=='dtools'){setTimeout(demoSheet,50);return}
 if(k=='small'){const r=goInside(['houses','apt'],{dt1:1});if(!r)return msg('주택가를 찾지 못했어요');msg('🏠 '+r.b.name+' 안 · 철거 해머 지급 · 잠시 뒤 철거를 시작해요');at9(1500,demoTry);return hud2()}
 if(k=='block'){const r=goInside(['clinic','police'],{dt3:1});if(!r)return;at9(1200,()=>{demoTry();msg($('msg').textContent)});return hud2()}
 if(k=='big'){const r=goInside(['clinic','police'],{dt3:1});if(!r)return;Z=Z.filter(z=>!inBld(r.bi,z.x,z.y));window.DSPEED=.5;S.p.hp=MHP(S.p);msg('🏥 '+r.b.name+' 안 좀비를 모두 처치한 상태 · 폭약 세트로 철거를 시작해요');at9(1500,demoTry);return hud2()}
 if(k=='shelter'){const r=goInside(['houses','apt'],{dt1:1});if(!r)return;Z.length=0;DM={bi:r.bi,gk:r.b.gk,kind:r.b.kind,name:r.b.name,need:1,gx:r.b.gx,gy:r.b.gy};demoDone('shelter');const h=W0.objs.find(o=>o.t=='hatch');if(h){S.p.x=h.x+26;S.p.y=h.y+70}return hud2()}
 if(k=='bunker'){const r=goInside(['police','mil'],{dt3:1});if(!r)return;Z.length=0;DM={bi:r.bi,gk:r.b.gk,kind:r.b.kind,name:r.b.name,need:3,gx:r.b.gx,gy:r.b.gy};demoDone('bunker');const h=W0.objs.find(o=>o.t=='hatch');if(h){S.p.x=h.x+26;S.p.y=h.y+70;at9(1200,()=>dunEnter(h))}return hud2()}
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
/* ---------- demolition sample helpers ---------- */
function findKind(L,from=1){for(let d=from;d<60;d++)for(let a=-d;a<=d;a++)for(const[gx,gy]of[[a,-d],[a,d],[-d,a],[d,a]])if(L.includes(kindAt(gx,gy)))return[gx,gy];return null}
function goInside(L,tools){const f=findKind(L);if(!f)return null;const[gx,gy]=f;stop9();infGoto(gx,gy);Z.length=0;const p=S.p,bi=W0.b.findIndex(b=>b.gk==gx+','+gy&&DLV[b.kind]);if(bi<0)return null;
 const rs=W0.roofs.filter(r=>r.bi==bi).sort((a,b)=>b.w*b.h-a.w*a.h),rf=rs[0];for(let i=0;i<400;i++){const x=rf.x+40+Math.random()*(rf.w-80),y=rf.y+40+Math.random()*(rf.h-80);if(!blocker(x,y,9)){p.x=x;p.y=y;break}}
 give(tools);for(const z of W0.zs)if(z.b==bi||(W0.b[z.b]&&W0.b[z.b].gk==gx+','+gy))mk(z.x,z.y,{look:z.look});return{bi,b:W0.b[bi]}}
function demoSheet(){const row=(lv,L)=>'<tr><td><b>Lv'+lv+'</b><br><small>'+NM2('dt'+lv)+'</small></td><td style="text-align:left;white-space:normal">'+L+'</td><td>'+DTIME[lv]+'초</td><td>'+['','1블록','2블록','3블록'][lv]+'</td><td>'+Object.entries(DREW[lv]).map(([k,v])=>NM2(k)+' '+v).join(' · ')+'</td></tr>';
 sheet('🏚 철거 도구 3단계','도구 단계보다 낮은 건물은 모두 철거할 수 있어요 · 대형(Lv2·3)은 건물 안 좀비를 모두 처치해야 시작돼요',
 '<div style="overflow-x:auto"><table class="cmpT"><tr><th>도구</th><th>건물</th><th>시간</th><th>소음</th><th>얻는 재료</th></tr>'+row(1,'주택가 · 아파트 · 교회 · 편의점')+row(2,'학교 · 철물점 · 소방서 · 물류창고')+row(3,'진료소(병원) · 경찰서 · 군부대 · 연구소')+'</table></div>'+
 '<h4>잔해 아래 지하 발견 확률</h4><table class="cmpT"><tr><th>건물</th><th>🕳 지하 대피소</th><th>🪖 지하 벙커</th></tr><tr><td>주택가 · 아파트 · 교회 · 편의점</td><td>15%</td><td>—</td></tr><tr><td>학교 · 철물점 · 소방서 · 물류창고</td><td>25%</td><td>—</td></tr><tr><td>진료소 · 경찰서</td><td>20%</td><td>15%</td></tr><tr><td>군부대 · 연구소</td><td>—</td><td>50%</td></tr></table>'+
 '<p class="mut" style="font-size:11.5px">대피소: 크롤러 · 잠복자 · 가장 깊은 방에 부머와 보급품 · 벙커: 군인 좀비 · 중무장 · 가장 깊은 방에 브루트와 무기고 · 지하에서는 강화석 30% · 룬 8% · 파츠가 더 잘 나와요</p>')}
const SC9=[['dtools','🏚 철거 도구 3단계 표','도구별 건물 · 시간 · 소음 · 재료 · 지하 발견 확률'],['small','🏠 작은 건물 철거 (Lv1)','20초 · 소음을 듣고 좀비가 몰려와요'],['block','🚫 대형 건물: 좀비가 남아 있으면','진료소 안 좀비를 모두 처치해야 시작'],['big','🏥 대형 건물 철거 (Lv3)','지하에서 좀비가 올라옴 + 주변 좀비 · 샘플은 시간 절반'],['shelter','🕳 지하 대피소 발견','철거 후 입구 → 내려가기'],['bunker','🪖 지하 벙커 탐험','어두운 벙커 · 가장 깊은 방에 브루트']];
function open9(){const b=$('bm');b.dataset.m='scene';PAUSE=true;
 b.innerHTML='<div class="sh"><h2>🏚 철거 · 지하 대피소</h2><div class="wt">시드 #'+MAPCFG.seed+' · 거점에서 '+zoneStep()+'블록마다 구역이 올라가요</div><button id="s9X">✕</button></div><div class="scl">'+SC9.map(([k,n,d])=>'<div class="scc" data-s9="'+k+'"><b>'+n+'</b><small>'+d+'</small></div>').join('')+'</div>';
 b.style.display='block';b.querySelectorAll('[data-s9]').forEach(c=>c.onclick=()=>scene9(c.dataset.s9));$('s9X').onclick=()=>{$('bm').dataset.m='';closeBase();PAUSE=false}}
document.body.insertAdjacentHTML('beforeend','<button id="scB">♾ 장면</button>');
$('scB').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation()});$('scB').addEventListener('click',e=>{e.preventDefault();e.stopPropagation();if(run)open9()});
document.head.insertAdjacentHTML('beforeend',`<style>#scB{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(env(safe-area-inset-bottom,0px) + 8px);z-index:4;padding:6px 14px;font-size:13px;border-radius:99px;background:#4a3c14;border-color:#e0b03a;width:auto;max-width:none}
#bm .scl{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:5px;margin-top:8px}#bm .scc{padding:8px 10px;border-radius:10px;border:1px solid #ffffff1f;background:#ffffff0a;cursor:pointer}#bm .scc b{display:block;font-size:13px}#bm .scc small{font-size:11px;color:var(--mut)}#bm .cmpT{border-collapse:collapse;font-size:12px;width:100%;margin:8px 0;white-space:nowrap}#bm .cmpT th,#bm .cmpT td{padding:5px 6px;border-bottom:1px solid #ffffff18;text-align:center}#bm .cmpT th{font-size:11px;color:var(--mut)}#bm .cmpT.zp td{font-size:11.5px}#bm .cmpT td.nw{text-align:left;white-space:normal;min-width:130px;font-size:11px}#zlog{position:fixed;right:8px;top:calc(env(safe-area-inset-top,0px) + 150px);z-index:5;pointer-events:none;font-size:12px;padding:6px 10px;border-radius:10px;background:#000b;border:1px solid #ffffff2a;line-height:1.5}</style>`);
addEventListener('load',()=>setTimeout(()=>{let sv=null;try{sv=JSON.parse(localStorage.getItem(SAVE)||'null')}catch(e){}if(sv&&sv.map&&sv.map.inf){start(0,true);msg('♾ 지난번 그 자리에서 이어서 시작해요');return open9()}start('S',false);const pg=S.pg;if(pg&&!pg.tr.length){pg.tr=['runner'];$('bm').dataset.m='';closeBase();PAUSE=false}open9()},50));
