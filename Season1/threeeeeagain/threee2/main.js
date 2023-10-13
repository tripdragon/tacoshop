
// CHeck the todo s!!!

import { APP as _o } from "./app.js";
// import { APP } from "./app.js";
// import { state } from "./app.js";
window._o = _o;
_o.fish = "narfs";

// not sure if this is tree shaking or not
// import * as THREE from "three";
import { Vector3, ShadowMaterial, PlaneGeometry, GridHelper, PlaneHelper, 
  Plane, MeshStandardMaterial, BoxGeometry, MeshBasicMaterial, RingGeometry, Mesh, PCFSoftShadowMap, 
  WebGLRenderer, Box3, Box3Helper, Scene, Clock, PerspectiveCamera, 
  HemisphereLight, DirectionalLight, SpotLightHelper } from "three";

// import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
// import { ARButton } from "three/addons/webxr/ARButton.js";
import { ARButtonAlternative as ARButton } from "./ARButtonAlternative.js";
// import "./qr.js";

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { OnScreenLogger } from './OnScreenLogger.js';

import { testIfMobile } from './tools/testIfMobile.js';

import { makeCubey } from './tools/makeCubey.js';
import { makeAHorsey } from './tools/makeAHorsey.js';
import { loadHorseyOnStart_CM } from './loadHorseyOnStart_CM.js';

import { handleTouchStart, handleWhileDown, handleTouchStop } from './touchLogics.js';



// this makes it flicker
// import "./style.css";


let container; // T: Dom el

let controller; // T : renderer.xr.getController

// let reticle; // T:Mesh
// let gltfFlower; // T : Mesh

_o.horseys = []; // T : [Mesh]


var spotlight1; // T : Spotlight: Object3D

var shadowPlane; // T: Mesh
var SHADOW_PLANE_SETUP_AR = false;

let hitTestSource = null;
let hitTestSourceRequested = false;
let planeFound = false;

var IS_XR_AVAIL = false;

var modes = {
  seek: "seek",
  moveHorsey : "moveHorsey"
}
var mode = modes.seek;



var onConsole = new OnScreenLogger(document.getElementById("rootlike"));



// a basic screen debugger
var updateInterval = 1;
var intervalID = setInterval( () =>{
  // onConsole.log("IF_MULTITOUCH_DOWN", IF_MULTITOUCH_DOWN);
  onConsole.log("fish", Date.now());
  onConsole.log("touchesCount", _o.touchesCount);
  // onConsole.log("targetVecOfPlaneA", targetVecOfPlane.z);
  // onConsole.log("targetVecOfPlaneB", targetVecOfPlane.x);
  // onConsole.log("touchType", touchType);
  // onConsole.log("narfs", Date.now()+ 234896, "moof", "fipot");
}, updateInterval);


