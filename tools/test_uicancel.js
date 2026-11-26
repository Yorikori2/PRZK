// touch drag that ends in pointercancel (no pointerup), then tap 완료: weapon card must stay where it was dropped
const {chromium}=require('playwright');const page=process.argv[2]||'index.html';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:860},hasTouch:true,isMobile:true});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/user/PRZK/'+page);await p.waitForTimeout(300);await p.evaluate(()=>{localStorage.clear();start('S',false);if(typeof S!='undefined'&&S&&S.pg&&!S.pg.tr.length){S.pg.tr=['cop'];$('bm').dataset.m='';closeBase();PAUSE=false};uiEdit(true)});await p.waitForTimeout(200);
const r=await p.evaluate(()=>{const ev=(t,id,x,y,el)=>(el||document.elementFromPoint(x,y)).dispatchEvent(new PointerEvent(t,{pointerId:id,pointerType:'touch',clientX:x,clientY:y,bubbles:true,cancelable:true,isPrimary:true}));
 const w=document.getElementById('wc2').getBoundingClientRect();const sx=w.right-24,sy=w.bottom-24;
 ev('pointerdown',5,sx,sy);for(let i=1;i<=6;i++)ev('pointermove',5,sx-i*10,sy-i*20);ev('pointercancel',5,sx-60,sy-120);
 const drop=document.getElementById('wc2').getBoundingClientRect();
 const ok=[...document.querySelectorAll('#uiBar button')].find(b=>b.textContent=='완료').getBoundingClientRect(),ox=ok.left+ok.width/2,oy=ok.top+ok.height/2;
 ev('pointerdown',6,ox,oy);ev('pointermove',6,ox+2,oy+1);ev('pointerup',6,ox+2,oy+1);uiEdit(false);
 const a=document.getElementById('wc2').getBoundingClientRect();return{drop:[Math.round(drop.left),Math.round(drop.top)],after:[Math.round(a.left),Math.round(a.top)]}});
console.log(page,JSON.stringify(r),Math.abs(r.drop[0]-r.after[0])<3&&Math.abs(r.drop[1]-r.after[1])<3?'PASS card stays':'FAIL card followed the finger',errs);await b.close()})();
