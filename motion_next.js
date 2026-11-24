/* PROJECT LEGACY — sample: livelier walking (bigger stride, arm swing, bob) and 8 facing directions
   (adds down-right / down-left / up-right / up-left three-quarter views) for the player, people and zombies. */
'use strict';
/* 8-way facing with a little hysteresis so it doesn't flicker on the borders */
const D8=['r','dr','d','dl','l','ul','u','ur'];
function dir8(fx,fy,old){if(!fx&&!fy)return old||'d';const a=Math.atan2(fy,fx),i=((Math.round(a/(Math.PI/4))%8)+8)%8;if(old&&D8.includes(old)){const oi=D8.indexOf(old),oa=oi*Math.PI/4;let d=a-oa;d=Math.atan2(Math.sin(d),Math.cos(d));if(Math.abs(d)<Math.PI/8*1.35)return old}return D8[i]}
/* the old 4-way drawing with a stronger walk cycle (legs lift 2px, feet move, arms swing further) */
const person4=new Function('return '+person.toString()
 .replace("st*s*2","st*s*3").replace("st*s*2","st*s*3").replace("st*s*2","st*s*3").replace("st*s*2","st*s*3")
 .replace("8-(st>0?1:0)","8-(st>0?2:0)").replace("8-(st<0?1:0)","8-(st<0?2:0)").replace("35-(st>0?1:0)","35-(st>0?2:0)").replace("35-(st<0?1:0)","35-(st<0?2:0)")
 .replace("const armSwing=st*2","const armSwing=st*3")
 .replace("U(o.c,10,17+(st>0?1:0),3,9);U(o.sk,10,26+(st>0?1:0),3,2);U(o.c,24,17+(st<0?1:0),3,9);U(o.sk,24,26+(st<0?1:0),3,2)","U(o.c,10,17+(st>0?2:0),3,9);U(o.sk,10,26+(st>0?2:0),3,2);U(o.c,24,17+(st<0?2:0),3,9);U(o.sk,24,26+(st<0?2:0),3,2)"))();
