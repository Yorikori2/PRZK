/* PROJECT LEGACY — sample: (1) the subway tunnel — the tunnel mouth at the end of a station's tracks leads down into
   a long dark tunnel; walk it to come up at the next station. (2) the radio station console — get the map around
   you, or pick up a survivor's signal, find them and bring them home. Loaded after zone_next.js. */
'use strict';
/* ---------- props ---------- */
P('tmouth','터널 입구',null,o=>{const{x,y,w,h}=o;R('#1d1714',x-6,y-6,w+12,h+12);R('#5a5650',x-4,y-4,w+8,h+8);R('#050506',x,y,w,h);for(let i=0;i<h;i+=14)R('#2a2420',x+4,y+i,w-8,4);R('#e0b03a',x-4,y-4,w+8,3);R('#e0b03a',x-4,y+h+1,w+8,3)},false);
P('mup','지상 계단',null,o=>{const{x,y,w,h}=o;R('#1d1714',x-1,y-1,w+2,h+2);for(let i=0;i<h;i+=5)R(i%10?'#8a9096':'#6a6f75',x,y+i,w,5);R('#7fd07f',x,y,w,3);R('#7fd07f',x+w/2-4,y-16,8,12);R('#1d1714',x+w/2-2,y-14,4,4)},false);
P('sosnpc','생존자',null,o=>{drawChar('surv',o.x+o.w/2,o.y+o.h,'d',0);const t=performance.now()/300;R('#ffd36a',o.x+o.w/2-3,o.y-50+Math.sin(t)*2,6,12);R('#ffd36a',o.x+o.w/2-3,o.y-36+Math.sin(t)*2,6,5)},false);
Object.assign(FLAT,{tmouth:1,mup:1});
if(!LOOKS.surv)LOOKS.surv={...LOOKS.player,c:'#8a6a4a',cl:'#a8865e',cd:'#6e5236',p:'#4a4a52',pd:'#3a3a42',cap:null,h:'#5a3a22'};
/* the tunnel mouth at the right end of every station's tracks */
{const _b=BUILDERS.subway;BUILDERS.subway=function(c,r,sd){_b(c,r,sd);const bi=W0.b.length-1,b=W0.b[bi];W0.objs.push({t:'tmouth',x:b.ox+806,y:b.oy+404,w:50,h:104,b:bi})}}
/* ---------- where does the line go: the nearest other station ---------- */
function nextStation(gx,gy){for(let d=1;d<=24;d++)for(let a=-d;a<=d;a++)for(const[x,y]of[[gx+d,gy+a],[gx-d,gy+a],[gx+a,gy+d],[gx+a,gy-d]])if(kindAt(x,y)=='subway')return[x,y,d];return null}
/* ---------- the tunnel map: three blocks wide, platforms at both ends ---------- */
function buildMetro(){newWorld();const c=(NBX-1)/2|0,r=(NBY-1)/2|0,[ox,oy]=bo(c-1,r),W=3*BW+2*RD,A=Bld('지하 선로',c-1,r,'dun'),Rn=mulberry(DUN.seed);const T=220,B=480;
 A.fl(0,T,W,B-T,'gravel');A.fl(0,T,380,80,'grey');A.fl(W-380,T,380,80,'grey');A.dec(0,T,W,B-T,(X,Y)=>{R('#e0b03a',X,Y+T+78,380,3);R('#e0b03a',X+W-380,Y+T+78,380,3);for(let x=300;x<W;x+=320){R('#3a3f45',X+x,Y+T+2,10,8)}});
 A.o('rail',0,330,W,22);A.o('rail',0,410,W,22);
 const face=(x0,x1,y,h)=>{R('#3a3a3a',x0,y,x1-x0,h);for(let i=x0;i<x1;i+=24)R('#2e2e2e',i,y+4,12,h-10);R('#5a5650',x0,y+h-8,x1-x0,4)};
 /* maintenance rooms above the tunnel, a door in the tunnel wall */const rooms=[[W*.3|0,'정비실'],[W*.62|0,'배전실']];
 let x=-4;for(const[rx]of rooms){A.hw(x,rx-60,T,34,face);x=rx+60}A.hw(x,W+4,T,34,face);A.hw(-4,W+4,B,8,'#3a3a3a');A.vw(0,T,B,34);A.vw(W,T,B,34);
 for(const[rx,nm]of rooms){A.fl(rx-110,60,220,160,'concrete');shell(A,rx-110,60,rx+110,T,face,[]);A.roof(rx-110,60,220,160,'metal',nm,['#3a3f45','#5a5650']);
  const S=nm=='정비실'?[['tool',40,16],['crate',34,24],['locker',24,40],['bench2',60,22],['barrel',16,10]]:[['gen',44,20],['rack',60,18],['crate',34,24],['medshelf',60,18],['console',60,14]];
  S.forEach(([t,w,h],i)=>A.o(t,rx-96+(i%3)*72,74+(i>2?80:0),w,h))}
 A.o('train',W/2-300,360,600,30);A.o('wreck',W*.2|0,446,56,28);A.o('barrel',W*.8|0,300,16,10);A.o('crate',W*.45|0,300,24,20);
 A.o('mup',30,232,60,44,{back:1});A.o('mup',W-90,232,60,44,{go:1});
 for(let x=150;x<W;x+=300)A.light(x,T+50,170,.42,'255,210,140');A.light(60,T+40,200,.6,'160,255,170');A.light(W-60,T+40,200,.6,'160,255,170');
 const gx=OGX+c,gy=OGY+r;for(const[x,y,w,h]of[[0,0,WW,oy+40],[0,oy+B+10,WW,WH],[0,0,ox-4,WH],[ox+W+4,0,WW,WH]])W0.dec.push({x,y,w,h,f:()=>R('#0b0c0e',x,y,w,h)});
 for(let i=W0.b.length-1;i>=0;i--)Object.assign(W0.b[i],{gx,gy,zone:zoneOf(...DUN.from),gk:'dun:metro:'+DUN.from.join()});W0.objs.forEach((o,i)=>o.id='metro:'+DUN.from.join()+':'+i);
 W0.base=Object.assign({},W0.base||{},(()=>{const[bx,by]=bo(-OGX,-OGY);return{ox:bx,oy:by,...BASE}})());W0.car=SURF?SURF.carW:W0.car;return W0}
{const _bw=buildWorld;buildWorld=function(){if(typeof DUN!='undefined'&&DUN&&DUN.sh=='metro')return buildMetro();return _bw.apply(this,arguments)}}
function metroEnter(o){const p=S.p,c=(NBX-1)/2|0,r=(NBY-1)/2|0;const at=gOf(o.x,o.y);if(at.join()!=(OGX+c)+','+(OGY+r))infGoto(...at);const to=nextStation(at[0],at[1]);if(!to)return msg('🚧 선로가 무너져 막혔어요 · 이 역은 다른 역과 이어지지 않아요');
 SURF={x:p.x,y:p.y,Z,dec,carW:W0.car};DUN={sh:'metro',seed:bh(at[0],at[1],13)*1e6|0,gk:'metro:'+at.join(),from:at,to:[to[0],to[1]],len:to[2]};Z=[];dec=[];buildWorld();infDerived();
 const[ox,oy]=bo(c-1,r),W=3*BW+2*RD;addSolid({x:0,y:0,w:WW,h:oy+40,wall:1});addSolid({x:0,y:oy+490,w:WW,h:WH,wall:1});addSolid({x:0,y:0,w:ox,h:WH,wall:1});addSolid({x:ox+W,y:0,w:WW,h:WH,wall:1});
 p.x=ox+130;p.y=oy+270;document.body.dataset.dun='metro';
 /* underground = two zones more dangerous than the station above, more of them the longer the line, guards at the far stairs */
 const Rn=mulberry(DUN.seed+3),L=['civ1','civ2','runner','crawler','sleeper','runner','spitter','civ3'],n0=Z.length,n=16+to[2]*4;for(let i=0;i<n;i++)mk(ox+450+Rn()*(W-800),oy+250+Rn()*210,{look:L[Rn()*L.length|0]});
 for(let k=0;k<2;k++)mk(ox+W/2+(k?340:-340),oy+440,{look:'heavy'});mk(ox+W/2,oy+300,{look:'screamer'});
 mk(ox+W-200,oy+300,{look:'brute'});mk(ox+W-260,oy+250,{look:'stalker'});mk(ox+W-260,oy+420,{look:'stalker'});
 metroHarden(Z.slice(n0));DUN.amb=0;DUN.W=W;DUN.ox=ox;DUN.oy=oy;
 msg('🚇 지하 선로 · 지상보다 2구역 더 위험 · '+(n+6)+'마리 · 끝 계단 = '+to[2]+'블록 떨어진 지하철역 ('+to[0]+', '+to[1]+') · 출구를 브루트가 지켜요');S.metroN=(S.metroN||0)+1}
