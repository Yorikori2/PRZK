/* PROJECT LEGACY (stage 3 sample build: hooks for stats, skills and gun parts live in stage3.js) — stage 2 systems: equipment slots, weight bag, typed ammo, weapons (melee durability,
   magazines/reload, pellets, pierce, explosions, fire, stun, noise), throwables, quick slots, new HUD and bag sheet.
   Loaded after items.js; uses game globals (S, Z, fx, msg, $, blood, los, ...) only at call time. */
'use strict';
/* ---------- registry additions ---------- */
if(!W_BY.axe){WEAPONS.push(['axe','도끼','m','u',{d:50,cd:.55,r:46,dur:100,nz:1,wt:2},'제작 가능 · 튼튼한 날','제작']);W_BY.axe=WEAPONS[WEAPONS.length-1];
 I('axe',()=>{R(woodC,10,6,3,16);R(woodD,12,6,1,16);R(steelD,4,3,9,7);R(steel,4,3,9,2);R(steelL,4,3,2,7)})}
SUB.axe=SUB.axe||'근접';
[['a357','.357 매그넘','a','u',.02,'리볼버','#8a5a33','#e0b050'],['a50','.50 대구경','a','e',.06,'대구경 권총 · 대물 저격총','#3a3f45','#e8c43a'],['a762','7.62mm 탄','a','r',.02,'전투소총 · 지정사수소총 · 미니건','#4f5a35','#d8b040'],
 ['aarrow','화살','a','c',.04,'활 · 회수 가능','#8a5a33','#c9ced3'],['anail','못','a','c',.005,'네일건','#8a9096','#c9ced3'],['aflare','신호탄','a','u',.2,'신호탄 총','#c43c32','#f0a030'],
 ['a40mm','40mm 유탄','a','l',.25,'유탄 발사기','#4f5a35','#e0b03a'],['arocket','로켓','a','l',2.5,'로켓 발사기','#5a6440','#c43c32'],['ataser','전기충격 카트리지','a','u',.05,'전기충격총','#e0b03a','#4aa0ff']]
 .forEach(([id,n,c,r,wt,d,c1,c2])=>{if(!I_BY[id]){const it=[id,n,c,r,wt,d];ITEMS.push(it);I_BY[id]=it;I(id,()=>ammoBox(c1,c2))}});
if(!I_BY.molotov&&W_BY.molotov){}
const AMMO_ITEM=k=>k=='fuel'?'fuel':'a'+k;
const NM2=id=>({ammo:'탄약',fist:'맨손'})[id]||itemName(id);
const wtOf=id=>W_BY[id]?W_BY[id][4].wt:(I_BY[id]?I_BY[id][4]:.5);
const catOf=id=>W_BY[id]?'w':(I_BY[id]?I_BY[id][2]:'m');
const SLOTS=[['prim','주무기'],['sec','보조무기'],['mel','근접'],['thr','투척'],['head','머리'],['body','몸통'],['bag','가방']];
const SLOTN=Object.fromEntries(SLOTS);
const PISTOLS=new Set(['pistol','spistol','revolver','hpistol','mpistol','taser','flare','sawnoff']);
function slotFor(id){const w=W_BY[id];if(w)return w[2]=='m'?'mel':w[2]=='t'?'thr':PISTOLS.has(id)?'sec':'prim';
 if(['vest','armor','milarmor'].includes(id))return'body';if(id=='helmet')return'head';if(/^bag\d$/.test(id))return'bag';return null}
const RW={c:1,u:2,r:3,e:4,l:5};
const wscore=id=>{const w=W_BY[id];if(!w)return 0;const s=w[4];return s.d*(s.pel||1)*(1/Math.max(.05,s.cd))*(s.aoe?2:1)+RW[w[3]]};
const BODYMUL={vest:.7,armor:.6,milarmor:.45},BAGCAP={bag1:10,bag2:20,bag3:35};
/* ---------- inventory model ---------- */
function gearInit(p){p.inv=p.inv||{};p.eq=p.eq||{prim:'',sec:'',mel:'',thr:'',head:'',body:'',bag:''};p.mag=p.mag||{};p.dur=p.dur||{};p.quick=p.quick||['bandage','medkit','food','water'];
 if(p.st==null)p.st=100;if(!p.as)p.as='mel';p.rl=0}
function migrateInv(p,base){const mv=(o,a,b)=>{if(o[a]){o[b]=(o[b]||0)+o[a];delete o[a]}};mv(p.inv,'ammo','a9mm');mv(p.inv,'rifle','ar');mv(p.inv,'shotgun','pump');if(base)mv(base,'ammo','a9mm');
 delete p.wsel;gearInit(p);for(const id in p.inv)if(p.inv[id]>0)autoEquip(p,id,true)}
const has=(p,id)=>(p.inv[id]||0)>0;
function invAdd(p,id,n){p.inv[id]=(p.inv[id]||0)+n;if(n>0)autoEquip(p,id)}
function invTake(p,id,n=1){p.inv[id]=Math.max(0,(p.inv[id]||0)-n);if(!p.inv[id]){for(const k in p.eq)if(p.eq[k]==id)p.eq[k]='';delete p.inv[id]}}
function autoEquip(p,id,quiet){const sl=slotFor(id);if(!sl)return;const cur=p.eq[sl];
 const better=!cur||(sl=='body'?BODYMUL[id]<BODYMUL[cur]:sl=='bag'?BAGCAP[id]>BAGCAP[cur]:sl=='head'?false:wscore(id)>wscore(cur));
 if(better){p.eq[sl]=id;if(W_BY[id]&&W_BY[id][4].mag&&p.mag[id]==null)p.mag[id]=0;if(!quiet&&typeof msg=='function')setTimeout(()=>msg('🎽 '+SLOTN[sl]+' 장착: '+NM2(id)),900)}}
