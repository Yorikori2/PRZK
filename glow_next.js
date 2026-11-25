/* PROJECT LEGACY — sample: high enhancement shows on the character.
   Weapon (the one in hand):  +7 반짝임 → +10 황금빛 → +13 불꽃 입자 → 최대 강화 무지개 빛 + 휘두른 자국
   Armour (4 worn pieces, average): +7 푸른 일렁임 → +10 수정 조각이 몸을 돌아요 → 4부위 모두 최대 강화 황금 후광 + 빛 기둥
   Item icons in the bag and the weapon card glow too. Loaded after armenh_next.js. */
'use strict';
function wTier(){const p=S.p,id=actW(p);if(!W_BY[id])return 0;const lv=enhLv(id),mx=ENH.max;return lv>=mx&&lv>=10?4:lv>=13?3:lv>=10?2:lv>=7?1:0}
function aTier(){const p=S.p,L=APARTS.map(([k])=>p.eq&&p.eq[k]).filter(id=>id&&ARMX[id]&&has(p,id));if(!L.length)return 0;const lv=L.map(aLv),avg=lv.reduce((a,b)=>a+b,0)/4,mx=ENH.max;
 return L.length==4&&mx>=10&&lv.every(v=>v>=mx)?3:avg>=10?2:avg>=7?1:0}
