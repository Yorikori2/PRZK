/* PROJECT LEGACY — HUD customisation: drag panels to new places, resize them, reset.
   Layouts are stored per orientation (portrait / landscape) in this browser. */
'use strict';
const UIE={ids:[['st','상태창'],['tr','미니맵 · 시간'],['dg','건물 위험도'],['sd','툴바'],['qk','퀵슬롯'],['wc','무기 카드'],['r','공격 · 상호작용']],on:false,sel:null,drag:null,work:null};
const uiKey=()=>innerWidth>innerHeight?'l':'p';
function uiLoad(){try{return JSON.parse(localStorage.getItem('pl_ui')||'{}')||{}}catch(e){return{}}}
function uiSave(d){try{localStorage.setItem('pl_ui',JSON.stringify(d))}catch(e){}}
function uiClamp(el){const r=el.getBoundingClientRect();let L=parseFloat(el.style.left)||0,T=parseFloat(el.style.top)||0;
 L+=Math.min(0,innerWidth-r.right)-Math.min(0,r.left);T+=Math.min(0,innerHeight-r.bottom)-Math.min(0,r.top);el.style.left=Math.max(0,L)+'px';el.style.top=Math.max(0,T)+'px'}
const UIGRP=[['qk','wc']];
function uiApply(){const all=UIE.on&&UIE.work?UIE.work:uiLoad(),d=Object.assign({},all[uiKey()]||{}),def={};
 for(const[id,n]of UIE.ids){const el=document.getElementById(id);if(!el)continue;el.dataset.ul=n;el.style.left=el.style.top=el.style.right=el.style.bottom=el.style.transform=el.style.transformOrigin=el.style.position=''}
 for(const[id]of UIE.ids){const el=document.getElementById(id);if(el){const r=el.getBoundingClientRect();def[id]={x:r.left/innerWidth,y:r.top/innerHeight,s:1}}}
 for(const g of UIGRP)if(g.some(id=>d[id]))for(const id of g)if(!d[id]&&def[id])d[id]=def[id];
 for(const[id]of UIE.ids){const el=document.getElementById(id);const c=d[id];if(!el||!c)continue;
  el.style.position='fixed';el.style.right='auto';el.style.bottom='auto';el.style.transformOrigin='top left';el.style.transform=c.s&&c.s!=1?'scale('+c.s+')':'none';
  el.style.left=(c.x*innerWidth)+'px';el.style.top=(c.y*innerHeight)+'px';uiClamp(el)}}
function uiCur(id){const d=UIE.work[uiKey()]=UIE.work[uiKey()]||{};return d}
function uiEdit(on){UIE.on=on;UIE.sel=null;UIE.drag=null;if(on)UIE.work=JSON.parse(JSON.stringify(uiLoad()));else{uiSave(UIE.work);UIE.work=null}
 document.body.classList.toggle('uied',on);if(typeof PAUSE!=='undefined')PAUSE=on;const bar=document.getElementById('uiBar');bar.style.display=on?'flex':'none';
 const dg=document.getElementById('dg');if(on){if(!dg.innerHTML)dg.innerHTML='📍 <b>건물 위험도</b>';dg.style.display='';document.getElementById('mmw').style.display=''}
 uiMark();uiApply();if(typeof hud2=='function'&&typeof S!=='undefined'&&S)hud2();if(typeof msg=='function')msg(on?'🎛 UI 편집: 끌어서 옮기고, 선택해서 크기를 바꾸세요':'✔ UI 배치 저장됨 ('+(uiKey()=='l'?'가로':'세로')+' 화면)')}
function uiMark(){for(const[id]of UIE.ids){const el=document.getElementById(id);if(el)el.classList.toggle('uisel',UIE.on&&UIE.sel==id)}const n=UIE.ids.find(i=>i[0]==UIE.sel);document.getElementById('uiSel').textContent=n?n[1]:'요소를 눌러 선택';}
function uiScale(k){if(!UIE.sel)return msg('먼저 옮길 요소를 누르세요');const el=document.getElementById(UIE.sel),d=uiCur(),r=el.getBoundingClientRect(),c=d[UIE.sel]||{x:r.left/innerWidth,y:r.top/innerHeight,s:1};
 uiPinGroup(UIE.sel);c.s=Math.max(.6,Math.min(1.6,Math.round(((c.s||1)+k)*10)/10));d[UIE.sel]=c;uiApply();msg('크기 '+Math.round(c.s*100)+'%')}
function uiBarMove(){const b=document.getElementById('uiBar'),i=['50%','22%','78%'],k=(i.indexOf(b.style.top||'50%')+1)%3;b.style.top=i[k]}
function uiPinGroup(id){const d=uiCur();for(const g of UIGRP)if(g.includes(id))for(const o of g)if(o!=id&&!d[o]){const r=document.getElementById(o).getBoundingClientRect();d[o]={x:r.left/innerWidth,y:r.top/innerHeight,s:1}}}
function uiReset(all){const d=uiCur();if(all){UIE.work[uiKey()]={}}else if(UIE.sel)delete d[UIE.sel];uiApply()}
const uiSelector=UIE.ids.map(i=>'#'+i[0]).join(',');
document.addEventListener('pointerdown',e=>{if(!UIE.on)return;if(e.target.closest('#uiBar')){UIE.drag=null;return}if(UIE.drag&&UIE.drag.pid!==e.pointerId)UIE.drag=null;e.preventDefault();e.stopPropagation();const el=e.target.closest(uiSelector);
 if(!el){UIE.sel=null;uiMark();return}UIE.sel=el.id;uiMark();const r=el.getBoundingClientRect();UIE.drag={pid:e.pointerId,id:el.id,dx:e.clientX-r.left,dy:e.clientY-r.top,sx:e.clientX,sy:e.clientY,go:false,s:(uiCur()[el.id]||{}).s||1}},true);
document.addEventListener('pointermove',e=>{const g2=UIE.drag;if(!UIE.on||!g2||e.pointerId!==g2.pid)return;if(e.pointerType=='mouse'&&!e.buttons){UIE.drag=null;return}e.preventDefault();if(!g2.go){if(Math.hypot(e.clientX-g2.sx,e.clientY-g2.sy)<8)return;g2.go=true;uiPinGroup(g2.id)}const d=uiCur();d[g2.id]={x:Math.max(0,(e.clientX-g2.dx))/innerWidth,y:Math.max(0,(e.clientY-g2.dy))/innerHeight,s:g2.s};uiApply()},true);
// a drag ends on lift, on a browser-cancelled touch (pointercancel) and when the window loses focus
const uiEnd=e=>{if(UIE.drag&&(!e||e.pointerId===undefined||e.pointerId===UIE.drag.pid))UIE.drag=null};
['pointerup','pointercancel','lostpointercapture'].forEach(t=>document.addEventListener(t,uiEnd,true));addEventListener('blur',()=>uiEnd());
document.addEventListener('click',e=>{if(UIE.on&&!e.target.closest('#uiBar')){e.preventDefault();e.stopPropagation()}},true);
addEventListener('resize',()=>uiApply());