function weight(p){let w=0;for(const id in p.inv)w+=wtOf(id)*(p.inv[id]||0);return w}
const capacity=p=>20+(BAGCAP[p.eq.bag]||0)+(typeof s3Cap=='function'?s3Cap(p):0);
function armMul2(p){return(typeof s3Arm=='function'?s3Arm():1)*(BODYMUL[p.eq.body]||1)*(p.eq.head=='helmet'?.9:1)}
const speedMul=p=>{const w=weight(p),c=capacity(p);return(w<=c?1:Math.max(.45,1-(w-c)/c))*(typeof s3Spd=='function'?s3Spd(p):1)};
/* ---------- active weapon ---------- */
const ACT=['prim','sec','mel','thr'];
function actW(p){if(p.as=='fist')return'fist';const id=p.eq[p.as];if(id&&has(p,id))return id;for(const s of ACT)if(p.eq[s]&&has(p,p.eq[s])){p.as=s;return p.eq[s]}return'fist'}
const FIST=['fist','맨손','m','c',{d:10,cd:.45,r:42,nz:0,wt:0},'',''];
const wdef=id=>id=='fist'?FIST:(typeof s3W=='function'?s3W(id):W_BY[id]);
function cycleSlot(){const p=S.p,av=ACT.filter(s=>p.eq[s]&&has(p,p.eq[s]));if(!av.length){p.as='fist';return msg('⚔ 맨손')}const i=av.indexOf(p.as);p.as=av[(i+1)%av.length];p.rl=0;const id=actW(p);msg('⚔ '+NM2(id)+wInfo(p,id))}
function wInfo(p,id){const w=wdef(id),s=w[4];if(s.ammo)return' · '+(p.mag[id]|0)+'/'+(p.inv[AMMO_ITEM(s.ammo)]|0);if(s.dur)return' · 내구 '+(p.dur[id]??s.dur)+'/'+s.dur;if(w[2]=='t')return' · '+(p.inv[id]|0)+'개';return''}
function wpnOf2(p){const id=actW(p);if(id=='fist')return null;const w=W_BY[id];if(w[2]=='t')return null;if(w[2]=='m')return['axe','fireaxe','sledge','machete','chainsaw'].includes(id)?'axe':'bat';return PISTOLS.has(id)?'pistol':'rifle'}
const RLT=id=>{const sb=SUB[id]||'';return id=='lmg'||id=='minigun'?3:sb=='저격'||id=='amr'?2.2:sb=='발사기'?2:sb=='산탄총'?1.8:sb=='소총'?1.6:sb=='기관단총'?1.4:id=='bow'||id=='crossbow'?.8:1.1};
function reload(p,quiet){const id=actW(p),w=wdef(id),s=w[4];if(!s.ammo||!s.mag)return;const ai=AMMO_ITEM(s.ammo),need=s.mag-(p.mag[id]|0),have=p.inv[ai]|0;
 if(need<=0)return quiet||msg('탄창이 가득 찼습니다');if(have<=0)return quiet||msg('🔫 '+NM2(ai)+' 없음');if(p.rl>0)return;
 if(s.ammo=='fuel'){p.rlw=id;p.rl=RLT(id)*(s.rlm||1);p.rlA=1;p.rlN=s.mag-(p.mag[id]|0);return}
 p.rlw=id;p.rl=RLT(id)*(s.rlm||1);p.rlN=Math.min(need,have);p.rlA=p.rlN;msg('🔄 재장전 중…')}
function reloadTick(p,dt){if(p.rl>0){p.rl-=dt;if(p.rl<=0){const id=p.rlw,w=wdef(id),s=w[4];if(actW(p)!=id)return;const ai=AMMO_ITEM(s.ammo);if(!has(p,ai))return;
  invTake(p,ai,p.rlA);p.mag[id]=(p.mag[id]|0)+p.rlN;if(p.mag[id]>s.mag)p.mag[id]=s.mag}}}
/* ---------- combat ---------- */
const NZR=[0,160,320,520,720,950];
function noise(x,y,lv){const r=NZR[Math.max(0,Math.min(5,lv|0))];if(!r)return;for(const q of Z)if(Math.hypot(q.x-x,q.y-y)<r){q.al=8;q.nx=x;q.ny=y}}
function hitZ(q,dmg,dx,dy,n=3){q.hp-=dmg;blood(q.x,q.y,dx,dy,n)}
/* ---------- auto-targeting: keeps a locked target inside weapon range (line of sight, facing bonus, sticky) ---------- */
const visible=(p,q,d)=>d<46||los(p.x,p.y-12,q.x,q.y-12);
function scoreT(p,q,d){const f=((q.x-p.x)*p.fx+(q.y-p.y)*p.fy)/(d||1);return d*(1.25-.35*f)*(q.look=='screamer'?.85:1)}
function updTarget(p){const w=wdef(actW(p)),r=w[4].r||42,cur=S.tg&&Z.includes(S.tg)&&S.tg.hp>0?S.tg:null;let best=null,bs=1e9;
 for(const q of Z){const d=Math.hypot(q.x-p.x,q.y-p.y);if(d>r*1.35||!visible(p,q,d))continue;const sc=scoreT(p,q,d);if(sc<bs){bs=sc;best=q}}
 if(cur){const d=Math.hypot(cur.x-p.x,cur.y-p.y);if(d<=r*1.35&&visible(p,cur,d)&&!(best&&best!==cur&&bs<scoreT(p,cur,d)*.6))best=cur}
 S.tg=best;S.tgIn=!!best&&Math.hypot(best.x-p.x,best.y-p.y)<=r;return best}
