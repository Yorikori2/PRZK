/* PROJECT LEGACY — world layout (3x3 city blocks) and hand-built buildings.
   Coordinates are world pixels. Each block is 896x704, roads are 128 wide. */
'use strict';
const TIER={houses:1,mart:1,school:2,hard:2,clinic:3,police:4,mil:5,fire:2,ware:2,apt:1,church:1,lab:5},ALR={school:.1,clinic:.2,police:.3,mil:.4,lab:.45};
const BW=896,BH=704,RD=128;let NBX=5,NBY=3;const WW=(NBX+1)*RD+NBX*BW,WH=(NBY+1)*RD+NBY*BH;
const bo=(c,r)=>[RD+c*(BW+RD),RD+r*(BH+RD)];
let W0;
function newWorld(){W0={fl:[],hw:[],vw:[],objs:[],dec:[],roofs:[],rooms:[],ents:[],lights:[],zs:[],b:[],spawn:{},base:null,car:null};return W0}
function Bld(name,c,r,kind){const[ox,oy]=bo(c,r),b={name,kind,ox,oy,c,r};const bi=W0.b.push(b)-1;
 const A={ox,oy,
  fl:(x,y,w,h,k)=>W0.fl.push([ox+x,oy+y,w,h,k]),
  hw:(x0,x1,y,h=10,face)=>W0.hw.push({x0:ox+x0,x1:ox+x1,y:oy+y,h,face}),
  vw:(x,y0,y1,top=10)=>W0.vw.push({x:ox+x,y0:oy+y0,y1:oy+y1,top}),
  o:(t,x,y,w,h,p={})=>{const o={t,x:ox+x,y:oy+y,w,h,b:bi,...p};W0.objs.push(o);return o},
  door:(x,y,len,dir,c)=>W0.dec.push({x:ox+x-2,y:oy+y-len-2,w:len+6,h:len+6,f:()=>doorLeaf(ox+x,oy+y,len,dir,c)}),
  dec:(x,y,w,h,f)=>W0.dec.push({x:ox+x,y:oy+y,w,h,f:()=>f(ox,oy)}),
  roof:(x,y,w,h,style,label,awn)=>W0.roofs.push({x:ox+x,y:oy+y,w,h,style,label,awn,bi}),
  room:(n,x,y)=>W0.rooms.push([n,ox+x,oy+y]),
  ent:(x,y,dx,dy)=>W0.ents.push([ox+x,oy+y,dx,dy]),
  light:(x,y,r,a,col)=>W0.lights.push([ox+x,oy+y,r,a,col]),
  z:(look,x,y)=>W0.zs.push({look,x:ox+x,y:oy+y,b:bi}),
 };return A}
/* outer walls helper: north wall tall, others cut */
function shell(A,x0,y0,x1,y1,face,southGaps=[]){A.hw(x0-4,x1+4,y0,34,face);A.vw(x0,y0,y1,34);A.vw(x1,y0,y1,34);let x=x0-4;for(const[a,b]of southGaps){A.hw(x,a,y1,8,'#b8b2a6');x=b}A.hw(x,x1+4,y1,8,'#b8b2a6')}
function hseg(A,x0,x1,y,gaps=[],face='#c9c2b4'){let x=x0;for(const[a,b]of gaps){if(a>x)A.hw(x,a,y,10,face);x=b}if(x1>x)A.hw(x,x1,y,10,face)}
function vseg(A,x,y0,y1,gaps=[],top=10){let y=y0;for(const[a,b]of gaps){if(a>y)A.vw(x,y,a,top);y=b}if(y1>y)A.vw(x,y,y1,top)}
const crossIcon=(x,y)=>{R('#d33a3a',x-2,y-6,4,12);R('#d33a3a',x-6,y-2,12,4)};
const badgeIcon=(x,y)=>{R('#d9b52a',x-6,y-6,12,12);R('#34466a',x-3,y-3,6,6)};

