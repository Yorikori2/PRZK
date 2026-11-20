/* PROJECT LEGACY — HUD customisation: drag panels to new places, resize them, reset.
   Layouts are stored per orientation (portrait / landscape) in this browser; HUD opacity is shared.
   Smooth GPU drag, edit bar fades while dragging, layout presets, HUD opacity.
   Sample build adds: per-panel lock (🔒) and danger auto-sharpen (faded HUD turns solid when zombies are close or HP is low). */
'use strict';
const UIE={danger:false,ids:[['st','상태창'],['tr','미니맵 · 시간'],['dg','건물 위험도'],['sd','툴바'],['qk','퀵슬롯'],['wc','무기 카드'],['r','공격 · 상호작용']],on:false,sel:null,drag:null,work:null,raf:0};
const uiKey=()=>innerWidth>innerHeight?'l':'p';
function uiLoad(){try{return JSON.parse(localStorage.getItem('pl_ui')||'{}')||{}}catch(e){return{}}}
function uiSave(d){try{localStorage.setItem('pl_ui',JSON.stringify(d))}catch(e){}}
function uiClamp(el){const r=el.getBoundingClientRect();let L=parseFloat(el.style.left)||0,T=parseFloat(el.style.top)||0;
 L+=Math.min(0,innerWidth-r.right)-Math.min(0,r.left);T+=Math.min(0,innerHeight-r.bottom)-Math.min(0,r.top);el.style.left=Math.max(0,L)+'px';el.style.top=Math.max(0,T)+'px'}
const UIGRP=[['qk','wc']],UIMC=['tr','dg','sd','qk','r']; // panels without a fixed CSS width keep their natural width when moved
const uiAll=()=>UIE.on&&UIE.work?UIE.work:uiLoad();
const uiTf=(c,tx,ty)=>(tx||ty?'translate3d('+tx+'px,'+ty+'px,0) ':'')+(c.s&&c.s!=1?'scale('+c.s+')':'')||'none';
const UIDNG=['st','r','wc','qk']; // panels that turn solid in danger
const uiLk=id=>!!((uiAll()[uiKey()]||{})._lock||{})[id];
function uiApply(){const all=uiAll(),d=Object.assign({},all[uiKey()]||{}),def={},op=all.op||1,lk=d._lock||{};
 for(const[id,n]of UIE.ids){const el=document.getElementById(id);if(!el)continue;el.dataset.ul=n+(lk[id]?' 🔒':'');el.classList.toggle('uilk',!!lk[id]);el.style.left=el.style.top=el.style.right=el.style.bottom=el.style.transform=el.style.transformOrigin=el.style.position=el.style.width='';el.style.opacity=op<1&&!(UIE.danger&&!UIE.on&&all.cb!==0&&UIDNG.includes(id))?op:''}
 for(const[id]of UIE.ids){const el=document.getElementById(id);if(el){const r=el.getBoundingClientRect();def[id]={x:r.left/innerWidth,y:r.top/innerHeight,s:1}}}
 for(const g of UIGRP)if(g.some(id=>d[id]))for(const id of g)if(!d[id]&&def[id])d[id]=def[id];
 for(const[id]of UIE.ids){const el=document.getElementById(id);const c=d[id];if(!el||!c)continue;
  el.style.position='fixed';el.style.right='auto';if(UIMC.includes(id))el.style.width='max-content';el.style.bottom='auto';el.style.transformOrigin='top left';el.style.transform=uiTf(c);
  el.style.left=(c.x*innerWidth)+'px';el.style.top=(c.y*innerHeight)+'px';uiClamp(el)}
 document.body.classList.toggle('uileft',!!d._left);
 const o=document.getElementById('uiOp');if(o){o.value=Math.round(op*100);document.getElementById('uiOpV').textContent=Math.round(op*100)+'%'}
 const cb=document.getElementById('uiCb');if(cb)cb.checked=all.cb!==0;uiLkBtn()}
function uiCur(){const d=UIE.work[uiKey()]=UIE.work[uiKey()]||{};return d}
function uiEdit(on){UIE.on=on;UIE.sel=null;uiDragEnd(null,true);if(on)UIE.work=JSON.parse(JSON.stringify(uiLoad()));else{uiSave(UIE.work);UIE.work=null}
 document.body.classList.toggle('uied',on);if(typeof PAUSE!=='undefined')PAUSE=on;const bar=document.getElementById('uiBar');bar.style.display=on?'flex':'none';
 const dg=document.getElementById('dg');if(on){if(!dg.innerHTML)dg.innerHTML='📍 <b>건물 위험도</b>';dg.style.display='';document.getElementById('mmw').style.display=''}
 uiMark();uiApply();if(typeof hud2=='function'&&typeof S!=='undefined'&&S)hud2();if(typeof msg=='function')msg(on?'🎛 UI 편집: 끌어서 옮기고, 선택해서 크기를 바꾸세요':'✔ UI 배치 저장됨 ('+(uiKey()=='l'?'가로':'세로')+' 화면)')}
