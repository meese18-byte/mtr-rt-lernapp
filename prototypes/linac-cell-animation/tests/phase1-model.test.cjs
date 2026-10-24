"use strict";
const assert=require("node:assert/strict");
const M=require("../phase1-model.js");

// Known relativistic values, rather than duplicating the implementation formula.
assert.ok(Math.abs(M.beta(2)-0.979075)<0.00001);
assert.ok(Math.abs(M.beta(6)-0.996916)<0.00001);
assert.equal(M.beta(0),0);
assert.ok(M.beta(100)<1);

// The electron charge sign must oppose E at every sampled location and time.
// Half a cycle reverses the field at a FIXED location, whereas the selected
// synchronous packets remain on an accelerating phase as they move.
for(let t=0;t<=32;t+=0.37){
  for(const x of M.packets(t)){
    assert.ok(M.field(x,t)<-0.999999);
    assert.ok(M.force(x,t)>0.999999);
  }
  for(let x=-4;x<=4;x+=0.41){
    assert.ok(Math.abs(M.field(x,t)+M.force(x,t))<1e-12);
    assert.ok(Math.abs(M.field(x,t)+M.field(x,t+M.period/2))<1e-12);
    assert.ok(Math.abs(M.field(x,t)-M.field(x+M.wavelength,t))<1e-12);
  }
}
console.log("Phase 01: field/force sign, synchronous packets, phase reversal and relativistic speed passed.");

// A macro injection must never be shown outside the RF envelope. Visible
// particles must originate from an earlier permitted emission, including wrap.
for(let t=-12;t<24;t+=.017){
  const p=M.pulse(t);
  assert.ok(!p.injection||p.rf);
  assert.equal(p.rf,M.pulse(t+M.pulseCycle).rf);
  for(const e of M.emissionAges(t,1.65)){
    assert.ok(M.pulse(t-e.age).injection);
    assert.ok(e.age>=0&&e.age<1.65);
  }
}
assert.equal(M.emissionAges(0,1.65).length,0);
assert.equal(M.emissionAges(5.6,1.65).length,0);
assert.ok(M.emissionAges(2,1.65).length>0);
console.log("Phase 01: macro pulse timing and causal emission passed.");
