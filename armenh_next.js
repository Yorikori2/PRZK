/* PROJECT LEGACY — sample: armour enhancement and armour options (방어구 룬).
   1) +1 ~ +cap per piece: that piece's damage cut grows 5% of its base per level (vest -30% → +10 -45%, at most -85%); same stones, odds, cap and
      failure rules as weapons (+6 and up can drop a level unless a 보호 부적 is used).
   2) Option slots open at +5, +10 and +15. Inscribe an armour rune (grade Ⅰ~Ⅲ) that fits that part.
   3) Each option only fits some parts.
   4) Past the 75% cap the extra still turns into less bleeding / knockdown (bal_next.js).
   5) Runes come from deep mine floors, the zombie hive and high-zone raider camps.
   Loaded after armor2_next.js and bal_next.js. */
'use strict';
const PN={head:'머리',body:'몸통',legs:'다리',feet:'신발'};
/* key: icon, name, parts, per-grade text, colour */
const AOPT={
 regen:['🩸','재생',['body'],g=>'5초 동안 안 맞으면 초당 체력 +'+(.5*g),'#ff5a6a'],
 thorn:['🦔','가시',['body','legs'],g=>'물리면 그 좀비에게 '+8*g+' 피해를 되돌려요','#c9a46a'],
 light:['🪶','경량',['body','legs'],g=>'이 방어구 무게 -'+20*g+'%','#cfe8ff'],
 fire:['🔥','내화',['head','body'],g=>'화염 피해 -'+20*g+'%','#ff8a3a'],
 tox:['☣','내독',['head'],g=>'부머 가스 · 산성 웅덩이 피해 -'+20*g+'%','#9ad04a'],
 clot:['🩹','지혈',['body'],g=>'물렸을 때 출혈이 막힐 확률 '+20*g+'%','#f0f0e0'],
 hush:['🦶','무음',['feet'],g=>'움직일 때 발소리 -'+12*g+'%','#9aa0a6'],
 ins:['⚡','절연',['head','feet'],g=>'감전 · 넘어짐 시간 -'+20*g+'%','#ffe45a'],
 wolf:['🐺','늑대의 심장',['body'],g=>'체력 30% 이하일 때 이동 +'+8*g+'% · 받는 피해 -'+5*g+'%','#c07aff'],
 shade:['👻','그림자',['feet'],g=>'밤에 좀비가 나를 알아채는 거리 -'+10*g+'%','#7a8aaa'],
 rage:['💢','복수',['head'],g=>'물린 뒤 3초 동안 내 공격 피해 +'+10*g+'%','#ff4a4a'],
 loot:['🧲','수집가',['legs'],g=>'좀비를 쓰러뜨리면 '+5*g+'% 확률로 쓰는 총의 탄약 3~6발','#e0b03a'],
 dash:['🏃','질주',['legs','feet'],g=>'이동 속도 +'+3*g+'%','#7fd07f'],
 brace:['🪨','버팀목',['legs'],g=>'넘어지는 시간 -'+20*g+'%','#a08a6a'],
 calm:['🎯','침착',['head'],g=>'체력 50% 이상일 때 총기 피해 +'+4*g+'%','#5aa8ff'],
 musk:['🧟','악취 위장',['body'],g=>'좀비 냄새를 둘러 좀비가 알아채는 거리 -'+8*g+'% (낮에도)','#6a8a4a']};
const ROMN=['','Ⅰ','Ⅱ','Ⅲ','Ⅳ'];
for(const k in AOPT)for(let g2=1;g2<=3;g2++){const id='ao_'+k+g2,[e,n,parts,f,c]=AOPT[k];if(!I_BY[id]){const it=[id,n+' 방어구 룬 '+ROMN[g2],'c',['','r','e','l'][g2],.1,'방어구 옵션 · '+f(g2)+' · 끼울 수 있는 부위: '+parts.map(q=>PN[q]).join(' · ')];ITEMS.push(it);I_BY[id]=it}
 IC[id]=()=>{R('#1d1714',5,3,14,18);R('#3a3f45',6,4,12,15);R('#2a2e33',8,17,8,3);R(c,9,7,6,2);R(c,11,7,2,8);R(c,8,11,8,2);for(let i=0;i<g2;i++)R('#fff',7+i*4,16,2,2)}}
