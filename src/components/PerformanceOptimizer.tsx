import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

interface PerformanceOptimizerProps {
  onPerformanceChange?: (quality: 'low' | 'medium' | 'high') => void;
}

export const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({
  onPerformanceChange
}) => {
  const { gl, scene, camera } = useThree();
  const frameTimeRef = useRef<number[]>([]);
  const lastTime = useRef(0);
  const qualityRef = useRef<'low' | 'medium' | 'high'>('high');
  const checkCounter = useRef(0);

  useFrame((state) => {
    const currentTime = performance.now();

    if (lastTime.current > 0) {
      const frameTime = currentTime - lastTime.current;
      frameTimeRef.current.push(frameTime);

      // Keep only last 60 frames for average
      if (frameTimeRef.current.length > 60) {
        frameTimeRef.current.shift();
      }

      // Check performance every 60 frames
      checkCounter.current++;
      if (checkCounter.current >= 60 && frameTimeRef.current.length >= 30) {
        const avgFrameTime = frameTimeRef.current.reduce((a, b) => a + b, 0) / frameTimeRef.current.length;
        const fps = 1000 / avgFrameTime;

        let newQuality: 'low' | 'medium' | 'high' = 'high';

        if (fps < 30) {
          newQuality = 'low';
        } else if (fps < 45) {
          newQuality = 'medium';
        } else {
          newQuality = 'high';
        }

        // Only trigger callback if quality changed
        if (newQuality !== qualityRef.current) {
          qualityRef.current = newQuality;

          // Auto-adjust renderer settings
          switch (newQuality) {
            case 'low':
              gl.setPixelRatio(0.5);
              gl.shadowMap.enabled = false;
              break;
            case 'medium':
              gl.setPixelRatio(0.8);
              gl.shadowMap.enabled = false;
              break;
            case 'high':
              gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
              gl.shadowMap.enabled = true;
              break;
          }

          onPerformanceChange?.(newQuality);
          console.log(`Performance adjusted to: ${newQuality} (${fps.toFixed(1)} FPS)`);
        }

        checkCounter.current = 0;
      }
    }

    lastTime.current = currentTime;
  });

  // Initial optimization based on device capabilities
  useEffect(() => {
    const canvas = gl.domElement;
    const isLowEnd = navigator.hardwareConcurrency <= 4 ||
                     /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isLowEnd) {
      gl.setPixelRatio(0.7);
      gl.shadowMap.enabled = false;
      qualityRef.current = 'medium';
      onPerformanceChange?.('medium');
      console.log('Low-end device detected, starting with medium quality');
    }
  }, [gl, onPerformanceChange]);

  return null;
};