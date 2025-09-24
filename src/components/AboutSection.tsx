import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

const AboutContainer = styled.section`
  min-height: 100vh;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
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
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 10% 20%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 90% 80%, rgba(255, 107, 107, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(255, 234, 167, 0.05) 0%, transparent 70%);
    animation: breathe 8s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes breathe {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.1); }
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  @media (max-width: 768px) {
    gap: 2rem;
    padding: 0;
  }

  @media (max-width: 480px) {
    gap: 1.5rem;
    padding: 0;
  }
`;

const TextSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Title = styled(motion.h2)`
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: 900;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  line-height: 1.2;
  text-align: center;

  @media (max-width: 768px) {
    font-size: clamp(1.8rem, 8vw, 3rem);
  }

  @media (max-width: 480px) {
    font-size: clamp(1.5rem, 8vw, 2.5rem);
    margin-bottom: 0.8rem;
  }
`;

const Description = styled(motion.p)`
  font-size: clamp(1rem, 3vw, 1.2rem);
  line-height: 1.8;
  opacity: 0.9;
  margin-bottom: 1.5rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: clamp(0.9rem, 4vw, 1.1rem);
    line-height: 1.6;
  }

  @media (max-width: 480px) {
    font-size: clamp(0.8rem, 4vw, 1rem);
    margin-bottom: 1rem;
    padding: 0 0.5rem;
  }
`;

const CodeBlock = styled(motion.div)`
  background: rgba(0, 0, 0, 0.6);
  border-radius: 15px;
  padding: 2rem;
  font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
  font-size: 0.9rem;
  border: 2px solid rgba(78, 205, 196, 0.3);
  margin: 2rem 0;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    padding: 1.5rem;
    font-size: 0.8rem;
    margin: 1.5rem 0;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    font-size: 0.7rem;
    margin: 1rem 0;
    border-radius: 10px;
    overflow-x: auto;
  }

  &::before {
    content: '// developer.js';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background: linear-gradient(90deg, rgba(78, 205, 196, 0.2), rgba(78, 205, 196, 0.1));
    padding: 0.8rem 2rem;
    font-size: 0.8rem;
    opacity: 0.9;
    border-bottom: 1px solid rgba(78, 205, 196, 0.2);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, #4ecdc4, #ff6b6b, #ffeaa7, #4ecdc4);
    background-size: 200% 100%;
    animation: rainbow 3s linear infinite;
  }

  @keyframes rainbow {
    0% { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
  }
`;

const CodeLine = styled.div`
  margin: 0.5rem 0;
  padding-top: 2rem;

  &:first-child {
    padding-top: 2rem;
  }
`;

const InteractiveSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const Terminal = styled(motion.div)`
  background: linear-gradient(145deg, #1e1e1e, #2a2a2a);
  border-radius: 15px;
  padding: 1.5rem;
  width: 100%;
  max-width: 450px;
  font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
  border: 2px solid #4ecdc4;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 0 20px rgba(78, 205, 196, 0.3);
  position: relative;
  transform-style: preserve-3d;

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 1rem;
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    padding: 0.8rem;
    font-size: 0.7rem;
    border-radius: 10px;
  }

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #4ecdc4, #ff6b6b, #ffeaa7, #4ecdc4);
    background-size: 300% 300%;
    border-radius: inherit;
    z-index: -1;
    animation: borderGlow 3s ease-in-out infinite;
  }

  @keyframes borderGlow {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
`;

const TerminalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const TerminalButton = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color};
`;

const TerminalContent = styled.div`
  color: #00ff41;
  font-size: 0.9rem;
  line-height: 1.6;
`;

const CommandButton = styled(motion.button)`
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border: none;
  color: white;
  padding: 1rem 2rem;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
  margin: 0.5rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 0.8rem 1.5rem;
    font-size: 0.9rem;
    margin: 0.3rem;
  }

  @media (max-width: 480px) {
    padding: 0.7rem 1.2rem;
    font-size: 0.8rem;
    margin: 0.2rem;
    border-radius: 20px;
  }

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

  &:hover {
    box-shadow: 0 6px 20px rgba(78, 205, 196, 0.4);
    transform: translateY(-2px);
  }

  &:hover::before {
    left: 100%;
  }
