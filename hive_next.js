/* PROJECT LEGACY — sample: a zombie base underground (좀비 둥지).
   In the middle of the mine's 1층 sits a cavern the zombies made their own: walls of living flesh, gore on the floor,
   bones, a red glow, 6 알주머니 (egg sacs) that hatch new zombies while you are near, sleeping zombies and two guards,
   and the 둥지 심장 (hive heart) in the middle, linked to every sac by veins.
   Kill the heart → every sac dies, the walls rot, and the 둥지 보물 (bones and stolen gear) can be looted.
   Loaded after minedeep_next.js and armenh_next.js. */
'use strict';
const HV=()=>{const R0=MREG();return{c:R0.cols*.56|0,r:R0.rows*.55|0,rx:7,ry:5}};
const HVS=()=>{const M=MINE0();return M.hive=M.hive||{dead:0,looted:0}};
const hvE=(i,j)=>{const h=HV();return((i-h.c)/h.rx)**2+((j-h.r)/h.ry)**2};
/* the cavern is open; a two-cell band of flesh walls surrounds it */
{const _o=mOpenX;mOpenX=(i,j,lv)=>_o(i,j,lv)||(lv==1&&hvE(i,j)<1)}
{const _mc=mCell;mCell=function(c,r){if(mLv()==1){const e=hvE(c,r);if(e>=1&&e<1.9)return'flesh'}return _mc(c,r)}}
MCOL.flesh=['#5a1a2a','#7a2a3a','#3a0e1a'];
{const _d=D.mtile;D.mtile=function(o){if(o.m!='flesh')return _d(o);const{x,y,w,h}=o,rot=HVS().dead,t=performance.now()/600;const C=rot?['#4a4038','#5a5044','#2e2822']:MCOL.flesh;R(C[2],x,y,w,h);R(C[0],x,y,w,h-5);R(C[1],x,y,w,4);
  const v=rot?'#3a342c':'#a02a4a';R(v,x+3,y+8,w-8,1);R(v,x+10,y+8,1,14);R(v,x+20,y+4,1,10);R(v,x+12,y+18,12,1);
  if(!rot)for(let i=0;i<3;i++){const px=x+5+hh2(o.mc,o.mr,i)*(w-12)|0,py=y+6+hh2(o.mr,o.mc,i+4)*(h-16)|0,a=.6+.4*Math.sin(t+i+o.mc);g.globalAlpha=a;R('#e0c040',px,py,3,3);g.globalAlpha=1}
  if(o.crack){R('#120e0a',x+14,y+3,2,6+o.crack*12);if(o.crack>.4)R('#120e0a',x+4,y+16,10,2)}}}
/* floor gore, bones, red light, the loot pile */
P('hcache','둥지 보물',null,o=>{const{x,y,w,h}=o,dead=HVS().dead,done=HVS().looted;R('#00000055',x-4,y+h-6,w+8,8);
 for(let i=0;i<9;i++){const bx=x+hh2(i,1,7)*w|0,by=y+hh2(i,2,7)*h|0;R('#d8d0c0',bx,by,8,2);R('#d8d0c0',bx,by-1,2,4);R('#d8d0c0',bx+6,by-1,2,4)}
 if(!done){R('#4f5a35',x+6,y+4,14,10);R('#3e4729',x+6,y+4,14,2);R('#2f4a7a',x+24,y+8,12,9);R('#9aa0a6',x+12,y+16,16,3);R('#c9a030',x+30,y+18,6,3);if(dead){g.globalAlpha=.5+.5*Math.sin(performance.now()/200);R('#fff6c0',x+18,y+2,2,2);R('#fff6c0',x+34,y+12,2,2);g.globalAlpha=1}}},false);
{const _dx=mDecoX;mDecoX=function(A,lv,R0,dx,dy){_dx(A,lv,R0,dx,dy);if(lv!=1)return;const h=HV(),cx=dx+h.c*TS+16,cy=dy+h.r*TS+16,dead=HVS().dead;
  for(let i=0;i<46;i++){const a=hh2(i,3,5)*6.28,rr=Math.sqrt(hh2(i,4,5)),x=cx+Math.cos(a)*rr*h.rx*TS*.92,y=cy+Math.sin(a)*rr*h.ry*TS*.9,s=6+hh2(i,6,5)*14|0;
   W0.dec.push({x:x-s,y:y-s,w:s*2,h:s*2,f:()=>{R(dead?'#3a2e26':'#4a0e16',x-s/2,y-s/3,s,s*.7);R(dead?'#2e241e':'#6e1a22',x-s/3,y-s/4,s*.6,s*.4)}})}
  for(let i=0;i<18;i++){const a=hh2(i,8,5)*6.28,rr=.3+hh2(i,9,5)*.6,x=cx+Math.cos(a)*rr*h.rx*TS,y=cy+Math.sin(a)*rr*h.ry*TS;W0.dec.push({x:x-6,y:y-4,w:12,h:8,f:()=>{R('#d8d0c0',x-5,y,10,2);R('#d8d0c0',x-6,y-1,2,4);R('#d8d0c0',x+4,y-1,2,4)}})}
  A.o('hcache',h.c*TS+dx-30,(h.r+3)*TS+dy-8,48,26);
  if(!dead){A.light(h.c*TS+dx+16,h.r*TS+dy+16,260,.45,'210,40,50');for(let k=0;k<6;k++){const a=k/6*6.28;A.light(h.c*TS+dx+16+Math.cos(a)*h.rx*TS*.62,h.r*TS+dy+16+Math.sin(a)*h.ry*TS*.62,90,.35,'230,190,60')}}
  else A.light(h.c*TS+dx+16,h.r*TS+dy+16,160,.25,'200,180,140')}}
