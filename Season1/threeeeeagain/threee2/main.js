
// CHeck the todo s!!!

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
// import { ARButton } from "three/addons/webxr/ARButton.js";
import { ARButtonAlternative as ARButton } from "./ARButtonAlternative.js";
// import "./qr.js";

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { OnScreenLogger } from './OnScreenLogger.js';


// this makes it flicker
// import "./style.css";

let controls; // T : OrbitControls


let container; // T: Dom el

let camera, scene, renderer, clock;

let controller; // T : renderer.xr.getController

let reticle; // T:Mesh
let flowersGltf; // T : Mesh
var horseys = []; // T : [Mesh]
window.horseys = horseys;

var raycasterCube; // T: Mesh

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
window.onConsole;

var updateInterval = 1;

var ii = 0;
var intervalID = setInterval( () =>{
  onConsole.log("IF_MULTITOUCH_DOWN", IF_MULTITOUCH_DOWN);
  onConsole.log("fish", Date.now());
  onConsole.log("touchesCount", touchesCount);
  onConsole.log("targetVecOfPlaneA", targetVecOfPlane.z);
  onConsole.log("targetVecOfPlaneB", targetVecOfPlane.x);
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
	
  onConsole.log("int1", "111");
  
	clock = new THREE.Clock();
	
  container = document.createElement("div");
  document.body.appendChild(container);

  scene = new THREE.Scene();
  window.scene = scene;

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    20
  );
  


  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 3.4);
  light.position.set(0.5, 1, 0.25);
  scene.add(light);
  
  {
  //Create a DirectionalLight and turn on shadows for the light
  spotlight1 = new THREE.DirectionalLight( 0xffffff, 1 );
  // spotlight1.position.set( 1, 0.5, 0 ); //default; light shining from top
  spotlight1.position.set( 0.1, 1, 0 ); //default; light shining from top
  spotlight1.castShadow = true; // default false
  scene.add( spotlight1 );
  const spotLightHelper = new THREE.SpotLightHelper( spotlight1 );
  scene.add( spotLightHelper );
  
    //   //Set up shadow properties for the light
    // spotlight1.shadow.mapSize.width = 512; // default
    // spotlight1.shadow.mapSize.height = 512; // default
    // spotlight1.shadow.camera.near = 0.5; // default
    // spotlight1.shadow.camera.far = 500; // default
  }

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  container.appendChild(renderer.domElement);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap


  renderer.xr.addEventListener("sessionstart", sessionStart);

