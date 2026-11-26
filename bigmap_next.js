/* PROJECT LEGACY — sample: the map.
   Tap the minimap → a full-screen map of every block you have walked through (fog elsewhere): the loaded area in
   detail, the rest block by block with names, danger stars and zone borders. Drag to move, pinch or ＋ / － to zoom,
   ◎ back to you. 📍 mark mode: tap to drop a mark (5 kinds), tap a mark to remove it; marks show on the minimap too.
   Enemies (zombies · raiders · bosses with a skull) show on the minimap and the map only with the special gear
   "전술 레이더" equipped or the base watchtower at max level. In the mine the minimap keeps its old tap.
   Loaded after metro_next.js. */
'use strict';
/* ---------- special gear: tactical radar ---------- */
if(typeof SPX!='undefined'&&!SPX.radar){SPX.radar=[3,'전술 레이더',.6,'미니맵 · 지도에 좀비 · 약탈자 · 보스(해골 마크)가 보여요'];const it=['radar','전술 레이더','e',(typeof ATIER_RAR!='undefined'?ATIER_RAR[3]:'r'),.6,'[특수 T3] 미니맵 · 지도에 좀비 · 약탈자 · 보스(해골 마크)가 보여요'];ITEMS.push(it);I_BY.radar=it;
 IC.radar=()=>{R('#2a2e33',4,6,16,12);R('#3a3f45',5,7,14,10);R('#0b1a12',6,8,12,8);R('#3f9a5a',11,11,2,2);ln(12,12,17,9,'#7fd07f');R('#7fd07f',8,13,1,1);R('#ff6a5a',15,14,1,1);R('#8a9096',10,3,4,3)}}
for(const k of['radio','mil','police'])if(GLOOT[k]&&!GLOOT[k].includes('radar'))GLOOT[k].push('radar');
const hostileVis=()=>!!(S&&S.p&&((S.p.eq&&S.p.eq.spec=='radar'&&has(S.p,'radar'))||(S.base&&S.base.lv&&S.base.lv.tower>=3)));
const isBoss=z=>!!(z.tboss||z.b||(typeof BOSSZ!='undefined'&&BOSSZ.includes(z.look))||z.hive=='heart'||z.hive=='queen');
/* ---------- marks ---------- */
const MKI=[['📍','#ff6a5a','표시'],['⭐','#ffd36a','중요'],['⚠','#ff9a3a','위험'],['💰','#7fd07f','파밍'],['🏠','#7fd0ff','쉼터']];
const MARKS=()=>{S.inf.marks=S.inf.marks||[];return S.inf.marks};
const mkPos=m=>{const[ox,oy]=bo(m.gx-OGX,m.gy-OGY);return[ox+m.lx,oy+m.ly]};
/* ---------- the map ---------- */
let BM=null,BMRAF=0;
function bmOpen(){if(!S||!S.p||!run)return;let el=$('bmap');if(el)el.remove();PAUSE=true;S.inf.seen=S.inf.seen||{};try{xpSee&&xpSee()}catch(e){}
 BM={vx:S.p.x,vy:S.p.y,k:0,mark:false,ic:0,ptr:new Map(),moved:0,kc:new Map()};
 document.body.insertAdjacentHTML('beforeend','<div id="bmap"><div class="bmT"><b>🗺 지도</b><small id="bmS"></small><button id="bmX">✕</button></div>'+
  '<div class="bmW"><canvas id="bmC"></canvas><div class="bmB"><button data-z="1">＋</button><button data-z="-1">－</button><button id="bmMe">◎</button><button id="bmM">📍</button></div><div class="bmI" id="bmI">'+MKI.map((m,i)=>'<button data-i="'+i+'">'+m[0]+'</button>').join('')+'<input id="bmN" maxlength="12" placeholder="메모 (선택 · 12자)"><small>지도를 누르면 마크 · 마크를 누르면 지우기</small></div></div>'+
  '<div class="bmL" id="bmL"></div></div>');
 el=$('bmap');el.addEventListener('pointerdown',e=>e.stopPropagation());{const ni=$('bmN');for(const ev of['keydown','keyup','keypress'])ni.addEventListener(ev,e=>e.stopPropagation())}$('bmX').onclick=bmClose;
 el.querySelectorAll('[data-z]').forEach(b=>b.onclick=()=>bmZoom(+b.dataset.z>0?1.5:1/1.5));$('bmMe').onclick=()=>{BM.vx=S.p.x;BM.vy=S.p.y};
 $('bmM').onclick=()=>{BM.mark=!BM.mark;$('bmM').classList.toggle('on',BM.mark);$('bmI').classList.toggle('on',BM.mark)};
 el.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{BM.ic=+b.dataset.i;el.querySelectorAll('[data-i]').forEach(q=>q.classList.toggle('sel',q===b))});el.querySelector('[data-i="0"]').classList.add('sel');
 const c=$('bmC');c.addEventListener('pointerdown',bmDown);c.addEventListener('pointermove',bmMove);c.addEventListener('pointerup',bmUp);c.addEventListener('pointercancel',bmUp);c.addEventListener('wheel',e=>{e.preventDefault();bmZoom(e.deltaY<0?1.2:1/1.2)},{passive:false});
 const L=new Set();for(const key in S.inf.seen){const[gx,gy]=key.split(',').map(Number);L.add(bmKind(gx,gy))}
 $('bmL').innerHTML=[...L].filter(k=>KNAME[k]&&k!='hospR'&&k!='milR').map(k=>'<span><i style="background:'+(KCOL[k]||'#888')+'"></i>'+KNAME[k]+'</span>').join('')+(hostileVis()?'<span><i style="background:#ff4a4a;border-radius:50%"></i>좀비</span><span><i style="background:#ff9a3a;border-radius:50%"></i>약탈자</span><span>💀 보스</span>':'<span class="mut">적 표시: 특수 장비 "전술 레이더" 또는 감시탑 최대 레벨</span>');
 const loop=()=>{if(!$('bmap'))return;bmDraw();BMRAF=requestAnimationFrame(loop)};loop()}
