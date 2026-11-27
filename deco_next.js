/* PROJECT LEGACY — decorating the base.
   At the base tent: [상호작용] → 🪴 거점 꾸미기. Make a decoration with materials, walk to the spot, [설치].
   Stand next to one: 옮기기 (free) · 치우기 (half the materials back).
   Every piece adds comfort. Comfort makes the base feel like home:
     5  → you and companions heal in the base (+0.5 / s)
     12 → survivors share a little food and water each morning
     20 → requests pay 20 % more · companions at the base gain experience each day
   Some pieces also do something: the vegetable patch grows food, the rain barrel fills water, the fire and the lights glow at night.
   Loaded after req_next.js. */
'use strict';
const DECO={
 plant:['🪴','화분',{wood:2,cloth:1},1,16,16,false,'초록이 있으면 마음이 놓여요'],
 flower:['🌼','꽃밭',{wood:3,cloth:2},2,34,18,false,'알록달록한 꽃밭'],
 rug:['🟥','러그',{cloth:6},1,40,26,false,'바닥에 까는 큰 러그'],
 bench:['🪑','벤치',{wood:6,scrap:2},2,40,14,true,'앉아서 쉬는 곳'],
 table:['🍽','식탁',{wood:10,scrap:2},3,44,30,true,'다 같이 밥 먹는 식탁'],
 fire:['🔥','모닥불',{wood:6,scrap:2},3,24,22,true,'밤에 따뜻하게 빛나요'],
 lights:['💡','줄전구',{elec:3,scrap:3},3,60,10,false,'밤에 반짝이는 줄전구'],
 flag:['🚩','깃발',{wood:3,cloth:4},2,14,40,true,'우리 거점의 깃발'],
 dog:['🐕','개집',{wood:8,scrap:2},2,26,24,true,'떠돌이 개가 지내요'],
 line:['👕','빨랫줄',{wood:2,cloth:3},1,50,12,false,'빨래가 바람에 흔들려요'],
 garden:['🥬','텃밭',{wood:6,cloth:2},2,44,28,false,'매일 아침 통조림 1개 (채소)'],
 barrel:['🛢','빗물 통',{scrap:6,wood:2},1,18,20,true,'매일 아침 물병 1개']};
Object.assign(DECO,{
 hammock:['🏝','해먹',{wood:4,cloth:6},3,46,22,false,'바람에 살랑 흔들리는 줄무늬 해먹'],
 catbed:['🐈','고양이 쿠션',{cloth:5,food:1},2,22,16,false,'떠돌이 고양이가 낮잠을 자요 · 꼬리를 살랑'],
 coop:['🐔','닭장',{wood:10,scrap:3,food:2},3,40,30,true,'닭 세 마리 · 매일 아침 통조림 1개 (달걀)'],
 sunflower:['🌻','해바라기',{wood:1,cloth:1},1,22,30,false,'키 큰 해바라기가 바람에 흔들려요'],
 scarecrow:['🧟','좀비 허수아비',{wood:4,cloth:3,scrap:2},2,20,40,true,'좀비 옷을 입힌 허수아비 · 다들 웃어요'],
 hoop:['🏀','농구 골대',{scrap:8,wood:3},2,30,40,true,'공이 혼자 통통 튀어요'],
 radio:['📻','라디오',{elec:4,scrap:3},3,22,16,true,'음악이 흘러나와요 · 음표가 둥둥'],
 guitar:['🎸','기타 의자',{wood:5,scrap:2},2,24,24,true,'저녁이면 누군가 기타를 쳐요'],
 swing:['🪢','그네',{wood:10,scrap:4},3,40,40,true,'아이들이 타던 그네가 흔들려요'],
 mural:['🎨','벽화 판',{wood:6,cloth:2,scrap:2},3,50,34,true,'생존자들이 그린 벽화'],
 tally:['📋','생존 기록판',{wood:5},2,32,30,true,'버틴 날과 처치 수가 적혀요 (매일 갱신)'],
 trophy:['🏆','트로피 진열장',{wood:8,scrap:6,steel:1},3,34,30,true,'처치 수만큼 트로피가 늘어요'],
 candles:['🕯','추모 촛불',{wood:2,cloth:1,fuel:1},2,26,14,false,'떠난 사람들을 위한 촛불'],
 statue:['🗿','생존자 동상',{scrap:10,steel:4,tkn:10},4,28,44,true,'우리를 지킨 영웅의 동상'],
 pond:['🐟','작은 연못',{wood:4,scrap:4,cloth:2},4,50,32,false,'물고기가 헤엄쳐요 · 매일 아침 물병 1개'],
 tree:['🌳','나무',{wood:3,cloth:1},2,34,44,true,'심은 묘목이 자라 그늘을 만들어요'],
 birdhouse:['🐦','새집',{wood:3},1,16,40,true,'새가 들락날락해요']});
/* themes: three different pieces of one theme give a set bonus · some pieces come in several colours (🎨 색 바꾸기) */
const DTH={rest:['🛋','휴식',['rug','bench','table','fire','hammock','catbed'],'거점 회복 2배 (+1/초)'],farm:['🌾','농장',['garden','barrel','coop','sunflower','scarecrow','line'],'매일 아침 통조림 +2'],
 fun:['🎈','놀이',['lights','hoop','radio','guitar','swing','mural'],'거점 동료 매일 경험치 +10'],mem:['🏅','기념',['flag','tally','trophy','candles','statue'],'의뢰를 끝낼 때마다 교환권 +3'],
 nat:['🌳','자연',['plant','flower','pond','tree','dog','birdhouse'],'거점 안에서 기력이 빨리 차요']};
