// // import { Canvas } from '@react-three/fiber'
// // import { useGLTF, OrbitControls, ContactShadows } from '@react-three/drei'
// // import { useControls } from 'leva'
// 
// 
// // import { createRoot } from 'https://esm.sh/react-dom/client'
// 
// // import ReactDOM from 'https://esm.sh/react-dom'
// 
// // import { React } from "react";
// // import { useState, useEffect, useRef } from "https://esm.sh/react";
// 
// import { React, useState, useEffect, useRef } from "https://esm.sh/react";
// 
// // import { React, useState, useEffect, useRef } from "https://esm.sh/react";
// // import { useState, useEffect, useRef } from "react";
// // import { React, Suspense, useRef, useState } from 'https://esm.sh/react'
// import { Canvas, useFrame } from 'https://esm.sh/@react-three/fiber'
// // import htm from 'https://esm.sh/htm'
// 
// 
// 
// // import { Mask, useMask, TransformControls, Float, Environment, OrbitControls, MeshDistortMaterial, ContactShadows, useGLTF } from '@react-three/drei'
// import { Mask, useMask, TransformControls, Float, Environment, OrbitControls, MeshDistortMaterial, ContactShadows, useGLTF } from 'https://esm.sh/@react-three/drei'
// 
// import { useControls } from 'https://esm.sh/leva'
// 
// 
// 
// 
// const MODELS = {
//   Beech: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/tree-beech/model.gltf',
//   Lime: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/tree-lime/model.gltf',
//   Spruce: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/tree-spruce/model.gltf'
// }
// 
// // export default function App() {
// //   const { model } = useControls({ model: { value: 'Beech', options: Object.keys(MODELS) } })
// //   return (
// //     <>
// //       <header>This is a {model.toLowerCase()} tree.</header>
// //       <Canvas camera={{ position: [-10, 10, 40], fov: 50 }}>
// //         <hemisphereLight color="white" groundColor="blue" intensity={0.75} />
// //         <spotLight position={[50, 50, 10]} angle={0.15} penumbra={1} />
// //         <group position={[0, -10, 0]}>
// //           <Model position={[0, 0.25, 0]} url={MODELS[model]} />
// //           <ContactShadows scale={20} blur={10} far={20} />
// //         </group>
// //         <OrbitControls />
// //       </Canvas>
// //     </>
// //   )
// // }
// 
// 
// function Box(props) {
//   // This reference will give us direct access to the mesh
//   const meshRef = useRef()
//   // Set up state for the hovered and active state
//   const [hovered, setHover] = useState(false)
//   const [active, setActive] = useState(false)
//   // Subscribe this component to the render-loop, rotate the mesh every frame
//   useFrame((state, delta) => (meshRef.current.rotation.x += delta))
//   // Return view, these are regular three.js elements expressed in JSX
//   return (
//     <mesh
//       {...props}
//       ref={meshRef}
//       scale={active ? 1.5 : 1}
//       onClick={(event) => setActive(!active)}
//       onPointerOver={(event) => setHover(true)}
//       onPointerOut={(event) => setHover(false)}>
//       <boxGeometry args={[1, 1, 1]} />
//       <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
//     </mesh>
//   )
// }
// 
// export default function App() {
//   const { model } = useControls({ model: { value: 'Beech', options: Object.keys(MODELS) } })
//   return (
//     <>
//       <header>This is a {model.toLowerCase()} tree.</header>
//       <Canvas camera={{ position: [-10, 10, 40], fov: 50 }}>
//         <ambientLight />
//         <pointLight position={[10, 10, 10]} />
//         <Box position={[-1.2, 0, 0]} />
//         <Box position={[1.2, 0, 0]} />
//         <OrbitControls />
//       </Canvas>
//     </>
//   )
// }
// 
// function Model({ url, ...props }) {
//   const { scene } = useGLTF(url)
//   // <primitive object={...} mounts an already existing object
//   return <primitive object={scene} {...props} />
// }
// 
// // Silently pre-load all models
// Object.values(MODELS).forEach(useGLTF.preload)





import { useRef, useState } from 'react'
// import { useRef, useState } from 'https://esm.sh/react'
// import { useRef, useState } from 'https://unpkg.com/react'
import { Canvas, useFrame } from '@react-three/fiber'
// import { OrbitControls } from '@react-three/drei'

import { useControls } from 'leva'
// import { useControls } from 'https://esm.sh/leva'

import { useGLTF, OrbitControls, ContactShadows } from '@react-three/drei'


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
  // Lime: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/tree-lime/model.gltf',
  // Spruce: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/tree-spruce/model.gltf'
}

function Model({ url, ...props }) {
  const { scene } = useGLTF(url)
  // <primitive object={...} mounts an already existing object
  return <primitive object={scene} {...props} />
}

//           <ContactShadows scale={20} blur={10} far={20} />
// <group position={[0, -10, 0]}>
//   <Model position={[0, 0.25, 0]} url={MODELS[model]} />
//   <ContactShadows scale={20} blur={10} far={20} />
// </group>

export default function App() {
  
  const { model } = useControls({ model: { value: 'Moof', options: Object.keys(MODELS) } })


  return (
    <>
    <header>Tacos {model.toLowerCase()} like</header>

    <div style={{ width: "100vw", height: "100vh" }}>

    <Canvas camera={{ fov: 25, position: [-1, 50, 80]}}>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <Box position={[1.2, 0, 0]} />

{/*
  <Box position={[-1.2, 0, 0]} />
  */}
      <Model position={[0, 0.25, 0]} url={MODELS[model]} />

      <OrbitControls />
    </Canvas>
    </div>
    </>
  )
}

// Silently pre-load all models
Object.values(MODELS).forEach(useGLTF.preload)