function bmClose(){cancelAnimationFrame(BMRAF);const el=$('bmap');if(el)el.remove();PAUSE=false;BM=null}
const bmKind=(gx,gy)=>{const key=gx+','+gy;let k=BM&&BM.kc.get(key);if(k==null){k=kindAt(gx,gy);if(BM)BM.kc.set(key,k)}return k};
function bmZoom(f,cx,cy){const c=$('bmC');if(!c||!BM)return;const k0=BM.k,k1=Math.max(.012,Math.min(.6,k0*f));if(cx!=null){const w=c.clientWidth,h=c.clientHeight;BM.vx+=(cx-w/2)/k0-(cx-w/2)/k1;BM.vy+=(cy-h/2)/k0-(cy-h/2)/k1}BM.k=k1}
function bmDown(e){e.preventDefault();BM.ptr.set(e.pointerId,{x:e.offsetX,y:e.offsetY,x0:e.offsetX,y0:e.offsetY});BM.moved=0;if(BM.ptr.size==2){const[a,b]=[...BM.ptr.values()];BM.pd=Math.hypot(a.x-b.x,a.y-b.y)}try{e.target.setPointerCapture(e.pointerId)}catch(_){}}
function bmMove(e){const q=BM&&BM.ptr.get(e.pointerId);if(!q)return;const dx=e.offsetX-q.x,dy=e.offsetY-q.y;q.x=e.offsetX;q.y=e.offsetY;
 if(BM.ptr.size==1){BM.vx-=dx/BM.k;BM.vy-=dy/BM.k;BM.moved+=Math.abs(dx)+Math.abs(dy)}else if(BM.ptr.size==2){const[a,b]=[...BM.ptr.values()],d=Math.hypot(a.x-b.x,a.y-b.y);if(BM.pd){bmZoom(d/BM.pd,(a.x+b.x)/2,(a.y+b.y)/2)}BM.pd=d;BM.moved+=99}}
