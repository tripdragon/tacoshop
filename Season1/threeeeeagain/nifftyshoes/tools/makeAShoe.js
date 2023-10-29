
import { APP as _o } from '../app';

// this is an artifact from the old demo code
// it has hard sizing things, so its not really a good conpositional function like



let wobject; // Type of ModelWrapper so it can have physics

import { AnimationMixer, Vector3, MathUtils } from 'three';

import { PhysicsSession, Spring, Force, applySpringForce, applyAngularForce, applyForce } from './physics/physicsMini.js';

import { SphereGeometry, MeshBasicMaterial, Mesh, Box3, Box3Helper} from 'three';


// horseys.push(makeAHorsey())

// @parent is an Scene level Object3D or Scene

export function makeAShoe({sourceWobject, reticle, parent}){
  
  //pick random item from flowersGltf
  // const flower =
  //   flowersGltf.children[
  //     Math.floor(Math.random() * flowersGltf.children.length)
  //   ];
  
  // debugger
  // this is a Type : ModelWrapper
  wobject = sourceWobject.clone();
  
  // this is a non obvious annoying way to get the XR anchors position
  reticle.matrix.decompose(wobject.position, wobject.quaternion, wobject.scale);
  
  // const scale = Math.random() * 0.4 + 0.25;
  
  //random rotation
  wobject.rotateY(Math.random() * Math.PI * 2);
  
  
  parent.add(wobject);


  // const box = new THREE.Box3();
  // box.setFromObject (wobject);
  // 
  // const helper = new THREE.Box3Helper( box, 0xffff00 );
  // scene.add( helper );


  wobject.mixer = new AnimationMixer( wobject );
  for (var i = 0; i < wobject.animations.length; i++) {
    wobject.mixer.clipAction( wobject.animations[ i ] ).play();
  }



  _o.shoesCache.push(wobject);



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
  wobject.position.y -= 0.1;// offset the start of the spring a bit
  var gg = new PhysicsSession({
    wobj:wobject, 
    // damping lower below 1 slower 0.91, higher below 1 .99 faster
    // force : new Spring( { anchor: mV.add(new Vector3(0,0.1,0)), restLength: 0.1, constantK: 0.02, damping: 0.8  }),
    force : new Spring( { anchor: mV.add(new Vector3(0,0.1,0)), restLength: 0.1, constantK: 0.014, damping: 0.91  }),
    // angularForce : new Force( { vecForce: new Vector3(0,0.6,0), damping : 0.9781, coefriction: 1 }),
    angularForce : new Force( { vecForce: new Vector3(0,0.6,0), damping : 0.9281, coefriction: 1 }),
    type: "spring",
    //spring: maybe new Spring(moof.position, 100, 0.2, 0.4),
    func: function(){
      console.log("fiiiish");
    }
  });
  // start auto wraps the logic into a rafqlooooop
  // gg.start();
  buildAnimation(gg);



  attachNavBobbles(parent);

  return wobject;


} // makeAHorsey




