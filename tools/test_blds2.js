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
