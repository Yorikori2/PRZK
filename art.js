/* PROJECT LEGACY — shared HD pixel art (32px tiles, 3/4 top-down).
   Every prop is drawn from its floor footprint (x,y,w,h) and a height H:
   top face = footprint shifted up by H, front face = H tall below it. */
'use strict';
let g=null,NIGHT=false;
const R=(c,x,y,w,h)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))};
const hh=(a,b,k=0)=>{let h=Math.imul((a|0)+k*131,374761393)+Math.imul(b|0,668265263)|0;h=Math.imul(h^h>>>13,1274126177);return((h^h>>>16)>>>0)/4294967296};
const blob=(cx,cy,rx,ry,c)=>{g.fillStyle=c;for(let d=-ry;d<=ry;d++){const w=Math.round(rx*Math.sqrt(Math.max(0,1-(d*d)/(ry*ry))));g.fillRect(Math.round(cx-w),Math.round(cy+d),w*2,1)}};
const ln=(x0,y0,x1,y1,c)=>{const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1)|0;g.fillStyle=c;for(let i=0;i<=n;i++)g.fillRect(Math.round(x0+(x1-x0)*i/n),Math.round(y0+(y1-y0)*i/n),1,1)};
const shd=(x,y,w,h,a=.26)=>{g.fillStyle='rgba(10,8,6,'+a+')';g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))};
function B3(x,y,w,h,H,top,face,o={}){if(o.sd!==false)shd(x+3,y+3,w,h);R(o.ol||'#1d1714',x-1,y-H-1,w+2,h+H+2);R(top,x,y-H,w,h);if(o.hi!==false)R(o.hi||'#ffffff38',x,y-H,w,1);R(face,x,y+h-H,w,H);R('#00000030',x,y+h-H,w,1)}
const PAL6=['#c94f3a','#3a7bc9','#e0b03a','#4fa05a','#f4f4ee','#e07a3a'];

/* ---------- floors ---------- */
function tiles(x0,y0,w,h,s,a,b,gr,hl){const x1=x0+w,y1=y0+h;for(let y=y0;y<y1;y+=s)for(let x=x0;x<x1;x+=s){const tw=Math.min(s,x1-x),th=Math.min(s,y1-y);R((((x-x0)/s+(y-y0)/s)|0)%2?a:b,x,y,tw,th);if(gr){R(gr,x+tw-1,y,1,th);R(gr,x,y+th-1,tw,1)}if(hl&&hh(x,y,9)<.12)R(hl,x+2,y+2,Math.min(5,tw-3),2)}}
const FLOORS={
 vinylG:(x,y,w,h)=>tiles(x,y,w,h,16,'#cad6cd','#c2cfc6'),
 tileB:(x,y,w,h)=>tiles(x,y,w,h,16,'#dde7ec','#d5e0e6','#c4d1d8','#e9f0f3'),
 tileP:(x,y,w,h)=>tiles(x,y,w,h,16,'#c9c9d2','#c2c2cc','#b5b5c0'),
 hall:(x,y,w,h)=>tiles(x,y,w,h,32,'#d3d5d4','#cdcfce','#bfc2c1'),
 vinylW:(x,y,w,h)=>tiles(x,y,w,h,16,'#d9dcd2','#d2d5cb'),
 stone:(x,y,w,h)=>tiles(x,y,w,h,32,'#dccfb8','#d6c9b1','#c6baa4'),
 grey:(x,y,w,h)=>tiles(x,y,w,h,16,'#cfd3d5','#c6cbce'),
 small:(x,y,w,h)=>tiles(x,y,w,h,8,'#eef1f1','#e4e8e8','#d0d6d6'),
 wood:(x,y,w,h)=>{for(let yy=y;yy<y+h;yy+=8)for(let xx=x;xx<x+w;xx+=32){const tw=Math.min(32,x+w-xx),th=Math.min(8,y+h-yy);R(hh(xx,yy)<.5?'#a87a4e':'#a2744a',xx,yy,tw,th);R('#8f6640',xx,yy+th-1,tw,1);const j=((yy/8)%2?12:26);if(j<tw)R('#8f6640',xx+j,yy,1,th)}},
 woodD:(x,y,w,h)=>{for(let yy=y;yy<y+h;yy+=8)for(let xx=x;xx<x+w;xx+=32){const tw=Math.min(32,x+w-xx),th=Math.min(8,y+h-yy);R(hh(xx,yy)<.5?'#7a5233':'#74502f',xx,yy,tw,th);R('#5e3e26',xx,yy+th-1,tw,1);const j=((yy/8)%2?10:24);if(j<tw)R('#5e3e26',xx+j,yy,1,th)}},
 carpet:(x,y,w,h)=>{R('#56657a',x,y,w,h);for(let i=0;i<w*h/60;i++)R(hh(i,x+y)<.5?'#4e5c70':'#5e6e84',x+hh(i,1,x)*w,y+hh(i,2,y)*h,1,1)},
 carpetR:(x,y,w,h)=>{R('#7a3e3e',x,y,w,h);for(let i=0;i<w*h/60;i++)R(hh(i,x+y)<.5?'#6e3434':'#864848',x+hh(i,1,x)*w,y+hh(i,2,y)*h,1,1)},
 concrete:(x,y,w,h)=>{R('#8e9296',x,y,w,h);for(let i=0;i<w*h/90;i++)R(hh(i,x,y)<.5?'#84888c':'#989ca0',x+hh(i,3,x)*w,y+hh(i,4,y)*h,2,2);for(let yy=y+64;yy<y+h;yy+=64)R('#7a7e82',x,yy,w,1);for(let xx=x+64;xx<x+w;xx+=64)R('#7a7e82',xx,y,1,h)},
 check:(x,y,w,h)=>tiles(x,y,w,h,16,'#e8e4dc','#3a3a40'),
 gym:(x,y,w,h)=>{for(let yy=y;yy<y+h;yy+=6)for(let xx=x;xx<x+w;xx+=48){R(hh(xx,yy)<.5?'#d8a466':'#d29e60',xx,yy,Math.min(48,x+w-xx),Math.min(6,y+h-yy));R('#b8844a',xx,yy+5,Math.min(48,x+w-xx),1)}},
 dirt:(x,y,w,h)=>{R('#8a7a5a',x,y,w,h);for(let i=0;i<w*h/50;i++)R(hh(i,x,y)<.5?'#7a6a4a':'#9a8a6a',x+hh(i,5,x)*w,y+hh(i,6,y)*h,hh(i,7)<.3?2:1,1)},
 gravel:(x,y,w,h)=>{R('#9a968c',x,y,w,h);for(let i=0;i<w*h/30;i++)R(['#8a867c','#aaa69c','#7f7b72'][i%3],x+hh(i,8,x)*w,y+hh(i,9,y)*h,hh(i,1)<.4?2:1,1)},
 asphalt:(x,y,w,h)=>{R('#45484e',x,y,w,h);for(let i=0;i<w*h/60;i++)R(hh(i,7,x)<.5?'#3d4045':'#50535a',x+hh(i,8,y)*w,y+hh(i,9,x)*h,1,1)},
 walk:(x,y,w,h)=>tiles(x,y,w,h,16,'#b3b1a9','#b3b1a9','#9f9d95'),
 grass:(x,y,w,h)=>{R('#3b5a30',x,y,w,h);for(let i=0;i<w*h/90;i++)R(hh(i,1,x+y)<.5?'#335028':'#4a6b3a',x+hh(i,2,x)*w,y+hh(i,3,y)*h,2,1)},
 tileK:(x,y,w,h)=>tiles(x,y,w,h,16,'#e2e6e2','#dadfda','#c8cec8'),
};
function floor(x,y,w,h,k){(FLOORS[k]||FLOORS.grey)(x,y,w,h)}

/* ---------- walls ---------- */
function vwallD(x,y0,y1,top=10){R('#2c2724',x-4,y0-top-7,8,y1-y0+top-1);R('#f1f1ec',x-3,y0-top-6,6,y1-y0+top-3);R('#d8d8d2',x+2,y0-top-6,1,y1-y0+top-3);R('#b8b2a6',x-3,y1-9,6,9);R('#00000040',x-3,y1-1,6,1)}
function hwallD(x0,x1,y,h,face){R('#2c2724',x0-1,y-h-7,x1-x0+2,h+7);R('#f1f1ec',x0,y-h-6,x1-x0,6);R('#ffffff',x0,y-h-6,x1-x0,1);R('#cfcfc8',x0,y-h-1,x1-x0,1);
 if(typeof face=='function')face(x0,x1,y-h,h);else{R(face||'#c9c2b4',x0,y-h,x1-x0,h);R('#ffffff30',x0,y-h,x1-x0,1);R('#00000030',x0,y-2,x1-x0,2)}}
function winD(wx,ww,y,h){R('#e9ece8',wx-2,y+4,ww+4,h-11);R('#5f8aa6',wx,y+6,ww,h-15);for(let i=0;i<ww;i++)R('#7aa3bd',wx+i,y+6,1,Math.max(0,(h-15)-((i*3)%Math.max(1,h-15))));R('#e9ece8',wx+ww/2-1,y+6,2,h-15);ln(wx+3,y+h-12,wx+9,y+7,'#cde6f3');R('#c9ccc6',wx-3,y+h-7,ww+6,2)}
function doorLeaf(x,y,len,dir,c='#8a5a33'){if(dir=='v'){R('#2c2724',x-1,y-len,4,len);R(c,x,y-len+1,2,len-2)}else{R('#2c2724',x,y-1,len,4);R(c,x+1,y,len-2,2)}}
/* generic wall faces */
function faceWall(c1,c2,trim){return(x0,x1,y,h)=>{R(c1,x0,y,x1-x0,h);if(c2)for(let x=x0+6;x<x1;x+=10)R(c2,x,y+2,1,h-12);R(trim||'#00000030',x0,y+h-3,x1-x0,3)}}
function faceTile(c1,c2){return(x0,x1,y,h)=>{R(c1,x0,y,x1-x0,h);for(let yy=y;yy<y+h;yy+=6)R(c2,x0,yy,x1-x0,1);for(let xx=x0;xx<x1;xx+=8)R(c2,xx,y,1,h);R('#00000030',x0,y+h-3,x1-x0,3)}}
function faceBrick(c1,c2){return(x0,x1,y,h)=>{R(c1,x0,y,x1-x0,h);for(let yy=y;yy<y+h;yy+=4){R(c2,x0,yy,x1-x0,1);for(let xx=x0+((yy/4)%2?0:4);xx<x1;xx+=8)R(c2,xx,yy,1,4)}R('#00000030',x0,y+h-3,x1-x0,3)}}

