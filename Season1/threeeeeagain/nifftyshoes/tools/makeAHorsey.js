
import { APP as _o } from '../app';

// this is an artifact from the old demo code
// it has hard sizing things, so its not really a good conpositional function like



let wobject; // Type of ModelWrapper so it can have physics

import { AnimationMixer, Vector3 } from 'three';

import { PhysicsSession, Spring, Force } from './physics/physicsMini.js';

// horseys.push(makeAHorsey())

// @parent is an Scene level Object3D or Scene
export function makeAHorsey(gltfFlower, reticle, parent){
  
  //pick random child from flowersGltf
  // const flower =
  //   flowersGltf.children[
  //     Math.floor(Math.random() * flowersGltf.children.length)
  //   ];
  // const flower = flowersGltf;
  
  wobject = _o.gltfFlower.clone();
  
  // this is a non obvious annoying way to get the XR anchors position
  reticle.matrix.decompose(wobject.position, wobject.quaternion, wobject.scale);
  
  const scale = Math.random() * 0.4 + 0.25;
  //wobject.scale.set(scale, scale, scale);
  var ss = 0.04;
  // wobject.scale.set(ss,ss,ss);
  //random rotation
  wobject.rotateY(Math.random() * Math.PI * 2);
  
  // scene.add(wobject);
  
  parent.add(wobject);

  // debugger
  // const box = new THREE.Box3();
  // box.setFromObject (wobject);
  // 
  // const helper = new THREE.Box3Helper( box, 0xffff00 );
  // scene.add( helper );


  wobject.mixer = new AnimationMixer( wobject );
  for (var i = 0; i < wobject.animations.length; i++) {
    wobject.mixer.clipAction( wobject.animations[ i ] ).play();
  }



  _o.horseys.push(wobject);

  var yy = wobject.position.y;
  var iy = 0;
  // 
  // // animate growing via hacky setInterval then destroy it when fully spun
  // // replace for a damping effect
  // const interval = setInterval(() => {
  //   // wobject.scale.multiplyScalar(1.01);
  // 
  //   // wobject.rotateY(0.03);
  //   wobject.position.y += 0.002;
  // }, 16);
  // setTimeout(() => {
  //   clearInterval(interval);
  // }, 500);
  
  
  
  // finding the right value of force and damping is verrry fiddly
  // so we will test replacing with a spring with high k value to act like a force

  // var gg = new PhysicsSession({
  //   wobj:wobject, 
  //   // damping lower below 1 slower 0.91, higher below 1 .99 faster
  //   force : new Force( { vecForce: new Vector3(0,0.002,0), damping : 0.9781, coefriction: 1 }),
  //   type: "impulse",
  //   //spring: maybe new Spring(moof.position, 100, 0.2, 0.4),
  //   func: function(){
  //     console.log("fiiiish");
  //   }
  // })
  // gg.start();
  
  
  // spring type
  const mV = wobject.position.clone();
  wobject.position.y -= 0.2;// offset the start of the spring a bit
  var gg = new PhysicsSession({
    wobj:wobject, 
    // damping lower below 1 slower 0.91, higher below 1 .99 faster
    // force : new Spring( { anchor: mV.add(new Vector3(0,0.1,0)), restLength: 0.1, constantK: 0.02, damping: 0.8  }),
    force : new Spring( { anchor: mV.add(new Vector3(0,0.1,0)), restLength: 0.1, constantK: 0.014, damping: 0.91  }),
    angularForce : new Force( { vecForce: new Vector3(0,0.6,0), damping : 0.9781, coefriction: 1 }),
    type: "spring",
    //spring: maybe new Spring(moof.position, 100, 0.2, 0.4),
    func: function(){
      console.log("fiiiish");
    }
  })
  gg.start();
  

} // makeAHorsey
