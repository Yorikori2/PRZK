/* PROJECT LEGACY — footsteps & ambience sample: scene picker. */
'use strict';
const rf6=(x,y,a,L)=>{for(let t=16;t<=L;t+=8)if(blocker(x+Math.cos(a)*t,y+Math.sin(a)*t,9))return false;return true};
let LANE=null;
function findLane(){const p=S.p,sx=p.x,sy=p.y,fp=baseFire();let best=null,bd=1e9;for(let y=Math.max(300,sy-1800);y<Math.min(WH-300,sy+1800);y+=40)for(let x=Math.max(400,sx-1800);x<Math.min(WW-400,sx+1800);x+=40){if(blocker(x,y,9)||inBase(x,y)||(fp&&Math.hypot(x-fp.x,y-fp.y)<650))continue;
 for(const a of[0,Math.PI/2]){if(!rf6(x,y,a,360)||!rf6(x,y,a+Math.PI,360))continue;const n=a+Math.PI/2;for(const sd of[n,n+Math.PI]){const spots=[-1,0,1].map(i=>[x+Math.cos(a)*i*150+Math.cos(sd)*175,y+Math.sin(a)*i*150+Math.sin(sd)*175]);if(spots.some(([qx,qy])=>blocker(qx,qy,9)||!rf6(qx,qy,sd+Math.PI,150)))continue;const d=Math.hypot(x-sx,y-sy);if(d<bd){bd=d;best={x,y,a,side:sd}}}}}return best}
const T6=[];const at6=(ms,f)=>T6.push(setTimeout(f,ms));
function reset6(){T6.forEach(clearTimeout);T6.length=0;jp=null;jx=jy=0;S.wx=null;Z.length=0;S.alarm=null;const p=S.p;p.hp=MHP(p);p.food=p.water=100;Object.assign(S4,{slow:0,kd:0,burn:0,proj:[],pud:[],gas:[]});S.sa=1e9;$('bm').dataset.m='';closeBase();PAUSE=false}
function drive(vx,vy){jp=-1;jx=vx;jy=vy}
function scene6(k){const p=S.p;reset6();
 if(k=='walk'||k=='rainwalk'){S.t=900;if(k=='rainwalk')setRain(true);if(!LANE)LANE=findLane();const L=LANE;p.x=L.x-Math.cos(L.a)*260;p.y=L.y-Math.sin(L.a)*260;
  for(let i=0;i<3;i++){const cx=L.x+Math.cos(L.a)*(i-1)*150+Math.cos(L.side)*175,cy=L.y+Math.sin(L.a)*(i-1)*150+Math.sin(L.side)*175;if(!blocker(cx,cy,8)){mk(cx,cy,{look:'civ'+(i+1)});const z=Z[Z.length-1];z.x=cx;z.y=cy;z.al=0;z.demo=1}}
  msg('🤫 1) 살금살금 걷기 · 옆의 좀비 3마리를 지나갑니다');at6(300,()=>drive(Math.cos(L.a)*.5,Math.sin(L.a)*.5));
  at6(5600,()=>{drive(0,0);const n=Z.filter(z=>z.demo&&z.al>0||z.demo&&Math.hypot(z.x-p.x,z.y-p.y)<150).length;msg('🧍 걷는 동안 알아챈 좀비: '+n+'마리 · 이번엔 달려서 돌아갑니다')});
  at6(7000,()=>{msg('🏃 2) 달리기 · 발소리가 '+(rainNow()?'112px (비)':'160px')+'까지 퍼져요');drive(-Math.cos(L.a),-Math.sin(L.a))});at6(9600,()=>{drive(0,0);jp=null;msg('🏃 달리자 좀비들이 몰려옵니다 · 이제 직접 조이스틱으로 해 보세요 (살짝 = 걷기, 끝까지 = 달리기)')})}
 if(k=='day'){S.t=900;if(!LANE)LANE=findLane();p.x=LANE.x;p.y=LANE.y;msg('☀ 낮 · 새소리와 가벼운 바람')}
 if(k=='night'){S.t=1900;if(!LANE)LANE=findLane();p.x=LANE.x;p.y=LANE.y;msg('🌙 밤 · 풀벌레 4마리가 찌르르 · 좀비가 가까이 오면 풀벌레가 조용해져요')}
 if(k=='rain'){S.t=1100;if(!LANE)LANE=findLane();p.x=LANE.x;p.y=LANE.y;setRain(true);msg('🌧 비 오는 날 · 빗소리 · 시야 가장자리가 어두워지고 좀비가 소리를 30% 덜 들어요')}
 if(k=='fire'){S.t=1900;const f=baseFire();if(f){p.x=f.x;p.y=f.y+40;if(blocker(p.x,p.y,7))p.y+=30}msg('🔥 거점 모닥불 · 멀어지면 소리가 줄어들어요')}
 if(k=='indoor'){S.t=900;const rs=W0.roofs.filter(r=>r.w>180&&r.h>160);for(const r of rs){const x=r.x+r.w/2,y=r.y+r.h/2;if(!blocker(x,y,8)){p.x=x;p.y=y;break}}msg('🏚 실내 · 바깥소리가 먹먹해지고 물방울 소리 · 발소리도 바닥 소리로 바뀌어요')}
 if(k=='mixer'){openMixer();return}
 hud2()}
