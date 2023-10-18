
import { APP as _o } from '../app';

// this is an artifact from the old demo code
// it has hard sizing things, so its not really a good conpositional function like

let mesh;

import { AnimationMixer } from 'three';

// horseys.push(makeAHorsey())
export function makeAHorsey(gltfFlower, reticle, parent){
  //pick random child from flowersGltf
  // const flower =
  //   flowersGltf.children[
  //     Math.floor(Math.random() * flowersGltf.children.length)
  //   ];
  // const flower = flowersGltf;
  
  mesh = _o.gltfFlower.clone();
  
  // this is a non obvious annoying way to get the XR anchors position
  reticle.matrix.decompose(mesh.position, mesh.quaternion, mesh.scale);
  
  const scale = Math.random() * 0.4 + 0.25;
  //mesh.scale.set(scale, scale, scale);
  var ss = 0.04;
  // mesh.scale.set(ss,ss,ss);
  //random rotation
  mesh.rotateY(Math.random() * Math.PI * 2);
  // scene.add(mesh);
  parent.add(mesh);

  // debugger
  // const box = new THREE.Box3();
  // box.setFromObject (mesh);
  // 
  // const helper = new THREE.Box3Helper( box, 0xffff00 );
  // scene.add( helper );


  mesh.mixer = new AnimationMixer( mesh );
  for (var i = 0; i < mesh.animations.length; i++) {
    mesh.mixer.clipAction( mesh.animations[ i ] ).play();
  }



  _o.horseys.push(mesh);


  // animate growing via hacky setInterval then destroy it when fully grown
  // replace for a dampening effect
  const interval = setInterval(() => {
    // mesh.scale.multiplyScalar(1.01);

    mesh.rotateY(0.03);
  }, 16);
  setTimeout(() => {
    clearInterval(interval);
  }, 500);
  
} // makeAHorsey
