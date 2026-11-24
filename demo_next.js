/* PROJECT LEGACY — sample: demolition (tool levels 1-3), noise, monsters rising from below, and shelters / bunkers
   found under the rubble that open into a small dungeon. Endless city only. Loaded after enh_next.js. */
'use strict';
/* ---------- tools ----------
   Lv1: equip and swing (hammer for furniture and walls, pry bar for floors) · Lv2/Lv3: power tools that take apart
   whatever is inside their reach while you walk about (shown as a ring) · explosives / bulldozer: whole building at once */
{const addW=(id,nm,rar,st,ds,draw)=>{if(W_BY[id])return;const w=[id,nm,'m',rar,st,ds,'철거 도구'];WEAPONS.push(w);W_BY[id]=w;IC[id]=draw;if(I_BY[id]){const k=ITEMS.indexOf(I_BY[id]);if(k>=0)ITEMS.splice(k,1);delete I_BY[id]}};
 const add=(id,nm,rar,wt,ds,draw)=>{if(I_BY[id])return;const it=[id,nm,'m',rar,wt,ds];ITEMS.push(it);I_BY[id]=it;IC[id]=draw};
 addW('dt1','철거 해머','u',{d:16,cd:.5,r:46,dur:300,nz:2,wt:2},'해체 Lv1 · 장착하고 공격 버튼으로 가구 · 벽을 때려 부숴요 (바닥은 못 뜯음)',()=>{R('#6b4a2e',10,9,3,13);R('#2a2e33',4,4,15,6);R('#8a9096',4,4,15,2);R('#1d1714',4,9,15,1)});
 addW('dt1f','바닥 지렛대','u',{d:12,cd:.45,r:42,dur:300,nz:1,wt:1.5},'해체 Lv1 · 바닥 전용 · 장착하고 공격 버튼으로 나무 바닥 · 타일 · 카펫을 뜯어요',()=>{R('#8a9096',5,4,3,16);R('#8a9096',5,18,9,3);R('#c9a42a',5,4,3,4);R('#5a5f66',13,18,3,3)});
 addW('dt2','전동 드릴 · 그라인더','r',{d:20,cd:.45,r:44,dur:600,nz:3,wt:4},'해체 Lv2 · 장착하고 걸어 다니면 사거리(고리) 안의 가구 · 바닥 · 벽이 저절로 뜯겨요',()=>{R('#c9a42a',4,7,12,7);R('#e0bc3a',4,7,12,2);R('#2a2e33',8,14,4,8);R('#8a9096',16,9,6,3);R('#1d1714',2,9,2,3)});
 addW('dt3','유압 브레이커','e',{d:30,cd:.6,r:48,dur:1200,nz:3,wt:6},'해체 Lv3 · 사거리가 더 넓고 빠르며 한 번에 두 곳 · 대형 건물까지',()=>{R('#a8322a',6,3,10,9);R('#c84a3a',6,3,10,2);R('#2a2e33',9,12,4,6);R('#8a9096',10,18,2,5);R('#2a2e33',3,6,3,4);R('#2a2e33',16,6,3,4)});
 add('dx1','폭약','e',1.5,'건물 통째로 폭파 · 10초 뒤 무너짐 · 재료는 10%만 남아요 · 1회용',()=>{for(let i=0;i<3;i++){R('#a8322a',4+i*6,6,5,14);R('#c84a3a',4+i*6,6,5,2)}R('#2a2e33',4,12,17,2);R('#d9b52a',10,2,2,5)});
 add('dx2','불도저 열쇠','e',.1,'세워 둔 불도저를 탈 수 있어요 · 타고 밀면 벽 · 가구가 무너지고 재료 절반을 얻어요 · 연료 사용',()=>{R('#d9a52a',4,9,15,8);R('#e8bc3a',4,9,15,2);R('#2a2e33',5,17,13,4);R('#5a5f66',2,6,3,13);R('#1d1714',9,5,6,4)})}
