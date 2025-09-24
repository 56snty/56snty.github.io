import React, { useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';
import { GradientText, GlassCard } from '../styles/GlobalStyles';
import { useIntersectionObserver } from '../hooks/useParallax';
import { Skills3D } from '../components/Skills3D';

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(255, 107, 107, 0.3); }
  25% { box-shadow: 0 0 30px rgba(78, 205, 196, 0.4); }
  50% { box-shadow: 0 0 40px rgba(255, 159, 67, 0.5); }
  75% { box-shadow: 0 0 30px rgba(156, 39, 176, 0.4); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
`;

const matrixRain = keyframes`
  0% { transform: translateY(-100vh); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(100vh); opacity: 0; }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const SkillsContainer = styled.section`
  min-height: 100vh;
  padding: 5rem 0;
  position: relative;
  background:
    radial-gradient(circle at 20% 20%, rgba(255, 107, 107, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(156, 39, 176, 0.05) 0%, transparent 50%),
    linear-gradient(135deg, #000 0%, #0a0a0a 100%);
  overflow: hidden;
`;

const MatrixBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
`;

const MatrixColumn = styled.div<{ delay: number; left: number }>`
  position: absolute;
  top: 0;
  left: ${props => props.left}%;
  width: 2px;
  height: 100px;
  background: linear-gradient(to bottom, transparent, #00ff41, transparent);
  animation: ${matrixRain} 3s linear infinite;
  animation-delay: ${props => props.delay}s;
  opacity: 0.3;
`;

const Content = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
`;

const Title = styled(motion.h2)`
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  margin-bottom: 3rem;
  text-align: center;
  line-height: 1;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120%;
    height: 120%;
    background: linear-gradient(45deg, transparent, rgba(255, 107, 107, 0.1), transparent);
    border-radius: 50%;
    animation: ${float} 6s ease-in-out infinite;
  }
`;

const Skills3DContainer = styled(motion.div)`
  height: 80vh;
  width: 100%;
  margin: 4rem 0;
  border-radius: 20px;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, transparent, rgba(255, 107, 107, 0.1), transparent);
    animation: ${shimmer} 3s ease-in-out infinite;
  }
`;

const SkillsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const SkillCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  animation: ${glow} 4s ease-in-out infinite;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255, 107, 107, 0.1), transparent);
    transform: rotate(-45deg);
    transition: all 0.5s ease;
    opacity: 0;
  }

  &:hover::before {
    opacity: 1;
    animation: ${float} 2s ease-in-out infinite;
  }

  &:hover {
    transform: translateY(-10px) scale(1.02);
    border-color: rgba(255, 107, 107, 0.5);
  }
`;

const SkillIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  text-align: center;
  filter: drop-shadow(0 0 20px rgba(255, 107, 107, 0.5));
`;

const SkillTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #4ecdc4;
  text-align: center;
  font-weight: 700;
`;

const SkillDescription = styled.p`
  font-size: 1rem;
  opacity: 0.9;
  line-height: 1.6;
  text-align: center;
  position: relative;
  z-index: 2;
`;

const TechStackSection = styled(motion.div)`
  margin-top: 5rem;
`;

const TechStackTitle = styled(motion.h3)`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  font-weight: 900;
`;

const TechGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
`;

const TechItem = styled(motion.div)`
  aspect-ratio: 1;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, transparent, rgba(78, 205, 196, 0.2), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover {
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 20px 40px rgba(78, 205, 196, 0.3);
  }
`;

const TechLabel = styled.span`
  font-size: 0.8rem;
  margin-top: 0.5rem;
  font-weight: 600;
  position: relative;
  z-index: 2;
`;

const FloatingNumber = styled(motion.div)`
  position: absolute;
  font-size: 12rem;
  font-weight: 900;
  opacity: 0.03;
  user-select: none;
  pointer-events: none;
  color: #4ecdc4;
`;

