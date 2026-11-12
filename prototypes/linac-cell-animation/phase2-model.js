/* Geometric teaching model. Coordinates and timing are illustrative, not machine dimensions. */
(function(root){
'use strict';
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const N=20, source={x:390,y:235}, planes={primary:272,filter:365,monitor:417,mlc:485,backup:535,jaws:579,projection:730}, half=164;
function target(y){if(Math.abs(y)>.56)return null;const c=.08+.09*Math.sin(y*5),r=.54*Math.sqrt(Math.max(0,1-(y/.56)**2));return [c-r,c+r];}
function leaf(index,form=1,closed=false){
 if(closed||index<0||index>=N)return [0,0];
 const y0=-1+index*2/N,y1=y0+2/N;
 if(y1<=-.56||y0>=.56)return [0,0]; // Unused pairs always closed, including during motion.
 let left=1,right=-1;
 for(let k=0;k<=40;k++){const q=target(y0+(y1-y0)*k/40);if(q){left=Math.min(left,q[0]-.035);right=Math.max(right,q[1]+.035);}}
 const f=clamp(form);return [-.76+(left+.76)*f,.76+(right-.76)*f];
}
function rowAt(y){return Math.min(N-1,Math.max(0,Math.floor((y+1)*N/2)));}
function open(x,y,form=1,closed=false){if(Math.abs(y)>.64||Math.abs(x)>.82)return false;const [l,r]=leaf(rowAt(y),form,closed);return r-l>1e-6&&x>l&&x<r;}
function project(x,z){return source.x+x*half*(z-source.y)/(planes.projection-source.y);}
function stop(x,row,form=1,closed=false){
 if(Math.abs(x)>1.07)return planes.primary;
 const [l,r]=leaf(row,form,closed);
 if(r-l<1e-6||x<=l||x>=r)return planes.mlc;
 if(Math.abs(x)>.82)return planes.backup;
 const y=-1+(row+.5)*2/N;
 if(Math.abs(y)>.64)return planes.jaws;
 return planes.projection;
}
function scene(t){return t<18?0:t<36?1:t<58?2:3;}
function monitor(t){return clamp((t-36)/17);}
function formAt(t){const p=clamp((t-58)/9);return p*p*(3-2*p);}
const api={N,source,planes,half,clamp,target,leaf,rowAt,open,project,stop,scene,monitor,formAt};
if(typeof module==='object'&&module.exports)module.exports=api;else root.LinacHead=api;
})(typeof window!=='undefined'?window:globalThis);
