/* PROJECT LEGACY — sample: quick special-ammo switch on the weapon card.
   Tap the ammo chip to load the next kind of that calibre you carry (and reload at once); hold it for a list.
   Loaded after ammo_next.js. */
'use strict';
const AQN={bp:'흑색',ap:'철갑',hp:'할로',inc:'소이',sub:'아음속',shk:'충격',slug:'슬러그',fl:'플레셰트',db:'드래곤',bean:'빈백'};
const aqShort=id=>{const v=AVAR[id];return v?AQN[v[1]]||NM2(id):'일반'};
/* the kinds of this gun's calibre in the bag (plain first) */
function aqKinds(p,id){const w=W_BY[id],cal=w&&w[4].ammo;if(!cal||!ACAL[cal]&&cal!='12g')return[];const L=['a'+cal];for(const k in AVAR)if(AVAR[k][0]==cal)L.push(k);
 const cur=(p.aSel&&p.aSel[cal])||'a'+cal,inMag=p.magT&&p.magT[id];return L.filter(k=>k==cur||k==inMag||realHave(p,k,cal)>0)}
/* hud2 swaps the chosen kind into the plain slot while it draws, so count the real stock */
function realHave(p,k,cal){const sel=p.aSel&&p.aSel[cal];if(!AQSW||!sel)return p.inv[k]|0;if(k==sel)return p.inv['a'+cal]|0;if(k=='a'+cal)return AQSW.b;return p.inv[k]|0}
let AQSW=null;
function aqSet(k){const p=S.p,id=actW(p),cal=W_BY[id][4].ammo,cur=(p.aSel&&p.aSel[cal])||'a'+cal;if(k==cur&&(p.mag[id]|0)>0)return;
 const om=msg;msg=()=>{};try{ammoLoad(k)}finally{msg=om}p.rl=0;reload(p,true);msg('🔫 '+NM2(k)+' 장전 중…');hud2()}
function aqNext(){const p=S.p,id=actW(p),L=aqKinds(p,id);if(L.length<2)return msg('🔫 바꿀 다른 탄이 없어요 · 탄약 제작대에서 만들어요');const cal=W_BY[id][4].ammo,cur=(p.aSel&&p.aSel[cal])||'a'+cal;aqSet(L[(L.indexOf(cur)+1)%L.length])}
function aqList(){const p=S.p,id=actW(p),L=aqKinds(p,id),cal=W_BY[id][4].ammo,cur=(p.aSel&&p.aSel[cal])||'a'+cal;let el=$('aqPop');if(el)el.remove();
 document.body.insertAdjacentHTML('beforeend','<div id="aqPop">'+L.map(k=>'<button data-k="'+k+'" class="'+(k==cur?'on':'')+'"><img src="'+icon(k)+'"><b>'+aqShort(k)+'</b><small>'+((k==cur?(p.mag[id]|0)+' 장전 · ':'')+(p.inv[k]|0))+'</small></button>').join('')+'</div>');el=$('aqPop');
 const r=$('wc').getBoundingClientRect();el.style.right=(innerWidth-r.right)+'px';el.style.bottom=(innerHeight-r.top+6)+'px';
 el.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();const b=e.target.closest('[data-k]');if(b)aqSet(b.dataset.k);el.remove()});setTimeout(()=>{const off=e=>{if(!el.contains(e.target)){el.remove();removeEventListener('pointerdown',off,true)}};addEventListener('pointerdown',off,true)},50)}
/* the chip on the card */
{const _wc=wcard;wcard=function(){_wc();const p=S.p,id=actW(p);if(!GCLASS[id])return;const w=W_BY[id],cal=w&&w[4].ammo;if(!cal)return;const L=aqKinds(p,id);if(L.length<2&&!(p.aSel&&p.aSel[cal]))return;
  const t=(p.magT&&p.magT[id]&&(p.mag[id]|0)>0)?p.magT[id]:(p.aSel&&p.aSel[cal])||'a'+cal,v=AVAR[t],col=v?(AKIND[v[1]]||SHELL[v[1]]||[])[1]:'#c9ced3';
  const wb=$('wc').querySelector('.wb');if(wb)wb.insertAdjacentHTML('beforeend','<span data-a="am" class="aq" style="border-color:'+col+'"><i style="background:'+col+'"></i>'+aqShort(t)+(L.length>1?' ▸':'')+'</span>')}}
{const _h=hud2;hud2=function(){const p=S&&S.p;if(!p)return _h();const id=actW(p),w=W_BY[id],cal=w&&w[4].ammo,sel=cal&&p.aSel&&p.aSel[cal];AQSW=sel?{b:p.inv['a'+cal]|0}:null;try{return _h()}finally{AQSW=null}}}
/* tap = next kind, hold = list (runs before the card's own handler) */
{let tm=null,held=false;$('wc').addEventListener('pointerdown',e=>{const a=e.target.closest('[data-a="am"]');if(!a||!run)return;e.preventDefault();e.stopImmediatePropagation();held=false;clearTimeout(tm);tm=setTimeout(()=>{held=true;aqList()},420)},true);
 $('wc').addEventListener('pointerup',e=>{const a=e.target.closest('[data-a="am"]');if(!a||!run)return;e.stopImmediatePropagation();clearTimeout(tm);if(!held)aqNext()},true)}
document.head.insertAdjacentHTML('beforeend',`<style>#wc .wb span.aq{flex:1.3;display:flex;align-items:center;justify-content:center;gap:4px;background:#2a2410}#wc .wb span.aq i{width:7px;height:7px;border-radius:2px;display:inline-block}
#aqPop{position:fixed;z-index:9;display:flex;flex-direction:column;gap:4px;padding:6px;border-radius:12px;background:#141a20f2;border:1px solid #ffffff2a}#aqPop button{display:grid;grid-template-columns:26px 1fr;grid-template-rows:auto auto;gap:0 6px;align-items:center;text-align:left;padding:4px 10px 4px 6px;min-width:150px;width:auto;border-radius:9px}
#aqPop button img{grid-row:1/3;width:24px;image-rendering:pixelated}#aqPop button b{font-size:12.5px}#aqPop button small{font-size:10.5px;color:var(--mut)}#aqPop button.on{border-color:#ffd36a;background:#3a3010}</style>`);
