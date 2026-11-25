/* PROJECT LEGACY — sample: the weapon card, three other ways, and no more buttons sitting on top of it.
   · 기본 (old card): the 🔨 bubble is gone — 철거 is a button on the card; the interact hint gets its own space.
   · A 공격 버튼형: the card disappears; the attack button shows the weapon and ammo, with a magazine ring around it
     and small 장전 · 교체 · 탄 · 철거 buttons above it.
   · B 슬림 바: one thin row — weapon, ammo, 장전 · 교체 · 탄 · 철거.
   · C 슬롯형: a row of slots (주무기 · 보조 · 근접 · 투척 · 철거). Tap to switch, tap the one in hand to reload,
     hold a gun slot for the ammo list. Demolition is just another slot.
   Loaded after uiact_next.js and ammoq_next.js. */
'use strict';
let WCS='C';try{WCS=localStorage.getItem('pl_wcs')||'C'}catch(e){}
function wcSet(s){WCS=s;try{localStorage.setItem('pl_wcs',s)}catch(e){}document.body.dataset.wcs=s;WCK='';wcRender()}
document.body.dataset.wcs=WCS;
/* what is in hand */
function wcInfo(id){const p=S.p,w=W_BY[id],s=id=='fist'?{}:(wdef(id)||[])[4]||{},cal=s.ammo,sel=cal&&p.aSel&&p.aSel[cal];
 return{id,w,s,lv:W_BY[id]&&typeof enhLv=='function'?enhLv(id):0,gun:!!(cal&&s.mag),mag:p.mag[id]|0,max:s.mag||0,rs:cal?(p.inv[sel||AMMO_ITEM(cal)]|0):0,kind:cal&&typeof aqShort=='function'?aqShort((p.magT&&p.magT[id]&&(p.mag[id]|0)>0)?p.magT[id]:sel||'a'+cal):'',
  dur:s.dur?(p.dur[id]??s.dur):null,dmax:s.dur||0,thr:w&&w[2]=='t',cnt:p.inv[id]|0,rl:p.rl>0&&p.rlw==id}}
