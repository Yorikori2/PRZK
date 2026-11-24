/* PROJECT LEGACY — sample: demolition (tool levels 1-3), noise, monsters rising from below, and shelters / bunkers
   found under the rubble that open into a small dungeon. Endless city only. Loaded after enh_next.js. */
'use strict';
/* ---------- tools ---------- */
{const add=(id,nm,rar,wt,ds,draw)=>{if(I_BY[id])return;const it=[id,nm,'m',rar,wt,ds];ITEMS.push(it);I_BY[id]=it;IC[id]=draw};
 add('dt1','철거 해머','u',2,'철거 Lv1 · 주택가 · 아파트 · 교회 · 편의점',()=>{R('#6b4a2e',10,8,3,14);R('#2a2e33',5,4,13,6);R('#8a9096',5,4,13,2)});
 add('dt2','유압 절단기','r',4,'철거 Lv2 · 학교 · 철물점 · 소방서 · 물류창고 (+Lv1)',()=>{R('#c9a42a',4,9,16,7);R('#2a2e33',2,11,4,3);R('#2a2e33',18,8,4,9);R('#8a9096',18,8,4,2);R('#1d1714',8,16,3,6)});
 add('dt3','폭약 세트','e',3,'철거 Lv3 · 진료소(병원) · 경찰서 · 군부대 · 연구소 (+Lv1·2)',()=>{for(let i=0;i<3;i++){R('#a8322a',4+i*6,6,5,14);R('#c84a3a',4+i*6,6,5,2)}R('#2a2e33',4,12,17,2);R('#d9b52a',10,2,2,5)})}
const DLV={houses:1,apt:1,church:1,mart:1,school:2,hard:2,fire:2,ware:2,clinic:3,police:3,mil:3,lab:3};
const DTIME=[0,20,40,60],DNZ=[0,3,4,5],DREW=[null,{scrap:6,wood:8},{scrap:12,wood:6,cement:3,elec:1},{scrap:20,cement:6,elec:3,milpart:1}];
/* chance of finding something under the rubble: [shelter, bunker] */
const DSH={houses:[.15,0],apt:[.15,0],church:[.15,0],mart:[.15,0],school:[.25,0],hard:[.25,0],fire:[.25,0],ware:[.25,0],clinic:[.2,.15],police:[.2,.15],mil:[0,.5],lab:[0,.5]};
const toolLv=()=>S?(S.p.inv.dt3>0?3:S.p.inv.dt2>0?2:S.p.inv.dt1>0?1:0):0;
const DM0=()=>{S.inf.demo=S.inf.demo||{};return S.inf.demo};
/* ---------- demolished blocks become rubble lots ---------- */
{const _ka=kindAt;kindAt=function(gx,gy){let d=null;try{d=S&&S.inf&&S.inf.demo}catch(e){}if(d&&d[gx+','+gy])return'lot';return _ka(gx,gy)}}
P('rubble','잔해 더미',['scrap','scrap','wood','wood'],o=>{const{x,y,w,h}=o;for(let i=0;i<9;i++){const a=hh(i+x,3),b=hh(i+y,7);R(i%3?'#8a8478':'#6e6a62',x+a*(w-12),y-6+b*(h-2),10+a*6,6+b*5)}R('#4a463e',x,y+h-3,w,3);R('#7a4b37',x+w*.3,y+2,w*.4,3)});
P('hatch','지하 입구',null,o=>{const{x,y,w,h}=o,bk=o.sh=='bunker';R('#1d1714',x-2,y-2,w+4,h+4);R(bk?'#c9a42a':'#5a5f66',x,y,w,h);if(bk)for(let i=0;i<w;i+=8)R('#1d1714',x+i,y,4,h);R('#0c0d10',x+5,y+5,w-10,h-10);for(let i=0;i<3;i++)R('#7a7f86',x+9,y+8+i*7,w-18,2)},false);
P('ladder','사다리 (지상으로)',null,o=>{const{x,y,w,h}=o;R('#0c0d10',x-4,y-4,w+8,h+8);R('#8a9096',x+3,y-40,3,h+40);R('#8a9096',x+w-6,y-40,3,h+40);for(let i=0;i<6;i++)R('#b8bec4',x+3,y-36+i*9,w-6,2);},false);
Object.assign(FLAT,{hatch:1,ladder:1});TIER.lot=1;TIER.dun=3;
BUILDERS.lot=(c,r,sd)=>{const A=Bld('철거지',c,r,'lot'),Rn=mulberry(sd*31+7);A.fl(0,0,BW,BH,'gravel');A.fl(60,60,BW-120,BH-120,'dirt');A.fl(0,BH-110,BW,110,'asphalt');
 const gx=OGX+c,gy=OGY+r,d=(S&&S.inf&&S.inf.demo&&S.inf.demo[gx+','+gy])||{};
 for(let i=0;i<7;i++){const x=80+Rn()*(BW-220),y=90+Rn()*(BH-260);if(Math.abs(x+40-BW/2)<110&&Math.abs(y+18-BH/2+40)<90)continue;A.o('rubble',x,y,64+Rn()*30,26)}
 if(d.sh)A.o('hatch',BW/2-26,BH/2-60,52,40,{sh:d.sh});A.o('barrel',BW-120,BH-170,16,10,{c:'#4f5a35'})};
