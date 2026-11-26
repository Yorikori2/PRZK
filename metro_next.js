/* PROJECT LEGACY — sample: (1) the subway tunnel — the tunnel mouth at the end of a station's tracks leads down into
   a long dark tunnel; walk it to come up at the next station. (2) the radio station's transmission tower — get the map around
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
 mk(ox+W-260,oy+250,{look:'stalker'});mk(ox+W-260,oy+420,{look:'stalker'});
 metroHarden(Z.slice(n0));DUN.amb=0;metroNests(ox,oy,W,to[2]);metroBoss(ox+W-230,oy+340);DUN.W=W;DUN.ox=ox;DUN.oy=oy;
 msg('🚇 지하 선로 · 지상보다 2구역 더 위험 · '+(n+6)+'마리 · 끝 계단 = '+to[2]+'블록 떨어진 지하철역 ('+to[0]+', '+to[1]+') · 둥지 '+(2+(to[2]>=5?1:0))+'개 · 출구를 기관사 거수(보스)가 지켜요');S.metroN=(S.metroN||0)+1}
const MZ=2;/* how many zones harder the tunnel is */
function metroHarden(L){const zn=Math.max(0,zoneOf(...DUN.from)),f=zMulHp(zn+MZ)/zMulHp(zn),fa=zMulAtk(zn+MZ)/zMulAtk(zn);for(const z of L){z.hp*=f;z.mhp*=f;if(z.dmg!=null)z.dmg*=fa;z.metro=1}}
/* halfway: the train horn wakes the line — a pack from behind and from ahead */
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(typeof DUN=='undefined'||!DUN||DUN.sh!='metro'||DUN.amb||!DUN.W)return;const p=S.p;if(p.x<DUN.ox+DUN.W*.42)return;DUN.amb=1;const n0=Z.length;
  for(let i=0;i<7;i++)mk(p.x-520-Math.random()*200,DUN.oy+260+Math.random()*200,{look:i%3?'runner':'dog'});for(let i=0;i<4;i++)mk(p.x+480+Math.random()*200,DUN.oy+260+Math.random()*200,{look:i%2?'runner':'crawler'});
  metroHarden(Z.slice(n0));msg('📢 전동차 경적이 울렸어요 · 앞뒤에서 좀비 떼가 몰려와요!');try{sfx((a,t)=>{tone(a,t,{w:'square',f0:330,f1:320,d:.9,v:.14});tone(a,t+.05,{w:'square',f0:415,f1:405,d:.85,v:.1})})}catch(e){}}}
function metroUp(go){if(!go)return dunExit();const to=DUN.to,fr=DUN.from;mEdge(fr,to,1);dunExit();infGoto(to[0],to[1]);const b=W0.b.find(q=>q.gk==to.join());if(b){const m=W0.objs.find(o=>o.t=='tmouth'&&o.b==W0.b.indexOf(b));S.p.x=m?m.x-30:b.ox+BW/2;S.p.y=m?m.y+50:b.oy+BH-60}
 msg('🚇 ('+to[0]+', '+to[1]+') 지하철역으로 올라왔어요');(S.inf.mline=S.inf.mline||{})[to.join()]=1}
/* ---------- the radio station console ---------- */
const RADIO0=()=>{S.inf.radio=S.inf.radio||{};return S.inf.radio};
function radioMap(gk){const[gx,gy]=gk.split(',').map(Number),sn=S.inf.seen=S.inf.seen||{};let n=0;for(let y=gy-8;y<=gy+8;y++)for(let x=gx-8;x<=gx+8;x++){const k=x+','+y;if(!sn[k]){sn[k]=1;n++}}
 (RADIO0()[gk]=RADIO0()[gk]||{}).map=S.day;sigMsg('📡 송신탑 · 지도 수신','반경 8블록 지도를 받았어요 · 새로 보이는 블록 '+n+'개','미니맵을 누르면 큰 지도 · 위쪽 구역 칩 = 탐험 지도');}