const wcAmmo=i=>i.gun?(i.rl?'장전 중':i.mag+'<small>/'+i.rs+'</small>'):i.thr?i.cnt+'<small>개</small>':i.dur!=null?'<small>내구 '+i.dur+'</small>':'';
const wcTool=()=>typeof bestTool=='function'&&bestTool();
function wcAct(a){const p=S.p;if(a=='rl')reload(p);else if(a=='sw'){if(typeof DEMO!='undefined'&&DEMO)demoMode(false);cycleW()}else if(a=='am'){if(typeof aqNext=='function')aqNext()}else if(a=='dm')demoMode();hud2()}
/* ---------- render ---------- */
let WCK='',WCT=0;
document.body.insertAdjacentHTML('beforeend','<div id="wc2"></div>');
function wcRender(){if(!S||!S.p||!run)return;const el=$('wc2'),p=S.p,id=actW(p),i=wcInfo(id),tool=wcTool(),dm=typeof DEMO!='undefined'&&DEMO;
 const key=WCS+id+i.mag+'/'+i.rs+i.rl+i.kind+i.dur+i.cnt+dm+tool+ACT.map(s=>p.eq[s]).join()+p.as;if(key==WCK)return;WCK=key;
 if(WCS=='old'){el.innerHTML='';const wb=$('wc')&&$('wc').querySelector('.wb');if(wb&&tool&&!wb.querySelector('[data-a=dm]'))wb.insertAdjacentHTML('beforeend','<span data-a="dm" class="'+(dm?'on':'')+'">'+(dm?'철거 끄기':'철거')+'</span>');
  const atk=$('atk');if(atk)atk.innerHTML=dm?'철거':'공격';return}
 if(WCS=='A'){const atk=$('atk'),f=i.gun&&i.max?i.mag/i.max:1;atk.innerHTML=(id=='fist'?'<b class="aw">✊</b>':'<img class="aw" src="'+icon(id)+'">')+'<span class="aa">'+(dm?'철거':i.gun?(i.rl?'장전':i.mag):'공격')+'</span>';
  atk.style.setProperty('--f',f);el.innerHTML='<div class="nm">'+(i.lv?'+'+i.lv+' ':'')+NM2(id)+(i.gun?' · '+i.rs:'')+'</div><div class="bb">'+(i.gun?'<button data-a="rl">장전</button>':'')+'<button data-a="sw">교체</button>'+(i.kind?'<button data-a="am">'+i.kind+'</button>':'')+(tool?'<button data-a="dm" class="'+(dm?'on':'')+'">철거</button>':'')+'</div>';return}
 if(WCS=='B'){el.innerHTML=(id=='fist'?'<b class="ic">✊</b>':'<img class="ic" src="'+icon(id)+'">')+'<div class="tx"><b>'+(i.lv?'+'+i.lv+' ':'')+NM2(id)+'</b><span>'+wcAmmo(i)+'</span></div>'+(i.gun?'<button data-a="rl">장전</button>':'')+'<button data-a="sw">교체</button>'+(i.kind?'<button data-a="am">'+i.kind+'</button>':'')+(tool?'<button data-a="dm" class="'+(dm?'on':'')+'">철거</button>':'');
  const atk=$('atk');if(atk)atk.innerHTML=dm?'철거':'공격';return}
 /* C: slots */const L=ACT.filter(s=>p.eq[s]&&has(p,p.eq[s])&&!(DT[p.eq[s]]&&s=='mel'&&dm)).map(s=>[s,p.eq[s]]);if(tool)L.push(['dm',tool]);const NM={prim:'주무기',sec:'보조',mel:'근접',thr:'투척',dm:'철거'};
 el.innerHTML=L.map(([s,wid])=>{const on=s=='dm'?dm:(!dm&&p.as==s),q=wcInfo(wid);return'<div class="sl'+(on?' on':'')+'" data-s="'+s+'"><img src="'+icon(wid)+'"><span class="k">'+(on&&q.kind&&q.gun?q.kind:NM[s])+'</span><span class="v">'+(s=='dm'?'':wcAmmo(q))+'</span>'+(on&&q.lv?'<span class="lv">+'+q.lv+'</span>':'')+'</div>'}).join('');
 const atk=$('atk');if(atk)atk.innerHTML=dm?'철거':'공격'}
{const _h=hud2;hud2=function(){const r=_h.apply(this,arguments);try{WCK='';wcRender()}catch(e){}return r}}
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);WCT-=dt;if(WCT<=0){WCT=.15;try{wcRender()}catch(e){}}}}
/* taps */
{let tm=null,held=false;const el=$('wc2');
 el.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();if(!run)return;const b=e.target.closest('[data-a]');if(b)return wcAct(b.dataset.a);const s=e.target.closest('[data-s]');if(!s)return;held=false;clearTimeout(tm);
  tm=setTimeout(()=>{held=true;const p=S.p;if(s.dataset.s==p.as&&typeof aqList=='function'&&wcInfo(actW(p)).gun)aqList()},420)});
 el.addEventListener('pointerup',e=>{e.preventDefault();e.stopPropagation();clearTimeout(tm);if(held||!run)return;const s=e.target.closest('[data-s]');if(!s)return;const p=S.p,k=s.dataset.s,dm=typeof DEMO!='undefined'&&DEMO;
  if(k=='dm'){demoMode(!dm);return}if(dm)demoMode(false);if(p.as==k){if(wcInfo(actW(p)).gun)reload(p)}else{p.as=k;p.rl=0}WCK='';hud2()})}