const dSet=t=>{const L=DTH[t][2];return new Set(DSTORE().filter(d=>L.includes(d.t)).map(d=>d.t)).size};
const dSetOn=t=>dSet(t)>=3;
const DVAR={rug:[['#7a2a2a','#a83a3a','#d9a52a'],['#2a3a6a','#3a5a9a','#e8e2d6'],['#2a5a3a','#3a7a4a','#e8c84a'],['#5a2a6a','#7a3a8a','#f0a0c8']],
 flag:[['#c8302a','#e8ecf0'],['#2a5a9a','#ffd36a'],['#2a7a3a','#ffffff'],['#1d1714','#ff6a5a']],lights:[['#ffd36a','#ff6a8a','#9ad0ff','#7fd07f'],['#ffd36a','#ffd36a','#ffe9a0','#ffb050'],['#9ad0ff','#c0a0ff','#9ad0ff','#ffffff']],
 flower:[['#ff6a8a','#ffd36a','#9ad0ff','#ffffff','#ff9a3a'],['#ffffff','#ffd0e0','#ffe9f0','#fff4c0','#ffffff'],['#c84a3a','#a83a8a','#e8c84a','#c84a3a','#ff6a5a']],
 catbed:[['#e8a050','#c87830'],['#3a3a3a','#1d1d1d'],['#e8e2d6','#a8a49a']],hammock:[['#c84a3a','#e8e2d6'],['#2a6aa8','#ffd36a'],['#2a8a5a','#e8e2d6']],mural:[0,1,2]};
const dV=(o,k)=>{const L=DVAR[k];return L?L[(o&&o.v|0)%L.length]:null};
const DROT=new Set(['rug','bench','table','flower','garden','lights','line','hammock','pond','candles']);
const dDim=(t,r)=>{const D=DECO[t];if(!r||!DROT.has(t))return D;const E=D.slice();E[4]=D[5];E[5]=D[4];return E};
/* a turned piece: draw it flat on a scrap canvas, then lay that canvas down turned a quarter */
function dDrawRot(t,cx,cy,o){const D=DECO[t],PD=24,c=document.createElement('canvas');c.width=D[4]+PD*2;c.height=D[5]+PD*2;const x=c.getContext('2d'),old=g;g=x;try{dArt[t](PD,PD,D[4],D[5],o)}catch(e){}g=old;
 g.save();g.translate(Math.round(cx),Math.round(cy));g.rotate(Math.PI/2);g.drawImage(c,-c.width/2|0,-c.height/2|0);g.restore()}
const DLIST=Object.keys(DECO);Object.assign(FLAT,{deco_candles:1});Object.assign(FLAT,{deco_rug:1,deco_flower:1,deco_garden:1});
const DTIER=[[5,'🛋 아늑함','거점에서 나와 동료 체력 회복 +0.5/초'],[12,'🏡 내 집 같음','매일 아침 생존자들이 음식 · 물을 나눠요'],[20,'🎉 활기참','의뢰 보상 +20% · 거점 동료 매일 경험치']];
const DSTORE=()=>{S.base.deco=S.base.deco||[];return S.base.deco};
const comfort=()=>DSTORE().reduce((a,d)=>a+(DECO[d.t]?DECO[d.t][3]:0),0);
const dTier=()=>{const c=comfort();let n=0;for(const[t]of DTIER)if(c>=t)n++;return n};
/* ---------- in the world ---------- */
{const _bw=buildWorld;buildWorld=function(){const w=_bw.apply(this,arguments);try{if(!(typeof DUN!='undefined'&&DUN)&&S&&S.base&&W0.base){const B=W0.base;for(const d of S.base.deco||[]){if(!DECO[d.t])continue;const D=dDim(d.t,d.r);
  W0.objs.push({t:'deco_'+d.t,x:B.ox+d.rx-D[4]/2,y:B.oy+d.ry-D[5]/2,w:D[4],h:D[5],did:d.id,v:d.v|0,r:d.r|0});
  if(d.t=='fire')W0.lights.push([B.ox+d.rx,B.oy+d.ry,150,.9,'#ffb060']);if(d.t=='lights')W0.lights.push([B.ox+d.rx,B.oy+d.ry,110,.7,'#ffe0a0']);if(d.t=='candles')W0.lights.push([B.ox+d.rx,B.oy+d.ry,70,.6,'#ffc070'])}}}catch(e){}return w}}
