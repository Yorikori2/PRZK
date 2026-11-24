/* PROJECT LEGACY — sample: armour part 2.
   1) 특수 칸 after the shoes (머리 → 몸통 → 다리 → 신발 → 특수): headlamp, welding goggles, gas mask, night vision, thermal goggles.
   2) Set bonuses for wearing all four parts of one tier family.
   3) Worn armour shows on the player sprite (hat/helmet, jacket/vest/suit, trousers, boots, goggles).
   Loaded after armor_next.js. */
'use strict';
/* ---------- 1) special slot ---------- */
const SPX={headlamp:[1,'헤드램프',.3,'밤에 앞이 밝게 보여요 · 대신 좀비도 밤에 더 잘 봐요 (발각 +30%)'],weld:[2,'용접 고글',.4,'화염 피해 -40% (불꽃 · 불바다 · 버너)'],
 gasmask:[3,'방독면',.8,'부머 독가스 피해 -70% · 산성 웅덩이 피해 -50%'],nvg:[4,'야간투시경',.9,'밤에도 초록빛으로 낮처럼 보여요'],thermal:[5,'열화상 고글',1,'벽 너머 가까운 좀비가 붉게 보여요 (300 거리)']};
for(const id in SPX){const a=SPX[id];let it=I_BY[id];if(!it){it=[id,a[1],'e',ATIER_RAR[a[0]],a[2],''];ITEMS.push(it);I_BY[id]=it}it[5]='[특수 T'+a[0]+'] '+a[3]}
{const i=SLOTS.findIndex(s=>s[0]=='feet');if(!SLOTS.some(s=>s[0]=='spec'))SLOTS.splice(i+1,0,['spec','특수']);SLOTN.spec='특수'}
{const _gi=gearInit;gearInit=function(p){_gi(p);if(p.eq.spec==null)p.eq.spec=''}}
if(S&&S.p&&S.p.eq&&S.p.eq.spec==null)S.p.eq.spec='';
{const _sf=slotFor;slotFor=function(id){return SPX[id]?'spec':_sf(id)}}
/* special gear is a choice, not an upgrade: only fill an empty slot automatically */
{const _ae=autoEquip;autoEquip=function(p,id,quiet){if(!SPX[id])return _ae(p,id,quiet);if(!p.eq.spec){p.eq.spec=id;if(!quiet&&typeof msg=='function')setTimeout(()=>msg('🎽 특수 장착: '+NM2(id)),900)}}}
const spec=id=>S&&S.p&&S.p.eq&&S.p.eq.spec==id&&has(S.p,id);
{const _dm=detMul;detMul=function(){const m=_dm();return NIGHT&&spec('headlamp')?m*1.3:m}}
{const _h=hurtP;hurtP=function(n,why){if(spec('gasmask')&&why&&/부머/.test(why))n*=.3;return _h(n,why)}}
/* fire and acid ticks: refund the share the goggles / mask / fire set stop */
function fireMul(){let m=1;if(spec('weld'))m*=.6;if(setOn('work'))m=0;return m}
{const _gu=gearUpd;gearUpd=function(dt){const p=S&&S.p,h0=p&&p.hp;_gu(dt);if(!p||!(p.hp<h0))return;let fire=0,acid=0;
  if(typeof S4!='undefined'&&S4.burn>0)fire+=5*dt;for(const f of S.fires||[])if(Math.hypot(p.x-f.x,p.y-f.y)<f.r*.8)fire+=dt*6;
  if(typeof S4!='undefined')for(const q of S4.pud||[])if(Math.hypot(p.x-q.x,p.y-q.y)<q.r)acid+=10*dt;
  const back=fire*(1-fireMul())+acid*(spec('gasmask')?.5:0);if(back>0)p.hp=Math.min(h0,p.hp+back)}}
/* night vision (green wash) and headlamp (a cone where you face) on the finished frame */
{const _dr=draw;draw=function(){_dr();if(!S||!NIGHT||!run)return;const p=S.p,X=(p.x-camX)*zoom*dpr,Y=(p.y-14-camY)*zoom*dpr;ctx.save();ctx.setTransform(1,0,0,1,0,0);
  if(spec('nvg')){ctx.globalCompositeOperation='screen';ctx.fillStyle='rgba(40,150,60,.55)';ctx.fillRect(0,0,cv.width,cv.height);ctx.globalCompositeOperation='multiply';ctx.fillStyle='rgba(150,255,160,1)';ctx.fillRect(0,0,cv.width,cv.height)}
  else if(spec('headlamp')){const a=Math.atan2(p.fy||1,p.fx||0),R2=260*zoom*dpr;ctx.globalCompositeOperation='lighter';const gr=ctx.createRadialGradient(X,Y,0,X,Y,R2);gr.addColorStop(0,'rgba(255,240,190,.42)');gr.addColorStop(1,'rgba(255,240,190,0)');ctx.fillStyle=gr;ctx.beginPath();ctx.moveTo(X,Y);ctx.arc(X,Y,R2,a-.45,a+.45);ctx.closePath();ctx.fill()}
  ctx.restore()}}
OVL.push((g2,sx,sy,k)=>{if(!spec('thermal'))return;const p=S.p;for(const z of Z){const d=Math.hypot(z.x-p.x,z.y-p.y);if(d>300||z.npc)continue;if(los(p.x,p.y-12,z.x,z.y-12))continue;const X=sx(z.x),Y=sy(z.y);
  g2.fillStyle='rgba(255,70,40,.55)';g2.beginPath();g2.ellipse(X,Y-14*k,7*k,14*k,0,0,Math.PI*2);g2.fill();g2.fillStyle='rgba(255,200,80,.7)';g2.beginPath();g2.arc(X,Y-26*k,4*k,0,Math.PI*2);g2.fill()}});
