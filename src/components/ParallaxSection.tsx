import React, { useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';
import { GradientText } from '../styles/GlobalStyles';

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
`;

const ParallaxContainer = styled.section`
  height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    animation: ${shimmer} 3s ease-in-out infinite;
    z-index: 4;
  }
`;

const BackgroundLayer = styled(motion.div)<{ bg: string }>`
  position: absolute;
  top: -20%;
  left: -10%;
  width: 120%;
  height: 140%;
  background: url(${props => props.bg}) center/cover;
  filter: brightness(0.3) contrast(1.4) saturate(1.5) hue-rotate(10deg);
  z-index: 1;
  transition: filter 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 30% 70%, rgba(255, 107, 107, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 70% 30%, rgba(78, 205, 196, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(156, 39, 176, 0.2) 0%, transparent 50%);
    animation: ${pulse} 4s ease-in-out infinite;
  }
`;

const OverlayLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 107, 107, 0.2) 0%,
    rgba(78, 205, 196, 0.2) 50%,
    rgba(156, 39, 176, 0.2) 100%
  );
  z-index: 2;
`;

const ContentLayer = styled.div`
  position: relative;
  z-index: 3;
  text-align: center;
  max-width: 800px;
  padding: 0 2rem;
`;

const ParallaxTitle = styled(motion.h2)`
  font-size: clamp(3rem, 6vw, 6rem);
  font-weight: 900;
  margin-bottom: 1.5rem;
  line-height: 1;
  text-shadow: 2px 2px 20px rgba(0, 0, 0, 0.5);
`;

const ParallaxText = styled(motion.p)`
  font-size: clamp(1.2rem, 2.5vw, 1.8rem);
  line-height: 1.6;
  opacity: 0.9;
  text-shadow: 1px 1px 10px rgba(0, 0, 0, 0.5);
`;

const FloatingElement = styled(motion.div)<{ size: number; color: string }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  background: ${props => props.color};
  filter: blur(2px);
  opacity: 0.6;
`;

interface ParallaxSectionProps {
  backgroundImage: string;
  title: string;
  subtitle: string;
  speed?: number;
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  backgroundImage,
  title,
  subtitle,
  speed = 0.5
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  const floatingElements = [
    { size: 80, color: 'rgba(255, 107, 107, 0.3)', x: 15, y: 20 },
    { size: 60, color: 'rgba(78, 205, 196, 0.3)', x: 85, y: 25 },
    { size: 100, color: 'rgba(255, 159, 67, 0.2)', x: 10, y: 75 },
    { size: 70, color: 'rgba(156, 39, 176, 0.3)', x: 80, y: 80 },
  ];

  const floatingY1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const floatingY2 = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const floatingY3 = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const floatingY4 = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const floatingYValues = [floatingY1, floatingY2, floatingY3, floatingY4];

  return (
    <ParallaxContainer ref={containerRef}>
      <BackgroundLayer bg={backgroundImage} style={{ y }} />
      <OverlayLayer />

      {floatingElements.map((element, index) => (
        <FloatingElement
          key={index}
          size={element.size}
          color={element.color}
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            y: floatingYValues[index],
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 10 + index * 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      <ContentLayer>
        <ParallaxTitle
          style={{ opacity }}
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <GradientText>{title}</GradientText>
        </ParallaxTitle>

        <ParallaxText
          style={{ opacity }}
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          {subtitle}
        </ParallaxText>
      </ContentLayer>
    </ParallaxContainer>
  );
};