// Sample: new buildings batch 2 — 병원 (2 blocks) · 대형 마트 · 주차 타워 · 지하철역 · 교도소 · 라디오 방송국.
const {chromium}=require('playwright');const path=require('path');const PAGE='file://'+path.resolve(__dirname,'..','inf-sample.html');
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(1800);await p.evaluate(()=>{closeBase();PAUSE=false;stop9()});
 const r=await p.evaluate(()=>{const out={cnt:{},pairBad:[],fixBad:[]};const FIX=['base','lot','mil','milR','rbase','pharm','gunshop','garage','bank'];
  for(let gx=-16;gx<=16;gx++)for(let gy=-16;gy<=16;gy++){const k=kindAt(gx,gy);out.cnt[k]=(out.cnt[k]|0)+1;
   if(k=='hosp'&&kindAt(gx+1,gy)!='hospR')out.pairBad.push(gx+','+gy+' right='+kindAt(gx+1,gy));if(k=='hospR'&&kindAt(gx-1,gy)!='hosp')out.pairBad.push(gx+','+gy+' left='+kindAt(gx-1,gy))}
  out.b={};for(const[k,f]of[['hosp',['optable','xray','gurney','bed']],['mall',['aisle','register','escal']],['park2',['stripes','pillar']],['subway',['tgate','train','pstair']],['prison',['cell','riot','tower']],['radio',['mic','mast','rack']]]){const at=findKind([k],3);if(!at){out.b[k]='none';continue}infGoto(at[0]+(k=='hosp'?1:0),at[1]);
   const B=W0.b.find(q=>q.gk==at.join());const mine=W0.objs.filter(o=>B&&o.b==W0.b.indexOf(B));const ts=new Set(mine.map(o=>o.t));out.b[k]={at,miss:f.filter(t=>!ts.has(t)),loot:mine.filter(o=>LOOTT[o.t]).length,z:W0.zs.filter(z=>z.b==W0.b.indexOf(B)).length,tier:TIER[k],spec:!!SPEC[k]};
   if(k=='hosp'&&B){/* the road under the bridge stays open */const x=B.ox+BW+RD/2,y=B.oy+278;out.bridge=!blocker(x,y,6);out.bridgeX=!blocker(B.ox+870,y,6)&&!blocker(B.ox+BW+RD+30,y,6)}}
  /* a demolished hospital block stays a lot */const h=findKind(['hosp'],3);S.inf.demo=S.inf.demo||{};S.inf.demo[h.join()]={k:'hosp',sh:0,day:1};out.lot=[kindAt(h[0],h[1]),kindAt(h[0]+1,h[1])];delete S.inf.demo[h.join()];delete S.inf.demo[(h[0]+1)+','+h[1]];
  out.prisoner=!!LOOKS.prisoner;out.legend=Object.keys(KNAME).filter(k=>KNAME[k]=='병원').length;return out});
 console.log(JSON.stringify(r.cnt));ok(!r.pairBad.length,'every hospital has both halves side by side '+r.pairBad.slice(0,3));
 for(const k of['hosp','mall','park2','subway','prison','radio']){const B=r.b[k];ok(r.cnt[k]>0,k+' appears in the 33×33 city ('+(r.cnt[k]|0)+')');ok(B&&B!='none'&&!B.miss.length&&B.loot>3&&B.z>2&&B.tier>0&&B.spec,k+' builds with its furniture, loot, zombies, tier and bonus '+JSON.stringify(B))}
 ok(r.bridge&&r.bridgeX,'hospital: the road under the bridge stays open and both doors of the bridge are open');ok(r.lot[0]=='lot'&&r.lot[1]=='lot','a demolished hospital: both halves become lots '+r.lot);
 ok(r.prisoner,'prisoner zombie look');ok(r.legend==1,'map legend lists 병원 once');
 for(const s of['ncT','nc1','nc2','nc3','nc4','nc5','nc6']){await p.evaluate(s=>scene9(s),s);await p.waitForTimeout(500)}
 ok(!errs.length,'no page errors '+errs.slice(0,3).join(' | '));await b.close()})();
