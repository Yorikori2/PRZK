/* PROJECT LEGACY — sample: endless city (part 2, loaded after the game: sliding window, danger zones, hooks). */
'use strict';
/* ---------- recompute everything the game derived from the world ---------- */
function infDerived(){SOL.length=0;W0.hw.forEach(h=>SOL.push({x:h.x0,y:h.y-5,w:h.x1-h.x0,h:6,wall:1}));W0.vw.forEach(v=>SOL.push({x:v.x-3,y:v.y0,w:6,h:v.y1-v.y0,wall:1}));
 W0.objs.forEach(o=>{if(SOLID[o.t]&&o.t!='island')SOL.push({x:o.x,y:o.y,w:o.w,h:o.h,o})});GRID.forEach(c=>c.length=0);
 SOL.forEach(r=>{for(let gy=Math.max(0,r.y/GC|0);gy<=Math.min(GY-1,(r.y+r.h)/GC|0);gy++)for(let gx=Math.max(0,r.x/GC|0);gx<=Math.min(GX-1,(r.x+r.w)/GC|0);gx++)GRID[gy*GX+gx].push(r)});
 DG.forEach(c=>c.length=0);W0.hw.forEach(h=>addD({k:'h',r:h},h.x0,h.y-50,h.x1-h.x0,50));W0.objs.forEach(o=>{if(!FLAT[o.t])addD({k:'o',r:o},o.x-20,o.y-110,o.w+40,o.h+110)});
 ra=W0.roofs.map(()=>1);CHC.clear();if(typeof MMB2!='undefined')MMB2=null;Object.assign(BL,W0.base);W0.base=BL;if(S)rebuildBase()}
/* ---------- slide the window ---------- */
function infShift(dc,dr,quiet){if(!dc&&!dr)return;const dx=dc*PX,dy=dr*PY,s=S,p=s.p,pg=s.pg;
 /* building visits are remembered by block, not by index */
 if(pg)for(const i in pg.vis){const b=W0.b[i];if(b&&b.gk)s.inf.bv[b.gk]=1}
 if(typeof SRCH!='undefined'&&SRCH){SRCH=null;if(typeof actRing=='function')actRing()}s.alarm=null;
 OGX+=dc;OGY+=dr;s.inf.ogx=OGX;s.inf.ogy=OGY;buildWorld();infDerived();
 const mvA=a=>{for(const q of a){if(q.x!=null){q.x-=dx;q.y-=dy}if(q.x0!=null&&q.y0!=null&&q.k!='h'){q.x0-=dx;q.y0-=dy}if(q.nx!=null){q.nx-=dx;q.ny-=dy}}};
 p.x-=dx;p.y-=dy;mvA(Z);if(s.car){s.car.x-=dx;s.car.y-=dy}for(const a of[s.bar||[],s.pois||[],s.thr||[],s.fires||[],s.lures||[],s.flares||[],dec,fx])mvA(a);
 if(typeof S4!='undefined')for(const a of[S4.proj,S4.pud,S4.gas,S4.dn])mvA(a);if(typeof S5!='undefined')for(const a of[S5.fx,S5.cas])mvA(a);if(typeof AT!='undefined')mvA(AT.ring);
 for(const f of fx){if(f.a){f.a[0]-=dx;f.a[1]-=dy}if(f.b){f.b[0]-=dx;f.b[1]-=dy}}
 Z=Z.filter(z=>z.x>-PX&&z.y>-PY&&z.x<WW+PX&&z.y<WH+PY);dec=dec.filter(d=>d.x>0&&d.y>0&&d.x<WW&&d.y<WH);
 /* zombies of blocks seen for the first time */
 for(const z of W0.zs){if(s.inf.zv[z.gk])continue;const t=TIER[(W0.b[z.b]||{}).kind]||1;let look=z.look;if(look!='heavy'&&Math.random()<(t>=3?.15:t>=2?.3:0))look=t>=3?'screamer':'runner';mk(z.x,z.y,{look,g:1})}
 for(const z of W0.zs)s.inf.zv[z.gk]=1;
 if(pg){pg.vis={};W0.b.forEach((b,i)=>{if(s.inf.bv[b.gk])pg.vis[i]=1})}
 infZoneCheck(quiet)}