function radioSos(gk){const[gx,gy]=gk.split(',').map(Number),Rn=Math.random;let t=null;for(let i=0;i<60&&!t;i++){const d=3+(Rn()*6|0),a=Rn()*Math.PI*2,x=gx+Math.round(Math.cos(a)*d),y=gy+Math.round(Math.sin(a)*d),k=kindAt(x,y);if(!['park','lot','base','rbase','hospR','milR'].includes(k))t=[x,y,k]}
 if(!t)return sigMsg('📻 송신탑','치지직… 잡음뿐이에요','');S.inf.sos={gx:t[0],gy:t[1],k:t[2],day:S.day,nm:['민지','준호','서연','도윤','하은','지훈'][Rn()*6|0]};(RADIO0()[gk]=RADIO0()[gk]||{}).sos=S.day;
 sigMsg('📻 생존자 신호 수신','"치직… 여기 '+(KNAME[t[2]]||'건물')+'에 갇혔어요… 제발 도와주세요…"','생존자 '+S.inf.sos.nm+' · 블록 ('+t[0]+', '+t[1]+') · '+Math.max(Math.abs(t[0]-gx),Math.abs(t[1]-gy))+'블록 · 노란 화살표를 따라가요')}
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
OVL.push((g2,sx,sy,k)=>{const s=S&&S.inf&&S.inf.sos;if(!s||s.done||typeof DUN!='undefined'&&DUN)return;const[ox,oy]=bo(s.gx-OGX,s.gy-OGY),tx=ox+BW/2,ty=oy+BH/2,p=S.p,dx=tx-p.x,dy=ty-p.y,d=Math.hypot(dx,dy);if(d<BW*.45)return;
 /* a yellow arrow circling you (like the green one to the base), pointing at the survivor */const a=Math.atan2(dy,dx),t=performance.now()/1000,R0=(58+4*Math.sin(t*5))*Math.max(1,k),cx=sx(p.x)+Math.cos(a)*R0,cy=sy(p.y)-16*k+Math.sin(a)*R0;
 g2.save();g2.translate(cx,cy);g2.rotate(a);g2.fillStyle='#ffd36a';g2.strokeStyle='#1d1714';g2.lineWidth=3;g2.beginPath();g2.moveTo(16,0);g2.lineTo(-9,-11);g2.lineTo(-3,0);g2.lineTo(-9,11);g2.closePath();g2.stroke();g2.fill();g2.restore();
 const bl=Math.round(d/(BW+RD));g2.font='bold 11px sans-serif';g2.textAlign='center';const txt='📻 '+s.nm+' '+bl+'블록',w=g2.measureText(txt).width+10;g2.fillStyle='#000a';g2.fillRect(cx-w/2,cy+14,w,16);g2.fillStyle='#ffd36a';g2.fillText(txt,cx,cy+26)});