/* ================= CLINIC ================= */
function buildClinic(){const A=Bld('진료소',1,0,'clinic');const L=56,RR=840,TP=56,CN=232,CS=296,MID=428,BT=560;
 A.fl(L,TP,304,CN-TP,'vinylG');A.fl(360,TP,328,CN-TP,'tileB');A.fl(688,TP,152,CN-TP,'tileP');A.fl(L,CN,RR-L,64,'hall');
 A.fl(L,CS,176,BT-CS,'vinylW');A.fl(232,CS,320,BT-CS,'stone');A.fl(552,CS,144,MID-CS,'grey');A.fl(552,MID,144,BT-MID,'small');A.fl(696,CS,144,BT-CS,'wood');
 A.fl(0,BT,BW,40,'walk');A.fl(0,600,BW,104,'asphalt');
 A.dec(L,CN,RR-L,64,(ox,oy)=>{R('#3a7bc9',ox+L,oy+258,RR-L,3);R('#4fa05a',ox+L,oy+266,RR-L,3)});
 A.dec(440,400,64,64,(ox,oy)=>{for(let y=-26;y<26;y+=4)for(let x=-26;x<26;x+=4){const c=(Math.abs(x+2)<9||Math.abs(y+2)<9)&&Math.abs(x+2)<24&&Math.abs(y+2)<24;R(c?((x+y)/4%2?'#c43c32':'#d34a3e'):((x+y)/4%2?'#ece4d4':'#e4dac6'),ox+472+x,oy+432+y,4,4)}});
 A.dec(60,604,500,100,(ox,oy)=>{for(let x=72;x<300;x+=56)R('#e8e8e0',ox+x,oy+612,2,56);R('#e8e8e0',ox+72,oy+612,226,2);R('#d9c35a',ox+412,oy+612,170,2);R('#d9c35a',ox+412,oy+612,2,70);R('#d9c35a',ox+580,oy+612,2,70);for(let i=0;i<9;i++)ln(ox+418+i*18,oy+616,ox+430+i*18,oy+676,'#d9c35a88')});
 A.dec(L,TP,RR-L,BT-TP,(ox,oy)=>{[[202,190,9],[672,272,12],[282,500,8],[478,160,9],[142,520,6]].forEach(([x,y,r])=>poolD(ox+x,oy+y,r));for(let i=0;i<40;i++)R(i%3?'#7d1212':'#5e0c0c',ox+332+i*8+(hh(i,4)*4|0),oy+268+(hh(i,5)*8|0),2,2);
  [[92,180],[262,200],[382,250],[512,280],[732,270],[282,330],[332,520],[452,480],[182,350],[122,480],[592,360],[732,470],[792,200],[632,150]].forEach(([x,y],i)=>paperD(ox+x,oy+y,i));
  for(let i=0;i<30;i++)R(i%3?'#bfe3f2':'#e8f7fc',ox+352+(hh(i,11)*80|0),oy+530+(hh(i,12)*40|0),hh(i,13)<.5?2:1,1);for(let i=0;i<24;i++)R(PAL6[i%4],ox+592+(hh(i,14)*70|0),oy+370+(hh(i,15)*40|0),2,1)});
 const north=(x0,x1,y,h)=>{const o=A.ox;R('#b5cdbf',o+L,y,304,h);for(let x=o+L+6;x<o+360;x+=10)R('#bfd6c8',x,y+2,1,h-12);R('#95ad9f',o+L,y+h-3,304,3);
  R('#c4d5df',o+360,y,328,h);for(let yy=y;yy<y+h;yy+=6)R('#b2c4cf',o+360,yy,328,1);for(let xx=o+360;xx<o+688;xx+=8)R('#b2c4cf',xx,y,1,h);R('#8fa3ae',o+360,y+h-3,328,3);
  R('#b9b4c4',o+688,y,152,h);R('#8f8a9a',o+688,y+h-3,152,3);[68,124,180,236,292,384,552,632].forEach(x=>winD(o+x,x<360?30:26,y,h));
  blob(o+344,y+11,5,5,'#2c2724');blob(o+344,y+11,4,4,'#f4f4ee');R('#2c2724',o+344,y+8,1,4);R('#2c2724',o+446,y+4,58,18);R('#f4f4ee',o+447,y+5,56,16);R('#d33a3a',o+472,y+6,6,14);R('#d33a3a',o+467,y+10,16,6);
  blob(o+764,y+14,10,10,'#2c2724');blob(o+764,y+14,9,9,'#e8c43a');blob(o+764,y+14,2,2,'#2c2724');for(const a of[-1.57,.52,2.62])blob(o+764+Math.cos(a)*5,y+14+Math.sin(a)*5,3,3,'#2c2724');R('#2c2724',o+720,y+6,24,14);R('#d8e0e8',o+721,y+7,22,12)};
 shell(A,L,TP,RR,BT,north,[[358,426]]);
 A.vw(360,TP,CN,34);vseg(A,592,TP,CN,[[140,176]],34);A.vw(688,TP,CN,34);
 hseg(A,L,RR,CN,[[292,332],[452,502],[622,656],[732,772]]);hseg(A,L,RR,CS,[[152,188],[262,522],[632,664],[732,768]]);hseg(A,L,232,MID);hseg(A,552,696,MID);
 vseg(A,232,CS,BT,[[470,506]]);vseg(A,552,CS,BT,[[330,400],[470,506]]);A.vw(696,CS,BT);
 A.door(292,CN-10,30,'v');A.door(452,CN-10,22,'v','#9fb6c2');A.door(500,CN-10,22,'v','#9fb6c2');A.door(656,CN-10,26,'v');A.door(732,CN-10,30,'v');A.door(152,CS-10,26,'v');A.door(632,CS-10,24,'v');A.door(768,CS-10,26,'v');
 // ward
 [68,124,180,236,292].forEach((x,i)=>A.o('bed',x,62,30,54,{bl:i==2,rail:1}));[112,168,224,280].forEach(x=>A.o('curtain',x,92,3,64));[104,160,216,272,328].forEach(x=>A.o('iv',x,96,8,6));
 A.o('mcart',82,196,22,14,{c:'#e8eef0'});A.o('wheelchair',132,196,22,12);A.o('mcart',302,182,22,14);
 // OR / scrub / x-ray
 A.o('cabinet',372,58,56,10);A.o('cabinet',512,58,64,10);A.o('anest',382,138,22,12);A.o('optable',446,126,60,24);A.o('monitor',518,138,22,10);A.o('tray',542,170,18,8);
 A.o('sink',602,60,76,12,{n:3});A.o('medshelf',658,110,24,90);A.o('mcart',608,196,22,14,{c:'#6f9cc4'});
 A.o('xray',704,128,84,18);A.o('leadglass',776,188,62,4);A.o('desk',786,204,48,18);
 // corridor
 A.o('bench',72,282,64,10);A.o('bench',772,282,56,10);A.o('extinguisher',60,244,8,6);A.o('gurney',552,256,50,18);
 // consult rooms
 A.o('chair',98,304,12,8,{c:'#3a6ea8'});A.o('desk',72,320,70,18);A.o('stool',102,364,10,6);A.o('exam',194,320,28,64);A.o('sink',62,404,28,12);A.o('cabinet',142,406,40,10);
 A.o('chair',156,440,12,8,{c:'#3a6ea8'});A.o('desk',128,456,70,18);A.o('stool',158,494,10,6);A.o('exam',66,468,28,64);A.o('plant',204,534,14,10);
 // lobby
 A.o('pillar',268,326,18,16);A.o('pillar',498,326,18,16);A.o('chair',356,334,12,8);A.o('chair',418,334,12,8);A.o('counter',332,350,124,24);
 [400,440,480].forEach(y=>A.o('chairs',258,y,120,12));A.o('vending',522,524,24,14);A.o('vending',496,524,24,14,{c:'#3a6ea8'});A.o('plant',238,532,20,12,{big:1});A.o('plant',526,326,20,12,{big:1});A.o('cooler',406,456,12,10);A.o('wetsign',436,506,10,6);A.o('wheelchair',456,534,22,12);
 // pharmacy / restroom / staff
 A.o('register',556,298,22,24);A.o('medshelf',668,302,24,116);A.o('medshelf',572,410,86,12);A.o('aisle',612,340,26,56);A.o('crate',580,350,22,16);
 A.o('sink',560,432,62,12,{n:2});A.o('stall',600,500,3,58);A.o('stall',640,500,3,58);[566,612,660].forEach(x=>A.o('toilet',x,540,16,16));
 A.o('fridge',702,300,20,14);A.o('kitchen',776,300,60,14,{cm:1});A.o('locker',814,316,24,100);A.o('rtable',728,440,40,22);A.o('ctable',736,504,48,10);A.o('sofa',722,530,84,18);A.o('plant',818,540,14,10);A.o('alarmbox',706,404,10,6);
 // outside
 A.o('planter',92,572,110,12);A.o('planter',502,572,110,12);A.o('planter',672,572,110,12);A.o('sign',306,590,34,6,{icon:crossIcon});[342,382,422,462].forEach(x=>A.o('bollard',x,588,6,6));A.o('lamp',62,592,6,6);A.o('lamp',822,592,6,6);
 A.o('ambulance',432,640,120,34);A.o('car',86,640,56,28,{c:'#3a6ea8'});A.o('car',198,640,56,28,{c:'#8a8f95'});A.o('car',652,664,56,28,{c:'#c9a42a'});
 A.roof(L,TP,RR-L,BT-TP,'clinic','진료소');A.ent(392,574,0,-1);
 [['병동',208,140],['수술실',476,92],['준비실',640,92],['영상의학실',764,92],['복도',132,262],['진료실 1',144,312],['진료실 2',144,444],['로비 · 접수',392,312],['약국',624,312],['화장실',624,444],['직원 휴게실',768,312]].forEach(a=>A.room(...a));
 A.light(476,140,80,.32,'255,240,200');A.light(394,380,90,.2,'230,240,255');A.light(522,520,40,.28,'255,90,80');A.light(756,460,70,.16,'255,220,170');A.light(66,540,70,.22,'255,230,160');A.light(826,540,70,.22,'255,230,160');
 A.z('patient',258,186);A.z('doctor',476,212);A.z('nurse',400,280);A.z('civ1',244,492);A.z('patient',130,150)}

