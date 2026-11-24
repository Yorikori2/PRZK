/* PROJECT LEGACY — sample: weapon enhancement (+1~+10) and enchant runes, tuned for the endless city's zone strength
   (zombie HP ×2 / ×4 / ×6 / ×8). Also: a one-block warning before a zone edge and a first-entry supply drop.
   Loaded after inf_next.js. */
'use strict';
/* ---------- items: enhancement stones, protection charm, runes ---------- */
const ENS=[['enh1','하급 강화석','u','+1 ~ +3 강화에 사용 · 0~1구역에서 나와요','#7fd07f'],['enh2','중급 강화석','r','+4 ~ +6 강화에 사용 · 2~3구역에서 나와요','#5aa8ff'],['enh3','상급 강화석','e','+7 ~ +10 강화에 사용 · 3구역 이상에서 나와요','#c07aff'],
 ['enhg','보호 부적','e','+6 이상 강화가 실패해도 단계가 내려가지 않아요 (1회)','#ffd36a']];
const RUNES={fire:['🔥','화염','명중하면 불이 붙어 초당 (8×등급) 피해 · 2초','#ff8a3a'],ice:['❄','냉기','명중하면 2초 동안 느려져요 (15%+10%×등급)','#8fd8ff'],
 shock:['⚡','감전','(10%+5%×등급) 확률로 주변 2마리에게 번개 (피해 40%)','#ffe45a'],leech:['🩸','흡혈','준 피해의 (2%×등급)만큼 체력 회복','#ff5a6a'],
 hunt:['☠','구역 사냥꾼','구역 좀비에게 피해 +(6%×등급×구역) · 4구역까지만 늘어나요 · 4등급이면 4구역 이후 +96%','#c07aff'],exec:['🎯','처형','체력 30% 이하 좀비에게 피해 +(25%×등급)','#ff6a5a']};
const RK=Object.keys(RUNES),ROM=['','Ⅰ','Ⅱ','Ⅲ','Ⅳ'],RGR=['','u','r','e','l'];
{const add=(id,nm,rar,wt,ds,draw)=>{if(I_BY[id])return;const it=[id,nm,'c',rar,wt,ds];ITEMS.push(it);I_BY[id]=it;IC[id]=draw};
 const gem=c=>()=>{R('#1d2226',6,5,12,15);R(c,7,6,10,13);R('#ffffff88',8,7,3,3);R('#00000044',7,15,10,4);R('#ffffff33',13,8,2,7)};
 for(const[id,nm,rar,ds,c]of ENS)add(id,nm,rar,id=='enhg'?.05:.2,ds,id=='enhg'?()=>{R('#5a3c14',6,3,12,18);R('#e8d7a8',7,4,10,16);R(c,9,7,6,6);R('#a23b2e',11,14,2,4)}:gem(c));
 for(const k of RK)for(let g=1;g<=4;g++){const[e,nm,ds,c]=RUNES[k];add('rn_'+k+g,nm+' 룬 '+ROM[g],RGR[g],.1,'인챈트 · '+ds.replace(/등급/g,'등급 '+g)+' · 🔨 강화 창에서 무기에 새김',
  ()=>{R('#2a2e33',5,4,14,17);R('#4a5058',6,5,12,15);R(c,9,8,6,2);R(c,11,8,2,9);R(c,9,13,6,2);for(let i=0;i<g;i++)R('#fff',7+i*3,18,2,2)})}}
/* ---------- enhancement rules ---------- */
const ENH={max:10,per:.15,rate:[100,100,95,90,80,70,60,50,40,30,20],
 cost:lv=>lv<=3?{enh1:1,scrap:1}:lv<=6?{enh2:1,scrap:2}:{enh3:1,scrap:3}, /* cost to reach level lv */
 slots:lv=>lv>=10?3:lv>=5?2:1};
