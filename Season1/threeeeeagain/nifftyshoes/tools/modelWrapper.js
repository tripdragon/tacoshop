



import { Object3D, Vector3, MathUtils } from 'three';
import { applySpringForce, applyForce, Spring } from './physics/physicsMini.js';

class ModelWrapper extends Object3D {
	
	// used for material effects like fade in
	meshes = [];

	frameId = 0;
	mass = 1;
	acceleration = new Vector3();
	angularAcceleration = new Vector3();
	velocity = new Vector3();
	angularVelocity = new Vector3();
	
	// friction = 1; this does not belong here, its an outside effector
	
	// a place to store one spring effector
	// spring = null; // T: Spring from physicsMini.js
	
	physicsSession = null;
	
	// this would be an impulse force since its sent once
	applyForce(force, damping){
		applyForce(this, force, damping);
	}
	
	updateSpringForce(force, damping){
		applySpringForce(this, this.spring, force, damping);
	} 
	
	createSpring(anchorPosition, restLength, constantK){
		this.spring = new Spring(anchorPosition, restLength, constantK);
	}
	
	clearAcceleration(){
		this.acceleration.set(0,0,0);
	}
	
	clearAngularAcceleration(){
		this.angularAcceleration.set(0,0,0);
	}
	
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
		
		// prepare materials for fade effects
		cc.meshes.length = 0;
		cc.traverse( ( item ) => {
			if ( item.isMesh ) {
				cc.meshes.push(item);
			}
		});
    
    return cc;

	}
	
	setOpacity(val){
		this.meshes.forEach((item, i) => {
			item.material.opacity = MathUtils.clamp(val, 0, 1);
		});
	}

}

export { ModelWrapper };
