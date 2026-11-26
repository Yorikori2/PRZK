/* PROJECT LEGACY — sample: NPC companions.
   Survivors you rescue (radio tower signal) come to the base. At the base: take one along (up to 2), or give them a
   job — 경비 (guards the base and shoots), 수색 (goes out, comes back next day with loot), 치료 (heals you at the base).
   Three kinds: 🔫 사수 (shoots from range) · 🪓 돌격 (runs in with an axe, tough) · 💊 의무병 (heals you, weak gun).
   They level up from kills. If they go down: revive them with a bandage within 40 s, or they limp home and rest a day.
   Built like the travelling merchant: an entity in Z with npc set, so your aim and the zombies ignore it.
   Loaded after metro_next.js / bigmap_next.js. */
'use strict';
const AROLE={gun:{nm:'사수',ic:'🔫',wk:'pistol',dmg:16,cd:.75,rng:300,hp:90,spd:150,ds:'어떤 무기든 쓸 수 있어요 · 무기를 건네주면 그 무기로 싸워요 (숙련도)'},
 mel:{nm:'돌격',ic:'🪓',wk:'axe',dmg:28,cd:.65,rng:34,hp:150,spd:165,ds:'도끼를 들고 달려들어요 · 튼튼해요'},
 med:{nm:'의무병',ic:'💊',wk:'pistol',dmg:9,cd:1,rng:200,hp:90,spd:150,heal:1,ds:'체력이 70% 아래면 치료해 줘요 · 약한 권총'},
 scout:{nm:'정찰병',ic:'🧭',wk:'pistol',dmg:11,cd:.7,rng:240,hp:80,spd:205,ds:'빨라요 · 다니며 주변 지도를 밝히고 가끔 물건을 주워 와요'},
 shield:{nm:'방패병',ic:'🛡',wk:'pistol',dmg:12,cd:.8,rng:220,hp:230,spd:150,ds:'방패 + 권총 · 가장 튼튼 · 붙은 좀비를 느리게 · 방패가 피해를 막아요'},};
const AJOB={guard:['🛡','경비','거점에서 다가오는 좀비를 쏴요'],scav:['🔍','수색','나가서 다음 날 아침 물자를 가져와요'],heal:['💊','치료','거점 안에 있으면 체력을 채워 줘요']};
/* traits: two-sided personalities */
const ATR={brave:['🦁','용감함','체력 40% 아래면 피해 +30%'],coward:['🐇','겁쟁이','체력 30% 아래면 싸우지 않고 내 뒤로 숨어요 · 대신 경험치 +20%'],marks:['🎯','명사수','사거리 +20%'],tough:['🪨','튼튼함','체력 +25%'],
 quick:['👟','날쌘발','이동 속도 +20%'],lucky:['🍀','행운','수색 물자 +50% · 처치하면 가끔 강화석'],night:['🦉','올빼미','밤에 피해 +25%'],selfh:['🩹','회복력','싸우지 않을 때 회복 2배'],chatty:['💬','수다쟁이','말이 많아요 · 경험치 +25%'],lone:['🐺','외톨이','혼자 데리고 다니면 피해 +20%']};
/* who they were before: the job leans the role */
const ABIO=[['간호사','med'],['응급구조사','med'],['경찰관','gun'],['경비원','gun'],['사냥꾼','gun'],['예비군','gun'],['농부','mel'],['클레이 사격 선수','gun'],['광부','mel'],['산악 구조대원','scout'],
 ['택배 기사','scout'],['배달 라이더','scout'],['소방관','shield'],['럭비 선수','shield'],['자동차 정비사',null],['경호원','shield'],['정육점 주인','mel'],['목수','mel'],['대학생',null],['편의점 알바생',null],['고등학교 교사',null],['요리사',null]];
const ANAMES=['민지','준호','서연','도윤','하은','지훈','수아','현우','예린','태민','유나','건우','소희','재원','다은','시우','나연','동현','채원','민혁'];
const AGRADE=[null,['★','#c9ccd0',1],['★★','#5aa8ff',2],['★★★','#ffb84a',3]];/* stars = trait count · stat bonus */
const SKIN=[['#e0b48c','#c4966f'],['#f0c8a0','#d8a880'],['#c4966f','#a8784f'],['#8d5a3a','#704428']],HAIR=['#3b2a1e','#1d1714','#8a5a2a','#d8b060','#a03a2a','#9aa0a6','#5a3a6a'],
 CLO=[['#7a5a3a','#94704a','#5e4428'],['#3a5a7a','#4a7094','#2a445e'],['#5a3a6a','#704a84','#442a50'],['#6a6a3a','#84844a','#50502a'],['#3a6a4a','#4a845e','#2a5036'],['#7a3a3a','#944a4a','#5e2a2a'],['#3a3a40','#50505a','#2a2a30'],['#a8864a','#c4a060','#8a6a38'],['#2a4a4a','#3a6464','#1e3636']],
 PANT=[['#3d4f6b','#2f3d54'],['#3a3a40','#2a2a30'],['#5a4a3a','#44382a'],['#4f5a35','#3d4628']];
const pick=L=>L[Math.random()*L.length|0];
function aApp(role){const sk=pick(SKIN),c=pick(CLO),pt=pick(PANT),o={sk:sk[0],skd:sk[1],h:pick(HAIR),c:c[0],cl:c[1],cd:c[2],p:pt[0],pd:pt[1],cap:Math.random()<.4?pick(['#2f3a2a','#3a2a1e','#7a2a24','#2a3a5a']):null,pack:Math.random()<.6?1:0};
 if(role=='med')Object.assign(o,{c:'#e8ecec',cl:'#ffffff',cd:'#c4cccc',coat:1});if(role=='shield')Object.assign(o,{helm:1,vest:'#3a4a5a'});if(role=='snp')Object.assign(o,{c:'#4f5a35',cl:'#5f6a45',cd:'#3d4628',cap:'#3d4628'});
 if(role=='eng')Object.assign(o,{c:'#c9a42a',cl:'#e0bc3a',cd:'#a8861e'});if(role=='demo')Object.assign(o,{vest:'#5a4a2a'});return o}
