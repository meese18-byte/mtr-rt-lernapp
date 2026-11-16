const assert = require('node:assert/strict');
const Camera = require('../phase1-camera.js');
// Transitions must join without a spatial discontinuity at both ends.
for (const mobile of [false,true]) {
  for (const t of [3,7,9,12,25,28]) {
    const a=Camera.sample(t-1e-5,mobile),b=Camera.sample(t+1e-5,mobile);
    assert.ok(Math.abs(Math.log(a.scale/b.scale))<1e-7,`zoom discontinuity at ${t}`);
    assert.ok(a.focus.every((n,i)=>Math.abs(n-b.focus[i])<1e-7),`position discontinuity at ${t}`);
    for(const k of ['yaw','pitch','roll','cy']) assert.ok(Math.abs(a[k]-b[k])<1e-7);
  }
  for(let t=0;t<=68;t+=.1){const p=Camera.sample(t,mobile);assert.ok(p.scale>0&&Number.isFinite(p.scale));assert.ok(p.focus.every(Number.isFinite));}
  // Reduced-motion shots are fixed, with no camera drift inside a shot.
  for(const [a,b] of [[0,2.9],[3,11.9],[12,27.9],[28,68]])assert.deepEqual(Camera.sample(a,mobile,{motion:false}),Camera.sample(b,mobile,{motion:false}));
  for(const angle of ['oblique','front','side']) {
    const options={mode:'exterior',angle};
    assert.deepEqual(Camera.sample(0,mobile,options),Camera.sample(11.9,mobile,options),'inspection camera must stay fixed');
    const shot=Camera.sample(0,mobile,options);assert.equal(shot.region,'whole');assert.ok(Number.isFinite(shot.yaw)&&shot.scale>0);
  }
  assert.notEqual(Camera.sample(0,mobile,{mode:'exterior',angle:'front'}).yaw,Camera.sample(0,mobile,{mode:'exterior',angle:'side'}).yaw);
  assert.equal(Camera.sample(0,mobile).region,'whole');
  assert.equal(Camera.sample(12,mobile).region,'gun');
  assert.equal(Camera.sample(28,mobile).region,'wave');
  assert.equal(Camera.sample(0,mobile,{mode:'optics'}).region,'assembly');
}
console.log('Camera: continuous position/zoom/orientation, finite poses and fixed reduced-motion shots passed.');
