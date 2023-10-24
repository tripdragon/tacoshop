

import { DeltaFrame } from './tools/deltaFrame.js';

import { Clock } from 'three';

import { RollyController } from './tools/rollyController.js';

export const APP = {
  narfs : 2,
  
  container: null,
  
  onConsole: null,
  
  clock: new Clock(),// T: Clock
  
  
  // this is a the WebXR frame from render()
  deltaFrame : new DeltaFrame(),
  
  orbitControls: null, // T : OrbitControls
  
  camera: null,
  
  domElement : null,
  renderer : null,
  fish : null,
  gltfFlower: null, // Mesh
  
  reticle: null, // Mesh
  
  // touch event logics
  IS_DOWN : false,
  IF_MULTITOUCH_DOWN : false,
  touchesCount : 0,
  
  raycasterCube: null, // T : Mesh
  // these are for the raycast hit testing
  selectorBoxHelper : null, // box3Helper Object3D
  box : null, // let box = new Box3();
  
  rollyControllers : [], 
  selectedObjects : [],
  
  displayBoxes: [], 
  
}
