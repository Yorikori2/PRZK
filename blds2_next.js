/* PROJECT LEGACY — sample: new buildings, batch 2 (big ones).
   병원 (2 blocks wide: main building + ward, joined by a bridge over the road) · 대형 마트 · 주차 타워 ·
   지하철역 (open-cut platform with a stopped train) · 교도소 (fenced, guard towers, cell block, armoury) · 라디오 방송국.
   Same rules as batch 1: furniture, loot, zombies, tier, demolition level, alarms, first-visit bonus.
   Loaded after blds_next.js. */
'use strict';
/* ---------- a prisoner zombie ---------- */
if(!LOOKS.prisoner)LOOKS.prisoner={...LOOKS.civ1,p:'#d8742a',pd:'#b45e1e',c:'#e8842e',cl:'#f8a050',cd:'#c0661e',h:'#2a2a22'};
/* ---------- new furniture ---------- */
P('tgate','개찰구',null,o=>{const{x,y,w,h}=o;for(let i=0;i<w;i+=30){B3(x+i,y,8,h,18,'#9aa0a6','#6a6f75');R('#3f9a5a',x+i+2,y-16,4,3);R('#c43c32',x+i+12,y-10,14,2)}});
P('train','전동차',['scrap','elec','food','water'],o=>{const{x,y,w,h}=o,K='#1d1714';shd(x+4,y+4,w,h);R(K,x-1,y-22,w+2,h+23);R('#d8dcdc',x,y-21,w,h+20);R('#c43c32',x,y-21+(h+20)*.55,w,5);
 for(let i=10;i<w-30;i+=46){R('#2a3a4a',x+i,y-17,30,10);R('#5f8aa6',x+i+1,y-16,28,4)}for(let i=0;i<w;i+=w/3|0)R('#8a9096',x+i,y-21,2,h+20);R('#9aa0a6',x,y-21,w,2)});
P('escal','에스컬레이터',null,o=>{const{x,y,w,h}=o;R('#1d1714',x-1,y-1,w+2,h+2);R('#3a3f45',x,y,w,h);for(let i=4;i<h-2;i+=5)R('#6a6f75',x+3,y+i,w-6,2);R('#9aa0a6',x,y,3,h);R('#9aa0a6',x+w-3,y,3,h)},false);
P('cart','쇼핑카트',['food','scrap'],o=>{const{x,y,w,h}=o;shd(x,y+h-3,w,3);R('#6a6f75',x,y,w,h-4);for(let i=2;i<w;i+=3)R('#9aa0a6',x+i,y+1,1,h-6);R('#c43c32',x-2,y-2,3,6);blob(x+3,y+h-1,2,2,'#1d1714');blob(x+w-3,y+h-1,2,2,'#1d1714')});
P('mast','송신탑',null,o=>{const x=o.x+o.w/2,y=o.y+o.h;shd(x-14,y-4,28,8);for(let i=0;i<180;i+=12){const wd=14-i/16;ln(x-wd,y-i,x+wd,y-i-12,'#c43c32');ln(x+wd,y-i,x-wd,y-i-12,'#e8e8e0');R(i%24?'#c43c32':'#e8e8e0',x-wd,y-i-1,2,1);R(i%24?'#c43c32':'#e8e8e0',x+wd-1,y-i-1,2,1)}
 R('#3a3f45',x-16,y-6,32,6);const on=Math.sin(performance.now()/300)>0;R(on?'#ff4040':'#801818',x-2,y-186,4,4)});
