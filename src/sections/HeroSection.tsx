import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { GradientText } from '../styles/GlobalStyles';
import { useMousePosition } from '../hooks/useParallax';
import { Scene3D } from '../components/Scene3D';

const waveAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-10px) rotate(1deg); }
  50% { transform: translateY(-20px) rotate(0deg); }
  75% { transform: translateY(-10px) rotate(-1deg); }
`;

const glitchAnimation = keyframes`
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-2px); }
  40% { transform: translateX(2px); }
  60% { transform: translateX(-1px); }
  80% { transform: translateX(1px); }
`;

const HeroContainer = styled.section`
  height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background:
    radial-gradient(circle at 20% 80%, #120458 0%, transparent 40%),
    radial-gradient(circle at 80% 20%, #421285 0%, transparent 40%),
    radial-gradient(circle at 40% 40%, #2c1810 0%, transparent 40%),
    radial-gradient(circle at 60% 60%, #1a0033 0%, transparent 40%),
    linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000000 100%);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 98px,
        rgba(255, 107, 107, 0.03) 100px
      ),
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 98px,
        rgba(78, 205, 196, 0.03) 100px
      );
    animation: ${waveAnimation} 8s ease-in-out infinite;
    z-index: 1;
  }
`;

const SplineContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const ContentContainer = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 800px;
  padding: 0 2rem;
`;

const Title = styled(motion.h1)`
  font-size: clamp(3rem, 8vw, 8rem);
  font-weight: 900;
  margin-bottom: 1rem;
  line-height: 0.9;
  letter-spacing: -0.02em;
  position: relative;
  filter: drop-shadow(0 0 30px rgba(255, 107, 107, 0.5));

  &:hover {
    animation: ${glitchAnimation} 0.3s ease-in-out;
  }

  &::before {
    content: 'EMAL';
    position: absolute;
    top: 0;
    left: 0;
    color: rgba(255, 107, 107, 0.7);
    z-index: -1;
    animation: ${glitchAnimation} 2s ease-in-out infinite;
  }

  &::after {
    content: 'EMAL';
    position: absolute;
    top: 0;
    left: 0;
    color: rgba(78, 205, 196, 0.7);
    z-index: -2;
    animation: ${glitchAnimation} 2.5s ease-in-out infinite reverse;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: clamp(1.2rem, 3vw, 2rem);
  margin-bottom: 2rem;
  opacity: 0.8;
  font-weight: 300;
`;

const CTAButton = styled(motion.button)`
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border: none;
  padding: 1rem 2.5rem;
  border-radius: 50px;
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
  }
`;

const FloatingElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`;

const FloatingOrb = styled(motion.div)<{ size: number; color: string }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  background: ${props => props.color};
  filter: blur(1px);
  opacity: 0.6;
`;

const ScrollIndicator = styled(motion.div)`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  z-index: 2;
`;

const ScrollArrow = styled(motion.div)`
  width: 2px;
  height: 30px;
  background: linear-gradient(to bottom, transparent, #4ecdc4);
  border-radius: 1px;
`;

export const HeroSection: React.FC = () => {
  const mousePosition = useMousePosition();

  const floatingOrbs = [
    { size: 60, color: 'rgba(255, 107, 107, 0.3)', x: 10, y: 20 },
    { size: 40, color: 'rgba(78, 205, 196, 0.3)', x: 85, y: 15 },
    { size: 80, color: 'rgba(255, 159, 67, 0.2)', x: 15, y: 70 },
    { size: 50, color: 'rgba(156, 39, 176, 0.3)', x: 80, y: 75 },
  ];

  return (
    <HeroContainer id="home">
      <SplineContainer>
        <Scene3D />
      </SplineContainer>

      <FloatingElements>
        {floatingOrbs.map((orb, index) => (
          <FloatingOrb
            key={index}
            size={orb.size}
            color={orb.color}
            style={{
              left: `${orb.x}%`,
              top: `${orb.y}%`,
            }}
            animate={{
              x: (mousePosition.x - window.innerWidth / 2) * 0.02,
              y: (mousePosition.y - window.innerHeight / 2) * 0.02,
            }}
            transition={{ type: 'spring', stiffness: 50, damping: 20 }}
          />
        ))}
      </FloatingElements>

      <ContentContainer>
        <Title
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <GradientText>EMAL</GradientText>
          <br />
          DEVELOPER
        </Title>

        <Subtitle
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
        >
          21-year-old Software Engineering student from Eindhoven pushing the boundaries of web development
        </Subtitle>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
        >
          <CTAButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Explore My Skills
          </CTAButton>
        </motion.div>
      </ContentContainer>

      <ScrollIndicator
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <span>Scroll to discover</span>
        <ScrollArrow
          animate={{ scaleY: [1, 1.5, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </ScrollIndicator>
    </HeroContainer>
  );
};