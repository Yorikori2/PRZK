// Real touch drag (CDP touch events, slow like a finger) of the weapon card in the HUD editor: the card must follow every step,
// even while the HUD refreshes its contents every 0.25 s.  usage: node tools/test_uitouch.js [page.html]
const {chromium}=require('playwright');const page=process.argv[2]||'index.html';
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:412,height:860},hasTouch:true,isMobile:true});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+require('path').resolve(__dirname,'..',page));await p.waitForTimeout(300);await p.evaluate(()=>{localStorage.clear();start('S',false);uiEdit(true)});await p.waitForTimeout(300);
 const cdp=await ctx.newCDPSession(p);const T=(type,x,y)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:type=='touchEnd'?[]:[{x,y,id:1}]});
 const r0=await p.evaluate(()=>{const r=document.getElementById('wc').querySelector('.wn').getBoundingClientRect(),c=document.getElementById('wc').getBoundingClientRect();return{x:r.left+5,y:r.top+5,cx:c.left,cy:c.top}});
 await T('touchStart',r0.x,r0.y);let worst=0,stuck=0,last=null;
 for(let i=1;i<=40;i++){const x=r0.x-i*3,y=r0.y-i*8;await T('touchMove',x,y);await p.waitForTimeout(40);
  const c=await p.evaluate(()=>{const r=document.getElementById('wc').getBoundingClientRect();return[r.left,r.top]});const ex=[r0.cx-i*3,r0.cy-i*8];const dev=Math.abs(c[0]-ex[0])+Math.abs(c[1]-ex[1]);if(i>3)worst=Math.max(worst,dev);if(last&&i>3&&c[0]==last[0]&&c[1]==last[1])stuck++;last=c}
 await T('touchEnd');await p.waitForTimeout(200);const end=await p.evaluate(()=>{const r=document.getElementById('wc').getBoundingClientRect();return[Math.round(r.left),Math.round(r.top)]});
 const good=worst<=3&&stuck==0&&Math.abs(end[0]-(r0.cx-120))<3&&Math.abs(end[1]-(r0.cy-320))<3;
 console.log((good?'PASS':'FAIL')+' '+page+' touch drag: worst lag '+Math.round(worst)+'px, frozen steps '+stuck+', dropped at '+end+' (expected '+Math.round(r0.cx-120)+','+Math.round(r0.cy-320)+')',errs.join('|'));if(!good)process.exitCode=1;await b.close()})();
