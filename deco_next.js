/* PROJECT LEGACY — decorating the base.
   At the base tent: [상호작용] → 🪴 거점 꾸미기. Make a decoration with materials, walk to the spot, [설치].
   Stand next to one: 옮기기 (free) · 치우기 (half the materials back).
   Every piece adds comfort. Comfort makes the base feel like home:
     5  → you and companions heal in the base (+0.5 / s)
     12 → survivors share a little food and water each morning
     20 → requests pay 20 % more · companions at the base gain experience each day
   Some pieces also do something: the vegetable patch grows food, the rain barrel fills water, the fire and the lights glow at night.
   Loaded after req_next.js. */
'use strict';
const DECO={
 plant:['🪴','화분',{wood:2,cloth:1},1,16,16,false,'초록이 있으면 마음이 놓여요'],
 flower:['🌼','꽃밭',{wood:3,cloth:2},2,34,18,false,'알록달록한 꽃밭'],
 rug:['🟥','러그',{cloth:6},1,40,26,false,'바닥에 까는 큰 러그'],
 bench:['🪑','벤치',{wood:6,scrap:2},2,40,14,true,'앉아서 쉬는 곳'],
 table:['🍽','식탁',{wood:10,scrap:2},3,44,30,true,'다 같이 밥 먹는 식탁'],
 fire:['🔥','모닥불',{wood:6,scrap:2},3,24,22,true,'밤에 따뜻하게 빛나요'],
 lights:['💡','줄전구',{elec:3,scrap:3},3,60,10,false,'밤에 반짝이는 줄전구'],
 flag:['🚩','깃발',{wood:3,cloth:4},2,14,40,true,'우리 거점의 깃발'],
 dog:['🐕','개집',{wood:8,scrap:2},2,26,24,true,'떠돌이 개가 지내요'],
 line:['👕','빨랫줄',{wood:2,cloth:3},1,50,12,false,'빨래가 바람에 흔들려요'],
 garden:['🥬','텃밭',{wood:6,cloth:2},2,44,28,false,'매일 아침 통조림 1개 (채소)'],
 barrel:['🛢','빗물 통',{scrap:6,wood:2},1,18,20,true,'매일 아침 물병 1개']};
const DLIST=Object.keys(DECO);Object.assign(FLAT,{deco_rug:1,deco_flower:1,deco_garden:1});
const DTIER=[[5,'🛋 아늑함','거점에서 나와 동료 체력 회복 +0.5/초'],[12,'🏡 내 집 같음','매일 아침 생존자들이 음식 · 물을 나눠요'],[20,'🎉 활기참','의뢰 보상 +20% · 거점 동료 매일 경험치']];
const DSTORE=()=>{S.base.deco=S.base.deco||[];return S.base.deco};
const comfort=()=>DSTORE().reduce((a,d)=>a+(DECO[d.t]?DECO[d.t][3]:0),0);
const dTier=()=>{const c=comfort();let n=0;for(const[t]of DTIER)if(c>=t)n++;return n};
/* ---------- in the world ---------- */
{const _bw=buildWorld;buildWorld=function(){const w=_bw.apply(this,arguments);try{if(!(typeof DUN!='undefined'&&DUN)&&S&&S.base&&W0.base){const B=W0.base;for(const d of S.base.deco||[]){const D=DECO[d.t];if(!D)continue;
  W0.objs.push({t:'deco_'+d.t,x:B.ox+d.rx-D[4]/2,y:B.oy+d.ry-D[5]/2,w:D[4],h:D[5],did:d.id});
  if(d.t=='fire')W0.lights.push([B.ox+d.rx,B.oy+d.ry,150,.9,'#ffb060']);if(d.t=='lights')W0.lights.push([B.ox+d.rx,B.oy+d.ry,110,.7,'#ffe0a0'])}}}catch(e){}return w}}