/* ---------- interaction entries ---------- */
{const _c=dmCtx;dmCtx=function(){const B=_c(),p=S.p;
  if(typeof DUN!='undefined'&&DUN&&DUN.sh=='metro'){for(const o of W0.objs)if(o.t=='mup'&&Math.hypot(o.x+o.w/2-p.x,o.y+o.h/2-p.y)<70)B.unshift({t:o.go?'⬆ 다음 역으로 올라가기 ('+DUN.to.join(', ')+')':'⬆ 처음 역으로 올라가기',f:()=>metroUp(!!o.go),big:1});return B}
  if(typeof DUN!='undefined'&&DUN)return B;
  for(const o of W0.objs){if(o.t=='tmouth'&&Math.hypot(o.x+o.w/2-p.x,o.y+o.h/2-p.y)<80){const at=gOf(o.x,o.y),to=nextStation(at[0],at[1]);B.unshift({t:to?'🚇 지하 터널로 · 다음 역 '+to[2]+'블록':'🚇 지하 터널 (막힘)',f:()=>metroEnter(o),big:1})}
   /* the transmission tower in the fenced yard: fuel powers it for a while, each use takes electronic parts */if(o.t=='mast'&&Math.hypot(o.x+o.w/2-p.x,o.y+o.h-p.y)<80){const gk=gOf(o.x,o.y).join(),st=RADIO0()[gk]=RADIO0()[gk]||{},pw=st.pw>0,has2=k=>(S.p.inv[k]|0);
    const finding=!!(S.inf.sos&&!S.inf.sos.done);
    if(!pw){B.unshift({t:'⛽ 발전기에 연료 넣기 · 연료 1 = '+TPW_MIN+'분 가동'+(has2('fuel')?'':' · 연료 없음'),f:()=>towerFuel(gk),off:!has2('fuel')});B.push({t:'📡 송신탑 · 전원 꺼짐 (연료 먼저)',f:null,off:true,sm:1})}
    else{B.unshift({t:'⛽ 연료 더 넣기 · 남은 '+towerLeft(st),f:()=>towerFuel(gk),off:!has2('fuel'),sm:1});
     B.unshift({t:'📡 송신탑 · 주변 지도 받기 (반경 8블록) · 전자부품 '+TCOST.map,f:()=>{if(!towerPay('map'))return;radioMap(gk)},off:has2('elec')<TCOST.map});
     B.unshift({t:finding?'📻 생존자 신호 · '+S.inf.sos.nm+' 찾는 중':'📻 송신탑 · 생존자 신호 찾기 · 전자부품 '+TCOST.sos,f:()=>{if(!towerPay('sos'))return;radioSos(gk)},off:finding||has2('elec')<TCOST.sos})}}
   if(o.t=='sosnpc'&&Math.hypot(o.x+o.w/2-p.x,o.y+o.h/2-p.y)<60)B.unshift({t:'🤝 생존자 구출 · '+(S.inf.sos?S.inf.sos.nm:''),f:sosSave,big:1})}
  return B}}

/* ---------- an 8-second message box for the tower (then it fades away) ---------- */
let SIGT=null;function sigMsg(h,a,b){let el=$('sigM');if(el)el.remove();clearTimeout(SIGT);document.body.insertAdjacentHTML('beforeend','<div id="sigM"><b>'+h+'</b><div>'+a+'</div>'+(b?'<small>'+b+'</small>':'')+'<i></i></div>');el=$('sigM');
 el.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();el.classList.add('out');setTimeout(()=>el.remove(),400)});SIGT=setTimeout(()=>{const e=$('sigM');if(e){e.classList.add('out');setTimeout(()=>e.remove(),600)}},8000);
 try{sfx((a,t)=>{for(let i=0;i<6;i++)tone(a,t+i*.07,{w:'square',f0:900+Math.random()*900,f1:600,d:.05,v:.04})})}catch(e){}}
document.head.insertAdjacentHTML('beforeend',`<style>#sigM{position:fixed;left:50%;transform:translateX(-50%);top:calc(env(safe-area-inset-top,0px) + 172px);z-index:22;width:min(340px,calc(100vw - 32px));padding:10px 14px 12px;border-radius:14px;background:#1d2a1ef2;border:1.5px solid #7fd07f;box-shadow:0 6px 20px #000a;font-size:13px;line-height:1.5;animation:sigIn .3s;overflow:hidden}
#sigM b{display:block;color:#a8f0a8;font-size:14px;margin-bottom:3px}#sigM small{display:block;color:#cfe8cf;font-size:11.5px;margin-top:4px}#sigM i{position:absolute;left:0;bottom:0;height:3px;background:#7fd07f;animation:sigBar 8s linear forwards}
#sigM.out{opacity:0;transition:opacity .5s}@keyframes sigIn{from{opacity:0;transform:translate(-50%,-8px)}}@keyframes sigBar{from{width:100%}to{width:0}}</style>`);
/* the [상호작용] hint words for the new actions */
if(typeof IAW!='undefined')IAW.unshift([/생존자 신호/,'신호 찾기'],[/지도 받기/,'지도 받기'],[/생존자 구출/,'구출'],[/지하 터널/,'지하 터널'],[/다음 역으로/,'다음 역'],[/처음 역으로/,'올라가기']);

