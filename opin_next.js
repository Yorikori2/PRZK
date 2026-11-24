/* PROJECT LEGACY — sample: small ideas bundled together.
   1 exploration map + home arrow · 2 crowd cap ×2 · 3 "+8" on the weapon card · 4 ammo in the first-entry supply ·
   6 saved pick lists · 9 turret low-ammo alerts · 10 the bulldozer's own fuel tank. Loaded after stash_next.js. */
'use strict';
/* ---------- 2. crowd cap: ×2.5 → ×2 ---------- */
{const _zp=zProf;zProf=function(zn){const P=_zp(zn);P.dens=Math.min(2,P.dens);return P}}
/* ---------- 1. exploration map ---------- */
const KCOL={base:'#7fd07f',houses:'#b08a6a',apt:'#9a7a8a',park:'#4f8a45',mart:'#d9b52a',church:'#c9c2b4',school:'#5a8ac8',hard:'#a86a3a',ware:'#8a8f95',fire:'#c84a3a',clinic:'#e8e8f0',police:'#3a5a9a',mil:'#5a6a3a',milR:'#5a6a3a',lab:'#8a5ac8',lot:'#6b6152'};
const KNAME={base:'거점',houses:'주택가',apt:'아파트',park:'공원',mart:'편의점',church:'교회',school:'학교',hard:'철물점',ware:'물류창고',fire:'소방서',clinic:'진료소',police:'경찰서',mil:'군부대',milR:'군부대',lab:'연구소',lot:'빈터'};
let XLAST=null;
function xpSee(){if(!S||!S.inf||typeof DUN!='undefined'&&DUN)return;const[gx,gy]=gOf(S.p.x,S.p.y),k=gx+','+gy;if(k==XLAST)return;XLAST=k;const sn=S.inf.seen=S.inf.seen||{};
 for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const q=(gx+dx)+','+(gy+dy);if(!sn[q])sn[q]=kindAt(gx+dx,gy+dy)}}
