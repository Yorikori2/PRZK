/* ---------- ⚙ settings window: four big groups (UI 편집 · 게임 설정 · 게임 재시작 · 메인메뉴) ---------- */
{
const css=`#bm .stg{display:grid;gap:10px;margin-top:8px}
#bm .stc{border-radius:14px;padding:10px 12px 12px;background:linear-gradient(180deg,#ffffff0d,#ffffff05);border:1px solid #ffffff1c}
#bm .stc h3{margin:0 0 2px;font-size:14px;display:flex;align-items:center;gap:8px}#bm .stc h3 .ic{width:28px;height:28px;border-radius:9px;display:grid;place-items:center;font-size:15px;background:#ffffff10;border:1px solid var(--c,#ffd36a)}#bm .stc h3{color:var(--c,#ffd36a)}
#bm .stc .ds{font-size:11px;color:var(--mut);margin:0 0 8px 36px}
#bm .str{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin:6px 0 0}#bm .str>i{font-style:normal;font-size:12px;color:var(--mut);min-width:78px}
#bm .stc button{padding:7px 11px;font-size:12.5px;border-radius:10px}#bm .stc button.on{background:#5a4a1a;border-color:#ffd36a;color:#ffe7a8}
#bm .stc button.big{width:100%;height:auto;padding:11px;font-size:13.5px;border-radius:11px}#bm .stc button.dng{background:#3a1512;border-color:#a8453a;color:#ffc4bb}#bm .stc button.dng.warn{background:#6a1d16;border-color:#ff6a5a;color:#fff}
#bm .stc .two{display:grid;grid-template-columns:1fr 1fr;gap:6px}`;
document.head.insertAdjacentHTML('beforeend','<style>'+css+'</style>');
/* the walk/run row and the old restart row leave the UI-editor bar: they live here now */
const old=document.getElementById('mvSet');if(old)old.remove();
const MV=[['wpn','무기칸 위'],['two','버튼 2개'],['dtap','두 번 톡'],['auto','자동']];
const card=(c,ic,t,ds,body)=>'<div class="stc" style="--c:'+c+'"><h3><span class="ic">'+ic+'</span>'+t+'</h3><div class="ds">'+ds+'</div>'+body+'</div>';
let armT=-1e9;
window.openSet=function(){const b=document.getElementById('bm');b.dataset.m='set';
 const snd=typeof SND!='undefined'?SND:true;
 b.innerHTML='<div class="sh"><h2>⚙ 설정</h2><div class="wt">게임은 이 창이 열린 동안에도 흘러가요</div><button onclick="closeBase()">✕</button></div><div class="stg">'+
  card('#6ab8ff','🎛','UI 편집','버튼·창을 끌어서 옮기고 크기·잠금·투명도를 바꿔요','<button class="big" data-s="ui">🖐 화면 배치 바꾸기</button>')+
  card('#7ad67a','🎮','게임 설정','움직임과 소리','<div class="str" id="mvSet"><i>걷기 · 달리기</i>'+MV.map(([k,n])=>'<button data-mvs="'+k+'">'+n+'</button>').join('')+'</div>'+
   '<div class="str"><i>소리</i><button data-s="snd" class="'+(snd?'on':'')+'">'+(snd?'🔊 켜짐':'🔇 꺼짐')+'</button>'+(typeof openMixer=='function'?'<button data-s="mix">🎚 종류별 크기</button>':'')+'</div>')+
  card('#ffb34a','🔄','게임 재시작','지금 판을 다시 하거나 아예 처음부터','<div class="two"><button data-s="rl">↩ 마지막 저장에서 다시</button><button class="dng" data-s="new">🆕 처음부터 새 게임</button></div>')+
  card('#c9a2ff','🏠','메인메뉴','저장하고 타이틀 화면으로 나가요','<button class="big" data-s="menu">🚪 저장하고 메인메뉴로</button>')+'</div>';
 b.style.display='block';if(typeof mvSetPaint=='function')mvSetPaint();
 b.querySelectorAll('[data-mvs]').forEach(x=>x.onclick=e=>{e.stopPropagation();mvStyle(x.dataset.mvs);mvSetPaint()});
 b.querySelectorAll('[data-s]').forEach(x=>x.onclick=e=>{e.stopPropagation();const k=x.dataset.s;
  if(k=='ui'){closeBase();if(typeof uiEdit=='function')uiEdit(true)}
  else if(k=='snd'){SND=!SND;try{localStorage.setItem('pl_snd',SND?'1':'0')}catch(_){}const sb=document.getElementById('snd');if(sb)sb.textContent=SND?'🔊':'🔇';if(SND&&typeof acx=='function')acx();openSet()}
  else if(k=='mix')openMixer();
  else if(k=='rl'){try{sessionStorage.setItem('rsCont','1')}catch(_){}run=false;location.reload()}
  else if(k=='menu'){try{if(run&&typeof save=='function')save()}catch(_){}location.reload()}
  else if(k=='new'){if(performance.now()-armT>4000){armT=performance.now();x.textContent='⚠ 저장이 지워져요 · 한 번 더';x.classList.add('warn');setTimeout(()=>{if(performance.now()-armT>=3900&&x.isConnected){x.textContent='🆕 처음부터 새 게임';x.classList.remove('warn')}},4000);return}
   run=false;try{localStorage.removeItem(SAVE)}catch(_){}location.reload()}})};
/* ⚙ now opens this window instead of jumping straight into the UI editor */
const ue=document.getElementById('uiE');if(ue){ue.title='설정';ue.addEventListener('pointerdown',e=>{e.preventDefault();e.stopImmediatePropagation();if(run&&!(typeof UIE!='undefined'&&UIE.on)){const bm=document.getElementById('bm');if(bm.style.display=='block'&&bm.dataset.m=='set')closeBase();else openSet()}},true)}
/* "마지막 저장에서 다시": come straight back into the saved game after the reload */
try{if(sessionStorage.getItem('rsCont')){sessionStorage.removeItem('rsCont');addEventListener('load',()=>setTimeout(()=>{try{if(localStorage.getItem(SAVE))start(0,true)}catch(e){}},150))}}catch(e){}
}
