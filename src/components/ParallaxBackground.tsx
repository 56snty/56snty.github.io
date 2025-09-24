import React, { useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Float, MeshDistortMaterial, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import styled from 'styled-components';

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  pointer-events: none;
`;

// Animated background objects that respond to scroll
function FloatingObjects() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const objects = [
    { position: [-20, 10, -30] as [number, number, number], color: '#ff6b6b', size: 2 },
    { position: [25, -15, -40] as [number, number, number], color: '#4ecdc4', size: 1.5 },
    { position: [-15, 30, -25] as [number, number, number], color: '#ffeaa7', size: 1.8 },
    { position: [30, 20, -35] as [number, number, number], color: '#9b59b6', size: 1.2 },
    { position: [0, -25, -45] as [number, number, number], color: '#3498db', size: 2.5 }
  ];

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Objects move based on scroll and time
    state.scene.children.forEach((child, index) => {
      if (child.type === 'Group' && child.userData.isFloatingObject) {
        const scrollOffset = scrollY * 0.001;
        child.position.y = objects[index]?.position[1] + Math.sin(time * 0.5 + index) * 2 - scrollOffset * 20;
        child.rotation.x = time * 0.2 + index * 0.3;
        child.rotation.y = time * 0.3 + index * 0.2;
      }
    });
  });

  return (
    <>
      {objects.map((obj, index) => (
        <Float
          key={index}
          speed={0.5 + index * 0.2}
          rotationIntensity={0.3}
          floatIntensity={0.4}
        >
          <group userData={{ isFloatingObject: true }}>
            <mesh position={obj.position} scale={[obj.size, obj.size, obj.size]}>
              <dodecahedronGeometry args={[1, 0]} />
              <MeshDistortMaterial
                color={obj.color}
                emissive={obj.color}
                emissiveIntensity={0.3}
                distort={0.4}
                speed={1 + index * 0.5}
                transparent
                opacity={0.6}
              />
            </mesh>
          </group>
        </Float>
      ))}
    </>
  );
}

// Particle system that responds to scroll
function ScrollParticles() {
  const particlesRef = React.useRef<THREE.InstancedMesh>(null!);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const COUNT = 100;
  const positions = React.useMemo(() => {
    const pos: [number, number, number][] = [];
    for (let i = 0; i < COUNT; i++) {
      pos.push([
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 50 - 20
      ]);
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;

    const time = state.clock.elapsedTime;
    const scrollOffset = scrollY * 0.01;

    for (let i = 0; i < COUNT; i++) {
      const matrix = new THREE.Matrix4();
      const pos = positions[i];

      const x = pos[0] + Math.sin(time * 0.1 + i * 0.1) * 2;
      const y = pos[1] + Math.cos(time * 0.05 + i * 0.05) * 1 - scrollOffset * 10;
      const z = pos[2] + Math.sin(time * 0.08 + i * 0.04) * 1;

      matrix.setPosition(x, y, z);
      matrix.scale(new THREE.Vector3(
        0.1 + Math.sin(time + i) * 0.05,
        0.1 + Math.sin(time + i) * 0.05,
        0.1 + Math.sin(time + i) * 0.05
      ));

      particlesRef.current.setMatrixAt(i, matrix);
    }
    particlesRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={particlesRef} args={[undefined, undefined, COUNT]}>
      <sphereGeometry args={[0.1, 6, 6]} />
      <meshStandardMaterial
        color="#4ecdc4"
        emissive="#4ecdc4"
        emissiveIntensity={0.8}
        transparent
        opacity={0.6}
      />
    </instancedMesh>
  );
}

// Dynamic camera that subtly follows scroll
function ScrollCamera() {
  const { camera } = useThree();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const scrollOffset = scrollY * 0.002;

    // Subtle camera movement based on scroll
    camera.position.x = Math.sin(time * 0.1) * 2 + Math.sin(scrollOffset) * 5;
    camera.position.y = Math.cos(time * 0.05) * 1 - scrollOffset * 2;
    camera.position.z = 30 + Math.sin(scrollOffset * 0.5) * 10;

    // Look at a point that moves with scroll
    camera.lookAt(
      Math.sin(time * 0.1) * 3,
      -scrollOffset * 5,
      0
    );
  });

  return null;
}

// Main 3D scene
function BackgroundScene() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#4ecdc4" />
      <pointLight position={[-10, -10, -10]} intensity={0.6} color="#ff6b6b" />

      {/* Floating background objects */}
      <FloatingObjects />

      {/* Particle system */}
      <ScrollParticles />

      {/* Animated starfield that intensifies with scroll */}
      <Stars
        radius={50 + scrollY * 0.1}
        depth={30}
        count={1000 + scrollY}
        factor={3 + scrollY * 0.001}
        saturation={0.3}
        fade
        speed={0.3 + scrollY * 0.0001}
      />

      {/* Camera controller */}
      <ScrollCamera />

      {/* Environment */}
      <Environment preset="night" />

      {/* Post processing */}
      <EffectComposer multisampling={2}>
        <Bloom
          luminanceThreshold={0.3}
          luminanceSmoothing={0.9}
          intensity={0.6}
          radius={0.4}
        />
        <Vignette eskil={false} offset={0.15} darkness={0.4} />
      </EffectComposer>
    </>
  );
}

export const ParallaxBackground: React.FC = () => {
  return (
    <BackgroundContainer>
      <Canvas
        camera={{ position: [0, 0, 30], fov: 75 }}
        dpr={[0.5, 1]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance"
        }}
        performance={{ min: 0.8 }}
      >
        <BackgroundScene />
      </Canvas>
    </BackgroundContainer>
  );
};