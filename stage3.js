/* PROJECT LEGACY — stage 3: levels (max 50), stats, skills, traits, perks and gun parts.
   Loaded after the game script: wraps game functions (kill, die, start, cr, upgrade, hitZ, noise, boom, gearAct, gearUpd, hud2, drawGearFx)
   and supplies the hooks gear.js / the page call (s3W, MHP, s3Heal, s3Spd, s3Cap, s3Arm, s3Hun, s3Tur, s3Prod, s3Bleed*, s3Search). */
'use strict';
/* ---------- descriptions matching what this build really does ---------- */
{const SKD={surv2:'내 공격 소음이 퍼지는 범위 -15% / 랭크',tech2:'거점 업그레이드 재료 8% / 랭크 돌려받기',tech4:'폭발 피해 +20% / 랭크 (수류탄 · 유탄)',combat3:'치명타 확률 +5% / 랭크 (피해 2배)'};
 for(const b in SKILLS)SKILLS[b][1].forEach((s,i)=>{if(SKD[b+i])s[1]=SKD[b+i]});
 const TD={cop:'권총·산탄총 피해 +15%',soldier:'소총·저격총·기관총 피해 +10% · 재장전 -15%',nurse:'치료 효과 +30% · 출혈 피해 절반',carp:'거점 업그레이드 재료 20% 돌려받기',runner:'이동 속도 +10%',mech:'파츠 발견 확률 +25%',hunter:'활·석궁·산탄총 피해 +15%',prep:'허기·갈증 감소 -20%',glut:'허기 +30%',myop:'총기 사거리 -15%',loud:'내 공격 소음 범위 +30%',weak:'최대 체력 -15'};
 for(const t of TRAITS)if(TD[t[0]])t[2]=TD[t[0]];
 const PD={'침착함':'치명타 확률 +5%','전술가':'포탑 피해 +20%','재건자':'거점 식량·물 생산 2배','야행성':'밤에 모든 무기 사거리 +20%','전설의 생존자':'모든 능력치 +3','보물 사냥꾼':'희귀 이상 파츠가 나올 확률 +40%'};
 for(const L in PERKS)for(const k of PERKS[L])if(PD[k[0]])k[1]=PD[k[0]]}
const SKB=['combat','surv','tech'],PERK_LV=[10,20,30,40,50];
/* 손재주 (surv5): a stand-alone survival skill added after the 5 tiers — Lv 3, no previous tier needed; ids of the other skills stay the same for old saves */
if(SKILLS.surv[1].length==5){SKILLS.surv[1].push(['손재주','수색 시간 -10% / 랭크 · 앞 단계 없이 배울 수 있음']);TIER_LV[5]=3}
/* 훈련 교범: rare loot (military, lab, police) that refunds every skill point so skills can be picked again */
if(!I_BY.manual){const it=['manual','훈련 교범','c','e',.4,'사용하면 배운 스킬을 모두 되돌려 스킬 포인트로 돌려받음'];ITEMS.push(it);I_BY.manual=it;
 IC.manual=()=>{R('#1e2124',4,4,16,17);R('#3d5a2e',5,5,14,15);R('#4f7239',5,5,14,2);R('#2c4321',5,5,2,15);R('#e0c56a',9,9,7,2);R('#e0c56a',10,12,5,1);R('#e0c56a',10,14,5,1);R('#f4f0e0',17,6,2,14);R('#c9c2a8',17,6,1,14)}}
const PG0=()=>({lv:1,xp:0,sp:0,kp:0,st:{str:5,agi:5,vit:5,aim:5,sur:5},sk:{},tr:[],pk:{},parts:{},mods:{},vis:{},seen:{},ld:-1,wd:-1});
const S3={ctx:null,cc:0,mel:false,glcd:0,chain:0,lastK:0,fl:[],lvT:0,ver:0,cache:{}};
function PGo(){if(!S)return PG0();if(!S.pg)S.pg=PG0();return S.pg}
const s3sk=id=>(S&&S.pg&&S.pg.sk[id])|0,s3T=id=>!!(S&&S.pg&&S.pg.tr.includes(id)),s3P=n=>!!(S&&S.pg&&Object.values(S.pg.pk).includes(n));
const s3st=k=>(S&&S.pg?S.pg.st[k]:STAT_BASE)+(s3P('전설의 생존자')?3:0),s3b=k=>s3st(k)-STAT_BASE;
const s3dirty=()=>{S3.ver++;S3.cache={}};
/* ---------- derived numbers used by the game ---------- */
function MHP(p){return Math.round(100+4*s3b('vit')+10*s3sk('surv3')-(s3T('weak')?15:0))}
const s3Heal=()=>(1+.2*s3sk('surv0'))*(s3T('nurse')?1.3:1);
const s3BleedD=()=>s3T('nurse')?.5:1,s3BleedCh=()=>s3P('두꺼운 피부')?.7:1;
const s3Hun=k=>Math.max(.3,(1-.02*s3b('sur'))*(s3T('prep')?.8:1)*(k=='f'&&s3T('glut')?1.3:1));
const s3Tur=()=>(1+.15*s3sk('tech3'))*(s3P('전술가')?1.2:1),s3Prod=()=>s3P('재건자')?2:1,s3Arm=()=>s3P('철벽')?.9:1;
const s3Cap=p=>Math.max(0,s3b('str'))+6*s3sk('surv4');
function s3Spd(p){let m=(1+.01*s3b('agi'))*(s3T('runner')?1.1:1);const id=S&&S.p?actW(S.p):null;if(id&&GCLASS[id]){const e=s3Fx(id);if(e.mov)m*=1+e.mov/100}return m}
const s3Rar=()=>RORD[Math.min(4,1+s3sk('tech1'))]; // best part rarity you can mount: 고급, then 희귀/영웅/전설 with the 총기 개조 skill
function s3Fx(id){const e={dmg:0,rng:0,acc:0,rec:0,rof:0,mag:0,rld:0,nz:0,mov:0,night:0,gl:0},m=S&&S.pg&&S.pg.mods[id];if(m)for(const k in m){const p=P_BY[m[k]];if(p)for(const q in p[5])e[q]+=p[5][q]}return e}
const s3Night=()=>S&&(S.t>=1500||S.t<100);
/* weapon stats after stats, skills, traits, perks and parts (cached until something changes) */
function s3W(id){const w=W_BY[id];if(!w||!S||!S.pg)return w;const key=id+(s3Night()?'n':'d')+(S3.chain>0?'c':'');if(S3.cache[key])return S3.cache[key];
 const s0=w[4],s=Object.assign({},s0),cat=w[2],sub=SUB[id]||'',cl=GCLASS[id],e=cl?s3Fx(id):s3Fx('');let dm=1;
 if(cat=='m')dm*=1+.03*s3b('str')+.1*s3sk('combat0');
 if(cat=='g')dm*=1+.02*s3b('aim')+.08*s3sk('combat1');
 if(cat=='t')dm*=1+.2*s3sk('tech4');
 if(s3T('cop')&&(sub=='권총'||sub=='산탄총'))dm*=1.15;if(s3T('soldier')&&['rifle','sniper','lmg'].includes(cl))dm*=1.1;if(s3T('hunter')&&(cl=='bow'||sub=='산탄총'))dm*=1.15;
 if(s3P('무기 달인'))dm*=1.1;dm*=1+e.dmg/100;s.d=s0.d*dm;
 s.cd=s0.cd/(1+.015*s3b('agi'))/(1+e.rof/100)/(S3.chain>0?1.25:1);
 s.r=s0.r*(1+e.rng/100)*(s3T('myop')&&cat=='g'?.85:1)*(s3Night()?1+.1*e.night+(s3P('야행성')?.2:0):1);
 if(s0.mag&&cat=='g'&&s0.ammo!='fuel')s.mag=Math.max(1,Math.round(s0.mag*(1+e.mag/100)));
 if(s0.nz!=null)s.nz=Math.max(0,Math.min(5,s0.nz+e.nz));
 s.rlm=Math.max(.3,(1-.02*s3b('aim'))*(1-.12*s3sk('combat2'))*(1+e.rld/100)*(s3T('soldier')&&['rifle','sniper','lmg'].includes(cl)?.85:1));
 s.cc=.05*s3sk('combat3')+(s3P('침착함')?.05:0)+Math.max(0,e.acc)*.005+Math.max(0,-e.rec)*.002;s.gl=e.gl;
 return S3.cache[key]=[w[0],w[1],w[2],w[3],s,w[5],w[6]]}