const dArt={
 plant:(x,y)=>{R('#5a3a24',x+3,y+9,10,7);R('#7a5034',x+3,y+9,10,2);R('#2f7a3a',x+2,y+1,12,9);R('#4aa04e',x+4,y,8,5);R('#6ac06a',x+5,y+1,3,2)},
 flower:(x,y,w,h)=>{R('#5a3a24',x,y+4,w,h-4);R('#6a4a2a',x+1,y+5,w-2,h-6);const c=['#ff6a8a','#ffd36a','#9ad0ff','#ffffff','#ff9a3a'];for(let i=0;i<9;i++){const px=x+3+(i*11)%(w-6),py=y+6+(i*7)%(h-10);R('#3a8a3a',px,py+2,1,3);R(c[i%5],px-1,py,3,3)}},
 rug:(x,y,w,h)=>{R('#7a2a2a',x,y,w,h);R('#a83a3a',x+2,y+2,w-4,h-4);R('#d9a52a',x+5,y+5,w-10,h-10);R('#a83a3a',x+7,y+7,w-14,h-14);for(let i=x+1;i<x+w;i+=4){R('#e8d7a8',i,y-2,1,2);R('#e8d7a8',i,y+h,1,2)}},
 bench:(x,y,w,h)=>{R('#3a2818',x+2,y+8,3,6);R('#3a2818',x+w-5,y+8,3,6);R('#7a5034',x,y,w,4);R('#9a6a44',x,y,w,1);R('#7a5034',x,y+5,w,4);R('#5a3a24',x,y+8,w,1)},
 table:(x,y,w,h)=>{for(const[a,b]of[[4,-4],[w-12,-4],[4,h-3],[w-12,h-3]]){R('#5a3a24',x+a,y+b,8,7);R('#7a5034',x+a,y+b,8,2)}R('#5a3a24',x+2,y+4,w-4,h-8);R('#8a5a3a',x+3,y+5,w-6,h-10);R('#a8744a',x+3,y+5,w-6,2);R('#e8e2d6',x+10,y+10,7,5);R('#e8e2d6',x+w-17,y+12,7,5);R('#c84a3a',x+w/2-2|0,y+9,4,4)},
 fire:(x,y,w,h)=>{const t=performance.now()/120;for(let i=0;i<8;i++){const a=i/8*6.28;R('#6a6a6a',x+w/2+Math.cos(a)*9-2|0,y+h/2+Math.sin(a)*7-2|0,4,4)}R('#3a2818',x+w/2-7|0,y+h/2-1|0,14,3);const f=Math.sin(t)*2|0,f2=Math.cos(t*1.3)*2|0;R('#ff6a1a',x+w/2-4|0,y+h/2-8+f2|0,8,8);R('#ffb030',x+w/2-3|0,y+h/2-11+f|0,6,8);R('#ffe9a0',x+w/2-1|0,y+h/2-9+f2|0,3,5)},
 lights:(x,y,w,h)=>{R('#3a2818',x,y-10,2,h+10);R('#3a2818',x+w-2,y-10,2,h+10);const on=typeof NIGHT!='undefined'&&NIGHT,t=performance.now()/400;for(let i=0;i<=10;i++){const px=x+1+i*(w-2)/10,py=y-8+Math.sin(i/10*Math.PI)*7;R('#2a2a2a',px|0,py|0,1,1);const c=['#ffd36a','#ff6a8a','#9ad0ff','#7fd07f'][i%4];R(on&&((i+(t|0))%3)?c:'#6a6a5a',px-1|0,py+1|0,3,3)}},
 flag:(x,y,w,h)=>{const t=performance.now()/300;R('#3a3a3a',x+2,y,2,h);R('#2a2a2a',x,y+h-3,6,3);const s=Math.sin(t)*1.5|0;R('#c8302a',x+4,y+2+s,10,8);R('#e8ecf0',x+6,y+4+s,6,4);R('#c8302a',x+8,y+5+s,2,2)},
 dog:(x,y,w,h)=>{R('#6a3a24',x,y+6,w,h-6);R('#8a5034',x+1,y+7,w-2,h-8);R('#a83a3a',x-2,y,w+4,7);R('#c84a3a',x-2,y,w+4,2);R('#1d1714',x+w/2-4|0,y+12,8,10);R('#c9a06a',x+w+2,y+h-8,8,6);R('#a8804a',x+w+8,y+h-10,4,4);R('#1d1714',x+w+10,y+h-9,1,1)},
 line:(x,y,w,h)=>{const t=performance.now()/500;R('#5a3a24',x,y-12,2,h+12);R('#5a3a24',x+w-2,y-12,2,h+12);R('#d9d0b8',x+2,y-10,w-4,1);for(const[a,c]of[[8,'#5a8ec5'],[20,'#e8e2d6'],[32,'#c84a3a'],[42,'#7fd07f']]){const s=Math.sin(t+a)*1|0;R(c,x+a+s,y-9,7,9)}},
 garden:(x,y,w,h)=>{R('#4a3020',x,y,w,h);R('#3a2414',x+1,y+1,w-2,h-2);for(let r=0;r<3;r++){R('#5a3a24',x+2,y+3+r*9,w-4,4);for(let i=0;i<5;i++){R('#3a8a3a',x+5+i*8,y+1+r*9,5,4);R('#6ac06a',x+6+i*8,y+1+r*9,2,2)}}},
 barrel:(x,y,w,h)=>{R('#2a4a6a',x,y,w,h);R('#3a6a8a',x+1,y+1,w-2,h-2);R('#1d2a3a',x,y+5,w,2);R('#1d2a3a',x,y+h-6,w,2);R('#6aa0c8',x+2,y+1,w-4,3);R('#9ad0ff',x+3,y+1,4,1)}};
