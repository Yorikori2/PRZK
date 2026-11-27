/* PROJECT LEGACY — guns drawn anew, and more parts for the four places.
   The gun picture (parts tab / character gun tab) is redrawn: outlined, shaded metal · polymer · wood · olive furniture,
   rails with teeth, ejection port, charging handle, serrated slide, ridged magazines, textured grips, real stocks.
   Each gun gets its own furniture colour (from its name), and every part shows on the gun.
   New parts: 총열 6 (pistols get barrels too) · 사이드 4 · 손잡이 4 · 사이트 5.
   Loaded after invtabs_next.js. */
'use strict';
/* ---------- more parts ---------- */
{const add=p=>{if(!P_BY[p[0]]){PARTS.push(p);P_BY[p[0]]=p}};const AL=['pistol','smg','rifle','shotgun','sniper','lmg'];
 add(['b_poly','다각형 총열','barrel','u',['smg','rifle','sniper','lmg'],{dmg:5,acc:4},'경찰서 · 군부대']);
 add(['b_flute','플루티드 총열','barrel','r',['rifle','sniper','lmg'],{acc:6,mov:3},'군부대']);
 add(['b_cool','냉각 슬리브 총열','barrel','r',['smg','rifle','lmg'],{rof:10,rec:-5},'군부대 · 연구소']);
 add(['b_integ','일체형 소음 총열','barrel','e',['smg','rifle','pistol'],{nz:-3,dmg:-3},'군부대 무기고']);
 add(['b_pext','연장 총열 (권총)','barrel','u',['pistol'],{rng:12,dmg:5},'경찰서 · 총포상']);
 add(['b_pcomp','보정 총열 (권총)','barrel','r',['pistol'],{rec:-15,acc:4},'총포상 · 군부대']);
 add(['s_green','녹색 레이저','light','r',['pistol','smg','rifle','shotgun'],{acc:10},'경찰서 · 총포상']);
 add(['s_ir','적외선 레이저','light','e',['smg','rifle','sniper'],{acc:8,night:2},'군부대 · 연구소']);
 add(['s_strobe','스트로브 플래시','light','u',['pistol','smg','rifle','shotgun'],{night:1,acc:2},'경찰서']);
 add(['s_peq','전술 조준 장치','light','l',['rifle','sniper','smg'],{acc:12,night:2},'군부대 무기고']);
 add(['g_hand','핸드스톱','under','c',['smg','rifle','shotgun'],{rec:-6,acc:3},'철물점 · 주택']);
 add(['g_fold','접이식 손잡이','under','u',['smg','rifle','shotgun'],{rec:-10,mov:2},'경찰서']);
 add(['g_tri','삼각 손잡이 (양각대 겸용)','under','r',['rifle','sniper','lmg'],{rec:-15,acc:5,mov:-2},'군부대']);
 add(['g_magw','탄창 손잡이','under','r',['smg','rifle'],{rld:-15,rec:-5},'총포상 · 군부대']);
 add(['o_iron','개량 가늠쇠','optic','c',AL,{acc:4,mov:1},'주택 · 철물점']);
 add(['o_refl','리플렉스 조준경','optic','c',['pistol','smg','shotgun','rifle'],{acc:7},'경찰서 · 총포상']);
 add(['o_prism','3배 프리즘','optic','u',['smg','rifle','lmg'],{acc:11,rng:12},'경찰서 · 군부대']);
 add(['o_var','가변 1-6배 조준경','optic','e',['rifle','sniper','lmg'],{acc:15,rng:30,mov:-2},'군부대 무기고']);
 add(['o_nv','야간 투시 조준경','optic','e',['smg','rifle','sniper'],{acc:10,night:2},'연구소 · 군부대']);
 /* pistols take a barrel too */if(CSLOT.pistol&&!CSLOT.pistol.includes('barrel'))CSLOT.pistol.unshift('barrel')}