function uiMark(){for(const[id]of UIE.ids){const el=document.getElementById(id);if(el)el.classList.toggle('uisel',UIE.on&&UIE.sel==id)}const n=UIE.ids.find(i=>i[0]==UIE.sel);document.getElementById('uiSel').textContent=n?n[1]+(uiLk(UIE.sel)?' 🔒 잠김':''):'요소를 눌러 선택';uiLkBtn()}
function uiLkBtn(){const b=document.getElementById('uiLock');if(!b)return;const on=UIE.sel&&uiLk(UIE.sel);b.textContent=on?'🔓 잠금 풀기':'🔒 위치 잠금';b.classList.toggle('on',!!on)}
function uiLock(){if(!UIE.sel)return msg('먼저 잠글 요소를 누르세요');const d=uiCur(),l=d._lock=d._lock||{},id=UIE.sel,el=document.getElementById(id);
 if(l[id]){delete l[id];msg('🔓 '+el.dataset.ul.replace(' 🔒','')+' 잠금 해제')}else{if(!d[id]){const r=el.getBoundingClientRect();uiPinGroup(id);d[id]={x:r.left/innerWidth,y:r.top/innerHeight,s:1}}l[id]=1;msg('🔒 '+UIE.ids.find(i=>i[0]==id)[1]+' 위치 잠금 · 끌기·크기·초기화·추천 배치에서 그대로 유지')}uiApply();uiMark()}
function uiScale(k){if(!UIE.sel)return msg('먼저 옮길 요소를 누르세요');if(uiLk(UIE.sel))return msg('🔒 잠긴 요소예요 · 잠금을 풀고 바꾸세요');const el=document.getElementById(UIE.sel),d=uiCur(),r=el.getBoundingClientRect(),c=d[UIE.sel]||{x:r.left/innerWidth,y:r.top/innerHeight,s:1};
 uiPinGroup(UIE.sel);c.s=Math.max(.6,Math.min(1.6,Math.round(((c.s||1)+k)*10)/10));d[UIE.sel]=c;uiApply();msg('크기 '+Math.round(c.s*100)+'%')}
function uiBarMove(){const b=document.getElementById('uiBar'),i=['50%','22%','78%'],k=(i.indexOf(b.style.top||'50%')+1)%3;b.style.top=i[k]}
function uiPinGroup(id){const d=uiCur();for(const g of UIGRP)if(g.includes(id))for(const o of g)if(o!=id&&!d[o]){const r=document.getElementById(o).getBoundingClientRect();d[o]={x:r.left/innerWidth,y:r.top/innerHeight,s:1}}}
function uiReset(all){const d=uiCur(),l=d._lock||{};if(all){const keep={};for(const id in l)if(d[id])keep[id]=d[id];if(Object.keys(l).length)keep._lock=l;UIE.work[uiKey()]=keep;if(Object.keys(l).length)msg('잠긴 요소는 그대로 두고 초기화했어요')}
 else if(UIE.sel){if(l[UIE.sel])return msg('🔒 잠긴 요소예요 · 잠금을 풀고 초기화하세요');delete d[UIE.sel]}uiApply()}
/* presets: measured from the default layout of the current screen */
function uiDefaults(){UIE.work[uiKey()]={};uiApply();const R={};for(const[id]of UIE.ids){const el=document.getElementById(id);if(el&&getComputedStyle(el).display!='none'){const r=el.getBoundingClientRect();if(r.width)R[id]=r}}return R}
function uiPreset(k){const old=JSON.parse(JSON.stringify(UIE.work[uiKey()]||{})),lk=old._lock||{},W=innerWidth,H=innerHeight,R=uiDefaults(),d={};
 if(k=='left')for(const id in R){const r=R[id];d[id]={x:(W-r.right)/W,y:r.top/H,s:1}}
 if(k=='wide'){const s=.8;for(const id in R){const r=R[id],cx=r.left+r.width/2,cy=r.top+r.height/2;d[id]={x:(cx<W/2?r.left:r.right-r.width*s)/W,y:(cy<H/2?r.top:r.bottom-r.height*s)/H,s}}
  if(R.qk&&R.wc)d.qk.y=(d.wc.y*H-R.qk.height*s-5)/H}
 if(k=='left')d._left=1;for(const id in lk)if(old[id])d[id]=old[id];if(Object.keys(lk).length)d._lock=lk;UIE.work[uiKey()]=d;uiApply();
 msg({def:'기본 배치',left:'왼손잡이 배치 (좌우 반전)',wide:'넓은 시야 배치 (UI 80% · 가장자리)'}[k])}