/* ---------- rebuild the window in place (after a demolition) ---------- */
function infRebuild(){const s=S,pg=s.pg;if(pg)for(const i in pg.vis){const b=W0.b[i];if(b&&b.gk)s.inf.bv[b.gk]=1}buildWorld();infDerived();for(const z of W0.zs)s.inf.zv[z.gk]=1;
 if(pg){pg.vis={};W0.b.forEach((b,i)=>{if(s.inf.bv[b.gk])pg.vis[i]=1})}}
/* ---------- which building am I in ---------- */
function bldAt(x,y){for(const r of W0.roofs)if(x>r.x&&x<r.x+r.w&&y>r.y&&y<r.y+r.h){const b=W0.b[r.bi];if(b&&DLV[b.kind])return r.bi}return-1}
const inBld=(bi,x,y,m=0)=>W0.roofs.some(r=>r.bi==bi&&x>r.x-m&&x<r.x+r.w+m&&y>r.y-m&&y<r.y+r.h+m);
const zInside=bi=>Z.filter(z=>z.hp>0&&inBld(bi,z.x,z.y));
let DM=null;
function demoTry(){if(DM)return demoStop('철거를 멈췄어요');const p=S.p,bi=bldAt(p.x,p.y);if(bi<0)return;const b=W0.b[bi],need=DLV[b.kind],lv=toolLv();
 if(lv<need)return msg('🏚 '+b.name+' 철거에는 Lv'+need+' 도구('+NM2('dt'+need)+')가 필요해요');
 if(need>=2){const n=zInside(bi).length;if(n)return msg('🧟 '+b.name+' 안에 좀비 '+n+'마리가 남아 있어요 · 모두 처치해야 대형 건물을 철거할 수 있어요')}
 const rs=W0.roofs.filter(r=>r.bi==bi),cx=rs.reduce((a,r)=>a+r.x+r.w/2,0)/rs.length,cy=rs.reduce((a,r)=>a+r.y+r.h/2,0)/rs.length;
 DM={bi,gk:b.gk,kind:b.kind,name:b.name,need,T:DTIME[need]*(window.DSPEED||1),t:0,nz:0,up:need>=2?2:1e9,cx,cy,gx:b.gx,gy:b.gy};
 msg(need>=2?'⚠ '+b.name+' 철거 시작 · 지하에서 좀비가 올라오고 있습니다 · 소음을 듣고 주변 좀비가 몰려옵니다':'🏚 '+b.name+' 철거 시작 · 소음을 듣고 주변 좀비가 몰려옵니다');noise(cx,cy,DNZ[need])}
