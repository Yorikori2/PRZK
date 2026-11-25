/* PROJECT LEGACY — sample: zombie nests underground, one per mine floor.
   1층 좀비 둥지 · 2층 독 둥지 (spitters, acid) · 3층 거대 둥지 (the 브루트 여왕).
   Each: a cavern walled with living flesh, egg sacs that hatch while you are near, sleepers and guards, a core to kill,
   and a treasure pile you can loot once the core is dead. Nests come back when the mine resets (every 7 waves).
   Loaded after minedeep_next.js and armenh_next.js. */
'use strict';
const HCFG={
 1:{name:'좀비 둥지',at:[.56,.55],rx:7,ry:5,wall:'flesh',core:'heart',hp:1600,cn:'둥지 심장',pods:6,hatch:['crawler','civ1'],sleep:['sleeper','crawler','sleeper'],guards:['heavy','heavy'],light:'210,40,50',glow:'255,210,80',
  pal:{sac:['#2a0a18','#6e1a3a','#8a2a4a','#b03a5a'],core:['#3a0a18','#7a1a32','#c03a5a'],vein:['#7a1a32','#a02a4a']},loot:()=>({otung:4,otitan:4,orare:3,enh4:2,enh3:3,a556:80,medkit:2,[aRune(3)]:1,[aRune(2)]:1}),xp:600},
 2:{name:'독 둥지',at:[.34,.62],rx:7,ry:5,wall:'fleshT',core:'heart',hp:2400,cn:'독 둥지 심장',pods:6,hatch:['spitter','crawler'],sleep:['crawler','sleeper'],guards:['spitter','spitter','bloater'],light:'80,200,60',glow:'170,255,90',acid:1,
  pal:{sac:['#0e2a10','#2a5a1a','#4a7a2a','#7ab03a'],core:['#0e2a10','#2a6a1a','#7ad04a'],vein:['#2a5a1a','#5a9a2a']},loot:()=>({otung:6,otitan:6,orare:5,enh4:3,gasmask:1,a762:80,medkit:3,[aRune(3)]:2}),xp:1200},
 3:{name:'거대 둥지',at:[.72,.7],rx:9,ry:6,wall:'fleshQ',core:'queen',hp:4200,cn:'브루트 여왕',pods:8,hatch:['crawler','crawler','brute'],sleep:['crawler','sleeper'],guards:['brute','brute','heavy'],light:'170,60,220',glow:'220,150,255',
  pal:{sac:['#1a0a2a','#4a1a6a','#6a2a8a','#a05ad0'],core:['#1a0a2a','#5a2a7a','#c08af0'],vein:['#4a1a6a','#8a4ab0']},loot:()=>({otung:10,otitan:10,orare:8,enh4:5,enhg:2,a308:40,medkit:4,[aRune(3)]:3}),xp:2500}};
const HVS=lv=>{const M=MINE0();const k='hive'+(lv>1?lv:'');return M[k]=M[k]||{dead:0,looted:0}};
function HV(lv){lv=lv||mLv();const R0=MREG(),C=HCFG[lv],L=mUp(lv)||MLAD;let c=R0.cols*C.at[0]|0,r=R0.rows*C.at[1]|0;if(Math.hypot(c-L[0],r-L[1])<16){c=R0.cols-1-c;r=R0.rows-1-r}
 c=Math.max(C.rx+2,Math.min(R0.cols-C.rx-3,c));r=Math.max(C.ry+2,Math.min(R0.rows-C.ry-3,r));return{c,r,rx:C.rx,ry:C.ry}}
