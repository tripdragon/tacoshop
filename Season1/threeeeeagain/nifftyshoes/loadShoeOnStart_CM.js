
import { APP as _o } from "./app.js";

import { Group, PlaneGeometry, ShadowMaterial, Mesh, AnimationMixer } from "three";

import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { ModelWrapper } from './tools/modelWrapper.js';


export function loadShoeOnStart_CM(scene, scale = 0.4){

  const loader = new GLTFLoader().setPath( 'models/' );
  loader.load( 'shoe02.glb', function ( gltf ) {

    // gltf.scene.position.set(0,1,-10);
    // debugger
    
    
    // gltf.scene.scale.set( scale, scale, scale);
    
    // debugger
    
    // onConsole.log("int6b", "6b");
    
    // force shadows but only for the core 3d object
    // for (var i = 0; i < gltf.scene.children.length-1; i++) {
    //   if (gltf.scene.children[0].children[i].type === "Mesh") {
    //     // debugger
    //       gltf.scene.children[0].children[i].castShadow = true;
    //   }
    // }
    // its complaining so we just force it on the known for now
    // gltf.scene.children[0].children[0].castShadow = true;
    // gltf.scene.children[0].children[1].castShadow = true;
    // gltf.scene.children[0].children[2].castShadow = true;
    // 
    // // horseys.push(gltf.scene);
    // 
    // 
    // //// gltf.scene.mixer = new THREE.AnimationMixer( gltf.scene );
    // //// gltf.scene.mixer = new THREE.AnimationMixer( pp );
    // 
    // // this might be too large to store
    // gltf.scene.animations = gltf.animations;
    // 
    // gltf.scene.mixer = new AnimationMixer( gltf.scene );
    // for (var i = 0; i < gltf.animations.length; i++) {
    // 
    //   gltf.scene.mixer.clipAction( gltf.animations[ i ] ).play();
    // }

    // gltfFlower = gltf.scene;
    
    // 
    // 
    // let pp = new Group();
    let pp = new ModelWrapper();
    pp.position.set(0,0,0);
    var ss = 0.4;
    // pp.scale.set(ss,ss,ss);
    // scene.add( pp );
    
    pp.add(gltf.scene);
    // gltf.scene.position.set(0,1.4,0);
    pp.animations = gltf.animations;
    pp.mixer = gltf.scene.mixer;
    // gltf.scene.animations = null;
    // gltf.scene.mixer = null;
    
    // this is hard coded for now
    pp.boundingObjects.push(gltf.scene.children[0].children[0]);
    pp.boundingObjects.push(gltf.scene.children[1].children[0]);
    pp.boundingObjects.push(gltf.scene.children[2].children[0]);
    
    // gltfFlower = pp;
    _o.gltfFlower = pp;
    
    // TODO:
    // THIS IS EXPENSSIVE need to remove
    {
      //Create a plane that receives shadows (but does not cast them)
      var pg = new PlaneGeometry( 1,1, 32, 32 );
      // const planeMaterial = new THREE.MeshStandardMaterial( { color: 0xaaaaaa } )
      const material = new ShadowMaterial();
      material.opacity = 0.4;
      var shadowPlane = new Mesh( pg, material );
      shadowPlane.receiveShadow = true;
      // window.shadowPlane = shadowPlane;
      shadowPlane.rotation.x = -Math.PI/2;
      // shadowPlane.rotation.
      pp.add( shadowPlane );
      
    }

  } );

}