function bmUp(e){const q=BM&&BM.ptr.get(e.pointerId);if(!q)return;BM.ptr.delete(e.pointerId);if(BM.ptr.size<2)BM.pd=0;if(BM.moved<8&&BM.ptr.size==0)bmTap(e.offsetX,e.offsetY)}
function bmTap(sx,sy){const c=$('bmC'),w=c.clientWidth,h=c.clientHeight,k=BM.k,wx=BM.vx+(sx-w/2)/k,wy=BM.vy+(sy-h/2)/k,M=MARKS();
 const hit=M.findIndex(m=>{const[x,y]=mkPos(m);return Math.hypot((x-wx)*k,(y-wy)*k)<20});
 if(hit>=0&&(BM.mark||true)){if(BM.mark){M.splice(hit,1);return}msg(MKI[M[hit].ic][0]+' '+(M[hit].nm||MKI[M[hit].ic][2])+' · 블록 ('+M[hit].gx+', '+M[hit].gy+') · 지우려면 📍 모드에서 누르기');return}
 if(!BM.mark)return;if(M.length>=40)return msg('마크는 40개까지예요');const[gx,gy]=gOf(wx,wy),[ox,oy]=bo(gx-OGX,gy-OGY);const nm=(($('bmN')||{}).value||'').trim().slice(0,12);M.push({gx,gy,lx:Math.round(wx-ox),ly:Math.round(wy-oy),ic:BM.ic,nm})}
