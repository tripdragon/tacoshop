
import { createRoot } from 'https://esm.sh/react-dom/client'

// import ReactDOM from 'https://esm.sh/react-dom'

import { React, Suspense, useRef, useState } from 'https://esm.sh/react'
import { Canvas, useFrame } from 'https://esm.sh/@react-three/fiber'
import htm from 'https://esm.sh/htm'


import { Mask, useMask, TransformControls, Float, Environment, OrbitControls, MeshDistortMaterial, ContactShadows, useGLTF } from '@react-three/drei'
// import { Mask, useMask, TransformControls, Float, Environment, OrbitControls, MeshDistortMaterial, ContactShadows, useGLTF } from 'https://esm.sh/@react-three/drei'

import { useControls } from 'https://esm.sh/leva'

function MaskedContent({ invert, ...props }) {
  /* The useMask hook has to refer to the mask id defined below, the content
   * will then be stamped out.
   */
  const stencil = useMask(1, invert)
  const group = useRef()
  const [hovered, hover] = useState(false)
  useFrame((state) => (group.current.rotation.y = state.clock.elapsedTime / 2))
  return (
    <group {...props}>
      <mesh position={[-0.75, 0, 0]} scale={1} ref={group}>
        <torusKnotGeometry args={[0.6, 0.2, 128, 64]} />
        <meshNormalMaterial {...stencil} />
      </mesh>
      <mesh position={[0.75, 0, 0]} onPointerOver={() => hover(true)} onPointerOut={() => hover(false)}>
        <sphereGeometry args={[0.8, 64, 64]} />
        <meshStandardMaterial {...stencil} color={hovered ? 'orange' : 'white'} />
      </mesh>
    </group>
  )
}

// 
function Target(props) {
  const { scene } = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/target-stand/model.gltf')
  return <primitive object={scene} {...props} />
}
// 
// export function App() {
//   const { invert, colorWrite, depthWrite } = useControls({ invert: false, colorWrite: true, depthWrite: false })
//   return (
//     <Canvas camera={{ position: [0, 0, 5] }}>
//       <hemisphereLight intensity={1} groundColor="red" />
//       <Suspense fallback={null}>
//         <Float floatIntensity={5} rotationIntensity={2} speed={10}>
//           {/* Mask sets the shape of the area that is shown, and cuts everything else out.
//            * This is valid only for meshes that use useMask with the same id, everything else
//            * is not affected.
//            */}
//           <Mask id={1} colorWrite={colorWrite} depthWrite={depthWrite} position={[-1.1, 0, 0]}>
//             <ringGeometry args={[0.5, 1, 64]} />
//           </Mask>
//         </Float>
// 
//         <TransformControls position={[1.1, 0, 0]}>
//           {/* You can build compound-masks using the same id. Masks are otherwise the same as
//            *  meshes, you can deform or transition them any way you like
//            */}
//           <Mask id={1} colorWrite={colorWrite} depthWrite={depthWrite}>
//             {(spread) => (
//               <>
//                 <planeGeometry args={[2, 2, 128, 128]} />
//                 <MeshDistortMaterial distort={0.5} radius={1} speed={10} {...spread} />
//               </>
//             )}
//           </Mask>
//         </TransformControls>
// 
//         <MaskedContent invert={invert} />
//         <Target position={[0, -1, -3]} scale={1.5} />
//         <ContactShadows frames={1} scale={10} position={[0, -1, 0]} blur={8} opacity={0.55} />
//         <Environment preset="city" />
//         <OrbitControls makeDefault />
//       </Suspense>
//     </Canvas>
//   )
// }
// 



function Box(props) {
  // This reference will give us direct access to the mesh
  const meshRef = useRef()
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (meshRef.current.rotation.x += delta))
  // Return view, these are regular three.js elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

createRoot(document.getElementById('root')).render(
  <Canvas>
    <ambientLight />
    <pointLight position={[10, 10, 10]} />
    <Box position={[-1.2, 0, 0]} />
    <Box position={[1.2, 0, 0]} />
    
    <hemisphereLight intensity={1} groundColor="red" />
    <Suspense fallback={null}>
      <Float floatIntensity={5} rotationIntensity={2} speed={10}>
        {/* Mask sets the shape of the area that is shown, and cuts everything else out.
         * This is valid only for meshes that use useMask with the same id, everything else
         * is not affected.
         */}
         {/**/}
        <Mask id={1} colorWrite={colorWrite} depthWrite={depthWrite} position={[-1.1, 0, 0]}>
          <ringGeometry args={[0.5, 1, 64]} />
        </Mask>
      </Float>

      <TransformControls position={[1.1, 0, 0]}>
        {/* You can build compound-masks using the same id. Masks are otherwise the same as
         *  meshes, you can deform or transition them any way you like
         */}
        <Mask id={1} colorWrite={colorWrite} depthWrite={depthWrite}>
          {(spread) => (
            <>
              <planeGeometry args={[2, 2, 128, 128]} />
              <MeshDistortMaterial distort={0.5} radius={1} speed={10} {...spread} />
            </>
          )}
        </Mask>
      </TransformControls>

      <MaskedContent invert={invert} />
      <Target position={[0, -1, -3]} scale={1.5} />
      <ContactShadows frames={1} scale={10} position={[0, -1, 0]} blur={8} opacity={0.55} />
      <Environment preset="city" />
      <OrbitControls makeDefault />
    </Suspense>

  </Canvas>,
)
