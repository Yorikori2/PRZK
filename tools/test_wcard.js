// Sample: weapon card styles (old / A / B / C); the 🔨 bubble no longer sits on the card; slots switch, reload, demolish.
const {chromium}=require('playwright');const path=require('path');const PAGE='file://'+path.resolve(__dirname,'..','inf-sample.html');
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(1800);await p.evaluate(()=>{closeBase();PAUSE=false;stop9()});
 const over=(a,b2)=>`(()=>{const A=document.querySelector('${a}').getBoundingClientRect(),B=document.querySelector('${b2}').getBoundingClientRect();return A.width&&B.width&&!(A.right<=B.left||B.right<=A.left||A.bottom<=B.top||B.bottom<=A.top)})()`;
 let r=await p.evaluate(()=>{scene9('wcO');hud2();return{demoB:getComputedStyle($('demoB')).display,btn:!!$('wc').querySelector('[data-a=dm]')}});ok(r.demoB=='none'&&r.btn,'old card: no 🔨 bubble, a [철거] button on the card');
 r=await p.evaluate(()=>{scene9('wcC');WCK='';wcRender();const S2=[...document.querySelectorAll('#wc2 .sl')].map(e=>e.dataset.s);return S2});ok(r.join()=='prim,sec,mel,thr,dm','C: slots 주무기 · 보조 · 근접 · 투척 · 철거');
 r=await p.evaluate(()=>new Promise(res=>{const tap=s=>{const e=document.querySelector('#wc2 .sl[data-s="'+s+'"]');e.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));e.dispatchEvent(new PointerEvent('pointerup',{bubbles:true}))};
  tap('sec');const a1=S.p.as;S.p.mag.pistol=0;tap('sec');const rl=S.p.rl>0;tap('dm');const dm=DEMO,w=actW(S.p);tap('prim');res({a1,rl,dm,w,back:actW(S.p),off:!DEMO})}));
 ok(r.a1=='sec'&&r.rl,'tap a slot to switch, tap it again to reload');ok(r.dm&&r.w=='dt2'&&r.back=='ar'&&r.off,'the 철거 slot is demolition mode; another slot leaves it');
 r=await p.evaluate(()=>{scene9('wcA');hud2();WCK='';wcRender();const atk=$('atk');return{img:!!atk.querySelector('img'),n:atk.textContent,ring:getComputedStyle(atk,'::after').content!='none'}});ok(r.img&&/\d/.test(r.n),'A: the attack button shows the weapon and ammo');
 for(const s of['wcB','wcC','wcA']){r=await p.evaluate(s=>{scene9(s);hud2();WCK='';wcRender();return null},s);r=await p.evaluate(over('#wc2','#qk'));ok(!r,s+': the weapon UI does not cover the quick slots')}
 ok(!errs.length,'no page errors '+errs.slice(0,3).join(' | '));await b.close()})();
