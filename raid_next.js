/* PROJECT LEGACY — sample: hostile survivors (raiders). Gear, armour and health grow with the danger zone:
   zone 1 melee only → zone 2 pistols/shotguns + vests → zone 3 rifles/SMGs + helmets + grenades → zone 4 assault rifles,
   a sniper, military armour → zone 5+ machine guns and a leader. They fight zombies too; gunfire draws the dead in.
   Raiders live in Z (so your weapons, turrets and auto-aim treat them like any target) but run their own brain. */
'use strict';
{const H=(o)=>Object.assign({},LOOKS.player,{pack:0},o);
 LOOKS.rd1=H({p:'#4a3a2a',pd:'#382b1e',c:'#7a3a2a',cl:'#8a4a36',cd:'#5a2a1e',h:'#2a1e16',cap:'#2a2a2a'});
 LOOKS.rd2=H({p:'#3a3a40',pd:'#2a2a30',c:'#5a4a3a',cl:'#6a5a48',cd:'#46382a',h:'#1e1a16',cap:null,vest:'#3a4a5a'});
 LOOKS.rd3=H({p:'#2e3a2e',pd:'#223022',c:'#3e4a3a',cl:'#4e5a48',cd:'#2e3a2a',h:'#1e1a16',helm:'#3a3a3a',vest:'#2e3a46'});
 LOOKS.rd4=H({p:'#3a3a30',pd:'#2a2a22',c:'#4a4a3a',cl:'#5a5a48',cd:'#38382a',helm:'#2e3326',vest:'#3a4230'});
 LOOKS.rd5=H({p:'#1e1e22',pd:'#141418',c:'#2a2a30',cl:'#3a3a42',cd:'#1e1e24',helm:'#1a1a1a',vest:'#2a2a2a'});
 LOOKS.rdL=H({p:'#1e1e22',pd:'#141418',c:'#7a1e1e',cl:'#9a2a2a',cd:'#5a1414',helm:'#1a1a1a',vest:'#2a2a2a'})}
/* tier = danger zone (5 = zone 5 and beyond) */
const RT=[null,
 {nm:'약탈자',hp:100,arm:1,n:[2,3],kit:[['pipe','m'],['machete','m'],['bat','m']],dmg:12,spd:115},
 {nm:'무장 약탈자',hp:190,arm:.85,n:[3,3],kit:[['pistol','g'],['pump','g'],['machete','m']],dmg:13,spd:110,drop:{vest:.25}},
 {nm:'약탈자 분대',hp:310,arm:.75,n:[3,4],kit:[['ar','g'],['smg','g'],['pump','g']],dmg:15,spd:110,gren:1,drop:{vest:.3,helmet:.3}},
 {nm:'약탈자 정예',hp:500,arm:.65,n:[4,4],kit:[['ar','g'],['ar','g'],['smg','g']],sniper:1,dmg:17,spd:115,gren:1,drop:{milarmor:.25,helmet:.3}},
 {nm:'약탈자 군단',hp:750,arm:.55,n:[4,5],kit:[['lmg','g'],['ar','g'],['ar','g']],sniper:1,leader:1,dmg:19,spd:115,gren:1,drop:{milarmor:.4,helmet:.4}}];
const RWP={pipe:{rng:26,cd:.9,acc:1,k:'bat'},machete:{rng:26,cd:.8,acc:1,k:'axe'},bat:{rng:26,cd:.9,acc:1,k:'bat'},pistol:{rng:190,cd:1.1,acc:.6,k:'pistol'},pump:{rng:130,cd:1.4,acc:.75,k:'rifle',pel:1.6},
 smg:{rng:200,cd:.35,acc:.4,k:'rifle',m:.55},ar:{rng:250,cd:.5,acc:.5,k:'rifle',m:.8},sniper:{rng:430,cd:2.4,acc:.85,k:'rifle',m:2.6,aim:.9},lmg:{rng:240,cd:.18,acc:.35,k:'rifle',m:.6}};
