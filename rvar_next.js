/* PROJECT LEGACY — sample: raider roles (riot shield, firebomber, medic, scout) and raider camps in the endless city.
   Camps are fenced blocks with tents, a watchtower, loot and a garrison with a boss; clear one and you can take it
   over as your own outpost. Loaded after raid_next.js. */
'use strict';
{const H=(o)=>Object.assign({},LOOKS.player,{pack:0},o);
 LOOKS.rdSh=H({p:'#1e2a44',pd:'#141e34',c:'#2a3550',cl:'#3a4566',cd:'#1e2840',helm:'#1a2030',vest:'#2a3040'});
 LOOKS.rdMo=H({p:'#4a3a2a',pd:'#382b1e',c:'#a8441e',cl:'#c85a2a',cd:'#7a3014',h:'#2a1e16',cap:'#d9a52a'});
 LOOKS.rdMe=H({p:'#3a3a40',pd:'#2a2a30',c:'#e8e8e0',cl:'#ffffff',cd:'#c8c8c0',h:'#3a2a1e',vest:'#e8e8e0'});
 LOOKS.rdSc=H({p:'#5a6a3a',pd:'#4a5a2a',c:'#6b7a45',cl:'#7d8c55',cd:'#55643a',h:'#4a3a22',cap:'#4f5a35'})}
const RROLE={shield:{nm:'방패병',ic:'🛡',look:'rdSh',wid:'pistol',hp:1.3,spd:.8,ds:'정면에서 받는 피해 −70% · 옆이나 뒤를 노리세요'},
 molo:{nm:'화염병 투척수',ic:'🔥',look:'rdMo',wid:'machete',hp:.9,spd:1,ds:'6초마다 화염병 · 불바다 6초'},
 medic:{nm:'의무병',ic:'➕',look:'rdMe',wid:'pistol',hp:.8,spd:1,ds:'3초마다 다친 동료 체력 +25 · 먼저 처치'},
 scout:{nm:'정찰병',ic:'📣',look:'rdSc',wid:'pistol',hp:.6,spd:1.45,ds:'들키면 도망 · 8초 안에 못 잡으면 지원 무리를 부름'}};
const RMIX=[null,['scout'],['shield','molo','scout'],['shield','molo','medic'],['shield','medic','molo','scout'],['shield','shield','medic','molo']];
function rRole(r,role){const R0=RROLE[role];r.role=role;r.look=R0.look;r.nm=R0.nm;r.mhp=r.hp=r.mhp*R0.hp;r.spd*=R0.spd;if(R0.wid!=r.wid){r.wid=R0.wid;r.w=RWP[R0.wid];r.dmg=RT[r.raider].dmg*(r.w.m||1)}r.rc=2+Math.random()*2}
/* a mixed squad: the usual gear for the zone plus some specialists */
function rSquad(x,y,zn,goal){const L=rSpawn(x,y,zn,goal),mix=RMIX[rTier(zn)];let k=0;for(const r of L){if(r.lead||r.wid=='sniper')continue;if(k<mix.length&&Math.random()<.85){rRole(r,mix[k]);k++}}return L}
/* shield: the front takes 30% damage */
{const _hz=hitZ;hitZ=function(q,dmg,dx,dy,n){if(q&&q.role=='shield'&&q.fx!=null&&S){const p=S.p,vx=p.x-q.x,vy=p.y-q.y,d=Math.hypot(vx,vy)||1;if((vx*q.fx+vy*q.fy)/d>.45){dmg*=.3;if(!q.bt||performance.now()-q.bt>400){q.bt=performance.now();s3Float(q.x,q.y-40,'🛡 막힘','#9ab8e8')}}}return _hz(q,dmg,dx,dy,n)}}
/* role brains run after the normal raider brain */
{const _rt=rThink;rThink=function(r,dt){if(r.role=='scout'&&r.state=='fight'&&!r.grp.fled)return scoutThink(r,dt);_rt(r,dt);if(!r.role)return;r.rc-=dt;const p=S.p;
  if(r.role=='molo'&&r.rc<=0){const d=Math.hypot(p.x-r.x,p.y-r.y);if(r.state=='fight'&&d<230&&d>50&&rSee(r,p)){r.rc=6;const tx=p.x,ty=p.y;S.rMolo=(S.rMolo||[]).concat([{x:tx,y:ty,t:1}]);fx.push({k:'tr',a:[r.x,r.y-20],b:[tx,ty-10],l:.5});msg('🔥 화염병! 불길을 피하세요')}else r.rc=.5}
  if(r.role=='medic'&&r.rc<=0){r.rc=3;let best=null,bv=1;for(const q of Z)if(q.raider&&q!==r&&q.hp>0&&q.hp/q.mhp<bv&&Math.hypot(q.x-r.x,q.y-r.y)<160){bv=q.hp/q.mhp;best=q}
   if(best&&bv<.9){best.hp=Math.min(best.mhp,best.hp+25);s3Float(best.x,best.y-40,'➕25','#7fd07f');fx.push({k:'tr',a:[r.x,r.y-18],b:[best.x,best.y-18],l:.25});S.rHeal=(S.rHeal||0)+25}}}}
