/* PROJECT LEGACY — sample: the 강화 · 룬 작업대 — a station of its own for enhancing and options.
   Built from the 제작소 window like the other four stations, it stands at the base as pixel art
   (anvil, grinding wheel throwing sparks, a glowing rune circle, a purple crystal). Walk up to it for
   [🔨 무기 강화] [🛡 방어구 강화] [🔮 룬 · 옵션]. Loaded after runes_next.js and mine_next.js. */
'use strict';
if(!FST.some(f=>f[0]=='enhb'))FST.push(['enhb','⑤ 강화 · 룬 작업대','💠',{scrap:20,elec:6,steel:4,enh2:2}]);
FRC.enhb=[];FPOS.enhb=[412,132,62,34];
FDESC.enhb='무기 · 방어구 강화와 옵션의 룬을 쓰는 작업대 · 모루 · 숫돌 · 룬 마법진';
P('st_enhb','강화 · 룬 작업대',null,o=>{const{x,y,w,h}=o,t=performance.now()/1000,K='#1d1714';
 /* table */R(K,x,y-12,w,h+12);R('#5a4a6a',x+1,y-11,w-2,7);R('#3e3250',x+1,y-4,w-2,h+2);R('#2a2238',x+4,y+h-8,6,8);R('#2a2238',x+w-10,y+h-8,6,8);
 /* rune circle on the table */const a=.55+.35*Math.sin(t*2.5);g.globalAlpha=a;R('#c08af0',x+22,y-12,18,1);R('#c08af0',x+22,y-6,18,1);R('#c08af0',x+21,y-11,1,5);R('#c08af0',x+40,y-11,1,5);R('#e8d0ff',x+30,y-10,2,3);R('#e8d0ff',x+26,y-9,1,1);R('#e8d0ff',x+35,y-9,1,1);g.globalAlpha=1;
 /* anvil (left) */R(K,x+2,y-28,22,9);R('#5a6068',x+3,y-27,20,7);R('#8a9096',x+3,y-27,20,2);R(K,x+8,y-20,10,8);R('#4a5058',x+9,y-19,8,7);R('#8a9096',x-2,y-26,6,3);
 /* hammer resting on the anvil */R('#6b4426',x+14,y-36,2,10);R(K,x+10,y-38,10,4);R('#9aa0a6',x+11,y-37,8,2);
 /* grinding wheel (right), spinning, sparks */R(K,x+w-18,y-40,16,16);R('#7a7e84',x+w-17,y-39,14,14);const sp=(t*12|0)%4;R('#5a5f66',x+w-11+[0,3,0,-3][sp],y-33+[-3,0,3,0][sp],2,2);R('#4a5058',x+w-11,y-33,2,2);R(K,x+w-11,y-24,2,12);
 for(let i=0;i<4;i++){const k=((t*3+i*.27)%1);g.globalAlpha=1-k;R(i%2?'#ffd36a':'#fff6c0',x+w-20-k*16,y-30+k*10-i,1,1);g.globalAlpha=1}
 /* crystal on a stand (middle back) */const c=Math.sin(t*1.6)*1.5;R(K,x+29,y-24,6,6);R('#4a3a5a',x+30,y-23,4,5);R(K,x+28,y-40+c,8,14);R('#8a4ab0',x+29,y-39+c,6,12);R('#c08af0',x+29,y-39+c,2,8);R('#fff',x+30,y-37+c,1,2);
 g.save();g.globalCompositeOperation='lighter';g.globalAlpha=.18+.1*Math.sin(t*2);g.fillStyle='#c08af0';g.beginPath();g.arc(x+32,y-32+c,12,0,Math.PI*2);g.fill();g.restore()},true);
/* walk up to it */
{const _c=dmCtx;dmCtx=function(){const B=_c();if(DUN||!S||!S.base||!inBase(S.p.x,S.p.y)||!fBuilt('enhb'))return B;const L=FPOS.enhb,p=S.p;
  if(Math.hypot(p.x-(BL.ox+L[0]+L[2]/2),p.y-(BL.oy+L[1]+L[3]/2))<75){for(let i=B.length-1;i>=0;i--)if(/강화 · 룬 작업대/.test(B[i].t))B.splice(i,1);B.unshift({t:'🔮 룬 · 옵션',f:()=>openRunes()},{t:'🛡 방어구 강화',f:()=>openAEnh()},{t:'🔨 무기 강화',f:()=>openEnh(),big:1})}return B}}
/* in the 제작소 window, the built bench offers the three windows instead of recipes */
{const _of=openForge;openForge=function(tab){_of(tab);if(FTAB!='enhb'||!fBuilt('enhb'))return;const b=$('bm'),pic=b.querySelector('.fpic');if(pic)pic.insertAdjacentHTML('afterend','<div class="ebB"><button onclick="openEnh()">🔨 무기 강화</button><button onclick="openAEnh()">🛡 방어구 강화</button><button onclick="openRunes()">🔮 룬 · 옵션</button></div>')}}
document.head.insertAdjacentHTML('beforeend','<style>#bm .ebB{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin:6px 0}#bm .ebB button{padding:10px 4px;font-size:13px}</style>');
