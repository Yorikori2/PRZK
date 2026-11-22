// Renders the whole world to one labelled image.  usage: node tools/map_image.js <out.png>
const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:800,height:600}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/user/PRZK/index.html');await p.waitForTimeout(600);
const url=await p.evaluate(()=>{localStorage.clear();start('S',false);S.pg.tr=['cop'];$('bm').dataset.m='';closeBase();PAUSE=true;Z.length=0;S.t=900;S.wx=null;
 const ow=buf.width,oh=buf.height;buf.width=WW;buf.height=WH;S.p.x=WW/2;S.p.y=WH/2;draw();
 const K=.5,c=document.createElement('canvas');c.width=WW*K;c.height=WH*K+70;const x=c.getContext('2d');x.fillStyle='#101418';x.fillRect(0,0,c.width,c.height);x.imageSmoothingEnabled=true;x.drawImage(buf,0,0,WW,WH,0,70,WW*K,WH*K);
 buf.width=ow;buf.height=oh;
 x.font='bold 30px sans-serif';x.fillStyle='#ffd36a';x.fillText('PROJECT LEGACY 전체 지도',16,40);x.font='17px sans-serif';x.fillStyle='#c9ced3';
 const sec=(px)=>Math.round(px/110);x.fillText(WW+' × '+WH+' px  ·  거리 블록 '+NBX+'×'+NBY+'칸 (블록 '+BW+'×'+BH+')  ·  걸어서 가로 약 '+sec(WW)+'초 · 세로 약 '+sec(WH)+'초 (보통 걸음 110px/s 기준)',16,62);
 const seen={};for(const r of W0.roofs){const bb=W0.b[r.bi];if(!bb)continue;const k=r.bi;const cx=(r.x+r.w/2)*K,cy=(r.y+r.h/2)*K+70;if(!seen[k]||r.w*r.h>seen[k].a)seen[k]={a:r.w*r.h,cx,cy,n:bb.name,kind:bb.kind}}
 x.font='bold 18px sans-serif';x.textAlign='center';for(const k in seen){const s=seen[k];const w=x.measureText(s.n).width+14;x.fillStyle='#000c';x.fillRect(s.cx-w/2,s.cy-14,w,24);x.fillStyle=s.kind=='base'?'#7fd08a':'#fff';x.fillText(s.n,s.cx,s.cy+4)}
 const bx=(BL.ox+(BL.x0+BL.x1)/2)*K,by=(BL.oy+(BL.y0+BL.y1)/2)*K+70;x.font='bold 18px sans-serif';x.textAlign='center';{const n='🏕 거점 (시작 지점)',w=x.measureText(n).width+14;x.fillStyle='#000c';x.fillRect(bx-w/2,by-54,w,24);x.fillStyle='#7fd08a';x.fillText(n,bx,by-36)}
 x.textAlign='left';x.strokeStyle='#ffd36a';x.lineWidth=3;const sx=c.width-300,y0=48;x.beginPath();x.moveTo(sx,y0);x.lineTo(sx+500*K,y0);x.moveTo(sx,y0-6);x.lineTo(sx,y0+6);x.moveTo(sx+500*K,y0-6);x.lineTo(sx+500*K,y0+6);x.stroke();x.fillStyle='#ffd36a';x.font='15px sans-serif';x.fillText('500px · 걸어서 약 5초',sx,y0-12);
 return c.toDataURL('image/png')});
fs.writeFileSync(process.argv[2],Buffer.from(url.split(',')[1],'base64'));console.log('ok',errs.join('|'));await b.close()})();
