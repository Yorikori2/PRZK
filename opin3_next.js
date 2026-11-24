/* PROJECT LEGACY — sample: idea 3 (trade vouchers instead of scrap) and idea 4 (raiders go for the airdrop too).
   · 교환권 (trade voucher): weightless currency for merchants. Scrap stays a building material; you can still sell
     10 scrap for 1 voucher. Vouchers come from raiders, camps, airdrops and selling loot.
   · Airdrop defence in zone 3+: raider squads come for the container; if they wreck it (container HP) half the loot is gone.
   Loaded after evt2_next.js. */
'use strict';
{const it=['tkn','교환권','m','u',0,'상인과 거래하는 화폐 · 무게 없음 · 약탈자 · 기지 · 보급품 · 물건을 팔아 얻어요'];if(!I_BY.tkn){ITEMS.push(it);I_BY.tkn=it}
 IC.tkn=()=>{R('#1d1714',3,6,18,12);R('#e0b03a',4,7,16,10);R('#f4d36a',4,7,16,2);R('#a8781e',4,15,16,2);R('#1d1714',7,9,1,6);for(let i=0;i<4;i++)R('#7a5a1a',10+i*2,10,1,4);R('#c43c32',17,9,2,2)}}
/* the merchant now deals in vouchers */
{const sw=f=>new Function('return '+f.toString().replace(/p\.inv\.scrap/g,'p.inv.tkn').replace(/'scrap'/g,"'tkn'").replace(/내 고철/g,'내 교환권').replace(/고철이 돈이에요/g,'교환권으로 거래해요 · 고철 10개 = 교환권 1장').replace(/🔩/g,'🎫').replace(/고철이 모자라요/g,'교환권이 모자라요'))();
 openMer=sw(openMer);merBuy=sw(merBuy);merSell=sw(merSell)}
{const _sv=sellV;sellV=function(k){if(k=='tkn')return 0;if(k=='scrap')return .1;return _sv(k)}}
/* where vouchers come from */
{const _k=kill;kill=function(z){_k(z);if(!S||!z.raider||z.gone||z.npc)return;const n=1+(Math.random()*z.raider|0)+(z.lead?5:0);invAdd(S.p,'tkn',n);s3Float(z.x,z.y-52,'🎫 +'+n,'#f4d36a')}}
{const _tk=rbTake;rbTake=function(){_tk();invAdd(S.p,'tkn',25);msg('🎫 기지 금고에서 교환권 25장')}}
/* ---------- idea 4: raiders come for the airdrop (zone 3+) ---------- */
let AIRR=false;/* sample switch: true lets it happen in any zone */
{const _et=evTick;evTick=function(dt){_et(dt);for(const e of WEV){if(e.k!='air'||e.ph!='def')continue;if(e.chp==null){e.chp=100;e.rw=[0,28]}
  if(e.zn>=3||AIRR){for(let i=0;i<e.rw.length;i++){const at=e.rw[i];if(at!=null&&60-e.left>=at){e.rw[i]=null;const zn=Math.max(3,e.zn),rp=airRoute(e);const L=rSquad(rp.s[0],rp.s[1],zn,{air:1,wp:rp.wp,x:e.x,y:e.y,hit:d=>{if(e.ph=='def'||e.ph=='open'){e.chp=Math.max(0,e.chp-d*6);if(e.chp<=0&&!e.robbed){e.robbed=1;evBanner('🏴 보급품을 털렸어요','약탈자가 컨테이너를 부쉈어요 · 남은 건 절반뿐이에요')}}}});
    L.forEach(q=>q.wi=0);evBanner('🏴 약탈자도 보급품을 노려요','"그 상자는 우리 거다!" · 컨테이너에 붙으면 상자가 부서져요')}}}}}}
