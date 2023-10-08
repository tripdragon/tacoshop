
			import * as THREE from 'three';

			import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
			import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
			import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

			let camera, scene, renderer;
      var horseys = [];
      var clock;


			init();
			// render();
      animate();

			function init() {

clock = new THREE.Clock();

				const container = document.createElement( 'div' );
				document.body.appendChild( container );

				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 2000 );
				camera.position.set( - 1.8, 0.6, 28.7 );
        // camera.position.set( 0,0,0 );

				scene = new THREE.Scene();


      	const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 3 );
      	light.position.set( 0.5, 1, 0.25 );
      	scene.add( light );

        const loader = new GLTFLoader().setPath( 'public/models/' );
        loader.load( 'horsey2.glb', function ( gltf ) {
          
          // horseys.push(gltf.scene);
          scene.add( gltf.scene );
          
          gltf.scene.position.set(0,4.5,0);
          
          let pp = new THREE.Group();
          scene.add( pp );
          pp.add(gltf.scene);
          {
            const geometry = new THREE.BoxGeometry( 0.1,0.1,0.1 );
            const material = new THREE.MeshStandardMaterial( {color: 0x00ff00} );
            const cube = new THREE.Mesh( geometry, material );
            cube.position.set(0,0,0);
            cube.visible = false;
            pp.add( cube );
          }
          
          horseys.push(pp);


            // gltf.scene.mixer = new THREE.AnimationMixer( gltf.scene );
            // gltf.scene.mixer = new THREE.AnimationMixer( pp );
            pp.mixer = new THREE.AnimationMixer( gltf.scene );
            for (var i = 0; i < gltf.animations.length; i++) {
              
  						pp.mixer.clipAction( gltf.animations[ i ] ).play();
            }


          // render();

        } );
        
        
        {
          const geometry = new THREE.BoxGeometry( 1, 1, 1 );
          const material = new THREE.MeshStandardMaterial( {color: 0x00ff00} );
          const cube = new THREE.Mesh( geometry, material );
          cube.position.set(0,4,0);
          cube.rotation.y = 1.1;
          cube.rotation.z = 0.4;
          scene.add( cube );
        }

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.toneMapping = THREE.ACESFilmicToneMapping;
				renderer.toneMappingExposure = 1;
				container.appendChild( renderer.domElement );

				const controls = new OrbitControls( camera, renderer.domElement );
				controls.addEventListener( 'change', render ); // use if there is no animation loop
				controls.minDistance = 2;
				controls.maxDistance = 100;
				controls.target.set( 0, 0, - 0.2 );
				controls.update();

				window.addEventListener( 'resize', onWindowResize );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

				render();

			}

			//

			function render() {

        
        let mixerUpdateDelta = clock.getDelta();
        // mixer.update( mixerUpdateDelta );
        for (var i = 0; i < horseys.length; i++) {
          horseys[i].mixer.update( mixerUpdateDelta );
          
        }

				renderer.render( scene, camera );

			}
      
      function animate() {
        requestAnimationFrame( animate );
        render();
      }