// every searchable object in the 10 new buildings can be reached on foot, and floor-level things never draw over the player
(async()=>{const {chromium}=require('playwright');const b=await chromium.launch();const p=await b.newPage();await p.goto(PAGE);await p.waitForTimeout(1600);
 const r=await p.evaluate(()=>{closeBase();PAUSE=false;const out={};for(const kind of['pharm','gunshop','garage','bank','hosp','mall','park2','subway','prison','radio']){const f=findKind([kind],3);infGoto(f[0]+(kind=='hosp'?1:0),f[1]);const B=W0.b.find(q=>q.gk==f.join()),bi=W0.b.indexOf(B);
   const W=(kind=='hosp'?2*BW+RD:BW)+RD,H=BH+RD,X0=B.ox-RD/2,Y0=B.oy-RD/2,C=8,GXn=Math.ceil(W/C),GYn=Math.ceil(H/C),seen=new Uint8Array(GXn*GYn),q=[];
   for(const[sx,sy]of[[2,GYn>>1],[GXn-3,GYn>>1],[GXn>>1,GYn-3]])if(!blocker(X0+sx*C+4,Y0+sy*C+4,10)){seen[sy*GXn+sx]=1;q.push(sx,sy)}
   for(let i=0;i<q.length;i+=2)for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const X=q[i]+dx,Y=q[i+1]+dy;if(X<0||Y<0||X>=GXn||Y>=GYn)continue;const k=Y*GXn+X;if(seen[k])continue;if(blocker(X0+X*C+4,Y0+Y*C+4,10)){seen[k]=2;continue}seen[k]=1;q.push(X,Y)}
   out[kind]=W0.objs.filter(o=>o.b===bi&&LOOTT[o.t]).filter(o=>{for(let y=Math.max(0,((o.y-Y0-30)/C)|0);y<=Math.min(GYn-1,((o.y+o.h-Y0+30)/C)|0);y++)for(let x=Math.max(0,((o.x-X0-30)/C)|0);x<=Math.min(GXn-1,((o.x+o.w-X0+30)/C)|0);x++){if(seen[y*GXn+x]!=1)continue;const px=X0+x*C+4,py=Y0+y*C+4;if(rdist(o,px,py)<28&&seeObj({x:px,y:py},o))return false}return true}).map(o=>o.t)}
  out.flat=['rail','pstair','escal','lift','hatch','mhole','island','stripes'].filter(t=>!FLAT[t]);return out});
 for(const k in r)if(k!='flat')ok(!r[k].length,k+': every searchable object can be reached '+r[k].join(','));ok(!r.flat.length,'floor-level things are drawn under the player '+r.flat);await b.close()})();
// every building scene starts at a free spot by a door and you can walk in; the sample never makes you overweight
(async()=>{const {chromium}=require('playwright');const b=await chromium.launch();const p=await b.newPage();await p.goto(PAGE);await p.waitForTimeout(1600);
 for(const k of['nb1','nb2','nb3','nb4','nc1','nc2','nc3','nc4','nc5','nc6']){const r=await p.evaluate(k=>{closeBase();PAUSE=false;scene9(k);give({scrap:3000});return{x:S.p.x,y:S.p.y,stuck:!!blocker(S.p.x,S.p.y,7),over:weight(S.p)>capacity(S.p)}},k);
  await p.evaluate(()=>{ky.w=1});await p.waitForTimeout(600);const m=await p.evaluate(()=>{delete ky.w;return[S.p.x,S.p.y]});ok(!r.stuck&&!r.over&&Math.hypot(m[0]-r.x,m[1]-r.y)>40,k+': starts free, not overweight, walks in')}await b.close()})();