/* the living parts: sacs, the heart, sleepers and guards */
{const _sp=mSpawnX;mSpawnX=function(lv){_sp(lv);if(lv!=1||HVS().dead)return;const R0=MREG(),h=HV(),cx=R0.x0+h.c*TS+16,cy=R0.y0+h.r*TS+16,put=(x,y,o)=>{mk(x,y,{look:o.look||'civ1'});const z=Z[Z.length-1];Object.assign(z,{g:1},o);if(o.hive){z.stun=1e9;z.cd=1e9;z.dmg=0;z.mhp=z.hp=o.hp}return z};
  put(cx,cy+6,{look:'civ1',hive:'heart',hp:1600,nm:'둥지 심장'});
  for(let k=0;k<6;k++){const a=k/6*6.28+.3;put(cx+Math.cos(a)*h.rx*TS*.62,cy+Math.sin(a)*h.ry*TS*.62,{look:'civ1',hive:'pod',hp:240,pt:4+k*2})}
  for(let k=0;k<7;k++){const a=k/7*6.28+1,rr=.35+(k%3)*.12;put(cx+Math.cos(a)*h.rx*TS*rr,cy+Math.sin(a)*h.ry*TS*rr,{look:k%3?'sleeper':'crawler'})}
  for(const s of[-1,1])put(cx+s*46,cy+38,{look:'heavy'})}}
