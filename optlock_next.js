/* PROJECT LEGACY — sample: option lock (opinion 2) and weapon option runes (opinion 3).
   · Lock: tap 🔓 on an option to lock it. [🎲 모두 다시 뽑기] re-rolls every unlocked open slot with ONE option rune,
     plus one 보호 부적 for each locked slot. Rolling a single slot still costs one rune and needs no lock.
   · 무기 옵션의 룬 (three kinds): roll a random weapon rune (화염 · 냉기 · 감전 · 흡혈 · 구역 사냥꾼 · 처형, grade Ⅰ~Ⅳ)
     into a weapon's rune slot, re-roll it, lock it — the same way as armour.
   Loaded after aorand_next.js. */
'use strict';
const WOR={wor1:['무기 옵션의 룬','u',[60,30,9,1],'#ff8a3a'],wor2:['빛나는 무기 옵션의 룬','e',[25,45,25,5],'#ff5a6a'],wor3:['찬란한 무기 옵션의 룬','l',[0,30,45,25],'#ffd36a']};
for(const id in WOR){const[n,rar,w,c]=WOR[id];if(!I_BY[id]){const it=[id,n,'r',rar,.1,'무기 룬 칸에 쓰면 무작위 인챈트 · 등급 Ⅰ '+w[0]+'% · Ⅱ '+w[1]+'% · Ⅲ '+w[2]+'% · Ⅳ '+w[3]+'%'];ITEMS.push(it);I_BY[id]=it}
 IC[id]=()=>{R('#1d1714',5,3,14,18);R('#2a2e33',6,4,12,15);R(c,9,6,6,2);R(c,11,6,2,10);R(c,9,13,6,2);R('#fff',7,5,1,1);if(id!='wor1')R('#fff',16,16,1,1);if(id=='wor3'){R('#fff',16,5,1,1);R('#fff',7,16,1,1)}}}
const pickGr=w=>{let r=Math.random()*100;for(let i=0;i<w.length;i++){r-=w[i];if(r<0)return i+1}return w.length};
/* fill the given slots with distinct random keys from pool, keeping `keep` (other slots' keys) out */
function rollSlots(arr,slots,pool,keep,mk2){const used=new Set(keep);for(const i of slots){const L=pool.filter(k=>!used.has(k));if(!L.length)break;const k=L[Math.random()*L.length|0];used.add(k);arr[i]=mk2(k)}}
/* ---------- armour: locks + roll all ---------- */
const aLock=id=>{const pg=AE();pg.alock=pg.alock||{};return pg.alock[id]=pg.alock[id]||[]};
function aRollAll(id){const p=S.p,rn=AORSEL,pg=AE(),sl=aSlots(aLv(id)),cur=pg.aopt[id]=pg.aopt[id]||[],lk=aLock(id),locked=[...Array(sl).keys()].filter(i=>lk[i]&&cur[i]),free=[...Array(sl).keys()].filter(i=>!locked.includes(i));
 if(!free.length)return msg('🔒 모든 칸이 잠겨 있어요');if(!(p.inv[rn]>0))return msg('🎲 '+AOR[rn][0]+'이(가) 없어요');if((p.inv.enhg|0)<locked.length)return msg('🔒 잠근 칸 '+locked.length+'개 = 보호 부적 '+locked.length+'개가 필요해요');
 invTake(p,rn,1);if(locked.length)invTake(p,'enhg',locked.length);const part=ARMX[id][0],pool=Object.keys(AOPT).filter(k=>AOPT[k][2].includes(part)),w=AOR[rn][2];
 rollSlots(cur,free,pool,locked.map(i=>cur[i].slice(3,-1)),k=>'ao_'+k+pickGr(w));AOLAST={id,slot:-1};AERES=['ok','🎲 '+free.length+'칸 다시 뽑기 → '+free.map(i=>{const r=cur[i];return AOPT[r.slice(3,-1)][0]+' '+AOPT[r.slice(3,-1)][1]+' '+ROMN[+r.slice(-1)]}).join(' · ')+(locked.length?' · 🔒 '+locked.length+'칸 유지 (부적 '+locked.length+')':'')];openAEnh();hud2()}
{const _oa=openAEnh;openAEnh=function(sel){_oa(sel);const b=$('bm'),p=S.p,id=AESEL;if(!id)return;const sl=aSlots(aLv(id)),cur=(S.pg.aopt||{})[id]||[],lk=aLock(id);
  b.querySelectorAll('.aeSl').forEach((e,i)=>{if(i>=sl||!cur[i])return;e.insertAdjacentHTML('afterbegin','<span class="lkB'+(lk[i]?' on':'')+'" data-lk="'+i+'">'+(lk[i]?'🔒':'🔓')+'</span>');if(lk[i]){const rb=e.querySelector('[data-roll]');if(rb){rb.disabled=true;rb.textContent='🔒 잠김'}e.classList.add('locked')}});
  if(sl>=2){const L=[...Array(sl).keys()].filter(i=>lk[i]&&cur[i]).length,box=b.querySelector('.aeS');if(box)box.insertAdjacentHTML('afterend','<button id="aAll" class="allB">🎲 잠그지 않은 칸 모두 다시 뽑기 · '+AOR[AORSEL][0]+' 1'+(L?' + 보호 부적 '+L+' ('+(p.inv.enhg|0)+')':'')+'</button>');$('aAll').onclick=()=>aRollAll(id)}
  b.querySelectorAll('[data-lk]').forEach(e=>e.onclick=ev=>{ev.stopPropagation();const i=+e.dataset.lk;lk[i]=!lk[i];openAEnh()})}}