const rTier=zn=>Math.max(1,Math.min(5,zn));
function rSpawn(x,y,zn,goal){const T=RT[rTier(zn)],t=rTier(zn),n=T.n[0]+(Math.random()*(T.n[1]-T.n[0]+1)|0),grp={id:Math.random(),goal,fled:0};const out=[];
 for(let i=0;i<n;i++){let[wid]=T.kit[i%T.kit.length];if(T.sniper&&i==n-1)wid='sniper';const lead=T.leader&&i==0,a=i/n*Math.PI*2,hp=T.hp*(lead?1.6:1);
  const r={x:x+Math.cos(a)*40,y:y+Math.sin(a)*30,hp,mhp:hp,look:lead?'rdL':'rd'+t,raider:t,g:1,arm:T.arm*(lead?.85:1),wid,w:RWP[wid],dmg:T.dmg*(RWP[wid].m||1),spd:T.spd,cd:1+Math.random(),stun:1e9,dir:'d',ph:0,mv:0,al:0,grp,lead,gT:4+Math.random()*4,state:'idle',hx:x,hy:y,nm:lead?'약탈자 대장':T.nm};
  Z.push(r);out.push(r)}S.rSpawned=(S.rSpawned||0)+n;return out}
/* raider armour */
{const _hz=hitZ;hitZ=function(q,dmg,dx,dy,n){if(q&&q.raider){dmg*=q.arm;q.hurt=.25;if(q.state=='idle')q.state='fight'}return _hz(q,dmg,dx,dy,n)}}
/* line of sight helper (walls) */
const rSee=(a,b)=>typeof clearLine=='function'?clearLine(a.x,a.y-12,b.x,b.y-12):true;
function rDir(dx,dy,prev){return typeof dirOf=='function'?dirOf(dx,dy,prev):Math.abs(dx)>Math.abs(dy)?(dx>0?'r':'l'):(dy>0?'d':'u')}
function rShoot(r,tx,ty,tgt,isP){const d=Math.hypot(tx-r.x,ty-r.y),w=r.w;fx.push({k:'fl',x:r.x+(tx-r.x)/d*14,y:r.y-17+(ty-r.y)/d*14,l:.06});noise(r.x,r.y,w.k=='rifle'||w.k=='pistol'?4:1);
 const hit=Math.random()<Math.min(.95,w.acc*1.1)*(1-d/w.rng*.35);const ex=hit?tx:tx+(Math.random()-.5)*60,ey=hit?ty:ty+(Math.random()-.5)*60;fx.push({k:'tr',a:[r.x,r.y-17],b:[ex,ey-12],l:.08});if(!hit)return;
 const dmg=r.dmg*(w.pel&&d<70?w.pel:1);if(isP){const p=S.p;p.hp-=dmg*(typeof armMul=='function'?armMul(p):1);blood(p.x,p.y,(tx-r.x)/d,(ty-r.y)/d,2);S.rHitP=(S.rHitP||0)+1;if(!S.rWarn||S.t-S.rWarn>60){S.rWarn=S.t;msg('🔫 '+r.nm+'의 사격! 엄폐하세요')}}else hitZ(tgt,dmg*1.5,0,0,2)}