/* ---------- XP and levels ---------- */
function s3Float(x,y,t,c){S3.fl.push({x,y,t:1.3,txt:t,c:c||'#ffd36a'})}
function s3Xp(n,src){const pg=PGo();if(pg.lv>=MAXLV||!n)return;pg.xp+=Math.round(n);const p=S.p;s3Float(p.x,p.y-40,'+'+Math.round(n)+' XP'+(src?' · '+src:''),'#9fe0ff');let up=0;
 while(pg.lv<MAXLV&&pg.xp>=xpNeed(pg.lv)){pg.xp-=xpNeed(pg.lv);pg.lv++;pg.sp++;if(pg.lv%2==0)pg.kp++;up=1}
 if(pg.lv>=MAXLV)pg.xp=0;
 if(up){S3.lvT=1.6;p.hp=MHP(p);msg('⬆ 레벨 '+pg.lv+'! '+LV_REW(pg.lv)+(s3PerkPend().length?' · 🎁 레벨 보너스를 고를 수 있어요':'')+' · 🧬 버튼에서 사용');s3dirty()}
 if($('bm').style.display=='block'&&$('bm').dataset.m=='char')openChar()}
const XPK={runner:15,screamer:25,heavy:60};
/* ---------- parts from searching (only source of parts) ---------- */
const PDROP={1:{c:70,u:28,r:2},2:{c:70,u:28,r:2},3:{c:50,u:40,r:10},4:{u:45,r:40,e:15},5:{r:45,e:40,l:15}};
const GUNBOX=['gunrack','locker','ammo','pcar','truck'];
function s3PartRoll(tier,ch){if(Math.random()>ch*(1+.1*s3sk('tech0'))*(s3T('mech')?1.25:1))return null;const T=Object.assign({},PDROP[Math.max(1,Math.min(5,tier))]);
 if(s3P('보물 사냥꾼'))for(const k of['r','e','l'])if(T[k])T[k]*=1.4;let t=Math.random()*Object.values(T).reduce((a,b)=>a+b,0),rar='c';for(const k in T){t-=T[k];if(t<=0){rar=k;break}}
 const L=PARTS.filter(p=>p[3]==rar);const own=['prim','sec'].map(k=>S.p.eq[k]).filter(id=>id&&GCLASS[id]).map(id=>GCLASS[id]);
 const fit=L.filter(p=>p[4].some(c=>own.includes(c)));const pool=fit.length&&Math.random()<.6?fit:L;return pool[Math.random()*pool.length|0][0]}
const DIS={c:{scrap:1},u:{scrap:2},r:{scrap:2,elec:1},e:{scrap:2,milpart:1},l:{milpart:2,elec:2}};
function s3Dis(pid,n){const q=P_BY[pid],r={};for(const k in DIS[q[3]])r[k]=DIS[q[3]][k]*n;if(s3T('mech'))r.scrap=(r.scrap||0)+n;for(const k in r)invAdd(S.p,k,r[k]);return Object.entries(r).map(([k,v])=>NM2(k)+' '+v).join(', ')}
function s3GotPart(pid){const pg=PGo(),p=P_BY[pid];
 if(pg.autoDis&&(pg.parts[pid]||0)>=1){const got=s3Dis(pid,1);setTimeout(()=>msg('🔩 중복 파츠 자동 분해: '+p[1]+' → '+got),1300);return}
 pg.parts[pid]=(pg.parts[pid]||0)+1;const nw=!pg.seen[pid];pg.seen[pid]=1;
 setTimeout(()=>{msg('🔩 파츠 발견: '+p[1]+' ('+RAR[p[3]][0]+')'+(nw?' · 새 파츠!':''));if(nw)s3Xp(25*(RORD.indexOf(p[3])+1),'새 파츠')},1300)}
