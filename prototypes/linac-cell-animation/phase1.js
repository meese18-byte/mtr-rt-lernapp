"use strict";
/* Own cutaway geometry. Animation time is not physical time. See SOURCES.md. */
(() => {
  const $ = id => document.getElementById(id);
  const canvas = $("phaseCanvas"), c = canvas.getContext("2d"), M = window.LinacPhaseModel, Camera = window.LinacCamera;
  const C = {bg:"#070e17",ink:"#ecf2f4",dim:"#91a8bb",cyan:"#8be7e9",purple:"#bea3ff",field:"#f0a5d1",force:"#b8ecc3",gold:"#e4b682"};
  const scenes = [
    {at:0,end:12,name:"Orientierung",title:"Vom Gerät zum Elektron",kind:"ORIENTIERUNG / BAUTEILE",caption:"Außenform nach Elekta Synergy → Verkleidung ausblenden → vereinfachter Lehrschnitt der Beschleunigungsstrecke.",text:"Die Außenform orientiert sich am Elekta Synergy. Für den Blick ins Innere blendet die Kamera die Verkleidung aus. Die gezeigte Funktionsgeometrie ist didaktisch vereinfacht. Die Elektronenkanone liefert Teilchen; eine HF-Quelle, beispielsweise ein Magnetron, liefert Energie über einen eigenen Hohlleiter. Die Pulssteuerung stimmt die Injektion auf die HF-Leistung ab. Die Beschleunigungsstruktur bleibt evakuiert und wassergekühlt.",takeaway:"Zwei getrennte Wege – zeitlich aufeinander abgestimmt.",question:"Was gelangt durch den violetten Hohlleiter?",answer:"HF-Energie. Die für den Therapiestrahl bestimmten Elektronen kommen aus der Elektronenkanone und bewegen sich entlang der zentralen Achse. Das Vakuum ermöglicht den Transport; es erzeugt die Beschleunigungsenergie nicht. Ein Magnetron erzeugt Mikrowellen; ein Klystron verstärkt ein zugeführtes HF-Signal. Welches System eingesetzt wird, hängt von der Bauart ab.",source:"IAEA 5.5.5–5.5.9 · Schlegel et al., S. 419–420",description:"Eine am Elekta Synergy orientierte Außenansicht mit heller runder Gantry, geschlossenem Arm, Strahlkopf, kV-Bildgebungsarmen und schwarzer Patientenliege. Die Verkleidung wird für den vereinfachten Lehrschnitt ausgeblendet. Die Kamera fährt vom Gesamtgerät zur aufgeschnittenen kupferfarbenen Beschleunigungsstruktur. Links mündet die Elektronenkanone in die zentrale Achse. Oberhalb führt ein violett markierter Hohlleiter von der HF-Quelle zur Struktur. Zwei blaue Leitungen stehen für die Kühlung; ein Pumpenanschluss für das Vakuum."},
    {at:12,end:28,name:"Elektronenquelle",title:"Wärme macht Elektronen verfügbar",kind:"ELEKTRONENKANONE / DETAIL",caption:"Beispiel einer Diodenkanone: Glühemission, Fokussierung und gepulste Injektion durch die Anodenöffnung.",text:"Die Heizung erwärmt die Kathode. Elektronen können ihre Oberfläche verlassen. Die Anode liegt gegenüber der Kathode auf höherem Potential; das elektrische Feld beschleunigt die Elektronen zur Anodenöffnung. Eine geformte Elektrode bündelt den Strahl. In diesem Diodenmodell erzeugen Spannungspulse die Injektion; die Heizung bleibt an.",takeaway:"Heizung ermöglicht die Emission. Das elektrische Feld bewirkt die gerichtete Beschleunigung.",question:"Entstehen an der Kathode schon die Therapiephotonen?",answer:"Hier werden Elektronen bereitgestellt und injiziert. Die zur Behandlung genutzte Bremsstrahlung entsteht später am Target. Die Kathode bleibt auch zwischen den Injektionspulsen heiß. Der Strom hängt von der Kanonenbauart und ihren Betriebsparametern ab; die Filamenttemperatur allein beschreibt die Steuerung nicht vollständig. Injektionspulse und die viel kürzeren HF-Elektronenpakete sind verschiedene Zeitskalen.",source:"IAEA 5.5.5 · generische Diodenkanone, keine Herstellerzeichnung",description:"Im Schnitt der Elektronenkanone liegen von links nach rechts eine Heizwendel, die emittierende Kathode, eine sie umgebende Fokussierelektrode und eine Anode mit zentraler Öffnung. Elektronen fliegen von der Kathode durch diese Öffnung. E-Feld und Kraft auf das negative Elektron zeigen in entgegengesetzte Richtungen."},
    {at:28,end:52,name:"Wanderwelle",title:"Der richtige Moment zählt",kind:"WANDERWELLE / FELD & PAKET",caption:"Bereits gebündelte Elektronen: Die passende beschleunigende Feldphase wandert mit ihnen nach rechts.",text:"An einem festen Ort wechselt das E-Feld seine Richtung. Ein passend eintreffendes Elektronenpaket trifft weiter stromab erneut auf eine beschleunigende Feldphase. Für das negativ geladene Elektron zeigt die Kraft entgegengesetzt zum E-Feld.",takeaway:"E nach links → Kraft auf e⁻ nach rechts. So nimmt das Paket Energie auf.",question:"Warum sind nicht alle Feldpfeile gleichgerichtet?",answer:"Die HF-Feldphase hängt von Ort und Zeit ab. Elektronen im passenden Phasenbereich erhalten Energie; ein beliebiger Eintrittszeitpunkt garantiert das nicht. Die Zell- und Irisgeometrie bestimmt Feldverteilung und Kopplung; die Öffnungen sind keine mechanischen Linsen. Hier sehen wir den bereits gebündelten, relativistischen Abschnitt innerhalb eines HF-Pulses. Buncher und magnetische Strahloptik sind in diesem Ausschnitt nicht berechnet.",source:"Schlegel et al., S. 415–416, Abb. 20.23–20.27 · IAEA 5.5.7",description:"Neun aufgeschnittene Resonatorzellen. Rosa Pfeile zeigen die zeitlich wechselnde axiale elektrische Feldrichtung. Türkise Elektronenpakete wandern nach rechts; grüne Kraftpfeile zeigen bei diesen Paketen nach rechts. Das darunterliegende Diagramm zeigt dieselbe E-Feldphase entlang der Achse. Die Pakete liegen im negativen E-Feldbereich."},
    {at:52,end:68,name:"Energiegewinn",title:"Mehr Energie. Fast gleiche Geschwindigkeit.",kind:"RELATIVISTISCHER ABSCHNITT / ENERGIE",caption:"Gewähltes Beispiel im bereits relativistischen Abschnitt: Die kinetische Energie steigt von 2 auf 6 MeV.",text:"Elektronen sind hier bereits nahe an der Lichtgeschwindigkeit. Durch die weitere Energieaufnahme steigt ihre Geschwindigkeit nur noch wenig. Deshalb zeigt eine eigene Anzeige den Energiegewinn – die Bewegung allein wäre dafür kein guter Maßstab.",takeaway:"Beschleunigung bedeutet hier vor allem: höhere kinetische Energie und höherer Impuls.",question:"Warum wird das Elektron nicht dreimal so schnell?",answer:"Die Beziehung E = ½mv² gilt hier nicht mehr als gute Näherung. Relativistisch ergeben sich bei 2 MeV etwa 97,91 % und bei 6 MeV etwa 99,69 % der Lichtgeschwindigkeit. Die Masse in Ruhe bleibt unverändert. Die angezeigten 2 MeV sind nicht die Energie unmittelbar nach der Elektronenkanone.",source:"Krieger, Kap. 1.2.1 · Rechenbeispiel, keine Maschinenparameter",description:"Ein markiertes Elektronenpaket durchläuft den bereits relativistischen Teil der Beschleunigungsstruktur. Ein Balken und eine Zahlenanzeige zeigen den gewählten Anstieg seiner kinetischen Energie von 2 auf 6 MeV. Die daraus berechnete Geschwindigkeit wächst nur von etwa 97,91 auf 99,69 Prozent der Lichtgeschwindigkeit. Rechts führt der Elektronenweg weiter zum späteren Strahltransport und Target."}
  ];
  const TOTAL = scenes.at(-1).end, reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let equipmentMode="tour", exteriorAngle="oblique", pose, project, coverOpacity=1;
  const surfaceRenderer=window.LinacSurface?.create();
  let W=1280,H=690,mobile=false,dpr=1,time=0,active=-1,playing=false,raf=null,last=0,shownWidth=-1;
  const clamp=(n,a=0,b=1)=>Math.min(b,Math.max(a,n)),mix=(a,b,p)=>a+(b-a)*p,mod=(x,n)=>(x%n+n)%n;
  const smooth=p=>{p=clamp(p);return p*p*(3-2*p);};
  const fmt=t=>String(Math.floor(t/60)).padStart(2,"0")+":"+String(Math.floor(t%60)).padStart(2,"0");
  const number=(v,d=2)=>v.toLocaleString("de-DE",{minimumFractionDigits:d,maximumFractionDigits:d});
  function text(value,x,y,size=20,color=C.ink,align="left",weight=500){c.font=weight+" "+size+"px ui-sans-serif,system-ui,sans-serif";c.textAlign=align;c.textBaseline="middle";c.fillStyle=color;c.fillText(value,x,y);}
  function line(points,color,width=1,dash=[]){if(!points.length)return;c.beginPath();points.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.strokeStyle=color;c.lineWidth=width;c.setLineDash(dash);c.stroke();c.setLineDash([]);}
  function polygon(points,fill,stroke){c.beginPath();points.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=.7;c.stroke();}}
  function dot(x,y,r,fill){c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fillStyle=fill;c.fill();}
  function roundRect(x,y,w,h,r,fill,stroke){c.beginPath();c.roundRect(x,y,w,h,r);c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=1;c.stroke();}}
  function arrow(a,b,color,width=2.3,head=8){if(Math.hypot(b[0]-a[0],b[1]-a[1])<2)return;line([a,b],color,width);const ang=Math.atan2(b[1]-a[1],b[0]-a[0]);polygon([b,[b[0]-head*Math.cos(ang-.5),b[1]-head*Math.sin(ang-.5)],[b[0]-head*Math.cos(ang+.5),b[1]-head*Math.sin(ang+.5)]],color);}
  function makeGlow(rgb){const el=document.createElement("canvas");el.width=el.height=80;const ctx=el.getContext("2d"),g=ctx.createRadialGradient(40,40,0,40,40,40);g.addColorStop(0,"rgba("+rgb+",.8)");g.addColorStop(.15,"rgba("+rgb+",.45)");g.addColorStop(1,"rgba("+rgb+",0)");ctx.fillStyle=g;ctx.fillRect(0,0,80,80);return el;}
  const glow=makeGlow("139,231,233"),warm=makeGlow("255,121,55");
  function electron(p,r=10,alpha=1){c.save();c.globalAlpha*=alpha;c.drawImage(glow,p[0]-r,p[1]-r,r*2,r*2);dot(p[0],p[1],Math.max(1.8,r*.17),"#ceffff");c.restore();}
  function camera({scale=1,yaw=.22,pitch=-.42,roll=0,focus=[0,0,0],cx=W*.5,cy=H*.5}={}){return p=>{const x=p[0]-focus[0],y=p[1]-focus[1],z=p[2]-focus[2],xx=x*Math.cos(yaw)+z*Math.sin(yaw),zz=-x*Math.sin(yaw)+z*Math.cos(yaw),yy=y*Math.cos(pitch)+zz*Math.sin(pitch),depth=-y*Math.sin(pitch)+zz*Math.cos(pitch),persp=48/(48+depth),dx=xx*scale*persp,dy=yy*scale*persp;return[cx+dx*Math.cos(roll)-dy*Math.sin(roll),cy+dx*Math.sin(roll)+dy*Math.cos(roll),depth];};}
  const materials={copper:[187,112,63],steel:[143,164,179],dark:[49,71,87],ceramic:[187,188,174],purple:[101,80,145],coil:[105,150,177],porcelain:[239,239,230],shell:[184,194,198],teal:[153,184,205],carbon:[27,32,37],screen:[19,31,36],alloy:[164,169,166],gasket:[62,71,77]};
  function ring(x0,x1,inner,outer,{cut=true,material="copper",steps=32}={}){
    const faces=[],start=cut?-.03:0,end=cut?Math.PI+.03:Math.PI*2,base=materials[material];
    const at=(x,r,a)=>[x,Math.sin(a)*r,Math.cos(a)*r];
    function paint(a,side=false){const brightness=.47+.62*Math.max(0,Math.cos(a-.72));return "rgb("+base.map(v=>Math.round(clamp(v*brightness+(side?25:0),0,255))).join(",")+")";}
    for(let i=0;i<steps;i++){const a=mix(start,end,i/steps),b=mix(start,end,(i+1)/steps);faces.push({p:[at(x0,outer,a),at(x1,outer,a),at(x1,outer,b),at(x0,outer,b)],fill:paint(a)});if(inner)faces.push({p:[at(x1,inner,a),at(x0,inner,a),at(x0,inner,b),at(x1,inner,b)],fill:paint(a+.12)});for(const x of [x0,x1])faces.push({p:[at(x,inner,a),at(x,outer,a),at(x,outer,b),at(x,inner,b)],fill:paint(a,true),stroke:"#ffeecc19"});}
    if(cut)for(const a of [start,end])faces.push({p:[at(x0,inner,a),at(x1,inner,a),at(x1,outer,a),at(x0,outer,a)],fill:paint(0,true),stroke:"#ffeecc44"});return faces;
  }
  function box(x,y,z,w,h,d,mat="steel"){
    const v=[[x,y,z],[x+w,y,z],[x+w,y+h,z],[x,y+h,z],[x,y,z+d],[x+w,y,z+d],[x+w,y+h,z+d],[x,y+h,z+d]],base=materials[mat];
    const normals=[[0,0,-1],[0,0,1],[0,-1,0],[0,1,0],[-1,0,0],[1,0,0]];
    return [[0,1,2,3],[4,5,6,7],[0,1,5,4],[3,2,6,7],[0,3,7,4],[1,2,6,5]].map((inds,i)=>({p:inds.map(j=>v[j]),base,normal:normals[i],fill:"rgb("+base.map(v=>Math.round(v*[.6,.8,1.1,.45,.62,.9][i])).join(",")+")",stroke:"#dbe6f21f"}));
  }
  function drawMesh(faces,proj,alpha=1){c.save();c.globalAlpha*=alpha;faces.filter(f=>!f.normal||f.normal[0]*Math.sin(pose.yaw)*Math.cos(pose.pitch)+f.normal[1]*Math.sin(pose.pitch)-f.normal[2]*Math.cos(pose.yaw)*Math.cos(pose.pitch)>0).map(f=>{const p=f.p.map(proj);return{f,p,z:p.reduce((a,v)=>a+v[2],0)/p.length};}).sort((a,b)=>b.z-a.z).forEach(({f,p})=>polygon(p,f.fill,f.stroke));c.restore();}
  function transformed(faces,scale,offset){return faces.map(f=>({...f,p:f.p.map(p=>p.map((v,i)=>v*scale+offset[i]))}));}
  function worldLine(pts,proj,color,width=2,dash=[]){line(pts.map(proj),color,width,dash);}
  function worldArrow(a,b,proj,color,width=2.3,head=8){arrow(proj(a),proj(b),color,width,head);}
  function label(str,point,x,y,{color=C.gold,small=false}={}){
    if(!$("labels").checked || pose.annotations===0)return;const fs=mobile?(small?24:27):(small?17:20),pad=11;c.font="500 "+fs+"px ui-sans-serif,system-ui,sans-serif";const w=c.measureText(str).width+2*pad,h=fs+20;const xx=clamp(x,14,W-w-14),yy=clamp(y,14,H-h-14);
    const tx=clamp(point[0],xx+10,xx+w-10),ty=point[1]>yy+h?yy+h:yy;line([point,[tx,ty]],"#b6c9d176",1.2,[3,5]);dot(point[0],point[1],3,color);roundRect(xx,yy,w,h,4,"#08121ded","#7d9baf38");c.fillStyle=color;c.fillRect(xx,yy+7,2,h-14);text(str,xx+pad,yy+h/2,fs,C.ink);
  }
  function tag(str,x,y,color=C.dim){text(str,x,y,mobile?21:16,color);}
  function background(){c.fillStyle=C.bg;c.fillRect(0,0,W,H);const g=c.createRadialGradient(W*.53,H*.43,0,W*.53,H*.43,W*.7);g.addColorStop(0,"#1a2b3d");g.addColorStop(.7,"#0a1421");g.addColorStop(1,"#060d16");c.fillStyle=g;c.fillRect(0,0,W,H);c.save();c.globalAlpha=.12;for(let x=0;x<W;x+=60)line([[x,0],[x,H]],"#4c6b82",.6);for(let y=0;y<H;y+=60)line([[0,y],[W,y]],"#4c6b82",.6);c.restore();}
  const cavity=[];for(let n=-4;n<=4;n++){cavity.push(...ring(n-.46,n+.46,.69,.91),...ring(n+.46,n+.54,.135,.91));for(const delta of [-.3,.31])cavity.push(...ring(n+delta,n+delta+.025,.91,.928,{steps:20}));}
  const overviewCells=transformed(cavity,.77,[.66,0,0]);
  const gun=[];
  gun.push(...ring(-3.15,1.35,.94,1.04,{material:"steel"}),...ring(-3.28,-3.15,.44,1.18,{material:"steel"}),...ring(1.35,1.55,.26,1.14,{material:"steel"}));
  gun.push(...ring(-2.43,-1.65,.47,.67,{material:"steel"}),...ring(-2.17,-1.93,0,.34,{material:"copper"}),...ring(-2.74,-2.56,.08,.43,{material:"ceramic"}),...ring(-.10,.10,.18,.82,{material:"steel"}),...ring(.22,2.3,.28,.38,{material:"steel"}));
  const overviewGun=transformed(gun,.52,[-4.15,0,0]);
  const overviewRF=[...box(-4.7,-2.3,-.30,1.55,.66,.66,"purple"),...box(-3.15,-2.03,-.15,.75,.26,.3,"purple"),...box(-2.66,-1.77,-.15,.26,1.0,.3,"purple"),...ring(-2.75,-2.35,.52,.80,{cut:false,steps:48})];
  function packet(proj,x,{big=false,force=false}={}){for(let n=0;n<11;n++){const a=n*2.399,y=Math.sin(a)*.039,z=Math.cos(a)*.039,xx=x+(n%3-1)*.035;electron(proj([xx,y,z]),big?19:11);}if(big){const q=proj([x,0,0]);c.save();c.strokeStyle="#a9fffc99";c.setLineDash([4,5]);c.lineWidth=1.2;c.beginPath();c.arc(q[0],q[1],22,0,2*Math.PI);c.stroke();c.restore();}if(force&&$("forces").checked)worldArrow([x,-.25,0],[x+.43,-.25,0],proj,C.force,3,10);}
  function waveFields(proj,t){if(!$("fields").checked)return;for(let n=-4;n<=4;n++){const f=M.field(n,t),len=.34*f;if(Math.abs(f)<.035){const p=proj([n,-.35,0]);dot(p[0],p[1],2,C.field);continue;}worldArrow([n-len/2,-.35,0],[n+len/2,-.35,0],proj,C.field,2.5,8);}}
  function helix(proj,offset=[0,0,0],scale=1){const pts=[];for(let i=0;i<=220;i++){const u=i/220,a=u*2*Math.PI*7;pts.push([(-2.58+u*.35)*scale+offset[0],Math.sin(a)*.18*scale+offset[1],Math.cos(a)*.18*scale+offset[2]]);}worldLine(pts,proj,"#a54222",mobile?8:7);worldLine(pts,proj,"#ffc080",mobile?3:2.5);}
  function magneticOptics(proj){
    // Generic cutaway coils, NOT an Elekta assembly or a magnetic field solver.
    for(const x of [-1.5,.8]){
      drawMesh(ring(x-.22,x+.22,.73,1.05,{material:"coil"}),proj);
      for(let n=0;n<6;n++)drawMesh(ring(x-.21+n*.075,x-.19+n*.075,1.05,1.075,{material:"copper",steps:24}),proj);
    }
    for(const [x,axis] of [[2.5,0],[3.4,1]])for(const sign of [-1,1]){
      const pts=[[-.28,-.22],[.28,-.22],[.28,.22],[-.28,.22],[-.28,-.22]].map(([a,b])=>axis?[x+a,b,sign*.83]:[x+a,sign*.83,b]);
      worldLine(pts,proj,"#425e78",10);worldLine(pts,proj,"#c59a6d",4);
      const foot=axis?[x,0,sign*.70]:[x,sign*.70,0],top=axis?[x,0,sign*.83]:[x,sign*.83,0];worldLine([foot,top],proj,"#7290a5",6);
    }
  }
  function opticsPrinciples(){
    const y=H*.80,h=H*.14,w=W*.44;
    for(let k=0;k<2;k++){
      const x=W*(k?.52:.04);roundRect(x,y,w,h,5,"#081521ed","#49657d77");
      text(k?"Fokus: Strahlbreite":"Steuern: Strahlachse",x+12,y+20,mobile?23:19,C.ink);
      const left=x+18,right=x+w-18,mid=mix(left,right,.48),cy=y+h*.66;
      line([[left,cy],[right,cy]],"#6e8c9e88",1,[3,5]);
      for(const d of [-1,0,1])line(k?[[left,cy+d*h*.19],[mid,cy+d*h*.19],[right,cy+d*h*.04]]:[[left,cy+h*.18+d*5],[mix(left,right,.30),cy+h*.18+d*5],[mix(left,right,.68),cy+d*5],[right,cy+d*5]],C.cyan,1.7);
    }
    text("Funktionsprinzip · keine berechneten Bahnen",W*.5,H*.98,mobile?20:16,C.dim,"center");
  }
  function housing(points,z,depth,material="dark"){
    const base=materials[material],colour=f=>"rgb("+base.map(v=>Math.round(v*f)).join(",")+")";
    const front=points.map(([x,y])=>[x,y,z+depth]),back=points.map(([x,y])=>[x,y,z]);
    const faces=[{p:back,base,normal:[0,0,-1],fill:colour(.6)},{p:front,base,normal:[0,0,1],fill:colour(.9),stroke:"#aac4d329"}];
    points.forEach((p,i)=>{const j=(i+1)%points.length;faces.push({p:[back[i],back[j],front[j],front[i]],base,normal:[points[j][1]-p[1],p[0]-points[j][0],0],fill:colour(points[j][0]>p[0]?1.2:.65),stroke:"#aac4d321"});});return faces;
  }
  // Own exterior geometry; Elekta Synergy brochure (2017), pp. 1 and 3.
  // Dimensions and internal cutaway are illustrative, not a manufacturer CAD model.
  const ISO=[5.1,4.65,0];
  function turned(profile,{axis="x",center=[0,0,0],material="porcelain",steps=96,stretch=1}={}){
    const rgb=materials[material],faces=[];
    const at=(v,r,a)=>axis==="x"?[v+center[0],center[1]+r*Math.cos(a),center[2]+r*Math.sin(a)*stretch]:axis==="y"?[center[0]+r*Math.cos(a),v+center[1],center[2]+r*Math.sin(a)*stretch]:[center[0]+r*Math.cos(a),center[1]+r*Math.sin(a)*stretch,v+center[2]];
    for(let j=0;j<profile.length-1;j++)for(let k=0;k<steps;k++){
      const a=k/steps*2*Math.PI,b=(k+1)/steps*2*Math.PI,[v0,r0]=profile[j],[v1,r1]=profile[j+1];
      const dx=v1-v0,dr=r1-r0,len=Math.hypot(dx,dr)||1,mid=(a+b)/2;
      const n=axis==="x"?[-dr/len,dx*Math.cos(mid)/len,dx*Math.sin(mid)/len]:axis==="y"?[dx*Math.cos(mid)/len,-dr/len,dx*Math.sin(mid)/len]:[dx*Math.cos(mid)/len,dx*Math.sin(mid)/len,-dr/len];
      const light=.71+.28*Math.max(0,n[0]*.5-n[1]*.65-n[2]*.57);
      const fill="rgb("+rgb.map(x=>Math.round(clamp(x*light,0,255))).join(",")+")";
      faces.push({p:[at(v0,r0,a),at(v1,r1,a),at(v1,r1,b),at(v0,r0,b)],fill,stroke:fill,normal:n,base:rgb,smooth:true});
    }return faces;
  }
  // Rounded rectangular cross-sections: a housing, not a cylinder/capsule.
  function loft(stations, material="porcelain", steps=64){
    const faces=[],rgb=materials[material],rings=stations.map(([x,y,ry,rz])=>Array.from({length:steps},(_,i)=>{
      const a=2*Math.PI*i/steps,cs=Math.cos(a),sn=Math.sin(a),f=v=>Math.sign(v)*Math.abs(v)**.55;
      return [x,y+ry*f(cs),rz*f(sn)];
    }));
    for(let j=0;j<rings.length-1;j++)for(let k=0;k<steps;k++){
      const q=(k+1)%steps,p=[rings[j][k],rings[j+1][k],rings[j+1][q],rings[j][q]];
      const u=p[1].map((v,i)=>v-p[0][i]),v=p[3].map((v,i)=>v-p[0][i]);
      let n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
      const len=Math.hypot(...n)||1;n=n.map(v=>-v/len);
      const light=.72+.27*Math.max(0,n[0]*.5-n[1]*.7-n[2]*.5),fill="rgb("+rgb.map(v=>Math.round(v*light)).join(",")+")";
      faces.push({p,fill,stroke:fill,normal:n,base:rgb,smooth:true});
    }return faces;
  }
  const gantryHardware=[
    ...turned([[-6.8,0],[-6.8,5.25],[-6.65,5.65],[-6.35,5.91],[-5.9,6],[-3.25,6],[-2.92,5.92],[-2.65,5.7],[-2.5,5.35],[-2.5,0]],{center:[0,4.65,0]}),
    ...box(-7.15,10.55,-2.25,5.2,.28,4.5,"shell")
  ];
  // Classic Synergy: pale blue front, broad grey ring, neutral central cover.
  const hubHardware=[
    turned([[-2.48,5.38],[-2.39,5.32],[-2.39,0]],{center:[0,4.65,0],material:"teal"}),
    turned([[-2.37,4.97],[-2.31,4.95],[-2.19,4.8],[-2.13,4.6],[-2.14,4.34],[-2.22,4.14],[-2.3,4.04]],{center:[0,4.65,0],material:"alloy"}),
    turned([[-2.28,2.05],[-2.18,2.02],[-2.13,1.9],[-2.13,0]],{center:[0,4.65,0],material:"shell"})
  ];
  const headHardware=[
    ...turned([[.56,0],[.56,1.56],[.66,1.72],[.82,1.74],[.93,1.71],[.94,0]],{axis:"y",center:[5.1,0,0]}),
    ...turned([[.94,0],[.94,1.61],[1.03,1.61],[1.03,0]],{axis:"y",center:[5.1,0,0],material:"gasket"}),
    ...turned([[1.03,0],[1.03,1.62],[1.14,1.68],[1.35,1.7],[2.08,1.67],[2.28,1.55],[2.4,1.3],[2.4,0]],{axis:"y",center:[5.1,0,0],material:"alloy"}),
    ...turned([[2.4,0],[2.4,1.19],[2.47,1.18],[2.47,0]],{axis:"y",center:[5.1,0,0],material:"gasket"}),
    ...box(4.6,2.48,-.5,1,.04,1,"screen")
  ];
  const armCover=loft([[-6.5,-.6,.01,.01],[-6.45,-.6,.73,.82],[-6.25,-.6,1.1,1.18],[-5.85,-.65,1.48,1.33],[-4.6,-.65,1.57,1.38],[-2.2,-.65,1.6,1.44],[.6,-.69,1.59,1.52],[3.4,-.66,1.57,1.75],[5.7,-.61,1.55,1.83],[6.34,-.52,1.29,1.76],[6.56,-.42,.88,1.52],[6.62,-.42,.01,.01]]);
  const openArm=[...box(-5.85,.85,-.9,10.2,.15,1.8,"shell"),...box(-5.85,-.85,.86,10.2,1.7,.12,"dark")];
  const imagingHardware=[];
  // Articulated housings and joints; positions are an illustrative deployed state.
  for(const sign of [-1,1]){
    imagingHardware.push(...box(-2.4,4.9,sign*4.5-.4,1.35,1.1,.8,"porcelain"),
      ...housing([[-1.8,5.0],[.1,5.2],[2.8,4.9],[3.25,5.2],[2.9,5.7],[.1,5.8],[-1.8,5.6]],sign*4.1-.22,.44,"porcelain"),
      ...box(2.6,4.4,sign*4.1-.25,1.9,1,.5,"shell"),
      ...turned([[sign*4.1-.31,0],[sign*4.1-.31,.42],[sign*4.1+.31,.42],[sign*4.1+.31,0]],{axis:"z",center:[2.8,5.2,0],material:"alloy",steps:48}));
  }
  imagingHardware.push(
    // kV source housing, aperture faces across the isocentre.
    ...turned([[-4.85,0],[-4.85,.45],[-4.65,.86],[-4.38,.98],[-3.7,.94],[-3.45,.63],[-3.4,0]],{axis:"z",center:[5.1,4.65,0],stretch:1.18}),
    ...turned([[-3.4,0],[-3.4,.35],[-3.28,.35],[-3.28,0]],{axis:"z",center:[5.1,4.65,0],material:"gasket"}),
    // kV receptor with a thick frame and rear mount.
    ...box(3.78,3.36,4.16,2.65,2.58,.25,"porcelain"),...box(3.98,3.57,4.13,2.25,2.16,.035,"screen"),
    ...box(4.65,4.1,4.41,.7,1.15,.22,"shell"),
    // MV support below couch: visible wide linkage and detector rim.
    ...box(-2.2,8.3,-.48,3.2,.65,.96,"porcelain"),...box(.9,8.38,-.34,3.1,.42,.68,"shell"),
    ...box(3.65,7.8,-.34,1.65,.85,.68,"porcelain"),
    ...box(3.5,7.51,-1.55,3.2,.22,3.1,"porcelain"),...box(3.72,7.48,-1.33,2.76,.035,2.66,"screen")
  );
  const couchHardware=[
    ...housing([[2.15,5.17],[13.5,5.17],[13.72,5.25],[13.72,5.4],[2.15,5.4]],-1.12,2.24,"carbon"),
    ...housing([[8.2,5.42],[13.9,5.42],[14.0,5.55],[13.92,5.9],[8.45,5.9]],-1.15,2.3,"porcelain"),
    ...box(9.15,6.05,-1.2,4.1,1.06,2.4,"carbon"),
    ...box(9.0,7.15,-1.3,4.45,1.15,2.6,"porcelain"),
    ...box(9.3,8.35,-1.2,3.85,2.12,2.4,"carbon"),
    ...box(8.9,10.48,-1.5,4.65,.3,3,"shell")
  ];
  for(let j=0;j<10;j++)couchHardware.push(...box(9.12,6.03+j*.108,-1.23,4.16,.035,2.46,"gasket"));
  for(let j=0;j<20;j++)couchHardware.push(...box(9.27,8.35+j*.105,-1.23,3.91,.035,2.46,"gasket"));
  // Room-side displays and short support wings, with a distinct display orientation.
  const displays=[];
  for(const sign of [-1,1])displays.push(...box(-2.5,3.4,sign*5.8-.4,1.1,.45,.8,"porcelain"),
    ...box(-2.1,2.45,sign*6.2-.85,.28,1.65,1.7,"porcelain"),
    ...box(-1.8,2.62,sign*6.2-.69,.025,1.27,1.38,"screen"));
  const deviceHardware=[...gantryHardware,...hubHardware.flat(),...headHardware,...imagingHardware,...couchHardware,...displays];
  const assemblyHardware = [...overviewCells,...overviewGun,...overviewRF,
    ...box(-4.5,-1.64,-.21,.16,.7,.42,"steel"),...box(-3.5,-1.64,-.21,.16,.7,.42,"steel"),
    ...ring(-3.0,-2.72,.145,.21,{cut:true,material:"steel"}),
    ...box(.25,.68,-.16,.40,1.01,.32,"dark"),...box(-.05,1.69,-.38,1,.55,.76,"dark")];
  const toGun = p => [p[0]*.52-4.15,p[1]*.52,p[2]*.52];
  const toWave = p => [p[0]*.77+.66,p[1]*.77,p[2]*.77];
  const gunProject = p => project(toGun(p)), waveProject = p => project(toWave(p));
  function deviceContext(){
    const ratio=pose.scale/Camera.poses(mobile).whole.scale,a=clamp((2.35-ratio)/1.35,.025,1);
    c.save();c.globalAlpha=a;
    const floor=project([1.5,10.8,0]);c.save();c.translate(floor[0],floor[1]);c.scale(1,.22);const sh=c.createRadialGradient(0,0,10,0,0,pose.scale*12);sh.addColorStop(0,"#00000066");sh.addColorStop(1,"#00000000");c.fillStyle=sh;c.fillRect(-pose.scale*13,-pose.scale*13,pose.scale*26,pose.scale*26);c.restore();
    const rendered=surfaceRenderer?.render(deviceHardware,pose,W,H,dpr);
    if(rendered)c.drawImage(rendered,0,0,W,H);else{drawMesh(gantryHardware,project);for(const hub of hubHardware)drawMesh(hub,project);drawMesh([...headHardware,...imagingHardware,...couchHardware,...displays],project);}
    deviceDetails();
    // The orientation cross and reference axes are not active beams.
    worldLine([[5.1,2.5,0],ISO,[5.1,5.15,0]],project,"#e6c494aa",1,[4,6]);
    const q=project(ISO);line([[q[0]-8,q[1]],[q[0]+8,q[1]]],"#f0d09c",1.3);line([[q[0],q[1]-8],[q[0],q[1]+8]],"#f0d09c",1.3);
    c.restore();
  }
  function deviceDetails(){
    // Fine mechanical features are illustrative, not functional controls.
    for(let n=0;n<72;n++){
      const a=n/72*Math.PI*2, r=n%6===0?1.55:1.63;
      worldLine([[5.1+Math.cos(a)*r,.84,Math.sin(a)*r],[5.1+Math.cos(a)*1.71,.84,Math.sin(a)*1.71]],project,"#555e62",n%6===0?1.1:.55);
    }
    const guard=[];for(let n=0;n<=80;n++){const a=n/80*Math.PI*2;guard.push([5.1+Math.cos(a)*1.87,2.56,Math.sin(a)*1.87]);}
    worldLine(guard,project,"#abb8bd",1.6);
    for(const z of [-1.6,1.6])worldLine([[4.35,2.2,z],[4.35,2.56,z],[5.85,2.56,z],[5.85,2.2,z]],project,"#b5c1c5",1.2);
    // Indexing notches along the couch rails.
    for(let x=3;x<13.4;x+=.5)for(const z of [-1.13,1.13])worldLine([[x,5.15,z],[x,5.23,z]],project,"#9ca7ab",.9);
    for(const z of [-1.31,1.31])worldLine([[9.25,7.5,z],[12.9,7.5,z],[12.9,7.95,z],[9.25,7.95,z],[9.25,7.5,z]],project,"#8c969b",.8);
    // Gantry scale on the inner ring; all values intentionally omitted.
    for(let n=0;n<96;n++){
      const a=n/96*Math.PI*2,r=n%8===0?4.15:4.23;
      worldLine([[-2.12,4.65+r*Math.cos(a),r*Math.sin(a)],[-2.12,4.65+4.31*Math.cos(a),4.31*Math.sin(a)]],project,"#69757c",n%8===0?1:.45);
    }
    for(let n=0;n<8;n++){
      const a=n/8*Math.PI*2,q=project([-2.1,4.65+2.0*Math.cos(a),2.0*Math.sin(a)]);dot(q[0],q[1],Math.max(.6,pose.scale*.023),"#6c7980");
    }
  }
  function exterior(){
    if(coverOpacity<=0)return;
    const rendered=surfaceRenderer?.render(armCover,pose,W,H,dpr);
    if(rendered){c.save();c.globalAlpha*=coverOpacity;c.drawImage(rendered,0,0,W,H);c.restore();}else drawMesh(armCover,project,coverOpacity);
    c.save();c.globalAlpha=coverOpacity;
    for(const sign of [-1,1])worldLine([[-5.9,.44,sign*1.24],[-3,.5,sign*1.43],[.6,.46,sign*1.51],[3.4,.5,sign*1.74],[5.65,.5,sign*1.82],[6.35,.43,sign*1.51]],project,"#727f8277",.9);
    worldLine([[3.55,-1.99,-1.2],[3.55,-1.1,-1.75],[3.55,.48,-1.75]],project,"#8c999b66",.85);
    c.restore();
  }
  function assembly(t){
    const proj=project;
    worldLine([[-2.5,.5,-.4],[-2.5,.98,-.78],[3.8,.98,-.78],[3.8,.5,-.4]],proj,"#285a77",5);
    worldLine([[-2.5,.5,.4],[-2.5,.98,.78],[3.8,.98,.78],[3.8,.5,.4]],proj,"#347c9a",5);
    drawMesh(openArm,proj,.3);drawMesh(assemblyHardware,proj);helix(proj,[-4.15,0,0],.52);
    if(equipmentMode==="optics"&&active===0)magneticOptics(proj);
    const cath=proj(toGun([-1.93,0,0])),r=clamp(pose.scale*.13,5,45);c.drawImage(warm,cath[0]-r,cath[1]-r,2*r,2*r);
    if(active===0){
      worldLine([[-5.8,0,0],[4.35,0,0]],proj,"#79cbdc29",1,[4,6]);
      for(const e of M.emissionAges(t,1.65,54)){const x=-5.12+e.age/1.65*9.45;if(x<-2.75||x>-2.35)electron(proj([x,Math.sin(e.index)*.02,0]),7);}
    }
    const hfRoute=[[-3.9,-1.96,0],[-2.53,-1.96,0],[-2.53,-.65,0]];
    worldLine(hfRoute,proj,M.pulse(t).rf?"#cfb7ff99":"#65547b",2.5);
    if(M.pulse(t).rf)for(let i=0;i<5;i++){
      const u=mod(t*.25+i/5,1),p=u<.5?[mix(-3.9,-2.53,u*2),-1.96,0]:[-2.53,mix(-1.96,-.65,(u-.5)*2),0],q=proj(p);dot(q[0],q[1],3,C.purple);
    }
  }
  function wholeLabels(){
    label("Beschleunigerarm",project([0,-2.25,0]),W*.04,H*.055,{color:C.cyan});
    label("Strahlkopf",project([5.1,1.2,-1.3]),W*.67,H*.18,{small:true});
    label("Runde Gantry",project([-2.45,6.7,-4.6]),W*.025,H*.52,{small:true});
    label("kV-Bildgebung",project([5.1,4.8,-4.0]),W*.025,H*.74,{small:true});
    label("Patientenliege",project([11.5,5.2,-.95]),W*.70,H*.67,{small:true});
    if(equipmentMode!=="exterior"||exteriorAngle!=="front")label("MV-Bildempfänger",project([5.1,7.5,-1]),W*.36,H*.84,{small:true});
    else text("MV-Panel hinter dem Tisch verdeckt · Schrägansicht wählen",W*.5,H*.86,mobile?19:16,C.dim,"center");
    label("Isozentrum",project(ISO),W*.67,H*.44,{small:true,color:"#f0d09c"});
    text("Außenform nach Elekta Synergy",W*.5,H*.92,mobile?25:22,C.ink,"center");
    text("Eigene Geometrie · Proportionen angenähert",W*.5,H*.97,mobile?19:16,C.dim,"center");
  }
  function overview(){
    if(pose.transition){
      text(pose.region==="assembly"?"IN DIE BESCHLEUNIGUNGSSTRECKE":"ZUR ELEKTRONENQUELLE",W*.5,H*.92,mobile?22:19,C.cyan,"center");return;
    }
    if(pose.region==="whole"){wholeLabels();return;}
    const proj=project;
    c.save();c.globalAlpha=pose.annotations;
    if(equipmentMode==="optics"){
      label("Fokussierspulen",proj([-1.5,.95,0]),W*.04,H*.07,{color:"#a7c6dd"});
      label("Steuerspulen",proj([2.5,-.83,0]),W*.53,H*.66,{color:"#a7c6dd"});
      label("Elektronenachse",proj([1.5,0,0]),W*.04,H*.66,{color:C.cyan});
      opticsPrinciples();c.restore();return;
    }
    label("HF-Quelle",proj([-4,-2,0]),W*.05,H*.06,{color:C.purple});
    label("Elektronenkanone",proj([-5.05,0,0]),W*.025,H*(mobile?.64:.75),{color:C.cyan});
    label("Beschleunigungsstruktur",proj([1.2,.2,0]),W*(mobile?.34:.46),H*(mobile?.09:.12));
    label("Kühlung",proj([2,.98,.78]),W*.65,H*(mobile?.68:.76),{color:"#78b8db"});
    label("Vakuumpumpe",proj([.4,1.82,0]),W*.20,H*(mobile?.84:.87),{small:true});
    tag("Elektronenweg →",W*.055,H*.95,C.cyan);c.restore();
  }
  function source(t){
    const proj=gunProject;
    worldLine([[-2.98,-.08,.10],[-2.68,-.08,.10]],proj,"#b2997d",3);worldLine([[-2.98,.09,-.10],[-2.68,.09,-.10]],proj,"#b2997d",3);
    const on=M.pulse(t).injection;
    for(const {age,index:j} of M.emissionAges(t,.65,42)){const u=age/.65,x=mix(-1.91,2.2,u**1.35),radius=.23*(1-u)**2+.015;electron(proj([x,Math.sin(j*2.4)*radius,Math.cos(j*2.4)*radius]),10);}
    if(on){if($("fields").checked)worldArrow([-.45,-.32,0],[-1.2,-.32,0],proj,C.field,2.6,10);if($("forces").checked)worldArrow([-1.2,-.12,0],[-.45,-.12,0],proj,C.force,2.6,10);}
    if(pose.transition){text("WEITER ZUM HF-FELD · NEUE ZEITSKALA",W*.5,H*.93,mobile?22:19,C.cyan,"center");return;}
    c.save();c.globalAlpha=pose.annotations;
    label("Heizung",proj([-2.42,.08,0]),W*.04,H*.09,{color:"#f8ae72"});
    label("Kathode (−)",proj([-1.93,.15,0]),W*.04,H*(mobile?.70:.78),{color:C.cyan});
    label("Anode mit Öffnung",proj([0,.24,0]),W*.53,H*.08);
    label("Fokussierelektrode",proj([-1.75,.49,.2]),W*.39,H*(mobile?.81:.85));
    const statusX=W*.06,statusY=H*(mobile?.91:.94);dot(statusX,statusY,5,on?C.cyan:"#47616e");tag(on?"Injektionspuls: Elektronen treten aus":"Injektion aus · Kathode bleibt heiß",statusX+17,statusY,on?C.cyan:C.dim);c.restore();
  }
  function fieldChart(t,onlyX=null){
    const x=W*(mobile?.08:.11),y=H*(mobile?.75:.75),w=W*(mobile?.84:.78),h=H*(mobile?.19:.19),base=y+h*.57,amp=h*.23;
    roundRect(x,y,w,h,6,"#07131fdf","#5c7d9640");text("Eₓ entlang der Achse",x+15,y+22,mobile?23:17,C.field);
    const sx=v=>x+35+(v+4.5)/9*(w-70);line([[sx(-4.5),base],[sx(4.5),base]],"#5e718177",1);
    if($("fields").checked){const pts=[];for(let v=-4.5;v<=4.51;v+=.04)pts.push([sx(v),base-M.field(v,t)*amp]);line(pts,C.field,2);}
    if(onlyX===null)for(const v of M.packets(t,-4.5,4.5)){dot(sx(v),base+amp,5,C.cyan);}else dot(sx(onlyX),base-M.field(onlyX,t)*amp,6,C.cyan);
    text("+",x+16,base-amp,mobile?20:15,C.dim);text("−",x+16,base+amp,mobile?20:15,C.dim);text("0",x+16,base,mobile?17:13,C.dim);
    text("Ort →",x+w-15,y+22,mobile?20:15,C.dim,"right");
  }
  function rf(t){
    const proj=waveProject;
    worldLine([[-4.6,0,0],[4.7,0,0]],proj,"#9feeee33",1,[4,5]);waveFields(proj,t);
    const ps=M.packets(t,-4.4,4.4);for(const x of ps)packet(proj,x,{big:true,force:true});
    label("Irisöffnung",proj([.52,.14,0]),W*.07,H*.055);
    label("Resonatorzelle",proj([2.2,.62,0]),W*.56,H*(mobile?.62:.12));
    if(ps.length)label("e⁻-Pakete",proj([ps[Math.floor(ps.length/2)],0,0]),W*.08,H*(mobile?.60:.57),{color:C.cyan});
    fieldChart(t);text("Bereits gebündelt · v ≈ c",W*.5,H*.98,mobile?20:16,C.dim,"center");
  }
  function energy(p){
    const x=-4+8*p,t=x*M.period/M.wavelength,proj=waveProject;
    waveFields(proj,t);worldLine([[-4.5,0,0],[x,0,0]],proj,"#89e7e951",2);packet(proj,x,{big:true,force:true});
    label("Markiertes Elektronenpaket",proj([x,0,0]),W*.06,H*.06,{color:C.cyan});
    label("Weiter zu Phase 02 →",proj([4.6,0,0]),W*(mobile?.42:.61),H*(mobile?.62:.18),{small:true});
    const bx=W*.10,by=H*.79,bw=W*.8,bh=mobile?16:12;
    text("Kinetische Energie",bx,by-30,mobile?26:22,C.ink);text(number(M.kinetic(x))+" MeV",bx+bw,by-30,mobile?30:27,C.cyan,"right");roundRect(bx,by,bw,bh,5,"#2a4051");roundRect(bx,by,Math.max(3,bw*p),bh,5,C.cyan);
    text("2 MeV",bx,by+bh+25,mobile?22:18,C.dim);text("6 MeV",bx+bw,by+bh+25,mobile?22:18,C.dim,"right");text("Gewählter Energieverlauf · keine Geräteauslegung",W*.5,H*.95,mobile?21:16,C.dim,"center");
    $("kinetic").innerHTML=number(M.kinetic(x))+" <b>MeV</b>";$("beta").innerHTML=number(100*M.beta(M.kinetic(x)))+" <b>% c</b>";
  }
  function pulseDiagram(t){
    const p=M.pulse(t),x=p.phase/M.pulseCycle*600;
    $("pulseCursor").setAttribute("x1",x);$("pulseCursor").setAttribute("x2",x);
    $("rfSignal").classList.toggle("signal-on",p.rf);$("injectionSignal").classList.toggle("signal-on",p.injection);
    const state=p.injection?"HF aktiv · Elektronen werden injiziert":p.rf?"HF aktiv · keine neue Injektion":"Pulspause · Kathode weiterhin heiß";
    $("pulseStatus").textContent=state;$("pulseSvg").setAttribute("aria-label","Schematischer Pulsablauf: "+state+". HF-Puls und Injektionsfenster sind abgestimmt; die Kathode bleibt heiß.");
  }
  function overviewExplanation(){
    if(active!==0)return;
    const optics=equipmentMode==="optics",outside=equipmentMode==="exterior",s=scenes[0];
    for(const b of $("deviceAngles").querySelectorAll("button"))b.setAttribute("aria-pressed",String(outside&&b.dataset.angle===exteriorAngle));
    $("exteriorMode").setAttribute("aria-pressed",String(outside));
    $("tourMode").setAttribute("aria-pressed",String(equipmentMode==="tour"));$("supplyMode").setAttribute("aria-pressed",String(equipmentMode==="supply"));$("opticsMode").setAttribute("aria-pressed",String(optics));
    $("viewTitle").textContent=optics?"Steuern und fokussieren":outside?"Das Gerät wiedererkennen":equipmentMode==="supply"?"Zwei Wege, ein Ziel":s.title;
    $("viewText").textContent=outside?"Die Außenform orientiert sich am Elekta Synergy: breite Gantry mit Skalenring, kantig gerundeter Arm, abgesetzter Kollimatorkopf und freitragende Tischplatte. Die kV-Bildgebungsarme liegen seitlich, der MV-Bildempfänger gegenüber dem Therapiekopf unter der Liege. In der Kamerafahrt wird die Verkleidung für den Lehrschnitt ausgeblendet.":optics?"Steuerspulen korrigieren Lage und Richtung der Strahlachse. Fokussierspulen beeinflussen den Strahlquerschnitt. Beide wirken über Magnetfelder auf die Elektronenbahn; die Energie für die Beschleunigung kommt aus dem HF-Feld.":s.text;
    $("takeaway").textContent=outside?"Therapiekopf, kV-Bildgebung und MV-Bildempfänger haben unterschiedliche Aufgaben.":optics?"Strahlachse und Strahlbreite sind zwei unterschiedliche Aufgaben.":s.takeaway;
    $("sceneCaption").textContent=outside?"An Elekta Synergy orientierte Außenansicht. Bildgebungsarme schematisch ausgefahren; keine maßstäbliche Kollisionsprüfung.":optics?"Generische Spulenanordnung im Halbschnitt. Anzahl und Position sind beispielhaft; keine Herstellergeometrie.":s.caption;
    $("question").textContent=outside?"Welche Bauteile gehören zur Bildgebung?":optics?"Sind Steuerspulen dasselbe wie Quadrupole?":s.question;
    $("answer").textContent=outside?"Die seitlichen Arme tragen die kV-Röntgenquelle und den gegenüberliegenden kV-Detektor. Das Panel unter der Liege ist der MV-Bildempfänger gegenüber dem Therapiekopf. Das Kreuz markiert das Isozentrum. Die gestrichelte Linie ist eine Orientierungshilfe, kein eingeschalteter Strahl.":optics?"Nein. „Steuern“ und „Fokussieren“ benennen Funktionen; „Dipol“, „Quadrupol“ und „Solenoid“ beschreiben unterschiedliche Magnetfeldanordnungen. Sie sind keine austauschbaren Begriffe. Hier sind Fokussierspulen und zwei schematische Steuer-Spulenpaare gezeigt. Ihre Felder und die daraus entstehenden Bahnen werden nicht berechnet.":s.answer;
    $("sceneSource").textContent=outside?"Elekta Synergy Produktbroschüre, 2017, S. 1 und 3 · eigene Modellierung":optics?"Schlegel et al., S. 419, Abb. 20.34 · IAEA 5.5.10":s.source;
    canvas.setAttribute("aria-label",outside?"Helle, runde Gantry mit hellblauer Front, Skalenring, kantig gerundetem Beschleunigerarm und abgesetztem metallfarbenem Kollimatorkopf nach dem Erscheinungsbild eines Elekta Synergy. Seitliche kV-Bildgebung und MV-Panel unter der schwarzen Patientenliege. Ausgefahrene Bildgebung und Proportionen sind schematisch.":optics?"Kupferne Beschleunigungsstruktur mit zwei beispielhaften ringförmigen Fokussierspulen und zwei Steuer-Spulenpaaren. Darunter getrennte Prinzipskizzen: Steuerung korrigiert die Strahlachse, Fokussierung verändert die Strahlbreite. Keine berechneten Teilchenbahnen.":s.description);
  }
  function sceneIndex(t){return t>=TOTAL?scenes.length-1:scenes.findIndex(s=>t>=s.at&&t<s.end);}
  function updateScene(i){const s=scenes[i];$("sceneKind").textContent=String(i+1).padStart(2,"0")+" / "+s.kind;$("viewNumber").textContent=String(i+1).padStart(2,"0");$("viewTitle").textContent=s.title;$("viewText").textContent=s.text;$("sceneCaption").textContent=s.caption;$("takeaway").textContent=s.takeaway;$("question").textContent=s.question;$("answer").textContent=s.answer;$("sceneSource").textContent=s.source;$("check").open=false;$("equipmentModes").hidden=i!==0;$("deviceAngles").hidden=i!==0;$("pulsePanel").hidden=i>1;$("energyReadout").hidden=i!==3;$("fieldStep").hidden=i!==2;$("next").disabled=i===3;canvas.setAttribute("aria-label",s.description);[...$("views").children].forEach((b,n)=>n===i?b.setAttribute("aria-current","step"):b.removeAttribute("aria-current"));overviewExplanation();}
  function orientation(){
    const labels={whole:"Gesamtgerät",assembly:"Beschleunigungsstrecke",gun:"Elektronenkanone",wave:"HF-Feld · relativistischer Abschnitt"};
    $("locationText").textContent=labels[pose.region];
    $("cameraState").textContent=pose.transition?"Kamerafahrt":$("cameraMotion").checked?"Räumlich verbunden":"Feste Perspektive";
    const regions={whole:[-7.3,-2.8,22,13.9],assembly:[-6,-2.5,10.5,4.7],gun:[-5.9,-.8,3.2,1.7],wave:[-2.9,-.8,7.2,1.8]};
    const r=regions[pose.region];["x","y","width","height"].forEach((key,i)=>$("locatorFocus").setAttribute(key,r[i]));
    canvas.setAttribute("aria-description","Aktueller Ort: "+labels[pose.region]+". "+(pose.transition?"Die Kamera bewegt sich zum markierten Bereich.":"Der markierte Bereich ist in der Geräteübersicht hervorgehoben."));
  }
  function draw(){
    const i=sceneIndex(time),s=scenes[i],t=time-s.at,p=clamp(t/(s.end-s.at));
    if(i!==active){active=i;updateScene(i);}
    pose=Camera.sample(time,mobile,{mode:equipmentMode,motion:$("cameraMotion").checked,angle:exteriorAngle});
    project=camera({...pose,cy:H*pose.cy});
    coverOpacity=active===0?(equipmentMode==="exterior"?1:equipmentMode==="tour"?($("cameraMotion").checked?1-smooth((time-2.5)/3.5):(time<3?1:0)):0):0;
    c.setTransform(dpr,0,0,dpr,0,0);background();deviceContext();
    if(coverOpacity<1){c.save();c.globalAlpha=1-coverOpacity;assembly(t);c.restore();}exterior();
    if(i===0)overview(t);else if(i===1)source(t);else if(i===2)rf(t);else energy(p);
    orientation();if(i<2)pulseDiagram(t);
    $("timeline").value=time;$("clock").textContent=fmt(time)+" / "+fmt(TOTAL);$("timeline").setAttribute("aria-valuetext",fmt(time)+", "+s.name);
  }
  function resize(){const width=canvas.clientWidth;if(width===shownWidth)return;shownWidth=width;mobile=width<650;W=mobile?760:1280;H=mobile?850:690;dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=W*dpr;canvas.height=H*dpr;canvas.style.aspectRatio=W+" / "+H;draw();}
  function stop(message){playing=false;if(raf!==null)cancelAnimationFrame(raf);raf=null;$("play").textContent=time>=TOTAL?"▶ Noch einmal":time>0?"▶ Fortsetzen":"▶ Phase starten";$("play").setAttribute("aria-label","Animation abspielen");if(message)$("playerStatus").textContent=message;}
  function advance(dt){const before=sceneIndex(time),end=scenes[before].end,next=Math.min(TOTAL,time+dt);if($("pauseBetween").checked&&before<3&&time<end&&next>=end){time=end;draw();stop("Ansichtwechsel. Mit Fortsetzen beginnt die nächste Ansicht.");return;}time=next;draw();if(time>=TOTAL)stop("Phase 01 abgeschlossen. Jetzt können wir die Darstellung gemeinsam prüfen.");}
  function tick(stamp){if(!playing)return;const dt=Math.min(Math.max((stamp-last)/1000,0),.12)*Number($("speed").value);last=stamp;advance(dt);if(playing)raf=requestAnimationFrame(tick);}
  function play(){if(equipmentMode==="exterior"&&active===0){equipmentMode="tour";overviewExplanation();draw();}if(playing){stop("Pausiert. Zeitleiste und Ansichten bleiben bedienbar.");return;}if(time>=TOTAL){time=0;draw();}playing=true;last=performance.now();$("play").textContent="Ⅱ Pause";$("play").setAttribute("aria-label","Animation pausieren");$("playerStatus").textContent=$("pauseBetween").checked?"Läuft bis zum nächsten Bildwechsel.":"Die gesamte Phase läuft.";raf=requestAnimationFrame(tick);}
  function seek(t){stop();time=clamp(Number(t)||0,0,TOTAL);draw();stop(time>=TOTAL?"Phase 01 abgeschlossen.":"Pausiert · "+scenes[active].name+". Mit Fortsetzen abspielen.");}
  scenes.forEach((s,i)=>{const b=document.createElement("button");b.type="button";b.innerHTML="<small>"+String(i+1).padStart(2,"0")+" · "+fmt(s.at)+"</small>"+s.name;b.addEventListener("click",()=>seek(s.at));$("views").append(b);});
  for(const mode of ["tour","exterior","supply","optics"])$(mode+"Mode").addEventListener("click",()=>{equipmentMode=mode;if(mode==="tour"||mode==="exterior"){seek(0);overviewExplanation();}else{stop("Bauteilansicht pausiert. Mit Fortsetzen abspielen.");overviewExplanation();draw();}});
  for(const button of $("deviceAngles").querySelectorAll("button"))button.addEventListener("click",()=>{exteriorAngle=button.dataset.angle;equipmentMode="exterior";seek(0);overviewExplanation();for(const b of $("deviceAngles").querySelectorAll("button"))b.setAttribute("aria-pressed",String(b===button));});
  $("play").addEventListener("click",play);$("restart").addEventListener("click",()=>seek(0));$("next").addEventListener("click",()=>seek(scenes[Math.min(active+1,3)].at));$("timeline").addEventListener("input",e=>seek(e.target.value));
  $("orient").addEventListener("click",()=>{equipmentMode="tour";seek(0);overviewExplanation();});
  for(const id of ["labels","fields","forces","cameraMotion"])$(id).addEventListener("change",draw);
  $("fieldStep").addEventListener("click",()=>{if(active!==2)return;seek(scenes[2].at+mod(time-scenes[2].at+M.period/8,scenes[2].end-scenes[2].at));$("playerStatus").textContent="Feld und Elektronenpakete gemeinsam um ⅛ HF-Periode weitergesetzt.";});
  $("fullscreen").addEventListener("click",async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if($("film").requestFullscreen)await $("film").requestFullscreen();else canvas.scrollIntoView({block:"start"});}catch{canvas.scrollIntoView({block:"start"});}});
  document.addEventListener("visibilitychange",()=>{if(document.hidden&&playing)stop("Pausiert, weil die Ansicht verlassen wurde.");});reduced.addEventListener("change",()=>{if(reduced.matches){$("cameraMotion").checked=false;stop("Kamerafahrten deaktiviert. Wiedergabe kann bewusst gestartet werden.");draw();}});
  // Deterministic hooks for visual QA; no student state or network activity.
  window.linacPhase1={renderAt:seek,total:TOTAL,model:M,geometryBounds:()=>{const ps=[...gantryHardware,...armCover,...headHardware,...imagingHardware,...couchHardware,...displays].flatMap(f=>f.p.map(project));return {minX:Math.min(...ps.map(p=>p[0])),maxX:Math.max(...ps.map(p=>p[0])),minY:Math.min(...ps.map(p=>p[1])),maxY:Math.max(...ps.map(p=>p[1]))};},getState:()=>({time,active,playing,width:W,height:H,pose,equipmentMode,exteriorAngle,coverOpacity,surfaceRenderer:!!surfaceRenderer}),advanceForTest:advance};
  $("cameraMotion").checked=!reduced.matches;
  const initial=Number(new URLSearchParams(location.search).get("view"));if(Number.isInteger(initial)&&initial>=1&&initial<=4)time=scenes[initial-1].at;
  new ResizeObserver(resize).observe(canvas);resize();stop("Startbereit. Jede Ansicht lässt sich einzeln betrachten.");
})();
