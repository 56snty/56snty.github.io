import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Text,
  Float,
  MeshDistortMaterial,
  Sphere,
  Box,
  RoundedBox,
  MeshWobbleMaterial,
  Environment,
  ContactShadows,
  useTexture,
  Trail,
  Sparkles,
  shaderMaterial
} from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
  Vignette,
  Glitch
} from '@react-three/postprocessing';
import * as THREE from 'three';
import { Mesh, Vector3, Color } from 'three';
import { extend } from '@react-three/fiber';

// Custom hologram shader
const HologramMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color(0.1, 0.3, 1.0),
    glowIntensity: 1.0,
  },
  // Vertex shader
  `
    uniform float time;
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;

    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normal;

      vec3 pos = position;
      pos += normal * sin(pos.y * 5.0 + time * 2.0) * 0.1;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float time;
    uniform vec3 color;
    uniform float glowIntensity;
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;

    void main() {
      vec2 uv = vUv;

      // Hologram lines
      float lines = sin(uv.y * 100.0 + time * 3.0);
      lines = smoothstep(0.0, 0.1, lines);

      // Fresnel effect
      vec3 viewDirection = normalize(cameraPosition - vPosition);
      float fresnel = 1.0 - dot(vNormal, viewDirection);
      fresnel = pow(fresnel, 2.0);

      // Flickering effect
      float flicker = sin(time * 10.0) * 0.1 + 0.9;

      vec3 finalColor = color * fresnel * glowIntensity * flicker;
      finalColor += lines * 0.5;

      gl_FragColor = vec4(finalColor, fresnel * 0.8);
    }
  `
);

extend({ HologramMaterial });

// Skill data with 3D positions
const skills3D = [
  { name: 'React', position: [-4, 2, 0] as [number, number, number], color: '#61DAFB', icon: '⚛️' },
  { name: 'TypeScript', position: [4, 1, -2] as [number, number, number], color: '#3178C6', icon: '📘' },
  { name: 'Three.js', position: [0, 3, 1] as [number, number, number], color: '#000000', icon: '🎮' },
  { name: 'Node.js', position: [-2, -1, 2] as [number, number, number], color: '#339933', icon: '💚' },
  { name: 'Python', position: [3, -2, 0] as [number, number, number], color: '#3776AB', icon: '🐍' },
  { name: 'WebGL', position: [-3, 0, -1] as [number, number, number], color: '#990000', icon: '🔮' },
  { name: 'Next.js', position: [2, 2, 1] as [number, number, number], color: '#000000', icon: '▲' },
  { name: 'GraphQL', position: [0, -3, -2] as [number, number, number], color: '#E10098', icon: '🔄' },
];

