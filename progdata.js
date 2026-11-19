/* PROJECT LEGACY — character progression data (levels, stats, skills, traits, perks) and gun parts, loaded by the game.
   Same data as progression.js with SLOTS renamed PSLOTS (gear.js already owns SLOTS). */
'use strict';
/* ================= levels ================= */
const MAXLV=50,xpNeed=L=>Math.round(40*Math.pow(L,1.3)+60);
const XP_SRC=[['좀비 처치','10 (러너 15 · 비명 25 · 중무장 60 · 보스 300)'],['가구 수색','3 × 건물 위험도'],['건물 첫 방문','50 × 위험도'],['경보 장치 해제','40'],['제작','5 ~ 30'],['거점 업그레이드','100 × 레벨'],['웨이브 생존','200 × 웨이브 번호'],['새 파츠 발견','25 × 등급']];
const LV_REW=L=>['능력치 +1']+(L%2==0?' · 스킬 +1':'')+([10,20,30,40,50].includes(L)?' · 특성 선택':'');
/* ================= stats ================= */
const STATS=[['str','근력','💪','근접 피해 +3% · 운반량 +1kg'],['agi','민첩','🏃','이동 속도 +1% · 공격 속도 +1.5% · 기력 +2'],['vit','체력','❤️','최대 체력 +4 · 출혈 저항 +2%'],['aim','사격','🎯','총기 피해 +2% · 정확도 +1.5 · 재장전 +2%'],['sur','생존','🌿','허기·갈증 감소 -2% · 파밍량 +1.5%']];
const STAT_BASE=5,STAT_MAX=30;
/* ================= skills (3 branches x 5 tiers, 3 ranks) ================= */
const TIER_LV=[1,5,12,20,30];
const SKILLS={
 combat:['⚔️ 전투',[['근접 숙련','근접 피해 +10% / 랭크'],['사격 숙련','총기 피해 +8% / 랭크'],['빠른 손','재장전 -12% / 랭크'],['급소 사격','치명타 확률 +5% / 랭크 (피해 2배)'],['최후의 저항','체력 30% 이하일 때 피해 +15% / 랭크']]],
 surv:['🌿 생존',[['응급처치','치료량 +20% / 랭크'],['약탈자','추가 아이템 확률 +8% / 랭크'],['그림자','은신 중 소음 -20% / 랭크'],['강인함','최대 체력 +10 / 랭크'],['짐꾼','운반량 +6kg / 랭크']]],
 tech:['🔧 기술',[['정비공','파츠 발견 확률 +10% / 랭크'],['총기 개조','장착 가능한 파츠 등급 상승 (1: 희귀 · 2: 영웅 · 3: 전설)'],['건축가','거점 건설 비용 -8% / 랭크'],['포탑 기술자','포탑 피해 +15% / 랭크'],['폭발물 전문가','투척 피해 +20% / 랭크 · 수류탄 제작']]]};
/* ================= traits ================= */
const TRAITS=[['cop','👮 전직 경찰','권총·산탄총 피해 +15% · 경찰서 경보 확률 절반',1],['soldier','🪖 전직 군인','소총 반동 -25% · 군부대 첫 수색 보너스 증가',1],['nurse','🩺 간호사','치료 효과 +30% · 출혈 시간 단축',1],['carp','🔨 목수','바리케이드·방벽 비용 -20%',1],['runner','🏃 육상선수','이동 속도 +10% · 기력 +25%',1],['mech','🔧 정비사','파츠 발견 +25% · 파츠 분해 시 고철',1],['hunter','🏹 사냥꾼','석궁·산탄총 피해 +15% · 은신 이동 빠름',1],['prep','🌿 생존주의자','허기·갈증 감소 -20%',1],
 ['glut','🍖 대식가','허기 +30%',-1],['myop','👓 근시','총기 사거리 -15%',-1],['loud','🦶 소음 체질','발소리 소음 증가',-1],['weak','🩹 허약 체질','최대 체력 -15',-1]];
