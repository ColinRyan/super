const __vite__fileDeps=["assets/chroma-DMHAAAaC.js","assets/index-DRxMUbkl.js","assets/index-CaG0Q__C.css"],__vite__mapDeps=i=>i.map(i=>__vite__fileDeps[i]);
import{_ as g}from"./index-DRxMUbkl.js";const I=await g(()=>import("./chroma-DMHAAAaC.js").then(e=>e.c),__vite__mapDeps([0,1,2])),n=await g(()=>import("./three.module-jcwe-GiX.js"),[]);let h=!1,m=null;const S=()=>{const e={nx:40,ny:100,cscale:I.scale(["#2175D8","#DC5DCE","#CC223D","#F07414","#FDEE61","#74C425"]).mode("lch"),darken:-1,angle:Math.PI/3,timeCoef:.1};console.debug("THREE",n);let u,d,r,t,a;const{randFloat:o}=n.MathUtils,i={value:0},l={value:e.timeCoef};A();function A(){document.head.innerHTML+='<link id="theme-waves" rel="stylesheet" type="text/css" href="./themes/waves.css">';const s=document.createElement("canvas");s.setAttribute("id","theme-waves-canvas"),document.getElementById("loaded").appendChild(s),u=new n.WebGLRenderer({canvas:s,antialias:!0}),r=new n.PerspectiveCamera,f(),window.addEventListener("resize",f,!1),R(),h=!0,m=requestAnimationFrame(y)}function R(){d=new n.Scene;const s=`
      uniform float uTime, uTimeCoef;
      uniform float uSize;
      uniform mat2 uMat2;
      uniform vec3 uRnd1;
      uniform vec3 uRnd2;
      uniform vec3 uRnd3;
      uniform vec3 uRnd4;
      uniform vec3 uRnd5;
      attribute vec3 next, prev; 
      attribute float side;
      varying vec2 vUv;

      vec2 dp(vec2 sv) {
        return (1.5 * sv * uMat2);
      }

      void main() {
        vUv = uv;

        vec2 pos = dp(position.xy);

        // Well... I know I should update geometry instead...
        // Computing normal here is not needed
        // vec2 sprev = dp(prev.xy);
        // vec2 snext = dp(next.xy);
        // vec2 tangent = normalize(snext - sprev);
        // vec2 normal = vec2(-tangent.y, tangent.x);
        // float dist = length(snext - sprev);
        // normal *= smoothstep(0.0, 0.02, dist);

        vec2 normal = dp(vec2(1, 0));
        normal *= uSize;

        float time = uTime * uTimeCoef;
        vec3 rnd1 = vec3(cos(time * uRnd1.x + uRnd3.x), cos(time * uRnd1.y + uRnd3.y), cos(time * uRnd1.z + uRnd3.z));
        vec3 rnd2 = vec3(cos(time * uRnd2.x + uRnd4.x), cos(time * uRnd2.y + uRnd4.y), cos(time * uRnd2.z + uRnd4.z));
        normal *= 1.0
          + uRnd5.x * (cos((position.y + rnd1.x) * 20.0 * rnd1.y) + 1.0)
          + uRnd5.y * (sin((position.y + rnd2.x) * 20.0 * rnd2.y) + 1.0)
          + uRnd5.z * (cos((position.y + rnd1.z) * 20.0 * rnd2.z) + 1.0);
        pos.xy -= normal * side;

        gl_Position = vec4(pos, 0.0, 1.0);
      }
    `,p=`
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      varying vec2 vUv;
      void main() {
        gl_FragColor = vec4(mix(uColor1, uColor2, vUv.x), 1.0);
      }
    `,w=2/e.nx,C=-2/(e.ny-1),b=-1+w/2,E=1,_=Float32Array.from([Math.cos(e.angle),-Math.sin(e.angle),Math.sin(e.angle),Math.cos(e.angle)]);for(let c=0;c<e.nx;c++){const x=[];for(let v=0;v<e.ny;v++){const T=b+c*w,B=E+v*C;x.push(new n.Vector3(T,B,0))}const z=new U({points:x}),F=new n.ShaderMaterial({uniforms:{uTime:i,uTimeCoef:l,uMat2:{value:_},uSize:{value:1.5/e.nx},uRnd1:{value:new n.Vector3(o(-1,1),o(-1,1),o(-1,1))},uRnd2:{value:new n.Vector3(o(-1,1),o(-1,1),o(-1,1))},uRnd3:{value:new n.Vector3(o(-1,1),o(-1,1),o(-1,1))},uRnd4:{value:new n.Vector3(o(-1,1),o(-1,1),o(-1,1))},uRnd5:{value:new n.Vector3(o(.2,.5),o(.3,.6),o(.4,.7))},uColor1:{value:new n.Color(e.cscale(c/e.nx).hex())},uColor2:{value:new n.Color(e.cscale(c/e.nx).darken(e.darken).hex())}},vertexShader:s,fragmentShader:p}),M=new n.Mesh(z.geometry,F);d.add(M)}}function y(s){h?(i.value=s*.001,u.render(d,r),m=requestAnimationFrame(y)):cancelAnimationFrame(m)}function f(){t=window.innerWidth,a=window.innerHeight,u.setSize(t,a)}},U=function(){const e=new n.Vector3;class u{constructor(r){const{points:t}=r;this.points=t,this.count=t.length,this.init(),this.updateGeometry()}init(){this.geometry=new n.BufferGeometry,this.position=new Float32Array(this.count*3*2),this.prev=new Float32Array(this.count*3*2),this.next=new Float32Array(this.count*3*2);const r=new Float32Array(this.count*1*2),t=new Float32Array(this.count*2*2),a=new Uint16Array((this.count-1)*3*2);for(let o=0;o<this.count;o++){const i=o*2;r.set([-1,1],i);const l=o/(this.count-1);t.set([0,l,1,l],o*4),o!==this.count-1&&(a.set([i+0,i+1,i+2],(i+0)*3),a.set([i+2,i+1,i+3],(i+1)*3))}this.geometry.setAttribute("position",new n.BufferAttribute(this.position,3)),this.geometry.setAttribute("prev",new n.BufferAttribute(this.prev,3)),this.geometry.setAttribute("next",new n.BufferAttribute(this.next,3)),this.geometry.setAttribute("side",new n.BufferAttribute(r,1)),this.geometry.setAttribute("uv",new n.BufferAttribute(t,2)),this.geometry.setIndex(new n.BufferAttribute(a,1))}updateGeometry(){this.points.forEach((r,t)=>{r.toArray(this.position,t*3*2),r.toArray(this.position,t*3*2+3),t?(r.toArray(this.next,(t-1)*3*2),r.toArray(this.next,(t-1)*3*2+3)):(e.copy(r).sub(this.points[t+1]).add(r),e.toArray(this.prev,t*3*2),e.toArray(this.prev,t*3*2+3)),t===this.points.length-1?(e.copy(r).sub(this.points[t-1]).add(r),e.toArray(this.next,t*3*2),e.toArray(this.next,t*3*2+3)):(r.toArray(this.prev,(t+1)*3*2),r.toArray(this.prev,(t+1)*3*2+3))}),this.geometry.attributes.position.needsUpdate=!0,this.geometry.attributes.prev.needsUpdate=!0,this.geometry.attributes.next.needsUpdate=!0}}return u}(),D=()=>{S()},P=()=>{document.getElementById("theme-waves").remove(),document.getElementById("theme-waves-canvas").remove(),cancelAnimationFrame(m),h=!1};export{D as setup,P as tearDown};