/* what each tool does: lv · which pieces · reach · automatic period · pieces per tick · damage per hit */
const DT={dt1:{lv:1,mode:'obj',rng:50,dmg:1,n:1},dt1f:{lv:1,mode:'floor',rng:56,dmg:1,n:0},dt2:{lv:2,mode:'all',rng:85,auto:.45,dmg:2,n:1,ft:3},dt3:{lv:3,mode:'all',rng:120,auto:.3,dmg:3,n:2,ft:6}};
const DLV={houses:1,apt:1,church:1,mart:1,school:2,hard:2,fire:2,ware:2,clinic:3,police:3,mil:3,lab:3};
const DNZ=[0,2,3,3];
/* whole-building methods */
const DWAY={boom:{T:10,keep:.1,nz:5,name:'💣 폭파',item:'dx1'}};
/* chance of finding something under the rubble: [shelter, bunker] */
const DSH={houses:[.15,0],apt:[.15,0],church:[.15,0],mart:[.15,0],school:[.25,0],hard:[.25,0],fire:[.25,0],ware:[.25,0],clinic:[.2,.15],police:[.2,.15],mil:[0,.5],lab:[0,.5]};
const toolLv=()=>S?(S.p.inv.dt3>0?3:S.p.inv.dt2>0?2:(S.p.inv.dt1>0||S.p.inv.dt1f>0)?1:0):0;
const curTool=()=>{if(!S)return null;const id=actW(S.p);return DT[id]?Object.assign({id},DT[id]):null};
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
 const gone=q=>{const id=q.id||'';const gk=id.slice(0,id.indexOf(':'));return dis[gk]&&dis[gk][id]};W0.hw=W0.hw.filter(q=>!gone(q));W0.vw=W0.vw.filter(q=>!gone(q));W0.fl=W0.fl.filter(q=>!gone(q));W0.objs=W0.objs.filter(q=>!gone(q))
 const FB={};for(const f of W0.fl)FB[f.id]=f;for(const gk in dis){if(!gk.includes(','))continue;for(const k in dis[gk]){if(k[0]!='T')continue;const m=/^T:(.+):(\d+),(\d+)$/.exec(k);if(!m)continue;const f=FB[m[1]];if(!f)continue;const x=f[0]+(+m[2])*FT,y=f[1]+(+m[3])*FT;tileDec(x,y,Math.min(FT,f[0]+f[2]-x),Math.min(FT,f[1]+f[3]-y))}}}
/* ---------- targets: inside a building, or loose junk on a rubble lot ---------- */
function dTargets(bi){const T=[];for(const o of W0.objs)if(o.b==bi&&D[o.t]&&!['hatch','ladder','rubble'].includes(o.t))T.push({k:'o',r:o,id:o.id,x:o.x,y:o.y,w:o.w,h:o.h,nm:NM[o.t]||o.t});
 for(const h of W0.hw){const cx=(h.x0+h.x1)/2;if(inBld(bi,cx,h.y,14))T.push({k:'h',r:h,id:h.id,x:h.x0,y:h.y-8,w:h.x1-h.x0,h:10,nm:h.h>=26?'바깥벽':'벽'})}
 for(const v of W0.vw){const cy=(v.y0+v.y1)/2;if(inBld(bi,v.x,cy,14))T.push({k:'v',r:v,id:v.id,x:v.x-4,y:v.y0,w:8,h:v.y1-v.y0,nm:v.top>=26?'바깥벽':'벽'})}
 return T}
const LOTJUNK=['rubble','barrel','crate'];
function lotTargets(gk){const T=[];for(const o of W0.objs){if(!LOTJUNK.includes(o.t))continue;if(gOf(o.x,o.y).join()!=gk)continue;const b=W0.b[o.b];if(!b||!['lot','outpost'].includes(b.kind))continue;T.push({k:'o',r:o,id:o.id,x:o.x,y:o.y,w:o.w,h:o.h,nm:o.ruin?'잔해 상자':NM[o.t]||o.t,ruin:o.ruin})}return T}
/* where am I: a building (bi ≥ 0) or a lot (bi = -1) */
function dZone(){const p=S.p,bi=bldAt(p.x,p.y);if(bi>=0){const b=W0.b[bi];return{bi,gk:b.gk,need:DLV[b.kind],kind:b.kind,name:b.name,gx:b.gx,gy:b.gy,T:()=>dTargets(bi)}}
 const[gx,gy]=gOf(p.x,p.y),gk=gx+','+gy;let lot=false;try{lot=!!(S.inf.demo&&S.inf.demo[gk])}catch(e){}if(!lot)return null;return{bi:-1,gk,need:1,kind:'lot',name:'빈터',gx,gy,T:()=>lotTargets(gk)}}
