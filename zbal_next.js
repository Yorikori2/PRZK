/* PROJECT LEGACY — sample: how the city decides each block, a proposal that changes the mix by zone, and every
   open opinion in one list. Nothing here changes the game's map: propKind() is only used to draw and count. */
'use strict';
/* ---------- proposal: a weight table per zone (the base keeps a safe ring of 2 blocks) ---------- */
const PROPW={
 near:{houses:5,apt:3,park:2,mart:1.2,hard:1,pharm:.5},
 0:{houses:5,apt:3,park:2,mart:1.2,hard:1,pharm:.5,ware:.8,school:1,church:.8,fire:.6,garage:.6,clinic:.4,bank:.3,mall:.3,park2:.4,subway:.3,police:.2},
 1:{houses:4,apt:2.5,park:1.8,mart:1,hard:1,pharm:.6,ware:1,school:1,church:.7,fire:.8,garage:.9,clinic:.7,bank:.6,mall:.7,park2:.7,subway:.7,police:.6,gunshop:.5,radio:.4,hosp:.4,mil:.3,lab:.2,prison:.1},
 2:{houses:3,apt:2.5,park:1.5,mart:.8,hard:.8,pharm:.5,ware:1,school:.8,church:.6,fire:.8,garage:1,clinic:.7,bank:.7,mall:.8,park2:.8,subway:.8,police:.8,gunshop:.7,radio:.5,hosp:.6,mil:.6,lab:.5,prison:.4}};
const PAIR={hosp:'hospR',mil:'milR'};
function propKind(gx,gy){const cur=kindAt(gx,gy);if(cur=='base'||cur=='lot'||cur=='rbase')return cur;const d=Math.max(Math.abs(gx),Math.abs(gy));
 const pick=(gx,gy)=>{const d=Math.max(Math.abs(gx),Math.abs(gy)),zn=zoneOf(gx,gy),W=d<=2?PROPW.near:PROPW[Math.min(2,zn)];let tot=0;for(const k in W)tot+=(PAIR[k]&&(gx&1))?0:W[k];let t=bh(gx,gy,41)*tot;
  for(const k in W){if(PAIR[k]&&(gx&1))continue;t-=W[k];if(t<=0)return k}return'houses'};
 if(gx&1){const L=pick(gx-1,gy);if(PAIR[L])return PAIR[L]}return pick(gx,gy)}
/* ---------- counting ---------- */
const ZGRP=[['🏠 주거',['houses','apt']],['🌳 공원',['park']],['🛒 일상 상점',['mart','hard','pharm','mall']],['🚚 차량 · 물류',['garage','park2','ware','subway']],['🏥 의료',['clinic','hosp']],['🏫 공공',['school','church','fire','bank','radio']],['🔫 무기 · 위험',['gunshop','police','mil','prison','lab','rbase']]];
const ZGUN=['gunshop','police','mil','prison'];
function zCount(fn){const st=zoneStep(),N={near:{},0:{},1:{},2:{}};for(let gx=-3*st;gx<3*st;gx++)for(let gy=-3*st;gy<3*st;gy++){const z=zoneOf(gx,gy);if(z>2)continue;const k=fn(gx,gy);if(k=='hospR'||k=='milR'||k=='base')continue;N[z][k]=(N[z][k]|0)+1;if(Math.max(Math.abs(gx),Math.abs(gy))<=5)N.near[k]=(N.near[k]|0)+1}return N}
const zTot=o=>Object.values(o).reduce((a,b)=>a+b,0),zAvg=c=>{let a=0,n=0;for(const k in c)if(k!='park'){a+=(TIER[k]||1)*c[k];n+=c[k]}return a/n};
/* ---------- a picture of the city: each block one small square, zone rings drawn ---------- */
function zMap(fn,R,px){const c=document.createElement('canvas'),n=2*R+1;c.width=c.height=n*px;const x=c.getContext('2d');
 for(let gy=-R;gy<=R;gy++)for(let gx=-R;gx<=R;gx++){const k=fn(gx,gy),col=k=='base'?'#fff':(KCOL[k]||'#555');x.fillStyle=col;x.fillRect((gx+R)*px,(gy+R)*px,px-(px>3?1:0),px-(px>3?1:0))}
 x.strokeStyle='#ff9a5a';x.lineWidth=2;for(let z=1;z*zoneStep()<=R;z++){const r=z*zoneStep();x.strokeRect((R-r)*px,(R-r)*px,(2*r)*px,(2*r)*px)}
 x.strokeStyle='#fff';x.lineWidth=1;x.strokeRect((R-5)*px,(R-5)*px,11*px,11*px);return c.toDataURL()}
