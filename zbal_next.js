/* PROJECT LEGACY — sample: how the city decides each block, a proposal that changes the mix by zone, and every
   open opinion in one list. Nothing here changes the game's map: propKind() is only used to draw and count. */
'use strict';
/* the old rule is OLDK (zone_next.js) · kindAt is now the zone-cycle rule */
const propKind=(gx,gy)=>kindAt(gx,gy);
/* ---------- counting ---------- */
const ZGRP=[['🏠 주거',['houses','apt']],['🌳 공원',['park']],['🛒 일상 상점',['mart','hard','pharm','mall']],['🚚 차량 · 물류',['garage','park2','ware','subway']],['🏥 의료',['clinic','hosp']],['🏫 공공',['school','church','fire','bank','radio']],['🔫 무기 · 위험',['gunshop','police','mil','prison','lab','rbase']]];
const ZGUN=['gunshop','police','mil','prison'];
function zCount(fn){const st=zoneStep(),N={near:{},0:{},1:{},2:{},3:{}};for(let gx=-4*st;gx<4*st;gx++)for(let gy=-4*st;gy<4*st;gy++){const z=zoneOf(gx,gy);if(z>3)continue;const k=fn(gx,gy);if(k=='hospR'||k=='milR'||k=='base')continue;N[z][k]=(N[z][k]|0)+1;if(Math.max(Math.abs(gx),Math.abs(gy))<=5)N.near[k]=(N.near[k]|0)+1}return N}
const zTot=o=>Object.values(o).reduce((a,b)=>a+b,0),zAvg=c=>{let a=0,n=0;for(const k in c)if(k!='park'){a+=(TIER[k]||1)*c[k];n+=c[k]}return a/n};
/* ---------- a picture of the city: each block one small square, zone rings drawn ---------- */
function zMap(fn,R,px){const c=document.createElement('canvas'),n=2*R+1;c.width=c.height=n*px;const x=c.getContext('2d');
 for(let gy=-R;gy<=R;gy++)for(let gx=-R;gx<=R;gx++){const k=fn(gx,gy),col=k=='base'?'#fff':(KCOL[k]||'#555');x.fillStyle=col;x.fillRect((gx+R)*px,(gy+R)*px,px-(px>3?1:0),px-(px>3?1:0))}
 x.strokeStyle='#ff9a5a';x.lineWidth=2;for(let z=1;z*zoneStep()<=R;z++){const r=z*zoneStep();x.strokeRect((R-r)*px,(R-r)*px,(2*r)*px,(2*r)*px)}
 x.strokeStyle='#fff';x.lineWidth=1;x.strokeRect((R-5)*px,(R-5)*px,11*px,11*px);return c.toDataURL()}
const zLegend=()=>'<div style="display:flex;flex-wrap:wrap;gap:4px 10px;font-size:10.5px;margin:4px 0">'+ZGRP.flatMap(([,L])=>L).filter(k=>KNAME[k]).map(k=>'<span><i style="display:inline-block;width:9px;height:9px;border-radius:2px;margin-right:3px;background:'+(KCOL[k]||'#555')+'"></i>'+KNAME[k]+'</span>').join('')+'<span>흰 네모 = 거점 5블록 · 주황 = 구역 경계</span></div>';
/* ---------- the sheets ---------- */
function zSheetStr(){const rows=[];for(const z of[0,1,2,3,4,5,6,7,8,9,12,15,20,30]){const t=zType(z,99),P=zProf(z),c={near:'#7fd07f',start:'#7fd07f',calm:'#9ad0f0',rise:'#ffd36a',peak:'#ff6a5a'}[t];
  rows.push('<tr'+(ZPEAK(z)?' style="background:#ff6a5a1c"':'')+'><td><b>'+z+'</b></td><td><b style="color:'+c+'">'+ZTN[t]+'</b></td><td>×'+(+zMulHp(z).toFixed(2))+'<br><small style="color:#888">이전 ×'+(z<=0?1:3*z)+'</small></td><td>×'+zMulAtk(z).toFixed(2)+'<br><small style="color:#888">이전 ×'+(1+.3*z).toFixed(1)+'</small></td><td>×'+(+zMulRaid(z).toFixed(2))+'</td><td>'+Math.round(P.sp*100)+'% · '+Math.round(P.el*100)+'%</td><td>'+(ZPEAK(z)?'<b style="color:#ffd36a">많음</b>':'—')+'</td></tr>')}
 sheet('💀 구역별 강도','끝없이 올라가요 · 3의 배수 구역은 위험 · 희귀',
  '<div style="overflow-x:auto"><table class="cmpT" style="white-space:normal"><tr><th>구역</th><th>종류</th><th>좀비 체력</th><th>좀비 공격</th><th>약탈자<br>체력</th><th>특수 · 정예</th><th>희귀템</th></tr>'+rows.join('')+'</table></div>'+
  '<div class="sub" style="line-height:1.65">· 체력: 0구역 ×1 · 1구역 ×1.4 · 2구역 ×2.4 · <b>3구역 ×3</b> · 4구역 ×3.9 · 5구역 ×4.7 · <b>6구역 ×6</b> · 그 뒤로 끝없이: 3의 배수 구역 = 구역 숫자 배 (9 → ×9 · 30 → ×30) · 사이 두 구역은 +0.9 · +1.7<br>· 공격: 체력이 오른 만큼의 1/3씩 (×3 구역 = 공격 ×1.7 · ×9 구역 = ×3.8) · 체력만큼 올리면 한두 방에 죽어서<br>· 약탈자: 좀비와 같은 체력 배수 · 같은 공격 배수<br>· 위험 구역(3 · 6 · 9 …)은 특수 좀비 +10% · 정예 +8% · 약탈자 기지 · 파밍에 강화석 · 옵션의 룬 · 교환권이 추가로 나와요 (★3 이상 건물은 두 배)<br>· 이전 규칙은 1구역부터 체력 ×3 · ×6 · ×9 (구역 × 3)</div>')}
