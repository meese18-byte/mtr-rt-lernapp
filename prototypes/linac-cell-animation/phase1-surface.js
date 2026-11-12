/* Small, dependency-free surface renderer. Geometric illustration, not CAD/dose software. */
(function(root){
  'use strict';
  function create(){
    const surface=document.createElement('canvas');
    const gl=surface.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:true,preserveDrawingBuffer:true});
    if(!gl)return null;
    const vertex=`attribute vec3 aPosition;attribute vec3 aNormal;attribute vec3 aColor;
      uniform vec3 uFocus;uniform vec4 uCamera;uniform vec4 uViewport;
      varying vec3 vNormal;varying vec3 vColor;varying vec3 vView;
      void main(){
        vec3 p=aPosition-uFocus;float ya=uCamera.x,pi=uCamera.y,ro=uCamera.z;
        float xx=p.x*cos(ya)+p.z*sin(ya),zz=-p.x*sin(ya)+p.z*cos(ya);
        float yy=p.y*cos(pi)+zz*sin(pi),dep=-p.y*sin(pi)+zz*cos(pi);
        float w=48.+dep,sc=uCamera.w*48.;
        float dx=(xx*cos(ro)-yy*sin(ro))*sc,dy=(xx*sin(ro)+yy*cos(ro))*sc;
        gl_Position=vec4(dx*2./uViewport.x,-dy*2./uViewport.y+(1.-2.*uViewport.z)*w,(201./199.)*w-400./199.,w);
        vNormal=aNormal;vColor=aColor;
        vec3 eye=vec3(48.*sin(ya)*cos(pi),48.*sin(pi),-48.*cos(ya)*cos(pi));vView=eye-p;
      }`;
    const fragment=`precision mediump float;varying vec3 vNormal;varying vec3 vColor;varying vec3 vView;
      void main(){vec3 n=normalize(vNormal),v=normalize(vView),l=normalize(vec3(.45,-.8,-.65));
        float diffuse=max(dot(n,l),0.);float rim=pow(1.-max(dot(n,v),0.),3.);
        float spec=pow(max(dot(n,normalize(l+v)),0.),42.);
        vec3 col=vColor*(.63+.37*diffuse)+vec3(.13)*spec+vec3(.025,.035,.045)*rim;
        gl_FragColor=vec4(col,1.);
      }`;
    function shader(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error('Surface shader compilation failed');return s;}
    let program;try{program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))return null;}catch{return null;}
    gl.useProgram(program);const attrs=['aPosition','aNormal','aColor'].map(n=>gl.getAttribLocation(program,n));const uni=Object.fromEntries(['uFocus','uCamera','uViewport'].map(n=>[n,gl.getUniformLocation(program,n)]));
    const cache=new WeakMap();let lost=false;surface.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;});
    function buffer(faces){
      if(cache.has(faces))return cache.get(faces);
      // Average only curved surface normals; box edges remain crisp.
      const normals=new Map(),key=(p,f)=>p.map(v=>v.toFixed(5)).join(',')+'/'+f.base.join(',');
      for(const f of faces)if(f.smooth)for(const p of f.p){const k=key(p,f),n=normals.get(k)||[0,0,0];for(let i=0;i<3;i++)n[i]+=f.normal[i];normals.set(k,n);}
      const data=[];
      for(const f of faces){const base=(f.base||[200,210,215]).map(v=>v/255),normal=f.normal||[0,-1,0];
        for(let i=1;i<f.p.length-1;i++)for(const p of [f.p[0],f.p[i],f.p[i+1]]){let n=f.smooth?normals.get(key(p,f)):normal;const length=Math.hypot(...n)||1;data.push(...p,...n.map(v=>v/length),...base);}}
      const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);const v={b,count:data.length/9};cache.set(faces,v);return v;
    }
    return {render(faces,pose,width,height,ratio=1){
      if(lost)return null;const w=Math.round(width*ratio),h=Math.round(height*ratio);if(surface.width!==w||surface.height!==h){surface.width=w;surface.height=h;}
      gl.viewport(0,0,w,h);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);gl.useProgram(program);
      const v=buffer(faces);gl.bindBuffer(gl.ARRAY_BUFFER,v.b);attrs.forEach((a,i)=>{gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,3,gl.FLOAT,false,36,i*12);});
      gl.uniform3fv(uni.uFocus,pose.focus);gl.uniform4f(uni.uCamera,pose.yaw,pose.pitch,pose.roll,pose.scale);gl.uniform4f(uni.uViewport,width,height,pose.cy,0);gl.drawArrays(gl.TRIANGLES,0,v.count);return surface;
    }};
  }
  root.LinacSurface={create};
})(window);