const rDist=(t,x,y)=>Math.hypot(Math.max(t.x-x,0,x-(t.x+t.w)),Math.max(t.y-y,0,y-(t.y+t.h)));
/* floors only come up once the furniture standing on them is gone */
function dNear(z,tool,n,rng){const p=S.p;if(tool.mode=='floor')return[];const L=z.T().filter(t=>rDist(t,p.x,p.y)<=rng);
 L.sort((a,b)=>rDist(a,p.x,p.y)-rDist(b,p.x,p.y));return L.slice(0,n)}
const DH={};let DMODE=null,DWARN=0;
/* ---------- floors come up tile by tile (32 px) — only the tiles inside the tool's circle, never under furniture ---------- */
const FT=32,FTGET=.25,DFR={};
function fTiles(z,cx,cy,rng,max){if(!z||z.bi<0)return[];const out=[],d=S.inf.dis&&S.inf.dis[z.gk]||{},solid=W0.objs.filter(o=>!FLAT[o.t]&&o.b==z.bi);
 for(const f of W0.fl){const m=FLMAT[f[4]];if(!m)continue;if(f[0]>cx+rng||f[0]+f[2]<cx-rng||f[1]>cy+rng||f[1]+f[3]<cy-rng)continue;if(!inBld(z.bi,f[0]+f[2]/2,f[1]+f[3]/2))continue;
  const x0=Math.max(0,Math.floor((cx-rng-f[0])/FT)),x1=Math.min(Math.ceil(f[2]/FT)-1,Math.floor((cx+rng-f[0])/FT)),y0=Math.max(0,Math.floor((cy-rng-f[1])/FT)),y1=Math.min(Math.ceil(f[3]/FT)-1,Math.floor((cy+rng-f[1])/FT));
  for(let ty=y0;ty<=y1;ty++)for(let tx=x0;tx<=x1;tx++){const x=f[0]+tx*FT,y=f[1]+ty*FT,w=Math.min(FT,f[0]+f[2]-x),h=Math.min(FT,f[1]+f[3]-y);if(Math.hypot(x+w/2-cx,y+h/2-cy)>rng)continue;
   const key='T:'+f.id+':'+tx+','+ty;if(d[key])continue;if(solid.some(o=>o.x<x+w&&o.x+o.w>x&&o.y<y+h&&o.y+o.h>y))continue;out.push({f,key,x,y,w,h,m});if(out.length>=max)return out}}return out}
function tileDec(x,y,w,h){W0.dec.push({x,y,w,h,ft:1,f:()=>{R('#4d453b',x,y,w,h);R('#5d5447',x+1,y+1,w-2,h-2);R('#3e372f',x+(w*.3|0),y+(h*.4|0),3,2);R('#6b6152',x+(w*.6|0),y+(h*.7|0),2,2);R('#2e2924',x,y+h-1,w,1)}})}
function dFloor(z,cx,cy,rng,max){const L=fTiles(z,cx,cy,rng,max);if(!L.length)return 0;const d=DIS0(z.gk),got={};for(const t of L){d[t.key]=1;tileDec(t.x,t.y,t.w,t.h);DFR[t.m]=(DFR[t.m]||0)+FTGET*(t.w*t.h)/(FT*FT);const n=Math.floor(DFR[t.m]+1e-9);if(n){DFR[t.m]-=n;invAdd(S.p,t.m,n);got[t.m]=(got[t.m]||0)+n}}
 if(typeof CHC!='undefined')CHC.clear();fx.push({k:'boom',x:cx,y:cy,r:rng*.6,l:.15,m:.15});s3Float(cx,cy-20,'🪛 바닥 '+L.length+'칸'+(Object.keys(got).length?' → '+Object.entries(got).map(([k,v])=>NM2(k)+' '+v).join(' · '):''),'#e8d7a8');S.dTiles=(S.dTiles||0)+L.length;return L.length}
/* can this tool work here right now? */
function dReady(z,tool,quiet){if(!z||!tool)return false;if(tool.lv<z.need){if(!quiet&&DWARN<=0){DWARN=2;msg('🔨 '+z.name+' 해체에는 Lv'+z.need+' 도구가 필요해요 · 폭약이나 중장비는 모든 건물 가능')}return false}
 if(z.need>=2&&z.bi>=0){const n=zInside(z.bi).length;if(n){if(!quiet&&DWARN<=0){DWARN=2;msg('🧟 '+z.name+' 안에 좀비 '+n+'마리가 남아 있어요 · 모두 처치해야 대형 건물을 해체할 수 있어요')}return false}}return true}
