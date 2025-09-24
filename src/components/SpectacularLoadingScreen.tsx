import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: radial-gradient(ellipse at center, #0f0f23 0%, #000000 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  overflow: hidden;
`;

const LoadingContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  position: relative;
  z-index: 2;
`;

const CodeText = styled(motion.div)`
  font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
  font-size: clamp(0.8rem, 2vw, 1rem);
  color: #4ecdc4;
  text-align: center;
  line-height: 1.6;
  max-width: 600px;
  padding: 0 2rem;
`;

const ProgressContainer = styled.div`
  width: 300px;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
`;

const ProgressBar = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #4ecdc4, #ff6b6b, #ffeaa7);
  border-radius: 3px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(255,255,255,0.4) 50%,
      transparent 100%
    );
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const FloatingCode = styled(motion.div)<{ top: string; left: string }>`
  position: absolute;
  top: ${props => props.top};
  left: ${props => props.left};
  font-family: 'Fira Code', monospace;
  font-size: 0.8rem;
  color: rgba(78, 205, 196, 0.3);
  pointer-events: none;
`;

const CentralLogo = styled(motion.div)`
  width: 120px;
  height: 120px;
  border: 3px solid #4ecdc4;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: rgba(15, 15, 35, 0.8);
  backdrop-filter: blur(10px);

  &::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    border-radius: 50%;
    background: linear-gradient(45deg, #4ecdc4, #ff6b6b, #ffeaa7, #4ecdc4);
    background-size: 300% 300%;
    animation: borderRotate 3s linear infinite;
    z-index: -1;
  }

  @keyframes borderRotate {
    0% { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
  }
`;

const LogoText = styled.div`
  font-size: 2rem;
  font-weight: 900;
  background: linear-gradient(135deg, #4ecdc4, #ff6b6b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StatusText = styled(motion.div)`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  margin-top: 1rem;
`;

const ParticleSystem = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const Particle = styled(motion.div)<{
  x: number;
  y: number;
  size: number;
  color: string;
}>`
  position: absolute;
  left: ${props => props.x}%;
  top: ${props => props.y}%;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: ${props => props.color};
  border-radius: 50%;
  filter: blur(1px);
`;

interface SpectacularLoadingScreenProps {
  onLoadingComplete: () => void;
}

const codeLines = [
  "import { awesomePortfolio } from './universe';",
  "const student = new Developer('Emal Karwal');",
  "student.study('Software Development');",
  "student.location = 'Eindhoven, Netherlands';",
  "student.year = 3;",
  "",
  "// Initializing portfolio magic...",
  "await student.loadSkills(['PHP', 'React', 'JS']);",
  "await student.brewCoffee(9001);",
  "await student.debugLife();",
  "",
  "console.log('Ready to impress! 🚀');",
];

const statusMessages = [
  "Initializing quantum processors...",
  "Loading caffeine.dll...",
  "Compiling creativity modules...",
  "Establishing connection to the matrix...",
  "Optimizing humor algorithms...",
  "Calibrating perfectionism settings...",
  "Synchronizing with internship opportunities...",
  "Ready to blow minds! 🤯"
];

export const SpectacularLoadingScreen: React.FC<SpectacularLoadingScreenProps> = ({
  onLoadingComplete
}) => {
  const [progress, setProgress] = useState(0);
  const [currentCodeLine, setCurrentCodeLine] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    // Generate particles
    const generateParticles = () => {
      return Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        color: ['#4ecdc4', '#ff6b6b', '#ffeaa7'][Math.floor(Math.random() * 3)] + '60',
        duration: Math.random() * 10 + 5
      }));
    };

    setParticles(generateParticles());

    // Progress simulation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => onLoadingComplete(), 500);
          return 100;
        }
        return prev + Math.random() * 8 + 2;
      });
    }, 200);

    // Code typing effect
    const codeInterval = setInterval(() => {
      setCurrentCodeLine(prev => {
        if (prev < codeLines.length - 1) {
          return prev + 1;
        }
        clearInterval(codeInterval);
        return prev;
      });
    }, 300);

    // Status message rotation
    const statusInterval = setInterval(() => {
      setStatusIndex(prev => (prev + 1) % statusMessages.length);
    }, 800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(codeInterval);
      clearInterval(statusInterval);
    };
  }, [onLoadingComplete]);

  return (
    <AnimatePresence>
      <LoadingContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Particle System */}
        <ParticleSystem>
          {particles.map(particle => (
            <Particle
              key={particle.id}
              x={particle.x}
              y={particle.y}
              size={particle.size}
              color={particle.color}
              animate={{
                y: [particle.y, particle.y - 20, particle.y],
                x: [particle.x, particle.x + 10, particle.x - 5, particle.x],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </ParticleSystem>

        {/* Floating Code Elements */}
        {['{ }', '( )', '[ ]', '< >', '=> ', 'fn()', 'var', 'let'].map((code, i) => (
          <FloatingCode
            key={i}
            top={`${15 + (i * 10)}%`}
            left={`${5 + (i * 12)}%`}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          >
            {code}
          </FloatingCode>
        ))}

        <LoadingContent>
          {/* Central Logo */}
          <CentralLogo
            animate={{
              rotate: [0, 360],
              scale: [1, 1.05, 1]
            }}
            transition={{
              rotate: { duration: 10, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <LogoText>EK</LogoText>
          </CentralLogo>

          {/* Code Display */}
          <CodeText>
            {codeLines.slice(0, currentCodeLine + 1).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{
                  minHeight: '1.6rem',
                  color: line.startsWith('//') ? '#6a9955' : '#4ecdc4'
                }}
              >
                {line.startsWith('console.log') ? (
                  <span style={{ color: '#ff6b6b' }}>{line}</span>
                ) : line}
                {i === currentCodeLine && (
                  <motion.span
                    style={{ color: '#ffeaa7' }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    |
                  </motion.span>
                )}
              </motion.div>
            ))}
          </CodeText>

          {/* Progress Bar */}
          <div>
            <ProgressContainer>
              <ProgressBar
                initial={{ width: '0%' }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </ProgressContainer>

            <StatusText
              key={statusIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {statusMessages[statusIndex]} {Math.round(progress)}%
            </StatusText>
          </div>
        </LoadingContent>
      </LoadingContainer>
    </AnimatePresence>
  );
};