const skills = [
  {
    icon: '⚡',
    title: 'Frontend Wizardry',
    description: 'Creating lightning-fast, responsive web applications with React, TypeScript, and modern CSS that blow minds and break expectations.'
  },
  {
    icon: '🔮',
    title: 'Backend Sorcery',
    description: 'Building robust server architectures with Node.js, databases, and APIs that handle anything you throw at them.'
  },
  {
    icon: '🎨',
    title: 'UI/UX Magic',
    description: 'Designing interfaces so beautiful and intuitive that users forget they\'re using technology - it just feels natural.'
  },
  {
    icon: '🚀',
    title: 'Performance Optimization',
    description: 'Making websites load at warp speed and run smoother than butter on a hot pan.'
  },
  {
    icon: '🧠',
    title: 'Problem Solving',
    description: 'Breaking down complex challenges into elegant solutions that make other developers go "Why didn\'t I think of that?"'
  },
  {
    icon: '🌐',
    title: 'Full-Stack Mastery',
    description: 'Seamlessly connecting frontend beauty with backend power to create complete, end-to-end digital experiences.'
  }
];

const techStack = [
  { icon: '⚛️', label: 'React' },
  { icon: '📘', label: 'TypeScript' },
  { icon: '💚', label: 'Node.js' },
  { icon: '🎨', label: 'CSS3' },
  { icon: '⚡', label: 'JavaScript' },
  { icon: '🔗', label: 'Git' },
  { icon: '🐍', label: 'Python' },
  { icon: '📱', label: 'React Native' },
  { icon: '☁️', label: 'AWS' },
  { icon: '🗄️', label: 'MongoDB' },
  { icon: '🔄', label: 'GraphQL' },
  { icon: '🎯', label: 'Jest' }
];

export const SkillsSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const isVisible = useIntersectionObserver(containerRef, { threshold: 0.2 });

  // Matrix columns for background effect
  const matrixColumns = Array.from({ length: 50 }, (_, i) => ({
    left: (i * 2) % 100,
    delay: Math.random() * 3
  }));

  return (
    <SkillsContainer ref={containerRef} id="skills">
      <MatrixBackground>
        {matrixColumns.map((column, index) => (
          <MatrixColumn
            key={index}
            left={column.left}
            delay={column.delay}
          />
        ))}
      </MatrixBackground>

      <FloatingNumber
        style={{ top: '10%', right: '5%' }}
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        02
      </FloatingNumber>

      <Content>
        <Title
          initial={{ opacity: 0, y: 100 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <GradientText>SKILL</GradientText>
          <br />
          ARSENAL
        </Title>

        <Skills3DContainer
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
        >
          <Skills3D />
        </Skills3DContainer>

        <SkillsGrid
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {skills.map((skill, index) => (
            <SkillCard
              key={index}
              initial={{ opacity: 0, y: 100 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: 0.5 + index * 0.1,
                ease: 'easeOut'
              }}
              whileHover={{
                scale: 1.05,
                rotateY: 10,
                transition: { duration: 0.3 }
              }}
            >
              <SkillIcon>{skill.icon}</SkillIcon>
              <SkillTitle>{skill.title}</SkillTitle>
              <SkillDescription>{skill.description}</SkillDescription>
            </SkillCard>
          ))}
        </SkillsGrid>

        <TechStackSection
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <TechStackTitle>
            <GradientText>Tech Stack</GradientText>
          </TechStackTitle>

          <TechGrid>
            {techStack.map((tech, index) => (
              <TechItem
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{
                  duration: 0.5,
                  delay: 1.5 + index * 0.1,
                  type: 'spring',
                  stiffness: 200
                }}
                whileHover={{
                  scale: 1.2,
                  rotate: [0, -10, 10, -10, 0],
                  transition: { duration: 0.5 }
                }}
              >
                <span>{tech.icon}</span>
                <TechLabel>{tech.label}</TechLabel>
              </TechItem>
            ))}
          </TechGrid>
        </TechStackSection>
      </Content>
    </SkillsContainer>
  );
};