const PERKS={10:[['아드레날린','처치 시 기력 +20'],['침착함','정확도 +10'],['두꺼운 피부','출혈 확률 -30%']],20:[['탄약 절약','15% 확률로 탄약 소모 없음'],['처형자','체력 20% 이하 좀비를 근접 공격으로 즉사'],['야행성','밤 시야 +40%']],30:[['무기 달인','모든 무기 피해 +10%'],['철벽','방어 +10%'],['보물 사냥꾼','희귀 이상 파츠 확률 +40%']],40:[['연쇄 처치','3초 안에 연속 처치 시 공격 속도 +25%'],['불굴','하루 한 번 치명상에서 체력 1로 생존'],['전술가','포탑·방벽 효과 +20%']],50:[['전설의 생존자','모든 능력치 +3 · 칭호'],['좀비 사냥꾼','특수 좀비 피해 +30%'],['재건자','거점 생산량 2배']]};
/* ================= gun parts ================= */
const PSLOTS=[['muzzle','총구'],['barrel','총열'],['optic','조준경'],['under','하부'],['mag','탄창'],['stock','개머리판'],['trigger','방아쇠']];
const GCLASS={revolver:'pistol',hpistol:'pistol',mpistol:'pistol',ssmg:'smg',pdw:'smg',sawnoff:'shotgun',autosg:'shotgun',carbine:'rifle',battle:'rifle',hunting:'sniper',dmr:'sniper',amr:'sniper',bow:'bow',pistol:'pistol',spistol:'pistol',smg:'smg',pump:'shotgun',dbarrel:'shotgun',ar:'rifle',sniper:'sniper',lmg:'lmg',crossbow:'bow'};
const CSLOT={pistol:['muzzle','optic','under','mag','trigger'],smg:['muzzle','barrel','optic','under','mag','stock','trigger'],shotgun:['muzzle','barrel','optic','under','mag','stock'],rifle:['muzzle','barrel','optic','under','mag','stock','trigger'],sniper:['muzzle','barrel','optic','under','mag','stock','trigger'],lmg:['muzzle','barrel','optic','under','mag','stock'],bow:['optic','stock','trigger']};
const GBASE={pistol:{acc:70,rec:30,rld:1.4,mov:100},smg:{acc:60,rec:40,rld:1.8,mov:96},shotgun:{acc:50,rec:70,rld:2.6,mov:90},rifle:{acc:75,rec:45,rld:2.2,mov:88},sniper:{acc:92,rec:80,rld:3,mov:80},lmg:{acc:55,rec:60,rld:5,mov:70},bow:{acc:85,rec:10,rld:1.6,mov:95}};
/* id, 이름, 슬롯, 등급, 호환, 효과, 획득처 */
const PARTS=[
 ['sup_p','권총 소음기','muzzle','u',['pistol','smg'],{nz:-3,dmg:-5,rng:-5},'경찰서 · 군부대'],
 ['sup_r','소총 소음기','muzzle','r',['rifle','sniper','lmg'],{nz:-3,dmg:-4},'군부대'],
 ['comp','보정기','muzzle','u',['smg','rifle','lmg'],{rec:-15,nz:1},'경찰서 · 군부대'],
 ['flash','소염기','muzzle','c',['rifle','sniper','lmg'],{rec:-5,night:1},'군부대 · 철물점'],
 ['choke','산탄 초크','muzzle','u',['shotgun'],{acc:12,rng:15},'주택 · 철물점'],
 ['brake','머즐 브레이크','muzzle','r',['sniper'],{rec:-25,nz:1},'군부대'],
 ['b_short','단축 총열','barrel','c',['smg','rifle','shotgun'],{mov:6,rng:-15,acc:-4},'철물점'],
 ['b_long','장총열','barrel','u',['rifle','sniper','lmg','shotgun'],{rng:20,dmg:8,mov:-4},'경찰서 · 군부대'],
 ['b_heavy','중총열','barrel','r',['sniper','lmg'],{acc:8,rec:-10,mov:-6},'군부대'],
 ['b_match','경기용 총열','barrel','e',['rifle','sniper','smg'],{acc:12,dmg:10},'군부대 무기고'],
 ['o_rd','레드닷','optic','c',['pistol','smg','shotgun','rifle','lmg','bow'],{acc:6},'경찰서 · 주택'],
 ['o_holo','홀로그램 조준경','optic','u',['smg','shotgun','rifle','lmg'],{acc:9,night:1},'경찰서 · 군부대'],
 ['o_4x','4배율 스코프','optic','r',['rifle','sniper','lmg','bow'],{acc:14,rng:25,mov:-3},'군부대 · 교회'],
 ['o_8x','8배율 스코프','optic','e',['sniper'],{acc:20,rng:45,mov:-5},'군부대 무기고'],
 ['o_th','열상 조준경','optic','l',['rifle','sniper'],{acc:12,rng:20,night:2},'연구소'],
 ['u_grip','수직 손잡이','under','c',['smg','rifle','lmg','shotgun'],{rec:-12},'철물점 · 경찰서'],
 ['u_laser','레이저 사이트','under','u',['pistol','smg','rifle','shotgun'],{acc:8},'경찰서 · 학교'],
 ['u_light','전술 손전등','under','c',['pistol','smg','rifle','shotgun'],{night:1},'경찰서 · 주택'],
 ['u_bipod','양각대','under','u',['sniper','lmg','rifle'],{rec:-20,acc:6,mov:-4},'군부대'],
 ['u_gl','유탄 발사기','under','l',['rifle'],{gl:1,mov:-8},'군부대 무기고'],
 ['m_ext','확장 탄창','mag','u',['pistol','smg','rifle','sniper'],{mag:50,rld:8},'경찰서 · 군부대'],
 ['m_drum','드럼 탄창','mag','e',['smg','rifle','lmg'],{mag:150,rld:35,mov:-5},'군부대 무기고'],
 ['m_fast','쾌속 탄창','mag','r',['pistol','smg','rifle'],{rld:-30},'경찰서'],
 ['m_tube','튜브 확장','mag','u',['shotgun'],{mag:67},'경찰서 · 철물점'],
 ['s_light','경량 개머리판','stock','c',['smg','rifle','shotgun'],{mov:5,rec:5},'철물점'],
 ['s_tac','전술 개머리판','stock','u',['smg','rifle','lmg','shotgun','bow'],{rec:-12,acc:3},'경찰서 · 군부대'],
 ['s_cheek','저격 개머리판','stock','r',['sniper'],{acc:10,rec:-8},'군부대'],
 ['t_light','경량 방아쇠','trigger','u',['pistol','smg','rifle','sniper','bow'],{rof:10},'철물점'],
 ['t_bin','바이너리 방아쇠','trigger','e',['smg','rifle'],{rof:30,rec:10},'군부대 무기고'],
 ['t_match','경기용 방아쇠','trigger','r',['pistol','sniper'],{acc:6,dmg:5},'경찰서 · 군부대'],
];
const P_BY=Object.fromEntries(PARTS.map(p=>[p[0],p]));
const RORD=['c','u','r','e','l'];
const PART_RULE='파츠는 제작·교환으로 얻을 수 없고 오직 파밍으로만 얻습니다. 총기 거치대 · 사물함 · 탄약 상자 · 경찰차 · 군용 트럭 · 무기고에서 건물 위험도가 높을수록 높은 등급이 나옵니다.';
const PART_DROP=[['★1~2 (주택·학교·철물점)','일반 70% · 고급 28% · 희귀 2%'],['★3 (진료소)','일반 50% · 고급 40% · 희귀 10%'],['★4 (경찰서)','고급 45% · 희귀 40% · 영웅 15%'],['★5 (군부대·연구소)','희귀 45% · 영웅 40% · 전설 15%']];
function gunStats(id,mods){const w=W_BY[id],s=w[4],cl=GCLASS[id],b=GBASE[cl],e={dmg:0,rng:0,acc:0,rec:0,rof:0,mag:0,rld:0,nz:0,mov:0,night:0,gl:0};
 for(const k in mods){const p=P_BY[mods[k]];if(p)for(const q in p[5])e[q]+=p[5][q]}
 return{피해:[s.d*(1+e.dmg/100),s.pel?'×'+s.pel:''],연사:[1/s.cd*(1+e.rof/100),'/s'],사거리:[s.r*(1+e.rng/100),''],정확도:[Math.min(100,b.acc+e.acc),''],반동:[Math.max(0,b.rec*(1+e.rec/100)),''],장탄수:[Math.round(s.mag*(1+e.mag/100)),''],재장전:[b.rld*(1+e.rld/100),'s'],소음:[Math.max(0,Math.min(5,s.nz+e.nz)),''],기동성:[b.mov+e.mov,'%'],extra:e}}
