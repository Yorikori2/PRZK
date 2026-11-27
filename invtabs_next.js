/* PROJECT LEGACY — more tabs in the bag window: 👥 동료 · 🔧 파츠.
   🔧 파츠: guns take parts in four places only — 총열 · 사이드 (레이저 / 전술 플래시) · 손잡이 · 사이트.
   (Muzzle · magazine · stock · trigger slots are gone; parts already in them come off by themselves.)
   You can look anywhere; changing parts needs the 🔧 총기 파츠 작업대 (a new base station with its own pixel art).
   👥 동료: every companion at a glance — health, weapon, rounds, where they are — and their own window.
   Loaded after bagui_next.js and ia2_next.js. */
'use strict';
/* ---------- the four places ---------- */
const PS4=[['barrel','총열'],['side','사이드 (레이저 · 플래시)'],['under','손잡이'],['optic','사이트']];
const PS4K=PS4.map(x=>x[0]);
if(typeof PSLOTS!='undefined'){PSLOTS.splice(0,PSLOTS.length,...PS4)}
if(typeof CSLOT!='undefined')for(const cl in CSLOT){const had=CSLOT[cl];const n=PS4K.filter(k=>k=='side'?had.includes('under'):had.includes(k)||(k=='under'&&cl=='pistol'));CSLOT[cl].splice(0,CSLOT[cl].length,...n)}
/* laser and light move to the side rail · two new parts so each place has a choice */
if(typeof P_BY!='undefined'){for(const id of['u_laser','u_light'])if(P_BY[id])P_BY[id][2]='side';
 const add=(p)=>{if(!P_BY[p[0]]){PARTS.push(p);P_BY[p[0]]=p}};
 add(['sd_combo','레이저 · 플래시 콤보','side','r',['pistol','smg','rifle','shotgun'],{acc:8,night:1},'경찰서 · 군부대']);
 add(['g_angle','앵글 손잡이','under','u',['pistol','smg','rifle','shotgun'],{rec:-8,mov:2},'철물점 · 경찰서']);
 add(['g_stub','짧은 손잡이','under','c',['pistol','smg','rifle'],{rec:-5,acc:2},'주택 · 철물점'])}
