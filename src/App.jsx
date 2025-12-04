import React, { useRef, useMemo, useEffect, useState, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Instances, Instance, Float, Environment, Lightformer, MeshTransmissionMaterial, Trail } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { motion, AnimatePresence } from 'framer-motion'
import { Disc, Share2, Maximize2, MoreHorizontal, Fingerprint, ScanFace, MousePointer2, Activity, Zap, Github, MessageCircle } from 'lucide-react'
import { easing } from 'maath'
import * as THREE from 'three'

// ==============================================
// 1. QUANTUM PHYSICS ENGINE
// ==============================================

function useQuantumSync() {
  const [otherWindowActive, setOtherWindowActive] = useState(false)
  const [relativePosition, setRelativePosition] = useState({ x: 0, y: 0 })
  const [windowId] = useState(() => Math.random().toString(36).substr(2, 9))

  useEffect(() => {
    const channel = new BroadcastChannel('quantum_channel')
    let animationFrameId;
    let lastBroadcastTime = 0;

    const broadcastState = (timestamp) => {
      if (timestamp - lastBroadcastTime > 30) {
        channel.postMessage({
          type: 'STATE',
          id: windowId,
          x: window.screenX,
          y: window.screenY,
          w: window.innerWidth,
          h: window.innerHeight
        })
        lastBroadcastTime = timestamp;
      }
      animationFrameId = requestAnimationFrame(broadcastState)
    }

    animationFrameId = requestAnimationFrame(broadcastState)

    channel.onmessage = (event) => {
      const data = event.data
      if (data.id === windowId) return

      if (data.type === 'STATE') {
        setOtherWindowActive(true)
        
        const myCx = window.screenX + window.innerWidth / 2
        const myCy = window.screenY + window.innerHeight / 2
        const otherCx = data.x + data.w / 2
        const otherCy = data.y + data.h / 2
        
        const vecX = otherCx - myCx
        const vecY = otherCy - myCy
        
        setRelativePosition({
          x: (vecX / window.innerWidth) * 18, 
          y: -(vecY / window.innerHeight) * 18 
        })
      }
    }

    return () => {
      cancelAnimationFrame(animationFrameId)
      channel.close()
    }
  }, [windowId])

  return { otherWindowActive, relativePosition }
}

// ==============================================
// 2. VISUAL COMPONENTS
// ==============================================

// --- THE REACTOR NODE (Complex Geometry) ---
function ReactorNode({ position, rotation, scale = 1, active, isDark, color }) {
  const group = useRef()
  const core = useRef()
  const shell = useRef()
  const ring = useRef()

  useFrame((state, delta) => {
    if (group.current) {
        const t = state.clock.elapsedTime
        core.current.rotation.x += delta * 0.2
        core.current.rotation.y += delta * 0.3
        shell.current.rotation.x -= delta * 0.1
        shell.current.rotation.y -= delta * 0.1
        ring.current.rotation.x = Math.sin(t * 0.5) * 0.5
        ring.current.rotation.y += delta * (active ? 4 : 1) 
        group.current.position.y += Math.sin(t * 2) * 0.002
    }
  })

  const glassColor = active ? "#ffaa00" : (isDark ? "#ffffff" : "#aaccff")
  const shellColor = active ? "#ff5500" : (isDark ? "#444444" : "#888888")
  const ringColor = active ? "#ffcc00" : (isDark ? "#ffffff" : "#00aaff")

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale}>
      
      {/* LAYER 1: The Liquid Core */}
      <mesh ref={core}>
        <icosahedronGeometry args={[1.2, 0]} />
        <MeshTransmissionMaterial 
            backside backsideThickness={5} thickness={2} samples={16} resolution={1024}
            transmission={1} roughness={0} clearcoat={1} 
            chromaticAberration={active ? 2 : 0.5} 
            anisotropy={1} distortion={active ? 2.0 : 0.4} distortionScale={1} temporalDistortion={0.1}
            color={glassColor} background={new THREE.Color(isDark ? "#000000" : "#ffffff")}
        />
      </mesh>

      {/* LAYER 2: The Containment Cage */}
      <mesh ref={shell} scale={1.4}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial 
            color={shellColor} 
            wireframe 
            emissive={shellColor} 
            emissiveIntensity={active ? 2 : 0.5}
            transparent opacity={0.3}
        />
      </mesh>

      {/* LAYER 3: The Orbital Ring */}
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.03, 16, 100]} />
        <meshStandardMaterial 
            color={ringColor} 
            emissive={ringColor} 
            emissiveIntensity={active ? 10 : 2}
            toneMapped={false}
        />
      </mesh>

      {/* Internal Light */}
      <pointLight intensity={active ? 10 : 2} distance={10} color={active ? "#ff8800" : "white"} />
    </group>
  )
}