/* ================= POLICE ================= */
function buildPolice(){const A=Bld('경찰서',0,0,'police');const L=48,RR=848,TP=72,CN=240,CS=296,BT=520;
 A.fl(L,TP,184,CN-TP,'concrete');A.fl(232,TP,160,CN-TP,'grey');A.fl(392,TP,208,CN-TP,'check');A.fl(600,TP,248,CN-TP,'carpet');A.fl(L,CN,RR-L,56,'hall');
 A.fl(L,CS,256,BT-CS,'concrete');A.fl(304,CS,288,BT-CS,'stone');A.fl(592,CS,256,BT-CS,'wood');A.fl(0,BT,BW,40,'walk');A.fl(0,560,BW,144,'asphalt');
 A.dec(L,CN,RR-L,56,(ox,oy)=>{R('#2f4a7a',ox+L,oy+264,RR-L,3);R('#d9b52a',ox+L,oy+270,RR-L,2)});
 A.dec(40,570,820,100,(ox,oy)=>{for(let x=60;x<=380;x+=80)R('#e8e8e0',ox+x,oy+580,2,60);R('#e8e8e0',ox+60,oy+580,320,2);for(let x=620;x<=860;x+=80)R('#e8e8e0',ox+x,oy+600,2,60)});
 A.dec(L,TP,RR-L,BT-TP,(ox,oy)=>{[[150,200,8],[480,180,7],[460,420,10],[700,460,6]].forEach(([x,y,r])=>poolD(ox+x,oy+y,r));[[300,200],[640,210],[700,120],[420,360],[350,470],[90,330],[530,260]].forEach(([x,y],i)=>paperD(ox+x,oy+y,i))});
 const north=(x0,x1,y,h)=>{const o=A.ox;R('#8f9599',o+L,y,184,h);for(let yy=y+4;yy<y+h-4;yy+=8)R('#7f8589',o+L,yy,184,1);R('#c9c2b4',o+232,y,160,h);R('#4a4f55',o+392,y,208,h);for(let xx=o+392;xx<o+600;xx+=8)R('#3a3f45',xx,y,1,h-3);R('#9aa6b8',o+600,y,248,h);for(let x=o+606;x<o+848;x+=10)R('#a8b4c6',x,y+2,1,h-12);
  R('#00000030',o+L,y+h-3,RR-L,3);[[260,30],[648,30],[720,30],[792,30]].forEach(([x,w])=>winD(o+x,w,y,h));R('#2c2724',o+120,y+4,40,18);R('#d33a3a',o+122,y+6,36,14);R('#f4f4ee',o+126,y+11,28,4);
  R('#1d1714',o+452,y+4,96,22);R('#2a3a44',o+453,y+5,94,20);R('#ffffff20',o+460,y+7,30,1);R('#2c2724',o+700,y+5,60,16);R('#f4f4ee',o+701,y+6,58,14);for(let i=0;i<5;i++)R(PAL6[i],o+706+i*10,y+9,6,7)};
 shell(A,L,TP,RR,BT,north,[[420,476]]);
 A.vw(232,TP,CN,34);A.vw(392,TP,CN,34);A.vw(520,TP,CN,34);A.vw(600,TP,CN,34);
 hseg(A,L,RR,CN,[[180,212],[300,332],[440,472],[548,580],[640,680]]);hseg(A,L,RR,CS,[[240,272],[360,560],[640,672]]);A.vw(304,CS,BT);A.vw(592,CS,BT);
 [180,300,440,548,640].forEach(x=>A.door(x,CN-10,28,'v'));A.door(240,CS-10,28,'v');A.door(640,CS-10,28,'v');
 // armory
 A.o('gunrack',62,78,72,12);A.o('gunrack',146,78,72,12);A.o('bench2',90,140,64,18);A.o('ammo',60,196,22,14);A.o('ammo',92,196,22,14);A.o('locker',200,112,24,96,{c:'#4a5a6a'});
 // evidence
 A.o('shelf',244,90,24,124);A.o('shelf',356,90,24,124);A.o('crate',300,120,22,18);A.o('crate',300,160,24,16);A.o('crate',322,200,20,14);
 // interrogation + observation
 A.o('chair',440,118,12,8);A.o('ctable',426,140,56,18,{c:'#5a5f66'});A.o('chair',460,170,12,8);A.o('desk',530,108,60,18);A.o('alarmbox',536,192,10,6);A.z('heavy',100,170);A.o('chair',554,92,12,8);A.o('plant',570,200,14,10);
 // detectives office
 [[620,100],[724,100],[620,176],[724,176]].forEach(([x,y])=>{A.o('chair',x+24,y-14,12,8);A.o('desk',x,y,64,18)});A.o('bookshelf',812,90,24,124);A.o('cooler',800,214,12,10);
 // corridor
 A.o('bench',72,284,60,10);A.o('extinguisher',600,252,8,6);A.o('plant',820,282,14,10);
 // holding cells
 A.o('desk',80,326,64,18,{pc:true});A.o('chair',104,310,12,8);A.o('board',190,316,70,6,{c:'#e8e8e0'});
 [[48,133],[133,218],[218,304]].forEach(([a,b],i)=>{A.o('cell',a+4,398,46,4);A.o('cell',a+70,398,b-a-72,4);if(i>0)A.vw(a,400,BT);A.o('cot',a+8,456,26,44);A.o('toilet',b-26,500,14,16);A.door(a+50,398,22,'h','#6a6f75')});
 // lobby
 A.o('counter',380,336,140,24,{fc:'#34466a',logo:'badge'});A.o('chair',414,322,12,8);A.o('chair',476,322,12,8);A.o('bench',320,440,64,10);A.o('bench',512,440,64,10);A.o('plant',314,498,14,10,{big:1});A.o('plant',570,498,14,10,{big:1});A.o('vending',560,316,24,14,{c:'#3a6ea8'});
 // locker / break room
 A.o('locker',682,300,64,12,{c:'#4a5a6a'});A.o('locker',598,330,12,60,{c:'#4a5a6a'});A.o('kitchen',748,300,92,14,{cm:1});A.o('fridge',820,330,20,14);A.o('rtable',740,410,40,22);A.o('ctable',632,460,48,10);A.o('sofa',618,490,84,18,{c:'#3a4a6a'});A.o('vending',806,470,24,14);
 // outside
 A.o('flag',372,532,6,6,{c:'#f4f4ee',c2:'#2f4a7a'});A.o('flag',512,532,6,6,{c:'#f4f4ee',c2:'#d33a3a'});A.o('sign',250,538,40,6,{icon:badgeIcon,c:'#34466a'});A.o('lamp',30,548,6,6);A.o('lamp',860,548,6,6);
 A.o('pcar',82,600,60,30);A.o('pcar',182,600,60,30);A.o('pcar',640,620,60,30);A.o('car',282,600,56,28,{c:'#8a8f95'});A.o('bush',8,300,24,14);A.o('bush',864,300,24,14);
 A.roof(L,TP,RR-L,BT-TP,'police','경찰서');A.ent(448,534,0,-1);
 [['무기고',140,100],['증거물 보관실',312,100],['취조실',456,100],['관찰실',560,92],['형사과',724,92],['복도',160,268],['유치장',176,330],['민원실',448,312],['탈의 · 휴게실',720,332]].forEach(a=>A.room(...a));
 A.light(140,160,60,.18,'230,240,255');A.light(456,150,50,.25,'255,240,200');A.light(448,380,90,.2,'230,240,255');A.light(720,420,70,.16,'255,220,170');A.light(34,500,70,.22,'255,230,160');A.light(864,500,70,.22,'255,230,160');
 A.z('cop',140,214);A.z('civ1',90,480);A.z('cop',460,400);A.z('cop',700,150);A.z('civ3',740,460)}

