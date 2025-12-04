import React, { useRef } from 'react'
import { Environment, Lightformer, Float } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function DramaticLighting() {
  const lightGroup = useRef()

  useFrame((state, delta) => {
    // Laat de lichten langzaam om het object heen draaien voor dynamische reflecties
    if (lightGroup.current) {
        lightGroup.current.rotation.y += delta * 0.1
        lightGroup.current.rotation.z += delta * 0.05
    }
  })

  return (
    <Environment resolution={512}>
      {/* We groeperen de lichten zodat we ze samen kunnen draaien */}
      <group ref={lightGroup}>
        {/* Key Light: Grote witte balk van boven */}
        <Float speed={2} intensity={1}>
            <Lightformer form="rect" intensity={5} position={[0, 5, -2]} scale={[10, 2, 1]} color="#ffffff" />
        </Float>
        
        {/* Rim Lights: Blauwe en Gouden accenten aan de zijkant */}
        <Float speed={3} intensity={1.5}>
            <Lightformer form="rect" intensity={4} position={[-5, 0, -5]} scale={[2, 10, 1]} color="#4455ff" />
        </Float>
        
        <Float speed={1.5} intensity={1.5}>
            <Lightformer form="rect" intensity={4} position={[5, 0, -5]} scale={[2, 10, 1]} color="#ffaa44" />
        </Float>

        {/* Fill Light: Zacht wit licht van achteren */}
        <Lightformer form="circle" intensity={1} position={[0, 0, -10]} scale={[10, 10, 1]} color="#ffffff" />
      </group>
    </Environment>
  )
}