/* searching is split in two so a timed search can decide its loot first and pay out when it finishes */
function s3SearchRoll(o,kind,tier,r){PGo();if(Math.random()<({mil:.03,lab:.03,police:.01})[kind])r.manual=(r.manual||0)+1;
 if(Math.random()<.08*s3sk('surv1')+.015*s3b('sur')){const x=roll(1,LOOTT[o.t]);for(const k in x)r[k]=(r[k]||0)+x[k]}
 const gun=GUNBOX.includes(o.t);return s3PartRoll(tier,gun?(kind=='police'||kind=='mil'?.45:.3):tier>=3?.05:.015)}
function s3SearchDone(tier,pid){s3Xp(3*tier,'수색');if(pid)s3GotPart(pid)}
function s3Search(o,kind,tier,r){s3SearchDone(tier,s3SearchRoll(o,kind,tier,r))}
/* ---------- wrap game functions ---------- */
{const _kill=kill;kill=function(z){_kill(z);if(!S)return;s3Xp((XPK[z.look]||10)+(z.w?5:0));const p=S.p;if(s3P('아드레날린'))p.st=Math.min(100,p.st+20);
  if(s3P('연쇄 처치')){if(S3.lastK>0){if(S3.chain<=0)s3dirty();S3.chain=3}S3.lastK=3}}}
{const _die=die;die=function(){const pg=PGo(),p=S.p;if(s3P('불굴')&&pg.ld!=S.day){pg.ld=S.day;p.hp=1;msg('🔥 불굴: 치명상을 버텨냈습니다 (하루 한 번)');s3Float(p.x,p.y-44,'불굴!','#ff9a5a');return}return _die()}}
{const _cr=cr;cr=function(k){const a=JSON.stringify(S.p.inv);const r=_cr.apply(this,arguments);if(JSON.stringify(S.p.inv)!=a)s3Xp(15,'제작');return r}}
{const _up=upgrade;upgrade=function(k){const lv=S.base.lv[k]||0,m=MODS.find(m=>m[0]==k),c=m&&m[5][lv]||{};const r=_up.apply(this,arguments);const nl=S.base.lv[k]||0;
  if(nl>lv){s3Xp(100*nl,'거점');const rate=.08*s3sk('tech2')+(s3T('carp')?.2:0);if(rate>0){const back=[];for(const i in c){const n=Math.floor((c[i]|0)*rate);if(n>0&&(W_BY[i]||I_BY[i])){invAdd(S.p,i,n);back.push(NM2(i)+' '+n)}}if(back.length)setTimeout(()=>msg('♻ 재료 환급: '+back.join(', ')),1200)}}return r}}
{const _hit=hitZ;hitZ=function(q,dmg,dx,dy,n){if(S3.ctx&&S&&S.pg){const p=S.p;let m=1;if(p.hp<MHP(p)*.3)m*=1+.15*s3sk('combat4');if(s3P('좀비 사냥꾼')&&['runner','screamer','heavy'].includes(q.look))m*=1.3;
  if(S3.cc&&Math.random()<S3.cc){m*=2;s3Float(q.x,q.y-34,'치명타!','#ffd36a')}dmg*=m;
  if(S3.mel&&s3P('처형자')&&q.hp-dmg>0&&q.hp-dmg<=(q.mhp||q.hp)*.2){dmg=q.hp;s3Float(q.x,q.y-34,'처형!','#ff6a5a')}}return _hit(q,dmg,dx,dy,n)}}
{const _nz=noise;noise=function(x,y,lv){if(S3.ctx&&S&&S.pg){const r=NZR[Math.max(0,Math.min(5,lv|0))]*(1-.15*s3sk('surv2'))*(s3T('loud')?1.3:1);if(!r)return;for(const q of Z)if(Math.hypot(q.x-x,q.y-y)<r){q.al=8;q.nx=x;q.ny=y}return}return _nz(x,y,lv)}}
{const _boom=boom;boom=function(x,y,rad,dmg,fire){return _boom(x,y,rad,dmg*(1+.2*s3sk('tech4')),fire)}}
{const _ga=gearAct;gearAct=function(){const p=S.p,id=actW(p),w=wdef(id),s=w[4],m0=p.mag[id];S3.ctx=id;S3.cc=s.cc||0;S3.mel=w[2]=='m';
  try{_ga()}finally{S3.ctx=null}
  const shot=w[2]=='g'&&m0!=null&&(p.mag[id]|0)<m0;if(shot&&s3P('탄약 절약')&&Math.random()<.15)p.mag[id]++;
  if(shot&&s.gl&&S3.glcd<=0&&S.tg&&S.tg.hp>0){const ai=AMMO_ITEM('40mm');if((p.inv[ai]|0)>0){invTake(p,ai,1);S3.glcd=5;S3.ctx=id;fx.push({k:'tr',a:[p.x,p.y-17],b:[S.tg.x,S.tg.y-10],l:.15});boom(S.tg.x,S.tg.y,70,120);S3.ctx=null}}}}
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!S)return;const pg=PGo(),s=S;S3.glcd-=dt;S3.lastK-=dt;if(S3.chain>0){S3.chain-=dt;if(S3.chain<=0)s3dirty()}S3.lvT=Math.max(0,S3.lvT-dt);
  S3.fl=S3.fl.filter(f=>(f.t-=dt,f.y-=dt*22,f.t>0));
  if(s.inb>=0&&W0.b[s.inb]&&!pg.vis[s.inb]){pg.vis[s.inb]=1;const t=TIER[W0.b[s.inb].kind]||1;s3Xp(50*t,'첫 방문')}
  if(pg.wd<0)pg.wd=s.day;if(s.day!=pg.wd){const y=pg.wd;pg.wd=s.day;if(y%5==0&&y>=5&&s.wv>0)s3Xp(200*(y/5),'웨이브 생존')}
  const n=s3Night()?1:0;if(S3.nt!==n){S3.nt=n;s3dirty()}}}
{const _dfx=drawGearFx;drawGearFx=function(){_dfx();if(!S)return;const p=S.p;
  if(S3.lvT>0){const k=S3.lvT/1.6;g.globalAlpha=k*.55;g.strokeStyle='#ffd36a';g.lineWidth=3;g.beginPath();g.ellipse(p.x,p.y-2,40*(1.6-k)+12,(40*(1.6-k)+12)*.45,0,0,7);g.stroke();g.globalAlpha=1}
  g.save();g.textAlign='center';g.font='bold 12px system-ui,sans-serif';for(const f of S3.fl){g.globalAlpha=Math.min(1,f.t*1.5);g.fillStyle='#000a';g.fillText(f.txt,f.x+1,f.y+1);g.fillStyle=f.c;g.fillText(f.txt,f.x,f.y)}g.restore()}}
{const _h=hud2;hud2=function(){if(S&&S.p&&S.pg&&S.p.hp>MHP(S.p))S.p.hp=MHP(S.p);_h();if(!S)return;const pg=PGo(),need=xpNeed(pg.lv),pend=pg.sp+pg.kp+s3PerkPend().length;
  const el=document.createElement('div');el.className='lvr';el.innerHTML='<b>Lv '+pg.lv+'</b><div class="xpb"><i style="width:'+(pg.lv>=MAXLV?100:Math.min(100,pg.xp/need*100))+'%"></i></div><span>'+(pg.lv>=MAXLV?'MAX':pg.xp+'/'+need)+'</span>';$('st').appendChild(el);
  const b=$('bCh');if(b){b.classList.toggle('dot',pend>0);b.dataset.n=pend||'';b.classList.toggle('perk',s3PerkPend().length>0)}}}
{const _st=start;start=function(d,load){const r=_st(d,load);s3dirty();S3.fl=[];const pg=PGo();if(!load||!pg.tr.length)openTraits(!load);return r}}
const s3PerkPend=()=>{const pg=PGo();return PERK_LV.filter(L=>pg.lv>=L&&!pg.pk[L])};
/* ---------- trait picker (new game, or an old save without traits) ---------- */
let TPICK={job:null,weak:null};
function openTraits(isNew){const b=$('bm');b.dataset.m='traits';PAUSE=true;TPICK={job:null,weak:null};drawTraits(isNew);b.style.display='block'}
function drawTraits(isNew){const b=$('bm');const card=(t,on)=>'<div class="tc'+(on?' on':'')+'" data-t="'+t[0]+'"><b>'+t[1]+'</b><span>'+t[2]+'</span></div>';
 b.innerHTML='<div class="sh"><h2>🧬 생존자 특성</h2><div class="wt">'+(isNew?'새 게임':'이 저장에는 특성이 없어요')+' · 직업 1개는 필수, 약점은 선택 (고르면 능력치 +3)</div></div>'+
 '<div class="s3h">직업 (좋은 특성)</div><div class="tg">'+TRAITS.filter(t=>t[3]>0).map(t=>card(t,TPICK.job==t[0])).join('')+'</div>'+
 '<div class="s3h">약점 (선택 · 능력치 포인트 +3)</div><div class="tg">'+TRAITS.filter(t=>t[3]<0).map(t=>card(t,TPICK.weak==t[0])).join('')+'</div>'+
 '<div class="s3b"><button class="ok"'+(TPICK.job?'':' disabled')+' id="tGo">'+(TPICK.job?'이 특성으로 시작':'직업을 골라 주세요')+'</button></div>';
 b.querySelectorAll('[data-t]').forEach(c=>c.onclick=()=>{const t=TRAITS.find(t=>t[0]==c.dataset.t);if(t[3]>0)TPICK.job=t[0];else TPICK.weak=TPICK.weak==t[0]?null:t[0];drawTraits(isNew)});
 $('tGo').onclick=()=>{if(!TPICK.job)return;const pg=PGo();pg.tr=[TPICK.job].concat(TPICK.weak?[TPICK.weak]:[]);if(TPICK.weak)pg.sp+=3;S.p.hp=Math.min(S.p.hp,MHP(S.p));s3dirty();PAUSE=false;$('bm').dataset.m='';closeBase();hud2();
  msg('🧬 '+pg.tr.map(i=>TRAITS.find(t=>t[0]==i)[1]).join(' · ')+(TPICK.weak?' · 능력치 포인트 +3':''))}}