const EP=()=>{const pg=PGo();pg.enh=pg.enh||{};pg.ench=pg.ench||{};return pg};
const enhLv=id=>(S&&S.pg&&S.pg.enh&&S.pg.enh[id])|0,enchOf=id=>(S&&S.pg&&S.pg.ench&&S.pg.ench[id])||[];
const enhMul=id=>1+ENH.per*enhLv(id);
/* zone hunter: +6% × grade × zone, counted up to zone 4 only (zone 5+ keeps getting harder) */
const huntMul=(g,zn)=>1+.06*g*Math.min(4,Math.max(0,zn));
const enchG=(id,k)=>{let g=0;for(const r of enchOf(id))if(r&&r.slice(3,-1)==k)g=Math.max(g,+r.slice(-1));return g};
/* weapon damage on the card and in combat: enhancement level */
{const _w=s3W;s3W=function(id){const w=_w(id);if(w&&w!==W_BY[id]&&!w._e9){w._e9=1;w[4].d*=enhMul(id)}return w}}
/* hits from the player's weapon: rune effects */
{const _hz=hitZ;hitZ=function(q,dmg,dx,dy,n){const id=S3&&S3.ctx;if(!id||!S||!enchOf(id).length)return _hz(q,dmg,dx,dy,n);
  const gh=enchG(id,'hunt'),ge=enchG(id,'exec');if(gh&&q.zone>0)dmg*=huntMul(gh,q.zone);if(ge&&q.hp<q.mhp*.3)dmg*=1+.25*ge;
  _hz(q,dmg,dx,dy,n);const p=S.p,gf=enchG(id,'fire'),gi=enchG(id,'ice'),gs=enchG(id,'shock'),gl=enchG(id,'leech');
  if(gf){q.enB=2;q.enBd=8*gf}
  if(gi){if(!(q.frz>0))q.enSm=q.sm||1;q.frz=2;q.sm=q.enSm*(1-(.15+.1*gi))}
  if(gl)p.hp=Math.min(MHP(p),p.hp+dmg*.02*gl);
  if(gs&&Math.random()<.1+.05*gs){S3.ctx=null;try{let c=0;for(const o of Z)if(o!==q&&o.hp>0&&Math.hypot(o.x-q.x,o.y-q.y)<90&&c<2){c++;_hz(o,dmg*.4,0,0,1);fx.push({k:'zap',a:[q.x,q.y-14],b:[o.x,o.y-14],l:.2})}}finally{S3.ctx=id}}}}
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!S)return;
  for(const q of Z){if(q.enB>0){q.enB-=dt;q.hp-=q.enBd*dt;if(Math.random()<dt*8)fx.push({k:'ember',x:q.x+(Math.random()-.5)*10,y:q.y-10-Math.random()*16,l:.35})}
   if(q.frz>0){q.frz-=dt;if(q.frz<=0)q.sm=q.enSm||1}}
  enhWarn()}}
/* ---------- drops: stones from zone zombies and zone buildings ---------- */
const stoneFor=z=>z<=1?'enh1':z<=2?'enh2':z==3?(Math.random()<.3?'enh3':'enh2'):'enh3';
const runeFor=z=>'rn_'+RK[Math.random()*RK.length|0]+Math.max(1,Math.min(4,z));
{const _k=kill;kill=function(z){_k(z);if(!S||typeof INF=='undefined'||!INF)return;const zn=z.zone|0,r={};
  if(Math.random()<(zn?.02+.02*zn:.06))r[stoneFor(zn)]=1;if(zn&&Math.random()<.006*zn*(z.b?5:1))r[runeFor(zn)]=1;
  for(const k in r){invAdd(S.p,k,r[k]);s3Float(z.x,z.y-30,'💎 '+NM2(k),RAR[I_BY[k][3]][1])}}}
{const _sr=s3SearchRoll;s3SearchRoll=function(o,kind,tier,r){const pid=_sr(o,kind,tier,r);if(typeof INF!='undefined'&&INF){const[gx,gy]=gOf(o.x,o.y),zn=zoneOf(gx,gy);
  if(Math.random()<(zn?.06+.05*zn:.12))r[stoneFor(zn)]=(r[stoneFor(zn)]||0)+1;if(zn&&Math.random()<.02*zn)r[runeFor(zn)]=1}return pid}}
/* ---------- idea 1: warning one block before the next zone ---------- */
let EWB=null;
function enhWarn(){const[gx,gy]=gOf(S.p.x,S.p.y),k=gx+','+gy;if(k==EWB)return;EWB=k;const d=Math.max(Math.abs(gx),Math.abs(gy)),z=zoneOf(d,0),nz=zoneOf(d+1,0);
 if(nz>z){const c=['#7fd07f','#ffd36a','#ff9a5a','#ff6a5a','#ff4a4a'][Math.min(4,nz)];zoneRaw('<b style="color:'+c+';font-size:18px">⚠ 다음 블록부터 '+nz+'구역</b><small>좀비 체력 ×'+zHpMul(nz)+' · 공격 ×'+zAtkMul(nz).toFixed(1)+' · 준비하고 넘어가세요</small>',c,3000);S.enW=(S.enW||0)+1}}