P('mic','방송 콘솔',['elec','elec','scrap'],o=>{const{x,y,w,h}=o;B3(x,y,w,h,14,'#3a3f45','#2a2e33');for(let i=6;i<w-6;i+=7){R('#1d1714',x+i,y-12,3,8);R(i%14?'#e0b03a':'#7fd0ff',x+i,y-10+(i*3%5),3,2)}R('#1d1714',x+w/2-2,y-30,4,16);blob(x+w/2,y-32,5,5,'#2a2e33')});
P('pstair','승강장 계단',null,o=>{const{x,y,w,h}=o;R('#1d1714',x-1,y-1,w+2,h+2);for(let i=0;i<h;i+=4)R(i%8?'#8a9096':'#6a6f75',x,y+i,w,4);R('#e0b03a',x,y,w,2);R('#e0b03a',x,y+h-2,w,2)},false);
P('rail','선로',null,o=>{const{x,y,w,h}=o;for(let i=x;i<x+w;i+=14)R('#5a4030',i,y,6,h);R('#9aa0a6',x,y+4,w,2);R('#9aa0a6',x,y+h-6,w,2)},false);
P('riot','진압 장비 보관함',['ammo','scrap'],o=>{const{x,y,w,h}=o;B3(x,y,w,h,34,'#3a4a5a','#2a3a4a');for(let i=4;i<w-4;i+=12){R('#1d1714',x+i,y-30,8,20);R('#9ad0f055',x+i+1,y-29,6,8)}R('#e0b03a',x+2,y-8,w-4,2)});
LOOTT.riot=['ammo','scrap'];
/* hospital: main building on the left block, ward on the right block, bridge across the road */
function shellG(A,x0,y0,x1,y1,face,south,wG,eG){A.hw(x0-4,x1+4,y0,34,face);vseg(A,x0,y0,y1,wG||[],34);vseg(A,x1,y0,y1,eG||[],34);let x=x0-4;for(const[a,b]of south){A.hw(x,a,y1,8,'#b8b2a6');x=b}A.hw(x,x1+4,y1,8,'#b8b2a6')}
BUILDERS.hosp=(c,r,sd)=>{if(c>NBX-2)return BUILDERS.park(c,r,sd);const A=Bld('병원',c,r,'hosp'),Rn=mulberry(sd*19+7),R2=BW+RD;/* right block starts at R2 · the road between stays a road, the bridge crosses it */
 for(const x0 of[0,R2]){A.fl(x0,0,BW,BH,'grass');A.fl(x0,540,BW,164,'asphalt')}A.fl(80,80,780,390,'hall');A.fl(80,470,780,50,'walk');A.fl(R2+40,80,780,390,'vinylW');A.fl(R2+40,470,780,50,'walk');A.fl(860,250,R2+40-860,56,'hall');
 A.dec(0,540,BW,164,(ox,oy)=>{for(let x=60;x<BW-40;x+=70)R('#e8e8e0',ox+x,oy+610,2,60);R('#e0b03a',ox+300,oy+556,320,3);for(let i=0;i<4;i++)R('#e8e8e0',ox+320+i*80,oy+570,40,6)});
 const mN=(x0,x1,y,h)=>{const o=A.ox;R('#eef0ee',o+80,y,780,h);R('#c43c32',o+80,y+h-14,780,8);for(const wx of[130,230,640,760])winD(o+wx,50,y,h);R('#c43c32',o+440,y+6,60,h-24);R('#f4f4ee',o+465,y+8,10,h-28);R('#f4f4ee',o+450,y+(h-14)/2-6,40,10)};
 shellG(A,80,80,860,470,mN,[[420,520]],[],[[250,306]]);vseg(A,360,80,470,[[300,360]],34);vseg(A,620,80,470,[[180,240]],34);A.hw(620,860,290,10);A.hw(80,360,260,10);
 /* 응급실 */for(let x=100;x<=260;x+=80){A.o('gurney',x,110,50,18);A.o('curtain',x+64,92,3,64);A.o('iv',x+40,100,8,8)}A.o('monitor',320,110,22,10);A.o('mcart',260,200,40,18);A.o('wheelchair',110,220,22,8);
 /* 접수 */A.o('counter',390,140,200,22);A.o('chairs',390,330,100,20);A.o('chairs',500,330,100,20);A.o('chairs',390,400,100,20);A.o('vending',580,420,24,20);A.o('plant',380,440,14,10);
 /* 약제실 */for(let y=290;y<=410;y+=60)A.o('medshelf',96,y,60,18);A.o('medshelf',190,300,44,16);A.o('cabinet',280,290,40,10);A.o('fridge',310,400,30,22);
 /* 수술실 */A.o('optable',700,140,60,24);A.o('anest',780,120,26,16);A.o('tray',660,190,30,10);A.o('monitor',800,200,22,10);A.o('sink',640,100,26,14);A.o('cabinet',800,96,40,10);
 /* 영상 */A.o('xray',650,320,84,18);A.o('leadglass',640,390,62,4);A.o('desk',760,330,60,24);A.o('stool',780,380,10,10);
 const W=R2+40,wN=(x0,x1,y,h)=>{const o=A.ox;R('#e8e4dc',o+W,y,780,h);for(const wx of[60,160,260,500,620,720])winD(o+W+wx,40,y,h)};
 shellG(A,W,80,W+780,470,wN,[[W+340,W+440]],[[250,306]],[]);vseg(A,W+460,80,400,[],34);
 /* 병동 */for(let y=110;y<=330;y+=110)for(let x=W+40;x<=W+260;x+=110){A.o('bed',x,y,36,64);A.o('iv',x+44,y+4,8,8)}A.o('wheelchair',W+360,420,22,8);A.o('mcart',W+150,430,40,18);
 /* 간호사실 · 격리 */A.o('counter',W+490,120,160,22,{fc:'#3a6ea8'});A.o('chair',W+550,160,14,12);A.o('cabinet',W+700,100,40,10);A.o('medshelf',W+700,160,60,18);for(let x=W+490;x<=W+690;x+=100){A.o('bed',x,300,36,64);A.o('curtain',x+50,280,3,90)}
 /* the bridge has no side walls: the road under it stays open */
 A.roof(80,80,780,390,'clinic','병원 본관',['#c43c32','#eef0ee']);A.roof(W,80,780,390,'clinic','병동',['#3a6ea8','#e8e4dc']);A.roof(860,250,W-860,56,'flat','연결 통로',['#9aa0a6','#eef0ee']);
 A.ent(470,484,0,-1);A.ent(W+390,484,0,-1);
 A.o('ambulance',330,600,120,34);A.o('ambulance',500,620,120,34);A.o('helipad',W+560,560,110,110);A.o('wreck',W+100,600,56,28);A.o('bollard',410,536,8,8);A.o('bollard',540,536,8,8);A.o('lamp',60,500,6,6);A.o('lamp',W+800,500,6,6);A.o('tree',30,30,20,20);A.o('tree',W+810,30,20,20);
 for(const[l,x,y]of[['patient',180,160],['nurse',260,250],['doctor',470,250],['patient',520,400],['doctor',720,230],['patient',W+120,200],['nurse',W+560,200],['patient',W+640,380],['heavy',700,620],['screamer',W+400,620]])if(Rn()<.85)A.z(l,x,y)};