/* ================= SCHOOL ================= */
function buildSchool(){const A=Bld('학교',2,0,'school');const L=48,RR=848,TP=64,CN=264,CS=328,BT=600;
 A.fl(L,TP,560,CN-TP,'wood');A.fl(448,TP,160,CN-TP,'carpet');A.fl(608,TP,240,CN-TP,'wood');A.fl(L,CN,RR-L,64,'hall');A.fl(L,CS,400,BT-CS,'gym');A.fl(448,CS,264,BT-CS,'tileK');A.fl(712,CS,136,BT-CS,'small');
 A.fl(0,BT,BW,32,'walk');A.fl(60,640,330,58,'dirt');
 A.dec(80,350,340,220,(ox,oy)=>{const x=ox+80,y=oy+352,w=330,h=212;R('#f4f4ee',x,y,w,2);R('#f4f4ee',x,y+h-2,w,2);R('#f4f4ee',x,y,2,h);R('#f4f4ee',x+w-2,y,2,h);R('#f4f4ee',x+w/2-1,y,2,h);for(let a=0;a<6.28;a+=.05)R('#f4f4ee',x+w/2+Math.cos(a)*26,y+h/2+Math.sin(a)*26,2,2);[x+2,x+w-42].forEach(k=>{R('#c94f3a55',k,y+h/2-40,40,80)})});
 A.dec(L,TP,RR-L,BT-TP,(ox,oy)=>{[[200,300,7],[600,470,9],[330,200,6]].forEach(([x,y,r])=>poolD(ox+x,oy+y,r));[[120,220],[330,230],[520,180],[700,220],[240,290],[640,300],[560,520],[300,450]].forEach(([x,y],i)=>paperD(ox+x,oy+y,i))});
 const north=(x0,x1,y,h)=>{const o=A.ox;R('#e8dcc0',o+L,y,RR-L,h);R('#d4c4a0',o+L,y+h-12,RR-L,9);R('#00000030',o+L,y+h-3,RR-L,3);[70,170,270,370,630,730,800].forEach(x=>winD(o+x,30,y,h));blob(o+520,y+12,6,6,'#2c2724');blob(o+520,y+12,5,5,'#f4f4ee');R('#2c2724',o+520,y+8,1,4)};
 shell(A,L,TP,RR,BT,north,[[120,160],[560,616]]);
 A.vw(248,TP,CN,34);A.vw(448,TP,CN,34);A.vw(608,TP,CN,34);
 hseg(A,L,RR,CN,[[200,232],[400,432],[560,592],[640,672]]);hseg(A,L,RR,CS,[[220,270],[520,600]]);A.vw(448,CS,BT);vseg(A,712,CS,BT,[[440,480]]);
 [200,400,560,640].forEach(x=>A.door(x,CN-10,30,'v'));
 const cls=(x0)=>{A.o('board',x0+60,74,80,6);A.o('desk',x0+20,92,50,16,{pc:false});for(let r=0;r<3;r++)for(let c=0;c<4;c++)A.o('sdesk',x0+24+c*40,130+r*40,20,22);A.o('bookshelf',x0+170,90,24,60)};
 cls(L);cls(248);cls(608);A.o('plant',820,230,14,10);
 A.o('desk',462,90,60,18);A.o('desk',536,90,60,18);A.o('desk',462,160,60,18);A.o('cabinet',540,200,50,10);A.o('cooler',580,140,12,10);A.o('alarmbox',470,208,10,6);A.o('sofa',470,230,70,14,{c:'#6a4a3a'});
 A.o('lockrow',60,268,130,12);A.o('lockrow',260,268,130,12);A.o('lockrow',690,268,140,12);A.o('extinguisher',440,300,8,6);A.o('bench',300,310,60,10);
 A.o('hoop',60,344,40,4);A.o('hoop',396,344,40,4);A.o('bleacher',100,566,280,20);A.o('crate',60,520,20,16);A.o('crate',410,520,24,16);
 [380,440,500].forEach(y=>A.o('longtable',470,y,200,26));A.o('kitchen',720,334,120,14);A.o('fridge',816,380,20,14);A.o('fridge',816,412,20,14);A.o('sink',724,520,50,12);A.o('counter',724,404,80,18,{fc:'#7a6a5a'});
 A.o('tree',20,620,26,14);A.o('tree',420,640,26,14);A.o('tree',840,620,26,14);A.o('bench',120,668,60,10);A.o('flag',500,620,6,6,{c:'#f4f4ee',c2:'#3a7bc9'});A.o('bush',600,640,24,14);A.o('bush',700,660,24,14);A.o('lamp',30,606,6,6);
 A.roof(L,TP,RR-L,BT-TP,'school','학교');A.ent(588,614,0,-1);A.ent(140,614,0,-1);
 [['1반 교실',148,92],['2반 교실',348,92],['교무실',528,92],['3반 교실',728,92],['복도',148,292],['체육관',248,370],['급식실',580,356],['조리실',780,356]].forEach(a=>A.room(...a));
 A.light(248,460,110,.18,'230,240,255');A.light(580,450,90,.18,'255,240,210');A.light(34,560,70,.22,'255,230,160');
 A.z('student',150,190);A.z('student',360,170);A.z('civ2',520,140);A.z('student',740,200);A.z('student',250,450);A.z('civ3',600,420)}

