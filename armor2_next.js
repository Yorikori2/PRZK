/* PROJECT LEGACY — sample: armour part 2.
   1) 특수 칸 after the shoes (머리 → 몸통 → 다리 → 신발 → 특수): headlamp, welding goggles, gas mask, night vision, thermal goggles.
   2) Set bonuses for wearing all four parts of one tier family.
   3) Worn armour shows on the player sprite (hat/helmet, jacket/vest/suit, trousers, boots, goggles).
   Loaded after armor_next.js. */
'use strict';
/* ---------- 1) special slot ---------- */
const SPX={flashl:[1,'손전등',.4,'보는 방향으로 좁고 긴 빛 (300) · 불을 켜면 좀비가 30% 더 잘 알아채요'],headlamp:[1,'헤드램프',.3,'넓고 짧은 빛 (230) · 손이 자유로워요 · 불을 켜면 좀비가 30% 더 잘 알아채요'],weld:[2,'용접 고글',.4,'화염 피해 -40% (불꽃 · 불바다 · 버너)'],
 gasmask:[3,'방독면',.8,'부머 독가스 피해 -70% · 산성 웅덩이 피해 -50%'],nvg:[4,'야간투시경',.9,'어둠을 거의 걷어 내요 (옅은 초록빛) · 빛을 켜지 않아 들키지 않아요'],thermal:[5,'열화상 고글',1,'벽 너머 가까운 좀비가 붉게 보여요 (300 거리)']};
for(const id in SPX){const a=SPX[id];let it=I_BY[id];if(!it){it=[id,a[1],'e',ATIER_RAR[a[0]],a[2],''];ITEMS.push(it);I_BY[id]=it}it[5]='[특수 T'+a[0]+'] '+a[3]}
{const i=SLOTS.findIndex(s=>s[0]=='feet');if(!SLOTS.some(s=>s[0]=='spec'))SLOTS.splice(i+1,0,['spec','특수']);SLOTN.spec='특수'}
{const _gi=gearInit;gearInit=function(p){_gi(p);if(p.eq.spec==null)p.eq.spec=''}}
if(S&&S.p&&S.p.eq&&S.p.eq.spec==null)S.p.eq.spec='';
{const _sf=slotFor;slotFor=function(id){return SPX[id]?'spec':_sf(id)}}
/* special gear is a choice, not an upgrade: only fill an empty slot automatically */
{const _ae=autoEquip;autoEquip=function(p,id,quiet){if(!SPX[id])return _ae(p,id,quiet);if(!p.eq.spec){p.eq.spec=id;if(!quiet&&typeof msg=='function')setTimeout(()=>msg('🎽 특수 장착: '+NM2(id)),900)}}}
const spec=id=>S&&S.p&&S.p.eq&&S.p.eq.spec==id&&has(S.p,id);
{const _h=hurtP;hurtP=function(n,why){if(spec('gasmask')&&why&&/부머/.test(why))n*=.3;return _h(n,why)}}
/* fire and acid ticks: refund the share the goggles / mask / fire set stop */
function fireMul(){let m=1;if(spec('weld'))m*=.6;if(setOn('work'))m=0;return m}
{const _gu=gearUpd;gearUpd=function(dt){const p=S&&S.p,h0=p&&p.hp;_gu(dt);if(!p||!(p.hp<h0))return;let fire=0,acid=0;
  if(typeof S4!='undefined'&&S4.burn>0)fire+=5*dt;for(const f of S.fires||[])if(Math.hypot(p.x-f.x,p.y-f.y)<f.r*.8)fire+=dt*6;
  if(typeof S4!='undefined')for(const q of S4.pud||[])if(Math.hypot(p.x-q.x,p.y-q.y)<q.r)acid+=10*dt;
  const back=fire*(1-fireMul())+acid*(spec('gasmask')?.5:0);if(back>0)p.hp=Math.min(h0,p.hp+back)}}