function scoutThink(r,dt){const p=S.p,dx=r.x-p.x,dy=r.y-p.y,d=Math.hypot(dx,dy)||1;r.mv=1;mv(r,dx/d*r.spd*dt,dy/d*r.spd*dt,7);r.fx=-dx/d;r.fy=-dy/d;r.walk=.15;r.ph=(r.ph||0)+dt*r.spd/18;r.cd-=dt;
 if(!r.cry){r.cry=8;msg('📣 정찰병이 도망쳐요 · 8초 안에 잡지 못하면 지원을 불러요!')}r.cry-=dt;if(r.cry<=0&&!r.called){r.called=1;const zn=zoneOf(...gOf(r.x,r.y));rSquad(r.x+(Math.random()-.5)*80,r.y+60,Math.max(1,zn));msg('📣 정찰병이 지원 무리를 불렀어요!');S.rCalled=(S.rCalled||0)+1;r.grp.fled=1}}
function rMolo(dt){if(!S.rMolo)return;S.rMolo=S.rMolo.filter(m=>{m.t-=dt;if(m.t<=0){S.fires=(S.fires||[]).concat([{x:m.x,y:m.y,r:55,t:6}]);fx.push({k:'boom',x:m.x,y:m.y,r:40,l:.3,m:.3});return false}return true})}
/* shield and role badge drawing */
{const _zd=zDraw4;zDraw4=function(z){const r=_zd(z);if(z.raider&&z.role&&z.hp>0){if(z.role=='shield'){const a=Math.atan2(z.fy||1,z.fx||0),sx=z.x+Math.cos(a)*11,sy=z.y-14+Math.sin(a)*6;g.save();g.translate(sx,sy);g.rotate(a);R('#1d1714',-3,-11,7,22);R('#3a5a8a',-2,-10,5,20);R('#9ab8e8',-2,-10,2,20);R('#e8e8e8',-1,-3,3,2);g.restore()}
   g.font='10px sans-serif';g.textAlign='center';g.fillText(RROLE[z.role].ic,z.x+17,z.y-44)}return r}}