function zSheetHow(){const st=zoneStep(),D={S:'쉬움',V:'보통',N:'어려움'}[curD()];
 const steps=[
  ['① 바둑판','도시는 끝없는 블록 격자예요. 거점이 (0, 0) 블록이고, 블록마다 좌표 (가로, 세로)가 있어요.'],
  ['② 거리와 구역','거리 = 가로 · 세로 중 큰 쪽 (거점을 둘러싼 네모 고리). 구역 = 거리 ÷ '+st+' (난이도 '+D+' · 보통 12 · 어려움 10 + 1구역부터 시작).'],
  ['③ 구역의 종류 (3구역 한 바퀴)','<b>0구역</b> 시작 동네 · <b>1 · 4 · 7구역</b> 잠잠 (리셋) · <b>2 · 5 · 8구역</b> 위험 증가 · <b>3 · 6 · 9구역</b> 위험 · 희귀. 거점 2블록 안은 늘 안전한 동네.'],
  ['④ 고정 난수','지도 시드 + 블록 좌표로 블록마다 0~1 숫자를 만들어요. 같은 시드면 늘 같은 도시.'],
  ['⑤ 그 구역 종류의 가중치 표에서 하나 뽑기','표마다 건물별 무게가 달라요 (⚖ 구역별 건물 장면). 위험 · 희귀 구역일수록 경찰서 · 총포상 · 군부대 · 연구소 · 교도소 · 병원 · 은행 무게가 커지고 주거 · 공원이 줄어요.'],
  ['⑥ 2블록 건물','병원 · 군부대는 짝수 가로 좌표에서만 뽑히고 오른쪽 블록까지 써요. 오른쪽이 빈터 · 거점 · 약탈자 기지면 다른 건물로.'],
  ['⑦ 그대로 두는 것','거점 · 철거한 빈터(전초기지) · 약탈자 기지(3 · 6 · 9구역 6%)는 표보다 먼저 정해져요.'],
  ['⑧ 구역이 바꾸는 것','좀비 · 약탈자 강도 (💀 구역별 강도) · 건물 구성 (이 표) · 위험 구역의 희귀템.']];
 sheet('🧭 건물이 생기는 방식','블록 하나의 건물이 정해지는 순서 (새 규칙)',steps.map(([h,t])=>'<div style="padding:7px 9px;margin:5px 0;border-radius:10px;background:#ffffff0c;font-size:12.5px;line-height:1.55"><b>'+h+'</b><br>'+t+'</div>').join('')+
  '<div style="margin-top:8px"><b style="font-size:13px">새 규칙 도시 (0~3구역 · 한 칸 = 한 블록)</b>'+zLegend()+'<img src="'+zMap(kindAt,3*st+3,3)+'" style="width:100%;image-rendering:pixelated;border-radius:8px"></div>');}
