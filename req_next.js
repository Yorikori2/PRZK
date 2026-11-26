/* PROJECT LEGACY — survivor requests.
   Survivors at the base (and your companions) ask for help. Board at the base tent: [상호작용] → 📋 생존자 의뢰.
   Three offers a day · up to two at once · a deadline in days.
   Kinds: bring supplies · clear a block · search a kind of building · find a lost bag · hunt special zombies.
   Rewards: vouchers · materials · ammo · strengthening stones. Trust: every 3 finished → a new survivor joins as a companion.
   Loaded after car_next.js. */
'use strict';
const RQ_NAMES=['김 할머니','박 씨 아저씨','간호사 미선','꼬마 준이','목사님','정비공 철수','대학생 하린','요리사 덕배','경비원 강 씨','선생님 은주'];
const RQ_FETCH=[['food',3,'통조림','배고픈 아이들이 있어요'],['water',4,'물병','물이 다 떨어졌어요'],['bandage',4,'붕대','다친 사람이 많아요'],['medkit',1,'구급상자','열이 안 내려요'],['pills',2,'항생제','상처가 곪았어요'],
 ['cloth',6,'천','추워서 담요를 만들려고요'],['wood',8,'목재','지붕이 새요'],['scrap',10,'고철','울타리를 고치려고요'],['elec',3,'전자부품','라디오를 고치고 싶어요'],['fuel',2,'연료통','발전기를 돌려야 해요']];
const RQ_BLD=[['houses','주택'],['apt','아파트'],['mart','편의점'],['pharm','약국'],['clinic','의원'],['hosp','병원'],['police','경찰서'],['school','학교'],['garage','정비소'],['ware','창고']];
const RQ_HUNT=[['runner','러너'],['screamer','비명꾼'],['heavy','헤비']];
const RQ_K={fetch:['📦','물자 가져오기'],clear:['🧟','구역 정리'],search:['🔎','건물 수색'],bag:['🎒','잃어버린 가방'],hunt:['🎯','특수 좀비 사냥']};
const RQS=()=>{const s=S.inf.rq=S.inf.rq||{offers:[],act:[],done:0,trust:0,day:-1,n:0};return s};
const rqZone=()=>{try{return Math.max(0,zoneOf(...gOf(S.p.x,S.p.y)))}catch(e){return 0}};
function rqPickBlock(dmin,dmax){const[hx,hy]=[0,0];for(let i=0;i<40;i++){const a=Math.random()*6.28,d=dmin+Math.random()*(dmax-dmin),gx=Math.round(hx+Math.cos(a)*d),gy=Math.round(hy+Math.sin(a)*d);const k=kindAt(gx,gy);if(!['base','lot','rbase'].includes(k))return[gx,gy,k]}return[dmin,0,'houses']}
function rqReward(lv){const R={tkn:4+lv*3};const pool=[['scrap',8],['elec',2],['steel',2],['a9mm',30],['a556',30],['a12g',12],['medkit',1],['enh1',2],['enh2',1]].filter(([k])=>I_BY[k]);for(let i=0;i<1+(lv>=2);i++){const[k,n]=pool[Math.random()*pool.length|0];R[k]=(R[k]|0)+Math.round(n*(1+lv*.4))}return R}
function rqMake(kk){const s=RQS(),zn=Math.min(6,(S.inf.maxZ|0)||rqZone()),lv=Math.min(3,1+Math.floor(zn/2)),who=RQ_NAMES[Math.random()*RQ_NAMES.length|0],k=kk||['fetch','clear','search','bag','hunt'][Math.random()*5|0],q={id:++s.n,k,who,lv,days:2+(k=='fetch'?1:0),rw:rqReward(lv),have:0};
 if(k=='fetch'){const f=RQ_FETCH[Math.random()*RQ_FETCH.length|0];q.item=f[0];q.need=Math.ceil(f[1]*(1+.3*(lv-1)));q.why=f[3];q.t=NM2(f[0])+' '+q.need+'개 가져다주기'}
 if(k=='clear'){const[gx,gy]=rqPickBlock(2,3+lv*2);q.gx=gx;q.gy=gy;q.need=8+lv*4;q.why='그 동네에 가족 집이 있어요';q.t='블록 ('+gx+', '+gy+') 좀비 '+q.need+'마리 처치'}
 if(k=='search'){const b=RQ_BLD[Math.random()*RQ_BLD.length|0];q.bk=b[0];q.need=4+lv*2;q.why='거기에 두고 온 게 있어요';q.t=b[1]+' 수색 '+q.need+'곳'}
 if(k=='bag'){const[gx,gy]=rqPickBlock(2,2+lv*2);q.gx=gx;q.gy=gy;q.need=1;q.why='도망치다 가방을 떨어뜨렸어요 · 사진이 들어 있어요';q.t='블록 ('+gx+', '+gy+')에서 가방 찾아오기';q.rx=200+Math.random()*400|0;q.ry=200+Math.random()*400|0}
 if(k=='hunt'){const h=RQ_HUNT[Math.min(RQ_HUNT.length-1,Math.random()*Math.min(3,lv+1)|0)];q.look=h[0];q.need=2+lv;q.why=h[1]+'한테 쫓기는 꿈을 꿔요';q.t=h[1]+' '+q.need+'마리 처치'}
 return q}