function zoneRaw(h,c,ms){const el=$('zoneb');if(!el)return;el.innerHTML=h;el.style.borderColor=c;el.classList.remove('on');void el.offsetWidth;el.classList.add('on');clearTimeout(ZBT);ZBT=setTimeout(()=>el.classList.remove('on'),ms)}
/* ---------- idea 2: first time in a zone → supply drop ---------- */
const ZBONUS={1:{enh1:3,enh2:1},2:{enh2:3,enhg:1},3:{enh2:2,enh3:1,enhg:1},4:{enh3:3,enhg:2}};
{const _zc=infZoneCheck;infZoneCheck=function(quiet){const was=ZLAST;_zc(quiet);const z=ZLAST;if(quiet||was==null||z<=was||!S||!S.inf)return;S.inf.fz=S.inf.fz||{};if(S.inf.fz[z])return;S.inf.fz[z]=1;
  const r=Object.assign({},ZBONUS[Math.min(4,z)]||{enh3:3,enhg:2}),rn=runeFor(z);r[rn]=1;for(const k in r)invAdd(S.p,k,r[k]);s3Xp(150*z,z+'구역 첫 진입');
  const el=$('zoneb');if(el){el.insertAdjacentHTML('beforeend','<div class="zbn">🎁 첫 진입 보급: '+Object.entries(r).map(([k,v])=>NM2(k)+(v>1?' ×'+v:'')).join(' · ')+' · 경험치 +'+150*z+'</div>');clearTimeout(ZBT);ZBT=setTimeout(()=>el.classList.remove('on'),4200)}
  S.enBonus=(S.enBonus||[]).concat([z])}}