/* drawing them */
function hvDraw(z){const t=performance.now()/1000,x=z.x,y=z.y,c=g,hp=z.hp/z.mhp;
 if(z.hive=='heart'){const beat=1+.07*Math.max(0,Math.sin(t*6))+.04*Math.max(0,Math.sin(t*6-1.2)),w=30*beat,h2=24*beat;
  for(const q of Z)if(q.hive=='pod'){c.strokeStyle='#7a1a32';c.lineWidth=3;c.beginPath();c.moveTo(x,y-10);c.quadraticCurveTo((x+q.x)/2+8,(y+q.y)/2+14,q.x,q.y-8);c.stroke();c.strokeStyle='#a02a4a';c.lineWidth=1;c.stroke()}
  c.fillStyle='#00000066';c.beginPath();c.ellipse(x,y+2,w,8,0,0,6.28);c.fill();
  c.fillStyle='#3a0a18';c.beginPath();c.ellipse(x-w*.35,y-h2,w*.62,h2,0,0,6.28);c.ellipse(x+w*.35,y-h2,w*.62,h2,0,0,6.28);c.fill();
  c.fillStyle='#7a1a32';c.beginPath();c.ellipse(x-w*.35,y-h2-2,w*.5,h2*.82,0,0,6.28);c.ellipse(x+w*.35,y-h2-2,w*.5,h2*.82,0,0,6.28);c.fill();
  c.strokeStyle='#c03a5a';c.lineWidth=1.5;for(let i=0;i<5;i++){c.beginPath();c.moveTo(x-w*.6+i*w*.3,y-h2*1.7);c.lineTo(x-w*.5+i*w*.28,y-h2*.6);c.stroke()}
  const gl=c.createRadialGradient(x,y-h2,0,x,y-h2,w);gl.addColorStop(0,'rgba(255,210,80,'+(.5+.3*Math.sin(t*6))+')');gl.addColorStop(1,'rgba(255,80,40,0)');c.fillStyle=gl;c.beginPath();c.ellipse(x,y-h2,w*.5,h2*.6,0,0,6.28);c.fill();
  if(hp<.6){c.fillStyle='#ffd36a';for(let i=0;i<3;i++)c.fillRect(x-14+i*12,y-h2*2+((t*40+i*13)%30),2,4)}
  c.fillStyle='#000a';c.fillRect(x-32,y-h2*2-16,64,6);c.fillStyle='#ff4a4a';c.fillRect(x-31,y-h2*2-15,62*hp,4);c.font='600 9px system-ui';c.textAlign='center';c.fillStyle='#fff';c.fillText('둥지 심장',x,y-h2*2-20);return true}
 const pul=1+.06*Math.sin(t*3+z.x),w=13*pul,h2=12*pul;c.fillStyle='#00000055';c.beginPath();c.ellipse(x,y+1,w,4,0,0,6.28);c.fill();
 c.fillStyle='#2a0a18';c.beginPath();c.ellipse(x,y-h2,w+1,h2+1,0,0,6.28);c.fill();c.fillStyle='#6e1a3a';c.beginPath();c.ellipse(x,y-h2,w,h2,0,0,6.28);c.fill();
 c.fillStyle='#8a2a4a';c.beginPath();c.ellipse(x-3,y-h2-4,w*.5,h2*.4,0,0,6.28);c.fill();c.strokeStyle='#b03a5a';c.lineWidth=1;c.beginPath();c.moveTo(x-8,y-h2-6);c.lineTo(x-2,y-h2+4);c.moveTo(x+6,y-h2-8);c.lineTo(x+3,y-h2+6);c.stroke();
 const k2=z.pt!=null?Math.max(0,1-z.pt/12):0,a=.35+.4*k2+.15*Math.sin(t*5);c.fillStyle='rgba(255,220,90,'+a+')';c.beginPath();c.ellipse(x,y-h2,4+3*k2,5+3*k2,0,0,6.28);c.fill();
 c.fillStyle='#1d0a10';c.fillRect(x-1,y-h2-1,2,3);if(hp<1){c.fillStyle='#000a';c.fillRect(x-12,y-h2*2-8,24,3);c.fillStyle='#ff6a5a';c.fillRect(x-12,y-h2*2-8,24*hp,3)}return true}
{const _zd=zDraw4;zDraw4=function(z){if(z.hive)return hvDraw(z);return _zd(z)}}
/* behaviour: sacs hatch, the heart screams when hurt */
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!S||!DUN||DUN.sh!='mine'||mLv()!=1)return;const p=S.p,H=Z.find(z=>z.hive=='heart');if(!H)return;
  for(const z of Z){if(z.hive!='pod')continue;if(Math.hypot(z.x-p.x,z.y-p.y)>460)continue;z.pt-=dt;if(z.pt<=0){z.pt=12+Math.random()*5;if(Z.filter(q=>q.hatch).length>=12)continue;mk(z.x+(Math.random()-.5)*20,z.y+14,{look:Math.random()<.5?'crawler':'civ1'});const n=Z[Z.length-1];n.g=1;n.hatch=1;blood(z.x,z.y,0,0,4);if(!S.hvMsg){S.hvMsg=1;msg('🥚 알주머니에서 좀비가 깨어났어요 · 둥지 심장을 부수면 모두 멈춰요')}}}
  if(H.hp<H.mhp*.6&&!H.scr){H.scr=1;noise(H.x,H.y,8);for(const z of Z)if(z.sleep)z.sleep=0;msg('🔊 둥지 심장이 비명을 질러요! 잠든 좀비가 모두 깨어나요');try{S4.shake=.4}catch(e){}}}}
{const _k=kill;kill=function(z){if(!z.hive)return _k(z);dec.push({k:'p',x:z.x,y:z.y+2,r:z.hive=='heart'?20:10});blood(z.x,z.y,0,0,z.hive=='heart'?18:8);
  if(z.hive=='heart'){const M=HVS();M.dead=1;for(const q of Z)if(q.hive=='pod')q.hp=0;for(const q of Z)if(q.hatch)q.sleep=0;if(typeof s3Xp=='function')s3Xp(600,'둥지 파괴');
   for(const l of W0.lights)if(l[4]=='210,40,50'||l[4]=='230,190,60')l[3]=0;msg('💀 둥지 심장을 부쉈어요! 알주머니가 모두 터지고 벽이 썩어요 · 둥지 보물을 챙기세요')}}}
{const _c=dmCtx;dmCtx=function(){const B=_c();if(!DUN||DUN.sh!='mine'||mLv()!=1)return B;const o=W0.objs.find(q=>q.t=='hcache'),p=S.p,M=HVS();if(!o||Math.hypot(o.x+24-p.x,o.y+13-p.y)>70)return B;
  if(M.looted)B.unshift({t:'🦴 털어 간 둥지 보물',f:null,info:1});else if(!M.dead)B.unshift({t:'🦴 둥지 보물 · 심장이 살아 있어 손댈 수 없어요',f:null,info:1});
  else B.unshift({t:'🎁 둥지 보물 챙기기',f:()=>{M.looted=1;const r={otung:4,otitan:4,orare:3,enh4:2,enh3:3,a556:80,medkit:2,[aRune(3)]:1,[aRune(2)]:1};give(r)},big:1});return B}}