const zLegend=()=>'<div style="display:flex;flex-wrap:wrap;gap:4px 10px;font-size:10.5px;margin:4px 0">'+ZGRP.flatMap(([,L])=>L).filter(k=>KNAME[k]).map(k=>'<span><i style="display:inline-block;width:9px;height:9px;border-radius:2px;margin-right:3px;background:'+(KCOL[k]||'#555')+'"></i>'+KNAME[k]+'</span>').join('')+'<span>흰 네모 = 거점 5블록 · 주황 = 구역 경계</span></div>';
/* ---------- the three sheets ---------- */
function zSheetHow(){const st=zoneStep(),D={S:'쉬움',V:'보통',N:'어려움'}[curD()];
 const steps=[
  ['① 바둑판','도시는 끝없는 블록 격자예요. 블록 하나 = 896×704 땅 + 도로 128. 거점이 (0, 0) 블록이고, 블록마다 좌표 (가로, 세로)가 있어요.'],
  ['② 거리와 구역','거리 = 가로 · 세로 중 큰 쪽 (거점을 둘러싼 네모 고리). 구역 = 거리 ÷ '+st+' (난이도 '+D+' · 보통 12 · 어려움 10 + 1구역부터 시작). 0구역 = 거점에서 '+(st-1)+'블록까지.'],
  ['③ 고정 난수','지도 시드 + 블록 좌표로 블록마다 0~1 사이 숫자를 만들어요. 같은 시드면 몇 번을 가도 같은 건물이에요.'],
  ['④ 기본 건물 뽑기','가중치 표에서 하나를 뽑아요: 주택가 4 · 아파트 2.5 · 공원 2.5 · 학교 1 · 철물점 1 · 물류창고 1 · 편의점 0.8 · 소방서 0.8 · 교회 0.7 · 진료소 0.7 (2블록~) · 경찰서 0.6 (3블록~) · 군부대 0.5 (3블록~ · 2블록 크기) · 연구소 0.4 (4블록~)'],
  ['⑤ 철거한 블록','철거해서 무너뜨린 블록은 빈터(전초기지 자리)로 바뀌고, 그 뒤 단계는 건너뛰어요.'],
  ['⑥ 약탈자 기지','3 · 6 · 9 … 구역에서 블록의 6%를 약탈자 기지로 바꿔요.'],
  ['⑦ 새 건물 1차','다른 난수로 덮어써요: 약국 7% (1블록~) · 정비소 5% (2블록~) · 은행 4% (3블록~) · 총포상 4% (3블록~) → 블록의 약 20%'],
  ['⑧ 새 건물 2차','또 다른 난수로 남은 블록을 덮어써요: 병원 5% (3블록~ · 오른쪽 블록이 비어 있을 때 · 2블록 크기) · 대형 마트 4% · 주차 타워 3% · 지하철역 3% (2블록~) · 교도소 2% (5블록~) · 방송국 2.5% (4블록~) → 남은 블록의 약 16%'],
  ['⑨ 구역이 바꾸는 것','구역이 올라가면 좀비 체력 ×3 · ×6 · ×9, 공격력 +30%씩, 수 최대 ×2, 특수 · 정예 · 보스 좀비가 섞여요. <b>건물 종류는 바꾸지 않아요</b> (거리 조건이 모두 1~5블록 = 0구역 안에서 끝남)']];
 sheet('🧭 건물이 생기는 방식','블록 하나의 건물이 정해지는 순서 (지금 규칙)',steps.map(([h,t])=>'<div style="padding:7px 9px;margin:5px 0;border-radius:10px;background:#ffffff0c;font-size:12.5px;line-height:1.55"><b>'+h+'</b><br>'+t+'</div>').join('')+
  '<div style="margin-top:8px"><b style="font-size:13px">지금 도시 (거점 주변 '+(2*st+1)+'×'+(2*st+1)+'블록 · 한 칸 = 한 블록)</b>'+zLegend()+'<img src="'+zMap(kindAt,st+4,7)+'" style="width:100%;image-rendering:pixelated;border-radius:8px"></div>');}