/* ================= MILITARY ================= */
function buildMilitary(){const A=Bld('군부대',0,2,'mil');
 A.fl(0,0,BW,BH,'dirt');A.fl(48,64,352,240,'concrete');A.fl(480,64,368,240,'woodD');A.fl(400,690,96,14,'gravel');
 A.dec(0,0,BW,BH,(ox,oy)=>{for(let i=0;i<14;i++)R('#6a5a3a',ox+60+hh(i,1,9)*760,oy+340+hh(i,2,9)*320,24,2);for(let x=420;x<480;x+=8)R('#e8e8e0',ox+x,oy+660,4,24)});
 // fence + gate
 A.o('fence',16,22,864,4);A.o('fence',16,684,384,4);A.o('fence',496,684,384,4);A.o('fence',16,26,4,658);A.o('fence',876,26,4,658);
 A.dec(390,640,116,60,(ox,oy)=>{[ox+392,ox+496].forEach(x=>{R('#1e1e1e',x,oy+664,6,26);for(let i=0;i<6;i++)R(i%2?'#f0f0f0':'#d33',x+1,oy+665+i*4,4,4)});R('#d9b52a',ox+400,oy+686,96,2)});
 A.o('tower',28,40,28,26);A.o('tower',840,40,28,26);A.o('tower',28,640,28,26);A.o('tower',840,640,28,26);
 // HQ
 const hqN=(x0,x1,y,h)=>{const o=A.ox;R('#7a8068',o+48,y,352,h);for(let yy=y+4;yy<y+h-4;yy+=8)R('#6a7058',o+48,yy,352,1);R('#00000030',o+48,y+h-3,352,3);winD(o+90,30,y,h);winD(o+300,30,y,h);R('#1d1714',o+150,y+3,64,22);R('#4a6a4a',o+151,y+4,62,20);for(let i=0;i<5;i++)ln(o+156+i*10,y+8,o+160+i*12,y+20,'#d9c35a')};
 shell(A,48,64,400,304,hqN,[[120,160]]);vseg(A,224,64,304,[[100,136],[230,266]],34);hseg(A,224,400,184);
 A.o('console',60,72,150,14);A.o('ctable',90,160,90,40,{c:'#5a6440'});A.o('chair',120,144,12,8);A.o('chair',150,210,12,8);A.o('board',60,240,60,6,{c:'#e8e8e0'});A.o('alarmbox',190,268,10,6);A.z('heavy',300,110);A.z('heavy',200,450);
 A.o('gunrack',236,70,74,12);A.o('gunrack',318,70,74,12);A.o('ammo',240,140,24,14);A.o('ammo',270,140,24,14);A.o('ammo',360,150,24,14);A.o('locker',372,96,24,50,{c:'#4f5a35'});
 A.o('rack',240,194,24,12);A.o('rack',270,194,24,12);A.o('console',310,196,82,14,{radio:1});A.o('desk',300,252,60,18);
 A.roof(48,64,352,240,'mil','지휘소');
 // barracks
 const bkN=(x0,x1,y,h)=>{const o=A.ox;R('#9a8a6a',o+480,y,368,h);for(let x=o+486;x<o+848;x+=10)R('#a89a7a',x,y+2,1,h-12);R('#00000030',o+480,y+h-3,368,3);[520,620,720,800].forEach(x=>winD(o+x,26,y,h))};
 shell(A,480,64,848,304,bkN,[[640,680]]);
 [500,560,620,700,760,816].forEach(x=>A.o('bunk',x>800?812:x,74,30,54));[500,560,700,760].forEach(x=>A.o('bunk',x,212,30,54));A.o('locker',500,150,90,12,{c:'#4f5a35'});A.o('locker',700,150,140,12,{c:'#4f5a35'});A.o('ctable',620,200,40,30,{c:'#5a6440'});A.o('ammo',820,270,22,14);
 A.roof(480,64,368,240,'mil','막사');
 // yard
 A.o('tent',80,380,120,72);A.o('tent',240,380,120,72);A.o('truck',520,380,140,38);A.o('truck',520,460,140,38);A.o('helipad',700,520,110,110);
 A.o('sandbag',360,600,60,14);A.o('sandbag',476,600,60,14);A.o('sandbag',360,620,14,40);A.o('sandbag',522,620,14,40);
 [[60,560],[82,560],[60,580]].forEach(([x,y])=>A.o('barrel',x,y,16,10,{c:'#4f5a35'}));A.o('gen',120,560,44,20);A.o('crate',200,560,24,20);A.o('crate',228,566,20,16);A.o('ammo',260,570,24,14);
 A.o('flag',440,330,6,6,{c:'#5a6440',c2:'#3e4729'});A.o('lamp',420,640,6,6);A.o('lamp',470,640,6,6);
 A.ent(448,700,0,-1);A.room('지휘소',224,96);A.room('막사',664,96);A.room('연병장',448,350);
 A.light(130,140,60,.2,'200,255,200');A.light(330,230,50,.2,'120,255,160');A.light(424,600,60,.22,'255,230,160');A.light(474,600,60,.22,'255,230,160');
 [[140,480],[300,480],[600,540],[400,420],[660,300],[200,600]].forEach(([x,y])=>A.z('soldier',x,y));A.z('soldier',140,240);A.z('soldier',640,180)}