OVL.push((g2,sx,sy,k)=>{if(!spec('thermal'))return;const p=S.p;for(const z of Z){const d=Math.hypot(z.x-p.x,z.y-p.y);if(d>300||z.npc)continue;if(los(p.x,p.y-12,z.x,z.y-12))continue;const X=sx(z.x),Y=sy(z.y);
  g2.fillStyle='rgba(255,70,40,.55)';g2.beginPath();g2.ellipse(X,Y-14*k,7*k,14*k,0,0,Math.PI*2);g2.fill();g2.fillStyle='rgba(255,200,80,.7)';g2.beginPath();g2.arc(X,Y-26*k,4*k,0,Math.PI*2);g2.fill()}});
/* craft / loot */
if(typeof RCP2!='undefined'){const add=r=>{if(!RCP2.some(q=>q[0]==r[0]))RCP2.push(r)};add(['headlamp',{elec:1,scrap:2,cloth:1},['bench',1,'작업대 Lv1']]);add(['weld',{scrap:4,elec:1,cloth:1},['bench',2,'작업대 Lv2']])}
{const L={houses:['flashl'],apt:['flashl'],mart:['flashl'],school:['flashl'],hard:['headlamp','weld','flashl'],ware:['headlamp','flashl'],fire:['gasmask','headlamp'],police:['gasmask'],clinic:['gasmask'],lab:['gasmask','thermal'],mil:['nvg','gasmask'],rbase:['nvg']};for(const k in L)GLOOT[k]=(GLOOT[k]||[]).concat(L[k].filter(x=>!(GLOOT[k]||[]).includes(x)))}
/* ---------- 2) sets: all four parts of one family ---------- */
const ASETS={surv:['생존자 세트',['band','jacket','jeans','tboots'],'이동 +5% · 발소리 -10%'],work:['작업자 세트',['hardhat','tirevest','kneepad','wboots'],'화염 피해 무효 · 흉갑 이동 감소 없음'],
 police:['경찰 세트',[['helmet'],['vest','armor'],['legguard'],['tacboots']],'받는 피해 -5% 추가'],mil:['군용 세트',['visor','milarmor','cpants','silboots'],'탄약 무게 절반'],
 spec:['특수부대 세트',['spechelm','eod','exo','shockboots'],'폭발 피해 무효 · 방호복 이동 감소 없음']};
function setCount(k,p){p=p||S.p;const L=ASETS[k][1];return APARTS.filter(([sl],i)=>{const want=[].concat(L[i]);return want.includes(p.eq[sl])&&has(p,p.eq[sl])}).length}
const setOn=(k,p)=>!!(S&&S.p)&&setCount(k,p)==4;
const setOf=id=>Object.keys(ASETS).find(k=>ASETS[k][1].some(x=>[].concat(x).includes(id)));
{const _a=armMul2;armMul2=function(p){return _a(p)*(setOn('police',p)?.95:1)}}
{const _b=blastMul;blastMul=function(p){return setOn('spec',p)?0:_b(p)}}
{const _sp=s3Spd;s3Spd=function(p){let m=_sp(p);if(setOn('surv',p))m*=1.05;if(setOn('work',p))m/=.95;if(setOn('spec',p))m/=.8;return m}}
{const _dm=detMul;detMul=function(){const m=_dm();return S&&S.p&&S.p.mv&&setOn('surv')?m*.9:m}}
{const _w=weight;weight=function(p){const w=_w(p);if(!setOn('mil',p))return w;let a=0;for(const id in p.inv)if(catOf(id)=='a')a+=wtOf(id)*(p.inv[id]||0);return w-a/2}}
for(const id of Object.keys(ARMX)){const k=setOf(id);if(k&&I_BY[id]&&!/세트:/.test(I_BY[id][5]))I_BY[id][5]+=' · 세트: '+ASETS[k][0]}
/* the bag shows which sets are on and how close the others are */
{const _ob=openBag;openBag=function(id){_ob(id);if(!S)return;const p=S.p,eq=$('bm').querySelector('.eq');if(!eq)return;const L=Object.keys(ASETS).map(k=>[k,setCount(k)]).filter(x=>x[1]>=2);
  eq.insertAdjacentHTML('afterend','<div class="aset">'+(L.length?L.map(([k,n])=>'<span class="'+(n==4?'on':'')+'">'+(n==4?'✅ ':'')+ASETS[k][0]+' '+n+'/4'+(n==4?' · '+ASETS[k][2]:'')+'</span>').join(''):'<span>세트: 같은 계열 4부위를 모두 끼면 보너스</span>')+'</div>')}}