/* ---------- tower power: fuel → running for a while, then electronic parts per use ---------- */
const TPW_MIN=6,TCOST={map:2,sos:3};/* minutes of play per fuel · parts per use */
const towerLeft=st=>{const m=Math.floor(st.pw/60),s2=Math.floor(st.pw%60);return m+':'+String(s2).padStart(2,'0')};
function towerFuel(gk){const p=S.p;if(!(p.inv.fuel>0))return msg('⛽ 연료가 없어요');p.inv.fuel--;const st=RADIO0()[gk]=RADIO0()[gk]||{};st.pw=Math.min(3*TPW_MIN*60,(st.pw||0)+TPW_MIN*60);
 sigMsg('⛽ 발전기 가동','송신탑에 전원이 들어왔어요 · 남은 시간 '+towerLeft(st),'전원이 켜진 동안 전자부품으로 신호 찾기('+TCOST.sos+') · 지도 받기('+TCOST.map+')');try{sfx((a,t)=>{tone(a,t,{w:'sawtooth',f0:60,f1:120,d:1.2,v:.12})})}catch(e){}}
function towerPay(k){const p=S.p,n=TCOST[k];if((p.inv.elec|0)<n){msg('🔌 전자부품이 '+n+'개 필요해요');return false}p.inv.elec-=n;return true}
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!S||!S.inf||!S.inf.radio||PAUSE)return;for(const k in S.inf.radio){const st=S.inf.radio[k];if(st.pw>0){st.pw=Math.max(0,st.pw-dt);if(!st.pw){const[gx,gy]=gOf(S.p.x,S.p.y);if(gx+','+gy==k)msg('⛽ 송신탑 발전기 연료가 떨어졌어요')}}}}}
/* the tower's red light blinks only while powered, plus a hum glow */
{const d0=D.mast;D.mast=o=>{d0(o);let st=null;try{st=RADIO0()[gOf(o.x,o.y).join()]}catch(e){}const x=o.x+o.w/2,y=o.y+o.h;if(!(st&&st.pw>0)){R('#401010',x-2,y-186,4,4);return}
 const t=performance.now()/1000;g.save();g.globalAlpha=.25+.15*Math.sin(t*4);g.fillStyle='#7fd0ff';for(let i=0;i<3;i++){g.beginPath();g.arc(x,y-186,10+((t*30+i*20)%60),0,7);g.globalAlpha=Math.max(0,.4-((t*30+i*20)%60)/150);g.strokeStyle='#7fd0ff';g.lineWidth=2;g.stroke()}g.restore()}}

/* ---------- tunnel nests: they keep hatching while you are near, until you burst them ---------- */
function metroNests(ox,oy,W,len){const xs=[.26,.56].concat(len>=5?[.8]:[]);for(const f of xs){const x=ox+W*f,y=oy+(f<.5?452:262);mk(x,y,{look:'sleeper'});const z=Z[Z.length-1];
  Object.assign(z,{mnest:1,stun:1e9,cd:1e9,dmg:0,g:1,nm:'선로 둥지',pt:2+Math.random()*3});const zn=Math.max(0,zoneOf(...DUN.from))+MZ;z.mhp=z.hp=700*zMulHp(zn)}}
