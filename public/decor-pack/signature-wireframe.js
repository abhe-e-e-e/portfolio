import * as THREE from './assets/vendor/three.module.js';
const stage=document.querySelector('.wireframe-stage');
const motion=matchMedia('(prefers-reduced-motion: reduce)');
if(stage){
 let renderer;
 try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{}
 if(renderer){
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));stage.append(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');
  const scene=new THREE.Scene(), camera=new THREE.PerspectiveCamera(32,1,.1,100);camera.position.set(0,.5,9.4);
  const bottle=new THREE.Group();scene.add(bottle);
  const gold=new THREE.LineBasicMaterial({color:0xe6c689,transparent:true,opacity:.85});
  const shape=new THREE.Shape();shape.moveTo(-.91,-1.35);shape.lineTo(.91,-1.35);shape.lineTo(1.08,-1.15);shape.lineTo(1.08,.85);shape.lineTo(.65,1.23);shape.lineTo(-.65,1.23);shape.lineTo(-1.08,.85);shape.lineTo(-1.08,-1.15);shape.closePath();
  // Parallel contour slices define a recognisable, bevelled fragrance flacon.
  for(let i=0;i<9;i++){
   const z=-.47+i*.1175,scale=.92+.08*Math.sin(i/8*Math.PI);
   const points=shape.getPoints(1).map(p=>new THREE.Vector3(p.x*scale,p.y*scale,z));
   bottle.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),gold));
  }
  shape.getPoints(1).forEach(p=>bottle.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(p.x*.92,p.y*.92,-.47),new THREE.Vector3(p.x,p.y,0),new THREE.Vector3(p.x*.92,p.y*.92,.47)]),gold)));
  const cylinder=(r,h,y,segments)=>{const g=new THREE.CylinderGeometry(r,r,h,segments,3);const m=new THREE.LineSegments(new THREE.WireframeGeometry(g),gold);m.position.y=y;bottle.add(m);};
  cylinder(.25,.22,1.34,20);
  // Sculpted equestrian closure: ears, forehead, muzzle, jaw and arched neck.
  const horse=new THREE.Shape();horse.moveTo(-.36,1.46);horse.lineTo(.37,1.46);horse.bezierCurveTo(.5,1.8,.42,2.1,.23,2.32);horse.lineTo(.26,2.7);horse.lineTo(.08,2.52);horse.lineTo(-.04,2.76);horse.lineTo(-.14,2.48);horse.lineTo(-.4,2.27);horse.lineTo(-.59,1.99);horse.lineTo(-.5,1.87);horse.lineTo(-.31,1.94);horse.lineTo(-.2,2.13);horse.bezierCurveTo(-.1,1.94,-.12,1.65,-.36,1.46);
  const hg=new THREE.ExtrudeGeometry(horse,{depth:.32,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.045,bevelThickness:.04,curveSegments:8});hg.translate(0,0,-.16);bottle.add(new THREE.LineSegments(new THREE.WireframeGeometry(hg),gold));
  const eye=new THREE.Mesh(new THREE.SphereGeometry(.035,8,6),new THREE.MeshBasicMaterial({color:0xe6c689}));eye.position.set(-.2,2.31,.21);bottle.add(eye);
  new THREE.TextureLoader().load('assets/logo-transparent.png',texture=>{const logo=new THREE.Mesh(new THREE.PlaneGeometry(1.02,.67),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false}));logo.position.set(0,.05,.49);bottle.add(logo);schedule();});
  bottle.scale.x=.75;
  const tube=new THREE.CatmullRomCurve3([new THREE.Vector3(0,1.2,0),new THREE.Vector3(0,.3,0),new THREE.Vector3(.12,-1.15,0)]);
  bottle.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(tube.getPoints(40)),gold));
  bottle.rotation.set(0,-.35,0);
  let frame=0,start=null,complete=false;
  function draw(now){frame=0;if(start!==null&&!complete){const t=Math.min(1,(now-start)/4200);const eased=t*t*(3-2*t);bottle.rotation.y=-.35+eased*Math.PI*2;complete=t===1;}renderer.render(scene,camera);if(start!==null&&!complete)frame=requestAnimationFrame(draw);}
  function schedule(){if(!frame)frame=requestAnimationFrame(draw);}
  function begin(){if(start!==null)return;if(motion.matches){complete=true;schedule();return;}start=performance.now();schedule();}
  const resize=()=>{const r=stage.getBoundingClientRect();renderer.setSize(r.width,r.height);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();schedule();};
  new ResizeObserver(resize).observe(stage);stage.classList.add('webgl-ready');
  document.addEventListener('decor-intro-complete',begin,{once:true});
  if(!document.querySelector('.brand-splash')?.open&&!document.body.classList.contains('splash-active'))begin();
  motion.addEventListener('change',()=>{if(motion.matches){complete=true;bottle.rotation.y=-.35;schedule();}});resize();
 }
}