function nearestTarget(p,r){const t=updTarget(p);if(t){const d=Math.hypot(t.x-p.x,t.y-p.y);if(d<r)return[t,d]}return[null,1e9]}
function cone(p,dx,dy,r,dot){return Z.filter(q=>{const d=Math.hypot(q.x-p.x,q.y-p.y)||1;return d<r&&((q.x-p.x)*dx+(q.y-p.y)*dy)/d>dot&&(d<46||los(p.x,p.y-12,q.x,q.y-12))}).sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))}
function boom(x,y,rad,dmg,fire){fx.push({k:'boom',x,y,r:rad,l:.45,m:.45});for(const q of Z){const d=Math.hypot(q.x-x,q.y-y);if(d<rad){hitZ(q,dmg*(1-d/rad*.6),(q.x-x)/(d||1),(q.y-y)/(d||1),6);if(fire)q.burn=4}}
 const p=S.p,dp=Math.hypot(p.x-x,p.y-y);if(dp<rad*.8&&!fire){p.hp-=Math.round(30*(1-dp/rad));msg('💥 폭발에 휘말렸습니다!')}noise(x,y,5)}
function gearAct(){const p=S.p;if(p.ac>0||S.dr||p.rl>0)return;const id=actW(p),w=wdef(id),s=w[4],cat=w[2];
 if(cat=='t')return throwIt(p,id,s);
 const[z,d0]=nearestTarget(p,s.r);
 if(cat=='g'){if((p.mag[id]|0)<=0){p.ac=.2;if((p.inv[AMMO_ITEM(s.ammo)]|0)>0)reload(p);else{msg('🔫 '+NM2(AMMO_ITEM(s.ammo))+' 없음 · 근접 무기로 전환');if(p.eq.mel&&has(p,p.eq.mel))p.as='mel';else p.as='fist'}return}
  p.ac=s.cd;if(!z)return;const dx=(z.x-p.x)/(d0||1),dy=(z.y-p.y)/(d0||1);p.fx=dx;p.fy=dy;p.mag[id]--;
  const mx=p.x+dx*16,my=p.y-17;fx.push({k:'fl',x:mx,y:my,l:.07});noise(p.x,p.y,s.nz);
  if(id=='flamer'){for(const q of cone(p,dx,dy,s.r,.82)){hitZ(q,s.d,dx,dy,1);q.burn=3}fx.push({k:'flame',x:mx,y:my,dx,dy,r:s.r,l:.12});return}
  if(s.aoe){const tx=z.x,ty=z.y;fx.push({k:'tr',a:[mx,my],b:[tx,ty-10],l:.12});boom(tx,ty,s.aoe,s.d);return}
  if(id=='taser'){z.stun=3;hitZ(z,s.d,dx,dy,0);fx.push({k:'zap',a:[mx,my],b:[z.x,z.y-14],l:.2});for(const q of Z)if(q!==z&&Math.hypot(q.x-z.x,q.y-z.y)<60){q.stun=2;fx.push({k:'zap',a:[z.x,z.y-14],b:[q.x,q.y-14],l:.2})}return}
  let tg;if(s.pel)tg=cone(p,dx,dy,s.r,.9).slice(0,s.pel);else if(s.pierce)tg=cone(p,dx,dy,s.r,.975).slice(0,s.pierce);else tg=[z];if(!tg.length)tg=[z];
  for(const q of tg){const d=Math.hypot(q.x-p.x,q.y-p.y);hitZ(q,s.d*(s.pel?1+(1-d/s.r):1),dx,dy,s.pel?4:s.d>60?7:4);if(id=='flare')q.burn=3;fx.push({k:'tr',a:[mx,my],b:[q.x,q.y-14],l:.08})}
  if(s.pel)for(let i=tg.length;i<Math.min(3,s.pel);i++){const a=Math.atan2(dy,dx)+(Math.random()-.5)*.4;fx.push({k:'tr',a:[mx,my],b:[mx+Math.cos(a)*s.r*.7,my+Math.sin(a)*s.r*.7],l:.06})}
  if(id=='flare')S.flares=(S.flares||[]).concat([{x:z.x,y:z.y,t:8}]);return}
 // melee
 let cd=s.cd;if(id!='fist'){if(p.st<8){cd*=1.8}p.st=Math.max(0,p.st-(s.wt>3?10:6))}
 if(id=='chainsaw'&&(p.mag[id]|0)<=0){if((p.inv.fuel|0)>0){p.mag[id]=s.mag;invTake(p,'fuel',1);msg('⛽ 전기톱에 연료 주입')}else{msg('전기톱 연료 없음');p.as=p.eq.prim?'prim':'fist';return}}
 p.ac=cd;if(!z){fx.push({k:'sw',x:p.x,y:p.y,fx:p.fx,fy:p.fy,l:.15});return}
 const dx=(z.x-p.x)/(d0||1),dy=(z.y-p.y)/(d0||1);p.fx=dx;p.fy=dy;const tg=id=='fireaxe'||id=='axe'||id=='sledge'?cone(p,dx,dy,s.r+4,.55).slice(0,2):[z];if(!tg.length)tg.push(z);
 for(const q of tg){hitZ(q,s.d,dx,dy,3);if(id=='knife'||id=='machete')q.bleed=4;if(id=='baton')q.stun=.7;if(id=='sledge'||id=='bat'){const k=id=='sledge'?22:10;mv(q,dx*k,dy*k,7)}}
 if(id=='chainsaw')p.mag[id]--;fx.push({k:'sw',x:p.x,y:p.y,fx:dx,fy:dy,l:.15});noise(p.x,p.y,s.nz);
 if(s.dur){p.dur[id]=(p.dur[id]??s.dur)-1;if(p.dur[id]<=0){delete p.dur[id];invTake(p,id,1);msg('💔 '+NM2(id)+' 이(가) 부서졌습니다');if(!has(p,id))p.as='fist';else p.eq.mel=id}}}
function throwIt(p,id,s){if(!has(p,id))return;const[z,d0]=nearestTarget(p,s.r);let tx,ty;if(z){tx=z.x;ty=z.y}else{tx=p.x+p.fx*s.r*.7;ty=p.y+p.fy*s.r*.7}
 p.ac=s.cd;invTake(p,id,1);S.thr=(S.thr||[]).concat([{id,x0:p.x,y0:p.y-14,x:tx,y:ty,t:0,T:.55}]);if(!has(p,id))p.as=p.eq.mel?'mel':'fist'}