const MZ=2;/* how many zones harder the tunnel is */
function metroHarden(L){const zn=Math.max(0,zoneOf(...DUN.from)),f=zMulHp(zn+MZ)/zMulHp(zn),fa=zMulAtk(zn+MZ)/zMulAtk(zn);for(const z of L){z.hp*=f;z.mhp*=f;if(z.dmg!=null)z.dmg*=fa;z.metro=1}}
/* halfway: the train horn wakes the line — a pack from behind and from ahead */
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(typeof DUN=='undefined'||!DUN||DUN.sh!='metro'||DUN.amb||!DUN.W)return;const p=S.p;if(p.x<DUN.ox+DUN.W*.42)return;DUN.amb=1;const n0=Z.length;
  for(let i=0;i<7;i++)mk(p.x-520-Math.random()*200,DUN.oy+260+Math.random()*200,{look:i%3?'runner':'dog'});for(let i=0;i<4;i++)mk(p.x+480+Math.random()*200,DUN.oy+260+Math.random()*200,{look:i%2?'runner':'crawler'});
  metroHarden(Z.slice(n0));msg('📢 전동차 경적이 울렸어요 · 앞뒤에서 좀비 떼가 몰려와요!');try{sfx((a,t)=>{tone(a,t,{w:'square',f0:330,f1:320,d:.9,v:.14});tone(a,t+.05,{w:'square',f0:415,f1:405,d:.85,v:.1})})}catch(e){}}}
