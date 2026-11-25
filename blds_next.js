/* PROJECT LEGACY — sample: new buildings, batch 1 (small and medium).
   약국 (pharmacy) · 총포상 (gun shop) · 정비소 (car garage) · 은행 (bank).
   Each has its own furniture, loot, zombies, danger tier, demolition level and (gun shop, bank) an alarm.
   They join the endless city's mix of blocks. Loaded after the game modules. */
'use strict';
/* ---------- new items and furniture ---------- */
if(!I_BY.carpart){const it=['carpart','차량 부품','m','u',1.5,'정비소에서 나와요 · 차량 개조 재료 (다음 단계)'];ITEMS.push(it);I_BY.carpart=it}
IC.carpart=()=>{blob(12,13,9,8,'#1d1714');blob(12,13,8,7,'#5a6068');blob(12,13,4,3,'#2a2e33');for(let a=0;a<6.28;a+=1.05)R('#8a9096',12+Math.cos(a)*8-1,13+Math.sin(a)*7-1,3,3);R('#e0b03a',16,6,4,2)};
P('lift','차량 리프트',null,o=>{const{x,y,w,h}=o;R('#2a2e33',x,y,w,h);R('#e0b03a',x+2,y+2,6,h-4);R('#e0b03a',x+w-8,y+2,6,h-4);for(let i=0;i<h;i+=8)R('#1d1714',x+2,y+i,6,2),R('#1d1714',x+w-8,y+i,6,2);R('#5a6068',x+10,y+h/2-3,w-20,6)},false);
P('vault','은행 금고',['tkn','tkn','tkn','tkn','enh2','orn1'],o=>{const{x,y,w,h}=o,K='#1d1714';R(K,x,y-30,w,h+30);R('#5a6068',x+2,y-28,w-4,h+26);R('#8a9096',x+2,y-28,w-4,4);blob(x+w/2,y-8,16,16,K);blob(x+w/2,y-8,14,14,'#9aa0a6');blob(x+w/2,y-8,4,4,'#3a3f45');
 for(let a=0;a<6.28;a+=.785)R('#3a3f45',x+w/2+Math.cos(a)*10-1,y-8+Math.sin(a)*10-1,3,3);R('#c9a030',x+w-14,y-20,6,22)});
P('showcase','진열장',['ammo','ammo','scrap'],o=>{const{x,y,w,h}=o;R('#1d1714',x,y-10,w,h+10);R('#3a2a1e',x+1,y-9,w-2,h+8);R('#9ad0f088',x+3,y-8,w-6,8);for(let i=0;i<w-10;i+=14){R('#2a2e33',x+6+i,y-6,10,3);R('#6b4426',x+12+i,y-5,3,2)}});
LOOTT.medshelf=LOOTT.medshelf||['bandage'];
/* ---------- builders ---------- */

BUILDERS.pharm=(c,r,sd)=>{const A=Bld('약국',c,r,'pharm'),Rn=mulberry(sd*13+5);
 A.fl(0,0,BW,BH,'grass');A.fl(80,90,400,300,'tileB');A.fl(80,390,400,40,'walk');A.fl(0,450,BW,254,'asphalt');A.fl(520,90,300,300,'tileP');
 A.dec(0,450,BW,254,(ox,oy)=>{for(let x=60;x<BW-40;x+=70)R('#e8e8e0',ox+x,oy+500,2,56);R('#e8e8e0',ox+60,oy+556,BW-100,2)});
 const fN=(x0,x1,y,h)=>{const o=A.ox;R('#f0f0e8',o+80,y,400,h);R('#3f9a5a',o+80,y+h-14,400,8);R('#e8e8e0',o+250,y+4,60,h-20);R('#3f9a5a',o+275,y+8,10,h-28);R('#3f9a5a',o+260,y+(h-14)/2-5,40,10);winD(o+120,40,y,h);winD(o+380,40,y,h)};
 shell(A,80,90,480,390,fN,[[240,300]]);vseg(A,360,90,390,[[150,200]],34);
 for(let y=110;y<=290;y+=60)A.o('medshelf',92,y,60,18);for(let x=170;x<=290;x+=60)A.o('medshelf',x,120,44,16);A.o('counter',170,250,150,22);A.o('register',220,246,40,10);A.o('chair',300,330,14,12);A.o('plant',96,340,14,10);
 A.o('cabinet',372,100,40,10);A.o('crate',380,180,24,20);A.o('crate',420,184,24,18);A.o('fridge',440,100,30,22);A.o('sink',380,300,26,14);
 A.roof(80,90,400,300,'clinic','약국',['#3f9a5a','#f0f0e8']);A.ent(270,404,0,-1);
 const hN=(x0,x1,y,h)=>{const o=A.ox;R('#d8cfc0',o+520,y,300,h);winD(o+560,40,y,h);winD(o+740,40,y,h)};shell(A,520,90,820,390,hN,[[640,690]]);
 A.o('bed',540,110,36,64);A.o('wardrobe',600,104,60,14);A.o('ctable',700,240,60,40);A.o('tv',760,110,40,10);A.o('kitchen',540,330,90,20);A.roof(520,90,300,300,'rest','약사 집',['#8a5a3a','#d8cfc0']);A.ent(665,404,0,-1);
 A.o('car',140,520,56,28,{c:'#3a6ea8'});A.o('wreck',520,600,56,28);A.o('trash',60,430,16,8);A.o('lamp',40,440,6,6);A.o('tree',840,40,20,20);
 for(const[l,x,y]of[['civ1',200,200],['patient',300,160],['nurse',400,260],['civ2',600,600]])if(Rn()<.85)A.z(l,x,y)};
