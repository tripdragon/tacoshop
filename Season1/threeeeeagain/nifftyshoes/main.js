
// CHeck the todo s!!!

import { APP as _o } from "./app.js";

window._o = _o;
_o.fish = "narfs";

// not sure if this is tree shaking or not
// import * as THREE from "three";
import { SphereGeometry, Object3D, Vector3, ShadowMaterial, PlaneGeometry, GridHelper, PlaneHelper, 
  Plane, MeshStandardMaterial, BoxGeometry, MeshBasicMaterial, RingGeometry, Mesh, PCFSoftShadowMap, 
  WebGLRenderer, Box3, Box3Helper, Scene, Clock, PerspectiveCamera, 
  HemisphereLight, DirectionalLight, SpotLightHelper, DoubleSide } from "three";


import { renderLoop } from "./animationLoop.js";

import { ARButtonAlternative as ARButton } from "./ARButtonAlternative.js";



import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { OnScreenLogger } from './OnScreenLogger.js';

import { testIfMobile } from './tools/testIfMobile.js';

import { makeCubey } from './tools/makeCubey.js';

import { makeAShoe } from './tools/makeAShoe.js';

// import { loadModelOnStart_CM } from './loadModelOnStart_CM.js';

import { handleTouchStart, handleWhileDown, handleTouchStop } from './touchLogics.js';
import { RollyController } from './tools/RollyController.js';

import { setupKeyboardEvents } from './setupKeyboardEvents.js';

import { TenniShoe } from './tenniShoe.js';

import { prepareMatsForFade } from './tools/utilites.js';


// import { WObject3D } from './tools/wobject3D.js';

// Object3D.constructor = WObject3D.constructor;

// Object.setPrototypeOf(Object3D, WObject3D);

// Object3D.prototype.narfs = "moofs222";
// var aa = 4;
// Object3D.prototype.moofs = aa++;
// debugger

// Mesh.prototype.fff = 4;
// Object3D.prototype.fff = 7;
// 


// THIS IS a shoehorn for holding some data on the objects themselves since
// we cant mutate the constructor or its methods without lotas work

Object3D.prototype.clone = function(recursive){
  let yy = new this.constructor().copy( this, recursive );
  yy.memID = this.id;
  return yy;
}


// this makes it flicker
// import "./style.css";

// _o.xr.controller; // T : renderer.xr.getController


// _o.horseys = []; // T : [Mesh]
// _o.shoesCache = []; // T : [Mesh]


var spotlight1; // T : Spotlight: Object3D

var shadowPlane; // T: Mesh
var SHADOW_PLANE_SETUP_AR = false;

// let hitTestSource = null;
// let hitTestSourceRequested = false;
// let _o.xr.planeFound = false;
// var IS_XR_AVAIL = false;
// 
// var modes = {
//   seek: "seek",
//   moveHorsey : "moveHorsey",
//   moveShoe : "moveShoe",
// }
// var mode = modes.seek;





_o.onConsole = new OnScreenLogger(document.getElementById("rootlike"));





// a basic screen debugger
var updateInterval = 1;
var intervalID = setInterval( () =>{
  // onConsole.log("IF_MULTITOUCH_DOWN", IF_MULTITOUCH_DOWN);
  _o.onConsole.log("fish", Date.now());
  _o.onConsole.log("touchesCount", _o.touchesCount);

}, updateInterval);


// check for webxr session support
if ("xr" in navigator) {
  navigator.xr.isSessionSupported("immersive-ar").then((supported) => {
    if (supported) {
      //hide "ar-not-supported"
      document.getElementById("ar-not-supported").style.display = "none";
      
			init();
      animate();
      
      _o.xr.IS_XR_AVAIL = true;
			
    }
    else {
      // // run these here to debug otherwise run them in the above if
      init();
      animate();
    }
  });
}

// // // run these here to debug otherwise run them in the above if
// init();
// animate();


function sessionStart() {
  _o.xr.planeFound = false;
  //show #tracking-prompt
  document.getElementById("tracking-prompt").style.display = "block";
}

