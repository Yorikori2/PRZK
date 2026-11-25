// Long random play (fast-forward) with invariant checks, then layout checks on small and landscape screens.
// usage: node tools/play_soak.js <outdir> [seconds] [page]
const {chromium,devices}=require('playwright');const path=require('path');const fs=require('fs');
const OUT=process.argv[2]||'.',SEC=+(process.argv[3]||120),PAGE='file://'+path.resolve(__dirname,'..',process.argv[4]||'index.html');fs.mkdirSync(OUT,{recursive:true});
const issues={};const note=(k)=>{issues[k]=(issues[k]|0)+1;if(issues[k]==1)console.log('⚠ '+k)};
(async()=>{const b=await chromium.launch();
 for(const[nm,dev]of[['phone',{...devices['Pixel 7']}],['small',{viewport:{width:360,height:640},deviceScaleFactor:1,hasTouch:true,isMobile:true}],['land',{viewport:{width:800,height:380},deviceScaleFactor:1,hasTouch:true,isMobile:true}]]){
  const ctx=await b.newContext(dev),p=await ctx.newPage();p.on('pageerror',e=>note('pageerror: '+e.message+' @ '+(e.stack||'').split('\n')[1]));
  await p.goto(PAGE);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(1500);
  await p.evaluate(()=>{document.querySelector('[data-d=S]').click();if(S.pg&&!S.pg.tr.length)S.pg.tr=['soldier'];closeBase();$('bm').dataset.m='';PAUSE=false;give({ar:1,a556:400,pistol:1,a9mm:100,medkit:5,food:5,water:5,pick2:1,dt2:1,flashl:1});const P=S.p;P.eq.prim='ar';P.as='prim';spd=4});
  /* overlap check of the bottom-right controls */
  const lay=await p.evaluate(()=>{hud2();const ids=['#wc2','#wcH','#iaHint','#act','#atk','#sd','#tp','#msg'],R={};for(const s of ids){const e=document.querySelector(s);if(!e)continue;const r=e.getBoundingClientRect(),cs=getComputedStyle(e);if(r.width&&cs.display!='none'&&cs.visibility!='hidden'&&+cs.opacity>0)R[s]=r}
   const out=[];const k=Object.keys(R);for(let i=0;i<k.length;i++)for(let j=i+1;j<k.length;j++){const A=R[k[i]],B=R[k[j]];if(A.right>B.left+2&&B.right>A.left+2&&A.bottom>B.top+2&&B.bottom>A.top+2)out.push(k[i]+' × '+k[j])}
   for(const s in R){const r=R[s];if(r.right>innerWidth+1||r.bottom>innerHeight+1||r.left<-1)out.push(s+' off screen')}return out});
  for(const o of lay)note('layout['+nm+']: '+o);await p.screenshot({path:path.join(OUT,'lay_'+nm+'.png')});
  if(nm!='phone'){await ctx.close();continue}
  /* soak */const t0=Date.now();let k=0;
  while(Date.now()-t0<SEC*1000){k++;await p.evaluate(k=>{const keys=['w','a','s','d'];for(const x of keys)delete ky[x];const r=Math.random();if(r<.7){ky[keys[k%4]]=1;if(Math.random()<.4)ky[keys[(k+1)%4]]=1}atk=Math.random()<.6;
    if(k%9==0){try{ia()}catch(e){}if($('bm').style.display=='block'){closeBase();PAUSE=false}}if(k%13==0){const P=S.p;for(let i=0;i<4;i++)mk(P.x+Math.cos(i*1.7)*160,P.y+Math.sin(i*1.7)*130,{look:['civ1','runner','crawler','spitter'][i]})}
    if(k%17==0)S.t=(S.t+400)%2400;if(k%31==0){try{wave((S.wv|0)+1)}catch(e){}}if(k%23==0&&S.p.hp<40){S.p.hp=MHP(S.p)}if(k%41==0)useQuick(1);if(k%37==0)cycleW()},k);
   await p.waitForTimeout(400);
   const r=await p.evaluate(()=>{const o=[];const P=S.p;for(const v of['x','y','hp','food','water'])if(!isFinite(P[v]))o.push('p.'+v+' not finite');for(const kk in P.inv)if(!(P.inv[kk]>=0))o.push('inv '+kk+'='+P.inv[kk]);for(const z of Z)if(!isFinite(z.x)||!isFinite(z.hp))o.push('zombie NaN '+z.look);
    if(PAUSE&&$('bm').style.display!='block')o.push('paused with no window');if(!run)o.push('not running');if(Z.length>400)o.push('zombie count '+Z.length);if(typeof DUN!='undefined'&&!DUN&&blocker(P.x,P.y,6)&&!S.dr)o.push('stuck in a wall');return o});for(const m of r)note('state: '+m)}
  const fin=await p.evaluate(()=>({day:S.day,wave:S.wv,kills:S.kills,lv:S.pg.lv,hp:Math.round(S.p.hp),z:Z.length}));console.log('soak '+SEC+'s · steps '+k,JSON.stringify(fin));await p.screenshot({path:path.join(OUT,'soak_end.png')});await ctx.close()}
 console.log('\n=== issues ===');for(const k in issues)console.log((issues[k]>1?issues[k]+'× ':'')+k);await b.close()})();