/* ---------- character sheet: stats / skills / traits & perks / gun mods ---------- */
let CTAB='stat',MGUN=null,MSLOT=null;
function openChar(tab){if(tab)CTAB=tab;const b=$('bm'),pg=PGo(),p=S.p;b.dataset.m='char';const need=xpNeed(pg.lv);
 let h='<div class="sh"><h2>🧬 Lv '+pg.lv+'</h2><div class="wt">'+(pg.lv>=MAXLV?'최고 레벨':pg.xp+' / '+need+' XP · 다음 레벨까지 '+(need-pg.xp))+bar2(pg.lv>=MAXLV?100:pg.xp/need*100,'#4aa0e0')+'</div><button onclick="closeBase()">✕</button></div>';
 const pp=s3PerkPend().length;h+='<div class="flt">'+[['stat','💪 능력치'+(pg.sp?' ('+pg.sp+')':'')],['skill','⭐ 스킬'+(pg.kp?' ('+pg.kp+')':'')],['trait','🧬 특성'+(pp?' (!)':'')],['mod','🔧 총기 개조']].map(([k,n])=>'<span class="chip'+(CTAB==k?' on':'')+'" data-c="'+k+'">'+n+'</span>').join('')+'</div>';
 if(CTAB=='stat'){h+='<div class="s3h">능력치 포인트 <b class="pt">'+pg.sp+'</b> · 레벨마다 +1 · 최대 '+STAT_MAX+'</div>'+STATS.map(([k,n,ic,d])=>'<div class="srow"><span class="si">'+ic+'</span><div><b>'+n+' '+s3st(k)+'</b>'+(s3P('전설의 생존자')?' <small>(+3)</small>':'')+'<small>'+d+' · 포인트당</small></div><button data-st="'+k+'"'+(pg.sp>0&&pg.st[k]<STAT_MAX?'':' disabled')+'>＋</button></div>').join('');
  const gw=actW(p),ws=wdef(gw)[4];
  h+='<div class="s3h">지금 내 수치</div><div class="sum">'+[['최대 체력',MHP(p)],['운반량',capacity(p)+' kg'],['이동 속도',Math.round(s3Spd(p)*100)+'%'],['근접 피해','×'+(1+.03*s3b('str')+.1*s3sk('combat0')).toFixed(2)],['총기 피해','×'+(1+.02*s3b('aim')+.08*s3sk('combat1')).toFixed(2)],['재장전 시간',Math.round((ws.rlm||1)*100)+'%'],['치명타',Math.round((ws.cc||0)*100)+'%'],['허기·갈증 감소',Math.round(s3Hun('w')*100)+'%'],['치료 효과','×'+s3Heal().toFixed(2)],['추가 파밍',Math.round((.08*s3sk('surv1')+.015*s3b('sur'))*100)+'%']].map(([a,v])=>'<div><span>'+a+'</span><b>'+v+'</b></div>').join('')+'</div>'}
 if(CTAB=='skill'){h+='<div class="s3h">스킬 포인트 <b class="pt">'+pg.kp+'</b> · 짝수 레벨마다 +1 · 스킬마다 최대 3랭크 · 아래 단계는 위 단계를 1랭크 이상 배워야 열려요</div><div class="skg">'+SKB.map(br=>{const[bn,L]=SKILLS[br];return'<div class="skc"><h4>'+bn+'</h4>'+L.map((s,i)=>{const id=br+i,r=s3sk(id),lock=pg.lv<TIER_LV[i]?'Lv '+TIER_LV[i]+' 필요':i>0&&i<5&&!s3sk(br+(i-1))?'이전 단계 필요':'';
   return'<div class="sk'+(r?' have':'')+(lock?' lock':'')+'" data-k="'+id+'"><div><b>'+s[0]+'</b><span class="rk">'+'●'.repeat(r)+'○'.repeat(3-r)+'</span></div><small>'+s[1]+'</small>'+(lock?'<em>🔒 '+lock+'</em>':r<3&&pg.kp>0?'<em class="go">눌러서 배우기</em>':'')+'</div>'}).join('')+'</div>'}).join('')+'</div>'}
 if(CTAB=='trait'){h+='<div class="s3h">내 특성</div><div class="tg">'+pg.tr.map(i=>{const t=TRAITS.find(t=>t[0]==i);return'<div class="tc on'+(t[3]<0?' neg':'')+'"><b>'+t[1]+'</b><span>'+t[2]+'</span></div>'}).join('')+'</div>';
  h+='<div class="s3h">레벨 보너스 · 10레벨마다 셋 중 하나</div>'+PERK_LV.map(L=>{const ch=pg.pk[L],can=pg.lv>=L&&!ch;return'<div class="pk'+(can?' can':'')+'"><b>Lv '+L+'</b><div class="po">'+PERKS[L].map(([n,d])=>'<div class="pc'+(ch==n?' on':'')+(ch&&ch!=n?' off':'')+(can?' pick':'')+'" data-p="'+L+'|'+n+'"><b>'+n+'</b><small>'+d+'</small></div>').join('')+'</div>'+(pg.lv<L?'<em>🔒 Lv '+L+'에 열림</em>':can?'<em class="go">하나를 고르세요</em>':'')+'</div>'}).join('')}
 if(CTAB=='mod')h+=modView();
 if(window.S3_SAMPLE)h+='<div class="s3t"><b>🧪 샘플 체험용</b><button data-x="xp">+1000 XP</button><button data-x="parts">파츠 한 세트</button><button data-x="guns">총 + 탄약</button></div>';
 b.innerHTML=h;b.style.display='block';
 b.querySelectorAll('[data-c]').forEach(c=>c.onclick=()=>openChar(c.dataset.c));
 b.querySelectorAll('[data-st]').forEach(c=>c.onclick=()=>{const k=c.dataset.st;if(pg.sp>0&&pg.st[k]<STAT_MAX){pg.sp--;pg.st[k]++;s3dirty();if(k=='vit')p.hp=Math.min(MHP(p),p.hp+4);hud2();openChar()}});
 b.querySelectorAll('[data-k]').forEach(c=>c.onclick=()=>{const id=c.dataset.k,br=id.replace(/\d/,''),i=+id.slice(-1),r=s3sk(id);if(c.classList.contains('lock'))return msg('🔒 '+c.querySelector('em').textContent.replace('🔒 ',''));
  if(r>=3)return msg('이미 최고 랭크');if(pg.kp<=0)return msg('스킬 포인트가 없어요 (짝수 레벨마다 +1)');pg.kp--;pg.sk[id]=r+1;s3dirty();if(id=='surv3')p.hp=Math.min(MHP(p),p.hp+10);msg('⭐ '+SKILLS[br][1][i][0]+' '+(r+1)+'랭크');hud2();openChar()});
 b.querySelectorAll('[data-p]').forEach(c=>c.onclick=()=>{const[L,n]=c.dataset.p.split('|');if(pg.lv<+L||pg.pk[L])return;pg.pk[L]=n;s3dirty();p.hp=Math.min(p.hp,MHP(p));msg('🧬 레벨 보너스: '+n);hud2();openChar()});
 b.querySelectorAll('[data-x]').forEach(c=>c.onclick=()=>{const a=c.dataset.x;if(a=='xp')s3Xp(1000,'체험');if(a=='parts'){for(const r of['c','u','r','e','l']){const L=PARTS.filter(q=>q[3]==r);for(let i=0;i<3;i++){const q=L[Math.random()*L.length|0][0];pg.parts[q]=(pg.parts[q]||0)+1;pg.seen[q]=1}}msg('🔩 파츠 15개 지급 (체험용)')}
  if(a=='guns'){give({ar:1,a556:120,sniper:1,a308:20,pump:1,a12g:24,pistol:1,a9mm:45,a40mm:6,manual:1})}hud2();openChar()});
 if(CTAB=='mod')bindMod(b)}