const tr=(a,k)=>!!(a.tr&&a.tr.includes(k));
function aLook(a){if(!a.app)return a.look;const k='allyL'+a.id;if(!LOOKS[k])LOOKS[k]={...LOOKS.player,...a.app};return k}
for(let i=0;i<6;i++)if(!LOOKS['ally'+i])LOOKS['ally'+i]={...LOOKS.player,c:CLO[i][0],cl:CLO[i][1],cd:CLO[i][2]};
const ALLY=()=>{S.inf.allies=S.inf.allies||[];return S.inf.allies};
const aById=id=>ALLY().find(a=>a.id==id);
const aGB=a=>1+.1*((a.gr||1)-1);/* grade bonus: ★ 1 · ★★ 1.1 · ★★★ 1.2 */
const aMhp=a=>Math.round(AROLE[a.role].hp*(1+.12*(a.lv-1))*(tr(a,'tough')?1.25:1)*aGB(a));
const AROLEF={gun:1,mel:1.1,med:.6,scout:.8,shield:.85};const aWid=a=>a.wpn&&W_BY[a.wpn]?a.wpn:(a.role=='mel'?'axe':'pistol');const aWS=a=>W_BY[aWid(a)][4];const aMelee=a=>W_BY[aWid(a)][2]=='m';
const aDmg=a=>{let d=(aWS(a).d||10)*(AROLEF[a.role]||1)*(1+.1*(a.lv-1))*aGB(a);if(tr(a,'brave')&&a.hp<aMhp(a)*.4)d*=1.3;if(tr(a,'night')&&NIGHT)d*=1.25;if(tr(a,'lone')&&ALLY().filter(q=>q.st=='follow').length==1)d*=1.2;return d};
/* ammo: companions carry their own rounds (a pouch per ammo type) and a loaded magazine */
const aAmmoId=a=>{const W=aWS(a);return!aMelee(a)&&W.ammo&&W.ammo!='fuel'?AMMO_ITEM(W.ammo):null};
const aMagSz=a=>Math.max(1,aWS(a).mag||8);
const aPouch=a=>{a.am=a.am||{};return a.am};
const aLeft=a=>{const id=aAmmoId(a);return id?(a.mag|0)+(aPouch(a)[id]|0):Infinity};
const aOut=a=>aLeft(a)<=0;
const aRng=a=>aOut(a)?34:Math.min(420,aWS(a).r||40)*(tr(a,'marks')?1.2:1),aSpd=a=>AROLE[a.role].spd*(tr(a,'quick')?1.2:1);
const aNext=a=>60*a.lv;
const aXp=(a,n)=>Math.round(n*(tr(a,'coward')?1.2:1)*(tr(a,'chatty')?1.25:1));
function allyNew(nm,role,grade){const L=ALLY(),id=(S.inf.allyN=(S.inf.allyN||0)+1),bio=pick(ABIO);role=role||(bio[1]&&Math.random()<.75?bio[1]:pick(Object.keys(AROLE)));
 const r=Math.random(),gr=grade||(r<.05?3:r<.3?2:1),T=[];{const K=Object.keys(ATR);for(let i=K.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[K[i],K[j]]=[K[j],K[i]]}for(const k of K){if(T.length>=gr)break;if(k=='brave'&&T.includes('coward')||k=='coward'&&T.includes('brave'))continue;T.push(k)}}
 const a={id,nm:nm||pick(ANAMES),role,lv:gr,xp:0,st:'base',job:null,gr,tr:T,bio:bio[0],app:aApp(role),wpn:role=='mel'?'axe':'pistol',mast:{}};if(role=='shield')a.shd='shd2';a.look=aLook(a);a.hp=aMhp(a);L.push(a);return a}
/* rescued survivors join */
{const _ss=sosSave;sosSave=function(){const s=S.inf.sos;const nm=s&&s.nm;_ss.apply(this,arguments);if(!nm)return;const a=allyNew(nm);const R0=AROLE[a.role];
  setTimeout(()=>sigMsg('🤝 '+nm+'이(가) 동료가 됐어요 '+AGRADE[a.gr][0],R0.ic+' '+R0.nm+' · 전직 '+a.bio+' · '+a.tr.map(k=>ATR[k][0]+' '+ATR[k][1]).join(' · '),'"'+aLine(a,'join')+'" · 거점에서 만나요'),1200)}}
/* lines */
const ALINE={join:['살려줘서 고마워요. 이제 같이 싸울게요.','빚은 꼭 갚을게요.','혼자는 무서웠어요… 같이 가요.'],kill:['하나 처리!','저쪽 정리했어요!','다음!','어림없지.'],low:['으윽… 좀 도와줘요!','더는 못 버텨요!','피가… 많이 나요…'],
 revive:['고마워요… 살았다.','다시 싸울 수 있어요!'],idle:['조용하네요… 너무 조용해.','배고프다…','예전엔 이 길로 출근했는데.','저 건물, 뭔가 있을 것 같아요.'],skill:{demo:'수류탄 간다! 엎드려!',scout:'뭐 주웠어요!',eng:'탄약 만들어 왔어요!',snp:'조준… 발사.',shield:'제 뒤로 와요!'}};
function aLine(a,k){const L=ALINE[k];return Array.isArray(L)?pick(L):(L[a.role]||'')}
function aSay(a,k,ch){if(Math.random()>(ch==null?1:ch)*(tr(a,'chatty')?2:1))return;const z=aEnt(a);if(!z)return;z.say=aLine(a,k);z.sayT=3}
/* ---------- entities ---------- */
const BPOST=[[330,520],[390,540],[450,520],[510,540],[570,520],[630,540]];
function aEnt(a){return Z.find(z=>z.npc=='ally'&&z.ally==a.id)}
function aSpawn(a,x,y){const z={x,y,hp:1e9,mhp:1e9,look:aLook(a),npc:'ally',ally:a.id,g:1,stun:1e9,dir:'d',ph:0,mv:0,al:0,nm:a.nm,cd2:0,fx:0,fy:1};Z.push(z);return z}
function aWhere(a){const p=S.p,dun=typeof DUN!='undefined'&&DUN;if(a.st=='follow'||a.st=='down')return'p';if(dun)return null;
 if(a.st=='wait'&&a.wait){const[ox,oy]=bo(a.wait.gx-OGX,a.wait.gy-OGY);if(a.wait.gx>=OGX&&a.wait.gx<OGX+NBX&&a.wait.gy>=OGY&&a.wait.gy<OGY+NBY)return[ox+a.wait.lx,oy+a.wait.ly];return null}
 if((a.st=='base'||a.st=='job'&&a.job!='scav')&&W0.base){const i=ALLY().filter(q=>q.st=='base'||q.st=='job').indexOf(a),P=BPOST[i%BPOST.length];return[W0.base.ox+P[0],W0.base.oy+P[1]]}return null}
function aSync(){for(const a of ALLY()){const w=aWhere(a);let z=aEnt(a);if(!w){if(z)Z.splice(Z.indexOf(z),1);continue}
  if(w=='p'){const p=S.p;if(!z)z=aSpawn(a,p.x-40,p.y+30);else if(Math.hypot(z.x-p.x,z.y-p.y)>900){z.x=p.x-40;z.y=p.y+30}}else if(!z)aSpawn(a,w[0],w[1]);else if(a.st!='follow'&&Math.hypot(z.x-w[0],z.y-w[1])>400){z.x=w[0];z.y=w[1]}}
 for(let i=Z.length-1;i>=0;i--){const z=Z[i];if(z.npc=='ally'&&!aById(z.ally))Z.splice(i,1)}}
