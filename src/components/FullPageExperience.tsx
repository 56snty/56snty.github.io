import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, Stars, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { GradientText } from '../styles/GlobalStyles';

const HeroSection = styled.section`
  height: 100vh;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  overflow: hidden;
`;

const HeroCanvas = styled(Canvas)`
  position: absolute !important;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 10;
  max-width: 800px;
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  margin-bottom: 1.5rem;
  text-shadow: 2px 2px 20px rgba(0, 0, 0, 0.5);
`;

const HeroSubtitle = styled(motion.p)`
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  line-height: 1.6;
  opacity: 0.9;
  margin-bottom: 3rem;
`;

const HeroButtons = styled(motion.div)`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const HeroButton = styled(motion.button)<{ variant: 'primary' | 'secondary' }>`
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: ${props => props.variant === 'primary'
    ? 'linear-gradient(45deg, #ff6b6b, #4ecdc4)'
    : 'transparent'};
  border: ${props => props.variant === 'secondary' ? '2px solid #4ecdc4' : 'none'};
  color: ${props => props.variant === 'primary' ? 'white' : '#4ecdc4'};
`;

// Simple 3D scene for the hero
function HeroScene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#4ecdc4" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#ff6b6b" />

      {/* Main hero object */}
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.2}>
        <mesh position={[0, 0, 0]} scale={[2.5, 2.5, 2.5]}>
          <torusGeometry args={[2, 0.8, 16, 32]} />
          <meshStandardMaterial
            color="#3498db"
            emissive="#2980b9"
            emissiveIntensity={0.4}
            roughness={0.3}
            metalness={0.7}
            transparent
            opacity={0.85}
          />
        </mesh>
      </Float>

      {/* Floating accent objects */}
      <Float speed={0.8} rotationIntensity={0.6} floatIntensity={0.3}>
        <mesh position={[8, 3, -5]} scale={[1, 1, 1]}>
          <dodecahedronGeometry args={[1]} />
          <meshStandardMaterial
            color="#e74c3c"
            emissive="#c0392b"
            emissiveIntensity={0.5}
            transparent
            opacity={0.7}
          />
        </mesh>
      </Float>

      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
        <mesh position={[-6, -2, -3]} scale={[0.8, 0.8, 0.8]}>
          <octahedronGeometry args={[1]} />
          <meshStandardMaterial
            color="#9b59b6"
            emissive="#8e44ad"
            emissiveIntensity={0.6}
            transparent
            opacity={0.8}
          />
        </mesh>
      </Float>

      {/* Stars */}
      <Stars
        radius={100}
        depth={50}
        count={1500}
        factor={4}
        saturation={0.2}
        fade
        speed={0.5}
      />

      <Environment preset="night" />

      {/* Post processing */}
      <EffectComposer multisampling={2}>
        <Bloom
          luminanceThreshold={0.4}
          luminanceSmoothing={0.9}
          intensity={0.8}
          radius={0.6}
        />
        <Vignette eskil={false} offset={0.1} darkness={0.3} />
      </EffectComposer>
    </>
  );
}

export const FullPageExperience: React.FC = () => {
  return (
    <HeroSection id="home">
      <HeroCanvas
        camera={{ position: [0, 0, 25], fov: 75 }}
        dpr={[0.7, 1.2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <HeroScene />
      </HeroCanvas>

      <HeroContent>
        <HeroTitle
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <GradientText>EMAL.DEV</GradientText>
        </HeroTitle>

        <HeroSubtitle
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Full-Stack Developer who speaks fluent PHP, JavaScript, and React 🚀
          <br />
          Currently learning Python and decent at C# 💻
        </HeroSubtitle>

        <HeroButtons
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <HeroButton
            variant="primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          >
            cat about.md
          </HeroButton>
          <HeroButton
            variant="secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            ping me
          </HeroButton>
        </HeroButtons>
      </HeroContent>
    </HeroSection>
  );
};