/* ---------- gun mods ---------- */
const FXN={dmg:['피해','%'],rng:['사거리','%'],acc:['정확도',''],rec:['반동','%'],rof:['연사','%'],mag:['장탄수','%'],rld:['재장전 시간','%'],nz:['소음',''],mov:['이동 속도','%'],night:['야간 사거리','단계'],gl:['유탄 발사','']};
const LOWB={rec:1,rld:1,nz:1};
const fxTxt=e=>Object.entries(e).filter(([k,v])=>v).map(([k,v])=>{const[n,u]=FXN[k];if(k=='gl')return'<i class="pos">유탄 자동 발사 (40mm 탄 소모)</i>';const good=LOWB[k]?v<0:v>0;return'<i class="'+(good?'pos':'neg')+'">'+n+' '+(v>0?'+':'')+v+u+'</i>'}).join(' ');
function partsFree(pid){const pg=PGo();let used=0;for(const g in pg.mods)for(const s in pg.mods[g])if(pg.mods[g][s]==pid)used++;return(pg.parts[pid]||0)-used}
function modView(){const pg=PGo(),p=S.p,guns=Object.keys(p.inv).filter(id=>p.inv[id]>0&&GCLASS[id]&&W_BY[id]);
 let h='<div class="s3h">'+PART_RULE+'</div>';if(!guns.length)return h+'<div class="empty">가진 총이 없어요. 아래 체험 버튼으로 받아 볼 수 있어요.</div>'+partList();
 if(!guns.includes(MGUN))MGUN=guns.includes(actW(p))?actW(p):guns[0];const id=MGUN,cl=GCLASS[id],mods=pg.mods[id]||{};
 h+='<div class="flt">'+guns.map(g=>'<span class="chip'+(g==id?' on':'')+'" data-g="'+g+'">'+NM2(g)+'</span>').join('')+'</div>';
 h+='<div class="mv"><canvas id="bpc"></canvas><div class="mst">'+modStats(id)+'</div></div>';
 const cap=s3Rar();h+='<div class="s3h">파츠 슬롯 · 장착 가능 등급: '+RAR[cap][0]+' 이하'+(cap!='l'?' (기술 › 총기 개조 스킬로 상승)':'')+'</div><div class="slg">'+CSLOT[cl].map(sl=>{const pid=mods[sl],pt=pid&&P_BY[pid],n=PSLOTS.find(x=>x[0]==sl)[1];
  return'<div class="sl'+(MSLOT==sl?' on':'')+'" data-sl="'+sl+'"><small>'+n+'</small>'+(pt?'<b style="color:'+RAR[pt[3]][1]+'">'+pt[1]+'</b>':'<b class="em">비어 있음</b>')+'</div>'}).join('')+'</div>';
 if(MSLOT&&CSLOT[cl].includes(MSLOT)){const cur=mods[MSLOT],L=PARTS.filter(q=>q[2]==MSLOT&&q[4].includes(cl)&&((pg.parts[q[0]]||0)>0));
  h+='<div class="s3h">'+PSLOTS.find(x=>x[0]==MSLOT)[1]+'에 끼울 파츠</div><div class="pl">'+(cur?'<div class="pi cur"><b>'+P_BY[cur][1]+' 장착 중</b>'+fxTxt(P_BY[cur][5])+'<button data-un="1">빼기</button></div>':'')+
   (L.filter(q=>q[0]!=cur).map(q=>{const ok=RORD.indexOf(q[3])<=RORD.indexOf(cap),fr=partsFree(q[0]);return'<div class="pi"><b style="color:'+RAR[q[3]][1]+'">'+q[1]+'</b><small>'+RAR[q[3]][0]+' · 남은 '+fr+'개</small>'+fxTxt(q[5])+(ok?fr>0?'<button data-pu="'+q[0]+'">장착</button>':'<em>다른 총에 장착 중</em>':'<em>🔒 총기 개조 스킬 필요</em>')+'</div>'}).join('')||(!cur?'<div class="empty">이 슬롯에 맞는 파츠가 없어요. 총기 거치대 · 사물함 · 탄약 상자 · 경찰차 · 군용 트럭을 수색해 보세요.</div>':''))+'</div>'}
 return h+partList()}
