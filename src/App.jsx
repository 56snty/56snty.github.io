import React, { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'
import DualArtifact from './Visuals'
import { ArrowRight, Mail, Sun, Moon, Layers, Code, User, Send } from 'lucide-react'

const anim = {
  hidden: { y: "100%", opacity: 0 },
  visible: (i) => ({ y: "0%", opacity: 1, transition: { delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] } }),
  exit: { y: "-100%", opacity: 0, transition: { duration: 0.4 } }
}

// --- COMPONENTS ---

const ModeToggle = ({ isDark, setIsDark }) => (
  <button 
    onClick={(e) => { e.stopPropagation(); setIsDark(!isDark); }}
    className="fixed top-8 right-8 z-50 p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all duration-300 group"
  >
    {isDark ? <Sun className="text-white" size={20}/> : <Moon className="text-white" size={20}/>}
  </button>
)

const WarpHint = () => (
  <div className="fixed bottom-8 right-8 hidden md:flex flex-col items-end pointer-events-none z-40 opacity-50 mix-blend-difference">
    <span className="text-[10px] font-body uppercase tracking-widest mb-1 text-white">Hold to Warp</span>
    <div className="w-12 h-1 bg-white/20 rounded-full overflow-hidden">
      <div className="w-full h-full bg-white animate-pulse origin-left" />
    </div>
  </div>
)

// --- PAGES ---

const Home = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
    <div className="overflow-hidden">
      <motion.h1 custom={0} variants={anim} initial="hidden" animate="visible" exit="exit" 
        className="font-hero text-[18vw] md:text-[12vw] leading-none text-white tracking-tighter text-glow mix-blend-overlay">
        EMAL
      </motion.h1>
    </div>
    <motion.div custom={2} variants={anim} initial="hidden" animate="visible" exit="exit" className="flex items-center gap-4 mt-4">
      <span className="h-[1px] w-12 bg-white/80"/><span className="font-body text-xs tracking-[0.4em] uppercase text-white font-bold text-glow">Visual Masterpiece</span><span className="h-[1px] w-12 bg-white/80"/>
    </motion.div>
  </div>
)

const Work = () => {
  // Updated with actual tech used in this project
  const skills = [
    { t: "Visuals", d: "Three.js / Fiber / Drei" },
    { t: "Physics", d: "Curl Noise / Maath" },
    { t: "Shaders", d: "GLSL / Transmission" },
    { t: "System", d: "Termux / Linux Env" }
  ]
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center md:justify-start md:pl-32 pointer-events-none px-6">
      <div className="w-full max-w-lg pointer-events-auto">
        <h2 className="font-hero text-4xl mb-8 text-white">The Stack</h2>
        {skills.map((p, i) => (
          <motion.div key={i} custom={i} variants={anim} initial="hidden" animate="visible" exit="exit" 
            className="group py-5 border-b border-white/20 cursor-pointer hover:pl-4 transition-all duration-500 hover:border-white"
          >
             <div className="flex justify-between items-baseline">
               <h3 className="font-hero text-2xl md:text-3xl text-white/80 group-hover:text-white transition-colors">{p.t}</h3>
               <span className="font-body text-xs text-white/60 uppercase tracking-widest">{p.d}</span>
             </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const About = () => (
  <div className="absolute inset-0 z-20 flex items-center justify-center md:justify-end md:pr-32 pointer-events-none px-6">
    <div className="w-full max-w-md pointer-events-auto text-left md:text-right">
       <motion.div custom={0} variants={anim} initial="hidden" animate="visible" exit="exit" className="overflow-hidden mb-6">
         <span className="font-body text-xs text-[#00f0ff] tracking-widest uppercase border border-[#00f0ff] px-2 py-1 rounded">Identity</span>
       </motion.div>
       <motion.p custom={1} variants={anim} initial="hidden" animate="visible" exit="exit" 
         className="font-hero text-3xl md:text-4xl leading-tight text-white mb-6 text-glow">
         Emal. 22.<br/>Software Developer.
       </motion.p>
       <motion.p custom={2} variants={anim} initial="hidden" animate="visible" exit="exit"
         className="font-body text-sm text-white/90 leading-relaxed drop-shadow-md mb-8">
         I don't just write code; I craft visual masterpieces. 
         Based in Eindhoven, creating high-performance digital art using next-gen web technologies.
       </motion.p>
    </div>
  </div>
)

const Contact = () => (
  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-6">
     <motion.h2 custom={0} variants={anim} initial="hidden" animate="visible" exit="exit" className="font-hero text-6xl md:text-8xl text-white mb-8 text-center text-glow">UPLINK</motion.h2>
     <div className="flex gap-8 pointer-events-auto">
        <motion.a custom={1} variants={anim} initial="hidden" animate="visible" exit="exit" href="mailto:ek56351@outlook.com" className="w-20 h-20 rounded-full border-2 border-white/30 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-md bg-white/10"><Mail size={24} /></motion.a>
        <motion.div custom={2} variants={anim} initial="hidden" animate="visible" exit="exit" onClick={() => navigator.clipboard.writeText('wzv')} className="w-20 h-20 rounded-full border-2 border-white/30 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-md bg-white/10 cursor-pointer"><ArrowRight size={24} className="-rotate-45" /></motion.div>
     </div>
  </div>
)

const Navbar = ({ page, setPage }) => {
  const items = [
    { id: 'home', icon: Layers, label: 'Void' },
    { id: 'work', icon: Code, label: 'Stack' },
    { id: 'about', icon: User, label: 'Bio' },
    { id: 'contact', icon: Send, label: 'Link' }
  ]
  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="flex gap-2 backdrop-blur-xl py-2 px-2 rounded-full bg-white/10 border border-white/20 shadow-2xl">
        {items.map((item) => (
          <button key={item.id} onClick={(e) => { e.stopPropagation(); setPage(item.id); }} 
            className={`
              relative px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-500
              ${page === item.id ? 'bg-white text-black shadow-lg' : 'text-white/70 hover:bg-white/10'}
            `}
          >
            <item.icon size={16} />
            {page === item.id && <span className="text-xs font-bold uppercase hidden md:block">{item.label}</span>}
          </button>
        ))}
      </div>
    </nav>
  )
}

// --- ROOT ---

export default function App() {
  const [page, setPage] = useState('home')
  const [isDark, setIsDark] = useState(false)
  const [isWarping, setIsWarping] = useState(false)

  return (
    <div 
      className="relative w-full h-full text-white"
      onPointerDown={() => setIsWarping(true)}
      onPointerUp={() => setIsWarping(false)}
      onPointerLeave={() => setIsWarping(false)}
    >
      <div className="void-bg" />
      <div className="hero-bg" style={{ opacity: isDark ? 0 : 1 }} />
      <div className="grain" />
      
      <ModeToggle isDark={isDark} setIsDark={setIsDark} />
      <WarpHint />

      <AnimatePresence mode="wait">
        {page === 'home' && <Home key="h" />}
        {page === 'work' && <Work key="w" />}
        {page === 'about' && <About key="b" />}
        {page === 'contact' && <Contact key="c" />}
      </AnimatePresence>

      <Navbar page={page} setPage={setPage} />

      <div className="absolute inset-0 z-10 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5.5], fov: 35 }} dpr={[1, 1.5]}>
           <Suspense fallback={null}>
              <DualArtifact page={page} isDark={isDark} isWarping={isWarping} />
           </Suspense>
        </Canvas>
      </div>
    </div>
  )
}