/* ================= MART + GAS ================= */
function buildMart(){const A=Bld('편의점 · 주유소',2,1,'mart');
 A.fl(48,72,352,328,'tileK');A.fl(400,72,120,328,'concrete');A.fl(0,400,540,32,'walk');A.fl(24,432,516,260,'asphalt');A.fl(560,40,320,640,'asphalt');A.fl(740,400,120,120,'grey');
 A.dec(24,432,516,260,(ox,oy)=>{for(let x=60;x<=500;x+=56)R('#e8e8e0',ox+x,oy+470,2,60);R('#e8e8e0',ox+60,oy+470,440,2);for(let x=60;x<=500;x+=56)R('#e8e8e0',ox+x,oy+600,2,60);R('#e8e8e0',ox+60,oy+658,440,2)});
 A.dec(560,40,320,640,(ox,oy)=>{for(let i=0;i<5;i++)blob(ox+620+hh(i,3,3)*200,oy+120+hh(i,4,4)*260,8,4,'#2a2c30');R('#d9c35a',ox+560,oy+380,300,2)});
 const mN=(x0,x1,y,h)=>{const o=A.ox;R('#e8e8e0',o+48,y,472,h);R('#3f8a4a',o+48,y+h-12,472,6);R('#00000030',o+48,y+h-3,472,3);[420,470].forEach(x=>winD(o+x,26,y,h))};
 shell(A,48,72,520,400,mN,[[160,240]]);vseg(A,400,72,400,[[300,340]],34);
 for(let x=64;x<=344;x+=40)A.o('drinks',x,76,32,14);[100,160,220,280].forEach(x=>A.o('aisle',x,140,24,140));A.o('register',90,336,64,22);A.o('register',250,336,64,22);A.o('plant',60,384,14,10);
 A.o('shelf',412,80,96,12);A.o('crate',420,160,24,20);A.o('crate',450,166,22,16);A.o('crate',480,160,24,20);A.o('crate',420,230,24,18);A.o('shelf',488,220,24,120);A.o('crate',430,300,24,16);
 A.o('car',100,480,56,28,{c:'#6b4a6b'});A.o('wreck',320,600,56,28);A.o('dumpster',448,440,40,20);A.o('trash',480,470,16,8);A.o('lamp',30,410,6,6);
 A.roof(48,72,472,328,'mart','편의점',['#3f8a4a','#f0f0e8']);A.ent(200,414,0,-1);
 // gas station
 A.o('island',600,180,96,22);A.o('island',600,290,96,22);[612,656].forEach(x=>{A.o('pump',x,180,18,12);A.o('pump',x,290,18,12)});A.o('island',740,180,96,22);[752,796].forEach(x=>A.o('pump',x,180,18,12));
 A.dec(580,110,280,240,(ox,oy)=>{[[592,120],[836,120],[592,330],[836,330]].forEach(([x,y])=>{R('#1d1714',ox+x-1,oy+y-40,8,42);R('#e8e8e0',ox+x,oy+y-39,6,40)})});
 A.roof(580,110,280,232,'flat','주유소',['#c43c32','#f0f0e8']);
 const kN=(x0,x1,y,h)=>{const o=A.ox;R('#f0f0e8',o+740,y,120,h);R('#c43c32',o+740,y+h-12,120,6);winD(o+770,30,y,h)};
 shell(A,740,400,860,520,kN,[[770,810]]);A.o('register',752,410,50,20);A.o('drinks',820,404,30,14);A.o('aisle',760,450,60,20);A.o('crate',830,470,20,16);
 A.roof(740,400,120,120,'flat','매점',['#c43c32','#f0f0e8']);A.ent(790,534,0,-1);
 A.o('sign',600,420,40,6,{c:'#c43c32',icon:(x,y)=>{R('#f4f4ee',x-6,y-6,12,12);R('#c43c32',x-3,y-4,6,8)}});A.o('tires',860,600,22,14);A.o('barrel',600,600,16,10);A.o('barrel',620,606,16,10);A.o('lamp',870,380,6,6);
 W0.car={x:A.ox+640,y:A.oy+560,w:60,h:30,c:'#c43c32'};
 A.room('편의점',224,108);A.room('창고',460,108);A.room('주유소',720,140);
 A.light(224,250,110,.2,'230,240,255');A.light(720,240,140,.24,'255,250,220');A.light(800,460,50,.2,'230,240,255');
 A.z('civ2',220,240);A.z('civ1',460,260);A.z('civ3',700,260);A.z('civ1',300,520)}

/* ================= HARDWARE + RESTAURANT ================= */
function buildHardware(){const A=Bld('철물점 · 식당',2,2,'hard');
 A.fl(48,72,252,348,'concrete');A.fl(300,72,130,348,'concrete');A.fl(480,72,240,348,'woodD');A.fl(720,72,128,348,'tileK');A.fl(0,420,BW,32,'walk');A.fl(24,452,848,240,'asphalt');
 const hN=(x0,x1,y,h)=>{const o=A.ox;R('#8a7a6a',o+48,y,382,h);R('#d98a2a',o+48,y+h-12,382,6);R('#00000030',o+48,y+h-3,382,3);winD(o+100,30,y,h);winD(o+220,30,y,h)};
 shell(A,48,72,430,420,hN,[[140,200]]);vseg(A,300,72,420,[[300,340]],34);
 A.o('lumber',64,80,96,16);A.o('lumber',176,80,100,16);A.o('shelf',64,150,24,180);A.o('shelf',130,170,24,140);A.o('shelf',196,170,24,140);A.o('tool',250,160,30,16);A.o('tool',250,210,30,16);A.o('register',220,370,64,22);A.o('barrel',70,380,16,10,{c:'#3a6ea8'});
 A.o('lumber',316,80,100,16);A.o('lumber',316,130,100,16);A.o('crate',320,200,24,20);A.o('crate',360,200,24,20);A.o('bench2',320,260,90,20);A.o('crate',390,340,24,16);
 A.roof(48,72,382,348,'metal','철물점',['#d98a2a','#3a3a3a']);A.ent(170,434,0,-1);
 const rN=(x0,x1,y,h)=>{const o=A.ox;R('#c9b48f',o+480,y,368,h);for(let x=o+486;x<o+848;x+=10)R('#d6c4a0',x,y+2,1,h-12);R('#00000030',o+480,y+h-3,368,3);[520,600,680].forEach(x=>winD(o+x,30,y,h))};
 shell(A,480,72,848,420,rN,[[560,610]]);vseg(A,720,72,420,[[200,240]],34);
 [[500,120],[600,120],[500,220],[600,220],[500,320],[600,320]].forEach(([x,y])=>A.o('tableset',x,y,64,40));A.o('counter',640,370,70,20,{fc:'#6b4426',logo:'bar'});A.o('plant',490,390,14,10);
 A.o('kitchen',732,76,108,14);A.o('kitchen',732,256,14,84,{stove:false});A.o('fridge',816,160,20,14);A.o('fridge',816,200,20,14);A.o('sink',770,280,60,12);A.o('crate',740,360,22,18);A.o('shelf',800,330,24,80);
 A.roof(480,72,368,348,'rest','식당',['#b8382e','#f0f0e8']);A.ent(585,434,0,-1);
 A.o('dumpster',446,200,30,20);A.o('wreck',120,540,56,28,{c:'#5a5f66'});A.o('car',620,520,56,28,{c:'#3a6a4a'});A.o('tree',450,90,26,14);A.o('lamp',30,430,6,6);A.o('lamp',860,430,6,6);
 A.room('철물점',170,108);A.room('자재 창고',366,108);A.room('식당 홀',600,108);A.room('주방',784,108);
 A.light(170,250,90,.18,'255,230,190');A.light(600,250,110,.2,'255,220,170');A.light(784,200,60,.18,'230,240,255');
 A.z('civ3',170,280);A.z('civ1',600,280);A.z('civ2',784,240)}

