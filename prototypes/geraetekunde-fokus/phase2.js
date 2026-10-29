/* Phase 02: own SVG illustrations; no vendor assets, network dependencies or dose solver. */
(()=>{'use strict';
const M=window.LinacHead,$=id=>document.getElementById(id),NS='http://www.w3.org/2000/svg';
const starts=[0,18,36,58],duration=90;
const scenes=[
{nav:'Umlenkung',kind:'STRAHLTRANSPORT',title:'Die Richtung ändern',detail:'Drei Magnetbereiche',text:'Die beschleunigten Elektronen gelangen durch ein evakuiertes Strahlführungsrohr zum Target. Im gezeigten Slalom-Prinzip lenken drei Magnetbereiche den Strahl nacheinander ab. Die Anordnung unterstützt einen kleinen Brennfleck trotz einer gewissen Energiebreite der Elektronen.',take:'Das Magnetfeld lenkt. Die Beschleunigungsenergie stammt aus der vorherigen HF-Strecke.',question:'Steigert ein statisches Magnetfeld die kinetische Energie?',answer:'Die magnetische Lorentzkraft steht senkrecht zur momentanen Bewegungsrichtung. Sie ändert die Richtung, verrichtet am Teilchen aber keine Arbeit. Fokussierung und Energieauswahl sind Funktionen der gesamten Strahloptik; diese Zeichnung berechnet sie nicht.',note:'Slalom-Prinzip nach dem Lehrbuchschema. Die drei Bögen und das Vakuumrohr bleiben räumlich verbunden. Keine maßhaltige Synergy-Konstruktion.',caption:'Elektronen folgen dem evakuierten Strahlführungsrohr. Magnetbereiche sind blau, Spulen kupferfarben.',source:'Schlegel et al., S. 419–420, Abb. 20.36b · IAEA 5.5.10'},
{nav:'Target',kind:'BREMSSTRAHLUNG',title:'Hier entstehen Photonen',detail:'Energie wird übertragen',text:'Am Wolfram-Target werden Elektronen im elektrischen Feld der Atomkerne abgelenkt und abgebremst. Dabei kann Bremsstrahlung entstehen. Die Photonen besitzen unterschiedliche Energien. Ein Teil der Elektronenenergie wird im Material deponiert und muss als Wärme abgeführt werden.',take:'Elektronen treffen auf das Target. Photonen entstehen dort und breiten sich weiter aus.',question:'Wird aus jedem Elektron genau ein gleich energiereiches Photon?',answer:'Nein. Ein Elektron kann Energie über mehrere Wechselwirkungen abgeben. Bremsphotonen bilden ein kontinuierliches Energiespektrum; ihre Energie kann höchstens der verfügbaren kinetischen Elektronenenergie entsprechen. Wärmeverluste und die Auswahl durch den Strahlkopf verhindern eine vollständige Umwandlung in nutzbare Strahlung.',note:'Vergrößertes Wechselwirkungsprinzip. Der Elektronenweg und die Photonenenergie sind illustrativ; die Wellenlinie kennzeichnet ein Photon, keine maßstäbliche Wellenlänge.',caption:'Gelbe Spuren beginnen am Target. Der Primärkollimator begrenzt den maximalen Nutzstrahlenkegel.',source:'Schlegel et al., S. 420–421 · Krieger, Kap. 7.1.2–7.1.4 · IAEA 5.5.11–12'},
{nav:'Filter & Monitor',kind:'FORMEN & ÜBERWACHEN',title:'Profil und Output kontrollieren',detail:'FF und FFF vergleichen',text:'Der Ausgleichsfilter schwächt zentrale Strahlanteile stärker ab. Damit wird das Dosisquerprofil unter definierten Bedingungen flacher. Bei FFF entfällt dieser Filter. Die Monitorkammern erfassen den Geräteoutput; die Steuerung beendet die Abgabe beim vorgegebenen Monitorwert.',take:'Das Monitorsystem misst im Strahlkopf – nicht unmittelbar die Dosis im Tumor.',question:'Bedeuten 100 % in dieser Demo eine bestimmte Patientendosis?',answer:'Nein. Die Prozentanzeige ist ein frei gewähltes Unterrichtsmodell. Klinisch werden Monitorwerte kalibriert; die Dosis im Patienten hängt zusätzlich von Bestrahlungsplan, Geometrie, Gewebe und Strahlparametern ab. Unabhängige Überwachungskanäle und weitere Prüfungen dienen der Sicherheit.',note:'Qualitative Dosisquerprofile: gleiche gedachte Referenztiefe, jeweils auf die Zentralachse normiert. Keine Messkurven und kein Vergleich absoluter Dosisleistungen.',caption:'Filtermodus und Monitorsignal sind getrennte Funktionen. Bei 100 % Demo-Monitorwert endet der gezeigte Strahl.',source:'Schlegel et al., S. 420–421 · IAEA 5.5.15'},
{nav:'MLC & Feld',kind:'FELDÖFFNUNG & PROJEKTION',title:'Die Öffnung bestimmt das Feld',detail:'Blick entlang des Strahls',text:'Gegenüberliegende Wolframlamellen formen eine Öffnung passend zur Projektion des Zielvolumens. Unbenutzte Leafpaare bleiben geschlossen. Backup-Blenden und quer bewegliche Blenden begrenzen zusätzlich. Wähle ein Leafpaar: Sein Öffnungsspalt bestimmt den links gezeigten Schnitt.',take:'Eine zweidimensionale Öffnung formt den direkten Strahl. Die räumliche Dosis entsteht erst mit den Wechselwirkungen und der Bestrahlungsplanung.',question:'Warum beweist eine passende Feldkontur noch keine passende Dosisverteilung?',answer:'Die Öffnung ist nur die geometrische Projektion aus einer Einstrahlrichtung. Dosis hängt außerdem von Energie, Fluenz, Einstrahlrichtungen und Wechselwirkungen im Gewebe ab. Halbschatten, Transmission und Streuung fehlen in dieser geometrischen Vorschau. IMRT-Öffnungen müssen zu einem Zeitpunkt nicht die gesamte Zielprojektion umfassen.',note:'BEV = Blick vom Target entlang des Strahls. Die gestrichelte Kontur zeigt ein erfundenes Zielvolumen in Projektion. Die blaue Zeile wählt den Schnitt links.',caption:'Geometrische Feldprojektion in einer Bezugsebene. Kein Dosisbild; Transmission, Streuung und Halbschatten sind hier nicht berechnet.',source:'Schlegel et al., S. 421 · AAPM TG-50, I.B.a / I.G / Abb. 3'}];
let time=0,playing=false,last=0,frame=0,current=-1,filter='ff',shape='contour',row=10,manualForm=null,raf=0;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fmt=n=>Number(n).toFixed(2),cl=M.clamp;
const path=pts=>'M'+pts.map(p=>fmt(p[0])+','+fmt(p[1])).join('L');
const txt=(x,y,s,c='#a8c1d1',size=14,extra='')=>`<text x="${x}" y="${y}" fill="${c}" font-size="${size}" ${extra}>${s}</text>`;
const line=(x1,y1,x2,y2,c,w=1,extra='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" ${extra}/>`;
const defs=`<defs><linearGradient id="steel" x1="0" x2="1"><stop stop-color="#243e50"/><stop offset=".26" stop-color="#9baeb6"/><stop offset=".5" stop-color="#c8d0cd"/><stop offset=".7" stop-color="#738a97"/><stop offset="1" stop-color="#294251"/></linearGradient><linearGradient id="copper" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#e4ba89"/><stop offset=".25" stop-color="#b77848"/><stop offset=".7" stop-color="#71452e"/><stop offset="1" stop-color="#d7a575"/></linearGradient><linearGradient id="darkMetal"><stop stop-color="#243947"/><stop offset=".45" stop-color="#5c747e"/><stop offset="1" stop-color="#152c3b"/></linearGradient><linearGradient id="leafMetal" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#b1bcc0"/><stop offset=".3" stop-color="#78919c"/><stop offset="1" stop-color="#2d4351"/></linearGradient><radialGradient id="warm"><stop stop-color="#ffcc7e" stop-opacity=".6"/><stop offset="1" stop-color="#faaa65" stop-opacity="0"/></radialGradient></defs>`;
// Three circular bending regions (+45°, -45°, +112.5°), rotated into a vertical exit.
function transport(){let x=0,y=0,a=-Math.PI/8;const pts=[[x,y]],bends=[];const straight=n=>{for(let i=0;i<20;i++){x+=n/20*Math.cos(a);y+=n/20*Math.sin(a);pts.push([x,y]);}};const bend=(r,turn)=>{const seg=[[x,y]],da=turn/35;for(let i=0;i<35;i++){x+=Math.abs(r*da)*Math.cos(a+da/2);y+=Math.abs(r*da)*Math.sin(a+da/2);a+=da;pts.push([x,y]);seg.push([x,y]);}bends.push(seg);};straight(105);bend(52,Math.PI/4);straight(45);bend(48,-Math.PI/4);straight(38);bend(65,Math.PI*5/8);straight(64);const tr=p=>[390+(p[0]-x)*.8,235+(p[1]-y)*.8];return{pts:pts.map(tr),bends:bends.map(b=>b.map(tr))};}
const track=transport();
function onTrack(p){const z=cl(p)*(track.pts.length-1),i=Math.min(track.pts.length-2,Math.floor(z)),q=z-i;return track.pts[i].map((a,j)=>a+(track.pts[i+1][j]-a)*q);}
function bolt(x,y){return `<circle cx="${x}" cy="${y}" r="4" fill="#213744" stroke="#94a6ab"/>`+line(x-2,y,x+2,y,'#b9c2c2');}
const label=(name,y,x=280)=>`<g class="annotation">${txt(22,y-5,name,'#b7cad7',15,'class="label"')}${line(22,y+4,198,y+4,'#49667c')}${line(198,y+4,x,y,'#49667c') }<circle cx="${x}" cy="${y}" r="2" fill="#8be7e9"/></g>`;
function setupHead(){
 const s=M.source,p=M.planes;
 let h=defs+`<path d="M250 239Q251 217 276 217H500Q524 218 524 244V600Q524 633 490 635H284Q250 632 250 600Z" fill="#203543" fill-opacity=".32" stroke="#4c6575" stroke-dasharray="5 5"/>`;
 h+=txt(22,31,'01 → 02   STRAHLKOPF','#8be7e9',13)+txt(22,54,'Funktionsschnitt · Proportionen angenähert','#8ca4b5',12);
 h+=`<g id="transportGroup">`;
 track.bends.forEach((b,i)=>{h+=`<path d="${path(b)}" fill="none" stroke="#385a73" stroke-width="48"/><path d="${path(b)}" fill="none" stroke="#a37a55" stroke-width="38" stroke-dasharray="2 4"/>`+txt(b[17][0]-7,b[17][1]-33,`B${i+1}`,'#bcd4e4',13);});
 h+=`<path d="${path(track.pts)}" fill="none" stroke="#102334" stroke-width="23"/><path d="${path(track.pts)}" fill="none" stroke="#7b97a5" stroke-width="19"/><path d="${path(track.pts)}" fill="none" stroke="#102737" stroke-width="13"/>`;
 const a=track.pts[0],b=track.pts[18];h+=`<path d="${path(track.pts.slice(0,19))}" stroke="url(#copper)" stroke-width="30"/>`;
 for(let i=1;i<19;i+=2){const [x,y]=track.pts[i];h+=line(x-5,y-12,x+5,y+12,'#e9bb8e',2);}
 h+=`<g id="electrons"></g></g>`;
 h+=`<g id="headPhotons"></g>`;
 h+=`<g class="component" id="targetGroup"><ellipse cx="390" cy="242" rx="32" ry="9" fill="url(#copper)"/><rect x="361" y="230" width="58" height="11" rx="3" fill="url(#steel)" stroke="#d7bc83"/><rect x="379" y="230" width="22" height="5" fill="#f4cf83"/>`;
 h+=`<path d="M360 245H320V260H280 M418 245H463V260H509" fill="none" stroke="#4e9abc" stroke-width="5"/>`+bolt(340,250)+bolt(442,250)+`<g id="targetHeat"></g></g>`;
 h+=`<g class="component" id="primaryGroup"><path d="M263 272H377L363.4 310H263Z M403 272H517V310H416.6Z" fill="url(#darkMetal)" stroke="#708b9d"/><path d="M263 310H363.4L360 319H267Z M416.6 310H517L513 319H420Z" fill="#122638"/>`+bolt(278,287)+bolt(500,287)+`</g>`;
 h+=`<g class="component" id="filterGroup"><ellipse cx="390" cy="373" rx="87" ry="7" fill="#75858e" fill-opacity=".4" stroke="#95a8b4"/><g id="filterCone"><path d="M390 331Q379 340 365 351L320 371Q391 386 460 371L416 351Q402 340 390 331Z" fill="url(#copper)" stroke="#bc926c"/><ellipse cx="390" cy="372" rx="70" ry="6" fill="#bb976e"/></g></g>`;
 h+=`<g class="component" id="monitorGroup"><rect x="278" y="399" width="224" height="39" rx="7" fill="#1a4256" stroke="#7fadb8"/>`;
 for(const y of [407,417,427])h+=line(290,y,490,y,'#9cd4da',1.5);
 h+=`<path d="M501 417H540V447H573" fill="none" stroke="#8be7e9"/>`+txt(547,438,'Signal','#8be7e9',13)+`</g>`;
 h+=`<g id="mlcGroup" class="component"><g id="headLeaves"></g></g><g id="backupGroup" class="component"><path d="M262 532H${M.project(-.82,535)}V549H262Z M${M.project(.82,535)} 532H518V549H${M.project(.82,535)}Z" fill="url(#steel)" stroke="#75909c"/></g>`;
 h+=`<g id="jawGroup" class="component"><path d="M264 569H516V593H264Z" fill="#385367" fill-opacity=".18" stroke="#7190a3" stroke-dasharray="4 3"/>`+txt(286,587,'Blenden quer zur Schnittebene','#8aa6b9',12)+`</g>`;
 h+=`<path d="M218 730H562L582 747H198Z" fill="#162d3d" stroke="#456a83"/><g id="projectedSlice"></g>`;
 h+=line(390,248,390,754,'#4d697c',1,'stroke-dasharray="3 7"');
 h+=label('Wolfram-Target',238,359)+label('Primärkollimator',293,263)+label('Filterebene',359,325)+label('Monitorkammern',416,278)+label('MLC',493,275)+label('Backup-Blenden',538,265)+label('Querblenden',584,264);
 h+=txt(226,775,'Bezugsebene · geometrische Projektion','#a7bdca',13)+`<text id="sliceInfo" x="22" y="669" fill="#8be7e9" font-size="16"></text><text id="beamInfo" x="22" y="695" fill="#a8bfce" font-size="13"></text>`;
 $('head').insertAdjacentHTML('beforeend',h);
}
function active(i){for(const [id,n]of [['transportGroup',0],['targetGroup',1],['primaryGroup',1],['filterGroup',2],['monitorGroup',2],['mlcGroup',3],['backupGroup',3],['jawGroup',3]]){$(id).style.opacity=n===i?'1':'.48';}}
function currentForm(){return manualForm===null?M.formAt(time):manualForm;}
function forming(){return M.scene(time)===3&&manualForm===null&&time<67;}
function beamOn(){const s=M.scene(time);return s>=1&&time<90&&!(s===2&&M.monitor(time)>=1)&&!forming();}
function renderHead(){const scene=M.scene(time),on=beamOn(),form=scene===3?currentForm():0,closed=scene===3&&shape==='closed';
 active(scene);$('filterCone').style.display=filter==='ff'?'':'none';
 const eAllowed=scene===0||on;let electrons='';if(eAllowed)for(let n=0;n<10;n++){const q=((time/6+n/10)%1+1)%1,[x,y]=onTrack(q);electrons+=`<circle cx="${x}" cy="${y}" r="${n%3===0?3.5:2.5}" fill="#8be7e9"/>`;}$('electrons').innerHTML=electrons;
 $('targetHeat').innerHTML=on?`<circle cx="390" cy="237" r="${22+5*Math.sin(time*3)}" fill="url(#warm)"/>`:'';
 let rays='';if(on){for(let i=0;i<43;i++){const x=(i-21)/18;const end=M.stop(x,row,form,closed);const upper=.8-.32*Math.abs(x),lower=filter==='ff'?.28:upper;const re=M.project(x,end),split=Math.min(end,M.planes.filter);rays+=line(M.project(x,251),251,M.project(x,split),split,'#f4cf83',i%3===0?1.6:1,`opacity="${upper}"`);if(end>split)rays+=line(M.project(x,split),split,re,end,'#f4cf83',i%3===0?1.6:1,`opacity="${lower}"`);
 const f=((time*.55+i*.173)%1);const y=251+(end-251)*f;
 rays+=`<circle cx="${M.project(x,y)}" cy="${y}" r="1.8" fill="#ffe3a5" opacity="${y<M.planes.filter?upper:lower}"/>`;
 if(end<730)rays+=`<circle cx="${re}" cy="${end}" r="2.3" fill="#d6b783" opacity=".5"/>`;
 }}$('headPhotons').innerHTML=rays;
 const [l,r]=M.leaf(row,form,closed),lx=M.project(l,485),rx=M.project(r,485);
 $('headLeaves').innerHTML=`<path d="M259 476H${lx}V510H259Z M${rx} 476H521V510H${rx}Z" fill="url(#steel)" stroke="#9ab0bb"/>`+line(lx,477,lx,509,'#d4e0df',2)+line(rx,477,rx,509,'#d4e0df',2)+bolt(274,490)+bolt(506,490);
 $('projectedSlice').innerHTML=on&&r-l>1e-5?`<path d="M${M.project(l,730)} 729H${M.project(r,730)}L${M.project(r,730)+9} 741H${M.project(l,730)-9}Z" fill="#f4cf83" fill-opacity=".65"/>`:'';
 $('sliceInfo').textContent=scene===3?'Markierter Schnitt durch die Öffnung':'Strahlachse und Bauteilfolge';
 $('beamInfo').textContent=scene===0?'Elektronen im Strahlführungsrohr':forming()?'Einrichtbewegung · Strahl aus':scene===2&&!on?'Abschaltwert erreicht · Strahl aus':closed?'Feld geschlossen · kein direkter Nutzstrahl':scene===3?'Feldvorschau · keine Gewebedosis':'Photonen ab dem Target';
}
function transportDetail(){let h=txt(28,32,'AUS DER BESCHLEUNIGUNGSSTRUKTUR','#8be7e9',12);
 h+=`<g transform="translate(-28 55) scale(1.12)"><path d="${path(track.pts)}" fill="none" stroke="#567185" stroke-width="21"/><path d="${path(track.pts)}" fill="none" stroke="#0a1b2a" stroke-width="13"/>`;
 track.bends.forEach((b,i)=>{h+=`<path d="${path(b)}" stroke="#6e9db7" stroke-width="43" stroke-opacity=".35" fill="none"/>`+txt(b[15][0]-9,b[15][1]-33,`B${i+1}`,'#d5e5ed',17);});
 for(let k=0;k<9;k++){const [x,y]=onTrack((time/6+k/9)%1);h+=`<circle cx="${x}" cy="${y}" r="3" fill="#8be7e9"/>`;}
 h+=`<rect x="371" y="234" width="38" height="8" fill="#dfab75"/></g>`;
 h+=txt(34,327,'Vakuumrohr','#a9c2d3',15)+txt(330,351,'Target','#dfab75',16)+txt(34,365,'Umlenken ≠ Beschleunigen','#e1eaed',18);
 return h;
}
function targetDetail(){const p=((time-18)/4.2%1+1)%1;let h=`<rect x="150" y="56" width="227" height="233" rx="7" fill="#443b2e" stroke="#907755"/>`;
 for(let j=0;j<4;j++)for(let i=0;i<4;i++){const x=179+i*57,y=87+j*58;h+=`<circle cx="${x}" cy="${y}" r="22" fill="none" stroke="#c29e68" stroke-opacity=".15"/><circle cx="${x}" cy="${y}" r="4" fill="#bd9560" opacity=".4"/>`;}
 h+=txt(166,41,'Wolfram · stark vergrößert','#c8b38c',14);
 const ep=[[28,150],[90,150],[145,150],[185,152],[212,159],[235,178],[260,211],[287,242]];
 h+=`<path d="${path(ep)}" fill="none" stroke="#8be7e9" stroke-width="2" stroke-opacity=".4"/><circle cx="218" cy="187" r="9" fill="#debc7e"/>`+txt(163,217,'Atomkern','#d8be91',14);
 if(p<.7){const k=p/.7*(ep.length-1),i=Math.min(ep.length-2,Math.floor(k)),f=k-i,x=ep[i][0]+(ep[i+1][0]-ep[i][0])*f,y=ep[i][1]+(ep[i+1][1]-ep[i][1])*f;h+=`<circle cx="${x}" cy="${y}" r="5" fill="#8be7e9"/>`;}
 if(p>.4){const q=cl((p-.4)/.5),pts=[];for(let i=0;i<35;i++){const a=i/34*q;pts.push([212+226*a,159+112*a+6*Math.sin(a*48)]);}h+=`<path d="${path(pts)}" fill="none" stroke="#f4cf83" stroke-width="2.5"/>`;}
 h+=txt(24,128,'e⁻','#8be7e9',22)+txt(403,302,'γ','#f4cf83',24);
 h+=line(252,289,252,333,'#f29c78',2)+`<path d="M245 323L252 335L259 323" fill="none" stroke="#f29c78" stroke-width="2"/>`+txt(133,364,'Energiedeposition → Wärme','#f29c78',17);
 return h;
}
function filterDetail(){const ff=filter==='ff';let h=txt(24,27,ff?'FF · MIT AUSGLEICHSFILTER':'FFF · OHNE AUSGLEICHSFILTER','#f4cf83',15);
 h+=`<circle cx="240" cy="53" r="5" fill="#f4cf83"/>`;
 for(let i=-6;i<=6;i++){const x=240+i*25;h+=line(240,55,x,174,'#f4cf83',1.5,`opacity="${.6-.045*Math.abs(i)}"`);}
 if(ff)h+=`<path d="M240 83Q225 100 207 105L167 121Q240 133 313 121L273 105Q255 100 240 83" fill="#af8355" stroke="#e5b27a"/>`;
 h+=txt(24,200,'RELATIVES DOSISQUERPROFIL','#aac3d4',12);
 h+=line(58,322,433,322,'#607d92')+line(58,224,58,322,'#607d92');
 h+=txt(27,237,'1','#94aabc',12)+txt(240,349,'Feldposition','#94aabc',12,'text-anchor="middle"');
 const pts=[];for(let i=0;i<=120;i++){const x=-1.25+i*2.5/120,edge=1/(1+Math.exp((Math.abs(x)-1)*30)),f=ff?1-.035*x*x:Math.exp(-1.15*x*x);pts.push([240+x*145,322-82*f*edge]);}
 h+=`<path d="${path(pts)}" stroke="#f4cf83" fill="none" stroke-width="3"/>`;
 h+=line(240,224,240,322,'#4f6a80',1,'stroke-dasharray="3 5"')+txt(240,373,'Prinzipskizze · keine Messdaten','#8ca6b9',12,'text-anchor="middle"');return h;
}
function fieldDetail(){let h=txt(24,28,'BLICK ENTLANG DES STRAHLS','#8be7e9',14);
 const x0=60,y0=64,w=360,hh=270,form=currentForm(),closed=shape==='closed';
 const px=x=>x0+(x+1)*w/2,py=y=>y0+(y+1)*hh/2;
 h+=`<rect x="${x0}" y="${y0}" width="${w}" height="${hh}" fill="#111f2c" stroke="#5c7485"/>`;
 for(let i=0;i<M.N;i++){const y=y0+i*hh/M.N,[l,r]=M.leaf(i,form,closed);if(r>l)h+=`<rect x="${px(l)}" y="${y}" width="${(r-l)*w/2}" height="${hh/M.N}" fill="#f4cf83" fill-opacity="${forming()?'.08':'.23'}"/>`;
 h+=`<path d="M${x0} ${y}H${px(l)}V${y+hh/M.N-1}H${x0}Z M${px(r)} ${y}H${x0+w}V${y+hh/M.N-1}H${px(r)}Z" fill="#617885" stroke="#263b4a" stroke-width=".7"/>`;
 h+=line(px(l)-3,y+2,px(l)-3,y+hh/M.N-2,'#c5d0d0',1)+line(px(r)+3,y+2,px(r)+3,y+hh/M.N-2,'#c5d0d0',1);
 }
 // Backup at sides, perpendicular jaws at top and bottom; projected onto one plane.
 h+=`<path d="M${x0} ${y0}H${px(-.82)}V${y0+hh}H${x0}Z M${px(.82)} ${y0}H${x0+w}V${y0+hh}H${px(.82)}Z" fill="#142a3b" fill-opacity=".65" stroke="#86a2b6"/><path d="M${x0} ${y0}H${x0+w}V${py(-.64)}H${x0}Z M${x0} ${py(.64)}H${x0+w}V${y0+hh}H${x0}Z" fill="#263f51" stroke="#7d99ac"/>`;
 let left=[],right=[];for(let i=0;i<=90;i++){const y=-.56+i*1.12/90,[l,r]=M.target(y);left.push([px(l),py(y)]);right.unshift([px(r),py(y)]);}
 h+=`<path d="${path([...left,...right])}Z" fill="none" stroke="#8be7e9" stroke-width="2" stroke-dasharray="5 4"/>`;
 const sy=y0+(row+.5)*hh/M.N;h+=`<rect x="${x0-4}" y="${sy-hh/M.N/2}" width="${w+8}" height="${hh/M.N}" fill="#8be7e9" fill-opacity=".12" stroke="#8be7e9" stroke-width="1.4"/>`;
 h+=txt(240,365,'Zielvolumen-Projektion','#8be7e9',15,'text-anchor="middle"')+`<rect class="bev-grid" x="60" y="64" width="360" height="270" fill="transparent"/>`;return h;
}
function setScene(s){current=s;const c=scenes[s];$('sceneKind').textContent=String(s+1).padStart(2,'0')+' / '+c.kind;$('viewNumber').textContent=String(s+1).padStart(2,'0');for(const [id,key]of [['viewTitle','title'],['viewText','text'],['takeaway','take'],['question','question'],['answer','answer'],['detailTitle','detail'],['detailNote','note'],['headCaption','caption'],['sceneSource','source']])$(id).textContent=c[key];$('detailKicker').textContent=String(s+1).padStart(2,'0')+' / GENAU HINSEHEN';$('detail').setAttribute('aria-label',c.detail+'. '+c.note);$('check').open=false;$('filterControls').hidden=s!==2;$('monitorReadout').hidden=s!==2;$('leafControls').hidden=s!==3;$('next').disabled=s===3;
 [...$('views').children].forEach((b,i)=>{if(i===s)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});}
function render(){const s=M.scene(time);if(s!==current)setScene(s);renderHead();$('detail').innerHTML=[transportDetail,targetDetail,filterDetail,fieldDetail][s]();
 if(s===2){const v=Math.round(M.monitor(time)*100);$('monitorValue').textContent=v+' %';$('monitorFill').style.width=v+'%';$('monitorState').textContent=v>=100?'Abschaltwert erreicht · Strahl beendet':'Geräteoutput wird erfasst · Strahl aktiv';}
 if(s===3){const [l,r]=M.leaf(row,currentForm(),shape==='closed');$('rowValue').textContent=row+1;$('leafStatus').textContent=r-l<1e-6?'Paar geschlossen → kein direkter Nutzstrahl':forming()?'Lamellen positionieren · Strahl aus':'Paar offen → begrenzter direkter Nutzstrahl';}
 $('timeline').value=time;$('clock').textContent=clock(time)+' / 01:30';$('head').querySelectorAll('.annotation').forEach(e=>{const text=e.textContent;const keep=s===0?['Wolfram-Target']:s===1?['Wolfram-Target']:s===2?['Wolfram-Target','Monitorkammern']:['MLC'];e.style.display=keep.some(v=>text.includes(v))?'':'none';});
}
function clock(t){return String(Math.floor(t/60)).padStart(2,'0')+':'+String(Math.floor(t%60)).padStart(2,'0');}
function status(s){$('playerStatus').textContent=s;}
function setPlaying(value){playing=value;$('play').textContent=value?'Ⅱ Anhalten':time>=duration?'↺ Erneut abspielen':'▶ Fortsetzen';$('play').setAttribute('aria-label',value?'Animation anhalten':'Animation abspielen');last=0;if(value&&!raf)raf=requestAnimationFrame(tick);}
function seek(t){setPlaying(false);time=cl(Number(t),0,duration);manualForm=null;shape='contour';syncShapes();render();status('Pausiert · '+scenes[M.scene(time)].nav+'.');}
function tick(ts){raf=0;if(!playing)return;if(!last)last=ts;const dt=Math.min((ts-last)/1000,.12);last=ts;let next=Math.min(duration,time+dt*Number($('speed').value));const boundary=starts.find(x=>x>time+1e-5&&x<=next);
 if(boundary!==undefined&&$('pauseBetween').checked){time=boundary;setPlaying(false);status('Neue Ansicht · '+scenes[M.scene(time)].nav+'. Mit Fortsetzen abspielen.');}
 else{time=next;if(time>=duration){setPlaying(false);status('Phase 02 abgeschlossen. Als Nächstes: Wechselwirkungen im Gewebe.');}}
 if(ts-frame>32||!playing){render();frame=ts;}if(playing)raf=requestAnimationFrame(tick);
}
function syncShapes(){document.querySelectorAll('[data-shape]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.shape===shape)));}

setupHead();
$('head').removeAttribute('aria-labelledby');$('head').removeAttribute('aria-describedby');$('headTitle')?.remove();$('headDesc')?.remove();
const mode=new URLSearchParams(location.search).get('clip')||'bend';
const clips={bend:[0,12],target:[18,27],mlc:[58,72],monitor:[36,55]};
const [CLIP_START,CLIP_END]=clips[mode]||clips.bend;
document.body.dataset.clip=mode in clips?mode:'bend';
if(mode==='bend')$('head').setAttribute('viewBox','0 0 660 265');
if(mode==='target')$('head').setAttribute('viewBox','0 175 660 150');
// A3 deliberately omits the unrelated FF/FFF detail diagram.
function lessonRender(t){time=cl(Number(t),CLIP_START,CLIP_END);render();
 if(mode==='mlc'){$('detail').setAttribute('aria-label','Blick entlang des Strahls: Lamellenöffnung und gestrichelte Zielprojektion. Die blaue Zeile entspricht dem Schnitt links.');}
 $('head').setAttribute('aria-label',mode==='bend'?'Elektronenbahn durch Magnetbereiche zum Target':mode==='target'?'Elektronen treffen auf das Target. Die dargestellten Photonen beginnen am Target.':mode==='monitor'?'Strahlkopf mit markiertem Monitorsystem und Ende der Strahlabgabe beim Demo-Sollwert':'Strahlkopf im Schnitt. Die Öffnung begrenzt die gezeigten direkten Strahlen.');
}
function chooseShape(value){manualForm=value==='rectangle'?0:1;shape=value;time=72;render();}
window.lessonRenderer={renderAt:lessonRender,start:CLIP_START,end:CLIP_END,reset:()=>{manualForm=null;shape='contour';},chooseShape,state:()=>({time,scene:current,shape,forming:forming(),beamOn:beamOn(),monitor:M.monitor(time)})};
lessonRender(CLIP_START);
})();