/* the old card's new 철거 button */
$('wc').addEventListener('pointerdown',e=>{const a=e.target.closest('[data-a="dm"]');if(!a||!run)return;e.preventDefault();e.stopImmediatePropagation();demoMode();WCK=''},true);
document.head.insertAdjacentHTML('beforeend',`<style>#demoB{display:none!important}
#rc{bottom:calc(env(safe-area-inset-bottom,0px) + 132px)!important}
body:not([data-wcs="old"]) #wc{display:none!important}body[data-wcs="B"] #rc,body[data-wcs="C"] #rc{bottom:calc(env(safe-area-inset-bottom,0px) + 200px)!important}
#wc2{position:fixed;right:8px;z-index:3;bottom:calc(env(safe-area-inset-bottom,0px) + 132px)}body[data-wcs="old"] #wc2{display:none}
#wc .wb span.on{background:#6b4426;border-color:#ffd36a}
/* A */body[data-wcs="A"] #wc2{display:flex;flex-direction:column;align-items:flex-end;gap:4px;bottom:calc(env(safe-area-inset-bottom,0px) + 100px)}body[data-wcs="A"] #rc{bottom:calc(env(safe-area-inset-bottom,0px) + 176px)!important}
body[data-wcs="A"] #wc2 .nm{font-size:11px;padding:2px 8px;border-radius:99px;background:#000a;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}body[data-wcs="A"] #wc2 .bb{display:flex;gap:4px}
#wc2 button{width:auto;padding:5px 10px;font-size:12px;border-radius:10px;background:#1e2a33ee}#wc2 button.on{background:#6b4426;border-color:#ffd36a}
body[data-wcs="A"] #atk{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;position:relative}body[data-wcs="A"] #atk .aw{width:38px;height:38px;image-rendering:pixelated;font-size:24px}body[data-wcs="A"] #atk .aa{font-size:13px;font-weight:800}
body[data-wcs="A"] #atk::after{content:'';position:absolute;inset:-5px;border-radius:50%;background:conic-gradient(#ffd36a calc(var(--f,1)*360deg),#ffffff22 0);-webkit-mask:radial-gradient(circle,transparent 62%,#000 63%);mask:radial-gradient(circle,transparent 62%,#000 63%);pointer-events:none}
/* B */body[data-wcs="B"] #wc2{display:flex;align-items:center;gap:5px;padding:5px 6px;border-radius:12px;background:#141a20e6;border:1px solid #ffffff22;max-width:calc(100vw - 16px)}
#wc2 .ic{width:34px;height:34px;image-rendering:pixelated;font-size:22px;text-align:center}#wc2 .tx{display:flex;flex-direction:column;min-width:70px;max-width:120px}#wc2 .tx b{font-size:11.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#wc2 .tx span{font-size:15px;font-weight:800}#wc2 .tx small{font-size:10px;color:var(--mut);font-weight:500}
/* C */body[data-wcs="C"] #wc2{display:flex;gap:5px}#wc2 .sl{position:relative;width:54px;height:58px;border-radius:12px;background:#141a20e6;border:1.5px solid #ffffff22;display:flex;flex-direction:column;align-items:center;justify-content:center}
#wc2 .sl img{width:30px;height:30px;image-rendering:pixelated}#wc2 .sl .k{font-size:9.5px;color:var(--mut)}#wc2 .sl .v{font-size:11px;font-weight:800;line-height:1}#wc2 .sl .v small{font-size:9px;color:var(--mut);font-weight:500}
#wc2 .sl.on{border-color:#ffd36a;background:#2a2410ee;box-shadow:0 0 8px #ffd36a55}#wc2 .sl .lv{position:absolute;top:2px;right:4px;font-size:9px;color:#ffd36a;font-weight:800}#wc2 .sl .kd{position:absolute;top:2px;left:4px;font-size:8.5px;color:#9ad0f0}
#wc2 .sl[data-s="dm"]{border-style:dashed}#wc2 .sl[data-s="dm"].on{border-color:#e0b03a;background:#4a3014ee}</style>`);