/* ================= HOUSES ================= */
const HP=[['#a0644e','#8a5040','tile'],['#8c8f94','#70747a','tile2'],['#b39a74','#9a8460','tile3'],['#6f8a76','#5a7462','tile']];
function houseA(A,hx,hy,v){const p=HP[v%4],X=x=>hx+x,Y=y=>hy+y;
 A.fl(X(40),Y(40),120,90,'wood');A.fl(X(160),Y(40),60,90,'small');A.fl(X(220),Y(40),140,90,'carpet');A.fl(X(40),Y(130),200,110,'wood');A.fl(X(240),Y(130),120,110,'tileK');
 A.dec(X(140),Y(240),30,90,(ox,oy)=>{R('#a8a49a',ox+X(122),oy+Y(244),26,84)});
 const n=(x0,x1,y,h)=>{const o=A.ox;R(['#c9b48f','#a9b8c4','#d1c3a3','#b7c4ad'][v%4],o+X(40),y,320,h);for(let x=o+X(46);x<o+X(360);x+=10)R('#ffffff20',x,y+2,1,h-12);R('#00000030',o+X(40),y+h-3,320,3);[X(70),X(250),X(310)].forEach(x=>winD(o+x,26,y,h))};
 A.hw(X(36),X(364),Y(40),30,n);A.vw(X(40),Y(40),Y(240),30);A.vw(X(360),Y(40),Y(240),30);A.hw(X(36),X(120),Y(240),8,p[0]);A.hw(X(150),X(364),Y(240),8,p[0]);
 hseg(A,X(40),X(360),Y(130),[[X(100),X(128)],[X(186),X(214)],[X(280),X(308)]]);A.vw(X(160),Y(40),Y(130));A.vw(X(220),Y(40),Y(130));vseg(A,X(240),Y(130),Y(240),[[Y(160),Y(196)]]);
 const c=['#6f9cc4','#c46f8a','#7fae6f','#c4a46f'][v%4];
 A.o('bed',X(50),Y(46),30,54,{c});A.o('wardrobe',X(120),Y(46),30,14);A.o('rug',X(60),Y(104),60,18,{v:v%3});
 A.o('tub',X(166),Y(44),50,24);A.o('toilet',X(166),Y(100),16,16);A.o('sink',X(202),Y(76),14,10);
 A.o('bed',X(230),Y(46),30,54,{c:'#a8b48a'});A.o('desk',X(296),Y(46),54,18);A.o('bookshelf',X(334),Y(80),20,44);
 A.o('tv',X(44),Y(134),48,10);A.o('rug',X(56),Y(160),120,48,{v:(v+1)%3});A.o('ctable',X(70),Y(180),48,12);A.o('sofa',X(46),Y(214),68,18,{c:['#5a6e8a','#8a5a5a','#6a7a4a','#7a6a5a'][v%4]});A.o('bookshelf',X(212),Y(202),22,32);A.o('plant',X(220),Y(136),14,10);
 A.o('fridge',X(248),Y(134),20,14);A.o('kitchen',X(316),Y(134),40,14);A.o('kitchen',X(342),Y(148),14,56,{stove:false});A.o('tableset',X(262),Y(176),56,40);
 A.o('bush',X(20),Y(250),24,14);A.o('bush',X(330),Y(250),24,14);A.o('tree',X(380),Y(40),26,14);
 A.roof(X(40),Y(40),320,200,p[2]);A.ent(X(135),Y(254),0,-1)}
function houseB(A,hx,hy,v){const p=HP[(v+2)%4],X=x=>hx+x,Y=y=>hy+y;
 A.fl(X(60),Y(60),200,150,'wood');A.fl(X(260),Y(60),80,70,'small');A.fl(X(260),Y(130),80,80,'concrete');
 A.dec(X(200),Y(210),30,110,(ox,oy)=>{R('#a8a49a',ox+X(206),oy+Y(214),26,104)});
 const n=(x0,x1,y,h)=>{const o=A.ox;R(['#d1c3a3','#b7c4ad','#c9b48f','#a9b8c4'][v%4],o+X(60),y,280,h);R('#00000030',o+X(60),y+h-3,280,3);[X(90),X(170)].forEach(x=>winD(o+x,30,y,h))};
 A.hw(X(56),X(344),Y(60),30,n);A.vw(X(60),Y(60),Y(210),30);A.vw(X(340),Y(60),Y(210),30);A.hw(X(56),X(204),Y(210),8,p[0]);A.hw(X(234),X(344),Y(210),8,p[0]);
 vseg(A,X(260),Y(60),Y(210),[[Y(150),Y(180)]]);hseg(A,X(260),X(340),Y(130),[[X(266),X(292)]]);
 A.o('bed',X(70),Y(66),54,30,{c:['#c46f8a','#6f9cc4','#7fae6f','#c4a46f'][v%4]});A.o('wardrobe',X(140),Y(66),30,14);A.o('kitchen',X(180),Y(64),74,14);A.o('fridge',X(232),Y(90),20,14);
 A.o('sofa',X(80),Y(124),84,18);A.o('rug',X(76),Y(148),96,42,{v:v%3});A.o('tv',X(96),Y(198),40,8);A.o('tableset',X(174),Y(112),56,40);A.o('plant',X(244),Y(190),14,10);
 A.o('toilet',X(268),Y(66),16,16);A.o('sink',X(300),Y(66),30,12);A.o('tool',X(306),Y(136),30,14);A.o('crate',X(310),Y(180),22,18);A.o('car',X(276),Y(240),56,28,{c:['#c9a42a','#3a6ea8','#8a8f95','#6b4a6b'][v%4],rust:1});
 A.o('tree',X(20),Y(80),26,14);A.o('bush',X(360),Y(170),24,14);
 A.roof(X(60),Y(60),280,150,p[2]);A.ent(X(219),Y(224),0,-1)}
function buildHouses(c,r,seed){const A=Bld('주택가',c,r,'houses');A.fl(0,0,BW,BH,'grass');
 const lots=[[0,0],[448,0],[0,352],[448,352]];lots.forEach(([lx,ly],i)=>{const v=(seed+i)%4;(i+seed)%2?houseB(A,lx,ly,v):houseA(A,lx,ly,v);A.z(['civ1','civ2','civ3'][(i+seed)%3],lx+200,ly+190)});
 A.o('lamp',440,340,6,6);A.o('tree',430,660,26,14);A.room('주택가',448,24)}

/* ================= BASE LOT ================= */
const BASE={x0:40,y0:48,x1:856,y1:664,gate:[400,496]};
function buildBaseLot(){const A=Bld('거점',1,1,'base');A.fl(0,0,BW,BH,'gravel');
 A.dec(0,0,BW,BH,(ox,oy)=>{for(let x=120;x<800;x+=64)R('#e8e8e044',ox+x,oy+120,2,40);for(let i=0;i<10;i++)blob(ox+80+hh(i,9,1)*720,oy+80+hh(i,9,2)*560,10,5,'#7f7b72')});
 W0.base={ox:A.ox,oy:A.oy,...BASE};A.room('거점',448,26)}
