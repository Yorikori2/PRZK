/* PROJECT LEGACY — expansion buildings (sample only until approved). */
'use strict';
/* ================= MILITARY BASE (2 blocks wide) ================= */
function buildMil2(c,r){const A=Bld('군부대',c,r,'mil');const WX=2*BW+RD,HY=BH;
 A.fl(0,0,WX,HY,'dirt');A.fl(40,320,WX-80,50,'asphalt');A.fl(930,370,80,320,'asphalt');
 A.dec(0,0,WX,HY,(ox,oy)=>{for(let i=0;i<40;i++)R('#6a5a3a',ox+60+hh(i,1,7)*(WX-120),oy+40+hh(i,2,7)*(HY-80),20+(i%3)*8,2);for(let x=60;x<WX-60;x+=48)R('#d9c35a',ox+x,oy+344,24,2);for(let x=944;x<1000;x+=10)R('#e8e8e0',ox+x,oy+660,5,24)});
 // perimeter
 A.o('fence',16,22,WX-32,4);A.o('fence',16,684,884,4);A.o('fence',1020,684,WX-1036,4);A.o('fence',16,26,4,658);A.o('fence',WX-20,26,4,658);
 [[28,40],[940,40],[WX-56,40],[28,640],[WX-56,640],[860,640],[1036,640]].forEach(([x,y])=>A.o('tower',x,y,28,26));
 A.o('barrier',906,670,56,4);A.o('booth',1050,600,40,30);A.o('mgnest',820,600,60,40);A.o('mgnest',1100,560,60,40);A.o('sandbag',880,620,44,14);A.o('sandbag',1010,620,44,14);
 // HQ
 const hqN=(x0,x1,y,h)=>{const o=A.ox;R('#7a8068',o+48,y,412,h);for(let yy=y+4;yy<y+h-4;yy+=8)R('#6a7058',o+48,yy,412,1);R('#00000030',o+48,y+h-3,412,3);winD(o+300,30,y,h);winD(o+400,30,y,h);R('#1d1714',o+90,y+3,110,24);R('#3a5a3a',o+91,y+4,108,22);for(let i=0;i<9;i++)ln(o+96+i*11,y+9,o+100+i*12,y+22,'#d9c35a');R('#d33a3a',o+150,y+12,4,4)};
 shell(A,48,64,460,300,hqN,[[130,170]]);vseg(A,250,64,300,[[100,136],[220,256]],34);hseg(A,250,460,180,[[380,410]]);
 A.o('console',60,72,180,14);A.o('ctable',80,150,130,56,{c:'#5a6440'});[[100,136],[150,136],[100,214],[150,214]].forEach(([x,y])=>A.o('chair',x,y,12,8));A.o('board',60,270,80,6,{c:'#e8e8e0'});
 A.o('rack',262,72,26,12);A.o('rack',294,72,26,12);A.o('rack',326,72,26,12);A.o('console',362,78,90,14,{radio:1});A.o('desk',300,130,60,18);
 A.o('desk',300,214,70,20,{c:'#6b4426'});A.o('chair',326,198,12,8,{c:'#6b4426'});A.o('bookshelf',430,192,24,90);A.o('flag',270,260,6,6,{c:'#5a6440',c2:'#3e4729'});A.o('locker',262,282,60,12,{c:'#4f5a35'});
 A.roof(48,64,412,236,'mil','지휘본부');
 // barracks A / B
 const bk=(x0,x1,label)=>{const n=(xa,xb,y,h)=>{const o=A.ox;R('#9a8a6a',o+x0,y,x1-x0,h);for(let x=o+x0+6;x<o+x1;x+=10)R('#a89a7a',x,y+2,1,h-12);R('#00000030',o+x0,y+h-3,x1-x0,3);for(let x=x0+30;x<x1-30;x+=90)winD(o+x,26,y,h)};const mid=(x0+x1)/2;shell(A,x0,64,x1,300,n,[[mid-20,mid+20]]);A.roof(x0,64,x1-x0,236,'mil',label)};
 bk(520,860,'1막사');for(let i=0;i<5;i++){A.o('bunk',536+i*64,72,30,54);A.o('bunk',536+i*64,212,30,54)}A.o('locker',536,148,300,12,{c:'#4f5a35'});
 bk(920,1260,'2막사');for(let i=0;i<3;i++){A.o('bunk',936+i*64,72,30,54);A.o('bunk',936+i*64,212,30,54)}A.o('locker',936,148,170,12,{c:'#4f5a35'});
 vseg(A,1150,64,300,[[200,236]]);A.o('sink',1160,70,90,12,{n:3});A.o('stall',1200,230,3,64);A.o('stall',1230,230,3,64);[1166,1208,1238].forEach(x=>A.o('toilet',x,280,16,16));
 // mess hall
 const mN=(x0,x1,y,h)=>{const o=A.ox;R('#c9b48f',o+1320,y,380,h);R('#00000030',o+1320,y+h-3,380,3);[1360,1440,1520,1620].forEach(x=>winD(o+x,30,y,h))};
 shell(A,1320,64,1700,300,mN,[[1420,1470]]);vseg(A,1560,64,300,[[130,170]],34);
 [100,170,236].forEach(y=>A.o('longtable',1336,y,210,26));A.o('kitchen',1572,70,120,14);A.o('fridge',1672,110,20,14);A.o('fridge',1672,146,20,14);A.o('counter',1572,236,100,20,{fc:'#5a6440',logo:'bar'});A.o('sink',1580,190,60,12);
 A.roof(1320,64,380,236,'metal','식당');
 // med station
 const meN=(x0,x1,y,h)=>{const o=A.ox;R('#e8e8e0',o+1740,y,140,h);R('#d33a3a',o+1800,y+6,6,14);R('#d33a3a',o+1795,y+10,16,6)};
 shell(A,1740,64,1880,300,meN,[[1790,1830]]);A.o('bed',1750,74,30,54,{rail:1});A.o('bed',1800,74,30,54,{rail:1});A.o('iv',1836,100,8,6);A.o('medshelf',1850,150,24,100);A.o('mcart',1754,220,22,14);
 A.roof(1740,64,140,236,'flat','의무대');
 // armory bunker (door on east)
 const amN=(x0,x1,y,h)=>{const o=A.ox;R('#5a5f66',o+48,y,332,h);for(let x=o+48;x<o+380;x+=16)R('#4a4f55',x,y,1,h);R('#e8c43a',o+48,y+h-10,332,4);for(let x=o+48;x<o+380;x+=12)R('#1d1714',x,y+h-10,6,4)};
 A.hw(44,384,400,34,amN);A.vw(48,400,640,34);vseg(A,380,400,640,[[500,544]],34);A.hw(44,384,640,8,'#6a6f75');A.door(380,544,40,'v','#3a3f45');
 A.o('gunrack',60,406,90,12);A.o('gunrack',160,406,90,12);A.o('gunrack',260,406,90,12);A.o('gunrack',60,470,12,80);for(let i=0;i<4;i++)A.o('ammo',110+i*30,500,24,14);A.o('tnt',110,560,26,18);A.o('tnt',150,560,26,18);A.o('tnt',110,600,26,18);A.o('locker',300,580,60,12,{c:'#4f5a35'});A.o('crate',250,520,24,20);
 A.roof(48,400,332,240,'flat','무기고');A.o('sandbag',394,520,14,60);
 // motor pool (big door north)
 const mpN=(x0,x1,y,h)=>{const o=A.ox;R('#6a7058',o+440,y,420,h);R('#00000030',o+440,y+h-3,420,3)};
 A.hw(436,520,400,34,mpN);A.hw(780,864,400,34,mpN);A.dec(520,370,260,34,(ox,oy)=>{for(let i=0;i<6;i++)R(i%2?'#e8c43a':'#1d1714',ox+520+i*44,oy+398,44,3)});A.vw(440,400,640,34);A.vw(860,400,640,34);A.hw(436,864,640,8,'#6a7058');
 A.fl(440,400,420,240,'concrete');A.o('truck',460,430,140,38);A.o('truck',460,510,140,38);A.o('humvee',680,440,70,32);A.o('humvee',680,520,70,32);A.o('bench2',780,580,70,18);A.o('tool',460,600,30,14);A.o('tires',620,600,22,14);A.o('barrel',800,450,16,10,{c:'#4f5a35'});A.o('barrel',820,456,16,10,{c:'#4f5a35'});A.o('gen',780,500,44,20);
 A.roof(440,400,420,240,'metal','차량정비고');
 // parade + heli + fuel + range
 A.o('flag',964,420,6,6,{c:'#5a6440',c2:'#3e4729'});A.o('tent',1060,410,110,64);
 A.dec(1180,430,150,150,(ox,oy)=>D.helipad({x:ox+1180,y:oy+430,w:150,h:150}));A.o('heli',1150,470,200,60);
 A.o('ftank',1400,420,120,40);A.o('ftank',1400,500,120,40);A.o('ftank',1540,440,60,34);[[1400,600],[1422,600],[1444,606],[1540,560],[1562,566]].forEach(([x,y])=>A.o('barrel',x,y,16,10,{c:'#c2502f'}));A.o('gen',1540,610,44,20);A.o('sandbag',1380,640,240,14);
 [1660,1720,1780,1840].forEach(x=>{A.o('target',x,400,16,6);A.o('sandbag',x-12,520,40,14)});A.o('ctable',1660,600,200,20,{c:'#5a6440'});A.o('ammo',1700,580,24,14);
 A.o('tent',1060,520,110,64);A.o('crate',1240,610,24,20);A.o('crate',1270,616,20,16);A.o('lamp',920,620,6,6);A.o('lamp',1010,620,6,6);
 A.ent(960,700,0,-1);
 [['지휘본부',254,100],['1막사',690,100],['2막사',1040,100],['화장실',1200,100],['식당',1510,100],['의무대',1810,100],['무기고',214,436],['차량정비고',650,436],['연병장',960,400],['헬기장',1250,420],['유류고',1490,400],['사격장',1760,380]].forEach(a=>A.room(...a));
 A.light(150,170,70,.2,'200,255,200');A.light(380,110,50,.2,'120,255,160');A.light(940,640,70,.24,'255,230,160');A.light(1000,640,70,.24,'255,230,160');A.light(650,520,90,.16,'255,230,190');
 [[600,180],[700,260],[1000,180],[1200,260],[1420,180],[1620,220],[600,360],[900,460],[1100,620],[1300,360],[1500,460],[1700,470],[1800,640],[300,360],[120,680-60],[780,600],[1240,520],[1600,360],[400,180]].forEach(([x,y])=>A.z('soldier',x,y));
 A.z('heavy',214,520);A.z('heavy',300,470);A.z('heavy',150,240)}

