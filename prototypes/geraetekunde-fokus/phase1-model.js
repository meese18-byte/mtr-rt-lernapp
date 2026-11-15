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
  // Separate MACRO-pulse diagram. Display durations are arbitrary and are not
  // on the same scale as the RF oscillation above or actual particle flight.
  const pulseCycle=6, rfStart=.5, rfEnd=5.5, injectionStart=1.2, injectionEnd=3.0;
  function pulse(t){const phase=((t%pulseCycle)+pulseCycle)%pulseCycle;return {phase,rf:phase>=rfStart&&phase<rfEnd,injection:phase>=injectionStart&&phase<injectionEnd};}
  function emissionAges(t,transit,count=36){
    const out=[],cycle=Math.floor(t/pulseCycle);
    for(let k=cycle-Math.ceil(transit/pulseCycle);k<=cycle;k++)for(let j=0;j<count;j++){
      const emitted=k*pulseCycle+injectionStart+(injectionEnd-injectionStart)*(j+.5)/count,age=t-emitted;
      if(age>=0&&age<transit)out.push({age,index:j});
    }
    return out;
  }
  const api=Object.freeze({period,wavelength,restEnergyMeV,field,force,packet,packets,kinetic,beta,pulseCycle,rfStart,rfEnd,injectionStart,injectionEnd,pulse,emissionAges});
  if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.LinacPhaseModel=api;
})(typeof globalThis!=="undefined"?globalThis:this);