const hostiles=()=>Z.filter(z=>!z.npc&&z.hp>0&&!z.gone&&!z.env);
const wkOf=id=>{const w=W_BY[id];if(!w)return'pistol';if(w[2]=='m')return['bat','pipe','baton','wrench','sledge','crowbar','fist'].includes(id)?'bat':'axe';return GCLASS[id]=='pistol'?'pistol':'rifle'};
function aShoot(a,z,q){if(!aFeed(a,z)){if(aOut(a))aBash(a,z,q);return}const id=aWid(a),W=aWS(a),RG=aRng(a),dx=q.x-z.x,dy=q.y-z.y,d=Math.hypot(dx,dy)||1,ux=dx/d,uy=dy/d;z.fx=dx;z.fy=dy;
 const prev=typeof MCTX!='undefined'?MCTX:null;if(typeof MCTX!='undefined')MCTX={who:a,id,x:z.x,y:z.y,rng:RG};
 try{const hit=(t,m)=>{t.lastAlly=a.id;hitZ(t,aDmg(a)*(m||1),ux,uy,W.pel?4:1)};
  if(W.pel){let n=0;for(const t of hostiles()){if(n>=Math.min(4,W.pel))break;const ex=t.x-z.x,ey=t.y-z.y,e=Math.hypot(ex,ey);if(e>RG+10)continue;const an=Math.atan2(ey,ex)-Math.atan2(dy,dx);if(Math.abs(Math.atan2(Math.sin(an),Math.cos(an)))>.4)continue;hit(t,1+(1-e/RG)*.5);fx.push({k:'tr',a:[z.x+ux*10,z.y-16],b:[t.x,t.y-14],l:.06});n++}}
  else if(W.pierce){hit(q);let more=0;for(const t of hostiles()){if(t===q||more>=W.pierce-1)continue;const ex=t.x-z.x,ey=t.y-z.y,along=ex*ux+ey*uy,side=Math.abs(ex*uy-ey*ux);if(along>d&&along<RG&&side<16){hit(t,.7);more++}}}
  else hit(q);
  if(W.aoe)boom(q.x,q.y,W.aoe,aDmg(a));
 }finally{if(typeof MCTX!='undefined')MCTX=prev}
 if(!aMelee(a)){if(!W.pel)fx.push({k:'tr',a:[z.x+ux*10,z.y-16],b:[q.x,q.y-14],l:.07});fx.push({k:'fl',x:z.x+ux*14,y:z.y-16+uy*6,l:.05});try{sfx((A,t)=>tone(A,t,{w:'square',f0:W.pel?200:W.d>50?260:420,f1:120,d:W.d>50?.14:.07,v:.05}))}catch(e){}}
 else{fx.push({k:'sw',x:z.x,y:z.y,fx:ux,fy:uy,l:.15});try{sfx((A,t)=>tone(A,t,{w:'sawtooth',f0:140,f1:60,d:.08,v:.06}))}catch(e){}}}
function aSkill(a,z,dt,H){const R0=AROLE[a.role],p=S.p;z.skT=(z.skT==null?4:z.skT)-dt;if(a.st!='follow'&&a.job!='guard')return;
 if(a.role=='demo'&&z.skT<=0){let best=null,bn=0;for(const q of H){const d=Math.hypot(q.x-z.x,q.y-z.y);if(d>260||Math.hypot(q.x-p.x,q.y-p.y)<120)continue;let n=0;for(const t of H)if(Math.hypot(t.x-q.x,t.y-q.y)<70)n++;if(n>bn){bn=n;best=q}}
  if(best&&bn>=2){z.skT=9;const tx=best.x,ty=best.y;(S.aNade=S.aNade||[]).push({x:tx,y:ty,t:.7,a:a.id});aSay(a,'skill',.6)}}
 if(a.role=='scout'){if(z.skT<=0){z.skT=30;const P=['bandage','food','water','a9mm','scrap','elec','cloth'],k=pick(P),n=k=='a9mm'?8:1;give({[k]:n});aSay(a,'skill',1);msg('🧭 '+a.nm+'이(가) '+NM2(k)+' '+n+'을(를) 주워 왔어요')}
  const[gx,gy]=gOf(z.x,z.y),sn=S.inf.seen=S.inf.seen||{};for(let y=-2;y<=2;y++)for(let x=-2;x<=2;x++)sn[(gx+x)+','+(gy+y)]=1}
 if(a.role=='eng'&&z.skT<=0){z.skT=25;const w=W_BY[actW(p)],am=w&&w[4].ammo;if(am){const ai=AMMO_ITEM(am),n=Math.max(6,Math.round((w[4].mag||12)*.6));give({[ai]:n});aSay(a,'skill',1);msg('🔧 '+a.nm+': 탄약 '+n+'발 만들었어요 ('+NM2(ai)+')')}}
 if(a.role=='shield')for(const q of H)if(Math.hypot(q.x-z.x,q.y-z.y)<60){q.slowT=.3;q.sm=Math.min(q.sm||1,.55)}}
function aThink(a,z,dt){const p=S.p,R0=AROLE[a.role],dp=Math.hypot(p.x-z.x,p.y-z.y),RG=aRng(a),SP=aSpd(a);z.cd2=Math.max(0,(z.cd2||0)-dt);z.mv=0;if(z.sayT>0)z.sayT-=dt;
 if(a.st=='down'){a.downT-=dt;if(a.downT<=0){a.st='hurt';a.hurtDay=S.day;a.hp=Math.round(aMhp(a)*.5);msg('🩹 '+a.nm+'이(가) 거점으로 피신했어요 · 하루 쉬어야 해요')}return}
 const H=hostiles(),scared=tr(a,'coward')&&a.hp<aMhp(a)*.3;let tgt=null,bd=1e9;const scan=a.st=='follow'?Math.max(RG,260):a.job=='guard'?Math.max(RG,320):RG;
 for(const q of H){const d=Math.hypot(q.x-z.x,q.y-z.y);if(d<scan&&d<bd&&(typeof rSee!='function'||rSee(z,q))){bd=d;tgt=q}}
 /* move */let gx=null,gy=null;if(a.st=='follow'){const i=ALLY().filter(q=>q.st=='follow').indexOf(a),bx=p.x-(p.fx||0)*(scared?30:50)+(i?28:-28),by=p.y-(p.fy||1)*(scared?30:50);
   if(RG<60&&tgt&&dp<260&&!scared){gx=tgt.x;gy=tgt.y}else if(Math.hypot(bx-z.x,by-z.y)>36){gx=bx;gy=by}}
 if(gx!=null){const dx=gx-z.x,dy=gy-z.y,d=Math.hypot(dx,dy)||1,sp=SP*(dp>320||scared?1.7:1);if(d>(RG<60&&tgt?RG-6:8)){mv(z,dx/d*sp*dt,dy/d*sp*dt,7,'p');z.mv=1;z.fx=dx;z.fy=dy}}
 z.walk=z.mv?.15:Math.max(0,(z.walk||0)-dt);if(z.mv)z.ph=(z.ph||0)+dt*SP/18;
 /* fight */if(!scared&&tgt&&z.cd2<=0&&bd<=RG+(RG<60?6:0)){z.cd2=(aWS(a).cd||.8)*1.15;aShoot(a,z,tgt);a.fight=4}
 aSkill(a,z,dt,H);
 /* heal you */if((R0.heal&&a.st=='follow'||a.job=='heal'&&inBase(p.x,p.y))&&p.hp<MHP(p)*.7&&dp<160){p.hp=Math.min(MHP(p),p.hp+(a.job=='heal'?3:4)*dt);if(Math.random()<dt*3)fx.push({k:'ember',x:p.x+(Math.random()-.5)*16,y:p.y-20-Math.random()*16,l:.4,c:'#7fd07f'})}
 /* get hurt by what is next to you */for(const q of H)if(!q.mnest&&!q.hive&&Math.hypot(q.x-z.x,q.y-z.y)<26){{let f=1;if(a.shd&&typeof shdBlockAlly=='function'){const bl=shdBlockAlly(a);f=1-bl;if(bl>0){shdWearAlly(a,(q.dmg||7)*.55*dt*bl);if(Math.random()<dt)mGain(a,a.shd,1)}}a.hp-=(q.dmg||7)*.55*f*dt}z.hurt=.15;a.fight=4}
 a.fight=Math.max(0,(a.fight||0)-dt);if(!a.fight&&a.hp>0)a.hp=Math.min(aMhp(a),a.hp+(tr(a,'selfh')?4:2)*dt);
 if(a.hp<aMhp(a)*.3&&!z.lowSaid){z.lowSaid=1;aSay(a,'low',1)}if(a.hp>aMhp(a)*.6)z.lowSaid=0;
 if(!a.fight&&a.st=='follow'&&Math.random()<dt*.02)aSay(a,'idle',1);
 if(a.hp<=0){a.hp=0;a.st='down';a.downT=40;msg('🆘 '+a.nm+'이(가) 쓰러졌어요! 40초 안에 다가가서 일으켜 주세요 (붕대)')}}