Object.assign(dArt,{
 rug:(x,y,w,h,o)=>{const c=dV(o,'rug')||DVAR.rug[0];R(c[0],x,y,w,h);R(c[1],x+2,y+2,w-4,h-4);R(c[2],x+5,y+5,w-10,h-10);R(c[1],x+7,y+7,w-14,h-14);for(let i=x+1;i<x+w;i+=4){R('#e8d7a8',i,y-2,1,2);R('#e8d7a8',i,y+h,1,2)}},
 flag:(x,y,w,h,o)=>{const c=dV(o,'flag')||DVAR.flag[0],t=performance.now()/300;R('#3a3a3a',x+2,y,2,h);R('#2a2a2a',x,y+h-3,6,3);const s=Math.sin(t)*1.5|0;R(c[0],x+4,y+2+s,10,8);R(c[1],x+6,y+4+s,6,4);R(c[0],x+8,y+5+s,2,2)},
 lights:(x,y,w,h,o)=>{const C=dV(o,'lights')||DVAR.lights[0];R('#3a2818',x,y-10,2,h+10);R('#3a2818',x+w-2,y-10,2,h+10);const on=typeof NIGHT!='undefined'&&NIGHT,t=performance.now()/400;for(let i=0;i<=10;i++){const px=x+1+i*(w-2)/10,py=y-8+Math.sin(i/10*Math.PI)*7;R('#2a2a2a',px|0,py|0,1,1);R(on&&((i+(t|0))%3)?C[i%4]:'#6a6a5a',px-1|0,py+1|0,3,3)}},
 flower:(x,y,w,h,o)=>{const c=dV(o,'flower')||DVAR.flower[0];R('#5a3a24',x,y+4,w,h-4);R('#6a4a2a',x+1,y+5,w-2,h-6);for(let i=0;i<9;i++){const px=x+3+(i*11)%(w-6),py=y+6+(i*7)%(h-10);R('#3a8a3a',px,py+2,1,3);R(c[i%5],px-1,py,3,3)}},
 hammock:(x,y,w,h,o)=>{const c=dV(o,'hammock')||DVAR.hammock[0],t=performance.now()/700,s=Math.sin(t)*1.5;R('#5a3a24',x,y-14,3,h+14);R('#5a3a24',x+w-3,y-14,3,h+14);R('#3a2818',x-1,y+h-2,5,2);R('#3a2818',x+w-4,y+h-2,5,2);
  for(let i=0;i<w-8;i++){const sag=Math.sin(i/(w-8)*Math.PI)*7+s;R(i%6<3?c[0]:c[1],x+4+i,y-8+sag|0,1,5)}R('#d9d0b8',x+3,y-11,2,2);R('#d9d0b8',x+w-5,y-11,2,2)},
 catbed:(x,y,w,h,o)=>{const c=dV(o,'catbed')||DVAR.catbed[0],t=performance.now()/400;R('#6a3a5a',x,y+4,w,h-4);R('#8a4a7a',x+1,y+5,w-2,h-6);R('#a86a98',x+3,y+6,w-6,h-9);R(c[0],x+5,y+5,12,7);R(c[1],x+6,y+5,4,1);R(c[0],x+13,y+3,5,5);R(c[1],x+13,y+3,1,2);R(c[1],x+17,y+3,1,2);R('#1d1714',x+14,y+5,1,1);
  const tl=Math.sin(t)*2|0;R(c[1],x+3,y+7+tl,3,2);const z=(t/2|0)%3;R('#e8e2d6',x+18+z,y-3-z*2,2,2)},
 coop:(x,y,w,h)=>{const t=performance.now()/250;R('#5a3a24',x,y,w,h-8);R('#8a5a34',x+1,y+1,w-2,h-10);R('#a83a2a',x-2,y-6,w+4,7);R('#c84a3a',x-2,y-6,w+4,2);R('#1d1714',x+w/2-4|0,y+6,8,10);for(let i=0;i<w;i+=3)R('#bcb4a0',x+i,y+h-8,1,8);R('#bcb4a0',x,y+h-8,w,1);R('#bcb4a0',x,y+h-1,w,1);
  for(let i=0;i<3;i++){const px=x+4+i*11+(Math.sin(t*.7+i*2)*3|0),pk=((t+i)|0)%4==0?1:0;R('#f0ece0',px,y+h-6+pk,6,4);R('#c8302a',px+4,y+h-7+pk,2,2);R('#e8a030',px+6,y+h-5+pk,1,1)}},
 sunflower:(x,y,w,h)=>{const t=performance.now()/600;for(let i=0;i<3;i++){const sx=x+3+i*7,s=Math.sin(t+i)*1.5|0,top=y+2+i%2*5;R('#3a7a3a',sx+1,top+4,2,y+h-top-4);R('#4aa04e',sx+3,top+12,3,2);R('#ffd030',sx-2+s,top-1,8,8);R('#e8a020',sx-1+s,top,6,6);R('#6a4020',sx+1+s,top+2,2,2)}},
 scarecrow:(x,y,w,h)=>{const t=performance.now()/800,s=Math.sin(t)*1|0;R('#5a3a24',x+9,y+8,2,h-8);R('#5a3a24',x,y+14,w,2);R('#6a7a5a',x+4+s,y+12,12,14);R('#8a2a2a',x+6+s,y+18,3,3);R('#7aa070',x+6+s,y+2,8,9);R('#1d1714',x+8+s,y+5,1,1);R('#1d1714',x+11+s,y+5,1,1);R('#5a3a2a',x+5+s,y,10,3);R('#8a2a2a',x+9+s,y+8,3,1);R('#7aa070',x+s,y+14,4,3);R('#7aa070',x+16+s,y+14,4,3)},
 hoop:(x,y,w,h)=>{const t=performance.now()/350,b=Math.abs(Math.sin(t))*14|0;R('#3a3a3a',x+w-6,y+4,3,h-4);R('#e8e2d6',x+w-14,y,14,10);R('#c84a3a',x+w-11,y+3,6,4);R('#e8e2d6',x+w-10,y+4,4,2);R('#e86a2a',x+w-18,y+9,8,2);for(let i=0;i<3;i++)R('#e8e2d6',x+w-17+i*3,y+11,1,4);R('#e8762a',x+4,y+h-6-b,6,6);R('#a84a1a',x+6,y+h-6-b,1,6);R('#000',x+5,y+h,5,1)},
 radio:(x,y,w,h)=>{const t=performance.now()/500;R('#1d1714',x,y,w,h);R('#3a3a3a',x+1,y+1,w-2,h-2);R('#1d1714',x+3,y+4,6,6);R('#5a5a5a',x+4,y+5,4,4);R('#1d1714',x+13,y+4,6,6);R('#5a5a5a',x+14,y+5,4,4);R('#e8c84a',x+9,y+3,4,2);R('#9a9a9a',x+w-3,y-8,1,8);
  for(let i=0;i<2;i++){const k=((t+i*.5)%1),ny=y-6-k*16|0,nx=x+6+i*8+(Math.sin(k*6)*3|0);g.globalAlpha=1-k;R('#ffd36a',nx,ny,2,3);R('#ffd36a',nx+2,ny-2,1,3);g.globalAlpha=1}},
 guitar:(x,y,w,h)=>{R('#5a3a24',x+2,y+10,14,4);R('#3a2818',x+3,y+14,2,10);R('#3a2818',x+13,y+14,2,10);R('#a8641a',x+14,y+6,9,11);R('#c88a3a',x+15,y+7,7,9);R('#1d1714',x+17,y+10,3,3);R('#5a3a24',x+17,y-8,3,14);R('#2a2a2a',x+16,y-10,5,3)},
 swing:(x,y,w,h)=>{const t=performance.now()/700,a=Math.sin(t)*6|0;R('#5a3a24',x,y,3,h);R('#5a3a24',x+w-3,y,3,h);R('#7a5034',x,y,w,3);R('#9a9a8a',x+12+a/2|0,y+3,1,h-14);R('#9a9a8a',x+w-13+a/2|0,y+3,1,h-14);R('#a8744a',x+10+a,y+h-12,w-20,3)},
 mural:(x,y,w,h,o)=>{const v=(o&&o.v|0)%3;R('#1d1714',x-1,y-1,w+2,h+2);R(['#e8e2d6','#2a3a5a','#f0d0a0'][v],x,y,w,h);if(v==0){R('#ffd030',x+6,y+6,10,10);R('#ff8a3a',x+8,y+8,6,6);R('#3a9a5a',x,y+h-10,w,10);R('#c84a3a',x+28,y+10,6,5);R('#c84a3a',x+34,y+10,6,5);R('#c84a3a',x+30,y+14,8,5)}
  else if(v==1){for(let i=0;i<14;i++)R('#ffffff',x+3+(i*13)%(w-6),y+3+(i*7)%(h-6),1,1);R('#ffd36a',x+w-14,y+5,8,8);R('#2a3a5a',x+w-12,y+5,6,6);R('#5aa8ff',x+4,y+h-8,w-8,3)}else{R('#c84a3a',x+4,y+4,w-8,4);R('#ffd36a',x+4,y+10,w-8,4);R('#3a9a5a',x+4,y+16,w-8,4);R('#2a6aa8',x+4,y+22,w-8,4);R('#1d1714',x+w/2-3|0,y+h-6,6,4)}R('#5a3a24',x+3,y+h,3,4);R('#5a3a24',x+w-6,y+h,3,4)},
 tally:(x,y,w,h)=>{R('#5a3a24',x+3,y+h-6,3,8);R('#5a3a24',x+w-6,y+h-6,3,8);R('#1d1714',x-1,y-1,w+2,h-4);R('#2a3a2a',x,y,w,h-6);R('#e8e2d6',x+3,y+3,w-6,1);const d=Math.min(99,(S&&S.day)|0);for(let i=0;i<Math.min(15,d);i++)R('#e8e2d6',x+3+(i%5)*2+(i/5|0)*10,y+6,1,5);R('#e8e2d6',x+3,y+14,Math.min(w-6,((S&&S.kills)|0)/20+2|0),2);R('#ffd36a',x+3,y+18,4,4)},
 trophy:(x,y,w,h)=>{R('#3a2818',x,y,w,h);R('#5a3a24',x+1,y+1,w-2,h-2);R('#3a2818',x+1,y+h/2|0,w-2,2);const n=Math.max(1,Math.min(8,((S&&S.kills)|0)/100+1|0));for(let i=0;i<n;i++){const tx=x+3+(i%4)*8,ty=y+3+(i/4|0)*(h/2|0);R(i%3==2?'#c0c0c8':'#e8c84a',tx,ty+2,5,4);R(i%3==2?'#a0a0a8':'#c8a030',tx+1,ty+6,3,2);R('#8a6a2a',tx,ty+8,5,2)}},
 candles:(x,y,w,h)=>{const t=performance.now()/120;R('#3a2818',x+w/2-4|0,y+1,8,9);R('#e8e2d6',x+w/2-3|0,y+2,6,6);for(let i=0;i<5;i++){const cx=x+2+i*5,f=Math.sin(t+i*1.7)*1|0;R('#f0ece0',cx,y+h-7,3,6);R('#ffb030',cx,y+h-10+f,3,3);R('#ffe9a0',cx+1,y+h-9+f,1,1)}},
 statue:(x,y,w,h)=>{R('#5a5a56',x,y+h-12,w,12);R('#7a7a74',x+1,y+h-12,w-2,2);R('#8a8a84',x+8,y+10,12,h-22);R('#a8a8a0',x+9,y+10,4,h-22);R('#8a8a84',x+10,y+2,8,9);R('#a8a8a0',x+11,y+3,3,3);R('#8a8a84',x+20,y+6,3,10);R('#8a8a84',x+22,y,2,8);R('#e8c84a',x+w/2-4|0,y+h-8,8,2)},
 pond:(x,y,w,h)=>{const t=performance.now()/600;R('#6a6a5a',x,y,w,h);R('#2a5a8a',x+2,y+2,w-4,h-4);R('#3a7aaa',x+4,y+3,w-8,3);for(let i=0;i<3;i++){const fx2=x+8+((t*8+i*15)%(w-16)),fy=y+8+i*6;R('#ff8a3a',fx2|0,fy,4,2);R('#ffb070',fx2+3|0,fy,1,1)}R('#3a8a3a',x+6,y+h-10,6,4);R('#6ac06a',x+7,y+h-10,2,1);R('#3a8a3a',x+w-14,y+6,6,4);R('#ff8ac0',x+w-12,y+5,2,2)},
 tree:(x,y,w,h)=>{const t=performance.now()/900,s=Math.sin(t)*1.5|0;R('#5a3a24',x+w/2-2|0,y+18,5,h-18);R('#2f6a34',x+3+s,y+2,w-6,20);R('#3a8a3e',x+6+s,y,w-12,14);R('#4aa04e',x+9+s,y+2,8,6);R('#2a5a2e',x+4+s,y+16,w-8,4)},
 birdhouse:(x,y,w,h)=>{const t=performance.now()/500,b=((t|0)%4==0);R('#5a3a24',x+7,y+14,2,h-14);R('#a8744a',x+2,y+4,12,11);R('#7a2a2a',x,y,16,5);R('#1d1714',x+6,y+8,4,4);if(b){R('#5a8ec5',x+12,y+12,4,3);R('#e8a030',x+16,y+13,1,1)}}});
