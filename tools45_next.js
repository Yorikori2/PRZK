/* PROJECT LEGACY — sample: demolition tools Lv4 · Lv5, so every danger star has its tool.
   ★4 (경찰서 · 교도소 · 약탈자 기지) need Lv4 · ★5 (군부대 · 연구소) need Lv5. Found in those buildings.
   Loaded after zone_next.js (which capped the level at 3). */
'use strict';
{const addW=(id,nm,rar,st,ds,draw)=>{if(W_BY[id])return;const w=[id,nm,'m',rar,st,ds,'철거 도구'];WEAPONS.push(w);W_BY[id]=w;IC[id]=draw};
 addW('dt4','플라즈마 절단기','e',{d:36,cd:.55,r:50,dur:1800,nz:3,wt:7},'해체 Lv4 · 사거리 넓음 · 한 번에 세 곳 · 경찰서 · 교도소 · 약탈자 기지 (★4)까지',()=>{R('#2a2e33',4,8,14,8);R('#3a6ea8',4,8,14,2);R('#7fd0ff',18,10,4,3);R('#e8f8ff',21,11,2,1);R('#1d1714',8,16,4,6);R('#5a6068',2,10,2,4)});
 addW('dt5','중장비 파쇄기','l',{d:44,cd:.6,r:54,dur:2600,nz:4,wt:9},'해체 Lv5 · 가장 넓고 빠름 · 한 번에 네 곳 · 군부대 · 연구소 (★5)까지 · 모든 건물',()=>{R('#d9a52a',3,6,16,10);R('#f0c040',3,6,16,2);R('#2a2e33',5,16,12,4);R('#8a9096',19,8,3,6);R('#1d1714',19,8,1,6);R('#1d1714',22,9,1,4);R('#1d1714',7,3,8,3)})}
Object.assign(DT,{dt4:{lv:4,mode:'all',rng:150,auto:.24,dmg:4,n:3,ft:9},dt5:{lv:5,mode:'all',rng:185,auto:.18,dmg:6,n:4,ft:12}});
DNZ[4]=3;DNZ[5]=4;
/* demolition level = danger stars, all the way to 5 */
for(const k in TIER)if(DLV[k]!=null)DLV[k]=TIER[k]||1;DLV.rbase=4;
/* where they turn up */
for(const[k,id]of[['police','dt4'],['prison','dt4'],['rbase','dt4'],['mil','dt5'],['lab','dt5']])if(GLOOT[k]&&!GLOOT[k].includes(id))GLOOT[k].push(id);
/* demolition mode picks the best tool you have, Lv5 first */
{const _dm=demoMode;demoMode=function(on){const p=S&&S.p,best=p&&['dt5','dt4'].find(id=>has(p,id)),want=on==null?!DEMO:on;
  if(want&&best&&!['dt3','dt2','dt1','dt1f'].some(id=>has(p,id))){DEMOPREV={mel:p.eq.mel,as:p.as};p.eq.mel=best;p.as='mel';DEMO=true;document.body.classList.add('demoOn');msg('🔨 철거 모드 · '+NM2(best));try{hud2()}catch(e){}return}
  const r=_dm.apply(this,arguments);if(DEMO&&S&&S.p){const best=['dt5','dt4'].find(id=>has(S.p,id));if(best){S.p.eq.mel=best;S.p.as='mel';try{hud2()}catch(e){}}}return r}}
