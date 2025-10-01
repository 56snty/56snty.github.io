import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
`;

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -1;
  overflow: hidden;
  background: linear-gradient(-45deg, #667eea, #764ba2, #ff6b6b, #4ecdc4);
  background-size: 400% 400%;
  animation: ${gradientShift} 15s ease infinite;
`;

const FloatingCircle = styled(motion.div)<{
  size: string;
  color: string;
  top: string;
  left: string;
  delay: number;
}>`
  position: absolute;
  width: ${props => props.size};
  height: ${props => props.size};
  top: ${props => props.top};
  left: ${props => props.left};
  background: ${props => props.color};
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.6;
  animation: ${float} 6s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
`;

const GlowingOrb = styled.div<{
  size: string;
  color: string;
  top: string;
  left: string;
}>`
  position: absolute;
  width: ${props => props.size};
  height: ${props => props.size};
  top: ${props => props.top};
  left: ${props => props.left};
  background: radial-gradient(circle, ${props => props.color} 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.4;
  animation: ${float} 8s ease-in-out infinite;
`;

export const AdvancedParallaxBackground: React.FC = () => {
  return (
    <BackgroundContainer>
      <FloatingCircle
        size="300px"
        color="rgba(78, 205, 196, 0.3)"
        top="10%"
        left="20%"
        delay={0}
      />
      <FloatingCircle
        size="250px"
        color="rgba(255, 107, 107, 0.3)"
        top="60%"
        left="70%"
        delay={1}
      />
      <FloatingCircle
        size="350px"
        color="rgba(255, 234, 167, 0.3)"
        top="30%"
        left="60%"
        delay={2}
      />
      <FloatingCircle
        size="200px"
        color="rgba(116, 185, 255, 0.3)"
        top="70%"
        left="15%"
        delay={1.5}
      />
      <GlowingOrb
        size="400px"
        color="rgba(162, 155, 254, 0.4)"
        top="40%"
        left="40%"
      />
    </BackgroundContainer>
  );
};