BUILDERS.hospR=(c,r,sd)=>{if(c==0)BUILDERS.park(c,r,sd)};/* the left block draws both halves */
BUILDERS.mall=(c,r,sd)=>{const A=Bld('대형 마트',c,r,'mall'),Rn=mulberry(sd*17+3);
 A.fl(0,0,BW,BH,'asphalt');A.fl(60,60,776,440,'vinylG');A.fl(60,500,776,40,'walk');A.fl(620,320,216,180,'tileK');
 A.dec(0,540,BW,164,(ox,oy)=>{for(let x=40;x<BW-40;x+=60)R('#e8e8e0',ox+x,oy+600,2,70);R('#e8e8e0',ox+40,oy+670,BW-80,2)});
 const mN=(x0,x1,y,h)=>{const o=A.ox;R('#e8e0c8',o+60,y,776,h);R('#d9b52a',o+60,y+h-16,776,10);R('#c43c32',o+300,y+4,300,h-22);R('#f4f4ee',o+320,y+10,260,h-34);for(const wx of[100,180,660,740])winD(o+wx,50,y,h)};
 shell(A,60,60,836,500,mN,[[300,380],[520,600]]);vseg(A,620,320,500,[[400,450]],10);A.hw(620,836,320,10);
 for(let x=90;x<=560;x+=36)A.o('drinks',x,76,32,14);for(let x=90;x<=540;x+=70){A.o('aisle',x,140,24,140)}A.o('fridge',700,90,30,22);A.o('fridge',740,90,30,22);A.o('fridge',780,90,30,22);A.o('shelf',660,180,60,18);A.o('shelf',740,180,60,18);
 for(let x=100;x<=480;x+=80)A.o('register',x,400,40,10);A.o('escal',580,120,30,120);A.o('cart',120,460,20,14);A.o('cart',150,462,20,14);A.o('cart',560,470,20,14);
 /* 푸드코트 */A.o('tableset',650,350,50,40);A.o('tableset',740,350,50,40);A.o('tableset',650,430,50,40);A.o('kitchen',740,440,80,20);
 A.roof(60,60,776,440,'mart','대형 마트',['#d9b52a','#e8e0c8']);A.ent(340,514,0,-1);A.ent(560,514,0,-1);
 A.o('cart',200,600,20,14);A.o('cart',260,620,20,14);A.o('car',420,590,56,28,{c:'#3a6ea8'});A.o('wreck',600,630,56,28);A.o('car',700,590,56,28,{c:'#4f5a35'});A.o('dumpster',40,520,40,20);
 for(const[l,x,y]of[['civ1',200,220],['civ2',400,220],['civ3',300,400],['runner',700,400],['civ1',500,300],['heavy',300,620]])if(Rn()<.8)A.z(l,x,y)};