/* ---------- props: registry ---------- */
const D={},NM={},LOOTT={},SOLID={};
function P(t,n,loot,d,solid=true){D[t]=d;NM[t]=n;if(loot)LOOTT[t]=loot;SOLID[t]=solid}
/* medical */
P('bed','침대',['bandage','food','ammo'],o=>{const{x,y,w,h}=o,v=h>=w;B3(x,y,w,h,8,'#a8b0b5','#7f878c');R('#eef2f2',x+2,y-6,w-4,h-4);
 if(v){R('#f8fafa',x+5,y-4,w-10,9);R(o.c||'#6f9cc4',x+2,y+8,w-4,h-16);for(let i=x+4;i<x+w-2;i+=5)R('#00000018',i,y+10,1,h-20);R('#ffffff40',x+3,y+9,w-6,1)}
 else{R('#f8fafa',x+3,y-4,9,h-10);R(o.c||'#6f9cc4',x+14,y-6,w-16,h-4);for(let i=y-4;i<y+h-8;i+=5)R('#00000018',x+16,i,w-20,1)}
 if(o.bl){blob(x+w/2,y+h/3,7,5,'#6e0e0e');blob(x+w/2-2,y+h/3-1,4,3,'#8f1616')}if(o.rail){R('#9aa3a8',x-2,y+10,2,22);R('#9aa3a8',x+w,y+10,2,22)}});
P('bunk','2층 침대',['bandage','food','ammo'],o=>{const{x,y,w,h}=o;B3(x,y,w,h,22,'#6a7a4a','#4f5a35');R('#3a3f45',x,y-22,2,h+22);R('#3a3f45',x+w-2,y-22,2,h+22);R('#d8d8cc',x+3,y-20,w-6,8);R('#5a6a3a',x+2,y-12,w-4,h-10);R('#4a5a2a',x+2,y-12,w-4,1);R('#3a3f45',x,y+h-14,w,2)});
P('cot','간이침대',['food'],o=>{const{x,y,w,h}=o;B3(x,y,w,h,6,'#9aa0a6','#6a6f75');R('#7a7f85',x+2,y-4,w-4,h-6);R('#c9c9c0',x+3,y-4,w-6,6)});
P('curtain','커튼',null,o=>{const{x,y,h}=o;R('#3a4a48',x-1,y-30,4,1);for(let yy=y-28;yy<y+h-28;yy+=2)R(((yy/2)%3)?'#8ec4bb':'#74aea4',x,yy,3,2);R('#00000025',x+3,y-26,2,h-2)},false);
P('iv','링거대',['bandage'],o=>{const x=o.x+4,y=o.y+o.h;shd(x-4,y-1,10,4);R('#3a3f45',x-4,y-2,9,2);R('#9aa0a6',x,y-36,1,34);R('#9aa0a6',x-3,y-36,7,1);R('#5a7f8c',x-4,y-35,7,10);R('#cfe8f0',x-3,y-34,5,8);R('#f2fbff',x-2,y-33,1,3);ln(x,y-26,x+5,y-16,'#d8e8ee')});
P('mcart','의료 카트',['bandage','bandage','scrap'],o=>{const{x,y,w,h}=o,c=o.c||'#c43c32';B3(x,y,w,h,20,c,'#00000000');R(c,x,y+h-20,w,20);R('#00000040',x,y+h-20,w,20);for(let i=0;i<3;i++){R('#00000040',x+1,y+h-17+i*5,w-2,1);R('#e8e8e8',x+w/2-2,y+h-16+i*5,4,1)}R('#1a1a1a',x+1,y+h,3,2);R('#1a1a1a',x+w-4,y+h,3,2);R('#e8e8e8',x+3,y-18,6,3)});
P('wheelchair','휠체어',null,o=>{const x=o.x,y=o.y+o.h;shd(x,y-2,22,6);blob(x+3,y-6,4,6,'#1d1d1d');blob(x+3,y-6,2,4,'#4a4a4a');blob(x+19,y-6,4,6,'#1d1d1d');blob(x+19,y-6,2,4,'#4a4a4a');R('#1d1714',x+4,y-19,14,14);R('#3a6ea8',x+5,y-18,12,12);R('#5a8ec8',x+5,y-18,12,1);R('#9aa0a6',x+4,y-22,14,2);R('#9aa0a6',x+3,y-20,2,14);R('#9aa0a6',x+17,y-20,2,14)});
P('cabinet','약품장',['bandage','bandage','food'],o=>{const{x,y,w,h}=o;B3(x,y,w,h,16,'#e8eef0','#c9d3d8');for(let i=0;i<w-4;i+=4)R(PAL6[(i/4)%6],x+2+i,y+h-14,3,5);R('#ffffff99',x+2,y+h-14,1,5);R('#9fb6c2',x+w/2,y+h-8,1,7)});
P('sink','세면대',['water','water','bandage'],o=>{const{x,y,w,h}=o,n=o.n||1;B3(x,y,w,h,12,'#f4f6f6','#c9d0d0');for(let i=0;i<n;i++){const bw=(w-4)/n-4,bx=x+4+i*((w-4)/n);R('#6f8590',bx-1,y-11,bw+2,8);R('#9fb0ba',bx,y-10,bw,6);R('#c8d6dc',bx,y-10,bw/2,2);R('#c9ccd0',bx+bw/2-1,y-14,3,3)}});
P('optable','수술대',['bandage','bandage'],o=>{const{x,y,w,h}=o;shd(x+4,y+4,w,h);R('#37474f',x+w/2-6,y+h-8,12,8);B3(x,y,w,h-2,8,'#cfd8dc','#90a4ae',{sd:false});R('#6fa58f',x+3,y-6,w-6,h-8);for(let i=x+6;i<x+w-4;i+=6)R('#7fb59f',i,y-4,2,h-12);blob(x+12,y+1,5,5,'#c9a88a');blob(x+w*.6,y+1,8,4,'#8f1616')});
P('monitor','심전도 모니터',['scrap'],o=>{const x=o.x,y=o.y+o.h;shd(x+2,y-2,22,6);R('#3a3f45',x+9,y-16,3,16);R('#2a2d30',x+2,y-3,18,3);R('#1d1714',x-1,y-35,24,20);R('#2a2f35',x,y-34,22,18);R('#0b1a12',x+2,y-32,18,12);
 const t=(performance.now()/1000);for(let i=0;i<18;i++){const ph=(i+(t*20|0))%18,v=ph==6?-5:ph==7?4:ph==8?-2:0;R('#5fe08a',x+2+i,y-26+v,1,1)}});
P('anest','마취기',['scrap','bandage'],o=>{const{x,y,w,h}=o;B3(x,y,w,h,28,'#dfe5e8','#b8c2c8');R('#2a2f35',x+3,y+h-26,w-6,8);R('#5fb0e0',x+5,y+h-24,w-10,4);[[4,'#3a7bc9'],[10,'#4fa05a'],[16,'#e0e0e0']].forEach(([a,c])=>R(c,x+a,y-36,3,8))});
P('tray','기구 트레이',['bandage','scrap'],o=>{const x=o.x,y=o.y+o.h;shd(x+2,y-2,18,5);R('#9aa0a6',x+8,y-14,2,14);R('#3a3f45',x+3,y-2,12,2);R('#1d1714',x-1,y-21,20,9);R('#b0bcc2',x,y-20,18,7);R('#dfe7ea',x,y-20,18,1);R('#e8e8e8',x+3,y-18,6,1);R('#8f1616',x+12,y-18,3,2)});
P('xray','엑스레이 장비',['scrap','scrap'],o=>{const{x,y,w,h}=o;R('#4a4f55',x+w/2-12,y+h-6,24,6);B3(x,y,w,h,10,'#e8ecee','#b8c0c4');R('#2a2f35',x+4,y-8,w-8,h-6);R('#3a4048',x+5,y-7,w-10,2)});
P('leadglass','납유리 칸막이',null,o=>{const{x,y,w}=o;R('#2c2724',x-1,y-26,w+2,28);R('#4a5f6a',x,y-25,w,6);R('#9fc4d4',x,y-19,w,17);R('#ffffff55',x+4,y-17,1,13);R('#e8c43a',x,y-25,w,1)});
P('exam','진찰 침대',['bandage'],o=>{const{x,y,w,h}=o;B3(x,y,w,h,8,'#6f8a9e','#4f6a7e');R('#f4f4ee',x+6,y-6,w-12,h-4);R('#e2e2da',x+6,y-6,w-12,1);R('#7f9aae',x+2,y-12,w-4,8)});
P('stool','의자',null,o=>{const x=o.x+5,y=o.y+o.h;shd(x-5,y-2,12,3);R('#555',x,y-8,2,8);blob(x+1,y-10,5,3,'#3a3f45');blob(x+1,y-11,4,2,'#5a6068')});
P('gurney','이동 침대',['bandage'],o=>{const{x,y,w,h}=o;R('#555',x+4,y+h-4,2,4);R('#555',x+w-6,y+h-4,2,4);B3(x,y,w,h-2,12,'#a8b0b5','#7f878c');R('#eef2f2',x+3,y-10,w-6,h-6);blob(x+w*.55,y-4,8,4,'#7d1212')});
P('medshelf','의약품 선반',['bandage','bandage','water','food'],o=>{shelfD(o,'#e8eef0','#c9d3d8',['#f4f4ee','#c94f3a','#3a7bc9','#e0b03a','#4fa05a'])});
/* office / civic */
P('desk','책상',['scrap','bandage','ammo'],o=>{const{x,y,w,h}=o;R('#4a3420',x+2,y+h-4,3,4);R('#4a3420',x+w-5,y+h-4,3,4);B3(x,y,w,h-3,14,o.c||'#b08454','#8a6440');
 if(o.pc!==false){R('#1d1714',x+5,y-24,20,14);R('#26292d',x+6,y-23,18,12);R('#3a6ea8',x+8,y-21,14,8);R('#8fc0ea',x+9,y-20,5,1);R('#3a3f45',x+13,y-11,4,2);R('#2a2a2a',x+28,y-9,14,4)}R('#f2f0e8',x+w-16,y-11,10,7);R('#c9c0a8',x+w-15,y-9,8,1)});