//
//
//
function init() {
	
	_o.clock = new Clock();
	
  _o.container = document.createElement("div");
  document.body.appendChild(_o.container);
  _o.container.id = "threecontainer";


  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  _o.renderer = renderer;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  _o.container.appendChild(renderer.domElement);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap; // default THREE.PCFShadowMap
  
  renderer.xr.addEventListener("sessionstart", sessionStart);
  


  const scene = new Scene();
  _o.scene = scene;
  _o.scene.name = "narfs222";
  

  _o.camera = new PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    20
  );
  
  _o.camera.position.y = 0.2;
  _o.camera.position.z = 0.4;
  _o.camera.position.x = 0.3;

  const light = new HemisphereLight(0xffffff, 0xbbbbff, 3.4);
  light.position.set(0.5, 1, 0.25);
  scene.add(light);
  
  {
    //Create a DirectionalLight and turn on shadows for the light
    spotlight1 = new DirectionalLight( 0xffffff, 1 );
    spotlight1.position.set( 0.1, 1, 0 );
    spotlight1.castShadow = true; // default false
    scene.add( spotlight1 );
    // const spotLightHelper = new SpotLightHelper( spotlight1 );
    // scene.add( spotLightHelper );
  
    //   //Set up shadow properties for the light
    // spotlight1.shadow.mapSize.width = 512; // default
    // spotlight1.shadow.mapSize.height = 512; // default
    // spotlight1.shadow.camera.near = 0.5; // default
    // spotlight1.shadow.camera.far = 500; // default
  }

  setupOrbitController();

  setupXRStuff();
  
    
  // setupHorseyButton();

  setupDebugMouseBox();

  setupKeyboardEvents();

  setupEvents();

  setupPlaneHelper();
  
  
  setupMousePlane();
  

  setupGridHelper();
  
  setupSelectorBox();
  
  
  
  // loadModelOnStart_CM('shoe02.glb', './models/', scene, 0.3);
  
  loadShoeAndProcess_CM();
  
  setupDebuggerHitPoint();
  
}
// init()



function onWindowResize() {
  _o.camera.aspect = window.innerWidth / window.innerHeight;
  _o.camera.updateProjectionMatrix();

  _o.renderer.setSize(window.innerWidth, window.innerHeight);
}


// renderLoop moved to file
function animate() {
  _o.renderer.setAnimationLoop(renderLoop);
}





// functioality was moved to touch events 
function onSelect() {
  // if (_o.reticle.visible && _o.gltfFlower) {
  //   // console.log("makeAHorsey is off");
  //   _o.onConsole.log("ARin38u3984", "ARin38u3984");
  //   makeAHorsey(_o.gltfFlower, _o.reticle, _o.scene);
  // 
  //   // makeCubey();
  // }
}


function setupDebuggerHitPoint(){
  const geo = new SphereGeometry( 1, 18, 18 );
  const mat = new MeshBasicMaterial( { color: 0xcc44ff } ); 
  const sphere = new Mesh( geo, mat );
  sphere.scale.setScalar(0.01);
  _o.scene.add(sphere);
  _o.hitpointSphere = sphere;
}


function setupGridHelper(){
  
    const size = 2;
    const divisions = 10;

    const gridHelper = new GridHelper( size, divisions );
    _o.scene.add( gridHelper );
    _o.gridHelper = gridHelper;
    _o.gridHelper.visible = _o.debugSettings.showGridPlane;
    
    {
      //Create a plane that receives shadows (but does not cast them)
      var pg = new PlaneGeometry( 1,1, 32, 32 );
      // const material = new THREE.MeshStandardMaterial( { color: 0xaaaaaa } )
      const material = new ShadowMaterial();
      material.opacity = 0.4;
      shadowPlane = new Mesh( pg, material );
      shadowPlane.receiveShadow = true;
      // window.shadowPlane = shadowPlane;
      shadowPlane.rotation.x = -Math.PI/2;
      // shadowPlane.rotation.
      // scene.add( shadowPlane );
      
    }
    
    
}


