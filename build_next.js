/* PROJECT LEGACY — build mode.
   Whatever you place (a decoration, a storage box, the garage) is carried on its own: drag anywhere on the screen to move it,
   or tap a spot to send it there. The view follows the piece, not the player, and cannot leave the base (or the outpost
   block for an outpost box). Everything snaps to one 16 px grid laid over the whole base.
   Loaded after stack_next.js. Engine hook: camFocus (guarded with typeof). */
'use strict';
const BGRID=16;
let BLD=null;/* {kind,x,y,b:{x0,y0,x1,y1,ox,oy}} */
function bldBounds(kind){if(kind=='box'&&typeof BPL!='undefined'&&BPL=='op'){const h=opHere(),[ox,oy]=bo(h.gx-OGX,h.gy-OGY);return{x0:ox+8,y0:oy+8,x1:ox+BW-8,y1:oy+BH-8,ox,oy}}
 return{x0:BL.ox+BL.x0,y0:BL.oy+BL.y0,x1:BL.ox+BL.x1,y1:BL.oy+BL.y1,ox:BL.ox,oy:BL.oy}}
const bldKind=()=>typeof DPL!='undefined'&&DPL?'deco':typeof BPL!='undefined'&&BPL?'box':typeof GPL!='undefined'&&GPL?'gar':null;
function bldSpot(){const b=BLD.b;return[b.ox+Math.round((BLD.x-b.ox)/BGRID)*BGRID,b.oy+Math.round((BLD.y-b.oy)/BGRID)*BGRID]}
function bldClamp(){const b=BLD.b;BLD.x=Math.max(b.x0,Math.min(b.x1,BLD.x));BLD.y=Math.max(b.y0,Math.min(b.y1,BLD.y))}
/* the view follows the piece but its edges stay inside the base */
function camFocus(){if(!BLD)return null;const b=BLD.b,vw=buf.width,vh=buf.height,cl=(v,a,z,s)=>z-a<=s?(a+z)/2:Math.max(a+s/2,Math.min(z-s/2,v));return{x:cl(BLD.x,b.x0-24,b.x1+24,vw),y:cl(BLD.y,b.y0-24,b.y1+24,vh)+12}}
/* the place functions of each module follow the carried piece */
{const _d=dSpot;dSpot=function(){return BLD?bldSpot():_d()}}
{const _b=bxSpot;bxSpot=function(){return BLD?bldSpot():_b()}}
{const _g=gSpot;gSpot=function(){return BLD?bldSpot():_g()}}
function bldName(){const k=BLD&&BLD.kind;if(k=='deco')return DECO[DPL.t][0]+' '+DECO[DPL.t][1]+(DPL.move?' 옮기기':'');if(k=='box')return'🗄 보관함';if(k=='gar')return'🏗 차고';return''}
function bldBad(){const k=BLD&&BLD.kind;try{return k=='deco'?dOk():k=='box'?bxOk():k=='gar'?gOk():''}catch(e){return''}}
function bldDo(){const k=BLD&&BLD.kind;if(k=='deco')dDo();else if(k=='box')bxDo();else if(k=='gar')gDo();bldSync()}
function bldCancel(){if(typeof DPL!='undefined')DPL=null;if(typeof BPL!='undefined')BPL=null;if(typeof GPL!='undefined')GPL=false;msg('✖ 설치 취소');bldSync()}
/* ---------- the screen while building ---------- */
document.body.insertAdjacentHTML('beforeend','<div id="bld"><div class="bT"><b id="bldN"></b><span id="bldS"></span></div><div class="bH">손가락으로 끌어서 옮기기 · 원하는 곳을 톡 누르면 그리로 · 16칸 격자에 맞춰져요</div><div class="bB"><button id="bldC">✖ 취소</button><button id="bldR">↻ 돌리기</button><button id="bldO" class="go">✅ 설치</button></div></div>');
document.head.insertAdjacentHTML('beforeend',`<style>
#bld{position:fixed;inset:0;z-index:8;display:none;touch-action:none;user-select:none;-webkit-user-select:none}
#bld .bT{position:absolute;left:50%;transform:translateX(-50%);top:calc(env(safe-area-inset-top,0px) + 168px);display:flex;flex-direction:column;align-items:center;gap:2px;padding:7px 14px;border-radius:12px;background:#0d1114e6;border:1px solid #ffffff22;font-size:13px;color:#e8e2d6;pointer-events:none;max-width:92vw;text-align:center}
#bld .bT span{font-size:12px}#bld .bH{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(env(safe-area-inset-bottom,0px) + 86px);font-size:11.5px;color:#e8e2d6cc;background:#0d1114b0;padding:4px 10px;border-radius:99px;pointer-events:none;white-space:nowrap;max-width:94vw;overflow:hidden;text-overflow:ellipsis}
#bld .bB{position:absolute;left:0;right:0;bottom:calc(env(safe-area-inset-bottom,0px) + 18px);display:flex;justify-content:center;gap:12px}
#bld .bB button{padding:12px 22px;font-size:15px;border-radius:14px;background:#0d1114ee;border:1px solid #ffffff33;color:#fff}#bld .bB button.go{border-color:#7fd07f;color:#bff0bf}#bld .bB button.go.no{opacity:.45;border-color:#ff8a7a;color:#ffb0a4}
body.bld #iaHint,body.bld #act,body.bld #atk{visibility:hidden}</style>`);
function bldSync(){const k=bldKind(),el=$('bld');if(k&&!BLD){const p=S.p,f=Math.hypot(p.fx||0,p.fy||0)||1;BLD={kind:k,x:p.x+(p.fx||0)/f*50,y:p.y+(p.fy||1)/f*50,b:bldBounds(k)};bldClamp();el.style.display='block';document.body.classList.add('bld')}
 else if(!k&&BLD){BLD=null;el.style.display='none';document.body.classList.remove('bld')}else if(k&&BLD&&BLD.kind!=k){BLD.kind=k;BLD.b=bldBounds(k)}
 if(BLD){const bad=bldBad();$('bldN').textContent=bldName();$('bldS').innerHTML=bad?'<b style="color:#ff9a8a">'+bad+'</b>':'<b style="color:#9fe09f">여기에 놓을 수 있어요</b>';$('bldO').classList.toggle('no',!!bad);$('bldR').style.display=BLD.kind=='deco'&&DROT.has(DPL.t)?'':'none'}}
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(S)bldSync()}}
{let d=null;const el=$('bld');
 el.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;e.preventDefault();d={x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY,m:0,id:e.pointerId};try{el.setPointerCapture(e.pointerId)}catch(_){}});
 el.addEventListener('pointermove',e=>{if(!d||!BLD||e.pointerId!==d.id)return;const dx=e.clientX-d.x,dy=e.clientY-d.y;d.x=e.clientX;d.y=e.clientY;d.m+=Math.abs(dx)+Math.abs(dy);BLD.x+=dx/zoom;BLD.y+=dy/zoom;bldClamp()});
 el.addEventListener('pointerup',e=>{if(!d||!BLD)return;if(d.m<8){BLD.x=camX+e.clientX/zoom;BLD.y=camY+e.clientY/zoom;bldClamp()}d=null});
 $('bldO').addEventListener('click',e=>{e.stopPropagation();bldDo()});$('bldC').addEventListener('click',e=>{e.stopPropagation();bldCancel()});$('bldR').addEventListener('click',e=>{e.stopPropagation();if(BLD&&BLD.kind=='deco'&&DROT.has(DPL.t)){DPL.r=DPL.r?0:1;msg('↻ '+DECO[DPL.t][1]+(DPL.r?' 세로':' 가로'))}})}