const hvE=(i,j,lv)=>{const h=HV(lv);return((i-h.c)/h.rx)**2+((j-h.r)/h.ry)**2};
/* cavern open, flesh band around it */
{const _o=mOpenX;mOpenX=(i,j,lv)=>_o(i,j,lv)||(HCFG[lv]&&hvE(i,j,lv)<1)}
{const _mc=mCell;mCell=function(c,r){const lv=mLv(),C=HCFG[lv];if(C){const e=hvE(c,r,lv);if(e>=1&&e<1.9)return C.wall}return _mc(c,r)}}
Object.assign(MHPB,{fleshT:4,fleshQ:5});
for(const[id,n]of[['flesh','살덩이 벽'],['fleshT','독 살덩이 벽'],['fleshQ','뼈 살덩이 벽']])if(!I_BY[id]){const it=[id,n,'m','c',1,'좀비 둥지의 벽'];ITEMS.push(it);I_BY[id]=it}
const FLC={flesh:['#5a1a2a','#7a2a3a','#3a0e1a','#a02a4a','#e0c040'],fleshT:['#1a4a1a','#2a6a2a','#0e2a10','#5a9a2a','#d0f060'],fleshQ:['#4a3a5a','#6a5a7a','#2a1a3a','#d8d0c0','#c08af0']};
for(const k in FLC)MCOL[k]=FLC[k].slice(0,3);
{const _d=D.mtile;D.mtile=function(o){const P2=FLC[o.m];if(!P2)return _d(o);const{x,y,w,h}=o,lv=mLv(),rot=HVS(lv).dead,t=performance.now()/600,C=rot?['#4a4038','#5a5044','#2e2822','#3a342c']:P2;
  R(C[2],x,y,w,h);R(C[0],x,y,w,h-5);R(C[1],x,y,w,4);const v=C[3];R(v,x+3,y+8,w-8,1);R(v,x+10,y+8,1,14);R(v,x+20,y+4,1,10);R(v,x+12,y+18,12,1);
  if(o.m=='fleshQ'&&!rot){R('#d8d0c0',x+4,y+4,2,8);R('#d8d0c0',x+24,y+12,6,2)}
  if(!rot)for(let i=0;i<3;i++){const px=x+5+hh2(o.mc,o.mr,i)*(w-12)|0,py=y+6+hh2(o.mr,o.mc,i+4)*(h-16)|0;g.globalAlpha=.6+.4*Math.sin(t+i+o.mc);R(P2[4],px,py,3,3);g.globalAlpha=1}
  if(o.crack){R('#120e0a',x+14,y+3,2,6+o.crack*12);if(o.crack>.4)R('#120e0a',x+4,y+16,10,2)}}}
/* decorations */
P('hcache','둥지 보물',null,o=>{const{x,y,w,h}=o,lv=mLv(),M=HVS(lv);R('#00000055',x-4,y+h-6,w+8,8);
 for(let i=0;i<9;i++){const bx=x+hh2(i,1,7)*w|0,by=y+hh2(i,2,7)*h|0;R('#d8d0c0',bx,by,8,2);R('#d8d0c0',bx,by-1,2,4);R('#d8d0c0',bx+6,by-1,2,4)}
 if(!M.looted){R('#4f5a35',x+6,y+4,14,10);R('#3e4729',x+6,y+4,14,2);R('#2f4a7a',x+24,y+8,12,9);R('#9aa0a6',x+12,y+16,16,3);R('#c9a030',x+30,y+18,6,3);if(M.dead){g.globalAlpha=.5+.5*Math.sin(performance.now()/200);R('#fff6c0',x+18,y+2,2,2);R('#fff6c0',x+34,y+12,2,2);g.globalAlpha=1}}},false);
{const _dx=mDecoX;mDecoX=function(A,lv,R0,dx,dy){_dx(A,lv,R0,dx,dy);const C=HCFG[lv];if(!C)return;const h=HV(lv),cx=dx+h.c*TS+16,cy=dy+h.r*TS+16,dead=HVS(lv).dead,gore=lv==2?['#1e3a10','#2e5a1a']:lv==3?['#2a1a3a','#4a2a5a']:['#4a0e16','#6e1a22'];
  for(let i=0;i<46+lv*10;i++){const a=hh2(i,3,5+lv)*6.28,rr=Math.sqrt(hh2(i,4,5+lv)),x=cx+Math.cos(a)*rr*h.rx*TS*.92,y=cy+Math.sin(a)*rr*h.ry*TS*.9,s=6+hh2(i,6,5)*14|0;
   W0.dec.push({x:x-s,y:y-s,w:s*2,h:s*2,f:()=>{R(HVS(lv).dead?'#3a2e26':gore[0],x-s/2,y-s/3,s,s*.7);R(HVS(lv).dead?'#2e241e':gore[1],x-s/3,y-s/4,s*.6,s*.4)}})}
  for(let i=0;i<18+lv*6;i++){const a=hh2(i,8,5)*6.28,rr=.3+hh2(i,9,5)*.6,x=cx+Math.cos(a)*rr*h.rx*TS,y=cy+Math.sin(a)*rr*h.ry*TS;W0.dec.push({x:x-6,y:y-4,w:12,h:8,f:()=>{R('#d8d0c0',x-5,y,10,2);R('#d8d0c0',x-6,y-1,2,4);R('#d8d0c0',x+4,y-1,2,4)}})}
  A.o('hcache',h.c*TS+dx-30,(h.r+3)*TS+dy-8,48,26);
  if(!dead){A.light(h.c*TS+dx+16,h.r*TS+dy+16,260+lv*30,.45,C.light);for(let k=0;k<C.pods;k++){const a=k/C.pods*6.28;A.light(h.c*TS+dx+16+Math.cos(a)*h.rx*TS*.62,h.r*TS+dy+16+Math.sin(a)*h.ry*TS*.62,90,.35,C.glow)}}
  else A.light(h.c*TS+dx+16,h.r*TS+dy+16,160,.25,'200,180,140')}}