function gearUpd(dt){const p=S.p;reloadTick(p,dt);if(p.ac<=0&&p.st<100)p.st=Math.min(100,p.st+dt*(p.mv?10:18));
 S.thr=(S.thr||[]).filter(t=>{t.t+=dt;if(t.t<t.T)return true;const w=W_BY[t.id][4];
  if(t.id=='grenade')boom(t.x,t.y,w.aoe,w.d);else if(t.id=='molotov'){S.fires=(S.fires||[]).concat([{x:t.x,y:t.y,r:w.aoe,t:6}]);noise(t.x,t.y,w.nz);fx.push({k:'boom',x:t.x,y:t.y,r:w.aoe*.6,l:.3,m:.3,fire:1})}
  else if(t.id=='lure'){S.lures=(S.lures||[]).concat([{x:t.x,y:t.y,t:10}]);msg('📢 유인기 작동 (10초)')}return false});
 S.fires=(S.fires||[]).filter(f=>{f.t-=dt;for(const q of Z)if(Math.hypot(q.x-f.x,q.y-f.y)<f.r){q.burn=Math.max(q.burn||0,2)}if(Math.hypot(p.x-f.x,p.y-f.y)<f.r*.8)p.hp-=dt*6;return f.t>0});
 S.lures=(S.lures||[]).filter(l=>{l.t-=dt;for(const q of Z)if(Math.hypot(q.x-l.x,q.y-l.y)<650){q.al=1;q.nx=l.x;q.ny=l.y}return l.t>0});
 S.flares=(S.flares||[]).filter(l=>{l.t-=dt;return l.t>0});
 for(const q of Z){if(q.burn>0){q.burn-=dt;q.hp-=dt*14;if(Math.random()<dt*6)fx.push({k:'ember',x:q.x+(Math.random()-.5)*10,y:q.y-10-Math.random()*16,l:.35})}if(q.bleed>0){q.bleed-=dt;q.hp-=dt*5}if(q.stun>0)q.stun-=dt}}
let SHOWR=true;try{SHOWR=localStorage.getItem('pl_range')!=='0'}catch(e){}
function toggleRange(){SHOWR=!SHOWR;try{localStorage.setItem('pl_range',SHOWR?'1':'0')}catch(e){}msg(SHOWR?'◎ 공격 사거리 표시 켜짐':'공격 사거리 표시 꺼짐');const b=document.getElementById('rng');if(b)b.classList.toggle('on',SHOWR)}
function drawRange(){const p=S.p;if(S.dr||!SHOWR)return;const id=actW(p),w=wdef(id),r=w[4].r||42,cx=p.x,cy=p.y-4,hot=S.tgIn,t=performance.now()/1000;
 g.save();g.globalAlpha=(hot?.14:.07)*(r>120?.35:1);g.fillStyle=hot?'#ff5a4a':'#ffffff';g.beginPath();g.arc(cx,cy,r,0,6.2832);g.fill();g.globalAlpha=hot?.75:.4;g.strokeStyle=hot?'#ff6a5a':'#ffffff';g.lineWidth=1;g.setLineDash([5,4]);g.lineDashOffset=-t*8;g.beginPath();g.arc(cx,cy,r,0,6.2832);g.stroke();g.setLineDash([]);
 if(w[2]=='g'&&(w[4].pel)){const a0=Math.atan2(p.fy,p.fx);g.globalAlpha=.25;g.beginPath();g.moveTo(cx,cy);g.arc(cx,cy,r,a0-.45,a0+.45);g.closePath();g.fillStyle=hot?'#ff6a5a':'#fff';g.fill()}g.restore()}
function drawReticle(){const z=S.tg;if(!z||!Z.includes(z)||S.dr)return;const sc=z.b?1.7:z.look=='heavy'?1.35:1,hw=11*sc,top=z.y-38*sc,bot=z.y+3,pul=Math.sin(performance.now()/120)*1.5,c=S.tgIn?'#ff4a3a':'#ffffffa0',k=5;
 const x0=z.x-hw-pul,x1=z.x+hw+pul,y0=top-pul,y1=bot+pul;for(const[x,y,dx,dy]of[[x0,y0,1,1],[x1,y0,-1,1],[x0,y1,1,-1],[x1,y1,-1,-1]]){R(c,x,y,dx*k,1);R(c,x,y,1,dy*k)}
 if(z.mhp){const f=Math.max(0,z.hp/z.mhp);R('#000000a0',z.x-12,top-6,24,3);R(f>.5?'#e05a4a':'#ff9a3a',z.x-12,top-6,24*f,3)}
 if(S.tgIn){const p=S.p;g.globalAlpha=.35;ln(p.x,p.y-14,z.x,z.y-14,'#ff6a5a');g.globalAlpha=1}}
