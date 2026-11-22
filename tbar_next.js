/* PROJECT LEGACY — sample: toolbar styles. One switch, five styles plus the recommended combo:
   base (as now) · A drawer (handle at the bottom-left, swipe up to open / down to close) · B radial (hold 상호작용 → fan, slide & release)
   C contextual (only buttons you can use now) · D collapsible (◀ folds the column) · AC drawer + contextual (recommended). */
'use strict';
const TB={mode:'base',open:false,fan:null,ctxT:0};
const TBN=[['base','지금 방식'],['A','A 아래에서 끌어 올리는 서랍'],['B','B 상호작용 길게 누르기 · 부채꼴'],['C','C 필요할 때만 보이기'],['D','D 접히는 툴바'],['AC','추천 A+C']];
const tbBtns=()=>[...$('sd').querySelectorAll('button.rb')].filter(b=>b.id!='tbFold');
/* C: which buttons make sense right now */
function tbUseful(b){const p=S&&S.p;if(!p)return true;switch(b.id){
 case'bBd':return(p.inv.wood||0)>=2;
 case'cCr':return(typeof RCP!='undefined')&&RCP.some(r=>canPay(r[1])&&(!r[2]||(S.base.lv[r[2][0]]||0)>=r[2][1]));
 case'bse':return inBase(p.x,p.y);
 default:return true}}
function tbApply(){const m=TB.mode,sd=$('sd'),h=$('tbH'),fold=$('tbFold');document.body.dataset.tb=m;
 const ctx=m=='C'||m=='AC',drawer=m=='A'||m=='AC';
 for(const b of tbBtns()){const show=!ctx||tbUseful(b);b.dataset.tbHide=show?'':'1'}
 sd.classList.toggle('tbDrawer',drawer);sd.classList.toggle('tbOpen',drawer&&TB.open);sd.classList.toggle('tbFolded',m=='D'&&TB.fold);
 h.style.display=drawer?'':'none';h.classList.toggle('on',TB.open);fold.style.display=m=='D'?'':'none';fold.textContent=TB.fold?'▶':'◀';
 const n=tbBtns().filter(b=>!b.dataset.tbHide&&getComputedStyle(b).display!='none').length;h.dataset.n=n;sd.style.visibility=m=='B'?'hidden':''}
function tbSet(m){TB.mode=m;TB.open=false;TB.fold=false;tbFanClose();tbApply();msg('🧰 툴바: '+TBN.find(t=>t[0]==m)[1])}
/* A: handle */
document.body.insertAdjacentHTML('beforeend','<button id="tbH" class="g" style="display:none" title="위로 밀면 펼치기 · 아래로 밀면 접기">☰<b>도구</b></button>');
{const h=$('tbH');let y0=null,moved=false;
 h.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();y0=e.clientY;moved=false;try{h.setPointerCapture(e.pointerId)}catch(_){}});
 h.addEventListener('pointermove',e=>{if(y0==null)return;const dy=e.clientY-y0;if(dy<-22&&!TB.open){TB.open=true;moved=true;tbApply()}if(dy>10&&TB.open){TB.open=false;moved=true;tbApply()}});
 h.addEventListener('pointerup',e=>{if(y0!=null&&!moved){TB.open=!TB.open;tbApply()}y0=null})}
/* swiping down on the open drawer folds it too */
{let y0=null;const sd=$('sd');sd.addEventListener('pointerdown',e=>{if(TB.mode=='A'||TB.mode=='AC')y0=e.clientY},true);
 document.addEventListener('pointermove',e=>{if(y0!=null&&TB.open&&e.clientY-y0>30){TB.open=false;y0=null;tbApply()}},true);document.addEventListener('pointerup',()=>{y0=null},true)}
/* drawer closes after a button is used */
$('sd').addEventListener('pointerup',e=>{if((TB.mode=='A'||TB.mode=='AC')&&e.target.closest('button.rb'))setTimeout(()=>{TB.open=false;tbApply()},150)});
/* D: fold button */
$('sd').insertAdjacentHTML('afterbegin','<button class="g rb" id="tbFold" style="display:none" title="접기 · 펼치기">◀</button>');
$('tbFold').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();TB.fold=!TB.fold;tbApply()});
/* B: hold 상호작용 → fan of the toolbar buttons; slide and release to pick, or tap one */
function tbFanOpen(){tbFanClose();const a=$('act').getBoundingClientRect(),cx=a.left+a.width/2,cy=a.top+a.height/2,L=tbBtns().filter(b=>getComputedStyle(b).display!='none'),n=L.length,R=Math.max(96,Math.min(130,30*n));
 const box=document.createElement('div');box.id='tbFan';box.innerHTML='<i style="left:'+cx+'px;top:'+cy+'px"></i>'+L.map((b,i)=>{const t=Math.PI*(.98+.55*(n>1?i/(n-1):.5)),x=cx+Math.cos(t)*R,y=cy+Math.sin(t)*R;return'<button class="g rb" data-for="'+b.id+'" style="left:'+x+'px;top:'+y+'px">'+b.textContent+'</button>'}).join('');
 document.body.appendChild(box);TB.fan=box;box.querySelectorAll('[data-for]').forEach(f=>f.addEventListener('pointerup',e=>{e.stopPropagation();tbFanPick(f)}))}
