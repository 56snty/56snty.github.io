import React, { useRef } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';
import { GradientText, GlassCard } from '../styles/GlobalStyles';
import { useIntersectionObserver } from '../hooks/useParallax';

const AboutContainer = styled.section`
  min-height: 100vh;
  padding: 5rem 0;
  position: relative;
  background: linear-gradient(135deg,
    rgba(18, 4, 88, 0.1) 0%,
    rgba(66, 18, 133, 0.1) 50%,
    rgba(44, 24, 16, 0.1) 100%);
  overflow: hidden;
`;

const ParallaxBackground = styled(motion.div)`
  position: absolute;
  top: -20%;
  left: -10%;
  width: 120%;
  height: 140%;
  background: url('https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80') center/cover;
  filter: brightness(0.3) contrast(1.2);
  z-index: -1;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const TextContent = styled.div`
  z-index: 2;
`;

const Title = styled(motion.h2)`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  margin-bottom: 2rem;
  line-height: 1.1;
`;

const Description = styled(motion.p)`
  font-size: 1.2rem;
  line-height: 1.8;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const SkillsContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 3rem;
`;

const SkillCard = styled(GlassCard)`
  text-align: center;
  padding: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-10px) scale(1.02);
  }
`;

const SkillIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const SkillTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #4ecdc4;
`;

const SkillDescription = styled.p`
  font-size: 0.9rem;
  opacity: 0.8;
  line-height: 1.6;
`;

const ImageSection = styled(motion.div)`
  position: relative;
  height: 500px;
  border-radius: 20px;
  overflow: hidden;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  padding: 3px;

  &::before {
    content: '';
    position: absolute;
    inset: 3px;
    background: url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80') center/cover;
    border-radius: 17px;
    filter: brightness(0.8) contrast(1.1);
  }
`;

const FloatingNumber = styled(motion.div)`
  position: absolute;
  font-size: 8rem;
  font-weight: 900;
  opacity: 0.05;
  user-select: none;
  pointer-events: none;
`;

const skills = [
  {
    icon: '🎨',
    title: 'Creative Design',
    description: 'Crafting visually stunning and emotionally engaging digital experiences'
  },
  {
    icon: '⚡',
    title: 'Interactive Development',
    description: 'Building responsive and dynamic web applications with modern technologies'
  },
  {
    icon: '🚀',
    title: '3D Visualization',
    description: 'Creating immersive 3D environments and interactive digital installations'
  },
  {
    icon: '🎯',
    title: 'UX Strategy',
    description: 'Designing user-centered experiences that drive engagement and conversion'
  }
];

export const AboutSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const isVisible = useIntersectionObserver(containerRef, { threshold: 0.3 });

  return (
    <AboutContainer ref={containerRef} id="about">
      <ParallaxBackground style={{ y }} />

      <FloatingNumber
        style={{ top: '10%', right: '10%' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        01
      </FloatingNumber>

      <Content>
        <Grid>
          <TextContent>
            <Title
              initial={{ opacity: 0, x: -100 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              Meet Emal
              <br />
              <GradientText>21 & Unstoppable</GradientText>
            </Title>

            <Description
              initial={{ opacity: 0, x: -50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
            >
              I'm Emal, a 21-year-old Software Engineering student from Eindhoven, Netherlands.
              Currently mastering the art of code while creating mind-bending digital experiences
              that push the boundaries of what's possible on the web.
            </Description>

            <Description
              initial={{ opacity: 0, x: -50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
            >
              When I'm not buried in code or attending lectures, I'm experimenting with the latest
              web technologies, creating interactive experiences that make people say "How did they do that?!"
            </Description>
          </TextContent>

          <ImageSection
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
            whileHover={{ scale: 1.02 }}
          />
        </Grid>

        <SkillsContainer
          initial={{ opacity: 0, y: 100 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
        >
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <SkillCard>
                <SkillIcon>{skill.icon}</SkillIcon>
                <SkillTitle>{skill.title}</SkillTitle>
                <SkillDescription>{skill.description}</SkillDescription>
              </SkillCard>
            </motion.div>
          ))}
        </SkillsContainer>
      </Content>
    </AboutContainer>
  );
};