function bmDraw(){const c=$('bmC');if(!c||!BM)return;const dpr=Math.min(2,devicePixelRatio||1),cw=c.clientWidth,ch=c.clientHeight;if(!cw||!ch)return;if(c.width!=cw*dpr|0||c.height!=ch*dpr|0){c.width=cw*dpr|0;c.height=ch*dpr|0}
 if(!BM.k)BM.k=Math.min(cw,ch)/(4*PX);const x=c.getContext('2d');x.setTransform(dpr,0,0,dpr,0,0);const k=BM.k,X=v=>cw/2+(v-BM.vx)*k,Y=v=>ch/2+(v-BM.vy)*k,p=S.p;
 x.fillStyle='#07080a';x.fillRect(0,0,cw,ch);
 /* visible block range */const[g0x,g0y]=gOf(BM.vx-cw/2/k,BM.vy-ch/2/k),[g1x,g1y]=gOf(BM.vx+cw/2/k,BM.vy+ch/2/k),sn=S.inf.seen,inWin=(gx,gy)=>gx>=OGX&&gx<OGX+NBX&&gy>=OGY&&gy<OGY+NBY;
 const big=PX*k>70,FNT='bold '+(PX*k>160?13:PX*k>90?11:9)+'px sans-serif';
 for(let gy=g0y-1;gy<=g1y+1;gy++)for(let gx=g0x-1;gx<=g1x+1;gx++){const key=gx+','+gy;if(!sn[key]&&!inWin(gx,gy))continue;const[ox,oy]=bo(gx-OGX,gy-OGY);
  x.fillStyle='#45484d';x.fillRect(X(ox-RD),Y(oy-RD),(BW+2*RD)*k+1,(BH+2*RD)*k+1);x.fillStyle='#2f4a2a';x.fillRect(X(ox),Y(oy),BW*k,BH*k);
  if(!inWin(gx,gy)){const kd=bmKind(gx,gy);if(kd=='hospR'||kd=='milR')continue;const two=kd=='hosp'||kd=='mil';x.fillStyle=KCOL[kd]||'#777';x.globalAlpha=.8;x.fillRect(X(ox+40),Y(oy+40),((two?2*BW+RD:BW)-80)*k,(BH-80)*k);x.globalAlpha=1}}
 /* the loaded area in detail */for(const r of W0.roofs){const b=W0.b[r.bi];if(!b)continue;x.fillStyle=KCOL[b.kind]||'#8a8a96';x.globalAlpha=.9;x.fillRect(X(r.x),Y(r.y),r.w*k,r.h*k);x.globalAlpha=1;if(big){x.strokeStyle='#0008';x.strokeRect(X(r.x)+.5,Y(r.y)+.5,r.w*k-1,r.h*k-1)}}
 if(typeof BL!='undefined'&&W0.base){x.strokeStyle='#e6b800';x.lineWidth=2;x.strokeRect(X(BL.ox+BL.x0),Y(BL.oy+BL.y0),(BL.x1-BL.x0)*k,(BL.y1-BL.y0)*k)}
 /* zone borders */const st=zoneStep();x.setLineDash([6,5]);x.lineWidth=2;for(let z=1;z<=40;z++){const d=z*st-(S.d=='N'?st:0);if(d<=0)continue;const[ax,ay]=bo(-d-OGX,-d-OGY),[bx,by]=bo(d+1-OGX,d+1-OGY);const L=X(ax-RD/2),T=Y(ay-RD/2),Rr=X(bx-RD/2),B=Y(by-RD/2);
  if(Rr<0||B<0||L>cw||T>ch)continue;if(L<0&&T<0&&Rr>cw&&B>ch){}x.strokeStyle=ZPEAK&&ZPEAK(z)?'#ff6a5acc':'#ff9a5a88';x.strokeRect(L,T,Rr-L,B-T);if(PX*k>25&&L>0&&T>16&&L<cw-60){x.fillStyle=x.strokeStyle;x.font='bold 11px sans-serif';x.textAlign='left';x.fillText(z+'구역',L+4,T-4)}}x.setLineDash([]);
 /* names */if(PX*k>55){x.textAlign='center';x.font=FNT;for(let gy=g0y;gy<=g1y;gy++)for(let gx=g0x;gx<=g1x;gx++){if(!sn[gx+','+gy]&&!inWin(gx,gy))continue;const kd=bmKind(gx,gy);if(!KNAME[kd]||kd=='hospR'||kd=='milR')continue;const two=kd=='hosp'||kd=='mil',[ox,oy]=bo(gx-OGX,gy-OGY),tx=X(ox+(two?BW+RD/2:BW/2)),ty=Y(oy+BH/2);
   const t=(kd=='base'?'🏠 ':'')+KNAME[kd]+(TIER[kd]&&PX*k>110?' '+'★'.repeat(Math.min(5,TIER[kd])):'');x.lineWidth=3;x.strokeStyle='#000c';x.strokeText(t,tx,ty);x.fillStyle='#fff';x.fillText(t,tx,ty);
   if(PX*k>160){x.font='10px sans-serif';const zt='('+gx+', '+gy+') · '+zoneOf(gx,gy)+'구역';x.strokeText(zt,tx,ty+14);x.fillStyle='#cfd';x.fillText(zt,tx,ty+14);x.font=FNT}}}
 /* subway mouths in view */for(const o of W0.objs)if(o.t=='tmouth'){x.fillStyle='#3f9a5a';x.fillRect(X(o.x)-3,Y(o.y)-3,Math.max(6,o.w*k+6),Math.max(6,o.h*k+6))}
 /* enemies */if(hostileVis()){for(const z of Z){if(z.npc||!(z.hp>0))continue;const zx=X(z.x),zy=Y(z.y);if(zx<-20||zy<-20||zx>cw+20||zy>ch+20)continue;
   if(isBoss(z)){const t=performance.now()/300;x.fillStyle='rgba(255,60,60,'+(.25+.15*Math.sin(t))+')';x.beginPath();x.arc(zx,zy,13,0,7);x.fill();x.font='16px sans-serif';x.textAlign='center';x.fillText('💀',zx,zy+6)}
   else if(z.raider){x.fillStyle='#ff9a3a';x.beginPath();x.moveTo(zx,zy-4);x.lineTo(zx+4,zy+3);x.lineTo(zx-4,zy+3);x.closePath();x.fill()}else{x.fillStyle='#ff4a4a';x.fillRect(zx-2,zy-2,4,4)}}}
 (S.pois||[]).forEach(q=>{x.fillStyle=q.k=='drop'?'#4af':q.k=='zone'?'#f44':'#fa0';x.fillRect(X(q.x)-3,Y(q.y)-3,6,6)});
 /* survivor signal */const s=S.inf&&S.inf.sos;if(s&&!s.done){const[ox,oy]=bo(s.gx-OGX,s.gy-OGY),tx=X(ox+BW/2),ty=Y(oy+BH/2);
  if(tx>0&&tx<cw&&ty>0&&ty<ch){x.strokeStyle='#ffd36a';x.lineWidth=3;x.beginPath();x.arc(tx,ty,14+3*Math.sin(performance.now()/200),0,7);x.stroke();x.fillStyle='#ffd36a';x.font='bold 12px sans-serif';x.textAlign='center';x.fillText('📻 '+s.nm,tx,ty-24)}
  else{const a=Math.atan2(ty-ch/2,tx-cw/2),r=Math.min(cw,ch)/2-24,ax=cw/2+Math.cos(a)*r,ay=ch/2+Math.sin(a)*r;x.save();x.translate(ax,ay);x.rotate(a);x.fillStyle='#ffd36a';x.beginPath();x.moveTo(14,0);x.lineTo(-8,-9);x.lineTo(-8,9);x.closePath();x.fill();x.restore();x.fillStyle='#ffd36a';x.font='bold 11px sans-serif';x.textAlign='center';x.fillText('📻 '+s.nm,ax,ay+22)}}
 /* subway line: stations you visited, tunnels walked (dashed) / cleared (green) */{const I=S.inf,ctr=k=>{const[gx,gy]=k.split(',').map(Number),[ox,oy]=bo(gx-OGX,gy-OGY);return[X(ox+BW-60),Y(oy+BH/2+60)]};
  for(const e in I.medge||{}){const[a2,b2]=e.split('|'),A=ctr(a2),B=ctr(b2);x.strokeStyle=I.medge[e]>=2?'#5fe08a':'#9aa0a6';x.lineWidth=I.medge[e]>=2?4:2;x.setLineDash(I.medge[e]>=2?[]:[7,6]);x.beginPath();x.moveTo(A[0],A[1]);x.lineTo(B[0],B[1]);x.stroke()}x.setLineDash([]);
  for(const k in I.mline||{}){const[sx2,sy2]=ctr(k);if(sx2<-20||sy2<-20||sx2>cw+20||sy2>ch+20)continue;x.fillStyle='#1d2a1e';x.beginPath();x.arc(sx2,sy2,10,0,7);x.fill();x.strokeStyle='#5fe08a';x.lineWidth=2;x.stroke();x.font='11px sans-serif';x.textAlign='center';x.fillText('🚇',sx2,sy2+4)}}
 /* marks */x.textAlign='center';for(const m of MARKS()){const[mx,my]=mkPos(m),sx=X(mx),sy=Y(my);if(sx<-20||sy<-20||sx>cw+20||sy>ch+20)continue;const I=MKI[m.ic]||MKI[0];x.fillStyle=I[1]+'55';x.beginPath();x.arc(sx,sy,12,0,7);x.fill();x.strokeStyle=I[1];x.lineWidth=2;x.stroke();x.font='15px sans-serif';x.fillText(I[0],sx,sy+5);if(m.nm&&PX*k>30){x.font='bold 11px sans-serif';x.lineWidth=3;x.strokeStyle='#000c';x.strokeText(m.nm,sx,sy+26);x.fillStyle='#fff';x.fillText(m.nm,sx,sy+26)}}
 /* you */const px=X(p.x),py=Y(p.y),a=Math.atan2(p.fy||0,p.fx||1);x.save();x.translate(px,py);x.rotate(a);x.fillStyle='#fff';x.strokeStyle='#000';x.lineWidth=2;x.beginPath();x.moveTo(10,0);x.lineTo(-6,-7);x.lineTo(-3,0);x.lineTo(-6,7);x.closePath();x.stroke();x.fill();x.restore();
 const[gx,gy]=gOf(p.x,p.y);$('bmS').textContent='블록 ('+gx+', '+gy+') · '+zoneOf(gx,gy)+'구역 · 지나온 블록 '+Object.keys(sn).length+'개'+(BM.mark?' · 📍 마크 모드':'')}