P('chair','의자',null,o=>{const x=o.x+6,y=o.y+o.h;shd(x-6,y-2,14,4);R('#2a2a2a',x-5,y-2,12,2);R('#555',x,y-8,2,6);R('#1d1714',x-6,y-15,14,8);R(o.c||'#3a3f45',x-5,y-14,12,6);R('#1d1714',x-5,y-23,12,10);R('#2e3236',x-4,y-22,10,8);R('#4a5058',x-4,y-22,10,1)});
P('counter','접수대',['bandage','food','scrap'],o=>{const{x,y,w,h}=o,fc=o.fc||'#4f7ea6';B3(x,y,w,h,24,'#ece6da',fc);R('#00000030',x,y+h-24,w,2);R('#ffffff30',x,y+h-22,w,1);R('#f4f4ee',x+w/2-7,y+h-12,14,8);if(o.logo=='bar'){}else if(o.logo=='badge'){R('#d9b52a',x+w/2-4,y+h-11,8,7);R(fc,x+w/2-2,y+h-9,4,3)}else{R('#d33a3a',x+w/2-2,y+h-11,4,6);R('#d33a3a',x+w/2-5,y+h-9,10,2)}
 [8,w-30].forEach(a=>{R('#1d1714',x+a-1,y-36,18,13);R('#26292d',x+a,y-35,16,11);R('#3a6ea8',x+a+2,y-33,12,7)});R('#f2f0e8',x+40,y-20,10,6);R('#d9b52a',x+62,y-19,3,3)});
P('chairs','대기 의자',null,o=>{const{x,y,w}=o,n=Math.round(w/24),yb=y+o.h;shd(x+2,yb-2,n*24,5);R('#5f676c',x,yb-6,n*24,2);const c=o.c||'#3a6ea8';for(let i=0;i<n;i++){const ax=x+i*24;R('#5f676c',ax+10,yb-4,2,4);R('#1d1714',ax,yb-21,22,16);R(c,ax+1,yb-20,20,9);R('#ffffff40',ax+1,yb-20,20,1);R('#00000040',ax+1,yb-13,20,6)}});
P('vending','자판기',['food','water','water'],o=>{const{x,y,w,h}=o;B3(x,y,w,h,44,o.c||'#c43c32','#00000000');R(o.c||'#c43c32',x,y+h-44,w,44);R('#00000030',x,y+h-8,w,8);R('#111',x+2,y+h-41,14,28);R('#1d2c38',x+3,y+h-40,12,26);for(let r=0;r<4;r++)for(let k=0;k<3;k++)R(PAL6[(r+k)%4],x+5+k*4,y+h-38+r*6,2,4);R('#ffffff40',x+4,y+h-39,1,24);R('#2a2a2a',x+18,y+h-34,4,8);R('#5fe08a',x+19,y+h-33,2,1)});
P('cooler','정수기',['water','water'],o=>{const x=o.x,y=o.y+o.h;shd(x+2,y-2,14,4);R('#1d1714',x-1,y-23,14,23);R('#e8eef0',x,y-22,12,22);R('#c9d3d8',x,y-6,12,6);R('#3a6ea8',x+2,y-14,2,2);R('#c94f3a',x+7,y-14,2,2);R('#2c5682',x,y-35,12,13);R('#6fb3e0',x+1,y-34,10,11);R('#b5dcf5',x+2,y-33,2,8)});
P('plant','화분',null,o=>{const s=o.big?1.4:1,x=o.x+o.w/2,y=o.y+o.h;shd(x-6*s,y-2,14*s,4);R('#5a2e1a',x-5*s,y-9*s,10*s,9*s);R('#8b4a2b',x-4*s,y-8*s,8*s,7*s);blob(x,y-16*s,9*s,7*s,'#2f6b33');blob(x-3*s,y-19*s,5*s,4*s,'#3f8a40');blob(x+3*s,y-14*s,4*s,3*s,'#3f8a40');blob(x-2*s,y-21*s,2,2,'#5aa04f')});
P('pillar','기둥',null,o=>{const{x,y,w,h}=o;B3(x,y,w,h,48,'#e8e2d4','#d4ccbc');R('#c4bca8',x,y+h-8,w,8);R('#ffffff40',x+2,y+h-44,2,32);R('#00000020',x+w-4,y+h-44,3,34)});
P('wetsign','주의 표지판',null,o=>{const x=o.x+5,y=o.y+o.h;shd(x-4,y-2,12,3);R('#2a2a2a',x-5,y-16,12,16);R('#e8c43a',x-4,y-15,10,14);R('#2a2a2a',x,y-12,2,6);R('#2a2a2a',x,y-5,2,2)},false);
P('bench','벤치',null,o=>{const{x,y,w,h}=o;R('#555',x+3,y+h-4,2,4);R('#555',x+w-5,y+h-4,2,4);B3(x,y,w,h-2,8,o.c||'#8a6a45','#5e4a30');for(let i=x+3;i<x+w-2;i+=6)R('#00000025',i,y-7,1,h-4)});
P('extinguisher','소화기',null,o=>{const x=o.x+3,y=o.y+o.h;shd(x-2,y-2,8,3);R('#1d1714',x-4,y-15,9,15);R('#d33a3a',x-3,y-14,7,14);R('#f05a50',x-3,y-14,7,1);R('#2a2a2a',x-2,y-17,4,3);R('#f4f4ee',x-2,y-10,5,3)});
P('shelf','선반',['wood','scrap','bandage','ammo','food'],o=>shelfD(o,'#8a5a33','#6b4426',PAL6));
P('bookshelf','책장',['wood','scrap'],o=>shelfD(o,'#7a5233','#5e3e26',['#c94f3a','#3a7bc9','#e0b03a','#4fa05a','#8a4fc9','#e8e2d6']));
function shelfD(o,c1,c2,items){const{x,y,w,h}=o,v=h>w;if(v){B3(x,y,w,h,14,c1,c2);for(let yy=y-12;yy<y+h-16;yy+=6){R('#00000020',x+1,yy+5,w-2,1);for(let i=0;i<(w-4)/4;i++)R(items[(yy+i*7)%items.length],x+2+i*4,yy+1,3,4)}}
 else{B3(x,y,w,h,18,c1,c2);for(let i=0;i<w-4;i+=4){R(items[(i/4)%items.length],x+2+i,y+h-16,3,5);R(items[(i/4+2)%items.length],x+2+i,y+h-9,3,4)}R('#00000030',x,y+h-10,w,1)}}
P('locker','사물함',['ammo','scrap','bandage'],o=>{const{x,y,w,h}=o,v=h>w,n=Math.max(1,Math.round((v?h:w)/18));B3(x,y,w,h,30,o.c||'#7f8c96','#5f6c76');
 for(let i=0;i<n;i++){if(v){R('#3a4048',x+2,y-28+i*18,w-4,1)}else{const lx=x+i*(w/n);R('#3a4048',lx,y+h-30,1,30);R('#3a4048',lx+3,y+h-26,w/n-6,1);R('#3a4048',lx+3,y+h-23,w/n-6,1);R('#d9b52a',lx+w/n-5,y+h-16,2,3)}}});
