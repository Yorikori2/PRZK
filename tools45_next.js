/* PROJECT LEGACY — sample: demolition tools Lv4 · Lv5, so every danger star has its tool.
   ★4 (경찰서 · 교도소 · 약탈자 기지) need Lv4 · ★5 (군부대 · 연구소) need Lv5. Found in those buildings.
   Loaded after zone_next.js (which capped the level at 3). */
'use strict';
{const addW=(id,nm,rar,st,ds,draw)=>{if(W_BY[id])return;const w=[id,nm,'m',rar,st,ds,'철거 도구'];WEAPONS.push(w);W_BY[id]=w;IC[id]=draw};
 addW('dt4','플라즈마 절단기','e',{d:36,cd:.55,r:50,dur:1800,nz:3,wt:7},'해체 Lv4 · 사거리 넓음 · 한 번에 세 곳 · 경찰서 · 교도소 · 약탈자 기지 (★4)까지',()=>{R('#2a2e33',4,8,14,8);R('#3a6ea8',4,8,14,2);R('#7fd0ff',18,10,4,3);R('#e8f8ff',21,11,2,1);R('#1d1714',8,16,4,6);R('#5a6068',2,10,2,4)});
 addW('dt5','중장비 파쇄기','l',{d:44,cd:.6,r:54,dur:2600,nz:4,wt:9},'해체 Lv5 · 가장 넓고 빠름 · 한 번에 네 곳 · 군부대 · 연구소 (★5)까지 · 모든 건물',()=>{R('#d9a52a',3,6,16,10);R('#f0c040',3,6,16,2);R('#2a2e33',5,16,12,4);R('#8a9096',19,8,3,6);R('#1d1714',19,8,1,6);R('#1d1714',22,9,1,4);R('#1d1714',7,3,8,3)})}
Object.assign(DT,{dt4:{lv:4,mode:'all',rng:150,auto:.24,dmg:4,n:3,ft:9},dt5:{lv:5,mode:'all',rng:185,auto:.18,dmg:6,n:4,ft:12}});
DNZ[4]=3;DNZ[5]=4;
/* demolition level = danger stars, all the way to 5 */
for(const k in TIER)if(DLV[k]!=null)DLV[k]=TIER[k]||1;DLV.rbase=4;
/* where they turn up */
for(const[k,id]of[['police','dt4'],['prison','dt4'],['rbase','dt4'],['mil','dt5'],['lab','dt5']])if(GLOOT[k]&&!GLOOT[k].includes(id))GLOOT[k].push(id);
/* option-rune slots (4) and live option numbers like the other tools · demolition mode already picks Lv5 → Lv4 → … */
if(typeof dtOptBind=='function'){dtOptBind('dt4');dtOptBind('dt5')}
/* ---------- crafting Lv4 · Lv5 at the 강화 · 룬 작업대 (the old tool is rebuilt into the new one) ---------- */
const T45R=[['dt4',{dt3:1,steel:6,elec:10,enh3:1},'유압 브레이커를 플라즈마 절단기로 개조'],['dt5',{dt4:1,steel:10,milpart:3,enh3:2},'플라즈마 절단기를 중장비 파쇄기로 개조']];
function t45Open(){const b=$('bm'),p=S.p;b.dataset.m='t45';PAUSE=true;
 const card=([id,cost,ds])=>{const ok=Object.entries(cost).every(([k,n])=>(p.inv[k]|0)>=n);return'<div class="t45c"><div class="t45h"><canvas data-ic="'+id+'" width="44" height="44"></canvas><div><b>'+NM2(id)+'</b> <small>Lv'+DT[id].lv+' · 옵션 4칸</small><div class="mut">'+ds+'</div></div></div>'+
  '<div class="t45m">'+Object.entries(cost).map(([k,n])=>'<span class="'+((p.inv[k]|0)>=n?'ok':'no')+'">'+NM2(k)+' '+(p.inv[k]|0)+'/'+n+'</span>').join('')+'</div><button data-t45="'+id+'"'+(ok?'':' disabled')+'>'+(has(p,id)?'하나 더 만들기':'만들기')+'</button></div>'};
 b.innerHTML='<div class="sh"><h2>🔨 철거 도구 제작</h2><div class="wt">강화 · 룬 작업대 · 아래 단계 도구를 개조해요</div><button onclick="closeBase();PAUSE=false">✕</button></div>'+T45R.map(card).join('')+'<div class="sub" style="margin-top:6px">Lv1 ~ Lv3은 작업대 · 제작에서 · Lv4는 ★4 (경찰서 · 교도소 · 약탈자 기지), Lv5는 ★5 (군부대 · 연구소) 건물을 부숴요</div>';
 b.style.display='block';b.querySelectorAll('canvas[data-ic]').forEach(c=>{try{const x=c.getContext('2d'),g0=g;g=x;x.scale(44/24,44/24);IC[c.dataset.ic]();g=g0}catch(e){}});
 b.querySelectorAll('[data-t45]').forEach(bt=>bt.onclick=()=>{const r=T45R.find(q=>q[0]==bt.dataset.t45);for(const k in r[1])p.inv[k]-=r[1][k];give({[r[0]]:1});msg('🔨 '+NM2(r[0])+' 완성!');t45Open()})}
{const _c=dmCtx;dmCtx=function(){const B=_c();try{if(typeof nearEnhB=='function'&&nearEnhB()&&!(typeof DUN!='undefined'&&DUN))B.push({t:'🔨 철거 도구 제작 · Lv4 · Lv5',f:t45Open,sm:1})}catch(e){}return B}}
if(typeof IAW!='undefined')IAW.unshift([/철거 도구 제작/,'도구 제작']);
document.head.insertAdjacentHTML('beforeend',`<style>#bm .t45c{padding:10px;margin:8px 0;border-radius:12px;background:#ffffff0c;border:1px solid #ffffff18}#bm .t45h{display:flex;gap:10px;align-items:center}#bm .t45h canvas{width:44px;height:44px;image-rendering:pixelated;background:#0006;border-radius:8px}
#bm .t45h small{color:var(--mut)}#bm .t45m{display:flex;flex-wrap:wrap;gap:5px;margin:8px 0}#bm .t45m span{padding:3px 8px;border-radius:99px;font-size:12px;background:#ffffff10}#bm .t45m .ok{color:#9fe09f}#bm .t45m .no{color:#ff9a8a}#bm .t45c button{width:100%;padding:9px}</style>`);