const dArt={
 plant:(x,y)=>{R('#5a3a24',x+3,y+9,10,7);R('#7a5034',x+3,y+9,10,2);R('#2f7a3a',x+2,y+1,12,9);R('#4aa04e',x+4,y,8,5);R('#6ac06a',x+5,y+1,3,2)},
 flower:(x,y,w,h)=>{R('#5a3a24',x,y+4,w,h-4);R('#6a4a2a',x+1,y+5,w-2,h-6);const c=['#ff6a8a','#ffd36a','#9ad0ff','#ffffff','#ff9a3a'];for(let i=0;i<9;i++){const px=x+3+(i*11)%(w-6),py=y+6+(i*7)%(h-10);R('#3a8a3a',px,py+2,1,3);R(c[i%5],px-1,py,3,3)}},
 rug:(x,y,w,h)=>{R('#7a2a2a',x,y,w,h);R('#a83a3a',x+2,y+2,w-4,h-4);R('#d9a52a',x+5,y+5,w-10,h-10);R('#a83a3a',x+7,y+7,w-14,h-14);for(let i=x+1;i<x+w;i+=4){R('#e8d7a8',i,y-2,1,2);R('#e8d7a8',i,y+h,1,2)}},
 bench:(x,y,w,h)=>{R('#3a2818',x+2,y+8,3,6);R('#3a2818',x+w-5,y+8,3,6);R('#7a5034',x,y,w,4);R('#9a6a44',x,y,w,1);R('#7a5034',x,y+5,w,4);R('#5a3a24',x,y+8,w,1)},
 table:(x,y,w,h)=>{for(const[a,b]of[[4,-4],[w-12,-4],[4,h-3],[w-12,h-3]]){R('#5a3a24',x+a,y+b,8,7);R('#7a5034',x+a,y+b,8,2)}R('#5a3a24',x+2,y+4,w-4,h-8);R('#8a5a3a',x+3,y+5,w-6,h-10);R('#a8744a',x+3,y+5,w-6,2);R('#e8e2d6',x+10,y+10,7,5);R('#e8e2d6',x+w-17,y+12,7,5);R('#c84a3a',x+w/2-2|0,y+9,4,4)},
 fire:(x,y,w,h)=>{const t=performance.now()/120;for(let i=0;i<8;i++){const a=i/8*6.28;R('#6a6a6a',x+w/2+Math.cos(a)*9-2|0,y+h/2+Math.sin(a)*7-2|0,4,4)}R('#3a2818',x+w/2-7|0,y+h/2-1|0,14,3);const f=Math.sin(t)*2|0,f2=Math.cos(t*1.3)*2|0;R('#ff6a1a',x+w/2-4|0,y+h/2-8+f2|0,8,8);R('#ffb030',x+w/2-3|0,y+h/2-11+f|0,6,8);R('#ffe9a0',x+w/2-1|0,y+h/2-9+f2|0,3,5)},
 lights:(x,y,w,h)=>{R('#3a2818',x,y-10,2,h+10);R('#3a2818',x+w-2,y-10,2,h+10);const on=typeof NIGHT!='undefined'&&NIGHT,t=performance.now()/400;for(let i=0;i<=10;i++){const px=x+1+i*(w-2)/10,py=y-8+Math.sin(i/10*Math.PI)*7;R('#2a2a2a',px|0,py|0,1,1);const c=['#ffd36a','#ff6a8a','#9ad0ff','#7fd07f'][i%4];R(on&&((i+(t|0))%3)?c:'#6a6a5a',px-1|0,py+1|0,3,3)}},
 flag:(x,y,w,h)=>{const t=performance.now()/300;R('#3a3a3a',x+2,y,2,h);R('#2a2a2a',x,y+h-3,6,3);const s=Math.sin(t)*1.5|0;R('#c8302a',x+4,y+2+s,10,8);R('#e8ecf0',x+6,y+4+s,6,4);R('#c8302a',x+8,y+5+s,2,2)},
 dog:(x,y,w,h)=>{R('#6a3a24',x,y+6,w,h-6);R('#8a5034',x+1,y+7,w-2,h-8);R('#a83a3a',x-2,y,w+4,7);R('#c84a3a',x-2,y,w+4,2);R('#1d1714',x+w/2-4|0,y+12,8,10);R('#c9a06a',x+w+2,y+h-8,8,6);R('#a8804a',x+w+8,y+h-10,4,4);R('#1d1714',x+w+10,y+h-9,1,1)},
 line:(x,y,w,h)=>{const t=performance.now()/500;R('#5a3a24',x,y-12,2,h+12);R('#5a3a24',x+w-2,y-12,2,h+12);R('#d9d0b8',x+2,y-10,w-4,1);for(const[a,c]of[[8,'#5a8ec5'],[20,'#e8e2d6'],[32,'#c84a3a'],[42,'#7fd07f']]){const s=Math.sin(t+a)*1|0;R(c,x+a+s,y-9,7,9)}},
 garden:(x,y,w,h)=>{R('#4a3020',x,y,w,h);R('#3a2414',x+1,y+1,w-2,h-2);for(let r=0;r<3;r++){R('#5a3a24',x+2,y+3+r*9,w-4,4);for(let i=0;i<5;i++){R('#3a8a3a',x+5+i*8,y+1+r*9,5,4);R('#6ac06a',x+6+i*8,y+1+r*9,2,2)}}},
 barrel:(x,y,w,h)=>{R('#2a4a6a',x,y,w,h);R('#3a6a8a',x+1,y+1,w-2,h-2);R('#1d2a3a',x,y+5,w,2);R('#1d2a3a',x,y+h-6,w,2);R('#6aa0c8',x+2,y+1,w-4,3);R('#9ad0ff',x+3,y+1,4,1)}};
