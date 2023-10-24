

import { Vector3 } from 'three';

var _forceV = new Vector3();
var _forceAngularV = new Vector3();
var _friction = new Vector3();



/*

gg = new PhysicsSession({
  wobj:moof, 
  vecForce: new Vector3(0,0,1), 
  damping: 0.2, 
  coefriction: 0.04,
  spring: maybe new Spring(moof.position, 100, 0.2, 0.4),
  func: function(){
    console.log("fiiiish");
  }
})
gg.start();



gg = new PhysicsSession({
  wobj:moof, 
  damping: 0.2, 
  coefriction: 0.04,
  // var _spring = new Spring(moof.position, 400, 0.094);
  spring: new Spring(moof.position, 100, 0.2, 0.4),
  func: function(){
    console.log("fiiiish");
  }
})
gg.start();

*/

export class PhysicsSession{
  selected = null;
  type = "fish"; // spring, impulse
  force = null; // T : Force or Spring
  angularForce = null; // T : Force or Spring
  loopId = 0;
  forceWork = new Vector3();
  angularForceWork = new Vector3();
  // constructor( { wobj, vecForce, damping, coefriction, spring, func } ){
  constructor( { wobj, force, angularForce, type, func } ){
    this.selected = wobj;
    this.force = force;
    this.angularForce = angularForce;
    this.type = type;
    if (type === "impulse") {}
    this.func = func;
  }
  start(){
  
    if (this.type === "impulse") {
      // here we mutate the velocity of the object and prep it for the loop
      applyForce(this.selected, this.force.vecForce, this.force.damping);
      this.selected.clearAcceleration();
    }
    else if (this.type === "spring") {
      
    }
    console.log(this.selected.position);
    
    // angular force
    applyAngularForce(this.selected, this.angularForce.vecForce, this.angularForce.damping);
    this.selected.clearAngularAcceleration();
  
    
    // looping function start
    
    this.loopR = function() {
      
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
    
    const _this = this;
    _this.loopR();


  } // start()
  

}



export class Force{
  vecForce = new Vector3();
  damping = 1;
  coefriction = 1; // coefficient of friction is multiplyScalar'd so its default is 1
  constructor({vecForce, damping, coefriction}){
    this.vecForce.copy(vecForce);
    this.damping = damping;
    this.coefriction = coefriction;
  }

}


// the 3d model can store a spring, but otherwise you would place
// a spring into a cache maybe, but its a side object otherwise
// var _spring = new Spring(moof.position, 400, 0.094);

export class Spring{
  anchor = new Vector3();
  restLength = 0;
  k = 0;
  damping = 1;
  //coefriction = 1;
  constructor({anchor, restLength, constantK, damping}){
    this.anchor.copy(anchor);
    this.restLength = restLength;
    this.k = constantK;
    this.damping = damping;
  }
}

// @velocity : wobj.velocity
// coefriction : 0.1
function getFriction(vecIn, velocity, coefriction){

  vecIn.copy(velocity);
  vecIn.multiplyScalar(-1);
  vecIn.normalize();
  vecIn.multiplyScalar(coefriction); // friction coefficient

}



// @force : Vector3

export function applyAngularForce(wobj, force, damping = 1){
  _forceAngularV.copy(force);
  _forceAngularV.divideScalar(wobj.mass);
  wobj.angularAcceleration.add(_forceAngularV);
  wobj.angularVelocity.add(wobj.angularAcceleration);
  wobj.angularVelocity.multiplyScalar(damping);
  
  // this is guessing since .rotation is an T: Euler and does not follow vector .add
  // since they have order options, default being XYZ
  wobj.rotation.x += wobj.angularVelocity.x;
  wobj.rotation.y += wobj.angularVelocity.y;
  wobj.rotation.z += wobj.angularVelocity.z;
}

export function applyForce(wobj, force, damping = 1){
  _forceV.copy(force);
  _forceV.divideScalar(wobj.mass);
  wobj.acceleration.add(_forceV);
  wobj.velocity.add(wobj.acceleration);
  wobj.velocity.multiplyScalar(damping);
  wobj.position.add(wobj.velocity);
}

// this computes the spring force which then is tossed to applyForce
export function applySpringForce(wobj, spring, force, damping = 1){

  _forceV.copy(wobj.position);

  _forceV.sub(spring.anchor);
  
  var mag = _forceV.length();
  
  var delta = mag - spring.restLength;

  _forceV.normalize();

  var gg = -1 * spring.k * delta;

  _forceV.multiplyScalar( gg );

  applyForce(wobj, _forceV, damping);

}



// export flickForce(wobj, force, damping){
//   var _stop = stop;
// // moof.position.x = (_stop - moof.position.x) * speeeed * speeeed + moof.position.x;
// moof.position.x = easeInQuad(moof.position.x, 100, speeeed);
// // moof.position.x = easeOutBounce(moof.position.x, 100, speeeed);
// draw();
// 
//   applyForce(moof, new Vector2(-20,0));
// 
// 
// 
//   if ( Math.abs( moof.velocity.length() ) >= 0.001) {
//   // if (true) {
//     mm = requestAnimationFrame(loopR);
//     moof.clearAcceleration();
// 
//   }
//   else {
//     console.log("done??¿¿?¿");
//   }
// 
// }