function metroUp(go){if(!go)return dunExit();const to=DUN.to;dunExit();infGoto(to[0],to[1]);const b=W0.b.find(q=>q.gk==to.join());if(b){const m=W0.objs.find(o=>o.t=='tmouth'&&o.b==W0.b.indexOf(b));S.p.x=m?m.x-30:b.ox+BW/2;S.p.y=m?m.y+50:b.oy+BH-60}
 msg('🚇 ('+to[0]+', '+to[1]+') 지하철역으로 올라왔어요');(S.inf.mline=S.inf.mline||{})[to.join()]=1}
/* ---------- the radio station console ---------- */
const RADIO0=()=>{S.inf.radio=S.inf.radio||{};return S.inf.radio};
function radioMap(gk){const[gx,gy]=gk.split(',').map(Number),sn=S.inf.seen=S.inf.seen||{};let n=0;for(let y=gy-8;y<=gy+8;y++)for(let x=gx-8;x<=gx+8;x++){const k=x+','+y;if(!sn[k]){sn[k]=1;n++}}
 (RADIO0()[gk]=RADIO0()[gk]||{}).map=S.day;msg('📡 반경 8블록 지도를 받았어요 · 새로 보이는 블록 '+n+'개 · 지도(M)에서 확인');try{if(typeof openMap=='function')openMap()}catch(e){}}
function radioSos(gk){const[gx,gy]=gk.split(',').map(Number),Rn=Math.random;let t=null;for(let i=0;i<60&&!t;i++){const d=3+(Rn()*6|0),a=Rn()*Math.PI*2,x=gx+Math.round(Math.cos(a)*d),y=gy+Math.round(Math.sin(a)*d),k=kindAt(x,y);if(!['park','lot','base','rbase','hospR','milR'].includes(k))t=[x,y,k]}
 if(!t)return msg('📻 잡음뿐이에요');S.inf.sos={gx:t[0],gy:t[1],k:t[2],day:S.day,nm:['민지','준호','서연','도윤','하은','지훈'][Rn()*6|0]};(RADIO0()[gk]=RADIO0()[gk]||{}).sos=S.day;
 msg('📻 "여기 '+(KNAME[t[2]]||'건물')+'에 갇혔어요… 도와주세요" · 생존자 '+S.inf.sos.nm+' · ('+t[0]+', '+t[1]+') · 화면 가장자리 화살표를 따라가요')}
/* the survivor appears inside that building when you are there */
function sosPlace(){const s=S.inf&&S.inf.sos;if(!s||s.done||typeof DUN!='undefined'&&DUN)return;const b=W0.b.find(q=>q.gk==s.gx+','+s.gy);if(!b)return;if(W0.objs.some(o=>o.t=='sosnpc'))return;
 const bi=W0.b.indexOf(b),rf=W0.roofs.filter(q=>q.bi==bi).sort((a,c)=>c.w*c.h-a.w*a.h)[0];let x=rf?rf.x+rf.w/2:b.ox+BW/2,y=rf?rf.y+rf.h/2:b.oy+BH/2;
 for(let i=0;i<40&&blocker(x,y,10);i++){x+=(Math.random()-.5)*60;y+=(Math.random()-.5)*60}const o={t:'sosnpc',x:x-10,y:y-8,w:20,h:10,b:bi,id:'sos'};W0.objs.push(o);try{addD({k:'o',r:o},o.x-20,o.y-110,o.w+40,o.h+110)}catch(e){}
 if(!s.horde){s.horde=1;for(let i=0;i<6;i++)mk(x+(Math.random()-.5)*300,y+(Math.random()-.5)*260,{look:['civ1','civ2','runner'][i%3]})}}
{const _ir=infRebuild;infRebuild=function(){const r=_ir.apply(this,arguments);try{sosPlace()}catch(e){}return r}}
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(S&&S.inf&&S.inf.sos&&!S.inf.sos.done){const[gx,gy]=gOf(S.p.x,S.p.y);if(Math.abs(gx-S.inf.sos.gx)<=1&&Math.abs(gy-S.inf.sos.gy)<=1)sosPlace()}}}
function sosSave(){const s=S.inf.sos;s.done=1;W0.objs=W0.objs.filter(o=>o.t!=='sosnpc');try{infDerived()}catch(e){}S.inf.saved=(S.inf.saved||0)+1;const g={food:3,water:3,bandage:2,medkit:1,tkn:15};give(g);s3Xp&&s3Xp(150,'구출');
 msg('🤝 '+s.nm+' 구출! 거점으로 보냈어요 · 보답: 음식 3 · 물 3 · 붕대 2 · 구급상자 · 교환권 15 · 구출한 생존자 '+S.inf.saved+'명 (다음 단계: NPC 동료)');S.inf.sos=null}