/* ================= FIRE STATION ================= */
function buildFire(c,r){const A=Bld('소방서',c,r,'fire');const L=48,RR=848,TP=72,BT=520;
 A.fl(L,TP,472,BT-TP,'concrete');A.fl(520,TP,328,188,'wood');A.fl(520,260,180,260,'tileK');A.fl(700,260,148,140,'carpet');A.fl(700,400,148,120,'small');A.fl(0,BT,BW,184,'concrete');
 A.dec(0,BT,BW,184,(ox,oy)=>{for(let x=90;x<450;x+=4)R(x%8<4?'#e8c43a':'#1d1714',ox+x,oy+BT+4,4,3);R('#c43c32',ox+90,oy+560,140,2);R('#c43c32',ox+300,oy+560,140,2);for(let i=0;i<12;i++)blob(ox+120+hh(i,5,5)*640,oy+600+hh(i,6,6)*80,6,3,'#7a7e82')});
 const n=(x0,x1,y,h)=>{const o=A.ox;R('#9a5040',o+L,y,RR-L,h);for(let yy=y;yy<y+h;yy+=4){R('#7a3a30',o+L,yy,RR-L,1);for(let xx=o+L+((yy/4)%2?0:4);xx<o+RR;xx+=8)R('#7a3a30',xx,yy,1,4)}R('#00000030',o+L,y+h-3,RR-L,3);[560,640,720,800].forEach(x=>winD(o+x,26,y,h));R('#1d1714',o+200,y+4,140,20);R('#c43c32',o+201,y+5,138,18);R('#f4f4ee',o+212,y+10,116,6)};
 A.hw(L-4,RR+4,TP,34,n);A.vw(L,TP,BT,34);A.vw(RR,TP,BT,34);hseg(A,L-4,RR+4,BT,[[90,230],[300,440],[580,620]]);
 A.dec(80,BT-40,380,40,(ox,oy)=>{[90,300].forEach(x=>{for(let i=0;i<5;i++)R('#9aa0a6',ox+x,oy+BT-14+i*2,140,1)})});
 vseg(A,520,TP,BT,[[150,190],[380,420]],34);hseg(A,520,RR,260,[[600,640]]);vseg(A,700,260,BT,[[300,340]]);hseg(A,700,RR,400,[[760,790]]);
 A.o('firetruck',110,200,90,250);A.o('firetruck',320,200,90,250);A.o('gear',60,80,140,12);A.o('gear',220,80,140,12);A.o('tool',380,84,40,14);A.o('shelf',474,90,24,140);A.o('bench2',440,440,60,18);A.o('hose',0,0,0,0);
 for(let i=0;i<4;i++)A.o('bed',540+i*76,80,30,54,{c:'#c46f6f'});A.o('locker',540,210,290,12,{c:'#7a3a30'});
 A.o('kitchen',530,266,160,14);A.o('fridge',536,300,20,14);A.o('tableset',560,380,80,48);A.o('sofa',540,480,100,18,{c:'#7a3a30'});A.o('tv',580,446,40,8);
 A.o('desk',716,280,64,18);A.o('chair',740,266,12,8);A.o('board',780,268,60,6,{c:'#e8e8e0'});A.o('bookshelf',816,300,24,80);
 A.o('toilet',716,480,16,16);A.o('toilet',760,480,16,16);A.o('sink',800,410,40,12);
 [[60,560],[480,560],[860,560]].forEach(([x,y])=>A.o('hydrant',x,y,10,6));[[240,600],[260,612],[280,600]].forEach(([x,y])=>A.o('cone',x,y,8,6));A.o('ambulance',560,600,120,34);A.o('flag',820,540,6,6,{c:'#c43c32',c2:'#f4f4ee'});A.o('lamp',30,530,6,6);
 A.roof(L,TP,RR-L,BT-TP,'tile','소방서');A.ent(160,BT+14,0,-1);A.ent(370,BT+14,0,-1);A.ent(600,BT+14,0,-1);
 [['차고',284,100],['숙직실',684,100],['주방 · 휴게실',610,290],['사무실',774,290],['화장실',774,428]].forEach(a=>A.room(...a));
 A.light(284,300,140,.18,'255,220,190');A.light(610,400,80,.18,'255,230,190');
 [[200,480],[420,300],[600,180],[760,460]].forEach(([x,y])=>A.z('fire',x,y));A.z('civ2',620,620)}
