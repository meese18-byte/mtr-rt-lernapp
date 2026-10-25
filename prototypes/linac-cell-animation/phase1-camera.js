/* Camera coordinates only. They do not represent machine dimensions or particle physics. */
(function (root) {
  "use strict";
  const clamp = x => Math.max(0, Math.min(1, x));
  const ease = x => { x = clamp(x); return x * x * (3 - 2 * x); };
  const mix = (a, b, p) => a + (b - a) * p;
  function poses(mobile) {
    return {
      whole: { scale: mobile ? 40 : 60, focus: [1.1, 2.2, 0], yaw: .13, pitch: -.28, roll: 0, cy: .46 },
      assembly: { scale: mobile ? 65 : 100, focus: [-.55, -.18, 0], yaw: .19, pitch: -.47, roll: mobile ? -.54 : 0, cy: .46 },
      gun: { scale: mobile ? 250 : 365, focus: [-4.358, .026, 0], yaw: .24, pitch: -.5, roll: mobile ? -.45 : 0, cy: .46 },
      wave: { scale: mobile ? 91 : 143, focus: [.66, 0, 0], yaw: .15, pitch: -.5, roll: mobile ? -.57 : 0, cy: .42 }
    };
  }
  function blend(a, b, p) {
    const q = ease(p), v = {};
    for (const key of ["yaw", "pitch", "roll", "cy"]) v[key] = mix(a[key], b[key], q);
    v.scale = Math.exp(mix(Math.log(a.scale), Math.log(b.scale), q));
    v.focus = a.focus.map((n, i) => mix(n, b.focus[i], q));
    return v;
  }
  function sample(time, mobile = false, options = {}) {
    const t = Math.max(0, Math.min(68, time)), p = poses(mobile);
    const mode = options.mode || "tour", motion = options.motion !== false;
    if (t < 12 && mode !== "tour") return { ...p.assembly, region: "assembly", annotations: 1, transition: false };
    if (!motion) {
      const region = t < 3 ? "whole" : t < 12 ? "assembly" : t < 28 ? "gun" : "wave";
      return { ...p[region], region, annotations: 1, transition: false };
    }
    const flights = [[3, 7, "whole", "assembly"], [9, 12, "assembly", "gun"], [25, 28, "gun", "wave"]];
    for (const [start, end, from, to] of flights) {
      if (t >= start && t < end) {
        const q = (t - start) / (end - start);
        return { ...blend(p[from], p[to], q), region: to, annotations: 0, transition: true, from };
      }
    }
    const region = t < 3 ? "whole" : t < 9 ? "assembly" : t < 25 ? "gun" : "wave";
    return { ...p[region], region, annotations: 1, transition: false };
  }
  const api = { sample, poses };
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.LinacCamera = api;
})(typeof window !== "undefined" ? window : globalThis);