for(const k of DLIST){const D=DECO[k];P('deco_'+k,D[1],null,o=>o.r&&DROT.has(k)?dDrawRot(k,o.x+o.w/2,o.y+o.h/2,o):dArt[k](o.x,o.y,o.w,o.h,o),D[6])}
/* ---------- placing ---------- */
let DPL=null;/* {t, move:id} */
function dSpot(){const p=S.p,f=Math.hypot(p.fx||0,p.fy||0)||1;return[p.x+(p.fx||0)/f*46,p.y+(p.fy||1)/f*46]}
function dOk(){if(!DPL)return'';const[x,y]=dSpot(),D=dDim(DPL.t,DPL.r);if(!(typeof inBase=='function'&&inBase(x,y)))return'거점 안에만 놓을 수 있어요';if(D[6]&&blocker(x,y,Math.min(D[4],D[5])/2))return'여기는 막혀 있어요';
 for(const o of W0.objs)if(o.did!=null&&o.did!==DPL.move&&Math.abs(o.x+o.w/2-x)<(o.w+D[4])/2&&Math.abs(o.y+o.h/2-y)<(o.h+D[5])/2)return'다른 장식과 겹쳐요';
 if(!DPL.move&&!dHave(D[2]))return'재료가 부족해요';return''}
function dHave(c){const p=S.p;return Object.entries(c).every(([k,v])=>((p.inv[k]|0)+((S.base.st||{})[k]|0))>=v)}
function dPay(c,back){const p=S.p;if(back){for(const k in c){const n=Math.floor(c[k]/2);if(n)invAdd(p,k,n)}return}for(const k in c){const a=Math.min(p.inv[k]|0,c[k]);if(a)invTake(p,k,a);if(c[k]-a)S.base.st[k]-=c[k]-a}}
function dStart(t,move){const od=move?DSTORE().find(q=>q.id==move):null;DPL={t,move:move||null,r:od?od.r|0:0};closeBase();PAUSE=false;msg('🪴 '+DECO[t][1]+(move?' 옮기기':' 놓기')+' · 원하는 곳으로 걸어가서 [설치] · 바라보는 쪽 앞에 놓여요')}
function dDo(){const bad=dOk();if(bad)return msg('🪴 '+bad);const[x,y]=dSpot(),B=W0.base,D=DECO[DPL.t];if(DPL.move){const d=DSTORE().find(q=>q.id==DPL.move);if(d){d.rx=Math.round(x-B.ox);d.ry=Math.round(y-B.oy);d.r=DPL.r?1:0}}
 else{dPay(D[2]);S.base.decoN=(S.base.decoN||0)+1;DSTORE().push({t:DPL.t,rx:Math.round(x-B.ox),ry:Math.round(y-B.oy),id:S.base.decoN,r:DPL.r?1:0})}
 const t0=dTier();DPL=null;infRebuild();const t1=dTier();msg('🪴 '+D[1]+' 설치 · 아늑함 '+comfort()+(t1>t0?' · '+DTIER[t1-1][1]+'! '+DTIER[t1-1][2]:''))}