function ConnectionBeam({ active, start, end }) {
  const mesh = useRef()
  const mat = useRef()
  
  useFrame((state, delta) => {
    if (mesh.current && active) {
        const startVec = new THREE.Vector3(start.x, start.y, 0)
        const endVec = new THREE.Vector3(end.x, end.y, 0)
        
        const dist = startVec.distanceTo(endVec)
        const mid = startVec.add(endVec).multiplyScalar(0.5)
        
        mesh.current.position.copy(mid)
        mesh.current.scale.y = dist
        mesh.current.lookAt(endVec)
        mesh.current.rotateX(Math.PI / 2) 

        if(mat.current) {
            mat.current.opacity = 0.4 + Math.sin(state.clock.elapsedTime * 20) * 0.2
            mat.current.emissiveIntensity = 8 + Math.sin(state.clock.elapsedTime * 15) * 4
        }
    }
  })

  if (!active) return null

  return (
    <mesh ref={mesh}>
        <cylinderGeometry args={[0.15, 0.15, 1, 16, 1, true]} />
        <meshStandardMaterial 
            ref={mat}
            color="#ffaa00"
            emissive="#ff5500"
            transparent 
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
            toneMapped={false}
        />
    </mesh>
  )
}

function DualCore({ active, relativePos, isDark }) {
  const [localPos, setLocalPos] = useState({ x: 0, y: 0 })
  const [remotePos, setRemotePos] = useState({ x: 0, y: 0 })
  const localGroup = useRef()
  const { viewport } = useThree()
  
  const scale = viewport.width < 5 ? 0.6 : 1

  useFrame((state, delta) => {
    const targetLocalX = active ? relativePos.x * 0.15 : 0
    const targetLocalY = active ? relativePos.y * 0.15 : 0
    const targetRemoteX = relativePos.x * 0.85
    const targetRemoteY = relativePos.y * 0.85

    const lx = THREE.MathUtils.lerp(localPos.x, targetLocalX, 0.1)
    const ly = THREE.MathUtils.lerp(localPos.y, targetLocalY, 0.1)
    setLocalPos({x: lx, y: ly})

    const rx = THREE.MathUtils.lerp(remotePos.x, targetRemoteX, 0.1)
    const ry = THREE.MathUtils.lerp(remotePos.y, targetRemoteY, 0.1)
    setRemotePos({x: rx, y: ry})
    
    if(localGroup.current) {
        easing.damp3(localGroup.current.position, [targetLocalX, targetLocalY, 0], 0.3, delta)
    }
  })

  return (
    <group>
      <ConnectionBeam active={active} start={localPos} end={remotePos} />
      <group ref={localGroup}>
          <ReactorNode active={active} isDark={isDark} scale={scale} />
      </group>
      {active && (
          <ReactorNode position={[relativePos.x * 0.85, relativePos.y * 0.85, 0]} active={active} isDark={isDark} scale={scale} />
      )}
    </group>
  )
}

