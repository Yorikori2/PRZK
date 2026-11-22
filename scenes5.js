/* PROJECT LEGACY — sound sample: scene picker for zombie voices, off-screen danger and distance fall-off. */
'use strict';
const rayFree5=(x,y,a,L)=>{for(let t=16;t<=L;t+=8)if(blocker(x+Math.cos(a)*t,y+Math.sin(a)*t,9))return false;return true};
let SPOT5=null;
function openSpot5(){const p=S.p,sx=p.x,sy=p.y;let best=null,bs=-1;for(let y=Math.max(200,sy-1600);y<Math.min(WH-200,sy+1600);y+=48)for(let x=Math.max(200,sx-1600);x<Math.min(WW-200,sx+1600);x+=48){if(blocker(x,y,9)||inBase(x,y))continue;
 let n=0;for(let k=0;k<16;k++)if(rayFree5(x,y,k*Math.PI/8,300))n++;const sc=n*1000-Math.hypot(x-sx,y-sy)/10;if(n>=4&&sc>bs){bs=sc;best=[x,y]}}return best||[sx,sy]}
function reset5(night){const p=S.p;if(!SPOT5)SPOT5=openSpot5();p.x=SPOT5[0];p.y=SPOT5[1];Z.length=0;S.alarm=null;p.hp=MHP(p);p.bleed=0;p.food=p.water=100;Object.assign(S4,{slow:0,kd:0,burn:0,proj:[],pud:[],gas:[]});S.t=night?1800:900;s3dirty();
 p.inv={food:3,water:3,bandage:2,ar:1,a556:150,bat:1};p.eq.prim='ar';p.eq.mel='bat';p.as='prim';p.mag={ar:30};SC5T.forEach(clearTimeout);SC5T.length=0;$('bm').dataset.m='';closeBase();PAUSE=false;hud2()}
const SC5T=[];const later=(ms,f)=>SC5T.push(setTimeout(f,ms));
function put(look,dist,ang,opt){const p=S.p;let a=ang;for(let k=0;k<32;k++){const t=ang+(k%2?1:-1)*Math.ceil(k/2)*Math.PI/16;if(rayFree5(p.x,p.y,t,Math.min(dist,320))){a=t;break}}
 for(let r=dist;r>40;r-=20){const x=p.x+Math.cos(a)*r,y=p.y+Math.sin(a)*r;if(!blocker(x,y,8)){mk(x,y,{look});const z=Z[Z.length-1];Object.assign(z,opt||{});return z}}}
const SC5=[['voice','🧟 좀비 소리 듣기','종류마다 다른 소리 · 아래에서 하나 골라 들어 보세요'],['off','🔊 화면 밖 위험','오른쪽 멀리서 러너 무리, 왼쪽에서 감염견 · 보이기 전에 소리와 화살표로 먼저 알아요'],
 ['dist','📏 거리 감쇠','같은 폭발을 120 · 350 · 600 · 850px에서 · 멀수록 작고 방향에 따라 좌우로'],['act','⚡ 특수 행동 소리','잠복자 기습 → 스토커 도약 → 브루트 돌진'],['boss','👹 보스 등장','골리앗 포효와 내려찍기']];