for(const k of DLIST){const D=DECO[k];P('deco_'+k,D[1],null,o=>dArt[k](o.x,o.y,o.w,o.h),D[6])}
/* ---------- placing ---------- */
let DPL=null;/* {t, move:id} */
function dSpot(){const p=S.p,f=Math.hypot(p.fx||0,p.fy||0)||1;return[p.x+(p.fx||0)/f*46,p.y+(p.fy||1)/f*46]}
function dOk(){if(!DPL)return'';const[x,y]=dSpot(),D=DECO[DPL.t];if(!(typeof inBase=='function'&&inBase(x,y)))return'거점 안에만 놓을 수 있어요';if(D[6]&&blocker(x,y,Math.min(D[4],D[5])/2))return'여기는 막혀 있어요';
 for(const o of W0.objs)if(o.did!=null&&o.did!==DPL.move&&Math.abs(o.x+o.w/2-x)<(o.w+D[4])/2&&Math.abs(o.y+o.h/2-y)<(o.h+D[5])/2)return'다른 장식과 겹쳐요';
 if(!DPL.move&&!dHave(D[2]))return'재료가 부족해요';return''}
function dHave(c){const p=S.p;return Object.entries(c).every(([k,v])=>((p.inv[k]|0)+((S.base.st||{})[k]|0))>=v)}
function dPay(c,back){const p=S.p;if(back){for(const k in c){const n=Math.floor(c[k]/2);if(n)invAdd(p,k,n)}return}for(const k in c){const a=Math.min(p.inv[k]|0,c[k]);if(a)invTake(p,k,a);if(c[k]-a)S.base.st[k]-=c[k]-a}}
function dStart(t,move){DPL={t,move:move||null};closeBase();PAUSE=false;msg('🪴 '+DECO[t][1]+(move?' 옮기기':' 놓기')+' · 원하는 곳으로 걸어가서 [설치] · 바라보는 쪽 앞에 놓여요')}
function dDo(){const bad=dOk();if(bad)return msg('🪴 '+bad);const[x,y]=dSpot(),B=W0.base,D=DECO[DPL.t];if(DPL.move){const d=DSTORE().find(q=>q.id==DPL.move);if(d){d.rx=Math.round(x-B.ox);d.ry=Math.round(y-B.oy)}}
 else{dPay(D[2]);S.base.decoN=(S.base.decoN||0)+1;DSTORE().push({t:DPL.t,rx:Math.round(x-B.ox),ry:Math.round(y-B.oy),id:S.base.decoN})}
 const t0=dTier();DPL=null;infRebuild();const t1=dTier();msg('🪴 '+D[1]+' 설치 · 아늑함 '+comfort()+(t1>t0?' · '+DTIER[t1-1][1]+'! '+DTIER[t1-1][2]:''))}