function drawGearFx(){drawReticle();for(const t of S.thr||[]){const k=t.t/t.T,x=t.x0+(t.x-t.x0)*k,y=t.y0+(t.y-t.y0)*k-Math.sin(k*Math.PI)*30;R('#1d1714',x-2,y-2,5,5);R(t.id=='molotov'?'#e07a2a':t.id=='lure'?'#e0b03a':'#4f5a35',x-1,y-1,3,3)}
 for(const f of S.fires||[]){for(let i=0;i<14;i++){const a=i*2.4+performance.now()/300,r=f.r*(.3+.6*((i*37)%10)/10),x=f.x+Math.cos(a)*r,y=f.y+Math.sin(a)*r*.6;R(i%3?'#ff9a2e':'#ffd25a',x,y-((performance.now()/60+i*7)%8),2,3)}g.globalAlpha=.25;blob(f.x,f.y,f.r,f.r*.6,'#ff6a1a');g.globalAlpha=1}
 for(const l of S.lures||[]){const on=Math.sin(performance.now()/120)>0;R('#1d1714',l.x-4,l.y-8,8,8);R(on?'#ffd23f':'#806a1a',l.x-3,l.y-7,6,6)}
 for(const l of S.flares||[]){g.globalAlpha=.5;blob(l.x,l.y,6,4,'#ff4a3a');g.globalAlpha=1}
 for(const f of fx){if(f.k=='boom'){const k=1-f.l/f.m;g.globalAlpha=Math.max(0,f.l/f.m);blob(f.x,f.y,f.r*(.4+k*.6),f.r*(.25+k*.4),f.fire?'#ff7a2a':'#ffd06a');blob(f.x,f.y,f.r*(.2+k*.3),f.r*(.12+k*.2),'#fff6c0');g.globalAlpha=1}
  else if(f.k=='flame'){for(let i=0;i<12;i++){const t=i/12;R(i%2?'#ff9a2e':'#ffd25a',f.x+f.dx*f.r*t+(Math.random()-.5)*10*t,f.y+f.dy*f.r*t+(Math.random()-.5)*8*t,3,3)}}
  else if(f.k=='zap'){g.strokeStyle='#8ad0ff';g.lineWidth=1;g.beginPath();g.moveTo(f.a[0],f.a[1]);for(let i=1;i<5;i++)g.lineTo(f.a[0]+(f.b[0]-f.a[0])*i/5+(Math.random()-.5)*6,f.a[1]+(f.b[1]-f.a[1])*i/5+(Math.random()-.5)*6);g.lineTo(f.b[0],f.b[1]);g.stroke()}
  else if(f.k=='ember')R('#ffb03a',f.x,f.y-(.35-f.l)*20,1,2)}}
/* ---------- loot ---------- */
const AMLOOT={police:['a9mm','a9mm','a12g','a556','a357','ataser'],mil:['a556','a556','a762','a9mm','a308','a12g','a50','a40mm'],houses:['a9mm','a12g','a357','a308'],apt:['a9mm','a12g','a357'],hard:['anail','anail','a12g'],
 fire:['aflare','a12g'],church:['a12g','abolt','aarrow'],lab:['a9mm','a9mm','fuel'],mart:['a9mm'],school:['a9mm','anail'],clinic:['a9mm'],ware:['anail','a9mm','a12g']};
const AMN={a9mm:[8,16],a12g:[4,8],a556:[10,20],a762:[8,14],a308:[3,6],a357:[4,8],a50:[2,4],abolt:[3,5],aarrow:[4,6],anail:[15,30],aflare:[1,2],a40mm:[1,2],arocket:[1,1],ataser:[2,3],fuel:[2,4]};
const WLOOT={police:['baton','pistol','taser','pump','carbine','revolver','mpistol','smg','pdw'],mil:['ar','battle','dmr','sniper','smg','ssmg','grenade','machete','spistol','hpistol','autosg','gl','lmg','minigun','amr','rpg'],
 hard:['wrench','pipe','crowbar','sledge','nailgun','chainsaw'],fire:['fireaxe','flare','pipe'],houses:['knife','bat','revolver','sawnoff','hunting','bow','pistol'],apt:['knife','bat','pistol','revolver'],
 school:['bat','lure','knife'],church:['dbarrel','crossbow','bow','hunting'],ware:['pipe','crowbar','wrench','nailgun'],lab:['spistol','ssmg','flamer','rpg','lure'],mart:['knife','wrench'],clinic:['knife']};
const GLOOT={police:['vest','helmet','bag1'],mil:['milarmor','helmet','bag3','bag2'],fire:['helmet','bag2'],houses:['bag1','bag2'],school:['bag1'],church:['bag2'],ware:['bag2'],lab:['vest','medkit','pills'],clinic:['medkit','pills'],apt:['bag1']};
const RWT={c:10,u:6,r:3,e:1.2,l:.35};
function pickW(list,tier){const ok=list.filter(id=>W_BY[id]&&RW[W_BY[id][3]]<=tier+1);if(!ok.length)return null;let t=0;for(const id of ok)t+=RWT[W_BY[id][3]];let r=Math.random()*t;for(const id of ok){r-=RWT[W_BY[id][3]];if(r<=0)return id}return ok[0]}
function ammoFor(kind){const L=AMLOOT[kind]||['a9mm'];return L[Math.random()*L.length|0]}
const amtOf=id=>{const a=AMN[id]||[1,1];return a[0]+(Math.random()*(a[1]-a[0]+1)|0)};
function lootExtra(r,kind,tier,o){ // weapons, ammo matching owned guns, gear
 if(WLOOT[kind]&&Math.random()<.05*tier+.02){const id=pickW(WLOOT[kind],tier);if(id&&!(W_BY[id][2]=='t'?false:(S.p.inv[id]>0&&Math.random()<.6)))r[id]=(r[id]||0)+(W_BY[id][2]=='t'?1+(Math.random()*2|0):1)}
 if(GLOOT[kind]&&Math.random()<.03*tier){const L=GLOOT[kind],id=L[Math.random()*L.length|0];r[id]=(r[id]||0)+1}
 const guns=['prim','sec'].map(s=>S.p.eq[s]).filter(Boolean);if(guns.length&&Math.random()<.18){const w=W_BY[guns[Math.random()*guns.length|0]],ai=AMMO_ITEM(w[4].ammo);if(ai!='fuel'||Math.random()<.3)r[ai]=(r[ai]||0)+amtOf(ai)}}
