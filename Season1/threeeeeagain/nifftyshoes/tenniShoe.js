

import { ModelWrapper } from './tools/modelWrapper.js';

import { Vector3, SphereGeometry, MeshBasicMaterial, Mesh, Box3, Box3Helper  } from 'three';

import { MaterialData } from './tools/materialData.js';


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
  
  
  clone( {recursive, uniqueMaterials} ){
    const cc = super.clone({recursive:recursive, uniqueMaterials:uniqueMaterials});
    cc.cacheThemeOriginal();
    return cc;
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
      // {
      //   name: "red",
      //   image: "narf333.png",
      //   color: 0xff11bb,
      //   ref: null,
      //   restPosition : new Vector3()
      // },
      {
        name: "original",
        image: "narf444.png",
        color: 0xffffff,
        ref: null,
        restPosition : new Vector3()
      },
      {
        name: "dif1",
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
    // refs: {
    //   // and and pointer is the mesh not the material, cause the mat names
    //   // are hard to keep solid in the 3d editor so just .material to change in app
    //   // NURP, that wont work, threejs splits the mesh by material and there is no pural [materials]
    //   //
    //   // Derp, materials are not being cloned from makeAShoe
    //   "under cloth": { pointer:null },
    //   mainCloth: {name:"under cloth", pointer:null },
    //   rubber: {name:"rubber", pointer:null },
    //   logo: {name:"logo", pointer:null },
    //   laces: {name:"laces", pointer:null },
    //   frontTip: {name:"front tip", pointer:null },
    //   tounge: {name:"tounge", pointer:null },
    //   overlayCloth: {name:"over cloth", pointer:null },
    //   insideCloth: {name:"under cloth", pointer:null },
    //   innersole: {name:"inner soles", pointer:null },
    //   bottom: {name:"bottom sole", pointer:null },
    //   eyelets: {name:"rivits", pointer:null }
    // },
    
    // type : MaterialData is set from cacheThemeOriginal()
    // these should beable to be default overrides as blender and import have difs
    // original : {
    //   "rivits": new MaterialData({ colorHex: 0xffffff, metalness: 1.0, roughness: 0 }),
    //   "logo": new MaterialData({ colorHex: 0x0000bb}),
    //   "over cloth": new MaterialData({ renderOrder: -1 }),
    //   "under cloth": new MaterialData({ metalness: 1.0, roughness: 0 })
    // },
    original : {},
    // the others should follow this type
    dif1 : {
      "tounge": new MaterialData({ colorHex: 0x0000ff }),
      "rivits": new MaterialData({ colorHex: 0xffffff, metalness: 1.0, roughness: 0 }),
      "logo": new MaterialData({ colorHex: 0xffffff, texture: null }),
      "laces": new MaterialData({ colorHex: 0xffaaff, texture: null }),
      "under cloth": new MaterialData({ colorHex: 0xff00ff }),
      "over cloth": new MaterialData({ colorHex: 0xff00ff, visible: true, renderOrder: -1 }),
      "rubber": new MaterialData({ colorHex: 0xeeeeee }),
      "bottom sole": new MaterialData({ colorHex: 0x2222222, texture: "bottom1" }),
      "inner soles": new MaterialData({ colorHex: 0x111111 }),
      "front tip": new MaterialData({ colorHex: 0xeeeeee }),
      // insideCloth: { color: 0x00aa00, texture: null },
    },
  }
  
  cacheThemeOriginal(name){  
    this.themes.original = {};
    for (const prop in this.materials) {
      let mat = this.materials[prop];
      let matd = new MaterialData(mat);
      this.themes.original[mat.name] = matd;
    }
    // UGH we dont have ANY way without saving a custom prop in the gltf
    // to tell what is an overlay, so we HAVE to select by name and set its renderorder
    // debugger
    this.themes.original['under cloth'].renderOrder = -1;
    let gg = this.getObjectByName('over_cloth');
    gg.renderOrder = -1;
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
      case "dif1":
        // this.setColorAll(0xffff00);
        this.applyTheme("dif1");
        break;
      case "original":
        // ??????//////
        // this.setColorAll(0xffffff);
        this.applyTheme("original");
        break;
      default:
    
    }
  }
  
  applyTheme(themename){
    for (const propname in this.themes[themename]) {
      let mat = this.materials[propname];
      let rm = this.themes[themename][propname];
      if (mat) {
        rm.applyToMaterial(mat);
        //console.log(propname);
      }
    };
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