/* only the four places count (old muzzle / magazine / stock / trigger parts are taken off once) */
function ps4Clean(){try{const pg=S&&S.pg;if(!pg||pg.ps4)return;for(const g in pg.mods){const m=pg.mods[g];for(const k of Object.keys(m))if(!PS4K.includes(k))delete m[k];if(typeof s3MagFix=='function')try{s3MagFix(g)}catch(e){}}pg.ps4=1;if(typeof s3dirty=='function')s3dirty()}catch(e){}}
{const _st=start;start=function(){const r=_st.apply(this,arguments);ps4Clean();return r}}
/* ---------- the bench ---------- */
const nearGunBench=()=>{if(!S||!S.p||typeof DUN!='undefined'&&DUN)return false;return W0.objs.some(o=>o.t=='deco_gunbench'&&Math.hypot(o.x+o.w/2-S.p.x,o.y+o.h/2-S.p.y)<70)};
if(typeof DECO!='undefined'&&!DECO.gunbench){DECO.gunbench=['🔧','총기 파츠 작업대',{scrap:20,steel:4,wood:6},1,52,28,true,'총에 파츠를 끼우고 빼는 곳 · 앞에서 [상호작용]'];DLIST.push('gunbench');
 dArt.gunbench=(x,y,w,h)=>{const K='#1d1714',t=performance.now()/600;
  /* pegboard with tools */R(K,x+2,y-26,w-4,22);R('#7a5a3a',x+3,y-25,w-6,20);for(let i=x+6;i<x+w-6;i+=5)for(let j=y-22;j<y-6;j+=5)R('#5a4028',i,j,1,1);
  R('#c9ccd0',x+8,y-22,2,10);R('#8a9096',x+6,y-22,6,2);/* wrench */R('#c84a3a',x+16,y-21,3,9);R('#2a2c30',x+16,y-12,3,3);/* screwdriver */R('#8a9096',x+24,y-20,9,2);R('#8a9096',x+31,y-22,2,6);/* hammer-ish */R('#e8c84a',x+38,y-22,6,4);R('#2a2c30',x+40,y-18,2,6);
  /* lamp */R(K,x+w-12,y-34,2,10);R('#3a3a3a',x+w-16,y-36,10,4);g.globalAlpha=.25+.1*Math.sin(t);R('#ffe9a0',x+w-18,y-32,14,10);g.globalAlpha=1;
  /* bench top + legs */R(K,x,y-4,w,8);R('#8a5a34',x+1,y-3,w-2,6);R('#a8744a',x+1,y-3,w-2,2);R('#5a3a24',x+3,y+4,4,h-6);R('#5a3a24',x+w-7,y+4,4,h-6);R('#5a3a24',x+3,y+h-6,w-6,2);
  /* a gun on the bench, a vice, parts */R('#2a2c30',x+10,y-8,22,4);R('#3a3e44',x+10,y-8,22,1);R('#2a2c30',x+14,y-5,3,4);R('#1d1714',x+30,y-9,4,2);R('#ff4a3a',x+24,y-9,2,1);
  R('#5a6068',x+38,y-10,8,6);R('#8a9096',x+38,y-10,8,2);R('#5a6068',x+41,y-4,2,3);R('#c9a42a',x+6,y-6,2,2);R('#c9ccd0',x+35,y-5,2,2)};
 if(DTH&&DTH.mem)DTH.mem[2].push('gunbench');P('deco_gunbench','총기 파츠 작업대',null,o=>dArt.gunbench(o.x,o.y,o.w,o.h,o),true)}
{const _c=dmCtx;dmCtx=function(){const B=_c();try{if(!S||!run||S.dr)return B;if(nearGunBench()){const i=B.findIndex(q=>/총기 파츠 작업대/.test(q.t));if(i>=0)B.splice(i,1);B.unshift({t:'🔧 총기 파츠 장착',f:()=>{BTAB='parts';openBag()},big:1})}}catch(e){}return B}}
if(typeof IAW!='undefined')IAW.unshift([/총기 파츠 장착/,'파츠']);
/* ---------- the tabs ---------- */
let PGUN=null,PSL=null;
{const _ob=openBag;openBag=function(id){if(BTAB=='ally'||BTAB=='parts'){const keep=BTAB;BTAB='bag';_ob.apply(this,arguments);BTAB=keep}else _ob.apply(this,arguments);
 try{const b=$('bm'),tabs=b.querySelector('.bTab');if(!tabs)return;if(!tabs.querySelector('[data-bt="ally"]')){tabs.insertAdjacentHTML('beforeend','<button data-bt="parts">🔧 파츠</button><button data-bt="ally">👥 동료 <small>'+((S.inf&&S.inf.allies||[]).length)+'</small></button>');
   tabs.querySelectorAll('[data-bt]').forEach(x=>x.onclick=()=>{BTAB=x.dataset.bt;openBag()})}
  tabs.querySelectorAll('[data-bt]').forEach(x=>x.classList.toggle('on',x.dataset.bt==BTAB));
  if(BTAB!='ally'&&BTAB!='parts')return;
  /* hide the bag part, show ours */
  [...b.children].forEach(el=>{if(el.classList.contains('sh')||el.classList.contains('bTab'))return;el.style.display='none'});
  tabs.insertAdjacentHTML('afterend','<div id="ivX">'+(BTAB=='ally'?allyTab():partsTab())+'</div>');
  if(BTAB=='parts')partsBind();else allyBind()}catch(e){console.error(e)}}}