function setupSelectorBox(){
  
  // this is for hit testing, not the display???¿¿
  _o.box = new Box3();
  _o.selectorBoxHelper = new Box3Helper( _o.box, 0xffff00 );
  _o.scene.add( _o.selectorBoxHelper );
  _o.selectorBoxHelper.visible = false;
  _o.selectorBoxHelper2 = new Box3Helper( _o.box, 0xffff00 );
  _o.scene.add( _o.selectorBoxHelper2 );
  _o.selectorBoxHelper2.visible = false;
  
}


function setupMousePlane() {
  const geometry = new PlaneGeometry( 0.5, 0.5 );
  const material = new MeshStandardMaterial( {color: 0xff00ff, side: DoubleSide} );
  material.wireframe = true;
  const plane = new Mesh( geometry, material );
  plane.rotation.x = -Math.PI/2;
  _o.scene.add( plane );
  _o.debugMousePlane = plane;
  _o.debugMousePlane.visible = _o.debugSettings.showMousePlane;
  
}


function setupPlaneHelper() {
  
  const plane = new Plane( new Vector3( 0,1,0 ), 0 );
  const helper = new PlaneHelper( plane, 0.2, 0xffff00 );
  _o.scene.add( helper );
  _o.debugPlane = plane;
  _o.debugPlaneHelper = helper;
  _o.debugPlaneHelper.visible = _o.debugSettings.showWorldPlane;
  
}


function setupEvents(){
  
  window.addEventListener("resize", onWindowResize);

   // https://discourse.threejs.org/t/rotating-3d-object-in-webxr/15926/9
   // https://discourse.threejs.org/t/webxr-touch-input/21096
   // android not working, so back we go for now
   // we remove the priour renderer.domElement for webxrs overlay requirement
   const mm = document.getElementById("rootlike");

   
   mm.addEventListener("pointerdown", handleTouchStart);
   mm.addEventListener("pointermove", handleWhileDown);
   mm.addEventListener("pointerup", handleTouchStop);
   
   const renderer = _o.renderer;
   
   var gg = 0;
    renderer.domElement.addEventListener("pointerdown", function(ev){
      gg++;
      var bb = gg + " Down??¿¿¿?";
      _o.onConsole.log("gggggg111", `pointerdown ${bb}`);
      // debugger
    });
  

   renderer.domElement.addEventListener("mousedown", function(ev){
     gg++;
     var bb = gg + " Down??¿¿¿?";
     _o.onConsole.log("gggggg2222", `mousedown main ${bb}`);
     // debugger
   });
    
 
  renderer.domElement.addEventListener("touchstart", function(ev){
    gg++;
    var bb = gg + " Down??¿¿¿?";
    _o.onConsole.log("gggggg3333", `touchstart main ${bb}`);
    // debugger
  });


}


function setupDebugMouseBox(){

  const geometry = new BoxGeometry( 1, 1, 1 );
  // const material = new MeshStandardMaterial( {color: 0x00ff00} );
  const material = new MeshBasicMaterial( {color: 0x0000ff} );
  const raycasterCube = new Mesh( geometry, material );
  _o.raycasterCube = raycasterCube;
  // cube.position.set(0,0,0);
  _o.reticle.matrix.decompose(raycasterCube.position, raycasterCube.quaternion, raycasterCube.scale);
  raycasterCube.rotation.y = 1.1;
  raycasterCube.rotation.z = 0.4;
  const s = 0.01;
  raycasterCube.scale.set(s,s,s);
  _o.scene.add( raycasterCube );
  _o.debugMouseBox = raycasterCube;
  _o.debugMouseBox.visible = _o.debugSettings.showMouseBox;


}


function setupHorseyButton(){
  
  // debugger buttons 
  // addbuttonhorsey
  {
    // const m1 = document.getElementById("addbuttonhorsey");
    // // debugger
    // m1.addEventListener("click", (ev) => {
    //   console.log(ev);
    //   // makeAHorsey();
    //   makeAHorsey(_o.gltfFlower, _o.reticle, _o.scene);
    // });
  }

  {
    // const m1 = document.getElementById("makeCubey");
    // // debugger
    // m1.addEventListener("click", (ev) => {
    //   console.log(ev);
    //   makeCubey(0.01, scene);
    // });
  }
  
  // onConsole.log("int7", "777");

}


