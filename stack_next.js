/* PROJECT LEGACY — stacks and a base stash with a size.
   Stacks: ammo 300 a stack · weapons, armour and gear never stack (one a slot) · everything else by what it is (see STK).
   The bag is still limited by weight; it now shows its stacks. The base stash is limited by slots (stacks):
   Lv1 30 slots … Lv9 220 slots, upgraded from the stash window. Things the base makes by itself (gardens, scavenging)
   may overflow it, but you cannot put more in while it is full.
   Loaded after deco_next.js. */
'use strict';
const STK_ID={food:10,water:10,bandage:20,medkit:5,pills:10,manual:5,fuel:10,tkn:999,dx1:5,dx2:1,rqitem:1};
function STK(id){if(W_BY[id])return 1;if(id in STK_ID)return STK_ID[id];if(/^vk_/.test(id))return 1;const c=catOf(id);if(c=='e')return 1;if(c=='a')return 300;
 if(/^(rn_|ao_)/.test(id))return 10;if(/^enh/.test(id))return 20;if(c=='c')return 10;const w=wtOf(id);return w>=1?20:w<=.1?100:50}
const stacksOf=(box,id)=>Math.ceil((box[id]|0)/STK(id));
const slotsUsed=box=>Object.keys(box).reduce((a,k)=>a+((box[k]|0)>0?stacksOf(box,k):0),0);
/* ---------- the base stash levels ---------- */
const STLV=[30,45,60,80,100,125,150,180,220];
const STCOST=[null,{wood:15,scrap:10},{wood:25,scrap:20},{wood:20,scrap:30,cloth:10},{scrap:40,steel:4},{scrap:50,steel:8,elec:4},{scrap:60,steel:12,elec:8},{scrap:80,steel:16,elec:12,tkn:20},{scrap:100,steel:24,elec:16,tkn:40}];
const stLv=()=>{const B=S.base;if(B.stLv==null){let l=1;const u=slotsUsed(B.st||{});while(l<9&&STLV[l-1]<u)l++;B.stLv=l}return B.stLv};
const stSlots=()=>STLV[stLv()-1];
const isBaseBox=box=>S&&S.base&&box===S.base.st;
/* how many of an item still fit in the base stash */
function stFits(id){const box=S.base.st,k=STK(id),n=box[id]|0,part=n%k?k-n%k:0,free=Math.max(0,stSlots()-slotsUsed(box));return part+free*k}
function stPutBase(id,n){const f=Math.min(n,stFits(id));if(f>0){S.base.st[id]=(S.base.st[id]|0)+f}return f}
/* ---------- the stash window: bag → box respects the slots · the level and upgrade on top ---------- */
{const _mv=stMove;stMove=function(n){if(STC=='base'&&STSIDE=='bag'&&STSEL){const k=STSEL,f=stFits(k);if(f<=0){msg('🗄 거점 보관함이 가득 찼어요 ('+stSlots()+'칸) · 보관함을 확장하세요');return openStash()}n=Math.min(n,f)}return _mv.call(this,n)}}
stAllIn=function(){const p=S.p,box=stBox(),base=STC=='base';let full=false,moved=0;for(const k of Object.keys(p.inv)){if(!'mac'.includes(catOf(k))||p.quick.includes(k)||stTab(k)=='up')continue;let n=p.inv[k]|0;if(n<=0)continue;
  if(base){n=Math.min(n,stFits(k));if(n<(p.inv[k]|0))full=true}if(n<=0)continue;box[k]=(box[k]||0)+n;invTake(p,k,n);moved+=n}
 msg(full?'🗄 보관함이 가득 차서 '+moved+'개만 넣었어요 · 보관함을 확장하세요':'🗄 보관함에 넣었어요');openStash();hud2()};