/* ---------- weapons: option runes, locks, roll all ---------- */
let WORSEL='wor1',WOLAST=null;
const wLock=id=>{const pg=EP();pg.wlock=pg.wlock||{};return pg.wlock[id]=pg.wlock[id]||[]};
function wRoll(id,slots){const p=S.p,rn=WORSEL,pg=EP(),sl=ENH.slots(enhLv(id)),a=pg.ench[id]=(pg.ench[id]||[]).slice(0,sl),lk=wLock(id),locked=[...Array(sl).keys()].filter(i=>lk[i]&&a[i]&&!slots.includes(i));
 if(!(p.inv[rn]>0))return msg('🎲 '+WOR[rn][0]+'이(가) 없어요');const need=slots.length>1?locked.length:0;if((p.inv.enhg|0)<need)return msg('🔒 잠근 칸 '+need+'개 = 보호 부적 '+need+'개가 필요해요');
 invTake(p,rn,1);if(need)invTake(p,'enhg',need);const keep=[...Array(sl).keys()].filter(i=>!slots.includes(i)&&a[i]).map(i=>a[i].slice(3,-1)),w=WOR[rn][2],old=slots.map(i=>a[i]);
 rollSlots(a,slots,RK,keep,k=>'rn_'+k+pickGr(w));for(let i=0;i<sl;i++)if(a[i]===undefined)a[i]=null;WOLAST={id,slots};
 ENRES=['ok','🎲 '+slots.map(i=>{const r=a[i],t=r.slice(3,-1),g2=+r.slice(-1);return RUNES[t][0]+' '+RUNES[t][1]+' '+ROM[g2]+(g2==4?' ✨':'')}).join(' · ')+(old.some(Boolean)?' · 원래 룬은 사라졌어요':'')+(need?' · 🔒 '+need+'칸 유지':'')];try{s3dirty()}catch(e){}openEnh();hud2()}
{const _oe=openEnh;openEnh=function(sel){_oe(sel);const b=$('bm'),p=S.p,id=ENSEL;if(!id||b.dataset.m!='enh')return;const h4=[...b.querySelectorAll('h4')].find(e=>/룬 칸/.test(e.textContent));if(!h4)return;
  const sl=ENH.slots(enhLv(id)),a=enchOf(id),lk=wLock(id);
  h4.insertAdjacentHTML('afterend','<div class="aorP">'+Object.keys(WOR).map(k=>'<span class="chip'+(WORSEL==k?' on':'')+'" data-wor="'+k+'"><img src="'+icon(k)+'">'+WOR[k][0]+' ×'+(p.inv[k]|0)+'<small>Ⅰ'+WOR[k][2][0]+' Ⅱ'+WOR[k][2][1]+' Ⅲ'+WOR[k][2][2]+' Ⅳ'+WOR[k][2][3]+'%</small></span>').join('')+'</div>');
  b.querySelectorAll('.enSl').forEach((e,i)=>{if(i>=sl)return;if(WOLAST&&WOLAST.id==id&&WOLAST.slots.includes(i))e.classList.add('rolled'+Math.min(3,+(a[i]||'0').slice(-1)));
   if(a[i])e.insertAdjacentHTML('afterbegin','<span class="lkB'+(lk[i]?' on':'')+'" data-wlk="'+i+'">'+(lk[i]?'🔒':'🔓')+'</span>');
   e.insertAdjacentHTML('beforeend','<button class="aorB" data-wroll="'+i+'" '+(lk[i]&&a[i]?'disabled':(p.inv[WORSEL]|0)>0?'':'disabled')+'>'+(lk[i]&&a[i]?'🔒 잠김':'🎲 '+(a[i]?'다시 뽑기':'부여'))+'</button>')});
  if(sl>=2){const L=[...Array(sl).keys()].filter(i=>lk[i]&&a[i]).length,box=b.querySelector('.enS');if(box)box.insertAdjacentHTML('afterend','<button id="wAll" class="allB">🎲 잠그지 않은 칸 모두 다시 뽑기 · '+WOR[WORSEL][0]+' 1'+(L?' + 보호 부적 '+L+' ('+(p.inv.enhg|0)+')':'')+'</button>');$('wAll').onclick=()=>{const free=[...Array(sl).keys()].filter(i=>!(lk[i]&&a[i]));if(!free.length)return msg('🔒 모든 칸이 잠겨 있어요');wRoll(id,free)}}
  b.querySelectorAll('[data-wor]').forEach(e=>e.onclick=()=>{WORSEL=e.dataset.wor;WOLAST=null;openEnh()});
  b.querySelectorAll('[data-wroll]').forEach(e=>e.onclick=ev=>{ev.stopPropagation();wRoll(id,[+e.dataset.wroll])});
  b.querySelectorAll('[data-wlk]').forEach(e=>e.onclick=ev=>{ev.stopPropagation();const i=+e.dataset.wlk;lk[i]=!lk[i];openEnh()})}}
document.head.insertAdjacentHTML('beforeend',`<style>#bm .lkB{float:right;cursor:pointer;font-size:13px;padding:0 3px;border-radius:6px;opacity:.6}#bm .lkB.on{opacity:1;background:#3a3010}#bm .aeSl.locked,#bm .enSl:has(.lkB.on){border-color:#ffd36a;border-style:solid}
#bm .allB{display:block;width:100%;margin:6px 0;padding:6px;font-size:12px;background:#2a2410;border-color:#ffd36a66}#bm .enSl .aorB{display:block;width:100%;margin-top:4px;padding:3px;font-size:11px}
#bm .enSl.rolled1{--rc:#7fd07f;animation:aorF 1s}#bm .enSl.rolled2{--rc:#5aa8ff;animation:aorF 1s 2}#bm .enSl.rolled3{--rc:#ffb84a;animation:aorF 1s 3;border-color:#ffb84a}</style>`);
