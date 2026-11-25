/* PROJECT LEGACY — sample: mine extras.
   · Mine map on the minimap — only when the minimap is on (satellite antenna or watchtower Lv1). Shows what you have seen:
     tunnels, rock, ore, nest walls, ladders, holes, the far exit; tap it for the whole floor.
   · The mine resets every 7 waves: rock grows back, new ore, nests return.
   · Dirt and stone you break are thrown away (ore is kept); a switch keeps them if you want cement.
   Loaded after hive_next.js. */
'use strict';
/* ---------- map ---------- */
const mSeen=lv=>{const M=MINE0();M.seen=M.seen||{};return M.seen[lv]=M.seen[lv]||{}};
let MIDX=null,MIDW=null;
function mIndex(){if(MIDW===W0&&MIDX)return MIDX;MIDX=new Map();for(const o of W0.objs)if(o.t=='mtile')MIDX.set(o.mc+','+o.mr,o);MIDW=W0;return MIDX}
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!S||!DUN||DUN.sh!='mine')return;const R0=MREG(),p=S.p,c=(p.x-R0.x0)/TS|0,r=(p.y-8-R0.y0)/TS|0,sn=mSeen(mLv());for(let j=-5;j<=5;j++)for(let i=-5;i<=5;i++)if(i*i+j*j<=30)sn[(c+i)+','+(r+j)]=1}}
const mmOn=()=>{const p=S.p;return has(p,'antenna')||S.base.lv.tower>=1};
{const _mm=mm2;mm2=function(){if(!S||!DUN||DUN.sh!='mine')return _mm();const el=$('mmw');if(!mmOn()){el.style.display='none';return}el.style.display='';
  const cv=$('mm2'),x=cv.getContext('2d'),W2=cv.width,R0=MREG(),lv=mLv(),sn=mSeen(lv),idx=mIndex(),p=S.p,pc=(p.x-R0.x0)/TS,pr=(p.y-8-R0.y0)/TS,s=MMBIG?W2/R0.cols:3,ox=MMBIG?0:W2/2-pc*s,oy=MMBIG?(W2-R0.rows*s)/2:W2/2-pr*s;
  x.fillStyle='#050608';x.fillRect(0,0,W2,W2);
  for(const k in sn){const[c,r]=k.split(',').map(Number);if(c<0||r<0||c>=R0.cols||r>=R0.rows)continue;const X=ox+c*s,Y=oy+r*s;if(X<-s||Y<-s||X>W2||Y>W2)continue;const o=idx.get(k);
   x.fillStyle=!o||o.dug||!W0.objs.includes(o)?'#7a6a52':ORE_BY[o.m]?ORE_BY[o.m][3]:FLC&&FLC[o.m]?FLC[o.m][0]:o.m=='dirt'?'#3a2a1e':o.m=='gasr'?'#3a5a2a':'#2a2826';x.fillRect(X,Y,Math.ceil(s),Math.ceil(s))}
  const dot=(c,r,col,sz)=>{x.fillStyle=col;x.fillRect(ox+c*s+s/2-sz/2,oy+r*s+s/2-sz/2,sz,sz)},L=mUp(lv),M=MINE0(),dn=(M.down||{})[lv];
  if(L)dot(L[0],L[1],'#ffd36a',4);if(dn)dot(dn[0],dn[1],'#ffffff',4);if(lv==1){const EX=mExit();if(sn[EX.join(',')]||MMBIG)dot(EX[0],EX[1],'#7fd07f',5)}
  if(typeof HCFG!='undefined'&&HCFG[lv]){const h=HV(lv),seen=Object.keys(sn).some(k=>{const[c,r]=k.split(',').map(Number);return hvE(c,r,lv)<2});if(seen){x.strokeStyle=HVS(lv).dead?'#8a7a6a':'rgb('+HCFG[lv].light+')';x.lineWidth=1.5;x.beginPath();x.ellipse(ox+(h.c+.5)*s,oy+(h.r+.5)*s,h.rx*s,h.ry*s,0,0,6.28);x.stroke()}}
  if(S.base.lv.tower>=2||has(p,'antenna')){x.fillStyle='#f55';for(const z of Z)if(sn[((z.x-R0.x0)/TS|0)+','+((z.y-8-R0.y0)/TS|0)])x.fillRect(ox+(z.x-R0.x0)/TS*s-1,oy+(z.y-8-R0.y0)/TS*s-1,2,2)}
  x.fillStyle='#fff';x.fillRect(ox+pc*s-2,oy+pr*s-2,4,4);x.fillStyle='#ffffffaa';x.fillRect(ox+pc*s+(p.fx||0)*5-1,oy+pr*s+(p.fy||0)*5-1,2,2);
  x.font='600 9px system-ui';x.fillStyle='#ffd36a';x.textAlign='left';x.fillText(lv+'층',3,10)}}
/* ---------- reset every 7 waves ---------- */
const MRESET=7;
const wavesToReset=()=>{const w=S.wv|0;return MRESET-(w%MRESET)};
function mineReset(){const M=MINE0();M.seed=1+(Math.random()*9999|0);M.dug={};M.dugF={};M.down={};M.seen={};for(const k of['hive','hive2','hive3'])M[k]={dead:0,looted:0};M.resetN=(M.resetN|0)+1;M.resetPend=0;MIDX=null}
{const _w=wave;wave=function(n){_w(n);if(n>0&&n%MRESET==0){const M=MINE0();if(DUN&&DUN.sh=='mine'){M.resetPend=1;msg('⛏ 광산이 흔들려요… 나가면 광산이 다시 채워져요 ('+MRESET+'웨이브마다)')}else{mineReset();msg('⛏ '+MRESET+'번째 웨이브 · 광산이 무너지고 다시 채워졌어요 · 새 광맥 · 둥지가 돌아왔어요')}}}}
{const _de=dunExit;dunExit=function(){const r=_de.apply(this,arguments);const M=S&&S.base&&S.base.mine;if(M&&M.resetPend){mineReset();msg('⛏ 광산이 무너지고 다시 채워졌어요 · 새 광맥 · 둥지가 돌아왔어요')}return r}}
{const _c=dmCtx;dmCtx=function(){const B=_c();for(const q of B)if(q.t=='⛏ 광산으로 내려가기')q.t='⛏ 광산으로 내려가기 · 리셋까지 '+wavesToReset()+'웨이브';
  if(DUN&&DUN.sh=='mine')B.push({t:'🪨 흙 · 돌: '+(S.mKeep?'챙기기':'버리기')+' (눌러서 바꾸기)',f:()=>{S.mKeep=!S.mKeep;msg(S.mKeep?'🪨 흙 · 돌도 가방에 챙겨요 (시멘트 재료)':'🪨 흙 · 돌은 버리고 광석만 챙겨요')}});return B}}
/* ---------- dirt and stone are thrown away unless kept ---------- */
let MDIG=false;
{const _dd=digDone;digDone=function(o){o.dug=1;MDIG=true;try{return _dd(o)}finally{MDIG=false}}}
{const _ia=invAdd;invAdd=function(p,id,n){if(MDIG&&!S.mKeep&&(id=='dirt'||id=='stone'))return;return _ia(p,id,n)}}
{const _f=s3Float;s3Float=function(x,y,t,c){if(MDIG&&!S.mKeep&&typeof t=='string'){t=t.replace(/\+\d+ (흙|돌)\s?/g,'').trim();if(!t){S.mdeb&&mDebris(x,y+6,4,'#8a7a6a',0,0);return}}return _f(x,y,t,c)}}
