/* PROJECT LEGACY — the bag window, rearranged:
   · the item you tap is described at the TOP of the window (under the title), not at the bottom
   · equipment has its own tab: [🎒 가방] shows the items, [🦺 장비] shows the worn slots (and the set / weight notes).
   Loaded last of the bag wrappers. */
'use strict';
let BTAB='bag';
{const _ob=openBag;openBag=function(id){_ob.apply(this,arguments);try{const b=$('bm'),sh=b.querySelector('.sh');if(!sh)return;
  /* tabs under the title */
  const eq=b.querySelector('.eq'),flt=b.querySelector('.flt'),grid=b.querySelector('.grid'),det=b.querySelector('.det');
  const eqPart=[];if(eq){let n=eq;while(n&&n!==flt){eqPart.push(n);n=n.nextElementSibling}}
  const worn=Object.values(S.p.eq||{}).filter(Boolean).length;
  sh.insertAdjacentHTML('afterend','<div class="bTab"><button data-bt="bag" class="'+(BTAB=='bag'?'on':'')+'">🎒 가방</button><button data-bt="eq" class="'+(BTAB=='eq'?'on':'')+'">🦺 장비 <small>'+worn+'</small></button></div>');
  const tabs=b.querySelector('.bTab');
  /* the detail card goes right under the tabs */
  if(det){tabs.after(det);det.classList.add('top');if(id)b.scrollTop=0}
  /* show one tab */
  for(const n of eqPart)n.style.display=BTAB=='eq'?'':'none';
  if(flt)flt.style.display=BTAB=='bag'?'':'none';if(grid)grid.style.display=BTAB=='bag'?'':'none';
  if(BTAB=='eq'&&!det)tabs.insertAdjacentHTML('afterend','<div class="sub bHint">칸을 누르면 그 장비 정보가 여기 위에 떠요 · 장비는 [🎒 가방] 탭에서 아이템을 눌러 장착해요</div>');
  b.querySelectorAll('[data-bt]').forEach(x=>x.onclick=()=>{BTAB=x.dataset.bt;openBag()});
  /* after equipping from the bag tab, stay put; after tapping a worn slot, its info is on top */
 }catch(e){}}}
document.head.insertAdjacentHTML('beforeend',`<style>
#bm .bTab{display:flex;gap:6px;margin:6px 0 8px}#bm .bTab button{flex:1;padding:9px 0;font-size:14px;border-radius:12px;background:#ffffff0a;border:1px solid #ffffff22;color:#e8e2d6}
#bm .bTab button.on{background:#e0b03a26;border-color:#e0b03a;color:#ffd36a}#bm .bTab small{font-size:11px;opacity:.8}
#bm .det.top{margin:0 0 10px;border:1px solid #ffd36a55;border-radius:12px;padding:8px;background:#ffffff08}
#bm .bHint{margin:0 0 8px;font-size:12px}</style>`);
