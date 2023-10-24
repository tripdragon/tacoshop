// keyboards events


import { APP as _o } from "./app.js";
import { makeAHorsey } from './tools/makeAHorsey.js';


export function setupKeyboardEvents(){
  window.addEventListener(
    "keydown",
    (event) => {
      if (event.defaultPrevented) {
        return;
      }

      switch (event.key) {
        case " ":
          console.log("?space¿");
          _o.reticle.visible = true;
          for (var i = 0; i < _o.horseys.length; i++) {
            _o.horseys[i].visible = false;
          }
          makeAHorsey(_o.gltfFlower, _o.reticle, _o.scene);
          break;
        case "a":
          console.log("?a");
          break;
        default:
          return;
      }

      // Cancel the default action to avoid it being handled twice
      event.preventDefault();
    },
    true,
  );
}
