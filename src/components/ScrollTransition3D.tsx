import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Environment,
  Float,
  MeshDistortMaterial,
  useScroll,
  ScrollControls,
  Scroll,
  Text,
  Sparkles,
  Trail,
  Sphere,
  Box,
  Torus
} from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
  Vignette,
  DepthOfField,
  ToneMapping
} from '@react-three/postprocessing';
import * as THREE from 'three';
// import { motion } from 'framer-motion-3d';

// Morphing Geometry Component
function MorphingGeometry({ scrollProgress }: { scrollProgress: any }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Morph based on scroll
      const progress = scrollProgress.get();

      // Rotation based on scroll
      meshRef.current.rotation.x = progress * Math.PI * 2;
      meshRef.current.rotation.y = progress * Math.PI * 4;

      // Scale transformation
      const scale = 1 + Math.sin(progress * Math.PI * 2) * 0.5;
      meshRef.current.scale.setScalar(scale);

      // Position changes
      meshRef.current.position.z = Math.sin(progress * Math.PI) * 10;
      meshRef.current.position.y = Math.cos(progress * Math.PI * 2) * 3;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2, 4]} />
      <MeshDistortMaterial
        color="#ff6b6b"
        attach="material"
        distort={0.8}
        speed={3}
        roughness={0.1}
        metalness={0.9}
      />
    </mesh>
  );
}

// Particle Tunnel Effect
function ParticleTunnel({ scrollProgress }: { scrollProgress: any }) {
  const points = useRef<THREE.Points>(null);

  const particlePositions = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    const colors = new Float32Array(2000 * 3);

    for (let i = 0; i < 2000; i++) {
      // Create tunnel effect
      const t = i / 2000;
      const radius = 5 + Math.sin(t * Math.PI * 8) * 2;
      const angle = t * Math.PI * 16;
      const z = t * 100 - 50;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = z;

      // Colorful gradient
      colors[i * 3] = Math.sin(t * Math.PI * 2) * 0.5 + 0.5;
      colors[i * 3 + 1] = Math.sin(t * Math.PI * 2 + 2) * 0.5 + 0.5;
      colors[i * 3 + 2] = Math.sin(t * Math.PI * 2 + 4) * 0.5 + 0.5;
    }

    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (points.current) {
      const progress = scrollProgress.get();

      // Move camera through tunnel
      state.camera.position.z = -progress * 80 + 10;
      state.camera.position.x = Math.sin(progress * Math.PI * 2) * 2;
      state.camera.position.y = Math.cos(progress * Math.PI * 4) * 1;

      // Rotate particles
      points.current.rotation.z = progress * Math.PI * 2;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particlePositions.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[particlePositions.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} vertexColors sizeAttenuation />
    </points>
  );
}

// Floating Text Elements
function FloatingTexts({ scrollProgress }: { scrollProgress: any }) {
  const textRefs = useRef<THREE.Group[]>([]);

  const texts = [
    { text: "INNOVATION", position: [0, 5, -10] as [number, number, number], color: "#ff6b6b" },
    { text: "CREATIVITY", position: [10, 0, -20] as [number, number, number], color: "#4ecdc4" },
    { text: "EXCELLENCE", position: [-10, -5, -30] as [number, number, number], color: "#ffeaa7" },
    { text: "PASSION", position: [0, -10, -40] as [number, number, number], color: "#fd79a8" }
  ];

  useFrame(() => {
    const progress = scrollProgress.get();

    textRefs.current.forEach((ref, index) => {
      if (ref) {
        const offset = index * 0.25;
        const textProgress = (progress - offset) * 4;

        // Smooth appearance and movement
        ref.position.z = -10 - index * 10 + textProgress * 20;
        ref.rotation.y = textProgress * Math.PI;

        // Fade in/out
        const opacity = Math.sin(textProgress * Math.PI);
        ref.children.forEach(child => {
          if (child instanceof THREE.Mesh && child.material) {
            (child.material as any).opacity = Math.max(0, opacity);
          }
        });
      }
    });
  });

  return (
    <>
      {texts.map((item, index) => (
        <group
          key={index}
          ref={(el) => {
            if (el) textRefs.current[index] = el;
          }}
          position={item.position}
        >
          <Text
            fontSize={2}
            color={item.color}
            anchorX="center"
            anchorY="middle"
            font="/fonts/inter-bold.woff"
          >
            {item.text}
          </Text>
        </group>
      ))}
    </>
  );
}

// Geometric Kaleidoscope
function GeometricKaleidoscope({ scrollProgress }: { scrollProgress: any }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      const progress = scrollProgress.get();

      groupRef.current.rotation.x = progress * Math.PI * 3;
      groupRef.current.rotation.y = progress * Math.PI * 2;
      groupRef.current.rotation.z = progress * Math.PI * 4;

      // Scale pulsing
      const scale = 1 + Math.sin(progress * Math.PI * 8) * 0.3;
      groupRef.current.scale.setScalar(scale);
    }
  });

  const geometries = useMemo(() => {
    const geoms = [];
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const radius = 8;
      geoms.push({
        position: [
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          Math.sin(i) * 3
        ] as [number, number, number],
        color: `hsl(${i * 18}, 70%, 60%)`
      });
    }
    return geoms;
  }, []);

  return (
    <group ref={groupRef}>
      {geometries.map((geom, index) => (
        <Float key={index} speed={2 + index * 0.1} rotationIntensity={2} floatIntensity={1}>
          <mesh position={geom.position}>
            <dodecahedronGeometry args={[0.5]} />
            <meshStandardMaterial
              color={geom.color}
              emissive={geom.color}
              emissiveIntensity={0.5}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// Main 3D Scene
function ScrollScene() {
  const scroll = useScroll();

  return (
    <>
      {/* Dynamic Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#ff6b6b" />
      <pointLight position={[-10, -10, -10]} intensity={2} color="#4ecdc4" />
      <pointLight position={[0, 10, -10]} intensity={1.5} color="#ffeaa7" />

      {/* 3D Elements */}
      <MorphingGeometry scrollProgress={scroll.offset} />
      <ParticleTunnel scrollProgress={scroll.offset} />
      <FloatingTexts scrollProgress={scroll.offset} />
      <GeometricKaleidoscope scrollProgress={scroll.offset} />

      {/* Sparkles */}
      <Sparkles count={100} scale={20} size={6} speed={0.4} />

      {/* Environment */}
      <Environment preset="night" />
    </>
  );
}

// Main Component
export const ScrollTransition3D: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ position: 'relative', height: '500vh' }}>
      <Canvas
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1
        }}
        camera={{ position: [0, 0, 10], fov: 75 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ScrollControls pages={5} damping={0.1}>
          <ScrollScene />

          {/* HTML Content */}
          <Scroll html style={{ width: '100%' }}>
            <div style={{ position: 'relative', zIndex: 10 }}>
              {children}
            </div>
          </Scroll>
        </ScrollControls>

        {/* Insane Post Processing */}
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
            height={300}
            intensity={1.5}
          />
          <ChromaticAberration offset={[0.002, 0.002]} />
          <DepthOfField focusDistance={0.1} focalLength={0.02} bokehScale={3} />
          <Noise opacity={0.1} />
          <Vignette eskil={false} offset={0.1} darkness={0.9} />
          <ToneMapping adaptive={false} resolution={256} middleGrey={0.6} maxLuminance={16.0} averageLuminance={1.0} adaptationRate={1.0} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};