function dRemove(o){const i=DSTORE().findIndex(q=>q.id==o.did);if(i<0)return;const d=DSTORE().splice(i,1)[0];dPay(DECO[d.t][2],true);infRebuild();msg('🪴 '+DECO[d.t][1]+' 치움 · 재료 절반 돌려받음 · 아늑함 '+comfort())}
/* the ghost where it will go (sharp overlay) */
if(typeof OVL!='undefined')OVL.push((g,sx,sy,k)=>{if(!DPL||!S||!S.p)return;const[x,y]=dSpot(),D=dDim(DPL.t,DPL.r),bad=dOk();g.save();g.fillStyle=bad?'#ff6a5a33':'#7fd07f33';g.strokeStyle=bad?'#ff6a5acc':'#7fd07fcc';g.lineWidth=2;g.setLineDash([5,4]);
 g.fillRect(sx(x-D[4]/2),sy(y-D[5]/2),D[4]*k,D[5]*k);g.strokeRect(sx(x-D[4]/2),sy(y-D[5]/2),D[4]*k,D[5]*k);g.setLineDash([]);g.font='600 13px system-ui,sans-serif';g.textAlign='center';g.lineWidth=3;g.strokeStyle='#000a';const tx=D[0]+' '+(bad||D[1]+' 여기에');g.strokeText(tx,sx(x),sy(y-D[5]/2)-8);g.fillStyle='#fff';g.fillText(tx,sx(x),sy(y-D[5]/2)-8);g.restore()});
/* ---------- [상호작용] ---------- */
{const _c=dmCtx;dmCtx=function(){if(DPL){const bad=dOk(),D=DECO[DPL.t];return[{t:'✅ '+D[1]+' 설치'+(bad?' · '+bad:''),f:dDo,off:!!bad,big:1},{t:'✖ 취소',f:()=>{DPL=null;msg('🪴 취소')},sm:1}]}
 const B=_c();try{if(!S||!run||S.dr||typeof DUN!='undefined'&&DUN||!S.base||typeof inBase!='function'||!inBase(S.p.x,S.p.y))return B;const p=S.p;
  let o=null,bd=40;for(const q of W0.objs)if(q.did!=null){const d=Math.hypot(Math.max(q.x-p.x,0,p.x-q.x-q.w),Math.max(q.y-p.y,0,p.y-q.y-q.h));if(d<bd){bd=d;o=q}}
  if(o){const t=o.t.slice(5),D=DECO[t];if(DVAR[t])B.push({t:'🎨 '+D[1]+' 색 바꾸기',f:()=>{const d=DSTORE().find(q=>q.id==o.did);if(d){d.v=((d.v|0)+1)%DVAR[t].length;infRebuild();msg('🎨 '+D[1]+' · '+(d.v+1)+'/'+DVAR[t].length)}},sm:1});B.push({t:'↔ '+D[1]+' 옮기기',f:()=>dStart(t,o.did),sm:1},{t:'🗑 '+D[1]+' 치우기 (재료 절반)',f:()=>dRemove(o),sm:1})}
  if(typeof rqNear=='function'&&rqNear())B.push({t:'🪴 거점 꾸미기 · 아늑함 '+comfort(),f:dOpen})}catch(e){}return B}}
