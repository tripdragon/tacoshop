

import { BoxGeometry, MeshBasicMaterial, Mesh } from 'three';

export function makeCubey(scale = 1, parent){

  const geometry = new BoxGeometry( 1, 1, 1 );
  // const material = new THREE.MeshStandardMaterial( {color: 0x00ff00} );
  const material = new MeshBasicMaterial( {color: 0x00ff00} );
  const cube = new Mesh( geometry, material );
  cube.position.set(0,0,0);
  // reticle.matrix.decompose(cube.position, cube.quaternion, cube.scale);
  cube.rotation.y = 1.1;
  cube.rotation.z = 0.4;
  const s = 0.01;
  cube.scale.set( scale, scale, scale);
  if(parent){
    parent.add( cube );
  }
  
  return cube;
}
