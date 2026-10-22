"use strict";
/* Eigenständiger Lehrpilot. Synthetische Geometrie, keine Teilchentransport- oder Dosisrechnung. */
(() => {
 const scenes = [
  {title:"Elektronen bereitstellen",short:"Elektronenquelle",domain:"TECHNIK / PHYSIK",scale:"GERÄTEEBENE",duration:16,
   sub:"Eine geheizte Kathode liefert die Elektronen.",
   caption:"Geräteübersicht und Zoom zur Elektronenquelle. Teilchenzahlen, Abstände und Bewegungen sind schematisch.",
   body:"Durch Glühemission treten Elektronen aus der geheizten Kathode aus. Das Injektionssystem formt daraus Elektronenpakete und führt sie in die Beschleunigungsstruktur.",
   takeaway:"Am Anfang stehen Elektronen – die therapeutischen Photonen entstehen erst später.",
   caution:"Die Heizleistung der Kathode und die Energie der später beschleunigten Elektronen sind unterschiedliche Größen.",
   advanced:"Elektronenkanone, Modulator und HF-System arbeiten zeitlich abgestimmt. Das Vakuum reduziert unerwünschte Kollisionen in der Beschleunigungsstruktur. Die konkrete Injektionsschaltung ist geräteabhängig.",
   question:"Denkfrage: Gibt die Kathode bereits den therapeutischen Photonenstrahl ab?",
   answer:"Nein. Sie liefert Elektronen. Im hier gezeigten Photonenmodus entstehen die therapeutischen Röntgenphotonen erst am Target."},
  {title:"Elektronen beschleunigen",short:"HF-Beschleunigung",domain:"TECHNIK / PHYSIK",scale:"BESCHLEUNIGUNGSSTRUKTUR",duration:18,
   sub:"HF-Felder übertragen Energie auf die Elektronenpakete.",
   caption:"Energiezunahme schematisch; Fluggeschwindigkeit und HF-Phasenlage werden nicht maßstäblich simuliert.",
   body:"Elektrische Hochfrequenzfelder in den Resonatorzellen übertragen Energie auf passend eintreffende Elektronenpakete. Ein nachgeschaltetes Magnetsystem kann den Elektronenstrahl zum Target umlenken.",
   takeaway:"Das elektrische Feld beschleunigt; das Magnetfeld lenkt um.",
   caution:"Die Elektronen fliegen entlang der Strahlachse. Eine gezeichnete HF-Welle ist keine gewellte Elektronenflugbahn.",
   advanced:"Ein Magnetron erzeugt HF-Leistung; ein Klystron verstärkt die Leistung eines HF-Treibers. Stehende und laufende Wellen sind unterschiedliche Beschleunigerkonzepte. Ein ideales statisches Magnetfeld verrichtet am Elektron keine Arbeit. Biegegeometrien sind geräteabhängig; die Skizze zeigt nur eine Umlenkung.",
   question:"Denkfrage: Beschleunigt der Umlenkmagnet die Elektronen auf höhere Energie?",
   answer:"Im idealisierten statischen Magnetfeld ändert sich die Richtung, nicht die kinetische Energie. Die Energie wurde zuvor aus den elektrischen HF-Feldern übertragen."},
  {title:"Photonen am Target erzeugen",short:"Target / Photonen",domain:"PHYSIK",scale:"ZOOM: TARGET / COULOMBFELD",duration:16,
   sub:"Beim Abbremsen und Ablenken kann Bremsstrahlung entstehen.",
   caption:"Ein beispielhafter Strahlungsprozess im Target; keine maßstäbliche Atomstruktur oder Emissionsstatistik.",
   body:"Schnelle Elektronen treffen auf ein hoch-Z-Target. In Coulombfeldern können sie Energie als Bremsstrahlungsphotonen abgeben. Im Target wird außerdem Energie deponiert; Kühlung ist erforderlich.",
   takeaway:"Die Photonen werden erzeugt – sie werden nicht im LINAC beschleunigt.",
   caution:"Ein therapeutischer Photonenstrahl hat ein Energiespektrum. Die Strahlqualitätsangabe 6 MV bedeutet keine Sammlung identischer 6-MeV-Photonen.",
   advanced:"Charakteristische Röntgenstrahlung kann ebenfalls entstehen. Für das therapeutische MV-Spektrum ist hier die Bremsstrahlung der zentrale Lehrinhalt. Im Elektronenmodus wird das Target aus dem Nutzstrahlweg genommen; dieser alternative Modus wird in diesem Pilot nicht animiert.",
   question:"Denkfrage: Wird jedes eintreffende Elektron vollständig in genau ein Photon umgewandelt?",
   answer:"Nein. Elektronen können mehrfach wechselwirken; Strahlung entsteht mit unterschiedlichen Energien. Zusätzlich wird Energie im Target deponiert. Die sichtbaren Teilchen sind nur ausgewählte Beispiele."},
  {title:"Den Strahl kontrollieren und formen",short:"Strahlkopf / MLC",domain:"TECHNIK / PHYSIK",scale:"ZURÜCK ZUM STRAHLKOPF",duration:18,
   sub:"Strahlüberwachung und geometrische Begrenzung haben verschiedene Aufgaben.",
   caption:"Beispiel eines FF-Photonenstrahlkopfs. Ausführung und Reihenfolge der Bauteile sind geräteabhängig.",
   body:"Kollimatoren begrenzen den Strahl. Im gezeigten FF-Beispiel beeinflusst ein Ausgleichsfilter das Profil. Die Monitorkammer liefert Signale zur Überwachung der Abgabe. Blenden und MLC formen die Feldöffnung.",
   takeaway:"Feldformung, Überwachung und Dosis im Patienten sind unterschiedliche Ebenen.",
   caution:"Der MLC begrenzt die Projektion aus einer Einstrahlrichtung. Er verhindert nicht die Durchstrahlung von Gewebe vor und hinter dem Ziel.",
   advanced:"Bei FFF entfällt der Ausgleichsfilter. MLC-Anordnung, zusätzliche Blenden und Monitoring unterscheiden sich zwischen Geräten. Monitorsignale beziehungsweise MU sind nicht mit der Dosis an einem beliebigen Patientenpunkt gleichzusetzen. Die reale Dosisverteilung erfordert Planung und Berechnung.",
   question:"Denkfrage: Bedeutet ein passend geformtes Feld automatisch eine korrekte Zieldosis?",
   answer:"Nein. Feldöffnung und überwachte Abgabe sind wichtige Voraussetzungen. Die Dosisverteilung hängt zusätzlich unter anderem von Strahlqualität, Geometrie, Gewebe und Planung ab."},
  {title:"Energie im Gewebe übertragen",short:"Photon → Elektron",domain:"PHYSIK",scale:"ZOOM: WECHSELWIRKUNG",duration:18,
   sub:"Photonen übertragen Energie auf geladene Teilchen.",
   caption:"Ein Compton-Ereignis und eine symbolische Elektronenspur. Streuwinkel und Spur sind illustrative Beispiele.",
   body:"Bei einer Compton-Wechselwirkung überträgt ein Photon einen Teil seiner Energie auf ein Elektron und wird gestreut. Sekundäre Elektronen geben durch weitere Wechselwirkungen Energie im Gewebe ab.",
   takeaway:"Photonen sind indirekt ionisierend; geladene Sekundärteilchen vermitteln die lokale Energieabgabe.",
   caution:"Ein Photon muss nicht im Ziel wechselwirken. Außerdem ist eine gezeichnete Elektronenspur keine Isodose und keine berechnete Reichweite.",
   advanced:"Für typische MV-Photonenspektren ist Compton-Streuung in wasserähnlichem Gewebe besonders relevant. Weitere Prozesse sind möglich. Absorbierte Dosis ist deponierte Energie pro Masse: 1 Gy = 1 J/kg. Aus den dargestellten Einzelereignissen wird hier keine Dosis abgeleitet.",
   question:"Denkfrage: Wo liegt die Verbindung zwischen Photonenstrahl und vielen lokalen Ionisationen?",
   answer:"In der Energieübertragung auf Elektronen und andere geladene Sekundärteilchen. Diese können entlang ihrer Bahnen viele weitere Ionisationen und Anregungen auslösen."},
  {title:"Wasser wird zum Reaktionspartner",short:"Strahlenchemie",domain:"PHYSIK → CHEMIE",scale:"ZOOM: WASSER / MOLEKÜLE",duration:18,
   sub:"Ionisation und Anregung können reaktive Spezies erzeugen.",
   caption:"Beispielzweig der Wasserradiolyse. • bezeichnet ein ungepaartes Elektron; die Filmzeit ist stark gestreckt.",
   body:"Nach Ionisation von Wasser entstehen kurzlebige Zwischenprodukte. Ein möglicher Reaktionsweg führt über das Wasserradikalkation und Protonentransfer zum Hydroxylradikal •OH. Solche Spezies können nahe gelegene Biomoleküle chemisch verändern.",
   takeaway:"Indirekte Wirkung: Energieübertragung auf Wasser → reaktive Spezies → Biomolekülschaden.",
   caution:"Das Hydroxylradikal •OH ist nicht das Hydroxidion OH⁻. Radikale bewegen sich nicht zielgerichtet zur DNA.",
   advanced:"Gezeigt ist nur ein Reaktionszweig. Weitere Produkte sind unter anderem hydratisierte Elektronen e⁻aq, H• und H₂O₂. Konkurrenzreaktionen und Radikalfänger begrenzen die Wirkung. Sauerstoff kann strahleninduzierte Radikalveränderungen an Biomolekülen chemisch stabilisieren; seine Wirkung ist keine bloße Steigerung der physikalisch absorbierten Dosis.",
   question:"Denkfrage: Muss ein Photon die DNA selbst treffen, damit indirekter DNA-Schaden entsteht?",
   answer:"Nein. Energie kann zunächst auf Elektronen und Wasser übertragen werden. Reaktive Produkte können anschließend mit DNA reagieren. Räumliche Nähe und konkurrierende Reaktionen sind dabei entscheidend."},
  {title:"DNA kann auf mehreren Wegen geschädigt werden",short:"DNA / Reparatur",domain:"CHEMIE → BIOLOGIE",scale:"MOLEKÜL- / DNA-EBENE",duration:18,
   sub:"Direkte und indirekte Wirkung sind unterschiedliche Wege zum Schaden.",
   caption:"Einzel- und Doppelstrangschaden sind symbolisch. Die Animation legt weder Häufigkeiten noch Reparaturerfolg fest.",
   body:"Energieabgabe unmittelbar an der DNA kann direkte Schäden auslösen. Bei indirekter Wirkung reagieren zuvor erzeugte chemische Spezies mit ihr. Mögliche Läsionen sind Basenschäden sowie Einzel- und Doppelstrangbrüche. Die Zelle aktiviert Schadensantwort und Reparatur.",
   takeaway:"DNA-Schaden ist ein Ausgangspunkt für Zellreaktionen, kein automatisches Todesurteil.",
   caution:"Direkte Wirkung bedeutet bei Photonenbestrahlung nicht zwingend einen direkten Photonentreffer: Auch ein sekundäres Elektron kann an der DNA direkt ionisieren.",
   advanced:"Nahe beieinanderliegende Schäden können die Reparatur erschweren. Unter anderem NHEJ und homologe Rekombination wirken an Doppelstrangbrüchen; Weg und Ergebnis hängen vom Kontext ab. Die Zellzyklusantwort kann Zeit für Reparatur schaffen. Ein Doppelstrangbruch ist nicht grundsätzlich irreparabel.",
   question:"Denkfrage: Führt jeder Doppelstrangbruch zum sofortigen Zelltod?",
   answer:"Nein. Reparatur kann gelingen, fehlerhaft verlaufen oder unvollständig bleiben. Die spätere Zellreaktion hängt unter anderem von Schadenkomplexität und Zellzustand ab."},
  {title:"Von DNA-Schäden zu möglichen Zellfolgen",short:"Zellfolgen",domain:"BIOLOGIE",scale:"ZELLE / SPÄTERE ZELLZYKLEN",duration:18,
   sub:"Reparatur, Fehlreparatur und Verlust der Teilungsfähigkeit sind mögliche Verläufe.",
   caption:"Alternative Verläufe, keine drei Ereignisse derselben Zelle und keine berechneten Wahrscheinlichkeiten.",
   body:"Ein Teil der Schäden kann erfolgreich repariert werden. Andere Schäden bleiben bestehen oder werden fehlerhaft repariert. Zellen können ihre dauerhafte Teilungsfähigkeit verlieren; manche Folgen werden erst bei späteren Teilungsversuchen sichtbar.",
   takeaway:"Strahlentherapie zielt auf Tumorkontrolle bei begrenzter Normalgewebebelastung.",
   caution:"Auch gesundes Gewebe kann geschädigt werden. Tumorzellen sind nicht pauschal reparaturunfähig, und bestrahlte Zellen verschwinden nicht alle sofort.",
   advanced:"Zellfolgen können unter anderem dauerhaften Wachstumsarrest, mitoseassoziiertes Versagen und Apoptose umfassen. Gewebe- und Tumorreaktionen sind komplexer als eine einzelne Zelle. Fraktionierung nutzt mehrere biologische Faktoren; sie ist keine Garantie, dass ausschließlich gesundes Gewebe repariert.",
   question:"Denkfrage: Warum ist sichtbares Schrumpfen eines Tumors kein unmittelbarer Maßstab für jede Zellinaktivierung?",
   answer:"Verlust der langfristigen Teilungsfähigkeit und sichtbare Gewebeveränderung sind verschiedene Endpunkte. Zellfolgen und Abbau können zeitverzögert auftreten."}
 ];
 let offset=0;scenes.forEach(s=>{s.at=offset;offset+=s.duration;});
 const total=offset, byId=id=>document.getElementById(id), canvas=byId("scene"),ctx=canvas.getContext("2d");
 const motion=window.matchMedia("(prefers-reduced-motion: reduce)");
 const colors={ink:"#eef4f7",muted:"#a9bdcf",line:"#35526b",electron:"#6ddbea",photon:"#ffd16d",chemical:"#c5a0ff",damage:"#ff829b",mint:"#a4ed78"};
 let time=0,playing=false,frame=null,last=0,index=-1,W=1100,H=580,small=false,wasPlaying=false;
 const nav=byId("chapters");
 scenes.forEach((s,i)=>{const li=document.createElement("li"),button=document.createElement("button");button.type="button";button.innerHTML='<span class="number">'+String(i+1).padStart(2,"0")+'</span><span>'+s.short+'<small>'+s.domain+'</small></span>';button.addEventListener("click",()=>seek(s.at));li.append(button);nav.append(li);});
 byId("timeline").max=total;
 const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
 const fmt=t=>String(Math.floor(t/60)).padStart(2,"0")+":"+String(Math.floor(t%60)).padStart(2,"0");
 function txt(value,x,y,size=22,color=colors.ink,align="left") {ctx.fillStyle=color;ctx.font=(size>=30?"700 ":"500 ")+(size*(small?1.08:1))+"px system-ui,sans-serif";ctx.textAlign=align;ctx.textBaseline="middle";ctx.fillText(value,x,y);}
 function line(points,color=colors.line,width=2,dash=[]) {ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);}
 function rect(x,y,w,h,fill,stroke) {ctx.fillStyle=fill;ctx.fillRect(x,y,w,h);if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.strokeRect(x,y,w,h);}}
 function circle(x,y,r,fill,stroke) {ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke();}}
 function polygon(points,fill,stroke) {ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke();}}
 function arrow(x1,y1,x2,y2,color,width=3) {line([[x1,y1],[x2,y2]],color,width);const a=Math.atan2(y2-y1,x2-x1),n=10;polygon([[x2,y2],[x2-n*Math.cos(a-.45),y2-n*Math.sin(a-.45)],[x2-n*Math.cos(a+.45),y2-n*Math.sin(a+.45)]],color);}
 function wave(x1,y1,x2,y2,color=colors.photon,p=1) {const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),points=[];for(let i=0;i<=80*p;i++){const f=i/80,q=Math.sin(f*len/8)*4;points.push([x1+dx*f-dy/len*q,y1+dy*f+dx/len*q]);}line(points,color,2.5);}
 function wrap(value,x,y,maxWidth,size=22,color=colors.ink) {ctx.font="500 "+(size*(small?1.08:1))+"px system-ui,sans-serif";let row="",dy=0;for(const word of value.split(" ")){const candidate=row?row+" "+word:word;if(row&&ctx.measureText(candidate).width>maxWidth){txt(row,x,y+dy,size,color);dy+=size*1.35;row=word;}else row=candidate;}if(row)txt(row,x,y+dy,size,color);return dy;}
 function particle(x,y,r=5,color=colors.electron){circle(x,y,r,color);}
 function badge(value,x,y,color=colors.mint){const size=19*(small?1.08:1);ctx.font="500 "+size+"px system-ui,sans-serif";const rows=[];let row="";for(const word of value.split(" ")){const next=row?row+" "+word:word;if(row&&ctx.measureText(next).width>W*.91){rows.push(row);row=word;}else row=next;}if(row)rows.push(row);rows.forEach((r,i)=>txt(r,x,y-(rows.length-1-i)*size*1.25,19,color,"center"));}
 function grid(){rect(0,0,W,H,"#0b1a2b");for(let x=20;x<W;x+=32)for(let y=20;y<H;y+=32)rect(x,y,1,1,"#263a50");}
 function dna(x,y,width,damage=0,amplitude=28){const n=65;for(let strand=0;strand<2;strand++){let path=[];for(let i=0;i<=n;i++){const f=i/n,px=x+f*width,py=y+(strand?1:-1)*amplitude*Math.cos(f*Math.PI*6);const gap=Math.abs(f-.5)<.055&&(strand===0&&damage>0||damage>1);if(gap){if(path.length)line(path,strand?"#9eb9cb":"#68cdb5",4);path=[];}else path.push([px,py]);}if(path.length)line(path,strand?"#9eb9cb":"#68cdb5",4);}for(let i=0;i<=18;i++){const f=i/18;if(damage&&Math.abs(f-.5)<.06)continue;const a=amplitude*Math.cos(f*Math.PI*6);line([[x+f*width,y-a],[x+f*width,y+a]],"#637f92",2);}if(damage){const px=x+width*.5;txt(damage===1?"Einzelstrangschaden":"Doppelstrangschaden",px,y+amplitude+48,small?19:21,colors.damage,"center");circle(px,y+amplitude,7,colors.damage);if(damage>1)circle(px,y-amplitude,7,colors.damage);}}
 function cell(x,y,r,color=colors.chemical){circle(x,y,r,"#24354a",color);circle(x,y,r*.48,"#263047",color);}
 function drawGun(p){const cy=H*.47;rect(W*.12,H*.23,W*.75,H*.48,"#162c40","#506b83");txt("VAKUUM",W*.5,H*.18,20,colors.muted,"center");line([[W*.22,H*.28],[W*.22,H*.65]],colors.photon,8);for(let i=0;i<9;i++){const y=H*.31+i*H*.035;line([[W*.17,y],[W*.25,y+8],[W*.17,y+16]],p>.1?"#ffc578":"#d49c6b",5);}rect(W*.71,H*.27,W*.028,H*.14,"#7892a8");rect(W*.71,H*.54,W*.028,H*.13,"#7892a8");line([[W*.26,cy-40],[W*.69,cy-17]],"#6ba1b2",1.5,[5,5]);line([[W*.26,cy+40],[W*.69,cy+17]],"#6ba1b2",1.5,[5,5]);for(let i=0;i<21;i++){const f=(p*2+i/21)%1;particle(W*(.27+.56*f),cy+Math.sin(i*2.7)*22*(1-f),4.5);}arrow(W*.37,H*.77,W*.66,H*.77,colors.electron);txt("Elektronenpakete",W*.5,H*.85,24,colors.electron,"center");txt("Kathode",W*.2,H*.72,21,colors.photon,"center");txt("Injektion",W*.76,H*.72,21,colors.muted,"center");}
 function machineOverview(){rect(W*.12,H*.30,W*.16,H*.50,"#344d65","#8a9fb1");rect(W*.22,H*.20,W*.54,H*.14,"#405a72","#8a9fb1");rect(W*.65,H*.26,W*.17,H*.21,"#577188","#a1b8c8");rect(W*.42,H*.76,W*.48,H*.035,"#72899e");rect(W*.60,H*.80,W*.08,H*.12,"#344d65");rect(W*.48,H*.67,W*.38,H*.07,"#7b626e");circle(W*.49,H*.67,W*.025,"#ad8c95");line([[W*.32,H*.27],[W*.59,H*.27],[W*.73,H*.41]],colors.electron,4,[5,6]);polygon([[W*.73,H*.47],[W*.81,H*.67],[W*.65,H*.67]],"#ffd16d18",colors.photon);circle(W*.32,H*.27,9,colors.electron);txt("Elektronenquelle",W*.12,H*.12,26,colors.electron);line([[W*.27,H*.15],[W*.32,H*.24]],colors.electron);txt("Strahlkopf",W*.75,H*.54,24,colors.photon,"center");txt("Patiententisch",W*.65,H*.86,23,colors.muted,"center");badge("LINAC im Photonenmodus · Geräteanordnung schematisch",W*.5,H*.97,colors.muted);}
 function sceneGun(p){const z=clamp((p-.23)/.12);if(z<1){ctx.save();ctx.globalAlpha=1-z;machineOverview();ctx.restore();}if(z>0){ctx.save();ctx.globalAlpha=z;drawGun(clamp((p-.23)/.77));ctx.restore();}}
 function sceneRF(p){const y=H*.40,x0=W*.1,width=W*.63;for(let i=0;i<8;i++){const x=x0+i*width/8;rect(x,y-65,width/8-3,130,"#22384c","#6c879b");rect(x+width/8-10,y-12,12,24,"#0b1a2b");arrow(x+width/16+12,y-32,x+width/16-12,y-32,colors.mint,2);}line([[x0,y],[x0+width,y]],"#36536b",1,[5,7]);for(let i=0;i<22;i++){const f=(p*2+i/22)%1;particle(x0+f*width,y+Math.sin(i*4)*5,4.5);}txt("HF-Felder in Resonatorzellen",W*.43,H*.16,small?23:25,colors.mint,"center");txt("Energieübertragung auf Elektronen",W*.42,H*.58,small?21:24,colors.electron,"center");rect(W*.12,H*.72,W*.36,H*.12,"#233c3a","#6c9d78");txt("HF-Leistung",W*.3,H*.78,24,colors.mint,"center");arrow(W*.5,H*.78,W*.58,H*.53,colors.mint);ctx.beginPath();ctx.moveTo(W*.74,y);ctx.quadraticCurveTo(W*.88,y,W*.88,H*.67);ctx.strokeStyle=colors.electron;ctx.lineWidth=4;ctx.stroke();circle(W*.85,H*.45,W*.07,"#152a3d","#8392a9");ctx.beginPath();ctx.moveTo(W*.74,y);ctx.quadraticCurveTo(W*.88,y,W*.88,H*.67);ctx.strokeStyle=colors.electron;ctx.lineWidth=3;ctx.stroke();txt("B",W*.85,H*.4,24,colors.chemical,"center");txt("Umlenkung",W*.81,H*.76,21,colors.muted,"center");badge("Energie nimmt zu · Geschwindigkeit nicht maßstäblich",W*.5,H*.94,colors.muted);}
 function sceneTarget(p){rect(W*.46,H*.2,W*.24,H*.57,"#3a3540","#8e7b6b");for(let i=0;i<7;i++)for(let j=0;j<5;j++)circle(W*(.48+i*.032),H*(.25+j*.105),3,"#6a5751");circle(W*.585,H*.46,20,colors.photon);circle(W*.585,H*.46,46,"#674b2920","#8d7447");txt("Kern / Coulombfeld",W*.54,H*.08,22,colors.photon,"center");const path=[];for(let i=0;i<80;i++){const f=i/79;path.push([W*(.1+.8*f),H*(.37+.22/(1+Math.exp(-(f-.57)*17)))]);}line(path,colors.electron,3);const f=(p*1.6)%1;const pos=path[Math.floor(f*79)];particle(pos[0],pos[1],7);wave(W*.53,H*.39,W*.91,H*.25,colors.photon,clamp((p-.2)/.5));txt("e⁻",W*.15,H*.31,27,colors.electron);txt("Photon γ",W*.84,H*.16,23,colors.photon,"center");txt("Target",W*.58,H*.83,25,colors.muted,"center");badge("Elektron verliert Energie · Photon trägt Energie fort",W*.5,H*.94,colors.muted);}
 function sceneHead(p){const x=W*.64,sy=H*.1,endY=H*.91,half=W*.18;const at=y=>half*(y-sy)/(endY-sy);polygon([[x,sy],[x+half,endY],[x-half,endY]],"#ffd16d22");for(let i=0;i<7;i++){const y=sy+((p*1.4+i/7)%1)*(endY-sy);const xx=x+(i-3)/3*at(y)*.8;particle(xx,y,3,colors.photon);}circle(x,sy,7,colors.photon);const rows=[{y:.23,label:"Primärkollimator"},{y:.58,label:"Blenden"},{y:.69,label:"MLC"}];rows.forEach(r=>{const y=H*r.y,gap=at(y),start=W*.37,end=W*.91;rect(start,y-7,x-gap-start,14,"#809bb0");rect(x+gap,y-7,end-x-gap,14,"#809bb0");txt(r.label,W*.04,y,small?19:22,colors.ink);line([[W*.30,y],[start-8,y]],colors.line);});const fy=H*.34;polygon([[x,fy-23],[x+W*.065,fy+10],[x-W*.065,fy+10]],"#ac9477","#d9bf9b");txt("FF-Filter",W*.04,fy,22,colors.photon);line([[W*.30,fy],[x-W*.075,fy]],colors.line);rect(x-W*.15,H*.45,W*.30,12,"#86bfac77","#86bfac");txt("Monitorkammer",W*.04,H*.45+6,small?19:22,colors.mint);line([[W*.3,H*.45+6],[x-W*.16,H*.45+6]],colors.line);rect(x-W*.21,H*.82,W*.42,H*.13,"#73526377","#c98697");circle(x,H*.88,16,colors.damage);txt("Target",W*.04,sy,23,colors.photon);txt("Gewebe",W*.04,H*.87,22,colors.muted);badge("Formen ≠ Dosis berechnen",W*.5,H*.985,colors.muted);}
 function sceneInteraction(p){const x=W*.47,y=H*.48;rect(W*.07,H*.15,W*.86,H*.70,"#533e5966","#846681");wave(W*.1,H*.48,x,y,colors.photon,clamp(p/.35));circle(x,y,27,"#263c53","#98b1c5");if(p>.25){wave(x,y,W*.86,H*.24,colors.photon,clamp((p-.25)/.3));const points=[[x,y],[W*.58,H*.58],[W*.64,H*.55],[W*.71,H*.68],[W*.79,H*.66],[W*.86,H*.76]];const n=Math.max(2,Math.floor(clamp((p-.25)/.5)*points.length));line(points.slice(0,n),colors.electron,3);for(let i=1;i<n;i++){circle(points[i][0],points[i][1],6,colors.chemical);}}txt("einfallendes Photon",W*.11,H*.36,small?20:23,colors.photon);txt("Streuphoton",W*.71,H*.13,23,colors.photon,"center");txt("sekundäres e⁻",W*.71,H*.88,23,colors.electron,"center");badge("Weitere Ionisationen und Anregungen entlang der Elektronenspur",W*.5,H*.965,colors.muted);}
 function water(x,y,kind="H₂O"){
  circle(x,y,24,colors.chemical);
  circle(x-24,y+23,11,"#d9e6ed");line([[x-14,y+11],[x-21,y+20]],"#d9e6ed",3);
  if(kind!=="•OH"){circle(x+24,y+23,11,"#d9e6ed");line([[x+14,y+11],[x+21,y+20]],"#d9e6ed",3);}
  if(kind==="H₃O⁺"){circle(x,y-33,11,"#d9e6ed");line([[x,y-20],[x,y-29]],"#d9e6ed",3);}
  txt(kind,x,y-73,26,kind==="H₂O•⁺"?colors.damage:colors.ink,"center");
 }
 function sceneChem(p){
  const y=H*.43,transfer=clamp((p-.48)/.22);
  water(W*.23,y,p<.25?"H₂O":p<.48?"H₂O•⁺":"•OH");
  water(W*.66,y,p<.70?"H₂O":"H₃O⁺");
  arrow(W*.06,y,W*.17,y,colors.electron);txt("e⁻",W*.08,y-38,25,colors.electron,"center");
  if(p>.25){particle(W*.3+W*.12*clamp((p-.25)/.2),y-H*.17,6,colors.electron);txt("e⁻",W*.46,y-H*.17,24,colors.electron);}
  if(p>.48&&p<.70){const x=W*.23+24+(W*.43-24)*transfer,yy=y+23-56*transfer;circle(x,yy,11,"#d9e6ed");txt("H⁺",x,yy-30,23,colors.ink,"center");}
  if(p>.48)arrow(W*.34,y+55,W*.53,y+55,colors.chemical);
  const eq=p<.48?"H₂O → H₂O•⁺ + e⁻":"H₂O•⁺ + H₂O → H₃O⁺ + •OH";
  txt(eq,W*.5,H*.75,small?24:29,colors.chemical,"center");
  txt("Beispiel: Ionisation und Protonentransfer",W*.5,H*.85,small?19:21,colors.muted,"center");
  badge("•OH ≠ OH⁻ · kurzlebig und lokal reaktiv",W*.5,H*.96,colors.photon);
 }
 function sceneDNA(p){const x=W*.40,y=H*.48,width=W*.52;dna(x,y,width,p>.68?2:p>.35?1:0,35);arrow(W*.09,H*.24,W*.66,y+35,colors.electron);txt("Direkte Wirkung",W*.09,H*.13,26,colors.electron);txt("Energieabgabe an DNA",W*.09,H*.20,small?19:22,colors.muted);circle(W*.17,H*.72,27,colors.chemical);txt("•OH",W*.17,H*.72,24,"#19223a","center");arrow(W*.24,H*.72,W*.66,y-35,colors.chemical);txt("Indirekte Wirkung",W*.09,H*.85,26,colors.chemical);txt("Chemische Reaktion mit DNA",W*.09,H*.92,small?19:22,colors.muted);if(p>.86){txt("Schadensantwort / Reparatur",W*.65,H*.19,small?19:23,colors.mint,"center");}}
 function sceneOutcomes(p){cell(W*.18,H*.49,W*.075,colors.damage);txt("geschädigte",W*.18,H*.7,small?20:23,colors.muted,"center");txt("Zelle",W*.18,H*.76,23,colors.muted,"center");const outcomes=[{y:.20,color:colors.mint,title:"Reparatur",detail:"Überleben möglich"},{y:.49,color:colors.photon,title:"Fehlreparatur",detail:"veränderte Zelle möglich"},{y:.78,color:colors.damage,title:"Teilungsfähigkeit verloren",detail:"spätere Zellfolgen möglich"}];outcomes.forEach((o,i)=>{const y=H*o.y;line([[W*.27,H*.49],[W*.36,H*.49],[W*.43,y],[W*.48,y]],"#63778d",2);rect(W*.48,y-H*.105,W*.46,H*.21,"#1b3044",o.color);cell(W*.55,y,W*.032,o.color);wrap(o.title,W*.61,y-18,W*.31,small?20:24,o.color);wrap(o.detail,W*.61,y+35,W*.31,small?16:19,colors.muted);});badge("Alternative Verläufe · keine Häufigkeiten · oft zeitverzögert",W*.5,H*.96,colors.muted);}
 const drawers=[sceneGun,sceneRF,sceneTarget,sceneHead,sceneInteraction,sceneChem,sceneDNA,sceneOutcomes];
 function resize(){small=canvas.clientWidth<650;W=small?620:1100;H=small?620:580;canvas.width=W*devicePixelRatio;canvas.height=H*devicePixelRatio;canvas.style.aspectRatio=W+" / "+H;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);render();}
 function updateScene(i){const s=scenes[i];byId("chapterNumber").textContent=String(i+1).padStart(2,"0");byId("sceneTitle").textContent=s.title;byId("sceneSub").textContent=s.sub;byId("domain").textContent=s.domain;byId("scale").textContent=s.scale;byId("figureCaption").textContent=s.caption;canvas.setAttribute("aria-label",s.title+". "+s.caption);byId("explanation").textContent=s.body;byId("takeaway").textContent=s.takeaway;byId("caution").textContent=s.caution;byId("advancedText").textContent=s.advanced;byId("question").textContent=s.question;byId("answer").textContent=s.answer;byId("questionBox").open=false;[...nav.querySelectorAll("button")].forEach((b,n)=>{if(n===i)b.setAttribute("aria-current","step");else b.removeAttribute("aria-current");});byId("back").disabled=i===0;byId("next").disabled=i===scenes.length-1;}
 function render(){const i=time>=total?scenes.length-1:scenes.findIndex(s=>time>=s.at&&time<s.at+s.duration);if(i!==index){index=i;updateScene(i);}const p=clamp((time-scenes[index].at)/scenes[index].duration);ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);grid();drawers[index](p);byId("timeline").value=time;byId("timeline").setAttribute("aria-valuetext",fmt(time)+", Kapitel "+(index+1)+": "+scenes[index].title);byId("clock").textContent=fmt(time)+" / "+fmt(total);}
 function stop(){playing=false;if(frame!==null)cancelAnimationFrame(frame);frame=null;byId("play").textContent=time>=total?"▶ Noch einmal":"▶ Gesamtablauf";byId("play").setAttribute("aria-label","Gesamtablauf abspielen");}
 function tick(stamp){if(!playing)return;time=Math.min(total,time+Math.min((stamp-last)/1000,.1)*Number(byId("speed").value));last=stamp;render();if(time>=total)stop();else frame=requestAnimationFrame(tick);}
 function play(){if(playing){stop();return;}if(time>=total)time=0;playing=true;last=performance.now();byId("play").textContent="Ⅱ Pause";byId("play").setAttribute("aria-label","Animation pausieren");frame=requestAnimationFrame(tick);}
 function seek(value){stop();time=clamp(Number(value)||0,0,total);render();}
 byId("play").addEventListener("click",play);byId("timeline").addEventListener("input",e=>seek(e.target.value));byId("back").addEventListener("click",()=>seek(scenes[Math.max(0,index-1)].at));byId("next").addEventListener("click",()=>seek(scenes[Math.min(scenes.length-1,index+1)].at));byId("replay").addEventListener("click",()=>{seek(scenes[index].at);play();});byId("level").addEventListener("change",()=>{byId("advanced").hidden=byId("level").value!=="advanced";});
 document.addEventListener("visibilitychange",()=>{if(document.hidden){wasPlaying=playing;stop();}else if(wasPlaying){wasPlaying=false;play();}});
 // Pausierter Start; auch bei reduzierter Bewegung nur bewusste Wiedergabe.
 motion.addEventListener("change",()=>{if(motion.matches)stop();});
 new ResizeObserver(resize).observe(canvas);resize();stop();
})();