function rThink(r,dt){rThink0(r,dt);if(r.mv)r.ph=(r.ph||0)+dt*9}
function rThink0(r,dt){const p=S.p,g=r.grp;r.cd-=dt;r.stun=1e9;r.mv=0;r.hurt=Math.max(0,(r.hurt||0)-dt);
 if(g.fled){const dx=r.x-p.x,dy=r.y-p.y,d=Math.hypot(dx,dy)||1;mv(r,dx/d*r.spd*1.2*dt,dy/d*r.spd*1.2*dt,7);r.mv=1;r.dir=rDir(dx,dy);r.flee=(r.flee||0)+dt;if(r.flee>7)r.hp=-1e-9,r.gone=1;return}
 /* who to fight: the player if seen, else the nearest zombie close by, else head for the goal / mill about */
 const dp=Math.hypot(p.x-r.x,p.y-r.y);let tgt=null,isP=false,td=1e9;if(!S.dr&&dp<(r.state=='fight'?460:320)&&rSee(r,p)){tgt=p;isP=true;td=dp;r.state='fight'}
 for(const z of Z){if(z.raider||z.hp<=0)continue;const d=Math.hypot(z.x-r.x,z.y-r.y);if(d<180&&d<td*.7&&rSee(r,z)){tgt=z;isP=false;td=d}}
 if(!tgt){if(g.goal){const dx=g.goal.x-r.x,dy=g.goal.y-r.y,d=Math.hypot(dx,dy);if(d>90){mv(r,dx/d*r.spd*dt,dy/d*r.spd*dt,7);r.mv=1;r.dir=rDir(dx,dy)}else if(g.goal.hit)g.goal.hit(dt)}
  else{r.gT-=dt;if(r.gT<=0){r.gT=3+Math.random()*4;r.tx=r.hx+(Math.random()-.5)*200;r.ty=r.hy+(Math.random()-.5)*160}if(r.tx!=null){const dx=r.tx-r.x,dy=r.ty-r.y,d=Math.hypot(dx,dy);if(d>12){mv(r,dx/d*r.spd*.5*dt,dy/d*r.spd*.5*dt,7);r.mv=1;r.dir=rDir(dx,dy)}}}return}
 const dx=tgt.x-r.x,dy=tgt.y-r.y,d=Math.hypot(dx,dy)||1,w=r.w;r.dir=rDir(dx,dy);r.fx=dx/d;r.fy=dy/d;
 if(w.k=='bat'||w.k=='axe'){if(d>w.rng-4){mv(r,dx/d*r.spd*dt,dy/d*r.spd*dt,7);r.mv=1}else if(r.cd<=0){r.cd=w.cd;fx.push({k:'sw',x:r.x,y:r.y,fx:dx/d,fy:dy/d,l:.15});if(isP){p.hp-=r.dmg*(typeof armMul=='function'?armMul(p):1);blood(p.x,p.y,dx/d,dy/d,3);S.rHitP=(S.rHitP||0)+1}else hitZ(tgt,r.dmg*1.5,dx/d,dy/d,3)}return}
 /* ranged: keep a good distance, side-step while reloading */
 const want=w.rng*.7;if(d>w.rng*.9||!rSee(r,tgt)){mv(r,dx/d*r.spd*dt,dy/d*r.spd*dt,7);r.mv=1}else if(d<w.rng*.4){mv(r,-dx/d*r.spd*.8*dt,-dy/d*r.spd*.8*dt,7);r.mv=1}else{const s=(r.lead?1:-1)*(Math.sin(S.t/30+r.hx)>0?1:-1);mv(r,-dy/d*s*r.spd*.35*dt,dx/d*s*r.spd*.35*dt,7);r.mv=1}
 if(w.aim&&isP&&d<w.rng){r.aim=(r.aim||0)+dt;if(r.aim<w.aim)return}else r.aim=0;
 if(r.cd<=0&&d<w.rng&&rSee(r,tgt)){r.cd=w.cd*(.8+Math.random()*.4);r.aim=0;rShoot(r,tgt.x,tgt.y,tgt,isP)}
 /* grenades from zone 3 */
 if(RT[r.raider].gren&&isP&&d<230&&d>70&&!r.lead){r.gc=(r.gc||5+Math.random()*4)-dt;if(r.gc<=0){r.gc=9+Math.random()*4;const gx=p.x,gy=p.y;S.rNade=(S.rNade||[]).concat([{x:gx,y:gy,t:1.3}]);msg('💣 수류탄! 피하세요')}}}
/* zombies go for raiders they bump into */
function rZombies(dt){for(const z of Z){if(z.raider||z.hp<=0||z.stun>0)continue;let best=null,bd=1e9;for(const r of Z){if(!r.raider||r.hp<=0)continue;const d=Math.hypot(r.x-z.x,r.y-z.y);if(d<bd){bd=d;best=r}}
  if(!best)continue;const dp=Math.hypot(S.p.x-z.x,S.p.y-z.y);if(bd<140&&bd<dp){z.al=2;z.nx=best.x;z.ny=best.y}if(bd<22){z.rcd=(z.rcd||0)-dt;if(z.rcd<=0){z.rcd=1;best.hp-=(z.dmg!=null?z.dmg:7)*best.arm;blood(best.x,best.y,0,0,2);best.state='fight'}}}}