/* one swing / one tick of a power tool */
function dHitWith(tool,z){const p0=S.p;let fl=0;if(tool.mode!='obj')fl=dFloor(z,p0.x,p0.y,tool.rng,tool.mode=='floor'?999:tool.ft||0);const L=dNear(z,tool,tool.n,tool.rng);if(!L.length){if(fl){noise(p0.x,p0.y,DNZ[tool.lv]);S.dHits=(S.dHits||0)+1}return fl>0}const d=DIS0(z.gk);if(d._tot==null)d._tot=z.T().length+Object.keys(d).filter(k=>k[0]!='_').length;
 for(const t of L){const left=(DH[t.id]!=null?DH[t.id]:tgtHp(t))-tool.dmg;DH[t.id]=left;fx.push({k:'boom',x:t.x+t.w/2,y:t.y+t.h/2,r:12,l:.18,m:.18});
  if(left>0)s3Float(t.x+t.w/2,t.y-10,t.nm+' '+'▮'.repeat(left),'#e8d7a8');else if(dBreak(t,z))break}
 noise(S.p.x,S.p.y,DNZ[tool.lv]);S.dHits=(S.dHits||0)+1;const p=S.p;if(tool.id&&p.dur){p.dur[tool.id]=(p.dur[tool.id]??W_BY[tool.id][4].dur)-1;if(p.dur[tool.id]<=0){delete p.dur[tool.id];invTake(p,tool.id,1);msg('💔 '+NM2(tool.id)+' 이(가) 닳아 부서졌어요')}}return true}
/* returns true when the building came down */
function dBreak(t,z){const r=tgtDrop(t),d=DIS0(z.gk);d[t.id]=1;delete DH[t.id];if(t.ruin&&S.inf.ruin&&S.inf.ruin[z.gk]){Object.assign(r,{});for(const k in S.inf.ruin[z.gk])r[k]=(r[k]||0)+S.inf.ruin[z.gk][k];delete S.inf.ruin[z.gk]}
 if(t.r.t=='rubble')Object.assign(r,{scrap:2,wood:1,cement:1});for(const k in r)if(r[k])invAdd(S.p,k,r[k]);
 s3Float(t.x+t.w/2,t.y-18,'🔨 '+t.nm+' → '+Object.entries(r).map(([k,v])=>NM2(k)+' '+v).join(' · '),'#ffd36a');
 const A=t.k=='o'?W0.objs:t.k=='h'?W0.hw:t.k=='v'?W0.vw:W0.fl,i=A.indexOf(t.r);if(i>=0)A.splice(i,1);infDerived();S.dBroke=(S.dBroke||0)+1;if(z.bi<0)return false;
 const left=z.T(),done=Object.keys(d).filter(k=>k[0]!='_').length,pct=done/Math.max(1,d._tot);
 if(z.need>=2&&pct>=.5&&!d._up){d._up=1;dRise(z.bi,8);msg('⚠ 지하에서 좀비가 올라오고 있습니다! · 소음을 듣고 주변 좀비가 몰려옵니다');noise(S.p.x,S.p.y,5)}
 if(!left.some(q=>q.k=='h'||q.k=='v')){dCollapse(z,0);return true}return false}
/* Lv1: the attack button swings at furniture / walls (hammer) or floors (pry bar) when no zombie is in reach */
{const _ga=gearAct;gearAct=function(){const p=S.p,tool=curTool();if(tool&&!tool.auto&&!(p.ac>0)&&!S.dr){const s=W_BY[tool.id][4],[zz]=nearestTarget(p,s.r);
   if(!zz){const z=dZone();if(z&&dReady(z,tool)){if(dHitWith(tool,z)){p.ac=s.cd;fx.push({k:'sw',x:p.x,y:p.y,fx:p.fx,fy:p.fy,l:.15});return}}}}return _ga.apply(this,arguments)}}
