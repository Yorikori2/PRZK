/* PROJECT LEGACY — shield durability under the player's feet.
   The chip in the corner is gone: a thin bar sits right under the character (drawn sharp, follows the player),
   so it never covers any button or panel. Colour: blue → yellow → red · a crack sign when broken · the number shows when low or just hit.
   Loaded after mast_next.js. */
'use strict';
let SBAR={v:-1,t:0};
document.head.insertAdjacentHTML('beforeend','<style>#shdHud{display:none!important}</style>');
{const _dw=draw;draw=function(){const r=_dw.apply(this,arguments);try{const p=S&&S.p,id=p&&typeof shdOn=='function'&&shdOn(p);if(!id||S.dr||typeof DUN!='undefined'&&DUN&&false)return r;
  const mx=SHDHP[id]||100,hp=Math.max(0,shdHp(id)),f=hp/mx;if(hp!==SBAR.v){if(SBAR.v>=0&&hp<SBAR.v)SBAR.t=2;SBAR.v=hp}if(SBAR.t>0)SBAR.t-=1/60;
  const c=ctx,k=zoom*dpr,X=(p.x-camX)*k,Y=(p.y-camY)*k+7*k,w=Math.round(30*k),h=Math.max(3,Math.round(2.2*k));c.save();c.setTransform(1,0,0,1,0,0);
  c.fillStyle='#000000aa';c.fillRect(Math.round(X-w/2)-1,Math.round(Y)-1,w+2,h+2);c.fillStyle=f<=0?'#555':f>.5?'#7fc8ff':f>.25?'#ffd36a':'#ff6a5a';c.fillRect(Math.round(X-w/2),Math.round(Y),Math.round(w*f),h);
  /* a tiny shield at the left end */const sx=Math.round(X-w/2-7*dpr),sy=Math.round(Y-2*dpr);c.fillStyle='#000a';c.fillRect(sx-1,sy-1,6*dpr+2,7*dpr+2);c.fillStyle=f<=0?'#777':'#c9d3dc';c.fillRect(sx,sy,6*dpr,5*dpr);c.fillRect(sx+dpr,sy+5*dpr,4*dpr,dpr);c.fillRect(sx+2*dpr,sy+6*dpr,2*dpr,dpr);
  if(f<=0||f<.3||SBAR.t>0){c.font='700 '+Math.round(10*dpr)+'px system-ui,sans-serif';c.textAlign='left';c.textBaseline='middle';const tx=f<=0?'방패 부서짐':Math.ceil(hp)+'/'+mx;c.lineWidth=3*dpr;c.strokeStyle='#000c';c.strokeText(tx,X+w/2+5*dpr,Y+h/2);c.fillStyle=f<=0?'#aaa':f>.5?'#bfe6ff':f>.25?'#ffe9a0':'#ffb0a4';c.fillText(tx,X+w/2+5*dpr,Y+h/2)}
  c.restore()}catch(e){}return r}}