/* the demolitionist's grenades in flight */
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!S||!S.aNade||PAUSE)return;S.aNade=S.aNade.filter(n=>{n.t-=dt;if(n.t<=0){const a=aById(n.a);for(const q of Z)if(!q.npc&&Math.hypot(q.x-n.x,q.y-n.y)<75)q.lastAlly=n.a;boom(n.x,n.y,75,a?aDmg(a)*4:40);return false}return true})}}
OVL.push((g2,sx,sy,k)=>{for(const n of(S&&S.aNade)||[]){g2.fillStyle='#4f5a35';g2.beginPath();g2.arc(sx(n.x),sy(n.y)-(Math.sin(n.t/.7*Math.PI)*30)*k,4*k,0,7);g2.fill();g2.strokeStyle='rgba(255,90,60,.6)';g2.beginPath();g2.arc(sx(n.x),sy(n.y),75*k*(1-n.t/.7),0,7);g2.stroke()}});
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!S||!S.inf||!run||PAUSE)return;aSync();for(const z of Z)if(z.npc=='ally'){const a=aById(z.ally);if(a)aThink(a,z,dt)}aDaily()}}
/* your shots and blasts never hurt them */
{const _hz=hitZ;hitZ=function(q,dmg,dx,dy,n){if(q&&q.npc=='ally')return;return _hz(q,dmg,dx,dy,n)}}
/* experience from their kills */
{const _k=kill;kill=function(z){const r=_k(z);if(z&&z.lastAlly){const a=aById(z.lastAlly);if(a){a.xp+=aXp(a,z.tboss?120:z.b||z.raider?25:8);aSay(a,'kill',.12);if(tr(a,'lucky')&&Math.random()<.06)give({[stoneFor(Math.max(1,zoneOf(...gOf(z.x,z.y))))]:1});while(a.xp>=aNext(a)){a.xp-=aNext(a);a.lv++;a.hp=aMhp(a);msg('⭐ '+a.nm+' 레벨 업! Lv'+a.lv+' · 피해 +10% · 체력 +12%')}}}return r}}
/* the morning: scavengers come back, the hurt are rested */
function aDaily(){if(S.inf.allyDay==null)S.inf.allyDay=S.day;if(S.day<=S.inf.allyDay)return;S.inf.allyDay=S.day;const got={},who=[];
 const fixed=[];for(const a of ALLY()){if(a.st=='hurt'&&S.day>a.hurtDay){a.st='base';a.hp=aMhp(a)}if(a.shd&&typeof SHDHP!='undefined'&&(a.st=='base'||a.st=='job'&&a.job!='scav'||a.st=='hurt')&&a.shdHp!=null&&a.shdHp<SHDHP[a.shd]){a.shdHp=SHDHP[a.shd];fixed.push(a.nm)}
  if(a.st=='job'&&a.job=='scav'){const P=['food','water','bandage','scrap','scrap','wood','cloth','elec','a9mm','fuel'];const n=Math.round((2+a.lv+(Math.random()*3|0))*(tr(a,'lucky')?1.5:1));for(let i=0;i<n;i++){const k=P[Math.random()*P.length|0];got[k]=(got[k]||0)+(k=='a9mm'?6:1)}a.xp+=15;who.push(a.nm)}}
 if(fixed.length)msg('🛠 '+fixed.join(' · ')+'의 방패를 밤사이 거점에서 고쳤어요');if(who.length){give(got);sigMsg('🔍 수색조 귀환',who.join(' · ')+'이(가) 물자를 가져왔어요',Object.entries(got).map(([k,n])=>NM2(k)+' '+n).join(' · '))}}
/* ---------- drawing ---------- */
{const _zd=zDraw4;zDraw4=function(z){if(z.npc!='ally')return _zd(z);const a=aById(z.ally);if(!a)return true;const R0=AROLE[a.role];
  g.save();g.globalAlpha=.55;g.strokeStyle='#5aa8ff';g.lineWidth=2;g.beginPath();g.ellipse(z.x,z.y+1,14,5,0,0,6.28);g.stroke();g.restore();
  if(a.st=='down'){g.save();g.globalAlpha=.75;g.translate(z.x,z.y);g.rotate(Math.PI/2);drawChar(aLook(a),0,0,'d',-1);g.restore();return true}
  const fr=z.walk>0?(typeof F8=='function'?F8(z.ph||0):(z.ph|0)%4):-1,dir=typeof dir8=='function'?(z.d8=dir8(z.fx,z.fy,z.d8)):'d';drawChar(aLook(a),z.x,z.y,dir,fr,wkOf(aWid(a)));if(a.shd&&typeof shdDraw=='function'){shdDraw(z.x,z.y,z.fx||0,z.fy||1,a.shd,dir);if(typeof shdCrack=='function')shdCrack(z.x,z.y,dir,shdRatioAlly(a))}
  if(z.hurt>0){z.hurt-=.016;g.globalAlpha=.45;R('#ff3a2a',z.x-9,z.y-36,18,34);g.globalAlpha=1}
  const w=26,f=Math.max(0,a.hp/aMhp(a));R('#000a',z.x-w/2-1,z.y-48,w+2,5);R(f>.5?'#5fe08a':f>.25?'#ffd36a':'#ff6a5a',z.x-w/2,z.y-47,w*f,3);
  return true}}
/* allies on the minimap and the map (always, in blue) */
{const _mm=mm2;mm2=function(){_mm();if(!S||!S.p||typeof DUN!='undefined'&&DUN&&DUN.sh=='mine')return;const c=$('mm2');if(!c||$('mmw').style.display=='none')return;const x=c.getContext('2d'),W2=c.width,sc=MMBIG?.35:1,k=MK*sc,cx=S.p.x*k-W2/2,cy=S.p.y*k-W2/2;
  x.fillStyle='#5aa8ff';for(const z of Z)if(z.npc=='ally')x.fillRect(z.x*k-cx-1.5,z.y*k-cy-1.5,3,3)}}
if(typeof bmDraw=='function'){const _bd=bmDraw;bmDraw=function(){_bd();const c=$('bmC');if(!c||!BM)return;const x=c.getContext('2d'),cw=c.clientWidth,ch=c.clientHeight,k=BM.k;for(const z of Z)if(z.npc=='ally'){const a=aById(z.ally),X=cw/2+(z.x-BM.vx)*k,Y=ch/2+(z.y-BM.vy)*k;
  x.fillStyle='#5aa8ff';x.strokeStyle='#000';x.lineWidth=1.5;x.beginPath();x.arc(X,Y,5,0,7);x.fill();x.stroke();if(a&&PX*k>50){x.font='bold 10px sans-serif';x.textAlign='center';x.fillStyle='#9ad0ff';x.fillText(a.nm,X,Y-9)}}}}
