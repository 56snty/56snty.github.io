import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text3D, Float, Environment, useTexture, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const HeroContainer = styled.section`
  height: 100vh;
  min-height: 600px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(ellipse at center, #0f0f23 0%, #000000 100%);

  @media (max-width: 768px) {
    min-height: 100vh;
    padding: 0 1rem;
  }

  @media (max-width: 480px) {
    min-height: 100vh;
    padding: 0 0.5rem;
  }
`;

const CanvasContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;

  @media (max-width: 768px) {
    opacity: 0.6;
  }

  @media (max-width: 480px) {
    opacity: 0.4;
  }
`;

const ContentOverlay = styled(motion.div)`
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  max-width: 800px;
  padding: 0 2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 0 1rem;
    max-width: 100%;
  }

  @media (max-width: 480px) {
    padding: 0 0.5rem;
  }
`;

const MainTitle = styled(motion.h1)`
  font-size: clamp(2.5rem, 8vw, 6rem);
  font-weight: 900;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #4ecdc4, #ff6b6b, #ffeaa7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 20px rgba(78, 205, 196, 0.3));
  line-height: 1.1;
  text-align: center;
  word-break: break-word;

  @media (max-width: 768px) {
    font-size: clamp(2rem, 12vw, 4rem);
    margin-bottom: 0.5rem;
  }

  @media (max-width: 480px) {
    font-size: clamp(1.8rem, 10vw, 3rem);
    margin-bottom: 0.5rem;
    line-height: 1.2;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: clamp(1rem, 3vw, 1.8rem);
  opacity: 0.9;
  margin-bottom: 1.5rem;
  font-weight: 300;
  letter-spacing: 0.5px;
  line-height: 1.4;
  text-align: center;
  max-width: 100%;

  @media (max-width: 768px) {
    font-size: clamp(0.9rem, 4vw, 1.4rem);
    margin-bottom: 1rem;
    padding: 0 0.5rem;
  }

  @media (max-width: 480px) {
    font-size: clamp(0.8rem, 4vw, 1.2rem);
    margin-bottom: 1rem;
    line-height: 1.5;
  }
`;

const CTAButton = styled(motion.button)`
  background: linear-gradient(135deg, #4ecdc4, #ff6b6b);
  border: none;
  color: white;
  padding: 1.2rem 3rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 1rem 2rem;
    font-size: 1rem;
    margin: 0 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.9rem 1.5rem;
    font-size: 0.9rem;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`;

const FloatingElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;

  @media (max-width: 768px) {
    opacity: 0.6;
  }

  @media (max-width: 480px) {
    opacity: 0.3;
  }
`;

const FloatingIcon = styled(motion.div)<{ top: string; left: string; delay: number }>`
  position: absolute;
  top: ${props => props.top};
  left: ${props => props.left};
  font-size: 2rem;
  opacity: 0.6;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    opacity: 0.4;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
    opacity: 0.3;
    display: none;
  }
`;

// 3D Scene Components
function AnimatedSphere({ position, color }: { position: [number, number, number]; color: string }) {
  const mesh = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    mesh.current.rotation.x += delta * 0.5;
    mesh.current.rotation.y += delta * 0.2;
    mesh.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5 + position[1];
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={0.5}>
      <Sphere ref={mesh} position={position} scale={0.5}>
        <meshPhongMaterial color={color} transparent opacity={0.7} />
      </Sphere>
    </Float>
  );
}

function Scene3D() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (cameraRef.current) {
      cameraRef.current.position.x = Math.cos(time * 0.1) * 5;
      cameraRef.current.position.z = Math.sin(time * 0.1) * 5;
      cameraRef.current.lookAt(0, 0, 0);
    }
  });

  return (
    <>
      <perspectiveCamera ref={cameraRef} position={[0, 0, 10]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff6b6b" />

      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      <AnimatedSphere position={[-3, 2, 0]} color="#4ecdc4" />
      <AnimatedSphere position={[3, -1, -2]} color="#ff6b6b" />
      <AnimatedSphere position={[0, 3, -3]} color="#ffeaa7" />
      <AnimatedSphere position={[-2, -2, 1]} color="#a29bfe" />

      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </>
  );
}