P('hose','',null,()=>{},false);

/* ================= WAREHOUSE ================= */
function buildWarehouse(c,r){const A=Bld('물류창고',c,r,'ware');const L=32,RR=864,TP=64,BT=520;
 A.fl(L,TP,RR-L,BT-TP,'concrete');A.fl(680,TP,184,176,'carpet');A.fl(0,BT,BW,184,'asphalt');
 A.dec(L,TP,RR-L,BT-TP,(ox,oy)=>{for(let x=60;x<660;x+=4)R(x%8<4?'#e8c43a':'#1d1714',ox+x,oy+300,4,2);for(let i=0;i<8;i++)blob(ox+80+hh(i,3,8)*560,oy+120+hh(i,4,8)*360,8,4,'#6a6e72')});
 A.dec(0,BT,BW,184,(ox,oy)=>{for(let x=120;x<=720;x+=150){R('#e8e8e0',ox+x,oy+BT+10,2,80)}for(let x=60;x<840;x+=40)R('#d9c35a',ox+x,oy+BT+130,20,2)});
 const n=(x0,x1,y,h)=>{const o=A.ox;R('#8a9096',o+L,y,RR-L,h);for(let x=o+L;x<o+RR;x+=6){R('#9aa0a6',x,y,2,h-3);R('#7a8086',x+3,y,1,h-3)}R('#00000030',o+L,y+h-3,RR-L,3);R('#1d1714',o+300,y+4,200,20);R('#3a6ea8',o+301,y+5,198,18);R('#f4f4ee',o+320,y+11,160,5)};
 A.hw(L-4,RR+4,TP,34,n);A.vw(L,TP,BT,34);A.vw(RR,TP,BT,34);hseg(A,L-4,RR+4,BT,[[100,200],[300,400],[500,600],[760,800]]);
 vseg(A,680,TP,240,[[180,216]],34);hseg(A,680,RR,240,[]);
 [100,220,340].forEach(y=>{A.o('palrack',60,y,260,20);A.o('palrack',380,y,260,20)});
 A.o('forklift',340,420,28,40);A.o('forklift',600,430,28,40);[[90,440],[150,450],[440,460],[500,440],[700,300],[760,320],[720,380]].forEach(([x,y])=>A.o('pallet',x,y,30,24));A.o('crate',800,440,24,20);A.o('crate',830,450,20,16);
 A.o('desk',700,80,70,18);A.o('desk',780,80,70,18);A.o('chair',726,64,12,8);A.o('bookshelf',834,120,24,100);A.o('cooler',700,200,12,10);A.o('ctable',740,160,60,20,{c:'#5a5f66'});
 A.o('trailer',100,560,140,40);A.o('trailer',300,570,140,40);A.o('container',520,600,140,40,{c:'#c94f3a'});A.o('container',680,600,140,40,{c:'#3a6ea8'});A.o('dumpster',800,540,40,20);A.o('pallet',560,540,30,24);A.o('lamp',30,530,6,6);A.o('lamp',860,530,6,6);
 A.roof(L,TP,RR-L,BT-TP,'metal','물류창고');[150,350,550,780].forEach(x=>A.ent(x,BT+14,0,-1));
 [['적재 구역',340,96],['사무실',772,96],['하역장',450,640]].forEach(a=>A.room(...a));A.light(340,300,180,.16,'230,240,255');
 [[200,180],[500,300],[300,460],[760,400],[600,180],[150,620]].forEach(([x,y],i)=>A.z(['civ1','civ3','civ2'][i%3],x,y))}