function rqDaily(){const s=RQS();if(s.day==S.day)return;s.day=S.day;s.offers=['fetch','clear','search','bag','hunt'].sort(()=>Math.random()-.5).slice(0,3).map(k=>rqMake(k));
 for(const q of s.act.slice())if(S.day>q.until){rqFail(q)}}
function rqFail(q){const s=RQS();s.act.splice(s.act.indexOf(q),1);s.trust=Math.max(0,s.trust-1);rqMarkOff(q);msg('📋 의뢰 기한이 지났어요 · '+q.who+': "괜찮아요… 다음에 부탁할게요" · 신뢰 -1')}
/* ---------- map marks for the places ---------- */
function rqMarkOn(q){if(q.gx==null||typeof MARKS!='function')return;if(typeof MKI!='undefined'&&!MKI.some(m=>m[0]=='📋'))MKI.push(['📋','#9ad0ff','의뢰']);MARKS().push({gx:q.gx,gy:q.gy,lx:q.rx||300,ly:q.ry||300,ic:MKI.findIndex(m=>m[0]=='📋'),nm:RQ_K[q.k][1],rq:q.id})}
function rqMarkOff(q){if(typeof MARKS!='function')return;const L=MARKS();for(let i=L.length-1;i>=0;i--)if(L[i].rq==q.id)L.splice(i,1)}
/* ---------- progress hooks ---------- */
{const _k=kill;kill=function(z){const dead=z&&!z.npc&&!z._rqk;const r=_k.apply(this,arguments);try{if(dead&&S&&S.inf&&S.inf.rq){z._rqk=1;let g=null;try{g=gOf(z.x,z.y)}catch(e){}
  for(const q of S.inf.rq.act){if(q.have>=q.need)continue;if(q.k=='clear'&&g&&g[0]==q.gx&&g[1]==q.gy)rqStep(q);if(q.k=='hunt'&&z.look==q.look)rqStep(q)}}}catch(e){}return r}}
{const _sr=s3SearchRoll;s3SearchRoll=function(o,kind,tier,r){const pid=_sr.apply(this,arguments);try{if(!(typeof DUN!='undefined'&&DUN)&&S&&S.inf&&S.inf.rq)for(const q of S.inf.rq.act)if(q.k=='search'&&q.have<q.need&&(kind==q.bk||kind==q.bk+'R'))rqStep(q)}catch(e){}return pid}}
function rqStep(q){q.have++;if(typeof mFloat=='function')mFloat(S.p.x,S.p.y-56,'📋 '+q.have+'/'+q.need,'#9ad0ff',1.2);if(q.have>=q.need){msg('📋 의뢰 완료! · '+q.who+'에게 돌아가 보상을 받으세요 (거점 천막)');if(q.k!='fetch')rqMarkOff(q)}rqHud(true)}
/* the lost bag lies in its block */
{const _bw=buildWorld;buildWorld=function(){const w=_bw.apply(this,arguments);try{if(!(typeof DUN!='undefined'&&DUN)&&S&&S.inf&&S.inf.rq)for(const q of S.inf.rq.act){if(q.k!='bag'||q.have)continue;const c=q.gx-OGX,r=q.gy-OGY;if(c<0||r<0||c>=NBX||r>=NBY)continue;const[ox,oy]=bo(c,r);let x=ox+q.rx,y=oy+q.ry;
  for(let i=0;i<50&&blocker(x,y,10);i++){x+=(i%2?-1:1)*i*10;y+=7}W0.objs.push({t:'rqbag',x:x-8,y:y-6,w:16,h:12,rq:q.id})}}catch(e){}return w}}
