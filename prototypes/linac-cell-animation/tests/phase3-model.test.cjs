const test=require('node:test'),assert=require('node:assert/strict'),M=require('../phase3-model.js');
const near=(a,b,msg)=>assert.ok(Math.abs(a-b)<1e-10,msg+': '+a+' vs '+b);
test('Compton energy and 2D momentum are conserved across energy and angle range',()=>{
 for(const E of [.05,.5,1,2,6,20])for(let angle=0;angle<=180;angle++){
  const v=M.compton(E,angle),p=Math.sqrt(v.electron*(v.electron+2*v.rest));
  near(v.photon+v.electron,E,'energy');
  near(v.photon*Math.cos(v.theta)+p*Math.cos(v.phi),E,'longitudinal momentum');
  near(v.photon*Math.sin(v.theta)-p*Math.sin(v.phi),0,'transverse momentum');
  assert.ok(v.photon>0&&v.photon<=E);assert.ok(v.phi>=0&&v.phi<=Math.PI/2);
 }
});
test('Increasing scatter angle increases recoil energy at fixed incident energy',()=>{
 for(const E of [.5,1,2]){let previous=-1;for(let a=15;a<=150;a++){const v=M.compton(E,a);assert.ok(v.electron>previous);previous=v.electron;}}
 near(M.compton(1,0).photon,1,'forward scattering');near(M.compton(.51099895,90).photon,.255499475,'known right angle case');
 for(const args of [[0,60],[-1,60],[1,-1],[1,181],[NaN,30],[1,NaN]])assert.throws(()=>M.compton(...args),RangeError);
});
test('Every displayed chemical reaction conserves atoms, organic residues and charge',()=>{
 for(const [id,r] of Object.entries(M.reactions))assert.deepEqual(M.inventory(r.left),M.inventory(r.right),id);
 assert.equal(M.reactions.ionization.right.electron,2,'incident electron remains; second electron released');
 assert.equal(M.reactions.recombination.left.hydroxyl,2,'requires two radicals');
});
test('Scene and reaction boundaries are deterministic for playback and seeking',()=>{
 assert.deepEqual([0,19.99,20,44.99,45,75.99,76,104].map(M.scene),[0,0,1,1,2,2,3,3]);
 assert.deepEqual([45,54.99,55,65.99,66,75.99].map(t=>M.chemistry(t).step),[0,0,1,1,2,2]);
 for(let t=45;t<76;t+=.125){const q=M.chemistry(t);assert.ok(q.progress>=0&&q.progress<=1);}
});
