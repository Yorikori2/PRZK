// Sample: one interact button (no button stack), enhancing only at the bench, demolition mode, big-enhance effect.
const {chromium}=require('playwright');const path=require('path');const PAGE='file://'+path.resolve(__dirname,'..','inf-sample.html');
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(PAGE);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(1800);await p.evaluate(()=>{closeBase();PAUSE=false;stop9();scene9('ui1')});await p.waitForTimeout(500);
 let r=await p.evaluate(()=>{iaRefresh();const box=getComputedStyle($('dmBox')).display,hint=$('iaHint').textContent;ia();const m=$('bm').dataset.m;closeBase();PAUSE=false;
  const P=S.p;P.x=BL.ox+FPOS.forge[0]+27;P.y=BL.oy+FPOS.forge[1]+70;IAK='';iaRefresh();const h2=$('iaHint').textContent;ia();const m2=$('bm').dataset.m;closeBase();PAUSE=false;
  const bb=BP.find(o=>o.t=='bench3');let m3='';if(bb){P.x=bb.x+bb.w/2;P.y=bb.y+bb.h+30;ia();m3=$('bm').dataset.m;closeBase();PAUSE=false}
  P.x+=600;give({enh1:1});const before=P.inv.enh1;use2('enh1');const blocked=P.inv.enh1==before&&$('bm').dataset.m!='enh';closeBase();return{box,hint,m,h2,m2,m3,blocked,hdr:getComputedStyle(document.body).display}});
 ok(r.box=='none','the button stack above the weapon card is gone');ok(/무기 강화/.test(r.hint)&&r.m=='enh','at the enhance bench: hint shows it and [상호작용] opens it');
 ok(r.m2=='forge','at the smelter: [상호작용] opens the workshop ('+r.h2+')');ok(r.m3==''||r.m3=='craft','at the workbench: [상호작용] opens crafting ('+r.m3+')');ok(r.blocked,'enhancing away from the bench is refused');
 r=await p.evaluate(()=>{scene9('dm1');const P=S.p,z=dZone(),rd=typeof dReady=='function'?dReady({need:1},{lv:3},true):null;const w0=actW(P);demoMode(true);const w1=actW(P),z1=!!dZone(),on=document.body.classList.contains('demoOn'),lbl=$('atk').textContent;demoMode(false);const w2=actW(P);return{z,rd,w0,w1,z1,on,lbl,w2}});
 ok(r.z==null&&r.rd===false,'demolition mode off: tools do not demolish');ok(r.w1=='dt2'&&r.z1&&r.on&&r.lbl=='철거','mode on: best tool in hand, attack = 철거');ok(r.w2==r.w0,'mode off puts the pistol back');
 r=await p.evaluate(()=>{scene9('ef1');return new Promise(res=>setTimeout(()=>res({lv:enhLv('ar'),fx:!!$('enhFx')||!!EFX}),300))});ok(r.lv==10&&r.fx,'reaching +10 plays the light pillar / banner');
 ok(!errs.length,'no page errors '+errs.slice(0,3).join(' | '));await b.close()})();