P('fridge','냉장고',['food','food','water','water'],o=>{const{x,y,w,h}=o;B3(x,y,w,h,40,'#eef2f3','#d8e0e3');R('#9aa4aa',x,y+h-22,w,1);R('#6a7378',x+w-4,y+h-36,1,8);R('#6a7378',x+w-4,y+h-18,1,10)});
P('kitchen','조리대',['food','water','scrap'],o=>{const{x,y,w,h}=o;B3(x,y,w,h,16,'#e8e2d6','#7a6a5a');for(let xx=x+2;xx<x+w-2;xx+=16)R('#00000030',xx,y+h-14,1,14);if(o.stove!==false){[[4,0],[10,0],[4,5],[10,5]].forEach(([a,b])=>R('#2b2b2b',x+a,y-14+b,4,3))}if(w>40){R('#6f8590',x+w-19,y-15,16,8);R('#9fb0ba',x+w-18,y-14,14,6)}if(o.cm){R('#2a2a2a',x+24,y-26,12,12);R('#c94f3a',x+27,y-23,2,2)}});
P('sofa','소파',['ammo','food','scrap'],o=>{const{x,y,w,h}=o,c=o.c||'#5a6e8a';B3(x,y,w,h,14,c,'#00000000');R(c,x,y+h-14,w,14);R('#00000035',x,y+h-14,w,14);R('#00000030',x+4,y-12,w-8,6);for(let i=x+w/3;i<x+w-4;i+=w/3)R('#00000030',i,y-6,1,h-4);R('#1d1714',x-3,y-12,6,h+12);R(c,x-2,y-11,4,h+10);R('#1d1714',x+w-3,y-12,6,h+12);R(c,x+w-2,y-11,4,h+10)});
P('ctable','탁자',['food','water'],o=>{const{x,y,w,h}=o;B3(x,y,w,h,8,o.c||'#6b4426','#4a2f1a');R('#f4f4ee',x+6,y-6,4,3);R('#c94f3a',x+w-14,y-6,8,5)});
P('rtable','원탁',['food','water'],o=>{const cx=o.x+o.w/2,y=o.y+o.h;shd(cx-12,y-6,26,8);[[-18,-12],[12,-12],[-3,-24],[-3,-2]].forEach(([a,b])=>{R('#1d1714',cx+a-1,y+b-9,10,10);R('#6b4426',cx+a,y+b-8,8,8)});blob(cx,y-16,13,8,'#1d1714');blob(cx,y-16,12,7,o.c||'#b08454');blob(cx-3,y-19,5,2,'#ffffff30');R('#f4f4ee',cx-2,y-18,4,3)});
P('tableset','식탁',['food','water'],o=>{const{x,y,w,h}=o;[[8,-6],[w-14,-6],[8,h-2],[w-14,h-2]].forEach(([a,b])=>{R('#1d1714',x+a-1,y+b-7,8,8);R('#6b4426',x+a,y+b-6,6,6)});B3(x+4,y+4,w-8,h-8,8,o.c||'#b07a45','#8a5a30');R('#f4f4f0',x+10,y-1,5,4);R('#f4f4f0',x+w-16,y+4,5,4)});
P('longtable','긴 테이블',['food','water'],o=>{const{x,y,w,h}=o;R('#6b4426',x,y-2,w,4);R('#6b4426',x,y+h-2,w,4);B3(x,y+5,w,h-10,8,'#c9a46a','#9a7a4a');for(let i=x+8;i<x+w-8;i+=20){R('#f4f4f0',i,y+1,6,4);R('#e0b03a',i+2,y+2,2,2)}});
P('toilet','변기',null,o=>{const x=o.x,y=o.y+o.h;shd(x+1,y-2,16,4);R('#1d1714',x+1,y-27,14,10);R('#f4f6f6',x+2,y-26,12,8);blob(x+8,y-10,7,8,'#59605f');blob(x+8,y-10,6,7,'#f4f6f6');blob(x+8,y-9,4,4,'#c9d6dc')});
P('tub','욕조',null,o=>{const{x,y,w,h}=o;B3(x,y,w,h,10,'#f4f6f6','#d6dcdc');R('#8fbcd4',x+3,y-7,w-6,h-6);R('#b5d9ea',x+4,y-6,8,2)});
P('stall','칸막이',null,o=>{const{x,y,h}=o;R('#2c2724',x-1,y-12,4,h+12);R('#8fb8c4',x,y-11,2,h+10)});
P('wardrobe','옷장',['bandage','wood','scrap'],o=>{const{x,y,w,h}=o;B3(x,y,w,h,36,'#7a5233','#5e3e26');R('#3e2a1a',x+w/2,y+h-32,1,30);R('#d9c39a',x+w/2-3,y+h-18,1,2);R('#d9c39a',x+w/2+2,y+h-18,1,2)});
P('tv','TV',['scrap'],o=>{const{x,y,w,h}=o;B3(x,y,w,h,10,'#3a2a1f','#2a1e16');R('#111',x+2,y-24,w-4,16);R('#2a3f5a',x+3,y-23,w-6,14);R('#4a6f9a',x+3,y-23,(w-6)/3,4)});
P('rug','러그',null,o=>{const{x,y,w,h}=o,c=[['#8a3b3b','#b8864a'],['#3b5e8e','#d9c39a'],['#4f6b4a','#c9b48f']][o.v||0];R(c[0],x,y,w,h);R(c[1],x+2,y+2,w-4,h-4);R(c[0],x+4,y+4,w-8,h-8);for(let i=x+2;i<x+w-2;i+=4){R(c[1],i,y,1,1);R(c[1],i,y+h-1,1,1)}},false);
/* storage / industrial */
P('crate','상자',['wood','wood','scrap','fuel'],o=>{const{x,y,w,h}=o;B3(x,y,w,h,Math.min(14,w),'#b8894e','#8d6534');R('#8d6534',x,y-(Math.min(14,w))+h/2,w,1);ln(x+1,y-12,x+w-2,y-1,'#8d6534')});
P('ammo','탄약 상자',['ammo','ammo'],o=>{const{x,y,w,h}=o;B3(x,y,w,h,8,'#5a6b3a','#46542d');R('#d9b52a',x+3,y-6,w-6,1);R('#2a3218',x+w/2-1,y-8,2,2)});
P('barrel','드럼통',['fuel','fuel'],o=>{const{x,y,w}=o,c=o.c||'#c2502f';shd(x+2,y+2,w,10);R('#1d1714',x-1,y-18,w+2,w+12);R(c,x,y-17,w,w+10);R('#ffffff30',x,y-17,w,4);R('#00000040',x,y-8,w,1);R('#00000040',x,y-2,w,1);R('#00000025',x+w-4,y-13,3,w+6)});
P('gunrack','총기 거치대',['ammo','ammo','scrap'],o=>{const{x,y,w,h}=o;B3(x,y,w,h,30,'#5a4a3a','#3e3226');for(let i=4;i<w-3;i+=5){R('#1e1e1e',x+i,y+h-28,2,20);R('#6b4426',x+i,y+h-10,3,7);R('#3a3a3a',x+i,y+h-28,2,2)}});
P('bench2','작업대',['scrap','wood','ammo'],o=>{const{x,y,w,h}=o;B3(x,y,w,h,14,'#8a6a45','#5e4a30');R('#9aa0a6',x+3,y-11,8,2);R('#b33a2c',x+w-10,y-12,6,3);R('#555',x+w/2,y-12,4,4);R('#2a2a2a',x+w/2+6,y-10,6,2)});
P('tool','공구함',['scrap','scrap','wood','fuel'],o=>{const{x,y,w,h}=o;B3(x,y,w,h,12,'#b33a2c','#8a2a20');R('#555',x+w/2-4,y-14,8,2)});
P('tires','타이어',['scrap'],o=>{const x=o.x,y=o.y+o.h;shd(x,y-4,o.w,6);[[7,-8],[15,-12],[9,-17]].forEach(([a,b])=>{blob(x+a,y+b,7,5,'#1a1a1a');blob(x+a,y+b,3,2,'#4a4a4a')})});
P('lumber','목재 더미',['wood','wood','wood'],o=>{const{x,y,w,h}=o;B3(x,y,w,h,12,'#c9a06a','#9a7444');for(let i=y-10;i<y+h-12;i+=3)R('#a8804e',x+1,i,w-2,1);for(let i=x+2;i<x+w;i+=6)blob(i+2,y+h-6,2,2,'#e0c08a')});
P('sandbag','모래주머니',null,o=>{const{x,y,w,h}=o;for(let r=0;r<2;r++)for(let i=0;i<w;i+=10){const ax=x+i+(r?5:0);if(ax+9>x+w)continue;R('#5a4e34',ax,y+h-12-r*5,10,7);R('#bfae82',ax+1,y+h-11-r*5,8,5);R('#d4c49a',ax+1,y+h-11-r*5,8,1)}});
P('gen','발전기',['fuel','fuel','scrap'],o=>{const{x,y,w,h}=o;B3(x,y,w,h,16,'#c9a42a','#9a7d1e');for(let i=4;i<w-14;i+=3)R('#7a6418',x+i,y-12,1,8);R('#333',x+w-11,y-14,7,7);R('#555',x+w-9,y-20,3,6)});
P('rack','서버',['scrap','scrap'],o=>{const{x,y,w,h}=o;B3(x,y,w,h,36,'#2b2f33','#1d2023');for(let i=0;i<8;i++){R('#555',x+3,y+h-33+i*4,w-6,1);R(i%3?'#3f3':'#fa3',x+w-5,y+h-33+i*4,1,1)}});
P('console','통신 콘솔',['scrap','scrap','ammo'],o=>{const{x,y,w,h}=o;B3(x,y,w,h,12,'#3a4048','#2a2f35');for(let i=0;i<w-8;i+=20){R('#111',x+4+i,y-22,16,10);R('#1f5f3a',x+5+i,y-21,14,8);ln(x+5+i,y-17,x+18+i,y-19,'#5fe08a')}for(let i=4;i<w-4;i+=5)R(PAL6[i%6],x+i,y-8,2,1)});
P('board','칠판',null,o=>{const{x,y,w}=o;R('#3a3a3a',x+2,y-2,2,6);R('#3a3a3a',x+w-4,y-2,2,6);R('#1d1714',x-1,y-30,w+2,26);R(o.c||'#2f5a3a',x,y-29,w,24);ln(x+4,y-22,x+w*.5,y-20,'#e8e8e0');ln(x+6,y-14,x+w*.4,y-16,'#e8e8e0');R('#8a6a45',x,y-6,w,2)});
P('sdesk','학생 책상',['food','scrap'],o=>{const{x,y,w,h}=o;R('#1d1714',x+3,y+h-5,12,6);R('#3a6ea8',x+4,y+h-4,10,4);B3(x,y,w,h-6,10,'#c9a46a','#9a7a4a');R('#f4f4ee',x+3,y-8,5,4)});
P('lockrow','복도 사물함',['food','scrap','bandage'],o=>{const{x,y,w,h}=o;B3(x,y,w,h,34,o.c||'#3a6ea8','#2c5682');for(let i=0;i<w;i+=12){R('#1e3a5a',x+i,y+h-34,1,34);R('#1e3a5a',x+i+3,y+h-30,6,1);R('#1e3a5a',x+i+3,y+h-28,6,1);R('#d9d9d9',x+i+9,y+h-18,1,3)}});
P('hoop','농구 골대',null,o=>{const{x,y,w}=o;R('#555',x+w/2-1,y-40,3,44);R('#1d1714',x+w/2-11,y-52,24,14);R('#f4f4ee',x+w/2-10,y-51,22,12);R('#d33a3a',x+w/2-4,y-47,8,5);blob(x+w/2+1,y-36,5,2,'#e07a3a')});
P('bleacher','관람석',null,o=>{const{x,y,w,h}=o;for(let r=0;r<3;r++){R('#1d1714',x-1,y+r*10-r*8-1,w+2,12);R('#8a9aa6',x,y+r*10-r*8,w,6);R('#6a7a86',x,y+r*10-r*8+6,w,4)}});
P('aisle','진열대',['food','water','bandage','food','water'],o=>{const{x,y,w,h}=o;B3(x,y,w,h,20,'#c9ccd0','#9aa0a6');const v=h>w;if(v)for(let i=y-18;i<y+h-24;i+=4){R(PAL6[((i/4)|0)%6],x+2,i,4,3);R(PAL6[((i/4+3)|0)%6],x+w-6,i,4,3)}else for(let i=x+2;i<x+w-3;i+=4){R(PAL6[((i/4)|0)%6],i,y+h-17,3,5);R(PAL6[((i/4+2)|0)%6],i,y+h-10,3,5)}});
P('register','계산대',['ammo','scrap','food'],o=>{const{x,y,w,h}=o;B3(x,y,w,h,18,'#8a5a33','#6b4426');R('#1d1714',x+3,y-26,14,10);R('#2a2a2a',x+4,y-25,12,8);R('#7fd07f',x+6,y-23,8,2);for(let i=22;i<w-4;i+=4)R(PAL6[i%6],x+i,y-15,3,4)});
P('drinks','음료 냉장고',['water','water','water','food'],o=>{const{x,y,w,h}=o;B3(x,y,w,h,40,'#e8eef0','#9fc8dc');for(let i=0;i<(w-6)/4;i++){R(PAL6[i%4],x+3+i*4,y+h-34,3,6);R(PAL6[(i+2)%4],x+3+i*4,y+h-24,3,6);R(PAL6[(i+1)%4],x+3+i*4,y+h-14,3,6)}R('#ffffff66',x+2,y+h-36,1,30)});
P('pump','주유기',['fuel','fuel','fuel'],o=>{const{x,y,w,h}=o;B3(x,y,w,h,34,'#e0e0dc','#b33a2c');R('#111',x+3,y+h-30,w-6,8);R('#5fe08a',x+4,y+h-28,w-8,2);ln(x+w-2,y+h-18,x+w+4,y+h-4,'#222')});
P('cell','유치장 창살',null,o=>{const{x,y,w,h}=o,v=h>w;if(v){R('#2c2724',x-1,y-30,4,h+30);for(let i=y-30;i<y+h;i+=2)R(i%6?'#6a6f75':'#9aa0a6',x,i,2,1)}else{R('#2c2724',x-1,y-31,w+2,3);R('#2c2724',x-1,y-1,w+2,3);for(let i=x;i<x+w;i+=5){R('#1d1714',i-1,y-30,3,30);R('#9aa0a6',i,y-30,1,30)}}});
P('flag','깃발',null,o=>{const x=o.x+2,y=o.y+o.h;shd(x-2,y-2,8,3);R('#888',x,y-64,2,64);R('#1d1714',x+2,y-63,22,14);R(o.c||'#f4f4ee',x+3,y-62,20,12);if(o.c2){R(o.c2,x+3,y-62,20,4)}});
P('tower','감시탑',null,o=>{const{x,y,w,h}=o,cx=x+w/2;shd(x,y+2,w+4,h);R('#5a3a20',x+2,y+h-60,3,60);R('#5a3a20',x+w-5,y+h-60,3,60);ln(x+3,y+h-56,x+w-4,y+h-10,'#4a2f1a');ln(x+w-4,y+h-56,x+3,y+h-10,'#4a2f1a');
 B3(x-4,y+h-70,w+8,16,12,'#7a5a3a','#5a3e26',{sd:false});for(let i=-2;i<w+2;i+=6){R('#6e6244',x+i,y+h-74,6,5);R('#bfae82',x+i+1,y+h-73,4,3)}R('#1d1714',x-6,y+h-96,w+12,10);R('#4f5a35',x-5,y+h-95,w+10,8);R('#3e4729',x-5,y+h-89,w+10,2)});