/* ---------- talking to them ---------- */
const nFollow=()=>ALLY().filter(a=>a.st=='follow'||a.st=='down').length;
function aSet(a,st,job){const was=a.st;a.st=st;a.job=job||null;if(st=='wait'){const z=aEnt(a),[gx,gy]=gOf(z.x,z.y),[ox,oy]=bo(gx-OGX,gy-OGY);a.wait={gx,gy,lx:z.x-ox,ly:z.y-oy}}
 const say={follow:'🤝 '+a.nm+': "같이 가요!"',wait:'✋ '+a.nm+': "여기서 기다릴게요"',base:'🏠 '+a.nm+'이(가) 거점으로 돌아가요',job:{guard:'🛡 '+a.nm+': "거점은 제가 지킬게요"',scav:'🔍 '+a.nm+': "내일 아침에 돌아올게요"',heal:'💊 '+a.nm+': "다치면 거점으로 오세요"'}[job]};msg(st=='job'?say.job:say[st])}
function aRevive(a){const p=S.p,k=p.inv.medkit>0&&!(p.inv.bandage>0)?'medkit':'bandage';if(!(p.inv[k]>0))return msg('🩹 붕대나 구급상자가 있어야 일으킬 수 있어요');p.inv[k]--;a.st='follow';a.hp=Math.round(aMhp(a)*(k=='medkit'?.8:.45));msg('🩹 '+a.nm+'을(를) 일으켰어요!');setTimeout(()=>aSay(a,'revive',1),300)}
{const _c=dmCtx;dmCtx=function(){const B=_c();if(!S||!run)return B;const p=S.p;for(const z of Z){if(z.npc!='ally')continue;const a=aById(z.ally);if(!a||Math.hypot(z.x-p.x,z.y-p.y)>64)continue;const nm=' · '+a.nm;
  if(a.st=='down'){B.unshift({t:'🩹 일으키기'+nm+' · 붕대 1',f:()=>aRevive(a),big:1});continue}
  if(a.st=='follow'){B.push({t:'✋ 여기서 기다려'+nm,f:()=>aSet(a,'wait'),sm:1},{t:'🏠 거점으로 보내기'+nm,f:()=>aSet(a,'base'),sm:1})}
  else if(a.st=='wait'){B.unshift({t:'🤝 따라와'+nm,f:()=>aSet(a,'follow'),big:1});B.push({t:'🏠 거점으로 보내기'+nm,f:()=>aSet(a,'base'),sm:1})}
  else{B.unshift({t:nFollow()>=2?'🤝 같이 가자 (동료 2명까지)':'🤝 같이 가자'+nm,f:()=>aSet(a,'follow'),off:nFollow()>=2,big:1});for(const j in AJOB)if(a.job!=j)B.push({t:AJOB[j][0]+' '+AJOB[j][1]+' 맡기기'+nm,f:()=>aSet(a,'job',j),sm:1});if(a.st=='job')B.push({t:'😴 쉬게 하기'+nm,f:()=>aSet(a,'base'),sm:1})}
  B.push({t:'📋 동료 관리',f:aOpen,sm:1})}return B}}
if(typeof IAW!='undefined')IAW.unshift([/일으키기/,'일으키기'],[/같이 가자|따라와/,'같이 가기'],[/기다려/,'기다려'],[/거점으로 보내기/,'돌려보내기'],[/맡기기/,'일 맡기기'],[/동료 관리/,'동료']);
/* ---------- the management sheet ---------- */
function aOpen(){const b=$('bm'),L=ALLY();b.dataset.m='ally';PAUSE=true;const stT=a=>a.st=='follow'?'🤝 같이 다니는 중':a.st=='wait'?'✋ 기다리는 중':a.st=='down'?'🆘 쓰러짐':a.st=='hurt'?'🩹 쉬는 중 (내일)':a.st=='job'?AJOB[a.job][0]+' '+AJOB[a.job][1]+' 중':'🏠 거점';
 b.innerHTML='<div class="sh"><h2>👥 동료</h2><div class="wt">'+L.length+'명 · 같이 다니기 '+nFollow()+'/2 · 거점에서 일을 맡길 수 있어요</div><button onclick="closeBase();PAUSE=false">✕</button></div>'+
  (L.length?L.map(a=>{const R0=AROLE[a.role],hp=a.hp/aMhp(a),busy=a.st=='down'||a.st=='hurt';return'<div class="alC"><div class="alH"><canvas data-al="'+a.id+'" width="40" height="48"></canvas><div class="alN"><b>'+R0.ic+' '+a.nm+'</b> <b style="color:'+AGRADE[a.gr||1][1]+'">'+AGRADE[a.gr||1][0]+'</b> <small>'+R0.nm+' · Lv'+a.lv+(a.bio?' · 전직 '+a.bio:'')+'</small><div class="mut">'+stT(a)+' · '+R0.ds+'</div><div class="alT">'+(a.tr||[]).map(k=>'<span>'+ATR[k][0]+' '+ATR[k][1]+'<small>'+ATR[k][2]+'</small></span>').join('')+'</div>'+
   '<div class="alB"><i style="width:'+(hp*100)+'%;background:'+(hp>.5?'#5fe08a':'#ffd36a')+'"></i></div><div class="alX"><i style="width:'+(a.xp/aNext(a)*100)+'%"></i></div><div class="alW"><img src="'+icon(aWid(a))+'"><b>'+NM2(aWid(a))+'</b>'+(typeof mRank=='function'?'<span style="color:'+MRCOL[mRank((a.mast||{})[aWid(a)]|0)]+'">'+MRK[mRank((a.mast||{})[aWid(a)]|0)]+'</span>':'')+(a.shd?' <img src="'+icon(a.shd)+'"><b>'+NM2(a.shd)+'</b>'+(typeof SHDHP!='undefined'?' <small class="mut">내구 '+Math.round(a.shdHp==null?SHDHP[a.shd]:a.shdHp)+'/'+SHDHP[a.shd]+((a.shdHp|0)<=0&&a.shdHp!=null?' · 부서짐':'')+'</small>':''):'')+'</div><small class="mut">체력 '+Math.round(a.hp)+'/'+aMhp(a)+' · 피해 '+Math.round(aDmg(a))+' · 경험치 '+a.xp+'/'+aNext(a)+'</small></div></div>'+
   '<div class="alA">'+(a.role=='gun'&&!busy?'<button data-gw="'+a.id+'">🔫 무기 건네기</button>':'')+'<button data-mo="'+a.id+'">🎖 숙련도</button>'+(busy?'':'<button data-a="'+a.id+'" data-s="follow"'+(a.st=='follow'||nFollow()>=2?' disabled':'')+'>🤝 데려가기</button>'+Object.keys(AJOB).map(j=>'<button data-a="'+a.id+'" data-s="job" data-j="'+j+'"'+(a.st=='job'&&a.job==j?' disabled':'')+'>'+AJOB[j][0]+' '+AJOB[j][1]+'</button>').join('')+'<button data-a="'+a.id+'" data-s="base"'+(a.st=='base'?' disabled':'')+'>😴 쉬기</button>')+'</div></div>'}).join(''):'<div class="sub">아직 동료가 없어요 · 방송국 송신탑에서 생존자 신호를 찾아 구출하면 동료가 돼요</div>')+
  '<div class="sub" style="line-height:1.6;margin-top:6px">· 역할 9가지 · 특성 10가지 · 등급 ★~★★★ (특성 수 · 능력 +10%씩) · 전직에 따라 역할이 정해져요<br>· 🛡 경비: 거점에서 좀비를 쏴요 · 🔍 수색: 다음 날 아침 물자 · 💊 치료: 거점에 있으면 회복<br>· 쓰러지면 40초 안에 붕대로 일으키기 · 못 하면 거점에서 하루 쉬어요 · 처치하면 경험치 → 레벨 업 · 탄약은 쓰지 않아요</div>';
 b.style.display='block';b.querySelectorAll('canvas[data-al]').forEach(c=>{const a=aById(+c.dataset.al);try{const x=c.getContext('2d'),g0=g;g=x;x.translate(20,44);drawChar(aLook(a),0,0,'d',-1,wkOf(aWid(a)));g=g0}catch(e){}});
 b.querySelectorAll('[data-mo]').forEach(bt=>bt.onclick=()=>mastOpen(aById(+bt.dataset.mo)));b.querySelectorAll('[data-gw]').forEach(bt=>bt.onclick=()=>aGiveOpen(aById(+bt.dataset.gw)));b.querySelectorAll('[data-a]').forEach(bt=>bt.onclick=()=>{const a=aById(+bt.dataset.a);if(bt.dataset.s=='follow'&&!inBase(S.p.x,S.p.y)&&a.st!='wait'){msg('🤝 거점에 있는 동료는 거점에서 데려가요');return}aSet(a,bt.dataset.s,bt.dataset.j);aOpen()})}