P('rqbag','잃어버린 가방',null,o=>{const t=performance.now()/260;R('#3a2a1a',o.x,o.y+2,16,10);R('#6a4a2a',o.x+1,o.y+3,14,8);R('#8a6a3a',o.x+1,o.y+3,14,2);R('#2a1e12',o.x+5,o.y,6,3);R('#c9a42a',o.x+7,o.y+6,2,2);const y=o.y-12+Math.sin(t)*2;R('#1d1714',o.x+5,y,7,7);R('#9ad0ff',o.x+6,y+1,5,5)},false);
/* ---------- the board ---------- */
const rqCore=()=>BP.find(o=>o.t=='tentS'||o.t=='container'||o.t=='hq');
function rqNear(){const c=rqCore(),p=S.p;return c&&!(typeof DUN!='undefined'&&DUN)&&typeof inBase=='function'&&inBase(p.x,p.y)&&Math.hypot(c.x+c.w/2-p.x,c.y+c.h/2-p.y)<110}
const rqTxt=R0=>Object.entries(R0).map(([k,v])=>NM2(k)+' '+v).join(' · ');
function rqCanGive(q){const p=S.p,st=(S.base&&S.base.st)||{};return((p.inv[q.item]|0)+(st[q.item]|0))>=q.need}
function rqTurnIn(q){const s=RQS(),p=S.p;if(q.k=='fetch'){if(!rqCanGive(q))return msg('📦 '+NM2(q.item)+'이(가) '+q.need+'개 필요해요 (가방 + 창고)');let n=q.need;const a=Math.min(p.inv[q.item]|0,n);if(a)invTake(p,q.item,a);n-=a;if(n)S.base.st[q.item]-=n}
 else if(q.k=='bag'){if(!(p.inv.rqitem>0))return;invTake(p,'rqitem',1)}else if(q.have<q.need)return;
 s.act.splice(s.act.indexOf(q),1);rqMarkOff(q);for(const k in q.rw)invAdd(p,k,q.rw[k]);s.done++;s.trust++;
 let extra='';if(s.trust>0&&s.trust%3==0&&typeof allyNew=='function'){try{const a=allyNew(null,null,Math.min(3,1+Math.floor(s.trust/6)));a.st='base';extra=' · 🤝 소문을 듣고 '+a.nm+'이(가) 거점에 합류했어요!'}catch(e){}}
 msg('📋 '+q.who+': "정말 고마워요!" · 보상 '+rqTxt(q.rw)+extra);rqHud(true)}
