const assert=require('node:assert/strict');
const m=require('../phase2-model.js');
// Geometric projection must preserve the point-source ray and increase width with distance.
assert.equal(m.project(.5,m.source.y),m.source.x);
assert.ok(m.project(.5,m.planes.projection)-m.source.x>m.project(.5,m.planes.mlc)-m.source.x);
for(const form of [0,.17,.5,1])for(let row=0;row<m.N;row++){
 const y=-1+(row+.5)*2/m.N,[l,r]=m.leaf(row,form);
 assert.ok(Number.isFinite(l)&&l<=r&&r<1&&l>-1);
 if(Math.abs(y)>.6)assert.deepEqual([l,r],[0,0]);
 for(let k=0;k<=240;k++){
  const x=-1.2+k*.01;
  assert.equal(m.stop(x,row,form)===m.planes.projection,m.open(x,y,form),'BEV and slice disagree');
  assert.notEqual(m.stop(x,row,form,true),m.planes.projection,'closed bank transmits direct ray');
 }
}
// Every sampled point within the target is inside its static leaf envelope (including row edges).
for(let j=0;j<1000;j++){const y=-.56+j*1.12/999,q=m.target(y),[l,r]=m.leaf(m.rowAt(y),1);assert.ok(l<=q[0]&&r>=q[1],'target clipped by static aperture');}
assert.equal(m.monitor(36),0);assert.equal(m.monitor(53),1);assert.equal(m.monitor(58),1);
assert.deepEqual([0,17.99,18,35.99,36,57.99,58,90].map(m.scene),[0,0,1,1,2,2,3,3]);
console.log('Phase 02: projection, closed leaves, contour coverage and monitor timing passed.');
