/* PROJECT LEGACY — zombie bestiary data and sprites. */
'use strict';
Object.assign(LOOKS,{
 spitter:{...ZBASE,sk:'#a8b860',skd:'#889840',h:'#3a3a2a',p:'#4a4a40',pd:'#3a3a30',c:'#6a6a5a',cl:'#7a7a6a',cd:'#5a5a4a'},
 burner:{...ZBASE,sk:'#3a2a22',skd:'#2a1a12',h:'#1a1210',p:'#2a2220',pd:'#1a1210',c:'#4a3a30',cl:'#5a4a40',cd:'#3a2a20'},
 shocker:{...ZBASE,sk:'#8aa8c8',skd:'#6a88a8',h:'#d8e8f8',p:'#3a3a40',pd:'#2a2a30',c:'#e8ecec',cl:'#ffffff',cd:'#c4cccc',coat:1},
});
const ZCAT={n:['일반','#9aa3aa'],s:['특수','#4a9ae0'],e:['엘리트','#b06ae0'],b:['보스','#f0a030']};
/* id, 이름, 분류, {hp,spd,dmg,xp,threat}, 능력, 약점, 출현, 캔버스 크기 */
const ZOMBIES=[
 ['runner','러너','s',{hp:30,spd:81,dmg:7,xp:15,th:2},'빠르게 질주하고 무리 지어 다님','체력이 낮아 한두 방에 쓰러짐','★2 이상 건물 · 밤 · 웨이브 3부터',48],
 ['screamer','비명 좀비','s',{hp:50,spd:45,dmg:5,xp:25,th:3},'플레이어를 보면 비명 → 주변 좀비 집결 + 러너 3마리 소환','먼저 발견해 멀리서 조용히 처치','★3 이상 건물 · 웨이브 6부터',48],
 ['heavy','중무장 좀비','e',{hp:260,spd:29,dmg:16,xp:60,th:4},'방탄복 때문에 총기 피해 -30% · 방벽 빠르게 파괴','오함마 · 대구경 권총 · 관통 저격','경찰서 · 군부대 · 웨이브 9부터',56],
 ['crawler','크롤러','s',{hp:25,spd:30,dmg:6,xp:12,th:2},'몸이 낮아 잘 보이지 않음 · 다리를 붙잡아 이동 속도 -50%','근접 무기로 내려치기','주택가 · 폐차 주변 · 지하',48],
 ['spitter','스피터','s',{hp:60,spd:40,dmg:4,xp:30,th:3},'원거리 산성 침 · 바닥에 산성 웅덩이(초당 10 피해)','엄폐물 뒤에서 빠르게 접근','연구소 · 진료소 · 밤',48],
 ['bloater','부머','s',{hp:120,spd:25,dmg:0,xp:30,th:3},'가까이 오거나 죽으면 폭발 (반경 70 · 피해 40 + 독가스)','멀리서 사격 · 좀비 무리 한가운데에서 터뜨리기','편의점 · 식당 · 웨이브',56],
 ['stalker','스토커','e',{hp:70,spd:140,dmg:12,xp:45,th:4},'어둠 속에 숨어 있다 도약해 덮침 · 넘어뜨려 2초 행동 불가','손전등 · 조명을 비추면 주춤함','밤 전용 · 학교 · 교회',56],
 ['dog','감염견','s',{hp:35,spd:120,dmg:8,xp:15,th:3},'3~5마리 무리로 빠르게 추격','산탄총 · 좁은 문 앞에서 방어','경찰서(K9) · 군부대 · 도로',48],
 ['burner','불타는 좀비','s',{hp:80,spd:50,dmg:10,xp:35,th:3},'접촉 시 화상 · 바리케이드를 태움 · 화염 면역','원거리 사격 (화염병·화염방사기 무효)','주유소 · 소방서 · 불이 난 곳',48],
 ['shocker','감전 좀비','e',{hp:90,spd:45,dmg:10,xp:45,th:4},'전기 방출로 포탑 · 손전등 · 발전기 5초 정지','포탑에 의존하지 말고 직접 처치','연구소 · 발전기 근처',48],
 ['sleeper','잠복자','s',{hp:50,spd:60,dmg:14,xp:25,th:3},'시체인 척 누워 있다가 가까이 오면 기습','수상한 시체는 미리 공격','모든 건물 · 시체가 많은 곳',48],
 ['brute','브루트','e',{hp:600,spd:35,dmg:30,xp:150,th:5},'돌진해서 방벽 · 바리케이드 파괴 · 큰 넉백','돌진을 옆으로 피한 뒤 뒤에서 공격 · 폭발물','웨이브 12부터 · 군부대',80],
 ['brood','번식체','b',{hp:900,spd:20,dmg:20,xp:400,th:5},'몸에서 크롤러를 계속 낳음 · 산성 분출','화염 · 알주머니부터 파괴','연구소 최심부 (보스)',88],
 ['goliath','골리앗','b',{hp:1500,spd:40,dmg:40,xp:600,th:5},'땅 내려치기 범위 공격 · 방벽 일격 파괴','대물 저격총 · 로켓 · 유탄','웨이브 9마다 등장 (보스)',96],
];
const COMMON=[['civ1','시민'],['civ2','시민'],['civ3','시민'],['student','학생'],['patient','환자'],['doctor','의사'],['nurse','간호사'],['cop','경찰'],['soldier','군인'],['fire','소방관'],['labcoat','연구원'],['hazmat','방호복']];
/* ---------- sprites (feet at bottom center) ---------- */
function zs(id,fr,S){return sprite('z_'+id+'_'+fr+'_'+S,S,S,()=>ZD[id](fr,S))}
const HUM=(look,fr,S,dir='d')=>{g.save();g.translate(S/2-18,S-40);person(LOOKS[look],dir,fr,null);g.restore()};
const ZD={
 runner:(f,S)=>HUM('runner',f,S,'r'),screamer:(f,S)=>{HUM('screamer',f,S);if(f%2){R('#ffffff60',S/2-12,S-38,2,2);R('#ffffff60',S/2+10,S-36,2,2)}},
 heavy:(f,S)=>{g.save();g.translate(S/2,S);g.scale(1.3,1.3);g.translate(-18,-40);person(LOOKS.heavy,'d',f,null);g.restore()},
 crawler:(f,S)=>{const y=S-12;R('#6e0e0e',4,y+2,14,3);R('#3a3a40',8,y-2,10,6);R('#5a4a4a',14,y-6,20,10);R('#6a5a5a',14,y-6,20,2);R('#9aab86',33,y-8,10,9);R('#4a4a3a',33,y-9,10,3);R('#d82020',39,y-5,2,2);R('#9aab86',36,y-14+f%2,12,3);R('#9aab86',36,y+2-f%2,12,3);R('#7f9070',46,y-14+f%2,3,4);R('#7f9070',46,y+1-f%2,3,4);R('#6e0e0e',22,y-3,4,3)},
 spitter:(f,S)=>{HUM('spitter',f,S);const x=S/2,y=S-40;blob(x,y+17,6,4,'#c8d850');blob(x,y+17,4,3,'#e0f070');R('#9ac040',x-1,y+16,2,4+f%2*3);R('#c8d850',x-8,y+20,2,2);R('#c8d850',x+6,y+24,2,2)},
 bloater:(f,S)=>{const x=S/2,y=S-4;R('#3a3a30',x-9,y-8,5,8);R('#3a3a30',x+4,y-8,5,8);blob(x,y-24,17,16,'#1d1714');blob(x,y-24,16,15,'#a8a070');blob(x-4,y-28,8,6,'#c0b888');[[x-8,y-20],[x+7,y-30],[x+5,y-14],[x-10,y-33],[x+12,y-22]].forEach(([a,b],i)=>{blob(a,b,2+(i%2),2,'#d0c060');R('#f0e090',a-1,b-1,1,1)});R('#a8a070',x-20,y-28+f%2,5,10);R('#a8a070',x+15,y-28-f%2,5,10);blob(x,y-42,6,5,'#1d1714');blob(x,y-42,5,4,'#9aab86');R('#d82020',x-3,y-43,2,2);R('#d82020',x+1,y-43,2,2);R('#5a1010',x-2,y-39,4,2)},
 stalker:(f,S)=>{const x=S/2,y=S-4,st=f%2?2:-2;R('#4a5060',x-8+st,y-16,3,16);R('#4a5060',x+5-st,y-16,3,16);R('#1d1714',x-10,y-24,22,10);R('#7a8a9a',x-9,y-23,20,8);R('#8a9aaa',x-9,y-23,20,2);for(let i=0;i<4;i++)R('#5a6a7a',x-6+i*4,y-21,1,5);R('#1d1714',x+8,y-26,12,10);R('#8a9aaa',x+9,y-25,10,8);R('#ffe040',x+15,y-22,2,2);R('#ffe040',x+18,y-22,1,2);R('#7a8a9a',x+6,y-16,3,16+st);R('#7a8a9a',x-6,y-16,3,15-st);R('#d0d8e0',x+6,y,4,1);R('#d0d8e0',x-6,y,4,1)},
 dog:(f,S)=>{const x=S/2,y=S-6,st=f%2;R('#3a2a1a',x-12,y-6,3,6+st);R('#3a2a1a',x-6,y-6,3,6-st);R('#3a2a1a',x+6,y-6,3,6-st);R('#3a2a1a',x+11,y-6,3,6+st);R('#1d1714',x-14,y-15,30,10);R('#6a5a4a',x-13,y-14,28,8);R('#7a6a5a',x-13,y-14,28,2);for(let i=0;i<4;i++)R('#4a3a2a',x-6+i*3,y-12,1,5);R('#6e0e0e',x-2,y-10,5,3);R('#1d1714',x+12,y-20,11,9);R('#6a5a4a',x+13,y-19,9,7);R('#6a5a4a',x+20,y-16,5,4);R('#d82020',x+17,y-18,2,2);R('#f4f4ee',x+21,y-13,1,2);R('#6a5a4a',x+13,y-23,3,4);R('#6a5a4a',x-17,y-16+st,5,2)},
 burner:(f,S)=>{HUM('burner',f,S);const x=S/2,y=S-40;for(let i=0;i<6;i++){const fx=x-10+i*4+((i+f)%2)*2,fy=y+4+(i%3)*6;blob(fx,fy-((f+i)%3),3,4,'#e8762a');blob(fx,fy-((f+i)%3)+1,1,2,'#ffd36a')}blob(x,y,4,5+f%2,'#e8762a');blob(x,y+1,2,3,'#ffd36a')},
 shocker:(f,S)=>{HUM('shocker',f,S);const x=S/2,y=S-40;const c=f%2?'#a0e0ff':'#ffffff';ln(x-14,y+10,x-9,y+16,c);ln(x-9,y+16,x-13,y+21,c);ln(x+13,y+8,x+9,y+14,c);ln(x+9,y+14,x+14,y+20,c);ln(x-3,y-2,x+1,y+3,c);R('#4aa0ff',x-2,y+8,4,3)},
 sleeper:(f,S)=>{const x=S/2,y=S-12;blob(x,y+4,18,6,'#5e0c0c');R('#3a3a40',x-18,y-2,10,5);R('#5a5a60',x-8,y-4,14,9);R('#9aab86',x+6,y-3,8,8);R('#4a4a3a',x+13,y-3,2,8);R('#9aab86',x-6,y-8,3,5);R('#9aab86',x-2,y+4,3,5);R(f%2?'#ff2020':'#801010',x+9,y-1,2,2)},
 brute:(f,S)=>{const x=S/2,y=S-4,st=f%2?2:0;R('#1d1714',x-14,y-20,10,20);R('#5a4a3a',x-13,y-19,8,19-st);R('#1d1714',x+4,y-20,10,20);R('#5a4a3a',x+5,y-19,8,19-(2-st));R('#1d1714',x-20,y-50,40,32);R('#8a7a6a',x-19,y-49,38,30);R('#9a8a7a',x-19,y-49,38,4);for(let i=0;i<4;i++)R('#6a5a4a',x-14+i*8,y-40,5,14);
  R('#1d1714',x-34,y-48+st,16,30);R('#8a7a6a',x-33,y-47+st,14,28);R('#7a6a5a',x-33,y-24+st,14,6);R('#1d1714',x+18,y-48-st,16,30);R('#8a7a6a',x+19,y-47-st,14,28);R('#7a6a5a',x+19,y-24-st,14,6);
  R('#1d1714',x-7,y-60,14,12);R('#8a7a6a',x-6,y-59,12,10);R('#d82020',x-4,y-55,3,2);R('#d82020',x+1,y-55,3,2);R('#5a1010',x-3,y-51,6,2);[[x-16,y-54],[x+12,y-54],[x-2,y-64]].forEach(([a,b])=>{R('#e8e2d0',a,b,4,5)});R('#6e0e0e',x-10,y-34,6,4)},
 brood:(f,S)=>{const x=S/2,y=S-4;blob(x,y-8,30,8,'#2a3a1a');blob(x,y-30,32,26,'#1d1714');blob(x,y-30,31,25,'#7a8a5a');blob(x-6,y-38,16,12,'#8a9a6a');[[x-20,y-44],[x+18,y-40],[x+22,y-22],[x-24,y-20],[x+4,y-52],[x-8,y-18]].forEach(([a,b],i)=>{blob(a,b,6,5,'#1d1714');blob(a,b,5,4,i%2?'#c8d070':'#b0c060');R('#f0f8b0',a-2,b-2,2,2);if((f+i)%3==0)R('#3a4a20',a-1,b,3,2)});
  for(let i=0;i<3;i++){ln(x-28,y-26+i*6,x-40,y-14+i*8+(f%2)*2,'#5a6a3a');ln(x+28,y-26+i*6,x+40,y-14+i*8-(f%2)*2,'#5a6a3a')}blob(x,y-58,9,7,'#1d1714');blob(x,y-58,8,6,'#7a8a5a');[[x-4,y-60],[x+3,y-60],[x,y-56]].forEach(([a,b])=>R('#ff3030',a,b,2,2));R('#3a4a20',x-3,y-53,6,2)},
 goliath:(f,S)=>{g.save();g.translate(S/2,S);g.scale(1.15,1.15);g.translate(-S/2,-S);ZD.brute(f,S);g.restore();const x=S/2,y=S-4;R('#a83a2a',x-18,y-56,6,8);R('#a83a2a',x+14,y-56,6,8);for(let i=0;i<5;i++)R('#e8e2d0',x-14+i*7,y-68,3,6);R('#ff3030',x-5,y-62,3,2);R('#ff3030',x+3,y-62,3,2)},
};
function zCanvas(id,fr,S,look){const c=document.createElement('canvas');c.width=S;c.height=S;const x=c.getContext('2d'),o=g;g=x;if(look)HUM(look,fr,S);else ZD[id](fr,S);g=o;
 const im=x.getImageData(0,0,S,S),d=im.data,out=new Uint8ClampedArray(d);for(let j=0;j<S;j++)for(let i=0;i<S;i++){const k=(j*S+i)*4;if(d[k+3])continue;if([[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>{const ii=i+a,jj=j+b;return ii>=0&&jj>=0&&ii<S&&jj<S&&d[(jj*S+ii)*4+3]>200})){out[k]=24;out[k+1]=18;out[k+2]=16;out[k+3]=255}}im.data.set(out);x.putImageData(im,0,0);return c}