/* three-quarter views; left-facing ones are mirrored */
function person3q(o,dir,fr,wpn){const v=dir[0],mir=dir[1]=='l',P=mir?(c,x,y,w,h)=>R(c,36-x-w,y,w,h):R,up=v=='u',st=fr<0?0:[0,1,0,-1][fr%4],bb=fr==1||fr==3?-1:0,U=(c,x,y,w,h)=>P(c,x,y+bb,w,h);
 /* legs: far (left) and near (right), stepping along the diagonal */
 const fl=-st*2,nl=st*2;P(o.pd,14+fl,28,4,8-(st>0?1:0));P(o.p,19+nl,28,4,8-(st<0?1:0));P('#231d19',13+fl+(up?0:1),35-(st>0?1:0),5,2);P('#231d19',19+nl+(up?0:1),35-(st<0?1:0),5,2);
 if(up&&o.pack){U(o.c,13,16,11,13);U('#6b4a2a',12,15,9,12);U('#5a3e22',12,15,9,1);U('#8a6a42',14,19,5,3)}else{U(o.c,13,16,11,13);U(o.cl,13,16,2,13);U(o.cd,22,16,2,13);U('#00000030',13,27,11,2)}
 if(o.coat){U(o.c,12,16,13,17);U(o.cd,19,18,1,14)}if(o.vest){U(o.vest,14,17,9,9);U('#00000030',14,25,9,1)}if(o.pack&&!up)U('#5a3e22',15,16,2,10);
 if(o.zb&&!up){U('#6e0e0e',16,20,3,4);U('#8f1616',15,19,2,2)}
 const sw=st*3;
 if(o.zb){if(!up){U(o.c,22,17,3,4);U(o.sk,23,20,8,3);U(o.skd,23,22,8,1);U(o.sk,11,21,3,6)}else{U(o.c,11,17,3,8);U(o.c,22,16,3,7);U(o.sk,23,13,3,4)}}
 else if(wpn=='rifle'){if(!up){U('#6b4426',16,19,4,3);for(let i=0;i<6;i++)U(i?'#1e1e1e':'#3a3a3a',19+i*2,21+i,3,2);U(o.c,20,18,4,4);U(o.sk,21,22,3,2);U(o.sk,27,24,3,2)}else{for(let i=0;i<6;i++)U('#1e1e1e',20+i*2,21-i*2,2,3);U(o.c,20,17,4,5);U(o.sk,22,19,3,2);U(o.c,11,17,3,8)}}
 else if(wpn=='pistol'){if(!up){U(o.c,21,18,5,3);U(o.cd,21,20,5,1);U(o.sk,25,20,3,3);U('#1e1e1e',27,20,5,3);U('#3a3a3a',27,20,5,1);U(o.c,11,17,3,8)}else{U(o.c,22,15,3,6);U(o.sk,22,12,3,3);U('#1e1e1e',23,8,2,5);U(o.c,11,17,3,8)}}
 else{U(o.c,11,17+(sw>0?2:0),3,9);U(o.sk,11,26+(sw>0?2:0),3,2);U(o.c,22+(up?0:1),17+(sw<0?2:0),3,9);U(o.sk,22+(up?0:1),26+(sw<0?2:0),3,2);
  if(wpn){U(wpn=='axe'?'#7a4f2a':'#b0804a',24,20+(sw<0?2:0),2,12);if(wpn=='axe')U('#9aa0a6',23,30+(sw<0?2:0),5,4)}}
 /* head turned toward the near side */
 const hx=14,hw=10;U(o.sk,hx,5,hw,11);U(o.skd,hx,5,2,11);U(o.h,hx,3,hw,4);if(up){U(o.h,hx,5,hw-2,9)}else U(o.h,hx,5,3,6);
 if(o.cap){U(o.cap,hx-1,2,hw+2,3);U(o.cap,hx+hw,4,3,2)}if(o.helm){U(o.helm,hx-1,1,hw+2,5);U('#00000030',hx-1,5,hw+2,1)}if(o.ncap){U(o.ncap,hx+1,1,hw-2,3);U('#d33a3a',hx+4,1,2,2)}
 if(!up){const ey=o.zb?'#d82020':'#1a1a1a';U(ey,hx+4,9,2,2);U(ey,hx+8,9,1,2);if(o.zb){U('#6e0e0e',hx+5,13,4,1);U('#8f1616',hx+6,14,2,2)}if(o.scream)U('#1d1714',hx+5,12,4,3)}}
person=function(o,dir,fr,wpn){return dir&&dir.length==2?person3q(o,dir,fr,wpn):person4(o,dir,fr,wpn)};
/* the player faces where they move / aim, in 8 directions */
{const _dc=drawChar;drawChar=function(look,x,y,dir,fr,wpn,scale){if(look=='player'&&S&&S.p){S.p.d8=dir8(S.p.fx,S.p.fy,S.p.d8);dir=S.p.d8}return _dc.call(this,look,x,y,dir,fr,wpn,scale)}}
/* zombies (and raiders) face the way they actually move */
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!S)return;for(const z of Z){if(z.lx!=null){const dx=z.x-z.lx,dy=z.y-z.ly;if(Math.abs(dx)+Math.abs(dy)>.05)z.d8=dir8(dx,dy,z.d8);else if(z.raider&&z.fx!=null)z.d8=dir8(z.fx,z.fy,z.d8)}z.lx=z.x;z.ly=z.y}}}
{const _zd=zDraw4;zDraw4=function(z){if(z.raider||NEWZ.includes(z.look))return _zd(z);return drawChar(z.look,z.x,z.y,z.d8||z.dir,z.mv?(z.ph|0)%4:-1,null,z.b?1.7:z.look=='heavy'?1.35:1)||true}}