function rqOpen(){rqDaily();const s=RQS(),b=$('bm');b.dataset.m='rq';PAUSE=true;
 const prog=q=>{if(q.k=='fetch'){const p=S.p,st=(S.base&&S.base.st)||{},h=Math.min(q.need,(p.inv[q.item]|0)+(st[q.item]|0));return[h,q.need,'가방 + 창고 '+h+'/'+q.need]}if(q.k=='bag')return[S.p.inv.rqitem>0?1:0,1,S.p.inv.rqitem>0?'가방을 찾았어요':'아직 못 찾았어요'];return[Math.min(q.have,q.need),q.need,q.have+'/'+q.need]};
 const left=q=>q.until-S.day;
 const card=(q,act)=>{const[ic,kn]=RQ_K[q.k],[h,n,pt]=act?prog(q):[0,q.need,''],ok=act&&h>=n;
  return'<div class="rqC'+(ok?' ok':'')+'"><div class="rqT"><b>'+ic+' '+kn+'</b><span>'+'★'.repeat(q.lv)+'</span></div><div class="rqW">'+q.who+': "'+q.why+'"</div><div class="rqG">'+q.t+'</div>'+
   (act?'<div class="rqB"><i style="width:'+h/n*100+'%"></i></div><div class="rqS">'+pt+' · '+(left(q)>0?left(q)+'일 남음':'오늘까지')+'</div>':'<div class="rqS">기한 '+q.days+'일</div>')+
   '<div class="rqR">보상: '+rqTxt(q.rw)+'</div>'+(act?(ok?'<button data-rd="'+q.id+'" class="go">보상 받기</button>':'<button data-rx="'+q.id+'">포기</button>'):'<button data-ra="'+q.id+'" '+(s.act.length>=2?'disabled':'')+'>맡기</button>')+'</div>'};
 b.innerHTML='<div class="sh"><h2>📋 생존자 의뢰</h2><div class="wt">신뢰 '+s.trust+' · 완료 '+s.done+' · 동시에 2개까지 · 매일 새 의뢰 3개</div><button onclick="closeBase();PAUSE=false">✕</button></div>'+
  (s.act.length?'<h3 class="rqH">맡은 의뢰</h3>'+s.act.map(q=>card(q,true)).join(''):'')+'<h3 class="rqH">오늘의 부탁</h3>'+(s.offers.length?s.offers.map(q=>card(q,false)).join(''):'<div class="sub">오늘 부탁은 다 받았어요 · 내일 또 와요</div>')+
  '<div class="sub" style="line-height:1.6;margin-top:6px">· 물자: 가방이나 창고에 있으면 바로 건넬 수 있어요<br>· 구역 정리 · 가방: 지도에 📋로 표시돼요<br>· 수색: 그 종류 건물에서 수색한 곳마다 +1 · 사냥: 어디서 잡아도 돼요<br>· 기한을 넘기면 신뢰 -1 · <b>신뢰 3마다 소문을 듣고 생존자가 동료로 합류해요</b></div>';
 b.style.display='block';
 b.querySelectorAll('[data-ra]').forEach(x=>x.onclick=()=>{if(s.act.length>=2)return;const i=s.offers.findIndex(q=>q.id==+x.dataset.ra);if(i<0)return;const q=s.offers.splice(i,1)[0];q.until=S.day+q.days;s.act.push(q);rqMarkOn(q);if(q.k=='bag')infRebuild();msg('📋 '+q.who+'의 부탁을 맡았어요 · '+q.t);rqOpen()});
 b.querySelectorAll('[data-rd]').forEach(x=>x.onclick=()=>{const q=s.act.find(q=>q.id==+x.dataset.rd);if(q)rqTurnIn(q);rqOpen()});
 b.querySelectorAll('[data-rx]').forEach(x=>x.onclick=()=>{const q=s.act.find(q=>q.id==+x.dataset.rx);if(!q)return;s.act.splice(s.act.indexOf(q),1);rqMarkOff(q);if(q.k=='bag')infRebuild();msg('📋 의뢰를 포기했어요');rqOpen()})}
