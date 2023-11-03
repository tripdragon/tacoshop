

// Render loop

import { APP as _o } from "./app.js";

// @frame comes from XR system
export function renderLoop(timestamp, frame) {

  // :o
  // Begin AR testing logics for getting a point in view
  
  
  if (frame && _o.modelLoaded === true) {
    const referenceSpace = _o.renderer.xr.getReferenceSpace();
    const session = _o.renderer.xr.getSession();

    if (_o.xr.hitTestSourceRequested === false) {
      session.requestReferenceSpace("viewer").then(function (referenceSpace) {
        session
          .requestHitTestSource({ space: referenceSpace })
          .then(function (source) {
            _o.xr.hitTestSource = source;
          });
      });
    
      session.addEventListener("end", function () {
        _o.xr.hitTestSourceRequested = false;
        _o.xr.hitTestSource = null;
      });

      _o.xr.hitTestSourceRequested = true;
    }

    if (_o.xr.hitTestSource) {
      
      const hitTestResults = frame.getHitTestResults(_o.xr.hitTestSource);

      if (hitTestResults.length) {
        
        if (!_o.xr.planeFound) {
          
          _o.xr.planeFound = true;
          //hide #tracking-prompt
          document.getElementById("tracking-prompt").style.display = "none";
          document.getElementById("instructions").style.display = "flex";
          
        }
        const hit = hitTestResults[0];

        _o.reticle.visible = true;
        
        const mm = hit.getPose(referenceSpace).transform.matrix;
        
        _o.reticle.matrix.fromArray(mm);
        
        _o.deltaFrame.poseMatrix.fromArray(mm);
        

        // from here we could store the matrix and frame to use within the touch events
        // instead of instancing in this function
        
                        // // debugger visulizer
                        // // makeCubey(0.01, scene); this here breaks it, so something is missing
                        // // so instead we just spam the cube below
                        // 
                        // if(_o.IF_MULTITOUCH_DOWN){
                        // 
                        //   // could cache this 
                        //   const geometry = new BoxGeometry( 1, 1, 1 );
                        //   // const material = new THREE.MeshStandardMaterial( {color: 0x00ff00} );
                        //   const material = new MeshBasicMaterial( {color: 0x00ff00} );
                        //   const cube = new Mesh( geometry, material );
                        //   // cube.position.set(0,0,0);
                        //   _o.reticle.matrix.decompose(cube.position, cube.quaternion, cube.scale);
                        //   cube.rotation.y = 1.1;
                        //   cube.rotation.z = 0.4;
                        //   const s = 0.01;
                        //   cube.scale.set(s,s,s);
                        //   _o.scene.add( cube );
                        // 
                        // }
        
        // if (SHADOW_PLANE_SETUP_AR === false) {
        //   if (shadowPlane && reticle) {
        // 
        //     shadowPlane.position = reticle.position;
        //     SHADOW_PLANE_SETUP_AR = true;
        //   }
        // 
        // }

      }
      else {
        _o.reticle.visible = false;
      }
    }
  }
  // :D stop ar testing logics

	
  
  let mixerUpdateDelta = _o.clock.getDelta();
  // todo: not totally sure we cant run one mixer
  // mixer.update( mixerUpdateDelta );
  // for (var i = 0; i < _o.horseys.length; i++) {
  //   _o.horseys[i].mixer.update( mixerUpdateDelta );
  // }
  for (var i = 0; i < _o.shoesCache.length; i++) {
    _o.shoesCache[i].mixer.update( mixerUpdateDelta );
  }
	
  if (_o.orbitControls) {
    _o.orbitControls.update();
  }
  _o.renderer.render(_o.scene, _o.camera);
}
