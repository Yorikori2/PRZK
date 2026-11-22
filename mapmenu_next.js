/* PROJECT LEGACY — sample: map picker on the title screen (preview + size + re-roll) and save ↔ map bookkeeping.
   The world is built once per page load, so picking a map stores it and reloads; saves remember their map. */
'use strict';
const MAPSZ=[['classic','지금 지도',5,3],['n','🎲 보통 5×3',5,3],['w','🎲 넓게 7×4',7,4],['x','🎲 아주 넓게 8×5',8,5]];
const KCOL={base:'#5fbf6a',mil:'#6b7650',lab:'#e8ecef',police:'#2f4a7a',clinic:'#d8dde2',fire:'#a83a3a',school:'#a86a3a',ware:'#7a8088',hard:'#8a6a4a',church:'#6a4a3a',mart:'#c9a04a',apt:'#5a6a7a',houses:'#8a4a3a',park:'#3f7a3a'};
const KIC={base:'🏕',mil:'🪖',lab:'🧪',police:'👮',clinic:'🏥',fire:'🚒',school:'🏫',ware:'📦',hard:'🔨',church:'⛪',mart:'🏪',apt:'🏢',houses:'🏠',park:'🌳'};
function mapDesc(){const c=MAPCFG,b=W0.b.length,sec=Math.round(WW/110);return(c&&c.seed!=null?'🎲 랜덤 #'+c.seed:'지금 지도 (고정)')+' · '+NBX+'×'+NBY+' 블록 · 건물 구역 '+b+'곳 · 걸어서 가로 약 '+sec+'초'}
function mapPreview(w){const c=document.createElement('canvas'),k=w/WW;c.width=w;c.height=Math.round(WH*k);const x=c.getContext('2d');x.fillStyle='#55585e';x.fillRect(0,0,c.width,c.height);
 x.font=Math.max(10,Math.round(BW*k*.36))+'px sans-serif';x.textAlign='center';x.textBaseline='middle';
 for(const b of W0.b){const bw=b.kind=='mil'?2*BW+RD:BW;x.fillStyle=KCOL[b.kind]||'#3b5a30';x.fillRect(b.ox*k,b.oy*k,bw*k,BH*k);x.fillText(KIC[b.kind]||'',(b.ox+bw/2)*k,(b.oy+BH/2)*k)}
 const B=W0.b.find(b=>b.kind=='base');if(B){x.strokeStyle='#ffd36a';x.lineWidth=2;x.strokeRect(B.ox*k+1,B.oy*k+1,BW*k-2,BH*k-2)}return c}
function pickMap(id){const s=MAPSZ.find(m=>m[0]==id);const cfg=id=='classic'?{nbx:5,nby:3,seed:null}:{nbx:s[2],nby:s[3],seed:1+(Math.random()*99999|0)};
 try{localStorage.setItem('pl_mapnext',JSON.stringify(cfg))}catch(e){}location.reload()}
function mapMenu(){const m=$('menu');if(!m||$('mapsel'))return;const cur=MAPCFG&&MAPCFG.seed!=null?(MAPSZ.find(s=>s[0]!='classic'&&s[2]==NBX&&s[3]==NBY)||[])[0]:'classic';
 m.querySelector('small').insertAdjacentHTML('afterend','<div id="mapsel"><div class="mh">🗺 '+mapDesc()+'</div><div class="mp"></div><div class="mb">'+MAPSZ.map(([id,n])=>'<button data-mp="'+id+'" class="'+(id==cur?'on':'')+'">'+n+'</button>').join('')+
  (cur&&cur!='classic'?'<button data-mp="'+cur+'" class="re">🔄 다시 굴리기</button>':'')+'</div><div class="ml">'+Object.entries(W0.b.reduce((a,b)=>(a[b.kind]=(a[b.kind]||0)+1,a),{})).map(([k,n])=>'<span>'+(KIC[k]||'')+' '+(W0.b.find(b=>b.kind==k).name.split(' ')[0])+(n>1?' ×'+n:'')+'</span>').join('')+'</div></div>');
 $('mapsel').querySelector('.mp').appendChild(mapPreview(Math.min(340,innerWidth-48)));
 $('mapsel').querySelectorAll('[data-mp]').forEach(b=>b.onclick=()=>pickMap(b.dataset.mp))}
/* new game remembers the map; continuing a save built on another map reloads with that map first */
{const _st=start;start=function(d,load){if(load){try{const s=JSON.parse(localStorage.getItem(SAVE)||'null'),sm=JSON.stringify(s&&s.map||{nbx:5,nby:3,seed:null}),cm=JSON.stringify(MAPCFG||{nbx:5,nby:3,seed:null});
   if(s&&sm!=cm){localStorage.removeItem('pl_mapnext');localStorage.setItem('pl_autocont','1');location.reload();return}}catch(e){}}
  const r=_st(d,load);if(S&&!load){S.map=MAPCFG||{nbx:5,nby:3,seed:null};try{localStorage.removeItem('pl_mapnext')}catch(e){}}return r}}
document.head.insertAdjacentHTML('beforeend',`<style>#mapsel{margin:10px auto;max-width:380px;padding:8px;border-radius:12px;background:#ffffff0c;border:1px solid #ffffff22;text-align:center}
#mapsel .mh{font-size:12px;margin-bottom:6px;color:#ffd36a}#mapsel .mp canvas{border-radius:6px;display:block;margin:0 auto}#mapsel .mb{display:flex;flex-wrap:wrap;gap:4px;justify-content:center;margin-top:6px}
#mapsel .mb button{width:auto;max-width:none;padding:5px 9px;font-size:12px}#mapsel .mb button.on{border-color:#ffd36a;background:#4a3c14}#mapsel .mb button.re{border-color:#7fd08a}
#mapsel .ml{display:flex;flex-wrap:wrap;gap:3px;justify-content:center;margin-top:6px}#mapsel .ml span{font-size:10.5px;padding:1px 6px;border-radius:99px;background:#ffffff10}</style>`);
addEventListener('load',()=>setTimeout(()=>{mapMenu();try{if(localStorage.getItem('pl_autocont')){localStorage.removeItem('pl_autocont');start(0,true)}}catch(e){}},30));