function setupXRStuff() {

  // AR button
  // https://developer.mozilla.org/en-US/docs/Web/API/XRSystem/requestSession
  document.body.appendChild(
    ARButton.createButton(_o.renderer, {
      requiredFeatures: ["local", "hit-test", "dom-overlay"],
      // this somewhere in the chain replaces the dom stuff with this selector
      // domOverlay: { root: document.querySelector("#overlay") },
      domOverlay: { root: document.getElementById("rootlike") },
      // domOverlay: { root: document },
    })
  );
  
  
  _o.xr.controller = _o.renderer.xr.getController(0);
  _o.xr.controller.addEventListener("select", onSelect);
  _o.scene.add(_o.xr.controller);

  _o.reticle = new Mesh(
    new RingGeometry(0.04, 0.052, 32).rotateX(-Math.PI / 2),
    new MeshBasicMaterial()
  );
  _o.reticle.matrixAutoUpdate = false;
  _o.reticle.visible = false;
  _o.scene.add(_o.reticle);


}


function setupOrbitController() {
  
  if ( ! _o.xr.IS_XR_AVAIL ) {
  // if ( false ) {
    // we remove the priour renderer.domElement for webxrs overlay requirement
    const mm = document.getElementById("rootlike");
    const orbitControls = new OrbitControls( _o.camera, mm );
    // orbitControls.addEventListener( 'change', render ); // use if there is no animation loop
    orbitControls.minDistance = 0.2;
    orbitControls.maxDistance = 100;
    orbitControls.target.set( 0, 0, - 0.2 );
    orbitControls.enableDamping = true;
    orbitControls.update();
    _o.orbitControls = orbitControls;
    
  }


}





/*
  
  this is hard coded for the shoe model, it can act as a template
  its best to keep it as a template due to its many nuance effectors

  gg = await load(filename)
  then
  process model, wrap with custom class with data
  then
  add gltf to data caches
*/
async function loadShoeAndProcess_CM(){
  
  const gltfLoader = new GLTFLoader();
  // gltfLoader.setDRACOLoader( dracoLoader );  
  // const gltf = await gltfLoader.loadAsync( './models/shoe02.glb' );
  const gltf = await gltfLoader.loadAsync( './models/shoe02withselectormesh.glb' );
  console.log("Shoe¿¿????");
  
  // this is very specific but we would like to have a more proper 
  // class based file for the selector mesh
  // find by name selector
  // geometry.clone
  
  const shoeWrapper = new TenniShoe("selector_mesh");
  shoeWrapper.add(gltf.scene);
  
  // this is a visual thing, it futzez with the spring and shadows
  gltf.scene.position.set(0,0.05,0);
  const scale = 0.9;
  gltf.scene.scale.set( scale, scale, scale);
  
  shoeWrapper.animations = gltf.animations;
  shoeWrapper.mixer = gltf.scene.mixer;
  
  // prepare materials for fade effects
  prepareMatsForFade(shoeWrapper, gltf.scene);
  
  
  // THIS IS a shoehorn for holding some data on the objects themselves since
  // we cant mutate the constructor or its methods without lotas work
  gltf.scene.traverse( ( item ) => {
    item.memID = item.id;
  });
  
  // prepare visually known meshes that will be the seltion volumne
  shoeWrapper.selectorObjects.push(gltf.scene);
  
  
  _o.gltfFlower = shoeWrapper;
  
  // dont add it, that happens later
  // _o.scene.add(shoeWrapper);
    
  _o.modelLoaded = true;

  // this could go into a "then()" but ehhhh
  // buildNavigationOnShoe();
  
  // shoeWrapper.attachNav();
  
  console.warn("debug showing shoe on load");
  makeAShoe({sourceWobject:_o.gltfFlower, reticle:_o.reticle, parent:_o.scene, addNav: true});

}


// 
// function buildNavigationOnShoe(){
//   attachNav
// }
