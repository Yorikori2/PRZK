/* PROJECT LEGACY — sample: real darkness and lights.
   · Nights (and anything underground) are much darker; without a light you only see a small circle around you.
   · Lights: 손전등 / 헤드램프 (특수 칸) and the new 전술조명 gun-part slot that fits every gun. A light that is on makes
     zombies notice you 30% more; night vision clears the dark without giving you away (mild green now).
   Loaded after armor2_next.js and mine_next.js. */
'use strict';
/* ---------- gun part: 전술조명 slot on every gun ---------- */
if(!PSLOTS.some(s=>s[0]=='light'))PSLOTS.push(['light','전술조명']);
for(const cl in CSLOT)if(!CSLOT[cl].includes('light'))CSLOT[cl].push('light');
{const u=P_BY.u_light;if(u){u[1]='소형 전술조명';u[2]='light';u[4]=Object.keys(CSLOT);u[5]={night:1,beam:260}}
 for(const q of[['l_hi','고휘도 전술조명','light','r',Object.keys(CSLOT),{night:1,beam:340},'경찰서 · 군부대'],['l_strobe','스트로브 전술조명','light','e',Object.keys(CSLOT),{night:1,beam:300,strobe:1},'군부대 무기고 · 연구소']])
  if(!P_BY[q[0]]){PARTS.push(q);P_BY[q[0]]=q}}
/* old saves: a light bolted to the under-barrel slot moves to the new slot */
function lightMigrate(){const pg=S&&S.pg;if(!pg||!pg.mods||pg.lightMig)return;for(const id in pg.mods){const m=pg.mods[id];if(m.under=='u_light'){m.light=m.light||'u_light';delete m.under}}pg.lightMig=1}
{const _du=drawUnder;drawUnder=function(m,x,y){_du(m,x,y);const p=m.light;if(!p)return;const lx=x-6,ly=y-7;R('#1e2124',lx,ly,9,4);R(p=='l_strobe'?'#7ec8f0':'#ffd36a',lx-1,ly,1,4);g.globalAlpha=.16;R(p=='l_strobe'?'#bfe8ff':'#ffe8a0',lx-22,ly-3,21,10);g.globalAlpha=1}}
const FXN2={night:['밤 사거리','×10%'],beam:['조명 거리',''],strobe:['빛 안 좀비 느려짐','']};if(typeof FXN!='undefined')for(const k in FXN2)if(!FXN[k])FXN[k]=FXN2[k];
/* ---------- how dark is it ---------- */
const DARK={night:.8,dun:.6,mine:.85,aura:56,nvg:.1};
function darkLv(){if(!S)return 0;let d=0;if(NIGHT){const t=S.t;d=t>=1500?Math.min(1,(t-1500)/60):t<100?Math.min(1,(100-t)/60):0;d*=DARK.night}
 if(typeof DUN!='undefined'&&DUN)d=Math.max(d,DUN.sh=='mine'?DARK.mine:DARK.dun);return d}
/* the lights you carry: [range, half-angle, angle] */
function myBeams(){const p=S.p,B=[],a=Math.atan2(p.fy||1,p.fx||0);if(S.dr)return B;const sp=p.eq&&p.eq.spec;
 if(sp=='flashl'&&has(p,sp))B.push({r:300,h:.3,a,k:'flashl'});if(sp=='headlamp'&&has(p,sp))B.push({r:230,h:.52,a,k:'headlamp'});
 const id=actW(p),m=id&&GCLASS[id]&&S.pg&&S.pg.mods&&S.pg.mods[id],lp=m&&m.light&&P_BY[m.light];if(lp)B.push({r:lp[5].beam||260,h:.32,a,k:m.light,strobe:lp[5].strobe});return B}
const nvgOn=()=>{const p=S&&S.p;return!!(p&&p.eq&&p.eq.spec=='nvg'&&has(p,'nvg'))};
const lightOn=()=>darkLv()>.2&&myBeams().length>0;
{const _dm=detMul;detMul=function(){const m=_dm();return lightOn()?m*1.3:m}}
/* strobe: zombies caught in the beam stumble */
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!S||!run)return;lightMigrate();if(darkLv()<.2)return;const p=S.p;for(const b of myBeams()){if(!b.strobe)continue;for(const z of Z){if(z.npc||z.raider)continue;const dx=z.x-p.x,dy=z.y-p.y,d=Math.hypot(dx,dy);if(d>b.r)continue;let da=Math.atan2(dy,dx)-b.a;da=Math.atan2(Math.sin(da),Math.cos(da));if(Math.abs(da)<b.h){z.sm0=z.sm0||z.sm||1;z.strT=.3}}}
  for(const z of Z){if(z.strT>0){z.strT-=dt;z.sm=(z.sm0||1)*.75;if(z.strT<=0){z.sm=z.sm0||1;delete z.sm0}}}}}