`;

const commands = [
  {
    cmd: "emal --info",
    output: "Name: Emal\nRole: Full-Stack Developer\nStatus: Caffeinated and Ready to Code\nFavorite Bug: The ones that fix themselves overnight"
  },
  {
    cmd: "emal --hobbies",
    output: "🎮 Gaming (when code compiles successfully)\n☕ Coffee consumption expert\n🔧 Breaking things to learn how they work\n📚 Reading Stack Overflow religiously"
  },
  {
    cmd: "emal --philosophy",
    output: "\"Code is like humor. When you have to explain it, it's bad.\"\n\"There are only 10 types of people: those who understand binary and those who don't.\""
  },
  {
    cmd: "emal --current-mood",
    output: "console.log('Excited to build awesome things!');\n// TODO: Figure out why CSS is being CSS again\n// NOTE: Remember to actually test on production"
  }
];

export const AboutSection: React.FC = () => {
  const [, setCurrentCommand] = useState(0);
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "Welcome to EMAL.DEV Terminal v2.0",
    "Type a command or click the buttons below...",
    ""
  ]);

  const executeCommand = (commandIndex: number) => {
    const command = commands[commandIndex];
    setTerminalHistory(prev => [
      ...prev,
      `$ ${command.cmd}`,
      command.output,
      ""
    ]);
    setCurrentCommand(commandIndex);
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse tracking for 3D effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [10, -10]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-10, 10]), { stiffness: 100, damping: 30 });

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
    <AboutContainer id="about" ref={containerRef}>
      {/* Floating cursor effect */}
      <motion.div
        style={{
          position: 'absolute',
          left: mousePosition.x - 30,
          top: mousePosition.y - 30,
          width: 60,
          height: 60,
          background: 'radial-gradient(circle, rgba(78, 205, 196, 0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(10px)',
          pointerEvents: 'none',
          zIndex: 1
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <ContentWrapper>
        <TextSection>
          <Title
            initial={{ opacity: 0, x: -50, rotateY: 20 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{
              rotateX: useTransform(rotateX, value => value * 0.2),
              rotateY: useTransform(rotateY, value => value * 0.2)
            }}
          >
            cat about.md 📁
          </Title>

          <Description
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Hey there! 👋 I'm Emal, a 3rd-year Software Development student at Eindhoven, Netherlands. I speak fluent PHP, JavaScript, and React, with some Python and C# on the side (and currently learning more languages because the curriculum demands it and I'm slightly addicted to syntax highlighting).

            When I'm not cramming for exams, debugging CSS at 3 AM for assignments, explaining to professors why my code works perfectly on my machine but crashes on their ancient lab computers, or having existential crises about whether tabs or spaces are superior, I'm crafting digital projects that hopefully don't make my classmates want to throw their devices out the window.
          </Description>

          <CodeBlock
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <CodeLine>
              <span style={{ color: '#ff6b6b' }}>const</span>{' '}
              <span style={{ color: '#4ecdc4' }}>developer</span> = {'{'}
            </CodeLine>
            <CodeLine style={{ marginLeft: '2rem' }}>
              <span style={{ color: '#ffeaa7' }}>name</span>: <span style={{ color: '#a8e6cf' }}>'Emal Karwal'</span>,
            </CodeLine>
            <CodeLine style={{ marginLeft: '2rem' }}>
              <span style={{ color: '#ffeaa7' }}>university</span>: <span style={{ color: '#a8e6cf' }}>'Eindhoven, Netherlands'</span>,
            </CodeLine>
            <CodeLine style={{ marginLeft: '2rem' }}>
              <span style={{ color: '#ffeaa7' }}>year</span>: <span style={{ color: '#a8e6cf' }}>'3rd Year Software Development'</span>,
            </CodeLine>
            <CodeLine style={{ marginLeft: '2rem' }}>
              <span style={{ color: '#ffeaa7' }}>skills</span>: [<span style={{ color: '#a8e6cf' }}>'PHP', 'Laravel', 'React', 'JS', 'Python', 'C#'</span>],
            </CodeLine>
            <CodeLine style={{ marginLeft: '2rem' }}>
              <span style={{ color: '#ffeaa7' }}>passion</span>: <span style={{ color: '#a8e6cf' }}>'Learning & Building cool projects'</span>,
            </CodeLine>
            <CodeLine style={{ marginLeft: '2rem' }}>
              <span style={{ color: '#ffeaa7' }}>currentStatus</span>: <span style={{ color: '#a8e6cf' }}>'Open to internships & collaborations!'</span>
            </CodeLine>
            <CodeLine>{'};'}</CodeLine>
          </CodeBlock>

          <Description
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            I have this weird obsession with turning complex assignment requirements into simple, elegant solutions that actually pass the unit tests (most of the time). Whether it's building a Laravel project that survives the professor's edge case testing, or creating React components that make my study group members smile instead of cry during group projects, I'm always up for the academic challenge!

            Fun fact: I measure my success by the number of "How did you even...?" comments from classmates during code reviews. Current record: 8 confused faces in one group presentation. 🎓
          </Description>
        </TextSection>

        <InteractiveSection>
          <Terminal
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <TerminalHeader>
              <TerminalButton color="#ff5f56" />
              <TerminalButton color="#ffbd2e" />
              <TerminalButton color="#27ca3f" />
              <span style={{ marginLeft: '1rem', fontSize: '0.8rem', opacity: 0.7 }}>
                emal@dev:~$
              </span>
            </TerminalHeader>

            <TerminalContent>
              <AnimatePresence>
                {terminalHistory.map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {line}
                  </motion.div>
                ))}
              </AnimatePresence>
            </TerminalContent>
          </Terminal>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {commands.map((command, index) => (
              <CommandButton
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => executeCommand(index)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                viewport={{ once: true }}
              >
                {command.cmd}
              </CommandButton>
            ))}
          </div>
        </InteractiveSection>
      </ContentWrapper>
    </AboutContainer>
  );
};