/* ================= RESEARCH LAB ================= */
function buildLab(c,r){const A=Bld('연구소',c,r,'lab');const L=48,RR=848,TP=64,CN=296,CS=352,BT=576;
 FLOORS.lab||(FLOORS.lab=(x,y,w,h)=>tiles(x,y,w,h,16,'#f2f5f6','#eceff1','#dde3e6'));
 A.fl(L,TP,RR-L,BT-TP,'lab');A.fl(L,CN,RR-L,56,'hall');A.fl(560,TP,160,CN-TP,'carpet');A.fl(0,BT,BW,128,'walk');
 A.dec(L,CN,RR-L,56,(ox,oy)=>{R('#3fa04a',ox+L,oy+320,RR-L,3);R('#e8c43a',ox+L,oy+326,RR-L,2)});
 A.dec(L,TP,RR-L,BT-TP,(ox,oy)=>{[[300,240],[360,200],[420,180]].forEach(([x,y])=>blob(ox+x,oy+y,10,5,'#3fa04a88'));[[200,420,8],[640,460,10],[480,320,6]].forEach(([x,y,r2])=>poolD(ox+x,oy+y,r2));[[100,200],[600,230],[700,430],[300,480],[520,500]].forEach(([x,y],i)=>paperD(ox+x,oy+y,i))});
 const n=(x0,x1,y,h)=>{const o=A.ox;R('#dfe6ea',o+L,y,RR-L,h);for(let x=o+L;x<o+RR;x+=24)R('#cfd8dc',x,y,1,h);R('#3fa04a',o+L,y+h-10,RR-L,3);R('#00000030',o+L,y+h-3,RR-L,3);[80,620,700].forEach(x=>winD(o+x,30,y,h));
  blob(o+250,y+13,10,10,'#1d1714');blob(o+250,y+13,9,9,'#e8c43a');for(const a of[-1.57,.52,2.62])blob(o+250+Math.cos(a)*5,y+13+Math.sin(a)*5,3,3,'#1d1714');blob(o+250,y+13,2,2,'#e8c43a')};
 A.hw(L-4,RR+4,TP,34,n);A.vw(L,TP,BT,34);A.vw(RR,TP,BT,34);hseg(A,L-4,RR+4,BT,[[420,476]]);
 [200,400,560,720].forEach(x=>A.vw(x,TP,CN,34));hseg(A,L,RR,CN,[[120,152],[290,322],[470,502],[620,652],[770,802]]);
 hseg(A,L,RR,CS,[[120,152],[340,380],[520,560],[740,772]]);A.vw(280,CS,BT);A.vw(620,CS,BT);
 // north rooms
 A.o('labbench',70,120,110,24);A.o('labbench',70,200,110,24);A.o('hood',70,72,50,14);A.o('hood',130,72,50,14);
 [220,260,300,340].forEach((x,i)=>A.o('tube',x,110,26,14,{broken:i==1}));[220,260,300,340].forEach((x,i)=>A.o('tube',x,200,26,14,{broken:i==3}));
 A.o('rack',412,72,26,12);A.o('rack',444,72,26,12);A.o('rack',476,72,26,12);A.o('rack',508,72,26,12);A.o('console',412,200,130,14);
 A.o('desk',580,90,90,20,{c:'#6b4426'});A.o('chair',614,74,12,8,{c:'#6b4426'});A.o('bookshelf',690,80,24,120);A.o('sofa',590,240,100,18,{c:'#3a3a40'});A.o('plant',580,200,14,10,{big:1});
 A.o('cabinet',740,72,90,10);A.o('medshelf',740,120,24,140);A.o('medshelf',806,120,24,140);A.o('crate',780,250,22,16);
 // south rooms
 [[60,170],[170,280]].forEach(([a,b])=>{A.o('cell',a+4,450,b-a-36,4);A.o('cot',a+12,500,26,44)});A.vw(170,450,BT);A.o('decon',380,356,60,6);
 A.o('counter',380,450,140,22,{fc:'#3fa04a',logo:'bar'});A.o('chair',420,436,12,8);A.o('plant',300,540,14,10,{big:1});A.o('plant',590,540,14,10,{big:1});A.o('chairs',300,500,96,12,{c:'#3fa04a'});
 A.o('labbench',650,380,170,24);A.o('labbench',650,460,170,24);A.o('mcart',650,530,22,14,{c:'#e8eef0'});A.o('iv',800,530,8,6);
 A.o('sign',150,610,40,6,{c:'#3fa04a',icon:(x,y)=>{blob(x,y,6,6,'#e8c43a');blob(x,y,2,2,'#1d1714')}});A.o('car',600,620,56,28,{c:'#f4f4ee'});A.o('car',700,620,56,28,{c:'#5a5f66'});A.o('lamp',30,590,6,6);
 A.roof(L,TP,RR-L,BT-TP,'clinic','연구소');A.ent(448,BT+14,0,-1);
 [['실험실 A',124,100],['배양실',300,100],['서버실',480,100],['소장실',640,100],['약품 보관실',784,100],['복도',448,322],['격리실',164,380],['제염 · 로비',448,380],['실험실 B',734,380]].forEach(a=>A.room(...a));
 A.light(300,180,90,.26,'120,255,140');A.light(480,140,60,.2,'120,255,160');A.light(448,460,90,.2,'230,240,255');
 [[300,250],[120,250],[640,180],[220,520],[700,520],[460,330]].forEach(([x,y],i)=>A.z(i%2?'hazmat':'labcoat',x,y))}