/* arrow at the screen edge toward the signal */
OVL.push((g2,sx,sy,k)=>{const s=S&&S.inf&&S.inf.sos;if(!s||s.done||typeof DUN!='undefined'&&DUN)return;const[ox,oy]=bo(s.gx-OGX,s.gy-OGY),tx=ox+BW/2,ty=oy+BH/2,p=S.p,dx=tx-p.x,dy=ty-p.y,d=Math.hypot(dx,dy);if(d<BW/2)return;
 const W=g2.canvas.width,H=g2.canvas.height,a=Math.atan2(dy,dx),cx=W/2+Math.cos(a)*Math.min(W,H)*.38,cy=H/2+Math.sin(a)*Math.min(W,H)*.38;g2.save();g2.translate(cx,cy);g2.rotate(a);g2.fillStyle='#ffd36a';g2.strokeStyle='#1d1714';g2.lineWidth=3;
 g2.beginPath();g2.moveTo(18,0);g2.lineTo(-10,-11);g2.lineTo(-4,0);g2.lineTo(-10,11);g2.closePath();g2.stroke();g2.fill();g2.restore();g2.font='bold 12px sans-serif';g2.textAlign='center';g2.fillStyle='#ffd36a';g2.fillText('📻 '+s.nm+' · '+Math.round(d/(BW+RD))+'블록',cx,cy+26)});
/* ---------- interaction entries ---------- */
{const _c=dmCtx;dmCtx=function(){const B=_c(),p=S.p;
  if(typeof DUN!='undefined'&&DUN&&DUN.sh=='metro'){for(const o of W0.objs)if(o.t=='mup'&&Math.hypot(o.x+o.w/2-p.x,o.y+o.h/2-p.y)<70)B.unshift({t:o.go?'⬆ 다음 역으로 올라가기 ('+DUN.to.join(', ')+')':'⬆ 처음 역으로 올라가기',f:()=>metroUp(!!o.go),big:1});return B}
  if(typeof DUN!='undefined'&&DUN)return B;
  for(const o of W0.objs){if(o.t=='tmouth'&&Math.hypot(o.x+o.w/2-p.x,o.y+o.h/2-p.y)<80){const at=gOf(o.x,o.y),to=nextStation(at[0],at[1]);B.unshift({t:to?'🚇 지하 터널로 · 다음 역 '+to[2]+'블록':'🚇 지하 터널 (막힘)',f:()=>metroEnter(o),big:1})}
   if(o.t=='mic'&&Math.hypot(o.x+o.w/2-p.x,o.y+o.h/2-p.y)<90){const gk=gOf(o.x,o.y).join(),st=RADIO0()[gk]||{};
    B.unshift({t:st.map==S.day?'📡 지도 받기 (오늘 함)':'📡 주변 지도 받기 · 반경 8블록',f:()=>radioMap(gk),off:st.map==S.day});
    B.unshift({t:S.inf.sos&&!S.inf.sos.done?'📻 생존자 신호 · '+S.inf.sos.nm+' 찾는 중':st.sos==S.day?'📻 신호 찾기 (오늘 함)':'📻 생존자 신호 찾기',f:()=>radioSos(gk),off:!!(S.inf.sos&&!S.inf.sos.done)||st.sos==S.day})}
   if(o.t=='sosnpc'&&Math.hypot(o.x+o.w/2-p.x,o.y+o.h/2-p.y)<60)B.unshift({t:'🤝 생존자 구출 · '+(S.inf.sos?S.inf.sos.nm:''),f:sosSave,big:1})}
  return B}}