onConsole.log("int2", "222");
  if ( ! IS_XR_AVAIL ) {
  // if ( false ) {
    controls = new OrbitControls( camera, renderer.domElement );
    window.controls = controls;
    // controls.addEventListener( 'change', render ); // use if there is no animation loop
    controls.minDistance = 0.2;
    controls.maxDistance = 100;
    controls.target.set( 0, 0, - 0.2 );
    controls.enableDamping = true;
    controls.update();
    
    onConsole.log("int3", "333");
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
  
  onConsole.log("int4", "444");

  function onSelect() {
    if (reticle.visible && flowersGltf) {
      // console.log("makeAHorsey is off");
      
      makeAHorsey();
      
      // makeCubey();
    }
  }
  
  
  function makeAHorsey(){
    //pick random child from flowersGltf
    // const flower =
    //   flowersGltf.children[
    //     Math.floor(Math.random() * flowersGltf.children.length)
    //   ];
    const flower = flowersGltf;
    const mesh = flower.clone();
    
    // this is a non obvious annoying way to get the XR anchors position
    reticle.matrix.decompose(mesh.position, mesh.quaternion, mesh.scale);
    
    const scale = Math.random() * 0.4 + 0.25;
    //mesh.scale.set(scale, scale, scale);
    var ss = 0.04;
    mesh.scale.set(ss,ss,ss);
    //random rotation
    mesh.rotateY(Math.random() * Math.PI * 2);
    scene.add(mesh);


    mesh.mixer = new THREE.AnimationMixer( mesh );
    for (var i = 0; i < mesh.animations.length; i++) {
      mesh.mixer.clipAction( mesh.animations[ i ] ).play();
    }



    horseys.push(mesh);


    // animate growing via hacky setInterval then destroy it when fully grown
    // replace for a dampening effect
    const interval = setInterval(() => {
      // mesh.scale.multiplyScalar(1.01);

      mesh.rotateY(0.03);
    }, 16);
    setTimeout(() => {
      clearInterval(interval);
    }, 500);
  }
  

  
  onConsole.log("int5", "555");

  controller = renderer.xr.getController(0);
  controller.addEventListener("select", onSelect);
  scene.add(controller);

  reticle = new THREE.Mesh(
    new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial()
  );
  reticle.matrixAutoUpdate = false;
  reticle.visible = false;
  scene.add(reticle);

  {
	  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
	  const material = new THREE.MeshStandardMaterial( {color: 0x00ff00} );
	  const cube = new THREE.Mesh( geometry, material );
	  cube.position.set(0,0,-10);
	  cube.rotation.y = 1.1;
	  cube.rotation.z = 0.4;
	  // scene.add( cube );
  }

	{
    onConsole.log("int6", "6a");
    
		const loader = new GLTFLoader().setPath( 'models/' );
		loader.load( 'horsey2.glb', function ( gltf ) {

			// gltf.scene.position.set(0,1,-10);
			// debugger
			var ss = 0.4;
      
			gltf.scene.scale.set(ss,ss,ss);
			
      // debugger
      
      onConsole.log("int6b", "6b");
      
      // force shadows but only for the core 3d object
      // for (var i = 0; i < gltf.scene.children.length-1; i++) {
      //   if (gltf.scene.children[0].children[i].type === "Mesh") {
      //     // debugger
      //       gltf.scene.children[0].children[i].castShadow = true;
      //   }
      // }
      gltf.scene.children[0].children[0].castShadow = true;
      gltf.scene.children[0].children[1].castShadow = true;
      gltf.scene.children[0].children[2].castShadow = true;

			// horseys.push(gltf.scene);


			// gltf.scene.mixer = new THREE.AnimationMixer( gltf.scene );
			// gltf.scene.mixer = new THREE.AnimationMixer( pp );
			
			// this might be too large to store
			gltf.scene.animations = gltf.animations;
			
			gltf.scene.mixer = new THREE.AnimationMixer( gltf.scene );
			for (var i = 0; i < gltf.animations.length; i++) {
				
				gltf.scene.mixer.clipAction( gltf.animations[ i ] ).play();
			}

			// flowersGltf = gltf.scene;
      
      // 
      // 
      let pp = new THREE.Group();
      pp.position.set(0,0,0);
      var ss = 0.4;
      // pp.scale.set(ss,ss,ss);
      scene.add( pp );
      
      pp.add(gltf.scene);
      gltf.scene.position.set(0,1.9,0);
      pp.animations = gltf.animations;
      pp.mixer = gltf.scene.mixer;
      // gltf.scene.animations = null;
      // gltf.scene.mixer = null;
      
      flowersGltf = pp;
      
      // TODO:
      // THIS IS EXPENSSIVE need to remove
      {
        //Create a plane that receives shadows (but does not cast them)
        var pg = new THREE.PlaneGeometry( 1,1, 32, 32 );
        // const planeMaterial = new THREE.MeshStandardMaterial( { color: 0xaaaaaa } )
        const material = new THREE.ShadowMaterial();
        material.opacity = 0.4;
        var shadowPlane = new THREE.Mesh( pg, material );
        shadowPlane.receiveShadow = true;
        // window.shadowPlane = shadowPlane;
        shadowPlane.rotation.x = -Math.PI/2;
        // shadowPlane.rotation.
        pp.add( shadowPlane );
        
      }
      
			
			// scene.add( gltf.scene );

			
							
							// 
							// 
		          // let pp = new THREE.Group();
							// pp.position.set(0,0,-10);
							// var ss = 0.4;
							// pp.scale.set(ss,ss,ss);
		          // scene.add( pp );
							// 
							// pp.add(gltf.scene);
							// pp.visible = false;
							// gltf.scene.position.set(0,4.5,0);
							// 
							// flowersGltf = pp;
							// window.gg = pp;
							// 
		          // {
		          //   const geometry = new THREE.BoxGeometry( 1,1,1 );
		          //   const material = new THREE.MeshStandardMaterial( {color: 0xffff00} );
		          //   const cube = new THREE.Mesh( geometry, material );
		          //   // cube.visible = false;
		          //   pp.add( cube );
							// 	cube.position.set(0,0,0);
		          // }
							// 
		          // horseys.push(pp);
							// 
							// 
		          // // gltf.scene.mixer = new THREE.AnimationMixer( gltf.scene );
		          // // gltf.scene.mixer = new THREE.AnimationMixer( pp );
		          // pp.mixer = new THREE.AnimationMixer( gltf.scene );
		          // for (var i = 0; i < gltf.animations.length; i++) {
							// 
							// 	pp.mixer.clipAction( gltf.animations[ i ] ).play();
		          // }
							// 


							

		





			//render();

		} );
	}
	
	//load flowers.glb
	// const loader = new GLTFLoader();
  // loader.load("flowers.glb", (gltf) => {
  //   flowersGltf = gltf.scene;
  // });

  window.addEventListener("resize", onWindowResize);
  
  
  // debugger buttons 
  // addbuttonhorsey
  {
    const m1 = document.getElementById("addbuttonhorsey");
    // debugger
    m1.addEventListener("click", (ev) => {
      console.log(ev);
      makeAHorsey();
    });
  }
  
  {
    const m1 = document.getElementById("makeCubey");
    // debugger
    m1.addEventListener("click", (ev) => {
      console.log(ev);
      makeCubey();
    });
  }
  
  onConsole.log("int7", "777");
  {
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    // const material = new THREE.MeshStandardMaterial( {color: 0x00ff00} );
    const material = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
    raycasterCube = new THREE.Mesh( geometry, material );
    // cube.position.set(0,0,0);
    reticle.matrix.decompose(raycasterCube.position, raycasterCube.quaternion, raycasterCube.scale);
    raycasterCube.rotation.y = 1.1;
    raycasterCube.rotation.z = 0.4;
    const s = 0.01;
    raycasterCube.scale.set(s,s,s);
    scene.add( raycasterCube );
    
    
  }
  
  
//   el.addEventListener("touchstart", handleStart);
// el.addEventListener("touchend", handleEnd);
// el.addEventListener("touchcancel", handleCancel);
// el.addEventListener("touchmove", handleMove);
  
  // if (IS_XR_AVAIL){
  //   renderer.domElement.addEventListener("touchstart", handleTouchStart);
  // }
  // else {
  //   renderer.domElement.addEventListener("mousedown", handleTouchStart);
  // }
  // 
  // if (IS_XR_AVAIL){
  //   renderer.domElement.addEventListener("touchmove", handleWhileDown);
  // }
  // else {
  //   renderer.domElement.addEventListener("mousemove", handleWhileDown);
  // }
  // 
  // if (IS_XR_AVAIL){
  //   renderer.domElement.addEventListener("touchend", handleTouchStop);
  // }
  // else {
  //   renderer.domElement.addEventListener("mouseup", handleTouchStop);
  // }
  // 
  
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


  
  
  
  const plane = new THREE.Plane( new THREE.Vector3( 0,1,0 ), 0 );
  const helper = new THREE.PlaneHelper( plane, 0.2, 0xffff00 );
  scene.add( helper );


  const size = 2;
  const divisions = 10;

  const gridHelper = new THREE.GridHelper( size, divisions );
  scene.add( gridHelper );
  
  {
    //Create a plane that receives shadows (but does not cast them)
    var pg = new THREE.PlaneGeometry( 1,1, 32, 32 );
    // const material = new THREE.MeshStandardMaterial( { color: 0xaaaaaa } )
    const material = new THREE.ShadowMaterial();
    material.opacity = 0.4;
    shadowPlane = new THREE.Mesh( pg, material );
    shadowPlane.receiveShadow = true;
    // window.shadowPlane = shadowPlane;
    shadowPlane.rotation.x = -Math.PI/2;
    // shadowPlane.rotation.
    scene.add( shadowPlane );
    
  }
  
}
onConsole.log("int8", "888");