function partList(){const pg=PGo(),ids=Object.keys(pg.parts).filter(k=>pg.parts[k]>0).sort((a,b)=>RORD.indexOf(P_BY[b][3])-RORD.indexOf(P_BY[a][3]));
 return'<div class="s3h">모은 파츠 '+ids.reduce((a,k)=>a+pg.parts[k],0)+'개 · 무게 없음 · 장착하지 않은 파츠는 분해해서 재료로 바꿀 수 있어요</div>'+
 '<label class="tgl"><input type="checkbox" id="autoDis"'+(pg.autoDis?' checked':'')+'><span></span><b>중복 파츠 자동 분해</b><small>'+(pg.autoDis?'켜짐 · 이미 가진 파츠를 또 찾으면 바로 재료로 바뀌어요':'꺼짐 · 같은 파츠도 모두 모아요')+'</small></label>'+
 '<div class="pg">'+(ids.map(k=>{const q=P_BY[k],fr=partsFree(k);return'<span style="border-color:'+RAR[q[3]][1]+'"><b style="color:'+RAR[q[3]][1]+'">'+q[1]+'</b> ×'+pg.parts[k]+(fr>0?'<button data-dis="'+k+'" title="분해: '+Object.entries(DIS[q[3]]).map(([a,v])=>NM2(a)+' '+v).join(', ')+'">분해</button>':'')+'</span>'}).join('')||'<div class="empty">아직 없음</div>')+'</div>'}