/* ---------- the drawing ---------- */
const GK='#0e1012';
const FURN={black:['#2b2e31','#3c4045','#50565c'],tan:['#8a7a56','#a8966a','#c4b284'],olive:['#4a5434','#5f6b40','#7a8752'],wood:['#6a4426','#8a5a33','#b07a45'],grey:['#4a5058','#626a73','#7e8791']};
function gFurn(id,cl){if(cl=='shotgun'||id=='hunting'||id=='dbarrel')return'wood';if(cl=='sniper')return'olive';const L=['black','black','tan','olive','grey'];let h=0;for(const c of id)h=(h*31+c.charCodeAt(0))|0;return L[Math.abs(h)%L.length]}
const MET=['#24282d','#3a4047','#5a626b','#8a949e'];
function box(x,y,w,h,c3,top){/* a shaded block: base · light top line · dark bottom line */R(c3[1],x,y,w,h);R(c3[2],x,y,w,1);if(h>2)R(c3[0],x,y+h-1,w,1);if(top)R(top,x+1,y,w-2,1)}
function teeth(x,y,w,c){for(let i=x;i<x+w;i+=3)R(c,i,y,2,1)}
function gBody(cl,id,m){const F=FURN[gFurn(id,cl)],M=[MET[0],MET[1],MET[2]],bar=m.barrel;
 const BL={rifle:{b_short:24,b_long:6,b_match:6,b_flute:8,b_heavy:10,b_poly:12,b_cool:14,b_integ:10},sniper:{b_short:16,b_flute:2,b_heavy:4},smg:{b_short:38,b_long:24,b_match:24,b_integ:22,b_poly:30,b_cool:28},shotgun:{b_short:24,b_long:2},pistol:{b_pext:30,b_pcomp:32,b_integ:24}}[cl]||{};
 const out={};
 if(cl=='pistol'){const bx=BL[bar]??38;/* barrel tip */R(MET[0],bx,18,40-bx,3);R(MET[2],bx,18,40-bx,1);if(bar=='b_pcomp'){R(MET[0],bx-1,17,6,5);R(MET[3],bx+1,17,1,1);R(MET[3],bx+3,17,1,1)}if(bar=='b_integ'){box(bx-2,16,12,7,M)}
  /* slide */box(38,15,36,8,[MET[0],MET[1],MET[2]]);R(MET[3],39,15,34,1);for(let x=62;x<72;x+=2)R(MET[0],x,17,1,5);R(GK,50,17,8,2);R(MET[2],51,17,6,1);/* sights */R(MET[0],40,14,2,1);R(MET[0],70,14,3,1);
  /* frame + rail */box(40,23,30,4,F);teeth(42,27,10,F[0]);/* grip */for(let j=0;j<13;j++)R(j<1?F[2]:F[1],60-Math.floor(j/4),27+j,11,1);for(let j=29;j<39;j+=2)R(F[0],58,j,9,1);R(GK,58,40,11,1);/* guard + trigger */R(F[0],50,27,10,1);R(F[0],50,27,1,5);R(F[0],50,31,9,1);R(MET[2],56,28,1,3);
  out.side=[46,25];out.under=[44,28];out.optic=[56,15];out.muzzle=[bx,19];return out}
 if(cl=='shotgun'){const bx=BL[bar]??8;R(MET[0],bx,17,60-bx,3);R(MET[2],bx,17,60-bx,1);R(MET[3],bx+2,17,8,1);/* bead */R('#e8e2d6',bx+1,16,1,1);
  /* tube */R(MET[0],12,21,48,3);R(MET[1],12,21,48,1);/* pump forend (grooves) */box(28,20,20,6,F);for(let x=30;x<46;x+=3)R(F[0],x,21,1,4);
  /* receiver */box(58,15,20,11,M);R(MET[3],59,15,18,1);R(GK,62,18,8,3);R(MET[2],63,18,6,1);/* guard + trigger */R(MET[0],66,26,10,1);R(MET[0],66,26,1,4);R(MET[0],66,29,9,1);R(MET[2],70,27,1,2);
  if(!m.stock){/* stock (wood, thick) */for(let i=0;i<30;i++){const t=Math.min(10,5+Math.floor(i/4));R(i%2?F[1]:F[1],78+i,17+Math.floor(i/6),1,t)}R(F[2],78,17,30,1);R(F[0],78,25,24,2);R('#2a1a10',106,19,3,10)}
  out.side=[36,25];out.under=[36,27];out.optic=[66,15];out.muzzle=[bx,18];out.stock=[78,17,F];return out}
 if(cl=='sniper'){const bx=BL[bar]??4;R(MET[0],bx,19,42-bx,3);R(MET[2],bx,19,42-bx,1);if(bar=='b_flute')for(let x=bx+3;x<40;x+=4)R(MET[3],x,20,2,1);if(bar=='b_heavy')R(MET[0],bx,18,42-bx,5);
  /* chassis stock */box(40,17,42,9,F);for(let x=44;x<60;x+=4)R(F[0],x,19,2,4);/* receiver + rail + bolt */box(56,14,20,5,M);teeth(56,13,20,MET[2]);R(MET[2],74,19,5,2);R(MET[3],78,18,3,3);
  /* mag + guard + grip */box(60,26,7,6,M);R(F[0],66,26,9,1);R(F[0],66,26,1,4);R(F[0],66,29,8,1);for(let j=0;j<11;j++)R(F[1],73-Math.floor(j/4),26+j,7,1);
  if(!m.stock){/* thumbhole stock */box(82,16,24,11,F);R(GK,88,22,8,3);R(F[0],104,16,3,13);R('#1d1714',105,17,2,11)}
  out.side=[46,23];out.under=[40,26];out.optic=[64,13];out.muzzle=[bx,20];out.stock=[82,16,F];return out}
 if(cl=='smg'){const bx=BL[bar]??32;R(MET[0],bx,20,44-bx,3);R(MET[2],bx,20,44-bx,1);if(bar=='b_cool')for(let x=bx+1;x<42;x+=3)R(GK,x,20,1,3);if(bar=='b_integ')box(bx-4,18,16,7,M);
  /* receiver */box(44,16,32,11,M);R(MET[3],45,16,30,1);teeth(48,15,24,MET[2]);R(GK,58,18,9,3);R(MET[2],59,18,7,1);R(MET[3],74,18,2,2);
  /* straight mag */box(52,27,7,15,M);for(let j=30;j<41;j+=3)R(MET[0],53,j,5,1);/* grip */for(let j=0;j<11;j++)R(F[1],68-Math.floor(j/4),27+j,8,1);R(F[2],68,27,7,1);for(let j=29;j<37;j+=2)R(F[0],66,j,6,1);
  /* guard */R(MET[0],60,27,8,1);R(MET[0],60,27,1,4);R(MET[0],60,30,7,1);if(!m.stock){/* wire stock */R(MET[1],76,18,24,2);R(MET[1],76,25,22,2);R(MET[1],98,18,3,11);R(MET[3],76,18,24,1)}
  out.side=[46,25];out.under=[46,27];out.optic=[58,15];out.muzzle=[bx,21];out.stock=[76,17,F];return out}
 /* rifle (and lmg / anything else) */const bx=BL[bar]??14;const th=bar=='b_heavy'?4:3;R(MET[0],bx,21-(th>3?1:0),36-bx,th);R(MET[2],bx,21-(th>3?1:0),36-bx,1);if(bar=='b_flute')for(let x=bx+2;x<34;x+=4)R(MET[3],x,22,2,1);if(bar=='b_cool')for(let x=bx+1;x<34;x+=3)R(GK,x,21,1,3);if(bar=='b_poly')R('#3a5a8a',bx,22,36-bx,1);if(bar=='b_integ')box(bx-2,18,18,8,M);if(bar=='b_match')R(MET[3],bx,21,36-bx,1);
 /* front sight post */R(MET[0],33,16,2,5);
 /* handguard with slots */box(34,17,24,10,F);for(let x=37;x<56;x+=5)R(F[0],x,20,3,2),R(F[0],x,23,3,1);teeth(35,16,22,MET[2]);
 /* upper receiver + rail + port + charging handle */box(56,15,26,10,M);R(MET[3],57,15,24,1);teeth(57,14,24,MET[2]);R(GK,62,18,9,3);R(MET[2],63,18,7,1);R(MET[2],80,17,3,2);
 /* lower: mag well + curved mag */box(58,25,10,4,M);for(let j=0;j<15;j++)R(j%3?MET[1]:MET[0],58+Math.floor(j/3),29+j,7,1);R(MET[2],58,29,1,10);
 /* guard + trigger + grip */R(MET[0],66,27,9,1);R(MET[0],74,27,1,4);R(MET[0],66,30,8,1);R(MET[2],70,28,1,2);for(let j=0;j<12;j++)R(F[1],75-Math.floor(j/4),25+j,7,1);R(F[2],75,25,6,1);for(let j=27;j<36;j+=2)R(F[0],73,j,5,1);
 /* buffer tube + stock */R(MET[1],82,18,8,4);R(MET[2],82,18,8,1);if(!m.stock){box(88,16,20,11,F);R(F[0],90,19,14,1);R(F[0],90,23,14,1);R('#1d1714',106,16,3,12)}
 out.side=[42,25];out.under=[44,27];out.optic=[66,14];out.muzzle=[bx,22];out.stock=[86,16,F];return out}
