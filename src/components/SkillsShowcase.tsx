import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

const SkillsContainer = styled.section`
  min-height: 100vh;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 3rem 1rem;
    min-height: auto;
  }

  @media (max-width: 480px) {
    padding: 2rem 0.5rem;
  }

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background:
      radial-gradient(circle at 20% 50%, rgba(78, 205, 196, 0.1) 0%, transparent 30%),
      radial-gradient(circle at 80% 20%, rgba(255, 107, 107, 0.1) 0%, transparent 30%),
      radial-gradient(circle at 40% 80%, rgba(255, 234, 167, 0.1) 0%, transparent 30%);
    animation: float 20s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes float {
    0%, 100% { transform: translate(0%, 0%) rotate(0deg); }
    33% { transform: translate(30%, -30%) rotate(120deg); }
    66% { transform: translate(-20%, 20%) rotate(240deg); }
  }
`;

const Title = styled(motion.h2)`
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: 900;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #ffeaa7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 3rem;
  text-align: center;
  position: relative;
  z-index: 2;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: clamp(1.8rem, 8vw, 3rem);
    margin-bottom: 2rem;
  }

  @media (max-width: 480px) {
    font-size: clamp(1.5rem, 8vw, 2.5rem);
    margin-bottom: 1.5rem;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: linear-gradient(90deg, #4ecdc4, #ff6b6b, #ffeaa7);
    border-radius: 2px;
  }
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  width: 100%;
  perspective: 1000px;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    padding: 0;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 0;
  }
`;

const SkillCard = styled(motion.div)<{ bgColor: string }>`
  background: ${props => props.bgColor};
  border-radius: 20px;
  padding: 2.5rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transform-style: preserve-3d;

  @media (max-width: 768px) {
    padding: 2rem;
    border-radius: 15px;
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
    border-radius: 12px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%);
    border-radius: inherit;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
    border-radius: inherit;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::after {
    opacity: 1;
  }
`;

const SkillTitle = styled.h3`
  font-size: clamp(1.2rem, 4vw, 1.8rem);
  font-weight: 700;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    font-size: clamp(1.1rem, 5vw, 1.5rem);
  }

  @media (max-width: 480px) {
    flex-direction: column;
    text-align: center;
    gap: 0.3rem;
    font-size: clamp(1rem, 5vw, 1.3rem);
  }
`;

const SkillLevel = styled.div`
  font-size: 1rem;
  opacity: 0.8;
  margin-bottom: 1rem;
`;