/* kept for older scenes / tests: one hit with whatever tool you hold */
function dHit(){const tool=curTool()||Object.assign({id:'dt1'},DT.dt1),z=dZone();if(z&&dReady(z,tool))dHitWith(tool,z)}
function dRise(bi,n){const rs=W0.roofs.filter(r=>r.bi==bi);for(let i=0;i<n;i++){const rf=rs[Math.random()*rs.length|0],L=['crawler','civ1','sleeper','runner','civ2'];mk(rf.x+30+Math.random()*(rf.w-60),rf.y+30+Math.random()*(rf.h-60),{look:L[Math.random()*L.length|0],w:1})}}
/* the building is gone → rubble lot, maybe something underneath */
function dCollapse(d,keep,force){const ch=DSH[d.kind]||[0,0],r=Math.random();let sh=force==='none'?0:(force||(r<ch[1]?'bunker':r<ch[0]+ch[1]?'shelter':0));
 if(keep){const tot={};for(const t of dTargets(d.bi)){const q=tgtDrop(t);for(const k in q)tot[k]=(tot[k]||0)+q[k]}const g={};for(const k in tot){const n=Math.round(tot[k]*keep);if(n)g[k]=n}if(Object.keys(g).length)give(g)}
 const D=DM0();D[d.gk]={k:d.kind,sh,day:S.day};if(S.inf.dis){delete S.inf.dis[d.gk];if(d.kind=='mil')delete S.inf.dis[(d.gx+1)+','+d.gy]}if(d.kind=='mil')D[(d.gx+1)+','+d.gy]={k:'milR',sh:0,day:S.day};
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
/* ---------- bulldozer: a vehicle you drive; its blade flattens walls and furniture in front of it ---------- */
P('dozer','불도저',null,o=>dozerD(o.x+o.w/2,o.y+o.h/2,o.dir||0),true);
/* drawn facing +x, then turned to the nearest of 8 directions */
function dozerD(cx,cy,dir){const a=Math.round(dir/(Math.PI/4))*(Math.PI/4);shd(cx-30,cy-14,60,32,.3);g.save();g.translate(Math.round(cx),Math.round(cy-8));g.rotate(a);
 R('#1d1714',-30,-22,60,9);R('#1d1714',-30,13,60,9);for(let i=0;i<7;i++){R('#3a3a3a',-28+i*8,-21,5,7);R('#3a3a3a',-28+i*8,14,5,7)}
 R('#1d1714',-25,-14,46,28);R('#d9a52a',-24,-13,44,26);R('#e8bc3a',-24,-13,44,4);R('#b8861e',-24,9,44,4);
 R('#1d1714',-20,-9,18,18);R('#7fb0c8',-18,-7,14,14);R('#a8d0e0',-18,-7,14,3);R('#5a5f66',-2,-3,8,6);
 R('#1d1714',21,-4,8,8);R('#5a5f66',22,-3,6,6);R('#1d1714',28,-27,10,54);R('#8a9096',29,-26,8,52);R('#b8bec4',34,-26,3,52);g.restore()}
let DOZ=null;const DZSPD=.42;
function dozerObj(){return W0.objs.find(o=>o.t=='dozer')}
function dozerBoard(){const o=dozerObj(),p=S.p;if(!o)return;if(!(p.inv.dx2>0))return msg('🚜 불도저 열쇠가 필요해요');if((p.inv.fuel|0)<=0)return msg('🚜 연료가 필요해요');
 const i=W0.objs.indexOf(o);W0.objs.splice(i,1);infDerived();delete S.inf.dz;DOZ={car:S.car,x:o.x+o.w/2,y:o.y+o.h/2,dir:o.dir||0,lx:0,ly:0,cd:0};S.car={x:DOZ.x,y:DOZ.y,w:60,h:30,c:'#d9a52a',dz:1};S.dr=1;p.x=DOZ.x;p.y=DOZ.y;DOZ.lx=p.x;DOZ.ly=p.y;
 msg('🚜 불도저 운전 · 벽과 가구를 향해 밀고 들어가면 무너뜨려요 (재료 절반) · 내리려면 [상호작용]')}
function dozerPark(){const c=S.car,[gx,gy]=gOf(c.x,c.y),[ox,oy]=bo(gx-OGX,gy-OGY);S.inf.dz={gk:gx+','+gy,rx:Math.round(c.x-ox),ry:Math.round(c.y-oy),dir:DOZ.dir};S.car=DOZ.car;DOZ=null;infRebuild();msg('🚜 불도저에서 내렸어요')}
{const _cd=carD;carD=function(x,y,w,h,c,rust){if(DOZ&&S&&S.car&&S.car.dz&&Math.abs(x+w/2-S.car.x)<2&&Math.abs(y+h/2-S.car.y)<2)return dozerD(S.car.x,S.car.y,DOZ.dir);return _cd.apply(this,arguments)}}
/* the parked dozer is a world object in its block */
{const _b3=buildWorld;buildWorld=function(){const w=_b3();let dz=null;try{dz=!DUN&&S&&S.inf&&S.inf.dz}catch(e){}if(dz){const[gx,gy]=dz.gk.split(',').map(Number),c=gx-OGX,r=gy-OGY;if(c>=0&&r>=0&&c<NBX&&r<NBY){const[ox,oy]=bo(c,r);W0.objs.push({t:'dozer',x:ox+dz.rx-30,y:oy+dz.ry-15,w:60,h:30,dir:dz.dir,id:'dozer'})}}return w}}
{const _sh=infShift;infShift=function(dc,dr,q){const c0=DOZ&&DOZ.car;_sh(dc,dr,q);if(c0&&(dc||dr)){c0.x-=dc*PX;c0.y-=dr*PY}}}
{const _sv2=save;save=function(){if(DOZ&&S){const c=S.car,dr=S.dr;S.car=DOZ.car;S.dr=0;try{return _sv2.apply(this,arguments)}finally{S.car=c;S.dr=dr}}return _sv2.apply(this,arguments)}}
const DZW={};
function dozerTick(dt){if(!DOZ)return;const p=S.p,c=S.car;if(!S.dr){dozerPark();return}
 /* slower than a car */
 const mx=c.x-DOZ.lx,my=c.y-DOZ.ly;if(Math.abs(mx)+Math.abs(my)>0.01&&Math.abs(mx)+Math.abs(my)<200){c.x=DOZ.lx+mx*DZSPD;c.y=DOZ.ly+my*DZSPD;p.x=c.x;p.y=c.y}
 const m=Math.hypot(jx,jy);if(m>.1)DOZ.dir=Math.atan2(jy,jx);DOZ.lx=c.x;DOZ.ly=c.y;DOZ.cd-=dt;if(m<.1||DOZ.cd>0)return;DOZ.cd=.25;
 /* blade: 56 x 30 box in front */
 const ux=Math.cos(DOZ.dir),uy=Math.sin(DOZ.dir),bx=c.x+ux*40,by=c.y+uy*40,blade={x:bx-30,y:by-24,w:60,h:48};let hit=0,rose=0;
 const zones=new Map();const bi=bldAt(bx,by);if(bi>=0){const b=W0.b[bi];zones.set(bi,{bi,gk:b.gk,need:DLV[b.kind],kind:b.kind,name:b.name,gx:b.gx,gy:b.gy,T:()=>dTargets(bi)})}
 else{const z0=(()=>{const[gx,gy]=gOf(bx,by),gk=gx+','+gy;return S.inf.demo&&S.inf.demo[gk]?{bi:-1,gk,need:1,kind:'lot',name:'빈터',gx,gy,T:()=>lotTargets(gk)}:null})();if(z0)zones.set(-1,z0);
  for(const r of W0.roofs)if(blade.x<r.x+r.w&&blade.x+blade.w>r.x&&blade.y<r.y+r.h&&blade.y+blade.h>r.y){const b=W0.b[r.bi];if(b&&DLV[b.kind]&&!zones.has(r.bi))zones.set(r.bi,{bi:r.bi,gk:b.gk,need:DLV[b.kind],kind:b.kind,name:b.name,gx:b.gx,gy:b.gy,T:()=>dTargets(r.bi)})}}
 for(const z of zones.values()){if(z.need>=2&&z.bi>=0&&zInside(z.bi).length){if(DWARN<=0){DWARN=2.5;msg('🧟 '+z.name+' 안에 좀비가 남아 있어요 · 모두 처치해야 불도저로 밀 수 있어요')}continue}
  const T=z.T().filter(t=>t.x<blade.x+blade.w&&t.x+t.w>blade.x&&t.y<blade.y+blade.h&&t.y+t.h>blade.y).slice(0,3);
  for(const t of T){const left=(DH[t.id]!=null?DH[t.id]:tgtHp(t))-6;DH[t.id]=left;hit++;if(left<=0){const r=tgtDrop(t),half={};for(const k in r){const n=Math.floor(r[k]/2+Math.random()*.99*(r[k]%2));if(n)half[k]=n}
     const d=DIS0(z.gk);if(d._tot==null)d._tot=z.T().length+Object.keys(d).filter(k=>k[0]!='_').length;d[t.id]=1;delete DH[t.id];for(const k in half)invAdd(p,k,half[k]);s3Float(t.x+t.w/2,t.y-16,'🚜 '+t.nm+(Object.keys(half).length?' → '+Object.entries(half).map(([k,v])=>NM2(k)+' '+v).join(' · '):''),'#ffd36a');
     const A=t.k=='o'?W0.objs:t.k=='h'?W0.hw:W0.vw,i=A.indexOf(t.r);if(i>=0)A.splice(i,1);infDerived();S.dzBroke=(S.dzBroke||0)+1;
     if(z.bi>=0){const pct=Object.keys(d).filter(k=>k[0]!='_').length/Math.max(1,d._tot);if(z.need>=2&&pct>=.5&&!d._up){d._up=1;dRise(z.bi,8);msg('⚠ 지하에서 좀비가 올라오고 있습니다! · 소음을 듣고 주변 좀비가 몰려옵니다')}
      if(!z.T().some(q=>q.k=='h'||q.k=='v')){const cx=c.x,cy=c.y;dCollapse(z,0);c.x=cx;c.y=cy;p.x=cx;p.y=cy;DOZ.lx=cx;DOZ.ly=cy;return}}}}}
 if(hit){noise(c.x,c.y,4);if(typeof S4!='undefined')S4.shake=Math.max(S4.shake||0,.1);fx.push({k:'boom',x:bx,y:by,r:22,l:.2,m:.2});p.inv.fuel=Math.max(0,(p.inv.fuel||0)-.05)}}
/* ---------- context buttons ---------- */
function dmCtx(){const p=S.p,B=[];if(DOZ){B.push({t:'🚜 불도저 운전 중 · 앞을 밀어서 철거 · 내리기 = [상호작용]',f:null,info:1});return B}{const o=dozerObj();if(o&&!S.dr&&Math.hypot(o.x+30-p.x,o.y+15-p.y)<70){B.push({t:'🚜 불도저 타기'+(p.inv.dx2>0?'':' · 열쇠 필요'),f:dozerBoard,off:!(p.inv.dx2>0),dz:1,sm:1})}}
 if(DM){B.push({t:(DM.way=='boom'?'💣 폭발까지 '+Math.ceil(DM.T-DM.t)+'초':'🚜 중장비 '+Math.round(DM.t/DM.T*100)+'% · 멈추기'),f:()=>demoStop('철거를 멈췄어요'),pr:DM.t/DM.T});return B}
 if(DUN){const l=W0.objs.find(o=>o.t=='ladder');if(l&&Math.hypot(l.x+14-p.x,l.y+10-p.y)<60)B.push({t:'⬆ 지상으로',f:dunExit});return B}
 const h=W0.objs.find(o=>o.t=='hatch'&&Math.hypot(o.x+26-p.x,o.y+20-p.y)<70);if(h){B.push({t:h.sh=='bunker'?'🪖 지하 벙커로 내려가기':'🕳 지하 대피소로 내려가기',f:()=>dunEnter(h)});return B}
 const bi=bldAt(p.x,p.y);if(bi<0)return B;const b=W0.b[bi],need=DLV[b.kind],tool=curTool(),d=S.inf.dis&&S.inf.dis[b.gk],pct=d&&d._tot?Math.round(Object.keys(d).filter(k=>k[0]!='_').length/d._tot*100):0;
 if(tool)B.push({t:(tool.auto?'⚙ ':'🔨 ')+NM2(tool.id)+(tool.lv<need?' · Lv'+need+' 필요 🔒':tool.auto?' · 고리 안 자동 해체':' · 공격 버튼으로 '+(tool.mode=='floor'?'원 안 바닥':'가구·벽'))+(pct?' · '+pct+'%':''),f:null,off:tool.lv<need,pr:pct?pct/100:null,info:1});
 if(p.inv.dx1>0)B.push({t:'💣 폭파',f:()=>demoWhole('boom'),sm:1});return B}
let DMC=[],DAT=0;
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!S)return;demoUpd(dt);DWARN-=dt;dozerTick(dt);
  const tool=curTool();if(tool&&tool.auto&&!DUN&&!S.dr){DAT-=dt;if(DAT<=0){DAT=tool.auto;const z=dZone();if(z&&dReady(z,tool,true))dHitWith(tool,z)}}
  const c=dmCtx(),el=$('dmBox');if(!el)return;const key=c.map(q=>q.t+(q.off?1:0)).join('|');if(key!=el.dataset.k){el.dataset.k=key;DMC=c;el.innerHTML=c.map((q,i)=>'<button data-i="'+i+'" class="'+(q.off?'off ':'')+(q.sm?'sm ':'')+(q.info?'info ':'')+(q.big?'big':'')+'">'+q.t+(q.pr!=null?'<i style="width:'+Math.round(q.pr*100)+'%"></i>':'')+'</button>').join('')}else DMC=c}}