/* ---------- the parts on the gun ---------- */
function gSide(p,x,y){if(!p)return;const beam=(c,a)=>{g.globalAlpha=a;R(c,x-44,y+1,40,1);g.globalAlpha=1};R(GK,x-4,y-1,10,5);R('#2a2f35',x-3,y,8,3);R('#4a5058',x-3,y,8,1);
 if(p=='u_laser'){R('#ff3030',x-4,y+1,1,1);beam('#ff3030',.4)}else if(p=='s_green'){R('#5fe08a',x-4,y+1,1,1);beam('#5fe08a',.45)}else if(p=='s_ir'){R('#a060ff',x-4,y+1,1,1);beam('#a060ff',.2)}
 else if(p=='u_light'||p=='s_strobe'||p=='l_hi'||p=='l_strobe'){R('#ffd36a',x-4,y,1,3);g.globalAlpha=p=='s_strobe'&&(performance.now()/120|0)%2?.05:.2;R('#ffe8a0',x-26,y-3,22,9);g.globalAlpha=1}
 else if(p=='sd_combo'){R('#ff3030',x-4,y,1,1);R('#ffd36a',x-4,y+2,1,2);beam('#ff3030',.35)}else if(p=='s_peq'){R('#4a5434',x-6,y-2,14,6);R('#5f6b40',x-6,y-2,14,1);R('#a060ff',x-7,y,1,1);R('#ff3030',x-7,y+2,1,1);beam('#a060ff',.2)}}
