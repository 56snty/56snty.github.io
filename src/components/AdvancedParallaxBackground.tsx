import React, { useEffect, useRef, useState, useMemo } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useTheme } from '../ThemeProvider';

const ParallaxContainer = styled.div<{ isDark: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -1;
  overflow: hidden;
  background: ${props => props.isDark
    ? 'radial-gradient(ellipse at center, #0f0f23 0%, #000000 70%)'
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  };
  transition: background 0.5s ease;
`;

const ParallaxLayer = styled(motion.div)<{ depth: number }>`
  position: absolute;
  width: 120%;
  height: 120%;
  left: -10%;
  top: -10%;
  pointer-events: none;
`;

const FloatingElement = styled(motion.div)<{
  size: number;
  color: string;
  blur?: number;
  opacity: number;
}>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: ${props => props.color};
  border-radius: 50%;
  filter: blur(${props => props.blur || 0}px);
  opacity: ${props => props.opacity};
  mix-blend-mode: screen;
`;

const GeometricShape = styled(motion.div)<{
  width: number;
  height: number;
  color: string;
  rotation: number;
}>`
  position: absolute;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background: linear-gradient(45deg, ${props => props.color}40, transparent);
  border: 2px solid ${props => props.color}20;
  transform: rotate(${props => props.rotation}deg);
  backdrop-filter: blur(2px);
`;

const WaveLayer = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200%;
  height: 100px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(78, 205, 196, 0.1) 25%,
    rgba(255, 107, 107, 0.1) 50%,
    rgba(255, 234, 167, 0.1) 75%,
    transparent 100%
  );
  opacity: 0.6;
`;

const StarField = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.8), transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(78, 205, 196, 0.6), transparent),
    radial-gradient(1px 1px at 90px 40px, rgba(255, 107, 107, 0.4), transparent),
    radial-gradient(1px 1px at 130px 80px, rgba(255, 234, 167, 0.3), transparent),
    radial-gradient(2px 2px at 160px 30px, rgba(255,255,255,0.6), transparent);
  background-repeat: repeat;
  background-size: 200px 100px;
`;

const GradientOrb = styled(motion.div)<{
  size: number;
  colors: string[];
  x: number;
  y: number;
}>`
  position: absolute;
  left: ${props => props.x}%;
  top: ${props => props.y}%;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: radial-gradient(circle,
    ${props => props.colors[0]}40 0%,
    ${props => props.colors[1]}20 50%,
    transparent 70%
  );
  border-radius: 50%;
  filter: blur(40px);
  mix-blend-mode: screen;
`;

