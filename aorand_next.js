/* PROJECT LEGACY — sample: 옵션의 룬 — options are rolled at random.
   Three runes: 옵션의 룬 · 빛나는 옵션의 룬 · 찬란한 옵션의 룬. Use one on an open option slot of an armour piece:
   it rolls a random option that fits that part (never one the piece already has) with a random grade.
   On a filled slot it re-rolls it (the old option is gone). Rolling always works; the gamble is what you get.
   Loaded after armenh_next.js. */
'use strict';
const AOR={aor1:['옵션의 룬','u',[70,25,5],'#7fd07f'],aor2:['빛나는 옵션의 룬','e',[40,45,15],'#5aa8ff'],aor3:['찬란한 옵션의 룬','l',[0,60,40],'#ffb84a']};
for(const id in AOR){const[n,rar,w,c]=AOR[id];if(!I_BY[id]){const it=[id,n,'o',rar,.1,'방어구 옵션 칸에 쓰면 그 부위에 맞는 옵션이 무작위로 붙어요 · 등급 확률 Ⅰ '+w[0]+'% · Ⅱ '+w[1]+'% · Ⅲ '+w[2]+'% · 옵션이 있는 칸에 쓰면 다시 뽑아요'];ITEMS.push(it);I_BY[id]=it}
 IC[id]=()=>{R('#1d1714',5,3,14,18);R('#3a3f45',6,4,12,15);R('#2a2e33',8,17,8,3);R(c,10,6,4,2);R(c,13,8,2,3);R(c,11,10,3,2);R(c,11,13,2,2);if(id!='aor1'){R('#fff',7,5,1,1);R('#fff',16,15,1,1)}if(id=='aor3'){R('#fff',16,5,1,1);R('#fff',7,15,1,1)}}}
let AORSEL='aor1',AOLAST=null;
function aRoll(id,slot){const p=S.p,rn=AORSEL;if(!(p.inv[rn]>0))return msg('🎲 '+AOR[rn][0]+'이(가) 없어요');const pg=AE(),part=ARMX[id][0],cur=pg.aopt[id]=pg.aopt[id]||[];
 const have=cur.filter((r,j)=>r&&j!=slot).map(r=>r.slice(3,-1)),pool=Object.keys(AOPT).filter(k=>AOPT[k][2].includes(part)&&!have.includes(k));if(!pool.length)return msg('🎲 이 부위에 붙을 수 있는 옵션이 더 없어요');
 const k=pool[Math.random()*pool.length|0],w=AOR[rn][2],r=Math.random()*100,gr=r<w[0]?1:r<w[0]+w[1]?2:3,old=cur[slot];invTake(p,rn,1);cur[slot]='ao_'+k+gr;AOLAST={id,slot,k,gr};
 const o=AOPT[k];AERES=['ok','🎲 '+(old?'다시 뽑기':'부여')+' → '+o[0]+' '+o[1]+' '+ROMN[gr]+(gr==3?' ✨ 최고 등급!':'')+(old?' · 원래 '+AOPT[old.slice(3,-1)][1]+' '+ROMN[+old.slice(-1)]+'은(는) 사라졌어요':'')];openAEnh();hud2()}
{const _oa=openAEnh;openAEnh=function(sel){_oa(sel);const b=$('bm'),p=S.p,id=AESEL;if(!id)return;const h4=[...b.querySelectorAll('h4')].find(e=>/옵션 칸/.test(e.textContent));if(!h4)return;
  h4.insertAdjacentHTML('afterend','<div class="aorP">'+Object.keys(AOR).map(k=>'<span class="chip'+(AORSEL==k?' on':'')+'" data-aor="'+k+'"><img src="'+icon(k)+'">'+AOR[k][0]+' ×'+(p.inv[k]|0)+'<small>Ⅰ'+AOR[k][2][0]+' Ⅱ'+AOR[k][2][1]+' Ⅲ'+AOR[k][2][2]+'%</small></span>').join('')+'</div>');
  const sl=aSlots(aLv(id)),cur=(S.pg.aopt||{})[id]||[];b.querySelectorAll('.aeSl').forEach((e,i)=>{if(i>=sl)return;const fresh=AOLAST&&AOLAST.id==id&&AOLAST.slot==i;if(fresh)e.classList.add('rolled'+AOLAST.gr);e.insertAdjacentHTML('beforeend','<button class="aorB" data-roll="'+i+'" '+((p.inv[AORSEL]|0)>0?'':'disabled')+'>🎲 '+(cur[i]?'다시 뽑기':'부여')+'</button>')});
  b.querySelectorAll('[data-aor]').forEach(e=>e.onclick=()=>{AORSEL=e.dataset.aor;AOLAST=null;openAEnh()});b.querySelectorAll('[data-roll]').forEach(e=>e.onclick=()=>aRoll(id,+e.dataset.roll));
  /* the window now lists 옵션의 룬; the old fixed runes still work if you own some */
  const rh=[...b.querySelectorAll('h4')].find(e=>/가진 방어구 룬/.test(e.textContent));if(rh&&!b.querySelector('.aeRn'))rh.style.display='none',rh.nextElementSibling&&(rh.nextElementSibling.style.display='none')}}
document.head.insertAdjacentHTML('beforeend',`<style>#bm .aorP{display:flex;gap:5px;flex-wrap:wrap;margin:4px 0 6px}#bm .aorP .chip{display:flex;align-items:center;gap:4px;font-size:11px}#bm .aorP .chip img{width:18px;image-rendering:pixelated}#bm .aorP small{color:var(--mut);font-size:9.5px}
#bm .aorB{display:block;width:100%;margin-top:4px;padding:3px;font-size:11px}@keyframes aorF{0%{box-shadow:0 0 0 0 var(--rc)}40%{box-shadow:0 0 14px 4px var(--rc)}100%{box-shadow:0 0 0 0 var(--rc)}}#bm .aeSl.rolled1{--rc:#7fd07f;animation:aorF 1s}#bm .aeSl.rolled2{--rc:#5aa8ff;animation:aorF 1s 2}#bm .aeSl.rolled3{--rc:#ffb84a;animation:aorF 1s 3;border-color:#ffb84a}</style>`);