P('tent','군용 텐트',['bandage','food','water','ammo'],o=>{const{x,y,w,h}=o;shd(x+4,y+4,w,h);R('#1e2214',x-1,y-23,w+2,h+24);R('#5a6440',x,y-22,w,h);R('#4a5434',x,y-22+h/2-1,w,3);R('#3e4729',x,y+h-22,w,22);R('#1e2214',x+w/2-8,y+h-18,16,18);R('#2e3420',x+w/2-7,y+h-17,14,17);for(let i=x+4;i<x+w;i+=12)R('#00000020',i,y-20,1,h-4)});
P('fence','철조망',null,o=>{const{x,y,w,h}=o,v=h>w;if(!v){R('#00000030',x,y+h,w,2);for(let i=0;i<w;i+=2)R('#9aa0a6',x+i,y+h-18+(i%4?1:0),1,16);R('#6a6f75',x,y+h-19,w,1);R('#6a6f75',x,y+h-4,w,1);for(let i=0;i<w;i+=32){R('#3a3f45',x+i,y+h-24,3,24)}for(let i=1;i<w;i+=3)R('#b0b5ba',x+i,y+h-23,1,1)}
 else{for(let i=0;i<h;i+=2)R('#9aa0a6',x+(i%4?1:0),y+i-16,2,1);R('#6a6f75',x-1,y-18,1,h+18);R('#6a6f75',x+3,y-18,1,h+18);for(let i=0;i<h;i+=32)R('#3a3f45',x-1,y+i-22,5,22)}});
P('wall2','담장',null,o=>{const{x,y,w,h}=o;B3(x,y,w,h,20,'#b8b2a6','#9a9488');for(let i=x;i<x+w;i+=8)R('#00000020',i,y+h-20,1,20)});
/* outdoor */
P('car','자동차',['fuel','scrap','food'],o=>carD(o.x,o.y,o.w,o.h,o.c||'#3a6ea8',o.rust));
P('wreck','폐차',['fuel','fuel','scrap'],o=>carD(o.x,o.y,o.w,o.h,o.c||'#7a4b37',true));
P('pcar','경찰차',['ammo','bandage','fuel'],o=>{carD(o.x,o.y,o.w,o.h,'#eeeeee');const{x,y,w,h}=o;if(w>h){R('#1e2a44',x+1,y-9,10,h-4);R('#1e2a44',x+w-10,y-9,9,h-4);R('#d33',x+w/2-2,y-8,3,h/2-4);R('#36f',x+w/2-2,y-8+h/2-4,3,h/2-4)}});
P('ambulance','구급차',['bandage','bandage','fuel'],o=>{const{x,y,w,h}=o;shd(x+3,y+3,w,h,.3);[[10],[w-34]].forEach(([a])=>{R('#141414',x+a,y+h-4,14,5);R('#141414',x+a,y-11,14,5)});B3(x,y,w,h-2,12,'#f4f4ee','#c9c9c0',{sd:false});R('#e8e8e0',x+w-28,y-10,26,h-4);R('#7fa9c4',x+w-18,y-8,8,h-8);R('#d33a3a',x,y+h-14,w-28,4);R('#d33a3a',x+40,y-8,6,14);R('#d33a3a',x+36,y-4,14,6);const fl=Math.sin(performance.now()/120)>0;R(fl?'#ff4040':'#802020',x+w-32,y-11,4,3);R(fl?'#204080':'#4080ff',x+w-32,y+h-14,4,3)});
P('truck','군용 트럭',['fuel','ammo','food','bandage','ammo'],o=>{const{x,y,w,h}=o;shd(x+3,y+4,w,h,.3);[[6],[w-20],[w-38]].forEach(([a])=>{R('#141414',x+a,y+h-4,12,5);R('#141414',x+a,y-12,12,5)});B3(x,y,30,h-2,16,'#4f5a35','#3e4729',{sd:false});R('#8fb6cf',x+22,y-12,6,h-10);R('#1e2214',x+30,y-21,w-30,h+19);R('#6b6f45',x+31,y-20,w-32,h-2);R('#5a5e38',x+31,y+h-20,w-32,18);for(let i=x+36;i<x+w-3;i+=8)R('#5a5e38',i,y-20,1,h-2);R('#e8e8e0',x+w/2+10,y-4,6,6)});
function carD(x,y,w,h,c,rust){const hz=w>=h;shd(x+3,y+3,w,h,.3);if(hz){[[6],[w-16]].forEach(([a])=>{R('#141414',x+a,y+h-4,10,4);R('#141414',x+a,y-10,10,4)})}else{[[6],[h-16]].forEach(([a])=>{R('#141414',x-2,y+a-8,4,10);R('#141414',x+w-2,y+a-8,4,10)})}
 B3(x,y,w,h-2,10,c,'#00000000',{sd:false});R('#00000040',x,y+h-12,w,10);
 if(hz){R('#8fb6cf',x+w*.62,y-8,7,h-8);R('#6d93ab',x+w*.2,y-8,6,h-8);R('#00000025',x+w*.3,y-8,w*.3,h-8)}else{R('#8fb6cf',x+2,y-10+h*.2,w-4,7);R('#6d93ab',x+2,y-10+h*.7,w-4,6);R('#00000025',x+2,y-10+h*.35,w-4,h*.3)}
 if(rust){R('#4a2a1a',x+5,y-6,4,3);R('#4a2a1a',x+w-10,y+h-14,5,3);R('#222',x+w/2,y-4,4,4)}}
