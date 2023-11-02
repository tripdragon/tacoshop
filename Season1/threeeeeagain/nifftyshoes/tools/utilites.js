
export function preparMatsForFade(parent, model) {
  model.traverse( ( item ) => {
    if ( item.isMesh ) {
      console.log(item.material.type);
      // .transparent 
      item.material.transparent = true;
      item.material.opacity = 1.0;
      parent.meshes.push(item);
    }
  });
}