function resolveAmmo(r,kind){if(r.ammo){const n=r.ammo;delete r.ammo;for(let i=0;i<Math.max(1,Math.round(n/4));i++){const id=ammoFor(kind);r[id]=(r[id]||0)+amtOf(id)}}return r}
/* ---------- crafting ---------- */
const RCP2=[['bat',{wood:3,scrap:2},null],['pipe',{scrap:6},['bench',1,'작업대 Lv1']],['axe',{wood:2,scrap:4},['bench',1,'작업대 Lv1']],['machete',{scrap:8,wood:2},['bench',2,'작업대 Lv2']],['bow',{wood:4,cloth:2},['bench',1,'작업대 Lv1']],
 ['bandage',{cloth:2},null],['medkit',{meds:2,cloth:1},['med',1,'의무실 Lv1']],['molotov',{fuel:1,cloth:1},null],['lure',{elec:2,scrap:2},['bench',1,'작업대 Lv1']],
 ['a9mm',{scrap:3},null,b=>[6,6,10,14][b]],['a12g',{scrap:4},['bench',1,'작업대 Lv1'],b=>[4,4,6,8][b]],['a556',{scrap:4,elec:1},['bench',2,'작업대 Lv2'],b=>[0,0,10,16][b]],['anail',{scrap:2},null,()=>20],['aarrow',{wood:2,scrap:1},null,()=>6],
 ['bag1',{cloth:6},null],['armor',{scrap:12,cloth:4},['bench',3,'작업대 Lv3']]];
/* ---------- HUD ---------- */
let AVA=null;
function avatar(){if(AVA)return AVA;const c=document.createElement('canvas');c.width=24;c.height=24;const o=g;g=c.getContext('2d');const sp=sprite('pava',36,40,()=>person(LOOKS.player,'d',-1,null));g.drawImage(sp,-6,1);g=o;return AVA=c}
const bar2=(v,c)=>'<div class="b2"><i style="width:'+Math.max(0,Math.min(100,v))+'%;background:'+c+'"></i></div>';
const ICN={};const icon=id=>{if(!ICN[id])ICN[id]=iconCanvas(id,1).toDataURL();return ICN[id]};
function hud2(){const s=S,p=s.p,t=s.t,h=(6+t/100)%24,am=armMul2(p),w=weight(p),cap=capacity(p),ib=inBase(p.x,p.y);
 const fxs=[];if(p.bleed)fxs.push('<span class="cr">🩸 출혈</span>');if(am<1)fxs.push('<span class="cg">🦺 방어 '+Math.round((1-am)*100)+'%</span>');if(w>cap)fxs.push('<span class="cr">🐢 과적</span>');if(s.dr)fxs.push('<span>🚗 운전</span>');if(ib)fxs.push('<span class="cg">🏠 거점</span>');if(p.st<15)fxs.push('<span class="cy">😮‍💨 지침</span>');
 $('st').innerHTML='<div class="av" id="avw"></div><div><div class="hl"><span>체력</span><b>'+Math.ceil(p.hp)+' / '+MHP(p)+'</b></div>'+bar2(p.hp/MHP(p)*100,'linear-gradient(90deg,#b8322c,#e0574f)')+'<div class="hl"><span>무게 '+w.toFixed(1)+'/'+cap+'kg · 처치 '+s.kills+'</span></div></div>'+
  '<div class="m3"><div>🍖 허기'+bar2(p.food,'#e0a030')+'</div><div>💧 갈증'+bar2(p.water,'#4aa0e0')+'</div><div>⚡ 기력'+bar2(p.st,'#8ad06a')+'</div></div>'+(fxs.length?'<div class="fxs">'+fxs.join('')+'</div>':'');
 $('avw').appendChild(avatar());
 const nx=(s.day%5==0&&t<1500)?s.day:(Math.floor(s.day/5)+1)*5,left=(nx-s.day)*2400+1500-t;
 $('tp').innerHTML='<b>DAY '+s.day+' · '+String(h|0).padStart(2,'0')+':'+String((h%1)*60|0).padStart(2,'0')+(t>=1500||t<100?' 🌙':' ☀')+'</b><div class="w">🧟 '+(left>0?'웨이브까지 '+(left/2400|0? (left/2400|0)+'일 ':'')+Math.round((left%2400)/100)+'시간':'웨이브 진행 중')+' · 웨이브 '+s.wv+'</div>';
 let dg='';if(s.inb>=0&&W0.b[s.inb]){const b=W0.b[s.inb],tr=TIER[b.kind];if(tr)dg='📍 <b>'+b.name+' '+'★'.repeat(tr)+'</b>'+(ALR[b.kind]?' · 🚨 경보 '+Math.round(ALR[b.kind]*100)+'%'+((s.aoff[b.kind]||0)>=s.day?' (해제됨)':''):'')}
 if(s.alarm)dg='🚨 <b>'+W0.b[s.alarm.bi].name+' 경보 작동 중!</b>';if(!dg&&typeof UIE!='undefined'&&UIE.on)dg='📍 <b>건물 위험도</b> (건물 안에서만 표시)';$('dg').innerHTML=dg;$('dg').style.display=dg?'':'none';
 wcard();quick();$('bse').style.display=ib?'':'none'}
function wcard(){const p=S.p,id=actW(p),w=wdef(id),s=w[4],r=RAR[w[3]];let a='';
 if(s.ammo){const mg=p.mag[id]|0,rs=p.inv[AMMO_ITEM(s.ammo)]|0;a='<div class="am">'+(p.rl>0?'<small>재장전…</small>':mg+'<small> / '+rs+'</small>')+'</div>'}
 else if(s.dur){const du=p.dur[id]??s.dur;a='<div class="am"><small>내구 '+du+'/'+s.dur+'</small>'+bar2(du/s.dur*100,du/s.dur<.25?'#e0574f':'#8ad06a')+'</div>'}
 else if(w[2]=='t')a='<div class="am">'+(p.inv[id]|0)+'<small> 개</small></div>';
 $('wc').innerHTML=(id=='fist'?'<div class="wi">✊</div>':'<img class="wi" src="'+icon(id)+'">')+'<div><div class="wn">'+NM2(id)+'</div><div class="wr" style="color:'+r[1]+'">'+(id=='fist'?'무기 없음':r[0]+' · '+(s.ammo?NM2(AMMO_ITEM(s.ammo)):{m:'근접',t:'투척',g:'총기'}[w[2]]))+'</div>'+a+'</div>'+
  '<div class="wb">'+(s.ammo&&s.mag?'<span data-a="rl">🔄 재장전</span>':'')+'<span data-a="sw">⇄ 교체</span></div>'}
