/* PROJECT LEGACY — robustness fixes found while play-testing. Loaded last. */
'use strict';
/* leaving the underground when you are not underground did nothing useful and threw (SURF is empty) */
{const _de=dunExit;dunExit=function(){if(typeof DUN=='undefined'||!DUN||!SURF){if(typeof DUN!='undefined')DUN=null;return}return _de.apply(this,arguments)}}
/* dying underground respawned you at the base coordinates while the mine map stayed loaded (no base, wrong world):
   climb out first, then the normal death / respawn happens on the surface */
{const _d=die;die=function(){if(typeof DUN!='undefined'&&DUN&&SURF){try{dunExit()}catch(e){}}return _d.apply(this,arguments)}}
/* holding a demolition tool means demolition mode (e.g. after loading a save made in demolition mode) */
{const _gu=gearUpd;gearUpd=function(dt){_gu(dt);if(typeof DEMO=='undefined'||!S||!S.p||!run)return;if(!DEMO&&DT[actW(S.p)]){DEMO=true;document.body.classList.add('demoOn');if(typeof WCK!='undefined')WCK=''}}}

/* floor-level things (hatch, hole to the next floor, fuel island) are drawn with the floor, never on top of the player */
Object.assign(FLAT,{hatch:1,mhole:1,island:1});
/* closing the explore map (✕) hid it but left the game paused: you could not move afterwards */
{const _cb=closeBase;closeBase=function(){const m=$('bm').dataset.m;const r=_cb.apply(this,arguments);if(m=='xmap'&&$('bm').style.display=='none'){PAUSE=false;$('bm').dataset.m=''}return r}}