document.head.insertAdjacentHTML('beforeend',`<style>#bm .alC{padding:9px;margin:7px 0;border-radius:12px;background:#ffffff0c;border:1px solid #5aa8ff33}#bm .alH{display:flex;gap:10px}#bm .alH canvas{width:40px;height:48px;image-rendering:pixelated;background:#0006;border-radius:8px}#bm .alN{flex:1}#bm .alN small{color:var(--mut)}
#bm .alB,#bm .alX{height:6px;border-radius:3px;background:#ffffff14;margin:4px 0 2px;overflow:hidden}#bm .alB i,#bm .alX i{display:block;height:100%}#bm .alX{height:4px}#bm .alX i{background:#5aa8ff}#bm .alA{display:flex;flex-wrap:wrap;gap:5px;margin-top:7px}#bm .alA button{flex:1;min-width:70px;padding:6px 4px;font-size:12px}#bm .alW{display:flex;align-items:center;gap:5px;margin:3px 0;font-size:12px}#bm .alW img{width:22px;height:22px;image-rendering:pixelated}#bm .alW span{font:900 13px system-ui;margin-left:2px}#bm .alT{display:flex;flex-wrap:wrap;gap:4px;margin:4px 0}#bm .alT span{padding:2px 8px;border-radius:8px;background:#ffffff12;font-size:11.5px}#bm .alT small{display:block;color:var(--mut);font-size:10px}</style>`);

/* ---------- giving a weapon to a gunner: any gun, bow or melee weapon from your bag ---------- */
function aGiveOpen(a){const b=$('bm'),p=S.p;b.dataset.m='agive';PAUSE=true;const L=ownedW().filter(id=>{const w=W_BY[id];return w&&(w[2]=='g'||w[2]=='m')&&!(DT&&DT[id])&&id!='fist'});
 b.innerHTML='<div class="sh"><h2>🔫 '+a.nm+'에게 무기 건네기</h2><div class="wt">사수는 모든 무기를 쓸 수 있어요 · 무기마다 숙련도가 따로 쌓여요 · 탄약은 쓰지 않아요</div><button onclick="aOpen()">↩</button></div>'+
  '<div class="sub">지금: <b>'+NM2(aWid(a))+'</b> '+MRK[mRank((a.mast||{})[aWid(a)]|0)]+(a.given?' · 건네면 지금 무기는 가방으로 돌아와요':'')+'</div>'+
  (L.length?L.map(id=>{const r=mRank((a.mast||{})[id]|0),w=W_BY[id][4];return'<button class="agB" data-gv="'+id+'"><img src="'+icon(id)+'"><span><b>'+NM2(id)+'</b><small>피해 '+w.d+(w.pel?'×'+w.pel:'')+' · 사거리 '+(w.r||40)+' · '+a.nm+'의 숙련도 <b style="color:'+MRCOL[r]+'">'+MRK[r]+'</b> · 명중 '+Math.round(mHit(id,r)*100)+'%</small></span></button>'}).join(''):'<div class="sub">건넬 무기가 가방에 없어요</div>');
 b.style.display='block';b.querySelectorAll('[data-gv]').forEach(bt=>bt.onclick=()=>{const id=bt.dataset.gv;if(!(p.inv[id]>0))return;if(a.given&&a.wpn)give({[a.wpn]:1});invTake(p,id,1);for(const k in p.eq)if(p.eq[k]==id&&!has(p,id))p.eq[k]='';a.wpn=id;a.given=1;msg('🔫 '+a.nm+': "'+NM2(id)+', 잘 쓸게요!"');aOpen()})}
document.head.insertAdjacentHTML('beforeend',`<style>#bm .agB{display:flex;gap:9px;align-items:center;width:100%;text-align:left;padding:8px;margin:5px 0;border-radius:10px}#bm .agB img{width:32px;height:32px;image-rendering:pixelated}#bm .agB small{display:block;color:var(--mut);font-size:11px}</style>`);

/* ---------- ammo for companions ---------- */
function aReload(a,z){const id=aAmmoId(a),P=aPouch(a),need=aMagSz(a)-(a.mag|0);let take=Math.min(need,P[id]|0);
 if(take<=0&&a.auto!==false&&S&&S.p&&(S.p.inv[id]|0)>0&&Math.hypot(S.p.x-z.x,S.p.y-z.y)<220){const n=Math.min(need,S.p.inv[id]);invTake(S.p,id,n);P[id]=(P[id]|0)+n;take=n;msg('🔫 '+a.nm+': "탄약 좀 가져갈게요" · '+NM2(id)+' '+n+'발');if(typeof mFloat=='function'){mFloat(S.p.x,S.p.y-44,'−'+n+'발 ('+a.nm+')','#ffd36a',1.6);mFloat(z.x,z.y-44,'+'+n+'발','#9ad0ff',1.6)}if(typeof hud2=='function')hud2()}
 if(take>0){P[id]-=take;a.mag=(a.mag|0)+take;z.cd2=Math.max(z.cd2||0,1.6);z.say='장전!';z.sayT=1;return true}return false}