const VZ=[['civ1','일반 좀비'],['runner','러너'],['screamer','비명 좀비'],['heavy','중무장'],['crawler','크롤러'],['spitter','스피터'],['bloater','부머'],['stalker','스토커'],['dog','감염견'],['burner','불타는 좀비'],['shocker','감전 좀비'],['sleeper','잠복자'],['brute','브루트'],['brood','번식체'],['goliath','골리앗']];
function scene5(k,sub){const p=S.p;
 if(k=='voice'){reset5(false);const look=sub||'civ1',z=put(look,170,-Math.PI/2,{stun:999,al:0});if(z){z.sleep=0;let n=0;const say=()=>{if(!Z.includes(z))return;voice(z,1);ZS5.last.delete(z);if(++n<4)later(1500,say)};later(300,say)}
  msg('🔊 '+VZ.find(v=>v[0]==look)[1]+' 소리 · 1.5초마다 4번 들려요')}
 if(k=='off'){reset5(false);for(let i=0;i<3;i++)put('runner',700,0+(i-1)*.12,{al:8,nx:p.x,ny:p.y});put('screamer',760,.05,{al:0});later(2500,()=>{for(let i=0;i<3;i++)put('dog',720,Math.PI+(i-1)*.12,{al:8,nx:p.x,ny:p.y})});
  msg('🎧 소리가 오른쪽에서 들리고 화면 가장자리에 화살표가 떠요 · 2.5초 뒤 왼쪽에서 감염견')}
 if(k=='dist'){reset5(false);const ds=[120,350,600,850];ds.forEach((d,i)=>later(600+i*1500,()=>{const a=i%2?0:Math.PI,x=p.x+Math.cos(a)*d,y=p.y;fx.push({k:'boom',x,y,r:60,l:.45,m:.45});ev3('boom',x,y,1,80);msg('💥 '+d+'px '+(i%2?'오른쪽':'왼쪽')+' 폭발')}));
  const z=put('civ1',800,-Math.PI/2,{al:8,nx:p.x,ny:p.y});msg('📏 같은 폭발을 점점 멀리서 터뜨립니다 · 위쪽에서 일반 좀비가 신음하며 다가와요')}
 if(k=='act'){reset5(true);const sl=put('sleeper',95,-Math.PI/2,{al:0});msg('⚡ 1) 잠복자 옆으로 다가갑니다');later(1500,()=>{if(sl){p.y=sl.y+55;p.x=sl.x}});
  later(4500,()=>{Z.length=0;put('stalker',160,0,{cd4:0,w:1});msg('⚡ 2) 스토커 도약 (밤)')});later(8500,()=>{Z.length=0;S4.kd=0;put('brute',200,Math.PI,{cd4:0,w:1});msg('⚡ 3) 브루트 돌진')})}
 if(k=='boss'){reset5(false);delete p.inv.ar;p.inv.a556=0;give({lmg:1,a556:200});p.eq.prim='lmg';p.mag.lmg=100;put('goliath',320,-Math.PI/2,{w:1});msg('👹 골리앗 등장 · 위쪽에서 다가와요 · 가까이 오면 내려찍기 소리')}
 hud2()}
function open5(){const b=$('bm');b.dataset.m='scene';PAUSE=true;
 let h='<div class="sh"><h2>🔊 소리 장면</h2><div class="wt">소리를 켜고(무음 모드 해제) 보세요 · 이어폰이면 좌우가 더 잘 들려요</div><button id="s5X">✕</button></div><div class="scl">'+SC5.map(([k,n,d])=>'<div class="scc" data-s5="'+k+'"><b>'+n+'</b><small>'+d+'</small></div>').join('')+'</div>';
 h+='<div class="s3h">🧟 좀비 소리 고르기</div><div class="scg">'+VZ.map(([id,n])=>'<span class="chip" data-v5="'+id+'">'+n+'</span>').join('')+'</div>';
 b.innerHTML=h;b.style.display='block';const go=(k,s)=>{$('bm').dataset.m='';closeBase();PAUSE=false;acx();scene5(k,s)};
 b.querySelectorAll('[data-s5]').forEach(c=>c.onclick=()=>go(c.dataset.s5));b.querySelectorAll('[data-v5]').forEach(c=>c.onclick=()=>go('voice',c.dataset.v5));$('s5X').onclick=()=>{$('bm').dataset.m='';closeBase();PAUSE=false}}
document.body.insertAdjacentHTML('beforeend','<button id="scB">🔊 소리 장면</button>');
$('scB').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation()});$('scB').addEventListener('click',e=>{e.preventDefault();e.stopPropagation();if(run)open5()});
document.head.insertAdjacentHTML('beforeend',`<style>#scB{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(env(safe-area-inset-bottom,0px) + 8px);z-index:4;padding:6px 14px;font-size:13px;border-radius:99px;background:#4a3c14;border-color:#e0b03a;width:auto;max-width:none}
#bm .scl{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:5px;margin-top:8px}#bm .scc{padding:8px 10px;border-radius:10px;border:1px solid #ffffff1f;background:#ffffff0a;cursor:pointer}#bm .scc b{display:block;font-size:13px}#bm .scc small{font-size:11px;color:var(--mut)}
#bm .scg{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:5px}</style>`);
addEventListener('load',()=>setTimeout(()=>{try{localStorage.removeItem(SAVE)}catch(e){}start('S',false);const pg=S.pg;if(pg&&!pg.tr.length){pg.tr=['soldier'];$('bm').dataset.m='';closeBase();PAUSE=false}open5()},50));
