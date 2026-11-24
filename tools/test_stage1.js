// Stage 1 checks for the expanded city: errors, layout, art coverage, reachability, screenshots, perf, save migration
const {chromium}=require('playwright');const fs=require('fs');
const OUT=process.argv[2]||'.';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1000,height:640}});const errs=[];
p.on('pageerror',e=>errs.push('pageerror: '+e.message));p.on('console',m=>{if(m.type()=='error')errs.push('console: '+m.text())});
await p.goto('file://'+require('path').resolve(__dirname,'..',process.env.PG||'index.html'));await p.waitForTimeout(600);
await p.evaluate(()=>{localStorage.clear();start('S',false);if(typeof S!='undefined'&&S&&S.pg&&!S.pg.tr.length){S.pg.tr=['cop'];$('bm').dataset.m='';closeBase();PAUSE=false}});await p.waitForTimeout(600);
const R={};
R.layout=await p.evaluate(()=>({WW,WH,NBX,NBY,buildings:W0.b.map(b=>b.name+'('+b.kind+')@'+b.c+','+b.r),objs:W0.objs.length,zombies:W0.zs.length,mm:[(document.getElementById('mm')||document.getElementById('mmw')).width,(document.getElementById('mm')||document.getElementById('mmw')).height]}));
R.missingArt=await p.evaluate(()=>[...new Set(W0.objs.filter(o=>!D[o.t]).map(o=>o.t))]);
R.lootKindsWithoutTable=await p.evaluate(()=>[...new Set(W0.b.map(b=>b.kind))].filter(k=>k!='base'&&!KL[k]));
// overlap: buildings must stay inside their block, block rects must not overlap
R.outOfBlock=await p.evaluate(()=>{const bad=[];W0.objs.forEach(o=>{const b=W0.b[o.b];if(!b)return;const w=b.kind=='mil'&&b.c==3?2*BW+RD:BW;if(o.x<b.ox-8||o.y<b.oy-140||o.x+o.w>b.ox+w+8||o.y+o.h>b.oy+BH+8)bad.push(b.name+':'+o.t)});return bad.slice(0,20)});
// reachability: BFS on an 8px grid with the game's own collision test, from the player's spawn
R.reach=await p.evaluate(()=>{const C=8,GXn=Math.ceil(WW/C),GYn=Math.ceil(WH/C),seen=new Uint8Array(GXn*GYn),q=[];const sx=S.p.x/C|0,sy=S.p.y/C|0;
 const ok=(x,y)=>x>=0&&y>=0&&x<GXn&&y<GYn&&!blocker(x*C+4,y*C+4,7);seen[sy*GXn+sx]=1;q.push(sx,sy);
 for(let i=0;i<q.length;i+=2){const x=q[i],y=q[i+1];for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const X=x+dx,Y=y+dy;if(X<0||Y<0||X>=GXn||Y>=GYn)continue;const k=Y*GXn+X;if(seen[k])continue;if(!ok(X,Y)){seen[k]=2;continue}seen[k]=1;q.push(X,Y)}}
 const per={};let total=0,unreach=[];W0.objs.forEach(o=>{if(!LOOTT[o.t])return;const b=W0.b[o.b];const name=b?b.name:'?';per[name]=per[name]||[0,0];per[name][0]++;total++;
  let hit=false;const x0=Math.max(0,(o.x-30)/C|0),x1=Math.min(GXn-1,(o.x+o.w+30)/C|0),y0=Math.max(0,(o.y-30)/C|0),y1=Math.min(GYn-1,(o.y+o.h+30)/C|0);
  for(let y=y0;y<=y1&&!hit;y++)for(let x=x0;x<=x1&&!hit;x++)if(seen[y*GXn+x]==1&&rdist(o,x*C+4,y*C+4)<29)hit=true;
  if(hit)per[name][1]++;else unreach.push(name+':'+o.t+'@'+Math.round(o.x)+','+Math.round(o.y))});
 return{total,per,unreach:unreach.slice(0,40)}});
// screenshots + perf inside each new building
const NEW=['군부대','소방서','교회','물류창고','연구소','아파트'];R.shots=[];R.perf={};
for(const n of NEW){const pos=await p.evaluate(n=>{const bi=W0.b.findIndex(b=>b.name==n);if(bi<0)return null;const r=W0.roofs.find(r=>r.bi==bi);
  // pick a reachable point inside the building near its centre
  const cx=r.x+r.w/2,cy=r.y+r.h/2;let best=null;for(let k=0;k<400&&!best;k++){const a=k*2.399,rr=Math.sqrt(k)*10,x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr;if(!blocker(x,y,8))best={x,y}}
  Z=[];S.p.hp=999;if(best){S.p.x=best.x;S.p.y=best.y}return best},n);
 await p.waitForTimeout(700);
 const fps=await p.evaluate(()=>new Promise(res=>{let n=0,t0=performance.now();function f(){n++;if(performance.now()-t0<1500)requestAnimationFrame(f);else res(Math.round(n/((performance.now()-t0)/1000)))}requestAnimationFrame(f)}));
 R.perf[n]=fps;const f=OUT+'/s1_'+NEW.indexOf(n)+'.png';await p.screenshot({path:f});R.shots.push(n+' -> '+f+' '+JSON.stringify(pos&&{x:Math.round(pos.x),y:Math.round(pos.y)}))}
// loot one container in the lab and in the fire station via the game's own interaction
R.loot=await p.evaluate(()=>{const out={};for(const n of['연구소','소방서','물류창고']){const bi=W0.b.findIndex(b=>b.name==n);const o=W0.objs.find(o=>o.b==bi&&LOOTT[o.t]);if(!o){out[n]='no container';continue}
 S.p.x=o.x+o.w/2;S.p.y=o.y+o.h+10;let k=0;while(blocker(S.p.x,S.p.y,7)&&k<20){S.p.y+=4;k++}const before=JSON.stringify(S.p.inv);Z.length=0;ia();let w=0;while(typeof SRCH!='undefined'&&SRCH&&w<200){gearUpd(.05);w++}out[n]={obj:o.t,changed:JSON.stringify(S.p.inv)!=before,msg:document.getElementById('msg').textContent.slice(0,60)}}return out});
// minimap with antenna
await p.evaluate(()=>{S.p.inv.antenna=1});await p.waitForTimeout(400);await p.locator('#mmw').screenshot({path:OUT+'/s1_mm.png'});
// save -> legacy save migration
R.migration=await p.evaluate(()=>{save();const old=JSON.parse(localStorage.getItem(SAVE));delete old.wv2;old.lo={'5':1,'6':1};old.p.x=W0.b.find(b=>b.name=='아파트').ox+400;old.p.y=W0.b.find(b=>b.name=='아파트').oy+300;localStorage.setItem(SAVE,JSON.stringify(old));
 start('S',true);return{wv2:S.wv2,loCleared:Object.keys(S.lo).length==0,blocked:!!blocker(S.p.x,S.p.y,8),msg:document.getElementById('msg').textContent}});
await p.waitForTimeout(500);
R.errors=errs;fs.writeFileSync(OUT+'/stage1.json',JSON.stringify(R,null,1));console.log(JSON.stringify(R,null,1));await b.close()})();
