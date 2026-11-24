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
{const _k=kill;kill=function(z){_k(z);if(!S||!z.raider||z.gone||z.npc)return;dec.push({k:'c',x:z.x,y:z.y+2,look:z.look,f:Math.random()<.5,rz:1,tt:S.tt||0,nm:z.nm})}}
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
   for(const o of L){const d=Object.assign({},o,{x:ox+o.x,y:oy+o.y});if(d.k=='c'&&d.rz&&(S.tt||0)-(d.tt||0)>=120){mk(d.x,d.y,{look:zlook(d.look)});rose++;dec.push({k:'p',x:d.x,y:d.y,r:7});continue}dec.push(d)}}
  S.risen=(S.risen||0)+rose}}
/* ---------- explosive countdown chip ---------- */
document.body.insertAdjacentHTML('beforeend','<div id="boomc"></div>');
document.head.insertAdjacentHTML('beforeend',`<style>#boomc{display:none;position:fixed;left:50%;transform:translateX(-50%);top:calc(env(safe-area-inset-top,0px) + 146px);z-index:3;pointer-events:none;font-size:12px;padding:3px 10px;border-radius:99px;background:#3a0a0acc;border:1px solid #ff6a5a;white-space:nowrap;color:#ffd0c8}#boomc b{display:inline-block;color:#ff8a7a;margin-right:4px}</style>`);
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);const el=$('boomc');if(!el)return;if(!S||!S.inf||typeof DM=='undefined'||!DM||DM.way!='boom'){el.style.display='none';return}
  const[gx,gy]=DM.gk.split(',').map(Number),[ox,oy]=bo(gx-OGX,gy-OGY),near=!DM.far&&DM.cx!=null,tx=near?DM.cx:ox+BW/2,ty=near?DM.cy:oy+BH/2,dx=tx-S.p.x,dy=ty-S.p.y,d=Math.hypot(dx,dy),a=Math.atan2(dy,dx);
  el.style.display='block';el.innerHTML='💣 <b>'+Math.max(0,Math.ceil(DM.T-DM.t))+'초</b> '+DM.name+' · '+((near&&inBld(DM.bi,S.p.x,S.p.y,60))||d<160?'바로 여기! 건물에서 멀리 피하세요':'<span style="display:inline-block;transform:rotate('+a+'rad)">➤</span> '+compass(dx,dy)+' '+Math.round(d/8)+'m')}}