document.head.insertAdjacentHTML('beforeend','<style>#bm .aset{display:flex;flex-wrap:wrap;gap:4px;margin:4px 0 6px;font-size:11px}#bm .aset span{padding:3px 8px;border-radius:99px;background:#ffffff10;color:var(--mut)}#bm .aset span.on{background:#2f5a2a;color:#d8f5c8}</style>');
/* ---------- 3) armour on the player sprite: every family has its own look ----------
   Parts paint "marker" colours (rgb 240, 8k, 0); after the sprite is drawn each marker area is filled with its pattern
   (camouflage, police blue with a reflective band, hi-vis orange…), keeping the sprite's own light and shade. */
const AMK=(k,sh=1)=>'#'+[Math.round(240*sh),Math.round(8*k*sh),0].map(v=>Math.min(255,v).toString(16).padStart(2,'0')).join('');
const AMK3=k=>({c:AMK(k),cl:AMK(k,1.06),cd:AMK(k,.8)}),AMKP=k=>({p:AMK(k),pd:AMK(k,.8)});
const hh2=(x,y,s)=>{let h=(x*374761393+y*668265263+s*1442695041)|0;h=(h^(h>>>13))*1274126177|0;return((h^(h>>>16))>>>0)/4294967296};
const camo=(L)=>(x,y)=>{const v=hh2(x>>1,y>>1,3)*.6+hh2(x>>2,y>>2,7)*.4;return L[v<.3?0:v<.55?1:v<.8?2:3]};
const CAMO=['#4f5a35','#3e4729','#6b6040','#2e3520'];
const PATF={
 1:camo(CAMO),2:camo(['#4a5532','#394226','#625a3b','#2a311d']),3:camo(['#55603a','#424c2c','#70664a','#323a24']),
 4:(x,y,b)=>y-b.y0==Math.round((b.y1-b.y0)*.3)&&(x-b.x0)%5==1?'#2a3a5a':'#6a8ac0',/* police shirt, light blue with pocket seams */
 5:(x,y,b)=>{const r=(y-b.y0)/(b.y1-b.y0+1);return r>.35&&r<.6?'#8a96a6':'#1e2a44'},/* navy trousers, grey knee guards */
 6:(x,y,b)=>{const r=(y-b.y0)/(b.y1-b.y0+1),c=(x-b.x0)/(b.x1-b.x0+1);if(r>.42&&r<.62)return'#f0f0e0';if(r<.3&&c<.35)return'#e0b03a';return'#1a2030'},/* black vest, white POLICE band, gold badge */
 7:(x,y,b)=>{const r=(y-b.y0)/(b.y1-b.y0+1);return r>.62?'#9ad0f0':r<.2?'#3a4a6a':'#1e2a44'},/* navy riot helmet with visor */
 8:(x,y,b)=>{const r=(y-b.y0)/(b.y1-b.y0+1);return(r>.3&&r<.42)||(r>.68&&r<.8)?'#d8dce0':'#ff7a1a'},/* hi-vis orange with silver bands */
 9:(x,y,b)=>y==b.y0?'#fff0a0':'#f0c020',/* yellow hard hat */
 10:(x,y)=>'#1e2024',11:(x,y,b)=>{const r=(y-b.y0)/(b.y1-b.y0+1);return r>.45&&r<.55?'#f0c020':hh2(x>>2,y>>2,5)<.15?'#3e5878':'#4f6a8a'},/* EOD blue with yellow band */
 12:(x,y)=>hh2(x>>1,y>>1,9)<.12?'#8a6a42':hh2(x,y,2)<.1?'#4a2e18':'#6b4426',/* patched leather */
 13:(x,y,b)=>{const r=(y-b.y0)/(b.y1-b.y0+1);return r>.4&&r<.6&&(x-b.x0)%9<3?'#c9b48f':'#3a5a8a'},/* jeans with knee patches */
 14:(x,y,b)=>{const r=(y-b.y0)/(b.y1-b.y0+1);return r>.62&&(x-b.x0)%3!=2?'#3e4729':camo(CAMO)(x,y)},/* plate carrier with pouches */
 15:(x,y,b)=>{const r=(y-b.y0)/(b.y1-b.y0+1);return r<.25&&Math.abs(x-(b.x0+b.x1)/2)<2?'#5fbf6a':'#22262b'},/* black helmet, NVG mount */
 16:(x,y)=>(x+y)%4==0?'#f0e0c0':'#b83a32',/* red bandana with white dots */
 17:(x,y,b)=>(y-b.y0)%3==1?'#4a4a4a':'#262626',/* tyre tread chest */
 18:(x,y,b)=>x==b.x0+1||x==b.x1-1?'#e0b03a':'#3a3f45',/* exo frame */
 19:(x,y,b)=>{const r=(y-b.y0)/(b.y1-b.y0+1);return r>.38&&r<.58?'#1d1d1d':'#9a8a5a'},/* khaki work trousers, black knee pads */
 20:(x,y,b)=>(y-b.y0)%4==0?'#9aa0a6':'#7a6a5a',/* scrap plates */
 21:(x,y)=>'#2a2e33',22:(x,y,b)=>(y-b.y0)%4==3?'#454b52':'#1e2024'/* spec-ops black, ribbed */};
