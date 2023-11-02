

import { ModelWrapper } from './tools/modelWrapper.js';

import { Vector3 } from 'three';

export class TenniShoe extends ModelWrapper {
  constructor() {
    super();
  }

  isShoe = true;
  
  

  navConfig = {
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


}
