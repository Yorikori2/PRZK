/* PROJECT LEGACY — fewer, shorter notices at the top of the screen.
   · Messages of the same kind that arrive close together become one line ("획득: 9mm 탄 30, 붕대 2" → counts add up;
     the same notice again shows "×2", "×3").
   · Every notice is a single line and fades 2 seconds after its last update. */
'use strict';
let MQ=null,MQT=null;
const mKind=t=>{const m=/^(.{1,14}?)[:·]/.exec(t);return m?m[1].trim():t.slice(0,8)};
function mShow(){const el=$('msg');if(!el||!MQ)return;let t;
 if(MQ.items){t=MQ.head+': '+Object.entries(MQ.items).map(([k,v])=>k+' '+v).join(', ')}else t=MQ.text+(MQ.n>1?' ×'+MQ.n:'');
 el.textContent=t;el.style.opacity=1;clearTimeout(MQT);MQT=setTimeout(()=>{el.style.opacity=0;MQ=null},2000)}
msg=function(t){if(t==null)return;t=String(t);const now=performance.now(),k=mKind(t),fresh=MQ&&now-MQ.at<2000;
 const gm=/^(획득|🎁[^:]*|.{0,6}획득):\s*(.+)$/.exec(t);
 if(gm){const items={};for(const part of gm[2].split(/,\s*/)){const m=/^(.*\S)\s+(\d+)$/.exec(part);if(m)items[m[1]]=(items[m[1]]||0)+ +m[2];else items[part]=items[part]||''}
  if(fresh&&MQ.items&&MQ.head==gm[1]){for(const n in items)MQ.items[n]=typeof MQ.items[n]=='number'&&typeof items[n]=='number'?MQ.items[n]+items[n]:items[n]}else MQ={head:gm[1],items,at:now};MQ.at=now;return mShow()}
 if(fresh&&!MQ.items&&MQ.text==t){MQ.n++;MQ.at=now;return mShow()}
 if(fresh&&!MQ.items&&MQ.k==k&&k.length>=2){MQ.text=t;MQ.n=1;MQ.at=now;return mShow()}
 MQ={text:t,k,n:1,at:now};mShow()};
document.head.insertAdjacentHTML('beforeend','<style>#msg{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}</style>');
