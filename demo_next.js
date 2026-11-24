/* PROJECT LEGACY — sample: demolition (tool levels 1-3), noise, monsters rising from below, and shelters / bunkers
   found under the rubble that open into a small dungeon. Endless city only. Loaded after enh_next.js. */
'use strict';
/* ---------- tools ----------
   hand tools (Lv1, tap to hit) · power tools (Lv2, automatic) · hydraulic tools (Lv3, faster automatic, two targets)
   explosives / heavy machinery take the whole building at once when you don't need the materials */
{const add=(id,nm,rar,wt,ds,draw,cat='m')=>{if(I_BY[id])return;const it=[id,nm,cat,rar,wt,ds];ITEMS.push(it);I_BY[id]=it;IC[id]=draw};
 add('dt1','손 공구 세트','u',2,'해체 Lv1 · 망치 · 쇠지렛대 · 톱 · 직접 두드려서 가구 · 바닥 · 벽을 뜯어요 · 주택가 · 아파트 · 교회 · 편의점',()=>{R('#6b4a2e',4,10,3,12);R('#2a2e33',2,6,8,5);R('#8a9096',2,6,8,2);R('#8a9096',12,4,2,16);R('#5a5f66',12,4,6,2);R('#c9a42a',16,12,6,3);R('#8a9096',16,15,6,6)});
 add('dt2','전동 드릴 · 그라인더','r',4,'해체 Lv2 · 켜 두면 가까운 것을 자동으로 해체 · 학교 · 철물점 · 소방서 · 물류창고까지',()=>{R('#c9a42a',4,7,12,7);R('#e0bc3a',4,7,12,2);R('#2a2e33',8,14,4,8);R('#8a9096',16,9,6,3);R('#1d1714',2,9,2,3)});
 add('dt3','유압 브레이커 세트','e',6,'해체 Lv3 · 더 빠른 자동 해체 · 한 번에 두 곳 · 진료소(병원) · 경찰서 · 군부대 · 연구소까지',()=>{R('#a8322a',6,3,10,9);R('#c84a3a',6,3,10,2);R('#2a2e33',9,12,4,6);R('#8a9096',10,18,2,5);R('#2a2e33',3,6,3,4);R('#2a2e33',16,6,3,4)});
 add('dx1','폭약','e',1.5,'건물 통째로 폭파 · 10초 뒤 무너짐 · 재료는 10%만 남아요 · 1회용',()=>{for(let i=0;i<3;i++){R('#a8322a',4+i*6,6,5,14);R('#c84a3a',4+i*6,6,5,2)}R('#2a2e33',4,12,17,2);R('#d9b52a',10,2,2,5)});
 add('dx2','중장비 열쇠 (불도저)','e',.1,'건물 통째로 밀기 · 30초 · 재료 50% · 연료 5 사용',()=>{R('#d9a52a',4,9,15,8);R('#e8bc3a',4,9,15,2);R('#2a2e33',5,17,13,4);R('#5a5f66',2,6,3,13);R('#1d1714',9,5,6,4)})}
