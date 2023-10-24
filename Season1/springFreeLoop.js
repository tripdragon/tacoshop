


// this is a goal to produce the simpliest of free loading loops that self cancelAnimationFrame
// this one is inspired by springs
// in that you make a dampening and once its reached a limit it stops
// so its fiddly, but you can compute its estimated time via simple maths tabun



// https://stackoverflow.com/questions/17103785/multiple-requestanimationframe-performance

function animateFor4Second() {
    var start = Date.now() // note this
    function loop() {
        console.log('rendering')
        if (Date.now() - start < 4000) { //note this also
            requestAnimationFrame(loop);
        }
    }
    loop(); // fire the initial loop
}

animateFor4Second()


function timeStamp() {
         return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
       }
  
  
       12.284754 / 1.192384
       10.302682692823787
            

var moof = {
  x : 12.284754
}
freeLoop(moof, "x", 0.192384, 0.001)

function freeLoop(wobj, prop, damp = 0.0192384, out = 0.01){
  var ii = 0;
  
  var mm = 0;
  
  function loop() {
    // console.log("tacos", wobj, prop, damp, out);
    let delta = moof[prop] - damp;
    if (delta >= out ) {
      ii++;
      moof[prop] -= damp;
      console.log(ii, moof[prop], delta);
      mm = requestAnimationFrame(loop);
    }
    else{
      console.log("Done!?");
      cancelAnimationFrame(mm);
    }
    
  }
  loop();
}



force = mass • acceleration
var moof = {
  x : 12.284754,
  y : 2,
  z: 0,
  vel : { x: 1.2, y: 0},
  mass : 1,
  
}
applyForce({})

f = force / mass
ac += f
vel += ac
pos += vel
ac * 0


____
