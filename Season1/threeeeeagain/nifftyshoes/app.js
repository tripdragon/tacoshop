

/*
import { APP as _o } from "./app.js";
*/

import { DeltaFrame } from './tools/deltaFrame.js';

import { Clock } from 'three';

import { RollyController } from './tools/rollyController.js';

export const APP = {
  narfs : 2,
  
  // these are by id as threejs keeps a unique id
  texturesCache: {},
  registerTexture(tex){
    this.texturesCache[tex.id] = tex;
  },
  
  // timers : {
  //   down: 0,
  //   startDown : 0,
  //   pointerDownClock : new Clock(),
  //   pointer
  // },
  
  xr : {
    IS_XR_AVAIL : false,
    hitTestSource: null,
    hitTestSourceRequested : false,
    planeFound : false,
    controller : null // T : renderer.xr.getController
  },
  reticle: null, // Mesh
  // modes
  
  // caches
  shoesCache : [], // T : [Mesh]
  selectablesCache : [], // [Meshes]
  addShoe(shoe){
    this.shoesCache.push(shoe);
    this.selectablesCache.push(shoe);
  },
  addSelectable(shoe){
    this.selectablesCache.push(shoe);
  },
  
  container: null,
  scene : null,
  
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
  modelLoaded : false,
  
  
  
  // touch event logics
  IS_DOWN : false,
  IF_MULTITOUCH_DOWN : false,
  touchesCount : 0,
  
  raycasterCube: null, // T : Mesh
  // these are for the raycast hit testing
  selectorBoxHelper : null, // box3Helper Object3D
  selectorBoxHelper2 : null, // box3Helper Object3D
  box : null, // let box = new Box3();
  box2 : null, // let box = new Box3();
  
  rollyControllers : [], 
  selectedObjects : [],
  
  displayBoxes: [], 
  
  debugSettings : {
    showWorldPlane : false,
    showGridPlane : false,
    showMousePlane : false,
    showMouseBox : false,
    forceReticleDesktop: false
  }
  
}
