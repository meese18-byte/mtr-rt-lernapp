/* Topology and scripted comparison states, not a radiobiological prediction model. */
(function(root){'use strict';
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const starts=Object.freeze([0,24,50,82]),duration=118;
const sequence=Object.freeze(['A','C','G','T','A','G','C','T']);
const complement=b=>({A:'T',T:'A',C:'G',G:'C'}[b]);
const scene=t=>t<24?0:t<50?1:t<82?2:3;
const lesionAt=t=>t<32?'base':t<40?'ssb':'dsb';
function dna(kind='intact'){
 if(!['intact','base','ssb','dsb'].includes(kind))throw new RangeError('Unknown lesion');
 return{bases:[...sequence],opposite:sequence.map(complement),breaks:kind==='ssb'?[[3],[]]:kind==='dsb'?[[3],[4]]:[[],[]],modified:kind==='base'?[4]:[],removed:[]};
}
function repair(outcome,progress){
 if(!['restored','deletion','persistent'].includes(outcome))throw new RangeError('Unknown repair example');
 const q=clamp(progress),d=dna('dsb');
 if(outcome==='deletion'&&q>=.55){d.removed=[4];d.bases=sequence.filter((_,i)=>i!==4);d.opposite=d.bases.map(complement);d.breaks=[[3],[3]];}
 if(outcome!=='persistent'&&q>=1)d.breaks=[[],[]];
 return d;
}
const fates=Object.freeze({
 survival:{label:'Weiterteilen',alive:true,dividing:true,altered:false},
 mutation:{label:'Veränderung bleibt',alive:true,dividing:true,altered:true},
 arrest:{label:'Teilungsstopp',alive:true,dividing:false,altered:false},
 death:{label:'Zelltod',alive:false,dividing:false,altered:false}
});
function fate(key){if(!fates[key])throw new RangeError('Unknown cell example');return{...fates[key]};}
function repairStage(t){return t<60?0:t<72?1:2;}
function nextTime(t,dt,speed,pause){let next=Math.min(duration,t+Math.max(0,dt)*speed);const boundary=starts.find(b=>b>t&&b<=next);if(pause&&boundary!==undefined)return{time:boundary,playing:false};return{time:next,playing:next<duration};}
const api={clamp,starts,duration,sequence,complement,scene,lesionAt,dna,repair,fates,fate,repairStage,nextTime};
if(typeof module==='object'&&module.exports)module.exports=api;else root.LinacCell=api;
})(typeof window!=='undefined'?window:globalThis);