const AVIS={band:{cap:AMK(16)},hardhat:{helm:AMK(9)},helmet:{helm:AMK(7)},visor:{helm:AMK(3)},spechelm:{helm:AMK(15)},
 jacket:AMK3(12),tirevest:{vest:AMK(17)},vest:Object.assign(AMK3(4),{vest:AMK(6)}),armor:{vest:AMK(20)},milarmor:Object.assign(AMK3(1),{vest:AMK(14)}),eod:Object.assign(AMK3(11),{coat:1,vest:AMK(11)}),
 jeans:AMKP(13),kneepad:AMKP(19),legguard:AMKP(5),cpants:AMKP(2),exo:AMKP(18),
 tboots:{boot:'#3a5a3a'},wboots:{boot:'#8a5a2a'},tacboots:{boot:'#141414'},silboots:{boot:'#2a2e33'},shockboots:{boot:'#5a6470'},
 flashl:{},headlamp:{eye:'#ffe680'},weld:{eye:'#2a8acf'},gasmask:{eye:'#5a6470'},nvg:{eye:'#5fbf6a'},thermal:{eye:'#e05a30'}};
/* the T2 worker set also wears a hi-vis vest over the tyre chest when the whole set is on */
let ARMVIS=true;
function plLook(){const p=S.p,ids=['body','head','legs','feet','spec'].map(k=>p.eq&&p.eq[k]).filter(id=>id&&AVIS[id]&&has(p,id));if(!ARMVIS||!ids.length)return'player';const work=setOn('work'),spc=setOn('spec');const key='pa_'+ids.join('_')+(work?'_W':'')+(spc?'_S':'');
 if(!LOOKS[key]){const o=Object.assign({},LOOKS.player,{pat:1});for(const id of ids)Object.assign(o,AVIS[id]);if(o.helm)o.cap=null;if(work)Object.assign(o,{vest:AMK(8)});if(spc&&!o.coat)Object.assign(o,AMK3(22));LOOKS[key]=o}return key}
{const _dc=drawChar;drawChar=function(look,x,y,dir,fr,wpn,scale){if(look=='player'&&S&&S.p&&run){const p=S.p,k=plLook();if(k!='player'){p.d8=dir8(p.fx,p.fy,p.d8);dir=p.d8;if(fr>=0)fr=F8(p.ph||0);return _dc.call(this,k,x,y,dir,fr,wpn,scale)}}return _dc.apply(this,arguments)}}
const hexRGB=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
{const _ps=person;person=function(o,dir,fr,wpn){const r=_ps(o,dir,fr,wpn);if(o&&(o.boot||o.eye||o.pat)&&g&&g.canvas){try{const c=g.canvas,W2=c.width,im=g.getImageData(0,0,W2,c.height),D=im.data,B=o.boot&&hexRGB(o.boot),E=o.eye&&hexRGB(o.eye),bx={};
  const kOf=i=>D[i+2]<=3&&D[i]>=60&&D[i+1]>0?Math.round(D[i+1]*30/D[i]):0;
  if(o.pat)for(let i=0;i<D.length;i+=4){if(!D[i+3])continue;const k=kOf(i);if(!k||!PATF[k])continue;const x=(i>>2)%W2,y=(i>>2)/W2|0,b=bx[k]=bx[k]||{x0:x,y0:y,x1:x,y1:y};if(x<b.x0)b.x0=x;if(x>b.x1)b.x1=x;if(y<b.y0)b.y0=y;if(y>b.y1)b.y1=y}
  for(let i=0;i<D.length;i+=4){if(!D[i+3])continue;if(B&&D[i]==35&&D[i+1]==29&&D[i+2]==25){D[i]=B[0];D[i+1]=B[1];D[i+2]=B[2];continue}if(E&&D[i]==26&&D[i+1]==26&&D[i+2]==26){D[i]=E[0];D[i+1]=E[1];D[i+2]=E[2];continue}
   if(!o.pat)continue;const k=kOf(i);if(!k||!PATF[k])continue;const x=(i>>2)%W2,y=(i>>2)/W2|0,sh=D[i]/240,C=hexRGB(PATF[k](x,y,bx[k]));D[i]=Math.min(255,C[0]*sh);D[i+1]=Math.min(255,C[1]*sh);D[i+2]=Math.min(255,C[2]*sh)}g.putImageData(im,0,0)}catch(e){}}return r}}