const SkillDescription = styled.p`
  font-size: 1rem;
  opacity: 0.9;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const FunnyQuote = styled(motion.div)`
  background: rgba(0, 0, 0, 0.5);
  border-radius: 15px;
  padding: 1.5rem;
  font-style: italic;
  border: 2px solid rgba(78, 205, 196, 0.3);
  margin-top: 1.5rem;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '💭';
    position: absolute;
    top: -5px;
    right: 10px;
    font-size: 1.5rem;
    opacity: 0.6;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(180deg, #4ecdc4, #ff6b6b);
    animation: glow 2s ease-in-out infinite alternate;
  }

  @keyframes glow {
    from { box-shadow: 0 0 5px rgba(78, 205, 196, 0.5); }
    to { box-shadow: 0 0 20px rgba(78, 205, 196, 0.8), 0 0 30px rgba(255, 107, 107, 0.4); }
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
`;

const Progress = styled(motion.div)<{ width: string; color: string }>`
  height: 100%;
  background: ${props => props.color};
  border-radius: 4px;
`;

interface Skill {
  title: string;
  icon: string;
  level: string;
  progress: number;
  description: string;
  funnyQuote: string;
  bgColor: string;
  progressColor: string;
}

const skills: Skill[] = [
  {
    title: "PHP (Laravel)",
    icon: "🐘",
    level: "Senior Elephant Whisperer",
    progress: 90,
    description: "Been wrestling with PHP since the dark ages when register_globals was still a thing. Laravel is my trusty sidekick for building epic web applications that actually survive production deployments.",
    funnyQuote: "\"PHP is like that friend who's weird, has questionable life choices, but somehow always gets things done and pays their bills on time. Laravel just gives them a nice haircut and teaches them table manners.\"",
    bgColor: "linear-gradient(135deg, #8993be 0%, #6f42c1 100%)",
    progressColor: "linear-gradient(90deg, #8993be, #6f42c1)"
  },
  {
    title: "JavaScript",
    icon: "⚡",
    level: "Callback Hell Survivor & Promise Land Citizen",
    progress: 85,
    description: "From callback hell to promise paradise, with a brief stopover in async/await heaven. I speak fluent JS and can make browsers do backflips while questioning their life choices.",
    funnyQuote: "\"JavaScript: The language where '1' + 1 = '11', 1 + '1' = '11', but '1' - 1 = 0. It's like that friend who makes perfect sense after 3 cups of coffee and no sleep.\"",
    bgColor: "linear-gradient(135deg, #f7df1e 0%, #f0b90b 100%)",
    progressColor: "linear-gradient(90deg, #f7df1e, #f0b90b)"
  },
  {
    title: "React.js",
    icon: "⚛️",
    level: "Hook Collector & State Manager Extraordinaire",
    progress: 88,
    description: "Building UIs that don't make users want to throw their devices out the window (most of the time). useState, useEffect, and custom hooks are my best friends - we have weekly coffee dates.",
    funnyQuote: "\"React hooks are like potato chips - you can't use just one, and somehow you always end up with way more than you planned. Before you know it, you have 47 useEffects and you're not sure what half of them do.\"",
    bgColor: "linear-gradient(135deg, #61dafb 0%, #21a9c7 100%)",
    progressColor: "linear-gradient(90deg, #61dafb, #21a9c7)"
  },
  {
    title: "Python",
    icon: "🐍",
    level: "Indentation Padawan & Snake Charmer in Training",
    progress: 45,
    description: "Currently on my Python journey from zero to hero! From 'Hello World' to web scraping adventures and data manipulation magic. It's like JavaScript but with less semicolons, more zen, and way better error messages.",
    funnyQuote: "\"Python: The only language where your code can fail because you used spaces instead of tabs, and somehow this is considered a feature. Also, where 'import this' gives you life advice.\"",
    bgColor: "linear-gradient(135deg, #3776ab 0%, #ffd43b 100%)",
    progressColor: "linear-gradient(90deg, #3776ab, #ffd43b)"
  },
  {
    title: "C#",
    icon: "🎯",
    level: "Type Safety Enthusiast & Exception Handler",
    progress: 65,
    description: "Microsoft's gift to developers who like their code strongly typed, their errors caught at compile time, and their IDEs to autocomplete their thoughts before they finish typing them. Building desktop apps and APIs with the confidence of someone wearing a helmet.",
    funnyQuote: "\"C#: Because sometimes you need a language that won't let you shoot yourself in the foot... easily. Though you can still manage to blow up your entire leg with Entity Framework if you're creative enough.\"",
    bgColor: "linear-gradient(135deg, #239120 0%, #68217a 100%)",
    progressColor: "linear-gradient(90deg, #239120, #68217a)"
  }
];

const FloatingElement = styled(motion.div)`
  position: absolute;
  pointer-events: none;
  font-size: 2rem;
  opacity: 0.7;
  z-index: 10;
`;

const SkillMeter = styled.div`
  position: relative;
  margin: 1rem 0;
`;

const MeterLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
`;

const MeterTrack = styled.div`
  width: 100%;
  height: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
`;

const MeterFill = styled(motion.div)<{ color: string }>`
  height: 100%;
  background: ${props => props.color};
  border-radius: 6px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(255,255,255,0.3) 50%,
      transparent 100%
    );
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

export const SkillsShowcase: React.FC = () => {
  const [selectedSkill, setSelectedSkill] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for 3D effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [15, -15]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-15, 15]), { stiffness: 100, damping: 30 });

  // Pre-calculate transforms for performance
  const cardRotateX = useTransform(rotateX, value => value * 0.1);
  const cardRotateY = useTransform(rotateY, value => value * 0.1);
  const titleRotateX = useTransform(rotateX, value => value * 0.3);
  const titleRotateY = useTransform(rotateY, value => value * 0.3);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        mouseX.set(x);
        mouseY.set(y);
        setMousePosition({ x: e.clientX, y: e.clientY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <SkillsContainer id="skills" ref={containerRef}>
      {/* Floating Elements for Extra Flair */}
      <FloatingElement
        style={{ left: mousePosition.x - 20, top: mousePosition.y - 20 }}
        animate={{
          rotate: [0, 180, 360],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      >
        ✨
      </FloatingElement>

      <Title
        initial={{ opacity: 0, y: 50, rotateX: 30 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        style={{
          rotateX: titleRotateX,
          rotateY: titleRotateY
        }}
      >
        {"// My Arsenal of Code Weapons 🚀"}
      </Title>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
        style={{
          marginBottom: '2rem',
          textAlign: 'center',
          fontSize: '1.1rem',
          opacity: 0.8,
          fontStyle: 'italic'
        }}
      >
        "Warning: May contain traces of caffeine, late-night debugging, and questionable code comments."
      </motion.div>

      <SkillsGrid>
        {skills.map((skill, index) => (
          <SkillCard
            key={index}
            bgColor={skill.bgColor}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{
              scale: 1.05,
              rotateY: 5,
              rotateX: -5,
              z: 50
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedSkill(selectedSkill === index ? null : index)}
            style={{
              rotateX: cardRotateX,
              rotateY: cardRotateY
            }}
          >
            <SkillTitle>
              <span style={{ fontSize: '2rem' }}>{skill.icon}</span>
              {skill.title}
            </SkillTitle>

            <SkillLevel>{skill.level}</SkillLevel>

            <SkillMeter>
              <MeterLabel>
                <span>Power Level</span>
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.2 + 1.5 }}
                  viewport={{ once: true }}
                >
                  {skill.progress}%
                </motion.span>
              </MeterLabel>
              <MeterTrack>
                <MeterFill
                  color={skill.progressColor}
                  initial={{ width: '0%' }}
                  whileInView={{ width: `${skill.progress}%` }}
                  transition={{
                    duration: 2,
                    delay: index * 0.2,
                    type: "spring",
                    stiffness: 50
                  }}
                  viewport={{ once: true }}
                />
              </MeterTrack>
            </SkillMeter>

            <SkillDescription>{skill.description}</SkillDescription>

            <AnimatePresence>
              {selectedSkill === index && (
                <FunnyQuote
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {skill.funnyQuote}
                </FunnyQuote>
              )}
            </AnimatePresence>
          </SkillCard>
        ))}
      </SkillsGrid>

      <motion.div
        style={{
          marginTop: '4rem',
          textAlign: 'center',
          fontSize: '1.1rem'
        }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 0.8, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        viewport={{ once: true }}
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ display: 'inline-block', marginRight: '0.5rem' }}
        >
          💡
        </motion.div>
        Click on any skill card to reveal my totally professional developer thoughts!
        <br />
        <motion.span
          style={{
            fontSize: '0.9rem',
            opacity: 0.6,
            fontStyle: 'italic',
            marginTop: '0.5rem',
            display: 'block'
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          transition={{ delay: 1 }}
          viewport={{ once: true }}
        >
          (Spoiler alert: They're probably funnier than my actual code comments)
        </motion.span>
      </motion.div>
    </SkillsContainer>
  );
};