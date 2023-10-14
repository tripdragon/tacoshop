
import { APP as _o } from "./app.js";

import { Vector2, Vector3, Raycaster, Plane } from 'three';
import { testIfMobile } from './tools/testIfMobile.js';

import { GetMousePositionToScreen, GetPositionOfRaycaster } from './tools/mouseScreenTools.js';

// 
// touch events
// 
// 
// 
// 
var touchStartPos = new Vector2(0,0);
var pointer2D = new Vector2(0,0);
var deltaPos2D = new Vector2(0,0);
var deltaPos3D = new Vector3(0,0,0);
var pointer3D = new Vector3(0,0,0);
var horseyPosDown = new Vector3(0,0,0);

var raycaster = new Raycaster();
var targetVecOfPlane = new Vector3();
var floorPlane = new Plane(new Vector3(0,1,0), 0);

var touchType = "-1";


var intersects = [];

export function handleTouchStart(ev) {
  ev.preventDefault();
  _o.IS_DOWN = true;
  console.log("start");
  
  touchType = ev.pointerType;
  

  if (testIfMobile() && ev.touches.length > 1) {
    _o.IF_MULTITOUCH_DOWN = true;
    _o.touchesCount = ev.touches.length;
  }
  
  
  
  
  if ( testIfMobile() ) {
    touchStartPos.x = ev.touches[0].pageX;
    touchStartPos.y = ev.touches[0].pageY;
  }
  else {
    touchStartPos.x = ev.pageX;
    touchStartPos.y = ev.pageY;
  }
  // console.log(touchStartPos);
  
  if (_o.horseys.length > 0) {
    horseyPosDown.copy(_o.horseys[0].position);
  }
  
  // raycasterCube
  // note targetVecOfPlane is mutated here
  GetPositionOfRaycaster({renderer:_o.renderer, ev:ev, raycaster:raycaster, camera: _o.camera, floorPlane:floorPlane, vector3in: targetVecOfPlane});
  _o.raycasterCube.position.copy(targetVecOfPlane);
  

  GetMousePositionToScreen(_o.renderer, ev, pointer2D);
  
  raycaster.setFromCamera( pointer2D, _o.camera );
  // const intersects = raycaster.intersectObjects( horseys, false );
  
  intersects = [];
  
  for (var i = 0; i < _o.horseys.length; i++) {
    _o.box.setFromObject (_o.horseys[i]);
    if(raycaster.ray.intersectsBox ( _o.box ) ){
      intersects.push(_o.horseys[i]);
    }
    

  }
		

  if ( intersects.length > 0 ) {

    console.log("NEAT!!!");
    const intersect = intersects[ 0 ];
    _o.box.setFromObject ( intersect );
    _o.selectorBoxHelper.box = _o.box;
    _o.selectorBoxHelper.visible = true;
    _o.selectorBoxHelper.updateMatrixWorld();
  					// rollOverMesh.position.copy( intersect.point ).add( intersect.face.normal );
  					// rollOverMesh.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );

  }
  else {
    _o.selectorBoxHelper.visible = false;
  }


    // debugger
    // raycaster.setFromCamera( pointer2Db, camera );
    // raycaster.ray.intersectPlane ( floorPlane, vectorin);
    // 
    // raycasterCube.position.copy(targetVecOfPlane);
    // return targetVecOfPlane;

  

    
    // test raycasting
      
    //   this.plane = new THREE.Plane(new THREE.Vector3(0,0,1), 0);
    // x = ( x / this.container.clientWidth ) * 2 - 1;
    // y = - ( y / this.container.clientHeight ) * 2 + 1;
    // this.re.raycaster.setFromCamera(new THREE.Vector2(x, y), this.re.camera);
    // return this.re.raycaster.ray.intersectPlane(this.plane, new THREE.Vector3());


}
// handleTouchStart



export function handleTouchStop(ev) {
  ev.preventDefault();
  _o.IS_DOWN = false;
  console.log("stop");
  
  _o.IF_MULTITOUCH_DOWN = false;

  _o.touchesCount = "NOT";
}



// moving logics
export function handleWhileDown(ev) {
  ev.preventDefault();
  
  onConsole.log("handleWhileDown111", "handleWhileDown111");
  
  if (_o.IS_DOWN === false) return;
  console.log("down???");

  onConsole.log("handleWhileDown222", "handleWhileDown222");
  
  if ( testIfMobile() ) {
    pointer2D.set(ev.touches[0].pageX, ev.touches[0].pageY);
  }
  else {
    pointer2D.set(ev.pageX, ev.pageY);
  }
  
  onConsole.log("handleWhileDown333", "handleWhileDown333");
  
  deltaPos2D.subVectors(pointer2D, horseyPosDown);
  
  
  if (_o.horseys.length > 0) {
    pointer3D.copy(_o.horseys[0].position);
    deltaPos3D.set(deltaPos2D.x, _o.horseys[0].position.y, deltaPos2D.y);
    _o.horseys[0].position.copy(horseyPosDown).add(deltaPos3D);
    // console.log("deltaPos3D", deltaPos3D);
  }
  
  // raycasterCube
  GetPositionOfRaycaster({renderer:_o.renderer, ev:ev, raycaster:raycaster, camera: _o.camera, floorPlane: floorPlane, vector3in: targetVecOfPlane});
  _o.raycasterCube.position.copy(targetVecOfPlane);
  
  
  
  onConsole.log("handleWhileDown444", "handleWhileDown444");

  
  // debugger visulizer
  // makeCubey(0.01, scene); this here breaks it, so something is missing
  // so instead we just spam the cube below
  
  // return;
  console.log("dkfgdfg");
  if (testIfMobile() && ev.touches.length > 1) {
    _o.IF_MULTITOUCH_DOWN = true;
    _o.touchesCount = ev.touches.length;
  }
  
  onConsole.log("handleWhileDown555", "handleWhileDown555");

  onConsole.log("IF_MULTITOUCH_DOWN", "multi is not");
  
  if(_o.IF_MULTITOUCH_DOWN){
    const cc = makeCubey(0.01, _o.scene, 0x00ffff);
    
    _o.deltaFrame.poseMatrix.decompose(cc.position, cc.quaternion, cc.scale);
    cc.rotation.y = 1.1;
    cc.rotation.z = 0.4;
    const s = 0.01;
    cc.scale.set(s,s,s);
    
    onConsole.log("IF_MULTITOUCH_DOWN", "is DOWN");
    
  }
  
  onConsole.log("handleWhileDown555bbb", "handleWhileDown555bbb");

}




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