if(typeof IAW!='undefined')IAW.unshift([/설치$|설치 ·/,'설치'],[/거점 꾸미기/,'꾸미기'],[/ 옮기기$/,'옮기기'],[/치우기/,'치우기']);
/* ---------- the sheet ---------- */
function dOpen(){const b=$('bm'),c=comfort(),n=dTier();b.dataset.m='deco';PAUSE=true;const cnt={};for(const d of DSTORE())cnt[d.t]=(cnt[d.t]|0)+1;
 const nx=DTIER[n],bar=nx?Math.min(1,c/nx[0]):1;
 b.innerHTML='<div class="sh"><h2>🪴 거점 꾸미기</h2><div class="wt">아늑함 <b>'+c+'</b>'+(nx?' · 다음 단계까지 '+(nx[0]-c):' · 최고 단계')+'</div><button onclick="closeBase();PAUSE=false">✕</button></div>'+
  '<div class="dqB"><i style="width:'+bar*100+'%"></i></div><div class="dqT">'+DTIER.map(([t,nm,ds],i)=>'<div class="'+(i<n?'on':'')+'"><b>'+nm+'</b> <small>아늑함 '+t+' · '+ds+'</small></div>').join('')+'</div>'+
  '<div class="dqS">'+Object.keys(DTH).map(t=>{const[ic,nm,L,ds]=DTH[t],n2=dSet(t);return'<div class="'+(n2>=3?'on':'')+'"><b>'+ic+' '+nm+' '+Math.min(3,n2)+'/3</b> <small>'+ds+'</small></div>'}).join('')+'</div>'+Object.keys(DTH).map(t=>'<h3 class="dqH">'+DTH[t][0]+' '+DTH[t][1]+' <small>서로 다른 3종 → '+DTH[t][3]+'</small></h3><div class="dqG">'+DTH[t][2].map(k=>{const D=DECO[k],ok=dHave(D[2]);return'<div class="dqI"><canvas data-dp="'+k+'" width="'+(D[4]+12)*2+'" height="'+(D[5]+16)*2+'"></canvas><b>'+D[1]+(cnt[k]?' <small>×'+cnt[k]+'</small>':'')+'</b><small>'+D[7]+'</small><small class="c">아늑함 +'+D[3]+' · '+Object.entries(D[2]).map(([i,v])=>NM2(i)+' '+v).join(' · ')+'</small><button data-dk="'+k+'" class="'+(ok?'':'no')+'">만들어 놓기</button>'+(DVAR[k]?'<small class="v">🎨 색 '+DVAR[k].length+'가지</small>':'')+'</div>'}).join('')+'</div>').join('')+
  '<div class="sub" style="line-height:1.6;margin-top:6px">· 재료는 가방과 창고에서 같이 써요 · 놓은 장식 옆에서 [상호작용]으로 옮기기 · 치우기 (재료 절반)<br>· 텃밭은 매일 아침 통조림 1개, 빗물 통은 물병 1개 · 모닥불과 줄전구는 밤에 빛나요</div>';
 b.style.display='block';
 b.querySelectorAll('canvas[data-dp]').forEach(cv=>{const k=cv.dataset.dp,D=DECO[k],x=cv.getContext('2d'),o=g;g=x;x.imageSmoothingEnabled=false;x.scale(2,2);try{dArt[k](6,12,D[4],D[5])}catch(e){}g=o});
 b.querySelectorAll('[data-dk]').forEach(x=>x.onclick=()=>{const k=x.dataset.dk;if(!dHave(DECO[k][2]))return msg('재료가 부족해요 · '+Object.entries(DECO[k][2]).map(([i,v])=>NM2(i)+' '+v).join(' · '));dStart(k)})}
/* ---------- what comfort does ---------- */
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!S||!S.base||!run||PAUSE||typeof DUN!='undefined'&&DUN)return;const n=dTier();
  if(n>=1&&typeof inBase=='function'){const p=S.p;const hr=dSetOn('rest')?1:.5;if(inBase(p.x,p.y)&&p.hp>0)p.hp=Math.min(MHP(p),p.hp+hr*dt);if(typeof ALLY=='function')for(const a of ALLY()){const z=aEnt(a);if(z&&a.hp>0&&inBase(z.x,z.y))a.hp=Math.min(aMhp(a),a.hp+hr*dt)}}
  if(dSetOn('nat')&&typeof inBase=='function'&&inBase(S.p.x,S.p.y)&&S.p.st!=null)S.p.st=Math.min(100,S.p.st+6*dt);
  if(S.base.decoDay==null)S.base.decoDay=S.day;if(S.day>S.base.decoDay){S.base.decoDay=S.day;const st=S.base.st,got={};const add=(k,v)=>{st[k]=(st[k]|0)+v;got[k]=(got[k]|0)+v};
   const made=dProduce();if(dSetOn('farm'))add('food',2);if(dSetOn('fun')&&typeof ALLY=='function')for(const a of ALLY())if(a.st=='base'||a.st=='job'&&a.job!='scav')a.xp=(a.xp|0)+10;
   if(n>=2){add('food',1);add('water',1)}
   if(n>=3&&typeof ALLY=='function')for(const a of ALLY())if(a.st=='base'||a.st=='job'&&a.job!='scav')a.xp=(a.xp|0)+15;
   const t=Object.entries(got).map(([k,v])=>NM2(k)+' '+v).join(' · ');const m2=[t?'거점 창고에 '+t:'',made].filter(Boolean).join(' · ');if(m2)setTimeout(()=>msg('🏡 아침 · '+m2+(n>=3?' · 거점 동료 경험치 +15':'')),1500)}}}
/* requests pay more when the base is lively */
if(typeof rqReward=='function'){const _r=rqReward;rqReward=function(lv){const R0=_r(lv);try{if(S&&S.base&&dTier()>=3)for(const k in R0)R0[k]=Math.ceil(R0[k]*1.2)}catch(e){}return R0}}
document.head.insertAdjacentHTML('beforeend',`<style>
#bm .dqB{height:8px;border-radius:4px;background:#ffffff1a;overflow:hidden;margin:4px 0 8px}#bm .dqB i{display:block;height:100%;background:linear-gradient(90deg,#7fd07f,#ffd36a)}
#bm .dqT{display:flex;flex-direction:column;gap:3px;margin-bottom:8px}#bm .dqT div{font-size:12px;color:var(--mut);opacity:.7}#bm .dqT div.on{color:#bff0bf;opacity:1}#bm .dqT small{font-size:11px}
#bm .dqG{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px}#bm .dqI{display:flex;flex-direction:column;gap:3px;align-items:center;text-align:center;border:1px solid #ffffff1a;border-radius:12px;padding:8px;background:#ffffff08}
#bm .dqI canvas{image-rendering:pixelated;max-width:100%;height:auto;max-height:84px}#bm .dqI b{font-size:13px}#bm .dqI small{font-size:11px;color:var(--mut);line-height:1.35}#bm .dqI small.c{color:#cfe0a0}#bm .dqI button{margin-top:auto;padding:5px 10px;font-size:12px}#bm .dqI button.no{opacity:.45}</style>`);
/* the memorial set: vouchers for every finished request */
if(typeof rqTurnIn=='function'){const _t=rqTurnIn;rqTurnIn=function(q){const s0=RQS().done;const r=_t.apply(this,arguments);try{if(RQS().done>s0&&dSetOn('mem')){invAdd(S.p,'tkn',3);setTimeout(()=>msg('🏅 기념 세트 · 교환권 +3'),800)}}catch(e){}return r}}
document.head.insertAdjacentHTML('beforeend',`<style>#bm .dqS{display:grid;grid-template-columns:1fr;gap:3px;margin:4px 0 8px}#bm .dqS div{font-size:12px;color:var(--mut);opacity:.75}#bm .dqS div.on{color:#ffd36a;opacity:1}#bm .dqS small{font-size:11px}#bm .dqH{margin:14px 0 6px;font-size:14px}#bm .dqH small{font-weight:400;font-size:11px;color:var(--mut)}#bm .dqI small.v{color:#c0a0ff}</style>`);