stashAll=function(){const pp=S.p,p=pp.inv;let full=false;Object.keys(p).filter(k=>'mac'.includes(catOf(k))&&!pp.quick.includes(k)).forEach(k=>{const n=p[k]|0;if(n<=0)return;const put=stPutBase(k,n);if(put<n)full=true;if(put)invTake(pp,k,put)});msg(full?'🗄 보관함이 가득 찼어요 · 일부만 넣었어요':'보관함에 넣었습니다');openBase()};
function stUpgrade(){const l=stLv();if(l>=9)return;const c=STCOST[l];if(!canPay(c))return msg('재료가 부족해요 · '+costTxt(c));pay(c);S.base.stLv=l+1;msg('🗄 거점 보관함 Lv'+(l+1)+' · '+stSlots()+'칸');openStash('base')}
{const _os=openStash;openStash=function(c){_os.apply(this,arguments);try{const b=$('bm');stSplit(b,'.stT',el=>{const m=/stPick\('([^']+)','([^']+)'/.exec(el.getAttribute('onclick')||'');return m?{id:m[1],n:+(el.querySelector('b')||{}).textContent||0}:null},(el,n)=>{const x=el.querySelector('b');if(x)x.textContent=n});
  if(STC!='base')return;const used=slotsUsed(S.base.st),max=stSlots(),l=stLv(),full=used>=max,h4=b.querySelector('h4');if(!h4)return;const small=h4.querySelector('small');if(small)small.innerHTML=Object.values(S.base.st).reduce((a,v)=>a+(v|0),0)+'개 · <b style="color:'+(used>max?'#ff6a5a':full?'#ffb04a':'#7fd07f')+'">'+used+'/'+max+'칸</b>';
  h4.insertAdjacentHTML('afterend','<div class="stLv"><span>🗄 보관함 Lv'+l+'/9 · '+max+'칸'+(used>max?' · <b style="color:#ff8a7a">넘침! 꺼내기 전엔 못 넣어요</b>':full?' · <b style="color:#ffb04a">가득 참</b>':'')+'</span>'+(l<9?'<button onclick="stUpgrade()" class="'+(canPay(STCOST[l])?'':'no')+'">확장 → '+STLV[l]+'칸 · '+costTxt(STCOST[l])+'</button>':'<small>최고 레벨</small>')+'</div>')}catch(e){}}}
/* one tile per stack (ammo 650 → 300 · 300 · 50, two pistols → two tiles) */
function stSplit(root,sel,read,write){root.querySelectorAll(sel).forEach(el=>{const r=read(el);if(!r||!r.id)return;const k=STK(r.id);if(r.n<=k)return;let left=r.n,first=true,prev=el;while(left>0){const n=Math.min(k,left);left-=n;if(first){write(el,n);first=false;continue}const c=el.cloneNode(true);write(c,n);c.classList.add('stk');c.querySelectorAll('span.e,em').forEach(x=>x.remove());if(el.onclick)c.onclick=el.onclick;prev.after(c);prev=c}})}
/* the bag shows its stacks too */
{const _ob=openBag;openBag=function(id){_ob.apply(this,arguments);try{const b=$('bm'),p=S.p;stSplit(b,'.grid .cell[data-i]',el=>({id:el.dataset.i,n:p.inv[el.dataset.i]|0}),(el,n)=>{let c=el.querySelector('span.c');if(n>1){if(!c){el.insertAdjacentHTML('beforeend','<span class="c"></span>');c=el.querySelector('span.c')}c.textContent=n}else if(c)c.remove()});
  b.querySelectorAll('.grid .cell.stk').forEach(c=>c.onclick=()=>openBag(c.dataset.i))}catch(e){}}}
/* the base window line */
{const _ob=openBase;openBase=function(){_ob.apply(this,arguments);try{const s=$('stash');if(s&&!s.querySelector('.stCap'))s.insertAdjacentHTML('beforeend','<div class="stCap">🗄 보관함 Lv'+stLv()+' · '+slotsUsed(S.base.st)+'/'+stSlots()+'칸</div>')}catch(e){}}}
document.head.insertAdjacentHTML('beforeend',`<style>#bm .stLv{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:2px 0 8px;font-size:12px}#bm .stLv span{flex:1}#bm .stLv button{padding:4px 10px;font-size:11.5px}#bm .stLv button.no{opacity:.45}#bm .stCap{font-size:11.5px;color:var(--mut);margin-top:4px}</style>`);