/* ---------- state ---------- */
const AE=()=>{const pg=PGo();pg.aenh=pg.aenh||{};pg.aopt=pg.aopt||{};return pg};
const aLv=id=>(S&&S.pg&&S.pg.aenh&&S.pg.aenh[id])|0;
const AERATE=n=>Math.max(2,Math.round(ENH.rate[n]*.8)),AORATE=[0,75,55,35];
const aSlots=lv=>lv>=15?3:lv>=10?2:lv>=5?1:0;
const aDr=id=>{const b=ARMX[id][4].dr||0;return Math.min(.85,b*(1+.05*aLv(id)))};
const wornA=p=>APARTS.map(([k])=>p.eq&&p.eq[k]).filter(id=>id&&ARMX[id]&&has(p,id));
/* total grade of an option over the worn pieces */
function aopt(k,p){p=p||S.p;let g2=0;for(const id of wornA(p))for(const r of(S.pg&&S.pg.aopt&&S.pg.aopt[id])||[]){if(r&&r.slice(3,-1)==k)g2+=+r.slice(-1)}return g2}
/* ---------- 1) enhancement makes each piece cut more ---------- */
{const _a=armRaw;armRaw=function(p){let m=_a(p);for(const id of wornA(p)){const b=ARMX[id][4].dr||0;if(b)m*=(1-aDr(id))/(1-b)}const w=aopt('wolf',p);if(w&&p.hp<MHP(p)*.3)m*=1-.05*w;return m}}
/* ---------- the options ---------- */
{const _w=weight;weight=function(p){let w=_w(p);if(!S||p!==S.p)return w;for(const id of wornA(p)){let g2=0;for(const r of(S.pg.aopt||{})[id]||[])if(r&&r.slice(3,-1)=='light')g2+=+r.slice(-1);if(g2)w-=wtOf(id)*Math.min(.8,.2*g2)}return Math.max(0,w)}}
{const _sp=s3Spd;s3Spd=function(p){let m=_sp(p);if(!S||!S.p)return m;const d=aopt('dash'),w=aopt('wolf');if(d)m*=1+.03*d;if(w&&S.p.hp<MHP(S.p)*.3)m*=1+.08*w;return m}}
{const _dm=detMul;detMul=function(){let m=_dm();if(!S||!S.p)return m;const h=aopt('hush'),sh=aopt('shade'),mu=aopt('musk');if(h&&S.p.mv)m*=Math.max(.2,1-.12*h);if(sh&&NIGHT)m*=Math.max(.3,1-.1*sh);if(mu)m*=Math.max(.4,1-.08*mu);return m}}
{const _k=kdMul;kdMul=function(p){return _k(p)*Math.max(0,1-.2*aopt('ins',p))*Math.max(0,1-.2*aopt('brace',p))}}
{const _f=fireMul;fireMul=function(){return _f()*Math.max(0,1-.2*aopt('fire'))}}
{const _h=hurtP;hurtP=function(n,why){const t=aopt('tox');if(t&&why&&/부머/.test(why))n*=Math.max(0,1-.2*t);return _h(n,why)}}
{const _gu=gearUpd;gearUpd=function(dt){const p=S&&S.p,h0=p&&p.hp;_gu(dt);if(!p||!run)return;
  /* acid refund (내독) */const t=aopt('tox');if(t&&p.hp<h0&&typeof S4!='undefined'){let a=0;for(const q of S4.pud||[])if(Math.hypot(p.x-q.x,p.y-q.y)<q.r)a+=10*dt;if(a)p.hp=Math.min(h0,p.hp+a*Math.min(.9,.2*t))}
  /* regen */const rg=aopt('regen');if(p.hp<h0-.01)S.aNoHit=0;else S.aNoHit=(S.aNoHit||0)+dt;if(rg&&S.aNoHit>5&&p.hp<MHP(p)&&!p.bleed)p.hp=Math.min(MHP(p),p.hp+.5*rg*dt);
  if(S.aRage>0)S.aRage-=dt}}
{const _zb=zBite4;zBite4=function(z){const p=S.p,b0=BLD0;_zb(z);const th=aopt('thorn');if(th&&z&&Z.includes(z)){hitZ(z,8*th,(z.x-p.x)/20,(z.y-p.y)/20,2);s3Float(z.x,z.y-40,'🦔 '+8*th,'#c9a46a')}
  const c=aopt('clot');if(c&&!b0&&p.bleed&&Math.random()<.2*c){p.bleed=0;s3Float(p.x,p.y-60,'🩹 지혈','#f0f0e0')}if(aopt('rage'))S.aRage=3}}
{const _hz=hitZ;hitZ=function(q,dmg,dx,dy,n){if(S&&S.p&&!q.npc){const p=S.p,r=aopt('rage'),c=aopt('calm');if(r&&S.aRage>0)dmg*=1+.1*r;if(c&&p.hp>=MHP(p)*.5&&GCLASS[actW(p)])dmg*=1+.04*c}return _hz(q,dmg,dx,dy,n)}}
{const _k=kill;kill=function(z){_k(z);if(!S||z.raider||z.npc||z.hive)return;const l=aopt('loot');if(l&&Math.random()<.05*l){const id=actW(S.p),w=W_BY[id];if(w&&w[4].ammo){const ai=AMMO_ITEM(w[4].ammo),n=3+(Math.random()*4|0);invAdd(S.p,ai,n);s3Float(z.x,z.y-50,'🧲 +'+n,'#e0b03a')}}}}
/* ---------- the window ---------- */
let AESEL=null,AERES=null,AEPROT=false;
function openAEnh(sel){const b=$('bm'),p=S.p,L=Object.keys(ARMX).filter(id=>has(p,id)).sort((a,c)=>APARTS.findIndex(q=>q[0]==ARMX[a][0])-APARTS.findIndex(q=>q[0]==ARMX[c][0])||ARMX[c][1]-ARMX[a][1]);if(sel)AESEL=sel;if(!L.includes(AESEL))AESEL=L[0]||null;b.dataset.m='aenh';PAUSE=true;
 let h='<div class="sh"><h2>🛡 방어구 강화 · 옵션</h2><div class="wt">강화 한도 +'+ENH.max+' · 무기와 같은 강화석</div><button onclick="closeBase();PAUSE=false">✕</button></div>';
 h+='<div class="aeL">'+L.map(id=>'<div class="aeI'+(id==AESEL?' on':'')+(aLv(id)>=7?' gl'+Math.min(3,1+((aLv(id)-7)/3|0)):'')+'" data-ae="'+id+'"><img src="'+icon(id)+'"><b>'+(aLv(id)?'+'+aLv(id):'')+'</b><small>'+PN[ARMX[id][0]]+(Object.values(p.eq).includes(id)?' · E':'')+'</small></div>').join('')+'</div>';
 if(AESEL){const id=AESEL,lv=aLv(id),nx=lv+1,mx=ENH.max,base=ARMX[id][4].dr||0,now=aDr(id),nxt=Math.min(.85,base*(1+.05*nx)),cost=lv<mx?ENH.cost(nx):null,rate=lv<mx?AERATE(nx):0,have=cost&&Object.keys(cost).every(k=>(p.inv[k]|0)>=cost[k]);
  h+='<div class="aeC"><div class="aeT"><img src="'+icon(id)+'"><div><b>'+(lv?'+'+lv+' ':'')+NM2(id)+'</b><small>'+PN[ARMX[id][0]]+' · 받는 피해 -'+(now*100).toFixed(1)+'%'+(lv<mx?' → <span style="color:#7fd07f">-'+(nxt*100).toFixed(1)+'%</span>':' (최대)')+'</small></div></div>';
  h+='<div class="enBar">'+Array.from({length:mx},(_,i)=>'<i class="'+(i<lv?'f':'')+(i==4||i==9||i==14?' m':'')+'"></i>').join('')+'</div><small class="mut">+5 · +10 · +15에서 옵션 칸이 하나씩 열려요 · +6부터 실패하면 한 단계 내려가요 · 방어구 강화 확률은 무기의 80%</small>';
  if(lv<mx)h+='<div class="aeR"><span>성공 '+rate+'%</span><span>'+costTxt(cost)+'</span>'+(nx>=6?'<label><input type="checkbox" id="aeProt" '+(AEPROT?'checked':'')+'> 보호 부적 ('+(p.inv.enhg|0)+')</label>':'')+'<button id="aeGo" '+(have?'':'disabled')+'>🔨 강화</button></div>';
  if(AERES)h+='<div class="aeRes '+AERES[0]+'">'+AERES[1]+'</div>';
  const sl=aSlots(lv),cur=(S.pg.aopt||{})[id]||[];h+='<h4>옵션 칸 '+sl+'/3</h4><div class="aeS">'+[0,1,2].map(i=>{const r=cur[i],o=r&&AOPT[r.slice(3,-1)];return'<div class="aeSl'+(i<sl?'':' lk')+'">'+(i>=sl?'🔒 +'+[5,10,15][i]:o?'<img src="'+icon(r)+'"><b style="color:'+o[4]+'">'+o[0]+' '+o[1]+' '+ROMN[+r.slice(-1)]+'</b><small>'+o[3](+r.slice(-1))+'</small>':'<small>비어 있음</small>')+'</div>'}).join('')+'</div>';
  const part=ARMX[id][0],rs=Object.keys(p.inv).filter(k=>/^ao_/.test(k)&&p.inv[k]>0);
  h+='<h4>가진 방어구 룬</h4>'+(rs.length?'<div class="aeRn">'+rs.map(k=>{const o=AOPT[k.slice(3,-1)],fit=o[2].includes(part);return'<div class="aeRc'+(fit?'':' no')+'" data-rn="'+k+'"><img src="'+icon(k)+'"><b style="color:'+o[4]+'">'+o[0]+' '+o[1]+' '+ROMN[+k.slice(-1)]+'</b><small>'+(fit?o[3](+k.slice(-1))+' · <b style="color:#ffd36a">새기기 '+AORATE[+k.slice(-1)]+'%</b>':o[2].map(q=>PN[q]).join(' · ')+' 전용')+' ×'+p.inv[k]+'</small></div>'}).join('')+'</div>':'<small class="mut">없음 · 광산 깊은 층 · 좀비 기지 · 약탈자 기지에서 나와요</small>');
  h+='</div>'}
 b.innerHTML=h;b.style.display='block';
 b.querySelectorAll('[data-ae]').forEach(e=>e.onclick=()=>{AERES=null;openAEnh(e.dataset.ae)});
 const pr=$('aeProt');if(pr)pr.onchange=()=>{AEPROT=pr.checked};const go=$('aeGo');if(go)go.onclick=doAEnh;
 b.querySelectorAll('[data-rn]').forEach(e=>e.onclick=()=>aInscribe(e.dataset.rn))}