BUILDERS.park2=(c,r,sd)=>{const A=Bld('주차 타워',c,r,'park2'),Rn=mulberry(sd*23+1);
 A.fl(0,0,BW,BH,'asphalt');A.fl(80,60,736,500,'concrete');A.fl(80,560,736,40,'walk');
 A.dec(80,60,736,500,(ox,oy)=>{for(let i=0;i<10;i++)blob(ox+120+hh(i,3,9)*660,oy+100+hh(i,6,9)*420,12,6,'#2a2c30');for(let y=280;y<330;y+=1)R('#e0b03a33',ox+120,oy+y,640,1);for(let x=160;x<760;x+=80){R('#e8e8e0',ox+x,oy+300,24,4);R('#e8e8e0',ox+x+18,oy+296,6,12)}R('#e8e8e0',ox+700,oy+140,40,70);R('#3a3f45',ox+704,oy+144,32,62);ln(ox+705,oy+200,ox+735,oy+150,'#e8e8e0')});
 const pN=(x0,x1,y,h)=>{const o=A.ox;R('#9aa0a6',o+80,y,736,h);for(let i=0;i<736;i+=60)R('#6a6f75',o+80+i,y+4,40,h-18);R('#3a6ea8',o+80,y+h-12,736,6)};
 shell(A,80,60,816,560,pN,[[160,300],[600,740]]);
 for(const y of[130,420])A.o('stripes',120,y,560,90);for(let x=200;x<=680;x+=160)for(const y of[230,380])A.o('pillar',x,y,18,16);
 for(let i=0;i<10;i++){const x=126+i*56,y=Rn()<.5?140:430;if(Rn()<.6)A.o(Rn()<.4?'wreck':'car',x,y,50,26,{c:['#3a6ea8','#c43c32','#4f5a35','#d8dcdc','#1d1714'][i%5]})}
 A.o('booth',100,600,40,30);A.o('barrier',150,606,60,10);A.o('barrier',620,606,60,10);A.o('tires',740,90,40,24);A.o('barrel',760,500,16,10);A.o('extinguisher',90,300,8,8);
 A.roof(80,60,736,500,'flat','주차 타워',['#3a6ea8','#9aa0a6']);A.ent(230,574,0,-1);A.ent(670,574,0,-1);
 for(const[l,x,y]of[['civ1',300,200],['civ2',500,400],['runner',600,300],['civ3',200,450],['cop',700,620]])if(Rn()<.8)A.z(l,x,y)};