P('planter','화단',null,o=>{const{x,y,w,h}=o;B3(x,y,w,h,8,'#9a9a92','#7a7a72');for(let i=x+6;i<x+w-4;i+=10){blob(i,y-10,7,6,'#2f6b33');blob(i-2,y-12,4,3,'#3f8a40')}});
P('bollard','볼라드',null,o=>{const x=o.x+3,y=o.y+o.h;shd(x-2,y-2,7,3);R('#1d1714',x-3,y-13,7,13);R('#3a3f45',x-2,y-12,5,12);R('#e8c43a',x-2,y-9,5,2)});
P('lamp','가로등',null,o=>{const x=o.x+3,y=o.y+o.h;shd(x-3,y-2,8,3);R('#2c2f33',x-1,y-64,3,64);R('#2c2f33',x-1,y-64,14,3);R('#1d1714',x+7,y-65,12,6);R('#3a3f45',x+8,y-64,10,4);R(NIGHT?'#fff3b0':'#d8d8c8',x+9,y-61,8,2)});
P('sign','간판',null,o=>{const{x,y,w}=o;shd(x,y-2,w,4);R('#3a3f45',x+2,y-46,3,46);R('#3a3f45',x+w-5,y-46,3,46);R('#1d1714',x-3,y-67,w+6,24);R(o.c||'#f4f4ee',x-2,y-66,w+4,22);if(o.icon)o.icon(x+w/2,y-55)});
P('tree','나무',null,o=>{const x=o.x+o.w/2,y=o.y+o.h;shd(x-12,y-4,26,6);R('#3a2414',x-3,y-16,6,16);R('#4a2f1c',x-2,y-16,3,16);blob(x,y-30,15,13,'#1f4a22');blob(x-2,y-33,13,11,'#2a5a2c');blob(x-4,y-36,8,7,'#367a38');blob(x-6,y-39,3,3,'#4f9a48')});
P('bush','덤불',null,o=>{const x=o.x+o.w/2,y=o.y+o.h;shd(x-10,y-4,20,5);blob(x,y-8,11,8,'#1f4a22');blob(x-2,y-10,8,6,'#2f6b33');blob(x-4,y-12,3,2,'#4f9a48')});
P('trash','쓰레기',null,o=>{const x=o.x,y=o.y+o.h;shd(x,y-3,16,4);blob(x+6,y-6,7,6,'#1d1d22');blob(x+4,y-8,3,2,'#3a3a44');blob(x+13,y-4,4,3,'#2a2a30')},false);
P('dumpster','쓰레기통',['scrap','food'],o=>{const{x,y,w,h}=o;B3(x,y,w,h,18,'#2f5a3a','#244a2e');R('#1e3a24',x,y-18,w,3)});
P('helipad','헬기장',null,o=>{const{x,y,w}=o,c=x+w/2;blob(c,y+w/2,w/2,w/2,'#5a5e62');blob(c,y+w/2,w/2-3,w/2-3,'#6a6e72');R('#e8e8e0',c-12,y+w/2-14,4,28);R('#e8e8e0',c+8,y+w/2-14,4,28);R('#e8e8e0',c-8,y+w/2-2,16,4)},false);
P('court','코트 라인',null,o=>{const{x,y,w,h}=o;R('#f4f4ee',x,y,w,2);R('#f4f4ee',x,y+h-2,w,2);R('#f4f4ee',x,y,2,h);R('#f4f4ee',x+w-2,y,2,h);R('#f4f4ee',x+w/2-1,y,2,h);blob(x+w/2,y+h/2,22,22,'#f4f4ee');blob(x+w/2,y+h/2,20,20,'#d29e60')},false);
P('island','주유 섬',null,o=>{const{x,y,w,h}=o;B3(x,y,w,h,4,'#b0b0aa','#8a8a84');R('#d9b52a',x,y-4,w,1)},false);
P('stripes','주차선',null,o=>{const{x,y,w,h}=o;for(let i=x;i<=x+w;i+=56)R('#e8e8e0',i,y,2,h);R('#e8e8e0',x,y,w,2)},false);
P('campfire','모닥불',null,o=>{const x=o.x+o.w/2,y=o.y+o.h;for(let a=0;a<8;a++){const t=a/8*6.28;R('#6a6a62',x+Math.cos(t)*9-2,y-6+Math.sin(t)*5-2,5,4)}R('#3a2414',x-6,y-8,12,3);const f=(performance.now()/90|0)%3;blob(x,y-12-f,4,6,'#e8762a');blob(x,y-11,2,3,'#ffd36a')});

