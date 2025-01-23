import * as kokomi from "https://esm.sh/kokomi.js";
import * as THREE from "https://esm.sh/three";

const vertexShader = /* glsl */ `
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

void main(){
    vec3 p=position;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
    
    vUv=uv;
}
`;

const fragmentShader = /* glsl */ `
const float PI=3.14159265359;

float sdArc(in vec2 p,in vec2 sc,in float ra,float rb)
{
    // sc is the sin/cos of the arc's aperture
    p.x=abs(p.x);
    return((sc.y*p.x>sc.x*p.y)?length(p-sc*ra):
    abs(length(p)-ra))-rb;
}

float random(float n){
    return fract(sin(n)*43758.5453123);
}

float randFloat(float n,float minVal,float maxVal)
{
    return random(n)*(maxVal-minVal)+minVal;
}

mat2 rotation2d(float angle){
    float s=sin(angle);
    float c=cos(angle);
    
    return mat2(
        c,-s,
        s,c
    );
}

vec2 rotate(vec2 v,float angle){
    return rotation2d(angle)*v;
}

vec3 hsv2rgb(in vec3 hsb){
    vec3 rgb=clamp(abs(mod(hsb.x*6.+vec3(0.,4.,2.),6.)-3.)-1.,0.,1.);
    #ifdef HSV2RGB_SMOOTH
    rgb=rgb*rgb*(3.-2.*rgb);
    #endif
    return hsb.z*mix(vec3(1.),rgb,hsb.y);
}

void mainImage(out vec4 fragColor,in vec2 fragCoord){
    vec2 uv=fragCoord/iResolution.xy;
    uv=(uv-.5)*2.;
    // uv.x*=iResolution.x/iResolution.y;
    uv.x*=2.2;
    
    vec3 col=vec3(0.);
    float count=48.;
    for(float i=0.;i<count;i++){
        float ratio=i/count;
        float tb=PI*randFloat(ratio,.25,1.);
        vec2 sc=vec2(sin(tb),cos(tb));
        vec2 p=uv;
        p=rotate(p,iTime*(randFloat(ratio,5.,20.)-randFloat(ratio,1.,5.))*.1);
        float arc=sdArc(p,sc,.025*i,.00125);
        
        // float c=smoothstep(.005,0.,arc);
        
        float c=.0025/arc;
        c=abs(c);
        c=pow(c,1.2);
        
        col+=c*hsv2rgb(vec3(random(ratio),.7,1.));
    }
    
    fragColor=vec4(col,1.);
}
`;

const vertexShader2 = /* glsl */ `
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

void main(){
    vec3 p=position;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
    
    vUv=uv;
}
`;

const fragmentShader2 = /* glsl */ `
varying vec2 vUv;

uniform vec3 uTextColor;

uniform sampler2D iChannel0;

void main(){
    vec2 p=vUv;
    
    p-=.5;
    p/=2.;
    p.y/=2.;
    p+=.5;
    
    p.y-=.25;
    
    vec3 tex=texture(iChannel0,p).xyz;
    vec4 col=vec4(tex,1.);
    
    gl_FragColor=col;
}
`;

class Sketch extends kokomi.Base {
  create() {
    // this.camera.position.set(0, 0, 2);
    const screenCamera = new kokomi.ScreenCamera(this);
    screenCamera.addExisting();

    // new kokomi.OrbitControls(this);

    const rtScene = new THREE.Scene();
    const rtCamera = new THREE.PerspectiveCamera();

    const quad = new kokomi.ScreenQuad(this, {
      fragmentShader,
      shadertoyMode: true
    });
    quad.container = rtScene;
    quad.addExisting();

    const rt = new kokomi.RenderTexture(this, {
      rtScene,
      rtCamera
    });

    const scroller = new kokomi.NormalScroller(this);
    scroller.listenForScroll();

    const mg = new kokomi.MojiGroup(this, {
      vertexShader: vertexShader2,
      fragmentShader: fragmentShader2,
      scroller,
      uniforms: {
        iChannel0: {
          value: null
        }
      }
    });
    mg.addExisting();

    this.update(() => {
      mg.mojis.forEach((moji) => {
        moji.textMesh.mesh.material.uniforms.iChannel0.value = rt.texture;
      });
    });
  }
}

const sketch = new Sketch("#sketch");
sketch.create();