function ParticleField({ count = 1000, active, relativePos, isDark }) {
  const mesh = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const { viewport } = useThree()
  
  const finalCount = viewport.width < 5 ? count / 2 : count

  const particles = useMemo(() => {
    return new Array(Math.floor(finalCount)).fill(0).map(() => ({
      t: Math.random() * 100,
      factor: 20 + Math.random() * 100,
      speed: 0.01 + Math.random() / 200,
      xFactor: -50 + Math.random() * 100,
      yFactor: -50 + Math.random() * 100,
      zFactor: -50 + Math.random() * 100,
      mx: 0, my: 0
    }))
  }, [finalCount])

  useFrame((state, delta) => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle
      t = particle.t += speed / 2
      const a = Math.cos(t) + Math.sin(t * 1) / 10
      const b = Math.sin(t) + Math.cos(t * 2) / 10
      const s = Math.cos(t)
      
      const flowX = active ? relativePos.x * 2 : 0
      const flowY = active ? relativePos.y * 2 : 0
      
      particle.mx += (flowX - particle.mx) * 0.04
      particle.my += (flowY - particle.my) * 0.04
      
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      )
      
      const scale = active ? 2 : (s > 0.5 ? 1.5 : 0.5)
      dummy.scale.set(s * scale, s * scale, s * scale)
      dummy.rotation.set(s * 5, s * 5, s * 5)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[null, null, Math.floor(finalCount)]}>
      <dodecahedronGeometry args={[0.08, 0]} />
      <meshStandardMaterial 
        color={active ? "#ffaa00" : (isDark ? "#ffffff" : "#000000")} 
        emissive={active ? "#ff4400" : (isDark ? "#ffffff" : "#000000")}
        emissiveIntensity={active ? 3 : 0.5}
        roughness={0} toneMapped={false} 
      />
    </instancedMesh>
  )
}

function QuantumScene({ isDark }) {
  const { otherWindowActive, relativePosition } = useQuantumSync()
  const { viewport } = useThree()
  
  const unitsPerPixel = viewport.width / window.innerWidth
  const target3D = {
      x: relativePosition.x * unitsPerPixel,
      y: relativePosition.y * unitsPerPixel
  }

  useFrame((state) => {
     const x = state.pointer.x * 0.2
     const y = state.pointer.y * 0.2
     state.camera.lookAt(0,0,0)
     
     if(otherWindowActive) {
        easing.damp3(state.camera.position, [target3D.x * 0.1, target3D.y * 0.1, 8], 0.5, 0.01)
     } else {
        easing.damp3(state.camera.position, [x, y, 8], 0.5, 0.01)
     }
  })

  return (
    <>
      <color attach="background" args={[isDark ? "#050505" : "#f0f0f0"]} />
      
      <group>
         <DualCore active={otherWindowActive} relativePos={relativePosition} isDark={isDark} />
         <ParticleField count={isDark ? 1200 : 800} active={otherWindowActive} relativePos={relativePosition} isDark={isDark} />
      </group>

      <Environment resolution={1024}>
         <group rotation={[-Math.PI / 4, -0.3, 0]}>
            <Lightformer intensity={5} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} color={otherWindowActive ? "orange" : "white"} />
            <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[20, 0.1, 1]} color="magenta" />
            <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[20, 0.5, 1]} color="blue" />
            <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 11, 1]} />
         </group>
      </Environment>
      
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} radius={0.6} />
        <ChromaticAberration offset={[otherWindowActive ? 0.003 : 0.0005, otherWindowActive ? 0.003 : 0.0005]} />
        <Noise opacity={0.03} premultiply blendFunction={BlendFunction.ADD} />
        <Vignette eskil={false} offset={0.1} darkness={0.9} />
      </EffectComposer>
    </>
  )
}

// ==============================================
// 3. UI COMPONENTS
// ==============================================

const anim = {
  hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, scale: 0.95, filter: 'blur(10px)', transition: { duration: 0.5 } }
}

const Header = () => (
  <header className="fixed top-0 left-0 w-full p-6 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center z-50 pointer-events-none text-white mix-blend-difference">
    <div>
      <h1 className="font-display text-2xl md:text-3xl tracking-tighter leading-none">MUSEUM OF<br/>ENTROPY</h1>
      <p className="font-mono text-[8px] md:text-[10px] mt-2 tracking-widest opacity-60">EST. 2024 // DIGITAL ARTIFACTS</p>
    </div>
    <div className="hidden md:block text-right">
      <div className="flex items-center gap-2 justify-end mb-1">
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"/>
        <span className="font-mono text-[10px] tracking-widest">SYSTEM ONLINE</span>
      </div>
      <p className="font-mono text-[10px] opacity-40">LAT: 52.3676° N</p>
    </div>
  </header>
)