/* ---------- icons ---------- */
{const K='#1d1714';
 const gog=(f,l)=>()=>{R(K,2,8,20,9);R('#3a3f45',3,9,18,7);blob(8,12,4,3,K);blob(16,12,4,3,K);blob(8,12,3,2,f);blob(16,12,3,2,f);R(l,6,11,2,1);R(l,14,11,2,1);R(K,1,11,2,3);R(K,21,11,2,3)};
 IC.flashl=()=>{R(K,3,9,14,7);R('#3a3f45',4,10,12,5);R('#5a6068',4,10,12,1);R(K,16,7,6,11);R('#c9ced3',17,8,4,9);R('#ffe680',21,9,1,7);R('#e0b03a',8,12,3,1)};
 IC.headlamp=()=>{R(K,2,9,20,7);R('#5a3e22',3,10,18,5);blob(12,12,5,5,K);blob(12,12,4,4,'#c9ced3');blob(12,12,2,2,'#ffe680');R('#fff6c0',11,11,1,1)};
 {const hm=(a,b2,ex)=>()=>{blob(12,13,9,7,K);blob(12,13,8,6,a);R(b2,6,8,10,2);R(K,3,15,18,3);R(a,4,15,16,2);ex&&ex()};IC.helmet=hm('#1e2a44','#3a4a6a',()=>{R('#9ad0f0',5,13,14,2);R('#e0b03a',11,8,2,2)});IC.visor=hm('#4f5a35','#6b6040',()=>{R('#3e4729',7,10,3,2);R('#2e3520',13,9,3,2);R('#6b6040',9,12,2,2);R('#2a8acf',5,15,14,1)})}
 IC.weld=gog('#2a8acf','#7ec8f0');IC.nvg=()=>{gog('#2f6a3a','#5fbf6a')();R(K,9,3,6,6);R('#3a3f45',10,4,4,5);R('#5fbf6a',11,5,2,1)};IC.thermal=gog('#c43c32','#ffb52e');
 IC.gasmask=()=>{blob(12,11,8,8,K);blob(12,11,7,7,'#4a4e45');blob(8,9,3,3,K);blob(16,9,3,3,K);blob(8,9,2,2,'#9ad0e0');blob(16,9,2,2,'#9ad0e0');R(K,9,15,6,7);R('#5a6470',10,16,4,5);for(let i=0;i<3;i++)R(K,10,17+i*2,4,1)}}
