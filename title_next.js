/* PROJECT LEGACY — game glue for the endless city: title-screen start-area preview with re-roll, tools in crafting and
   loot, the bulldozer key, and where the enhance window opens. Loaded last. */
'use strict';
/* ---------- title: preview the start area (5×5 blocks around the base) and re-roll it ---------- */
let SAVEMAP=null;try{const s=JSON.parse(localStorage.getItem(SAVE)||'null');if(s&&s.map&&s.map.inf)SAVEMAP=s.map}catch(e){}
function startPreview(w){const c=document.createElement('canvas'),k=w/WW;c.width=w;c.height=Math.round(WH*k);const x=c.getContext('2d');x.fillStyle='#55585e';x.fillRect(0,0,c.width,c.height);
 x.font=Math.max(10,Math.round(BW*k*.34))+'px sans-serif';x.textAlign='center';x.textBaseline='middle';const IC={base:'🏕',mil:'🪖',lab:'🧪',police:'👮',clinic:'🏥',fire:'🚒',school:'🏫',ware:'📦',hard:'🔨',church:'⛪',mart:'🏪',apt:'🏢',houses:'🏠',park:'🌳'};
 for(const b of W0.b){if(b.kind=='outpost')continue;const bw=b.kind=='mil'?2*BW+RD:BW;x.fillStyle=KCOL[b.kind]||'#3b5a30';x.fillRect(b.ox*k,b.oy*k,bw*k,BH*k);x.fillStyle='#000';x.fillText(IC[b.kind]||'',(b.ox+bw/2)*k,(b.oy+BH/2)*k)}
 const B=W0.b.find(b=>b.kind=='base');if(B){x.strokeStyle='#ffd36a';x.lineWidth=2;x.strokeRect(B.ox*k+1,B.oy*k+1,BW*k-2,BH*k-2)}return c}
function startMenu(){const m=$('menu');if(!m)return;let box=$('stsel');if(!box){m.querySelector('small').insertAdjacentHTML('afterend','<div id="stsel"></div>');box=$('stsel')}
 if(FIXEDSAVE){box.innerHTML='<div class="mh">🗺 지금 저장: 예전 고정 지도 · [이어하기]로 계속할 수 있어요</div><button id="newInf">♾ 무한 지형으로 새 게임 준비</button>';$('newInf').onclick=()=>{try{localStorage.setItem('pl_newinf',JSON.stringify({seed:1+(Math.random()*99999|0)}))}catch(e){}location.reload()};return}
 const cnt={};for(const b of W0.b)if(b.kind!='outpost')cnt[b.kind]=(cnt[b.kind]||0)+1;
 box.innerHTML='<div class="mh">♾ 무한 지형 · 시작 지점 미리보기 <small>시드 #'+MAPCFG.seed+'</small></div><div class="mp"></div><div class="mb"><button id="reroll">🎲 다시 굴리기</button>'+(SAVEMAP&&SAVEMAP.seed!=MAPCFG.seed?'<button id="backSave">↩ 저장된 지점으로</button>':'')+'</div>'+
  '<div class="ml">'+Object.entries(cnt).map(([k,v])=>(KNAME[k]||k)+' '+v).join(' · ')+'</div><div class="ml">새 게임은 이 지점에서 시작하고, 그 바깥은 걸어가는 만큼 끝없이 만들어져요 · 거점에서 15블록마다 위험 구역</div>';
 box.querySelector('.mp').appendChild(startPreview(Math.min(300,innerWidth-80)));
 $('reroll').onclick=()=>{rerollStart(1+(Math.random()*99999|0))};if($('backSave'))$('backSave').onclick=()=>rerollStart(SAVEMAP.seed,SAVEMAP)}
function rerollStart(seed,map){MAPCFG.seed=seed;const o=map||{ogx:-2,ogy:-2};OGX=o.ogx;OGY=o.ogy;MAPCFG.ogx=OGX;MAPCFG.ogy=OGY;buildWorld();infDerived();startMenu()}
/* continuing a save always uses the save's own map; a new game starts at the previewed start area */
{const _st=start;start=function(d,load){if(INF){if(load&&SAVEMAP&&(MAPCFG.seed!=SAVEMAP.seed||OGX!=SAVEMAP.ogx||OGY!=SAVEMAP.ogy)){MAPCFG.seed=SAVEMAP.seed;OGX=SAVEMAP.ogx;OGY=SAVEMAP.ogy;buildWorld();infDerived()}
  if(!load&&(OGX!=-2||OGY!=-2)){OGX=-2;OGY=-2;buildWorld();infDerived()}}const r=_st(d,load);const m=$('stsel');if(m&&run)m.remove();return r}}