/* tap the minimap → map (outside the mine) */
document.addEventListener('pointerdown',e=>{const w=$('mmw');if(!w||!w.contains(e.target))return;if(typeof DUN!='undefined'&&DUN&&DUN.sh=='mine')return;e.preventDefault();e.stopImmediatePropagation();bmOpen()},true);
/* ---------- minimap: new building colours, enemies only with the radar / max watchtower, bosses with a skull, marks ---------- */
{const _mb=mmBuild;mmBuild=function(){const c=_mb.apply(this,arguments),m=c.getContext('2d');W0.roofs.forEach(r=>{const b=W0.b[r.bi];if(b&&KCOL[b.kind]&&['pharm','gunshop','garage','bank','hosp','mall','park2','subway','prison','radio'].includes(b.kind)){m.fillStyle=KCOL[b.kind];m.fillRect(r.x*MK,r.y*MK,r.w*MK,r.h*MK)}});return c}}
{const _mm=mm2;mm2=function(){if(typeof DUN!='undefined'&&DUN&&DUN.sh=='mine')return _mm();const p=S.p,gps=has(p,'antenna')||has(p,'radar')||S.base.lv.tower>=1,el=$('mmw');el.style.display=gps?'':'none';if(!gps)return;if(!MMB2)MMB2=mmBuild();
  const c=$('mm2'),x=c.getContext('2d'),W2=c.width,sc=MMBIG?.35:1,k=MK*sc;x.fillStyle='#000';x.fillRect(0,0,W2,W2);x.imageSmoothingEnabled=false;const cx=p.x*k-W2/2,cy=p.y*k-W2/2;x.drawImage(MMB2,-cx,-cy,MMB2.width*sc,MMB2.height*sc);
  S.pois.forEach(q=>{x.fillStyle=q.k=='drop'?'#4af':q.k=='zone'?'#f44':'#fa0';x.fillRect(q.x*k-cx-2,q.y*k-cy-2,4,4)});
  if(hostileVis()){for(const z of Z){if(z.npc||!(z.hp>0))continue;const zx=z.x*k-cx,zy=z.y*k-cy;if(isBoss(z)){x.fillStyle='#fff';x.font='9px sans-serif';x.textAlign='center';x.fillText('💀',zx,zy+3)}else{x.fillStyle=z.raider?'#ff9a3a':'#f55';x.fillRect(zx,zy,2,2)}}}
  if(S.alarm){x.fillStyle='#ff3030';x.fillRect(S.alarm.x*k-cx-3,S.alarm.y*k-cy-3,6,6)}
  for(const m of (S.inf&&S.inf.marks)||[]){const[mx,my]=mkPos(m),I=MKI[m.ic]||MKI[0];x.fillStyle=I[1];x.beginPath();x.arc(mx*k-cx,my*k-cy,2.5,0,7);x.fill()}
  x.fillStyle='#fff';x.fillRect(W2/2-2,W2/2-2,4,4)}}