const DLV={houses:1,apt:1,church:1,mart:1,school:2,hard:2,fire:2,ware:2,clinic:3,police:3,mil:3,lab:3};
const DNZ=[0,2,3,3];
/* whole-building methods */
const DWAY={boom:{T:10,keep:.1,nz:5,name:'💣 폭파',item:'dx1'},dozer:{T:30,keep:.5,nz:5,name:'🚜 중장비',item:'dx2',fuel:5}};
/* power tools */
const DTOOL=[null,{dmg:1,auto:0,rng:62,n:1},{dmg:2,auto:.45,rng:80,n:1},{dmg:3,auto:.3,rng:100,n:2}];
/* chance of finding something under the rubble: [shelter, bunker] */
const DSH={houses:[.15,0],apt:[.15,0],church:[.15,0],mart:[.15,0],school:[.25,0],hard:[.25,0],fire:[.25,0],ware:[.25,0],clinic:[.2,.15],police:[.2,.15],mil:[0,.5],lab:[0,.5]};
const toolLv=()=>S?(S.p.inv.dt3>0?3:S.p.inv.dt2>0?2:S.p.inv.dt1>0?1:0):0;
const DM0=()=>{S.inf.demo=S.inf.demo||{};return S.inf.demo};
const DIS0=gk=>{S.inf.dis=S.inf.dis||{};return S.inf.dis[gk]=S.inf.dis[gk]||{}};
/* ---------- what each thing gives when taken apart ---------- */
const MAT={};{const set=(L,r)=>L.split(' ').forEach(k=>MAT[k]=r);
 set('bookshelf wardrobe desk sdesk ctable rtable tableset longtable crate lumber bench2 bench3 pew altar chair chairs stool bench pallet palrack board',{wood:2});
 set('shelf counter',{wood:1,scrap:1});set('bunk',{wood:1,scrap:1,cloth:1});set('bed cot',{scrap:1,cloth:2});set('sofa',{cloth:2,wood:1});set('curtain sandbag rug',{cloth:2});set('piano',{wood:3,scrap:1});
 set('locker lockrow cabinet tool gunrack ammo barrel dumpster trash mcart iv tray gurney wheelchair medshelf aisle sink toilet tub stall hoop bleacher tires fence wall2 sign lamp mailbox extinguisher cone bollard labbench hood palrack forklift trailer',{scrap:2});
 set('car wreck pcar ambulance truck humvee firetruck',{scrap:4,fuel:1});set('heli',{scrap:5,elec:2});set('pillar',{cement:2,scrap:1});
 set('fridge drinks vending washer',{scrap:2,elec:1});set('kitchen',{scrap:1,elec:1});set('cooler register alarmbox',{scrap:1,elec:1});set('tv monitor radio',{elec:2});set('console rack',{elec:3,scrap:1});
 set('xray',{elec:3,scrap:2});set('anest',{elec:1,scrap:1});set('gen',{elec:2,scrap:3});set('optable',{scrap:2})}
const FLMAT={wood:'wood',woodD:'wood',carpet:'cloth',carpetR:'cloth',tileB:'cement',tileP:'cement',tileK:'cement',vinylG:'cement',vinylW:'cement',small:'cement',check:'cement',gym:'wood',hall:'cement',stone:'cement',grey:'cement',concrete:'cement'};
function tgtDrop(t){if(t.k=='o')return Object.assign({},MAT[t.r.t]||{scrap:1});if(t.k=='f'){const m=FLMAT[t.r[4]];return m?{[m]:Math.max(1,Math.min(4,Math.round(t.r[2]*t.r[3]/40000)))}:{}}
 const L=t.k=='h'?t.r.x1-t.r.x0:t.r.y1-t.r.y0,n=Math.max(1,Math.round(L/160)),outer=t.k=='h'?t.r.h>=26:t.r.top>=26;return outer?{cement:n,scrap:n}:{wood:n,scrap:Math.ceil(n/2)}}
function tgtHp(t){if(t.k=='o')return Math.min(8,2+Math.ceil(t.r.w*t.r.h/1500));if(t.k=='f')return Math.min(6,1+Math.ceil(t.r[2]*t.r[3]/30000));const L=t.k=='h'?t.r.x1-t.r.x0:t.r.y1-t.r.y0;return Math.max(2,Math.ceil(L/40))}
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
/* ---------- walls and floors get stable ids so taken-apart pieces stay gone ---------- */
function disTag(){let dis=null;try{dis=S&&S.inf&&S.inf.dis}catch(e){}const cnt={},tag=(a,k,f)=>{for(const q of a){const[x,y]=f(q),gk=gOf(x,y).join(),c=(cnt[gk+k]=(cnt[gk+k]||0)+1);q.id=gk+':'+k+c}};
 tag(W0.hw,'h',h=>[(h.x0+h.x1)/2,h.y]);tag(W0.vw,'v',v=>[v.x,(v.y0+v.y1)/2]);tag(W0.fl,'f',f=>[f[0]+f[2]/2,f[1]+f[3]/2]);if(!dis)return;
 const gone=q=>{const id=q.id||'';const gk=id.slice(0,id.indexOf(':'));return dis[gk]&&dis[gk][id]};W0.hw=W0.hw.filter(q=>!gone(q));W0.vw=W0.vw.filter(q=>!gone(q));W0.fl=W0.fl.filter(q=>!gone(q));W0.objs=W0.objs.filter(q=>!gone(q))}