if(INF||FIXEDSAVE)startMenu();
document.head.insertAdjacentHTML('beforeend',`<style>#stsel{margin:8px auto;max-width:340px;padding:8px;border-radius:12px;background:#0006;border:1px solid #ffffff22;font-size:12px}#stsel .mh{font-weight:bold;margin-bottom:6px}#stsel .mh small{color:var(--mut);font-weight:normal}
#stsel .mp canvas{display:block;margin:0 auto;border-radius:8px;image-rendering:pixelated}#stsel .mb{display:flex;gap:6px;justify-content:center;margin:6px 0}#stsel .mb button,#stsel>button{padding:6px 12px;font-size:13px;width:auto}#stsel .ml{color:var(--mut);font-size:11px;margin-top:3px}</style>`);
/* ---------- tools in crafting and loot (weapons list = melee tools, items = explosives / dozer key) ---------- */
if(typeof RCP2!='undefined'){const add=r=>{if(!RCP2.some(q=>q[0]==r[0]))RCP2.push(r)};add(['dt1',{scrap:6,wood:2},['bench',1,'작업대 Lv1']]);add(['dt1f',{scrap:5,wood:1},['bench',1,'작업대 Lv1']]);add(['dt2',{scrap:10,elec:3},['bench',2,'작업대 Lv2']])}
if(typeof WLOOT!='undefined'){for(const[k,L]of[['hard',['dt1','dt1f','dt2']],['fire',['dt2']],['ware',['dt1','dt3']],['mil',['dt3']]])WLOOT[k]=(WLOOT[k]||[]).concat(L.filter(x=>!(WLOOT[k]||[]).includes(x)))}
if(typeof GLOOT!='undefined'){GLOOT.mil=(GLOOT.mil||[]).concat(['dx1']);GLOOT.ware=(GLOOT.ware||[]).concat(['dx2'])}
/* finding the bulldozer key: the machine is parked right by where you found it */
{const _ia=invAdd;invAdd=function(p,id,n){const r=_ia(p,id,n);try{if(id=='dx2'&&n>0&&S&&S.inf&&!S.inf.dz&&p===S.p){let x=p.x,y=p.y+60;for(let i=0;i<40&&blocker(x,y,28);i++){x+=(i%2?-1:1)*i*14;y+=6}const[gx,gy]=gOf(x,y),[ox,oy]=bo(gx-OGX,gy-OGY);S.inf.dz={gk:gx+','+gy,rx:Math.round(x-ox),ry:Math.round(y-oy),dir:0};S.inf.dzF=20;infRebuild();setTimeout(()=>msg('🚜 불도저 열쇠를 찾았어요 · 근처에 불도저가 세워져 있어요'),900)}}catch(e){}return r}}
/* ---------- enhancing happens at a workbench (base or outpost) ---------- */
function nearBench(){const p=S.p;if(typeof inBase=='function'&&inBase(p.x,p.y)&&(S.base.lv.bench|0)>=1)return true;return W0.objs.some(o=>o.t=='bench3'&&o.op!=null&&Math.hypot(o.x+o.w/2-p.x,o.y+o.h/2-p.y)<120)}
{const _u=use2;use2=function(k){if(k&&(k.startsWith('rn_')||k.startsWith('enh'))){if(!nearBench())return msg('🔨 강화 · 인챈트는 거점 작업대(Lv1 이상)나 전초기지 작업대에서 할 수 있어요');return openEnh()}return _u.apply(this,arguments)}}
{const _ob=openBase;openBase=function(){_ob.apply(this,arguments);if(!S||$('enhOpen'))return;const h=$('bm').querySelector('h2');if(h&&(S.base.lv.bench|0)>=1)h.insertAdjacentHTML('afterend','<button id="enhOpen" style="float:right;padding:4px 10px;font-size:12px;width:auto" onclick="openEnh()">🔨 강화 · 인챈트</button>')}}