function metroBoss(x,y){mk(x,y,{look:'brute'});const z=Z[Z.length-1];const zn=Math.max(0,zoneOf(...DUN.from))+MZ;Object.assign(z,{g:1,tboss:1,boss:1,nm:'기관사 거수',tbT:3,metro:1});z.mhp=z.hp=1400*zMulHp(zn);z.dmg=(z.dmg||18)*zMulAtk(zn)}
{const _zd=zDraw4;zDraw4=function(z){if(z.mnest){const t=performance.now()/1000,x=z.x,y=z.y,c=g,hp=z.hp/z.mhp,pul=1+.08*Math.sin(t*4+x),w=34*pul,h=26*pul;
   c.fillStyle='#00000066';c.beginPath();c.ellipse(x,y+3,w+6,9,0,0,6.28);c.fill();for(let i=0;i<6;i++){c.strokeStyle='#5a1a1a';c.lineWidth=3;c.beginPath();c.moveTo(x,y-6);c.quadraticCurveTo(x+Math.cos(i)*50,y+Math.sin(i)*14,x+Math.cos(i)*70,y+Math.sin(i)*20);c.stroke()}
   c.fillStyle='#4a1414';c.beginPath();c.ellipse(x,y-h,w+2,h+2,0,0,6.28);c.fill();c.fillStyle='#8a2a2a';c.beginPath();c.ellipse(x,y-h,w,h,0,0,6.28);c.fill();c.fillStyle='#b8443a';c.beginPath();c.ellipse(x-8,y-h-8,w*.45,h*.4,0,0,6.28);c.fill();
   const k2=Math.max(0,1-z.pt/6);c.fillStyle='rgba(255,200,80,'+(.3+.5*k2)+')';c.beginPath();c.ellipse(x,y-h,6+6*k2,7+6*k2,0,0,6.28);c.fill();
   c.fillStyle='#000a';c.fillRect(x-30,y-h*2-14,60,6);c.fillStyle='#ff4a4a';c.fillRect(x-29,y-h*2-13,58*hp,4);c.font='600 9px system-ui';c.textAlign='center';c.fillStyle='#fff';c.fillText('선로 둥지',x,y-h*2-17);return true}
  if(z.tboss){drawConductor(z);return true}
  const r=_zd(z);if(false&&z.tboss){const t=performance.now()/1000,x=z.x,y=z.y,c=g;c.save();c.globalAlpha=.5+.3*Math.sin(t*8);c.fillStyle='#ffe27a';c.beginPath();c.arc(x+2,y-74,5,0,7);c.fill();
   const a=Math.atan2(S.p.y-y,S.p.x-x);c.globalAlpha=.12;c.beginPath();c.moveTo(x,y-70);c.arc(x,y-70,180,a-.3,a+.3);c.closePath();c.fill();c.restore();
   if(z.tbC>0){c.strokeStyle='rgba(255,120,60,.8)';c.lineWidth=3;for(let i=0;i<4;i++){c.beginPath();c.moveTo(x-z.tbX*(20+i*14),y-20-i*6);c.lineTo(x-z.tbX*(40+i*14),y-26-i*6);c.stroke()}}
   const hp=z.hp/z.mhp;c.fillStyle='#000a';c.fillRect(x-45,y-108,90,7);c.fillStyle='#ff6a2a';c.fillRect(x-44,y-107,88*hp,5);c.font='700 10px system-ui';c.textAlign='center';c.fillStyle='#ffd36a';c.fillText('💀 기관사 거수',x,y-112)}return r}}
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(typeof DUN=='undefined'||!DUN||DUN.sh!='metro'||PAUSE)return;const p=S.p;
  for(const z of Z){if(z.mnest&&z.hp>0&&Math.hypot(z.x-p.x,z.y-p.y)<560){z.pt-=dt;if(z.pt<=0){z.pt=6+Math.random()*2;if(Z.filter(q=>q.fromNest&&q.hp>0).length<14){mk(z.x+(Math.random()-.5)*40,z.y+16,{look:Math.random()<.5?'runner':'crawler'});const n=Z[Z.length-1];n.fromNest=1;n.g=1;metroHarden([n])}}}
   if(z.tboss&&z.hp>0){const d=Math.hypot(p.x-z.x,p.y-z.y);if(z.tbC>0){z.tbC-=dt;mv(z,z.tbX*460*dt,z.tbY*460*dt,14);if(!z.tbH&&Math.hypot(p.x-z.x,p.y-z.y)<34){z.tbH=1;hurtP(26*zMulAtk(Math.max(0,zoneOf(...DUN.from))+MZ),'🚂 기관사 거수가 돌진했어요!');try{S4.kd=Math.max(S4.kd,.6)}catch(e){}mv(p,z.tbX*60,z.tbY*60,7)}continue}
    if(d<420){z.tbT-=dt;if(z.tbT<=0){z.tbT=5.5;z.tbC=.75;z.tbH=0;z.tbX=(p.x-z.x)/(d||1);z.tbY=(p.y-z.y)/(d||1);msg('🚂 기관사 거수가 돌진해요!');try{sfx((a,t)=>tone(a,t,{w:'square',f0:220,f1:180,d:.6,v:.14}))}catch(e){}}}
    if(z.hp<z.mhp*.5&&!z.tbK){z.tbK=1;const n0=Z.length;for(let i=0;i<5;i++)mk(z.x+(Math.random()-.5)*200,z.y+(Math.random()-.5)*120,{look:'runner'});metroHarden(Z.slice(n0));msg('📢 기관사 거수의 기적 소리 · 좀비가 몰려와요!')}}}}}
{const _k=kill;kill=function(z){if(z&&z.mnest){dec.push({k:'p',x:z.x,y:z.y+2,r:22});const g2={orn1:1,enh2:1,scrap:6};give(g2);msg('💥 선로 둥지를 터뜨렸어요 · 옵션의 룬 · 중급 강화석 · 고철 6');blood(z.x,z.y,0,0,18);return}
  const r=_k(z);if(z&&z.tboss){if(DUN&&DUN.from)mEdge(DUN.from,DUN.to,2);const g2={enh3:2,orn2:1,tkn:30,carpart:2};give(g2);sigMsg('💀 기관사 거수 처치','보상: 상급 강화석 2 · 옵션의 룬 Ⅱ · 교환권 30 · 차량 부품 2','이 선로는 이제 안전해요 · 역의 터널 입구에서 🗺 노선도로 빠른 이동');try{s3Xp(400,'보스')}catch(e){}}return r}}