/* ---- 🔧 parts ---- */
function partsTab(){const p=S.p,pg=PGo(),guns=Object.keys(p.inv).filter(id=>p.inv[id]>0&&GCLASS[id]&&W_BY[id]);if(!guns.length)return'<div class="sub">가진 총이 없어요</div>';
 if(!guns.includes(PGUN))PGUN=guns.includes(actW(p))?actW(p):guns[0];const id=PGUN,cl=GCLASS[id],mods=pg.mods[id]||{},can=nearGunBench(),cap=typeof s3Rar=='function'?s3Rar():'l';
 let h='<div class="ptB'+(can?' ok':'')+'">'+(can?'🔧 총기 파츠 작업대 앞 · 끼우고 뺄 수 있어요':'🔒 보기만 할 수 있어요 · 파츠를 바꾸려면 거점의 <b>🔧 총기 파츠 작업대</b> 앞에서 열어요 (거점 꾸미기에서 지어요)')+'</div>';
 h+='<div class="flt">'+guns.map(g=>'<span class="chip'+(g==id?' on':'')+'" data-pg="'+g+'">'+NM2(g)+'</span>').join('')+'</div><div class="ptV"><canvas id="ptC"></canvas></div>';
 h+='<div class="ptS">'+PS4.map(([sl,n])=>{const ok=CSLOT[cl].includes(sl),pid=mods[sl],pt=pid&&P_BY[pid];return'<div class="sl'+(PSL==sl?' on':'')+(ok?'':' no')+'" data-ps="'+sl+'"><small>'+n+'</small>'+(!ok?'<b class="em">이 총은 없음</b>':pt?'<b style="color:'+RAR[pt[3]][1]+'">'+pt[1]+'</b><small>'+(typeof fxTxt=='function'?fxTxt(pt[5]):'')+'</small>':'<b class="em">비어 있음</b>')+'</div>'}).join('')+'</div>';
 if(PSL&&CSLOT[cl].includes(PSL)){const cur=mods[PSL],L=PARTS.filter(q=>q[2]==PSL&&q[4].includes(cl)&&(pg.parts[q[0]]||0)>0&&q[0]!=cur);
  h+='<div class="s3h">'+PS4.find(x=>x[0]==PSL)[1]+'</div><div class="pl">'+(cur?'<div class="pi cur"><b>'+P_BY[cur][1]+' 장착 중</b>'+(typeof fxTxt=='function'?fxTxt(P_BY[cur][5]):'')+(can?'<button data-pun="1">빼기</button>':'')+'</div>':'')+
   (L.map(q=>{const okR=RORD.indexOf(q[3])<=RORD.indexOf(cap),fr=partsFree(q[0]);return'<div class="pi"><b style="color:'+RAR[q[3]][1]+'">'+q[1]+'</b><small>'+RAR[q[3]][0]+' · 남은 '+fr+'개</small>'+(typeof fxTxt=='function'?fxTxt(q[5]):'')+(!can?'':!okR?'<em>🔒 총기 개조 스킬 필요</em>':fr>0?'<button data-ppu="'+q[0]+'">장착</button>':'<em>다른 총에 장착 중</em>')+'</div>'}).join('')||(!cur?'<div class="sub">이 자리에 맞는 파츠가 없어요 · '+PARTS.filter(q=>q[2]==PSL&&q[4].includes(cl)).map(q=>q[1]+' ('+q[6]+')').slice(0,3).join(' · ')+'</div>':''))+'</div>'}
 else h+='<div class="sub">자리를 누르면 끼울 수 있는 파츠가 나와요</div>';return h}