/* true = a round is ready (and spent) · melee and fuel weapons never need ammo */
function aFeed(a,z){const id=aAmmoId(a);if(!id)return true;if(a.am==null){aPouch(a)[id]=aMagSz(a)*2;a.mag=aMagSz(a)}/* companions from before ammo existed */if((a.mag|0)<=0){if(!aReload(a,z)){if(!a.outSaid){a.outSaid=1;z.say='탄약이 떨어졌어요!';z.sayT=3;msg('⚠ '+a.nm+'의 탄약이 떨어졌어요 · 동료 관리에서 건네주세요')}return false}return false}a.mag--;a.outSaid=0;return true}
/* out of ammo: a weak bash with the gun */
function aBash(a,z,q){const dx=q.x-z.x,dy=q.y-z.y,d=Math.hypot(dx,dy)||1;if(d>40)return;z.fx=dx;z.fy=dy;q.lastAlly=a.id;hitZ(q,6*(1+.1*(a.lv-1)),dx/d,dy/d,2);fx.push({k:'sw',x:z.x,y:z.y,fx:dx/d,fy:dy/d,l:.15})}
/* new companions start with two magazines in the pouch */
{const _an=allyNew;allyNew=function(){const a=_an.apply(this,arguments);const id=aAmmoId(a);if(id){aPouch(a)[id]=aMagSz(a)*2;a.mag=aMagSz(a)}return a}}
/* give ammo from the companion sheet */
function aGiveAmmo(a,all){const id=aAmmoId(a);if(!id)return;const p=S.p,have=p.inv[id]|0;if(!have)return msg('🔫 '+NM2(id)+'이(가) 가방에 없어요');const n=all?have:Math.min(have,aMagSz(a)*2);invTake(p,id,n);aPouch(a)[id]=(aPouch(a)[id]|0)+n;msg('🔫 '+a.nm+'에게 '+NM2(id)+' '+n+'발');aOpen()}
{const _ao=aOpen;aOpen=function(){_ao();document.querySelectorAll('#bm .alC').forEach((el,i)=>{const a=ALLY()[i];if(!a)return;const id=aAmmoId(a);const w=el.querySelector('.alW');if(!w)return;
  w.insertAdjacentHTML('afterend',id?'<div class="alAm"><span>🔫 '+NM2(id)+' <b>'+(a.mag|0)+'</b>/'+aMagSz(a)+' · 주머니 <b>'+(aPouch(a)[id]|0)+'</b>'+(aOut(a)?' · <b style="color:#ff8a7a">탄 없음</b>':'')+'</span><button data-am="'+a.id+'">+ 2탄창</button><button data-aa="'+a.id+'">전부</button><button data-ar="'+a.id+'" class="'+(a.auto===false?'':'on')+'">자동 보충 '+(a.auto===false?'끔':'켬')+'</button></div>':'<div class="alAm"><span class="mut">근접 무기 · 탄약 필요 없음</span></div>')});
  const b=$('bm');b.querySelectorAll('[data-am]').forEach(x=>x.onclick=()=>aGiveAmmo(aById(+x.dataset.am),false));b.querySelectorAll('[data-aa]').forEach(x=>x.onclick=()=>aGiveAmmo(aById(+x.dataset.aa),true));
  b.querySelectorAll('[data-ar]').forEach(x=>x.onclick=()=>{const a=aById(+x.dataset.ar);a.auto=a.auto===false;aOpen()});
  const sub=b.querySelector('.sub:last-child');if(sub)sub.insertAdjacentHTML('beforeend','<br>· <b>탄약</b>: 동료도 쏠 때마다 탄을 써요 · 탄창이 비면 주머니에서 장전 (1.6초) · 주머니도 비면 <b>자동 보충</b>이 켜져 있을 때 가까이(220) 있는 내 가방에서 한 탄창 가져가요 · 다 떨어지면 총으로 내려쳐요 (약함)')}}
{const _gv=aGiveOpen;aGiveOpen=function(a){_gv(a);document.querySelectorAll('#bm [data-gv]').forEach(bt=>{const f=bt.onclick;bt.onclick=()=>{f();const n=aById(a.id);if(n){n.mag=0;n.outSaid=0}}})}}
document.head.insertAdjacentHTML('beforeend',`<style>#bm .alAm{display:flex;flex-wrap:wrap;align-items:center;gap:5px;font-size:11.5px;margin:3px 0}#bm .alAm span{flex:1 1 100%}#bm .alAm button{padding:3px 8px;font-size:11px}#bm .alAm button.on{border-color:#7fd07f;color:#9fe09f}</style>`);
/* ---------- noise: companions make noise like you do (their weapon's noise level · scouts one step quieter) ---------- */
const ANZN=['무음','작음','보통','큼','매우 큼','최대'];
function aNz(a){const W=aWS(a);let n=W.nz!=null?W.nz:aMelee(a)?0:3;if(a.role=='scout')n-=1;return Math.max(0,Math.min(5,n))}
{const _as=aShoot;aShoot=function(a,z,q){const m0=a.mag|0,out0=aOut(a);const r=_as.apply(this,arguments);
  if(!z||typeof noise!='function')return r;const fired=aMelee(a)||(a.mag|0)<m0;if(fired){const n=aNz(a);if(n>0){noise(z.x,z.y,n);z.nzT=.5;z.nzR=NZR[n]}}else if(out0&&aOut(a))noise(z.x,z.y,1);return r}}
/* ---------- base: fill the pouch from the stash (option) ---------- */
const AFILL_MAGS=3;let aFillT=0;
function aStashFill(a,z,quiet){const id=aAmmoId(a);if(!id||!S.base||!S.base.st)return 0;const want=aMagSz(a)*AFILL_MAGS-(aPouch(a)[id]|0)-Math.max(0,aMagSz(a)-(a.mag|0));const have=S.base.st[id]|0;const n=Math.min(Math.max(0,want),have);
 if(n<=0)return 0;S.base.st[id]=have-n;aPouch(a)[id]=(aPouch(a)[id]|0)+n;if(z&&typeof mFloat=='function')mFloat(z.x,z.y-44,'🏠 +'+n+'발','#9fe09f',1.6);if(!quiet)msg('🏠 '+a.nm+': 창고에서 '+NM2(id)+' '+n+'발 챙겼어요');return n}
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!S||!S.inf||!run||PAUSE||S.inf.aFill===false||(typeof DUN!='undefined'&&DUN))return;aFillT-=dt;if(aFillT>0)return;aFillT=2;
  for(const a of ALLY()){if(a.st=='down'||a.st=='hurt'||a.job=='scav'&&a.st=='job')continue;const z=aEnt(a),home=a.st=='base'||a.st=='job'||a.st=='wait'&&z&&typeof inBase=='function'&&inBase(z.x,z.y)||a.st=='follow'&&z&&typeof inBase=='function'&&inBase(z.x,z.y);if(home)aStashFill(a,z)}}}
/* ---------- the sheet: ammo in one line (how many rounds · how many shots) · the stash option · noise ---------- */
{const _ao=aOpen;aOpen=function(){_ao.apply(this,arguments);const b=$('bm');if(!b)return;
  b.querySelectorAll('.alAm').forEach(row=>{const bt=row.querySelector('[data-am]');const a=bt?aById(+bt.dataset.am):null;const sp=row.querySelector('span');if(!a||!sp)return;const id=aAmmoId(a),tot=(a.mag|0)+(aPouch(a)[id]|0),shots=tot;
   const col=tot<=0?'#ff8a7a':shots<aMagSz(a)?'#ffd36a':'#9fe09f';sp.innerHTML='🔫 '+NM2(id)+' <b style="color:'+col+'">'+tot+'발</b> · 약 <b style="color:'+col+'">'+shots+'번</b> 쏠 수 있어요 <span class="mut">(탄창 '+(a.mag|0)+'/'+aMagSz(a)+' · 주머니 '+(aPouch(a)[id]|0)+' · 창고 '+((S.base&&S.base.st&&S.base.st[id])|0)+')</span> · 🔊 '+ANZN[aNz(a)]});
  const sub=b.querySelector('.sub:last-child');if(sub&&!b.querySelector('#aFillB')){sub.insertAdjacentHTML('beforebegin','<div class="alAm"><button id="aFillB" class="'+(S.inf.aFill===false?'':'on')+'">🏠 거점에서 창고 탄약 자동 채우기 '+(S.inf.aFill===false?'끔':'켬')+'</button><span class="mut">거점에 있는 동료가 창고에서 '+AFILL_MAGS+'탄창까지 챙겨요</span></div>');
   $('aFillB').onclick=()=>{S.inf.aFill=S.inf.aFill===false;if(S.inf.aFill)for(const a of ALLY()){const z=aEnt(a);if(a.st!='follow'||z&&typeof inBase=='function'&&inBase(z.x,z.y))aStashFill(a,z)}aOpen()};
   sub.insertAdjacentHTML('beforeend','<br>· <b>소음</b>: 동료가 쏘면 그 무기 소음만큼 주변 좀비가 몰려와요 (정찰병은 한 단계 조용) · 소음기 달린 총을 건네면 조용히 싸워요')}}}
