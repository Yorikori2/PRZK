/* PROJECT LEGACY — stage 4 sample: scene picker. Each scene sets up one situation in the real game so only the new things are shown. */
'use strict';
const SC_Z=[['crawler','크롤러','바닥을 기어 와 다리를 붙잡아요 (이동 -50%)'],['spitter','스피터','멀리서 산성 침 · 바닥 웅덩이'],['bloater','부머','가까이 오면 터져요 · 멀리서 쏘세요'],['stalker','스토커','밤에 반투명 · 도약해서 넘어뜨려요'],
 ['dog','감염견','4마리 무리로 빠르게 추격'],['burner','불타는 좀비','물리면 화상 (3초)'],['shocker','감전 좀비','물리면 기절 · 근접 공격하면 감전'],['sleeper','잠복자','누워 있다가 다가가면 기습'],['brute','브루트','돌진해서 튕겨 냄 · 체력 600']];
const SC_B=[['brood','번식체','크롤러를 계속 낳아요 · 체력 900'],['goliath','골리앗','땅 내려찍기 범위 공격 · 체력 1500']];
const SCENES=[['warn','⚠ 수색 중 좀비 접근','전설급을 수색하는 중 좀비가 다가오면 진행 막대와 상호작용 버튼이 빨갛게 깜빡여요'],['zom','🧟 새 좀비 9종','하나를 골라 직접 싸워 보세요'],['boss','👹 보스전 2종','웨이브 5·10마다 나오는 보스'],
 ['dexz','📖 좀비 도감','본 좀비만 기록 · 능력·약점·출현 장소'],['dexg','🔫 총기 도감 66종','손에 넣은 총만 기록 · 획득처 힌트'],['range','🎯 사격장','66종 중 아무 총이나 골라 쏴 보기'],['mst','🏅 도감 숙련 보상','스피터 9마리 처치 상태 · 한 마리 더 잡으면 피해 +5%'],['col','🗂 총기 수집 보상','권총 11/12 · 마지막 한 자루를 줍는 순간 재장전 -15%']];
let SCSUB=null;
/* a spot with long clear lanes (roads, yards) so zombies can walk straight at you */
const rayFree=(x,y,a,L)=>{for(let t=16;t<=L;t+=8)if(blocker(x+Math.cos(a)*t,y+Math.sin(a)*t,9))return false;return true};
function openSpot(){const p=S.p,sx=p.x,sy=p.y;let best=null,bs=-1;
 for(let y=Math.max(200,sy-1600);y<Math.min(WH-200,sy+1600);y+=48)for(let x=Math.max(200,sx-1600);x<Math.min(WW-200,sx+1600);x+=48){if(blocker(x,y,9)||inBase(x,y))continue;
  let n=0;for(let k=0;k<16;k++)if(rayFree(x,y,k*Math.PI/8,300))n++;const sc=n*1000-Math.hypot(x-sx,y-sy)/10;if(n>=4&&sc>bs){bs=sc;best=[x,y]}}return best||[sx,sy]}
let SPOT=null;
function scReset(night){const p=S.p;if(!SPOT)SPOT=openSpot();p.inv={food:3,water:3,bandage:2,medkit:1};for(const k of['prim','sec','mel','thr'])p.eq[k]='';p.mag={};p.as='fist';p.rl=0;p.x=SPOT[0];p.y=SPOT[1];Z.length=0;S.alarm=null;p.hp=MHP(p);p.bleed=0;p.food=p.water=100;p.st=100;Object.assign(S4,{slow:0,kd:0,burn:0,proj:[],pud:[],gas:[]});
 if(typeof SRCH!='undefined'){SRCH=null;actRing();$('act').classList.remove('warn')}S.t=night?1800:900;if(typeof s3dirty=='function')s3dirty();$('bm').dataset.m='';closeBase();PAUSE=false}
function arm(gun,n){const p=S.p,w=W_BY[gun],ai=AMMO_ITEM(w[4].ammo),r={};r[gun]=1;r[ai]=Math.min(n||200,Math.max(10,(w[4].mag||1)*5));give(r);const sl=slotFor(gun);p.eq[sl]=gun;p.as=sl;p.mag[gun]=wdef(gun)[4].mag;S.gseen[gun]=1}
function spawnAt(look,dist,ang){const p=S.p,want=ang==null?Math.random()*6.28:ang;let a=null,bd=9;for(let k=0;k<32;k++){const t=k*Math.PI/16;if(!rayFree(p.x,p.y,t,dist+10))continue;const d=Math.abs(Math.atan2(Math.sin(t-want),Math.cos(t-want)));if(d<bd){bd=d;a=t}}
 if(a==null)a=want;for(let r=dist;r>40;r-=20){const x=p.x+Math.cos(a)*r,y=p.y+Math.sin(a)*r;if(!blocker(x,y,8)){mk(x,y,{look});const z=Z[Z.length-1];z.al=8;z.nx=p.x;z.ny=p.y;return z}}}
