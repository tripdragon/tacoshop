
import { APP as _o } from "./app.js";

import { Vector2, Vector3, Raycaster, Plane } from 'three';
import { testIfMobile } from './tools/testIfMobile.js';

import { GetMousePositionToScreen, GetPositionOfRaycasterFromFloor } from './tools/mouseScreenTools.js';

import { makeAHorsey } from './tools/makeAHorsey.js';

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




// ---------------------------
// 
// 
// 
// 
export function handleTouchStart(ev) {
  ev.preventDefault();
  
  _o.IS_DOWN = true;
  
  console.log("start");
  
  touchType = ev.pointerType;
  
  // _o.onConsole.log("isdown2", "isdown2 yes");
          // 
          // if (testIfMobile() && ev.touches.length > 1) {
          //   _o.IF_MULTITOUCH_DOWN = true;
          //   _o.touchesCount = ev.touches.length;
          // }

  // how to hande each?
  // if ( testIfMobile() ) {
  //   touchStartPos.x = ev.touches[0].pageX;
  //   touchStartPos.y = ev.touches[0].pageY;
  // }
  // else {
  //   touchStartPos.x = ev.pageX;
  //   touchStartPos.y = ev.pageY;
  // }
  // console.log(touchStartPos);

  touchStartPos.x = ev.clientX;
  touchStartPos.y = ev.clientY;
  // 
  // _o.onConsole.log("touchStartPos.x", touchStartPos.x);
  // _o.onConsole.log("touchStartPos.y", touchStartPos.y);
  // 
  // _o.onConsole.log("isdownAaa", "isdownAaa");
  
  //
  // :o begin raycasting
  //
  // raycasterCube
  // note targetVecOfPlane is mutated here
  GetPositionOfRaycasterFromFloor({domElement:_o.renderer.domElement, ev:ev, camera: _o.camera, floorPlane:floorPlane, vector3in: targetVecOfPlane});
  _o.onConsole.log("isdownBbb", "isdownBbb");
  _o.raycasterCube.position.copy(targetVecOfPlane);
  

  GetMousePositionToScreen(touchStartPos.x, touchStartPos.y, _o.renderer.domElement,  pointer2D);
  
  raycaster.setFromCamera( pointer2D, _o.camera );
  // const intersects = raycaster.intersectObjects( horseys, false );

  intersects.length = 0;
  
  // we use the box3 to perfrom the raycast sine object3ds dont have bounding boxes
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

    _o.selectedObjects.length = 0;
    
    _o.rollyControllers[0].attach(intersect);
    _o.selectedObjects.push(intersect);
    //horseyPosDown.copy(_o.horseys[0].position);
    
    if(_o.orbitControls) _o.orbitControls.enabled = false;


  }
  else {
    _o.selectorBoxHelper.visible = false;
  }

// _o.onConsole.log("isdown7777aaa", "isdown7777aaa");
    
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

    if (_o.selectedObjects.length === 0) {

      if (_o.reticle.visible && _o.gltfFlower) {
        // console.log("makeAHorsey is off");

        makeAHorsey(_o.gltfFlower, _o.reticle, _o.scene);

        // makeCubey();
      }
    }



}
// handleTouchStart



// ------------------------------

// 
// 
// 
// 
export function handleTouchStop(ev) {
  ev.preventDefault();
  
  // _o.onConsole.log("isdown2", "isdown2 no");
  
  _o.IS_DOWN = false;
  
  if(_o.orbitControls) _o.orbitControls.enabled = true;
  
  console.log("stop");
  
  _o.IF_MULTITOUCH_DOWN = false;

  _o.touchesCount = "NOT";
  
  _o.selectedObjects.length = 0;
  
  for (var i = 0; i < _o.rollyControllers.length; i++) {
    console.log("release 111");
    _o.rollyControllers[i].release();
  }
  
}



// moving logics
export function handleWhileDown(ev) {
  
  return;
  ev.preventDefault();
  
  // _o.onConsole.log("handleWhileDown111", "handleWhileDown111");
  
  if (_o.IS_DOWN === false) return;
  console.log("down???");

  // _o.onConsole.log("handleWhileDown222", "handleWhileDown222");
  
  if ( testIfMobile() ) {
    pointer2D.set(ev.touches[0].pageX, ev.touches[0].pageY);
  }
  else {
    pointer2D.set(ev.pageX, ev.pageY);
  }
  
  // _o.onConsole.log("handleWhileDown333", "handleWhileDown333");
  
  deltaPos2D.subVectors(pointer2D, horseyPosDown);
  
  
  if (_o.horseys.length > 0) {
    pointer3D.copy(_o.horseys[0].position);
    deltaPos3D.set(deltaPos2D.x, _o.horseys[0].position.y, deltaPos2D.y);
    _o.horseys[0].position.copy(horseyPosDown).add(deltaPos3D);
    // console.log("deltaPos3D", deltaPos3D);
  }
  
  // raycasterCube
  GetPositionOfRaycasterFromFloor({renderer:_o.renderer, ev:ev, camera: _o.camera, floorPlane: floorPlane, vector3in: targetVecOfPlane});
  _o.raycasterCube.position.copy(targetVecOfPlane);
  
  
  
  // _o.onConsole.log("handleWhileDown444", "handleWhileDown444");

  
  // debugger visulizer
  // makeCubey(0.01, scene); this here breaks it, so something is missing
  // so instead we just spam the cube below
  
  // return;
  console.log("dkfgdfg");
  
  _o.onConsole.log("othercount", ev.touches.length );
  
  _o.touchesCount = ev.touches.length;
  if (testIfMobile() && ev.touches.length > 1) {
    _o.IF_MULTITOUCH_DOWN = true;
    // _o.onConsole.log("handleWhileDown555rrr", "handleWhileDown555rrr" );
    
  }
  
  // _o.onConsole.log("handleWhileDown555", "handleWhileDown555");

  _o.onConsole.log("IF_MULTITOUCH_DOWN", "multi is not");
  
  if(_o.IF_MULTITOUCH_DOWN === true){
    const cc = makeCubey(0.01, _o.scene, 0x00ffff);
    
    _o.onConsole.log("IF_MULTITOUCH_DOWNaaa", "IF_MULTITOUCH_DOWN aaa");
    
    _o.deltaFrame.poseMatrix.decompose(cc.position, cc.quaternion, cc.scale);
    _o.onConsole.log("IF_MULTITOUCH_DOWNbbb", "IF_MULTITOUCH_DOWN bbb");
    cc.rotation.y = 1.1;
    cc.rotation.z = 0.4;
    const s = 0.01;
    cc.scale.set(s,s,s);
    
    _o.onConsole.log("IF_MULTITOUCH_DOWN", "is DOWN");
    
  }
  else {
    _o.IF_MULTITOUCH_DOWN = false;
  }
  
  // _o.onConsole.log("handleWhileDown555bbb", "handleWhileDown555bbb");


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