/* craft / loot */
if(typeof RCP2!='undefined'){const add=r=>{if(!RCP2.some(q=>q[0]==r[0]))RCP2.push(r)};add(['headlamp',{elec:1,scrap:2,cloth:1},['bench',1,'작업대 Lv1']]);add(['weld',{scrap:4,elec:1,cloth:1},['bench',2,'작업대 Lv2']])}
{const L={hard:['headlamp','weld'],ware:['headlamp'],fire:['gasmask','headlamp'],police:['gasmask'],clinic:['gasmask'],lab:['gasmask','thermal'],mil:['nvg','gasmask'],rbase:['nvg']};for(const k in L)GLOOT[k]=(GLOOT[k]||[]).concat(L[k].filter(x=>!(GLOOT[k]||[]).includes(x)))}
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
/* ---------- 3) armour on the player sprite ---------- */
const AVIS={band:{cap:'#b83a32'},hardhat:{helm:'#e0b03a'},helmet:{helm:'#4f5a35'},visor:{helm:'#3e4652'},spechelm:{helm:'#22262b'},
 jacket:{c:'#6b4426',cl:'#8a5a34',cd:'#4a2e18'},tirevest:{vest:'#2a2a2a'},vest:{vest:'#2f4a7a'},armor:{vest:'#7a6a5a'},milarmor:{vest:'#4f5a35',c:'#5a6440',cl:'#6b7650',cd:'#3e4729'},eod:{coat:1,c:'#4f6a8a',cl:'#6a86a8',cd:'#3a5068',vest:'#3a5068'},
 jeans:{p:'#3a5a8a',pd:'#2f4a74'},kneepad:{p:'#4a4e45',pd:'#2a2e33'},legguard:{p:'#2a2e33',pd:'#5a6470'},cpants:{p:'#4f5a35',pd:'#3e4729'},exo:{p:'#3a3f45',pd:'#e0b03a'},
 tboots:{boot:'#3a5a3a'},wboots:{boot:'#8a5a2a'},tacboots:{boot:'#3a3a3a'},silboots:{boot:'#2a2e33'},shockboots:{boot:'#5a6470'},
 headlamp:{eye:'#ffe680'},weld:{eye:'#2a8acf'},gasmask:{eye:'#5a6470'},nvg:{eye:'#5fbf6a'},thermal:{eye:'#e05a30'}};
let ARMVIS=true;
function plLook(){const p=S.p,ids=['head','body','legs','feet','spec'].map(k=>p.eq&&p.eq[k]).filter(id=>id&&AVIS[id]&&has(p,id));if(!ARMVIS||!ids.length)return'player';const key='pa_'+ids.join('_');
 if(!LOOKS[key]){const o=Object.assign({},LOOKS.player);for(const id of ids)Object.assign(o,AVIS[id]);if(o.helm)o.cap=null;LOOKS[key]=o}return key}
{const _dc=drawChar;drawChar=function(look,x,y,dir,fr,wpn,scale){if(look=='player'&&S&&S.p&&run){const p=S.p,k=plLook();if(k!='player'){p.d8=dir8(p.fx,p.fy,p.d8);dir=p.d8;if(fr>=0)fr=F8(p.ph||0);return _dc.call(this,k,x,y,dir,fr,wpn,scale)}}return _dc.apply(this,arguments)}}
/* boots and goggles: recolour the sprite's boot and eye pixels after it is drawn */
const hexRGB=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
{const _ps=person;person=function(o,dir,fr,wpn){const r=_ps(o,dir,fr,wpn);if(o&&(o.boot||o.eye)&&g&&g.canvas){try{const c=g.canvas,im=g.getImageData(0,0,c.width,c.height),D=im.data,B=o.boot&&hexRGB(o.boot),E=o.eye&&hexRGB(o.eye);
  for(let i=0;i<D.length;i+=4){if(!D[i+3])continue;if(B&&D[i]==35&&D[i+1]==29&&D[i+2]==25){D[i]=B[0];D[i+1]=B[1];D[i+2]=B[2]}else if(E&&D[i]==26&&D[i+1]==26&&D[i+2]==26){D[i]=E[0];D[i+1]=E[1];D[i+2]=E[2]}}g.putImageData(im,0,0)}catch(e){}}return r}}
/* ---------- icons ---------- */
{const K='#1d1714';
 const gog=(f,l)=>()=>{R(K,2,8,20,9);R('#3a3f45',3,9,18,7);blob(8,12,4,3,K);blob(16,12,4,3,K);blob(8,12,3,2,f);blob(16,12,3,2,f);R(l,6,11,2,1);R(l,14,11,2,1);R(K,1,11,2,3);R(K,21,11,2,3)};
 IC.headlamp=()=>{R(K,2,9,20,7);R('#5a3e22',3,10,18,5);blob(12,12,5,5,K);blob(12,12,4,4,'#c9ced3');blob(12,12,2,2,'#ffe680');R('#fff6c0',11,11,1,1)};
 IC.weld=gog('#2a8acf','#7ec8f0');IC.nvg=()=>{gog('#2f6a3a','#5fbf6a')();R(K,9,3,6,6);R('#3a3f45',10,4,4,5);R('#5fbf6a',11,5,2,1)};IC.thermal=gog('#c43c32','#ffb52e');
 IC.gasmask=()=>{blob(12,11,8,8,K);blob(12,11,7,7,'#4a4e45');blob(8,9,3,3,K);blob(16,9,3,3,K);blob(8,9,2,2,'#9ad0e0');blob(16,9,2,2,'#9ad0e0');R(K,9,15,6,7);R('#5a6470',10,16,4,5);for(let i=0;i<3;i++)R(K,10,17+i*2,4,1)}}