OVL.push((g2,sx,sy,k)=>{for(const m of S.rMolo||[]){g2.strokeStyle='#ff8a2a';g2.lineWidth=2;g2.setLineDash([4,3]);g2.beginPath();g2.arc(sx(m.x),sy(m.y),55*k,0,7);g2.stroke();g2.setLineDash([])}});
/* ---------- raider camps ---------- */
TIER.rbase=4;KL.rbase=['ammo','ammo','medkit','food','water','elec'];WLOOT.rbase=['pistol','pump','ar','smg','sniper','machete','hunting'];GLOOT.rbase=['vest','helmet','milarmor','bag2'];
if(typeof SPEC!='undefined')SPEC.rbase={a556:30,medkit:1};
{const _ka=kindAt;kindAt=function(gx,gy){const k=_ka(gx,gy);if(k=='base'||k=='lot'||k=='milR'||k=='mil')return k;const d=Math.max(Math.abs(gx),Math.abs(gy)),zn=zoneOf(gx,gy);/* raider camps live in zones 3, 6, 9, 12 … */if(zn>=3&&zn%3==0&&bh(gx,gy,77)<.06)return'rbase';return k}}
BUILDERS.rbase=(c,r,sd)=>{const A=Bld('약탈자 기지',c,r,'rbase'),Rn=mulberry(sd*17+3);A.fl(0,0,BW,BH,'dirt');A.fl(90,80,BW-180,BH-170,'gravel');A.fl(BW/2-110,BH/2-70,220,140,'concrete');
 /* fence with a gate at the bottom, towers at the corners */
 A.o('fence',60,50,BW-120,4);A.o('fence',60,BH-70,BW/2-120,4);A.o('fence',BW/2+60,BH-70,BW/2-120,4);A.o('fence',60,54,4,BH-124);A.o('fence',BW-64,54,4,BH-124);
 for(const x of[BW/2-120,BW/2+40])for(let i=0;i<3;i++)A.o('sandbag',x+i*28,BH-96,26,14);A.o('tower',70,64,28,26);A.o('tower',BW-98,64,28,26);
 A.o('tent',130,110,150,40);A.o('tent',BW-290,110,150,40);A.o('tent',130,BH-220,150,40);A.o('tentS',BW/2-48,BH/2-40,96,52);
 A.o('campfire',BW/2-15,BH/2+40,30,12);A.o('gen',BW-200,BH-220,44,20);A.o('barrel',BW-140,BH-200,16,10,{c:'#7a3a2a'});A.o('barrel',BW-120,BH-196,16,10,{c:'#7a3a2a'});
 A.o('gunrack',BW/2+80,BH/2-50,60,16);A.o('ammo',BW/2+80,BH/2-20,34,20);A.o('crate',BW/2-150,BH/2-40,34,24);A.o('crate',BW/2-150,BH/2-6,34,24);A.o('locker',BW-260,BH-170,30,18);A.o('wreck',120,BH-150,56,28,{c:'#5a3a2a'});
 for(let i=0;i<5;i++)A.o('flag',150+i*140,58,10,10);A.roof(BW/2-60,BH/2-55,120,80,'mil','약탈자 막사');A.light(BW/2,BH/2+40,200,.4,'255,170,110');A.ent(BW/2,BH-70,0,1)};