function scene(k,sub){const p=S.p;SCSUB=sub||null;
 if(k=='warn'){scReset(false);const o=W0.objs.filter(o=>LOOTT[o.t]&&o.w>16).map(o=>({o,d:Math.hypot(o.x-p.x,o.y-p.y)})).sort((a,b)=>a.d-b.d).find(({o})=>{const x=o.x+o.w/2,y=o.y+o.h+9;return!blocker(x,y,7)&&clearLine(x,y,x,y+220)});
  const ob=o?o.o:W0.objs.find(o=>LOOTT[o.t]);p.x=ob.x+ob.w/2;p.y=ob.y+ob.h+9;delete(S.pend||{})[ob.id];delete S.lo[ob.id];const old=s3SearchRoll;s3SearchRoll=()=>'o_th';
  srchStart(ob,{r:{a338:6,a556:30},kind:'mil',tier:5,note:'',first:false});s3SearchRoll=old;SRCH.ctx.T=4;for(const q of Z)q.al=0;
  const a=Math.PI/2;spawnAt('runner',300,a);spawnAt('crawler',260,a+.5);camX=p.x;camY=p.y;msg('🔍 전설급 수색 시작 · 좀비가 다가오면 경고가 떠요 (움직이면 수색이 멈춰요)')}
 if(k=='zom'||k=='boss'){const L=k=='zom'?SC_Z:SC_B,id=sub||L[0][0],info=L.find(q=>q[0]==id);scReset(id=='stalker');arm('pump',60);arm('ar',300);give({bat:1});p.eq.mel='bat';p.as='prim';
  if(k=='boss'){arm('lmg',400);give({grenade:4});spawnAt(id,320,-Math.PI/2)}
  else if(id=='dog')for(let i=0;i<4;i++)spawnAt('dog',300,-Math.PI/2+i*.25);else if(id=='crawler')for(let i=0;i<3;i++)spawnAt('crawler',200,-Math.PI/2+i*.4);
  else if(id=='sleeper'){const z=spawnAt('sleeper',110,-Math.PI/2);z.al=0}else spawnAt(id,id=='spitter'?260:230,-Math.PI/2);
  msg((k=='boss'?'👹 ':'🧟 ')+info[1]+' · '+info[2]+' · 약점: '+ZN[id][5])}
 if(k=='dexz'){scReset(false);S.bes={};for(const id of['runner','screamer','heavy','crawler','spitter','bloater','dog','burner','brute','goliath'])S.bes[id]={s:1,k:1+(id.length*7)%23};DEXT='z';DEXSEL='spitter';openChar('dex');return}
 if(k=='dexg'){scReset(false);S.gseen={};GUN_IDS.forEach((id,i)=>{if(i%7<4)S.gseen[id]=1});S.gseen.hpistol=1;DEXT='g';DEXSEL='hpistol';openChar('dex');return}
 if(k=='range'){const gun=sub||'hpistol';scReset(false);arm(gun,300);if(W_BY[gun][4].ammo=='40mm'||W_BY[gun][4].ammo=='rocket')give({['a'+W_BY[gun][4].ammo]:20});
  for(let i=0;i<6;i++){const z=spawnAt('civ1',70+i*40,-Math.PI/2+(i-2.5)*.18);if(z){z.hp=z.mhp=400;z.stun=999;z.al=0}}
  const w=W_BY[gun],st=w[4];msg('🎯 '+w[1]+' · '+GINFO[gun].sub+' · 피해 '+Math.round(st.d)+(st.pel?'×'+st.pel:'')+' · 장탄 '+st.mag+' · '+NM2(AMMO_ITEM(st.ammo)))}
 if(k=='mst'){scReset(false);S.bes={spitter:{s:1,k:9}};arm('ar',300);p.as='prim';for(let i=0;i<3;i++){const z=spawnAt('spitter',120+i*45,-Math.PI/2+(i-1)*.25);if(z){z.stun=999;z.al=0;z.cd4=99}}
  msg('🏅 스피터 9마리 처치 · 한 마리를 더 잡으면 숙련 1단계 (피해 +5%) · 숫자가 바뀌는 걸 보세요')}
 if(k=='col'){scReset(false);S.gseen={};GUN_IDS.forEach(i=>{if(G4[i][2]=='권총'&&i!='fn57')S.gseen[i]=1});s3dirty();arm('pistol',60);
  msg('🗂 권총 11/12 · 3초 뒤 마지막 권총(노르덴 F57)을 줍습니다');setTimeout(()=>{give({fn57:1,a57:20});setTimeout(()=>{DEXT='g';DEXSEL='fn57';openChar('dex');const el=document.querySelector('.gsh.done');if(el)el.scrollIntoView({block:'center'})},1600)},3000)}
 hud2()}
