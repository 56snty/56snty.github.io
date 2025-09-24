import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import {
  Text,
  Float,
  MeshDistortMaterial,
  OrbitControls,
  Environment,
  Sphere,
  Box,
  Torus,
  Octahedron,
  MeshWobbleMaterial,
  Stars
} from '@react-three/drei';
import { PerformanceOptimizer } from './PerformanceOptimizer';
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
  Vignette
} from '@react-three/postprocessing';
import * as THREE from 'three';
import { Mesh, Vector3 } from 'three';

// Custom shader material for the main geometry
const vertexShader = `
  uniform float time;
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vPosition = position;

    vec3 pos = position;
    pos.x += sin(pos.y * 4.0 + time) * 0.1;
    pos.y += sin(pos.x * 4.0 + time) * 0.1;
    pos.z += sin(pos.x * pos.y + time) * 0.1;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform float time;
  uniform vec3 color;
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vec2 uv = vUv;

    // Create flowing patterns
    float pattern1 = sin(uv.x * 10.0 + time) * sin(uv.y * 10.0 + time);
    float pattern2 = sin(uv.x * 20.0 - time * 2.0) * cos(uv.y * 15.0 + time);

    // Create color variations
    vec3 col = color;
    col.r += pattern1 * 0.3;
    col.g += pattern2 * 0.3;
    col.b += sin(time + vPosition.z) * 0.3;

    // Add glow effect
    float glow = sin(time + length(uv - 0.5) * 10.0) * 0.5 + 0.5;
    col += glow * 0.2;

    gl_FragColor = vec4(col, 1.0);
  }
`;

// Custom Shader Material Component
function CustomShaderMaterial({ color }: { color: string }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  const uniforms = useMemo(() => ({
    time: { value: 0 },
    color: { value: new THREE.Color(color) }
  }), [color]);

  return (
    <shaderMaterial
      ref={materialRef}
      uniforms={uniforms}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
    />
  );
}

// Space Objects - Planets, Moons, and Celestial Bodies
function SpaceObject({ position, type, color, scale = 1 }: {
  position: [number, number, number];
  type: 'planet' | 'moon' | 'asteroid' | 'nebula';
  color: string;
  scale?: number;
}) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01; // Slow rotation like a planet
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.3;
    }
  });

  const getGeometry = () => {
    switch (type) {
      case 'planet':
        return <sphereGeometry args={[1, 32, 32]} />;
      case 'moon':
        return <sphereGeometry args={[0.6, 16, 16]} />;
      case 'asteroid':
        return <dodecahedronGeometry args={[0.8]} />;
      case 'nebula':
        return <torusGeometry args={[1.5, 0.6, 8, 16]} />;
      default:
        return <sphereGeometry args={[1, 32, 32]} />;
    }
  };

  const getMaterial = () => {
    switch (type) {
      case 'planet':
        return (
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.1}
            roughness={0.7}
            metalness={0.2}
          />
        );
      case 'moon':
        return (
          <meshStandardMaterial
            color={color}
            roughness={1}
            metalness={0}
          />
        );
      case 'asteroid':
        return (
          <meshStandardMaterial
            color={color}
            roughness={0.9}
            metalness={0.3}
          />
        );
      case 'nebula':
        return (
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.4}
            transparent
            opacity={0.6}
          />
        );
      default:
        return <meshStandardMaterial color={color} />;
    }
  };

  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={0.3}>
      <mesh ref={meshRef} position={position} scale={scale}>
        {getGeometry()}
        {getMaterial()}
      </mesh>
    </Float>
  );
}

