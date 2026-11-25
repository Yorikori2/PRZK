// Notices: same kind merges into one line, item gains add up, repeats show ×n, gone after 2 s. Interact hint uses words.
// usage: node tools/test_msg.js [page]
const {chromium}=require('playwright');const path=require('path');const PAGE='file://'+path.resolve(__dirname,'..',process.argv[2]||'index.html');
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(1500);
 await p.evaluate(()=>{if(!run){document.querySelector('[data-d=S]').click()}$('bm').dataset.m='';closeBase();PAUSE=false;if(S.pg&&!S.pg.tr.length)S.pg.tr=['cop'];if(typeof stop9=='function')stop9()});await p.waitForTimeout(2300);
 let r=await p.evaluate(()=>{give({a9mm:10,bandage:1});give({a9mm:20});give({scrap:3});const a=$('msg').textContent;msg('🔕 경보 해제');msg('🔕 경보 해제');msg('🔕 경보 해제');const b2=$('msg').textContent;msg('🧟 웨이브 3 발생!');const c=$('msg').textContent;return{a,b2,c,ws:getComputedStyle($('msg')).whiteSpace}});
 ok(/9mm 탄 30/.test(r.a)&&/붕대 1/.test(r.a)&&/고철 3/.test(r.a)&&(r.a.match(/획득/g)||[]).length==1,'item gains merge into one line: '+r.a);ok(/×3$/.test(r.b2),'the same notice shows ×3: '+r.b2);ok(r.c=='🧟 웨이브 3 발생!'&&r.ws=='nowrap','a new kind replaces it, one line');
 r=await p.evaluate(()=>new Promise(res=>{const t0=performance.now(),el=$('msg');let last=el.textContent;setTimeout(()=>res({op:getComputedStyle(el).opacity,same:el.textContent==last,txt:el.textContent}),2700)}));ok(r.op=='0'||!r.same,'gone after 2 seconds (+fade) '+JSON.stringify(r));
 if(/inf-sample/.test(PAGE)){r=await p.evaluate(()=>{scene9('ui1');IAK='';iaRefresh();const h=$('iaHint').textContent;const P=S.p;P.x=BL.ox+FPOS.forge[0]+27;P.y=BL.oy+FPOS.forge[1]+70;IAK='';iaRefresh();const h2=$('iaHint').textContent;
   const op=W0.objs;const emo=/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/u;return{h,h2,emo:emo.test(h+h2)}});ok(/무기 강화/.test(r.h)&&/제련/.test(r.h2)&&!r.emo,'interact hint uses words, no emoji ('+r.h+' / '+r.h2+')')}
 ok(!errs.length,'no page errors '+errs.slice(0,3).join(' | '));await b.close()})();