// Interactive Skill Orb Component
function SkillOrb({
  skill,
  isSelected,
  onSelect
}: {
  skill: typeof skills3D[0];
  isSelected: boolean;
  onSelect: () => void;
}) {
  const meshRef = useRef<Mesh>(null);
  const hologramRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.position.y = skill.position[1] + Math.sin(state.clock.elapsedTime + skill.position[0]) * 0.2;

      // Scale animation
      const targetScale = isSelected ? 1.5 : hovered ? 1.2 : 1;
      meshRef.current.scale.lerp(new Vector3(targetScale, targetScale, targetScale), 0.1);
    }

    if (hologramRef.current) {
      hologramRef.current.time = state.clock.elapsedTime;
    }
  });

  return (
    <group position={skill.position}>
      <Float speed={3} rotationIntensity={1} floatIntensity={0.5}>
        {/* Main Skill Sphere */}
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={onSelect}
        >
          <sphereGeometry args={[0.8, 32, 32]} />
          <MeshDistortMaterial
            color={skill.color}
            attach="material"
            distort={0.3}
            speed={2}
            roughness={0.1}
            metalness={0.8}
            emissive={skill.color}
            emissiveIntensity={isSelected ? 0.5 : 0.2}
          />
        </mesh>

        {/* Holographic Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]} scale={isSelected ? 2 : 1.5}>
          <torusGeometry args={[1.2, 0.05, 8, 32]} />
          <meshBasicMaterial
            color={skill.color}
            transparent
            opacity={0.6}
            wireframe
          />
        </mesh>

        {/* Floating Text */}
        <Text
          position={[0, -1.5, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
        >
          {skill.name}
        </Text>

        {/* Icon */}
        <Text
          position={[0, 0, 1]}
          fontSize={0.5}
          anchorX="center"
          anchorY="middle"
        >
          {skill.icon}
        </Text>

        {/* Particle Sparkles - Reduced count */}
        {isSelected && (
          <Sparkles
            count={8}
            scale={2}
            size={4}
            speed={0.4}
            color={skill.color}
          />
        )}
      </Float>

      {/* Connection Lines to Center */}
      {isSelected && (
        <Trail
          width={2}
          length={6}
          color={skill.color}
          attenuation={(t) => t * t}
        >
          <mesh>
            <sphereGeometry args={[0.1]} />
            <meshBasicMaterial color={skill.color} />
          </mesh>
        </Trail>
      )}
    </group>
  );
}

// Central Knowledge Core
function KnowledgeCore({ selectedSkill }: { selectedSkill: string | null }) {
  const coreRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (coreRef.current) {
      coreRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      coreRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      coreRef.current.rotation.z = state.clock.elapsedTime * 0.1;

      // Pulse effect when skill is selected
      const pulseScale = selectedSkill ? 1 + Math.sin(state.clock.elapsedTime * 5) * 0.1 : 1;
      coreRef.current.scale.setScalar(pulseScale);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1, 2]} />
        <MeshWobbleMaterial
          factor={0.6}
          speed={2}
          color={selectedSkill ? '#ff6b6b' : '#4ecdc4'}
          wireframe={false}
          roughness={0.1}
          metalness={0.8}
          emissive={selectedSkill ? '#ff6b6b' : '#4ecdc4'}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Energy Field */}
      <Sphere args={[2, 32, 32]} scale={selectedSkill ? 1.2 : 1}>
        <meshBasicMaterial
          color={selectedSkill ? '#ff6b6b' : '#4ecdc4'}
          transparent
          opacity={0.1}
          wireframe
        />
      </Sphere>

      {/* Orbiting Data Cubes - Reduced count */}
      {[...Array(4)].map((_, i) => (
        <Float key={i} speed={2 + i * 0.1} rotationIntensity={1} floatIntensity={0.5}>
          <mesh
            position={[
              Math.cos((i / 4) * Math.PI * 2) * 3,
              Math.sin((i / 2) * Math.PI * 2) * 0.5,
              Math.sin((i / 4) * Math.PI * 2) * 3
            ]}
          >
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshStandardMaterial
              color={selectedSkill ? '#ffeaa7' : '#74b9ff'}
              emissive={selectedSkill ? '#ffeaa7' : '#74b9ff'}
              emissiveIntensity={0.5}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// Main 3D Skills Scene
function Skills3DScene() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const { camera } = useThree();

  useFrame((state) => {
    // Dynamic camera movement
    camera.position.x = Math.sin(state.clock.elapsedTime * 0.1) * 5;
    camera.position.z = 8 + Math.cos(state.clock.elapsedTime * 0.1) * 2;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      {/* Dynamic Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#ff6b6b" />
      <pointLight position={[-10, -10, -10]} intensity={2} color="#4ecdc4" />
      <pointLight position={[0, 10, -10]} intensity={1.5} color="#ffeaa7" />

      {/* Central Knowledge Core */}
      <KnowledgeCore selectedSkill={selectedSkill} />

      {/* Skill Orbs */}
      {skills3D.map((skill) => (
        <SkillOrb
          key={skill.name}
          skill={skill}
          isSelected={selectedSkill === skill.name}
          onSelect={() => setSelectedSkill(selectedSkill === skill.name ? null : skill.name)}
        />
      ))}

      {/* Contact Shadows */}
      <ContactShadows
        position={[0, -4, 0]}
        opacity={0.4}
        scale={20}
        blur={2}
        far={4}
        color="#4ecdc4"
      />

      {/* Environment */}
      <Environment preset="night" />
    </>
  );
}

// Main 3D Skills Component
export const Skills3D: React.FC = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 75 }}
      style={{ width: '100%', height: '100%' }}
      dpr={[0.7, 1.2]} // Reduced for performance
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false
      }}
      frameloop="always"
      performance={{ min: 0.8 }}
    >
      <Skills3DScene />

      {/* Optimized Post Processing */}
      <EffectComposer>
        <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} height={200} intensity={1.2} />
        <Vignette eskil={false} offset={0.1} darkness={0.6} />
      </EffectComposer>
    </Canvas>
  );
};