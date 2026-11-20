/* PROJECT LEGACY — stage 4 gun data: 71 fictional firearms with procedural 40x20 icons.
   Data only (registration lives in stage4.js); GC renamed GCOL because the game owns GC (grid cell size). */
'use strict';
const CAL={'9mm':'9×19mm','45':'.45 ACP','38':'.38 스페셜','357':'.357 매그넘','50ae':'.50 대구경','500':'.500 매그넘','57':'5.7×28mm','46':'4.6×30mm','12g':'12게이지','556':'5.56×45mm','545':'5.45×39mm','762s':'7.62×39mm','308':'7.62×51mm','762r':'7.62×54mmR','338':'.338 매그넘','50bmg':'.50 BMG','40mm':'40mm 유탄','rocket':'로켓','fuel':'연료','arrow':'화살','bolt':'석궁 볼트','taser':'전기충격 카트리지','flare':'신호탄','nail':'못'};
/* id, 이름, 분류, 등급, 탄, 제조국, 성능{d,rps,r,mag,nz,wt,...}, 설명, 획득처, 아이콘 */
const GUNS=[
 ['glock17','아르모 P17','권총','c','9mm','오스트리아',{d:26,rps:3.2,r:240,mag:17,nz:3,wt:.9},'가볍고 믿음직한 경찰 표준 권총','경찰서',{t:'pistol',L:15}],
 ['glock19','아르모 P19 컴팩트','권총','c','9mm','오스트리아',{d:25,rps:3.3,r:220,mag:15,nz:3,wt:.85},'휴대하기 좋은 소형 모델','경찰서 · 주택',{t:'pistol',L:13}],
 ['glock18','아르모 P18 오토','권총','r','9mm','오스트리아',{d:24,rps:16,r:200,mag:33,nz:4,wt:1},'완전 자동 · 33발 롱 탄창','경찰 특공 사물함',{t:'pistol',L:15,mag:'long'}],
 ['m9','벨라토 M92','권총','c','9mm','이탈리아',{d:27,rps:3,r:250,mag:15,nz:3,wt:.95},'미군 제식 권총','군부대',{t:'pistol',L:17,open:1}],
 ['b93r','벨라토 R93 버스트','권총','r','9mm','이탈리아',{d:24,rps:11,r:210,mag:20,nz:4,wt:1.1,burst:3},'3점사 기관권총 · 앞 손잡이','군부대',{t:'pistol',L:18,mag:'long',fg:1,open:1}],
 ['k5','한무 HP-5','권총','c','9mm','대한민국',{d:27,rps:3.2,r:240,mag:13,nz:3,wt:.8},'국군 제식 권총','군부대',{t:'pistol',L:15}],
 ['m1911','콜드웰 45 클래식','권총','u','45','미국',{d:38,rps:2.6,r:240,mag:7,nz:4,wt:1.1},'한 발이 묵직한 고전 명작','주택 · 교회',{t:'pistol',L:16,c:'steel',wg:1}],
 ['p226','슈바르츠 P26','권총','u','9mm','스위스·독일',{d:28,rps:3.1,r:250,mag:15,nz:3,wt:.96},'정확도가 높은 특수부대 권총','경찰 특공',{t:'pistol',L:16}],
 ['usp45','슈타인 UTP .45','권총','u','45','독일',{d:36,rps:2.7,r:250,mag:12,nz:4,wt:.9},'소음기를 달기 좋은 나사산 총열','군부대',{t:'pistol',L:16,thr:1}],
 ['fn57','노르덴 F57','권총','r','57','벨기에',{d:26,rps:3.4,r:270,mag:20,nz:3,wt:.75,pierce:2},'방탄 관통 · 20발','연구소 경비실',{t:'pistol',L:17,c:'tan'}],
 ['deagle','그리폰 .50','권총','e','50ae','이스라엘·미국',{d:78,rps:1.4,r:290,mag:7,nz:5,wt:2,pierce:2},'초대형 권총 · 반동 매우 큼','군부대 (희귀)',{t:'deagle',L:18,c:'silver'}],
 ['m10','콜드웰 C10 리볼버','권총','c','38','미국',{d:30,rps:2,r:220,mag:6,nz:4,wt:.9},'구형 경찰 리볼버 · 고장 없음','경찰서',{t:'revolver',L:11,c:'steel'}],
 ['python','콜드웰 바이퍼 .357','권총','u','357','미국',{d:48,rps:1.8,r:260,mag:6,nz:4,wt:1.2},'정밀한 매그넘 리볼버','주택 · 경찰서',{t:'revolver',L:15,c:'silver',rib:1}],
 ['m500','타이탄 .500 리볼버','권총','e','500','미국',{d:110,rps:1,r:280,mag:5,nz:5,wt:2.3,pierce:3},'세계 최강급 리볼버','사냥꾼 집 (희귀)',{t:'revolver',L:17,c:'silver',big:1}],
 ['mp5','슈타인 MK5','기관단총','u','9mm','독일',{d:22,rps:13,r:220,mag:30,nz:4,wt:2.6},'경찰 특공대 표준 · 정확한 연사','경찰 특공 · 군부대',{t:'smg',L:20,mag:'curv',st:'ret'}],
 ['mp5sd','슈타인 MK5-S','기관단총','r','9mm','독일',{d:20,rps:12,r:210,mag:30,nz:1,wt:2.9},'일체형 소음기 · 거의 무소음','군부대 · 연구소',{t:'smg',L:20,mag:'curv',st:'ret',sup:1}],
 ['k7','한무 HS-7','기관단총','r','9mm','대한민국',{d:21,rps:13,r:210,mag:30,nz:1,wt:3.3},'국산 일체형 소음 기관단총 · 특수부대용','군부대',{t:'smg',L:21,mag:'curv',st:'fold',sup:1}],
 ['ump45','슈타인 UMK .45','기관단총','u','45','독일',{d:30,rps:10,r:220,mag:25,nz:4,wt:2.3},'느리지만 강한 .45 연사','경찰 특공',{t:'smg',L:20,mag:'str',st:'fold',box:1}],
 ['p90','노르덴 PDW-50','기관단총','e','57','벨기에',{d:22,rps:15,r:240,mag:50,nz:4,wt:2.6,pierce:2},'상단 50발 탄창 · 관통','연구소 · 군부대',{t:'p90'}],
 ['uzi','사브라 SMG','기관단총','u','9mm','이스라엘',{d:22,rps:10,r:190,mag:32,nz:4,wt:3.5},'손잡이 탄창 · 단순한 구조','주택 · 범죄 은신처',{t:'smg',L:16,mag:'grip',st:'fold'}],
 ['mac10','스톰 S10','기관단총','u','45','미국',{d:24,rps:18,r:160,mag:30,nz:5,wt:2.8},'엄청난 연사 · 반동 큼','주택 · 주차장',{t:'smg',L:12,mag:'grip',st:'none',box:1}],
 ['mp7','슈타인 PD7','기관단총','e','46','독일',{d:22,rps:16,r:230,mag:40,nz:3,wt:1.9,pierce:2},'소형 관통 PDW','군부대',{t:'smg',L:16,mag:'grip',st:'ret',fg:1}],
 ['vector','와이번 .45','기관단총','e','45','미국',{d:28,rps:20,r:200,mag:25,nz:4,wt:2.7},'반동 억제 · 초고속 연사','연구소 경비실',{t:'smg',L:18,mag:'long',st:'fold',box:1,fg:1}],
 ['tommy','캐피톨 1928','기관단총','r','45','미국',{d:30,rps:11,r:210,mag:30,nz:5,wt:4.8},'나무 개머리판의 고전 기관단총','교회 다락 · 주택',{t:'smg',L:22,c:'steel',w:1,mag:'str',st:'wood'}],
 ['r870','헌츠맨 P870','산탄총','c','12g','미국',{d:14,rps:1.2,r:170,mag:6,nz:5,wt:3.6,pel:6},'가장 흔한 펌프 액션','경찰서 · 주택',{t:'shotgun',L:26,w:1}],
 ['m590','마운틴 590','산탄총','c','12g','미국',{d:14,rps:1.2,r:170,mag:8,nz:5,wt:3.4,pel:6},'튼튼한 군경용 펌프 산탄총','주택 · 철물점',{t:'shotgun',L:25}],
 ['benelli','벨라토 S4 오토','산탄총','r','12g','이탈리아',{d:14,rps:3,r:180,mag:7,nz:5,wt:3.8,pel:6},'빠른 반자동 산탄','군부대',{t:'shotgun',L:25,semi:1}],
 ['saiga','볼코프 S-12','산탄총','e','12g','러시아',{d:14,rps:3.5,r:170,mag:10,nz:5,wt:3.6,pel:6},'탄창식 반자동 · 빠른 재장전','범죄 은신처',{t:'ak',L:24,mag:'box'}],
 ['aa12','해머헤드 FA-12','산탄총','l','12g','미국',{d:13,rps:5,r:160,mag:20,nz:5,wt:5.2,pel:6},'완전 자동 산탄 · 20발 드럼','군부대 무기고 (전설)',{t:'smg',L:24,mag:'drum',st:'fix',box:1}],
 ['dbl','더블배럴','산탄총','c','12g','이탈리아',{d:14,rps:4,r:150,mag:2,nz:5,wt:3.2,pel:8},'2연발 · 긴 재장전','주택 · 교회',{t:'dbarrel',L:26,c:'steel',w:1}],
 ['sawn','소드오프','산탄총','u','12g','미국',{d:12,rps:4,r:110,mag:2,nz:5,wt:2,pel:9},'짧게 자른 총열 · 근거리 최강','주택 · 범죄 은신처',{t:'dbarrel',L:14,c:'steel',w:1,short:1}],
 ['ksg','트윈튜브 TS-14','산탄총','r','12g','미국',{d:14,rps:1.3,r:170,mag:14,nz:5,wt:3.1,pel:6},'튜브 2개 · 14발 불펍 산탄','경찰 특공',{t:'bullpup',L:24,tube:1}],
 ['m16a4','리버티 R16A4','소총','u','556','미국',{d:32,rps:11,r:340,mag:30,nz:4,wt:3.6,burst:3},'3점사 · 긴 총열','군부대',{t:'rifle',L:30,mag:'curv',st:'fix',ch:1}],
 ['m4a1','리버티 C4 카빈','소총','r','556','미국',{d:31,rps:13,r:310,mag:30,nz:4,wt:3.1},'짧고 다루기 쉬운 카빈','군부대 · 경찰 특공',{t:'rifle',L:24,mag:'curv',st:'ret',rail:1}],
 ['k2','한무 HR-2','소총','u','556','대한민국',{d:32,rps:12,r:330,mag:30,nz:4,wt:3.3},'국군 제식 소총 · 접이식 개머리판','군부대',{t:'rifle',L:28,mag:'curv',st:'fold',ribs:1}],
 ['k1a','한무 HC-1','소총','u','556','대한민국',{d:29,rps:13,r:280,mag:30,nz:4,wt:2.9},'특전사용 단축형 · 신축 개머리판','군부대',{t:'rifle',L:22,mag:'curv',st:'ret',ribs:1}],
 ['ak47','볼코프 VK-47','소총','u','762s','소련',{d:38,rps:10,r:300,mag:30,nz:5,wt:4.3},'고장 없는 고위력 소총','범죄 은신처 · 군부대',{t:'ak',L:28,w:1,mag:'curv'}],
 ['ak74','볼코프 VK-74','소총','u','545','소련',{d:30,rps:11,r:310,mag:30,nz:4,wt:3.6},'반동이 적은 소구경 VK','군부대',{t:'ak',L:28,plum:1,mag:'curv'}],
 ['hk416','슈타인 SR-41','소총','e','556','독일',{d:33,rps:13,r:330,mag:30,nz:4,wt:3.5},'신뢰성 최고급 특수부대 소총','군부대 무기고',{t:'rifle',L:26,c:'tan',mag:'curv',st:'ret',rail:1}],
 ['scarh','노르덴 BR-17','소총','e','308','벨기에',{d:46,rps:10,r:380,mag:20,nz:5,wt:3.9},'고위력 7.62mm 전투소총','군부대 무기고',{t:'rifle',L:28,c:'tan',mag:'str',st:'fold',rail:1,tall:1}],
 ['g36c','슈타인 SK36 컴팩트','소총','r','556','독일',{d:30,rps:12,r:290,mag:30,nz:4,wt:2.8},'가벼운 단축 소총 · 투명 탄창','경찰 특공',{t:'rifle',L:22,mag:'clear',st:'fold',ch:1}],
 ['famas','클레롱 F25','소총','r','556','프랑스',{d:29,rps:16,r:300,mag:25,nz:4,wt:3.6},'불펍 · 매우 빠른 연사','군부대',{t:'bullpup',L:26,ch:1}],
 ['aug','알펜 A3 불펍','소총','r','556','오스트리아',{d:31,rps:12,r:320,mag:30,nz:4,wt:3.6},'불펍 · 일체형 조준경','군부대',{t:'bullpup',L:26,c:'olive',sc:1}],
 ['m14','리버티 R14 마크스맨','소총','e','308','미국',{d:52,rps:5,r:420,mag:20,nz:5,wt:5.1},'고정밀 반자동 전투소총','군부대',{t:'rifle',L:32,mag:'str',st:'ret',sc:2,rail:1}],
 ['sks','볼코프 VKS','소총','c','762s','소련',{d:36,rps:3,r:340,mag:10,nz:5,wt:3.9},'나무 개머리판 반자동 · 흔함','주택 · 사냥꾼 집',{t:'sks',L:30,c:'steel',w:1}],
 ['mini14','랜처 미니 카빈','소총','u','556','미국',{d:30,rps:4,r:320,mag:20,nz:4,wt:3.1},'목장 소총 · 반자동','주택 · 교회',{t:'sks',L:28,c:'steel',w:1,mag:'str'}],
 ['r700','헌츠맨 B700','저격','u','308','미국',{d:95,rps:.8,r:460,mag:4,nz:5,wt:3.6,pierce:2},'볼트액션 사냥용 소총','주택 · 교회 · 사냥꾼 집',{t:'sniper',L:32,c:'steel',w:1,sc:2}],
 ['mosin','볼코프 M91 볼트액션','저격','u','762r','러시아',{d:100,rps:.7,r:470,mag:5,nz:5,wt:4,pierce:2},'오래된 볼트액션 · 강력','교회 다락',{t:'sniper',L:36,c:'steel',w:1}],
 ['m24','리버티 S24','저격','e','308','미국',{d:110,rps:.8,r:520,mag:5,nz:5,wt:5.4,pierce:3},'미군 저격수 소총','군부대',{t:'sniper',L:34,c:'olive',sc:2,bp:1}],
 ['k14','한무 HSR-14','저격','e','308','대한민국',{d:112,rps:.8,r:530,mag:5,nz:5,wt:5.5,pierce:3},'국산 저격소총 · 조절식 개머리판','군부대',{t:'sniper',L:34,sc:2,bp:1,adj:1}],
 ['svd','볼코프 DM-10','저격','e','762r','소련',{d:75,rps:2,r:480,mag:10,nz:5,wt:4.3,pierce:2},'반자동 지정사수 소총','군부대',{t:'svd',L:34,w:1,sc:2}],
 ['m110','리버티 S110','저격','e','308','미국',{d:70,rps:2.2,r:470,mag:20,nz:5,wt:6.9,pierce:2},'반자동 저격 · 20발','군부대 무기고',{t:'rifle',L:32,c:'tan',mag:'str',st:'fix',sc:2,bp:1}],
 ['awm','노스우드 L338','저격','l','338','영국',{d:180,rps:.6,r:600,mag:5,nz:5,wt:6.5,pierce:5},'.338 탄 · 초장거리','군부대 무기고 (전설)',{t:'sniper',L:36,c:'olive',sc:3,bp:1,thumb:1}],
 ['m82','타이탄 .50 대물','저격','l','50bmg','미국',{d:260,rps:1,r:640,mag:10,nz:5,wt:13,pierce:6},'.50 대물 저격 · 장갑 관통','군부대 무기고 (전설)',{t:'amr',L:38,sc:3,bp:1}],
 ['m249','리버티 LM-249','기관총','e','556','미국',{d:30,rps:13,r:320,mag:200,nz:5,wt:7.5},'200발 벨트 · 분대 지원','군부대',{t:'lmg',L:30,bp:1}],
 ['k3','한무 HM-3','기관총','e','556','대한민국',{d:30,rps:13,r:320,mag:200,nz:5,wt:6.9},'국산 분대 지원 화기','군부대',{t:'lmg',L:30,bp:1,ch:1}],
 ['m60','리버티 GP60','기관총','l','308','미국',{d:44,rps:9,r:380,mag:100,nz:5,wt:10.5},'7.62mm 다목적 기관총','군부대 무기고 (전설)',{t:'lmg',L:34,bp:1}],
 ['pkm','볼코프 VKM','기관총','e','762r','소련',{d:42,rps:11,r:360,mag:100,nz:5,wt:7.5},'튼튼한 7.62mm 기관총','범죄 은신처 · 군부대',{t:'lmg',L:32,w:1,bp:1}],
 ['m134','로터리 미니건','기관총','l','308','미국',{d:24,rps:40,r:320,mag:500,nz:5,wt:18},'회전 후 초고속 연사 · 이동 매우 느림','헬기 잔해 (전설)',{t:'minigun'}],
 ['m79','리버티 GL-79','발사기','r','40mm','미국',{d:140,rps:.5,r:300,mag:1,nz:5,wt:2.7,aoe:80},'단발 유탄 발사기','군부대',{t:'gl1',w:1,c:'olive'}],
 ['k201','한무 HGL-201','발사기','e','40mm','대한민국',{d:140,rps:.5,r:300,mag:1,nz:5,wt:1.4,aoe:80},'소총 장착형 유탄 발사기 (하부 파츠 겸용)','군부대',{t:'gl1',ub:1}],
 ['m32','사바나 6연발 유탄','발사기','l','40mm','남아공',{d:140,rps:1.2,r:300,mag:6,nz:5,wt:5.3,aoe:80},'6연발 회전식 유탄 발사기','군부대 무기고 (전설)',{t:'mgl',c:'olive'}],
 ['rpg7','볼코프 RL-7','발사기','l','rocket','소련',{d:400,rps:.25,r:420,mag:1,nz:5,wt:7,aoe:120},'대전차 로켓 · 보스용','군부대 · 연구소 (전설)',{t:'rpg',w:1,c:'olive'}],
 ['law','리버티 경량 로켓','발사기','e','rocket','미국',{d:350,rps:1,r:380,mag:1,nz:5,wt:2.5,aoe:110},'1회용 로켓 발사기','군부대',{t:'law',c:'olive'}],
 ['flamer','화염방사기','발사기','l','fuel','미국',{d:8,rps:20,r:110,mag:60,nz:3,wt:20},'화염 범위 피해 · 불붙음','연구소 · 소방서 (전설)',{t:'flamer',c:'olive'}],
 ['xbow','석궁','특수','u','bolt','-',{d:70,rps:1,r:300,mag:1,nz:0,wt:2.8},'무소음 · 볼트 회수','철물점 · 교회',{t:'xbow',w:1}],
 ['cbow','컴파운드 활','특수','u','arrow','-',{d:55,rps:1.1,r:280,mag:1,nz:0,wt:1.6},'무소음 · 화살 회수 · 제작 가능','교회 · 주택',{t:'bow'}],
 ['rbow','리커브 활','특수','c','arrow','-',{d:40,rps:1.2,r:240,mag:1,nz:0,wt:1},'가볍고 조용함','학교 양궁부',{t:'bow',recurve:1}],
 ['x26','전기충격총','특수','u','taser','미국',{d:5,rps:1,r:90,mag:1,nz:1,wt:.2},'3초 기절 · 연쇄 감전','경찰서',{t:'taser'}],
 ['flareg','신호탄 총','특수','u','flare','-',{d:20,rps:.8,r:240,mag:1,nz:2,wt:.8},'불 붙임 · 좀비 유인 · 조명','소방서 · 주유소',{t:'flare'}],
 ['nailg','네일건','특수','c','nail','-',{d:16,rps:5,r:120,mag:40,nz:1,wt:2.2},'조용한 연사 · 못 제작 가능','철물점',{t:'nail'}],
];
const GINFO={},GSPEC={};
const SUBCLASS={권총:'pistol',기관단총:'smg',산탄총:'shotgun',소총:'rifle',저격:'sniper',기관총:'lmg',특수:'bow'};
/* ---------- procedural gun icons (40x20, muzzle on the left) ---------- */
const GCOL={blk:['#26292d','#4f565e'],tan:['#8a7a5a','#a8986a'],olive:['#4a5434','#5a6440'],steel:['#5a6068','#8a9096'],silver:['#b9bec3','#e8ecef'],plum:['#6a3a2a','#8a4a32']},WD=['#8a5a33','#b07a45','#5e3e26'];
function gbox(x,y,w,h,c){R(c[0],x,y,w,h);R(c[1],x,y,w,1)}
function gstock(st,x,y,c,w){if(st=='none')return;if(st=='wood'||w){R(WD[0],x,y,10,5);R(WD[1],x,y,10,1);R(WD[2],x+2,y+5,8,2);R(WD[2],x+9,y,1,7);return}
 if(st=='ret'){R(c[0],x,y+1,6,2);gbox(x+5,y,4,6,c);R(c[0],x+8,y,1,7)}else if(st=='fold'){R(c[0],x,y+1,8,1);R(c[0],x,y+5,7,1);R(c[0],x+7,y+1,2,6)}else if(st=='fix'){gbox(x,y,9,5,c);R(c[0],x+3,y+5,6,2);R(c[0],x+8,y,1,7)}else gbox(x,y,8,6,c)}