function gGrip(p,x,y){if(!p)return;const P=['#24282d','#3a4047','#5a626b'];
 if(p=='u_grip'){box(x,y,4,10,P)}else if(p=='g_angle'){for(let j=0;j<6;j++)R(P[1],x+j,y+j,5,1);R(P[2],x,y,5,1)}else if(p=='g_stub'){box(x,y,4,5,P)}else if(p=='g_hand'){R(P[1],x,y,3,3);R(P[2],x,y,3,1)}
 else if(p=='g_fold'){box(x,y,3,8,P);R(P[2],x-1,y,5,1)}else if(p=='g_tri'){box(x,y,4,7,P);ln(x+1,y+7,x-4,y+13,P[0]);ln(x+2,y+7,x+7,y+13,P[0])}else if(p=='g_magw'){box(x-1,y,6,10,P);for(let j=y+2;j<y+10;j+=2)R(P[0],x,j,4,1)}
 else if(p=='u_bipod'){R(P[0],x,y,4,2);ln(x+1,y+2,x-5,y+14,P[0]);ln(x+2,y+2,x+8,y+14,P[0])}else if(p=='u_gl'){box(x-10,y,22,6,['#3e4729','#4a5434','#5f6b40']);R(GK,x-11,y,2,6);R(P[0],x+8,y+6,3,4)}}
function gSight(p,x,y){if(!p)return;const P=['#24282d','#3a4047','#5a626b'];
 if(p=='o_iron'){R(P[0],x-8,y-3,2,3);R(P[0],x+6,y-4,3,4);R('#e8c84a',x-7,y-3,1,1)}else if(p=='o_rd'||p=='o_refl'){box(x-4,y-5,8,5,P);R('#3a6ea8',x-3,y-4,6,3);R('#ff3030',x,y-3,1,1)}
 else if(p=='o_holo'){box(x-6,y-7,12,7,P);R('#7fb8e0',x-5,y-6,8,4);R('#ff3030',x-1,y-5,2,2)}else if(p=='o_prism'){box(x-6,y-7,12,7,P);R('#7fb8e0',x-6,y-6,2,4);R(P[2],x+2,y-9,3,2)}
 else if(['o_4x','o_8x','o_var','o_nv','o_th'].includes(p)){const L=p=='o_8x'?28:p=='o_var'?24:18;R(GK,x-L/2-1,y-8,L+2,6);R(P[1],x-L/2,y-7,L,4);R(P[2],x-L/2,y-7,L,1);R(P[0],x-L/2-2,y-8,4,6);R(P[0],x+L/2-2,y-8,4,6);R(p=='o_nv'||p=='o_th'?'#5fe08a':'#7fb8e0',x-L/2-2,y-7,1,4);R(P[0],x-2,y-2,2,2);R(P[0],x+3,y-2,2,2);if(p=='o_var')R('#e8c84a',x+2,y-9,2,1)}}
