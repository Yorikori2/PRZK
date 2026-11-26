/* PROJECT LEGACY — sample: tap the minimap → a big map of the area around you (the blocks that are loaded):
   roads, every building in its colour with its name and danger stars, the base, zombies (with the antenna /
   radio tower 2), the survivor signal, subway stations, your position and facing. Zoom with ＋ / －, close ✕.
   In the mine the minimap keeps its old tap (zoom). Loaded after metro_next.js. */
'use strict';
let BMZ=2,BMRAF=0;
function bmOpen(){if(!S||!S.p||!run)return;let el=$('bmap');if(el)el.remove();PAUSE=true;
 document.body.insertAdjacentHTML('beforeend','<div id="bmap"><div class="bmT"><b>🗺 지도</b><small id="bmS"></small><span class="bmZ"><button data-z="-1">－</button><button data-z="1">＋</button></span><button id="bmX">✕</button></div><canvas id="bmC"></canvas><div class="bmL" id="bmL"></div></div>');
 el=$('bmap');el.addEventListener('pointerdown',e=>e.stopPropagation());$('bmX').onclick=bmClose;el.querySelectorAll('[data-z]').forEach(b=>b.onclick=()=>{BMZ=Math.max(1,Math.min(3,BMZ+ +b.dataset.z))});
 const L=new Set();W0.b.forEach(b=>{if(b.kind&&KNAME[b.kind])L.add(b.kind)});$('bmL').innerHTML=[...L].map(k=>'<span><i style="background:'+(KCOL[k]||'#888')+'"></i>'+KNAME[k]+'</span>').join('')+'<span><i style="background:#fff;border-radius:50%"></i>나</span><span><i style="background:#ff4a4a;border-radius:50%"></i>좀비</span><span><i style="background:#ffd36a"></i>생존자 신호</span>';
 const loop=()=>{if(!$('bmap'))return;bmDraw();BMRAF=requestAnimationFrame(loop)};loop()}
