/* Educational examples: Compton kinematics and balanced reaction inventories.
   No transport probabilities, track simulation, reaction rates or dose calculation. */
(function(root){'use strict';
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const starts=Object.freeze([0,20,45,76]),duration=104;
function scene(t){return t<20?0:t<45?1:t<76?2:3;}
function compton(energy,angle){
 if(!Number.isFinite(energy)||energy<=0||!Number.isFinite(angle)||angle<0||angle>180)throw new RangeError('Positive MeV energy; angle 0–180 degrees required.');
 const theta=angle*Math.PI/180,rest=.51099895;
 const photon=energy/(1+energy/rest*(1-Math.cos(theta))),electron=energy-photon;
 const px=energy-photon*Math.cos(theta),py=photon*Math.sin(theta);
 return{energy,photon,electron,theta,phi:Math.atan2(py,px),px,py,rest};
}
const species=Object.freeze({
 water:{H:2,O:1,R:0,charge:0},electron:{H:0,O:0,R:0,charge:-1},
 waterIon:{H:2,O:1,R:0,charge:1},hydronium:{H:3,O:1,R:0,charge:1},
 hydroxyl:{H:1,O:1,R:0,charge:0},peroxide:{H:2,O:2,R:0,charge:0},
 organic:{H:1,O:0,R:1,charge:0},organicRadical:{H:0,O:0,R:1,charge:0}
});
const reactions=Object.freeze({
 ionization:{left:{water:1,electron:1},right:{waterIon:1,electron:2}},
 proton:{left:{waterIon:1,water:1},right:{hydronium:1,hydroxyl:1}},
 recombination:{left:{hydroxyl:2},right:{peroxide:1}},
 abstraction:{left:{hydroxyl:1,organic:1},right:{water:1,organicRadical:1}}
});
function inventory(side){return Object.entries(side).reduce((sum,[id,n])=>{if(!species[id]||!Number.isInteger(n)||n<0)throw new RangeError('Unknown species or invalid count');for(const k of Object.keys(sum))sum[k]+=species[id][k]*n;return sum;},{H:0,O:0,R:0,charge:0});}
function chemistry(t){const step=t<55?0:t<66?1:2;return{step,progress:clamp((t-[46,56,67][step])/[7,8,6][step])};}
function pointOnTrack(points,p){const u=clamp(p)*(points.length-1),i=Math.min(points.length-2,Math.floor(u)),f=u-i;return points[i].map((v,k)=>v+(points[i+1][k]-v)*f);}
const api={clamp,starts,duration,scene,compton,species,reactions,inventory,chemistry,pointOnTrack};
if(typeof module==='object'&&module.exports)module.exports=api;else root.LinacTissue=api;
})(typeof window!=='undefined'?window:globalThis);