if(typeof IAW!='undefined')IAW.unshift([/연료 넣기|연료 더 넣기/,'연료 넣기']);

/* ---------- the conductor colossus: its own drawing (hunched giant in a conductor's uniform, a train's nose fused to
   its chest with the headlight still burning, a rail for a club, chains) ---------- */
function drawConductor(z){const c=g,t=performance.now()/1000,P=S.p,fl=P.x<z.x?-1:1,ch=z.tbC>0,step=Math.sin(t*(ch?14:5)),x=z.x,y=z.y,hp=z.hp/z.mhp;
 const Rq=(col,dx,dy,w,h)=>{c.fillStyle=col;c.fillRect(Math.round(x+(fl>0?dx:-dx-w)),Math.round(y+dy),w,h)};
 c.fillStyle='#00000077';c.beginPath();c.ellipse(x,y+2,34,9,0,0,6.28);c.fill();
 const lean=ch?6:0,b=Math.abs(step)*2;
 /* legs */Rq('#1d1714',-17,-30+b*.5,14,31);Rq('#22304a',-16,-29+b*.5,12,22);Rq('#1d1714',4,-30-b*.5,14,31);Rq('#22304a',5,-29-b*.5,12,22);Rq('#3a2a1e',-18,-4,15,5);Rq('#3a2a1e',4,-4,15,5);
 /* torso: uniform jacket, torn flesh */Rq('#1d1714',-25+lean,-78,52,52);Rq('#2a3a5a',-24+lean,-77,50,50);Rq('#22304a',-24+lean,-77,6,50);Rq('#6a8a5a',-20+lean,-46,12,14);Rq('#4a6a3e',-18+lean,-44,6,8);Rq('#8a1a1a',-16+lean,-40,3,3);
 for(let i=0;i<4;i++)Rq('#e0b03a',-2+lean,-72+i*11,3,3);
 /* the train's nose fused to the chest: red and white plate, the headlight */Rq('#1d1714',2+lean,-70,24,26);Rq('#d8dcdc',3+lean,-69,22,24);Rq('#c43c32',3+lean,-56,22,5);Rq('#3a3f45',3+lean,-69,22,3);
 const lamp=.7+.3*Math.sin(t*9);c.save();c.globalAlpha=lamp;Rq('#fff4b0',10+lean,-66,8,8);Rq('#ffd36a',11+lean,-65,6,6);c.restore();
 c.save();c.globalAlpha=.18*lamp;c.fillStyle='#ffe27a';const lx=x+fl*(14+lean),ly=y-62,a=Math.atan2(P.y-ly,P.x-lx);c.beginPath();c.moveTo(lx,ly);c.arc(lx,ly,200,a-.28,a+.28);c.closePath();c.fill();c.restore();
 /* arms: a chained fist and a bent rail */const sw=ch?-10:step*4;Rq('#1d1714',-35+lean,-74+sw,13,44);Rq('#5a7a4a',-34+lean,-73+sw,11,40);for(let i=0;i<5;i++)Rq(i%2?'#8a9096':'#5a6068',-36+lean,-60+sw+i*6,15,3);Rq('#4a6a3e',-36+lean,-33+sw,14,10);
 Rq('#1d1714',24+lean,-74-sw,12,30);Rq('#5a7a4a',25+lean,-73-sw,10,26);Rq('#3a3f45',27+lean,-50-sw,6,44);Rq('#8a9096',28+lean,-50-sw,2,44);Rq('#3a3f45',20+lean,-8-sw,18,5);
 /* cables */c.strokeStyle='#1d1714';c.lineWidth=2;for(let i=0;i<3;i++){c.beginPath();c.moveTo(x+fl*(4+i*6+lean),y-46);c.quadraticCurveTo(x+fl*(i*7+lean),y-28+step*3,x+fl*(-2+i*8+lean),y-18);c.stroke()}
 /* hunched head with the conductor's cap, red eyes */Rq('#1d1714',-9+lean*1.4,-94,20,18);Rq('#7a9a6a',-8+lean*1.4,-93,18,16);Rq('#5a7a4a',-8+lean*1.4,-80,18,3);Rq('#ff3030',(fl>0?0:-1)+lean*1.4,-87,3,3);Rq('#ff3030',(fl>0?6:5)+lean*1.4,-87,3,3);
 Rq('#1d1714',-12+lean*1.4,-101,26,9);Rq('#22304a',-11+lean*1.4,-100,24,7);Rq('#e0b03a',-11+lean*1.4,-95,24,2);Rq('#1d1714',fl>0?4+lean*1.4:-18-lean*1.4,-95,14,3);
 if(ch){c.strokeStyle='rgba(255,140,60,.85)';c.lineWidth=3;for(let i=0;i<5;i++){c.beginPath();c.moveTo(x-fl*(30+i*12),y-20-i*12);c.lineTo(x-fl*(54+i*12),y-24-i*12);c.stroke()}}
 if(z.hurt>0){c.save();c.globalAlpha=.4;c.fillStyle='#fff';c.fillRect(x-30,y-100,60,100);c.restore()}
 c.fillStyle='#000a';c.fillRect(x-46,y-120,92,8);c.fillStyle='#ff6a2a';c.fillRect(x-45,y-119,90*hp,6);c.font='700 11px system-ui';c.textAlign='center';c.fillStyle='#ffd36a';c.fillText('💀 기관사 거수',x,y-125)}