function dRemove(o){const i=DSTORE().findIndex(q=>q.id==o.did);if(i<0)return;const d=DSTORE().splice(i,1)[0];dPay(DECO[d.t][2],true);infRebuild();msg('🪴 '+DECO[d.t][1]+' 치움 · 재료 절반 돌려받음 · 아늑함 '+comfort())}
/* the ghost where it will go (sharp overlay) */
if(typeof OVL!='undefined')OVL.push((g,sx,sy,k)=>{if(!DPL||!S||!S.p)return;const[x,y]=dSpot(),D=DECO[DPL.t],bad=dOk();g.save();g.fillStyle=bad?'#ff6a5a33':'#7fd07f33';g.strokeStyle=bad?'#ff6a5acc':'#7fd07fcc';g.lineWidth=2;g.setLineDash([5,4]);
 g.fillRect(sx(x-D[4]/2),sy(y-D[5]/2),D[4]*k,D[5]*k);g.strokeRect(sx(x-D[4]/2),sy(y-D[5]/2),D[4]*k,D[5]*k);g.setLineDash([]);g.font='600 13px system-ui,sans-serif';g.textAlign='center';g.lineWidth=3;g.strokeStyle='#000a';const tx=D[0]+' '+(bad||D[1]+' 여기에');g.strokeText(tx,sx(x),sy(y-D[5]/2)-8);g.fillStyle='#fff';g.fillText(tx,sx(x),sy(y-D[5]/2)-8);g.restore()});
/* ---------- [상호작용] ---------- */
{const _c=dmCtx;dmCtx=function(){if(DPL){const bad=dOk(),D=DECO[DPL.t];return[{t:'✅ '+D[1]+' 설치'+(bad?' · '+bad:''),f:dDo,off:!!bad,big:1},{t:'✖ 취소',f:()=>{DPL=null;msg('🪴 취소')},sm:1}]}
 const B=_c();try{if(!S||!run||S.dr||typeof DUN!='undefined'&&DUN||!S.base||typeof inBase!='function'||!inBase(S.p.x,S.p.y))return B;const p=S.p;
  let o=null,bd=40;for(const q of W0.objs)if(q.did!=null){const d=Math.hypot(Math.max(q.x-p.x,0,p.x-q.x-q.w),Math.max(q.y-p.y,0,p.y-q.y-q.h));if(d<bd){bd=d;o=q}}
  if(o){const t=o.t.slice(5),D=DECO[t];B.push({t:'↔ '+D[1]+' 옮기기',f:()=>dStart(t,o.did),sm:1},{t:'🗑 '+D[1]+' 치우기 (재료 절반)',f:()=>dRemove(o),sm:1})}
  if(typeof rqNear=='function'&&rqNear())B.push({t:'🪴 거점 꾸미기 · 아늑함 '+comfort(),f:dOpen})}catch(e){}return B}}
if(typeof IAW!='undefined')IAW.unshift([/설치$|설치 ·/,'설치'],[/거점 꾸미기/,'꾸미기'],[/ 옮기기$/,'옮기기'],[/치우기/,'치우기']);
/* ---------- the sheet ---------- */
function dOpen(){const b=$('bm'),c=comfort(),n=dTier();b.dataset.m='deco';PAUSE=true;const cnt={};for(const d of DSTORE())cnt[d.t]=(cnt[d.t]|0)+1;
 const nx=DTIER[n],bar=nx?Math.min(1,c/nx[0]):1;
 b.innerHTML='<div class="sh"><h2>🪴 거점 꾸미기</h2><div class="wt">아늑함 <b>'+c+'</b>'+(nx?' · 다음 단계까지 '+(nx[0]-c):' · 최고 단계')+'</div><button onclick="closeBase();PAUSE=false">✕</button></div>'+
  '<div class="dqB"><i style="width:'+bar*100+'%"></i></div><div class="dqT">'+DTIER.map(([t,nm,ds],i)=>'<div class="'+(i<n?'on':'')+'"><b>'+nm+'</b> <small>아늑함 '+t+' · '+ds+'</small></div>').join('')+'</div>'+
  '<div class="dqG">'+DLIST.map(k=>{const D=DECO[k],ok=dHave(D[2]);return'<div class="dqI"><canvas data-dp="'+k+'" width="'+(D[4]+12)*2+'" height="'+(D[5]+16)*2+'"></canvas><b>'+D[1]+(cnt[k]?' <small>×'+cnt[k]+'</small>':'')+'</b><small>'+D[7]+'</small><small class="c">아늑함 +'+D[3]+' · '+Object.entries(D[2]).map(([i,v])=>NM2(i)+' '+v).join(' · ')+'</small><button data-dk="'+k+'" class="'+(ok?'':'no')+'">만들어 놓기</button></div>'}).join('')+'</div>'+
  '<div class="sub" style="line-height:1.6;margin-top:6px">· 재료는 가방과 창고에서 같이 써요 · 놓은 장식 옆에서 [상호작용]으로 옮기기 · 치우기 (재료 절반)<br>· 텃밭은 매일 아침 통조림 1개, 빗물 통은 물병 1개 · 모닥불과 줄전구는 밤에 빛나요</div>';
 b.style.display='block';
 b.querySelectorAll('canvas[data-dp]').forEach(cv=>{const k=cv.dataset.dp,D=DECO[k],x=cv.getContext('2d'),o=g;g=x;x.imageSmoothingEnabled=false;x.scale(2,2);try{dArt[k](6,12,D[4],D[5])}catch(e){}g=o});
 b.querySelectorAll('[data-dk]').forEach(x=>x.onclick=()=>{const k=x.dataset.dk;if(!dHave(DECO[k][2]))return msg('재료가 부족해요 · '+Object.entries(DECO[k][2]).map(([i,v])=>NM2(i)+' '+v).join(' · '));dStart(k)})}
