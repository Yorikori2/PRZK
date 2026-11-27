/* PROJECT LEGACY — stacks and storage boxes (one shared inventory per place · base up to 10 boxes · outposts up to 5 · each box Lv1-9).
   Stacks: ammo 300 a stack · weapons, armour and gear never stack (one a slot) · everything else by what it is (see STK).
   The bag is still limited by weight; it now shows its stacks. The base stash is limited by slots (stacks):
   Lv1 30 slots … Lv9 220 slots, upgraded from the stash window. Things the base makes by itself (gardens, scavenging)
   may overflow it, but you cannot put more in while it is full.
   Loaded after deco_next.js. */
'use strict';
const STK_ID={food:10,water:10,bandage:20,medkit:5,pills:10,manual:5,fuel:10,tkn:999,dx1:5,dx2:1,rqitem:1};
function STK(id){if(W_BY[id])return 1;if(id in STK_ID)return STK_ID[id];if(/^vk_/.test(id))return 1;const c=catOf(id);if(c=='e')return 1;if(c=='a')return 300;
 if(/^(rn_|ao_)/.test(id))return 10;if(/^enh/.test(id))return 20;if(c=='c')return 10;const w=wtOf(id);return w>=1?20:w<=.1?100:50}
const stacksOf=(box,id)=>Math.ceil((box[id]|0)/STK(id));
const slotsUsed=box=>Object.keys(box).reduce((a,k)=>a+((box[k]|0)>0?stacksOf(box,k):0),0);
/* ---------- storage: every box at a place shares one inventory (base · each outpost) ----------
   The first box is the one that came with the place. More boxes can be built: base up to 10, an outpost up to 5.
   Each box has its own level (1-9) and adds its slots to the shared total. */
const BOXLV=[20,26,32,40,48,58,68,80,95];
const STCOST=[null,{wood:15,scrap:10},{wood:25,scrap:20},{wood:20,scrap:30,cloth:10},{scrap:40,steel:4},{scrap:50,steel:8,elec:4},{scrap:60,steel:12,elec:8},{scrap:80,steel:16,elec:12,tkn:20},{scrap:100,steel:24,elec:16,tkn:40}];
const BOXNEW={wood:20,scrap:10};
function stCtx(kind){kind=kind||STC;if(kind=='op'){const h=opHere(),o=h.o;if(!o)return null;o.st=o.st||{};o.boxes=o.boxes||[];if(o.stLv==null)o.stLv=1;return{kind:'op',st:o.st,H:o,max:5,gx:h.gx,gy:h.gy,name:'전초기지'}}
 const B=S.base;B.boxes=B.boxes||[];if(B.stLv==null){let l=1;const u=slotsUsed(B.st||{});while(l<9&&BOXLV[l-1]<u)l++;B.stLv=l}return{kind:'base',st:B.st,H:B,max:10,name:'거점'}}
const ctxSlots=c=>BOXLV[c.H.stLv-1]+c.H.boxes.reduce((a,b)=>a+BOXLV[b.lv-1],0);
const ctxCount=c=>1+c.H.boxes.length;
const stLv=()=>stCtx('base').H.stLv;
const stSlots=()=>ctxSlots(stCtx('base'));
function stFits(id,c){c=c||stCtx('base');const box=c.st,k=STK(id),n=box[id]|0,part=n%k?k-n%k:0,free=Math.max(0,ctxSlots(c)-slotsUsed(box));return part+free*k}
function stPutBase(id,n){const f=Math.min(n,stFits(id));if(f>0){S.base.st[id]=(S.base.st[id]|0)+f}return f}
/* ---------- the stash window: bag → box respects the slots ---------- */
{const _mv=stMove;stMove=function(n){if(STSIDE=='bag'&&STSEL){const c=stCtx();if(c){const f=stFits(STSEL,c);if(f<=0){msg('🗄 '+c.name+' 보관함이 가득 찼어요 ('+ctxSlots(c)+'칸) · 확장하거나 하나 더 만드세요');return openStash()}n=Math.min(n,f)}}return _mv.call(this,n)}}
stAllIn=function(){const p=S.p,c=stCtx(),box=c?c.st:stBox();let full=false,moved=0;for(const k of Object.keys(p.inv)){if(!'mac'.includes(catOf(k))||p.quick.includes(k)||stTab(k)=='up')continue;let n=p.inv[k]|0;if(n<=0)continue;
  if(c){n=Math.min(n,stFits(k,c));if(n<(p.inv[k]|0))full=true}if(n<=0)continue;box[k]=(box[k]||0)+n;invTake(p,k,n);moved+=n}
 msg(full?'🗄 보관함이 가득 차서 '+moved+'개만 넣었어요 · 확장하거나 하나 더 만드세요':'🗄 보관함에 넣었어요');openStash();hud2()};