function demoStop(t){DM=null;msg(t)}
function demoUpd(dt){if(!DM)return;const p=S.p;if(!W0.b[DM.bi]||W0.b[DM.bi].gk!=DM.gk||!inBld(DM.bi,p.x,p.y,90))return demoStop('🏚 건물에서 벗어나 철거가 멈췄어요 (진행 '+Math.round(DM.t/DM.T*100)+'%)');
 DM.t+=dt;DM.nz-=dt;if(DM.nz<=0){DM.nz=1.5;noise(DM.cx,DM.cy,DNZ[DM.need]);S4&&(S4.shake=Math.max(S4.shake||0,.12));if(Math.random()<.5)fx.push({k:'boom',x:DM.cx+(Math.random()-.5)*300,y:DM.cy+(Math.random()-.5)*200,r:30,l:.25,m:.25})}
 DM.up-=dt;if(DM.up<=0){DM.up=DM.need==3?3:4.5;const rs=W0.roofs.filter(r=>r.bi==DM.bi),rf=rs[Math.random()*rs.length|0];for(let i=0;i<(DM.need==3?3:2);i++){const L=['crawler','civ1','sleeper','runner','civ2'];mk(rf.x+30+Math.random()*(rf.w-60),rf.y+30+Math.random()*(rf.h-60),{look:L[Math.random()*L.length|0],w:1})}
  if(!DM.upMsg){DM.upMsg=1;msg('⚠ 지하에서 좀비가 올라오고 있습니다!')}}
 if(DM.t>=DM.T)demoDone()}
function demoDone(force){const d=DM;DM=null;const ch=DSH[d.kind]||[0,0],r=Math.random();let sh=force||(r<ch[1]?'bunker':r<ch[0]+ch[1]?'shelter':0);
 const D=DM0();D[d.gk]={k:d.kind,sh,day:S.day};if(d.kind=='mil')D[(d.gx+1)+','+d.gy]={k:'milR',sh:0,day:S.day};
 give(DREW[d.need]);s3Xp(40*d.need,'철거');infRebuild();S.demoN=(S.demoN||0)+1;
 setTimeout(()=>msg(sh?(sh=='bunker'?'🪖 잔해 아래에서 지하 벙커를 발견했어요! · 입구로 내려가 보세요':'🕳 잔해 아래에서 지하 대피소를 발견했어요! · 입구로 내려가 보세요'):'🏚 '+d.name+' 철거 완료 · 빈터가 생겼어요 (전초기지를 지을 수 있어요)'),900);return sh}
