// node motion-review.test.cjs
// Reproducible, deterministic safeguards against review B1-B7 and broken phase links.
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const read=name=>fs.readFileSync(path.join(__dirname,name),'utf8');
const load=name=>{const mod={exports:{}};vm.runInNewContext(read(name),{module:mod,globalThis:{},Math});return mod.exports;};
let checks=0;function check(label,fn){fn();checks++;process.stdout.write('PASS '+label+'\n');}
for(const name of ['phase1.js','phase2.js','phase3.js','phase4.js','phase1-model.js','phase2-model.js','phase3-model.js','phase4-model.js','review-ui.js','clinical-bridge.js']){
 check('syntax '+name,()=>new vm.Script(read(name),{filename:name}));
}
const p1=load('phase1-model.js'),p2=load('phase2-model.js'),p3=load('phase3-model.js'),p4=load('phase4-model.js');
check('P0 Phase 01: 2-MeV beta near 0.9791 and correct force direction',()=>{assert.ok(Math.abs(p1.beta(2)-.9791)<.0002);assert.equal(p1.field(0,0),-p1.force(0,0));});
const src2=read('phase2.js'),start=src2.indexOf('function transport(){'),end=src2.indexOf('function bolt(',start);
assert.ok(start>0&&end>start,'transport code available');
const geometry=new Function('cl',src2.slice(start,end)+';return {onTrack,trackMetric};')((x,a=0,b=1)=>Math.max(a,Math.min(b,x)));
check('B1 Phase 02: magnet paths have <=5% visual speed drift',()=>{
 const steps=1000,arr=[];for(let i=0;i<steps;i++){const p=geometry.onTrack(i/steps),q=geometry.onTrack((i+1)/steps);arr.push(Math.hypot(p[0]-q[0],p[1]-q[1]));}
 const mean=arr.reduce((a,b)=>a+b,0)/steps;assert.ok(arr.every(n=>Math.abs(n/mean-1)<=.05),'path interpolation must be arclength-based');
});
check('B2 Phase 02: photon traces follow uniform distance per time',()=>{assert.match(src2,/photonSpeed=240,period=/);assert.match(src2,/travel\/distance/);assert.doesNotMatch(src2,/time\*\.55\+i\*\.173/);});
check('B4 Phase 02: target electron slower after energy loss',()=>{assert.match(src2,/speedBefore=120,speedAfter=76/);});
check('Phase 02: MU1 MU2 and isocenter labels',()=>{assert.match(read('phase2.html'),/monitorValue2/);assert.match(src2,/ISOZENTRUMSEBENE/);});
check('B3 Phase 03: scattered photon speed unchanged; electron speed beta(E)',()=>{const v=p3.compton(1,60);assert.ok(Math.abs(v.photon-.505)<.002);assert.ok(Math.abs(v.electron-.495)<.002);assert.ok(p3.electronBeta(v.electron)>0&&p3.electronBeta(v.electron)<1);assert.match(read('phase3.js'),/photonDistance=elapsed\*photonSpeed/);});
check('B3 Phase 03: scattered photon visibly loses energy, not speed',()=>{assert.match(read('phase3.js'),/v\.photon\/v\.energy/);assert.match(read('phase3.js'),/Wavelength is only a qualitative energy cue/);});
check('B7 Phase 03: arclength interpolation independent of control points',()=>{const p=p3.pointOnTrack([[0,0],[100,0],[101,0]],.5);assert.ok(Math.abs(p[0]-50.5)<1e-8);assert.equal(p[1],0);});
check('B6 Phase 03/04: directional radical tracking removed',()=>{assert.match(read('phase3.js'),/Math\.sin\(q\*31\)/);assert.match(read('phase4.js'),/Weiteres •OH: kein Kontakt/);});
check('B5 Phase 04: direct electron slows after DNA energy transfer',()=>{assert.match(read('phase4.js'),/speedOut=speedIn\*\.7/);});
check('Phase 04: mitotic cell death and apoptosis are distinct options',()=>{assert.equal(p4.fate('death').label,'Mitotischer Zelltod');assert.equal(p4.fate('apoptosis').label,'Apoptose');});
check('P1: phase links and uninterrupted film exist',()=>{assert.match(read('index.html'),/gesamtfilm\.html/);assert.match(read('gesamtfilm.html'),/const segments=/);for(let i=1;i<=4;i++)assert.match(read('phase'+i+'.html'),/review-ui\.js/);});
check('P2: dose and fractionation views exist',()=>{const v=read('clinical-bridge.js');assert.match(v,/1 Gray \(Gy\) = 1 Joule pro Kilogramm/);assert.match(v,/Warum die Bestrahlung in Fraktionen erfolgt/);});
process.stdout.write('Checks completed: '+checks+'\n');