export const AdvancedParallaxBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { theme } = useTheme();

  // Smooth mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  // Parallax transforms with different speeds
  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const y3 = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const y4 = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);

  // Rotation based on scroll
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const rotate3 = useTransform(scrollYProgress, [0, 1], [0, 270]);

  // Scale based on scroll
  const scale1 = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.5, 2]);
  const scale2 = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 0.8, 1.2, 0.5]);

  // Opacity changes
  const opacity1 = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 0.8, 0.6, 0.2]);
  const opacity2 = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.5, 0.3, 0.7, 0.1]);

  // Mouse parallax transforms
  const mouseParallaxX = useTransform(smoothMouseX, [0, window.innerWidth], [-50, 50]);
  const mouseParallaxY = useTransform(smoothMouseY, [0, window.innerHeight], [-30, 30]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Generate random floating elements
  const floatingElements = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 60 + 20,
      color: [
        'rgba(78, 205, 196, 0.4)',
        'rgba(255, 107, 107, 0.4)',
        'rgba(255, 234, 167, 0.4)',
        'rgba(116, 185, 255, 0.4)',
        'rgba(162, 155, 254, 0.4)'
      ][Math.floor(Math.random() * 5)],
      blur: Math.random() * 20 + 5,
      opacity: Math.random() * 0.6 + 0.2,
      duration: Math.random() * 20 + 10
    }));
  }, []);

  const geometricShapes = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      width: Math.random() * 100 + 50,
      height: Math.random() * 100 + 50,
      color: [
        '#4ecdc4',
        '#ff6b6b',
        '#ffeaa7',
        '#74b9ff',
        '#a29bfe'
      ][Math.floor(Math.random() * 5)],
      rotation: Math.random() * 360,
      duration: Math.random() * 30 + 20
    }));
  }, []);

  const gradientOrbs = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      size: Math.random() * 300 + 200,
      colors: [
        ['#4ecdc4', '#74b9ff'],
        ['#ff6b6b', '#fd79a8'],
        ['#ffeaa7', '#fdcb6e'],
        ['#a29bfe', '#6c5ce7'],
        ['#fd79a8', '#e84393'],
        ['#00cec9', '#00b894']
      ][i % 6],
      duration: Math.random() * 40 + 30
    }));
  }, []);

  return (
    <ParallaxContainer ref={containerRef} isDark={theme.isDark}>
      {/* Star Field Background */}
      <ParallaxLayer depth={5} style={{ y: y4 }}>
        <StarField />
      </ParallaxLayer>

      {/* Large Gradient Orbs - Deepest Layer */}
      <ParallaxLayer depth={4} style={{ y: y4, opacity: opacity1 }}>
        {gradientOrbs.map(orb => (
          <GradientOrb
            key={orb.id}
            size={orb.size}
            colors={orb.colors}
            x={orb.x}
            y={orb.y}
            animate={{
              x: [orb.x, orb.x + 20, orb.x - 10, orb.x],
              y: [orb.y, orb.y - 15, orb.y + 25, orb.y],
              scale: [1, 1.2, 0.8, 1],
            }}
            transition={{
              duration: orb.duration,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </ParallaxLayer>

      {/* Geometric Shapes - Mid Layer */}
      <ParallaxLayer depth={3} style={{ y: y3, x: mouseParallaxX, opacity: opacity2 }}>
        {geometricShapes.map(shape => (
          <GeometricShape
            key={shape.id}
            width={shape.width}
            height={shape.height}
            color={shape.color}
            rotation={shape.rotation}
            style={{
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              rotate: rotate2
            }}
            animate={{
              x: [-10, 10, -5, -10],
              y: [-5, 15, -10, -5],
              rotateZ: [0, 45, -30, 0],
            }}
            transition={{
              duration: shape.duration,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </ParallaxLayer>

      {/* Floating Elements - Upper Mid Layer */}
      <ParallaxLayer depth={2} style={{ y: y2, x: mouseParallaxY }}>
        {floatingElements.map(element => (
          <FloatingElement
            key={element.id}
            size={element.size}
            color={element.color}
            blur={element.blur}
            opacity={element.opacity}
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
            }}
            animate={{
              y: [-20, 20, -10, -20],
              x: [-10, 15, -5, -10],
              scale: [1, 1.3, 0.8, 1],
              opacity: [element.opacity, element.opacity * 1.5, element.opacity * 0.5, element.opacity]
            }}
            transition={{
              duration: element.duration,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </ParallaxLayer>

      {/* Interactive Mouse Layer */}
      <ParallaxLayer depth={1} style={{ y: y1 }}>
        <motion.div
          style={{
            position: 'absolute',
            left: mousePosition.x - 50,
            top: mousePosition.y - 50,
            width: 100,
            height: 100,
            background: 'radial-gradient(circle, rgba(78, 205, 196, 0.3) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(20px)',
            pointerEvents: 'none',
            mixBlendMode: 'screen'
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </ParallaxLayer>

      {/* Animated Wave Bottom */}
      <WaveLayer
        style={{ y: y1, scale: scale1 }}
        animate={{
          x: [-100, 0, -100],
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Dynamic Color Overlay */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(
            ${mousePosition.x / window.innerWidth * 180}deg,
            rgba(78, 205, 196, 0.05) 0%,
            rgba(255, 107, 107, 0.05) 50%,
            rgba(255, 234, 167, 0.05) 100%
          )`,
          mixBlendMode: 'overlay',
          pointerEvents: 'none'
        }}
      />

      {/* Scroll-based Color Transition */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, transparent 0%, rgba(15, 15, 35, 0.8) 100%)',
          opacity: scrollYProgress,
          pointerEvents: 'none'
        }}
      />
    </ParallaxContainer>
  );
};