/* base building */
P('container','컨테이너 쉘터',null,o=>{const{x,y,w,h}=o;B3(x,y,w,h,30,o.c||'#4f7a8a','#3e6270');for(let i=x+3;i<x+w;i+=5){R('#00000025',i,y-30,1,h);R('#00000025',i,y+h-30,1,30)}R('#1d1714',x+w/2-9,y+h-26,18,26);R('#5a3e26',x+w/2-8,y+h-25,16,25);R('#d9b52a',x+w/2+4,y+h-14,2,2);R('#8fb6cf',x+10,y+h-22,14,8);R('#8fb6cf',x+w-24,y+h-22,14,8)});
P('hq','요새 본부',null,o=>{const{x,y,w,h}=o;B3(x,y,w,h,40,'#8a8f94','#6e7378');for(let i=y-38;i<y+h-40;i+=8)R('#00000018',x,i,w,1);for(let i=0;i<w;i+=12){R('#5a4e34',x+i,y-48,10,8);R('#bfae82',x+i+1,y-47,8,5)}R('#1d1714',x+w/2-12,y+h-30,24,30);R('#3a3f45',x+w/2-11,y+h-29,22,29);R('#555',x+w/2-11,y+h-15,22,1);R('#e8c43a',x+12,y+h-28,w-24,2);[[14],[w-34]].forEach(([a])=>{R('#1d1714',x+a,y+h-26,20,8);R('#8fb6cf',x+a+1,y+h-25,18,6);R('#555',x+a+1,y+h-22,18,1)});R('#888',x+w-14,y-80,2,40);R('#d33',x+w-15,y-82,4,3)});
P('tentS','텐트',null,o=>{const{x,y,w,h}=o;shd(x+3,y+3,w,h);R('#1e2214',x-1,y-17,w+2,h+18);R('#6b7a8a',x,y-16,w,h);R('#5a6a7a',x+w/2-1,y-16,2,h);R('#4a5a6a',x,y+h-16,w,16);R('#1e2214',x+w/2-6,y+h-14,12,14);R('#2a3420',x+w/2-5,y+h-13,10,13)});
P('plot','텃밭',null,o=>{const{x,y,w,h}=o,lv=o.lv||1;R('#3a2a1a',x-1,y-1,w+2,h+2);R('#5a4028',x,y,w,h);for(let r=y+5;r<y+h-3;r+=8){R('#4a3220',x+2,r+3,w-4,2);for(let c=x+5;c<x+w-4;c+=7){const gr=(performance.now()/4000+c*.13+r*.07)%1;blob(c,r,2+lv,1+lv,'#2f6b33');if(lv>1)blob(c-1,r-1,1+lv/2,1,'#5aa04f');if(lv>2&&gr>.5)R('#e0b03a',c,r-1,2,2)}}R('#8a6a45',x-3,y-3,w+6,2);R('#8a6a45',x-3,y+h+1,w+6,2)},false);
P('waterB','빗물통',null,o=>{const{x,y,w}=o;shd(x+2,y+2,w,10);R('#1d1714',x-1,y-21,w+2,w+14);R('#3a6ea8',x,y-20,w,w+12);R('#5a8ec8',x,y-20,w,4);R('#2c5682',x,y-10,w,1);R('#7fb8e0',x+3,y-19,w-6,2);ln(x+w,y-24,x+w+6,y-34,'#888')});
P('tank','물탱크',null,o=>{const{x,y,w,h}=o;R('#555',x+3,y+h-10,3,10);R('#555',x+w-6,y+h-10,3,10);blob(x+w/2,y+h-28,w/2,h/2,'#1d1714');blob(x+w/2,y+h-28,w/2-1,h/2-1,'#4f8ab0');blob(x+w/2,y+h-30,w/2-4,h/2-5,'#6fa8cc');R('#9fd0f0',x+w/2-8,y+h-36,6,2);R('#3a6ea8',x+w/2-2,y+h-18,4,8)});
P('wtower','급수탑',null,o=>{const{x,y,w,h}=o;shd(x,y+2,w+4,h);[[2],[w-5]].forEach(([a])=>R('#5a5f66',x+a,y+h-50,3,50));ln(x+3,y+h-46,x+w-4,y+h-8,'#4a4f55');ln(x+w-4,y+h-46,x+3,y+h-8,'#4a4f55');R('#1d1714',x-5,y+h-86,w+10,40);R('#4f8ab0',x-4,y+h-85,w+8,38);for(let i=0;i<w+8;i+=6)R('#3e7090',x-4+i,y+h-85,1,38);R('#6fa8cc',x-4,y+h-85,w+8,3);R('#2c2f33',x-6,y+h-90,w+12,6)});
P('solar','태양광 패널',null,o=>{const{x,y,w,h}=o;R('#555',x+4,y+h-6,3,6);R('#555',x+w-7,y+h-6,3,6);R('#1d1714',x-1,y-11,w+2,h+6);R('#2a4a7a',x,y-10,w,h+4);for(let i=x+6;i<x+w;i+=8)R('#4a6a9a',i,y-10,1,h+4);for(let j=y-6;j<y+h-6;j+=6)R('#4a6a9a',x,j,w,1);R('#8ab0e0',x+2,y-9,6,1)});
P('turret','자동 포탑',null,o=>{const{x,y,w,h}=o,a=o.a||0,lv=o.lv||1;for(let i=0;i<w;i+=8){R('#5a4e34',x+i,y+h-10,8,6);R('#bfae82',x+i+1,y+h-9,6,4)}const cx=x+w/2,cy=y+h/2-8;R('#1d1714',cx-8,cy-6,16,12);R(lv>2?'#4a5058':'#5a6440',cx-7,cy-5,14,10);ln(cx,cy,cx+Math.cos(a)*14,cy+Math.sin(a)*14,'#1e1e1e');ln(cx,cy+1,cx+Math.cos(a)*14,cy+1+Math.sin(a)*14,'#2e2e2e');R('#e05050',cx-1,cy-2,2,2)});
P('pal','목책',null,o=>{const{x,y,w,h}=o,v=h>w,hp=o.hp??1;if(!v){for(let i=0;i<w;i+=5){const tall=20+((i/5)%2)*3;R('#3a2414',x+i,y+h-tall,5,tall);R(hp>.4?'#8a5a33':'#6a4426',x+i+1,y+h-tall+1,3,tall-1);R('#c9a06a',x+i+1,y+h-tall,3,1)}R('#5a3a20',x,y+h-12,w,2)}else{for(let i=0;i<h;i+=5){R('#3a2414',x,y+i-20,w,6);R(hp>.4?'#8a5a33':'#6a4426',x+1,y+i-19,w-2,4)}}});
P('mwall','철판 방벽',null,o=>{const{x,y,w,h}=o,v=h>w,hp=o.hp??1;if(!v){B3(x,y,w,h,24,'#7a8288',hp>.4?'#5f676c':'#4a3a30');for(let i=x+8;i<x+w;i+=16)R('#00000030',i,y+h-24,1,24);R('#9a5a3a',x+4,y+h-12,6,4);R('#8a4a2a',x+w-14,y+h-20,5,3)}else B3(x,y,w,h,24,'#7a8288','#5f676c')});
P('cwall','콘크리트 방벽',null,o=>{const{x,y,w,h}=o,v=h>w,hp=o.hp??1;if(!v){B3(x,y,w,h,30,'#a8a8a0',hp>.4?'#8a8a82':'#6a6a62');for(let i=x;i<x+w;i+=32)R('#00000025',i,y+h-30,1,30);for(let i=x;i<x+w;i+=3)R('#3a3f45',i,y-34+(i%6?0:1),1,2);R('#555',x,y-33,w,1)}else{B3(x,y,w,h,30,'#a8a8a0','#8a8a82');for(let i=y-30;i<y+h-30;i+=3)R('#3a3f45',x+w/2,i,1,2)}});
P('gateB','정문',null,o=>{const{x,y,w,h}=o,lv=o.lv||1,hp=o.hp??1;R('#1d1714',x-1,y-27,w+2,h+28);R(lv>2?'#5a6068':lv>1?'#6a7278':'#7a5233',x,y-26,w,h+26);for(let i=x+4;i<x+w-2;i+=6)R(hp>.4?'#00000040':'#00000080',i,y-24,2,h+22);R('#d9b52a',x,y-26,w,2);R('#d9b52a',x,y-14,w,2);R('#3a3f45',x+w/2-1,y-26,2,h+26);R('#e05050',x+w/2-6,y-20,3,3);R('#5fe08a',x+w/2+3,y-20,3,3)});
P('radio','무선 안테나',null,o=>{const x=o.x+o.w/2,y=o.y+o.h;shd(x-6,y-2,12,4);R('#555',x-1,y-90,3,90);for(let i=0;i<4;i++)ln(x,y-90+i*20,x+10-i*2,y-80+i*20,'#777');R('#e05050',x-1,y-93,3,3);R('#3a3f45',x-6,y-8,12,8)});
P('stash','보관함',null,o=>{const{x,y,w,h}=o;B3(x,y,w,h,14,'#6b7a4a','#4f5a35');R('#3e4729',x,y-8,w,1);R('#d9b52a',x+w/2-2,y+h-10,4,3);R('#e8e8e0',x+4,y+h-12,8,3)});
P('bench3','작업대',null,o=>{const{x,y,w,h}=o,lv=o.lv||1;B3(x,y,w,h,14,'#8a6a45','#5e4a30');R('#9aa0a6',x+4,y-11,10,2);R('#b33a2c',x+w-14,y-12,8,4);if(lv>1){R('#3a3f45',x+w/2-6,y-20,12,8);R('#555',x+w/2-2,y-24,4,4)}if(lv>2){R('#1d1714',x-1,y-40,w+2,24);R('#6b4426',x,y-39,w,22);for(let i=x+4;i<x+w-4;i+=8){R('#9aa0a6',i,y-36,2,10);R('#b33a2c',i+3,y-33,3,3)}}});

