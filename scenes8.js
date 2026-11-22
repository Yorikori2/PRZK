/* PROJECT LEGACY — toolbar sample: style picker. */
'use strict';
const T8=[];const at8=(ms,f)=>T8.push(setTimeout(f,ms));
const TBD={base:'지금처럼 왼쪽 가운데에 세로로 붙어 있어요',A:'왼쪽 아래 ☰ 손잡이를 위로 밀면 펼치고, 아래로 밀면 접혀요 (눌러도 돼요)',B:'툴바가 사라지고, 오른쪽 상호작용 버튼을 길게 누르면 부채꼴로 펼쳐져요 · 손가락을 밀어서 놓으면 선택',
 C:'지금 쓸 수 있는 버튼만 보여요 · 🧱 목재가 있을 때 · 🛠 만들 수 있는 게 있을 때 · 🏠 거점 안에서만',D:'맨 위 ◀ 버튼으로 접고 ▶로 다시 펼쳐요',AC:'평소엔 ☰ 손잡이만 · 펼치면 지금 쓸 수 있는 버튼만 나와요 (추천)'};
function scene8(m){T8.forEach(clearTimeout);T8.length=0;$('bm').dataset.m='';closeBase();PAUSE=false;const p=S.p;
 const f=baseFire();if(f){p.x=f.x;p.y=f.y+50;if(blocker(p.x,p.y,7))p.y+=30}Z.length=0;S.sa=1e9;p.inv.wood=0;p.inv.scrap=0;p.inv.cloth=0;tbSet(m);msg('🧰 '+TBN.find(t=>t[0]==m)[1]+' · '+TBD[m]);
 if(m=='C'||m=='AC'){if(m=='AC')at8(1200,()=>{TB.open=true;tbApply()});at8(3500,()=>{give({wood:4,scrap:3});msg('🪵 목재·고철을 주웠어요 → 🧱 바리케이드와 🛠 제작 버튼이 나타나요')});
  at8(7500,()=>{p.x+=700;if(blocker(p.x,p.y,7))p.y+=40;msg('🚶 거점을 벗어났어요 → 🏠 거점 버튼이 사라져요')})}
 if(m=='A')at8(1500,()=>{TB.open=true;tbApply();msg('☰ 위로 밀면 이렇게 펼쳐져요 · 버튼을 쓰면 자동으로 접혀요')});
 if(m=='B')at8(1500,()=>{tbFanOpen();msg('👆 상호작용 버튼을 길게 누르면 이렇게 펼쳐져요 · 밀어서 놓으면 선택 · 짧게 누르면 원래 상호작용')});
 if(m=='D')at8(1500,()=>{TB.fold=true;tbApply();msg('◀ 누르면 이렇게 접혀요 · ▶로 다시 펼쳐요')})}
function open8(){const b=$('bm');b.dataset.m='scene';PAUSE=true;
 b.innerHTML='<div class="sh"><h2>🧰 툴바 방식 고르기</h2><div class="wt">골라서 직접 써 보세요 · 아래 🧰 버튼으로 언제든 바꿀 수 있어요</div><button id="s8X">✕</button></div><div class="scl">'+TBN.map(([k,n])=>'<div class="scc'+(k=='AC'?' rec':'')+'" data-s8="'+k+'"><b>'+n+'</b><small>'+TBD[k]+'</small></div>').join('')+'</div>';
 b.style.display='block';b.querySelectorAll('[data-s8]').forEach(c=>c.onclick=()=>scene8(c.dataset.s8));$('s8X').onclick=()=>{$('bm').dataset.m='';closeBase();PAUSE=false}}
document.body.insertAdjacentHTML('beforeend','<button id="scB">🧰 툴바 방식</button>');
$('scB').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation()});$('scB').addEventListener('click',e=>{e.preventDefault();e.stopPropagation();if(run)open8()});
document.head.insertAdjacentHTML('beforeend',`<style>#scB{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(env(safe-area-inset-bottom,0px) + 8px);z-index:4;padding:6px 14px;font-size:13px;border-radius:99px;background:#4a3c14;border-color:#e0b03a;width:auto;max-width:none}
#bm .scl{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:5px;margin-top:8px}#bm .scc{padding:8px 10px;border-radius:10px;border:1px solid #ffffff1f;background:#ffffff0a;cursor:pointer}#bm .scc.rec{border-color:#7fd08a;background:#7fd08a14}#bm .scc b{display:block;font-size:13px}#bm .scc small{font-size:11px;color:var(--mut)}</style>`);
addEventListener('load',()=>setTimeout(()=>{try{localStorage.removeItem(SAVE)}catch(e){}start('S',false);const pg=S.pg;if(pg&&!pg.tr.length){pg.tr=['runner'];$('bm').dataset.m='';closeBase();PAUSE=false}open8()},50));