const ControlDeck = ({ isDark, setIsDark }) => (
  <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 flex gap-4 pointer-events-auto mix-blend-difference">
    <button 
      onClick={() => setIsDark(!isDark)}
      className="group flex items-center gap-3 px-4 py-2 md:px-5 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all duration-500 backdrop-blur-sm bg-black/10"
    >
      <span className="font-mono text-[8px] md:text-[10px] uppercase tracking-widest text-white group-hover:text-black">
        {isDark ? 'Light' : 'Dark'}
      </span>
      <div className={`w-2 h-2 rounded-full border border-current ${isDark ? 'bg-transparent' : 'bg-current'}`} />
    </button>
  </div>
)

const ConnectionStatus = () => {
  const [connected, setConnected] = useState(false)
  useEffect(() => {
    const channel = new BroadcastChannel('quantum_channel')
    channel.onmessage = (e) => { 
        if(e.data.type === 'STATE') setConnected(true) 
    }
    return () => channel.close()
  }, [])

  return (
    <div className="fixed top-24 left-6 md:top-1/2 md:left-10 md:-translate-y-1/2 z-50 pointer-events-none mix-blend-difference text-white">
       <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4 md:-rotate-90 md:origin-left md:translate-x-4">
             <span className={`w-2 h-2 rounded-full ${connected ? 'bg-[#ffaa00] shadow-[0_0_20px_#ffaa00]' : 'bg-white/20'}`} />
             <span className={`font-mono text-[8px] md:text-[10px] tracking-[0.3em] uppercase whitespace-nowrap transition-colors duration-500 ${connected ? 'text-[#ffaa00]' : 'text-white/40'}`}>
                {connected ? 'QUANTUM LINK :: ACTIVE' : 'AWAITING PAIRING...'}
             </span>
          </div>
       </div>
    </div>
  )
}

const Navigation = ({ page, setPage }) => {
  const items = [
    { id: 'home', label: 'The Void' },
    { id: 'work', label: 'Artifacts' },
    { id: 'about', label: 'Identity' },
    { id: 'contact', label: 'Signal' }
  ]
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[300px] md:max-w-none md:w-auto md:bottom-10">
      <div className="flex justify-between md:justify-start gap-1 md:gap-2 p-1.5 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl mx-4 md:mx-0">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className={`
              relative px-4 py-2 md:px-6 md:py-2.5 rounded-full font-body text-[10px] md:text-xs font-semibold uppercase tracking-wider transition-all duration-500 flex-1 md:flex-none
              ${page === item.id ? 'bg-white text-black' : 'text-white/60 hover:text-white hover:bg-white/5'}
            `}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  )
}

// --- PAGES ---

const Home = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 px-6 mix-blend-difference text-white">
    <div className="text-center">
       <motion.h1 variants={anim} initial="hidden" animate="visible" exit="exit" className="font-display text-[18vw] md:text-[15vw] leading-[0.85] tracking-tighter opacity-90">
         ENTROPY
       </motion.h1>
       <motion.div variants={anim} initial="hidden" animate="visible" exit="exit" className="mt-4 md:mt-8 flex justify-center items-center gap-4 opacity-70">
         <span className="h-[1px] w-8 md:w-12 bg-white" />
         <p className="font-body text-[10px] md:text-sm tracking-[0.2em] uppercase">Digital Installation</p>
         <span className="h-[1px] w-8 md:w-12 bg-white" />
       </motion.div>
    </div>
  </div>
)

const Work = () => (
  <div className="absolute inset-0 flex items-center justify-center z-40 px-6 mix-blend-difference text-white pointer-events-none">
     <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 pointer-events-auto mt-20 md:mt-0">
        {[{ id: '01', t: 'Singularity', type: 'WebGL' }, { id: '02', t: 'Neural Net', type: 'AI' }, { id: '03', t: 'Hyper-Torus', type: 'Geo' }, { id: '04', t: 'Dark Matter', type: 'Sim' }].map((item, i) => (
           <motion.div key={i} custom={i} variants={anim} initial="hidden" animate="visible" exit="exit" className="group border-t border-white/20 pt-4 hover:border-white transition-colors cursor-pointer">
              <div className="flex justify-between items-baseline mb-2">
                 <span className="font-mono text-[10px] md:text-xs text-white/40">/{item.id}</span>
                 <span className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">{item.type}</span>
              </div>
              <h3 className="font-display text-3xl md:text-5xl group-hover:italic transition-all duration-300">{item.t}</h3>
           </motion.div>
        ))}
     </div>
  </div>
)