const SPRC={};
function sprite(key,w,h,draw){if(SPRC[key])return SPRC[key];const c=document.createElement('canvas');c.width=w;c.height=h;const o=g;g=c.getContext('2d');draw();g=o;
 const x=c.getContext('2d'),im=x.getImageData(0,0,w,h),d=im.data,out=new Uint8ClampedArray(d);
 for(let j=0;j<h;j++)for(let i=0;i<w;i++){const k=(j*w+i)*4;if(d[k+3])continue;if([[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>{const ii=i+a,jj=j+b;return ii>=0&&jj>=0&&ii<w&&jj<h&&d[(jj*w+ii)*4+3]>0})){out[k]=24;out[k+1]=18;out[k+2]=16;out[k+3]=255}}
 im.data.set(out);x.putImageData(im,0,0);return SPRC[key]=c}
/* dir: 'l','r','d','u'; fr: 0..3 walk, -1 idle; wpn: null|'pistol'|'rifle'|'axe'|'bat' */
function person(o,dir,fr,wpn){const p=R,s=dir=='l'?-1:dir=='r'?1:0,up=dir=='u',st=fr<0?0:[0,1,0,-1][fr%4],bb=fr==1||fr==3?-1:0;
 if(s){p(o.pd,16-st*s*2,28,4,8);p(o.p,17+st*s*2,28,4,8);p('#231d19',15-st*s*2+(s<0?-1:0),35,6,2);p('#231d19',16+st*s*2+(s<0?-1:0),35,6,2)}
 else{p(o.p,13,28,4,8-(st>0?1:0));p(o.pd,13,28,1,8);p(o.p,19,28,4,8-(st<0?1:0));p(o.pd,22,28,1,8);p('#231d19',13,35-(st>0?1:0),4,2);p('#231d19',19,35-(st<0?1:0),4,2)}
 const U=(c,x,y,w,h)=>p(c,x,y+bb,w,h);
 if(o.pack&&s)U('#6b4a2a',s<0?21:10,15,5,11);
 const tx=s?14:12,tw=s?9:12;
 if(up&&o.pack){U(o.c,tx,16,tw,13);U('#6b4a2a',13,15,10,12);U('#5a3e22',13,15,10,1);U('#8a6a42',15,19,6,3)}
 else{U(o.c,tx,16,tw,13);U(o.cl,tx,16,2,13);U(o.cd,tx+tw-2,16,2,13);U('#00000030',tx,27,tw,2)}
 if(o.coat){U(o.c,tx-1,16,tw+2,17);U(o.cd,tx+(tw>>1),18,1,14)}
 if(o.vest){U(o.vest,tx+1,17,tw-2,9);U('#00000030',tx+1,25,tw-2,1)}
 if(o.zb){U('#6e0e0e',tx+3,20,3,4);U('#8f1616',tx+2,19,2,2);U(o.cd,tx+5,26,3,3)}
 if(o.pack&&!s&&!up){U('#5a3e22',13,16,2,10);U('#5a3e22',21,16,2,10)}
 // arms + weapon
 const armSwing=st*2;
 if(o.zb){if(s){U(o.sk,s>0?22:6,18,8,3);U(o.skd,s>0?22:6,20,8,1);U(o.sk,s>0?22:6,21,8,2);U(o.c,s>0?21:13,17,3,4)}else if(!up){U(o.sk,11,22,3,6);U(o.sk,22,22,3,6)}else{U(o.c,10,17,3,8);U(o.c,23,17,3,8)}}
 else if(wpn=='pistol'||wpn=='rifle'){const L=wpn=='rifle'?12:6;if(s){const hx=s<0?8-L+6:22;U(o.c,s<0?8:21,18,7,4);U(o.cd,s<0?8:21,21,7,1);U(o.sk,s<0?5:28,18,3,4);U('#1e1e1e',s<0?5-L+3:28,17,L,3);U('#3a3a3a',s<0?6-L+3:29,17,L-2,1);U('#1e1e1e',s<0?6:28,20,2,3);if(wpn=='rifle')U('#6b4426',s<0?14:19,19,4,3)}
  else{U(o.c,10,17,3,8);U(o.c,23,17,3,8);U(o.sk,10,25,3,2);U(o.sk,23,25,3,2);if(!up){U('#1e1e1e',23,25,3,L-2)}}}
 else{if(s){U(o.c,17-armSwing*s,17,3,9);U(o.sk,17-armSwing*s,26,3,2);if(wpn){U(wpn=='axe'?'#7a4f2a':'#b0804a',17-armSwing*s+(s>0?2:-1),20,2,12);if(wpn=='axe')U('#9aa0a6',17-armSwing*s+(s>0?1:-3),18,5,4)}}
  else{U(o.c,10,17+(st>0?1:0),3,9);U(o.sk,10,26+(st>0?1:0),3,2);U(o.c,24,17+(st<0?1:0),3,9);U(o.sk,24,26+(st<0?1:0),3,2);if(wpn&&!up){U(wpn=='axe'?'#7a4f2a':'#b0804a',25,22,2,12);if(wpn=='axe')U('#9aa0a6',23,32,5,4)}}}
 // head
 const hx=s?15:13,hw=s?9:10;U(o.sk,hx,5,hw,11);U(o.skd,s>0?hx:hx+hw-2,5,2,11);U(o.h,hx,3,hw,4);
 if(up)U(o.h,hx,5,hw,9);else if(s)U(o.h,s>0?hx:hx+hw-3,5,3,6);else{U(o.h,hx,5,1,4);U(o.h,hx+hw-1,5,1,4)}
 if(o.cap){U(o.cap,hx-1,2,hw+2,3);if(s)U(o.cap,s<0?hx-4:hx+hw,4,4,2)}if(o.helm){U(o.helm,hx-1,1,hw+2,5);U('#00000030',hx-1,5,hw+2,1)}if(o.ncap){U(o.ncap,hx+1,1,hw-2,3);U('#d33a3a',hx+(hw>>1)-1,1,2,2)}
 if(!up){const ey=o.zb?'#d82020':'#1a1a1a';if(s)U(ey,s>0?hx+6:hx+1,9,1,2);else{U(ey,hx+2,9,2,2);U(ey,hx+6,9,2,2);if(o.zb){U('#6e0e0e',hx+3,13,4,1);U('#8f1616',hx+4,14,2,2)}}}}
const ZBASE={zb:1,sk:'#9aab86',skd:'#7f9070',h:'#4a4a3a'};
const LOOKS={
 player:{p:'#3d4f6b',pd:'#2f3d54',c:'#5a6b45',cl:'#6f8257',cd:'#46553a',sk:'#e0b48c',skd:'#c4966f',h:'#3b2a1e',cap:'#2f3a2a',pack:1},
 patient:{...ZBASE,p:'#a8c4d8',pd:'#8fabc0',c:'#a8c4d8',cl:'#c0d8ea',cd:'#8aa6ba'},
 doctor:{...ZBASE,coat:1,p:'#3a4a6a',pd:'#2a3a5a',c:'#e8ecec',cl:'#ffffff',cd:'#c4cccc',h:'#5a5a50'},
 nurse:{...ZBASE,p:'#e89ab0',pd:'#c8809a',c:'#e89ab0',cl:'#f5b4c8',cd:'#c8809a',h:'#3a2a22',ncap:'#f4f4ee'},
 civ1:{...ZBASE,p:'#3a3a40',pd:'#2a2a30',c:'#8a5a5a',cl:'#a06e6e',cd:'#6e4646',sk:'#8fa07a',skd:'#748564',h:'#2a2a22'},
 civ2:{...ZBASE,p:'#4a5a7a',pd:'#3a4a6a',c:'#c9a04a',cl:'#e0b860',cd:'#a8843a',h:'#5a3a22'},
 civ3:{...ZBASE,p:'#5a4a3a',pd:'#4a3a2a',c:'#4f7a8a',cl:'#6a94a4',cd:'#3e6270',h:'#2a2a22'},
 cop:{...ZBASE,p:'#1e2a44',pd:'#141e34',c:'#2f4a7a',cl:'#4a64a0',cd:'#22385e',h:'#2a2a22',cap:'#1e2a44'},
 soldier:{...ZBASE,p:'#4f5a35',pd:'#3e4729',c:'#5a6440',cl:'#6b7650',cd:'#4a5434',h:'#3a3a2a',helm:'#4a5434',vest:'#3e4729'},
 student:{...ZBASE,p:'#2a3a5a',pd:'#1e2a44',c:'#f0f0e8',cl:'#ffffff',cd:'#c8c8c0',h:'#1e1a16'},
};
function drawChar(look,x,y,dir,fr,wpn,scale=1){const lk=LOOKS[look]||LOOKS.civ1,key=look+dir+fr+(wpn||''),sp=sprite(key,36,40,()=>person(lk,dir,fr,wpn));
 shd(x-9*scale,y-1,18*scale,4,.3);if(scale==1)g.drawImage(sp,Math.round(x-18),Math.round(y-37));else{const s=g.imageSmoothingEnabled;g.imageSmoothingEnabled=false;g.drawImage(sp,Math.round(x-18*scale),Math.round(y-37*scale),36*scale,40*scale);g.imageSmoothingEnabled=s}}
function corpseD(x,y,look,flip){const lk=LOOKS[look]||LOOKS.civ1,sp=sprite('cp'+look,40,20,()=>{R('#3a3a40',2,8,10,5);R(lk.c,12,5,14,9);R('#ffffff30',12,5,14,2);R(lk.sk,26,6,8,8);R(lk.h,33,6,2,8);R(lk.sk,14,1,3,5);R(lk.sk,18,13,3,5);R('#6e0e0e',16,8,4,3);R('#231d19',0,8,3,5)});
 blob(x+2,y+2,16,7,'#5e0c0c');blob(x+1,y+1,12,5,'#7d1212');if(flip){g.save();g.translate(x,0);g.scale(-1,1);g.drawImage(sp,-20,y-12);g.restore()}else g.drawImage(sp,x-20,y-12)}
function poolD(x,y,r){blob(x,y,r,Math.max(1,r*.6),'#5e0c0c');blob(x-1,y-1,Math.max(1,r-2),Math.max(1,r*.6-2),'#7d1212');blob(x-r*.3,y-r*.2,2,1,'#a32020')}
function paperD(x,y,i){const w=6+(i%3),h=4+(i%2)*2;R('#00000022',x+1,y+1,w,h);R(i%2?'#f2f0e8':'#e4e8ec',x,y,w,h);R('#9aa0a6',x+1,y+2,w-3,1)}
/* scattered clutter in a rect */
function clutterD(x,y,w,h,seed,n=6,blood=1){for(let i=0;i<n;i++)paperD(x+hh(i,seed,1)*(w-10),y+hh(i,seed,2)*(h-8),i);for(let i=0;i<blood;i++)poolD(x+10+hh(i,seed,3)*(w-20),y+8+hh(i,seed,4)*(h-16),5+(hh(i,seed,5)*6|0));for(let i=0;i<8;i++)R(i%3?'#7d1212':'#5e0c0c',x+hh(i,seed,6)*w,y+hh(i,seed,7)*h,2,2)}

/* ---------- roofs ---------- */
function roofD(r,a){if(a<=.02)return;g.globalAlpha=a;const{x,y,w,h}=r,X=x-5,Y=y-44,W=w+10,H=h+38;const st=r.style||'flat';
 R('#1e1a18',X-1,Y-1,W+2,H+12);
 const base={flat:'#8a8f94',clinic:'#e4e8ea',police:'#34466a',school:'#8a5a3a',mil:'#5a6040',metal:'#7a8288',tile:'#7a3a30',tile2:'#4f5964',tile3:'#6b5641',mart:'#7d8288',rest:'#8a6a5a'}[st]||'#8a8f94';R(base,X,Y,W,H);
 if(st.startsWith('tile')){for(let i=3;i<H;i+=4)R('#00000026',X,Y+i,W,1);for(let i=0;i<H;i+=4)for(let q=((i/4)%2)*4;q<W;q+=8)R('#00000018',X+q,Y+i,1,3);if(W>=H)R('#ffffff30',X,Y+(H>>1),W,2);else R('#ffffff30',X+(W>>1),Y,2,H)}
 else if(st=='metal'||st=='mil'){for(let i=0;i<W;i+=6){R('#ffffff18',X+i,Y,2,H);R('#00000018',X+i+3,Y,1,H)}if(st=='mil')for(let k=0;k<Math.max(6,W*H/6000);k++)blob(X+10+hh(k,x,1)*(W-20),Y+8+hh(k,y,2)*(H-16),4+(k%3)*2,3+(k%2)*2,k%2?'#4a5030':'#6b6a48')}
 else{R('#ffffff22',X,Y,W,3);R('#ffffff22',X,Y,3,H);R('#00000033',X+W-3,Y,3,H);R('#00000033',X,Y+H-3,W,3);R('#00000012',X+6,Y+6,W-12,H-12);
  for(let k=0;k<Math.max(2,W*H/30000);k++){const ax=X+12+(hh(k,x,3)*(W-40)|0),ay=Y+12+(hh(k,y,4)*(H-40)|0);R('#3a3f45',ax,ay,16,12);R('#9aa0a6',ax+1,ay+1,14,10);blob(ax+8,ay+6,3,3,'#555')}}
 if(st=='clinic'){blob(X+W*.75,Y+H*.4,30,30,'#5a5e62');blob(X+W*.75,Y+H*.4,27,27,'#6a6e72');R('#e8e8e0',X+W*.75-12,Y+H*.4-14,4,28);R('#e8e8e0',X+W*.75+8,Y+H*.4-14,4,28);R('#e8e8e0',X+W*.75-8,Y+H*.4-2,16,4);R('#d33a3a',X+W*.3-8,Y+H*.45-26,16,52);R('#d33a3a',X+W*.3-26,Y+H*.45-8,52,16)}
 if(st=='police'){R('#f0f0e8',X,Y+(H>>1)-3,W,6);R('#d9b52a',X+W/2-9,Y+H/2-11,18,22);R('#34466a',X+W/2-6,Y+H/2-8,12,16)}
 if(st=='school'){for(let k=0;k<4;k++)R('#9fc8dc',X+20+k*((W-60)/3),Y+H/2-8,20,16)}
 R('#00000055',X,Y+H,W,10);R('#00000030',X,Y+H,W,2);if(r.awn)for(let q=0;q<W;q+=6)R(r.awn[(q/6)%2],X+q,Y+H,6,9);
 g.globalAlpha=1}