function gmag(m,x,y,c){if(m=='curv'){for(let i=0;i<7;i++)R(c[0],x+Math.round(i*.4),y+i,4,1);R(c[1],x,y,4,1)}else if(m=='str'){gbox(x,y,3,6,c)}else if(m=='clear'){for(let i=0;i<7;i++)R('#9fc4d4aa',x+Math.round(i*.4),y+i,4,1);R('#c9a46a',x+1,y+1,1,5)}else if(m=='box'){gbox(x,y,4,5,c)}else if(m=='long'){gbox(x,y,3,9,c)}else if(m=='drum'){blob(x+2,y+4,4,4,c[0]);blob(x+2,y+4,2,2,c[1])}}
function gscope(sc,x,y){if(!sc)return;if(sc==1){R('#1e2124',x,y,6,3);R('#4a9ae0',x+1,y+1,2,1);return}const L=sc==3?16:12;R('#1e2124',x,y,L,3);R('#3a3f45',x,y,L,1);R('#1e2124',x-1,y-1,3,5);R('#1e2124',x+L-2,y-1,3,5);R('#7fb8e0',x-1,y,1,3);R('#1e2124',x+3,y+3,1,2);R('#1e2124',x+L-5,y+3,1,2)}
const GDRAW={
 pistol:(s,c)=>{const L=s.L,x0=27-L;gbox(x0,5,L+1,4,c);if(s.open){R('#8a9096',x0+3,5,L-7,1)}if(s.thr)R(c[0],x0-2,6,2,2);R(c[0],x0+3,9,L-2,2);R(s.wg?WD[0]:c[0],22,10,5,8);R(s.wg?WD[1]:c[1],22,10,5,1);R(c[0],21,12,1,6);R(c[0],18,10,1,3);R(c[0],18,12,4,1);if(s.mag=='long')gbox(22,17,4,3,c);if(s.fg)R(c[0],x0+2,11,2,4)},
 deagle:(s,c)=>{const x0=8;R(c[0],x0,4,20,6);R(c[1],x0,4,20,1);R(c[1],x0,5,4,1);R('#5a6068',x0+14,5,5,4);R('#1e2124',x0+5,10,16,2);R('#1e2124',22,10,6,9);R('#3a3f45',22,10,6,1);R('#1e2124',18,11,4,1)},
 revolver:(s,c)=>{const L=s.L,x0=21-L;gbox(x0,6,L,s.big?4:3,c);if(s.rib)R(c[1],x0,5,L,1);gbox(21,5,6,6,c);R(c[0],22,6,1,4);R(c[0],24,6,1,4);R(c[0],27,5,3,5);R('#1e2124',29,3,2,2);R(WD[0],26,10,5,8);R(WD[1],26,10,5,1);R(WD[2],26,16,5,2);R(c[0],22,11,3,2)},
 smg:(s,c)=>{const L=s.L,x2=30,x1=x2-L+6;if(s.sup){gbox(x1-8,5,10,5,c);R('#2a2f35',x1-7,7,8,1)}else R(c[0],x1-4,7,4,2);gbox(x1,5,x2-x1,s.box?7:5,c);if(!s.box)for(let x=x1+2;x<x2;x+=3)R(c[1],x,6,1,3);
  R(c[0],x2-5,10,3,6);if(s.mag=='grip'){R(c[0],x2-5,16,3,3)}else gmag(s.mag,x1+3,s.box?12:10,c);if(s.fg)R(c[0],x1+1,10,2,5);gstock(s.st,x2,5,c,s.w)},
 p90:(s,c)=>{blob(19,9,11,4,c[0]);R(c[1],9,5,20,1);R('#9fc4d4',11,5,14,2);R('#c9a46a',12,6,12,1);R(c[0],6,8,4,2);R('#0f1418',14,10,4,3);R(c[0],18,12,4,5)},
 rifle:(s,c)=>{const L=s.L,xs=30-L;R(c[0],xs,7,6,2);if(!s.rail&&!s.ch)R(c[0],xs+5,3,1,4);gbox(xs+5,s.tall?4:5,18-(xs+5),5,c);if(s.ribs)for(let x=xs+7;x<18;x+=2)R(c[1],x,6,1,3);gbox(18,s.tall?3:4,12,s.tall?8:7,c);
  if(s.rail)for(let x=xs+6;x<30;x+=2)R(c[1],x,s.tall?2:3,1,1);if(s.ch){R(c[0],20,1,8,1);R(c[0],20,1,1,3);R(c[0],27,1,1,3)}gmag(s.mag,19,11,c);R(c[0],25,11,3,5);gstock(s.st,30,4,c,s.w);gscope(s.sc,19,0)},
 ak:(s,c)=>{const L=s.L,xs=30-L,f=s.plum?GCOL.plum:s.w?[WD[0],WD[1]]:c;R(c[0],xs,7,8,2);R(c[0],xs+2,4,1,3);R(c[0],xs+8,5,10,1);gbox(xs+8,6,18-(xs+8),4,f);gbox(18,5,12,6,c);R(c[1],20,4,8,1);gmag(s.mag,20,11,c);R(c[0],26,11,3,5);
  if(s.w||s.plum){R(f[0],30,6,9,4);R(f[1],30,6,9,1);R(f[0],34,10,5,3)}else gstock('fold',30,5,c)},
 bullpup:(s,c)=>{const L=s.L;R(c[0],34-L,7,4,2);gbox(38-L,5,L-2,7,c);R(c[0],15,12,3,5);if(s.tube){R(c[0],38-L,12,16,2);R(c[1],38-L,12,16,1)}else gmag('str',24,12,c);if(s.ch){R(c[0],14,2,18,1);R(c[0],14,2,1,3);R(c[0],31,2,1,3)}if(s.sc){R('#1e2124',16,1,8,4);R('#7fb8e0',16,2,1,2)}R(c[1],35,5,1,7)},
 shotgun:(s,c)=>{const L=s.L,xs=30-L;R('#3a3f45',xs,6,24-xs+2,2);R('#5a6068',xs,6,24-xs+2,1);R('#2a2f35',xs+4,8,24-xs-2,2);if(!s.semi){R(s.w?WD[0]:c[0],xs+8,8,8,4);R(s.w?WD[1]:c[1],xs+8,8,8,1)}gbox(24,5,6,6,c);R(c[0],26,11,2,3);gstock(s.semi?'fix':'wood',30,5,c,s.w)},
 dbarrel:(s,c)=>{const L=s.L,xs=26-L;gbox(xs,5,L,2,c);gbox(xs,7,L,2,c);R(WD[0],xs+L-8,9,6,2);gbox(26,5,4,5,c);R(c[0],27,10,2,3);if(s.short){R(WD[0],30,6,4,6);R(WD[2],30,10,4,2)}else{R(WD[0],30,6,9,4);R(WD[1],30,6,9,1);R(WD[2],32,10,7,3)}},
 sks:(s,c)=>{const L=s.L,xs=30-L;R(c[0],xs,6,10,2);R(WD[0],xs+8,8,31-xs-8,3);R(WD[1],xs+8,8,31-xs-8,1);gbox(18,5,8,3,c);if(s.mag=='str')gmag('str',20,11,c);R(WD[0],26,8,13,4);R(WD[2],30,12,9,2);R(c[0],24,11,2,2)},
 sniper:(s,c)=>{const L=s.L,xs=36-L;R('#3a3f45',xs,7,20-xs,2);R('#5a6068',xs,7,20-xs,1);const f=s.w?[WD[0],WD[1]]:c;R(f[0],18,7,21,4);R(f[1],18,7,21,1);R(f[0],28,11,4,4);R(f[0],33,11,6,3);if(s.thumb)R('#0f1418',29,11,3,2);if(s.adj)R(c[0],33,5,5,2);R('#1e2124',24,9,1,3);R('#8a9096',23,11,2,1);gscope(s.sc,19,3);if(s.bp){ln(16,10,13,17,'#1e2124');ln(17,10,20,17,'#1e2124')}},
 svd:(s,c)=>{const L=s.L,xs=36-L;R('#3a3f45',xs,7,18-xs,2);R(WD[0],xs+6,6,18-(xs+6),4);R(WD[1],xs+6,6,18-(xs+6),1);gbox(18,5,10,5,c);gmag('curv',20,10,c);R(WD[0],28,6,2,6);R(WD[0],30,5,9,2);R(WD[0],30,10,9,2);R(WD[0],37,5,2,7);gscope(2,18,1)},
 amr:(s,c)=>{R('#1e2124',0,5,5,6);R('#5a6068',1,5,1,6);R('#3a3f45',4,7,10,3);gbox(14,4,20,8,c);gmag('box',22,12,c);R(c[0],29,12,3,4);gbox(34,5,5,7,c);gscope(3,15,0);ln(12,10,9,18,'#1e2124');ln(13,10,16,18,'#1e2124')},
 lmg:(s,c)=>{const L=s.L,xs=30-L;R('#3a3f45',xs,7,16-xs,2);R(c[0],xs+3,6,10,1);for(let x=xs+4;x<16;x+=2)R(c[1],x,6,1,1);gbox(16,4,14,7,c);if(s.ch){R(c[0],19,1,8,1);R(c[0],19,1,1,3);R(c[0],26,1,1,3)}gbox(18,11,7,6,GCOL.olive);R('#c9a46a',17,10,2,3);R(c[0],26,11,3,5);gstock(s.w?'wood':'fix',30,4,c,s.w);if(s.bp){ln(xs+4,9,xs+1,17,'#1e2124');ln(xs+5,9,xs+8,17,'#1e2124')}},
 minigun:(s,c)=>{for(let i=0;i<4;i++)R(i%2?'#5a6068':'#3a3f45',0,5+i*2,20,2);R('#1e2124',0,4,2,9);R('#1e2124',10,4,2,9);gbox(20,3,12,10,c);R(c[0],24,0,6,3);R('#8a9096',25,0,4,1);gbox(23,13,6,5,GCOL.olive);R('#c9a46a',29,14,6,1)},
 gl1:(s,c)=>{if(s.ub){gbox(8,7,16,6,c);R(c[0],22,13,3,5);R('#5a6068',8,8,2,4);return}gbox(6,5,18,7,c);R('#1e2124',6,6,2,5);R(c[0],18,12,3,4);R(WD[0],24,6,15,5);R(WD[1],24,6,15,1);R(WD[2],30,11,9,3)},
 mgl:(s,c)=>{gbox(4,6,12,5,c);blob(21,9,6,6,'#1e2124');blob(21,9,5,5,c[0]);for(let a=0;a<6.28;a+=1.05)R('#1e2124',21+Math.cos(a)*3,9+Math.sin(a)*3,2,2);R(c[0],27,6,10,2);R(c[0],27,11,8,2);R(c[0],35,6,2,7);R('#1e2124',10,11,3,5)},
 rpg:(s,c)=>{blob(4,9,4,5,'#1e2124');blob(4,9,3,4,'#5a6440');R('#1e2124',7,7,32,5);R(c[0],8,8,30,3);R(c[1],8,8,30,1);R(WD[0],16,7,10,5);R('#1e2124',20,12,2,5);R('#1e2124',27,12,2,5);R('#1e2124',36,6,3,7)},
 law:(s,c)=>{gbox(3,6,33,6,c);R('#1e2124',2,6,2,6);R('#1e2124',35,6,2,6);R('#e0b03a',12,7,8,1);R('#1e2124',22,12,2,4)},
 flamer:(s,c)=>{R('#3a3f45',0,7,20,3);R('#e05050',0,7,2,3);R('#1e2124',6,10,2,4);gbox(18,5,12,7,c);R('#c43c32',20,12,8,6);R('#e05a50',20,12,8,1);R('#1e2124',28,8,3,7)},
 xbow:(s,c)=>{ln(10,1,6,9,'#1e2124');ln(6,10,10,18,'#1e2124');ln(10,1,18,9,'#c9c0a0');ln(10,18,18,10,'#c9c0a0');R(WD[0],6,9,32,3);R(WD[1],6,9,32,1);R('#8a9096',2,9,6,1);R(WD[2],22,12,3,4)},
 bow:(s,c)=>{const r=s.recurve;ln(22,0,16,6,'#1e2124');ln(16,6,16,13,'#1e2124');ln(16,13,22,19,'#1e2124');if(r){R('#1e2124',22,0,2,1);R('#1e2124',22,19,2,1)}else{blob(21,1,2,2,'#8a9096');blob(21,18,2,2,'#8a9096')}ln(22,1,22,18,'#c9c0a0');R(WD[0],2,9,34,1);R('#c9ced3',1,8,3,3);R('#c94f3a',34,8,4,3);R('#1e2124',15,8,3,4)},
 taser:(s,c)=>{gbox(10,6,14,5,['#e0b03a','#f0c84a']);R('#1e2124',8,6,3,5);R('#4aa0ff',8,7,1,1);R('#4aa0ff',8,9,1,1);R('#1e2124',19,11,5,7)},
 flare:(s,c)=>{gbox(8,5,14,6,['#e07a2a','#f09a4a']);R('#1e2124',6,5,2,6);R('#e07a2a',19,11,5,8);R('#c86020',19,17,5,2)},
 nail:(s,c)=>{R('#1e2124',6,9,6,3);gbox(10,4,16,7,['#e0b03a','#f0c84a']);R('#1e2124',21,11,5,8);for(let i=0;i<6;i++)R('#c9ced3',12+i*2,11+i,2,1)},
};
function gunIconCanvas(id,scale=2){const s=GSPEC[id],c=document.createElement('canvas');c.width=40;c.height=20;const o=g;g=c.getContext('2d');(GDRAW[s.t]||GDRAW.rifle)(s,GCOL[s.c||'blk']);g=o;
 const x=c.getContext('2d'),im=x.getImageData(0,0,40,20),d=im.data,out=new Uint8ClampedArray(d);for(let j=0;j<20;j++)for(let i=0;i<40;i++){const k=(j*40+i)*4;if(d[k+3])continue;if([[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>{const ii=i+a,jj=j+b;return ii>=0&&jj>=0&&ii<40&&jj<20&&d[(jj*40+ii)*4+3]>0})){out[k]=150;out[k+1]=165;out[k+2]=175;out[k+3]=140}}im.data.set(out);x.putImageData(im,0,0);
 c.className='gun';c.style.width=(40*scale)+'px';c.style.height=(20*scale)+'px';c.style.imageRendering='pixelated';return c}
const _iconCanvas=iconCanvas;iconCanvas=function(id,scale){return GSPEC[id]?gunIconCanvas(id,scale):_iconCanvas(id,scale)};
(function(){const st=document.createElement('style');st.textContent='canvas.gun{height:auto!important;aspect-ratio:2/1}.card canvas.gun{width:84px!important;height:42px!important;align-self:center;padding:2px}.gs canvas.gun{width:48px!important;height:24px!important}.cell canvas.gun{width:94%!important}.slot canvas.gun{width:13cqw!important}.det canvas.gun{width:20cqw!important}.wcard canvas.gun{width:22cqw!important}';document.head.appendChild(st)})();