const LOWER_BETTER={반동:1,재장전:1,소음:1};

/* ================= blueprint drawing (112x48, muzzle on the left) ================= */
const FR={
 rifle:{a:{muzzle:[14,21],optic:[66,16],under:[44,25],mag:[58,26],stock:[80,18],trigger:[66,27]},b:[14,36],f:(m)=>{const bl=m.barrel=='b_short'?24:m.barrel=='b_long'||m.barrel=='b_match'?6:14,th=m.barrel=='b_heavy'?3:2;R('#1e2124',bl,21-(th>2?1:0),36-bl,th);R(m.barrel=='b_match'?'#8a9096':'#3a3f45',bl,21-(th>2?1:0),36-bl,1);
  R('#1e2124',36,18,20,8);R('#2a2f35',36,18,20,1);for(let x=37;x<55;x+=3)R('#3a3f45',x,20,1,4);R('#1e2124',56,16,24,11);R('#3a3f45',56,16,24,1);for(let x=42;x<78;x+=3)R('#3a3f45',x,15,2,1);R('#1e2124',69,27,6,10);R('#2a2f35',69,27,6,1);R('#5a6068',63,27,5,1)}},
 sniper:{a:{muzzle:[4,20],optic:[64,15],under:[36,25],mag:[60,26],stock:[80,17],trigger:[68,27]},b:[4,40],f:(m)=>{const bl=m.barrel=='b_short'?16:4,th=m.barrel=='b_heavy'?3:2;R('#1e2124',bl,20,40-bl,th);R('#3a3f45',bl,20,40-bl,1);R('#4a5434',40,17,40,10);R('#5a6440',40,17,40,1);R('#1e2124',56,15,24,3);R('#8a9096',70,18,6,2);R('#1e2124',72,27,6,10)}},
 smg:{a:{muzzle:[32,21],optic:[58,16],under:[46,26],mag:[52,26],stock:[76,18],trigger:[64,27]},b:[32,44],f:(m)=>{const bl=m.barrel=='b_short'?38:m.barrel=='b_long'||m.barrel=='b_match'?24:32;R('#1e2124',bl,21,44-bl,2);R('#1e2124',44,17,32,10);R('#3a3f45',44,17,32,1);for(let x=48;x<74;x+=3)R('#3a3f45',x,16,2,1);R('#1e2124',66,27,6,9);R('#5a6068',60,27,4,1)}},
 pistol:{a:{muzzle:[38,20],optic:[56,16],under:[46,26],mag:[61,38],trigger:[56,28]},b:[38,40],f:(m)=>{R('#3a3f45',38,17,34,7);R('#5a6068',38,17,34,1);for(let x=60;x<70;x+=2)R('#1e2124',x,19,1,4);R('#1e2124',42,24,28,4);R('#1e2124',60,27,10,12);R('#2a2f35',61,28,8,10);R('#5a6068',54,28,4,1)}},
 shotgun:{a:{muzzle:[8,20],optic:[66,16],under:[34,26],mag:[18,23],stock:[78,18],trigger:[68,27]},b:[8,60],f:(m)=>{const bl=m.barrel=='b_short'?24:m.barrel=='b_long'?2:8;R('#3a3f45',bl,19,60-bl,2);R('#5a6068',bl,19,60-bl,1);R('#2a2f35',m.mag=='m_tube'?10:24,22,60-(m.mag=='m_tube'?10:24),2);R('#8a5a33',30,22,16,5);R('#b07a45',30,22,16,1);for(let x=32;x<45;x+=3)R('#5e3e26',x,23,1,4);R('#1e2124',60,17,18,10);R('#3a3f45',60,17,18,1);R('#1e2124',70,27,4,4)}},
};
function drawStock(cl,m,x,y){const s=m.stock;if(cl=='pistol')return;if(cl=='shotgun'&&!s){R('#8a5a33',x,y,26,8);R('#5e3e26',x+2,y+6,24,4);R('#b07a45',x,y,26,1);return}
 if(s=='s_light'){R('#1e2124',x,y+1,22,2);R('#1e2124',x,y+7,18,2);R('#1e2124',x+20,y+1,3,9)}else if(s=='s_tac'){R('#1e2124',x,y,20,9);R('#3a3f45',x,y,20,1);R('#2a2f35',x+20,y-1,4,11);for(let i=x+3;i<x+18;i+=4)R('#3a3f45',i,y+3,2,3)}
 else if(s=='s_cheek'){R('#4a5434',x,y,24,10);R('#5a6440',x,y,24,1);R('#3e4729',x+4,y-3,12,3);R('#1e2124',x+22,y,3,10)}else if(cl=='sniper'){R('#4a5434',x,y,22,10);R('#1e2124',x+20,y,3,10)}else{R('#1e2124',x,y+1,20,7);R('#3a3f45',x,y+1,20,1);R('#1e2124',x+18,y,4,10)}}
