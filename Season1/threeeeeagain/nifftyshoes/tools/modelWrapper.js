



import { Object3D, Vector3, MathUtils } from 'three';
import { applySpringForce, applyForce, Spring } from './physics/physicsMini.js';

class ModelWrapper extends Object3D {
	
	constructor() {

		super();

		this.isGroup = true;
		this.isModelWrapper = true;

		this.type = 'Group';
    
	}
	
	isModelWrapper = true;
	
	// used for material effects like fade in
	meshes = [];
	
	// used to build a box3 bounds from for raycasting selecting and moving
	// as some meshes before and later added might not fit visually what should be
	// the core selectable volume
	// CLONING however will be problematic, nested items and by name etc
	// so its not referencing the original objects
	selectorObjects = [];
	// some models need only select objects for its selectors
	// this is hard to assign dynamicly in app
	// this.boundingObjects = [];

	frameId = 0;
	mass = 1;
	acceleration = new Vector3();
	angularAcceleration = new Vector3();
	velocity = new Vector3();
	angularVelocity = new Vector3();
	
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
	

  
  // clone(){
  // 
  // }
  clone( recursive ) {
		// super.clone( recursive );

    const cc = new this.constructor().copy( this, recursive );
    
		cc.memID = this.id;
														
		// this is no good, it will retain wrong links
    // cc.boundingObjects = this.boundingObjects.slice(0);
		// cc.selectorObjects.length = 0;
		// for (var i = 0; i < this.selectorObjects.length; i++) {
		// 	cc.selectorObjects.
		// }
		// 
		
		// cc.traverse( ( item ) => {
		// 	if ( item.isMesh ) {
		// 		cc.meshes.push(item);
		// 	}
		// });
		// 
		
		
		// we need to rebuild the selectorObjects from 
		const ids = this.selectorObjects.map( (x) => x.id );
		
		// prepare materials for fade effects
		cc.meshes.length = 0;
		cc.traverse( ( item ) => {
			if ( item.isMesh ) {
				cc.meshes.push(item);
			}
			
			// resetup selectors
			for (var i = 0; i < ids.length; i++) {
				if (item.memID === ids[i]) {
					cc.selectorObjects.push(item)
				}
			}
		});
		
		// debugger
    
		// THIS IS a shoehorn for holding some data on the objects themselves since
		// we cant mutate the constructor or its methods without lotas work
		// this.traverse( ( item ) => {
		// 	item.memID = item.id;
		// });
		
	
	  // this is a visual decision config
	  // we visually need to pick and store what objects will
	  // be the soruce of the selector volume
	  // for now its just the shoe, but if we need to obmit say shoe laces
	  // then well need to tweak this
	  // pp.selectorObjects.push(wobject);


		
		
    return cc;

	}
	
	setOpacity(val){
		this.meshes.forEach((item, i) => {
			item.material.opacity = MathUtils.clamp(val, 0, 1);
		});
	}

}

export { ModelWrapper };
