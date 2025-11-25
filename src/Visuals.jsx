import React, { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MeshTransmissionMaterial, Float, Environment, Lightformer } from '@react-three/drei'
import { easing } from 'maath'
import * as THREE from 'three'

export default function DualArtifact({ page, isDark, isWarping }) {
  const mesh = useRef()
  const mat = useRef()
  const { viewport } = useThree()
  const isMobile = viewport.width < 5

  useFrame((state, delta) => {
    // 1. WARP SPEED ROTATION
    const speedMult = isWarping ? 8 : 1
    mesh.current.rotation.x += delta * 0.15 * speedMult
    mesh.current.rotation.y += delta * 0.2 * speedMult
    
    // 2. RESPONSIVE POSITIONING
    let targetPos = [0, 0, 0]
    let targetScale = isMobile ? 1.5 : 2.2
    
    if (page === 'work') targetPos = isMobile ? [0, 1.8, 0] : [3.5, 0, 0]
    if (page === 'about') targetPos = isMobile ? [0, 1.8, 0] : [-3.5, 0, 0]
    if (page === 'contact') { targetPos = [0, 0, 0]; targetScale = isMobile ? 2.5 : 3.2 }

    // 3. DARK MODE LOGIC (Enhanced for visibility)
    // In dark mode, we use a White core so it catches the colored lights perfectly.
    // In light mode, we use pure white glass to refract the background image.
    const targetColor = isDark ? "#ffffff" : "#ffffff" 
    const targetThickness = isDark ? 2 : 3
    
    // Physics Animation
    easing.damp3(mesh.current.position, targetPos, 0.6, delta)
    const warpScale = isWarping ? 1.1 : 1
    easing.damp3(mesh.current.scale, [targetScale * warpScale, targetScale * warpScale, targetScale * warpScale], 0.4, delta)
    easing.dampC(mesh.current.material.color, new THREE.Color(targetColor), 0.2, delta)
    easing.damp(mesh.current.material, 'thickness', targetThickness, 0.2, delta)
  })

  return (
    <group>
      <Float speed={isWarping ? 10 : 2} rotationIntensity={isWarping ? 2 : 0.5} floatIntensity={0.5}>
        <mesh ref={mesh}>
          <torusGeometry args={[1, 0.35, 128, 64]} />
          
          <MeshTransmissionMaterial 
            ref={mat}
            backside
            backsideThickness={1}
            thickness={3}
            resolution={512}
            roughness={0}           /* MAX GLOSS */
            transmission={1}
            ior={1.5}
            chromaticAberration={isWarping ? 1 : 0.15} 
            anisotropy={0.5}
            distortion={0.4}
            distortionScale={0.5}
            temporalDistortion={0.1}
            color="#fff"
            background={new THREE.Color('#000')}
            /* BOOSTED REFLECTIONS */
            envMapIntensity={isDark ? 4 : 2} 
          />
        </mesh>
      </Float>

      {/* ENVIRONMENT LIGHTING */}
      <Environment resolution={512}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          {/* In Dark Mode, these lights turn COLORFUL so the ring isn't just black */}
          <Lightformer 
            form="circle" 
            intensity={isDark ? 10 : 4} 
            color={isDark ? "#ff0055" : "white"} 
            rotation-x={Math.PI / 2} 
            position={[0, 5, -9]} 
            scale={2} 
          />
          <Lightformer 
            form="circle" 
            intensity={isDark ? 10 : 2} 
            color={isDark ? "#0055ff" : "white"} 
            rotation-y={Math.PI / 2} 
            position={[-5, 1, -1]} 
            scale={2} 
          />
          <Lightformer 
            form="ring" 
            color={isDark ? "#ffffff" : "#ffffff"} 
            intensity={10} 
            scale={10} 
            position={[-15, 4, -18]} 
            target={[0, 0, 0]} 
          />
        </group>
      </Environment>
    </group>
  )
}
