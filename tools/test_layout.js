// Portrait / landscape HUD layout check: screenshots + overlap test between HUD panels on several screen sizes
// usage: node tools/test_layout.js <outdir>
const {chromium}=require('playwright');const fs=require('fs');const OUT=process.argv[2]||'.';
const SIZES=[['phone-portrait',412,860],['phone-landscape',860,412],['small-landscape',740,360],['small-portrait',360,740],['tablet-landscape',1180,820],['tablet-portrait',820,1180]];
(async()=>{const b=await chromium.launch();const R={};
for(const[name,w,h]of SIZES){const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+require('path').resolve(__dirname,'..',process.env.PG||'index.html'));await p.waitForTimeout(400);
 await p.evaluate(()=>{localStorage.clear();start('S',false);if(typeof S!='undefined'&&S&&S.pg&&!S.pg.tr.length){S.pg.tr=['cop'];$('bm').dataset.m='';closeBase();PAUSE=false}const P=S.p;give({ar:1,a556:60,pistol:1,a9mm:30,antenna:1,medkit:2,grenade:2,vest:1,helmet:1,bag2:1});P.quick=['bandage','medkit','grenade','food'];P.as='prim';P.mag.ar=30;P.bleed=1;
  const o=W0.objs.find(o=>o.t=='crate'&&o.b==W0.b.findIndex(b=>b.kind=='base'))||W0.objs.find(o=>LOOTT[o.t]);});
 await p.waitForTimeout(3200);
 const ov=await p.evaluate(()=>{const ids=['st','dg','tr',(document.getElementById('tbH')&&getComputedStyle(document.getElementById('tbH')).display!='none'?'tbH':'sd'),'rc','r'];const rs=ids.map(id=>{const e=document.getElementById(id);if(!e||getComputedStyle(e).display=='none')return null;const r=e.getBoundingClientRect();return r.width&&r.height?{id,x:r.left,y:r.top,w:r.width,h:r.height}:null}).filter(Boolean);
  const bad=[];for(let i=0;i<rs.length;i++)for(let j=i+1;j<rs.length;j++){const a=rs[i],c=rs[j];const ox=Math.min(a.x+a.w,c.x+c.w)-Math.max(a.x,c.x),oy=Math.min(a.y+a.h,c.y+c.h)-Math.max(a.y,c.y);if(ox>2&&oy>2)bad.push(a.id+'×'+c.id+' '+Math.round(ox)+'x'+Math.round(oy))}
  const off=rs.filter(r=>r.x<-1||r.y<-1||r.x+r.w>innerWidth+1||r.y+r.h>innerHeight+1).map(r=>r.id);
  const hud=rs.reduce((a,r)=>a+r.w*r.h,0)/(innerWidth*innerHeight);return{bad,off,hudCover:Math.round(hud*100)+'%'}});
 await p.screenshot({path:OUT+'/'+name+'-hud.png'});
 await p.evaluate(()=>openBag('ar'));await p.waitForTimeout(300);await p.screenshot({path:OUT+'/'+name+'-bag.png'});await p.evaluate(()=>closeBase());
 R[name]={...ov,errs};await p.close()}
fs.writeFileSync(OUT+'/layout.json',JSON.stringify(R,null,1));console.log(JSON.stringify(R,null,1));await b.close()})();
