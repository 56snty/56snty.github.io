import React, { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Instances, Instance, Float, Environment, Lightformer, MeshTransmissionMaterial } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'

// --- QUANTUM SYNC HOOK (Advanced Proximity Logic) ---
function useQuantumSync() {
  const [otherWindowActive, setOtherWindowActive] = useState(false)
  const [relativePosition, setRelativePosition] = useState({ x: 0, y: 0 }) // Vector to other window
  const [windowId] = useState(() => Math.random().toString(36).substr(2, 9))

  useEffect(() => {
    const channel = new BroadcastChannel('quantum_channel')
    
    const broadcastState = () => {
      channel.postMessage({
        type: 'STATE',
        id: windowId,
        x: window.screenX,
        y: window.screenY,
        w: window.innerWidth,
        h: window.innerHeight
      })
    }

    // High-frequency broadcast for smooth movement
    const interval = setInterval(broadcastState, 50)
    window.addEventListener('resize', broadcastState)
    window.addEventListener('mousemove', broadcastState)

    channel.onmessage = (event) => {
      const data = event.data
      if (data.id === windowId) return // Ignore self

      if (data.type === 'STATE') {
        setOtherWindowActive(true)
        
        // --- PROXIMITY CALCULATION ---
        // 1. Find centers of both windows in screen space
        const myCx = window.screenX + window.innerWidth / 2
        const myCy = window.screenY + window.innerHeight / 2
        const otherCx = data.x + data.w / 2
        const otherCy = data.y + data.h / 2

        // 2. Calculate vector pointing TO the other window
        const vecX = otherCx - myCx
        const vecY = otherCy - myCy

        // 3. Normalize and scale for 3D space
        // We divide by screen size to get a relative unit, then multiply for 3D impact
        // Invert Y because screen Y is down, 3D Y is up
        setRelativePosition({
          x: (vecX / window.innerWidth) * 15, 
          y: -(vecY / window.innerHeight) * 15 
        })
      }
    }

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', broadcastState)
      window.removeEventListener('mousemove', broadcastState)
      channel.close()
    }
  }, [windowId])

  return { otherWindowActive, relativePosition }
}

// --- THE SINGULARITY (Magnetic Core) ---
function Singularity({ active, relativePos }) {
  const mesh = useRef()
  const light = useRef()
  
  useFrame((state, delta) => {
    if (mesh.current) {
        // Base Rotation
        mesh.current.rotation.x += delta * 0.2
        mesh.current.rotation.y += delta * 0.3
        
        // --- ATTRACTION PHYSICS ---
        // If active, drift towards the other window
        const targetX = active ? relativePos.x * 0.8 : 0
        const targetY = active ? relativePos.y * 0.8 : 0
        
        // Smooth Lerp
        mesh.current.position.x += (targetX - mesh.current.position.x) * delta * 2
        mesh.current.position.y += (targetY - mesh.current.position.y) * delta * 2
        
        // Heartbeat Pulse
        const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05
        mesh.current.scale.setScalar(scale)
    }
  })

  return (
    <group>
      {/* The Crystal */}
      <mesh ref={mesh}>
        <octahedronGeometry args={[1.5, 0]} />
        <MeshTransmissionMaterial 
            backside backsideThickness={5} thickness={2} samples={16} resolution={1024}
            transmission={1} roughness={0} clearcoat={1} chromaticAberration={1} anisotropy={1}
            distortion={1.2} distortionScale={1} temporalDistortion={0.2}
            color={active ? "#ffaa00" : "#ffffff"} // Gold when connected
            background={new THREE.Color("#000000")}
        />
      </mesh>
      
      {/* Wireframe Cage (Follows physics via Group) */}
      <mesh rotation={[Math.PI/4, Math.PI/4, 0]}>
         <icosahedronGeometry args={[2.5, 1]} />
         <meshStandardMaterial 
            color={active ? "#ffaa00" : "#00ffff"} 
            wireframe 
            emissive={active ? "#ffaa00" : "#00ffff"}
            emissiveIntensity={2}
            transparent opacity={0.2}
         />
      </mesh>
    </group>
  )
}

// --- PARTICLE FIELD (Flows between windows) ---
function ParticleField({ count = 2000, active, relativePos }) {
  const mesh = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100
      const factor = 20 + Math.random() * 100
      const speed = 0.01 + Math.random() / 200
      const xFactor = -50 + Math.random() * 100
      const yFactor = -50 + Math.random() * 100
      const zFactor = -50 + Math.random() * 100
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 })
    }
    return temp
  }, [count])

  useFrame((state, delta) => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle
      t = particle.t += speed / 2
      const a = Math.cos(t) + Math.sin(t * 1) / 10
      const b = Math.sin(t) + Math.cos(t * 2) / 10
      const s = Math.cos(t)
      
      // --- FLOW PHYSICS ---
      // If connected, bias the particle flow towards the other window
      const flowX = active ? relativePos.x * 2 : 0
      const flowY = active ? relativePos.y * 2 : 0
      
      particle.mx += (flowX - particle.mx) * 0.05
      particle.my += (flowY - particle.my) * 0.05
      
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      )
      
      const scale = active ? 1.5 : 1
      dummy.scale.set(s * scale, s * scale, s * scale)
      dummy.rotation.set(s * 5, s * 5, s * 5)
      
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <dodecahedronGeometry args={[0.05, 0]} />
      <meshStandardMaterial 
        color={active ? "#ffaa00" : "#ffffff"} 
        emissive={active ? "#ff4400" : "#ff00ff"}
        emissiveIntensity={active ? 3 : 0.5}
        roughness={0} toneMapped={false} 
      />
    </instancedMesh>
  )
}

// --- MAIN COMPONENT ---
export default function QuantumScene({ isDark }) {
  const { otherWindowActive, relativePosition } = useQuantumSync()

  useFrame((state) => {
     // Subtle parallax based on mouse
     const x = state.pointer.x * 0.5
     const y = state.pointer.y * 0.5
     state.camera.lookAt(0,0,0)
     state.camera.position.x += (x - state.camera.position.x) * 0.05
     state.camera.position.y += (y - state.camera.position.y) * 0.05
  })

  return (
    <>
      <color attach="background" args={[isDark ? "#020202" : "#ffffff"]} />

      <group>
         <Singularity active={otherWindowActive} relativePos={relativePosition} />
         <ParticleField count={isDark ? 3000 : 1500} active={otherWindowActive} relativePos={relativePosition} />
      </group>

      <Environment resolution={1024}>
         <group rotation={[-Math.PI / 4, -0.3, 0]}>
            <Lightformer intensity={5} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} color={otherWindowActive ? "orange" : "cyan"} />
            <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[20, 0.1, 1]} color="magenta" />
            <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[20, 0.5, 1]} color="blue" />
            <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 11, 1]} />
         </group>
      </Environment>

      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} radius={0.8} />
        <ChromaticAberration offset={[otherWindowActive ? 0.005 : 0.002, otherWindowActive ? 0.005 : 0.002]} />
        <Noise opacity={0.05} premultiply blendFunction={BlendFunction.ADD} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </>
  )
}