/* base modules -> props for current levels (lv: {core,wall,bench,med,farm,water,gen,turret,tower}) */
function baseProps(lv,wallHp){const b=W0.base,X=x=>b.ox+x,Y=y=>b.oy+y,out=[],o=(t,x,y,w,h,p={})=>out.push({t,x:X(x),y:Y(y),w,h,base:1,...p});
 const c=lv.core||1;
 if(c==1){o('tentS',400,290,96,52);o('stash',512,310,30,18);o('crate',360,320,24,18)}
 else if(c==2){o('container',380,280,140,52,{c:'#4f7a8a'});o('container',380,340,140,40,{c:'#8a5a3a'});o('stash',540,330,34,20);o('stash',540,300,34,20)}
 else{o('hq',360,260,180,90);o('stash',560,330,34,20);o('stash',560,300,34,20);o('stash',320,330,34,20)}
 o('campfire',436,410,30,12);
 if(lv.bench)o('bench3',180,300,90,22,{lv:lv.bench});if(lv.bench>1)o('tool',290,300,30,16);if(lv.bench>2)o('lumber',180,350,96,16);
 if(lv.med){o('cot',640,290,28,46);o('cabinet',680,290,40,10);if(lv.med>1){o('tent',620,250,150,40);o('iv',700,330,8,6)}if(lv.med>2){o('bed',720,350,30,54,{rail:1});o('medshelf',770,300,24,80)}}
 if(lv.farm){o('plot',90,470,110,60,{lv:lv.farm});if(lv.farm>1)o('plot',90,550,110,60,{lv:lv.farm});if(lv.farm>2){o('plot',220,470,110,60,{lv:3});o('plot',220,550,110,60,{lv:3})}}
 if(lv.water){if(lv.water==1)o('waterB',740,500,24,10);if(lv.water==2){o('tank',720,480,60,40);o('waterB',790,520,24,10)}if(lv.water==3){o('wtower',730,470,44,40);o('waterB',790,520,24,10);o('waterB',690,540,24,10)}}
 if(lv.gen){o('gen',560,500,44,20);if(lv.gen>1){o('lamp',360,440,6,6);o('lamp',520,440,6,6);o('barrel',612,506,16,10)}if(lv.gen>2){o('solar',540,560,60,24);o('solar',610,560,60,24)}}
 const tp=[[72,72],[780,72],[72,580],[780,580]];for(let i=0;i<[0,1,2,4][lv.turret||0];i++)o('turret',tp[i][0],tp[i][1],44,30,{lv:lv.turret,tid:i});
 if(lv.tower){o('tower',430,90,30,26);if(lv.tower>2)o('radio',480,96,12,8)}
 // perimeter walls (segments of 64)
 const wl=lv.wall||0,segs=[];if(wl){const t=['','pal','mwall','cwall'][wl],x0=BASE.x0,x1=BASE.x1,y0=BASE.y0,y1=BASE.y1;let k=0;
  for(let x=x0;x<x1;x+=64){const w=Math.min(64,x1-x);segs.push({t,x:X(x),y:Y(y0),w,h:10,k:k++})}
  for(let x=x0;x<x1;x+=64){const w=Math.min(64,x1-x);if(x+w<=BASE.gate[0]||x>=BASE.gate[1]){segs.push({t,x:X(x),y:Y(y1),w,h:10,k:k++})}else{if(x<BASE.gate[0])segs.push({t,x:X(x),y:Y(y1),w:BASE.gate[0]-x,h:10,k:k++});if(x+w>BASE.gate[1])segs.push({t,x:X(BASE.gate[1]),y:Y(y1),w:x+w-BASE.gate[1],h:10,k:k++})}}
  for(let y=y0+10;y<y1;y+=64){const h=Math.min(64,y1-y);segs.push({t,x:X(x0),y:Y(y),w:10,h,k:k++});segs.push({t,x:X(x1-10),y:Y(y),w:10,h,k:k++})}
  segs.push({t:'gateB',x:X(BASE.gate[0]),y:Y(y1),w:BASE.gate[1]-BASE.gate[0],h:10,k:999,gate:1,lv:wl});
  segs.forEach(s=>{s.base=1;s.wall=1;s.hp=wallHp&&wallHp[s.k]!=null?wallHp[s.k]:1;out.push(s)})}
 return out}

/* ================= WORLD ================= */
function buildWorld(){newWorld();buildPolice();buildClinic();buildSchool();buildHouses(0,1,0);buildBaseLot();buildMart();buildHouses(1,2,1);buildHardware();
 // expansion district (world_next.js): big 2-block military base, fire station, church, warehouse, lab; apartments replace the old small base
 if(typeof buildMil2=='function'){buildApts(0,2);buildMil2(3,0);buildFire(3,1);buildChurch(4,1);buildWarehouse(3,2);buildLab(4,2)}else buildMilitary();
 W0.objs.forEach((o,i)=>o.id=i);return W0}
/* roads/grass background for a rect (static) */
function drawGround(x0,y0,w,h){R('#3b5a30',x0,y0,w,h);
 for(let i=0;i<=Math.max(NBX,NBY);i++){const sx=i<=NBX?i*(BW+RD):-1e9,sy=i<=NBY?i*(BH+RD):-1e9;
  // vertical road strip
  if(sx<x0+w&&sx+RD>x0){floor(sx,y0,24,h,'walk');floor(sx+24,y0,80,h,'asphalt');floor(sx+104,y0,24,h,'walk');for(let y=Math.floor(y0/48)*48;y<y0+h;y+=48)R('#d9c35a',sx+63,y,2,26)}
  if(sy<y0+h&&sy+RD>y0){floor(x0,sy,w,24,'walk');floor(x0,sy+24,w,80,'asphalt');floor(x0,sy+104,w,24,'walk');for(let x=Math.floor(x0/48)*48;x<x0+w;x+=48)R('#d9c35a',x,sy+63,26,2)}}
 for(let i=0;i<=NBX;i++)for(let j=0;j<=NBY;j++){const sx=i*(BW+RD),sy=j*(BH+RD);if(sx<x0+w&&sx+RD>x0&&sy<y0+h&&sy+RD>y0){floor(sx+24,sy+24,80,80,'asphalt');for(let k=0;k<6;k++){R('#e8e8e0',sx+28+k*13,sy+14,8,10);R('#e8e8e0',sx+28+k*13,sy+104,8,10);R('#e8e8e0',sx+14,sy+28+k*13,10,8);R('#e8e8e0',sx+104,sy+28+k*13,10,8)}}}}
function drawStatic(x0,y0,w,h){drawGround(x0,y0,w,h);const hit=(x,y,ww,hh2)=>x<x0+w&&x+ww>x0&&y<y0+h&&y+hh2>y0;
 for(const f of W0.fl)if(hit(f[0],f[1],f[2],f[3]))floor(...f);
 for(const d of W0.dec)if(hit(d.x,d.y,d.w,d.h))d.f();
 for(const o of W0.objs)if(FLAT[o.t]&&hit(o.x-2,o.y-2,o.w+4,o.h+4))D[o.t](o);
 for(const v of W0.vw)if(hit(v.x-4,v.y0-50,8,v.y1-v.y0+50))vwallD(v.x,v.y0,v.y1,v.top)}
