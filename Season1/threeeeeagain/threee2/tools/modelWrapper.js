



import { Object3D } from 'three';

class ModelWrapper extends Object3D {

	constructor() {

		super();

		this.isGroup = true;
		this.isModelWrapper = true;

		this.type = 'Group';
    
    // some models need only select objects for its selectors
    // this is hard to assign dynamicly in app
    this.boundingObjects = [];

	}
  
  // clone(){
  // 
  // }
  clone( recursive ) {
    const cc = new this.constructor().copy( this, recursive );
    
    cc.boundingObjects = this.boundingObjects.slice(0);
    
    return cc;

	}

}

export { ModelWrapper };