document.head.insertAdjacentHTML('beforeend',`<style>#bmap{position:fixed;inset:0;z-index:40;background:#000e;display:flex;flex-direction:column;padding:calc(env(safe-area-inset-top,0px) + 8px) 8px calc(env(safe-area-inset-bottom,0px) + 8px)}
#bmap .bmT{display:flex;align-items:center;gap:8px;padding:4px 4px 8px}#bmap .bmT b{font-size:16px}#bmap .bmT small{flex:1;color:#aaa;font-size:11.5px}#bmap button{min-width:42px;height:40px;padding:0 10px;border-radius:12px;font-size:17px}
#bmap .bmW{position:relative;flex:1;min-height:0}#bmC{width:100%;height:100%;border-radius:12px;border:1px solid #ffffff22;touch-action:none;display:block}
#bmap .bmB{position:absolute;right:8px;top:8px;display:flex;flex-direction:column;gap:6px}#bmap .bmB button{background:#1d2228e6}#bmM.on{background:#7a2a24!important;border-color:#ff6a5a}
#bmap .bmI{position:absolute;left:8px;bottom:8px;right:60px;display:none;flex-wrap:wrap;gap:6px;align-items:center;padding:6px;border-radius:12px;background:#1d2228e6}#bmap .bmI.on{display:flex}#bmap .bmI button{min-width:40px}#bmap .bmI button.sel{background:#4a3c14;border-color:#e0b03a}#bmap .bmI input{flex:1;min-width:120px;height:36px;padding:0 10px;border-radius:10px;border:1px solid #ffffff33;background:#0008;color:#fff;font-size:14px}#bmap .bmI small{font-size:11px;color:#aaa;flex-basis:100%}
#bmap .bmL{display:flex;flex-wrap:wrap;gap:4px 10px;font-size:11px;padding:8px 4px 0;color:#ddd}#bmap .bmL i{display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:4px;vertical-align:-1px}#bmap .mut{color:#aaa}</style>`);
