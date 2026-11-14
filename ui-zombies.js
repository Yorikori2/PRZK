/* UI sample: zombie bestiary tab */
'use strict';
(function(){const st=document.createElement('style');st.textContent=`
.zg{display:none}.zg.on{display:block}.zgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px;margin-top:10px}
.zc{background:#151b20;border:1px solid var(--line);border-radius:14px;padding:12px;display:grid;grid-template-columns:96px 1fr;gap:6px 12px}
.zc .sp{width:96px;height:96px;border-radius:12px;background:radial-gradient(circle at 50% 60%,#2a3238,#0f1418 75%);display:grid;place-items:end center;overflow:hidden;grid-row:1/3}.zc .sp canvas{image-rendering:pixelated}
.zc h4{margin:0;font-size:15px;display:flex;gap:6px;align-items:center;flex-wrap:wrap}.zc .thr{color:#e05a50;font-size:12px;letter-spacing:1px}
.zc .zs{display:grid;grid-template-columns:44px 1fr 40px;gap:4px 8px;font-size:12px;color:var(--mut);align-items:center}.zc .zs .bar{height:6px;margin:0}
.zc .ab2,.zc .wk,.zc .wh{grid-column:1/3;font-size:12.5px;line-height:1.45}.zc .ab2 b{color:#ffcf6a}.zc .wk b{color:#8ad06a}.zc .wh{color:#9ab8d0;font-size:12px}
.common{background:#151b20;border:1px solid var(--line);border-radius:14px;padding:12px;margin-top:10px}.crow{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.crow div{width:64px;text-align:center;font-size:11px;color:var(--mut)}.crow canvas{display:block;margin:0 auto;image-rendering:pixelated;width:48px;height:48px;background:#0f1418;border-radius:8px}
.zsum{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}.zsum span{font-size:12px;padding:4px 10px;border-radius:99px;border:1px solid}`;document.head.appendChild(st)})();
let zfr=0,zcv=[];
function renderZom(){const el=document.getElementById('pgZom');zcv=[];
 const cnt=k=>ZOMBIES.filter(z=>z[2]==k).length;
 let h='<div class="zsum">'+[['n','일반 '+COMMON.length+'종'],['s','특수 '+cnt('s')+'종'],['e','엘리트 '+cnt('e')+'종'],['b','보스 '+cnt('b')+'종']].map(([k,t])=>'<span style="color:'+ZCAT[k][1]+';border-color:'+ZCAT[k][1]+'">'+t+'</span>').join('')+'<span style="color:#9aa3aa;border-color:#5a6068">★ = 위험도 · 새로 추가: 크롤러 · 스피터 · 부머 · 스토커 · 감염견 · 불타는 좀비 · 감전 좀비 · 잠복자 · 브루트 · 번식체</span></div>';
 h+='<div class="common"><b>일반 감염자 '+COMMON.length+'종</b> <span class="mut">· 체력 40~90 · 건물에 맞는 옷차림 (진료소=환자·의사·간호사, 경찰서=경찰, 군부대=군인 …)</span><div class="crow" id="crow"></div></div><div class="zgrid">';
 ZOMBIES.forEach(([id,n,cat,s,ab,wk,wh,S],i)=>{h+='<div class="zc"><div class="sp" data-z="'+i+'"></div><div><h4>'+n+' <span class="badge" style="color:'+ZCAT[cat][1]+';border-color:'+ZCAT[cat][1]+'">'+ZCAT[cat][0]+'</span><span class="thr">'+'★'.repeat(s.th)+'</span></h4><div class="mut">경험치 '+s.xp+'</div></div><div class="zs"><span>체력</span><div class="bar"><i style="width:'+Math.min(100,s.hp/1500*100+3)+'%;background:#e0574f"></i></div><span>'+s.hp+'</span><span>속도</span><div class="bar"><i style="width:'+(s.spd/140*100)+'%;background:#e0a030"></i></div><span>'+s.spd+'</span><span>공격력</span><div class="bar"><i style="width:'+(s.dmg/40*100)+'%;background:#b06ae0"></i></div><span>'+s.dmg+'</span></div><div class="ab2"><b>능력</b> '+ab+'</div><div class="wk"><b>대처법</b> '+wk+'</div><div class="wh">📍 '+wh+'</div></div>'});
 el.innerHTML=h+'</div>';
 const crow=document.getElementById('crow');COMMON.forEach(([lk,n])=>{const d=document.createElement('div'),c=zCanvas(null,1,48,lk);d.appendChild(c);d.insertAdjacentHTML('beforeend',n);crow.appendChild(d)});
 el.querySelectorAll('[data-z]').forEach(b=>{const z=ZOMBIES[+b.dataset.z],S=z[7];const fr=[0,1,2,3].map(f=>zCanvas(z[0],f,S));const c=document.createElement('canvas');c.width=S;c.height=S;const sc=Math.min(96/S*(S>60?1:1.6),2);c.style.width=c.style.height=(S*sc)+'px';b.appendChild(c);zcv.push([c,fr])})}
setInterval(()=>{zfr=(zfr+1)%4;for(const[c,fr]of zcv){const x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);x.drawImage(fr[zfr],0,0)}},260);