function gMuzzleTip(cl,p,x,y){/* barrels already tell their length; a crown highlight */R('#8a949e',x,y,1,1)}
/* the new blueprint (same size as before: 126 × 48) */
blueprint=function(id,mods){const cl=GCLASS[id]||'rifle',c=document.createElement('canvas');c.width=126;c.height=48;const o=g;g=c.getContext('2d');g.translate(12,0);
 try{const A=gBody(cl,id,mods||{});if(A.stock&&(mods||{}).stock)gStock(mods.stock,...A.stock);gGrip((mods||{}).under,...A.under);gSide((mods||{}).light,...A.side);gSight((mods||{}).optic,...A.optic);gMuzzleTip(cl,mods&&mods.barrel,...A.muzzle)}catch(e){}
 g=o;/* outline */const x=c.getContext('2d'),im=x.getImageData(0,0,126,48),d=im.data,src=new Uint8ClampedArray(d);for(let j=0;j<48;j++)for(let i=0;i<126;i++){const k=(j*126+i)*4;if(src[k+3]>40)continue;
  for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const ii=i+a,jj=j+b;if(ii<0||jj<0||ii>=126||jj>=48)continue;const q=(jj*126+ii)*4;if(src[q+3]>200){d[k]=14;d[k+1]=16;d[k+2]=18;d[k+3]=255;break}}}
 x.putImageData(im,0,0);return c};
/* the parts tab: side parts now show on the picture itself (the old patch drew a box) */
if(typeof partsBind=='function'){const _pb=partsBind;partsBind=function(){_pb();try{const c=$('ptC');if(!c||!PGUN)return;const bp=blueprint(PGUN,PGo().mods[PGUN]||{});c.width=bp.width*3;c.height=bp.height*3;const x=c.getContext('2d');x.imageSmoothingEnabled=false;x.clearRect(0,0,c.width,c.height);x.drawImage(bp,0,0,c.width,c.height)}catch(e){}}}

/* ---------- 개머리판: a fifth place (rifles · SMGs · shotguns · snipers · LMGs; heavy → workbench) ---------- */
if(!PS4K.includes('stock')){PS4.push(['stock','개머리판']);PS4K.push('stock');if(typeof PSLOTS!='undefined'&&!PSLOTS.some(x=>x[0]=='stock'))PSLOTS.push(['stock','개머리판'])}
for(const cl of['smg','rifle','shotgun','sniper','lmg'])if(CSLOT[cl]&&!CSLOT[cl].includes('stock'))CSLOT[cl].push('stock');
{const add=p=>{if(!P_BY[p[0]]){PARTS.push(p);P_BY[p[0]]=p}};const LG=['smg','rifle','shotgun','sniper','lmg'];
 add(['s_fold','접이식 개머리판','stock','c',['smg','rifle','shotgun'],{mov:6,rec:6},'주택 · 철물점']);
 add(['s_skel','골격형 개머리판','stock','u',['smg','rifle','sniper'],{mov:5,rec:-4},'총포상 · 경찰서']);
 add(['s_pad','반동 패드 개머리판','stock','u',['shotgun','rifle','sniper','lmg'],{rec:-18,mov:-2},'경찰서 · 철물점']);
 add(['s_wood','원목 개머리판','stock','c',['rifle','shotgun','sniper'],{acc:4,rec:-6,mov:-2},'주택 · 교회']);
 add(['s_crane','크레인 개머리판','stock','r',['smg','rifle','lmg'],{rec:-12,acc:4},'군부대']);
 add(['s_prec','정밀 사격 개머리판','stock','e',['sniper','rifle'],{acc:10,rec:-15,mov:-4},'군부대 무기고']);
 add(['s_brace','팔걸이 브레이스','stock','r',['smg'],{mov:8,rec:-6},'총포상']);
 add(['s_bull','불펍 개머리판','stock','l',['rifle','smg'],{mov:8,rng:10,acc:5},'군부대 무기고'])}
