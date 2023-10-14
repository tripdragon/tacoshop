

import { DeltaFrame } from './tools/deltaFrame.js';

export const APP = {
  narfs : 2,
  
  onConsole: null,
  
  clock: null,// T: Clock
  
  frame: null, // this is a the WebXR frame from render()
  frameAnchorMatrix : null, 
  timestamp: 0,
  
  controls: null, // T : OrbitControls
  
  camera: null,
  
  renderer : null,
  fish : null,
  gltfFlower: null, // Mesh
  
  reticle: null, // Mesh
  
  // touch event logics
  IS_DOWN : false,
  IF_MULTITOUCH_DOWN : false,
  touchesCount : 0,
  
  raycasterCube: null, // T : Mesh
  selectorBoxHelper : null, // box3Helper Object3D
  box : null, // let box = new Box3();
  
  
  deltaFrame : new DeltaFrame(),
  
}
