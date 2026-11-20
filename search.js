/* PROJECT LEGACY — timed searching and wall checks.
   - Searching takes 1–4 s: the better the best thing inside (item or gun part), the longer it takes.
     Moving, getting hit, attacking or driving stops it; the loot stays put and the search resumes where it stopped.
   - Containers can only be searched when nothing solid is between you and them (no looting through walls).
   - Opening epic / legendary loot makes noise that draws nearby zombies; the 손재주 skill cuts search time 10 % per rank.
   - Player attacks and zombie bites need a clear line too (no hitting through walls); walls are 6 px thick,
     so the line is checked every 3 px instead of every 8 px. */
'use strict';
function wallAt(x,y){const gx=x/GC|0,gy=y/GC|0;if(gx<0||gy<0||gx>=GX||gy>=GY)return true;
 for(const s of GRID[gy*GX+gx])if(s.wall&&x>=s.x&&x<=s.x+s.w&&y>=s.y&&y<=s.y+s.h)return true;
 for(const s of BSOL)if(s.wall&&s.alive!==false&&x>=s.x&&x<=s.x+s.w&&y>=s.y&&y<=s.y+s.h)return true;return false}
function clearLine(ax,ay,bx,by){const d=Math.hypot(bx-ax,by-ay),n=Math.max(1,Math.ceil(d/3));for(let i=1;i<n;i++)if(wallAt(ax+(bx-ax)*i/n,ay+(by-ay)*i/n))return false;return true}
function seeZ(a,q){return clearLine(a.x,a.y,q.x,q.y)}
function seeObj(p,o){const nx=Math.max(o.x+2,Math.min(o.x+o.w-2,p.x)),ny=Math.max(o.y+2,Math.min(o.y+o.h-2,p.y));return clearLine(p.x,p.y,nx,ny)}
/* ---------- timed search ---------- */
const SRT={c:1,u:1.6,r:2.4,e:3.2,l:4};
let SRCH=null;
function srchTime(r,pid){let best='c';const up=k=>{if(k&&RORD.indexOf(k)>RORD.indexOf(best))best=k};const ids=Object.keys(r).filter(k=>r[k]>0);for(const k of ids)up(itemRar(k));if(pid)up(P_BY[pid][3]);
 const sk=typeof s3sk=='function'?s3sk('surv5'):0; // 손재주: -10 % per rank
 return{best,T:+(Math.min(4,SRT[best]+.1*Math.max(0,ids.length-2))*(1-.1*sk)).toFixed(2)}}
/* called by ia() once the loot is rolled; returns true when it took over */
function srchBusy(o){if(SRCH){msg(SRCH.id==o.id?'🔍 수색 중…':'이미 다른 곳을 수색 중');return true}const pd=S.pend&&S.pend[o.id];if(!pd)return false;srchGo(o,pd,true);return true}
function srchStart(o,ctx){ctx.pid=s3SearchRoll(o,ctx.kind,ctx.tier,ctx.r);const t=srchTime(ctx.r,ctx.pid);ctx.T=t.T;ctx.best=t.best;ctx.t=0;S.pend=S.pend||{};S.pend[o.id]=ctx;srchGo(o,ctx,false);
 /* prying open something valuable is loud: epic = small noise (160 px), legendary = loud (320 px) */
 const nz={e:1,l:2}[t.best];if(nz){noise(S.p.x,S.p.y,nz);msg(nz>1?'🔊 쾅! 육중한 잠금장치를 여는 소리가 크게 울렸어요':'🔊 덜컹! 무거운 걸 여는 소리가 났어요')}}
function srchGo(o,ctx,resume){const p=S.p;SRCH={id:o.id,o,ctx,x:p.x,y:p.y,hp:p.hp};if(resume)msg('🔍 수색 이어서 ('+Math.round(ctx.t/ctx.T*100)+'%)');actRing()}
function actRing(){const a=$('act');if(!a)return;a.classList.toggle('srch',!!SRCH);if(SRCH)a.style.setProperty('--k',Math.min(100,SRCH.ctx.t/SRCH.ctx.T*100)+'%')}
function srchStop(why){if(!SRCH)return;msg('✋ 수색 중단 · '+why+' (다시 누르면 이어서)');SRCH=null;actRing()}
function srchDone(){const{o,ctx}=SRCH,s=S;SRCH=null;actRing();delete s.pend[o.id];s.lo[o.id]=s.tt;s3SearchDone(ctx.tier,ctx.pid);give(ctx.r);if(ctx.note)msg($('msg').textContent+ctx.note);
 if(ctx.first&&ALR[ctx.kind]&&!s.alarm&&(s.aoff[ctx.kind]||0)<s.day&&Math.random()<ALR[ctx.kind])alarm(o.b)}
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(!SRCH||!S)return;const p=S.p;
  if(Math.hypot(p.x-SRCH.x,p.y-SRCH.y)>4)return srchStop('움직였어요');if(p.hp<SRCH.hp-.5)return srchStop('공격받았어요');if(atk)return srchStop('공격했어요');if(S.dr)return srchStop('차에 탔어요');
  SRCH.hp=p.hp;SRCH.ctx.t+=dt;actRing();if(SRCH.ctx.t>=SRCH.ctx.T)srchDone()}}
{const _dfx=drawGearFx;drawGearFx=function(){_dfx();if(!SRCH)return;const o=SRCH.o,c=SRCH.ctx,k=Math.min(1,c.t/c.T),cx=o.x+o.w/2,y=o.y-20,w=52;
  g.fillStyle='#000c';g.fillRect(cx-w/2-2,y-2,w+4,10);g.fillStyle='#ffffff22';g.fillRect(cx-w/2,y,w,6);g.fillStyle='#ffd36a';g.fillRect(cx-w/2,y,w*k,6);
  const a=performance.now()/180;g.fillStyle='#ffd36a';for(let i=0;i<3;i++){const t=a+i*2.1;g.globalAlpha=.55+.45*Math.sin(t*2);g.fillRect(cx+Math.cos(t)*10-1,y-9+Math.sin(t)*3-1,2,2)}g.globalAlpha=1;
  g.save();g.font='bold 11px system-ui,sans-serif';g.textAlign='center';g.fillStyle='#000a';g.fillText('🔍 수색 중',cx+1,y-5);g.fillStyle='#fff';g.fillText('🔍 수색 중',cx,y-6);g.restore()}}
document.head.insertAdjacentHTML('beforeend','<style>#act.srch{background-image:conic-gradient(#ffd36acc var(--k),#ffffff14 0);box-shadow:0 0 0 2px #ffd36a}</style>');
