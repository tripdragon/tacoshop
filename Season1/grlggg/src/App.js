
// import * as THREE from 'three';




import { useRef, useState, useEffect } from 'react'

// import { useRef, useState } from 'https://esm.sh/react'
// import { useRef, useState } from 'https://unpkg.com/react'

import { Canvas, useFrame } from '@react-three/fiber'

// import { OrbitControls } from '@react-three/drei'

import { useControls } from 'leva'
// import { useControls } from 'https://esm.sh/leva'

import { useGLTF, OrbitControls, ContactShadows, useAnimations } from '@react-three/drei'

import { useLoader } from '@react-three/fiber'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'


// import * as THREE from "three";

// this pulls nothing
// import * as THREE from "three";
import {Vector3, AnimationMixer} from "three";
// window.THREE = THREE;

// debugger

function Box(props) {
  
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()
  
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current.rotation.x += delta))
  
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => (event.stopPropagation(), hover(true))}
      onPointerOut={(event) => hover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}



const MODELS = {
  Moof: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/tree-beech/model.gltf',
  horsey1: 'public/horsey2.glb'
  // Lime: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/tree-lime/model.gltf',
  // Spruce: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/tree-spruce/model.gltf'
}



function Model({ url, ...props }) {
  // const { scene } = useGLTF(url)
  
  const group = useRef();
  
  // https://stackoverflow.com/a/70944199
  const { scene, animations } = useGLTF(url, true)
  
  // <primitive object={...} mounts an already existing object
  
  // const { actions, mixer } = useAnimations(animations, group);


  // const { nodes, materials, animations } = useGLTF(url)
  // const { ref, mixer, names, actions, clips } = useAnimations(animations);
  const { ref, names, actions, clips } = useAnimations(animations);
  
  var gg = useAnimations(animations);

  let mixer
  if (animations.length) {
      // mixer = new THREE.AnimationMixer(scene);
      mixer = new AnimationMixer(scene);
      animations.forEach(clip => {
          const action = mixer.clipAction(clip)
          action.play();
      });
  }
  
  useFrame((state, delta) => {
      mixer?.update(delta)
  })
  
    // debugger
  // return <primitive object={scene} {...props} />  
//   useEffect(() => {
//     actions?.jump.play()
//   })
// 
// debugger

  // useEffect(() => {
  //   // this does not handle nested
  //   // actions.Animation.play();
  // 
  //   // for (var i = 0; i < array.length; i++) {
  //   //   array[i]
  //   // }
  // 
  //   actions.Animation.play();
  // }, [mixer]);
  // 
  
  
  // debugger

  // return <primitive ref={group} object={scene} dispose={null} {...props} />
  return <primitive ref={ref} object={scene} dispose={null} {...props} />
  // return <primitive object={scene} {...props} />
}

//           <ContactShadows scale={20} blur={10} far={20} />
// <group position={[0, -10, 0]}>
//   <Model position={[0, 0.25, 0]} url={MODELS[model]} />
//   <ContactShadows scale={20} blur={10} far={20} />
// </group>

export default function App() {
  
  // debugger
  // const { model } = useControls({ model: { value: 'Moof', options: Object.keys(MODELS) } })
  const { model } = useControls({ model: { value: 'horsey1', options: Object.keys(MODELS) } })

  // const gltfHorsey = useLoader(GLTFLoader, 'models/horsey2.glb')
    // return <primitive object={gltf.scene} />

  return (
    <>
    <header>Tacos {model.toLowerCase()} like</header>

    <div style={{ width: "100vw", height: "100vh" }}>

    <Canvas camera={{ fov: 15, position: [9, 50, 80]}}>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <Box position={[-1.2, 4, 0]} />

      {/*
        <Box position={[-1.2, 0, 0]} />
        <Model position={[0, 0.25, 0]} url={MODELS[model]} />
        <primitive object={gltfHorsey.scene} />
        */}
        <Model position={[0, 0.25, 0]} url={'models/horsey2.glb'} />
        

      <OrbitControls />
    </Canvas>
    </div>
    </>
  )
}

// Silently pre-load all models
Object.values(MODELS).forEach(useGLTF.preload)
