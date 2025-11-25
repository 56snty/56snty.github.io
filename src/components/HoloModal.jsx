import React from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

// This component is the "Window" for your content
export default function HoloModal({ onClose, title, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12">
      {/* Backdrop (Darkens the particles) */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
      />

      {/* The Actual GUI Panel */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 1.1, opacity: 0, filter: "blur(10px)" }} // Explodes outward on close
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="holo-glass relative w-full max-w-4xl h-[80vh] md:h-auto md:max-h-[80vh] overflow-hidden flex flex-col"
      >
        {/* Header Bar */}
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-4">
             <div className="w-2 h-2 bg-[#DC143C] animate-pulse" />
             <h2 className="font-header text-2xl tracking-widest uppercase">{title}</h2>
          </div>
          <button onClick={onClose} className="hover:text-[#DC143C] transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-10 overflow-y-auto font-data text-lg text-gray-300 relative">
          {/* Decorative grid lines */}
          <div className="absolute top-0 right-10 w-[1px] h-full bg-white/5 pointer-events-none" />
          <div className="absolute top-10 left-0 w-full h-[1px] bg-white/5 pointer-events-none" />
          
          {children}
        </div>

        {/* Footer Bar */}
        <div className="p-4 border-t border-white/10 flex justify-between text-[10px] font-mono text-[#DC143C]/50 uppercase">
          <span>Secure Connection</span>
          <span>Encrypted: AES-256</span>
        </div>
      </motion.div>
    </div>
  )
}