let XZ=12;
function openMap(){const b=$('bm');b.dataset.m='xmap';PAUSE=true;{const zb=$('zoneb');if(zb)zb.classList.remove('on')}const[gx,gy]=gOf(S.p.x,S.p.y),sn=S.inf.seen||{},n=Object.keys(sn).length,far=Object.keys(sn).reduce((a,k)=>{const[x,y]=k.split(',').map(Number);return Math.max(a,Math.max(Math.abs(x),Math.abs(y)))},0);
 b.innerHTML='<div class="sh"><h2>🗺 탐험 지도</h2><div class="wt">가 본 블록 '+n+'곳 · 가장 멀리 '+far+'블록 · 지금 ('+gx+', '+gy+') · 거점까지 '+Math.max(Math.abs(gx),Math.abs(gy))+'블록</div><button onclick="closeBase()">✕</button></div>'+
 '<div class="xmT"><button onclick="XZ=Math.min(24,XZ+4);openMap()">＋</button><button onclick="XZ=Math.max(4,XZ-4);openMap()">－</button><span class="mut">칸 하나 = 블록 하나 · 점선 = 위험 구역 경계</span></div><canvas id="xmc"></canvas>'+
 '<div class="xmL">'+Object.entries(KNAME).filter(([k])=>k!='milR').map(([k,v])=>'<span><i style="background:'+KCOL[k]+'"></i>'+v+'</span>').join('')+'<span>🏠 거점</span><span>⛺ 전초기지</span><span>🚜 불도저</span><span>🕳 지하</span></div>';b.style.display='block';
 const cv=$('xmc'),W=Math.min(innerWidth-40,520),H=Math.min(innerHeight*.5,420);cv.width=W*dpr;cv.height=H*dpr;cv.style.width=W+'px';cv.style.height=H+'px';const c=cv.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.fillStyle='#0d0f12';c.fillRect(0,0,W,H);
 const z=XZ,cx=W/2,cy=H/2,X=x=>cx+(x-gx)*z,Y=y=>cy+(y-gy)*z,ops=S.inf.op||{},dm=S.inf.demo||{};
 for(const k in sn){const[x,y]=k.split(',').map(Number),sx=X(x),sy=Y(y);if(sx<-z||sy<-z||sx>W||sy>H)continue;c.fillStyle=KCOL[sn[k]]||'#555';c.fillRect(sx-z/2+1,sy-z/2+1,z-2,z-2)}
 c.font=Math.max(9,z*.8)+'px sans-serif';c.textAlign='center';c.textBaseline='middle';
 for(const k in ops){const[x,y]=k.split(',').map(Number);c.fillText('⛺',X(x),Y(y))}for(const k in dm)if(dm[k].sh){const[x,y]=k.split(',').map(Number);c.fillText('🕳',X(x),Y(y))}
 if(S.inf.dz){const[x,y]=S.inf.dz.gk.split(',').map(Number);c.fillText('🚜',X(x),Y(y))}c.fillText('🏠',X(0),Y(0));
 /* zone edges */c.setLineDash([4,4]);c.strokeStyle='#ff9a5a99';for(let zn=1;zn<=6;zn++){const r=zn*zoneStep()-.5;c.strokeRect(X(-r)-z/2,Y(-r)-z/2,(2*r+1)*z,(2*r+1)*z)}c.setLineDash([]);
 c.fillStyle='#fff';c.beginPath();c.arc(cx,cy,Math.max(3,z*.35),0,7);c.fill();c.strokeStyle='#000';c.stroke();
 {const hx=X(0),hy=Y(0);if(hx<0||hy<0||hx>W||hy>H){const a=Math.atan2(hy-cy,hx-cx),t=Math.min((W/2-18)/Math.abs(Math.cos(a)||1e-6),(H/2-18)/Math.abs(Math.sin(a)||1e-6)),ex=cx+Math.cos(a)*t,ey=cy+Math.sin(a)*t;c.save();c.translate(ex,ey);c.rotate(a);c.fillStyle='#7fd07f';c.beginPath();c.moveTo(12,0);c.lineTo(-8,-8);c.lineTo(-8,8);c.closePath();c.fill();c.restore();c.fillStyle='#bff5b0';c.font='11px sans-serif';c.fillText('🏠 '+Math.max(Math.abs(gx),Math.abs(gy)),ex-Math.cos(a)*22,ey-Math.sin(a)*16)}}}
/* home arrow at the screen edge when the base is out of view */
function baseArrow(){const el=$('hmA');if(!el||!S||!S.inf)return;const[gx,gy]=gOf(S.p.x,S.p.y),d=Math.max(Math.abs(gx),Math.abs(gy));if(typeof DUN!='undefined'&&DUN||d<1||$('bm').style.display=='block'){el.style.display='none';return}
 const B=W0.base,bx=B?B.ox+BW/2:S.p.x-gx*PX,by=B?B.oy+BH/2:S.p.y-gy*PY,a=Math.atan2(by-S.p.y,bx-S.p.x),w=innerWidth,h=innerHeight,r=Math.min(w,h)*.42;
 el.style.display='block';el.style.left=(w/2+Math.cos(a)*r-22)+'px';el.style.top=(h/2+Math.sin(a)*r*1.1-22)+'px';el.innerHTML='<b style="transform:rotate('+a+'rad)">➤</b><small>🏠 '+d+'</small>'}
/* ---------- 3. weapon card shows the enhancement ---------- */
{const _wc=wcard;wcard=function(){_wc();if(!S)return;const el=$('wc');if(!el)return;const lv=enhLv(actW(S.p)),n=el.querySelector('.wn');if(n&&lv)n.innerHTML='<span class="enT">+'+lv+'</span> '+n.innerHTML;el.classList.toggle('enh5',lv>=5&&lv<10);el.classList.toggle('enh10',lv>=10)}}
/* ---------- 4. first-entry supply brings ammo for your guns ---------- */
{const _zc=infZoneCheck;infZoneCheck=function(quiet){const was=ZLAST,had=S&&S.inf&&S.inf.fz?Object.assign({},S.inf.fz):{};_zc(quiet);const z=ZLAST;if(quiet||was==null||z<=was||!S||!S.inf||had[z]||!S.inf.fz||!S.inf.fz[z])return;
  const guns=['prim','sec'].map(s=>S.p.eq[s]).filter(id=>id&&W_BY[id]&&W_BY[id][4].ammo),r={};for(const id of guns){const ai=AMMO_ITEM(W_BY[id][4].ammo);r[ai]=(r[ai]||0)+(ai=='fuel'?2:20+10*z)}if(!guns.length)r.a9mm=20+10*z;
  for(const k in r)invAdd(S.p,k,r[k]);const el=$('zoneb'),bn=el&&el.querySelector('.zbn');if(bn)bn.insertAdjacentHTML('beforeend',' · 📦 탄약 상자: '+Object.entries(r).map(([k,v])=>NM2(k)+' '+v).join(' · '));S.zAmmo=r}}