/* ---------- targets inside a building ---------- */
function dTargets(bi){const T=[];for(const o of W0.objs)if(o.b==bi&&D[o.t]&&!['hatch','ladder','rubble'].includes(o.t))T.push({k:'o',r:o,id:o.id,x:o.x,y:o.y,w:o.w,h:o.h,nm:NM[o.t]||o.t});
 for(const h of W0.hw){const cx=(h.x0+h.x1)/2;if(inBld(bi,cx,h.y,14))T.push({k:'h',r:h,id:h.id,x:h.x0,y:h.y-8,w:h.x1-h.x0,h:10,nm:h.h>=26?'바깥벽':'벽'})}
 for(const v of W0.vw){const cy=(v.y0+v.y1)/2;if(inBld(bi,v.x,cy,14))T.push({k:'v',r:v,id:v.id,x:v.x-4,y:v.y0,w:8,h:v.y1-v.y0,nm:v.top>=26?'바깥벽':'벽'})}
 for(const f of W0.fl){if(!FLMAT[f[4]])continue;const cx=f[0]+f[2]/2,cy=f[1]+f[3]/2;if(inBld(bi,cx,cy))T.push({k:'f',r:f,id:f.id,x:f[0],y:f[1],w:f[2],h:f[3],nm:'바닥',fl:1})}return T}
const rDist=(t,x,y)=>Math.hypot(Math.max(t.x-x,0,x-(t.x+t.w)),Math.max(t.y-y,0,y-(t.y+t.h)));
/* floors only come up once the furniture standing on them is gone */
function dNear(bi,n,rng){const p=S.p,T=dTargets(bi),objs=T.filter(t=>t.k=='o');const L=T.filter(t=>{if(t.fl&&objs.some(o=>o.x<t.x+t.w&&o.x+o.w>t.x&&o.y<t.y+t.h&&o.y+o.h>t.y))return false;return rDist(t,p.x,p.y)<=rng});
 L.sort((a,b)=>(a.fl?1:0)-(b.fl?1:0)||rDist(a,p.x,p.y)-rDist(b,p.x,p.y));return L.slice(0,n)}
let DMODE=null;const DH={};
function dmodeOn(){const p=S.p,bi=bldAt(p.x,p.y);if(bi<0)return;const b=W0.b[bi],need=DLV[b.kind],lv=toolLv();
 if(lv<need)return msg('🔨 '+b.name+' 해체에는 Lv'+need+' 도구('+NM2('dt'+need)+')가 필요해요 · 폭약이나 중장비는 모든 건물 가능');
 if(need>=2){const n=zInside(bi).length;if(n)return msg('🧟 '+b.name+' 안에 좀비 '+n+'마리가 남아 있어요 · 모두 처치해야 대형 건물을 해체할 수 있어요')}
 const d=DIS0(b.gk);if(d._tot==null)d._tot=dTargets(bi).length+Object.keys(d).filter(k=>k[0]!='_').length;
 DMODE={bi,gk:b.gk,lv,need,t:.2,kind:b.kind,name:b.name,gx:b.gx,gy:b.gy};msg(lv==1?'🔨 해체 모드 · 버튼을 누를 때마다 가까운 가구 · 바닥 · 벽을 두드려요':'⚙ '+NM2('dt'+lv)+' 켜짐 · 가까운 것부터 자동으로 해체해요 · 소음이 나요')}
function dmodeOff(t){DMODE=null;if(t)msg(t)}
function dHit(){if(!DMODE)return;const tool=DTOOL[DMODE.lv],L=dNear(DMODE.bi,tool.n,tool.rng);if(!L.length)return msg('🔨 손이 닿는 곳에 뜯을 것이 없어요 · 가까이 가세요');
 for(const t of L){if(!DMODE)break;const left=(DH[t.id]!=null?DH[t.id]:tgtHp(t))-tool.dmg;DH[t.id]=left;fx.push({k:'boom',x:t.x+t.w/2,y:t.y+t.h/2,r:12,l:.18,m:.18});
  if(left>0)s3Float(t.x+t.w/2,t.y-10,t.nm+' '+'▮'.repeat(left),'#e8d7a8');else dBreak(t)}
 noise(S.p.x,S.p.y,DNZ[tool==DTOOL[1]?1:tool==DTOOL[2]?2:3]);S.dHits=(S.dHits||0)+1}