BUILDERS.gunshop=(c,r,sd)=>{const A=Bld('총포상',c,r,'gunshop'),Rn=mulberry(sd*7+11);
 A.fl(0,0,BW,BH,'concrete');A.fl(120,100,560,360,'woodD');A.fl(120,460,560,44,'walk');A.fl(0,520,BW,184,'asphalt');
 const gN=(x0,x1,y,h)=>{const o=A.ox;R('#3a3f45',o+120,y,560,h);for(let i=0;i<560;i+=8)R('#2a2e33',o+120+i,y+4,2,h-20);R('#c43c32',o+120,y+h-14,560,8);R('#f0d070',o+320,y+6,160,h-26);R('#1d1714',o+330,y+10,140,h-34)};
 shell(A,120,100,680,460,gN,[[370,430]]);vseg(A,480,100,460,[[300,350]],34);
 for(let x=140;x<=400;x+=70)A.o('gunrack',x,110,60,16);A.o('gunrack',130,180,16,60);A.o('gunrack',130,280,16,60);A.o('showcase',190,230,120,20);A.o('showcase',330,230,120,20);A.o('counter',230,360,160,22,{fc:'#7a2a24',logo:'badge'});A.o('register',290,356,40,10);
 A.o('ammo',500,120,34,20);A.o('ammo',540,120,34,20);A.o('ammo',580,120,34,20);A.o('locker',640,120,24,40);A.o('locker',640,200,24,40);A.o('gunrack',500,220,60,18);A.o('tool',580,224,30,16);A.o('crate',500,400,24,20);A.o('crate',540,404,24,18);A.o('alarmbox',620,410,16,12);A.o('target',600,300,24,30);
 A.roof(120,100,560,360,'metal','총포상',['#c43c32','#3a3f45']);A.ent(400,474,0,-1);
 A.o('pcar',160,560,60,30);A.o('barrier',500,540,40,10);A.o('cone',560,560,10,10);A.o('lamp',90,490,6,6);
 for(const[l,x,y]of[['cop',300,300],['civ1',200,160],['soldier',560,180],['heavy',400,560]])if(Rn()<.8)A.z(l,x,y)};
BUILDERS.garage=(c,r,sd)=>{const A=Bld('정비소',c,r,'garage'),Rn=mulberry(sd*5+3);
 A.fl(0,0,BW,BH,'asphalt');A.fl(80,80,560,380,'concrete');A.fl(640,80,180,200,'grey');
 A.dec(80,80,560,380,(ox,oy)=>{for(let i=0;i<8;i++)blob(ox+120+hh(i,2,9)*480,oy+120+hh(i,5,9)*300,10,5,'#2a2c30')});
 const sN=(x0,x1,y,h)=>{const o=A.ox;R('#8a9096',o+80,y,560,h);for(const bx of[120,370])R('#5a6068',o+bx,y+4,200,h-14),R('#3a3f45',o+bx,y+h-18,200,4);R('#e0b03a',o+80,y+h-12,560,6)};
 shell(A,80,80,640,460,sN,[[140,300],[390,550]]);
 A.o('lift',140,130,90,150);A.o('car',152,180,56,28,{c:'#c43c32'});A.o('lift',390,130,90,150);A.o('wreck',402,190,56,28);
 A.o('tool',560,100,60,16);A.o('bench2',560,170,60,22);A.o('tires',560,250,40,24);A.o('tires',600,300,30,24);A.o('gen',560,380,44,20);A.o('barrel',260,400,16,10);A.o('barrel',280,404,16,10);A.o('rack',300,100,60,18);
 const oN=(x0,x1,y,h)=>{const o=A.ox;R('#f0f0e8',o+640,y,180,h);winD(o+690,40,y,h)};shell(A,640,80,820,280,oN,[[700,740]]);A.o('desk',660,110,50,24);A.o('chair',680,150,14,12);A.o('cabinet',760,96,40,10);A.o('vending',780,200,24,20);
 A.roof(80,80,560,380,'metal','정비소',['#e0b03a','#3a3f45']);A.roof(640,80,180,200,'flat','사무실',['#e0b03a','#f0f0e8']);A.ent(220,474,0,-1);A.ent(470,474,0,-1);A.ent(720,294,0,-1);
 A.o('tires',100,540,40,24);A.o('wreck',300,560,56,28);A.o('car',520,600,56,28,{c:'#4f5a35'});A.o('barrel',760,520,16,10);A.o('dumpster',800,600,40,20);
 for(const[l,x,y]of[['civ1',300,300],['civ2',480,320],['heavy',700,500],['civ3',200,560]])if(Rn()<.8)A.z(l,x,y)};
