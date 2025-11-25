import { useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

// Fragment Shader: Creating a slow moving colorful smoke
const fragmentShader = `
uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;
varying vec2 vUv;

// Simplex noise (simplified)
float random (in vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123); }
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
    // Zoom out texture
    vec2 uv = vUv * 2.0;
    
    // Slow organic movement
    float movement = noise(uv + uTime * 0.1);
    
    // Mix colors based on noise
    vec3 color = mix(uColorA, uColorB, movement);
    
    // Darken corners naturally
    float dist = distance(vUv, vec2(0.5));
    color *= (1.0 - dist * 0.8);

    gl_FragColor = vec4(color, 1.0);
}
`

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export default function Nebula({ page }) {
  const mesh = useRef()
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColorA: { value: new THREE.Color('#000000') },
    uColorB: { value: new THREE.Color('#111111') }
  }), [])

  useFrame((state) => {
    mesh.current.material.uniforms.uTime.value = state.clock.elapsedTime
    
    // DYNAMIC COLOR SHIFTING BASED ON PAGE
    let targetA = '#000000'
    let targetB = '#111111'
    
    if (page === 'work') { targetA = '#1a0505'; targetB = '#200000' } // Deep Red
    if (page === 'about') { targetA = '#050a1a'; targetB = '#000020' } // Deep Blue
    if (page === 'contact') { targetA = '#1a1a1a'; targetB = '#333333' } // Grey

    // Smooth Lerp
    mesh.current.material.uniforms.uColorA.value.lerp(new THREE.Color(targetA), 0.02)
    mesh.current.material.uniforms.uColorB.value.lerp(new THREE.Color(targetB), 0.02)
  })

  return (
    <mesh ref={mesh} position={[0, 0, -5]} scale={[20, 12, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial 
        fragmentShader={fragmentShader} 
        vertexShader={vertexShader} 
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  )
}