const About = () => (
  <div className="absolute inset-0 flex items-center justify-center z-40 px-6 mix-blend-difference text-white pointer-events-none">
     <div className="max-w-2xl text-center pointer-events-auto">
        <motion.p variants={anim} initial="hidden" animate="visible" exit="exit" className="font-display text-2xl md:text-4xl lg:text-5xl leading-tight mb-8 md:mb-12">
          "We are architects of the intangible, sculpting light and logic into digital reality."
        </motion.p>
        <motion.div variants={anim} initial="hidden" animate="visible" exit="exit" className="flex justify-center gap-8 md:gap-12">
           <div className="text-center">
              <Fingerprint size={24} className="mx-auto mb-2 md:mb-4 opacity-50 md:w-8 md:h-8"/>
              <p className="font-mono text-[8px] md:text-xs tracking-widest uppercase">Identity</p>
           </div>
           <div className="text-center">
              <ScanFace size={24} className="mx-auto mb-2 md:mb-4 opacity-50 md:w-8 md:h-8"/>
              <p className="font-mono text-[8px] md:text-xs tracking-widest uppercase">Vision</p>
           </div>
           <div className="text-center">
              <Activity size={24} className="mx-auto mb-2 md:mb-4 opacity-50 md:w-8 md:h-8"/>
              <p className="font-mono text-[8px] md:text-xs tracking-widest uppercase">Pulse</p>
           </div>
        </motion.div>
     </div>
  </div>
)

const Contact = () => (
  <div className="absolute inset-0 flex items-center justify-center z-40 px-6 mix-blend-difference text-white pointer-events-none">
     <motion.div variants={anim} initial="hidden" animate="visible" exit="exit" className="pointer-events-auto text-center">
        <div className="mb-4 md:mb-8 font-mono text-[10px] md:text-xs tracking-[0.5em] uppercase opacity-50">Initiate Uplink</div>
        <a href="mailto:ek56351@outlook.com" className="font-display text-[15vw] md:text-[10vw] leading-none hover:text-[#ffaa00] transition-colors duration-500">
           HELLO
        </a>
        <div className="mt-8 md:mt-12 flex justify-center gap-6 md:gap-8">
           <button className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black hover:scale-110 transition-all duration-300">
              <a href="https://github.com/56snty" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full h-full text-current"><Github size={16} className="md:w-5 md:h-5" /></a>
           </button>
           <button 
              className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black hover:scale-110 transition-all duration-300" 
              onClick={() => {
                navigator.clipboard.writeText('wzv');
                alert('Discord username copied: wzv');
              }}
           >
              <MessageCircle size={16} className="md:w-5 md:h-5" />
           </button>
        </div>
     </motion.div>
  </div>
)

export default function App() {
  const [page, setPage] = useState('home')
  const [isDark, setIsDark] = useState(true)

  return (
    <div className="relative w-full h-full bg-[#050505] overflow-hidden select-none cursor-crosshair">
      <div className={`fixed inset-0 transition-colors duration-1000 ${isDark ? 'bg-black' : 'bg-[#e0e0e0]'}`} />
      
      {/* Background Magic Image Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-20 mix-blend-overlay" style={{backgroundImage: 'url(https://grainy-gradients.vercel.app/noise.svg)'}}></div>

      <Header />
      <ConnectionStatus />
      <ControlDeck isDark={isDark} setIsDark={setIsDark} />

      <AnimatePresence mode="wait">
        {page === 'home' && <Home key="h" />}
        {page === 'work' && <Work key="w" />}
        {page === 'about' && <About key="a" />}
        {page === 'contact' && <Contact key="c" />}
      </AnimatePresence>

      <Navigation page={page} setPage={setPage} />

      <div className="absolute inset-0 z-0">
         <Canvas camera={{ position: [0, 0, 8], fov: 40 }} gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }} dpr={[1, 2]}>
            <Suspense fallback={null}>
               <QuantumScene isDark={isDark} />
            </Suspense>
         </Canvas>
      </div>
    </div>
  )
}