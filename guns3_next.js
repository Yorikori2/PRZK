/* PROJECT LEGACY — every gun drawn on its own.
   Each gun has a spec (shape family + its own details): slide length, revolver cylinder, magazine kind (curved · straight ·
   drum · box · top · tube · pan), stock kind, handguard, carry handle, bipod, wood or polymer, colours …
   so a revolver looks like a revolver, a Tommy gun has its drum and wooden grips, a bullpup has the magazine behind the grip.
   Parts still sit on every gun (anchors per gun). Replaces gBody from guns2_next.js. Loaded after it. */
'use strict';
{/* own scope: the short names below are used elsewhere */
{const add={lmg:'lmg',k3:'lmg',m60:'lmg',pkm:'lmg',minigun:'lmg',crossbow:'bow',rbow:'bow',bow:'bow'};for(const k in add)if(!GCLASS[k])GCLASS[k]=add[k]}
const MT=['#202428','#363c43','#545c66','#86909a'];/* metal: dark · base · light · shine */
const WD=['#4a2c16','#7a4a26','#a0683a','#c48a52'];
const PL=['#1c1e20','#2c2f33','#42464c','#5c6168'];/* polymer black */
const TN=['#6e6046','#8f7d5a','#ad9a72','#c8b68c'];const OL=['#3e4729','#525d36','#6a7744','#84925a'];const GY=['#3c4148','#545b64','#6e7680','#8a939c'];
const PAL={wood:WD,poly:PL,tan:TN,olive:OL,grey:GY,metal:MT};
const K0='#0b0c0e';
function bx3(x,y,w,h,P){R(P[1],x,y,w,h);R(P[2],x,y,w,1);if(h>2)R(P[0],x,y+h-1,w,1);if(w>3&&h>3)R(P[3]||P[2],x+1,y,Math.max(1,w-2),1)}
function rail(x,y,w){for(let i=x;i<x+w;i+=3){R(MT[0],i,y,2,1)}R(MT[1],x,y+1,w,1)}
function slots(x,y,w,P,n){for(let i=x+2;i<x+w-2;i+=4)R(P[0],i,y,2,n||2)}
function vgrip(x,y,P,h){for(let j=0;j<(h||11);j++)R(P[1],x-Math.floor(j/4),y+j,7,1);R(P[2],x,y,6,1);for(let j=y+2;j<y+(h||11)-1;j+=2)R(P[0],x-1-Math.floor((j-y)/4),j,5,1)}
function guard(x,y,w){R(MT[0],x,y,w,1);R(MT[0],x,y,1,4);R(MT[0],x,y+3,w-1,1);R(MT[2],x+Math.floor(w/2),y+1,1,2)}
function barrel(x0,x1,y,t){R(MT[0],x0,y,x1-x0,t||2);R(MT[2],x0,y,x1-x0,1);R(MT[3],x0,y,2,1)}
function magC(x,y,P,n){for(let j=0;j<(n||14);j++)R(j%3?P[1]:P[0],x+Math.floor(j/3),y+j,7,1);R(P[2],x,y,1,Math.min(10,n||14))}
function magS(x,y,P,n,w){bx3(x,y,w||6,n||12,P);for(let j=y+3;j<y+(n||12)-1;j+=3)R(P[0],x+1,j,(w||6)-2,1)}
function drum(x,y,r,P){for(let j=-r;j<=r;j++){const w=Math.round(Math.sqrt(r*r-j*j));R(P[1],x-w,y+j,w*2+1,1)}R(P[2],x-r+2,y-r+1,r,1);R(P[0],x-1,y-1,3,3);R(P[3]||P[2],x,y,1,1)}
let NSTK=false;
function stockAR(x,y,P){if(NSTK)return;R(MT[1],x,y+2,7,4);R(MT[2],x,y+2,7,1);bx3(x+6,y,18,10,P);R(P[0],x+8,y+3,12,1);R(P[0],x+8,y+6,12,1);R(K0,x+23,y,2,11)}
function stockWood(x,y,P,len,drop){if(NSTK)return;const L=len||28;for(let i=0;i<L;i++){const t=Math.min(11,6+Math.floor(i/4)),dy=Math.floor(i*(drop||1)/7);R(P[1],x+i,y+dy,1,t);R(P[2],x+i,y+dy,1,1);R(P[0],x+i,y+dy+t-1,1,1)}R('#2a1a10',x+L-2,y+Math.floor(L*(drop||1)/7),3,11)}
function stockWire(x,y){if(NSTK)return;R(MT[1],x,y,22,2);R(MT[1],x,y+7,20,2);R(MT[1],x+20,y,3,11);R(MT[3],x,y,22,1)}
function stockFold(x,y){if(NSTK)return;R(MT[0],x,y+2,4,5);R(MT[1],x+2,y+3,16,2);R(MT[2],x+2,y+3,16,1)}
/* ---------- shape families ---------- */
const GF={
 /* slide pistol: o.L slide length · o.ext long mag · o.comp ported · o.hammer · o.two (two-tone slide) · o.fr frame palette */
 pist(o,F){const L=o.L||34,x0=74-L,S=o.two?GY:MT,FR=o.fr||F;barrel(x0-2,x0+2,18,3);bx3(x0,15,L,8,S);R(S[3],x0+1,15,L-2,1);for(let x=74-11;x<72;x+=2)R(S[0],x,17,1,5);R(K0,x0+L/2-4|0,17,8,2);R(S[0],x0+2,14,2,1);R(S[0],72,14,2,1);
  if(o.comp){R(K0,x0+3,15,1,2);R(K0,x0+6,15,1,2)}if(o.hammer){R(MT[0],74,14,3,4);R(MT[2],75,14,1,1)}
  bx3(x0+4,23,L-6,4,FR);rail(x0+6,27,10);vgrip(66,27,FR,o.ext?17:12);guard(x0+L-24,27,10);if(o.ext){magS(60,38,MT,8,7)}if(o.fg)R(FR[1],x0+6,27,3,7);
  return{side:[x0+10,25],under:[x0+8,28],optic:[x0+L/2+4,15],muzzle:[x0-2,19],stock:null}},
 rev(o,F){const bl=o.bl||24;R(MT[1],54-bl,17,bl,4);R(MT[2],54-bl,17,bl,1);R(MT[0],54-bl,20,bl,1);R(MT[0],54-bl+1,15,3,2);/* rib */R(MT[3],56-bl,17,bl-4,1);
  /* cylinder */bx3(54,15,12,10,MT);for(let x=55;x<66;x+=3)R(MT[0],x,17,1,7);/* frame + hammer */bx3(66,14,8,10,MT);R(MT[0],72,11,3,4);R(MT[2],73,11,1,1);
  /* wood grip */for(let j=0;j<13;j++)R(F[1],70+Math.floor(j/3),24+j,7,1);R(F[2],70,24,6,1);R(F[0],71,30,5,1);guard(62,24,8);
  return{side:[50-bl/2|0,22],under:[44,22],optic:[62,15],muzzle:[54-bl,18],stock:null}},
 /* box SMG (MP5 / UMP / K7 / PDW): o.bl barrel stub · o.mag 'c'|'s' · o.st stock kind · o.hg handguard kind · o.L receiver length */
 smg(o,F){const L=o.L||32,x0=76-L,bl=o.bl||10;if(o.sup){bx3(x0-bl-8,18,bl+10,7,MT)}else barrel(x0-bl,x0,21,3);
  if(o.hg=='slim')bx3(x0,19,12,7,F);else bx3(x0,18,14,9,F);slots(x0,20,14,F);bx3(x0+12,15,L-12,12,MT);R(MT[3],x0+13,15,L-14,1);rail(x0+14,14,L-16);R(K0,x0+L-14,18,8,3);R(MT[3],74,18,2,2);
  if(o.mag=='c')magC(x0+15,27,MT,15);else magS(x0+15,27,MT,15,6);vgrip(70,27,F,11);guard(62,27,8);
  const st=o.st||'ret';if(st=='fold')stockFold(76,17);else if(st=='wire')stockWire(76,18);else if(st=='fixed')stockAR(76,16,F);else if(st=='ret'&&!NSTK){R(MT[1],76,18,16,2);R(MT[1],76,24,16,2);bx3(90,17,6,10,F)}
  return{side:[x0+4,25],under:[x0+4,27],optic:[x0+L-14,14],muzzle:[x0-bl,22],stock:[76,17,F]}},
 mac(o,F){barrel(42,52,20,3);if(o.sup)bx3(26,18,26,7,MT);bx3(52,15,24,12,MT);R(MT[3],53,15,22,1);R(K0,58,18,8,2);R(MT[2],73,13,3,3);vgrip(68,27,MT,16);R(MT[3],64,40,6,2);guard(58,27,9);stockWire(76,18);
  return{side:[54,25],under:[54,27],optic:[62,15],muzzle:[42,21],stock:[76,17,F]}},
 p90(o,F){barrel(26,36,21,3);/* rounded body */for(let i=0;i<60;i++){const t=i<6?6+i:i>52?12-(i-52):12;R(F[1],36+i,27-t,1,t+4)}R(F[2],40,15,50,1);R(F[0],36,30,60,1);
  /* top mag (translucent) */R('#2a3a2a',48,13,34,3);R('#5a7a5a',48,13,34,1);for(let x=50;x<80;x+=3)R('#c9a42a',x,14,2,1);/* thumbhole grip */R(K0,64,23,10,5);R(F[0],62,28,14,3);R(K0,46,23,4,4);
  return{side:[42,25],under:[44,28],optic:[66,13],muzzle:[26,22],stock:null}},
 vector(o,F){barrel(30,44,20,3);bx3(44,15,30,10,F);R(F[0],44,24,10,4);/* angled lower */for(let j=0;j<8;j++)R(F[1],52+j,25+j,14,1);magS(46,25,MT,16,6);vgrip(70,25,F,12);guard(62,26,8);rail(46,14,26);stockFold(74,16);
  return{side:[46,23],under:[48,28],optic:[58,14],muzzle:[30,21],stock:[74,16,F]}},
 tommy(o,F){barrel(16,46,19,3);for(let x=18;x<44;x+=3)R(MT[0],x,18,1,5);R(MT[3],18,18,26,1);/* vertical fore grip */bx3(30,22,6,12,WD);bx3(46,15,22,10,MT);R(MT[3],47,15,20,1);R(K0,54,18,6,2);
  drum(54,33,7,MT);vgrip(70,25,WD,12);guard(62,25,8);stockWood(76,16,WD,26,1);
  return{side:[24,23],under:[38,24],optic:[56,14],muzzle:[16,20],stock:[76,16,WD]}},
 /* shotguns */
 pump(o,F){const bl=o.bl??8;barrel(bl,60,17,3);R('#e8e2d6',bl+1,16,1,1);R(MT[0],12,21,48,3);R(MT[1],12,21,48,1);bx3(26,20,20,6,F);slots(26,21,20,F,4);bx3(58,15,20,11,MT);R(MT[3],59,15,18,1);R(K0,62,18,8,3);guard(66,26,10);
  if(o.pg){vgrip(80,26,F,11)}else stockWood(78,17,F,30,1);if(o.side)for(let i=0;i<4;i++)R('#c84a3a',62+i*3,22,2,3);
  return{side:[36,25],under:[36,27],optic:[66,15],muzzle:[bl,18],stock:o.pg?null:[78,17,F]}},
 dbl(o,F){const bl=o.bl??6;barrel(bl,58,16,3);barrel(bl,58,19,3);R(MT[3],bl,16,4,1);bx3(30,21,26,6,F);bx3(58,15,14,11,MT);R('#c9a42a',62,18,6,1);R(MT[0],70,13,3,3);guard(64,26,8);
  if(o.pg)vgrip(74,26,F,11);else stockWood(72,17,F,34,1);
  return{side:[40,26],under:[40,27],optic:[62,15],muzzle:[bl,17],stock:o.pg?null:[72,17,F]}},
 sbox(o,F){/* AK-style magazine shotgun (Saiga · AA-12) */barrel(10,40,19,3);R(MT[0],14,16,24,2);if(o.big){bx3(30,15,50,13,F);slots(32,18,26,F,6)}else{bx3(30,17,14,9,F);slots(30,19,14,F,4);bx3(44,15,30,11,MT);R(MT[3],45,15,28,1)}
  if(o.drum)drum(56,34,7,MT);else magS(52,26,MT,14,9);vgrip(74,26,F,11);guard(66,26,8);if(o.big)stockAR(82,16,F);else stockWood(74,17,F,28,1);
  return{side:[34,25],under:[34,27],optic:[58,14],muzzle:[10,20],stock:[80,16,F]}},
 ksg(o,F){barrel(14,40,17,3);R(MT[0],14,21,46,2);R(MT[0],14,24,46,2);R(MT[2],14,21,46,1);bx3(26,21,16,7,F);bx3(40,15,50,12,F);R(F[3],42,15,46,1);vgrip(52,27,F,11);guard(44,27,8);R(K0,86,15,3,13);
  return{side:[30,25],under:[30,28],optic:[60,14],muzzle:[14,18],stock:null}},
 /* rifles: AR family · o.bl · o.ch carry handle · o.hg 'quad'|'round'|'rail' · o.mag 'c'|'s'|'p' · o.st 'ar'|'fixed'|'fold'|'side' */
 ar(o,F){const bl=o.bl??14,th=o.th||3;barrel(bl,34,21-(th>3?1:0),th);R(MT[0],32,15,2,6);
  if(o.hg=='round'){bx3(34,17,24,9,F);for(let x=36;x<56;x+=2)R(F[0],x,18,1,7)}else if(o.hg=='rail'){bx3(34,17,24,10,F);rail(35,16,22);rail(35,26,22);slots(34,20,24,F,3)}else{bx3(34,17,24,10,F);slots(34,20,24,F,2);slots(34,23,24,F,1);rail(35,16,22)}
  bx3(56,15,26,10,MT);R(MT[3],57,15,24,1);R(K0,62,18,9,3);R(MT[2],80,17,3,2);if(o.ch){R(MT[1],58,10,18,2);R(MT[1],58,10,2,5);R(MT[1],74,10,2,5);R(MT[3],58,10,18,1)}else rail(57,14,24);
  if(o.mag=='s')magS(58,25,MT,15,7);else if(o.mag=='p'){magS(58,25,PL,15,8)}else magC(58,25,MT,15);vgrip(75,25,F,12);guard(66,27,9);
  const st=NSTK?'none':o.st||'ar';if(st=='ar'){R(MT[1],82,18,8,4);R(MT[2],82,18,8,1);bx3(88,16,20,11,F);R(F[0],90,19,14,1);R(F[0],90,23,14,1);R(K0,106,16,3,12)}else if(st=='fixed'){bx3(82,16,24,11,F);R(F[0],84,22,18,1);R(K0,104,16,3,13)}else if(st=='side'){bx3(82,17,6,8,F);R(F[1],86,19,18,3);R(F[1],102,17,4,10)}else if(st=='fold')stockFold(82,17);
  return{side:[42,25],under:[44,27],optic:[66,14],muzzle:[bl,22],stock:[86,16,F]}},
 ak(o,F){const bl=o.bl??12;barrel(bl,36,21,3);R(MT[1],18,17,20,3);R(MT[2],18,17,20,1);R(MT[0],bl+2,15,2,6);/* wood lower + upper handguard */bx3(36,19,20,8,WD);bx3(38,16,16,3,WD);
  bx3(56,15,24,11,MT);R(MT[3],57,15,22,1);R(MT[0],58,13,20,2);R(MT[2],70,18,6,2);magC(60,26,o.mag=='pl'?['#5a2a1a','#7a3a22','#9a5030']:MT,17);vgrip(74,26,o.pg||WD,12);guard(66,27,8);
  if(o.st=='fold')stockFold(80,17);else stockWood(80,17,WD,26,1);
  return{side:[42,25],under:[44,27],optic:[64,13],muzzle:[bl,22],stock:[80,17,WD]}},
 wood(o,F){/* full-length wooden rifles (M14 · Mini-14 · SKS) */const bl=o.bl??8;barrel(bl,30,20,3);R(MT[0],bl+2,15,2,5);if(o.bay){R('#c9ccd0',bl-4,23,14,1);R(MT[0],bl+8,22,3,3)}
  for(let i=30;i<106;i++){const t=i<60?8:i<82?9:11,dy=i>82?Math.floor((i-82)/7):0;R(F[1],i,18+dy,1,t);R(F[2],i,18+dy,1,1);R(F[0],i,18+dy+t-1,1,1)}R(MT[0],32,17,34,2);bx3(60,14,20,6,MT);R(MT[2],74,16,4,2);
  if(o.mag)magS(62,26,MT,o.mag,7);guard(68,26,9);R('#2a1a10',104,21,3,11);
  return{side:[40,24],under:[42,26],optic:[66,13],muzzle:[bl,21],stock:null}},
 bull(o,F){const bl=o.bl??14;barrel(bl,30,21,3);bx3(30,16,64,12,F);R(F[3],32,16,60,1);if(o.ch){R(F[1],36,9,46,3);R(F[1],36,9,3,7);R(F[1],80,9,3,7);R(F[3],36,9,46,1)}else rail(40,15,30);
  vgrip(48,28,F,11);guard(40,28,9);if(o.mag=='c')magC(66,28,MT,13);else magS(66,28,o.trans?['#2a3a3a','#4a6a6a','#7aa0a0']:MT,13,7);R(K0,92,16,3,13);R(F[0],70,20,20,2);
  return{side:[34,25],under:[36,28],optic:[58,15],muzzle:[bl,22],stock:null}},
 /* snipers */
 bolt(o,F){const bl=o.bl??2,th=o.th||3;barrel(bl,42,19,th);if(o.brake){bx3(bl-8,17,10,7,MT);R(K0,bl-6,18,1,5);R(K0,bl-3,18,1,5)}
  if(o.wood){for(let i=40;i<108;i++){const t=i<70?8:i<84?10:12,dy=i>84?Math.floor((i-84)/6):0;R(F[1],i,17+dy,1,t);R(F[2],i,17+dy,1,1);R(F[0],i,17+dy+t-1,1,1)}R('#2a1a10',105,20,3,12)}
  else{bx3(40,17,42,9,F);slots(42,19,22,F,4);if(!NSTK){bx3(82,16,24,11,F);R(K0,88,22,8,3);R(K0,104,16,3,13)}}
  bx3(58,14,20,5,MT);R(MT[3],59,14,18,1);R(MT[2],76,19,5,2);R(MT[3],80,18,3,3);if(o.mag)magS(62,26,MT,o.mag,7);guard(68,26,9);if(!o.wood)vgrip(76,26,F,11);
  return{side:[48,23],under:[42,26],optic:[66,13],muzzle:[bl,20],stock:[82,16,F]}},
 amr(o,F){barrel(-6,40,18,5);bx3(-12,15,10,10,MT);for(let j=16;j<24;j+=2)R(K0,-11,j,8,1);bx3(40,14,44,12,F);rail(42,13,40);magS(62,26,MT,10,10);vgrip(78,26,F,12);guard(70,26,8);if(!NSTK){bx3(84,15,22,12,F);R(K0,104,15,3,14)}
  /* bipod */R(MT[0],42,26,4,2);ln(43,28,36,40,MT[0]);ln(45,28,52,40,MT[0]);
  return{side:[46,24],under:[42,27],optic:[62,12],muzzle:[-12,20],stock:[84,15,F]}},
 /* machine guns */
 lmg(o,F){const bl=o.bl??10;barrel(bl,38,20,o.th||4);R(MT[0],bl+2,16,2,5);if(o.hg)bx3(28,17,12,9,F);bx3(38,13,40,13,MT);R(MT[3],39,13,38,1);/* feed cover */R(MT[2],52,11,22,3);R(MT[1],60,7,12,2);R(MT[1],60,7,2,5);R(MT[1],70,7,2,5);
  if(o.belt){bx3(48,26,14,10,OL);for(let x=46;x<50;x++)R('#c9a42a',x,26+(x%2),1,8)}else{bx3(48,26,16,12,o.boxc||OL);R((o.boxc||OL)[0],50,30,12,1)}
  vgrip(80,26,F,12);guard(72,26,8);if(o.wood)stockWood(78,15,WD,28,1);else stockAR(78,15,F);
  /* bipod (folded) */R(MT[0],bl+6,24,2,2);R(MT[1],bl+7,25,18,1);
  return{side:[30,24],under:[32,26],optic:[60,10],muzzle:[bl,21],stock:[80,15,F]}},
 mini(o,F){for(let i=0;i<3;i++){R(MT[0],4,15+i*4,46,3);R(MT[2],4,15+i*4,46,1)}for(let x=8;x<48;x+=12)R(MT[1],x,14,3,13);bx3(50,13,26,16,MT);R(MT[3],51,13,24,1);drum(62,35,6,OL);R(MT[1],76,16,12,3);R(MT[1],86,12,3,16);R(K0,82,26,10,3);R('#c84a3a',66,16,3,3);
  return{side:[20,26],under:[30,27],optic:[60,12],muzzle:[4,20],stock:null}},
 /* launchers and odd ones */
 tube(o,F){if(o.law){bx3(8,15,90,10,OL);R(OL[0],10,19,86,1);R('#e8c84a',20,16,10,2);R(MT[0],60,25,4,8);R(MT[0],48,25,3,6)}else{bx3(26,16,70,8,WD);R(MT[1],26,17,70,6);R(MT[2],26,17,70,1);bx3(4,12,24,16,OL);for(let j=0;j<6;j++)R(OL[1],-6+j,14+j,10,16-2*j);R(MT[2],58,12,6,4);R(MT[0],52,24,4,9);R(WD[1],70,24,5,10);R(K0,94,15,3,10)}
  return{side:[40,24],under:[50,26],optic:[60,12],muzzle:o.law?[8,20]:[-6,20],stock:null}},
 gl(o,F){if(o.rev){barrel(20,46,16,8);R(MT[0],20,24,26,1);bx3(46,13,18,16,MT);for(let x=48;x<62;x+=4)R(MT[0],x,14,2,14);R(MT[3],47,13,16,1);vgrip(70,27,PL,11);guard(62,27,8);stockFold(72,17);bx3(30,24,10,8,PL)}
  else{barrel(24,60,15,9);R(MT[3],24,15,36,1);bx3(60,14,14,12,MT);R(MT[2],62,12,6,2);vgrip(74,25,F,11);guard(66,25,8);stockWood(74,16,F,26,1)}
  return{side:[36,24],under:[36,26],optic:[62,11],muzzle:[o.rev?20:24,19],stock:null}},
 bow(o,F){const cx=52;/* riser (grip) */bx3(cx-3,8,6,32,F);R(K0,cx-2,20,4,7);R(F[3]||F[2],cx-2,9,1,30);
  /* limbs bend back toward the string (to the right) */for(let j=0;j<17;j++){const dx=Math.round((16-j)*(16-j)/36);R(F[1],cx+1+dx-5,4+j,3,1);R(F[1],cx+1+dx-5,43-j,3,1)}
  if(o.cams){for(const y of[4,43]){R(MT[1],cx+1,y-2,5,5);R(MT[3],cx+2,y-1,2,2)}R(MT[0],cx+8,10,1,28)}
  /* string */ln(cx+3,4,cx+14,23,'#e8e2d6');ln(cx+3,43,cx+14,24,'#e8e2d6');
  /* arrow, tip to the left */R('#8a6a3a',cx-36,23,50,1);R('#c9ccd0',cx-40,22,5,3);R('#5a5f66',cx-41,23,1,1);R('#c84a3a',cx+10,21,4,2);R('#e8e2d6',cx+10,25,4,2);
  return{side:[cx,30],under:[cx,32],optic:[cx+2,14],muzzle:[cx-41,23],stock:null}},
 xbow(o,F){bx3(30,19,70,7,F);R(F[0],60,26,4,9);vgrip(66,26,F,10);/* prod */R(MT[1],26,6,4,34);R(MT[2],26,6,2,34);ln(28,6,52,19,'#e8e2d6');ln(28,40,52,26,'#e8e2d6');R('#8a6a3a',22,21,40,2);R('#c9ccd0',18,20,5,4);R(K0,96,18,4,10);
  return{side:[40,26],under:[40,27],optic:[60,17],muzzle:[18,22],stock:null}},
 flamer(o,F){barrel(8,40,19,4);R('#c84a3a',8,18,4,6);bx3(40,15,30,11,MT);bx3(44,26,26,9,['#7a2a1a','#a83a2a','#c85a3a']);R('#e8c84a',50,28,12,2);vgrip(74,26,PL,11);guard(66,26,8);R(MT[1],38,24,4,6);
  return{side:[24,24],under:[30,24],optic:[56,14],muzzle:[8,21],stock:null}},
 tool(o,F){const C=o.c;bx3(40,14,34,11,C);R(C[3],41,14,32,1);R(K0,42,17,4,4);vgrip(68,25,o.g||PL,12);guard(58,25,9);if(o.k=='nail'){R(MT[1],34,16,6,6);magS(44,25,MT,10,12);for(let i=46;i<56;i+=2)R('#c9ccd0',i,26,1,8)}if(o.k=='flare'){barrel(26,40,17,6);R('#ff8a3a',26,18,3,3)}if(o.k=='taser'){R('#2a2a2a',34,16,6,7);R('#5aa8ff',33,17,1,2);R('#5aa8ff',33,21,1,2)}
  return{side:[46,24],under:[46,26],optic:[56,14],muzzle:[34,19],stock:null}}};
/* ---------- every gun: [family, options, furniture] ---------- */
const GS={
 pistol:['pist',{L:34},'poly'],glock19:['pist',{L:30},'poly'],spistol:['pist',{L:34,two:1},'poly'],k5:['pist',{L:32},'grey'],m9:['pist',{L:38,hammer:1},'poly'],
 b93r:['pist',{L:40,ext:1,fg:1,hammer:1},'poly'],m1911:['pist',{L:36,hammer:1},'wood'],usp45:['pist',{L:38},'tan'],fn57:['pist',{L:36,two:1},'olive'],hpistol:['pist',{L:44,comp:1,hammer:1},'metal'],
 mpistol:['pist',{L:32,ext:1},'poly'],revolver:['rev',{bl:24},'wood'],
 smg:['smg',{mag:'c',st:'ret',hg:'slim',bl:8},'poly'],ssmg:['smg',{mag:'c',st:'ret',sup:1,bl:6},'poly'],k7:['smg',{mag:'c',st:'fold',sup:1,bl:6},'olive'],ump45:['smg',{mag:'s',st:'fold',L:36,bl:8},'poly'],
 pdw:['smg',{mag:'s',st:'fold',L:30,bl:10},'tan'],mac10:['mac',{},'metal'],p90:['p90',{},'poly'],vector:['vector',{},'grey'],tommy:['tommy',{},'wood'],
 pump:['pump',{bl:8},'wood'],m590:['pump',{bl:6,side:1},'poly'],dbarrel:['dbl',{bl:6},'wood'],sawnoff:['dbl',{bl:36,pg:1},'wood'],autosg:['pump',{bl:6,pg:0},'poly'],
 saiga:['sbox',{},'poly'],aa12:['sbox',{big:1,drum:1},'olive'],ksg:['ksg',{},'poly'],
 ar:['ar',{bl:14,hg:'rail',mag:'p'},'poly'],m16a4:['ar',{bl:6,ch:1,hg:'round',mag:'c',st:'fixed'},'poly'],k2:['ar',{bl:12,hg:'quad',mag:'c',st:'side'},'poly'],k1a:['ar',{bl:22,hg:'quad',mag:'c',st:'fold'},'poly'],
 carbine:['ar',{bl:18,hg:'round',mag:'c'},'olive'],scarh:['ar',{bl:12,th:4,hg:'rail',mag:'s',st:'ar'},'tan'],g36c:['ar',{bl:20,hg:'quad',mag:'p',ch:1,st:'side'},'grey'],
 battle:['ak',{bl:12},'wood'],sks:['wood',{bl:6,mag:8,bay:1},'wood'],m14:['wood',{bl:4,mag:14},'wood'],mini14:['wood',{bl:12,mag:10},'wood'],
 famas:['bull',{bl:18,ch:1,mag:'c'},'poly'],aug:['bull',{bl:16,mag:'s',trans:1},'olive'],
 sniper:['bolt',{bl:2,mag:6},'olive'],hunting:['bolt',{bl:4,wood:1},'wood'],mosin:['bolt',{bl:-2,wood:1},'wood'],k14:['bolt',{bl:2,mag:6,th:4},'tan'],m110:['ar',{bl:0,th:4,hg:'rail',mag:'s',st:'fixed'},'tan'],
 dmr:['ak',{bl:2,mag:'pl'},'wood'],amr:['amr',{},'poly'],
 lmg:['lmg',{bl:10,hg:1},'poly'],k3:['lmg',{bl:12,hg:1},'poly'],m60:['lmg',{bl:4,belt:1,wood:1},'wood'],pkm:['lmg',{bl:6,belt:1,wood:1,boxc:GY},'wood'],minigun:['mini',{},'metal'],
 crossbow:['xbow',{},'wood'],rbow:['bow',{},'wood'],bow:['bow',{cams:1},'poly'],
 law:['tube',{law:1},'olive'],rpg:['tube',{},'wood'],gl:['gl',{},'wood'],k201:['gl',{},'poly'],m32:['gl',{rev:1},'poly'],flamer:['flamer',{},'metal'],
 taser:['tool',{c:['#8a7a1a','#c8b02a','#e8d04a','#f4e47a'],k:'taser'},'poly'],flare:['tool',{c:['#8a3a1a','#c8582a','#e8783a','#f49a5a'],k:'flare'},'poly'],nailgun:['tool',{c:['#1a4a8a','#2a6ac8','#4a8ae8','#7aaaf4'],k:'nail'},'poly']};
/* override the body drawing */
gBody=function(cl,id,m){const s=GS[id];if(!s){const fam={pistol:'pist',smg:'smg',shotgun:'pump',rifle:'ar',sniper:'bolt',lmg:'lmg',bow:'bow'}[cl]||'ar';return GF[fam]({},PAL.poly)}
 const o=Object.assign({},s[1]);/* a barrel part changes the length a little */const b=m&&m.barrel;if(b&&o.bl!=null){if(b=='b_short')o.bl+=10;if(b=='b_long'||b=='b_match'||b=='b_pext')o.bl-=8;if(b=='b_heavy')o.th=(o.th||3)+1}
 if(b=='b_integ')o.sup=1;NSTK=!!(m&&m.stock);try{return GF[s[0]](o,PAL[s[2]]||PL)}finally{NSTK=false}};
/* parts on odd families: no stock place for pistols · bows · launchers (already none); bows have no parts places */
if(CSLOT.bow)CSLOT.bow.splice(0,CSLOT.bow.length,'optic');
window.GS=GS;window.GF=GF;}