/* ---------- the 🔨 enhance / enchant window ---------- */
let ENSEL=null,ENRES=null,ENPROT=false,ENSLOT=0;
const ownedW=()=>{const p=S.p,L=[];for(const s of['prim','sec','mel'])if(p.eq[s]&&has(p,p.eq[s])&&!L.includes(p.eq[s]))L.push(p.eq[s]);for(const k in p.inv)if(p.inv[k]>0&&W_BY[k]&&W_BY[k][2]!='t'&&!L.includes(k))L.push(k);return L};
const enHave=c=>Object.entries(c).every(([k,v])=>(S.p.inv[k]|0)>=v);
function openEnh(sel){const b=$("bm"),p=S.p,L=ownedW();{const zb=$('zoneb');if(zb)zb.classList.remove('on')}if(sel)ENSEL=sel;if(!L.includes(ENSEL))ENSEL=L[0]||null;b.dataset.m='enh';PAUSE=true;
 let h='<div class="sh"><h2>🔨 강화 · 인챈트</h2><div class="wt">💎 '+['enh1','enh2','enh3','enhg'].map(k=>NM2(k).replace(' 강화석','')+' '+(p.inv[k]|0)).join(' · ')+' · 고철 '+(p.inv.scrap|0)+'</div><button onclick="closeBase()">✕</button></div>';
 if(!ENSEL){b.innerHTML=h+'<p class="mut">강화할 무기가 없어요</p>';b.style.display='block';return}
 h+='<div class="enL">'+L.map(k=>'<div class="enW'+(k==ENSEL?' on':'')+'" onclick="openEnh(\''+k+'\')"><img src="'+icon(k)+'"><b>'+(enhLv(k)?'+'+enhLv(k)+' ':'')+NM2(k)+'</b><small>'+enchOf(k).filter(Boolean).map(r=>RUNES[r.slice(3,-1)][0]+ROM[r.slice(-1)]).join(' ')+'</small></div>').join('')+'</div>';
 const id=ENSEL,lv=enhLv(id),w=wdef(id),nx=lv+1,cost=lv<ENH.max?ENH.cost(nx):null,rate=lv<ENH.max?ENH.rate[nx]:0,base=W_BY[id][4].d;
 h+='<div class="enC"><div class="enT"><img src="'+icon(id)+'"><div><b>'+(lv?'+'+lv+' ':'')+NM2(id)+'</b><small>피해 '+Math.round(w[4].d)+(lv<ENH.max?' → <span style="color:#7fd07f">'+Math.round(w[4].d/enhMul(id)*(1+ENH.per*nx))+'</span>':' (최고 단계)')+' · 기본 '+base+' · 강화 ×'+enhMul(id).toFixed(2)+'</small></div></div>';
 h+='<div class="enBar">'+Array.from({length:ENH.max},(_,i)=>'<i class="'+(i<lv?'f':'')+(i==4||i==9?' m':'')+'"></i>').join('')+'</div><small class="mut">+5에서 룬 칸 2개 · +10에서 룬 칸 3개</small>';
 if(cost){const ok=enHave(cost),risky=nx>=6;h+='<div class="enR"><span>+'+nx+' 도전 · 성공률 <b style="color:'+(rate>=80?'#7fd07f':rate>=50?'#ffd36a':'#ff6a5a')+'">'+rate+'%</b> · 재료 '+Object.entries(cost).map(([k,v])=>'<span class="'+((S.p.inv[k]|0)<v?'no':'')+'">'+NM2(k)+' '+v+'</span>').join(' · ')+'</span>'+
  '<small>'+(risky?'실패하면 단계가 1 내려가요'+((p.inv.enhg|0)?' · <label><input type="checkbox" '+(ENPROT?'checked ':'')+'onchange="ENPROT=this.checked"> 보호 부적 사용 (남은 '+(p.inv.enhg|0)+')</label>':' (보호 부적이 있으면 막을 수 있어요)'):'실패해도 재료만 사라지고 단계는 그대로예요')+'</small>'+
  '<button class="enGo" '+(ok?'':'disabled ')+'onclick="doEnh()">🔨 강화하기</button></div>'}
 if(ENRES)h+='<div class="enRes '+ENRES[0]+'">'+ENRES[1]+'</div>';
 const sl=ENH.slots(lv),ec=enchOf(id);h+='<h4>✨ 룬 칸 ('+ec.filter(Boolean).length+'/'+sl+')</h4><div class="enS">';
 for(let i=0;i<3;i++){const r=ec[i];h+='<div class="enSl'+(i>=sl?' lk':'')+(i==ENSLOT&&i<sl&&ec.filter(Boolean).length>=sl?' sel':'')+'"'+(i<sl?' onclick="ENSLOT='+i+';openEnh()"':'')+'>'+(i>=sl?'🔒 +'+(i==1?5:10)+'에서 열림':r?'<b style="color:'+RUNES[r.slice(3,-1)][3]+'">'+RUNES[r.slice(3,-1)][0]+' '+RUNES[r.slice(3,-1)][1]+' '+ROM[r.slice(-1)]+'</b><small>'+RUNES[r.slice(3,-1)][2].replace(/등급/g,'등급 '+r.slice(-1))+'</small>':'<small class="mut">빈 칸 · 아래 룬을 눌러 새기기</small>')+'</div>'}
 h+='</div>';const rs=Object.keys(p.inv).filter(k=>k.startsWith('rn_')&&p.inv[k]>0).sort();
 h+='<h4>가진 룬</h4>'+(rs.length?'<div class="enRn">'+rs.map(k=>{const t=k.slice(3,-1),g=k.slice(-1);return'<div class="enRc" onclick="doEnch(\''+k+'\')"><img src="'+icon(k)+'"><b style="color:'+RUNES[t][3]+'">'+RUNES[t][0]+' '+RUNES[t][1]+' '+ROM[g]+'</b><small>×'+p.inv[k]+'</small></div>'}).join('')+'</div>':'<p class="mut">룬이 없어요 · 1구역 이상의 좀비와 수색, 구역 첫 진입 보급에서 나와요</p>');
 h+='<p class="mut" style="font-size:11px;margin-top:8px">같은 룬을 다시 새기면 높은 등급이 남아요 · 칸이 다 차 있으면 노란 테두리 칸이 바뀌어요 (칸을 눌러 고르기) · 게임에서는 거점 작업대에서 열려요</p>';
 b.innerHTML=h;b.style.display='block'}
function doEnh(){const id=ENSEL,pg=EP(),lv=enhLv(id),nx=lv+1;if(lv>=ENH.max)return;const c=ENH.cost(nx);if(!enHave(c))return msg('재료가 부족해요');for(const k in c)invTake(S.p,k,c[k]);
 const okR=Math.random()*100<ENH.rate[nx];if(okR){pg.enh[id]=nx;ENRES=['ok','✨ 성공! +'+nx+' '+NM2(id)+(nx==5||nx==10?' · 룬 칸이 하나 늘었어요':'')];enhSnd(1)}
 else if(nx>=6){if(ENPROT&&(S.p.inv.enhg|0)>0){invTake(S.p,'enhg',1);ENRES=['pr','🛡 실패했지만 보호 부적이 막았어요 · +'+lv+' 유지']}else{pg.enh[id]=lv-1;ENRES=['no','💥 실패 · +'+lv+' → +'+(lv-1)]}}
 else ENRES=['no','💨 실패 · 재료만 사라졌어요 · +'+lv+' 유지'];
 if(!okR)enhSnd(0);s3dirty();openEnh();hud2()}