function uiCombat(on){UIE.work.cb=on?1:0;if(on)delete UIE.work.cb;else UIE.work.cb=0;msg(on?'⚔ 위험할 때 상태창·무기·공격 버튼이 진해져요':'⚔ 위험할 때 진하게: 꺼짐');uiApply()}
function uiOpacity(v){UIE.work.op=Math.max(.5,Math.min(1,v/100));if(UIE.work.op==1)delete UIE.work.op;uiApply()}
/* smooth drag: only the grabbed panel moves, via transform on the next animation frame; layout is written once on release */
const uiSelector=UIE.ids.map(i=>'#'+i[0]).join(',');
function uiDragStart(g){g.go=true;uiPinGroup(g.id);const d=uiCur();const el=document.getElementById(g.id);
 if(!d[g.id]){const r=el.getBoundingClientRect();d[g.id]={x:r.left/innerWidth,y:r.top/innerHeight,s:g.s}}uiApply();
 const r=el.getBoundingClientRect();g.el=el;g.L0=r.left;g.T0=r.top;g.w=r.width;g.h=r.height;g.c=d[g.id];g.tx=g.ty=0;el.style.willChange='transform';
 document.body.classList.add('uidrag');el.classList.add('uilift')}
function uiFrame(){UIE.raf=0;const g=UIE.drag;if(g&&g.go)g.el.style.transform=uiTf(g.c,g.tx,g.ty)}
function uiDragEnd(e,silent){const g=UIE.drag;if(!g||(e&&e.pointerId!==undefined&&e.pointerId!==g.pid))return;UIE.drag=null;if(UIE.raf){cancelAnimationFrame(UIE.raf);UIE.raf=0}
 document.body.classList.remove('uidrag');if(!g.go)return;g.el.classList.remove('uilift');g.el.style.willChange='';
 if(!silent&&UIE.work){uiCur()[g.id]={x:(g.L0+g.tx)/innerWidth,y:(g.T0+g.ty)/innerHeight,s:g.s};}uiApply()}
document.addEventListener('pointerdown',e=>{if(!UIE.on)return;if(e.target.closest('#uiBar')){uiDragEnd();return}if(UIE.drag&&UIE.drag.pid!==e.pointerId)uiDragEnd();e.preventDefault();e.stopPropagation();const el=e.target.closest(uiSelector);
 if(!el){UIE.sel=null;uiMark();return}UIE.sel=el.id;uiMark();try{el.setPointerCapture(e.pointerId)}catch(_){} /* keep the touch on the panel even if its contents are re-rendered */const r=el.getBoundingClientRect();UIE.drag={pid:e.pointerId,id:el.id,dx:e.clientX-r.left,dy:e.clientY-r.top,sx:e.clientX,sy:e.clientY,go:false,s:(uiCur()[el.id]||{}).s||1}},true);
document.addEventListener('pointermove',e=>{const g=UIE.drag;if(!UIE.on||!g||e.pointerId!==g.pid)return;if(e.pointerType=='mouse'&&!e.buttons){uiDragEnd();return}e.preventDefault();
 if(!g.go){if(Math.hypot(e.clientX-g.sx,e.clientY-g.sy)<8)return;if(uiLk(g.id)){if(!g.warn){g.warn=1;msg('🔒 잠긴 요소예요 · 편집 창에서 잠금을 푸세요')}return}uiDragStart(g)}
 const L=Math.max(0,Math.min(innerWidth-g.w,e.clientX-g.dx)),T=Math.max(0,Math.min(innerHeight-g.h,e.clientY-g.dy));g.tx=L-g.L0;g.ty=T-g.T0;
 if(!UIE.raf)UIE.raf=requestAnimationFrame(uiFrame)},true);
// a drag ends on lift, on a browser-cancelled touch (pointercancel) and when the window loses focus
['pointerup','pointercancel','lostpointercapture'].forEach(t=>document.addEventListener(t,e=>uiDragEnd(e),true));addEventListener('blur',()=>uiDragEnd());
document.addEventListener('click',e=>{if(UIE.on&&!e.target.closest('#uiBar')){e.preventDefault();e.stopPropagation()}},true);
addEventListener('resize',()=>{uiDragEnd();uiApply()});
/* danger watcher: a zombie within 200 px, HP under 35 % or an active alarm makes faded panels solid again */
function uiDanger(){if(typeof S=='undefined'||!S||!S.p||typeof run=='undefined'||!run)return false;const p=S.p,mh=typeof MHP=='function'?MHP(p):100;
 if(p.hp<mh*.35||S.alarm)return true;for(const z of Z)if(z.hp>0&&Math.hypot(z.x-p.x,z.y-p.y)<200)return true;return false}
setInterval(()=>{const all=uiAll();if((all.op||1)>=1||all.cb===0){if(UIE.danger){UIE.danger=false;uiApply()}return}const d=uiDanger();if(d!==UIE.danger){UIE.danger=d;uiApply()}},150);