BUILDERS.subway=(c,r,sd)=>{const A=Bld('지하철역',c,r,'subway'),Rn=mulberry(sd*29+9);
 A.fl(0,0,BW,BH,'walk');A.fl(80,60,736,240,'tileP');A.fl(40,330,816,70,'grey');A.fl(40,400,816,110,'gravel');A.fl(40,510,816,60,'grey');A.fl(0,600,BW,104,'asphalt');
 A.dec(40,330,816,240,(ox,oy)=>{R('#e0b03a',ox+40,oy+396,816,4);R('#e0b03a',ox+40,oy+510,816,4);R('#1d1714',ox+40,oy+400,816,3)});
 A.o('rail',40,420,816,22);A.o('rail',40,466,816,22);A.o('train',140,430,520,30);
 const sN=(x0,x1,y,h)=>{const o=A.ox;R('#d8dcdc',o+80,y,736,h);R('#3f9a5a',o+80,y+h-14,736,8);R('#1d1714',o+380,y+6,140,h-26);R('#3f9a5a',o+390,y+10,24,h-34);R('#f4f4ee',o+420,y+12,90,4);for(const wx of[130,230,620,720])winD(o+wx,50,y,h)};
 shellG(A,80,60,816,300,sN,[[160,240],[440,520],[660,740]],[[140,220]],[[140,220]]);
 A.o('tgate',300,180,300,14);A.o('counter',120,90,140,22,{fc:'#3f9a5a'});A.o('vending',700,90,24,20);A.o('vending',740,90,24,20);A.o('chairs',620,240,120,20);A.o('bench',120,240,60,12);A.o('locker',300,90,24,40);A.o('cabinet',350,90,40,10);
 A.o('pstair',160,300,80,30);A.o('pstair',660,300,80,30);A.o('pstair',440,300,80,30);
 for(let x=100;x<=760;x+=110){A.o('bench',x,344,50,12);A.o('pillar',x+60,350,14,12)}for(let x=100;x<=760;x+=150)A.o('pillar',x,530,14,12);
 A.roof(80,60,736,240,'flat','지하철역',['#3f9a5a','#d8dcdc']);A.roof(40,330,816,70,'metal','승강장',['#3f9a5a','#9aa0a6']);A.ent(480,274,0,1);A.ent(180,140,1,0);
 A.o('lamp',60,620,6,6);A.o('car',300,630,56,28,{c:'#c43c32'});A.o('trash',840,40,16,8);
 for(const[l,x,y]of[['civ1',300,240],['civ2',600,150],['runner',200,360],['civ3',700,360],['civ1',400,540],['screamer',500,370],['civ2',150,540]])if(Rn()<.8)A.z(l,x,y)};
BUILDERS.prison=(c,r,sd)=>{const A=Bld('교도소',c,r,'prison'),Rn=mulberry(sd*31+13);
 A.fl(0,0,BW,BH,'dirt');A.fl(120,80,656,340,'grey');A.fl(120,420,656,160,'gravel');A.fl(400,580,96,124,'asphalt');A.fl(0,660,BW,44,'asphalt');
 A.dec(120,440,656,140,(ox,oy)=>{R('#e8e8e0',ox+200,oy+470,200,2);R('#e8e8e0',ox+200,oy+560,200,2);R('#e8e8e0',ox+200,oy+470,2,90);R('#e8e8e0',ox+400,oy+470,2,90)});
 A.o('fence',30,30,836,4);A.o('fence',30,640,370,4);A.o('fence',496,640,370,4);A.o('fence',30,34,4,606);A.o('fence',862,34,4,606);A.o('fence',60,52,776,4);
 for(const[x,y]of[[40,40],[820,40],[40,600],[820,600]])A.o('tower',x,y,28,26);A.o('booth',420,600,40,30);A.o('barrier',462,640,34,10);
 const cN=(x0,x1,y,h)=>{const o=A.ox;R('#a8a49a',o+120,y,656,h);for(let i=0;i<656;i+=40)R('#8a867c',o+120+i,y,2,h-10);R('#5a5650',o+120,y+h-12,656,6);for(const wx of[180,300,560,680])R('#1d1714',o+wx,y+8,20,h-26),R('#6a6f75',o+wx+4,y+8,2,h-26),R('#6a6f75',o+wx+12,y+8,2,h-26)};
 shell(A,120,80,776,420,cN,[[420,476]]);vseg(A,560,80,420,[[330,380]],34);A.hw(120,560,250,10);
 /* 감방 */for(let x=130;x<=470;x+=68){A.o('cell',x+4,236,46,4);A.o('bunk',x+6,96,30,54);A.o('toilet',x+40,100,14,12)}A.o('cell',130,96,4,140);
 /* 식당 */A.o('longtable',160,300,160,24);A.o('longtable',360,300,160,24);A.o('longtable',160,370,160,24);A.o('kitchen',380,380,120,20);
 /* 무기고 · 간수실 */A.o('riot',580,96,80,20);A.o('gunrack',680,100,60,16);A.o('locker',740,140,24,40);A.o('desk',600,200,60,30);A.o('chair',620,240,14,12);A.o('console',600,300,82,14);A.o('cabinet',720,300,40,10);A.o('alarmbox',740,380,16,12);
 A.roof(120,80,656,340,'police','교도소',['#d8742a','#a8a49a']);A.ent(448,434,0,-1);
 A.o('hoop',600,450,40,4);A.o('bench',220,520,60,12);A.o('pcar',540,670,60,30);A.o('truck',120,660,90,36);
 for(const[l,x,y]of[['prisoner',200,180],['prisoner',340,180],['prisoner',260,330],['prisoner',440,350],['prisoner',300,500],['cop',650,250],['cop',700,480],['heavy',500,520],['prisoner',160,500],['runner',600,560]])if(Rn()<.85)A.z(l,x,y)};