/* the living parts */
{const _sp=mSpawnX;mSpawnX=function(lv){_sp(lv);const C=HCFG[lv];if(!C||HVS(lv).dead)return;const R0=MREG(),h=HV(lv),cx=R0.x0+h.c*TS+16,cy=R0.y0+h.r*TS+16,
  put=(x,y,o)=>{mk(x,y,{look:o.look||'civ1'});const z=Z[Z.length-1];Object.assign(z,{g:1,hl:lv},o);if(o.hive){z.stun=1e9;z.cd=1e9;z.dmg=0;z.mhp=z.hp=o.hp}return z};
  put(cx,cy+6,{hive:C.core,hp:C.hp,nm:C.cn});
  for(let k=0;k<C.pods;k++){const a=k/C.pods*6.28+.3;put(cx+Math.cos(a)*h.rx*TS*.62,cy+Math.sin(a)*h.ry*TS*.62,{hive:'pod',hp:240*lv,pt:4+k*2})}
  for(let k=0;k<7;k++){const a=k/7*6.28+1,rr=.35+(k%3)*.12;put(cx+Math.cos(a)*h.rx*TS*rr,cy+Math.sin(a)*h.ry*TS*rr,{look:C.sleep[k%C.sleep.length]})}
  C.guards.forEach((l,i)=>put(cx+(i-1)*46,cy+40,{look:l}))}}