function zSheetProp(){const A=zCount(kindAt),B=zCount(propKind),C=['near',0,1,2],H=['거점 5블록',...[0,1,2].map(z=>z+'구역')];const st=zoneStep();
 const cell=(a,b,ta,tb)=>{const pa=a/ta*100,pb=b/tb*100,dd=pb-pa;return'<td><small style="color:#aaa">'+pa.toFixed(0)+'%</small> → <b>'+pb.toFixed(0)+'%</b>'+(Math.abs(dd)>=1.5?'<small style="color:'+(dd>0?'#7fd07f':'#ff8a7a')+'"> '+(dd>0?'▲':'▼')+'</small>':'')+'</td>'};
 const rows=ZGRP.map(([g,L])=>'<tr><td style="text-align:left">'+g+'</td>'+C.map(z=>cell(L.reduce((a,k)=>a+(A[z][k]|0),0),L.reduce((a,k)=>a+(B[z][k]|0),0),zTot(A[z]),zTot(B[z]))).join('')+'</tr>').join('');
 const ex=(lbl,f)=>'<tr style="background:#e0b03a22"><td style="text-align:left"><b>'+lbl+'</b></td>'+C.map(z=>'<td><small style="color:#aaa">'+f(A[z])+'</small> → <b>'+f(B[z])+'</b></td>').join('')+'</tr>';
 const gun=c=>ZGUN.reduce((a,k)=>a+(c[k]|0),0);
 const tb='<div style="overflow-x:auto"><table class="cmpT" style="white-space:normal"><tr><th>분류<br><small>지금 → 제안</small></th>'+H.map(h=>'<th>'+h+'</th>').join('')+'</tr>'+rows+ex('평균 위험도',c=>'★'+zAvg(c).toFixed(2))+ex('총이 나오는 건물',c=>gun(c)+'곳')+ex('약국',c=>(c.pharm|0)+'곳')+'</table></div>';
 const rule='<div class="sub" style="line-height:1.65"><b>제안 규칙</b> (가중치 · 구역마다 다른 표)<br>· <b>거점 2블록 안</b>: 주택가 · 아파트 · 공원 · 편의점 · 철물점 · 약국만<br>· <b>0구역</b>: 주거 · 상점 · 학교 · 교회 · 소방서 위주 · 진료소 · 은행 · 대형 마트 · 주차 타워 · 지하철역은 조금 · 경찰서 아주 조금 · <b>총포상 · 군부대 · 연구소 · 교도소 · 병원 · 방송국 없음</b><br>· <b>1구역</b>: 총포상 · 병원 · 방송국 · 군부대가 나오기 시작 · 연구소 · 교도소 드묾<br>· <b>2구역~</b>: 주거가 줄고 큰 건물 · 위험 건물이 늘어요<br>· 약국 가중치를 줄여 약 4%</div>';
 sheet('⚖ 구역별 건물 · 제안안','지금 규칙 → 제안 규칙 비교 (지도는 바뀌지 않아요 · 보기만)',tb+rule+
  '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px"><div><b style="font-size:12px">지금</b><img src="'+zMap(kindAt,2*st+2,3)+'" style="width:100%;image-rendering:pixelated;border-radius:6px"></div><div><b style="font-size:12px">제안</b><img src="'+zMap(propKind,2*st+2,3)+'" style="width:100%;image-rendering:pixelated;border-radius:6px"></div></div>'+zLegend())}
function zSheetOps(){const O=[
  ['⚖ 건물 밸런스',[
   ['구역마다 건물 구성 다르게','지금은 0 · 1 · 2구역 비율과 평균 위험도(★1.9)가 똑같아요 → 바깥으로 갈수록 큰 건물 · 위험 건물이 늘게 (⚖ 제안안 장면)'],
   ['위험 건물은 1구역부터','0구역 블록의 약 12%가 총포상 · 경찰서 · 군부대 · 교도소 · 연구소 · 거점 5블록 안에도 총 나오는 건물 8곳쯤 → 총포상 · 병원 · 방송국은 1구역부터, 연구소 · 교도소는 1구역 드물게 · 2구역부터 본격'],
   ['거점 2블록 안은 안전한 동네','주택가 · 아파트 · 공원 · 편의점 · 철물점 · 약국만 → 첫날 파밍이 편하고 위험 건물은 일부러 찾아가는 곳'],
   ['약국 7% → 4%','일상 상점 중 가장 흔해서 초반 의약품이 넉넉해요'],
   ['새 건물 비율 33% → 25% 안팎','기존 학교 · 교회 · 소방서가 묻히지 않게']]],
  ['🏙 새 건물',[
   ['지하철역 지하 터널','계단을 광산처럼 지하 맵으로 · 역과 역을 잇는 지하 길 = 빠른 이동 · 지하 좀비 무리'],
   ['라디오 방송국 콘솔','상호작용으로 주변 지도 공개 · 생존자 신호 수신 → 생존자 의뢰 · NPC 동료로 연결'],
   ['교도소 · 은행 경보 확률','교도소 35% · 총포상 30% · 은행 25% · 세면 낮추기']]],
  ['📌 미뤘던 것 (차례)',[
   ['거점 꾸미기','가구 · 장식 · 조명을 거점에 놓기 · 기분 / 휴식 보너스'],
   ['NPC 동료','방송국 신호 · 생존자 의뢰로 만나서 함께 다니기 · 거점 일 맡기기'],
   ['차량 개조','정비소 · 주차 타워의 차량 부품으로 장갑 · 엔진 · 트렁크 개조']]],
  ['⏸ 보류',[['플레이어 그림 교체',''],['탄약 혼자 쓰는 총 5종',''],['헤비 좀비 약점','']]],
  ['🎯 시작 전 목표',[['튜토리얼',''],['엔딩',''],['생존자 의뢰',''],['앱(PWA)',''],['알림 연결 정리','']]]];
 let n=0;sheet('📋 의견 정리','밸런스 의견 + 일반 의견 + 남은 할 일 한곳에',O.map(([h,L])=>'<div style="margin:8px 0 4px;font-weight:bold;font-size:13.5px">'+h+'</div>'+L.map(([t,d])=>'<div style="display:flex;gap:8px;padding:6px 9px;margin:3px 0;border-radius:9px;background:#ffffff0c;font-size:12.5px;line-height:1.5"><b style="color:#e0b03a;min-width:18px">'+(++n)+'</b><div><b>'+t+'</b>'+(d?'<br><span style="color:var(--mut)">'+d+'</span>':'')+'</div></div>').join('')).join(''))}