function modStats(id){const b=Object.assign({},W_BY[id][4]),cl=GCLASS[id],base=gunStats(id,{}),now=gunStats(id,PGo().mods[id]||{});const rows=[];
 for(const k of['피해','연사','사거리','정확도','반동','장탄수','재장전','소음','기동성']){const a=base[k][0],v=now[k][0],d=v-a,f=x=>k=='연사'||k=='재장전'?x.toFixed(1):Math.round(x);const good=LOWER_BETTER[k]?d<0:d>0;
  rows.push('<div><span>'+k+'</span><b>'+f(v)+(now[k][1]&&k!='피해'?now[k][1]:'')+(k=='피해'&&now[k][1]?' '+now[k][1]:'')+'</b>'+(Math.abs(d)>.001?'<i class="'+(good?'pos':'neg')+'">'+(d>0?'+':'')+f(d)+'</i>':'')+'</div>')}
 return rows.join('')+'<small class="nt">파츠만 반영한 수치예요. 능력치·스킬·특성 보너스는 실제 전투에서 추가돼요.</small>'}
function bindMod(b){const pg=PGo();const ad=$('autoDis');if(ad)ad.onchange=()=>{pg.autoDis=ad.checked?1:0;msg('🔩 중복 파츠 자동 분해 '+(pg.autoDis?'켜짐':'꺼짐'));openChar()};
 b.querySelectorAll('[data-dis]').forEach(c=>c.onclick=()=>{const k=c.dataset.dis;if(partsFree(k)<=0)return;pg.parts[k]--;const got=s3Dis(k,1);msg('🔩 '+P_BY[k][1]+' 분해 → '+got);openChar()});const c=$('bpc');if(c&&MGUN){const bp=blueprint(MGUN,pg.mods[MGUN]||{});c.width=bp.width*3;c.height=bp.height*3;const x=c.getContext('2d');x.imageSmoothingEnabled=false;x.drawImage(bp,0,0,c.width,c.height)}
 b.querySelectorAll('[data-g]').forEach(c=>c.onclick=()=>{MGUN=c.dataset.g;MSLOT=null;openChar()});
 b.querySelectorAll('[data-sl]').forEach(c=>c.onclick=()=>{MSLOT=MSLOT==c.dataset.sl?null:c.dataset.sl;openChar()});
 b.querySelectorAll('[data-pu]').forEach(c=>c.onclick=()=>{const m=pg.mods[MGUN]=pg.mods[MGUN]||{};m[MSLOT]=c.dataset.pu;s3dirty();s3MagFix(MGUN);msg('🔧 '+P_BY[c.dataset.pu][1]+' 장착');hud2();openChar()});
 b.querySelectorAll('[data-un]').forEach(c=>c.onclick=()=>{const m=pg.mods[MGUN]||{};const q=m[MSLOT];delete m[MSLOT];s3dirty();s3MagFix(MGUN);msg('🔧 '+P_BY[q][1]+' 해제');hud2();openChar()})}
function s3MagFix(id){const p=S.p,s=wdef(id)[4];if(s.mag&&(p.mag[id]|0)>s.mag){const ex=(p.mag[id]|0)-s.mag;p.mag[id]=s.mag;invAdd(p,AMMO_ITEM(s.ammo),ex)}}
{const _use=use2;use2=function(k){if(k!='manual')return _use.apply(this,arguments);const pg=PGo(),n=Object.values(pg.sk).reduce((a,b)=>a+b,0);
  if(!n)return msg('📘 아직 배운 스킬이 없어요 · 교범은 그대로 둡니다');if(!has(S.p,'manual'))return msg('훈련 교범 없음');invTake(S.p,'manual',1);pg.sk={};pg.kp+=n;s3dirty();S.p.hp=Math.min(S.p.hp,MHP(S.p));msg('📘 훈련 교범: 스킬 '+n+'포인트를 돌려받았어요 · 🧬에서 다시 배우세요');hud2()}}
