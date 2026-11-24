/* PROJECT LEGACY — sample: storage window with pixel item tiles. See what is in the box, take just what you need
   (1 / 10 / all), or build a pick list and take it all at once with a weight check. Base stash and outpost stashes. */
'use strict';
const STAB=[['all','전체'],['food','음식·의료'],['ammo','탄약'],['mat','재료'],['gear','무기·장비'],['up','강화']];
function stTab(k){if(k.startsWith('rn_')||k.startsWith('enh')||k.startsWith('dt')||k.startsWith('dx'))return'up';if(W_BY[k])return'gear';const c=catOf(k);if(c=='a')return'ammo';if(c=='c')return'food';if(c=='e')return'gear';return'mat'}
let STC='base',STSEL=null,STSIDE='box',STT='all',STPICK=null;
const stBox=()=>STC=='op'?(opHere().o||{st:{}}).st:S.base.st;
const stName=()=>STC=='op'?'전초기지 보관함':'거점 보관함';
function openStash(c){if(c)STC=c;const b=$('bm'),p=S.p,box=stBox();b.dataset.m='stash';PAUSE=true;const W=weight(p),C=capacity(p);
 const rows=(src,side)=>{const L=Object.keys(src).filter(k=>(src[k]|0)>0&&(STT=='all'||stTab(k)==STT)).sort((a,b)=>stTab(a).localeCompare(stTab(b))||NM2(a).localeCompare(NM2(b)));
  if(!L.length)return'<p class="mut stE">비어 있어요</p>';return'<div class="stG">'+L.map(k=>{const it=I_BY[k]||W_BY[k],rar=it?it[3]:'c',eq=side=='bag'&&Object.values(p.eq).includes(k),pk=STPICK&&STPICK[k];
   return'<div class="stT r'+rar+(STSEL==k&&STSIDE==side?' on':'')+(pk?' pk':'')+'" onclick="stPick(\''+k+'\',\''+side+'\')"><img src="'+icon(k)+'"><b>'+(src[k]|0)+'</b>'+(eq?'<em>장착</em>':'')+(pk?'<u>✓'+pk+'</u>':'')+'<small>'+NM2(k)+'</small></div>'}).join('')+'</div>'};
 let h='<div class="sh"><h2>🗄 '+stName()+'</h2><div class="wt">가방 무게 <b style="color:'+(W>C?'#ff6a5a':'#7fd07f')+'">'+W.toFixed(1)+' / '+C+'kg</b>'+(STPICK?' · 📋 챙길 목록 '+Object.keys(STPICK).length+'종':'')+'</div><button onclick="closeBase()">✕</button></div>';
 h+='<div class="stTabs">'+STAB.map(([k,n])=>'<button class="'+(STT==k?'on':'')+'" onclick="STT=\''+k+'\';openStash()">'+n+'</button>').join('')+'</div>';
 h+='<h4>🗄 '+stName()+' <small class="mut">'+Object.values(box).reduce((a,b)=>a+(b|0),0)+'개</small><button class="stM" onclick="STPICK=STPICK?null:{};STSEL=null;openStash()">'+(STPICK?'목록 취소':'📋 챙길 목록 만들기')+'</button></h4>'+rows(box,'box');
 if(STPICK){const L=Object.entries(STPICK),add=L.reduce((a,[k,n])=>a+wtOf(k)*n,0);h+='<div class="stPk">'+(L.length?L.map(([k,n])=>'<span><img src="'+icon(k)+'">'+NM2(k)+' <button onclick="stAmt(\''+k+'\',-1)">−</button><b>'+n+'</b><button onclick="stAmt(\''+k+'\',1)">＋</button><button onclick="stAmt(\''+k+'\',10)">+10</button><button onclick="stAmt(\''+k+'\',-9999)">✕</button></span>').join(''):'<span class="mut">보관함에서 챙길 아이템을 누르세요 · 한 번 더 누르면 목록에서 빠져요 · 개수는 목록에서 − ＋ +10</span>')+
  '<div class="stPkB">가져간 뒤 무게 <b style="color:'+(W+add>C?'#ff6a5a':'#7fd07f')+'">'+(W+add).toFixed(1)+' / '+C+'kg</b><button '+(L.length?'':'disabled ')+'onclick="stTakeList()">🎒 목록 가져가기</button></div></div>'}
 if(STSEL&&!STPICK){const src=STSIDE=='box'?box:p.inv,n=src[STSEL]|0,it=I_BY[STSEL]||W_BY[STSEL];if(n>0)h+='<div class="stD"><img src="'+icon(STSEL)+'"><div><b>'+NM2(STSEL)+'</b> <small class="mut">'+(it&&RAR[it[3]]?RAR[it[3]][0]:'')+' · 개당 '+wtOf(STSEL)+'kg · '+n+'개</small><div class="mut" style="font-size:11.5px">'+(it&&it[5]&&typeof it[5]=='string'?it[5]:'')+'</div></div></div>'+
  '<div class="stMv">'+(STSIDE=='box'?'🎒 가방으로':'🗄 보관함으로')+[1,10,n].filter((v,i,a)=>v<=n&&a.indexOf(v)==i).map(v=>'<button onclick="stMove('+v+')">'+(v==n?'전부 '+v:v+'개')+'</button>').join('')+'</div>'}
 h+='<h4>🎒 가방 <button class="stM" onclick="stAllIn()">재료·음식·탄약 전부 넣기</button></h4>'+rows(p.inv,'bag');b.innerHTML=h;b.style.display='block'}