/* ---------- what comfort does ---------- */
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!S||!S.base||!run||PAUSE||typeof DUN!='undefined'&&DUN)return;const n=dTier();
  if(n>=1&&typeof inBase=='function'){const p=S.p;if(inBase(p.x,p.y)&&p.hp>0)p.hp=Math.min(MHP(p),p.hp+.5*dt);if(typeof ALLY=='function')for(const a of ALLY()){const z=aEnt(a);if(z&&a.hp>0&&inBase(z.x,z.y))a.hp=Math.min(aMhp(a),a.hp+.5*dt)}}
  if(S.base.decoDay==null)S.base.decoDay=S.day;if(S.day>S.base.decoDay){S.base.decoDay=S.day;const st=S.base.st,got={};const add=(k,v)=>{st[k]=(st[k]|0)+v;got[k]=(got[k]|0)+v};
   for(const d of DSTORE()){if(d.t=='garden')add('food',1);if(d.t=='barrel')add('water',1)}
   if(n>=2){add('food',1);add('water',1)}
   if(n>=3&&typeof ALLY=='function')for(const a of ALLY())if(a.st=='base'||a.st=='job'&&a.job!='scav')a.xp=(a.xp|0)+15;
   const t=Object.entries(got).map(([k,v])=>NM2(k)+' '+v).join(' · ');if(t)setTimeout(()=>msg('🏡 아침 · 거점 창고에 '+t+(n>=3?' · 거점 동료 경험치 +15':'')),1500)}}}
/* requests pay more when the base is lively */
if(typeof rqReward=='function'){const _r=rqReward;rqReward=function(lv){const R0=_r(lv);try{if(S&&S.base&&dTier()>=3)for(const k in R0)R0[k]=Math.ceil(R0[k]*1.2)}catch(e){}return R0}}
document.head.insertAdjacentHTML('beforeend',`<style>
#bm .dqB{height:8px;border-radius:4px;background:#ffffff1a;overflow:hidden;margin:4px 0 8px}#bm .dqB i{display:block;height:100%;background:linear-gradient(90deg,#7fd07f,#ffd36a)}
#bm .dqT{display:flex;flex-direction:column;gap:3px;margin-bottom:8px}#bm .dqT div{font-size:12px;color:var(--mut);opacity:.7}#bm .dqT div.on{color:#bff0bf;opacity:1}#bm .dqT small{font-size:11px}
#bm .dqG{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px}#bm .dqI{display:flex;flex-direction:column;gap:3px;align-items:center;text-align:center;border:1px solid #ffffff1a;border-radius:12px;padding:8px;background:#ffffff08}
#bm .dqI canvas{image-rendering:pixelated;max-width:100%;height:auto;max-height:84px}#bm .dqI b{font-size:13px}#bm .dqI small{font-size:11px;color:var(--mut);line-height:1.35}#bm .dqI small.c{color:#cfe0a0}#bm .dqI button{margin-top:auto;padding:5px 10px;font-size:12px}#bm .dqI button.no{opacity:.45}</style>`);
