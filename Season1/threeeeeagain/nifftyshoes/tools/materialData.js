

import { APP as _o } from '../app';
import { Color } from 'three';

// might just be better to clone the material but it eats more datas
// textures cloning is not a good idea

export class MaterialData {
  color = new Color(1,1,1);
  emissive = new Color(0,0,0);
  
  constructor({name = "", color, colorHex, emissive, emissiveHex, roughness = 0, metalness = 0, map = null}) {
    this.name = name;
    if(color) this.color.copy(color);
    if(colorHex) this.color.setHex(colorHex);
    this.roughness = roughness;
    this.metalness = metalness;
    if(emissive) this.emissive.copy(emissive);
    if(emissiveHex) this.emissive.setHex(emissiveHex);
    this.map = map;
  }
  
  copyMaterial(mat){
    this.name = mat.name;
    this.color.copy(mat.color);
    this.roughness = mat.roughness || 0;
    this.metalness = mat.metalness || 0;
    this.emissive.copy(mat.emissive);
    // map is the name for texture prop in threejs
    if (mat.map) {
      _o.registerTexture(mat.map);
      this.map = mat.map;
    }
  }
  // @mat is material to mutate
  applyToMaterial(mat){
    mat.color.copy(this.color);
    mat.emissive.copy(this.emissive);
    mat.roughness = this.roughness;
    mat.metalness = this.metalness;
    mat.map = this.map;
  }
}