/* loot and the leader */
{const _k=kill;kill=function(z){if(!z.raider)return _k(z);if(z.gone)return;dec.push({k:'p',x:z.x,y:z.y+2,r:8});blood(z.x,z.y,0,0,8);const T=RT[z.raider],r={};
  if(Math.random()<.6)r[z.wid]=1;const am=W_BY[z.wid]&&W_BY[z.wid][4].ammo;if(am){const ai=AMMO_ITEM(am);r[ai]=(r[ai]||0)+10+(Math.random()*20|0)}for(const k in T.drop||{})if(Math.random()<T.drop[k])r[k]=1;if(z.lead){r.enh2=2;r[runeFor(5)]=1}if(Math.random()<.3)r[stoneFor(z.raider)]=1;
  for(const k in r)invAdd(S.p,k,r[k]);s3Float(z.x,z.y-30,'💰 '+Object.entries(r).map(([k,v])=>NM2(k)+(v>1?' '+v:'')).join(' · '),'#ffd36a');s3Xp(30*z.raider*(z.lead?2:1),z.nm);S.rKills=(S.rKills||0)+1;
  if(z.lead){z.grp.fled=1;msg('🏳 약탈자 대장이 쓰러졌어요 · 나머지가 달아납니다')}}}
/* grenades in flight */
function rNades(dt){if(!S.rNade)return;S.rNade=S.rNade.filter(n=>{n.t-=dt;if(n.t<=0){boom(n.x,n.y,70,40);return false}return true})}
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!S)return;let any=false;for(const r of Z)if(r.raider&&r.hp>0){any=true;rThink(r,dt)}if(any)rZombies(dt);rNades(dt)}}
/* drawing: people, not zombies — with a health bar, a name and a sniper's laser */
{const _zd=zDraw4;zDraw4=function(z){if(!z.raider)return _zd(z);const fr=z.mv?(z.ph|0)%4:-1;drawChar(z.look,z.x,z.y,z.d8||z.dir,fr,z.w.k);
  if(z.hurt>0){g.globalAlpha=.5;R('#ff3a2a',z.x-9,z.y-36,18,34);g.globalAlpha=1}const w=26,f=Math.max(0,z.hp/z.mhp);R('#000a',z.x-w/2-1,z.y-48,w+2,5);R(z.lead?'#ff6a5a':'#e0b03a',z.x-w/2,z.y-47,w*f,3);
  g.font='9px sans-serif';g.textAlign='center';g.fillStyle=z.lead?'#ff9a8a':'#ffe0a0';g.fillText(z.nm,z.x,z.y-52);if(z.wid=='sniper'&&z.aim>0){g.strokeStyle='rgba(255,40,40,'+Math.min(.9,z.aim)+')';g.lineWidth=1;g.beginPath();g.moveTo(z.x,z.y-17);g.lineTo(S.p.x,S.p.y-12);g.stroke()}return true}}
OVL.push((g2,sx,sy,k)=>{for(const n of S.rNade||[]){g2.strokeStyle='#ff4a3a';g2.lineWidth=2;g2.beginPath();g2.arc(sx(n.x),sy(n.y),70*k*(1-n.t/1.3*.4),0,7);g2.stroke();g2.fillStyle='#ff4a3a22';g2.fill()}});
/* raiders also show up on their own in zone 1+ (one group per new block, 6%) */
{const _sh=infShift;infShift=function(dc,dr,q){_sh(dc,dr,q);if(q||!S||!S.inf||(typeof DUN!='undefined'&&DUN))return;const[gx,gy]=gOf(S.p.x,S.p.y),zn=zoneOf(gx,gy);if(zn<1||Math.random()>.06)return;
  const c=(NBX-1)/2|0,r=(NBY-1)/2|0,[ox,oy]=bo(c+Math.sign(dc||0)*2,r+Math.sign(dr||0)*2);rSpawn(ox-RD/2,oy-RD/2,zn);msg('⚠ 멀리서 사람 목소리가 들려요 · '+RT[rTier(zn)].nm+' 무리')}}