function zSheetProp(){const A=zCount(OLDK),B=zCount(kindAt),C=['near',0,1,2,3],H=['거점 5블록',...[0,1,2,3].map(z=>z+'구역<br><small>'+ZTN[zType(z,99)]+'</small>')];const st=zoneStep();
 const cell=(a,b,ta,tb)=>{const pa=a/ta*100,pb=b/tb*100,dd=pb-pa;return'<td><small style="color:#aaa">'+pa.toFixed(0)+'%</small> → <b>'+pb.toFixed(0)+'%</b>'+(Math.abs(dd)>=1.5?'<small style="color:'+(dd>0?'#7fd07f':'#ff8a7a')+'"> '+(dd>0?'▲':'▼')+'</small>':'')+'</td>'};
 const rows=ZGRP.map(([g,L])=>'<tr><td style="text-align:left">'+g+'</td>'+C.map(z=>cell(L.reduce((a,k)=>a+(A[z][k]|0),0),L.reduce((a,k)=>a+(B[z][k]|0),0),zTot(A[z]),zTot(B[z]))).join('')+'</tr>').join('');
 const ex=(lbl,f)=>'<tr style="background:#e0b03a22"><td style="text-align:left"><b>'+lbl+'</b></td>'+C.map(z=>'<td><small style="color:#aaa">'+f(A[z])+'</small> → <b>'+f(B[z])+'</b></td>').join('')+'</tr>';
 const gun=c=>ZGUN.reduce((a,k)=>a+(c[k]|0),0);
 const tb='<div style="overflow-x:auto"><table class="cmpT" style="white-space:normal"><tr><th>분류<br><small>이전 → 새 규칙</small></th>'+H.map(h=>'<th>'+h+'</th>').join('')+'</tr>'+rows+ex('평균 위험도',c=>'★'+zAvg(c).toFixed(2))+ex('총 나오는 건물',c=>(gun(c)/zTot(c)*100).toFixed(0)+'%')+ex('약국',c=>((c.pharm|0)/zTot(c)*100).toFixed(1)+'%')+'</table></div>';
 const W=Object.keys(ZTAB.peak),tw='<div style="overflow-x:auto"><table class="cmpT" style="font-size:11px"><tr><th>건물</th>'+Object.keys(ZTN).map(t=>'<th>'+ZTN[t]+'</th>').join('')+'</tr>'+W.map(k=>'<tr><td style="text-align:left">'+(KNAME[k]||k)+' <small>★'+(TIER[k]||1)+'</small></td>'+Object.keys(ZTN).map(t=>{const v=ZTAB[t][k];return'<td>'+(v?v:'—')+'</td>'}).join('')+'</tr>').join('')+'</table></div>';
 sheet('⚖ 구역별 건물 (새 규칙)','이전 규칙 → 새 규칙 · 샘플 지도에 적용됨',tb+'<div style="margin-top:8px;font-weight:bold;font-size:13px">가중치 표 (숫자가 클수록 자주)</div>'+tw+
  '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px"><div><b style="font-size:12px">이전</b><img src="'+zMap(OLDK,3*st+3,2)+'" style="width:100%;image-rendering:pixelated;border-radius:6px"></div><div><b style="font-size:12px">새 규칙</b><img src="'+zMap(kindAt,3*st+3,2)+'" style="width:100%;image-rendering:pixelated;border-radius:6px"></div></div>'+zLegend())}
function zSheetOps(){const O=[
  ['✅ 이번 샘플에 넣은 것',[
   ['구역 강도 곡선','0 ×1 · 1 ×1.4 · 2 ×2.4 · 3 ×3 · 4 ×3.9 · 5 ×4.7 · 6 ×6 · 끝없이 (좀비 · 약탈자) · 💀 구역별 강도'],
   ['구역별 건물 새 규칙','시작 · 잠잠(리셋) · 위험 증가 · 위험 · 희귀 · ⚖ 구역별 건물'],
   ['위험 구역 희귀템','3 · 6 · 9구역 파밍에 강화석 · 옵션의 룬 · 교환권'],
   ['철거 레벨 = 위험도','★1 → Lv1 · ★2 → Lv2 · ★3 이상 → Lv3 (도구가 Lv3까지라서)'],
   ['경보 50%','총포상 · 은행 · 교도소'],
   ['지하철 지하 터널','역 승강장 끝 터널 입구 → 지하 선로 → 다음 역으로 나와요 · 🚇 장면'],
   ['라디오 방송국 콘솔','주변 지도 받기 · 생존자 신호 → 구출 · 📻 장면']]],
  ['💡 남은 의견',[
   ['철거 도구 Lv4 · Lv5','★4 · ★5 건물 (경찰서 · 교도소 · 군부대 · 연구소 · 약탈자 기지) 전용 · 지금은 Lv3으로 부숴요'],
   ['구출한 생존자 → NPC 동료','방송국 신호로 구한 생존자를 거점으로 데려가 동료로'],
   ['지하 터널 노선도','들른 역을 지도에 이어서 빠른 이동 목록으로']]],
  ['📌 미뤘던 것 (차례)',[
   ['거점 꾸미기','가구 · 장식 · 조명 · 기분 / 휴식 보너스'],
   ['NPC 동료','생존자 구출과 연결'],
   ['차량 개조','차량 부품으로 장갑 · 엔진 · 트렁크']]],
  ['⏸ 보류',[['플레이어 그림 교체',''],['탄약 혼자 쓰는 총 5종',''],['헤비 좀비 약점','']]],
  ['🎯 시작 전 목표',[['튜토리얼',''],['엔딩',''],['생존자 의뢰',''],['앱(PWA)',''],['알림 연결 정리','']]]];
 let n=0;sheet('📋 의견 정리','이번에 넣은 것 + 남은 의견 + 할 일',O.map(([h,L])=>'<div style="margin:8px 0 4px;font-weight:bold;font-size:13.5px">'+h+'</div>'+L.map(([t,d])=>'<div style="display:flex;gap:8px;padding:6px 9px;margin:3px 0;border-radius:9px;background:#ffffff0c;font-size:12.5px;line-height:1.5"><b style="color:#e0b03a;min-width:18px">'+(++n)+'</b><div><b>'+t+'</b>'+(d?'<br><span style="color:var(--mut)">'+d+'</span>':'')+'</div></div>').join('')).join(''))}
