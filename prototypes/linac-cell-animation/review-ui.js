/* Course-facing mode: basis / vertiefung, no remote tracking. */
(()=>{'use strict';
const match=location.pathname.match(/phase([1-4])\.html$/);if(!match)return;
if(new URLSearchParams(location.search).get('film')==='1')document.body.classList.add('film-only');
const phase=Number(match[1]),goal={
1:'Du kannst erklären, wo Elektronen entstehen und wie sie im LINAC Energie aufnehmen.',
2:'Du kannst den Weg von Elektronen zum Photonenfeld und die Feldüberwachung beschreiben.',
3:'Du kannst Compton-Streuung, Sekundärelektronen, Energiedosis und Wasserradiolyse einordnen.',
4:'Du kannst DNA-Schäden, Reparatur und mögliche Zellfolgen mit der Bestrahlungsserie verbinden.'};
const basis={
1:['Elektronenquelle, HF-Versorgung und Strahlführung sind unterschiedliche Bestandteile des LINAC. Die Kamerafahrt zeigt ihren Zusammenhang.','Eine erwärmte Kathode stellt Elektronen bereit. Die Spannung zur Anode beschleunigt und bündelt sie für die folgende HF-Struktur.','Das zeitlich passende HF-Feld überträgt Energie auf Elektronenpakete. Die Feldrichtung und die Kraft auf die negativ geladenen Elektronen sind entgegengesetzt.','Bei bereits sehr schnellen Elektronen steigt die kinetische Energie deutlich stärker als die Geschwindigkeit.'],
2:['Magnetfelder lenken die beschleunigten Elektronen zum Target. Dabei ändert sich ihre Richtung, nicht ihre kinetische Energie.','Beim Abbremsen von Elektronen im Wolframtarget entstehen Photonen unterschiedlicher Energien und Wärme.','Ein Ausgleichsfilter formt das Querprofil. Zwei Monitorkanäle überwachen den Output bis zum vorgegebenen MU-Abschaltwert.','Gegenüberliegende MLC-Lamellen formen das Bestrahlungsfeld. Die Feldöffnung wird auf die Isozentrumsebene projiziert.'],
3:['Photonen gelangen ins Gewebe. Manche durchqueren einen Ausschnitt; andere übertragen durch Wechselwirkungen Energie auf Elektronen.','Bei Compton-Streuung entsteht ein Rückstoßelektron. Es trägt Energie weiter und verursacht viele lokale Anregungen und Ionisationen.','Die übertragene Energie kann Wassermoleküle verändern. Das Hydroxylradikal •OH ist besonders reaktiv und kann Biomoleküle schädigen.','Radikale diffundieren in ihrer Umgebung. Ob sie mit Biomolekülen reagieren oder anders abgefangen werden, hängt von zufälligen Kontakten ab.'],
4:['Direkt wirken energiereiche Elektronen an DNA; indirekt können reaktive Wasserprodukte die DNA verändern. Bei Photonen überwiegt oft die indirekte Wirkung.','Basenschaden, Einzelstrangbruch und Doppelstrangbruch sind unterschiedliche DNA-Schäden. Besonders komplexe Doppelstrangbrüche gefährden das Zellüberleben.','Zellen können Schäden erkennen und reparieren. Dabei können die ursprüngliche Struktur und Information erhalten bleiben, verändert werden oder beschädigt bleiben.','Mögliche Folgen sind Weiterteilung, bleibende Veränderung, Teilungsstopp und Zelltod. Nach Bestrahlung ist auch ein späterer Verlust der Teilungsfähigkeit wichtig.']
};
const simplifications={
1:'Die Innengeometrie ist ein schematisches Funktionsmodell, keine verifizierte Abbildung einer bestimmten Gerätebaureihe. Die Wanderwelle zeigt einen möglichen LINAC-Aufbau; andere Geräte verwenden Stehwellenstrukturen.',
2:'Der Strahlkopf zeigt eine ältere Bauart mit zusätzlichen Backup-Blenden. Der Aufbau unterscheidet sich zwischen Herstellern und Gerätegenerationen. Teilchenzahl, Geometrie und Strahlprofile sind illustrative Skizzen.',
3:'Flugzeiten und Abstände sind stark vergrößert. Die gezeigten Reaktionen sind ausgewählte Einzelereignisse, keine Wahrscheinlichkeits-, Dosis- oder Reaktionsratenberechnung.',
4:'Moleküle und Zellverläufe sind stark vereinfacht. Eine dargestellte DNA-Schädigung ist keine Vorhersage des Schicksals einer konkreten Zelle.'};
document.body.dataset.phase=String(phase);
document.body.dataset.level=new URLSearchParams(location.search).get('level')==='vertiefung'?'vertiefung':'basis';
document.body.dataset.theme=new URLSearchParams(location.search).get('theme')==='dark'?'dark':'light';
const target=document.querySelector('.phase-roadmap')||document.querySelector('.intro');
if(!target)return;
const bar=document.createElement('section');bar.className='review-toolbar';bar.setAttribute('aria-label','Unterrichtsmodus');
bar.innerHTML='<div class="goal"><strong>Lernziel · Phase 0'+phase+'</strong><div>'+goal[phase]+'</div></div><div class="toolbar-actions"><button type="button" id="baseMode" aria-pressed="true">Basis · 2. LJ</button><button type="button" id="deepMode" aria-pressed="false">Vertiefung · 3. LJ</button><button type="button" id="themeMode">Darstellung: Hell</button><a class="teacher-link" href="lehrkraft.html#phase'+phase+'">Für Lehrkräfte</a></div>';
target.insertAdjacentElement('afterend',bar);
const model=document.createElement('details');model.className='model-disclaimer';model.innerHTML='<summary>Lehrmodell · nicht maßstäblich · Was ist vereinfacht?</summary><p>'+simplifications[phase]+'</p>';
const next=document.querySelector('.phase-next');if(next)next.insertAdjacentElement('beforebegin',model);
const explanation=document.getElementById('viewText');if(explanation){const p=document.createElement('p');p.id='basisExplain';p.setAttribute('aria-live','polite');explanation.insertAdjacentElement('beforebegin',p);}
function syncScene(){const id=document.getElementById('viewNumber'),dest=document.getElementById('basisExplain');if(!id||!dest)return;const idx=Number(id.textContent.trim())-1;const t=basis[phase]?.[idx];if(t&&dest.textContent!==t)dest.textContent=t;}
const sceneId=document.getElementById('viewNumber');
if(sceneId)new MutationObserver(syncScene).observe(sceneId,{childList:true,characterData:true,subtree:true});
function level(l){document.body.dataset.level=l;document.getElementById('baseMode').setAttribute('aria-pressed',String(l==='basis'));document.getElementById('deepMode').setAttribute('aria-pressed',String(l==='vertiefung'));syncScene();}
document.getElementById('baseMode').onclick=()=>level('basis');document.getElementById('deepMode').onclick=()=>level('vertiefung');
document.getElementById('themeMode').onclick=()=>{document.body.dataset.theme=document.body.dataset.theme==='dark'?'light':'dark';document.getElementById('themeMode').textContent='Darstellung: '+(document.body.dataset.theme==='dark'?'Dunkel':'Hell');};
syncScene();level(document.body.dataset.level);
})();
