"use strict";
/**
 * MLC-Pixelpilot: rein didaktische Geometrie, KEIN Dosismodell.
 * 20 gegenüberliegende Lamellenpaare folgen einer stilisierten Zielprojektion.
 * Die zweite Ansicht stellt eine qualitative Gewebedurchdringung dar.
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
  const phaseData = [
    { at: 0, label: "FELD OFFEN", detail: "Die Lamellen sind zurückgezogen. Eine große Feldöffnung würde seitlich auch viel gesundes Gewebe erfassen." },
    { at: 5, label: "MLC FÄHRT EIN", detail: "Die gegenüberliegenden Wolframlamellen werden paarweise unterschiedlich weit positioniert." },
    { at: 14, label: "FELD ANGEPASST", detail: "Die Feldöffnung folgt näherungsweise der Projektion des Zielvolumens – nicht seiner dreidimensionalen Oberfläche." },
    { at: 19, label: "SCHEMATISCHE EINSTRAHLUNG", detail: "Das Feld ist seitlich begrenzt. Trotzdem erhält auch Gewebe vor und hinter dem Ziel eine Dosis." }
  ];

  const byId = id => document.getElementById(id);
  const leafGroup = byId("leafGroup");
  const fieldShape = byId("fieldShape");
  const fieldHalo = byId("fieldHalo");
  const beamCone = byId("beamCone");
  const doseLayer = byId("doseLayer");
  const dosePath = byId("dosePath");
  const doseCloud = byId("doseCloud");
  const targetContour = byId("targetContour");
  const showDose = byId("showDose");
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
      x: 14, y, width: 166, height: PITCH - 1.25, fill: "#7f9db8",
      stroke: "#15283d", "stroke-width": 1.5
    });
    const right = createSVG("rect", {
      x: 260, y, width: 166, height: PITCH - 1.25, fill: "#7f9db8",
      stroke: "#15283d", "stroke-width": 1.5
    });
    const shineL = createSVG("line", { x1: 16, y1: y + 2, x2: 170, y2: y + 2, stroke: "#e0edf7", "stroke-width": 1, opacity: .63 });
    const shineR = createSVG("line", { x1: 270, y1: y + 2, x2: 424, y2: y + 2, stroke: "#e0edf7", "stroke-width": 1, opacity: .63 });
    leafGroup.append(left, right, shineL, shineR);
    return { left, right, shineL, shineR, y };
  });

  function targetHalfWidth(i) {
    // Feldprojektion absichtlich nur grob angenähert.
    const cy = FIRST_Y + i * PITCH + (PITCH - 1.25) / 2;
    const dist = (cy - 172) / 84;
    const silhouette = Math.sqrt(Math.max(0, 1 - dist * dist));
    const variation = Math.sin(i * 1.18) * 5 + Math.cos(i * .49) * 3;
    return Math.max(6, 7 + silhouette * 67 + (silhouette > .1 ? variation : 0));
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
    const leftPoints = [];
    const rightPoints = [];
    leaves.forEach((item, i) => {
      const half = OPEN_HALF * (1 - p) + (targetHalfWidth(i) + 8) * p;
      const leftTip = CENTER - half;
      const rightTip = CENTER + half;
      const widthL = Math.max(0, leftTip - 14);
      const widthR = Math.max(0, 426 - rightTip);
      item.left.setAttribute("width", widthL.toFixed(2));
      item.right.setAttribute("x", rightTip.toFixed(2));
      item.right.setAttribute("width", widthR.toFixed(2));
      item.shineL.setAttribute("x2", Math.max(16, leftTip - 4).toFixed(2));
      item.shineR.setAttribute("x1", Math.min(424, rightTip + 4).toFixed(2));
      leftPoints.push([leftTip, item.y]);
      rightPoints.push([rightTip, item.y]);
    });

    const top = FIRST_Y;
    const bottom = FIRST_Y + (PAIRS - 1) * PITCH + PITCH - 1.25;
    const path = [
      "M" + leftPoints[0][0].toFixed(1) + "," + top.toFixed(1),
      ...leftPoints.map(([x,y]) => "L" + x.toFixed(1) + "," + y.toFixed(1)),
      "L" + leftPoints[PAIRS-1][0].toFixed(1) + "," + bottom.toFixed(1),
      "L" + rightPoints[PAIRS-1][0].toFixed(1) + "," + bottom.toFixed(1),
      ...rightPoints.slice().reverse().map(([x,y]) => "L" + x.toFixed(1) + "," + y.toFixed(1)),
      "L" + rightPoints[0][0].toFixed(1) + "," + top.toFixed(1), "Z"
    ].join(" ");
    fieldShape.setAttribute("d", path);
    fieldHalo.setAttribute("d", path);
    // Das Feld ist eine Öffnung in BEV; es ist KEINE gemessene Fluenz.
    fieldShape.style.opacity = current >= 19 ? String(.72 + .06 * Math.sin(current * 10)) : ".58";
    fieldHalo.style.opacity = current >= 19 ? ".38" : ".14";

    // Rechte Ansicht: 2D-Schema einer EINZELNEN Einstrahlrichtung, keine Dosisberechnung.
    const beamHalf = 145 * (1 - p) + 70 * p;
    beamCone.setAttribute("d", "M203 55 L237 55 L" + (CENTER + beamHalf) + " 326 L" + (CENTER - beamHalf) + " 326 Z");
    dosePath.setAttribute("x", (CENTER - beamHalf).toFixed(1));
    dosePath.setAttribute("width", (beamHalf * 2).toFixed(1));
    doseCloud.setAttribute("rx", (beamHalf + 30).toFixed(1));

    const on = current >= 19 && current < TOTAL;
    doseLayer.style.opacity = on && showDose.checked ? "1" : "0";
    beamCone.style.opacity = on ? ".52" : ".15";
    targetContour.style.opacity = showTarget.checked ? "1" : "0";
    doseLed.classList.toggle("active", on);
    beamStatus.textContent = on ? "STRAHL EIN · MODELL" : "STRAHL AUS";

    updateHeader(getPhase(current));
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
  showDose.addEventListener("change", render);
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
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) play();
})();