BUILDERS.radio=(c,r,sd)=>{const A=Bld('라디오 방송국',c,r,'radio'),Rn=mulberry(sd*37+5);
 A.fl(0,0,BW,BH,'grass');A.fl(100,100,480,330,'carpet');A.fl(100,430,480,40,'walk');A.fl(620,80,240,360,'gravel');A.fl(0,560,BW,144,'asphalt');
 const rN=(x0,x1,y,h)=>{const o=A.ox;R('#d8d0c0',o+100,y,480,h);R('#2a2e33',o+100,y+h-14,480,8);R('#c43c32',o+260,y+6,160,h-26);R('#f4f4ee',o+272,y+10,40,h-34);R('#f4f4ee',o+318,y+14,90,4);for(const wx of[140,480])winD(o+wx,50,y,h)};
 shell(A,100,100,580,430,rN,[[310,370]]);vseg(A,340,100,280,[[200,250]],34);A.hw(100,580,280,10);
 /* 스튜디오 */A.o('mic',140,150,140,18);A.o('chair',190,190,14,12);A.o('chair',230,190,14,12);A.o('leadglass',120,240,200,4);A.o('rug',150,110,120,30);
 /* 서버 · 송출실 */A.o('rack',370,120,60,18);A.o('rack',450,120,60,18);A.o('console',370,220,140,14,{radio:1});A.o('gen',520,200,44,20);
 /* 사무실 */A.o('desk',130,320,60,30);A.o('desk',240,320,60,30);A.o('bookshelf',380,300,60,14);A.o('sofa',460,370,70,24);A.o('cabinet',140,400,40,10);A.o('cooler',520,300,16,14);
 A.roof(100,100,480,330,'flat','라디오 방송국',['#c43c32','#d8d0c0']);A.ent(340,444,0,-1);
 A.o('fence',620,80,240,4);A.o('fence',620,436,240,4);A.o('fence',856,84,4,352);A.o('mast',720,260,30,30);A.o('gen',650,380,44,20);A.o('ftank',760,380,40,24);A.o('solar',660,110,60,30);A.o('radio',820,140,12,12);
 A.o('car',200,600,56,28,{c:'#d8dcdc'});A.o('truck',600,600,90,36);A.o('lamp',60,520,6,6);A.o('tree',40,40,20,20);
 for(const[l,x,y]of[['civ1',200,350],['civ2',420,180],['runner',700,300],['civ3',300,520],['screamer',250,180]])if(Rn()<.8)A.z(l,x,y)};