/* the grid over the whole place, and the edge of where the view may go */
if(typeof OVL!='undefined')OVL.unshift((g,sx,sy,k)=>{if(!BLD)return;const b=BLD.b;g.save();g.strokeStyle='#ffffff1c';g.lineWidth=1;const x0=b.ox+Math.ceil((b.x0-b.ox)/BGRID)*BGRID,y0=b.oy+Math.ceil((b.y0-b.oy)/BGRID)*BGRID;
 g.beginPath();for(let x=x0;x<=b.x1;x+=BGRID){g.moveTo(sx(x)+.5,sy(b.y0));g.lineTo(sx(x)+.5,sy(b.y1))}for(let y=y0;y<=b.y1;y+=BGRID){g.moveTo(sx(b.x0),sy(y)+.5);g.lineTo(sx(b.x1),sy(y)+.5)}g.stroke();
 g.strokeStyle='#ffd36a66';g.lineWidth=2;g.setLineDash([8,6]);g.strokeRect(sx(b.x0),sy(b.y0),(b.x1-b.x0)*k,(b.y1-b.y0)*k);g.restore()});
/* the real piece is drawn where it will go (see-through), not only a box */
{const _dw=draw;draw=function(){const r=_dw.apply(this,arguments);try{if(BLD&&S){const c=ctx,k=zoom*dpr,[x,y]=bldSpot(),bad=!!bldBad(),o=g;c.save();c.setTransform(k,0,0,k,-camX*k,-camY*k);c.imageSmoothingEnabled=false;c.globalAlpha=bad?.45:.85;g=c;
  if(BLD.kind=='deco'){const D=DECO[DPL.t];if(DPL.r&&DROT.has(DPL.t))dDrawRot(DPL.t,x,y,{v:0});else dArt[DPL.t](x-D[4]/2,y-D[5]/2,D[4],D[5],{v:0})}
  else if(BLD.kind=='box'&&D.sbox)D.sbox({x:x-14,y:y-9,w:28,h:18,lv:1});
  else if(BLD.kind=='gar'){D.garage({x:x-GW/2,y:y-GH/2,w:GW,h:GH,lv:1});D.garwall({x:x-GW/2,y:y-GH/2-6,w:GW,h:10})}
  g=o;c.restore()}}catch(e){}return r}}
document.head.insertAdjacentHTML('beforeend','<style>body.bld #wc2,body.bld #tr,body.bld #qk,body.bld #sd,body.bld #tbH,body.bld #rqHud,body.bld #vHud,body.bld #ms,body.bld .msg{visibility:hidden!important}</style>');