function quick(){const p=S.p;$('qk').innerHTML=p.quick.map((id,i)=>'<div class="qs'+(id&&has(p,id)?'':' off')+'" data-q="'+i+'">'+(id?'<img src="'+icon(id)+'">':'')+'<span class="k">'+(i+1)+'</span><span class="c">'+(id?p.inv[id]|0:'')+'</span></div>').join('')}
function useQuick(i){const p=S.p,id=p.quick[i];if(!id)return msg('빈 퀵슬롯 · 가방에서 아이템을 등록하세요');if(!has(p,id))return msg(NM2(id)+' 없음');
 const w=W_BY[id];if(w&&w[2]=='t'){p.eq.thr=id;p.as='thr';return msg('🧨 '+NM2(id)+' 준비 · 공격 버튼으로 던지기')}if(catOf(id)=='c')return use2(id);msg(NM2(id))}
function use2(k){const p=S.p;if(!has(p,k))return msg(NM2(k)+' 없음');invTake(p,k,1);if(k=='food')p.food=Math.min(100,p.food+35);if(k=='water')p.water=Math.min(100,p.water+40);
 if(k=='bandage'){p.bleed=0;p.hp=Math.min(MHP(p),p.hp+s3Heal()*(S.base.lv.med>=3?25:10));msg('🩹 붕대 사용')}if(k=='medkit'){p.bleed=0;p.hp=Math.min(MHP(p),p.hp+s3Heal()*50);msg('💊 구급상자 사용')}if(k=='pills'){p.hp=Math.min(MHP(p),p.hp+s3Heal()*15);msg('💊 항생제 복용')}}
function prompt2(){const p=S.p,el=$('pr');if(S.dr||$('bm').style.display=='block'){el.style.display='none';return}let t=null,x=0,y=0;
 if(Math.hypot(S.car.x-p.x,S.car.y-p.y)<46){t='🚗 <b>운전</b>'+((p.inv.fuel|0)>0?'':' · 연료 필요');x=S.car.x;y=S.car.y-30}
 const core=BP.find(o=>o.t=='tentS'||o.t=='container'||o.t=='hq');if(!t&&core&&rdist(core,p.x,p.y)<60){t='🏠 <b>거점 관리</b>';x=core.x+core.w/2;y=core.y-40}
 if(!t)for(const q of S.pois)if(q.on&&Math.hypot(q.x-p.x,q.y-p.y)<40){t='📦 <b>열기</b>';x=q.x;y=q.y-30}
 if(!t)for(const d of W0.objs)if(d.t=='alarmbox'&&rdist(d,p.x,p.y)<34){t='🔕 <b>경보 장치 해제</b>';x=d.x;y=d.y-28;break}
 if(!t){const o=nearObj();if(o){t=avail(o)?'🔍 <b>수색</b> · '+NM[o.t]:'✔ 수색함 · '+NM[o.t];x=o.x+o.w/2;y=o.y-Math.min(40,o.h+18)-18}}
 if(!t){el.style.display='none';return}el.innerHTML=t;el.style.display='';el.style.left=((x-camX)*zoom)+'px';el.style.top=((y-camY)*zoom)+'px'}
/* round minimap: 0.1 scale world image */
const MK=.1;let MMB2=null;
function mmBuild(){const c=document.createElement('canvas');c.width=Math.ceil(WW*MK);c.height=Math.ceil(WH*MK);const m=c.getContext('2d');m.fillStyle='#2a3a24';m.fillRect(0,0,c.width,c.height);m.fillStyle='#55585e';
 for(let i=0;i<=NBX;i++)m.fillRect(i*(BW+RD)*MK,0,RD*MK,c.height);for(let i=0;i<=NBY;i++)m.fillRect(0,i*(BH+RD)*MK,c.width,RD*MK);
 W0.roofs.forEach(r=>{const kd=W0.b[r.bi].kind;m.fillStyle={police:'#4a6fd0',mil:'#6b7a3a',clinic:'#e8e8e8',school:'#c98a4a',mart:'#3f8a4a',hard:'#d98a2a',fire:'#c43c32',ware:'#8a7a5a',apt:'#a8a090',church:'#d8d0c0',lab:'#b8d0f0'}[kd]||'#8a8a96';m.fillRect(r.x*MK,r.y*MK,r.w*MK,r.h*MK)});
 m.fillStyle='#4a4426';m.fillRect((BL.ox+BL.x0)*MK,(BL.oy+BL.y0)*MK,(BL.x1-BL.x0)*MK,(BL.y1-BL.y0)*MK);m.strokeStyle='#e6b800';m.lineWidth=2;m.strokeRect((BL.ox+BL.x0)*MK+1,(BL.oy+BL.y0)*MK+1,(BL.x1-BL.x0)*MK-2,(BL.y1-BL.y0)*MK-2);return c}
let MMBIG=false;
function mm2(){const p=S.p,gps=has(p,'antenna')||S.base.lv.tower>=1,el=$('mmw');el.style.display=gps?'':'none';if(!gps)return;if(!MMB2)MMB2=mmBuild();const c=$('mm2'),x=c.getContext('2d'),W2=c.width,sc=MMBIG?.35:1,k=MK*sc;
 x.fillStyle='#000';x.fillRect(0,0,W2,W2);x.imageSmoothingEnabled=false;const cx=p.x*k-W2/2,cy=p.y*k-W2/2;x.drawImage(MMB2,-cx,-cy,MMB2.width*sc,MMB2.height*sc);
 S.pois.forEach(q=>{x.fillStyle=q.k=='drop'?'#4af':q.k=='zone'?'#f44':'#fa0';x.fillRect(q.x*k-cx-2,q.y*k-cy-2,4,4)});
 if(S.base.lv.tower>=2||has(p,'antenna')){x.fillStyle='#f55';Z.forEach(z=>x.fillRect(z.x*k-cx,z.y*k-cy,2,2))}if(S.alarm){x.fillStyle='#ff3030';x.fillRect(S.alarm.x*k-cx-3,S.alarm.y*k-cy-3,6,6)}
 x.fillStyle='#fff';x.fillRect(W2/2-2,W2/2-2,4,4)}