// check for webxr session support
if ("xr" in navigator) {
  navigator.xr.isSessionSupported("immersive-ar").then((supported) => {
    if (supported) {
      //hide "ar-not-supported"
      document.getElementById("ar-not-supported").style.display = "none";
      
			init();
      animate();
      
      IS_XR_AVAIL = true;
			
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
  planeFound = false;
  //show #tracking-prompt
  document.getElementById("tracking-prompt").style.display = "block";
}

//
//
//
function init() {
	
  // onConsole.log("int1", "111");
  
	_o.clock = new Clock();
	
  container = document.createElement("div");
  document.body.appendChild(container);

  const scene = new Scene();
  _o.scene = scene;
  _o.scene.name = "narfs222";
  

  _o.camera = new PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    20
  );
  


  const light = new HemisphereLight(0xffffff, 0xbbbbff, 3.4);
  light.position.set(0.5, 1, 0.25);
  scene.add(light);
  
  {
  //Create a DirectionalLight and turn on shadows for the light
  spotlight1 = new DirectionalLight( 0xffffff, 1 );
  // spotlight1.position.set( 1, 0.5, 0 ); //default; light shining from top
  spotlight1.position.set( 0.1, 1, 0 ); //default; light shining from top
  spotlight1.castShadow = true; // default false
  scene.add( spotlight1 );
  const spotLightHelper = new SpotLightHelper( spotlight1 );
  scene.add( spotLightHelper );
  
    //   //Set up shadow properties for the light
    // spotlight1.shadow.mapSize.width = 512; // default
    // spotlight1.shadow.mapSize.height = 512; // default
    // spotlight1.shadow.camera.near = 0.5; // default
    // spotlight1.shadow.camera.far = 500; // default
  }

  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  _o.renderer = renderer;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  
  container.appendChild(renderer.domElement);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap; // default THREE.PCFShadowMap
  
  renderer.xr.addEventListener("sessionstart", sessionStart);

  // onConsole.log("int2", "222");
  
  if ( ! IS_XR_AVAIL ) {
  // if ( false ) {
    const controls = new OrbitControls( _o.camera, renderer.domElement );
    // window.controls = controls;
    // controls.addEventListener( 'change', render ); // use if there is no animation loop
    controls.minDistance = 0.2;
    controls.maxDistance = 100;
    controls.target.set( 0, 0, - 0.2 );
    controls.enableDamping = true;
    controls.update();
    _o.controls = controls;
    
    // onConsole.log("int3", "333");
  }

  // AR button
  document.body.appendChild(
    ARButton.createButton(renderer, {
    // ARButtonAlternative.createButton(renderer, {
      requiredFeatures: ["local", "hit-test", "dom-overlay"],
      // this somewhere in the chain replaces the dom stuff with this selector
      // domOverlay: { root: document.querySelector("#overlay") },
      domOverlay: { root: document.getElementById("rootlike") },
      // domOverlay: { root: document },
    })
  );
  
  
  controller = renderer.xr.getController(0);
  controller.addEventListener("select", onSelect);
  scene.add(controller);

  _o.reticle = new Mesh(
    new RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
    new MeshBasicMaterial()
  );
  _o.reticle.matrixAutoUpdate = false;
  _o.reticle.visible = false;
  _o.scene.add(_o.reticle);

  {
	  const geometry = new BoxGeometry( 1, 1, 1 );
	  const material = new MeshStandardMaterial( {color: 0x00ff00} );
	  const cube = new Mesh( geometry, material );
	  cube.position.set(0,0,-10);
	  cube.rotation.y = 1.1;
	  cube.rotation.z = 0.4;
	  // scene.add( cube );
  }

  loadHorseyOnStart_CM(scene, 0.3);
  

  window.addEventListener("resize", onWindowResize);
  
  
  // debugger buttons 
  // addbuttonhorsey
  {
    const m1 = document.getElementById("addbuttonhorsey");
    // debugger
    m1.addEventListener("click", (ev) => {
      console.log(ev);
      // makeAHorsey();
      makeAHorsey(_o.gltfFlower, _o.reticle, _o.scene);
    });
  }
  
  {
    const m1 = document.getElementById("makeCubey");
    // debugger
    m1.addEventListener("click", (ev) => {
      console.log(ev);
      makeCubey(0.01, scene);
    });
  }
  
  // onConsole.log("int7", "777");
  {
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
    scene.add( raycasterCube );
    
    
  }
  
  if ( testIfMobile() ){
     renderer.domElement.addEventListener("touchstart", handleTouchStart);
     renderer.domElement.addEventListener("touchmove", handleWhileDown);
     renderer.domElement.addEventListener("touchend", handleTouchStop);
   }
   else {
     renderer.domElement.addEventListener("mousedown", handleTouchStart);
     renderer.domElement.addEventListener("mousemove", handleWhileDown);
     renderer.domElement.addEventListener("mouseup", handleTouchStop);
   }


  
  
  
  const plane = new Plane( new Vector3( 0,1,0 ), 0 );
  const helper = new PlaneHelper( plane, 0.2, 0xffff00 );
  scene.add( helper );


  const size = 2;
  const divisions = 10;

  const gridHelper = new GridHelper( size, divisions );
  scene.add( gridHelper );
  
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
    scene.add( shadowPlane );
    
  }
  
  _o.box = new Box3();
  _o.selectorBoxHelper = new Box3Helper( _o.box, 0xffff00 );
  scene.add( _o.selectorBoxHelper );
  _o.selectorBoxHelper.visible = false;
  
}
// init()





function onWindowResize() {
  _o.camera.aspect = window.innerWidth / window.innerHeight;
  _o.camera.updateProjectionMatrix();

  _o.renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  _o.renderer.setAnimationLoop(render);
}

function render(timestamp, frame) {

  // :o
  // Begin AR testing logics for getting a point in view
  
  onConsole.log("ARin1", "arin1");
  if (frame) {
    const referenceSpace = _o.renderer.xr.getReferenceSpace();
    const session = _o.renderer.xr.getSession();

onConsole.log("ARin2", "ARin2");
    if (hitTestSourceRequested === false) {
      session.requestReferenceSpace("viewer").then(function (referenceSpace) {
        session
          .requestHitTestSource({ space: referenceSpace })
          .then(function (source) {
            hitTestSource = source;
          });
      });
onConsole.log("ARin3", "ARin3");
      session.addEventListener("end", function () {
        hitTestSourceRequested = false;
        hitTestSource = null;
      });

      hitTestSourceRequested = true;
    }

    if (hitTestSource) {
      onConsole.log("ARin4", "ARin4");
      const hitTestResults = frame.getHitTestResults(hitTestSource);

      if (hitTestResults.length) {
        onConsole.log("ARin5", "ARin5");
        if (!planeFound) {
          onConsole.log("ARin6", "ARin6");
          planeFound = true;
          //hide #tracking-prompt
          document.getElementById("tracking-prompt").style.display = "none";
          document.getElementById("instructions").style.display = "flex";
        }
        const hit = hitTestResults[0];

        _o.reticle.visible = true;
        _o.reticle.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix);
        
        onConsole.log("ARin7", "ARin7");
        // from here we could store the matrix and frame to use within the touch events
        // instead of instancing in this function
        
        // debugger visulizer
        // makeCubey(0.01, scene); this here breaks it, so something is missing
        // so instead we just spam the cube below
        
        // if(IF_MULTITOUCH_DOWN){
          
          // could cache this 
          const geometry = new BoxGeometry( 1, 1, 1 );
          // const material = new THREE.MeshStandardMaterial( {color: 0x00ff00} );
          const material = new MeshBasicMaterial( {color: 0x00ff00} );
          const cube = new Mesh( geometry, material );
          // cube.position.set(0,0,0);
          _o.reticle.matrix.decompose(cube.position, cube.quaternion, cube.scale);
          cube.rotation.y = 1.1;
          cube.rotation.z = 0.4;
          const s = 0.01;
          cube.scale.set(s,s,s);
          _o.scene.add( cube );
          
        // }
        
        // if (SHADOW_PLANE_SETUP_AR === false) {
        //   if (shadowPlane && reticle) {
        // 
        //     shadowPlane.position = reticle.position;
        //     SHADOW_PLANE_SETUP_AR = true;
        //   }
        // 
        // }
        
        
      } else {
        onConsole.log("ARin8", "ARin8");
        _o.reticle.visible = false;
      }
    }
  }
  // :D stop ar testing logics

	
  
  let mixerUpdateDelta = _o.clock.getDelta();
  // todo: not totally sure we cant run one mixer
  // mixer.update( mixerUpdateDelta );
  for (var i = 0; i < _o.horseys.length; i++) {
    _o.horseys[i].mixer.update( mixerUpdateDelta );
  }
	
  if (_o.controls) {
    _o.controls.update();
  }
  _o.renderer.render(_o.scene, _o.camera);
}



function onSelect() {
  if (_o.reticle.visible && _o.gltfFlower) {
    // console.log("makeAHorsey is off");
    
    makeAHorsey(_o.gltfFlower, _o.reticle, _o.scene);
    
    // makeCubey();
  }
}