// this is a starter shoehorn for just getting a bunch of animation things
// together instead of an animation system just yet
// @physicsSession : PhysicsSession
function buildAnimation( _p ){
  
  // first setup velocitys and such

  if (_p.type === "impulse") {
    // here we mutate the velocity of the object and prep it for the loop
    applyForce(_p.selected, _p.force.vecForce, _p.force.damping);
    _p.selected.clearAcceleration();
  }
  // else if (this.type === "spring") {}
  
  // angular force
  applyAngularForce(_p.selected, _p.angularForce.vecForce, _p.angularForce.damping);
  _p.selected.clearAngularAcceleration();

  _p.selected.setOpacity(0);
  var matOpacity = 0;
  let fadeInRate = 0.02;
  
  //
  //
  // Set up loop, which we have to keep a reference to to work with
  
  const _this = _p;
  
    
  // looping function start
  
  _this.loopR = function() {
    
    // this makes it fricken jitter infinitely
    // getFriction(_this.forceWork, _this.selected.velocity, _this.force.coefriction);
    
    if(_this.type === "spring"){
      applySpringForce(_this.selected, _this.force, _this.forceWork, _this.force.damping);
    }
    else if (_this.type === "impulse") {
      // console.log("¿");
      applyForce(_this.selected, _this.forceWork, _this.force.damping);
    }
    
    // todo: this does not belong here
    // _this.selected.rotateY( _this.selected.velocity.length()* Math.PI * 9);
    applyAngularForce(_this.selected, _this.angularForceWork, _this.angularForce.damping);
    
    
    // More animations states would start here
    // if they were like a cache
    
    matOpacity += fadeInRate;
    _this.selected.setOpacity(matOpacity);
    
    // materials.forEach
    //   opacity = Math.Clamp(0,1, opacity + rate);
    // 
    // spartikles system, bast a few
    // use reverse atractor
    // spin them a bit
    // deltaTime >= lim
    // 
    
    
    
    
    _this.selected.clearAcceleration();
    _this.selected.clearAngularAcceleration();
    
    // if ( Math.abs( _this.selected.velocity.length() ) >= 0.00001) {
    if ( Math.abs( _this.selected.velocity.length() && _this.selected.angularVelocity.length() ) >= 0.0001) {
    // if (true) {
      // console.log(" reloop ");
      _this.loopId = requestAnimationFrame(_this.loopR);
    }
    else {
      console.log("done??¿¿?¿");
    }
    
    
    // console.log(_this.selected.position);

  }
  
  // start it
  _this.loopR();
  
  
}




const navConfig = {
  sizeScalar : 0.016, // meters
  padding: 0.05,
  startPosition : new Vector3(),
  restPosition : new Vector3(0,0.05, 0),
  objects: [],
  navs: [
    {
      name: "aaa",
      image: "narf111.png",
      color: 0xaaff22,
      ref: null
    },
    {
      name: "bbb",
      image: "narf222.png",
      color: 0x33aa22,
      ref : null
    },
    {
      name: "ccc",
      image: "narf333.png",
      color: 0xff11bb,
      ref: null
    },
    {
      name: "fff",
      image: "narf444.png",
      color: 0xffffbb,
      ref: null
    }
  ]
}


function attachNavBobbles(parent) {
  
  
  
  
  
  for (var i = 0; i < navConfig.navs.length; i++) {
    const geo = new SphereGeometry( 1, 18, 18 );
    const mat = new MeshBasicMaterial( { color: navConfig.navs[i].color } ); 
    const sphere = new Mesh( geo, mat ); 
    navConfig.objects.push();
    
  }
  
// 
//   {
//   const geometry = new SphereGeometry( 1, 18, 18 ); 
//   const material = new MeshBasicMaterial( { color: 0xffff00 } ); 
//   const sphere = new Mesh( geometry, material ); 
// 
//   // sphere.position.set(0,1,0);
//   sphere.position.y = 0.22;
// 
//   sphere.scale.setScalar(0.016);
//   // sphere.scale.setScalar(1.27);
//   shoe.add(sphere);
// 
//   window.dfkjgd = sphere;
//   // debugger
// 
//   // window.dfkjgd.position.y = 0.22
//   window.Box3 = Box3;
//   window.Box3Helper = Box3Helper;
//   // window.scene = _o.scene;
// }
// 
//   {
//   const geometry = new SphereGeometry( 1, 18, 18 ); 
//   const material = new MeshBasicMaterial( { color: 0xff1100 } ); 
//   const sphere = new Mesh( geometry, material ); 
// 
//   sphere.position.set(0,0.22,0.06);
//   // sphere.position.y = 0.42;
// 
//   sphere.scale.setScalar(0.016);
//   shoe.add(sphere);
// }
// 
// {
// const geometry = new SphereGeometry( 1, 18, 18 ); 
// const material = new MeshBasicMaterial( { color: 0xaabbcc } ); 
// const sphere = new Mesh( geometry, material ); 
// 
// sphere.position.set(0,0.22,0.1);
// // sphere.position.y = 0.42;
// 
// sphere.scale.setScalar(0.016);
// shoe.add(sphere);
// }  
// 
}