function partsBind(){const b=$('bm'),pg=PGo();b.querySelectorAll('[data-pg]').forEach(x=>x.onclick=()=>{PGUN=x.dataset.pg;PSL=null;openBag()});b.querySelectorAll('[data-ps]').forEach(x=>x.onclick=()=>{if(x.classList.contains('no'))return;PSL=PSL==x.dataset.ps?null:x.dataset.ps;openBag()});
 b.querySelectorAll('[data-ppu]').forEach(x=>x.onclick=()=>{if(!nearGunBench())return;const m=pg.mods[PGUN]=pg.mods[PGUN]||{};m[PSL]=x.dataset.ppu;s3dirty();try{s3MagFix(PGUN)}catch(e){}msg('🔧 '+P_BY[x.dataset.ppu][1]+' 장착');hud2();openBag()});
 b.querySelectorAll('[data-pun]').forEach(x=>x.onclick=()=>{if(!nearGunBench())return;const m=pg.mods[PGUN]||{},q=m[PSL];delete m[PSL];s3dirty();try{s3MagFix(PGUN)}catch(e){}msg('🔧 '+P_BY[q][1]+' 빼기');hud2();openBag()});
 const c=$('ptC');if(c&&PGUN&&typeof blueprint=='function'){try{const m=Object.assign({},pg.mods[PGUN]||{});delete m.side;const bp=blueprint(PGUN,m);c.width=bp.width*3;c.height=bp.height*3;const x=c.getContext('2d');x.imageSmoothingEnabled=false;x.drawImage(bp,0,0,c.width,c.height);
  const sd=(pg.mods[PGUN]||{}).side;if(sd){x.fillStyle='#1d1714';x.fillRect(c.width*.52,c.height*.52,24,12);x.fillStyle=sd=='u_light'?'#ffe9a0':'#ff4a3a';x.fillRect(c.width*.52+18,c.height*.52+3,6,6);if(sd!='u_light'){x.globalAlpha=.6;x.fillRect(c.width*.52+24,c.height*.52+5,c.width*.4,2);x.globalAlpha=1}}}catch(e){}}}
/* ---- 👥 companions ---- */
function allyTab(){const L=(S.inf&&S.inf.allies)||[];if(!L.length)return'<div class="sub">아직 동료가 없어요 · 생존자 신호를 찾아 구출해 보세요</div>';
 return'<div class="ivA">'+L.map(a=>{const R0=AROLE[a.role]||{},mx=aMhp(a),f=Math.max(0,a.hp/mx),id=typeof aAmmoId=='function'?aAmmoId(a):null,ammo=id?(a.mag|0)+(aPouch(a)[id]|0)+'발':'근접';const GR=AGRADE[a.gr||1];
  return'<div class="ivC" data-al="'+a.id+'"><canvas data-ap="'+a.id+'" width="72" height="80"></canvas><div><b>'+(R0.ic||'')+' '+a.nm+' <span style="color:'+GR[1]+'">'+GR[0]+'</span> <small>Lv'+a.lv+'</small></b><small>'+(R0.nm||'')+' · '+(a.st=='job'&&AJOB[a.job]?AJOB[a.job][1]:ASTN[a.st]||'')+'</small>'+
   '<div class="iaB"><i style="width:'+f*100+'%;background:'+(f>.5?'#5fe08a':f>.25?'#ffd36a':'#ff6a5a')+'"></i></div><small>'+NM2(aWid(a))+' · '+ammo+(a.shd?' · 🛡 '+Math.round(shdRatioAlly(a)*100)+'%':'')+'</small></div><span class="ivGo">›</span></div>'}).join('')+'</div>'+
  '<div class="vR" style="margin-top:8px"><button id="ivAll">📋 동료 전체 관리</button></div>'}
function allyBind(){const b=$('bm');b.querySelectorAll('canvas[data-ap]').forEach(c=>{const a=aById(+c.dataset.ap);if(!a)return;try{const x=c.getContext('2d'),o=g;g=x;x.imageSmoothingEnabled=false;x.scale(2,2);drawChar(aLook(a),18,38,'d',-1,typeof wkOf=='function'?wkOf(aWid(a)):undefined);g=o}catch(e){}});
 b.querySelectorAll('[data-al]').forEach(x=>x.onclick=()=>{const a=aById(+x.dataset.al);if(!a)return;const acts=[];if(a.st!='follow'&&a.st!='down'&&a.st!='hurt')acts.push({t:'🤝 같이 가자',f:()=>aSet(a,'follow'),off:nFollow()>=2});if(a.st=='follow')acts.push({t:'✋ 여기서 기다려',f:()=>aSet(a,'wait')},{t:'🏠 거점으로 보내기',f:()=>aSet(a,'base')});ia2Ally(a,acts)});
 const all=$('ivAll');if(all)all.onclick=()=>aOpen()}
