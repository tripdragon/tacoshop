
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { ARButton } from "three/addons/webxr/ARButton.js";
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

let hitTestSource = null;
let hitTestSourceRequested = false;
let planeFound = false;

var IS_XR_AVAIL = false;

var modes = {
  seek: "seek",
  moveHorsey : "moveHorsey"
}
var mode = modes.seek;


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

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  container.appendChild(renderer.domElement);

  renderer.xr.addEventListener("sessionstart", sessionStart);

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
  }

  document.body.appendChild(
    ARButton.createButton(renderer, {
      requiredFeatures: ["local", "hit-test", "dom-overlay"],
      domOverlay: { root: document.querySelector("#overlay") },
    })
  );

  function onSelect() {
    if (reticle.visible && flowersGltf) {
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
		const loader = new GLTFLoader().setPath( 'models/' );
		loader.load( 'horsey2.glb', function ( gltf ) {

			// gltf.scene.position.set(0,1,-10);
			// debugger
			var ss = 0.4;
			gltf.scene.scale.set(ss,ss,ss);
			

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
  
  if (IS_XR_AVAIL){
    renderer.domElement.addEventListener("touchstart", handleTouchStart);
  }
  else {
    renderer.domElement.addEventListener("mousedown", handleTouchStart);
  }
  
  if (IS_XR_AVAIL){
    renderer.domElement.addEventListener("touchmove", handleWhileDown);
  }
  else {
    renderer.domElement.addEventListener("mousemove", handleWhileDown);
  }
  
  
  if (IS_XR_AVAIL){
    renderer.domElement.addEventListener("touchend", handleTouchStop);
  }
  else {
    renderer.domElement.addEventListener("mouseup", handleTouchStop);
  }
  
  
  
  
  const plane = new THREE.Plane( new THREE.Vector3( 0,1,0 ), 0 );
  const helper = new THREE.PlaneHelper( plane, 1, 0xffff00 );
  scene.add( helper );


  const size = 2;
  const divisions = 10;

  const gridHelper = new THREE.GridHelper( size, divisions );
  scene.add( gridHelper );
  
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
  
  if (ev.pointerType === 'touch' && ev.changedTouches.length > 1) {
    IF_MULTITOUCH_DOWN = true;
  }
  
  if (ev.pointerType === 'touch') {
    const touches = ev.changedTouches;
    touchStartPos.x = touches[0].pageX;
    touchStartPos.y = touches[0].pageY;
    touchesCount = touches.length;
  }
  else {
    touchStartPos.x = ev.pageX;
    touchStartPos.y = ev.pageY;
  }
  console.log(touchStartPos);
  
  if (horseys.length > 0) {
    horseyPosDown.copy(horseys[0].position);
  }
  
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
  
  if (ev.pointerType === 'touch') {
    IF_MULTITOUCH_DOWN = false;
    touchesCount = touches.length;
  }
}

function handleWhileDown(ev) {
  ev.preventDefault();
  
  if (IS_DOWN === false) return;
  console.log("down???");
  
  if (ev.pointerType === 'touch') {
    const touches = ev.changedTouches;
    pointer2D.set(touches[0].pageX, touches[0].pageY);
  }
  else {
    pointer2D.set(ev.pageX, ev.pageY);
  }
  
  console.log(pointer2D);
  
  deltaPos2D.subVectors(pointer2D, horseyPosDown);
  
  
  if (horseys.length > 0) {
    pointer3D.copy(horseys[0].position);
    deltaPos3D.set(deltaPos2D.x, horseys[0].position.y, deltaPos2D.y);
    horseys[0].position.copy(horseyPosDown).add(deltaPos3D);
    console.log("deltaPos3D", deltaPos3D);
  }
  
  // raycasterCube
  
  pointer2D.set( ( ev.clientX / window.innerWidth ) * 2 - 1, - ( ev.clientY / window.innerHeight ) * 2 + 1 );
  
  // debugger
	raycaster.setFromCamera( pointer2D, camera );
  raycaster.ray.intersectPlane ( floorPlane, targetVecOfPlane);
  raycasterCube.position.copy(targetVecOfPlane);
  
  
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
  
  
}



var onConsole = new OnScreenLogger();
window.onConsole;

var updateInterval = 1;

var ii = 0;
var intervalID = setInterval( () =>{
  onConsole.log("IF_MULTITOUCH_DOWN", IF_MULTITOUCH_DOWN);
  onConsole.log("fish", Date.now());
  onConsole.log("touchesCount", touchesCount);
  onConsole.log("touchType", touchType);
  // onConsole.log("narfs", Date.now()+ 234896, "moof", "fipot");
}, updateInterval);