function tbFanClose(){if(TB.fan){TB.fan.remove();TB.fan=null}}
function tbFanPick(f){const id=f.dataset.for,b=$(id);tbFanClose();if(!b)return;b.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true}));b.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,cancelable:true}))}
{const act=$('act');let tm=null,down=false;
 act.addEventListener('pointerdown',e=>{if(TB.mode!='B')return;e.stopImmediatePropagation();e.preventDefault();down=true;try{act.setPointerCapture(e.pointerId)}catch(_){}tm=setTimeout(()=>{tm=null;tbFanOpen()},420)},true);
 act.addEventListener('pointermove',e=>{if(TB.mode!='B'||!TB.fan)return;let best=null,bd=60;for(const f of TB.fan.querySelectorAll('[data-for]')){const r=f.getBoundingClientRect(),d=Math.hypot(e.clientX-(r.left+r.width/2),e.clientY-(r.top+r.height/2));f.classList.remove('hot');if(d<bd){bd=d;best=f}}if(best)best.classList.add('hot')},true);
 act.addEventListener('pointerup',e=>{if(TB.mode!='B'||!down)return;e.stopImmediatePropagation();down=false;if(tm){clearTimeout(tm);tm=null;if(run)ia();return}const hot=TB.fan&&TB.fan.querySelector('.hot');if(hot)tbFanPick(hot)},true);
 document.addEventListener('pointerdown',e=>{if(TB.fan&&!e.target.closest('#tbFan')&&!e.target.closest('#act'))tbFanClose()},true)}
/* refresh contextual visibility twice a second */
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);TB.ctxT-=dt;if(TB.ctxT<=0){TB.ctxT=.5;tbApply()}}}
document.head.insertAdjacentHTML('beforeend',`<style>
#sd button.rb[data-tb-hide="1"]{display:none!important}
#sd.tbDrawer{top:auto!important;bottom:calc(env(safe-area-inset-bottom,0px) + 70px)!important;left:max(10px,env(safe-area-inset-left,0px))!important;transform:translateY(30px)!important;opacity:0;pointer-events:none;display:flex!important;flex-direction:column-reverse!important;transition:transform .2s,opacity .2s}
#sd.tbDrawer.tbOpen{transform:none!important;opacity:1;pointer-events:auto}
#tbH{position:fixed;left:max(10px,env(safe-area-inset-left,0px));bottom:calc(env(safe-area-inset-bottom,0px) + 12px);z-index:4;width:auto;max-width:none;padding:6px 12px;border-radius:14px;font-size:18px;display:flex;align-items:center;gap:6px;touch-action:none}
#tbH b{font-size:11px}#tbH::after{content:attr(data-n);font-size:10px;color:var(--mut)}#tbH.on{border-color:#ffd36a;background:#4a3c14}
#sd.tbFolded button.rb:not(#tbFold){display:none!important}
#tbFan{position:fixed;inset:0;z-index:6;pointer-events:none}#tbFan i{position:absolute;width:250px;height:250px;margin:-125px 0 0 -125px;border-radius:50%;background:radial-gradient(#0008,#0000 70%)}
#tbFan button{position:absolute;transform:translate(-50%,-50%);pointer-events:auto;transition:transform .1s}#tbFan button.hot{transform:translate(-50%,-50%) scale(1.25);border-color:#ffd36a}
body[data-tb="A"] #atmo,body[data-tb="AC"] #atmo{left:calc(max(10px,env(safe-area-inset-left,0px)) + 96px)!important}
@media (orientation:landscape) and (max-height:420px){#sd.tbDrawer{display:grid!important;grid-template-columns:repeat(2,auto);bottom:calc(env(safe-area-inset-bottom,0px) + 58px)!important}}
</style>`);
