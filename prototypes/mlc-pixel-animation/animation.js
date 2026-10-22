"use strict";
/**
 * MLC-Pixelpilot: rein didaktische Geometrie, KEIN Dosismodell.
 * 20 gegenüberliegende Lamellenpaare folgen einer stilisierten Zielprojektion.
 * Die zweite Ansicht ist ein geometrisch gekoppelter Längsschnitt eines Streifens.
 * Keine klinische Feldform, keine Fluenz-/Dosisrechnung.
 */
(() => {
  const NS = "http://www.w3.org/2000/svg";
  const TOTAL = 28;
  const PAIRS = 20;
  const CENTER = 220;
  const FIRST_Y = 43;
  const PITCH = 13.6;
  const OPEN_HALF = 162;
  const SOURCE_Y = 22;
  const REFERENCE_Y = 234;
  const MLC_TOP = 86;
  const MLC_BOTTOM = 108;
  const BEAM_END = 333;
  const DISPLAY_SCALE = .78;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const phaseData = [
    { at: 0, label: "FELD OFFEN", detail: "Strahl aus: Die Lamellen sind zurückgezogen. Rechts siehst du den geometrischen Strahlweg des türkis markierten Streifens." },
    { at: 5, label: "MLC FÄHRT EIN", detail: "Strahl aus: Jedes Lamellenpaar passt seine Öffnung an die Zielprojektion an. Nicht benötigte Paare schließen im Modell vollständig." },
    { at: 14, label: "FELD ANGEPASST", detail: "Die seitliche Feldöffnung ist geformt. Ober- und unterhalb der Zielprojektion ist kein Mittelspalt mehr offen." },
    { at: 19, label: "KOLLIMIERTER STRAHLWEG", detail: "Die Randstrahlen werden am MLC begrenzt und laufen geradlinig weiter. Gewebe vor und hinter dem Ziel wird mit durchstrahlt." }
  ];

  const byId = id => document.getElementById(id);
  const leafGroup = byId("leafGroup");
  const fieldShape = byId("fieldShape");
  const fieldHalo = byId("fieldHalo");
  const beamCone = byId("beamCone");
  const tissueLayer = byId("tissueLayer");
  const tissueBeam = byId("tissueBeam");
  const tissueHatch = byId("tissueHatch");
  const beamOutline = byId("beamOutline");
  const beamRays = byId("beamRays");
  const incidentBeam = byId("incidentBeam");
  const mlcLeft = byId("mlcLeft");
  const mlcRight = byId("mlcRight");
  const mlcOpening = byId("mlcOpening");
  const sliceTarget = byId("sliceTarget");
  const selectedStrip = byId("selectedStrip");
  const pairIndex = byId("pairIndex");
  const targetContour = byId("targetContour");
  const showBeamPath = byId("showBeamPath");
  const showTarget = byId("showTarget");
  const playPause = byId("playPause");
  const playIcon = byId("playIcon");
  const playText = byId("playText");
  const timeline = byId("timeline");
  const beamStatus = byId("beamStatus");
  const doseLed = byId("doseLed");
  const timeDisplay = byId("timeDisplay");

  let current = 0;
  let playing = false;
  let frameId = null;
  let lastFrame = 0;
  let previousPhase = -1;
  let wasPlayingBeforeHide = false;
  let selectedPair = Number(pairIndex.value) - 1;

  const createSVG = (tag, attrs = {}) => {
    const node = document.createElementNS(NS, tag);
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
    return node;
  };
  const clamp = value => Math.min(1, Math.max(0, value));
  const ease = x => { const a = clamp(x); return a * a * (3 - 2 * a); };
  const fmt = time => "00:" + String(Math.floor(time)).padStart(2, "0");

  const leaves = Array.from({ length: PAIRS }, (_, i) => {
    const y = FIRST_Y + i * PITCH;
    const left = createSVG("rect", {
      x: 14, y, width: 166, height: PITCH, fill: "#7f9db8",
      stroke: "#15283d", "stroke-width": 1
    });
    const right = createSVG("rect", {
      x: 260, y, width: 166, height: PITCH, fill: "#7f9db8",
      stroke: "#15283d", "stroke-width": 1
    });
    const shineL = createSVG("line", { x1: 16, y1: y + 2, x2: 170, y2: y + 2, stroke: "#e0edf7", "stroke-width": 1, opacity: .63 });
    const shineR = createSVG("line", { x1: 270, y1: y + 2, x2: 424, y2: y + 2, stroke: "#e0edf7", "stroke-width": 1, opacity: .63 });
    leafGroup.append(left, right, shineL, shineR);
    return { left, right, shineL, shineR, y };
  });

  // Die SVG-Zielkontur besteht ausschließlich aus M/L/Z-Polygonsegmenten.
  // Beide Ansichten und die Lamellen verwenden dieselbe synthetische Geometrie.
  const coordinates = targetContour.getAttribute("d").match(/-?\d+(?:\.\d+)?/g).map(Number);
  const targetVertices = [];
  for (let i = 0; i < coordinates.length; i += 2) targetVertices.push([coordinates[i], coordinates[i + 1]]);
  const targetMinY = Math.min(...targetVertices.map(([, y]) => y));
  const targetMaxY = Math.max(...targetVertices.map(([, y]) => y));

  function targetBounds(lowY, highY) {
    // Eine bloße Berührung am obersten/untersten Eckpunkt öffnet keinen Streifen.
    if (highY <= targetMinY || lowY >= targetMaxY) return null;
    const xs = targetVertices.filter(([, y]) => y >= lowY && y <= highY).map(([x]) => x);
    targetVertices.forEach(([x1, y1], i) => {
      const [x2, y2] = targetVertices[(i + 1) % targetVertices.length];
      if (y1 === y2) return;
      for (const y of [lowY, highY]) {
        if (y >= Math.min(y1, y2) && y <= Math.max(y1, y2)) xs.push(x1 + (x2 - x1) * (y - y1) / (y2 - y1));
      }
    });
    return xs.length ? { left: Math.min(...xs), right: Math.max(...xs) } : null;
  }

  const finalOpenings = leaves.map(({ y }) => {
    const bounds = targetBounds(y, y + PITCH);
    // Sechs SVG-Einheiten Abstand sind nur grafischer Abstand, KEIN klinischer Margin.
    return bounds ? { left: bounds.left - 6, right: bounds.right + 6 } : { left: CENTER, right: CENTER };
  });

  // u ist die BEV-Koordinate in der Bezugsebene. Alle Randstrahlen haben denselben Fokus.
  const rayX = (u, y) => CENTER + (u - CENTER) * DISPLAY_SCALE * (y - SOURCE_Y) / (REFERENCE_Y - SOURCE_Y);
  const polygonPath = points => points.map(([x, y], i) => (i ? "L" : "M") + x.toFixed(2) + " " + y.toFixed(2)).join(" ") + " Z";

  function renderSlice(opening, on) {
    const rowY = FIRST_Y + (selectedPair + .5) * PITCH;
    const bounds = targetBounds(rowY, rowY);
    const open = opening.right - opening.left > .01;
    const leftTop = rayX(opening.left, MLC_TOP);
    const rightTop = rayX(opening.right, MLC_TOP);
    const leftBottom = rayX(opening.left, MLC_BOTTOM);
    const rightBottom = rayX(opening.right, MLC_BOTTOM);
    const beam = open ? polygonPath([[leftBottom, MLC_BOTTOM], [rightBottom, MLC_BOTTOM], [rayX(opening.right, BEAM_END), BEAM_END], [rayX(opening.left, BEAM_END), BEAM_END]]) : "";
    beamCone.setAttribute("d", beam);
    tissueBeam.setAttribute("d", beam);
    tissueHatch.setAttribute("d", beam);
    beamOutline.setAttribute("d", open ? "M" + leftBottom + " " + MLC_BOTTOM + "L" + rayX(opening.left, BEAM_END) + " " + BEAM_END + "M" + rightBottom + " " + MLC_BOTTOM + "L" + rayX(opening.right, BEAM_END) + " " + BEAM_END : "");
    beamOutline.setAttribute("stroke-dasharray", on ? "none" : "5 5");
    mlcLeft.setAttribute("d", polygonPath([[58, MLC_TOP], [leftTop, MLC_TOP], [leftBottom, MLC_BOTTOM], [58, MLC_BOTTOM]]));
    mlcRight.setAttribute("d", polygonPath([[rightTop, MLC_TOP], [382, MLC_TOP], [382, MLC_BOTTOM], [rightBottom, MLC_BOTTOM]]));
    mlcOpening.setAttribute("d", open ? polygonPath([[leftTop, MLC_TOP], [rightTop, MLC_TOP], [rightBottom, MLC_BOTTOM], [leftBottom, MLC_BOTTOM]]) : "");
    incidentBeam.setAttribute("d", polygonPath([[CENTER, SOURCE_Y], [rayX(CENTER + OPEN_HALF, MLC_TOP), MLC_TOP], [rayX(CENTER - OPEN_HALF, MLC_TOP), MLC_TOP]]));
    beamRays.setAttribute("d", open ? [.15, .325, .5, .675, .85].map(f => {
      const u = opening.left + (opening.right - opening.left) * f;
      return "M" + rayX(u, MLC_BOTTOM) + " " + MLC_BOTTOM + "L" + rayX(u, BEAM_END) + " " + BEAM_END;
    }).join(" ") : "");
    beamRays.setAttribute("stroke-dashoffset", reducedMotion.matches ? "0" : String(-current * 24));
    beamRays.style.opacity = on ? ".75" : "0";
    beamCone.style.opacity = on ? ".24" : "0";
    incidentBeam.style.opacity = on ? ".3" : ".08";
    mlcOpening.style.opacity = on ? ".4" : ".1";
    tissueLayer.style.opacity = on && showBeamPath.checked ? "1" : "0";

    // Synthetisches Tiefenziel: dieselbe BEV-Silhouette, perspektivisch projiziert.
    // Kein anatomischer Schnitt und kein Tumor-/Dosisrekonstruktionsverfahren.
    const targetPoints = [];
    if (bounds) {
      const middle = (bounds.left + bounds.right) / 2;
      const half = (bounds.right - bounds.left) / 2;
      for (let n = 0; n < 64; n++) {
        const angle = 2 * Math.PI * n / 64;
        const depth = REFERENCE_Y + 40 * Math.sin(angle);
        targetPoints.push([rayX(middle + half * Math.cos(angle), depth), depth]);
      }
    }
    sliceTarget.setAttribute("d", targetPoints.length ? polygonPath(targetPoints) : "");
    byId("sliceTargetLabel").style.display = bounds ? "" : "none";
    byId("sliceTargetLabel").setAttribute("x", bounds ? rayX((bounds.left + bounds.right) / 2, REFERENCE_Y) : CENTER);
    byId("sliceState").textContent = open ? "FELD GEÖFFNET" : "PAAR GESCHLOSSEN";
    byId("sliceState").setAttribute("fill", open ? "#f6c65c" : "#59e5ce");
    byId("sliceNote").textContent = bounds ? "Ziel im Schnitt · Gewebe davor und dahinter" : "Kein Ziel in der Mitte dieses Streifens";
    selectedStrip.setAttribute("y", FIRST_Y + selectedPair * PITCH);
    const pairLabel = String(selectedPair + 1).padStart(2, "0");
    byId("pairReadout").textContent = pairLabel + " / 20";
    byId("slicePairLabel").textContent = "MLC · PAAR " + pairLabel;
    byId("sliceSubtitle").textContent = "Längsschnitt durch Streifen " + pairLabel;
    pairIndex.setAttribute("aria-valuetext", "Lamellenpaar " + (selectedPair + 1) + " von 20");
  }

  function getShapeProgress(t) {
    return ease((t - 5) / 9);
  }

  function getPhase(t) {
    if (t < 5) return 0;
    if (t < 14) return 1;
    if (t < 19) return 2;
    return 3;
  }

  function updateHeader(phase) {
    if (phase === previousPhase) return;
    previousPhase = phase;
    const data = phaseData[phase];
    byId("phaseIndicator").textContent = "PHASE " + String(phase + 1).padStart(2, "0") + " / 04";
    byId("phaseDot").textContent = String(phase + 1).padStart(2, "0");
    byId("phaseCaption").textContent = data.label;
    byId("phaseDetail").textContent = data.detail;
  }

  function render() {
    const p = getShapeProgress(current);
    const openings = [];
    const rectangles = [];
    leaves.forEach((item, i) => {
      const destination = finalOpenings[i];
      const leftTip = (CENTER - OPEN_HALF) * (1 - p) + destination.left * p;
      const rightTip = (CENTER + OPEN_HALF) * (1 - p) + destination.right * p;
      item.left.setAttribute("width", (leftTip - 14).toFixed(2));
      item.right.setAttribute("x", rightTip.toFixed(2));
      item.right.setAttribute("width", (426 - rightTip).toFixed(2));
      item.shineL.setAttribute("x2", (leftTip - 4).toFixed(2));
      item.shineR.setAttribute("x1", (rightTip + 4).toFixed(2));
      openings.push({ left: leftTip, right: rightTip });
      if (rightTip - leftTip > .01) rectangles.push(polygonPath([[leftTip, item.y], [rightTip, item.y], [rightTip, item.y + PITCH], [leftTip, item.y + PITCH]]));
    });
    // Exakte geometrische Öffnung je Lamellenstreifen, keine schrägen Verbindungen.
    fieldShape.setAttribute("d", rectangles.join(" "));
    fieldHalo.setAttribute("d", rectangles.join(" "));
    fieldShape.style.opacity = ".6";
    fieldHalo.style.opacity = "0";
    const on = current >= 19 && current < TOTAL;
    renderSlice(openings[selectedPair], on);
    targetContour.style.opacity = showTarget.checked ? "1" : "0";
    doseLed.classList.toggle("active", on);
    beamStatus.textContent = on ? "STRAHL EIN · MODELL" : "GEOMETRIE · STRAHL AUS";

    updateHeader(getPhase(current));
    if (getPhase(current) === 3) {
      const opening = openings[selectedPair];
      byId("phaseDetail").textContent = opening.right - opening.left <= .01
        ? "Dieses Lamellenpaar ist geschlossen: Der direkte Primärstrahl wird hier im idealisierten Modell abgefangen. Reale Transmission und Streuung sind nicht dargestellt."
        : phaseData[3].detail;
    }
    timeline.value = current.toFixed(2);
    timeline.style.setProperty("--played", (current / TOTAL * 100).toFixed(2) + "%");
    timeDisplay.textContent = fmt(current) + " / " + fmt(TOTAL);
  }

  function updatePlayButton() {
    playIcon.textContent = playing ? "Ⅱ" : "▶";
    playText.textContent = playing ? "PAUSE" : "ABSPIELEN";
    playPause.setAttribute("aria-label", playing ? "Animation pausieren" : "Animation abspielen");
  }

  function pause() {
    playing = false;
    if (frameId !== null) cancelAnimationFrame(frameId);
    frameId = null;
    updatePlayButton();
  }

  function tick(timestamp) {
    if (!playing) return;
    const elapsed = Math.max(0, Math.min((timestamp - lastFrame) / 1000, .1));
    lastFrame = timestamp;
    current += elapsed;
    if (current >= TOTAL) current = 0; // reel-artige Endlosschleife
    render();
    frameId = requestAnimationFrame(tick);
  }

  function play() {
    if (playing) return;
    playing = true;
    lastFrame = performance.now();
    updatePlayButton();
    frameId = requestAnimationFrame(tick);
  }

  function seek(t) {
    current = Math.max(0, Math.min(TOTAL, Number(t) || 0));
    if (current === TOTAL && playing) current = 0;
    lastFrame = performance.now();
    render();
  }

  playPause.addEventListener("click", () => playing ? pause() : play());
  byId("restart").addEventListener("click", () => { seek(0); play(); });
  byId("step").addEventListener("click", () => {
    pause();
    const next = phaseData.find(item => item.at > current + .05);
    seek(next ? next.at : 0);
  });
  timeline.addEventListener("input", event => { pause(); seek(event.target.value); });
  showBeamPath.addEventListener("change", render);
  pairIndex.addEventListener("input", event => {
    selectedPair = Math.max(0, Math.min(PAIRS - 1, Number(event.target.value) - 1));
    render();
  });
  showTarget.addEventListener("change", render);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      wasPlayingBeforeHide = playing;
      pause();
    } else if (wasPlayingBeforeHide) {
      wasPlayingBeforeHide = false;
      play();
    }
  });

  // Keine automatische Bewegung bei reduzierter Bewegungseinstellung.
  render();
  updatePlayButton();
  if (!reducedMotion.matches) play();
})();