function hvDraw(z){const t=performance.now()/1000,x=z.x,y=z.y,c=g,hp=z.hp/z.mhp,C=HCFG[z.hl||1],P2=C.pal;
 const bar=(w,yy,lb)=>{c.fillStyle='#000a';c.fillRect(x-w/2,yy,w,6);c.fillStyle='#ff4a4a';c.fillRect(x-w/2+1,yy+1,(w-2)*hp,4);c.font='600 9px system-ui';c.textAlign='center';c.fillStyle='#fff';c.fillText(lb,x,yy-3)};
 const veins=()=>{for(const q of Z)if(q.hive=='pod'&&q.hl==z.hl){c.strokeStyle=P2.vein[0];c.lineWidth=3;c.beginPath();c.moveTo(x,y-10);c.quadraticCurveTo((x+q.x)/2+8,(y+q.y)/2+14,q.x,q.y-8);c.stroke();c.strokeStyle=P2.vein[1];c.lineWidth=1;c.stroke()}};
 if(z.hive=='queen'){veins();const Sz=ZSZ.brute||64,sp=zs8('brute',(t*2|0)%4,Sz,'d'),s=2.1+.05*Math.sin(t*2.5);c.fillStyle='#00000077';c.beginPath();c.ellipse(x,y+2,Sz*.8,10,0,0,6.28);c.fill();
  c.save();c.globalAlpha=.35;c.globalCompositeOperation='lighter';const gl=c.createRadialGradient(x,y-Sz,0,x,y-Sz,Sz*1.3);gl.addColorStop(0,'rgba(200,120,255,.7)');gl.addColorStop(1,'rgba(200,120,255,0)');c.fillStyle=gl;c.fillRect(x-Sz*1.4,y-Sz*2.4,Sz*2.8,Sz*2.6);c.restore();
  c.drawImage(sp,x-Sz*s/2,y-Sz*s+12,Sz*s,Sz*s);for(let i=0;i<5;i++){c.fillStyle='#e8e0d0';c.fillRect(x-22+i*10,y-Sz*s+8-(i%2?10:16),5,i%2?12:18)}c.fillStyle='#c08af0';c.fillRect(x-2,y-Sz*s+2,4,4);
  if(z.slam>0){c.strokeStyle='rgba(220,150,255,'+z.slam*2+')';c.lineWidth=4;c.beginPath();c.ellipse(x,y,120*(1-z.slam*2)+20,40*(1-z.slam*2)+8,0,0,6.28);c.stroke()}
  bar(84,y-Sz*s-4,C.cn);return true}
 if(z.hive=='heart'){veins();const beat=1+.07*Math.max(0,Math.sin(t*6))+.04*Math.max(0,Math.sin(t*6-1.2)),w=30*beat,h2=24*beat;
  c.fillStyle='#00000066';c.beginPath();c.ellipse(x,y+2,w,8,0,0,6.28);c.fill();
  c.fillStyle=P2.core[0];c.beginPath();c.ellipse(x-w*.35,y-h2,w*.62,h2,0,0,6.28);c.ellipse(x+w*.35,y-h2,w*.62,h2,0,0,6.28);c.fill();
  c.fillStyle=P2.core[1];c.beginPath();c.ellipse(x-w*.35,y-h2-2,w*.5,h2*.82,0,0,6.28);c.ellipse(x+w*.35,y-h2-2,w*.5,h2*.82,0,0,6.28);c.fill();
  c.strokeStyle=P2.core[2];c.lineWidth=1.5;for(let i=0;i<5;i++){c.beginPath();c.moveTo(x-w*.6+i*w*.3,y-h2*1.7);c.lineTo(x-w*.5+i*w*.28,y-h2*.6);c.stroke()}
  const gl=c.createRadialGradient(x,y-h2,0,x,y-h2,w);gl.addColorStop(0,'rgba('+C.glow+','+(.5+.3*Math.sin(t*6))+')');gl.addColorStop(1,'rgba('+C.glow+',0)');c.fillStyle=gl;c.beginPath();c.ellipse(x,y-h2,w*.5,h2*.6,0,0,6.28);c.fill();
  if(C.acid&&Math.random()<.05)fx.push({k:'fl',x:x+(Math.random()-.5)*40,y:y-h2*2,l:.1});bar(64,y-h2*2-16,C.cn);return true}
 const pul=1+.06*Math.sin(t*3+z.x),w=13*pul,h2=12*pul,S2=P2.sac;c.fillStyle='#00000055';c.beginPath();c.ellipse(x,y+1,w,4,0,0,6.28);c.fill();
 c.fillStyle=S2[0];c.beginPath();c.ellipse(x,y-h2,w+1,h2+1,0,0,6.28);c.fill();c.fillStyle=S2[1];c.beginPath();c.ellipse(x,y-h2,w,h2,0,0,6.28);c.fill();
 c.fillStyle=S2[2];c.beginPath();c.ellipse(x-3,y-h2-4,w*.5,h2*.4,0,0,6.28);c.fill();c.strokeStyle=S2[3];c.lineWidth=1;c.beginPath();c.moveTo(x-8,y-h2-6);c.lineTo(x-2,y-h2+4);c.moveTo(x+6,y-h2-8);c.lineTo(x+3,y-h2+6);c.stroke();
 const k2=z.pt!=null?Math.max(0,1-z.pt/12):0,a=.35+.4*k2+.15*Math.sin(t*5);c.fillStyle='rgba('+C.glow+','+a+')';c.beginPath();c.ellipse(x,y-h2,4+3*k2,5+3*k2,0,0,6.28);c.fill();
 if(hp<1){c.fillStyle='#000a';c.fillRect(x-12,y-h2*2-8,24,3);c.fillStyle='#ff6a5a';c.fillRect(x-12,y-h2*2-8,24*hp,3)}return true}
{const _zd=zDraw4;zDraw4=function(z){if(z.hive)return hvDraw(z);return _zd(z)}}
/* behaviour: sacs hatch, the core screams, the toxic nest spits acid, the queen slams */
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!S||!DUN||DUN.sh!='mine')return;const lv=mLv(),C=HCFG[lv],p=S.p,H=Z.find(z=>z.hive&&z.hive!='pod');if(!C||!H)return;
  for(const z of Z){if(z.hive!='pod')continue;if(Math.hypot(z.x-p.x,z.y-p.y)>460)continue;z.pt-=dt;if(z.pt<=0){z.pt=12+Math.random()*5;if(Z.filter(q=>q.hatch).length>=12)continue;const l=C.hatch[Math.random()*C.hatch.length|0];mk(z.x+(Math.random()-.5)*20,z.y+14,{look:l});const n=Z[Z.length-1];n.g=1;n.hatch=1;blood(z.x,z.y,0,0,4);if(!S.hvMsg){S.hvMsg=1;msg('🥚 알주머니에서 좀비가 깨어났어요 · '+C.cn+'을(를) 부수면 모두 멈춰요')}}}
  if(H.hp<H.mhp*.6&&!H.scr){H.scr=1;noise(H.x,H.y,8);for(const z of Z)if(z.sleep)z.sleep=0;msg('🔊 '+C.cn+'이(가) 비명을 질러요! 잠든 좀비가 모두 깨어나요');try{S4.shake=.4}catch(e){}}
  const dp=Math.hypot(H.x-p.x,H.y-p.y);
  if(C.acid&&dp<380){H.at=(H.at||3)-dt;if(H.at<=0){H.at=5;const n=2+(H.hp<H.mhp*.5?2:0);for(let i=0;i<n;i++){const a=Math.random()*6.28,r=60+Math.random()*170;S4.pud.push({x:H.x+Math.cos(a)*r,y:H.y+Math.sin(a)*r*.7,r:26,t:5})}}}
  if(H.hive=='queen'){if(H.slam>0)H.slam-=dt;if(dp<150){H.st=(H.st||2)-dt;if(H.st<=0){H.st=7;H.slam=.5;try{S4.shake=.5}catch(e){}if(dp<130){hurtP(22,'👑 브루트 여왕이 땅을 내리쳤어요!');S4.kd=Math.max(S4.kd,.7*(typeof kdMul=='function'?kdMul(p):1));const d=dp||1;mv(p,(p.x-H.x)/d*50,(p.y-H.y)/d*50,7)}}}}}}
{const _k=kill;kill=function(z){if(!z.hive)return _k(z);const lv=z.hl||1,C=HCFG[lv];dec.push({k:'p',x:z.x,y:z.y+2,r:z.hive=='pod'?10:22});blood(z.x,z.y,0,0,z.hive=='pod'?8:18);
  if(z.hive!='pod'){const M=HVS(lv);M.dead=1;for(const q of Z)if(q.hive=='pod'&&q.hl==lv)q.hp=0;if(typeof s3Xp=='function')s3Xp(C.xp,C.name+' 파괴');for(const l of W0.lights)if(l[4]==C.light||l[4]==C.glow)l[3]=0;msg('💀 '+C.cn+'을(를) 쓰러뜨렸어요! 알주머니가 터지고 벽이 썩어요 · 둥지 보물을 챙기세요')}}}
{const _c=dmCtx;dmCtx=function(){const B=_c();if(!DUN||DUN.sh!='mine')return B;const lv=mLv(),C=HCFG[lv],o=W0.objs.find(q=>q.t=='hcache'),p=S.p;if(!C||!o||Math.hypot(o.x+24-p.x,o.y+13-p.y)>70)return B;const M=HVS(lv);
  if(M.looted)B.unshift({t:'🦴 털어 간 둥지 보물',f:null,info:1});else if(!M.dead)B.unshift({t:'🦴 '+C.name+' 보물 · '+C.cn+'이(가) 살아 있어 손댈 수 없어요',f:null,info:1});
  else B.unshift({t:'🎁 '+C.name+' 보물 챙기기',f:()=>{M.looted=1;give(C.loot())},big:1});return B}}
