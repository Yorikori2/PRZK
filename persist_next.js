/* PROJECT LEGACY — places you have been stay the way you left them.
   · Raider groups and wandering merchants only turn up in blocks you have never seen (raid_next / title_next).
   · Blood and bodies are kept per block when you walk away — but only some of it (a few pools, splashes and bodies
     per block), so a busy street doesn't fill up forever.
   · Raiders you killed don't stay dead: come back a couple of game hours later and they rise as zombies.
   · A lit explosive shows its countdown, direction and distance at the top of the screen.  Loaded after opin3_next.js. */
'use strict';
const KEEP={p:8,b:10,c:6},DECMAX=250;
/* zombified look for a raider/NPC look */
function zlook(look){const k=look+'Z';if(!LOOKS[k]&&LOOKS[look])LOOKS[k]=Object.assign({},LOOKS[look],ZBASE,{p:LOOKS[look].p,pd:LOOKS[look].pd,c:LOOKS[look].c,cl:LOOKS[look].cl,cd:LOOKS[look].cd,helm:LOOKS[look].helm,vest:LOOKS[look].vest,cap:LOOKS[look].cap});return LOOKS[k]?k:'civ1'}
/* raiders leave a body that can rise again */
{const _k=kill;kill=function(z){_k(z);if(!S||!z.raider||z.gone||z.npc)return;dec.push({k:'c',x:z.x,y:z.y+2,look:z.look,f:Math.random()<.5,rz:1,tt:S.tt||0,nm:z.nm,wid:z.wid,rt:z.raider,lead:z.lead?1:0})}}
function decStore(gk,list){if(!S.inf)return;const st=S.inf.dec=S.inf.dec||{};const cur=st[gk]||[];const all=cur.concat(list);const out=[];
 for(const k of['p','b','c']){let L=all.filter(d=>d.k==k);if(k=='p')L.sort((a,b)=>(b.r||0)-(a.r||0));else if(k=='c')L=L.slice(-KEEP.c);else L=L.sort(()=>Math.random()-.5);out.push(...L.slice(0,KEEP[k]))}
 delete st[gk];st[gk]=out;const keys=Object.keys(st);if(keys.length>DECMAX)for(const k of keys.slice(0,keys.length-DECMAX))delete st[k]}
{const _sh=infShift;infShift=function(dc,dr,q){if(!S||!S.inf||(!dc&&!dr)||(typeof DUN!='undefined'&&DUN))return _sh(dc,dr,q);
  const ogx=OGX,ogy=OGY,before=dec.map(d=>{const[gx,gy]=gOf(d.x,d.y),[ox,oy]=bo(gx-ogx,gy-ogy);return{d,gk:gx+','+gy,gx,gy,rx:d.x-ox,ry:d.y-oy}}),inW=(gx,gy)=>gx>=OGX&&gy>=OGY&&gx<OGX+NBX&&gy<OGY+NBY,wasW=(gx,gy)=>gx>=ogx&&gy>=ogy&&gx<ogx+NBX&&gy<ogy+NBY;
  _sh(dc,dr,q);
  /* blocks that left the window: keep a trimmed copy of their blood and bodies */
  const gone={};for(const b of before){if(inW(b.gx,b.gy))continue;const o=Object.assign({},b.d);o.x=b.rx;o.y=b.ry;(gone[b.gk]=gone[b.gk]||[]).push(o)}for(const gk in gone)decStore(gk,gone[gk]);
  /* blocks that came back into the window: put their marks back; bodies left long enough get up */
  const st=S.inf.dec||{};let rose=0;for(let gy=OGY;gy<OGY+NBY;gy++)for(let gx=OGX;gx<OGX+NBX;gx++){if(wasW(gx,gy))continue;const gk=gx+','+gy,L=st[gk];if(!L)continue;delete st[gk];const[ox,oy]=bo(gx-OGX,gy-OGY);
   for(const o of L){const d=Object.assign({},o,{x:ox+o.x,y:oy+o.y});if(d.k=='c'&&d.rz&&(S.tt||0)-(d.tt||0)>=120){mk(d.x,d.y,{look:zlook(d.look)});{const zz=Z[Z.length-1];if(zz)zz.exr={wid:d.wid,rt:d.rt||1,lead:d.lead}}rose++;dec.push({k:'p',x:d.x,y:d.y,r:7});continue}dec.push(d)}}
  S.risen=(S.risen||0)+rose}}