/* ---------- 6. saved pick lists ---------- */
const STPN=['탐험 세트','방어 세트','건설 세트'];
function stPreSave(i){S.stPre=S.stPre||[];S.stPre[i]=Object.assign({},STPICK);msg('⭐ '+STPN[i]+' 저장: '+Object.entries(STPICK).map(([k,v])=>NM2(k)+' '+v).join(' · '));openStash()}
function stPreUse(i){const pr=S.stPre&&S.stPre[i];if(!pr)return;const box=stBox(),miss=[];STPICK={};for(const k in pr){const n=Math.min(pr[k],box[k]|0);if(n)STPICK[k]=n;if(n<pr[k])miss.push(NM2(k)+' '+(pr[k]-n))}if(miss.length)msg('⚠ 보관함에 모자라요: '+miss.join(' · '));openStash()}
{const _os=openStash;openStash=function(c){_os(c);const h=document.querySelector('#bm h4');if(!h)return;const pre=S.stPre||[];
  h.insertAdjacentHTML('beforebegin','<div class="stPre">'+STPN.map((n,i)=>pre[i]?'<button onclick="stPreUse('+i+')">⭐ '+n+'<small>'+Object.keys(pre[i]).length+'종</small></button>':(STPICK&&Object.keys(STPICK).length?'<button class="sv" onclick="stPreSave('+i+')">＋ 지금 목록을 '+n+'로 저장</button>':'<button disabled>'+n+' (비어 있음)</button>')).join('')+'</div>')}}
/* ---------- 9. turret low-ammo alerts ---------- */
let TALT=0;const TAWARN={};
function turAlerts(dt){TALT-=dt;if(TALT>0||!S.inf.op)return;TALT=3;const out=[];for(const gk in S.inf.op){const o=S.inf.op[gk];if(!o.turs||!o.turs.length)continue;const[gx,gy]=gk.split(',').map(Number),zn=zoneOf(gx,gy);
  const need={};for(const q of o.turs){const T=TURT[q.t];need[T.am]=need[T.am]||[];need[T.am].push(T.nm)}for(const am in need){const n=o.st[am]|0,low=n<10,k=gk+':'+am;if(low&&!TAWARN[k]){TAWARN[k]=1;out.push('⚠ '+zn+'구역 기지 ('+gk+') '+[...new Set(need[am])].join('·')+' 탄약 부족 · '+NM2(am)+' '+n)}if(!low)delete TAWARN[k]}}
 if(out.length){msg(out.join(' / '));S.tAlerts=(S.tAlerts||0)+out.length}}