/* ---------- the line map: stations you have been to, tunnels you walked (dashed) and cleared (solid, safe) ---------- */
const MLINE=()=>{S.inf.mline=S.inf.mline||{};S.inf.medge=S.inf.medge||{};return S.inf};
function mEdge(a,b,v){const I=MLINE(),k=[a.join(),b.join()].sort().join('|');I.mline[a.join()]=1;I.mline[b.join()]=1;I.medge[k]=Math.max(I.medge[k]|0,v)}
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!S||!S.inf||typeof DUN!='undefined'&&DUN)return;const[gx,gy]=gOf(S.p.x,S.p.y),k=gx+','+gy;if(MLINE().mline[k])return;if(kindAt(gx,gy)=='subway')S.inf.mline[k]=1}}
function mSafeFrom(k0){const I=MLINE(),out=new Map([[k0,0]]),q=[k0];while(q.length){const a=q.shift();for(const e in I.medge){if(I.medge[e]<2)continue;const[x,y]=e.split('|');const n=x==a?y:y==a?x:null;if(n&&!out.has(n)){out.set(n,out.get(a)+1);q.push(n)}}}out.delete(k0);return out}
function mTravelOpen(k0){const b=$('bm'),L=[...mSafeFrom(k0)].sort((a,c)=>a[1]-c[1]);b.dataset.m='mline';PAUSE=true;
 b.innerHTML='<div class="sh"><h2>🗺 지하철 노선도</h2><div class="wt">보스를 잡아 안전해진 선로로만 빠르게 이동해요 · 궤도 카트</div><button onclick="closeBase();PAUSE=false">✕</button></div>'+
  (L.length?L.map(([k,n])=>{const[gx,gy]=k.split(',').map(Number),[x0,y0]=k0.split(',').map(Number);return'<button class="mlB" data-go="'+k+'"><b>🚇 ('+gx+', '+gy+') 역</b><small>'+zoneOf(gx,gy)+'구역 · '+Math.max(Math.abs(gx-x0),Math.abs(gy-y0))+'블록 · 선로 '+n+'구간</small></button>'}).join(''):'<div class="sub">아직 안전한 선로가 없어요 · 터널 출구의 기관사 거수를 잡으면 그 선로가 열려요</div>')+
  '<div class="sub" style="margin-top:6px">들른 역 '+Object.keys(MLINE().mline).length+'곳 · 지도에서 노선을 볼 수 있어요 (점선 = 걸어 본 선로 · 초록 실선 = 안전한 선로)</div>';b.style.display='block';
 b.querySelectorAll('[data-go]').forEach(bt=>bt.onclick=()=>{const[gx,gy]=bt.dataset.go.split(',').map(Number);closeBase();PAUSE=false;let f=$('mlF');if(!f){document.body.insertAdjacentHTML('beforeend','<div id="mlF">🚇 궤도 카트로 이동 중…</div>');f=$('mlF')}
  setTimeout(()=>{infGoto(gx,gy);const B=W0.b.find(q=>q.gk==gx+','+gy),m=B&&W0.objs.find(o=>o.t=='tmouth'&&o.b==W0.b.indexOf(B));if(m){S.p.x=m.x-30;S.p.y=m.y+50}msg('🚇 ('+gx+', '+gy+') 역에 도착');setTimeout(()=>{const e=$('mlF');if(e)e.remove()},500)},900)})}
{const _c=dmCtx;dmCtx=function(){const B=_c();if(typeof DUN!='undefined'&&DUN)return B;const p=S.p;for(const o of W0.objs)if(o.t=='tmouth'&&Math.hypot(o.x+o.w/2-p.x,o.y+o.h/2-p.y)<80){const k=gOf(o.x,o.y).join(),n=mSafeFrom(k).size;B.push({t:'🗺 노선도 · 빠른 이동'+(n?' ('+n+'곳)':' (안전한 선로 없음)'),f:()=>mTravelOpen(k),sm:1})}return B}}
if(typeof IAW!='undefined')IAW.unshift([/노선도/,'노선도']);
document.head.insertAdjacentHTML('beforeend',`<style>#bm .mlB{display:block;width:100%;text-align:left;padding:10px 12px;margin:6px 0;border-radius:12px}#bm .mlB small{display:block;color:var(--mut);font-size:11.5px}
#mlF{position:fixed;inset:0;z-index:45;background:#000;display:flex;align-items:center;justify-content:center;font-size:18px;color:#9fe09f;animation:mlF .9s}@keyframes mlF{from{opacity:0}}</style>`);