OVL.push((g2,sx,sy,k)=>{for(const e of WEV){if(e.k!='air'||e.chp==null||(e.ph!='def'&&e.ph!='open'))continue;const X=sx(e.x),Y=sy(e.y),w=50*k;g2.fillStyle='#000a';g2.fillRect(X-w/2-1,Y+16*k,w+2,6);g2.fillStyle=e.chp>50?'#7fd07f':e.chp>20?'#ffd36a':'#ff6a5a';g2.fillRect(X-w/2,Y+16*k+1,w*e.chp/100,4)}});
/* opening a robbed container gives half; any opened container also holds vouchers */
{const _c=dmCtx;dmCtx=function(){const B=_c();for(const q of B){if(!/컨테이너 열기/.test(q.t)||q._w)continue;const f=q.f,e=WEV.find(x=>x.k=='air'&&Math.hypot(x.x-S.p.x,x.y-S.p.y)<=70);q._w=1;
  q.f=()=>{const og=give;if(e&&e.robbed)give=function(r){const h={};for(const k in r){const n=Math.floor(r[k]/2);if(n)h[k]=n}return og(h)};try{f()}finally{give=og}invAdd(S.p,'tkn',e&&e.robbed?6:15);msg((e&&e.robbed?'📦 털린 컨테이너 · 절반만 남았어요':'📦 컨테이너를 열었어요')+' · 🎫 교환권 +'+(e&&e.robbed?6:15))}}return B}}

/* raiders after the container head for it and only turn on you when you are close or shoot them */
/* a road route to the container: an intersection one block out → the container's corner → along the road → in */
function airRoute(e){const c=Math.floor((e.x-RD/2)/PX),r=Math.floor((e.y-RD/2)/PY),[ox,oy]=bo(c,r),x0=ox-RD/2,y0=oy-RD/2,C=[[x0,y0],[x0+PX,y0],[x0,y0+PY],[x0+PX,y0+PY]];
 C.sort((a,b)=>Math.hypot(a[0]-e.x,a[1]-e.y)-Math.hypot(b[0]-e.x,b[1]-e.y));const I0=C[0],out=Math.random()<.5?[I0[0]+(I0[0]<e.x?-PX:PX),I0[1]]:[I0[0],I0[1]+(I0[1]<e.y?-PY:PY)];
 const P1=[Math.max(x0,Math.min(x0+PX,e.x)),I0[1]],P2=[I0[0],Math.max(y0,Math.min(y0+PY,e.y))],P=Math.hypot(P1[0]-e.x,P1[1]-e.y)<Math.hypot(P2[0]-e.x,P2[1]-e.y)?P1:P2;return{s:out,wp:[I0,P,[e.x,e.y]]}}
{const _rt=rThink;rThink=function(r,dt){const g=r.grp&&r.grp.goal;
  if(g&&g.air&&!r.env&&!(r.hurt>0)){const p=S.p,dg=Math.hypot(g.x-r.x,g.y-r.y),dp=Math.hypot(p.x-r.x,p.y-r.y);
   if(dg>70&&dp>120){let tx=g.x,ty=g.y;if(g.wp&&r.wi!=null&&r.wi<g.wp.length){[tx,ty]=g.wp[r.wi];if(Math.hypot(tx-r.x,ty-r.y)<40){r.wi++;if(r.wi<g.wp.length)[tx,ty]=g.wp[r.wi]}}
    let dx=tx-r.x,dy=ty-r.y;const dd=Math.hypot(dx,dy)||1;dx/=dd;dy/=dd;
    /* stuck against something? side-step for a moment */
    r.sk=(r.sk||0)+dt;if(r.sk>1){const moved=Math.hypot(r.x-(r.skx||r.x),r.y-(r.sky||r.y));if(moved<8)r.side=(Math.random()<.5?-1:1)*1.2;r.sk=0;r.skx=r.x;r.sky=r.y}
    if(r.side){const sd=r.side;dx=dx*.3-dy*sd;dy=dy*.3+dx*sd/.3*.3;r.side*=Math.pow(.2,dt);if(Math.abs(r.side)<.1)r.side=0}
    const n=Math.hypot(dx,dy)||1;dx/=n;dy/=n;r.stun=1e9;mv(r,dx*r.spd*dt,dy*r.spd*dt,7);r.mv=1;r.fx=dx;r.fy=dy;r.walk=.15;r.ph=(r.ph||0)+dt*r.spd/18;return}
   if(dg<=70){g.hit(dt);if(dp>120){r.stun=1e9;r.mv=0;r.fx=g.x-r.x;r.fy=g.y-r.y;return}}}
  return _rt(r,dt)}}
/* drops land in the open, not inside buildings */
{const _ea=evAt;evAt=function(dist){for(let i=0;i<12;i++){const[x,y]=_ea(dist);if(!W0.roofs.some(r=>x>r.x-20&&x<r.x+r.w+20&&y>r.y-20&&y<r.y+r.h+20))return[x,y]}return _ea(dist)}}