/* ---------- producers keep what they make (garden · coop · rain barrel · pond) ----------
   Each morning a producer adds one to its own tray (up to 5). Open it ([상호작용] → 🧺 회수) to take it,
   or link it to a storage box (📦 연결): then it goes into the stash by itself (while the stash has room). */
const DPROD={garden:'food',coop:'food',barrel:'water',pond:'water'},DPCAP=5;
function dBoxNames(){try{const c=stCtx('base');return[bxName(c,-1),...c.H.boxes.map((b,i)=>bxName(c,i))]}catch(e){return['거점 보관함']}}
function dDeliver(d){const id=DPROD[d.t];if(!id||!d.buf||d.to==null)return 0;const put=typeof stPutBase=='function'?stPutBase(id,d.buf):(S.base.st[id]=(S.base.st[id]|0)+d.buf,d.buf);d.buf-=put;return put}
function dProduce(){const sent={},wait={};for(const d of DSTORE()){const id=DPROD[d.t];if(!id)continue;d.buf=Math.min(DPCAP,(d.buf|0)+1);if(d.to!=null){const n=dDeliver(d);if(n)sent[id]=(sent[id]|0)+n}if(d.buf)wait[DECO[d.t][1]]=(wait[DECO[d.t][1]]|0)+d.buf}
 const a=Object.entries(sent).map(([k,v])=>NM2(k)+' '+v).join(' · '),b=Object.entries(wait).map(([k,v])=>k+' '+v).join(' · ');return[a?'📦 보관함으로 '+a:'',b?'🧺 회수 대기: '+b:''].filter(Boolean).join(' · ')}
function dCollect(d){const id=DPROD[d.t],n=d.buf|0;if(!n)return;invAdd(S.p,id,n);d.buf=0;msg('🧺 '+DECO[d.t][1]+'에서 '+NM2(id)+' '+n+'개 회수')}
function dLink(d){const L=dBoxNames();d.to=d.to==null?0:d.to+1>=L.length?null:d.to+1;const n=dDeliver(d);msg(d.to==null?'📦 연결 끔 · 그 자리에 쌓여요 (최대 '+DPCAP+')':'📦 '+L[d.to]+'(으)로 연결 · 매일 아침 자동으로 들어가요'+(n?' · 지금 '+n+'개 보냄':''))}
{const _c=dmCtx;dmCtx=function(){const B=_c();try{if(!S||!run||S.dr||typeof DUN!='undefined'&&DUN||typeof DPL!='undefined'&&DPL)return B;const p=S.p;
  for(const o of W0.objs){if(o.did==null)continue;const t=o.t.slice(5);if(!DPROD[t])continue;if(Math.hypot(Math.max(o.x-p.x,0,p.x-o.x-o.w),Math.max(o.y-p.y,0,p.y-o.y-o.h))>40)continue;const d=DSTORE().find(q=>q.id==o.did);if(!d)break;const L=dBoxNames();
   if(d.buf)B.unshift({t:'🧺 '+DECO[t][1]+' 회수 · '+NM2(DPROD[t])+' '+d.buf,f:()=>dCollect(d),big:1});
   B.push({t:'📦 '+DECO[t][1]+' 보관함 연결: '+(d.to==null?'끔':L[d.to]||'보관함')+' → '+(d.to==null?L[0]:d.to+1>=L.length?'끔':L[d.to+1]),f:()=>dLink(d),sm:1});break}}catch(e){}return B}}
if(typeof IAW!='undefined')IAW.unshift([/회수/,'회수'],[/보관함 연결/,'연결']);
/* a little sign over each producer: what waits in it, or 📦 when linked */
if(typeof OVL!='undefined')OVL.push((g,sx,sy,k)=>{if(!S||!S.base||typeof DUN!='undefined'&&DUN)return;const p=S.p;g.save();g.textAlign='center';g.textBaseline='middle';g.font='600 12px system-ui,sans-serif';
 for(const o of W0.objs){if(o.did==null)continue;const t=o.t.slice(5);if(!DPROD[t])continue;const cx=o.x+o.w/2,cy=o.y-10;if(Math.hypot(cx-p.x,cy-p.y)>420)continue;const d=DSTORE().find(q=>q.id==o.did);if(!d)continue;
  const tx=(d.buf?(DPROD[t]=='food'?'🥫':'💧')+' '+d.buf+(d.buf>=DPCAP?' 가득':''):'')+(d.to!=null?(d.buf?' ':'')+'📦':'');if(!tx)continue;const w=g.measureText(tx).width+12,X=sx(cx),Y=sy(cy);g.fillStyle=d.buf>=DPCAP?'#3a1d0ae6':'#0d1114d9';g.fillRect(X-w/2,Y-9,w,18);g.strokeStyle=d.buf>=DPCAP?'#ffb04a':'#ffffff33';g.lineWidth=1;g.strokeRect(X-w/2+.5,Y-8.5,w-1,17);g.fillStyle='#fff';g.fillText(tx,X,Y+.5)}g.restore()});
