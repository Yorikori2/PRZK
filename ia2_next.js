/* PROJECT LEGACY — a tidy [상호작용] list.
   Before: every companion and every decoration nearby poured all of its actions into the list (15+ lines).
   Now: one line per companion ("👤 시우 · 같이 다님") and one line per decoration ("🥬 텃밭 · 🥫 3").
   Tapping it opens that one's own window with its actions as big buttons (and a short summary on top).
   Urgent things stay direct: 🩹 일으키기 (a downed companion).
   Loaded last (after every module that adds to dmCtx). */
'use strict';
const ASTN={follow:'같이 다님',wait:'기다리는 중',base:'거점',job:'일하는 중',hurt:'다쳐서 쉬는 중',down:'쓰러짐'};
let IA2=null;/* the window that is open: {kind,ref,acts} */
{const _c=dmCtx;dmCtx=function(){let B=_c();try{if(!S||!run)return B;const p=S.p;
  /* companions within reach */
  for(const z of Z){if(z.npc!='ally')continue;const a=typeof aById=='function'&&aById(z.ally);if(!a||Math.hypot(z.x-p.x,z.y-p.y)>64||a.st=='down')continue;const nm=' · '+a.nm;
   const mine=B.filter(q=>q.t.endsWith(nm)||q.t=='📋 동료 관리'||/^🤝 같이 가자 \(동료 2명까지\)/.test(q.t));if(!mine.length)continue;B=B.filter(q=>!mine.includes(q));
   const acts=mine.filter(q=>q.t!='📋 동료 관리').map(q=>({t:q.t.replace(nm,''),f:q.f,off:q.off}));
   B.push({t:'👤 '+a.nm+' · '+(a.st=='job'&&typeof AJOB!='undefined'&&AJOB[a.job]?AJOB[a.job][1]:ASTN[a.st]||''),f:()=>ia2Ally(a,acts),big:1,ia2:1})}
  /* the nearest decoration */
  if(typeof DECO!='undefined'){let o=null,bd=40;for(const q of W0.objs)if(q.did!=null){const d=Math.hypot(Math.max(q.x-p.x,0,p.x-q.x-q.w),Math.max(q.y-p.y,0,p.y-q.y-q.h));if(d<bd){bd=d;o=q}}
   if(o){const t=o.t.slice(5),D=DECO[t];if(D){const nm=D[1],mine=B.filter(q=>!q.ia2&&(q.t.includes(nm)||/커피 내리기/.test(q.t)&&t=='coffeem'));if(mine.length){B=B.filter(q=>!mine.includes(q));
    const d=DSTORE().find(q=>q.id==o.did),buf=d&&d.buf?(typeof DPROD!='undefined'&&DPROD[t]=='food'?' · 🥫 ':' · 💧 ')+d.buf:'';
    B.push({t:D[0]+' '+nm+buf,f:()=>ia2Deco(o,t,mine),big:1,ia2:1})}}}}
 }catch(e){}return B}}
if(typeof IAW!='undefined')IAW.unshift([/^👤 /,'동료'],[/텃밭|닭장|빗물 통|연못|커피 머신/,'열기']);
/* ---------- the windows ---------- */
function ia2Open(title,sub,info,acts,extra){const b=$('bm');b.dataset.m='ia2';PAUSE=true;
 b.innerHTML='<div class="sh"><h2>'+title+'</h2><div class="wt">'+sub+'</div><button onclick="closeBase();PAUSE=false">✕</button></div>'+(info||'')+
  '<div class="iaG">'+acts.map((q,i)=>'<button data-ia="'+i+'"'+(q.off?' class="off"':'')+'>'+q.t+'</button>').join('')+'</div>'+(extra||'');
 b.style.display='block';b.querySelectorAll('[data-ia]').forEach(x=>x.onclick=()=>{const q=acts[+x.dataset.ia];if(!q||q.off){if(q)msg('지금은 할 수 없어요');return}closeBase();PAUSE=false;q.f();IAK=''})}
