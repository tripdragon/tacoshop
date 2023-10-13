
import { testIfMobile } from './testIfMobile.js';

import { Vector2 } from 'three';

var rect;
var localPointer = new Vector2();


export function GetMousePositionToScreen(renderer, ev, vector2In){
  rect = renderer.domElement.getBoundingClientRect();
  if ( testIfMobile() ) {
    // vector2In.set( ( ev.touches[0].pageX / window.innerWidth ) * 2 - 1, - ( ev.touches[0].pageY / window.innerHeight ) * 2 + 1 );
    vector2In.x = ( ( ev.touches[0].pageX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
    vector2In.y = - ( ( ev.touches[0].pageY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;
  }
  else {
    // vector2In.set( ( ev.clientX / window.innerWidth ) * 2 - 1, - ( ev.clientY / window.innerHeight ) * 2 + 1 );
    vector2In.x = ( ( ev.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
    vector2In.y = - ( ( ev.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;
  }
}




// blegh 6 arguments
// this mutates the vector3in to give a position to use
// raycasterCube.position.copy(vector3in);
export function GetPositionOfRaycaster({renderer, ev, raycaster, camera, floorPlane, vector3in}){
  
  GetMousePositionToScreen(renderer, ev, localPointer);
  
  // debugger
  raycaster.setFromCamera( localPointer, camera );
  raycaster.ray.intersectPlane ( floorPlane, vector3in);
  
  // example of use
  // raycasterCube.position.copy(targetVecOfPlane);
  // return targetVecOfPlane;
}
