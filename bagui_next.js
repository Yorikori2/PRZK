/* PROJECT LEGACY — the bag window, rearranged:
   · the item you tap is described at the TOP of the window (under the title), not at the bottom
   · equipment has its own tab: [🎒 가방] shows the items, [🦺 장비] shows the worn slots (and the set / weight notes).
   Loaded last of the bag wrappers. */
'use strict';
let BTAB='bag';
{const _ob=openBag;openBag=function(id){const bm=$('bm'),keep=bm&&bm.dataset.m=='bag'&&bm.style.display=='block'?bm.scrollTop:0;_ob.apply(this,arguments);try{const b=$('bm'),sh=b.querySelector('.sh');if(!sh)return;
  /* tabs under the title */
  const eq=b.querySelector('.eq'),flt=b.querySelector('.flt'),grid=b.querySelector('.grid'),det=b.querySelector('.det');
  const eqPart=[];if(eq){let n=eq;while(n&&n!==flt){eqPart.push(n);n=n.nextElementSibling}}
  const worn=Object.values(S.p.eq||{}).filter(Boolean).length;
  sh.insertAdjacentHTML('afterend','<div class="bTab"><button data-bt="bag" class="'+(BTAB=='bag'?'on':'')+'">🎒 가방</button><button data-bt="eq" class="'+(BTAB=='eq'?'on':'')+'">🦺 장비 <small>'+worn+'</small></button></div>');
  const tabs=b.querySelector('.bTab');
  /* the detail card goes right under the tabs */
  if(det){tabs.after(det);det.classList.add('top')}b.scrollTop=keep;
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
#bm .det.top{position:sticky;top:-2px;z-index:5;margin:0 0 10px;border:1px solid #ffd36a88;border-radius:12px;padding:8px;background:#1a1f24;box-shadow:0 6px 16px #000a}
#bm .bHint{margin:0 0 8px;font-size:12px}</style>`);
/* ---------- compare: the item you tapped against what is worn in that slot now ---------- */
function bgCmpRows(id){const W=W_BY[id];if(W){const s=wdef(id)[4]||W[4],rps=s.rps||(s.cd?1/s.cd:0);return[['피해',s.d*(s.pel||1),1],['초당 공격',+rps.toFixed(2),1],['사거리',s.r||0,1],['탄창',s.mag||0,1],['소음',s.nz||0,-1],['무게',s.wt||0,-1]].filter(r=>r[1]||r[0]=='소음')}
 if(typeof ARMX!='undefined'&&ARMX[id]){const e=ARMX[id][4];return[['받는 피해 감소',Math.round((e.dr||0)*100),1,'%'],['폭발 감소',Math.round((e.blast||0)*100),1,'%'],['이동',Math.round((e.mov||0)*100),1,'%'],['넘어짐 감소',Math.round((e.kd||0)*100),1,'%'],['무게',ARMX[id][3],-1,'kg']].filter((r,i)=>r[1]||i==0||r[0]=='무게')}
 if(typeof BAGCAP!='undefined'&&BAGCAP[id]!=null)return[['가방 무게 +',BAGCAP[id],1,'kg'],['무게',wtOf(id),-1,'kg']];
 if(typeof SHD!='undefined'&&SHD[id]){const S0=SHD[id];return Object.keys(S0).filter(k=>typeof S0[k]=='number').slice(0,4).map(k=>[k,S0[k],1])}return null}
function bgCmpHtml(id){const p=S.p,sl=typeof slotFor=='function'?slotFor(id):null;if(!sl)return'';const cur=p.eq[sl];if(cur==id)return'<div class="cmp same">✅ 지금 끼고 있어요</div>';
 const A=bgCmpRows(id);if(!A)return'';const B=cur?bgCmpRows(cur)||[]:[];const val=n=>{const r=B.find(x=>x[0]==n);return r?r[1]:0};
 const row=([n,v,good,u])=>{const o=val(n),d=+(v-o).toFixed(2),cl=!d?'eq':(d>0)==(good>0)?'up':'dn';return'<tr><td>'+n+'</td><td>'+(cur?o+(u||''):'—')+'</td><td>→</td><td><b>'+v+(u||'')+'</b></td><td class="'+cl+'">'+(d?(d>0?'▲':'▼')+Math.abs(d):'=')+'</td></tr>'};
 return'<div class="cmp"><div class="cmpH">⚖ '+(cur?'<img src="'+icon(cur)+'">'+NM2(cur)+' <small>지금</small> → <img src="'+icon(id)+'">'+NM2(id):'빈 칸 → <img src="'+icon(id)+'">'+NM2(id))+'</div><table>'+A.map(row).join('')+'</table><small class="cmpL"><b class="up">초록</b> 좋아짐 · <b class="dn">빨강</b> 나빠짐</small></div>'}
{const _ob=openBag;openBag=function(id){_ob.apply(this,arguments);try{const det=$('bm').querySelector('.det');if(det&&BSEL&&!det.querySelector('.cmp')){const h=bgCmpHtml(BSEL);if(h){const info=[...det.children].find(c=>c.tagName=='DIV'&&!c.classList.contains('ba'));if(info)info.insertAdjacentHTML('beforeend',h);else det.insertAdjacentHTML('beforeend',h)}}}catch(e){}}}
document.head.insertAdjacentHTML('beforeend',`<style>#bm .cmp{flex-basis:100%;margin:6px 0 2px;padding:6px 8px;border-radius:10px;background:#ffffff0a;font-size:12px}#bm .cmp.same{color:#9fe09f}
#bm .cmpH{display:flex;align-items:center;gap:4px;flex-wrap:wrap;margin-bottom:4px}#bm .cmpH img{width:20px;height:20px;image-rendering:pixelated}#bm .cmpH small{color:var(--mut)}
#bm .cmp table{width:100%;border-collapse:collapse}#bm .cmp td{padding:1px 4px}#bm .cmp td:first-child{color:var(--mut)}#bm .cmp td:nth-child(2){text-align:right;color:var(--mut)}#bm .cmp td:nth-child(3){text-align:center;color:var(--mut);width:14px}#bm .cmp td:nth-child(5){text-align:right;width:48px}
#bm .cmp .up{color:#7fe07f}#bm .cmp .dn{color:#ff8a7a}#bm .cmp .eq{color:var(--mut)}#bm .cmpL{color:var(--mut);font-size:10.5px}#bm .det.top{flex-wrap:wrap}</style>`);
/* ---------- better or worse at a glance: ▲ / ▼ on tiles · compare in the stash and at the merchant · fold the card ---------- */
function bgScore(id){const W=W_BY[id];if(W){const s=wdef(id)[4]||W[4],rps=s.rps||(s.cd?1/s.cd:1);return(s.d||0)*(s.pel||1)*rps}if(typeof ARMX!='undefined'&&ARMX[id]){const e=ARMX[id][4];return(e.dr||0)*100+(e.blast||0)*20+(e.kd||0)*10}if(typeof BAGCAP!='undefined'&&BAGCAP[id]!=null)return BAGCAP[id];return null}
function bgBetter(id){const p=S.p,sl=typeof slotFor=='function'?slotFor(id):null;if(!sl||Object.values(p.eq).includes(id))return 0;const a=bgScore(id);if(a==null)return 0;const cur=p.eq[sl];if(!cur)return 1;const b=bgScore(cur);if(b==null)return 0;return a>b*1.001?1:a<b*.999?-1:0}
function bgMark(el,id){if(!el||el.querySelector('.bgM'))return;const r=bgBetter(id);if(!r)return;el.insertAdjacentHTML('beforeend','<i class="bgM '+(r>0?'up':'dn')+'">'+(r>0?'▲':'▼')+'</i>')}
{const _ob=openBag;openBag=function(id){_ob.apply(this,arguments);try{const b=$('bm');b.querySelectorAll('.grid .cell[data-i]').forEach(c=>bgMark(c,c.dataset.i));
  const det=b.querySelector('.det.top');if(det&&!det.querySelector('.bgF')){const ba=det.querySelector('.ba');const btn='<button class="bgF">✕ 접기</button>';if(ba)ba.insertAdjacentHTML('beforeend',btn);else det.insertAdjacentHTML('beforeend',btn);det.querySelector('.bgF').onclick=e=>{e.stopPropagation();BSEL=null;openBag()}}}catch(e){}}}
{const _os=openStash;openStash=function(){_os.apply(this,arguments);try{const b=$('bm');b.querySelectorAll('.stT').forEach(el=>{const m=/stPick\('([^']+)'/.exec(el.getAttribute('onclick')||'');if(m)bgMark(el,m[1])});
  const d=b.querySelector('.stD');if(d&&STSEL&&!d.querySelector('.cmp')){const h=bgCmpHtml(STSEL);if(h){const info=d.querySelector('div');(info||d).insertAdjacentHTML('beforeend',h)}}}catch(e){}}}
if(typeof openMer=='function'){const _om=openMer;openMer=function(){_om.apply(this,arguments);try{const b=$('bm'),L=[];b.querySelectorAll('.stT').forEach(el=>{const m=/mer(Buy|Sell)\('([^']+)'/.exec(el.getAttribute('onclick')||'');if(!m)return;bgMark(el,m[2]);if(m[1]=='Buy'&&bgCmpRows(m[2])&&!L.includes(m[2]))L.push(m[2])});
  if(L.length){const h4=b.querySelector('h4');if(h4)h4.insertAdjacentHTML('beforebegin','<details class="bgMer"><summary>⚖ 사기 전에 비교 · 장비 '+L.length+'개</summary>'+L.map(id=>bgCmpHtml(id)).join('')+'</details>')}}catch(e){}}}
document.head.insertAdjacentHTML('beforeend',`<style>#bm .bgM{position:absolute;right:3px;top:3px;font-style:normal;font-size:11px;font-weight:800;line-height:1;padding:2px 3px;border-radius:5px;background:#000b}#bm .bgM.up{color:#7fe07f}#bm .bgM.dn{color:#ff8a7a}
#bm .cell,#bm .stT{position:relative}#bm .bgF{margin-left:auto}#bm .bgMer{margin:4px 0 8px;font-size:12.5px}#bm .bgMer summary{cursor:pointer;color:#ffd36a;padding:4px 0}#bm .stD .cmp{margin-top:6px}#bm .stT .bgM{right:auto;top:auto;left:3px;bottom:30px}</style>`);