/* ---------- explosive countdown chip ---------- */
document.body.insertAdjacentHTML('beforeend','<div id="boomc"></div>');
document.head.insertAdjacentHTML('beforeend',`<style>#boomc{display:none;position:fixed;left:50%;transform:translateX(-50%);top:calc(env(safe-area-inset-top,0px) + 146px);z-index:3;pointer-events:none;font-size:12px;padding:3px 10px;border-radius:99px;background:#3a0a0acc;border:1px solid #ff6a5a;white-space:nowrap;color:#ffd0c8}#boomc b{display:inline-block;color:#ff8a7a;margin-right:4px}</style>`);
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);const el=$('boomc');if(!el)return;if(!S||!S.inf||typeof DM=='undefined'||!DM||DM.way!='boom'){el.style.display='none';return}
  const[gx,gy]=DM.gk.split(',').map(Number),[ox,oy]=bo(gx-OGX,gy-OGY),near=!DM.far&&DM.cx!=null,tx=near?DM.cx:ox+BW/2,ty=near?DM.cy:oy+BH/2,dx=tx-S.p.x,dy=ty-S.p.y,d=Math.hypot(dx,dy),a=Math.atan2(dy,dx);
  el.style.display='block';el.innerHTML='💣 <b>'+Math.max(0,Math.ceil(DM.T-DM.t))+'초</b> '+DM.name+' · '+((near&&inBld(DM.bi,S.p.x,S.p.y,60))||d<160?'바로 여기! 건물에서 멀리 피하세요':'<span style="display:inline-block;transform:rotate('+a+'rad)">➤</span> '+compass(dx,dy)+' '+Math.round(d/8)+'m')}}

/* risen raiders still carry some of their old gear */
const EXARM=[null,{},{vest:.2},{vest:.25,helmet:.25},{milarmor:.2,helmet:.25},{milarmor:.3,helmet:.3}];
{const _k2=kill;kill=function(z){_k2(z);if(!S||!z.exr)return;const e=z.exr,r={};if(e.wid&&W_BY[e.wid]&&Math.random()<.35)r[e.wid]=1;const am=e.wid&&W_BY[e.wid]&&W_BY[e.wid][4].ammo;if(am&&Math.random()<.5)r[AMMO_ITEM(am)]=10+(Math.random()*11|0);
  const A=EXARM[Math.min(5,e.rt)]||{};for(const k in A)if(Math.random()<A[k]*(e.lead?1.5:1))r[k]=1;if(Math.random()<.4)r.tkn=1+(Math.random()*3|0);if(Math.random()<.15)r[stoneFor(e.rt)]=1;
  const ks=Object.keys(r);if(!ks.length)return;for(const k of ks)invAdd(S.p,k,r[k]);s3Float(z.x,z.y-30,'🧟 '+ks.map(k=>NM2(k)+(r[k]>1?' '+r[k]:'')).join(' · '),'#c8e0a0');S.exDrops=(S.exDrops||0)+1}}

/* ---------- raiders keep coming in every zone and keep getting stronger ----------
   Zones 1-5 use their own gear tiers. Past zone 5 the gear stays (machine guns, leaders) but health and damage keep
   growing with the zone the same way zombies do (×3 per zone: zone 6 = ×18/×15 of zone 5 …), and squads get bigger. */
const rZoneMul=zn=>zn<=5?1:zHpMul(zn)/zHpMul(5),rDmgMul=zn=>zn<=5?1:zAtkMul(zn)/zAtkMul(5);
{const _rs=rSpawn;rSpawn=function(x,y,zn,goal){const L=_rs(x,y,zn,goal);if(zn>5){const hm=rZoneMul(zn),dm=rDmgMul(zn);for(const r of L){r.mhp*=hm;r.hp=r.mhp;r.dmg*=dm;r.zn=zn}
   const extra=Math.min(4,Math.floor((zn-5)/2));for(let i=0;i<extra;i++){const L2=_rs(x+(i+1)*30,y+20,5,goal),q=L2.find(v=>!v.lead&&v.wid!='sniper')||L2[L2.length-1];for(const v of L2)if(v!==q){const k=Z.indexOf(v);if(k>=0)Z.splice(k,1)}if(!q)continue;q.mhp*=hm;q.hp=q.mhp;q.dmg*=dm;q.grp=L[0].grp;L.push(q)}}return L}}
/* ---------- a risen leader is an elite: tougher, harder-hitting, a bit bigger, with a health bar ---------- */
if(typeof ELITEZ!='undefined'&&!ELITEZ.includes('rdLZ'))ELITEZ.push('rdLZ');
{const _sh2=infShift;infShift=function(dc,dr,q){const n0=Z.length;_sh2(dc,dr,q);for(let i=n0;i<Z.length;i++){const z=Z[i];if(z.exr&&z.exr.lead&&!z.elite){z.elite=1;z.mhp*=4;z.hp=z.mhp;z.dmg=(z.dmg!=null?z.dmg:7)*1.5;z.sm=(z.sm||1)*1.1;z.nm='좀비 대장'}}}}