/* ---------- button, key, styles ---------- */
$('bCh').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();if(run&&!(typeof UIE!='undefined'&&UIE.on))($('bm').style.display=='block'&&$('bm').dataset.m=='char'?closeBase():openChar())});
addEventListener('keydown',e=>{if(e.key.toLowerCase()=='k'&&run&&$('bm').dataset.m!='traits')($('bm').style.display=='block'&&$('bm').dataset.m=='char'?closeBase():openChar())});
{const _cb=closeBase;closeBase=function(){if($('bm').dataset.m=='traits'&&$('bm').style.display=='block')return;return _cb()}}
document.head.insertAdjacentHTML('beforeend',`<style>
#st .lvr{grid-column:1/3;display:grid;grid-template-columns:auto 1fr auto;gap:6px;align-items:center;font-size:10.5px}#st .lvr b{color:#9fe0ff;font-size:11px}#st .lvr span{color:var(--mut)}
#st .xpb{height:5px;border-radius:9px;background:#ffffff1a;overflow:hidden}#st .xpb i{display:block;height:100%;background:linear-gradient(90deg,#3a86c8,#9fe0ff)}
.rb.dot{position:relative}.rb.dot::after{content:attr(data-n);position:absolute;right:-3px;top:-3px;min-width:16px;height:16px;border-radius:9px;background:#e0574f;color:#fff;font-size:10px;line-height:16px;text-align:center;font-weight:700}
#bm .s3h{font-size:12px;color:var(--mut);margin:10px 0 5px}#bm .s3h .pt{color:#ffd36a;font-size:14px}
#bm .srow{display:grid;grid-template-columns:30px 1fr 44px;gap:8px;align-items:center;padding:6px 8px;border-radius:10px;background:#ffffff08;margin-bottom:4px}#bm .srow .si{font-size:20px;text-align:center}#bm .srow b{font-size:13px}#bm .srow small{display:block;color:var(--mut);font-size:11px}#bm .srow button{padding:6px 0;font-size:16px;background:#2d5a3a}#bm button:disabled{opacity:.35;background:var(--pn)}
#bm .sum{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:4px}#bm .sum div{display:flex;justify-content:space-between;padding:5px 8px;border-radius:8px;background:#ffffff08;font-size:12px}#bm .sum span{color:var(--mut)}
#bm .skg{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:6px}#bm .skc h4{margin:0 0 4px;font-size:13px}
#bm .sk{padding:6px 8px;border-radius:10px;border:1px solid #ffffff1a;background:#ffffff08;margin-bottom:4px;cursor:pointer}#bm .sk>div{display:flex;justify-content:space-between;gap:4px}#bm .sk b{font-size:12px}#bm .sk small{display:block;font-size:10.5px;color:var(--mut)}#bm .sk .rk{color:#ffd36a;font-size:11px;letter-spacing:1px}#bm .sk.have{border-color:#ffd36a66;background:#ffd36a10}#bm .sk.lock{opacity:.45}#bm em{display:block;font-style:normal;font-size:10.5px;color:var(--mut);margin-top:2px}#bm em.go{color:#7fd08a}
#bm .tg{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:5px}#bm .tc{padding:7px 9px;border-radius:10px;border:1px solid #ffffff1f;background:#ffffff08;cursor:pointer}#bm .tc b{display:block;font-size:12.5px}#bm .tc span{font-size:11px;color:var(--mut)}#bm .tc.on{border-color:#7fd08a;background:#7fd08a1a}#bm .tc.neg.on,#bm .tg .tc.on.neg{border-color:#e0874f;background:#e0874f14}
#bm .s3b{margin-top:12px;text-align:center}#bm .s3b .ok{background:#2d5a3a;border-color:#5fbf6a;max-width:none;width:100%;padding:11px}
#bm .pk{padding:7px;border-radius:10px;background:#ffffff06;margin-bottom:5px}#bm .pk>b{font-size:12px;color:#9fe0ff}#bm .pk.can{outline:1px solid #7fd08a}#bm .po{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;margin-top:4px}#bm .pc{padding:5px 6px;border-radius:8px;border:1px solid #ffffff1a;font-size:11.5px}#bm .pc small{display:block;font-size:10px;color:var(--mut)}#bm .pc.pick{cursor:pointer;border-color:#7fd08a88}#bm .pc.on{border-color:#ffd36a;background:#ffd36a14}#bm .pc.off{opacity:.35}
#bm .mv{display:grid;grid-template-columns:1fr;gap:8px;margin:6px 0}#bpc{width:100%;max-width:378px;margin:0 auto;display:block;image-rendering:pixelated;background:#1b2a36;border-radius:10px;border:1px solid #4a7aa055}
#bm .mst{display:grid;grid-template-columns:repeat(auto-fill,minmax(118px,1fr));gap:3px;font-size:11.5px}#bm .mst div{display:flex;gap:5px;justify-content:space-between;padding:3px 6px;border-radius:6px;background:#ffffff08}#bm .mst span{color:var(--mut)}#bm .mst .nt{grid-column:1/-1;color:var(--mut);font-size:10px}
#bm i.pos,#bm i.neg{font-style:normal;font-size:10.5px;margin-left:4px}#bm i.pos{color:#7fd08a}#bm i.neg{color:#e0786f}
#bm .slg{display:grid;grid-template-columns:repeat(auto-fill,minmax(98px,1fr));gap:4px}#bm .sl{padding:6px 7px;border-radius:9px;border:1px solid #ffffff1f;background:#ffffff08;cursor:pointer}#bm .sl small{display:block;font-size:10px;color:var(--mut)}#bm .sl b{font-size:11.5px}#bm .sl b.em{color:#ffffff55;font-weight:400}#bm .sl.on{border-color:#ffd36a}
#bm .pl{display:grid;gap:4px}#bm .pi{display:grid;grid-template-columns:1fr auto;gap:2px 8px;align-items:center;padding:6px 8px;border-radius:9px;background:#ffffff08}#bm .pi small{color:var(--mut);font-size:10.5px}#bm .pi button,#bm .pi em{grid-row:1/4;grid-column:2;padding:6px 12px;margin:0}#bm .pi.cur{background:#ffd36a12}
#bm .pg{display:flex;flex-wrap:wrap;gap:4px}#bm .pg span{font-size:11px;padding:2px 8px;border-radius:99px;border:1px solid}
#bm .s3t{margin-top:14px;padding:8px;border-radius:10px;border:1px dashed #ffffff33;display:flex;gap:6px;flex-wrap:wrap;align-items:center;font-size:12px}#bm .s3t button{padding:5px 10px;font-size:12px;max-width:none;width:auto}
#bm .empty{color:var(--mut);font-size:12px;padding:6px}
#bm .pg span{display:inline-flex;gap:5px;align-items:center}#bm .pg button{padding:1px 7px;font-size:10.5px;border-radius:8px;max-width:none;width:auto;background:#5a3a2a}
#bm .tgl{display:grid;grid-template-columns:40px 1fr;gap:0 8px;align-items:center;padding:7px 9px;border-radius:10px;background:#ffffff08;margin-bottom:6px;cursor:pointer}#bm .tgl input{position:absolute;opacity:0;pointer-events:none}
#bm .tgl span{grid-row:1/3;width:38px;height:22px;border-radius:12px;background:#ffffff26;position:relative;transition:background .15s}#bm .tgl span::after{content:'';position:absolute;left:3px;top:3px;width:16px;height:16px;border-radius:50%;background:#e8ecef;transition:left .15s}
#bm .tgl input:checked+span{background:#4f9a5a}#bm .tgl input:checked+span::after{left:19px}#bm .tgl b{font-size:12.5px}#bm .tgl small{font-size:10.5px;color:var(--mut)}#bm .tgl input:focus-visible+span{outline:2px solid #ffd36a}
@keyframes s3perk{0%,100%{box-shadow:0 0 0 0 #ffd36a00}50%{box-shadow:0 0 0 5px #ffd36a88}}
.rb.perk{position:relative;animation:s3perk 1.3s ease-in-out infinite;border-color:#ffd36a}.rb.perk::before{content:'보너스!';position:absolute;left:calc(100% + 6px);top:50%;transform:translateY(-50%);background:#ffd36a;color:#111;font-size:10px;font-weight:700;padding:1px 7px;border-radius:9px;white-space:nowrap;pointer-events:none}
body.uileft .rb.perk::before{left:auto;right:calc(100% + 6px)}
@media (prefers-reduced-motion:reduce){.rb.perk{position:relative;animation:none}}
@media (orientation:landscape) and (max-height:420px){#sd{display:grid;grid-template-columns:repeat(2,auto);top:calc(50% + 34px)}#st .lvr{font-size:9.5px}}
</style>`);