document.head.insertAdjacentHTML('beforeend',`<style>
#bm .bTab{flex-wrap:wrap}#bm .bTab button{flex:1 1 22%;min-width:0;padding:9px 0;font-size:13px}
#bm .ptB{padding:8px 10px;border-radius:10px;font-size:12px;margin-bottom:8px;background:#ff6a5a14;border:1px solid #ff6a5a44}#bm .ptB.ok{background:#7fd07f14;border-color:#7fd07f55}
#bm .ptV{display:flex;justify-content:center;margin:6px 0}#bm .ptV canvas{image-rendering:pixelated;max-width:100%;height:auto}
#bm .ptS{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px}#bm .ptS .sl{padding:8px;border-radius:10px;border:1px solid #ffffff22;background:#ffffff08;display:flex;flex-direction:column;gap:2px;cursor:pointer}
#bm .ptS .sl.on{border-color:#ffd36a;background:#e0b03a22}#bm .ptS .sl.no{opacity:.4}#bm .ptS small{font-size:11px;color:var(--mut)}#bm .ptS b{font-size:13px}#bm .ptS .em{color:var(--mut);font-weight:400}
#bm .ivA{display:flex;flex-direction:column;gap:6px}#bm .ivC{display:flex;gap:10px;align-items:center;padding:6px 8px;border-radius:12px;border:1px solid #ffffff1a;background:#ffffff08;cursor:pointer}
#bm .ivC canvas{width:44px;height:auto;image-rendering:pixelated;flex:none}#bm .ivC>div{flex:1;display:flex;flex-direction:column;gap:2px;min-width:0}#bm .ivC small{font-size:11px;color:var(--mut)}#bm .ivGo{font-size:22px;color:var(--mut)}</style>`);
/* ---------- production facilities and the gun bench live in the base window (거점 관리), not in decorating ---------- */
const FACS=['garden','coop','barrel','pond','coffeem','gunbench'];
if(typeof DTH!='undefined')for(const t in DTH){const L=DTH[t][2];for(let i=L.length-1;i>=0;i--)if(FACS.includes(L[i]))L.splice(i,1)}
if(typeof DECO!='undefined')for(const k of FACS)if(DECO[k])DECO[k][3]=0;/* facilities give no comfort */
{const _ob=openBase;openBase=function(){_ob.apply(this,arguments);try{const b=$('bm');if(b.querySelector('.fcS'))return;const cnt={};for(const d of DSTORE())cnt[d.t]=(cnt[d.t]|0)+1;
  const desc={garden:'매일 아침 통조림 1 (그 자리에 쌓임 · 보관함 연결 가능)',coop:'매일 아침 통조림 1 (달걀)',barrel:'매일 아침 물병 1',pond:'매일 아침 물병 1',coffeem:'원두 1 + 물병 1 → 캔커피 2',gunbench:'총열 · 손잡이 파츠를 끼우고 빼는 곳'};
  const row=k=>{const D=DECO[k];if(!D)return'';const ok=typeof dHave=='function'&&dHave(D[2]);return'<div class="mod"><div class="ic">'+D[0]+'</div><div><b>'+D[1]+'</b>'+(cnt[k]?' <span class="lv">×'+cnt[k]+'</span>':'')+'<div class="ef">'+desc[k]+'</div><div class="cost">'+Object.entries(D[2]).map(([i,v])=>NM2(i)+' '+v).join(' · ')+'</div></div><button '+(ok?'':'disabled')+' data-fc="'+k+'">'+(cnt[k]?'하나 더':'건설')+'</button></div>'};
  b.insertAdjacentHTML('beforeend','<div class="fcS"><h3>🏭 생산 시설</h3>'+['garden','coop','barrel','pond','coffeem'].map(row).join('')+'<h3>🔧 작업 시설</h3>'+row('gunbench')+'<div class="sub">짓기를 누르면 설치 화면이 열려요 · 다 지은 시설은 앞에서 [상호작용]으로 회수 · 연결 · 옮기기</div></div>');
  b.querySelectorAll('[data-fc]').forEach(x=>x.onclick=()=>dStart(x.dataset.fc))}catch(e){}}}