function testIfMobile(){
  if (navigator.userAgent.match(/Android/i)
   || navigator.userAgent.match(/webOS/i)
   || navigator.userAgent.match(/iPhone/i)
   || navigator.userAgent.match(/iPad/i)
   || navigator.userAgent.match(/iPod/i)
  ){
   return true;
  }
  return false;
}


function makeCubey(){

  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  // const material = new THREE.MeshStandardMaterial( {color: 0x00ff00} );
  const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
  const cube = new THREE.Mesh( geometry, material );
  cube.position.set(0,0,0);
  // reticle.matrix.decompose(cube.position, cube.quaternion, cube.scale);
  cube.rotation.y = 1.1;
  cube.rotation.z = 0.4;
  const s = 0.01;
  cube.scale.set(s,s,s);
  scene.add( cube );

}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  renderer.setAnimationLoop(render);
}

function render(timestamp, frame) {
	// console.log("1121212");
  
  
  // console.log("?¿??¿¿");
  
  if (frame) {
    const referenceSpace = renderer.xr.getReferenceSpace();
    const session = renderer.xr.getSession();

    if (hitTestSourceRequested === false) {
      session.requestReferenceSpace("viewer").then(function (referenceSpace) {
        session
          .requestHitTestSource({ space: referenceSpace })
          .then(function (source) {
            hitTestSource = source;
          });
      });

      session.addEventListener("end", function () {
        hitTestSourceRequested = false;
        hitTestSource = null;
      });

      hitTestSourceRequested = true;
    }

    if (hitTestSource) {
      const hitTestResults = frame.getHitTestResults(hitTestSource);

      if (hitTestResults.length) {
        if (!planeFound) {
          planeFound = true;
          //hide #tracking-prompt
          document.getElementById("tracking-prompt").style.display = "none";
          document.getElementById("instructions").style.display = "flex";
        }
        const hit = hitTestResults[0];

        reticle.visible = true;
        reticle.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix);
        
        // debugger visulizer
        // makeCubey(); this here breaks it, so something is missing
        // so instead we just spam the cube below
        
        if(IF_MULTITOUCH_DOWN){
        
          const geometry = new THREE.BoxGeometry( 1, 1, 1 );
          // const material = new THREE.MeshStandardMaterial( {color: 0x00ff00} );
          const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
          const cube = new THREE.Mesh( geometry, material );
          // cube.position.set(0,0,0);
          reticle.matrix.decompose(cube.position, cube.quaternion, cube.scale);
          cube.rotation.y = 1.1;
          cube.rotation.z = 0.4;
          const s = 0.01;
          cube.scale.set(s,s,s);
          scene.add( cube );
          
        }
        
        // if (SHADOW_PLANE_SETUP_AR === false) {
        //   if (shadowPlane && reticle) {
        // 
        //     shadowPlane.position = reticle.position;
        //     SHADOW_PLANE_SETUP_AR = true;
        //   }
        // 
        // }
        
        
      } else {
        reticle.visible = false;
      }
    }
  }

	
  let mixerUpdateDelta = clock.getDelta();
  // mixer.update( mixerUpdateDelta );
  for (var i = 0; i < horseys.length; i++) {
    horseys[i].mixer.update( mixerUpdateDelta );
  }
	
  if (controls) {
    controls.update();
  }
  renderer.render(scene, camera);
}







