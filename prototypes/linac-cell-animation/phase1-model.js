/* Dimensionless teaching model, not an RF or particle-transport solver. */
(function(root){
  "use strict";
  const TAU=2*Math.PI, period=8, wavelength=4, restEnergyMeV=0.51099895;
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  function field(x,t){return -Math.cos(TAU*(x/wavelength-t/period));}
  function force(x,t){return -field(x,t);}
  function packet(n,t){return n*wavelength+t*wavelength/period;}
  function packets(t,min=-5,max=5){const out=[];for(let n=Math.floor((min-t*wavelength/period)/wavelength)-1;n<=Math.ceil((max-t*wavelength/period)/wavelength)+1;n++){const x=packet(n,t);if(x>=min&&x<=max)out.push(x);}return out;}
  function kinetic(x){return 2+4*clamp((x+4)/8,0,1);}
  function beta(energy){const gamma=1+Math.max(0,energy)/restEnergyMeV;return Math.sqrt(1-1/(gamma*gamma));}
  const api=Object.freeze({period,wavelength,restEnergyMeV,field,force,packet,packets,kinetic,beta});
  if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.LinacPhaseModel=api;
})(typeof globalThis!=="undefined"?globalThis:this);
