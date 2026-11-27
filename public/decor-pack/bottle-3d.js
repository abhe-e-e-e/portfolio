import * as THREE from './assets/vendor/three.module.js';

const stage = document.querySelector('.bottle-stage');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true, powerPreference:'low-power' });
} catch { /* The original image remains available when WebGL is unsupported. */ }

if (renderer && stage) {
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = .95;
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const updateBackground=()=>{scene.background=new THREE.Color(getComputedStyle(document.body).getPropertyValue('--bg').trim());};
  updateBackground();
  const camera = new THREE.PerspectiveCamera(32, 1, .1, 100);
  camera.position.set(0, .35, 9.5);
  camera.lookAt(0, .15, 0);

  // A local studio lighting environment creates reflections on every angle.
  const room = new THREE.Scene();
  room.background = new THREE.Color('#c4b9a2');
  const wall = new THREE.Mesh(new THREE.BoxGeometry(18,18,18),
    new THREE.MeshBasicMaterial({color:'#514d45',side:THREE.BackSide}));
  room.add(wall);
  const panel = (x,y,z,w,h,intensity) => {
    const light = new THREE.Mesh(new THREE.PlaneGeometry(w,h),
      new THREE.MeshBasicMaterial({color:new THREE.Color().setScalar(intensity)}));
    light.position.set(x,y,z); light.lookAt(0,0,0); room.add(light);
  };
  panel(-5,2,4,2,9,3); panel(5,1,3,1.2,8,2); panel(0,7,0,6,6,2);
  panel(0,1,-6,5,7,2);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(room,.06);
  scene.environment = environment.texture;
  pmrem.dispose();
  room.traverse(object => { object.geometry?.dispose(); object.material?.dispose(); });
  scene.add(new THREE.HemisphereLight(0xfff8e8,0x4a4032,2));
  const key = new THREE.DirectionalLight(0xfff8e9,3);
  key.position.set(-3,5,4); scene.add(key);
  const bottle = new THREE.Group();
  scene.add(bottle);
  bottle.rotation.y = -.28;

  function roundedBlock(width,height,depth,radius) {
    const x=-width/2, y=-height/2, r=radius;
    const shape=new THREE.Shape();
    shape.moveTo(x+r,y); shape.lineTo(x+width-r,y);
    shape.quadraticCurveTo(x+width,y,x+width,y+r);
    shape.lineTo(x+width,y+height-r);
    shape.quadraticCurveTo(x+width,y+height,x+width-r,y+height);
    shape.lineTo(x+r,y+height); shape.quadraticCurveTo(x,y+height,x,y+height-r);
    shape.lineTo(x,y+r); shape.quadraticCurveTo(x,y,x+r,y);
    const geometry=new THREE.ExtrudeGeometry(shape,{
      depth:depth-.12, bevelEnabled:true, bevelSegments:5, steps:1,
      bevelSize:.06, bevelThickness:.06, curveSegments:20
    });
    geometry.translate(0,0,-(depth-.12)/2);
    geometry.computeVertexNormals();
    return geometry;
  }
  const glass=new THREE.MeshPhysicalMaterial({
    color:0xffffff, metalness:.12, roughness:.025, transmission:0, transparent:true, opacity:.28, depthWrite:false,
    thickness:.35, ior:1.48, clearcoat:1, clearcoatRoughness:.06,
    attenuationColor:0xe3d4ae, attenuationDistance:4
  });
  const body=new THREE.Mesh(roundedBlock(1.95,2.65,.95,.23),glass);
  body.position.y=-.48; bottle.add(body);
  const liquid=new THREE.Mesh(roundedBlock(1.67,2.17,.69,.18),
    new THREE.MeshPhysicalMaterial({
      color:0xf2d7a5,roughness:.06,metalness:0,transmission:.96,thickness:1.7,ior:1.34,
      attenuationColor:0xbc822d,attenuationDistance:2.2
    }));
  liquid.position.y=-.48; bottle.add(liquid);
  const metal=new THREE.MeshStandardMaterial({color:0xcbb079,metalness:1,roughness:.22});
  const bronze=new THREE.MeshStandardMaterial({color:0x65523e,metalness:1,roughness:.29});
  function cylinder(radius,height,y,material) {
    const mesh=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,height,96,1),material);
    mesh.position.y=y; bottle.add(mesh); return mesh;
  }
  cylinder(.36,.28,.96,glass);
  cylinder(.39,.20,1.12,metal);
  cylinder(.43,.73,1.57,bronze);
  cylinder(.435,.035,1.21,metal);
  cylinder(.41,.025,1.945,bronze);
  const canvas=renderer.domElement;
  canvas.setAttribute('role','img');
  canvas.setAttribute('aria-label','Interactive 3D glass perfume bottle. Drag or use left and right arrow keys to rotate.');
  canvas.tabIndex=0;
  stage.append(canvas);
  const controls=document.createElement('div');
  controls.className='bottle-controls';
  controls.innerHTML='<span>Drag to explore · 360°</span><button type="button" aria-pressed="false">Pause rotation</button>';
  stage.parentElement.append(controls);
  const toggle=controls.querySelector('button');
  let paused=motion.matches, visible=true, dragging=false, lastX=0, startX=0, startY=0;
  let active=true, frame=0, lastTime=0;
  const label=()=>{toggle.textContent=paused?'Start rotation':'Pause rotation';toggle.setAttribute('aria-pressed',String(paused));};
  label();
  function resize() {
    const {width,height}=stage.getBoundingClientRect();
    renderer.setSize(width,height);
    camera.aspect=width/height;
    camera.position.z=camera.aspect<.75?9.3:8.2;
    camera.updateProjectionMatrix();
    wake();
  }
  const resizeObserver=new ResizeObserver(resize); resizeObserver.observe(stage);
  function render(now) {
    frame=0;
    if (!active || !visible || document.hidden) return;
    const delta=Math.min((now-lastTime)/1000,.05); lastTime=now;
    if (!paused && !dragging) bottle.rotation.y+=delta*.26;
    renderer.render(scene,camera);
    if (!paused || dragging) frame=requestAnimationFrame(render);
  }
  function wake() { if(!frame && active) { lastTime=performance.now(); frame=requestAnimationFrame(render); } }
  toggle.addEventListener('click',()=>{paused=!paused;label();wake();});
  canvas.addEventListener('pointerdown',event=>{
    if(event.button!==0)return;
    dragging=true;lastX=startX=event.clientX;startY=event.clientY;
    canvas.setPointerCapture(event.pointerId);
    wake();
  });
  canvas.addEventListener('pointermove',event=>{
    if(!dragging)return;
    if(event.pointerType==='touch'&&Math.abs(event.clientY-startY)>Math.abs(event.clientX-startX)+8){dragging=false;return;}
    bottle.rotation.y+=(event.clientX-lastX)*.012;lastX=event.clientX;wake();
  });
  const release=()=>{dragging=false;wake();};
  canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);
  canvas.addEventListener('lostpointercapture',release);
  canvas.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
      event.preventDefault();paused=true;label();
      bottle.rotation.y+=event.key==='ArrowLeft'?-.18:.18;wake();
    }
  });
  motion.addEventListener('change',()=>{paused=motion.matches;label();wake();});
  document.addEventListener('visibilitychange',wake);
  const visibility=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;wake();});
  visibility.observe(stage);
  canvas.addEventListener('webglcontextlost',event=>{
    event.preventDefault();active=false;cancelAnimationFrame(frame);
    stage.classList.remove('is-3d');controls.hidden=true;canvas.hidden=true;
  });
  new MutationObserver(()=>{updateBackground();wake();}).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  resize();
  // Only replace the fallback after a successful render.
  renderer.render(scene,camera);
  stage.classList.add('is-3d');
  wake();
}