// 
// touch events
// 
// 
// 
// 
var touchStartPos = new THREE.Vector2(0,0);
var pointer2D = new THREE.Vector2(0,0);
var deltaPos2D = new THREE.Vector2(0,0);
var deltaPos3D = new THREE.Vector3(0,0,0);
var pointer3D = new THREE.Vector3(0,0,0);
var horseyPosDown = new THREE.Vector3(0,0,0);

// 
// 
// raycaster = new THREE.Raycaster();
// 				pointer = new THREE.Vector2();
//         pointer.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
// 
// 				raycaster.setFromCamera( pointer, camera );
//         const intersects = raycaster.intersectObjects( objects, false );
// 
//         .intersectPlane ( plane : Plane, target : Vector3 ) : Vector3
// plane - the Plane to intersect with.
// target — the result will be copied into this Vector3.
// 
// Intersect this Ray with a Plane, returning the intersection point or null if there is no intersection.
// 
// 
// 
// 
// 				if ( intersects.length > 0 ) {
// 
// 					const intersect = intersects[ 0 ];
// 
// 					rollOverMesh.position.copy( intersect.point ).add( intersect.face.normal );
// 					rollOverMesh.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
// 
// 					render();
// 
// 				}

var IS_DOWN = false;
var IF_MULTITOUCH_DOWN = false;
var touchesCount = -1;