function dBreak(t){const r=tgtDrop(t),d=DIS0(DMODE.gk);d[t.id]=1;delete DH[t.id];for(const k in r)if(r[k])invAdd(S.p,k,r[k]);
 s3Float(t.x+t.w/2,t.y-18,'🔨 '+t.nm+' → '+Object.entries(r).map(([k,v])=>NM2(k)+' '+v).join(' · '),'#ffd36a');
 const A=t.k=='o'?W0.objs:t.k=='h'?W0.hw:t.k=='v'?W0.vw:W0.fl,i=A.indexOf(t.r);if(i>=0)A.splice(i,1);infDerived();S.dBroke=(S.dBroke||0)+1;
 const left=dTargets(DMODE.bi),done=Object.keys(d).filter(k=>k[0]!='_').length,pct=done/Math.max(1,d._tot);
 if(DMODE.need>=2&&pct>=.5&&!d._up){d._up=1;dRise(DMODE.bi,8);msg('⚠ 지하에서 좀비가 올라오고 있습니다! · 소음을 듣고 주변 좀비가 몰려옵니다');noise(S.p.x,S.p.y,5)}
 if(!left.some(q=>q.k=='h'||q.k=='v')){const m=DMODE;DMODE=null;dCollapse(m,0)}}
function dRise(bi,n){const rs=W0.roofs.filter(r=>r.bi==bi);for(let i=0;i<n;i++){const rf=rs[Math.random()*rs.length|0],L=['crawler','civ1','sleeper','runner','civ2'];mk(rf.x+30+Math.random()*(rf.w-60),rf.y+30+Math.random()*(rf.h-60),{look:L[Math.random()*L.length|0],w:1})}}
/* the building is gone → rubble lot, maybe something underneath */
function dCollapse(d,keep,force){const ch=DSH[d.kind]||[0,0],r=Math.random();let sh=force==='none'?0:(force||(r<ch[1]?'bunker':r<ch[0]+ch[1]?'shelter':0));
 if(keep){const tot={};for(const t of dTargets(d.bi)){const q=tgtDrop(t);for(const k in q)tot[k]=(tot[k]||0)+q[k]}const g={};for(const k in tot){const n=Math.round(tot[k]*keep);if(n)g[k]=n}if(Object.keys(g).length)give(g)}
 const D=DM0();D[d.gk]={k:d.kind,sh,day:S.day};if(d.kind=='mil')D[(d.gx+1)+','+d.gy]={k:'milR',sh:0,day:S.day};
 s3Xp(40*(DLV[d.kind]||1),'철거');infRebuild();S.demoN=(S.demoN||0)+1;
 setTimeout(()=>msg(sh?(sh=='bunker'?'🪖 잔해 아래에서 지하 벙커를 발견했어요! · 입구로 내려가 보세요':'🕳 잔해 아래에서 지하 대피소를 발견했어요! · 입구로 내려가 보세요'):'🏚 '+d.name+' 철거 완료 · 빈터가 생겼어요 (전초기지를 지을 수 있어요)'),900);return sh}
/* ---------- whole building at once: explosives / bulldozer ---------- */
let DM=null;
function demoWhole(way){if(DM)return demoStop('철거를 멈췄어요');const p=S.p,bi=bldAt(p.x,p.y);if(bi<0)return;const b=W0.b[bi],need=DLV[b.kind],W=DWAY[way];
 if(!(p.inv[W.item]>0))return msg(W.name+': '+NM2(W.item)+'이(가) 필요해요');if(W.fuel&&(p.inv.fuel|0)<W.fuel)return msg('🚜 중장비 연료가 '+W.fuel+' 필요해요');
 if(need>=2){const n=zInside(bi).length;if(n)return msg('🧟 '+b.name+' 안에 좀비 '+n+'마리가 남아 있어요 · 모두 처치해야 대형 건물을 철거할 수 있어요')}
 if(way=='boom')invTake(p,'dx1',1);if(W.fuel)invTake(p,'fuel',W.fuel);DMODE=null;
 const rs=W0.roofs.filter(r=>r.bi==bi),cx=rs.reduce((a,r)=>a+r.x+r.w/2,0)/rs.length,cy=rs.reduce((a,r)=>a+r.y+r.h/2,0)/rs.length;
 DM={way,bi,gk:b.gk,kind:b.kind,name:b.name,need,T:W.T*(window.DSPEED||1),t:0,nz:0,up:need>=2?3:1e9,cx,cy,gx:b.gx,gy:b.gy};
 msg(way=='boom'?'💣 폭약 설치 · 10초 뒤 폭발 · 건물에서 멀리 떨어지세요!':'🚜 중장비로 '+b.name+' 밀기 시작 · 30초 · 가까이 있어야 해요'+(need>=2?' · ⚠ 지하에서 좀비가 올라올 수 있어요':''));noise(cx,cy,4)}
