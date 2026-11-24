/* PROJECT LEGACY — sample: new pixel art for the five turrets. Each has its own base and a head that turns to aim,
   with small idle animations (ammo belt, pilot flame, coil sparks, scope glint). Loaded after outpost_next.js. */
'use strict';
/* the outpost builder tags turret objects with their outpost + index so the head can follow the turret's aim */
{const _lot=BUILDERS.lot;BUILDERS.lot=(c,r,sd)=>{const n0=W0.objs.length;_lot(c,r,sd);const gk=(OGX+c)+','+(OGY+r);for(let i=n0;i<W0.objs.length;i++){const o=W0.objs[i];if(o.t=='turret'&&o.tt)o.gk=gk}}}
const TCOL={mg:['#5a6470','#3e464f','#8a949e'],sg:['#4f5a35','#3e4729','#6b7650'],sn:['#6b5a3a','#4a3e28','#8a7a52'],fl:['#a8441e','#7a3014','#d0622e'],tz:['#6a4a2a','#4a321c','#b87a3a']};
function turRec(o){const op=S&&S.inf&&S.inf.op&&S.inf.op[o.gk];return op&&op.turs&&op.turs[o.tid]}
function turD(o){const t=o.tt,C=TCOL[t],q=turRec(o),a=q?(q.ha!=null?q.ha:q.dir):0,cx=o.x+o.w/2,cy=o.y+o.h/2,T=performance.now()/1000,fire=q&&q.aim!=null&&TCD[o.gk+':'+o.tid]>(TURT[t].cd-.08);
 blob(cx,cy+7,20,7,'#00000038');
 /* base */
 if(t=='mg'){for(let i=0;i<6;i++){const ang=i/6*Math.PI*2;R(i%2?'#b8a47a':'#a89468',cx+Math.cos(ang)*15-6,cy+Math.sin(ang)*8-2,12,6)}R('#2a2e33',cx-6,cy-4,12,8)}
 if(t=='sg'){R('#1d1714',cx-15,cy-3,30,10);R(C[1],cx-14,cy-2,28,8);R(C[2],cx-14,cy-2,28,2);for(let i=0;i<4;i++)R('#c43c32',cx-12+i*7,cy+3,4,3)}
 if(t=='sn'){R('#2a2e33',cx-1,cy-6,2,8);for(const[dx,dy]of[[-12,6],[12,6],[0,9]]){g.strokeStyle='#2a2e33';g.lineWidth=2;g.beginPath();g.moveTo(cx,cy-4);g.lineTo(cx+dx,cy+dy);g.stroke()}}
 if(t=='fl'){for(const dx of[-11,6]){R('#1d1714',cx+dx-1,cy-12,9,18);R(C[0],cx+dx,cy-11,7,16);R(C[2],cx+dx,cy-11,2,16);R('#e8d44a',cx+dx+1,cy-6,5,2)}R('#2a2e33',cx-4,cy+2,8,4)}
 if(t=='tz'){R('#1d1714',cx-9,cy-2,18,8);R('#3a3a40',cx-8,cy-1,16,6);for(let i=0;i<5;i++){R(i%2?'#b87a3a':'#d0924a',cx-5+i*.5,cy-6-i*5,10-i,4)}const gl=.5+.5*Math.sin(T*6);
  g.globalAlpha=.35+.3*gl;R('#7fd0ff',cx-7,cy-36,14,12);g.globalAlpha=1;R('#bff0ff',cx-4,cy-33,8,7);R('#ffffff',cx-2,cy-31,3,3);
  if(Math.sin(T*13+o.tid)>.6){g.strokeStyle='#bff0ff';g.lineWidth=1;g.beginPath();g.moveTo(cx,cy-30);let x=cx,y=cy-30;for(let i=0;i<4;i++){x+=(Math.random()-.5)*12;y+=4+Math.random()*4;g.lineTo(x,y)}g.stroke()}return}
 /* head, turned to aim */
 g.save();g.translate(Math.round(cx),Math.round(cy-(t=='sn'?10:8)));g.rotate(a);
 if(t=='mg'){R('#1d1714',-9,-7,18,14);R(C[0],-8,-6,16,12);R(C[2],-8,-6,16,3);R(C[1],-8,4,16,2);R('#1e1e1e',8,-4,14,3);R('#1e1e1e',8,1,14,3);R('#3a3a3a',8,-4,14,1);
  for(let i=0;i<5;i++)R(i%2?'#d9b52a':'#b8962a',-6+i*3,6+((T*20|0)+i)%2,2,4);if(fire){R('#ffe27a',22,-6,5,10);R('#fff',22,-3,3,4)}}
 if(t=='sg'){R('#1d1714',-10,-8,18,16);R(C[0],-9,-7,16,14);R(C[2],-9,-7,16,3);R('#1e1e1e',7,-6,10,5);R('#1e1e1e',7,1,10,5);R('#000',16,-5,1,3);R('#000',16,2,1,3);if(fire){R('#ffb84a',17,-8,6,16);R('#fff2c0',17,-3,3,6)}}
 if(t=='sn'){R('#1d1714',-8,-5,14,10);R(C[0],-7,-4,12,8);R(C[2],-7,-4,12,2);R('#1e1e1e',5,-1,28,2);R('#3a3a3a',5,-1,28,1);R('#2a2e33',30,-2,4,4);R('#1e1e1e',-4,-9,12,4);
  const gl=Math.sin(T*2+o.tid)>.92;R(gl?'#ffffff':'#5ab0ff',8,-9,2,4);if(fire){R('#ffe27a',33,-3,5,6)}}
 if(t=='fl'){R('#1d1714',-6,-5,12,10);R('#3a3a3a',-5,-4,10,8);R('#7a7f86',5,-2,12,4);R('#1e1e1e',16,-3,3,6);const fl=(T*12|0)%3;R('#ff8a2a',19+fl,-2,3,4);R('#ffd36a',19,-1,2,2);
  if(fire){g.globalAlpha=.85;R('#ff6a1a',20,-6,16,12);R('#ffb84a',20,-3,12,6);g.globalAlpha=1}}
 g.restore()}
{const _d=D.turret;D.turret=o=>{if(!o.tt)return _d(o);const cx=o.x+o.w/2,cy=o.y+o.h/2;g.save();g.translate(cx,cy);g.scale(1.35,1.35);g.translate(-cx,-cy);try{turD(o)}finally{g.restore()}}}

/* heads turn smoothly: toward a target when there is one, otherwise a slow watchful sweep across the arc */
/* heads (and with them the firing arc) turn all the way round: toward the nearest target in range, otherwise a slow
   360° watch. Heavier guns turn slower. After you turn a turret by hand it holds that facing for a few seconds. */
const TSPD={mg:4,sg:3,sn:1.6,fl:3.2,tz:2};
function turHeads(dt){const ops=S&&S.inf&&S.inf.op;if(!ops)return;for(const gk in ops){const o=ops[gk];if(!o.turs)continue;o.turs.forEach((q,i)=>{if(q.ha==null)q.ha=q.dir;q.hold=Math.max(0,(q.hold||0)-dt);
  if(q.want==null){if(q.hold>0)return;q.ha+=(i%2?-1:1)*.55*dt;q.ha=Math.atan2(Math.sin(q.ha),Math.cos(q.ha));return}
  let df=q.want-q.ha;df=Math.atan2(Math.sin(df),Math.cos(df));const sp=(TSPD[q.t]||3)*dt;q.ha+=Math.max(-sp,Math.min(sp,df));q.ha=Math.atan2(Math.sin(q.ha),Math.cos(q.ha))})}}
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(S)turHeads(dt)}}
