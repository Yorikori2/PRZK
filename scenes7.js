/* PROJECT LEGACY — rainy-day water + sound visualisation sample: scene picker. */
'use strict';
const T7=[];const at7=(ms,f)=>T7.push(setTimeout(f,ms));
function reset7(){T7.forEach(clearTimeout);T7.length=0;spd=1;jp=null;jx=jy=0;S.wx=null;Z.length=0;S.alarm=null;S.sa=1e9;const p=S.p;p.hp=MHP(p);p.food=p.water=100;$('bm').dataset.m='';closeBase();PAUSE=false}
function scene7(k){const p=S.p;reset7();
 if(k=='water'){S.base.lv.water=3;if(typeof rebuildBase=='function')rebuildBase();const f=baseFire();if(f){p.x=f.x;p.y=f.y+50;if(blocker(p.x,p.y,7))p.y+=30}S.t=900;const st=S.base.st;
  const run=(rain,ms,label,cb)=>{if(rain)setRain(true);else S.wx=null;const w0=st.water||0;spd=64;msg(label);at7(ms,()=>{cb((st.water||0)-w0)})};
  run(false,7000,'⛅ 1) 맑은 날 · 시간을 64배로 7초 돌려요 · 물 저장: 급수탑 Lv 3',dry=>{msg('⛅ 맑은 날 7초: 물 +'+dry+' · 이제 비를 내려요');at7(1200,()=>run(true,7000,'🌧 2) 비 오는 날 · 같은 7초',wet=>{spd=1;msg('결과: 맑음 물 +'+dry+' · 비 물 +'+wet+' (×2)');openBase()}))})}
 if(k=='vis'){S.t=1900;VIS.cap=1;VIS.arrows=1;VIS.ring=1;try{localStorage.setItem('pl_vis',JSON.stringify(VIS))}catch(e){}visApply();ZS5.last.clear();
  const put7=(look,d,a)=>{for(let r=d;r>200;r-=40){const x=p.x+Math.cos(a)*r,y=p.y+Math.sin(a)*r;if(!blocker(x,y,8)){mk(x,y,{look,w:1});return}}};
  for(let i=0;i<3;i++)put7('dog',700,Math.PI+(i-1)*.15);put7('runner',650,0);put7('screamer',600,-Math.PI/2);
  msg('💬 소리 자막 켜짐 · 화면 밖 소리가 방향과 함께 글로 떠요 (소리를 꺼도 보여요)');at7(5000,()=>{msg('🎚 🔊를 길게 누르면 화살표 · 발소리 원 · 자막을 켜고 끌 수 있어요');openMixer()})}
 hud2()}
const SC7=[['water','🌧 비 오는 날 빗물 받이','맑은 날과 비 오는 날 물이 쌓이는 양 비교 (시간 64배)'],['vis','💬 소리 자막 · 화살표','화면 밖에서 감염견 · 러너 · 비명 좀비가 다가와요 · 소리를 꺼도 글로 보여요']];
function open7(){const b=$('bm');b.dataset.m='scene';PAUSE=true;
 b.innerHTML='<div class="sh"><h2>💡 의견 샘플</h2><div class="wt">비 오는 날 빗물 받이 ×2 · 소리 시각화 설정</div><button id="s7X">✕</button></div><div class="scl">'+SC7.map(([k,n,d])=>'<div class="scc" data-s7="'+k+'"><b>'+n+'</b><small>'+d+'</small></div>').join('')+'</div>';
 b.style.display='block';b.querySelectorAll('[data-s7]').forEach(c=>c.onclick=()=>{$('bm').dataset.m='';closeBase();PAUSE=false;acx();scene7(c.dataset.s7)});$('s7X').onclick=()=>{$('bm').dataset.m='';closeBase();PAUSE=false}}
document.body.insertAdjacentHTML('beforeend','<button id="scB">💡 장면</button>');
$('scB').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation()});$('scB').addEventListener('click',e=>{e.preventDefault();e.stopPropagation();if(run)open7()});
document.head.insertAdjacentHTML('beforeend',`<style>#scB{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(env(safe-area-inset-bottom,0px) + 8px);z-index:4;padding:6px 14px;font-size:13px;border-radius:99px;background:#4a3c14;border-color:#e0b03a;width:auto;max-width:none}
#bm .scl{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:5px;margin-top:8px}#bm .scc{padding:8px 10px;border-radius:10px;border:1px solid #ffffff1f;background:#ffffff0a;cursor:pointer}#bm .scc b{display:block;font-size:13px}#bm .scc small{font-size:11px;color:var(--mut)}</style>`);
addEventListener('load',()=>setTimeout(()=>{try{localStorage.removeItem(SAVE)}catch(e){}start('S',false);const pg=S.pg;if(pg&&!pg.tr.length){pg.tr=['runner'];$('bm').dataset.m='';closeBase();PAUSE=false}open7()},50));