function demoStop(t){if(DM&&DM.way=='boom')return msg('💣 폭약은 이미 불이 붙었어요!');DM=null;msg(t)}
function demoUpd(dt){if(!DM)return;const p=S.p;if(!W0.b[DM.bi]||W0.b[DM.bi].gk!=DM.gk){DM=null;return}
 if(DM.way=='dozer'&&!inBld(DM.bi,p.x,p.y,150))return demoStop('🚜 중장비에서 멀어져 철거가 멈췄어요 (진행 '+Math.round(DM.t/DM.T*100)+'%)');
 DM.t+=dt;DM.nz-=dt;if(DM.nz<=0){DM.nz=1.5;noise(DM.cx,DM.cy,DWAY[DM.way].nz);if(DM.way=='dozer'){if(typeof S4!='undefined')S4.shake=Math.max(S4.shake||0,.12);fx.push({k:'boom',x:DM.cx+(Math.random()-.5)*300,y:DM.cy+(Math.random()-.5)*200,r:30,l:.25,m:.25})}
  else if(DM.T-DM.t<6)s3Float(DM.cx,DM.cy-40,'💣 '+Math.ceil(DM.T-DM.t),'#ff6a5a')}
 if(DM.way=='dozer'){DM.up-=dt;if(DM.up<=0){DM.up=4;dRise(DM.bi,DM.need==3?3:2);if(!DM.upMsg){DM.upMsg=1;msg('⚠ 지하에서 좀비가 올라오고 있습니다!')}}}
 if(DM.t>=DM.T){const d=DM;DM=null;if(d.way=='boom'){for(let i=0;i<6;i++)fx.push({k:'boom',x:d.cx+(Math.random()-.5)*400,y:d.cy+(Math.random()-.5)*260,r:90,l:.6,m:.6});if(typeof S4!='undefined')S4.shake=.8;
   for(const z of Z)if(inBld(d.bi,z.x,z.y,40))z.hp=0;if(inBld(d.bi,p.x,p.y,60)){p.hp-=45;msg('💥 폭발에 휘말렸어요!')}noise(d.cx,d.cy,5);if(d.need>=2)setTimeout(()=>{dRise(d.bi,6);msg('⚠ 무너진 건물 아래에서 좀비가 기어 나옵니다!')},1200)}
  dCollapse(d,DWAY[d.way].keep)}}