const SC6=[['walk','👣 발소리: 걷기 vs 달리기','자동으로 좀비 옆을 걸어서 지나간 뒤 달려서 돌아와요'],['day','☀ 낮','새소리 · 가벼운 바람'],['night','🌙 밤','풀벌레가 찌르르 · 좀비가 다가오면 뚝 그쳐요'],['rain','🌧 비 오는 날 (날씨)','빗소리 · 빗줄기 · 시야 어두움 · 좀비 청각 -30%'],['rainwalk','🌧 빗속 걷기 vs 달리기','비가 오면 발소리가 112px까지만 퍼져요'],['mixer','🎚 소리 설정','🔊 버튼을 길게 누르면 열리는 창 · 종류별 크기 조절'],['fire','🔥 거점 모닥불','가까울수록 크게 타닥타닥'],['indoor','🏚 실내','바깥소리 먹먹 · 물방울 · 바닥 발소리']];
function open6(){const b=$('bm');b.dataset.m='scene';PAUSE=true;
 b.innerHTML='<div class="sh"><h2>👣 발소리 · 환경음</h2><div class="wt">소리를 켜고 보세요 · 화면 위 칩에 걷기/달리기와 지금 환경이 표시돼요 · 🔊 길게 누르기 = 소리 설정</div><button id="s6X">✕</button></div><div class="scl">'+SC6.map(([k,n,d])=>'<div class="scc" data-s6="'+k+'"><b>'+n+'</b><small>'+d+'</small></div>').join('')+'</div>';
 b.style.display='block';b.querySelectorAll('[data-s6]').forEach(c=>c.onclick=()=>{$('bm').dataset.m='';closeBase();PAUSE=false;acx();ambInit();scene6(c.dataset.s6)});$('s6X').onclick=()=>{$('bm').dataset.m='';closeBase();PAUSE=false}}
document.body.insertAdjacentHTML('beforeend','<button id="scB">👣 장면</button>');
$('scB').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation()});$('scB').addEventListener('click',e=>{e.preventDefault();e.stopPropagation();if(run)open6()});
document.head.insertAdjacentHTML('beforeend',`<style>#scB{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(env(safe-area-inset-bottom,0px) + 8px);z-index:4;padding:6px 14px;font-size:13px;border-radius:99px;background:#4a3c14;border-color:#e0b03a;width:auto;max-width:none}
#bm .scl{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:5px;margin-top:8px}#bm .scc{padding:8px 10px;border-radius:10px;border:1px solid #ffffff1f;background:#ffffff0a;cursor:pointer}#bm .scc b{display:block;font-size:13px}#bm .scc small{font-size:11px;color:var(--mut)}</style>`);
addEventListener('load',()=>setTimeout(()=>{try{localStorage.removeItem(SAVE)}catch(e){}start('S',false);const pg=S.pg;if(pg&&!pg.tr.length){pg.tr=['runner'];$('bm').dataset.m='';closeBase();PAUSE=false}open6()},50));