/* a faint ring where a companion's shot was heard */
{const _zd=zDraw4;zDraw4=function(z){if(z.npc=='ally'&&z.nzT>0){z.nzT-=.016;const k=1-z.nzT/.5;g.save();g.globalAlpha=.35*(1-k);g.strokeStyle='#ffd36a';g.lineWidth=1.5;g.beginPath();g.arc(z.x,z.y-10,20+(Math.min(z.nzR||160,260)-20)*k,0,6.2832);g.stroke();g.restore()}return _zd.apply(this,arguments)}}
/* ---------- speech bubbles and the "탄약 없음" tag: drawn sharp at screen resolution (the world is drawn small and blown up) ---------- */
function aBubbles(){if(!S||!S.inf||typeof ctx=='undefined')return;const c=ctx,k=zoom*dpr;let any=false;
 /* tags (name line + bubble if any) of companions standing close together are stacked so they never overlap */
 {const L=[];for(const z of Z){if(z.npc!='ally')continue;const a=aById(z.ally);if(!a)continue;const bub=a.st!='down'&&(z.sayT>0&&z.say||aAmmoId(a)&&aOut(a));const Y=(z.y-camY)*k,bot=Y-54*k+8*dpr,top=bub?Y-76*k-28*dpr:a.st=='down'?Y-54*k-9*dpr:Y-64*k-8*dpr;L.push({z,X:(z.x-camX)*k,b:bot,h:bot-top})}
  L.sort((p,q)=>q.b-p.b);const pl=[];for(const t of L){let dy=0;for(let n=0;n<8;n++){let hit=null;for(const u of pl)if(Math.abs(u.X-t.X)<100*dpr&&t.b+dy>u.b+u.dy-u.h&&t.b+dy-t.h<u.b+u.dy){hit=u;break}if(!hit)break;dy=hit.b+hit.dy-hit.h-t.b-2*dpr}t.dy=dy;t.z._tdy=dy;pl.push(t)}}
 for(const z of Z){if(z.npc!='ally')continue;const a=aById(z.ally);if(!a)continue;
  {const X=(z.x-camX)*k,Y=(z.y-camY)*k;if(X>-200&&Y>-100&&X<c.canvas.width+200&&Y<c.canvas.height+200){c.save();c.setTransform(1,0,0,1,0,0);c.textAlign='center';c.textBaseline='middle';c.lineJoin='round';
   if(a.st=='down'){const t=performance.now()/300;c.font='700 '+Math.round(12*dpr)+'px system-ui,sans-serif';const tx='🆘 '+a.nm+' · '+Math.ceil(a.downT)+'초';c.lineWidth=3.5*dpr;c.strokeStyle='#000c';const yy=Y-54*k+(z._tdy||0)+Math.sin(t)*2*dpr;c.strokeText(tx,X,yy);c.fillStyle='#ff9a8a';c.fillText(tx,X,yy)}
   else{const GR=AGRADE[a.gr||1],R0=AROLE[a.role],nm=R0.ic+' '+a.nm+' Lv'+a.lv+(a.st=='job'?' · '+AJOB[a.job][1]:a.st=='wait'?' · 대기':'');c.lineWidth=3*dpr;c.strokeStyle='#000b';
    c.font='700 '+Math.round(10*dpr)+'px system-ui,sans-serif';const dY=z._tdy||0;c.strokeText(GR[0],X,Y-64*k+dY);c.fillStyle=GR[1];c.fillText(GR[0],X,Y-64*k+dY);
    c.font='600 '+Math.round(11*dpr)+'px system-ui,sans-serif';c.strokeText(nm,X,Y-54*k+dY);c.fillStyle='#b4dcff';c.fillText(nm,X,Y-54*k+dY)}c.restore()}}
  if(a.st=='down')continue;const say=z.sayT>0&&z.say,out=!say&&aAmmoId(a)&&aOut(a);if(!say&&!out)continue;
  const X=(z.x-camX)*k,Y=(z.y-camY)*k;if(X<-200||Y<-100||X>c.canvas.width+200||Y>c.canvas.height+200)continue;any=true;c.save();c.setTransform(1,0,0,1,0,0);c.textAlign='center';c.textBaseline='middle';
  const fs=Math.round(13*dpr),pad=8*dpr,top=Y-76*k+(z._tdy||0);
  if(say){c.font='600 '+fs+'px system-ui,sans-serif';const w=c.measureText(z.say).width+pad*2,h=fs+pad*1.1,x0=Math.round(X-w/2),y0=Math.round(top-h);c.globalAlpha=Math.min(1,z.sayT);
   c.fillStyle='#000000';c.globalAlpha*=.35;aRR(c,x0+1.5*dpr,y0+2*dpr,w,h,7*dpr);c.fill();c.globalAlpha=Math.min(1,z.sayT);
   c.fillStyle='#fffdf7';c.strokeStyle='#3a2f28';c.lineWidth=1.5*dpr;aRR(c,x0,y0,w,h,7*dpr);c.fill();c.stroke();
   c.beginPath();c.moveTo(X-5*dpr,y0+h-.5);c.lineTo(X,y0+h+6*dpr);c.lineTo(X+5*dpr,y0+h-.5);c.closePath();c.fill();c.beginPath();c.moveTo(X-5*dpr,y0+h);c.lineTo(X,y0+h+6*dpr);c.lineTo(X+5*dpr,y0+h);c.stroke();
   c.fillStyle='#1d1714';c.fillText(z.say,X,y0+h/2+.5)}
  else{const t=performance.now()/250;c.font='700 '+Math.round(11*dpr)+'px system-ui,sans-serif';const tx='탄약 없음',w=c.measureText(tx).width+pad*1.4,h=Math.round(11*dpr)+pad*.8,x0=Math.round(X-w/2),y0=Math.round(top-h);c.globalAlpha=.8+.2*Math.sin(t);
   c.fillStyle='#3a0d0aee';c.strokeStyle='#ff8a7a';c.lineWidth=1*dpr;aRR(c,x0,y0,w,h,5*dpr);c.fill();c.stroke();c.fillStyle='#ffb0a4';c.fillText(tx,X,y0+h/2+.5)}
  c.restore()}}
function aRR(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
{const _dw=draw;draw=function(){const r=_dw.apply(this,arguments);try{aBubbles()}catch(e){}return r}}