/* the lost bag item */
if(!I_BY.rqitem){const it=['rqitem','잃어버린 가방','m','u',1,'생존자가 떨어뜨린 가방 · 거점 천막의 의뢰 게시판에서 돌려줘요'];ITEMS.push(it);I_BY.rqitem=it;IC.rqitem=()=>{R('#3a2a1a',4,8,16,12);R('#6a4a2a',5,9,14,10);R('#8a6a3a',5,9,14,2);R('#2a1e12',9,5,6,4);R('#c9a42a',11,13,2,2)}}
function rqTakeBag(o){const p=S.p;invAdd(p,'rqitem',1);const k=W0.objs.indexOf(o);if(k>=0)W0.objs.splice(k,1);infDerived();const q=RQS().act.find(q=>q.id==o.rq);if(q){q.have=1;rqMarkOff(q)}msg('🎒 잃어버린 가방을 찾았어요 · 거점 천막에서 돌려주세요');rqHud(true)}
/* ---------- [상호작용] ---------- */
{const _c=dmCtx;dmCtx=function(){const B=_c();try{if(!S||!run||S.dr||typeof DUN!='undefined'&&DUN)return B;const p=S.p;
  for(const o of W0.objs)if(o.t=='rqbag'&&Math.hypot(o.x+8-p.x,o.y+6-p.y)<44){B.unshift({t:'🎒 잃어버린 가방 줍기',f:()=>rqTakeBag(o),big:1});break}
  if(rqNear()){const s=RQS(),ready=s.act.some(q=>q.k=='fetch'?rqCanGive(q):q.k=='bag'?p.inv.rqitem>0:q.have>=q.need);B.push({t:'📋 생존자 의뢰'+(ready?' · 보상 받기':''),f:rqOpen,big:ready?1:0})}}catch(e){}return B}}
if(typeof IAW!='undefined')IAW.unshift([/생존자 의뢰/,'의뢰'],[/가방 줍기/,'줍기']);
/* ---------- the tracker under the zone chip ---------- */
document.body.insertAdjacentHTML('beforeend','<div id="rqHud"></div>');
document.head.insertAdjacentHTML('beforeend',`<style>
#rqHud{position:fixed;left:8px;top:calc(env(safe-area-inset-top,0px) + 176px);z-index:3;display:none;flex-direction:column;gap:4px;pointer-events:none}
#rqHud div{background:#0d1114d9;border:1px solid #9ad0ff44;border-radius:9px;padding:3px 8px;font-size:11.5px;color:#dfe8f0;max-width:62vw;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#rqHud b{color:#9ad0ff}#rqHud .ok{border-color:#7fd07f;color:#bff0bf}
#bm .rqC{border:1px solid #ffffff1a;border-radius:12px;padding:9px 10px;margin:6px 0;background:#ffffff08;display:flex;flex-direction:column;gap:4px}#bm .rqC.ok{border-color:#7fd07f88}
#bm .rqT{display:flex;justify-content:space-between;font-size:13.5px}#bm .rqT span{color:#ffd36a}#bm .rqW{font-size:12px;color:var(--mut)}#bm .rqG{font-size:13px}#bm .rqS,#bm .rqR{font-size:11.5px;color:var(--mut)}#bm .rqR{color:#cfe0a0}
#bm .rqB{height:6px;border-radius:3px;background:#ffffff1a;overflow:hidden}#bm .rqB i{display:block;height:100%;background:#9ad0ff}#bm .rqC button{align-self:flex-end;padding:5px 12px;font-size:12px}#bm .rqC button.go{border-color:#7fd07f;color:#bff0bf}#bm .rqH{margin:12px 0 2px;font-size:14px}
@media (orientation:landscape) and (max-height:520px){#rqHud{top:calc(env(safe-area-inset-top,0px) + 120px)}}</style>`);
let rqHK='',rqHT=0;
function rqHud(force){const el=$('rqHud');if(!el)return;const s=S&&S.inf&&S.inf.rq;if(!s||!s.act.length||!run||PAUSE){if(el.style.display!='none')el.style.display='none';return}const p=S.p;
 const h=s.act.map(q=>{const[ic]=RQ_K[q.k];const ok=q.k=='fetch'?rqCanGive(q):q.k=='bag'?p.inv.rqitem>0:q.have>=q.need;return'<div class="'+(ok?'ok':'')+'">'+ic+' '+(ok?'완료 · 천막에서 보상':'<b>'+(q.k=='fetch'?Math.min(q.need,(p.inv[q.item]|0)+((S.base.st||{})[q.item]|0)):q.k=='bag'?0:q.have)+'/'+q.need+'</b> '+q.t)+'</div>'}).join('');
 if(h==rqHK&&!force&&el.style.display=='flex')return;rqHK=h;el.innerHTML=h;el.style.display='flex'}
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!S||!S.inf||!run)return;rqHT-=dt;if(rqHT<=0){rqHT=.5;rqDaily();rqHud()}}}