function drawMag(cl,m,x,y){const g2=m.mag;if(cl=='shotgun')return;if(cl=='pistol'){if(g2=='m_ext'){R('#1e2124',x,y,8,6);R('#3a3f45',x,y,8,1)}else if(g2=='m_fast'){R('#c43c32',x,y,8,2)}else R('#1e2124',x,y,8,2);return}
 if(g2=='m_drum'){blob(x+4,y+8,7,7,'#1e2124');blob(x+4,y+8,5,5,'#2a2f35');blob(x+4,y+8,2,2,'#5a6068');R('#1e2124',x+1,y,6,3)}else if(g2=='m_ext'){R('#1e2124',x,y,7,17);R('#3a3f45',x,y,7,1);for(let i=y+3;i<y+16;i+=3)R('#2a2f35',x+1,i,5,1)}
 else if(g2=='m_fast'){R('#1e2124',x,y,6,12);R('#1e2124',x+7,y+2,6,12);R('#c9a46a',x,y+5,13,2)}else{R('#1e2124',x,y,7,12);R('#3a3f45',x,y,7,1)}}
function drawMuzzle(m,x,y){const p=m.muzzle;if(p=='sup_p'||p=='sup_r'){const L=p=='sup_r'?14:10;R('#1e2124',x-L,y-2,L,5);R('#3a3f45',x-L,y-2,L,1);R('#2a2f35',x-L+2,y,L-4,1)}else if(p=='comp'){R('#1e2124',x-5,y-1,5,4);R('#5a6068',x-4,y-1,1,1);R('#5a6068',x-2,y-1,1,1)}else if(p=='flash'){R('#1e2124',x-5,y-2,5,6);for(let i=0;i<3;i++)R('#5a6068',x-5,y-1+i*2,4,1)}else if(p=='choke'){R('#8a9096',x-4,y-1,4,3)}else if(p=='brake'){R('#1e2124',x-7,y-2,7,6);R('#5a6068',x-6,y-2,2,6);R('#5a6068',x-3,y-2,2,6)}}
function drawOptic(m,x,y){const p=m.optic;if(p=='o_rd'){R('#1e2124',x-4,y-5,8,5);R('#3a6ea8',x-3,y-4,6,3);R('#ff3030',x,y-3,1,1)}else if(p=='o_holo'){R('#1e2124',x-6,y-7,12,7);R('#7fb8e0',x-5,y-6,8,4);R('#ff3030',x-1,y-5,2,2);R('#1e2124',x+2,y-6,3,5)}
 else if(p=='o_4x'||p=='o_8x'){const L=p=='o_8x'?26:18;R('#1e2124',x-L/2,y-6,L,4);R('#3a3f45',x-L/2,y-6,L,1);R('#1e2124',x-L/2-2,y-7,4,6);R('#1e2124',x+L/2-2,y-7,4,6);R('#7fb8e0',x-L/2-2,y-6,1,4);R('#1e2124',x-2,y-2,2,2);R('#1e2124',x+3,y-2,2,2)}
 else if(p=='o_th'){R('#1e2124',x-9,y-8,18,8);R('#2a2f35',x-9,y-8,18,1);R('#3fa04a',x-10,y-6,2,4);R('#5fe08a',x-9,y-5,1,2);R('#e0b03a',x+4,y-6,2,1)}}