function doAEnh(){const id=AESEL,pg=AE(),lv=aLv(id),nx=lv+1;if(lv>=ENH.max)return;const c=ENH.cost(nx),p=S.p;if(!Object.keys(c).every(k=>(p.inv[k]|0)>=c[k]))return msg('재료가 부족해요');for(const k in c)invTake(p,k,c[k]);
 if(Math.random()*100<AERATE(nx)){pg.aenh[id]=nx;AERES=['ok','✨ 성공! +'+nx+' '+NM2(id)+([5,10,15].includes(nx)?' · 옵션 칸이 열렸어요':'')];try{enhSnd(1)}catch(e){}}
 else if(nx>=6){if(AEPROT&&(p.inv.enhg|0)>0){invTake(p,'enhg',1);AERES=['pr','🛡 실패했지만 보호 부적이 막았어요 · +'+lv+' 유지']}else{pg.aenh[id]=lv-1;AERES=['no','💥 실패 · +'+lv+' → +'+(lv-1)]}}
 else AERES=['no','💨 실패 · 재료만 사라졌어요'];openAEnh();hud2()}
function aInscribe(rn){const id=AESEL,p=S.p,o=AOPT[rn.slice(3,-1)];if(!o[2].includes(ARMX[id][0]))return msg('🛡 '+o[1]+'은(는) '+o[2].map(q=>PN[q]).join(' · ')+'에만 새길 수 있어요');const pg=AE(),sl=aSlots(aLv(id)),cur=pg.aopt[id]=pg.aopt[id]||[];
 if(!sl)return msg('🛡 +5부터 옵션 칸이 열려요');let i=cur.findIndex((r,j)=>j<sl&&!r);if(i<0){for(let j=0;j<sl;j++)if(!cur[j]){i=j;break}}if(i<0||i>=sl)i=sl-1;const old=cur[i];
 if(cur.some((r,j)=>j!=i&&r&&r.slice(3,-1)==rn.slice(3,-1)))return msg('🛡 같은 옵션은 한 방어구에 하나만');invTake(p,rn,1);const gr=+rn.slice(-1);if(Math.random()*100>=AORATE[gr]){AERES=['no','💥 새기기 실패 ('+AORATE[gr]+'%) · 룬이 부서졌어요'+(old?' · 원래 옵션은 그대로':'')];openAEnh();hud2();return}cur[i]=rn;AERES=['ok','✨ '+o[1]+' '+ROMN[gr]+' 새김'+(old?' · 원래 옵션은 사라졌어요':'')];openAEnh();hud2()}
{const _ob=openBase;openBase=function(){_ob.apply(this,arguments);if(!S||$('aeOpen'))return;const h=$('bm').querySelector('h2');if(h&&(S.base.lv.bench|0)>=1)h.insertAdjacentHTML('afterend','<button id="aeOpen" style="float:right;padding:4px 10px;font-size:12px;width:auto;margin-left:4px" onclick="openAEnh()">🛡 방어구 강화</button>')}}
/* runes drop from deep places (3층 심층 cells, hive, raider camps) */
/* drops are the unified 옵션의 룬 (runes_next.js); the better the place, the better the rune */
const aRune=maxG=>{const r=Math.random();return maxG>=3&&r<.15?'orn3':maxG>=2&&r<.5?'orn2':'orn1'};
document.head.insertAdjacentHTML('beforeend',`<style>#bm .aeL{display:flex;gap:6px;overflow-x:auto;padding:6px 0}#bm .aeI{flex:0 0 64px;text-align:center;padding:6px 2px;border-radius:10px;background:#ffffff0a;border:1px solid #ffffff18;position:relative}#bm .aeI.on{border-color:#ffd36a;background:#3a3010}#bm .aeI img{width:36px;image-rendering:pixelated;display:block;margin:0 auto}#bm .aeI b{position:absolute;top:2px;right:5px;font-size:11px;color:#ffd36a}#bm .aeI small{font-size:10px;color:var(--mut)}
#bm .aeC{padding:8px;border-radius:12px;background:#ffffff08;margin-top:4px}#bm .aeT{display:flex;gap:10px;align-items:center}#bm .aeT img{width:56px;image-rendering:pixelated}#bm .aeT b{display:block;font-size:15px}#bm .aeT small{font-size:12px;color:var(--mut)}
#bm .aeR{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:8px 0;font-size:12px}#bm .aeR button{width:auto;padding:6px 14px}#bm .aeRes{padding:6px 10px;border-radius:8px;margin:4px 0;font-size:12.5px}#bm .aeRes.ok{background:#2f5a2a}#bm .aeRes.no{background:#5a2a2a}#bm .aeRes.pr{background:#2a3e5a}
#bm .aeS{display:grid;grid-template-columns:repeat(3,1fr);gap:5px}#bm .aeSl{padding:6px;border-radius:9px;background:#ffffff0c;border:1px dashed #ffffff2a;min-height:52px;font-size:11px}#bm .aeSl.lk{opacity:.45}#bm .aeSl img{width:22px;image-rendering:pixelated;float:left;margin-right:4px}#bm .aeSl b{display:block;font-size:11.5px}#bm .aeSl small{color:var(--mut);font-size:10.5px}
#bm .aeRn{display:grid;grid-template-columns:1fr 1fr;gap:5px}#bm .aeRc{display:grid;grid-template-columns:26px 1fr;gap:0 6px;padding:5px;border-radius:9px;background:#ffffff0c;cursor:pointer}#bm .aeRc.no{opacity:.45}#bm .aeRc img{grid-row:1/3;width:24px;image-rendering:pixelated}#bm .aeRc b{font-size:11.5px}#bm .aeRc small{font-size:10.5px;color:var(--mut)}#bm h4{margin:10px 0 4px;font-size:13px}</style>`);

/* ---------- runes are their own kind: 무기 룬 · 방어구 룬 tabs in the bag ---------- */
for(const it of ITEMS){if(/^rn_/.test(it[0]))it[2]='r';if(/^ao_/.test(it[0]))it[2]='o'}
{const _ob=openBag;openBag=function(id){_ob(id);const f=$('bm').querySelector('.flt');if(!f||f.querySelector('[data-f="r"]'))return;f.insertAdjacentHTML('beforeend','<span class="chip'+(BF=='r'?' on':'')+'" data-f="r">무기 룬</span><span class="chip'+(BF=='o'?' on':'')+'" data-f="o">방어구 룬</span>');
  f.querySelectorAll('[data-f="r"],[data-f="o"]').forEach(c=>c.onclick=()=>{BF=c.dataset.f;openBag()})}}