BUILDERS.bank=(c,r,sd)=>{const A=Bld('은행',c,r,'bank'),Rn=mulberry(sd*3+17);
 A.fl(0,0,BW,BH,'stone');A.fl(140,120,600,380,'tileP');A.fl(140,500,600,40,'walk');A.fl(0,560,BW,144,'asphalt');
 const bN=(x0,x1,y,h)=>{const o=A.ox;R('#dccfb8',o+140,y,600,h);for(let i=0;i<6;i++)R('#c6baa4',o+160+i*100,y,16,h-10);R('#2f4a7a',o+140,y+h-14,600,8);R('#c9a030',o+380,y+6,120,h-26);winD(o+200,50,y,h);winD(o+640,50,y,h)};
 shell(A,140,120,740,500,bN,[[410,470]]);A.hw(140,480,300,26,'#c6baa4');A.hw(620,744,300,26,'#c6baa4');vseg(A,560,120,300,[],34);
 A.o('counter',180,250,340,22,{fc:'#2f4a7a',logo:'bar'});for(let x=200;x<=460;x+=90)A.o('chair',x,230,14,12);A.o('chairs',200,360,120,20);A.o('chairs',400,360,120,20);A.o('plant',160,460,14,10);A.o('plant',700,460,14,10);A.o('vending',660,340,24,20);
 A.o('desk',170,140,60,30);A.o('desk',300,140,60,30);A.o('desk',430,140,60,30);A.o('cabinet',160,130,40,10);A.o('vault',600,190,100,46);A.o('locker',580,140,24,40);A.o('alarmbox',710,140,16,12);
 A.roof(140,120,600,380,'police','은행',['#2f4a7a','#dccfb8']);A.ent(440,514,0,-1);
 A.o('car',200,600,56,28,{c:'#1d1714'});A.o('truck',500,600,90,36);A.o('bollard',300,546,8,8);A.o('bollard',580,546,8,8);A.o('lamp',100,540,6,6);
 for(const[l,x,y]of[['civ1',300,300],['cop',640,240],['civ2',450,420],['runner',200,620]])if(Rn()<.8)A.z(l,x,y)};
/* ---------- rules for the new kinds ---------- */
Object.assign(TIER,{pharm:1,gunshop:3,garage:2,bank:2});Object.assign(KNAME,{pharm:'약국',gunshop:'총포상',garage:'정비소',bank:'은행'});
if(typeof DLV!='undefined')Object.assign(DLV,{pharm:1,gunshop:2,garage:2,bank:2});if(typeof ALR!='undefined')Object.assign(ALR,{gunshop:.3,bank:.25});
Object.assign(KL,{pharm:['bandage','bandage','pills','medkit','meds'],gunshop:['ammo','ammo','ammo','scrap','elec'],garage:['fuel','scrap','scrap','elec','carpart'],bank:['tkn','tkn','elec','cloth']});
Object.assign(WLOOT,{gunshop:['pistol','revolver','pump','hunting','carbine','sawnoff','dbarrel','smg','ar','crossbow','knife'],garage:['wrench','crowbar','pipe','sledge'],bank:['pistol','baton']});
Object.assign(AMLOOT,{gunshop:['a9mm','a9mm','a12g','a12g','a556','a308','a357'],bank:['a9mm']});Object.assign(GLOOT,{gunshop:['vest','helmet','u_light'].filter(k=>I_BY[k]||W_BY[k]),pharm:['gasmask','medkit'],garage:['wboots','kneepad','headlamp','dt1'],bank:['bag2']});
if(typeof KCOL!='undefined')Object.assign(KCOL,{pharm:'#3f9a5a',gunshop:'#c43c32',garage:'#e0b03a',bank:'#2f4a7a'});
/* the special first-visit bonus */
if(typeof SPEC!='undefined')Object.assign(SPEC,{gunshop:{a9mm:30,a12g:12},pharm:{medkit:1,bandage:3},garage:{fuel:4,carpart:1},bank:{tkn:20}});
/* they appear in the endless city */
{const _k=kindAt;kindAt=function(gx,gy){const k=_k(gx,gy);if(gx==0&&gy==0||k=='base'||k=='lot'||k=='mil'||k=='milR'||k=='rbase')return k;const d=Math.max(Math.abs(gx),Math.abs(gy)),r=bh(gx,gy,23);
  if(d>=1&&r<.07)return'pharm';if(d>=2&&r<.12)return'garage';if(d>=3&&r<.16)return'bank';if(d>=3&&r<.2)return'gunshop';return k}}
