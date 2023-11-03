

for (var i = 0; i < _o.shoesCache[0].meshes.length; i++) {
  console.log(_o.shoesCache[0].meshes[i].name);
}

over_cloth

bb = _o.shoesCache[0].meshes.filter( (x) => x.name.includes("under_cloth") )

bb[0].material.color.set(0xff22ff)

.getObjectByName

_o.gltfFlower.traverse( ( item ) => {
  console.log(item.name);
 if ( item.isMesh ) {
   console.log(item.material.type);
   // .transparent 
   item.material.transparent = true;
   item.material.opacity = 1.0;
   parent.meshes.push(item);
 }
});


_o.gltfFlower.traverse( ( item ) => {
 // console.log(item.name);
 if (item.isMesh) {
   console.log(item.material.name);
 }
 console.log("+++++++");
});

_o.shoesCache[1].traverse( ( item ) => {
 // console.log(item.name);
 if (item.isMesh) {
   console.log(item.material.name);
 }
 console.log("+++++++");
});


for (var i = 0; i < _o.shoesCache.length; i++) {
  _o.shoesCache[i].randomColor()
}


_o.gltfFlower.traverse( ( item ) => {

_o.shoesCache[0].traverse( ( item ) => {
 if (item.isMesh) {
   // item.material.
   // _o.shoesCache[0].children[0].children[0].material.color.setHex
   item.material.color.setHex(Math.random() * 0xffffff)
 }
});


_o.gltfFlower.children[0].children[0].material