function infTick(){if(!INF||!S||!S.inf)return;const p=S.p,c=Math.floor((p.x-RD/2)/PX),r=Math.floor((p.y-RD/2)/PY),mc=(NBX-1)/2|0,mr=(NBY-1)/2|0;if(c!=mc||r!=mr)infShift(c-mc,r-mr)}
/* jump the player to the middle of block (gx, gy) — used by the sample scenes */
function infGoto(gx,gy){const p=S.p;const[c,r]=[(NBX-1)/2|0,(NBY-1)/2|0];const dc=gx-c-OGX,dr=gy-r-OGY;Z.length=0;infShift(dc,dr,true);const[ox,oy]=bo(c,r);p.x=ox-RD/2;p.y=oy-RD/2+8;infZoneCheck()}
/* ---------- danger zones ---------- */
let ZLAST=null;
/* zone strength: HP ×3 / ×6 / ×9 / ×12 … (3 × zone), attack +30% per zone */
const zHpMul=z=>z<=0?1:3*z,zAtkMul=z=>1+.3*Math.max(0,z);
function infZoneCheck(quiet){if(!S)return;const[gx,gy]=gOf(S.p.x,S.p.y),z=zoneOf(gx,gy);if(ZLAST!=null&&z!=ZLAST&&!quiet){const up=z>ZLAST,t=up?'⚠ '+z+'구역 진입 · 좀비 체력 ×'+zHpMul(z)+' · 더 좋은 보상':'🛡 '+z+'구역으로 돌아왔어요 · 좀비가 약해져요';if(!$('zoneb'))msg(t);zoneBanner(z,up);if(typeof onZoneAlert=='function')onZoneAlert(z,up,t)}if(z!=ZLAST)document.body.dataset.zone=Math.min(4,z);ZLAST=z}
/* big centred banner when the zone changes (stays 3 s, coloured by zone) */
let ZBT;function zoneBanner(z,up){const el=$('zoneb');if(!el)return;const c=['#7fd07f','#ffd36a','#ff9a5a','#ff6a5a','#ff4a4a'][Math.min(4,z)];
 el.innerHTML=up?'<b style="color:'+c+'">⚠ '+z+'구역 진입</b><small>좀비 체력 ×'+zHpMul(z)+' · 공격 ×'+zAtkMul(z).toFixed(1)+' · 보상 등급 +'+z+'</small>':'<b style="color:'+c+'">🛡 '+z+'구역으로 돌아옴</b><small>좀비가 약해져요</small>';
 el.style.borderColor=c;el.classList.remove('on');void el.offsetWidth;el.classList.add('on');clearTimeout(ZBT);ZBT=setTimeout(()=>el.classList.remove('on'),3000);try{if(up&&navigator.vibrate)navigator.vibrate([80,60,80])}catch(e){}}
{const _mk=mk;mk=function(x,y,o={}){if(!INF||!S)return _mk(x,y,o);const[gx,gy]=gOf(x,y),zn=zoneOf(gx,gy);
  if(!o.look&&!o.b&&zn>0&&Math.random()<Math.min(.5,.06*zn)){const L=zn>=2?['runner','spitter','dog','burner','crawler','stalker','shocker','brute']:['runner','crawler','dog','spitter'];o=Object.assign({},o,{look:L[Math.random()*L.length|0]})}
  _mk(x,y,o);const z=Z[Z.length-1];if(!z||!zn)return;const k=zHpMul(zn);z.hp*=k;z.mhp*=k;z.dmg=(z.dmg!=null?z.dmg:z.b?18:z.look=='heavy'?16:7)*zAtkMul(zn);z.sm=(z.sm||1)*Math.min(1.5,1+.05*zn);z.zone=zn}}
/* ---------- hooks ---------- */
if(INF){
 {const _st=start;start=function(d,load){const r=_st(d,load);if(!S)return r;if(!load||!S.inf){S.inf={seed:MAPCFG.seed,ogx:OGX,ogy:OGY,zv:{},bv:{}};for(const z of W0.zs)S.inf.zv[z.gk]=1}S.map={nbx:NBX,nby:NBY,inf:1,seed:MAPCFG.seed,ogx:OGX,ogy:OGY};ZLAST=null;W0.b.forEach(b=>{if(b.gk)b.zone=zoneOf(b.gx,b.gy)});infZoneCheck(true);return r}}
 {const _sv=save;save=function(){if(S&&S.inf)S.map={nbx:NBX,nby:NBY,inf:1,seed:MAPCFG.seed,ogx:OGX,ogy:OGY};return _sv.apply(this,arguments)}}
 {const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!S)return;infTick();const[gx,gy]=gOf(S.p.x,S.p.y),zn=zoneOf(gx,gy),el=$('zonec');if(el)el.innerHTML='📍 블록 ('+gx+', '+gy+') · <b>'+zn+'구역</b>'+(zn?' · 좀비 체력 ×'+zHpMul(zn):' · 안전')+' <small>다음 구역까지 '+(zoneStep()*(zn-(S.d=='N'?1:0)+1)-Math.max(Math.abs(gx),Math.abs(gy)))+'블록</small>'}}
 document.body.insertAdjacentHTML('beforeend','<div id="zonec"></div><div id="zoneb"></div>');
 document.head.insertAdjacentHTML('beforeend',`<style>#zonec{position:fixed;left:50%;transform:translateX(-50%);top:calc(env(safe-area-inset-top,0px) + 118px);z-index:3;pointer-events:none;font-size:12px;padding:3px 10px;border-radius:99px;background:#000b;border:1px solid #ffffff2a;white-space:nowrap}#zonec small{color:var(--mut);margin-left:4px}
 body[data-zone="1"] #zonec{border-color:#e0b03a}body[data-zone="1"] #zonec b{color:#ffd36a}body[data-zone="2"] #zonec{border-color:#e07a3a}body[data-zone="2"] #zonec b{color:#ff9a5a}body[data-zone="3"] #zonec,body[data-zone="4"] #zonec{border-color:#e0574f}body[data-zone="3"] #zonec b,body[data-zone="4"] #zonec b{color:#ff6a5a}
 body[data-zone="3"] #c,body[data-zone="4"] #c{box-shadow:inset 0 0 120px #a8221c55}
 #zoneb{position:fixed;left:50%;top:32%;transform:translate(-50%,-50%) scale(.85);z-index:6;pointer-events:none;opacity:0;transition:opacity .25s,transform .25s;padding:10px 20px;border-radius:14px;background:#000c;border:2px solid #fff4;text-align:center;white-space:nowrap}
 #zoneb.on{opacity:1;transform:translate(-50%,-50%) scale(1)}#zoneb b{display:block;font-size:22px}#zoneb small{font-size:12px;color:#ddd}</style>`)}
