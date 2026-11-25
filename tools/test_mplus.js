// Sample: rune bag tabs, lower armour odds, dirt/stone thrown away, mine minimap only when the minimap is on, 7-wave reset,
// nests on every floor, glow on/off.
const {chromium}=require('playwright');const path=require('path');const PAGE='file://'+path.resolve(__dirname,'..','inf-sample.html');
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(1800);await p.evaluate(()=>{closeBase();PAUSE=false;stop9()});
 let r=await p.evaluate(()=>{give({rn_fire2:1,ao_thorn2:1});BF='r';openBag();const w=[...document.querySelectorAll('#bm [data-i]')].map(e=>e.dataset.i);BF='all';closeBase();return{w,ca:catOf('ao_thorn2'),cr:catOf('rn_fire2')}});
 ok(r.w.includes('rn_fire2')&&r.w.includes('ao_thorn2')&&r.ca=='r'&&r.cr=='r','runes sit together in the 룬 tab');
 r=await p.evaluate(()=>({a:[5,8,10].map(AERATE),w:[5,8,10].map(n=>ENH.rate[n]),o:AORATE.slice(1)}));ok(r.a.every((v,i)=>v<r.w[i])&&r.o.join()=='75,55,35','armour odds are lower than weapons '+JSON.stringify(r));
 r=await p.evaluate(()=>{const P=S.p,pg=AE();P.inv={vest:1,ao_regen3:5};P.eq.body='vest';pg.aenh.vest=5;pg.aopt.vest=[];AESEL='vest';const R=Math.random;let ok1,fail;try{Math.random=()=>.99;aInscribe('ao_regen3');fail=!(pg.aopt.vest[0])&&(P.inv.ao_regen3|0)==4;Math.random=()=>.0;aInscribe('ao_regen3');ok1=pg.aopt.vest[0]=='ao_regen3'}finally{Math.random=R}closeBase();return{fail,ok1}});
 ok(r.fail&&r.ok1,'inscribing can fail and the rune breaks');
 r=await p.evaluate(()=>{scene9('mdis');const P=S.p;delete P.inv.dirt;delete P.inv.stone;let n=0;for(let k=0;k<6;k++){P.fy=1;P.fx=0;const o=mineTarget();if(!o)break;for(let i=0;i<12&&W0.objs.includes(o);i++){P.ac=0;gearAct()}n++;P.y+=TS}const kept=(P.inv.dirt|0)+(P.inv.stone|0);S.mKeep=true;const o=W0.objs.find(q=>q.t=='mtile'&&(q.m=='dirt'||q.m=='stone'));o.mhp=1;o.hp=1;P.ac=0;startDig(o);return{n,kept,after:(P.inv.dirt|0)+(P.inv.stone|0)}});
 ok(r.n>=3&&r.kept==0,'broken dirt and stone are thrown away ('+r.n+' cells)');ok(r.after>0,'the switch keeps them again');
 r=await p.evaluate(()=>{scene9('mm');mm2();const on=$('mmw').style.display!='none';const sn=Object.keys(mSeen(1)).length;scene9('mmOff');mm2();const off=$('mmw').style.display=='none';dunExit();return{on,sn,off}});
 ok(r.on&&r.sn>=30&&r.off,'mine map shows only when the minimap is on ('+r.sn+' cells seen)');
 r=await p.evaluate(()=>{const M=MINE0();if(DUN)dunExit();M.dug={'3,3':1};M.hive={dead:1,looted:1};const s0=M.seed;S.wv=6;const left=wavesToReset();Z.length=0;wave(7);Z.length=0;const a={dug:Object.keys(M.dug).length,dead:M.hive.dead,seed:M.seed!=s0};
  M.dug={'4,4':1};mineEnter();wave(14);Z.length=0;const pend=M.resetPend,still=Object.keys(M.dug).length;dunExit();return{left,a,pend,still,after:Object.keys(M.dug).length}});
 ok(r.left==1&&r.a.dug==0&&r.a.dead==0&&r.a.seed,'wave 7 resets the mine (new ore, nest back)');ok(r.pend==1&&r.still==1&&r.after==0,'a reset while you are underground waits until you climb out');
 r=await p.evaluate(()=>{const out={};for(const lv of[1,2,3]){scene9('hvA'+lv);const H=Z.find(z=>z.hive&&z.hive!='pod');out[lv]={core:H&&H.hive,hp:H&&H.mhp,pods:Z.filter(z=>z.hive=='pod').length,wall:W0.objs.filter(o=>o.m==HCFG[lv].wall).length}}if(DUN)dunExit();return out});
 ok(r[1].core=='heart'&&r[2].hp==2400&&r[3].core=='queen'&&r[3].pods==8&&r[2].wall>30&&r[3].wall>30,'a nest on every floor '+JSON.stringify(r));
 r=await p.evaluate(()=>{scene9('hvA2');const P=S.p,H=Z.find(z=>z.hive=='heart');P.x=H.x+150;P.y=H.y;const n0=S4.pud.length;H.at=.01;gearUpd(.05);const acid=S4.pud.length-n0;scene9('hvA3');const Q=Z.find(z=>z.hive=='queen');P.x=Q.x+60;P.y=Q.y;P.hp=100;Q.st=.01;gearUpd(.05);const hit=100-P.hp;if(DUN)dunExit();return{acid,hit}});
 ok(r.acid>=2&&r.hit>5,'toxic nest spits acid ('+r.acid+'), the queen slams ('+r.hit.toFixed(1)+')');
 r=await p.evaluate(()=>{GLOWON=false;GLP.length=0;run=true;glowFx(S.p.x,S.p.y,1);const n=GLP.length;openMixer();const t=!!$('glowT');closeBase();GLOWON=true;return{n,t}});ok(r.n==0&&r.t,'glow can be switched off in the settings sheet');
 ok(!errs.length,'no page errors '+errs.slice(0,3).join(' | '));await b.close()})();