// Space Star Field with Twinkling Effect
function SpaceStarField() {
  const starsRef = useRef<THREE.Points>(null);
  const { mouse } = useThree();

  const starData = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const twinkleOffsets = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Distribute stars in a spherical volume around the camera
      const radius = 50 + Math.random() * 200;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Star colors - mix of white, blue, and warm stars
      const starType = Math.random();
      if (starType < 0.6) {
        // White stars
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 1;
      } else if (starType < 0.8) {
        // Blue stars
        colors[i * 3] = 0.7;
        colors[i * 3 + 1] = 0.8;
        colors[i * 3 + 2] = 1;
      } else {
        // Warm yellow-orange stars
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.9;
        colors[i * 3 + 2] = 0.6;
      }

      sizes[i] = Math.random() * 3 + 1;
      twinkleOffsets[i] = Math.random() * Math.PI * 2;
    }

    return { positions, colors, sizes, twinkleOffsets };
  }, []);

  useFrame((state) => {
    if (starsRef.current) {
      const geometry = starsRef.current.geometry;
      const positions = geometry.attributes.position.array as Float32Array;
      const colors = geometry.attributes.color.array as Float32Array;
      const time = state.clock.elapsedTime;

      // Twinkling effect
      for (let i = 0; i < starData.twinkleOffsets.length; i++) {
        const twinkle = Math.sin(time * 2 + starData.twinkleOffsets[i]) * 0.5 + 0.5;
        const colorIndex = i * 3;

        // Adjust brightness for twinkling
        const baseBrightness = starData.colors[colorIndex];
        colors[colorIndex] = baseBrightness * (0.3 + twinkle * 0.7);
        colors[colorIndex + 1] = starData.colors[colorIndex + 1] * (0.3 + twinkle * 0.7);
        colors[colorIndex + 2] = starData.colors[colorIndex + 2] * (0.3 + twinkle * 0.7);
      }

      // Subtle camera parallax movement
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += mouse.x * 0.1;
        positions[i + 1] += mouse.y * 0.1;
      }

      geometry.attributes.color.needsUpdate = true;
      geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[starData.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[starData.colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[starData.sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={2}
        vertexColors
        sizeAttenuation={true}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Space Camera Controller
function SpaceCameraController() {
  const { camera } = useThree();
  const basePosition = useRef(new Vector3(0, 0, 8));

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const mouse = state.mouse;

    // Floating motion in space
    const floatX = Math.sin(time * 0.3) * 1.5;
    const floatY = Math.cos(time * 0.2) * 1;
    const floatZ = Math.sin(time * 0.4) * 0.5;

    // Mouse influence for space exploration feel
    const mouseX = mouse.x * 3;
    const mouseY = mouse.y * 3;

    // Combine floating and mouse movement
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      basePosition.current.x + floatX + mouseX,
      0.03
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      basePosition.current.y + floatY + mouseY,
      0.03
    );
    camera.position.z = THREE.MathUtils.lerp(
      camera.position.z,
      basePosition.current.z + floatZ,
      0.03
    );

    // Look at center with slight drift
    const lookTarget = new Vector3(
      Math.sin(time * 0.1) * 0.5,
      Math.cos(time * 0.15) * 0.3,
      0
    );
    camera.lookAt(lookTarget);

    // Subtle camera roll for space feel
    camera.rotation.z = Math.sin(time * 0.1 + mouse.x) * 0.02;
  });

  return null;
}

// Main 3D Scene
function Scene() {

  return (
    <>
      {/* Space Camera Controller */}
      <SpaceCameraController />

      {/* Space Lighting - More subtle and cosmic */}
      <ambientLight intensity={0.2} color="#1a1a2e" />
      <pointLight position={[20, 20, 20]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-20, -20, -20]} intensity={0.5} color="#4b79c7" />
      <directionalLight
        position={[0, 50, 0]}
        intensity={0.6}
        color="#ffd700"
        castShadow
      />

      {/* Star Field */}
      <SpaceStarField />

      {/* Space Objects */}
      <SpaceObject position={[-8, 0, -5]} type="planet" color="#ff6b6b" scale={1.8} />
      <SpaceObject position={[6, 3, -3]} type="moon" color="#e0e0e0" scale={0.8} />
      <SpaceObject position={[0, -4, -8]} type="nebula" color="#9b59b6" scale={2} />
      <SpaceObject position={[-3, 5, 2]} type="asteroid" color="#95a5a6" scale={0.6} />
      <SpaceObject position={[8, -2, 4]} type="planet" color="#3498db" scale={1.2} />
      <SpaceObject position={[-6, -3, 6]} type="moon" color="#f39c12" scale={0.5} />

      {/* Central Space Station or Wormhole */}
      <Float speed={3} rotationIntensity={1} floatIntensity={0.8}>
        <mesh position={[0, 0, 0]} scale={2.5}>
          <torusKnotGeometry args={[1, 0.3, 100, 16]} />
          <meshStandardMaterial
            color="#00d4ff"
            emissive="#00d4ff"
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
            transparent
            opacity={0.9}
          />
        </mesh>
      </Float>

      {/* Additional cosmic background stars */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />

      {/* Space Environment */}
      <Environment preset="night" />
    </>
  );
}

// Main 3D Canvas Component
export const Scene3D: React.FC = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      style={{ width: '100%', height: '100%' }}
      dpr={[0.8, 1.5]} // Reduced pixel ratio for better performance
      gl={{
        antialias: false, // Disabled for performance
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
        depth: true
      }}
      frameloop="always" // Smooth continuous rendering
      performance={{ min: 0.8 }} // Adaptive performance
    >
      <PerformanceOptimizer />
      <Scene />

      {/* Space-themed Post Processing Effects */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.3}
          luminanceSmoothing={0.7}
          height={300}
          intensity={1.5}
          radius={0.8}
        />
        <ChromaticAberration
          offset={[0.002, 0.002]}
          blendFunction={23}
        />
        <Noise
          opacity={0.02}
          blendFunction={23}
        />
        <Vignette
          eskil={false}
          offset={0.15}
          darkness={0.6}
        />
      </EffectComposer>
    </Canvas>
  );
};