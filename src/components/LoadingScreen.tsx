import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { GradientText } from '../styles/GlobalStyles';

const LoadingContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #000 0%, #1a1a2e 50%, #16213e 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const LoadingTitle = styled(motion.h1)`
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 900;
  margin-bottom: 2rem;
  text-align: center;
`;

const LoadingBar = styled.div`
  width: 300px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin: 2rem 0;
`;

const LoadingFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #ffeaa7);
  border-radius: 2px;
`;

const LoadingText = styled(motion.p)`
  font-size: 1.2rem;
  opacity: 0.8;
  margin-top: 1rem;
`;

const FloatingOrbs = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const Orb = styled(motion.div)<{ size: number; color: string }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  background: ${props => props.color};
  filter: blur(2px);
  opacity: 0.6;
`;

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');

  useEffect(() => {
    const loadingSteps = [
      'npm install universe --force...',
      'Debugging why CSS works on my machine...',
      'Drinking coffee while code compiles...',
      'Googling "center a div" for the 1000th time...',
      'Pretending I understand async/await...',
      'Successfully avoided Stack Overflow crash!'
    ];

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        const stepIndex = Math.floor((newProgress / 100) * (loadingSteps.length - 1));
        setLoadingText(loadingSteps[stepIndex]);

        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(onLoadingComplete, 500);
          return 100;
        }
        return newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  const orbs = [
    { size: 60, color: 'rgba(255, 107, 107, 0.3)', x: 20, y: 20 },
    { size: 80, color: 'rgba(78, 205, 196, 0.3)', x: 80, y: 30 },
    { size: 40, color: 'rgba(255, 234, 167, 0.3)', x: 15, y: 70 },
    { size: 70, color: 'rgba(156, 39, 176, 0.3)', x: 85, y: 80 },
  ];

  return (
    <AnimatePresence>
      <LoadingContainer
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <FloatingOrbs>
          {orbs.map((orb, index) => (
            <Orb
              key={index}
              size={orb.size}
              color={orb.color}
              style={{
                left: `${orb.x}%`,
                top: `${orb.y}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4 + index,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </FloatingOrbs>

        <LoadingTitle
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <GradientText>EMAL.DEV</GradientText>
        </LoadingTitle>

        <LoadingBar>
          <LoadingFill
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </LoadingBar>

        <LoadingText
          key={loadingText}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {loadingText}
        </LoadingText>

        <motion.div
          style={{ marginTop: '2rem', fontSize: '1.5rem', fontWeight: 'bold' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {Math.round(progress)}%
        </motion.div>
      </LoadingContainer>
    </AnimatePresence>
  );
};