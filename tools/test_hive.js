// Sample: armour enhancement + options, high-enhancement glow, the big mine (swing mining, far exit), the zombie hive.
const {chromium}=require('playwright');const path=require('path');const PAGE='file://'+path.resolve(__dirname,'..','inf-sample.html');
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(1800);await p.evaluate(()=>{closeBase();PAUSE=false;stop9()});
 let r=await p.evaluate(()=>{const P=S.p,pg=AE();for(const k of['head','body','legs','feet'])P.eq[k]='';P.inv.vest=1;P.eq.body='vest';const a0=armMul2(P);pg.aenh.vest=10;const a1=armMul2(P);P.inv={vest:1,enh3:5,enh2:5,enh1:5,scrap:30,ao_thorn1:1,ao_hush1:1};
  AESEL='vest';const lv0=aLv('vest');const R=Math.random;Math.random=()=>0;aInscribe('ao_hush1');const wrong=(P.inv.ao_hush1|0)==1;aInscribe('ao_thorn1');Math.random=R;const on=aopt('thorn');closeBase();return{a0,a1,wrong,on}});
 ok(Math.abs(r.a0-.7)<1e-6&&Math.abs(r.a1-(1-.45))<1e-6,'+10 vest: -30% → -45%');ok(r.wrong&&r.on==1,'a feet-only rune will not go on the body; thorns does');
 r=await p.evaluate(()=>{const P=S.p;infGoto(2,1);Z.length=0;mk(P.x+10,P.y,{look:'civ1'});const z=Z[0],h=z.hp;zBite4(z);const th=h-z.hp;
  P.inv.cpants=1;P.eq.legs='cpants';const pg=AE();pg.aenh.cpants=10;const s0=speedMul(P),w0=weight(P);pg.aopt.cpants=['ao_dash3','ao_light3'];const s1=speedMul(P),w1=weight(P);
  P.hp=50;S.aNoHit=6;pg.aopt.vest=['ao_regen3'];gearUpd(1);const reg=P.hp-50;return{th,s:s1/s0,dw:w0-w1,reg}});
 ok(r.th>=8,'thorns hurt the biter ('+r.th+')');ok(Math.abs(r.s-1.09)<.01,'질주 Ⅲ: +9% speed');ok(Math.abs(r.dw-1.5*.6)<.01,'경량 Ⅲ: that piece weighs 60% less');ok(r.reg>1.2,'재생 Ⅲ: heals when untouched for 5 s (+'+r.reg.toFixed(2)+'/s)');
 r=await p.evaluate(()=>{const P=S.p;give({ar:1});P.eq.prim='ar';P.as='prim';const pg=EP();S.inf.fz={};for(let i=1;i<=9;i++)S.inf.fz[i]=1;const T=[];for(const l of[0,7,10,13,ENH.max]){pg.enh.ar=l;T.push(wTier())}
  const set=['spechelm','eod','exo','shockboots'],ae=AE();for(const id of set){P.inv[id]=1;P.eq[ARMX[id][0]]=id}const A=[];for(const l of[0,7,10,ENH.max]){for(const id of set)ae.aenh[id]=l;A.push(aTier())}
  pg.enh.ar=ENH.max;run=true;for(let i=0;i<30;i++)glowFx(P.x,P.y,1);const n=GLP.length;openBag();const gw=document.querySelectorAll('#bm .gw4').length;closeBase();return{T,A,n,gw}});
 ok(r.T.join()=='0,1,2,3,4'&&r.A.join()=='0,1,2,3','glow tiers: weapon '+r.T.join(' ')+' · armour '+r.A.join(' '));ok(r.n>0&&r.gw>0,'particles fly and bag icons glow ('+r.n+' particles, '+r.gw+' glowing icons)');
 r=await p.evaluate(()=>{scene9('mbg');const R0=MREG(),n=W0.objs.filter(o=>o.t=='mtile').length,P=S.p;P.fx=0;P.fy=1;const o=mineTarget(),m=o.m;let sw=0;for(let i=0;i<20&&W0.objs.includes(o);i++){P.ac=0;gearAct();sw++}
  const deb=(S.mdeb||[]).length,gone=!W0.objs.includes(o);return{cols:R0.cols,rows:R0.rows,n,m,sw,deb,gone,axe:wpnOf2(P)}});
 ok(r.cols>=80&&r.rows>=60&&r.n>5000,'the mine is 3×3 blocks ('+r.cols+'×'+r.rows+', '+r.n+' cells)');ok(r.gone&&r.sw>=2&&r.deb>0,'attack swings crack and break a cell ('+r.m+' in '+r.sw+' swings, debris flies)');ok(r.axe=='axe','the player holds the pick');
 r=await p.evaluate(()=>{scene9('mbx');const P=S.p,R0=MREG(),EX=mExit();P.x=R0.x0+EX[0]*TS+16;P.y=R0.y0+EX[1]*TS+30;const e=dmCtx().find(q=>/먼 출구/.test(q.t));if(!e)return{e:false};e.f();const[bx,by]=bo(-OGX,-OGY),d=Math.hypot(P.x-bx-BW/2,P.y-by-BH/2);return{e:true,dun:!!DUN,d}});
 ok(r.e&&!r.dun&&r.d>1500,'the far exit comes out far from the base ('+Math.round(r.d)+'px)');
 r=await p.evaluate(()=>{scene9('hv1');const H=Z.find(z=>z.hive=='heart'),pods=Z.filter(z=>z.hive=='pod'),fl=W0.objs.filter(o=>o.m=='flesh').length,P=S.p;P.x=H.x-200;P.y=H.y;for(const z of pods)z.pt=.01;const n0=Z.length;gearUpd(.05);const hatched=Z.length-n0;
  H.hp=H.mhp*.5;gearUpd(.02);const scr=!!H.scr;H.hp=0;Z=Z.filter(z=>{if(z.hp<=0){kill(z);return false}return true});gearUpd(.02);Z=Z.filter(z=>{if(z.hp<=0){kill(z);return false}return true});
  const left=Z.filter(z=>z.hive).length,M=HVS();const c=W0.objs.find(o=>o.t=='hcache');P.x=c.x+24;P.y=c.y+30;const lt=dmCtx().find(q=>/둥지 보물 챙기기/.test(q.t));if(lt)lt.f();return{pods:pods.length,fl,hatched,scr,left,dead:M.dead,loot:M.looted,rune:Object.keys(P.inv).some(k=>/^(ao_|orn)/.test(k))}});
 ok(r.pods==6&&r.fl>40,'the hive: heart, 6 egg sacs, flesh walls ('+r.fl+' cells)');ok(r.hatched>=1,'egg sacs hatch zombies when you are near');ok(r.scr,'the heart screams at 60%');ok(r.dead&&r.left==0,'killing the heart bursts every sac');ok(r.loot&&r.rune,'the hive treasure gives ore, stones and armour runes');
 ok(!errs.length,'no page errors '+errs.slice(0,3).join(' | '));await b.close()})();