/* ---------- the dungeon under a lot (shelter / bunker) ---------- */
let DUN=null,SURF=null;
function buildDungeon(){newWorld();const c=(NBX-1)/2|0,r=(NBY-1)/2|0,bk=DUN.sh=='bunker',A=Bld(bk?'지하 벙커':'지하 대피소',c,r,'dun'),Rn=mulberry(DUN.seed);
 const gx=OGX+c,gy=OGY+r,RW=BW/3,RH=BH/3,face=bk?'#4a4e45':'#55534e';
 A.fl(0,0,BW,BH,bk?'concrete':'grey');for(let j=0;j<3;j++)for(let i=0;i<3;i++)if(Rn()<.4)A.fl(i*RW+16,j*RH+16,RW-32,RH-32,bk?'grey':'small');
 shell(A,6,6,BW-6,BH-6,face);for(const x of[RW,RW*2])for(let j=0;j<3;j++){const g=j*RH+RH/2-34;vseg(A,x,j*RH+6,(j+1)*RH-(j==2?6:0),[[g,g+68]],34)}
 for(const y of[RH,RH*2])for(let i=0;i<3;i++){const g=i*RW+RW/2-38;A.hw(i*RW+(i?0:6),g,y,26,face);A.hw(g+76,(i+1)*RW-(i==2?6:0),y,26,face)}
 const SETS=bk?[['gunrack',60,16],['ammo',34,20],['locker',30,18],['console',60,22],['rack',34,20],['crate',34,24],['tnt',30,20],['bunk',36,64]]:[['bunk',36,64],['cot',30,56],['cabinet',44,18],['shelf',60,18],['crate',34,24],['fridge',30,22],['medshelf',60,18],['gen',44,26]];
 for(let j=0;j<3;j++)for(let i=0;i<3;i++){if(!i&&!j)continue;const x0=i*RW,y0=j*RH;for(let k=0;k<3+(Rn()*2|0);k++){const[t,w,h]=SETS[Rn()*SETS.length|0],cx=[x0+30,x0+RW-30-w][k%2],cy=[y0+40,y0+RH-30-h][(k>>1)%2];A.o(t,cx+(Rn()-.5)*20,cy+(Rn()-.5)*14,w,h)}}
 {const[ox,oy]=bo(c,r);for(const[x,y,w,h]of[[0,0,WW,oy-4],[0,oy+BH+4,WW,WH],[0,0,ox-4,WH],[ox+BW+4,0,WW,WH]])W0.dec.push({x,y,w,h,f:()=>R('#0b0c0e',x,y,w,h)})}
 A.o('ladder',RW/2-14,RH/2-8,28,22);A.light(RW/2,RH/2,160,.5,'255,230,180');for(let k=0;k<4;k++)A.light(RW*(.5+(k%2)*2),RH*(1.5+(k>>1)),120,.3,bk?'255,90,60':'255,220,160');
 for(let i=W0.b.length-1;i>=0;i--)Object.assign(W0.b[i],{gx,gy,zone:zoneOf(gx,gy),gk:'dun:'+gx+','+gy});W0.objs.forEach((o,i)=>o.id='dun:'+gx+','+gy+':'+i);
 W0.base=Object.assign({},W0.base||{},(()=>{const[ox,oy]=bo(-OGX,-OGY);return{ox,oy,...BASE}})());W0.car=SURF?SURF.carW:W0.car;return W0}
{const _bw=buildWorld;buildWorld=function(){return DUN?buildDungeon():_bw()}}
{const _it=infTick;infTick=function(){if(DUN)return;return _it()}}
function addSolid(r){SOL.push(r);for(let gy=Math.max(0,r.y/GC|0);gy<=Math.min(GY-1,(r.y+r.h)/GC|0);gy++)for(let gx=Math.max(0,r.x/GC|0);gx<=Math.min(GX-1,(r.x+r.w)/GC|0);gx++)GRID[gy*GX+gx].push(r)}
function dunEnter(o){const p=S.p,c=(NBX-1)/2|0,r=(NBY-1)/2|0,[ox,oy]=bo(c,r),gx=OGX+c,gy=OGY+r;if(gOf(o.x,o.y).join()!=gx+','+gy)infGoto(...gOf(o.x,o.y));
 SURF={x:p.x,y:p.y,Z,dec,carW:W0.car};const[hx,hy]=gOf(S.p.x,S.p.y);DUN={sh:o.sh,seed:bh(hx,hy,9)*1e6|0,gk:hx+','+hy};Z=[];dec=[];buildWorld();infDerived();
 addSolid({x:0,y:0,w:WW,h:oy,wall:1});addSolid({x:0,y:oy+BH,w:WW,h:WH-oy-BH,wall:1});addSolid({x:0,y:oy,w:ox,h:BH,wall:1});addSolid({x:ox+BW,y:oy,w:WW-ox-BW,h:BH,wall:1});
 p.x=ox+BW/6+36;p.y=oy+BH/6+24;document.body.dataset.dun=DUN.sh;
 const Rn=mulberry(DUN.seed+5),bk=DUN.sh=='bunker',RW=BW/3,RH=BH/3,L=bk?['soldier','cop','civ1','runner','crawler']:['crawler','sleeper','civ1','civ2','patient'];
 for(let j=0;j<3;j++)for(let i=0;i<3;i++){if(!i&&!j)continue;const n=2+(Rn()*3|0);for(let k=0;k<n;k++)mk(ox+i*RW+60+Rn()*(RW-120),oy+j*RH+50+Rn()*(RH-100),{look:L[Rn()*L.length|0]})}
 mk(ox+RW*2.5,oy+RH*2.5,{look:bk?'brute':'bloater'});for(let k=0;k<2;k++)mk(ox+RW*2.5+(k?40:-40),oy+RH*2.5+30,{look:bk?'heavy':'sleeper'});
 msg(bk?'🪖 지하 벙커 · 어두워요 · 가장 깊은 방(오른쪽 아래)에 브루트가 지키는 무기고가 있어요':'🕳 지하 대피소 · 어두워요 · 크롤러와 잠복자를 조심하세요 · 가장 깊은 방에 보급품이 있어요');S.dunN=(S.dunN||0)+1}