/* ================= APARTMENTS ================= */
function buildApts(c,r){const A=Bld('아파트',c,r,'apt');const L=48,RR=848,TP=64,HN=256,HS=312,BT=504;
 A.fl(L,TP,RR-L,BT-TP,'wood');A.fl(L,HN,RR-L,56,'hall');A.fl(0,BT,BW,200,'asphalt');A.fl(600,540,260,150,'grass');
 A.dec(0,BT,BW,200,(ox,oy)=>{for(let x=60;x<=540;x+=60)R('#e8e8e0',ox+x,oy+BT+30,2,60);R('#e8e8e0',ox+60,oy+BT+30,480,2)});
 const n=(x0,x1,y,h)=>{const o=A.ox;R('#c9b48f',o+L,y,RR-L,h);for(let yy=y;yy<y+h;yy+=4)R('#b8a47f',o+L,yy,RR-L,1);R('#00000030',o+L,y+h-3,RR-L,3);[90,170,330,410,570,650,740].forEach(x=>winD(o+x,26,y,h))};
 A.hw(L-4,RR+4,TP,34,n);A.vw(L,TP,BT,34);A.vw(RR,TP,BT,34);hseg(A,L-4,RR+4,BT,[[400,460]]);
 [312,580].forEach(x=>A.vw(x,TP,HN,34));hseg(A,L,RR,HN,[[250,282],[516,548],[784,816]]);hseg(A,L,RR,HS,[[250,282],[400,460],[684,716]]);[340,520].forEach(x=>A.vw(x,HS,BT));
 const unit=(x0,y0,v,flip)=>{const cs=['#6f9cc4','#c46f8a','#7fae6f','#c4a46f'];A.o('bed',x0+12,y0+8,30,54,{c:cs[v%4]});A.o('wardrobe',x0+52,y0+8,30,14);A.o('kitchen',x0+130,y0+6,120,14);A.o('fridge',x0+226,y0+40,20,14);A.o('tableset',x0+150,y0+80,56,40);A.o('sofa',x0+20,y0+140,84,18,{c:cs[(v+1)%4]});A.o('tv',x0+30,y0+100,40,8);A.o('rug',x0+20,y0+90,90,40,{v:v%3})};
 unit(L,TP,0);unit(312,TP,1);unit(580,TP,2);
 [[L,HS],[520,HS]].forEach(([x0,y0],i)=>{A.o('bed',x0+14,y0+10,30,54,{c:i?'#c4a46f':'#6f9cc4'});A.o('kitchen',x0+70,y0+8,120,14);A.o('tableset',x0+100,y0+60,56,40);A.o('sofa',x0+40,y0+164,100,18);A.o('toilet',x0+250,y0+12,16,16);A.o('tub',x0+230,y0+50,50,24);A.o('washer',x0+300,y0+12,20,12)});
 A.o('mailbox',360,330,80,10);A.o('mailbox',440,330,60,10);A.o('plant',360,480,14,10,{big:1});A.o('bench',420,470,60,10);
 A.dec(352,360,160,100,(ox,oy)=>{for(let i=0;i<6;i++){R('#8a8f94',ox+470,oy+380+i*14,40,12);R('#6a6f75',ox+470,oy+390+i*14,40,2)}});
 A.o('car',80,540,56,28,{c:'#3a6ea8'});A.o('car',200,540,56,28,{c:'#c9a42a',rust:1});A.o('wreck',380,620,56,28);A.o('car',140,640,56,28,{c:'#8a8f95'});A.o('slide',640,580,60,10);A.o('swing',740,590,70,6);A.o('bench',660,660,60,10);A.o('tree',830,560,26,14);A.o('tree',610,650,26,14);A.o('dumpster',520,540,40,20);A.o('lamp',30,520,6,6);
 A.roof(L,TP,RR-L,BT-TP,'tile2','아파트');A.ent(430,BT+14,0,-1);
 [['101호',180,96],['102호',446,96],['103호',714,96],['복도',160,284],['201호',190,340],['계단 · 우편함',430,340],['202호',684,340],['놀이터',730,560]].forEach(a=>A.room(...a));
 A.light(430,400,80,.2,'255,230,190');
 [[150,180],[450,200],[700,160],[300,284],[200,420],[700,440],[600,284]].forEach(([x,y],i)=>A.z(['civ1','civ2','civ3'][i%3],x,y))}

