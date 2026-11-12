const test=require('node:test'),assert=require('node:assert/strict'),M=require('../phase4-model.js');
test('Damage categories distinguish chemical base change from one or two backbone breaks',()=>{
 const ref=M.dna(),base=M.dna('base'),ssb=M.dna('ssb'),dsb=M.dna('dsb');
 for(const d of [ref,base,ssb,dsb]){assert.deepEqual(d.bases,ref.bases);assert.deepEqual(d.opposite,d.bases.map(M.complement));}
 assert.equal(base.modified.length,1);assert.deepEqual(base.breaks,[[],[]]);
 assert.equal(ssb.breaks.filter(x=>x.length).length,1);assert.equal(dsb.breaks.filter(x=>x.length).length,2);
 assert.ok(Math.abs(dsb.breaks[0][0]-dsb.breaks[1][0])<=1,'nearby opposed breaks, not distant independent SSB');
 assert.throws(()=>M.dna('mutation'),RangeError);
});
test('Closed DNA may preserve or lose sequence, while persistent breaks remain',()=>{
 const restored=M.repair('restored',1),deleted=M.repair('deletion',1),open=M.repair('persistent',1);
 assert.deepEqual(restored.breaks,[[],[]]);assert.deepEqual(restored.bases,M.sequence);
 assert.deepEqual(deleted.breaks,[[],[]]);assert.equal(deleted.bases.length,M.sequence.length-1);
 assert.deepEqual(deleted.opposite,deleted.bases.map(M.complement));assert.deepEqual(deleted.removed,[4]);
 assert.equal(open.breaks.flat().length,2);assert.deepEqual(open.bases,M.sequence);
 for(const choice of ['restored','deletion','persistent'])assert.equal(M.repair(choice,0).breaks.flat().length,2);
});
test('Senescence stays distinct from death and from dividing survivors',()=>{
 assert.equal(M.fate('arrest').alive,true);assert.equal(M.fate('arrest').dividing,false);
 assert.equal(M.fate('death').alive,false);assert.equal(M.fate('death').dividing,false);
 assert.equal(M.fate('mutation').alive,true);assert.equal(M.fate('mutation').dividing,true);assert.equal(M.fate('mutation').altered,true);
 assert.throws(()=>M.fate('guaranteed-cure'),RangeError);
});
test('Lesson pauses catch exact, overshot and floating-point boundary crossings',()=>{
 for(const boundary of [24,50,82])for(const offset of [.01,Number.EPSILON*boundary,.1]){
 const r=M.nextTime(boundary-offset,.12,1,true);assert.equal(r.time,boundary);assert.equal(r.playing,false);
 assert.ok(M.nextTime(boundary,.1,1,true).time>boundary,'resume leaves pause');
 }
 assert.ok(M.nextTime(23.99,.12,1,false).time>24);assert.deepEqual(M.nextTime(117.99,.12,1,true),{time:118,playing:false});
 assert.deepEqual(M.starts.map(M.scene),[0,1,2,3]);
});