/* ---------- bag sheet ---------- */
let BSEL=null,BF='all';
function openBag(id){const b=$('bm'),p=S.p;b.dataset.m='bag';if(id)BSEL=id;const w=weight(p),cap=capacity(p);
 let h='<div class="sh"><h2>🎒 가방</h2><div class="wt">'+w.toFixed(1)+' / '+cap+' kg'+bar2(w/cap*100,w>cap?'#e0574f':w/cap>.85?'#e0a030':'#5fbf6a')+'</div><button onclick="closeBase()">✕</button></div>';
 h+='<div class="eq">'+SLOTS.map(([k,n])=>{const it=p.eq[k];return'<div class="slot'+(it?'':' off')+'" data-s="'+(it||'')+'">'+(it?'<img src="'+icon(it)+'">':'<i></i>')+'<div><div class="l">'+n+(p.as==k?' · 사용 중':'')+'</div><div class="v">'+(it?NM2(it):'비어 있음')+'</div></div></div>'}).join('')+'</div>';
 h+='<div class="flt">'+[['all','전체'],['w','무기'],['a','탄약'],['c','소모품'],['m','재료'],['e','장비']].map(([k,n])=>'<span class="chip'+(BF==k?' on':'')+'" data-f="'+k+'">'+n+'</span>').join('')+'</div>';
 const eqv=Object.values(p.eq),ids=Object.keys(p.inv).filter(id=>p.inv[id]>0&&(BF=='all'||catOf(id)==BF)).sort((a,b)=>'waecm'.indexOf(catOf(a))-'waecm'.indexOf(catOf(b))||RW[itemRar(b)]-RW[itemRar(a)]);
 h+='<div class="grid">'+(ids.map(id=>'<div class="cell'+(id==BSEL?' sel':'')+'" data-i="'+id+'"><img src="'+icon(id)+'"><i class="r" style="background:'+RAR[itemRar(id)][1]+'"></i>'+(p.inv[id]>1?'<span class="c">'+(p.inv[id]|0)+'</span>':'')+(eqv.includes(id)?'<span class="e">E</span>':'')+'</div>').join('')||'<div class="empty">비어 있음</div>')+'</div>';
 if(BSEL&&has(p,BSEL)){const id=BSEL,wd=W_BY[id],it=I_BY[id],r=RAR[itemRar(id)],sl=slotFor(id),eqd=sl&&p.eq[sl]==id;
  h+='<div class="det"><img src="'+icon(id)+'"><div><h3>'+NM2(id)+' <span class="badge" style="color:'+r[1]+';border-color:'+r[1]+'">'+r[0]+'</span></h3><div class="d">'+(wd?({m:'근접 무기',g:'총기 · '+NM2(AMMO_ITEM(wd[4].ammo||'9mm')),t:'투척 무기'}[wd[2]])+' · '+wd[5]:it?it[5]:'')+' · '+wtOf(id)+'kg × '+(p.inv[id]|0)+'</div>'+(wd?stats(wdef(id),id):'')+'</div>'+
   '<div class="ba">'+(sl?'<button data-b="eq">'+(eqd?'해제':'장착')+'</button>':'')+(catOf(id)=='c'?'<button data-b="use">사용</button>':'')+((catOf(id)=='c'||(wd&&wd[2]=='t'))?[0,1,2,3].map(i=>'<button data-b="q'+i+'">퀵'+(i+1)+'</button>').join(''):'')+'<button data-b="drop">버리기</button></div></div>'}
 b.innerHTML=h;b.style.display='block';
 b.querySelectorAll('[data-f]').forEach(c=>c.onclick=()=>{BF=c.dataset.f;openBag()});b.querySelectorAll('[data-i]').forEach(c=>c.onclick=()=>openBag(c.dataset.i));b.querySelectorAll('[data-s]').forEach(c=>c.onclick=()=>{if(c.dataset.s)openBag(c.dataset.s)});
 b.querySelectorAll('[data-b]').forEach(c=>c.onclick=()=>{const a=c.dataset.b,id=BSEL,sl=slotFor(id);
  if(a=='eq'){if(p.eq[sl]==id){p.eq[sl]='';if(p.as==sl)p.as='mel'}else{p.eq[sl]=id;if(ACT.includes(sl))p.as=sl;if(W_BY[id]&&W_BY[id][4].mag&&p.mag[id]==null)p.mag[id]=0}}
  else if(a=='use')use2(id);else if(a[0]=='q'){p.quick[+a[1]]=id;msg('퀵슬롯 '+(+a[1]+1)+': '+NM2(id))}
  else if(a=='drop'){const n=catOf(id)=='w'||catOf(id)=='e'?1:Math.max(1,Math.ceil((p.inv[id]|0)/2));invTake(p,id,n);msg('버림: '+NM2(id)+' '+n)}openBag()})}
function stats(w,id){const s=w[4],rows=[];const add=(n,v,t,c)=>rows.push('<span>'+n+'</span>'+bar2(v*100,c)+'<span>'+t+'</span>');
 add('피해',Math.min(1,(s.d*(s.pel||1))/120),s.pel?s.d+'×'+s.pel:s.d,'#e0574f');add('속도',Math.min(1,.12/s.cd+.08),(1/s.cd).toFixed(1)+'/s','#e0a030');
 if(w[2]!='m')add('사거리',s.r/520,s.r,'#4aa0e0');else if(s.dur)add('내구',(S.p.dur[id]??s.dur)/s.dur,(S.p.dur[id]??s.dur)+'/'+s.dur,'#8ad06a');add('소음',s.nz/5,['무음','작음','보통','큼','매우 큼','최대'][s.nz],'#b06ae0');if(s.mag)add('탄창',Math.min(1,s.mag/100),s.mag,'#c9ced3');return'<div class="stat">'+rows.join('')+'</div>'}