function bmClose(){cancelAnimationFrame(BMRAF);const el=$('bmap');if(el)el.remove();PAUSE=false}
function bmDraw(){const c=$('bmC');if(!c)return;const dpr=Math.min(2,devicePixelRatio||1),cw=c.clientWidth,ch=c.clientHeight;if(c.width!=cw*dpr||c.height!=ch*dpr){c.width=cw*dpr;c.height=ch*dpr}const x=c.getContext('2d');x.setTransform(dpr,0,0,dpr,0,0);
 const p=S.p,fit=Math.min(cw/WW,ch/WH),k=fit*BMZ,cx=BMZ==1?WW/2:Math.max(cw/2/k,Math.min(WW-cw/2/k,p.x)),cy=BMZ==1?WH/2:Math.max(ch/2/k,Math.min(WH-ch/2/k,p.y)),X=v=>cw/2+(v-cx)*k,Y=v=>ch/2+(v-cy)*k;
 x.fillStyle='#0b0c0e';x.fillRect(0,0,cw,ch);x.fillStyle='#2f4a2a';x.fillRect(X(0),Y(0),WW*k,WH*k);
 /* roads */x.fillStyle='#4a4d52';for(let i=0;i<=NBX;i++)x.fillRect(X(i*(BW+RD)),Y(0),RD*k,WH*k);for(let i=0;i<=NBY;i++)x.fillRect(X(0),Y(i*(BH+RD)),WW*k,RD*k);
 x.strokeStyle='#d9c35a66';x.setLineDash([6,6]);x.lineWidth=1;for(let i=0;i<=NBX;i++){x.beginPath();x.moveTo(X(i*(BW+RD)+RD/2),Y(0));x.lineTo(X(i*(BW+RD)+RD/2),Y(WH));x.stroke()}for(let i=0;i<=NBY;i++){x.beginPath();x.moveTo(X(0),Y(i*(BH+RD)+RD/2));x.lineTo(X(WW),Y(i*(BH+RD)+RD/2));x.stroke()}x.setLineDash([]);
 /* buildings */for(const r of W0.roofs){const b=W0.b[r.bi];if(!b)continue;x.fillStyle=KCOL[b.kind]||'#8a8a96';x.globalAlpha=.85;x.fillRect(X(r.x),Y(r.y),r.w*k,r.h*k);x.globalAlpha=1;x.strokeStyle='#00000088';x.strokeRect(X(r.x)+.5,Y(r.y)+.5,r.w*k-1,r.h*k-1)}
 /* base */if(typeof BL!='undefined'&&W0.base){x.strokeStyle='#e6b800';x.lineWidth=2;x.strokeRect(X(BL.ox+BL.x0),Y(BL.oy+BL.y0),(BL.x1-BL.x0)*k,(BL.y1-BL.y0)*k)}
 /* block names */x.textAlign='center';const FNT='bold '+(BMZ==1?10:BMZ==2?13:15)+'px sans-serif';x.font=FNT;const seen=new Set();
 for(const b of W0.b){if(!b.gk||seen.has(b.gk)||!KNAME[b.kind])continue;seen.add(b.gk);const two=b.kind=='hosp'||b.kind=='mil',tx=X(b.ox+(two?BW+RD/2:BW/2)),ty=Y(b.oy+BH/2),t=(b.kind=='base'?'🏠 ':'')+KNAME[b.kind]+(TIER[b.kind]&&BMZ>1?' '+'★'.repeat(Math.min(5,TIER[b.kind])):'');
  x.lineWidth=3;x.strokeStyle='#000c';x.strokeText(t,tx,ty);x.fillStyle='#fff';x.fillText(t,tx,ty);if(BMZ>1){x.font='11px sans-serif';const zt='('+b.gx+', '+b.gy+') · '+zoneOf(b.gx,b.gy)+'구역';x.strokeText(zt,tx,ty+14);x.fillStyle='#cfd';x.fillText(zt,tx,ty+14);x.font=FNT}}
 /* subway tunnel mouths */for(const o of W0.objs)if(o.t=='tmouth'){x.fillStyle='#3f9a5a';x.fillRect(X(o.x)-3,Y(o.y)-3,o.w*k+6,o.h*k+6);x.fillStyle='#fff';x.font='bold 11px sans-serif';x.fillText('🚇',X(o.x+o.w/2),Y(o.y)-6)}
 /* zombies (same rule as the minimap) */if(S.base.lv.tower>=2||has(p,'antenna')){x.fillStyle='#ff4a4a';for(const z of Z)if(!z.npc&&z.hp>0)x.fillRect(X(z.x)-1.5,Y(z.y)-1.5,3,3)}
 (S.pois||[]).forEach(q=>{x.fillStyle=q.k=='drop'?'#4af':q.k=='zone'?'#f44':'#fa0';x.fillRect(X(q.x)-3,Y(q.y)-3,6,6)});
 /* survivor signal */const s=S.inf&&S.inf.sos;if(s&&!s.done){const[ox,oy]=bo(s.gx-OGX,s.gy-OGY),tx=X(ox+BW/2),ty=Y(oy+BH/2),bl=Math.sin(performance.now()/200)>0;
  if(tx>0&&tx<cw&&ty>0&&ty<ch){x.strokeStyle='#ffd36a';x.lineWidth=3;x.beginPath();x.arc(tx,ty,(bl?14:18),0,7);x.stroke();x.fillStyle='#ffd36a';x.font='bold 12px sans-serif';x.fillText('📻 '+s.nm,tx,ty-24)}
  else{const a=Math.atan2(ty-ch/2,tx-cw/2),r=Math.min(cw,ch)/2-22,ax=cw/2+Math.cos(a)*r,ay=ch/2+Math.sin(a)*r;x.save();x.translate(ax,ay);x.rotate(a);x.fillStyle='#ffd36a';x.beginPath();x.moveTo(14,0);x.lineTo(-8,-9);x.lineTo(-8,9);x.closePath();x.fill();x.restore();x.fillStyle='#ffd36a';x.font='bold 11px sans-serif';x.fillText('📻 '+s.nm+' ('+s.gx+', '+s.gy+')',ax,ay+22)}}
 /* you */const px=X(p.x),py=Y(p.y),a=Math.atan2(p.fy||0,p.fx||1);x.save();x.translate(px,py);x.rotate(a);x.fillStyle='#fff';x.strokeStyle='#000';x.lineWidth=2;x.beginPath();x.moveTo(9,0);x.lineTo(-6,-6);x.lineTo(-3,0);x.lineTo(-6,6);x.closePath();x.stroke();x.fill();x.restore();
 const[gx,gy]=gOf(p.x,p.y);$('bmS').textContent='블록 ('+gx+', '+gy+') · '+zoneOf(gx,gy)+'구역 · 확대 ×'+BMZ}
/* tap the minimap → big map (outside the mine) */
document.addEventListener('pointerdown',e=>{const w=$('mmw');if(!w||!w.contains(e.target))return;if(typeof DUN!='undefined'&&DUN&&DUN.sh=='mine')return;e.preventDefault();e.stopImmediatePropagation();bmOpen()},true);
/* the minimap knows the new buildings' colours */
{const _mb=mmBuild;mmBuild=function(){const c=_mb.apply(this,arguments),m=c.getContext('2d');W0.roofs.forEach(r=>{const b=W0.b[r.bi];if(b&&['pharm','gunshop','garage','bank','hosp','mall','park2','subway','prison','radio'].includes(b.kind)){m.fillStyle=KCOL[b.kind]||'#8a8a96';m.fillRect(r.x*MK,r.y*MK,r.w*MK,r.h*MK)}});return c}}
document.head.insertAdjacentHTML('beforeend',`<style>#bmap{position:fixed;inset:0;z-index:40;background:#000d;display:flex;flex-direction:column;padding:calc(env(safe-area-inset-top,0px) + 8px) 8px calc(env(safe-area-inset-bottom,0px) + 8px)}
#bmap .bmT{display:flex;align-items:center;gap:8px;padding:4px 4px 8px}#bmap .bmT b{font-size:16px}#bmap .bmT small{flex:1;color:#aaa;font-size:11.5px}#bmap button{min-width:40px;height:36px;padding:0 10px;border-radius:10px;font-size:16px}
#bmap .bmZ{display:flex;gap:4px}#bmC{flex:1;width:100%;min-height:0;border-radius:12px;border:1px solid #ffffff22;touch-action:none}#bmap .bmL{display:flex;flex-wrap:wrap;gap:4px 10px;font-size:11px;padding:8px 4px 0;color:#ddd}
#bmap .bmL i{display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:4px;vertical-align:-1px}</style>`);