function dunExit(){const p=S.p;DUN=null;buildWorld();infDerived();Z=SURF.Z;dec=SURF.dec;p.x=SURF.x;p.y=SURF.y;SURF=null;delete document.body.dataset.dun;msg('⬆ 지상으로 나왔어요')}
/* dungeon loot is richer: stones, runes, parts in the deep rooms */
{const _sr=s3SearchRoll;s3SearchRoll=function(o,kind,tier,r){const pid=_sr(o,kind,DUN?Math.max(tier,DUN.sh=='bunker'?5:3):tier,r);if(DUN){const zn=Math.max(1,zoneOf(...gOf(o.x,o.y)));if(Math.random()<.3)r[stoneFor(zn)]=(r[stoneFor(zn)]||0)+1;if(Math.random()<.08)r[runeFor(zn)]=1;if(DUN.sh=='bunker'&&['gunrack','ammo','locker'].includes(o.t)&&Math.random()<.5){const ai=AMMO_ITEM(['556','9mm','308'][Math.random()*3|0]);r[ai]=(r[ai]||0)+20}}return s3PartRoll&&!pid&&DUN&&Math.random()<.15?s3PartRoll(5,1):pid}}
{const _sv=save;save=function(){if(DUN&&SURF){const p=S.p,x=p.x,y=p.y;p.x=SURF.x;p.y=SURF.y;try{return _sv.apply(this,arguments)}finally{p.x=x;p.y=y}}return _sv.apply(this,arguments)}}
/* ---------- context button ---------- */
function dmCtx(){const p=S.p;if(DM)return{t:'🏚 철거 중 '+Math.round(DM.t/DM.T*100)+'% · 멈추기',f:demoTry,pr:DM.t/DM.T};
 if(DUN){const l=W0.objs.find(o=>o.t=='ladder');if(l&&Math.hypot(l.x+14-p.x,l.y+10-p.y)<60)return{t:'⬆ 지상으로',f:dunExit};return null}
 const h=W0.objs.find(o=>o.t=='hatch'&&Math.hypot(o.x+26-p.x,o.y+20-p.y)<70);if(h)return{t:h.sh=='bunker'?'🪖 지하 벙커로 내려가기':'🕳 지하 대피소로 내려가기',f:()=>dunEnter(h)};
 const bi=bldAt(p.x,p.y);if(bi>=0){const b=W0.b[bi],need=DLV[b.kind],lv=toolLv();return{t:'🏚 '+b.name+' 철거 · Lv'+need+(lv<need?' 🔒':''),f:demoTry,off:lv<need}}return null}
let DMC=null;
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!S)return;demoUpd(dt);const c=dmCtx(),el=$('dmB');if(!el)return;DMC=c;if(!c){el.style.display='none';return}el.style.display='block';el.classList.toggle('off',!!c.off);
  el.innerHTML=c.t+(c.pr!=null?'<i style="width:'+Math.round(c.pr*100)+'%"></i>':'')}}
document.body.insertAdjacentHTML('beforeend','<button id="dmB"></button>');$('c').insertAdjacentHTML('afterend','<div id="dunV"></div>');
$('dmB').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation()});$('dmB').addEventListener('click',e=>{e.preventDefault();e.stopPropagation();if(DMC&&DMC.f)DMC.f()});
document.head.insertAdjacentHTML('beforeend',`<style>
#dmB{display:none;position:fixed;right:12px;bottom:calc(env(safe-area-inset-bottom,0px) + 236px);z-index:4;padding:8px 14px;font-size:13px;border-radius:12px;background:#3a2a14ee;border:1px solid #e0b03a;width:auto;max-width:70vw;overflow:hidden}
#dmB.off{opacity:.6;border-color:#888}#dmB i{position:absolute;left:0;bottom:0;height:3px;background:#ffd36a}
#dunV{display:none;position:fixed;inset:0;pointer-events:none;background:radial-gradient(circle at 50% 50%,transparent 80px,#000c 200px,#000f 380px)}
body[data-dun] #dunV{display:block}body[data-dun="bunker"] #dunV{background:radial-gradient(circle at 50% 50%,transparent 80px,#1a0505d0 200px,#000f 380px)}
</style>`);
