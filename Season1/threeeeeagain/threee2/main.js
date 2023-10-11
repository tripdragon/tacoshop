
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { ARButton } from "three/addons/webxr/ARButton.js";
// import "./qr.js";

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


// this makes it flicker
// import "./style.css";

let controls;
let container;
let camera, scene, renderer;
let controller;

let reticle;

let hitTestSource = null;
let hitTestSourceRequested = false;
let planeFound = false;
let flowersGltf;

var horseys = [];
      var clock;


var IS_XR_AVAIL = false;


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
  });
}

// // run these here to debug otherwise run them in the above if
init();
animate();


function sessionStart() {
  planeFound = false;
  //show #tracking-prompt
  document.getElementById("tracking-prompt").style.display = "block";
}

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
  // if ( true ) {
    controls = new OrbitControls( camera, renderer.domElement );
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
      makeCubey();
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
  
  function makeCubey(){
  
	  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
	  // const material = new THREE.MeshStandardMaterial( {color: 0x00ff00} );
	  const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
	  const cube = new THREE.Mesh( geometry, material );
	  cube.position.set(0,0,-10);
	  cube.rotation.y = 1.1;
	  cube.rotation.z = 0.4;
    const s = 0.1;
    cube.scale.set(s,s,s);
	  scene.add( cube );
  
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

			flowersGltf = gltf.scene;
			
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