function drawUnder(m,x,y){const p=m.under;if(p=='u_grip'){R('#1e2124',x,y,4,9);R('#3a3f45',x,y,4,1)}else if(p=='u_laser'){R('#1e2124',x-3,y,8,3);R('#ff3030',x-4,y+1,1,1);g.globalAlpha=.35;R('#ff3030',x-40,y+1,36,1);g.globalAlpha=1}else if(p=='u_light'){R('#1e2124',x-3,y,8,4);R('#ffd36a',x-4,y,1,4);g.globalAlpha=.18;R('#ffe8a0',x-24,y-3,20,10);g.globalAlpha=1}
 else if(p=='u_bipod'){R('#1e2124',x,y,4,2);ln(x+1,y+2,x-5,y+14,'#1e2124');ln(x+2,y+2,x+8,y+14,'#1e2124')}else if(p=='u_gl'){R('#4a5434',x-10,y,22,5);R('#5a6440',x-10,y,22,1);R('#1e2124',x-11,y,2,5);R('#1e2124',x+8,y+5,3,4)}}
function drawTrigger(m,x,y){const p=m.trigger;if(!p)return;R(p=='t_bin'?'#c43c32':p=='t_match'?'#e0b03a':'#c9ced3',x,y,2,3)}
function blueprint(id,mods){const cl=GCLASS[id],F=FR[cl]||FR.rifle,c=document.createElement('canvas');c.width=BPW;c.height=48;const o=g;g=c.getContext('2d');g.translate(BPX,0);
 drawStock(cl,mods,...(F.a.stock||[0,0]));F.f(mods);drawMag(cl,mods,...F.a.mag);drawUnder(mods,...F.a.under);drawOptic(mods,...F.a.optic);const mz={rifle:{b_short:24,b_long:6,b_match:6},sniper:{b_short:16},smg:{b_short:38,b_long:24,b_match:24},shotgun:{b_short:24,b_long:2}}[cl]||{};drawMuzzle(mods,mz[mods.barrel]??F.a.muzzle[0],F.a.muzzle[1]);drawTrigger(mods,...F.a.trigger);g=o;const x=c.getContext('2d'),im=x.getImageData(0,0,BPW,48),d=im.data,out=new Uint8ClampedArray(d);for(let j=0;j<48;j++)for(let i=0;i<BPW;i++){const k=(j*BPW+i)*4;if(d[k+3])continue;if([[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>{const ii=i+a,jj=j+b;return ii>=0&&jj>=0&&ii<BPW&&jj<48&&d[(jj*BPW+ii)*4+3]>200})){out[k]=170;out[k+1]=190;out[k+2]=205;out[k+3]=170}}im.data.set(out);x.putImageData(im,0,0);return c}
const BPW=126,BPX=12;