/* a stock is heavy work: bench only (as 총열 · 손잡이) */
if(typeof partsTab=='function'){const _pt=partsTab;partsTab=function(){return _pt().replace(/<small>개머리판<\/small>/g,'<small>개머리판 · 🔧 작업대</small>').replace('<b>총열 · 손잡이</b>는','<b>총열 · 손잡이 · 개머리판</b>은')}}
/* the drawings: x = where the stock meets the gun, it goes to the right */
function gStock(p,x,y,F){const M=['#24282d','#3a4047','#5a626b','#8a949e'],W=['#5a3a22','#8a5a33','#b07a45'];
 if(p=='s_light'){R(M[1],x,y+1,22,2);R(M[1],x,y+7,18,2);R(M[1],x+20,y+1,3,10);R(M[3],x,y+1,22,1)}
 else if(p=='s_tac'){box(x,y,20,10,F);for(let i=x+3;i<x+18;i+=4)R(F[0],i,y+3,2,4);R('#1d1714',x+20,y-1,3,12)}
 else if(p=='s_cheek'){box(x,y,22,10,F);box(x+4,y-3,12,3,F);R('#1d1714',x+21,y,3,11)}
 else if(p=='s_fold'){/* folded flat along the side */R(M[0],x,y+3,4,5);R(M[1],x+2,y+4,18,2);R(M[2],x+2,y+4,18,1);R(M[1],x+18,y+2,2,7)}
 else if(p=='s_skel'){R(M[1],x,y,22,2);R(M[1],x,y+8,20,2);ln(x+2,y+2,x+12,y+8,M[1]);ln(x+12,y+2,x+20,y+8,M[1]);R(M[1],x+20,y,3,11);R(M[3],x,y,22,1)}
 else if(p=='s_pad'){box(x,y,20,10,F);R('#c84a3a',x+20,y-1,4,12);R('#e86a5a',x+20,y-1,4,1);R('#7a2a22',x+23,y,1,11)}
 else if(p=='s_wood'){for(let i=0;i<24;i++)R(i%5==2?W[0]:W[1],x+i,y+Math.floor(i/8),1,9+Math.floor(i/8));R(W[2],x,y,24,1);R('#2a1a10',x+23,y+2,2,10)}
 else if(p=='s_crane'){box(x,y,22,10,F);R(F[0],x+4,y+3,6,4);R(F[0],x+12,y+3,6,4);R(M[0],x+2,y+10,4,2);R('#1d1714',x+21,y-1,3,12)}
 else if(p=='s_prec'){box(x,y,26,11,F);box(x+6,y-4,14,4,F);R(M[2],x+8,y-4,2,4);R(M[2],x+16,y-4,2,4);R(F[0],x+8,y+11,10,3);R('#1d1714',x+25,y-1,3,13)}
 else if(p=='s_brace'){R(M[1],x,y+3,10,3);box(x+10,y,10,9,['#2a2a2e','#3a3a40','#55555c']);R(M[0],x+12,y+3,6,1);R(M[0],x+12,y+5,6,1)}
 else if(p=='s_bull'){/* bullpup: a short butt with a cheek riser */box(x,y-1,16,12,F);box(x+2,y-4,10,3,F);R('#1d1714',x+15,y-1,3,13);R(M[2],x+4,y+4,6,2)}}

/* flashlights on the gun light the way at night (beam); lasers do not */
if(P_BY.s_strobe)P_BY.s_strobe[5]={night:1,acc:2,beam:290,strobe:1};if(P_BY.sd_combo)P_BY.sd_combo[5]={acc:8,night:1,beam:250};
if(typeof myBeams=='function'){const _mb=myBeams;myBeams=function(){return _mb.apply(this,arguments).filter(b=>{const q=P_BY[b.k];return!q||q[2]!='light'||!!q[5].beam})}}