function openScenes(){const b=$('bm');b.dataset.m='scene';PAUSE=true;
 let h='<div class="sh"><h2>🎬 4단계 장면</h2><div class="wt">바뀐 부분만 바로 볼 수 있는 장면이에요</div><button id="scX">✕</button></div><div class="scl">'+SCENES.map(([k,n,d])=>'<div class="scc" data-sc="'+k+'"><b>'+n+'</b><small>'+d+'</small></div>').join('')+'</div>';
 h+='<div class="s3h">🧟 새 좀비 고르기</div><div class="scg">'+SC_Z.map(([id,n])=>'<span class="chip" data-sz="'+id+'">'+n+'</span>').join('')+'</div>';
 h+='<div class="s3h">👹 보스 고르기</div><div class="scg">'+SC_B.map(([id,n])=>'<span class="chip" data-sb="'+id+'">'+n+'</span>').join('')+'</div>';
 h+='<div class="s3h">🎯 사격장 총 고르기 ('+GUN_IDS.length+'종)</div>'+['권총','기관단총','산탄총','소총','저격','기관총','발사기','특수'].map(sb=>'<div class="scg"><i>'+sb+'</i>'+GUN_IDS.filter(i=>G4[i][2]==sb).map(i=>'<span class="chip" data-sg="'+i+'" style="border-color:'+RAR[W_BY[i][3]][1]+'66">'+W_BY[i][1]+'</span>').join('')+'</div>').join('');
 b.innerHTML=h;b.style.display='block';const go=(k,s)=>{$('bm').dataset.m='';closeBase();PAUSE=false;scene(k,s)};
 b.querySelectorAll('[data-sc]').forEach(c=>c.onclick=()=>go(c.dataset.sc));b.querySelectorAll('[data-sz]').forEach(c=>c.onclick=()=>go('zom',c.dataset.sz));
 b.querySelectorAll('[data-sb]').forEach(c=>c.onclick=()=>go('boss',c.dataset.sb));b.querySelectorAll('[data-sg]').forEach(c=>c.onclick=()=>go('range',c.dataset.sg));$('scX').onclick=()=>{$('bm').dataset.m='';closeBase();PAUSE=false}}
document.body.insertAdjacentHTML('beforeend','<button id="scB" title="장면 고르기">🎬 장면</button>');
/* opens on release (click), so the lifting finger cannot land on the list that just appeared */
$('scB').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation()});$('scB').addEventListener('click',e=>{e.preventDefault();e.stopPropagation();if(run)openScenes()});
document.head.insertAdjacentHTML('beforeend',`<style>#scB{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(env(safe-area-inset-bottom,0px) + 8px);z-index:4;padding:6px 14px;font-size:13px;border-radius:99px;background:#4a3c14;border-color:#e0b03a;width:auto;max-width:none}
#bm .scl{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:5px;margin-top:8px}#bm .scc{padding:8px 10px;border-radius:10px;border:1px solid #ffffff1f;background:#ffffff0a;cursor:pointer}#bm .scc b{display:block;font-size:13px}#bm .scc small{font-size:11px;color:var(--mut)}
#bm .scg{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:5px;align-items:center}#bm .scg i{font-style:normal;font-size:11px;color:var(--mut);width:52px}</style>`);
/* boot straight into the sample: new game, a job picked, scene list open */
addEventListener('load',()=>setTimeout(()=>{try{localStorage.removeItem(SAVE)}catch(e){}start('S',false);const pg=S.pg;if(pg&&!pg.tr.length){pg.tr=['soldier'];$('bm').dataset.m='';closeBase();PAUSE=false}openScenes()},50));