document.body.insertAdjacentHTML('beforeend','<div id="dmBox"></div>');$('c').insertAdjacentHTML('afterend','<canvas id="ovl"></canvas><div id="dunV"></div>');
$('dmBox').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();const b=e.target.closest('button');if(!b)return;const q=DMC[+b.dataset.i];if(q&&q.f)q.f()});
/* ---------- overlay: tool reach ring, pieces in reach, turret arcs ---------- */
const OVL=[];/* other modules push draw(g, sx, sy, k) callbacks */
{const cv=$('ovl'),g2=cv.getContext('2d');function frame(){requestAnimationFrame(frame);const w=innerWidth,h=innerHeight;if(cv.width!=Math.round(w*dpr)||cv.height!=Math.round(h*dpr)){cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr)}
  g2.setTransform(1,0,0,1,0,0);g2.clearRect(0,0,cv.width,cv.height);if(!run||!S||PAUSE&&!PLACEON())return;g2.setTransform(dpr,0,0,dpr,0,0);const sx=x=>(x-camX)*zoom,sy=y=>(y-camY)*zoom,k=zoom;
  const tool=curTool(),p=S.p,zz=tool&&!DUN&&!S.dr?dZone():null;if(zz){const z=zz,ok=z&&dReady(z,tool,true),r=(tool.auto?tool.rng:tool.rng)*k;g2.save();g2.setLineDash([6,5]);g2.lineWidth=2;g2.strokeStyle=ok?(tool.auto?'#ffd36acc':'#e8d7a8aa'):'#ff6a5a88';g2.fillStyle=ok?'#ffd36a14':'#ff6a5a10';
   g2.beginPath();g2.arc(sx(p.x),sy(p.y),r,0,Math.PI*2);g2.fill();g2.stroke();g2.setLineDash([]);if(ok)for(const t of dNear(z,tool,tool.auto?tool.n:1,tool.rng)){g2.strokeStyle='#ffd36a';g2.lineWidth=2;g2.strokeRect(sx(t.x)-2,sy(t.y)-2,t.w*k+4,t.h*k+4)}if(ok&&tool.mode!='obj'){g2.strokeStyle='#e8d7a8aa';g2.lineWidth=1;for(const t of fTiles(z,p.x,p.y,tool.rng,tool.mode=='floor'?200:tool.ft))g2.strokeRect(sx(t.x)+1,sy(t.y)+1,t.w*k-2,t.h*k-2)}g2.restore()}
  for(const f of OVL)try{f(g2,sx,sy,k)}catch(e){}}requestAnimationFrame(frame)}