document.head.insertAdjacentHTML('beforeend','<style>#bm .fcS h3{margin:14px 0 4px;font-size:14px}</style>');
/* ---------- light parts (사이드 · 사이트) can be changed anywhere; 총열 · 손잡이 need the bench ---------- */
const PLIGHT=['side','optic'];
const canPart=sl=>PLIGHT.includes(sl)||nearGunBench();
{const _pt=partsTab;partsTab=function(){let h=_pt();const can=nearGunBench();if(!can)h=h.replace(/<div class="ptB">[\s\S]*?<\/div>/,'<div class="ptB lite">✋ <b>사이드 · 사이트</b>는 여기서 바로 바꿀 수 있어요 · <b>총열 · 손잡이</b>는 거점의 🔧 총기 파츠 작업대에서</div>');return h}}
{const _pb=partsBind;partsBind=function(){_pb();try{const b=$('bm');if(nearGunBench()||!PSL||!PLIGHT.includes(PSL))return;const pg=PGo();
  /* buttons for light parts when away from the bench (the original list hides them there) */const cl=GCLASS[PGUN],cur=(pg.mods[PGUN]||{})[PSL],cap=typeof s3Rar=='function'?s3Rar():'l';
  b.querySelectorAll('.pl .pi').forEach(el=>{if(el.querySelector('button')||el.querySelector('em'))return;if(el.classList.contains('cur')){el.insertAdjacentHTML('beforeend','<button data-lun="1">빼기</button>');return}
   const nm=el.querySelector('b')&&el.querySelector('b').textContent,q=PARTS.find(q=>q[1]==nm&&q[2]==PSL);if(!q)return;const okR=RORD.indexOf(q[3])<=RORD.indexOf(cap),fr=partsFree(q[0]);el.insertAdjacentHTML('beforeend',!okR?'<em>🔒 총기 개조 스킬 필요</em>':fr>0?'<button data-lpu="'+q[0]+'">장착</button>':'<em>다른 총에 장착 중</em>')});
  b.querySelectorAll('[data-lpu]').forEach(x=>x.onclick=()=>{const m=pg.mods[PGUN]=pg.mods[PGUN]||{};m[PSL]=x.dataset.lpu;s3dirty();msg('✋ '+P_BY[x.dataset.lpu][1]+' 장착');hud2();openBag()});
  b.querySelectorAll('[data-lun]').forEach(x=>x.onclick=()=>{const m=pg.mods[PGUN]||{},q=m[PSL];delete m[PSL];s3dirty();msg('✋ '+P_BY[q][1]+' 빼기');hud2();openBag()})}catch(e){}}}
document.head.insertAdjacentHTML('beforeend','<style>#bm .ptB.lite{background:#7fb4ff14;border-color:#7fb4ff55}#bm .ptS .sl small.lt{color:#9ad0ff}</style>');
/* mark the light places on the slot cards */
{const _pt2=partsTab;partsTab=function(){let h=_pt2();return h.replace(/<small>(사이드 \(레이저 · 플래시\)|사이트)<\/small>/g,'<small>$1 · ✋ 어디서나</small>').replace(/<small>(총열|손잡이)<\/small>/g,'<small>$1 · 🔧 작업대</small>')}}