/* pick-list mode: tap adds the item (1), tap again takes it off the list; amounts are set on the list chips */
function stPick(k,side){if(lpSkip){lpSkip=0;return}if(STPICK&&side=='box'){if(STPICK[k])delete STPICK[k];else if((stBox()[k]|0)>0)STPICK[k]=1;return openStash()}STSEL=k;STSIDE=side;openStash()}
function stAmt(k,d){if(!STPICK||!STPICK[k])return;const m=stBox()[k]|0;STPICK[k]=Math.max(0,Math.min(m,STPICK[k]+d));if(!STPICK[k])delete STPICK[k];openStash()}
function stMove(n){const p=S.p,box=stBox(),k=STSEL;if(STSIDE=='box'){n=Math.min(n,box[k]|0);box[k]-=n;if(box[k]<=0)delete box[k];invAdd(p,k,n);msg('🎒 '+NM2(k)+' '+n+'개를 챙겼어요')}else{n=Math.min(n,p.inv[k]|0);invTake(p,k,n);box[k]=(box[k]||0)+n;msg('🗄 '+NM2(k)+' '+n+'개를 넣었어요')}
 const src=STSIDE=='box'?box:p.inv;if(!(src[STSEL]>0))STSEL=null;openStash();hud2()}
function stTakeList(){const p=S.p,box=stBox(),L=Object.entries(STPICK);for(const[k,n]of L){const m=Math.min(n,box[k]|0);box[k]-=m;if(box[k]<=0)delete box[k];invAdd(p,k,m)}msg('🎒 챙길 목록 '+L.length+'종을 가방에 넣었어요');STPICK=null;openStash();hud2()}
function stAllIn(){const p=S.p,box=stBox();for(const k of Object.keys(p.inv)){if(!'mac'.includes(catOf(k))||p.quick.includes(k)||stTab(k)=='up')continue;const n=p.inv[k]|0;if(n>0){box[k]=(box[k]||0)+n;invTake(p,k,n)}}msg('🗄 보관함에 넣었어요');openStash();hud2()}
/* long-press a tile in pick-list mode adds 10 */
let lpSkip=0;{let lp=null;document.addEventListener('pointerdown',e=>{const t=e.target.closest&&e.target.closest('#bm .stT');if(!t||!STPICK)return;lp=setTimeout(()=>{const m=/stPick\('([^']+)'/.exec(t.getAttribute('onclick'));if(m){const box=stBox();STPICK[m[1]]=Math.min(box[m[1]]|0,10);openStash();lpSkip=1}},450)},true);document.addEventListener('pointerup',()=>clearTimeout(lp),true)}
/* base window: open the new storage view */
{const _ob=openBase;openBase=function(){_ob.apply(this,arguments);const s=$('stash');if(s&&!$('stOpen'))s.insertAdjacentHTML('afterbegin','<button id="stOpen" style="float:right;padding:4px 10px;font-size:12px" onclick="openStash(\'base\')">🗄 아이템 보기 · 골라 꺼내기</button>')}}
document.head.insertAdjacentHTML('beforeend',`<style>
#bm .stTabs{display:flex;gap:4px;overflow-x:auto;margin:6px 0}#bm .stTabs button{flex:0 0 auto;padding:5px 10px;font-size:12px;border-radius:99px}#bm .stTabs button.on{background:#e0b03a33;border-color:#e0b03a}
#bm h4 .stM{float:right;padding:3px 9px;font-size:11.5px;border-radius:8px}
#bm .stG{display:grid;grid-template-columns:repeat(auto-fill,minmax(64px,1fr));gap:5px}#bm .stE{margin:6px 0}
#bm .stT{position:relative;padding:4px 3px 3px;border-radius:9px;background:#ffffff0a;border:1px solid #ffffff1c;text-align:center;cursor:pointer;user-select:none;-webkit-user-select:none}
#bm .stT img{width:40px;height:40px;image-rendering:pixelated;display:block;margin:0 auto;pointer-events:none}#bm .stT b{position:absolute;right:4px;top:3px;font-size:11px;background:#000a;padding:0 4px;border-radius:5px}
#bm .stT small{display:block;font-size:10px;line-height:1.2;height:2.4em;overflow:hidden;color:#ddd}#bm .stT em{position:absolute;left:3px;top:3px;font-size:9px;font-style:normal;background:#2f6b2f;padding:0 3px;border-radius:4px}
#bm .stT u{position:absolute;left:3px;bottom:26px;text-decoration:none;font-size:10px;background:#e0b03a;color:#000;padding:0 4px;border-radius:5px}
#bm .stT.on{border-color:#ffd36a;background:#e0b03a22}#bm .stT.pk{border-color:#7fd07f}
#bm .stT.ru{box-shadow:inset 0 -3px #5fbf6a}#bm .stT.rr{box-shadow:inset 0 -3px #4a9ae0}#bm .stT.re{box-shadow:inset 0 -3px #b06ae0}#bm .stT.rl{box-shadow:inset 0 -3px #f0a030}
#bm .stD{display:flex;gap:8px;align-items:center;margin-top:8px;padding:6px;border-radius:10px;background:#ffffff0c}#bm .stD img{width:48px;height:48px;image-rendering:pixelated}
#bm .stMv{display:flex;gap:5px;align-items:center;margin:6px 0;font-size:12.5px;flex-wrap:wrap}#bm .stMv button{padding:7px 12px;border-radius:9px}
#bm .stPk{margin-top:6px;padding:6px;border-radius:10px;border:1px dashed #7fd07f88;display:flex;flex-wrap:wrap;gap:4px;font-size:12px}#bm .stPk span{display:inline-flex;align-items:center;gap:3px;background:#ffffff10;border-radius:7px;padding:2px 6px}#bm .stPk span button{padding:1px 6px;font-size:11px;border-radius:5px;width:auto;min-width:0}#bm .stPk span b{min-width:18px;text-align:center}#bm .stPk img{width:20px;height:20px;image-rendering:pixelated}
#bm .stPkB{width:100%;display:flex;justify-content:space-between;align-items:center;margin-top:4px}#bm .stPkB button{padding:7px 12px;border-radius:9px;background:#2f6b2f}
</style>`);
