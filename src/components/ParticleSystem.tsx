import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ParticleCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
  life: number;
  maxLife: number;
}

interface ParticleSystemProps {
  count?: number;
  type?: 'stars' | 'geometric' | 'neural' | 'matrix';
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  count = 100,
  type = 'stars'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    particlesRef.current = Array.from({ length: count }, () => createParticle());

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      updateParticles();
      renderParticles(ctx);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [count, type]);

  const createParticle = (): Particle => {
    const canvas = canvasRef.current;
    if (!canvas) return {
      x: 0, y: 0, vx: 0, vy: 0, size: 1, opacity: 1, hue: 0, life: 1, maxLife: 1
    };

    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      hue: Math.random() * 360,
      life: Math.random() * 200 + 100,
      maxLife: Math.random() * 200 + 100
    };
  };

  const updateParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    particlesRef.current.forEach((particle, index) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Mouse interaction
      const dx = mouseRef.current.x - particle.x;
      const dy = mouseRef.current.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        const force = (100 - distance) / 100;
        particle.vx += (dx / distance) * force * 0.1;
        particle.vy += (dy / distance) * force * 0.1;
      }

      // Boundary wrapping
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;

      // Update life
      particle.life--;
      if (particle.life <= 0) {
        particlesRef.current[index] = createParticle();
      }

      // Update opacity based on life
      particle.opacity = particle.life / particle.maxLife;

      // Apply damping
      particle.vx *= 0.99;
      particle.vy *= 0.99;

      // Add some randomness
      particle.vx += (Math.random() - 0.5) * 0.1;
      particle.vy += (Math.random() - 0.5) * 0.1;

      // Update hue for color cycling
      particle.hue += 0.5;
      if (particle.hue > 360) particle.hue = 0;
    });
  };

  const renderParticles = (ctx: CanvasRenderingContext2D) => {
    particlesRef.current.forEach(particle => {
      switch (type) {
        case 'stars':
          renderStar(ctx, particle);
          break;
        case 'geometric':
          renderGeometric(ctx, particle);
          break;
        case 'neural':
          renderNeural(ctx, particle);
          break;
        case 'matrix':
          renderMatrix(ctx, particle);
          break;
      }
    });

    // Draw connections for neural network effect
    if (type === 'neural') {
      drawConnections(ctx);
    }
  };

  const renderStar = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.save();
    ctx.translate(particle.x, particle.y);

    // Ensure positive size
    const safeSize = Math.max(0.5, particle.size);

    // Glow effect
    ctx.shadowBlur = 10;
    ctx.shadowColor = `hsl(${particle.hue}, 70%, 60%)`;

    ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`;
    ctx.beginPath();
    ctx.arc(0, 0, safeSize, 0, Math.PI * 2);
    ctx.fill();

    // Inner bright core
    ctx.fillStyle = `hsla(${particle.hue}, 70%, 90%, ${particle.opacity * 0.8})`;
    ctx.beginPath();
    ctx.arc(0, 0, safeSize * 0.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  const renderGeometric = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.life * 0.01);

    // Ensure positive size
    const safeSize = Math.max(0.5, particle.size);

    ctx.strokeStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`;
    ctx.lineWidth = 2;

    // Draw rotating triangle
    ctx.beginPath();
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      const x = Math.cos(angle) * safeSize * 2;
      const y = Math.sin(angle) * safeSize * 2;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  };

  const renderNeural = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.save();

    // Pulsing circle - ensure radius is always positive
    const pulseSize = Math.max(0.5, particle.size + Math.sin(particle.life * 0.1) * 2);

    ctx.fillStyle = `hsla(${200 + particle.hue * 0.5}, 70%, 60%, ${particle.opacity})`;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, pulseSize, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  const renderMatrix = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.save();

    const chars = '01アカサタナハマヤラワガザダバパイキシチニヒミリギジヂビピウクスツヌフムユルグズヅブプエケセテネヘメレゲゼデベペオコソトノホモヨロゴゾドボポヴッン';
    const char = chars[Math.floor(Math.random() * chars.length)];

    // Ensure positive font size
    const safeSize = Math.max(0.5, particle.size);
    ctx.font = `${safeSize * 8}px monospace`;
    ctx.fillStyle = `hsla(120, 70%, 60%, ${particle.opacity})`;
    ctx.fillText(char, particle.x, particle.y);

    ctx.restore();
  };

  const drawConnections = (ctx: CanvasRenderingContext2D) => {
    particlesRef.current.forEach((particle, i) => {
      particlesRef.current.slice(i + 1).forEach(otherParticle => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          const opacity = (100 - distance) / 100 * 0.3;
          ctx.strokeStyle = `rgba(78, 205, 196, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(otherParticle.x, otherParticle.y);
          ctx.stroke();
        }
      });
    });
  };

  return <ParticleCanvas ref={canvasRef} />;
};