function enhSnd(ok){try{const a=acx();if(!a)return;const t=a.currentTime;if(ok){tone(a,t,{f0:880,f1:900,d:.12,v:.18,w:'triangle'});tone(a,t+.1,{f0:1320,f1:1340,d:.25,v:.18,w:'triangle'})}else tone(a,t,{f0:300,f1:90,d:.3,v:.2,w:'sawtooth'})}catch(e){}}
function doEnch(rk){const id=ENSEL,pg=EP(),sl=ENH.slots(enhLv(id)),a=(pg.ench[id]=(pg.ench[id]||[]).slice(0,sl)),t=rk.slice(3,-1),g=+rk.slice(-1);
 let i=a.findIndex(r=>r&&r.slice(3,-1)==t);if(i>=0&&+a[i].slice(-1)>=g){ENRES=['no','이미 더 높은 '+RUNES[t][1]+' 룬이 있어요'];return openEnh()}
 if(i<0){i=a.findIndex((r,j)=>!r);if(i<0&&a.length<sl)i=a.length}if(i<0)i=Math.min(ENSLOT,sl-1)
 invTake(S.p,rk,1);a[i]=rk;ENRES=['ok','✨ '+NM2(id)+'에 '+RUNES[t][0]+' '+RUNES[t][1]+' '+ROM[g]+' 새김'];s3dirty();openEnh();hud2()}
/* stones and runes in the bag open the window instead of being used up */
{const _u=use2;use2=function(k){if(k&&(k.startsWith('rn_')||k.startsWith('enh')))return openEnh();return _u.apply(this,arguments)}}
document.head.insertAdjacentHTML('beforeend',`<style>
#zoneb .zbn{margin-top:6px;font-size:12px;color:#ffe9a8;white-space:normal;max-width:78vw}
#bm .enL{display:flex;gap:5px;overflow-x:auto;margin:6px 0}#bm .enW{flex:0 0 auto;min-width:92px;padding:6px;border-radius:10px;border:1px solid #ffffff1f;background:#ffffff0a;text-align:center;cursor:pointer}#bm .enW.on{border-color:#e0b03a;background:#e0b03a22}
#bm .enW img{width:36px;height:36px;image-rendering:pixelated;display:block;margin:0 auto}#bm .enW b{display:block;font-size:12px}#bm .enW small{font-size:11px}
#bm .enC{padding:8px;border-radius:12px;background:#ffffff08;border:1px solid #ffffff14}#bm .enT{display:flex;gap:8px;align-items:center}#bm .enT img{width:44px;height:44px;image-rendering:pixelated}#bm .enT b{font-size:16px;display:block}#bm .enT small{font-size:12px;color:var(--mut)}
#bm .enBar{display:flex;gap:3px;margin:8px 0 2px}#bm .enBar i{flex:1;height:8px;border-radius:3px;background:#ffffff18}#bm .enBar i.f{background:linear-gradient(#ffe27a,#e0a030)}#bm .enBar i.m{outline:1px solid #ffd36a88}
#bm .enR{margin-top:8px;display:flex;flex-direction:column;gap:4px;font-size:13px}#bm .enR .no{color:#ff6a5a}#bm .enR small{font-size:11px;color:var(--mut)}#bm .enGo{padding:9px;font-size:15px;border-radius:10px;background:#5a4214;border-color:#e0b03a}#bm .enGo[disabled]{opacity:.4}
#bm .enRes{margin-top:8px;padding:8px;border-radius:10px;font-weight:bold;text-align:center;animation:enP .35s}#bm .enRes.ok{background:#2f6b2f55;color:#bff5b0}#bm .enRes.no{background:#7a222255;color:#ffb0a8}#bm .enRes.pr{background:#6b5a2255;color:#ffe9a8}
@keyframes enP{0%{transform:scale(.8);opacity:0}60%{transform:scale(1.06)}100%{transform:scale(1);opacity:1}}
#bm h4{margin:10px 0 4px;font-size:13px}#bm .enS{display:grid;grid-template-columns:repeat(3,1fr);gap:4px}#bm .enSl{padding:6px;border-radius:9px;border:1px dashed #ffffff30;min-height:46px;font-size:12px}#bm .enSl.lk{opacity:.45}#bm .enSl.sel{border:2px solid #ffd36a}#bm .enSl small{display:block;font-size:10.5px;color:var(--mut)}
#bm .enRn{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:4px}#bm .enRc{display:flex;gap:4px;align-items:center;padding:4px 6px;border-radius:9px;background:#ffffff0a;border:1px solid #ffffff1a;cursor:pointer;font-size:12px}#bm .enRc img{width:26px;height:26px;image-rendering:pixelated}#bm .enRc small{margin-left:auto;color:var(--mut)}
</style>`);