stashAll=function(){const pp=S.p,p=pp.inv;let full=false;Object.keys(p).filter(k=>'mac'.includes(catOf(k))&&!pp.quick.includes(k)).forEach(k=>{const n=p[k]|0;if(n<=0)return;const put=stPutBase(k,n);if(put<n)full=true;if(put)invTake(pp,k,put)});msg(full?'🗄 보관함이 가득 찼어요 · 일부만 넣었어요':'보관함에 넣었습니다');openBase()};
function stUp(i){const c=stCtx();if(!c)return;const o=i<0?c.H:c.H.boxes[i],key=i<0?'stLv':'lv',l=o[key];if(l>=9)return;const cost=STCOST[l];if(!canPay(cost))return msg('재료가 부족해요 · '+costTxt(cost));pay(cost);o[key]=l+1;msg('🗄 보관함 Lv'+(l+1)+' · 전체 '+ctxSlots(c)+'칸');openStash()}
function stUpgrade(){stUp(-1)}
{const _os=openStash;openStash=function(k){_os.apply(this,arguments);try{const b=$('bm');stSplit(b,'.stT',el=>{const m=/stPick\('([^']+)','([^']+)'/.exec(el.getAttribute('onclick')||'');return m?{id:m[1],n:+(el.querySelector('b')||{}).textContent||0}:null},(el,n)=>{const x=el.querySelector('b');if(x)x.textContent=n});
  const c=stCtx();if(!c)return;const used=slotsUsed(c.st),max=ctxSlots(c),full=used>=max,h4=b.querySelector('h4');if(!h4)return;const small=h4.querySelector('small');if(small)small.innerHTML=Object.values(c.st).reduce((a,v)=>a+(v|0),0)+'개 · <b style="color:'+(used>max?'#ff6a5a':full?'#ffb04a':'#7fd07f')+'">'+used+'/'+max+'칸</b>';
  const L=[{nm:'1번 (기본)',lv:c.H.stLv,i:-1},...c.H.boxes.map((x,i)=>({nm:(i+2)+'번',lv:x.lv,i}))];
  h4.insertAdjacentHTML('afterend','<details class="stBx"'+(full?' open':'')+'><summary>🗄 보관함 '+ctxCount(c)+'/'+c.max+'개 · 모두 하나로 이어져 있어요 · 전체 '+max+'칸'+(used>max?' · <b style="color:#ff8a7a">넘침! 꺼내기 전엔 못 넣어요</b>':full?' · <b style="color:#ffb04a">가득 참</b>':'')+'</summary>'+
   L.map(x=>'<div class="stLv"><span>'+x.nm+' · Lv'+x.lv+' · '+BOXLV[x.lv-1]+'칸</span>'+(x.lv<9?'<button onclick="stUp('+x.i+')" class="'+(canPay(STCOST[x.lv])?'':'no')+'">Lv'+(x.lv+1)+' → '+BOXLV[x.lv]+'칸 · '+costTxt(STCOST[x.lv])+'</button>':'<small>최고 레벨</small>')+'</div>').join('')+
   (ctxCount(c)<c.max?'<div class="stLv"><span>➕ 보관함 하나 더 ('+BOXLV[0]+'칸)</span><button onclick="boxStart(\''+c.kind+'\')" class="'+(canPay(BOXNEW)?'':'no')+'">만들기 · '+costTxt(BOXNEW)+'</button></div>':'<div class="stLv"><small>여기는 '+c.max+'개까지 만들 수 있어요</small></div>')+'</details>')}catch(e){}}}
/* ---------- building another box ---------- */
let BPL=null;
function bxSpot(){const p=S.p,f=Math.hypot(p.fx||0,p.fy||0)||1;return[p.x+(p.fx||0)/f*40,p.y+(p.fy||1)/f*40]}
function bxOk(){if(!BPL)return'';const[x,y]=bxSpot();if(BPL=='base'){if(!(typeof inBase=='function'&&inBase(x,y)))return'거점 안에만 놓을 수 있어요'}else{const h=opHere(),[gx,gy]=gOf(x,y);if(!h.o||gx!=h.gx||gy!=h.gy)return'전초기지 블록 안에만 놓을 수 있어요'}
 if(blocker(x,y,14))return'여기는 막혀 있어요';const c=stCtx(BPL);if(!c||ctxCount(c)>=c.max)return'더 만들 수 없어요';if(!canPay(BOXNEW))return'재료가 부족해요';return''}
function boxStart(kind){const c=stCtx(kind);if(!c||ctxCount(c)>=c.max)return;BPL=kind;closeBase();PAUSE=false;msg('🗄 새 보관함 놓기 · 원하는 곳으로 걸어가서 [설치]')}
function bxDo(){const bad=bxOk();if(bad)return msg('🗄 '+bad);const[x,y]=bxSpot(),c=stCtx(BPL);pay(BOXNEW);let ox,oy;if(BPL=='base'){ox=W0.base.ox;oy=W0.base.oy}else[ox,oy]=bo(c.gx-OGX,c.gy-OGY);c.H.boxes.push({rx:Math.round(x-ox),ry:Math.round(y-oy),lv:1});BPL=null;infRebuild();msg('🗄 보관함 '+ctxCount(c)+'/'+c.max+'개 · 전체 '+ctxSlots(c)+'칸 · 어느 보관함에서 열어도 같은 물건이 보여요')}
{const _bw=buildWorld;buildWorld=function(){const w=_bw.apply(this,arguments);try{if(!(typeof DUN!='undefined'&&DUN)&&S&&S.base){if(W0.base)(S.base.boxes||[]).forEach((b,i)=>W0.objs.push({t:'sbox',x:W0.base.ox+b.rx-14,y:W0.base.oy+b.ry-9,w:28,h:18,lv:b.lv,bk:'base'}));
  const ops=(S.inf&&S.inf.op)||{};for(const gk in ops){const o=ops[gk];if(!o||!o.boxes||!o.boxes.length)continue;const[gx,gy]=gk.split(',').map(Number),cc=gx-OGX,rr=gy-OGY;if(cc<0||rr<0||cc>=NBX||rr>=NBY)continue;const[ox,oy]=bo(cc,rr);o.boxes.forEach(b=>W0.objs.push({t:'sbox',x:ox+b.rx-14,y:oy+b.ry-9,w:28,h:18,lv:b.lv,bk:'op'}))}}}catch(e){}return w}}
P('sbox','보관함',null,o=>{const{x,y,w,h}=o,l=o.lv|0,K='#1d1714';
 if(l<=3){R(K,x-1,y-10,w+2,h+11);R('#8a5a34',x,y-9,w,h+9);R('#a8744a',x,y-9,w,3);R('#6a4426',x,y-2,w,1);for(const a of[3,w-5])R('#5a3a20',x+a,y-9,2,h+9);R('#d9b52a',x+w/2-2,y+2,4,3)}
 else if(l<=6){R(K,x-1,y-12,w+2,h+13);R('#5a6a74',x,y-11,w,h+11);R('#7a8a94',x,y-11,w,3);R('#3a4a54',x+w/2,y-8,1,h+6);R('#c9ccd0',x+w/2-4,y,2,4);R('#c9ccd0',x+w/2+2,y,2,4);for(let i=0;i<3;i++)R('#4a5a64',x+3,y-6+i*3,8,1)}
 else{R(K,x-1,y-12,w+2,h+13);R('#3a3e44',x,y-11,w,h+11);R('#5a5e66',x,y-11,w,3);R('#2a2c30',x+3,y-7,w-6,h+3);R('#d9b52a',x+w/2-4,y-2,8,8);R('#1d1714',x+w/2-2,y,4,4);R('#e8c84a',x+w/2-3,y-1,2,2)}
 for(let i=0;i<Math.min(9,l);i++)R(i<l?'#ffd36a':'#555',x+2+i*3,y+h-3,2,2)},true);
if(typeof OVL!='undefined')OVL.push((g,sx,sy,k)=>{if(!BPL||!S||!S.p)return;const[x,y]=bxSpot(),bad=bxOk();g.save();g.fillStyle=bad?'#ff6a5a33':'#7fd07f33';g.strokeStyle=bad?'#ff6a5acc':'#7fd07fcc';g.lineWidth=2;g.setLineDash([5,4]);g.fillRect(sx(x-14),sy(y-20),28*k,30*k);g.strokeRect(sx(x-14),sy(y-20),28*k,30*k);g.setLineDash([]);
 g.font='600 13px system-ui,sans-serif';g.textAlign='center';g.lineWidth=3;g.strokeStyle='#000a';const t='🗄 '+(bad||'보관함 여기에');g.strokeText(t,sx(x),sy(y-20)-8);g.fillStyle='#fff';g.fillText(t,sx(x),sy(y-20)-8);g.restore()});
{const _c=dmCtx;dmCtx=function(){if(BPL){const bad=bxOk();return[{t:'✅ 보관함 설치'+(bad?' · '+bad:''),f:bxDo,off:!!bad,big:1},{t:'✖ 취소',f:()=>{BPL=null},sm:1}]}const B=_c();try{if(!S||!run||S.dr||typeof DUN!='undefined'&&DUN)return B;const p=S.p;
  for(const o of W0.objs)if(o.t=='sbox'&&Math.hypot(o.x+o.w/2-p.x,o.y+o.h/2-p.y)<50){B.unshift({t:'🗄 보관함 열기',f:()=>openStash(o.bk),big:1});break}}catch(e){}return B}}
/* one tile per stack (ammo 650 → 300 · 300 · 50, two pistols → two tiles) */
function stSplit(root,sel,read,write){root.querySelectorAll(sel).forEach(el=>{const r=read(el);if(!r||!r.id)return;const k=STK(r.id);if(r.n<=k)return;let left=r.n,first=true,prev=el;while(left>0){const n=Math.min(k,left);left-=n;if(first){write(el,n);first=false;continue}const c=el.cloneNode(true);write(c,n);c.classList.add('stk');c.querySelectorAll('span.e,em').forEach(x=>x.remove());if(el.onclick)c.onclick=el.onclick;prev.after(c);prev=c}})}
/* the bag shows its stacks too */
{const _ob=openBag;openBag=function(id){_ob.apply(this,arguments);try{const b=$('bm'),p=S.p;stSplit(b,'.grid .cell[data-i]',el=>({id:el.dataset.i,n:p.inv[el.dataset.i]|0}),(el,n)=>{let c=el.querySelector('span.c');if(n>1){if(!c){el.insertAdjacentHTML('beforeend','<span class="c"></span>');c=el.querySelector('span.c')}c.textContent=n}else if(c)c.remove()});
  b.querySelectorAll('.grid .cell.stk').forEach(c=>c.onclick=()=>openBag(c.dataset.i))}catch(e){}}}
/* the base window line */
{const _ob=openBase;openBase=function(){_ob.apply(this,arguments);try{const s=$('stash'),c=stCtx('base');if(s&&!s.querySelector('.stCap'))s.insertAdjacentHTML('beforeend','<div class="stCap">🗄 보관함 '+ctxCount(c)+'/10개 · '+slotsUsed(S.base.st)+'/'+ctxSlots(c)+'칸</div>')}catch(e){}}}
document.head.insertAdjacentHTML('beforeend',`<style>#bm .stLv{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:2px 0 8px;font-size:12px}#bm .stLv span{flex:1}#bm .stLv button{padding:4px 10px;font-size:11.5px}#bm .stLv button.no{opacity:.45}#bm .stCap{font-size:11.5px;color:var(--mut);margin-top:4px}#bm .stBx{margin:2px 0 8px;font-size:12px}#bm .stBx summary{cursor:pointer;padding:4px 0;color:#e8e2d6}</style>`);
/* ---------- names on boxes: every box (and the first one) can carry a name · shown above it ---------- */
const BXNM=['보관함','탄약 창고','식량 창고','재료 창고','무기 창고','의료 창고','부품 창고','잡동사니'];
const bxName=(c,i)=>(i<0?c.H.stNm:(c.H.boxes[i]||{}).nm)||(i<0?'1번 보관함':(i+2)+'번 보관함');
function bxSetName(i,v){const c=stCtx();if(!c)return;v=String(v||'').trim().slice(0,12);if(i<0)c.H.stNm=v;else if(c.H.boxes[i])c.H.boxes[i].nm=v;infRebuild()}
{const _os=openStash;openStash=function(k){_os.apply(this,arguments);try{const b=$('bm'),c=stCtx();if(!c)return;const rows=b.querySelectorAll('.stBx .stLv');[-1,...c.H.boxes.map((x,i)=>i)].forEach((i,j)=>{const r=rows[j];if(!r)return;const sp=r.querySelector('span');if(!sp)return;
  sp.innerHTML='<input class="bxN" data-bi="'+i+'" maxlength="12" value="'+bxName(c,i).replace(/"/g,'')+'"> · Lv'+(i<0?c.H.stLv:c.H.boxes[i].lv)+' · '+BOXLV[(i<0?c.H.stLv:c.H.boxes[i].lv)-1]+'칸'});
  const det=b.querySelector('.stBx');if(det)det.insertAdjacentHTML('beforeend','<div class="bxP"><small>빠른 이름:</small>'+BXNM.slice(1).map(n=>'<button data-bp="'+n+'">'+n+'</button>').join('')+'</div>');
  let last=-1;b.querySelectorAll('input.bxN').forEach(x=>{x.onfocus=()=>{last=+x.dataset.bi};x.onchange=()=>{bxSetName(+x.dataset.bi,x.value);msg('🏷 이름: '+(x.value||'(기본)'))};x.onkeydown=e=>e.stopPropagation()});
  b.querySelectorAll('[data-bp]').forEach(x=>x.onpointerdown=e=>{e.preventDefault();const inp=b.querySelector('input.bxN[data-bi="'+last+'"]')||b.querySelector('input.bxN');if(!inp)return;inp.value=x.dataset.bp;bxSetName(+inp.dataset.bi,inp.value);msg('🏷 '+inp.value)})}catch(e){}}}
{const _bw=buildWorld;buildWorld=function(){const w=_bw.apply(this,arguments);try{if(!S||!S.base)return w;let i=0;for(const o of W0.objs)if(o.t=='sbox'&&o.bk=='base'){o.bi=i++}}catch(e){}return w}}
if(typeof OVL!='undefined')OVL.push((g,sx,sy,k)=>{if(!S||!S.p||typeof DUN!='undefined'&&DUN)return;const p=S.p,L=[];
 if(S.base){const st=(typeof BP!='undefined'?BP:[]).find(o=>o.t=='stash');if(st)L.push([st.x+st.w/2,st.y-16,bxName(stCtx('base'),-1)]);const B=S.base.boxes||[];for(const o of W0.objs)if(o.t=='sbox'&&o.bk=='base'&&B[o.bi])L.push([o.x+o.w/2,o.y-16,bxName(stCtx('base'),o.bi)])}
 g.save();g.textAlign='center';g.font='600 11px system-ui,sans-serif';g.lineWidth=3;g.lineJoin='round';const put=[];for(const[x,y,t]of L.sort((a,b)=>a[0]-b[0])){if(Math.hypot(x-p.x,y-p.y)>320)continue;const X=sx(x),w=g.measureText('🏷 '+t).width+10;let Y=sy(y)-6;for(let n=0;n<4&&put.some(q=>Math.abs(q[0]-X)<(q[2]+w)/2+2&&Math.abs(q[1]-Y)<17);n++)Y-=18;put.push([X,Y,w]);g.fillStyle='#0d1114cc';g.fillRect(X-w/2,Y-9,w,16);g.fillStyle='#ffe9b0';g.fillText('🏷 '+t,X,Y+3)}g.restore()});
document.head.insertAdjacentHTML('beforeend',`<style>#bm input.bxN{width:110px;padding:3px 6px;font-size:12px;border-radius:7px;border:1px solid #ffffff33;background:#ffffff10;color:#fff}#bm .bxP{display:flex;flex-wrap:wrap;gap:4px;align-items:center;margin:4px 0}#bm .bxP button{padding:3px 8px;font-size:11px;border-radius:99px}</style>`);