/* ---------- the dark layer, drawn over the finished frame with holes cut for every light ---------- */
const DKC=document.createElement('canvas'),DKX=DKC.getContext('2d');
{const _dr=draw;draw=function(){_dr();if(!S||!run)return;let d=darkLv();const nv=nvgOn();if(d<=0)return;if(nv)d*=DARK.nvg;
  const W2=cv.width,H2=cv.height,k=zoom*dpr,p=S.p,SX=x=>(x-camX)*k,SY=y=>(y-camY)*k;if(DKC.width!=W2||DKC.height!=H2){DKC.width=W2;DKC.height=H2}
  const x=DKX;x.globalCompositeOperation='source-over';x.clearRect(0,0,W2,H2);x.fillStyle='rgba(3,5,12,'+d+')';x.fillRect(0,0,W2,H2);x.globalCompositeOperation='destination-out';
  const hole=(wx,wy,r,a)=>{const X=SX(wx),Y=SY(wy),R2=r*k;if(X<-R2||Y<-R2||X>W2+R2||Y>H2+R2)return;const gr=x.createRadialGradient(X,Y,0,X,Y,R2);gr.addColorStop(0,'rgba(0,0,0,'+a+')');gr.addColorStop(.6,'rgba(0,0,0,'+a*.6+')');gr.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=gr;x.fillRect(X-R2,Y-R2,R2*2,R2*2)};
  hole(p.x,p.y-12,DARK.aura,.9);
  for(const[lx,ly,r,a]of W0.lights)hole(lx,ly,r*.8,Math.min(1,a*1.8));
  for(const f of S.fires||[])hole(f.x,f.y,f.r*2.2,.9);for(const l of S.flares||[])hole(l.x,l.y,200,.95);for(const f of fx)if(f.k=='boom'||f.k=='fl')hole(f.x,f.y,f.k=='boom'?170:60,.9);
  for(const o of BP)if(o.t=='campfire')hole(o.x+15,o.y,110,.9);if(S.base.pow&&typeof BL!='undefined')hole(BL.ox+448,BL.oy+360,380,.8);
  if(typeof S.car=='object'&&S.dr&&S.car)hole(S.car.x+(S.car.w||60)/2,S.car.y,240,.85);
  for(const b of myBeams()){const X=SX(p.x),Y=SY(p.y-14),R2=b.r*k,gr=x.createRadialGradient(X,Y,0,X,Y,R2);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(.75,'rgba(0,0,0,.85)');gr.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=gr;x.beginPath();x.moveTo(X,Y);x.arc(X,Y,R2,b.a-b.h,b.a+b.h);x.closePath();x.fill()}
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(DKC,0,0);
  /* warm beam colour on top, and a mild green for night vision */
  if(!nv){ctx.globalCompositeOperation='lighter';for(const b of myBeams()){const X=SX(p.x),Y=SY(p.y-14),R2=b.r*k,gr=ctx.createRadialGradient(X,Y,0,X,Y,R2);const c=b.strobe&&(performance.now()/90|0)%2?'190,230,255':'255,236,190';gr.addColorStop(0,'rgba('+c+',.22)');gr.addColorStop(1,'rgba('+c+',0)');ctx.fillStyle=gr;ctx.beginPath();ctx.moveTo(X,Y);ctx.arc(X,Y,R2,b.a-b.h,b.a+b.h);ctx.closePath();ctx.fill()}}
  else{ctx.globalCompositeOperation='screen';ctx.fillStyle='rgba(30,90,40,.28)';ctx.fillRect(0,0,W2,H2);ctx.globalCompositeOperation='multiply';ctx.fillStyle='rgba(205,240,205,1)';ctx.fillRect(0,0,W2,H2)}
  ctx.restore()}}
