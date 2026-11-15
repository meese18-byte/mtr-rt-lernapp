'use strict';
(()=>{
const R=window.lessonRenderer,play=document.getElementById('lessonPlay'),reset=document.getElementById('lessonReset'),status=document.getElementById('lessonStatus');
if(!R){status.textContent='Die Ansicht konnte nicht geladen werden. Bitte neu laden.';play.disabled=true;return;}
let running=false,raf=0,last=0,t=R.start;
const mode=new URLSearchParams(location.search).get('clip')||'source';
function report(){if(parent!==window)parent.postMessage({type:'lesson-size',height:document.body.scrollHeight},location.origin);}
function stop(message='Pausiert'){running=false;cancelAnimationFrame(raf);play.textContent=t>=R.end?'Noch einmal abspielen':'Animation fortsetzen';status.textContent=message;}
function clearShapes(){document.querySelectorAll('[data-lesson-shape]').forEach(b=>b.setAttribute('aria-pressed','false'));}
function restart(){stop();R.reset?.();t=R.start;R.renderAt(t);clearShapes();play.textContent='Animation starten';status.textContent='Startbereit';report();}
function tick(now){if(!running)return;const dt=Math.max((now-last)/1000,0);last=now;t=Math.min(R.end,t+dt);R.renderAt(t);if(t>=R.end){stop('Abschnitt beendet. Beobachtung im Arbeitsblatt festhalten.');if(mode==='mlc')document.querySelector('[data-lesson-shape="contour"]').setAttribute('aria-pressed','true');report();}else raf=requestAnimationFrame(tick);}
play.onclick=()=>{if(running){stop();return;}if(t>=R.end)restart();running=true;play.textContent='Pause';status.textContent='Animation läuft';last=performance.now();raf=requestAnimationFrame(tick);};
reset.onclick=restart;
if(mode==='mlc'){
 document.getElementById('lessonShapes').hidden=false;
 document.querySelectorAll('[data-lesson-shape]').forEach(b=>b.onclick=()=>{stop();t=R.end;R.chooseShape(b.dataset.lessonShape);clearShapes();b.setAttribute('aria-pressed','true');play.textContent='Anpassung erneut abspielen';status.textContent='Feldvorschau · keine Dosisverteilung';report();});
}
document.addEventListener('visibilitychange',()=>{if(document.hidden&&running)stop();});
window.addEventListener('message',e=>{if(e.source===parent&&e.origin===location.origin&&e.data?.type==='lesson-pause')stop();});
new ResizeObserver(report).observe(document.getElementById('lessonVisual'));window.addEventListener('load',report);
window.lessonPlayer={getState:()=>({...R.state(),running}),renderEnd:()=>{stop();t=R.end;R.renderAt(t);report();}};
restart();
})();