/* ---------- rules ---------- */
const NB2=['hosp','hospR','mall','park2','subway','prison','radio'];
Object.assign(TIER,{hosp:3,hospR:3,mall:2,park2:2,subway:2,prison:4,radio:3});Object.defineProperty(KNAME,'hospR',{value:'병원',enumerable:false,writable:true});Object.assign(KNAME,{hosp:'병원',mall:'대형 마트',park2:'주차 타워',subway:'지하철역',prison:'교도소',radio:'라디오 방송국'});
if(typeof DLV!='undefined')Object.assign(DLV,{hosp:3,hospR:3,mall:3,park2:3,subway:3,prison:4,radio:2});if(typeof ALR!='undefined')Object.assign(ALR,{mall:.15,prison:.35,hosp:.1});
Object.assign(KL,{hosp:['bandage','bandage','pills','medkit','meds','meds'],mall:['food','food','water','water','cloth','bandage'],park2:['fuel','scrap','carpart','food'],subway:['food','water','cloth','scrap','elec'],prison:['ammo','food','cloth','scrap'],radio:['elec','elec','scrap','battery'].filter(k=>I_BY[k])});KL.hospR=KL.hosp;
Object.assign(WLOOT,{prison:['baton','pump','pistol','knife','shiv'].filter(k=>W_BY[k]),hosp:['scalpel','knife'].filter(k=>W_BY[k]),park2:['crowbar','wrench'],subway:['pipe','bat'].filter(k=>W_BY[k])});
Object.assign(AMLOOT,{prison:['a12g','a12g','a9mm']});
Object.assign(GLOOT,{hosp:['gasmask','medkit'],mall:['bag2','wboots'].filter(k=>I_BY[k]||W_BY[k]),prison:['vest','helmet'].filter(k=>I_BY[k]||W_BY[k]),radio:['headlamp'].filter(k=>I_BY[k]||W_BY[k])});GLOOT.hospR=GLOOT.hosp;
if(typeof KCOL!='undefined')Object.assign(KCOL,{hosp:'#eef0ee',hospR:'#eef0ee',mall:'#d9b52a',park2:'#6a7a8a',subway:'#3f9a5a',prison:'#d8742a',radio:'#c43c32'});
if(typeof SPEC!='undefined')Object.assign(SPEC,{hosp:{medkit:2,bandage:4},mall:{food:4,water:4},park2:{fuel:3,carpart:2},subway:{food:2,water:2,elec:2},prison:{a12g:16,vest:1},radio:{elec:6}});
for(const k in SPEC)if(NB2.includes(k))for(const i in SPEC[k])if(!I_BY[i]&&!W_BY[i])delete SPEC[k][i];
/* ---------- where they stand ----------
   The hospital needs two side-by-side blocks (left one at an even x) that are both free. */
{let HG=0;const _k=kindAt,FIX=['base','lot','mil','milR','rbase','pharm','gunshop','garage','bank'];
 kindAt=function(gx,gy){/* the ward half goes with the main building when it is demolished */if((gx&1)!==0){let D=null;try{D=S&&S.inf&&S.inf.demo}catch(e){}const L=D&&D[(gx-1)+','+gy];if(L&&L.k=='hosp'&&!D[gx+','+gy])D[gx+','+gy]={k:'hospR',sh:0,day:L.day}}
  const k=_k(gx,gy);if(gx==0&&gy==0||FIX.includes(k))return k;const d=Math.max(Math.abs(gx),Math.abs(gy)),r=bh(gx,gy,29);
  if(!HG){HG=1;try{
   if((gx&1)!==0&&kindAt(gx-1,gy)=='hosp')return'hospR';
   if((gx&1)==0&&d>=3&&r<.05){const rk=_k(gx+1,gy);if(!FIX.includes(rk)&&!(gx+1==0&&gy==0))return'hosp'}}finally{HG=0}}
  else if((gx&1)==0&&d>=3&&r<.05)return'hosp';
  if(d>=2&&r>=.05&&r<.09)return'mall';if(d>=2&&r>=.09&&r<.12)return'park2';if(d>=2&&r>=.12&&r<.15)return'subway';if(d>=5&&r>=.15&&r<.17)return'prison';if(d>=4&&r>=.17&&r<.195)return'radio';return k}}
