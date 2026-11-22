/* PROJECT LEGACY — 📚 특성 사전: one place to read every trait, perk, skill, stat, gun trait and reward, with what you have highlighted.
   A tab in the 🧬 sheet. Loaded after gunfeel.js. */
'use strict';
let CXT='me';
const CXS=[['me','🙋 내 캐릭터'],['job','🧬 직업·약점'],['perk','🎁 레벨 보너스'],['skill','⭐ 스킬'],['stat','💪 능력치'],['gun','🔫 총기 특징'],['rew','🏅 보상']];
function cxRow(on,title,desc,extra){return'<div class="cxr'+(on?' on':'')+'"><b>'+title+'</b><span>'+desc+'</span>'+(extra?'<small>'+extra+'</small>':'')+'</div>'}
function codexView(){const pg=PGo(),p=S.p,id=actW(p),bes=S.bes||{},seen=S.gseen||{};
 let h='<div class="flt cxt">'+CXS.map(([k,n])=>'<span class="chip'+(CXT==k?' on':'')+'" data-cx="'+k+'">'+n+'</span>').join('')+'</div>';
 if(CXT=='me'){const tr=pg.tr.map(i=>TRAITS.find(t=>t[0]==i)).filter(Boolean),pk=Object.entries(pg.pk),sk=[];for(const b of SKB)SKILLS[b][1].forEach((s,i)=>{const r=s3sk(b+i);if(r)sk.push([s,r])});
  const gt=GT[id]&&GTR[GT[id]],ms=ZOMBIES.filter(q=>typeof mstOf=='function'&&mstOf(q[0])>0),cd=typeof GSUBS!='undefined'?GSUBS.filter(sb=>subDone(sb)):[];
  h+='<div class="s3h">지금 적용 중인 효과만 모았어요</div>';
  h+='<div class="cxg"><h4>직업·약점</h4>'+(tr.length?tr.map(t=>cxRow(1,t[1],t[2])).join(''):'<p class="mut">없음</p>')+'</div>';
  h+='<div class="cxg"><h4>레벨 보너스</h4>'+(pk.length?pk.map(([L,n])=>cxRow(1,n,(PERKS[L].find(x=>x[0]==n)||[])[1]||'','Lv '+L)).join(''):'<p class="mut">아직 없음 · Lv 10부터 고를 수 있어요</p>')+'</div>';
  h+='<div class="cxg"><h4>배운 스킬</h4>'+(sk.length?sk.map(([s,r])=>cxRow(1,s[0]+' '+'●'.repeat(r)+'○'.repeat(3-r),s[1])).join(''):'<p class="mut">아직 없음</p>')+'</div>';
  h+='<div class="cxg"><h4>들고 있는 총의 특징</h4>'+(gt?cxRow(1,'✦ '+gt[0],gt[1],W_BY[id][1]):'<p class="mut">총을 들고 있지 않아요</p>')+'</div>';
  h+='<div class="cxg"><h4>도감 숙련 · 총기 수집</h4>'+((ms.length||cd.length)?ms.map(q=>cxRow(1,'🏅 '+q[1],'주는 피해 +'+Math.round(mstOf(q[0])*100)+'%','처치 '+(bes[q[0]].k))).join('')+cd.map(sb=>cxRow(1,'🗂 '+sb+' 수집 완료','재장전 -15%')).join(''):'<p class="mut">아직 없음</p>')+'</div>'}
 if(CXT=='job'){h+='<div class="s3h">새 게임을 시작할 때 직업 1개(필수)와 약점 1개(선택 · 고르면 능력치 +3)를 골라요</div>'+
  '<div class="cxg"><h4>직업</h4>'+TRAITS.filter(t=>t[3]>0).map(t=>cxRow(pg.tr.includes(t[0]),t[1],t[2],pg.tr.includes(t[0])?'내 직업':'')).join('')+'</div>'+
  '<div class="cxg"><h4>약점</h4>'+TRAITS.filter(t=>t[3]<0).map(t=>cxRow(pg.tr.includes(t[0]),t[1],t[2],pg.tr.includes(t[0])?'내 약점':'')).join('')+'</div>'}
 if(CXT=='perk')h+='<div class="s3h">10레벨마다 셋 중 하나를 골라요 · 고르면 바꿀 수 없어요</div>'+PERK_LV.map(L=>'<div class="cxg"><h4>Lv '+L+(pg.lv<L?' · 🔒':'')+'</h4>'+PERKS[L].map(([n,d])=>cxRow(pg.pk[L]==n,n,d,pg.pk[L]==n?'선택함':'')).join('')+'</div>').join('');
 if(CXT=='skill')h+='<div class="s3h">짝수 레벨마다 스킬 포인트 1 · 스킬마다 최대 3랭크 · 아래 단계는 위 단계를 1랭크 이상 배워야 열려요 (손재주는 예외)</div>'+SKB.map(b=>'<div class="cxg"><h4>'+SKILLS[b][0]+'</h4>'+SKILLS[b][1].map((s,i)=>{const r=s3sk(b+i);return cxRow(r>0,s[0]+' '+'●'.repeat(r)+'○'.repeat(3-r),s[1],'Lv '+TIER_LV[i]+'부터')}).join('')+'</div>').join('');
 if(CXT=='stat')h+='<div class="s3h">레벨마다 능력치 포인트 1 · 기본 '+STAT_BASE+' · 최대 '+STAT_MAX+' · 5를 넘는 포인트마다 효과</div><div class="cxg">'+STATS.map(([k,n,ic,d])=>cxRow(s3b(k)>0,ic+' '+n+' '+s3st(k),d+' (포인트당)')).join('')+'</div>';
 if(CXT=='gun'){h+='<div class="s3h">총마다 특징이 하나씩 있어요 · 밝게 표시된 총은 손에 넣어 본 총이에요</div>';const by={};for(const g of GUN_IDS)(by[GT[g]]=by[GT[g]]||[]).push(g);
  h+=Object.keys(GTR).filter(k=>by[k]).map(k=>'<div class="cxg'+(GT[id]==k?' cur':'')+'"><h4>✦ '+GTR[k][0]+(GT[id]==k?' · 지금 들고 있음':'')+'</h4><p>'+GTR[k][1]+'</p><div class="cxgun">'+by[k].map(g=>'<span class="'+(seen[g]?'have':'')+'">'+W_BY[g][1]+'</span>').join('')+'</div></div>').join('')}
 if(CXT=='rew'){h+='<div class="cxg"><h4>🏅 도감 숙련</h4><p>같은 좀비를 10마리 잡으면 그 좀비에게 주는 피해 +5%, 50마리면 +10%</p>'+ZOMBIES.map(q=>{const k=(bes[q[0]]||{}).k||0,m=typeof mstOf=='function'?mstOf(q[0]):0;return cxRow(m>0,(bes[q[0]]&&bes[q[0]].s?q[1]:'???'),m?'피해 +'+Math.round(m*100)+'%':'—','처치 '+k)}).join('')+'</div>';
  h+='<div class="cxg"><h4>🗂 총기 수집</h4><p>한 분류의 총을 전부 한 번씩 손에 넣으면 그 분류 재장전 -15%</p>'+(typeof GSUBS!='undefined'?GSUBS:[]).map(sb=>{const L=GUN_IDS.filter(i=>G4[i][2]==sb),n=L.filter(i=>seen[i]).length;return cxRow(n==L.length,sb,n==L.length?'재장전 -15%':'—',n+' / '+L.length)}).join('')+'</div>'}
 return h}