/* ================= CHURCH ================= */
function buildChurch(c,r){const A=Bld('교회',c,r,'church');const L=240,RR=680,TP=72,BT=600;
 A.fl(0,0,BW,BH,'grass');A.fl(L,TP,320,BT-TP,'woodD');A.fl(560,TP,120,BT-TP,'grey');A.fl(380,TP+40,40,BT-TP-40,'carpetR');A.fl(380,BT,40,104,'walk');
 const n=(x0,x1,y,h)=>{const o=A.ox;R('#c9b48f',o+L,y,RR-L,h);for(let yy=y;yy<y+h;yy+=4)R('#b8a47f',o+L,yy,RR-L,1);R('#00000030',o+L,y+h-3,RR-L,3);
  [280,340,440,500].forEach((x,i)=>{R('#1d1714',o+x-1,y+3,22,h-9);const cs=[['#c94f3a','#3a7bc9'],['#e0b03a','#4fa05a'],['#3a7bc9','#c94f3a'],['#4fa05a','#e0b03a']][i];for(let yy=0;yy<h-11;yy+=4)for(let xx=0;xx<20;xx+=4)R(((xx+yy)/4)%2?cs[0]:cs[1],o+x+xx,y+4+yy,4,4);R('#1d1714',o+x+9,y+4,2,h-11)});
  R('#1d1714',o+392,y+2,16,24);R('#e8e2d0',o+398,y+4,4,20);R('#e8e2d0',o+393,y+9,14,4)};
 A.hw(L-4,RR+4,TP,34,n);A.vw(L,TP,BT,34);A.vw(RR,TP,BT,34);hseg(A,L-4,RR+4,BT,[[376,424]]);vseg(A,560,TP,BT,[[300,340],[480,520]],34);hseg(A,560,RR,300);
 A.o('altar',360,90,80,22);A.o('piano',480,90,60,16);[290,500].forEach(x=>A.o('candle',x,100,8,6));
 for(let i=0;i<8;i++){A.o('pew',270,160+i*48,100,14);A.o('pew',430,160+i*48,100,14)}
 A.o('desk',580,90,80,18,{c:'#6b4426'});A.o('bookshelf',650,120,24,110);A.o('chair',606,74,12,8,{c:'#6b4426'});
 A.o('kitchen',570,320,100,14);A.o('crate',580,400,22,18);A.o('crate',610,404,20,16);A.o('shelf',650,350,24,110);A.o('fridge',570,540,20,14);
 A.o('btower',704,560,40,30);
 for(let i=0;i<5;i++)for(let j=0;j<3;j++)A.o('tomb',50+j*56,140+i*90,18,8);A.o('tree',190,100,26,14);A.o('tree',30,600,26,14);A.o('tree',760,200,26,14);A.o('tree',820,420,26,14);A.o('bush',720,600,24,14);A.o('bench',740,300,60,10);A.o('lamp',360,640,6,6);A.o('lamp',430,640,6,6);
 A.dec(30,120,200,480,(ox,oy)=>{R('#4a6a3a',ox+30,oy+120,180,1)});A.o('fence',24,110,200,4);
 A.roof(L,TP,RR-L,BT-TP,'tile3','교회');A.ent(400,BT+14,0,-1);
 [['예배당',400,140],['목양실',620,100],['창고 · 주방',620,340],['묘지',130,110]].forEach(a=>A.room(...a));
 A.light(400,140,90,.24,'255,220,150');A.light(400,360,120,.12,'255,220,170');
 [[330,260],[470,420],[600,420],[100,300],[380,520]].forEach(([x,y],i)=>A.z(['civ1','civ2','civ3'][i%3],x,y))}

function buildNextWorld(){newWorld();NBX=4;NBY=2;buildMil2(0,0);buildFire(2,0);buildChurch(3,0);buildWarehouse(0,1);buildLab(1,1);buildApts(2,1);W0.objs.forEach((o,i)=>o.id=i);return W0}
