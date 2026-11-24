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
 for(const z of W0.zs){if(s.inf.zv[z.gk])continue;const t=TIER[(W0.b[z.b]||{}).kind]||1,[zx,zy]=gOf(z.x,z.y),zn=zoneOf(zx,zy),P=zProf(zn);const n=Math.floor(P.dens)+(Math.random()<P.dens%1?1:0);
  for(let i=0;i<n;i++){let look=z.look;const sp=zn?zPick(zn):null;if(sp&&look!='heavy')look=sp;else if(look!='heavy'&&Math.random()<(t>=3?.15:t>=2?.3:0))look=t>=3?'screamer':'runner';mk(z.x+(i?(Math.random()-.5)*40:0),z.y+(i?(Math.random()-.5)*30:0),{look,g:1})}}
 /* zone 4+: a boss may roam the block (once per block) */
 s.inf.bb=s.inf.bb||{};W0.b.forEach(b=>{if(!b.gk||s.inf.bb[b.gk])return;s.inf.bb[b.gk]=1;const zn=zoneOf(b.gx,b.gy),P=zProf(zn);if(P.boss&&Math.random()<P.boss){const[ox,oy]=bo(b.gx-OGX,b.gy-OGY);mk(ox-RD/2,oy-RD/2,{look:Math.random()<.5?'goliath':'brood',g:1});s.inf.bn=(s.inf.bn||0)+1}});
 for(const z of W0.zs)s.inf.zv[z.gk]=1;
 if(pg){pg.vis={};W0.b.forEach((b,i)=>{if(s.inf.bv[b.gk])pg.vis[i]=1})}
 infZoneCheck(quiet)}
function infTick(){if(!INF||!S||!S.inf)return;const p=S.p,c=Math.floor((p.x-RD/2)/PX),r=Math.floor((p.y-RD/2)/PY),mc=(NBX-1)/2|0,mr=(NBY-1)/2|0;if(c!=mc||r!=mr)infShift(c-mc,r-mr)}
/* jump the player to the middle of block (gx, gy) — used by the sample scenes */
function infGoto(gx,gy){const p=S.p;const[c,r]=[(NBX-1)/2|0,(NBY-1)/2|0];const dc=gx-c-OGX,dr=gy-r-OGY;Z.length=0;infShift(dc,dr,true);const[ox,oy]=bo(c,r);p.x=ox-RD/2;p.y=oy-RD/2+8;infZoneCheck()}
/* ---------- danger zones ---------- */
let ZLAST=null;
/* zone strength: HP ×3 / ×6 / ×9 / ×12 … (3 × zone), attack +30% per zone */
/* zone profile: what changes for zombies in each zone (late zones keep getting harder) */
const ZSP=[[],['runner','crawler','dog','spitter','sleeper'],['bloater','burner'],['screamer'],[]],ZEL=[[],[],['heavy','stalker'],['shocker'],['brute']];
const zList=(T,zn)=>T.slice(0,Math.min(T.length,zn+1)).flat();
function zProf(zn){zn=Math.max(0,zn);return{hp:zHpMul(zn),ehp:1+(zHpMul(zn)-1)*.5,bhp:1+.5*zn,atk:zAtkMul(zn),spd:Math.min(1.5,1+.05*zn),sp:zn?Math.min(.4,.02+.08*zn):0,el:zn>=2?Math.min(.25,.04*(zn-1)):0,dens:Math.min(2.5,1+.25*zn),boss:zn>=4?Math.min(.35,.1+.05*(zn-4)):0}}
function zPick(zn){const P=zProf(zn),r=Math.random();if(r<P.el){const L=zList(ZEL,zn);return L[Math.random()*L.length|0]}if(r<P.el+P.sp){const L=zList(ZSP,zn);return L[Math.random()*L.length|0]}return null}
const zHpMul=z=>z<=0?1:3*z,zAtkMul=z=>1+.3*Math.max(0,z);
function infZoneCheck(quiet){if(!S)return;const[gx,gy]=gOf(S.p.x,S.p.y),z=zoneOf(gx,gy);if(ZLAST!=null&&z!=ZLAST&&!quiet){const up=z>ZLAST,t=up?'⚠ '+z+'구역 진입 · 좀비 체력 ×'+zHpMul(z)+' · 더 좋은 보상':'🛡 '+z+'구역으로 돌아왔어요 · 좀비가 약해져요';if(!$('zoneb'))msg(t);zoneBanner(z,up);if(typeof onZoneAlert=='function')onZoneAlert(z,up,t)}if(z!=ZLAST)document.body.dataset.zone=Math.min(4,z);ZLAST=z}
/* big centred banner when the zone changes (stays 3 s, coloured by zone) */
let ZBT;function zoneBanner(z,up){const el=$('zoneb');if(!el)return;const c=['#7fd07f','#ffd36a','#ff9a5a','#ff6a5a','#ff4a4a'][Math.min(4,z)];
 el.innerHTML=up?'<b style="color:'+c+'">⚠ '+z+'구역 진입</b><small>좀비 체력 ×'+zHpMul(z)+' · 공격 ×'+zAtkMul(z).toFixed(1)+' · 보상 등급 +'+z+'</small>':'<b style="color:'+c+'">🛡 '+z+'구역으로 돌아옴</b><small>좀비가 약해져요</small>';
 el.style.borderColor=c;el.classList.remove('on');void el.offsetWidth;el.classList.add('on');clearTimeout(ZBT);ZBT=setTimeout(()=>el.classList.remove('on'),3000);try{if(up&&navigator.vibrate)navigator.vibrate([80,60,80])}catch(e){}}
{const _mk=mk;mk=function(x,y,o={}){if(!INF||!S)return _mk(x,y,o);const[gx,gy]=gOf(x,y),zn=zoneOf(gx,gy);
  if(!o.look&&!o.b&&zn>0){const L=zPick(zn);if(L)o=Object.assign({},o,{look:L})}
  _mk(x,y,o);const z=Z[Z.length-1];if(!z||!zn)return;const P=zProf(zn),k=BOSSZ.includes(z.look)?P.bhp:(ELITEZ.includes(z.look)||z.b)?P.ehp:P.hp;z.hp*=k;z.mhp*=k;z.dmg=(z.dmg!=null?z.dmg:z.b?18:z.look=='heavy'?16:7)*zAtkMul(zn);z.sm=(z.sm||1)*P.spd;z.zone=zn}}
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