function bindCodex(b){b.querySelectorAll('[data-cx]').forEach(c=>c.onclick=()=>{CXT=c.dataset.cx;openChar('codex')})}
{const _oc=openChar;openChar=function(tab){if(tab)CTAB=tab;if(CTAB!='codex'){_oc(tab);const f=$('bm').querySelector('.flt');if(f&&!f.querySelector('[data-c="codex"]')){f.insertAdjacentHTML('beforeend','<span class="chip" data-c="codex">📚 사전</span>');f.lastChild.onclick=()=>openChar('codex')}return}
  _oc('stat');const b=$('bm'),f=b.querySelector('.flt');f.querySelectorAll('.chip').forEach(c=>c.classList.remove('on'));if(!f.querySelector('[data-c="codex"]'))f.insertAdjacentHTML('beforeend','<span class="chip on" data-c="codex">📚 사전</span>');
  let n=f.nextSibling;while(n&&!(n.classList&&n.classList.contains('s3t'))){const x=n.nextSibling;n.remove();n=x}f.insertAdjacentHTML('afterend',codexView());bindCodex(b);CTAB='codex'}}
document.head.insertAdjacentHTML('beforeend',`<style>
#bm .cxt{margin-top:6px}#bm .cxg{padding:7px 8px;border-radius:10px;background:#ffffff06;margin-bottom:6px}#bm .cxg h4{margin:0 0 4px;font-size:13px}#bm .cxg p{margin:2px 0 4px;font-size:11.5px;color:var(--mut)}#bm .cxg.cur{outline:1px solid #9fe0ff}
#bm .cxr{display:grid;grid-template-columns:max-content 1fr;text-align:left;gap:0 8px;align-items:baseline;padding:4px 6px;border-radius:7px;font-size:12px}#bm .cxr b{white-space:nowrap}#bm .cxr span{color:var(--mut);font-size:11.5px}#bm .cxr small{grid-column:1/3;font-size:10px;color:#9aa3aa}
#bm .cxr.on{background:#7fd08a14}#bm .cxr.on b{color:#9fe0a0}#bm .cxgun{display:flex;flex-wrap:wrap;gap:3px}#bm .cxgun span{font-size:10.5px;padding:1px 7px;border-radius:99px;border:1px solid #ffffff1a;color:#ffffff55}#bm .cxgun span.have{color:var(--fg);border-color:#9fe0ff66}
@media (max-width:420px){#bm .cxr{grid-template-columns:1fr}}
</style>`);
