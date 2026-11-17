// Furniture layout audit for every building (run: node tools/audit_furniture.js [out.json])
// Flags: furniture inside walls, furniture overlapping furniture, wall-type furniture floating in the
// middle of a room, furniture outside its building, and furniture sitting in a doorway.
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.goto('file://'+require('path').resolve(__dirname,'..','index.html'));await p.waitForTimeout(400);
const R=await p.evaluate(()=>{localStorage.clear();start('S',false);
 const WALLT=new Set(['wardrobe','bookshelf','locker','fridge','kitchen','cabinet','medshelf','shelf','tv','gunrack','lockrow','board','drinks','rack','console','xray','gear','palrack','medshelf','vending','cooler','hood','tube','washer','sink','toilet','tub','piano','altar','desk']);
 const OUTDOOR=new Set(['tree','bush','lamp','car','wreck','pcar','ambulance','truck','planter','bollard','sign','trash','dumpster','helipad','court','stripes','island','pump','tower','tent','fence','wall2','flag','sandbag','heli','humvee','ftank','target','mgnest','barrier','booth','firetruck','hydrant','cone','forklift','trailer','tomb','btower','slide','swing','bench','tires','barrel','container','mailbox','hoop','bleacher']);
 const SKIP=new Set(['chair','stool','curtain','cell','stall','leadglass','alarmbox','rug','candle','extinguisher','wetsign','iv','plant','pillar','chairs']);
 const walls=SOL.filter(s=>s.wall);const inter=(a,b,m=0)=>a.x<b.x+b.w-m&&a.x+a.w>b.x+m&&a.y<b.y+b.h-m&&a.y+a.h>b.y+m;
 const roofOf=o=>W0.roofs.find(r=>o.x+o.w/2>r.x&&o.x+o.w/2<r.x+r.w&&o.y+o.h/2>r.y&&o.y+o.h/2<r.y+r.h);
 const out={};const add=(o,k,msg)=>{const bn=W0.b[o.b]?W0.b[o.b].name:'?';(out[bn]=out[bn]||[]).push(k+' | '+(NM[o.t]||o.t)+'('+o.t+') @'+Math.round(o.x-W0.b[o.b].ox)+','+Math.round(o.y-W0.b[o.b].oy)+' '+o.w+'x'+o.h+(msg?' | '+msg:''))};
 const objs=W0.objs.filter(o=>!FLAT[o.t]);
 for(const o of objs){if(o.b==null||!W0.b[o.b])continue;const inside=roofOf(o);
  if(inside&&!SKIP.has(o.t)&&!OUTDOOR.has(o.t)){for(const w of walls)if(inter({x:o.x,y:o.y,w:o.w,h:o.h},w,1)){add(o,'벽 겹침');break}}
  if(inside&&WALLT.has(o.t)){let dmin=1e9;for(const w of walls){const dx=Math.max(w.x-(o.x+o.w),0,o.x-(w.x+w.w)),dy=Math.max(w.y-(o.y+o.h),0,o.y-(w.y+w.h));dmin=Math.min(dmin,Math.hypot(dx,dy))}
   let near=0;for(const q of objs)if(q!==o&&WALLT.has(q.t)&&inter({x:o.x-3,y:o.y-3,w:o.w+6,h:o.h+6},q))near=1;if(dmin>10&&!near)add(o,'벽에서 떨어짐','벽까지 '+Math.round(dmin)+'px')}
 }
 for(let i=0;i<objs.length;i++)for(let j=i+1;j<objs.length;j++){const a=objs[i],c=objs[j];if(SKIP.has(a.t)||SKIP.has(c.t))continue;if(!roofOf(a)||!roofOf(c))continue;if(inter(a,c,2))add(a,'가구 겹침','↔ '+(NM[c.t]||c.t)+' @'+Math.round(c.x-W0.b[c.b].ox)+','+Math.round(c.y-W0.b[c.b].oy))}
 // doorways: wall gaps along each building wall line where a player must pass; flag solid furniture within 16px in front of a gap
 const gaps=[];const byLine={};walls.forEach(w=>{const horiz=w.w>w.h;const key=(horiz?'h':'v')+Math.round(horiz?w.y:w.x);(byLine[key]=byLine[key]||[]).push(w)});
 for(const[k,ws]of Object.entries(byLine)){const horiz=k[0]=='h';ws.sort((a,b)=>horiz?a.x-b.x:a.y-b.y);for(let i=0;i<ws.length-1;i++){const a=ws[i],c=ws[i+1];const s=horiz?a.x+a.w:a.y+a.h,e=horiz?c.x:c.y;if(e-s>=16&&e-s<=90){gaps.push(horiz?{x:s,y:a.y-18,w:e-s,h:a.h+36}:{x:a.x-18,y:s,w:a.w+36,h:e-s})}}}
 for(const o of objs){if(SKIP.has(o.t)||OUTDOOR.has(o.t)||!roofOf(o)||!SOLID[o.t])continue;for(const gp of gaps)if(inter(o,gp,1)){add(o,'문 앞 막음');break}}
 return {buildings:W0.b.map(b=>b.name),issues:out,gaps:gaps.length}});
fs.writeFileSync(process.argv[2]||'audit.json',JSON.stringify(R,null,1));
let n=0;for(const[k,v]of Object.entries(R.issues)){console.log('\n## '+k+' ('+v.length+')');v.forEach(x=>console.log('  '+x));n+=v.length}console.log('\nTOTAL',n,'gaps',R.gaps);await b.close()})();