const RBK=(gx,gy)=>gx+','+gy;
function rbState(gk){S.inf.rb=S.inf.rb||{};return S.inf.rb[gk]}
/* a camp gets its garrison the first time you are near; survivors are remembered when you walk away */
function rbTick(){if(!S||!S.inf||(typeof DUN!='undefined'&&DUN))return;S.inf.rb=S.inf.rb||{};for(const b of W0.b){if(b.kind!='rbase'||!b.gk)continue;let st=S.inf.rb[b.gk];if(st&&st.clear)continue;
  const present=Z.some(z=>z.rbase==b.gk&&z.hp>0);if(present)continue;const[ox,oy]=[b.ox,b.oy],zn=Math.max(2,zoneOf(b.gx,b.gy));const n=st?st.left:null;if(n===0)continue;
  const L=rSquad(ox+BW/2,oy+BH/2,zn).concat(rSquad(ox+BW/2-200,oy+BH/2+60,zn));const boss=rSpawn(ox+BW/2,oy+BH/2-80,5)[0];Z.splice(Z.indexOf(boss)+1);boss.lead=1;boss.look='rdL';boss.nm='약탈자 두목';boss.mhp=boss.hp=900+200*zn;boss.grp={id:'b'};
  const all=L.concat([boss]);all.forEach((q,i)=>{q.rbase=b.gk;q.hx=ox+BW/2+(Math.random()-.5)*400;q.hy=oy+BH/2+(Math.random()-.5)*260;q.grp=q.grp||{id:'b'}});if(n!=null&&n<all.length){for(const q of all.slice(n))q.hp=-1e-9,q.gone=1}
  S.inf.rb[b.gk]={left:Math.min(all.length,n==null?all.length:n),tot:st?st.tot:all.length};if(!st)msg('🏴 약탈자 기지 발견! · 망루 · 막사 · 두목 · 소탕하면 전리품과 점령')}}
{const _k=kill;kill=function(z){_k(z);if(!z.raider||!z.rbase||z.gone||!S.inf.rb)return;const st=S.inf.rb[z.rbase];if(!st||st.clear)return;st.left=Math.max(0,st.left-1);
  if(st.left<=0){st.clear=1;const b=W0.b.find(q=>q.gk==z.rbase&&q.kind=='rbase');if(b){W0.objs.push({t:'crate',x:b.ox+BW/2-15,y:b.oy+BH/2+70,w:30,h:20,rbox:1,id:z.rbase+':rbox'});infDerived()}
   give({a556:60,a9mm:60,medkit:2,enh2:2,[runeFor(Math.max(2,zoneOf(...z.rbase.split(',').map(Number))))]:1});s3Xp(400,'약탈자 기지 소탕');setTimeout(()=>msg('🏆 약탈자 기지 소탕! 전리품을 얻었어요 · 기지 안에서 [⛺ 기지 점령]으로 내 전초기지로 만들 수 있어요'),800)}}}
function rbTake(){const[gx,gy]=gOf(S.p.x,S.p.y),gk=gx+','+gy,st=rbState(gk);if(!st||!st.clear)return;const D=DM0();D[gk]={k:'rbase',sh:0,day:S.day};if(S.inf.dis)delete S.inf.dis[gk];
 OP0()[gk]={hp:100,wall:2,turs:[{t:'mg',rx:BW/2-160,ry:BH/2-40,dir:-Math.PI/2},{t:'sn',rx:BW/2+160,ry:BH/2-40,dir:-Math.PI/2}],last:S.day,made:S.day,st:{a9mm:60,a308:20},log:['Day '+S.day+' · 약탈자 기지를 점령했어요'],zone:zoneOf(gx,gy)};st.taken=1;infRebuild();
 msg('⛺ 약탈자 기지를 점령했어요 · 금속 방벽 + 포탑 2개가 있는 전초기지가 됐어요');s3Xp(200,'기지 점령')}
{const _c=dmCtx;dmCtx=function(){const B=_c();if(B.some(q=>!q.dz)||DUN||DM||!S.inf)return B;const[gx,gy]=gOf(S.p.x,S.p.y),st=rbState(gx+','+gy);if(st&&st.clear&&!st.taken)B.push({t:'⛺ 기지 점령 (내 전초기지로)',f:rbTake});
  else if(st&&!st.clear)B.push({t:'🏴 약탈자 기지 · 남은 적 '+st.left+'/'+st.tot,f:null,info:1});return B}}
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!S)return;rMolo(dt);rbTick()}}
/* camps spawn squads that also use roles */
{const _sh=infShift;infShift=function(dc,dr,q){const n0=Z.length;_sh(dc,dr,q);for(let i=n0;i<Z.length;i++){const r=Z[i];if(r.raider&&!r.role&&!r.lead&&r.wid!='sniper'&&!r.rbase&&Math.random()<.35){const m=RMIX[r.raider];rRole(r,m[Math.random()*m.length|0])}}}}

if(typeof KCOL!='undefined'){KCOL.rbase='#a83a2a';KNAME.rbase='약탈자 기지'}