function ia2Ally(a,acts){const R0=AROLE[a.role]||{},mx=aMhp(a),f=Math.max(0,a.hp/mx),id=typeof aAmmoId=='function'?aAmmoId(a):null;
 const ammo=id?(a.mag|0)+(aPouch(a)[id]|0)+'발':'근접 무기';const GR=AGRADE[a.gr||1];
 const info='<div class="iaI"><canvas id="iaPic" width="72" height="80"></canvas><div><b>'+(R0.ic||'')+' '+a.nm+' <span style="color:'+GR[1]+'">'+GR[0]+'</span></b><small>'+(R0.nm||a.role)+' · Lv'+a.lv+' · '+(ASTN[a.st]||'')+'</small>'+
  '<div class="iaB"><i style="width:'+f*100+'%;background:'+(f>.5?'#5fe08a':f>.25?'#ffd36a':'#ff6a5a')+'"></i></div><small>체력 '+Math.round(a.hp)+'/'+mx+' · '+NM2(aWid(a))+' · '+ammo+(a.shd?' · 🛡 '+Math.round(shdRatioAlly(a)*100)+'%':'')+'</small></div></div>';
 const more=[...acts];if(a.role=='gun'&&typeof aGiveOpen=='function'&&a.st!='down')more.push({t:'🔫 무기 건네기',f:()=>aGiveOpen(a)});if(typeof mastOpen=='function')more.push({t:'🎖 숙련도',f:()=>mastOpen(a)});more.push({t:'📋 동료 전체 관리',f:aOpen});
 ia2Open('👤 '+a.nm,'동료 · 누를 것만 골라요',info,more);
 try{const c=$('iaPic'),x=c.getContext('2d'),o=g;g=x;x.imageSmoothingEnabled=false;x.scale(2,2);drawChar(aLook(a),18,38,'d',-1,typeof wkOf=='function'?wkOf(aWid(a)):undefined);g=o}catch(e){}}
function ia2Deco(o,t,acts){const D=DECO[t],d=DSTORE().find(q=>q.id==o.did)||{},prod=typeof DPROD!='undefined'&&DPROD[t];
 const info='<div class="iaI"><canvas id="iaPic" width="'+(D[4]+12)*2+'" height="'+(D[5]+24)*2+'"></canvas><div><b>'+D[0]+' '+D[1]+'</b><small>'+D[7]+'</small>'+(prod?'<small>쌓인 것: '+NM2(prod)+' '+(d.buf|0)+'/'+(typeof DPCAP!='undefined'?DPCAP:5)+' · 보관함 연결: '+(d.to==null?'끔':(dBoxNames()[d.to]||'보관함'))+'</small>':'')+'<small>아늑함 +'+D[3]+'</small></div></div>';
 ia2Open(D[0]+' '+D[1],'거점 장식',info,acts.map(q=>({t:q.t.replace(' '+D[1],'').replace(D[1]+' ',''),f:q.f,off:q.off})));
 try{const c=$('iaPic'),x=c.getContext('2d'),og=g;g=x;x.imageSmoothingEnabled=false;x.scale(2,2);dArt[t](6,18,D[4],D[5],{v:d.v|0});g=og}catch(e){}}
document.head.insertAdjacentHTML('beforeend',`<style>
#bm .iaI{display:flex;gap:12px;align-items:center;padding:8px;margin:4px 0 10px;border-radius:12px;background:#ffffff08;border:1px solid #ffffff14}#bm .iaI canvas{image-rendering:pixelated;flex:none;max-width:110px;height:auto}
#bm .iaI>div{display:flex;flex-direction:column;gap:3px;min-width:0;flex:1}#bm .iaI b{font-size:15px}#bm .iaI small{color:var(--mut);font-size:11.5px;line-height:1.4}
#bm .iaB{height:7px;border-radius:4px;background:#ffffff1a;overflow:hidden}#bm .iaB i{display:block;height:100%}
#bm .iaG{display:grid;grid-template-columns:1fr 1fr;gap:8px}#bm .iaG button{padding:13px 8px;font-size:14px;border-radius:12px;text-align:center;line-height:1.3}#bm .iaG button.off{opacity:.4}
@media (max-width:360px){#bm .iaG{grid-template-columns:1fr}}</style>`);