var raycaster = new THREE.Raycaster();
var targetVecOfPlane = new THREE.Vector3();
var floorPlane = new THREE.Plane(new THREE.Vector3(0,1,0), 0);

var touchType = "-1";

function handleTouchStart(ev) {
  ev.preventDefault();
  IS_DOWN = true;
  console.log("start");
  
  touchType = ev.pointerType;
  
  
  if (testIfMobile() && ev.touches.length > 1) {
    IF_MULTITOUCH_DOWN = true;
    touchesCount = ev.touches.length;
  }
  
  
  // touchesCount = "NARF";
  // if (ev.pointerType === 'touch') {
  if ( testIfMobile() ) {
    touchStartPos.x = ev.touches[0].pageX;
    touchStartPos.y = ev.touches[0].pageY;
  }
  else {
    touchStartPos.x = ev.pageX;
    touchStartPos.y = ev.pageY;
  }
  // console.log(touchStartPos);
  
  if (horseys.length > 0) {
    horseyPosDown.copy(horseys[0].position);
  }
  
  // raycasterCube
  GetPositionOfRaycaster(ev, targetVecOfPlane);
  raycasterCube.position.copy(targetVecOfPlane);
  
  
  
  // test raycasting
  
//   this.plane = new THREE.Plane(new THREE.Vector3(0,0,1), 0);
// x = ( x / this.container.clientWidth ) * 2 - 1;
// y = - ( y / this.container.clientHeight ) * 2 + 1;
// this.re.raycaster.setFromCamera(new THREE.Vector2(x, y), this.re.camera);
// return this.re.raycaster.ray.intersectPlane(this.plane, new THREE.Vector3());


}
function handleTouchStop(ev) {
  ev.preventDefault();
  IS_DOWN = false;
  console.log("stop");
  
  IF_MULTITOUCH_DOWN = false;
  // if (ev.pointerType === 'touch') {
  //   // touchesCount = touches.length;
  // }
  touchesCount = "NOT";
}

function handleWhileDown(ev) {
  ev.preventDefault();
  
  if (IS_DOWN === false) return;
  console.log("down???");
  
  
  // touchesCount = touches.length;
  
  // if (ev.pointerType === 'touch') {
  if ( testIfMobile() ) {
    pointer2D.set(ev.touches[0].pageX, ev.touches[0].pageY);
  }
  else {
    pointer2D.set(ev.pageX, ev.pageY);
  }
  
  // console.log(pointer2D);
  
  deltaPos2D.subVectors(pointer2D, horseyPosDown);
  
  
  if (horseys.length > 0) {
    pointer3D.copy(horseys[0].position);
    deltaPos3D.set(deltaPos2D.x, horseys[0].position.y, deltaPos2D.y);
    horseys[0].position.copy(horseyPosDown).add(deltaPos3D);
    // console.log("deltaPos3D", deltaPos3D);
  }
  
  // raycasterCube
  GetPositionOfRaycaster(ev, targetVecOfPlane);
  raycasterCube.position.copy(targetVecOfPlane);
  
  
}


// this takes the mouse event and a vector3 that will mutate
var pointer2Db = new THREE.Vector2();
var rect;
function GetPositionOfRaycaster(ev, vectorin){
  
  // https://discourse.threejs.org/t/offset-between-mouseposition-and-raycast-intersection/25568/7
  rect = renderer.domElement.getBoundingClientRect();
  if ( testIfMobile() ) {
    // pointer2Db.set( ( ev.touches[0].pageX / window.innerWidth ) * 2 - 1, - ( ev.touches[0].pageY / window.innerHeight ) * 2 + 1 );
    pointer2Db.x = ( ( ev.touches[0].pageX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
    pointer2Db.y = - ( ( ev.touches[0].pageY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;
  }
  else {
    // pointer2Db.set( ( ev.clientX / window.innerWidth ) * 2 - 1, - ( ev.clientY / window.innerHeight ) * 2 + 1 );
    pointer2Db.x = ( ( ev.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
    pointer2Db.y = - ( ( ev.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;
    
  }
  
  // debugger
  raycaster.setFromCamera( pointer2Db, camera );
  raycaster.ray.intersectPlane ( floorPlane, vectorin);
  
  // raycasterCube.position.copy(targetVecOfPlane);
  // return targetVecOfPlane;
}
