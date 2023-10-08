// 
// import * as THREE from 'three';
// import { ARButton } from 'three/addons/webxr/ARButton.js';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// 
// let container;
// let camera, scene, renderer;
// let controller;
// 
// let reticle;
// 
// let hitTestSource = null;
// let hitTestSourceRequested = false;
// 
// init();
// animate();
// 
// function init() {
// 
// 	container = document.createElement( 'div' );
// 	document.body.appendChild( container );
// 
// 	scene = new THREE.Scene();
// 
// 	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 20 );
// 
// 	const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 3 );
// 	light.position.set( 0.5, 1, 0.25 );
// 	scene.add( light );
// 
// 	//
// 
// 	renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
// 	renderer.setPixelRatio( window.devicePixelRatio );
// 	renderer.setSize( window.innerWidth, window.innerHeight );
// 	renderer.xr.enabled = true;
// 	container.appendChild( renderer.domElement );
// 
// 	//
// 
// 	document.body.appendChild( ARButton.createButton( renderer, { requiredFeatures: [ 'hit-test' ] } ) );
// 
// 	//
// 
// 	const geometry = new THREE.CylinderGeometry( 0.1, 0.1, 0.2, 32 ).translate( 0, 0.1, 0 );
// 
// 	function onSelect() {
// 
// 		if ( reticle.visible ) {
// 
// 			const material = new THREE.MeshPhongMaterial( { color: 0xffffff * Math.random() } );
// 			const mesh = new THREE.Mesh( geometry, material );
// 			reticle.matrix.decompose( mesh.position, mesh.quaternion, mesh.scale );
// 			mesh.scale.y = Math.random() * 2 + 1;
// 			scene.add( mesh );
// 
// 		}
// 
// 	}
// 
// 	controller = renderer.xr.getController( 0 );
// 	controller.addEventListener( 'select', onSelect );
// 	scene.add( controller );
// 
// 	reticle = new THREE.Mesh(
// 		new THREE.RingGeometry( 0.15, 0.2, 32 ).rotateX( - Math.PI / 2 ),
// 		new THREE.MeshBasicMaterial()
// 	);
// 	reticle.matrixAutoUpdate = false;
// 	reticle.visible = false;
// 	scene.add( reticle );
// 
// 	//
//   {
// 	  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// 	  const material = new THREE.MeshStandardMaterial( {color: 0x00ff00} );
// 	  const cube = new THREE.Mesh( geometry, material );
// 	  cube.position.set(0,0,-10);
// 	  cube.rotation.y = 1.1;
// 	  cube.rotation.z = 0.4;
// 	  scene.add( cube );
//   }
// 
// 
// 	{
// 		const loader = new GLTFLoader().setPath( 'models/' );
// 		loader.load( 'horsey2.glb', function ( gltf ) {
// 
// 			gltf.scene.position.set(0,4,-10);
// 			scene.add( gltf.scene );
// 
// 			render();
// 
// 		} );
// 	}
// 
// 	window.addEventListener( 'resize', onWindowResize );
// 
// }
// 
// function onWindowResize() {
// 
// 	camera.aspect = window.innerWidth / window.innerHeight;
// 	camera.updateProjectionMatrix();
// 
// 	renderer.setSize( window.innerWidth, window.innerHeight );
// 
// }
// 
// //
// 
// function animate() {
// 
// 	renderer.setAnimationLoop( render );
// 
// }
// 
// function render( timestamp, frame ) {
// 
// 	if ( frame ) {
// 
// 		const referenceSpace = renderer.xr.getReferenceSpace();
// 		const session = renderer.xr.getSession();
// 
// 		if ( hitTestSourceRequested === false ) {
// 
// 			session.requestReferenceSpace( 'viewer' ).then( function ( referenceSpace ) {
// 
// 				session.requestHitTestSource( { space: referenceSpace } ).then( function ( source ) {
// 
// 					hitTestSource = source;
// 
// 				} );
// 
// 			} );
// 
// 			session.addEventListener( 'end', function () {
// 
// 				hitTestSourceRequested = false;
// 				hitTestSource = null;
// 
// 			} );
// 
// 			hitTestSourceRequested = true;
// 
// 		}
// 
// 		if ( hitTestSource ) {
// 
// 			const hitTestResults = frame.getHitTestResults( hitTestSource );
// 
// 			if ( hitTestResults.length ) {
// 
// 				const hit = hitTestResults[ 0 ];
// 
// 				reticle.visible = true;
// 				reticle.matrix.fromArray( hit.getPose( referenceSpace ).transform.matrix );
// 
// 			} else {
// 
// 				reticle.visible = false;
// 
// 			}
// 
// 		}
// 
// 	}
// 
// 	renderer.render( scene, camera );
// 
// }



import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { ARButton } from "three/addons/webxr/ARButton.js";
import "./qr.js";

import "./style.css";

let container;
let camera, scene, renderer;
let controller;

let reticle;

let hitTestSource = null;
let hitTestSourceRequested = false;
let planeFound = false;
let flowersGltf;

// check for webxr session support
if ("xr" in navigator) {
  navigator.xr.isSessionSupported("immersive-ar").then((supported) => {
    if (supported) {
      //hide "ar-not-supported"
      document.getElementById("ar-not-supported").style.display = "none";
      init();
      animate();
    }
  });
}

function sessionStart() {
  planeFound = false;
  //show #tracking-prompt
  document.getElementById("tracking-prompt").style.display = "block";
}

function init() {
  container = document.createElement("div");
  document.body.appendChild(container);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    20
  );

  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  light.position.set(0.5, 1, 0.25);
  scene.add(light);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  container.appendChild(renderer.domElement);

  renderer.xr.addEventListener("sessionstart", sessionStart);

  document.body.appendChild(
    ARButton.createButton(renderer, {
      requiredFeatures: ["local", "hit-test", "dom-overlay"],
      domOverlay: { root: document.querySelector("#overlay") },
    })
  );

  function onSelect() {
    if (reticle.visible && flowersGltf) {
      //pick random child from flowersGltf
      // const flower =
      //   flowersGltf.children[
      //     Math.floor(Math.random() * flowersGltf.children.length)
      //   ];
			const flower = flowersGltf;
      const mesh = flower.clone();

      reticle.matrix.decompose(mesh.position, mesh.quaternion, mesh.scale);
      const scale = Math.random() * 0.4 + 0.25;
      //mesh.scale.set(scale, scale, scale);
			var ss = 0.04;
			mesh.scale.set(ss,ss,ss);
      //random rotation
      mesh.rotateY(Math.random() * Math.PI * 2);
      scene.add(mesh);

      // animate growing via hacky setInterval then destroy it when fully grown
      const interval = setInterval(() => {
        //mesh.scale.multiplyScalar(1.01);

        mesh.rotateY(0.03);
      }, 16);
      setTimeout(() => {
        clearInterval(interval);
      }, 500);
    }
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
		const loader = new GLTFLoader().setPath( 'models/' );
		loader.load( 'horsey2.glb', function ( gltf ) {

			//gltf.scene.position.set(0,4,-10);
			//scene.add( gltf.scene );
			flowersGltf = gltf.scene;

			//render();

		} );
	}
	
	//load flowers.glb
	// const loader = new GLTFLoader();
  // loader.load("flowers.glb", (gltf) => {
  //   flowersGltf = gltf.scene;
  // });

  window.addEventListener("resize", onWindowResize);
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

  renderer.render(scene, camera);
}