const PLACEON=()=>typeof PLACE!='undefined'&&!!PLACE;
document.head.insertAdjacentHTML('beforeend',`<style>
#dmBox{position:fixed;right:12px;bottom:calc(env(safe-area-inset-bottom,0px) + 292px);z-index:4;display:flex;flex-direction:column;align-items:flex-end;gap:5px;max-width:70vw}
#dmBox button{position:relative;padding:8px 14px;font-size:13px;border-radius:12px;background:#3a2a14ee;border:1px solid #e0b03a;width:auto;max-width:70vw;overflow:hidden}#dmBox button.big{padding:12px 18px;font-size:15px}#dmBox button.sm{padding:5px 10px;font-size:12px;background:#222a;border-color:#ffffff44}
#dmBox button.off{opacity:.6;border-color:#888}#dmBox button.info{background:#1d1a14dd;font-size:12px;pointer-events:none}
#ovl{position:fixed;inset:0;width:100%;height:100%;pointer-events:none}#dmBox button i{position:absolute;left:0;bottom:0;height:3px;background:#ffd36a}
#dunV{display:none;position:fixed;inset:0;pointer-events:none;background:radial-gradient(circle at 50% 50%,transparent 80px,#000c 200px,#000f 380px)}
body[data-dun] #dunV{display:block}body[data-dun="bunker"] #dunV{background:radial-gradient(circle at 50% 50%,transparent 80px,#1a0505d0 200px,#000f 380px)}
</style>`);