export const EnhancedHeroSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  // Camera movement based on scroll
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  // Pre-calculate transforms
  const floatingX = useTransform(smoothMouseX, [-1, 1], [-20, 20]);
  const floatingY = useTransform(smoothMouseY, [-1, 1], [-10, 10]);
  const titleX = useTransform(smoothMouseX, [-1, 1], [-10, 10]);
  const titleY = useTransform(smoothMouseY, [-1, 1], [-5, 5]);

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX / innerWidth - 0.5) * 2);
      mouseY.set((clientY / innerHeight - 0.5) * 2);
      setMousePosition({ x: clientX, y: clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const floatingElements = [
    { icon: '💻', top: '20%', left: '10%', delay: 0 },
    { icon: '🚀', top: '15%', left: '85%', delay: 0.5 },
    { icon: '⚡', top: '70%', left: '15%', delay: 1 },
    { icon: '🎯', top: '25%', left: '75%', delay: 1.5 },
    { icon: '✨', top: '80%', left: '80%', delay: 2 },
    { icon: '🔥', top: '60%', left: '5%', delay: 2.5 },
  ];

  const scrollToNext = () => {
    const nextSection = document.getElementById('about');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <HeroContainer ref={containerRef}>
      {/* 3D Background */}
      <CanvasContainer>
        <Canvas>
          <Scene3D />
        </Canvas>
      </CanvasContainer>

      {/* Floating Elements */}
      <FloatingElements>
        <AnimatePresence>
          {isVisible && floatingElements.map((element, index) => (
            <FloatingIcon
              key={index}
              top={element.top}
              left={element.left}
              delay={element.delay}
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{
                opacity: [0.6, 0.8, 0.6],
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
                y: [0, -20, 0]
              }}
              transition={{
                delay: element.delay,
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                x: floatingX,
                y: floatingY
              }}
            >
              {element.icon}
            </FloatingIcon>
          ))}
        </AnimatePresence>

        {/* Mouse follower */}
        <motion.div
          style={{
            position: 'absolute',
            left: mousePosition.x - 25,
            top: mousePosition.y - 25,
            width: 50,
            height: 50,
            background: 'radial-gradient(circle, rgba(78, 205, 196, 0.3) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(15px)',
            pointerEvents: 'none'
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </FloatingElements>

      {/* Content Overlay */}
      <ContentOverlay
        style={{ y, scale, opacity, position: 'relative', height: '100%' }}
      >
        <MainTitle
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{
            x: titleX,
            y: titleY
          }}
        >
          Emal Karwal
        </MainTitle>

        <Subtitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          Software Development Student | 3rd Year @ Eindhoven, Netherlands
        </Subtitle>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
          style={{
            marginBottom: '2rem',
            fontSize: 'clamp(0.8rem, 2.5vw, 1.1rem)',
            fontStyle: 'italic',
            opacity: 0.8,
            padding: '0 1rem',
            textAlign: 'center',
            maxWidth: '100%'
          }}
        >
          "Turning caffeine into code, one bug at a time ☕"
        </motion.div>

        <CTAButton
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 15px 40px rgba(78, 205, 196, 0.4)"
          }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToNext}
        >
          Explore My Universe 🌌
        </CTAButton>

      </ContentOverlay>

      {/* Enhanced Scroll indicator - Outside content overlay */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          zIndex: 10
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <motion.div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          {/* Animated scroll wheel */}
          <motion.div
            style={{
              width: '30px',
              height: '50px',
              border: '2px solid rgba(78, 205, 196, 0.8)',
              borderRadius: '15px',
              position: 'relative',
              background: 'rgba(78, 205, 196, 0.1)',
              backdropFilter: 'blur(10px)'
            }}
            animate={{
              boxShadow: [
                '0 0 20px rgba(78, 205, 196, 0.3)',
                '0 0 30px rgba(78, 205, 196, 0.6)',
                '0 0 20px rgba(78, 205, 196, 0.3)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div
              style={{
                width: '4px',
                height: '8px',
                background: '#4ecdc4',
                borderRadius: '2px',
                position: 'absolute',
                left: '50%',
                top: '8px',
                transform: 'translateX(-50%)'
              }}
              animate={{
                y: [0, 15, 0],
                opacity: [1, 0.3, 1]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Text with effects */}
          <motion.div
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: 'clamp(0.7rem, 2vw, 0.9rem)',
              fontWeight: '500',
              letterSpacing: '0.5px',
              textShadow: '0 0 10px rgba(78, 205, 196, 0.3)',
              textAlign: 'center',
              padding: '0 1rem'
            }}
            animate={{
              y: [0, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            Scroll to explore my universe
          </motion.div>

          {/* Floating particles */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                width: '4px',
                height: '4px',
                background: '#4ecdc4',
                borderRadius: '50%',
                top: `${-20 + i * 10}px`,
                left: `${-10 + i * 10}px`
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </HeroContainer>
  );
};