

import { ModelWrapper } from './tools/modelWrapper.js';

import { Vector3, SphereGeometry, MeshBasicMaterial, Mesh, Box3, Box3Helper  } from 'three';

export class TenniShoe extends ModelWrapper {
  constructor(selectorName) {
    super(selectorName);
    
    // this.addEventListener( 'start', function ( event ) {
    // 	// alert( event.message );
    //   console.log("Here???", event.message);
    //   this.randomColor();
    // } );
  }

  isShoe = true;
  
  navBubbles = [];
  addNavBubble(item){
    this.navBubbles.push(item);
    this.selectorObjects222.push(item);
  }
  resetNav(){
    this.navBubbles.length = 0;
    const nn = this.children.slice();
    nn.forEach((item, i) => {
      if (item.isNavBubble) {
        this.remove(item);
      }
    });
  }
  
  // dothing(){
  //   this.dispatchEvent( { type: 'start', message: 'vroom vroom!' } );
  // }

  navConfig = {
    sizeScalar : 0.016, // meters not used yet
    padding: 0.05, // not used yet
    startPosition : new Vector3(),
    // restPosition : new Vector3(0,0.34, 0),
    
    navs: [
      {
        name: "blue",
        image: "narf111.png",
        color: 0xaaff22,
        ref: null,
        restPosition : new Vector3()
      },
      {
        name: "yellow",
        image: "narf222.png",
        color: 0x33aa22,
        ref : null,
        restPosition : new Vector3()
      },
      {
        name: "red",
        image: "narf333.png",
        color: 0xff11bb,
        ref: null,
        restPosition : new Vector3()
      },
      {
        name: "original",
        image: "narf444.png",
        color: 0xffffff,
        ref: null,
        restPosition : new Vector3()
      }
    ]
  }
  
  // NOTE!!!! names from export with spaces will have _ in its name!!! so no spaces!!!
  // No thats only for objects
  themes = {
    refs: {
      // and and pointer is the mesh not the material, cause the mat names
      // are hard to keep solid in the 3d editor so just .material to change in app
      // NURP, that wont work, threejs splits the mesh by material and there is no pural [materials]
      //
      // Derp, materials are not being cloned from makeAShoe
      mainCloth: {name:"under cloth", pointer:null },
      rubber: {name:"rubber", pointer:null },
      logo: {name:"logo", pointer:null },
      laces: {name:"laces", pointer:null },
      frontTip: {name:"front tip", pointer:null },
      tounge: {name:"tounge", pointer:null },
      overlayCloth: {name:"over cloth", pointer:null },
      insideCloth: {name:"", pointer:null },
      innersole: {name:"inner soles", pointer:null },
      bottom: {name:"bottom sole", pointer:null },
      eyelets: {name:"rivits", pointer:null }
    },
    original : {},
    dif1 : {},
  }

  
  attachNav() {
    
    // ok here we need a routine to spread the navs around
    // in a line or a section of a circle
    const vv = new Vector3();
    
    for (var i = 0; i < this.navConfig.navs.length; i++) {
      
      const geo = new SphereGeometry( 1, 18, 18 );
      const mat = new MeshBasicMaterial( { color: this.navConfig.navs[i].color } ); 
      
      // const sphere = new Mesh( geo, mat ); 
      const sphere = new NavBubble( geo, mat ); 
      this.add(sphere);
      

      
      // this.navConfig.objects.push();
      this.addNavBubble(sphere);
      sphere.assignData(this,this.navConfig.navs[i]);
      
      
      // setup layout
      const _s = 0.016;
      sphere.scale.setScalar(_s);
      // vv.copy(this.navConfig.restPosition);
      
      // vv.z = (i * ( (_s * 2) + 0.03)) + -0.08;
      vv.y = (i * ( (_s * 2) + 0.01)) + 0.08;
      vv.z = -0.17;
      
      this.navConfig.navs[i].restPosition.copy(vv);
      sphere.position.copy(vv);
      
      sphere.computeBounds();
      
    }

  }

  
  changeTheme(name){
    switch (name) {
      case "blue":
        this.setColorAll(0x0000ff);
        break;
      case "red":
        this.setColorAll(0xff0000);
        break;
      case "yellow":
        this.setColorAll(0xffff00);
        break;
      case "original":
        // ??????//////
        this.setColorAll(0xffffff);
        break;
      default:
    
    }
  }

  
  onTap(){
    this.meshes.forEach((item, i) => {
      item.material.color.setHex(Math.random() * 0xffffff);
    });
  }
  
  // this gets added to the mesh somewhere
  // onTapForSelector(){
  //   this.meshes.forEach((item, i) => {
  //     item.material.color.setHex(Math.random() * 0xffffff);
  //   });
  // }


}


class NavBubble extends Mesh{
  isNavBubble = true;
  shoeWrapperPointer = null;
  data = null;
	constructor( geo, mat ) {
    super(geo, mat);
    // this.computeBoundingSphere();
  }
  assignData(shoe, data){
    this.shoeWrapperPointer = shoe;
    this.data = data;
  }
  computeBounds(){
    this.updateMatrix();
    this.updateMatrixWorld();
    this.geometry.computeBoundingSphere();
    // debugger
  }
  getBoundingSphere(){
    if( ! this.geometry.boundingSphere ){
      this.computeBounds();
    }
    return this.geometry.boundingSphere;
  }
  
  onTap(ev){
    this.shoeWrapperPointer.changeTheme(this.data.name);
  }
}