/* legacy name kept for the sample's earlier scenes */
function demoDone(force){const d=DM||DMODE;DM=null;DMODE=null;return dCollapse(d,0,force)}
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
{const _bw=buildWorld;buildWorld=function(){if(DUN)return buildDungeon();const w=_bw();disTag();return w}}
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
/* ---------- context buttons ---------- */
function dmCtx(){const p=S.p,B=[];
 if(DM){B.push({t:(DM.way=='boom'?'💣 폭발까지 '+Math.ceil(DM.T-DM.t)+'초':'🚜 중장비 '+Math.round(DM.t/DM.T*100)+'% · 멈추기'),f:()=>demoStop('철거를 멈췄어요'),pr:DM.t/DM.T});return B}
 if(DUN){const l=W0.objs.find(o=>o.t=='ladder');if(l&&Math.hypot(l.x+14-p.x,l.y+10-p.y)<60)B.push({t:'⬆ 지상으로',f:dunExit});return B}
 const h=W0.objs.find(o=>o.t=='hatch'&&Math.hypot(o.x+26-p.x,o.y+20-p.y)<70);if(h){B.push({t:h.sh=='bunker'?'🪖 지하 벙커로 내려가기':'🕳 지하 대피소로 내려가기',f:()=>dunEnter(h)});return B}
 const bi=bldAt(p.x,p.y);if(bi<0){if(DMODE)dmodeOff('🔨 건물을 벗어나 해체 모드를 껐어요');return B}
 const b=W0.b[bi],need=DLV[b.kind],lv=toolLv();
 if(DMODE&&DMODE.bi==bi){const d=DIS0(b.gk),pct=Math.round(Object.keys(d).filter(k=>k[0]!='_').length/Math.max(1,d._tot)*100);
  if(DMODE.lv==1){const t=dNear(bi,1,DTOOL[1].rng)[0];B.push({t:'🔨 두드리기'+(t?' · '+t.nm:' · 가까이 가세요'),f:dHit,pr:pct/100,big:1})}else B.push({t:'⚙ 자동 해체 중 '+pct+'%',f:null,pr:pct/100,big:1});
  B.push({t:'해체 끄기',f:()=>dmodeOff('해체 모드를 껐어요'),sm:1});return B}
 B.push({t:'🔨 '+b.name+' 해체 · Lv'+need+(lv<need?' 🔒':''),f:dmodeOn,off:lv<need});
 if(p.inv.dx1>0)B.push({t:'💣 폭파',f:()=>demoWhole('boom'),sm:1});if(p.inv.dx2>0)B.push({t:'🚜 중장비',f:()=>demoWhole('dozer'),sm:1});return B}
let DMC=[];
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!S)return;demoUpd(dt);
  if(DMODE&&DMODE.lv>=2){DMODE.t-=dt;if(DMODE.t<=0){DMODE.t=DTOOL[DMODE.lv].auto;if(W0.b[DMODE.bi]&&W0.b[DMODE.bi].gk==DMODE.gk)dHit();else DMODE=null}}
  if(DMODE&&(!W0.b[DMODE.bi]||W0.b[DMODE.bi].gk!=DMODE.gk))DMODE=null;
  const c=dmCtx(),el=$('dmBox');if(!el)return;const key=c.map(q=>q.t+(q.off?1:0)).join('|');if(key!=el.dataset.k){el.dataset.k=key;DMC=c;el.innerHTML=c.map((q,i)=>'<button data-i="'+i+'" class="'+(q.off?'off ':'')+(q.sm?'sm ':'')+(q.big?'big':'')+'">'+q.t+(q.pr!=null?'<i style="width:'+Math.round(q.pr*100)+'%"></i>':'')+'</button>').join('')}else DMC=c}}
document.body.insertAdjacentHTML('beforeend','<div id="dmBox"></div>');$('c').insertAdjacentHTML('afterend','<div id="dunV"></div>');
$('dmBox').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();const b=e.target.closest('button');if(!b)return;const q=DMC[+b.dataset.i];if(q&&q.f)q.f()});
document.head.insertAdjacentHTML('beforeend',`<style>
#dmBox{position:fixed;right:12px;bottom:calc(env(safe-area-inset-bottom,0px) + 292px);z-index:4;display:flex;flex-direction:column;align-items:flex-end;gap:5px;max-width:70vw}
#dmBox button{position:relative;padding:8px 14px;font-size:13px;border-radius:12px;background:#3a2a14ee;border:1px solid #e0b03a;width:auto;max-width:70vw;overflow:hidden}#dmBox button.big{padding:12px 18px;font-size:15px}#dmBox button.sm{padding:5px 10px;font-size:12px;background:#222a;border-color:#ffffff44}
#dmBox button.off{opacity:.6;border-color:#888}#dmBox button i{position:absolute;left:0;bottom:0;height:3px;background:#ffd36a}
#dunV{display:none;position:fixed;inset:0;pointer-events:none;background:radial-gradient(circle at 50% 50%,transparent 80px,#000c 200px,#000f 380px)}
body[data-dun] #dunV{display:block}body[data-dun="bunker"] #dunV{background:radial-gradient(circle at 50% 50%,transparent 80px,#1a0505d0 200px,#000f 380px)}
</style>`);