/* ---------- 10. the bulldozer has its own fuel tank ---------- */
const DZTANK=20;
{const _bd=dozerBoard;dozerBoard=function(){const p=S.p;if(S.inf.dzF==null)S.inf.dzF=DZTANK;if(S.inf.dzF<=0)return msg('🚜 불도저 연료통이 비었어요 · [⛽ 연료 넣기]');const bag=p.inv.fuel|0;p.inv.fuel=Math.max(.01,S.inf.dzF);_bd();if(DOZ){DOZ.bagFuel=bag;msg('🚜 불도저 운전 · 연료통 '+S.inf.dzF.toFixed(1)+'/'+DZTANK+' (가방 연료는 그대로)')}else{if(bag)p.inv.fuel=bag;else delete p.inv.fuel}}}
{const _pk=dozerPark;dozerPark=function(){const p=S.p,bag=DOZ?DOZ.bagFuel:0;S.inf.dzF=Math.max(0,p.inv.fuel||0);if(bag)p.inv.fuel=bag;else delete p.inv.fuel;_pk();if(S.inf.dzF<=0)msg('🚜 불도저 연료가 다 떨어졌어요 · 근처에서 [⛽ 연료 넣기]')}}
function dozerFill(){const p=S.p,n=Math.min(p.inv.fuel|0,Math.ceil(DZTANK-(S.inf.dzF||0)));if(n<=0)return msg((p.inv.fuel|0)?'🚜 연료통이 가득 찼어요':'⛽ 가방에 연료가 없어요');invTake(p,'fuel',n);S.inf.dzF=Math.min(DZTANK,(S.inf.dzF||0)+n);msg('⛽ 불도저 연료통 '+S.inf.dzF.toFixed(0)+'/'+DZTANK)}
{const _sv3=save;save=function(){if(DOZ&&S){const f=S.p.inv.fuel;S.inf.dzF=f;if(DOZ.bagFuel)S.p.inv.fuel=DOZ.bagFuel;else delete S.p.inv.fuel;try{return _sv3.apply(this,arguments)}finally{S.p.inv.fuel=f}}return _sv3.apply(this,arguments)}}
{const _c=dmCtx;dmCtx=function(){const B=_c();if(DOZ){const f=S.p.inv.fuel||0;B.splice(0,1,{t:'🚜 운전 중 · 연료통 '+f.toFixed(1)+'/'+DZTANK+' · 내리기 = [상호작용]',f:null,info:1,pr:f/DZTANK})}
  else{const i=B.findIndex(q=>q.dz);if(i>=0){if(S.inf.dzF==null)S.inf.dzF=DZTANK;B[i].t='🚜 불도저 타기 · 연료 '+S.inf.dzF.toFixed(0)+'/'+DZTANK;B.splice(i+1,0,{t:'⛽ 연료 넣기 (가방 '+(S.p.inv.fuel|0)+')',f:dozerFill,sm:1,dz:1})}}return B}}
/* ---------- tick + UI ---------- */
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!S||!S.inf)return;xpSee();turAlerts(dt);baseArrow()}}
document.body.insertAdjacentHTML('beforeend','<div id="hmA"></div>');
{const zc=$('zonec');if(zc){zc.style.pointerEvents='auto';zc.style.cursor='pointer';zc.title='탐험 지도';zc.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();openMap()})}}
document.head.insertAdjacentHTML('beforeend',`<style>
#hmA{display:none;position:fixed;z-index:3;width:44px;height:44px;pointer-events:none;text-align:center}#hmA b{display:block;font-size:24px;color:#7fd07f;text-shadow:0 0 4px #000;line-height:30px}#hmA small{display:block;font-size:10px;background:#000b;border-radius:6px;color:#bff5b0}
#bm .xmT{display:flex;gap:5px;align-items:center;margin:6px 0;font-size:11.5px}#bm .xmT button{padding:3px 12px}#xmc{display:block;margin:0 auto;border-radius:10px;border:1px solid #ffffff22}
#bm .xmL{display:flex;flex-wrap:wrap;gap:4px 10px;font-size:11px;margin-top:6px;color:#ccc}#bm .xmL i{display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:3px;vertical-align:-1px}
#wc .enT{color:#ffd36a;font-weight:bold}#wc.enh5{box-shadow:0 0 0 1px #ffd36a99,0 0 12px #ffd36a55}#wc.enh10{box-shadow:0 0 0 2px #ff9a3a,0 0 18px #ff9a3acc;animation:enGl 1.6s ease-in-out infinite}
@keyframes enGl{50%{box-shadow:0 0 0 2px #ffd36a,0 0 26px #ffd36aee}}
#bm .stPre{display:flex;gap:4px;margin:6px 0;flex-wrap:wrap}#bm .stPre button{flex:1;min-width:96px;padding:6px;font-size:12px;border-radius:9px;background:#2a3a24}#bm .stPre button.sv{background:#3a3214;border-style:dashed}#bm .stPre button[disabled]{opacity:.4}#bm .stPre small{display:block;font-size:10px;color:var(--mut)}
</style>`);