const GLP=[];let GLT=0;
function glowFx(x,y,sc){const p=S.p,t=performance.now()/1000,dt=Math.min(.05,t-(GLT||t));GLT=t;const wt=wTier(),at=aTier(),c=g;if(!wt&&!at&&!GLP.length)return;c.save();c.globalCompositeOperation='lighter';
 const rad=(X,Y,r,col,a)=>{const gr=c.createRadialGradient(X,Y,0,X,Y,r);gr.addColorStop(0,'rgba('+col+','+a+')');gr.addColorStop(1,'rgba('+col+',0)');c.fillStyle=gr;c.fillRect(X-r,Y-r,r*2,r*2)};
 const hue=h=>{const k=n=>(n+h/30)%12,f=n=>Math.round(255*(.5-.5*Math.max(-1,Math.min(k(n)-3,9-k(n),1))));return f(0)+','+f(8)+','+f(4)};
 /* armour */
 if(at>=1)rad(x,y-18,30,at>=3?'255,210,90':at>=2?'190,140,255':'120,200,255',.14+.06*Math.sin(t*3));
 if(at>=2)for(let i=0;i<5;i++){const a=t*1.8+i*Math.PI*2/5,ox=Math.cos(a)*17,oy=Math.sin(a)*6,front=Math.sin(a)>0;c.globalAlpha=front?1:.45;const X=Math.round(x+ox),Y=Math.round(y-14+oy-Math.sin(t*2+i)*2);
  c.fillStyle=at>=3?'#ffe08a':'#c08af0';c.fillRect(X-1,Y-2,2,4);c.fillRect(X-2,Y-1,4,2);c.fillStyle='#ffffff';c.fillRect(X,Y,1,1);c.globalAlpha=1}
 if(at>=3){c.strokeStyle='rgba(255,220,120,'+(.7+.3*Math.sin(t*4))+')';c.lineWidth=1.5;c.beginPath();c.ellipse(x,y-43,7,2.5,0,0,Math.PI*2);c.stroke();rad(x,y-2,22,'255,210,90',.25);
  const gr=c.createLinearGradient(0,y-60,0,y);gr.addColorStop(0,'rgba(255,220,120,0)');gr.addColorStop(1,'rgba(255,220,120,.18)');c.fillStyle=gr;c.fillRect(x-9,y-60,18,60);if(Math.random()<.35)GLP.push({x:x+(Math.random()-.5)*20,y:y-2,vx:0,vy:-25-Math.random()*20,t:1,c:'255,230,150',s:1})}
 /* weapon */
 const hx=x+(p.fx||0)*11,hy=y-17+(p.fy||0)*5;
 if(wt>=1&&Math.random()<(wt>=2?.25:.12))GLP.push({x:hx+(Math.random()-.5)*10,y:hy+(Math.random()-.5)*8,vx:0,vy:-6,t:.5,c:wt>=4?hue(t*60+Math.random()*60):'230,245,255',star:1});
 if(wt>=2)rad(hx,hy,wt>=4?24:15,wt>=4?hue(t*60):wt>=3?'255,140,60':'255,210,90',.32+.1*Math.sin(t*5));
 if(wt>=3&&Math.random()<.6)GLP.push({x:hx+(Math.random()-.5)*6,y:hy,vx:(Math.random()-.5)*12,vy:-30-Math.random()*25,t:.9,c:wt>=4?hue(t*60+Math.random()*90):'255,'+(120+Math.random()*80|0)+',40',s:Math.random()<.3?2:1});
 if(wt>=4&&p.ac>0){c.strokeStyle='rgba('+hue(t*90)+',.8)';c.lineWidth=2;const a0=Math.atan2(p.fy||0,p.fx||1);c.beginPath();c.arc(x,y-14,20,a0-.9,a0+.9);c.stroke()}
 /* particles */
 for(let i=GLP.length-1;i>=0;i--){const q=GLP[i];q.t-=dt;q.x+=q.vx*dt;q.y+=q.vy*dt;if(q.t<=0){GLP.splice(i,1);continue}c.fillStyle='rgba('+q.c+','+Math.min(1,q.t*1.6)+')';const X=Math.round(q.x),Y=Math.round(q.y);
  if(q.star){c.fillRect(X-2,Y,5,1);c.fillRect(X,Y-2,1,5)}else c.fillRect(X,Y,q.s||1,q.s||1)}
 if(GLP.length>160)GLP.splice(0,GLP.length-160);c.restore()}
{const _dc=drawChar;drawChar=function(look,x,y,dir,fr,wpn,scale){const r=_dc.apply(this,arguments);if(look=='player'&&S&&S.p&&run&&!S.dr)try{glowFx(x,y,scale||1)}catch(e){}return r}}
/* icons glow in the bag and on the weapon card */
const iTier=id=>{const lv=W_BY[id]?enhLv(id):ARMX[id]?aLv(id):0;return lv>=ENH.max&&lv>=10?4:lv>=13?3:lv>=10?2:lv>=7?1:0};
{const _ob=openBag;openBag=function(id){_ob(id);if(!S)return;document.querySelectorAll('#bm [data-i],#bm .eq [data-s]').forEach(e=>{const k=e.dataset.i||e.dataset.s;if(!k)return;const tr=iTier(k);if(tr)e.classList.add('gw'+tr)})}}
{const _wc=wcard;wcard=function(){_wc();const tr=iTier(actW(S.p)),i=$('wc').querySelector('.wi');if(i&&tr)i.classList.add('gw'+tr)}}
document.head.insertAdjacentHTML('beforeend',`<style>@keyframes gwP{0%,100%{box-shadow:0 0 4px 1px var(--gc)}50%{box-shadow:0 0 12px 3px var(--gc)}}@keyframes gwH{0%{--gc:#ff5a5a}25%{--gc:#ffd36a}50%{--gc:#7fd07f}75%{--gc:#5aa8ff}100%{--gc:#ff5a5a}}
.gw1{--gc:#bfe4ff88;animation:gwP 2.4s infinite}.gw2{--gc:#ffd36acc;animation:gwP 1.8s infinite}.gw3{--gc:#ff8a3aee;animation:gwP 1.1s infinite}.gw4{--gc:#ff5a5a;animation:gwP 1s infinite,gwH 3s linear infinite;filter:saturate(1.3)}
@property --gc{syntax:'<color>';inherits:false;initial-value:#fff}#wc .wi.gw1,#wc .wi.gw2,#wc .wi.gw3,#wc .wi.gw4{border-radius:10px}</style>`);
