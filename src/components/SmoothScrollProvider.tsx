import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import styled from 'styled-components';

interface SmoothScrollContextType {
  scrollY: number;
  scrollProgress: number;
  isScrolling: boolean;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  scrollY: 0,
  scrollProgress: 0,
  isScrolling: false
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

const ScrollContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  z-index: 1;
`;

const ScrollContent = styled(motion.div)`
  position: relative;
  width: 100%;
`;

const ScrollIndicator = styled(motion.div)`
  position: fixed;
  top: 50%;
  right: 2rem;
  width: 2px;
  height: 200px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1px;
  transform: translateY(-50%);
  z-index: 1000;
`;

const ScrollProgress = styled(motion.div)`
  width: 100%;
  background: linear-gradient(180deg, #4ecdc4 0%, #ff6b6b 50%, #ffeaa7 100%);
  border-radius: 1px;
  transform-origin: top;
`;

const ScrollHint = styled(motion.div)`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  text-align: center;
  z-index: 1000;
  pointer-events: none;
`;

interface SmoothScrollProviderProps {
  children: React.ReactNode;
  speed?: number;
  smoothness?: number;
}

export const SmoothScrollProvider: React.FC<SmoothScrollProviderProps> = ({
  children,
  speed = 1,
  smoothness = 0.1
}) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 100 * speed,
    damping: 30,
    mass: smoothness
  });

  const scrollProgress = useTransform(scrollYProgress, [0, 1], [0, 100]);

  useEffect(() => {
    const updateContentHeight = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight);
      }
    };

    updateContentHeight();
    window.addEventListener('resize', updateContentHeight);

    return () => window.removeEventListener('resize', updateContentHeight);
  }, [children]);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const delta = e.deltaY * speed;
      const maxScroll = contentHeight - window.innerHeight;

      setScrollY(prev => Math.max(0, Math.min(prev + delta, maxScroll)));
      setIsScrolling(true);

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const scrollAmount = window.innerHeight * 0.8;

      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
        case ' ':
          e.preventDefault();
          setScrollY(prev => Math.min(prev + scrollAmount, contentHeight - window.innerHeight));
          break;
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          setScrollY(prev => Math.max(prev - scrollAmount, 0));
          break;
        case 'Home':
          e.preventDefault();
          setScrollY(0);
          break;
        case 'End':
          e.preventDefault();
          setScrollY(contentHeight - window.innerHeight);
          break;
      }
    };

    const handleResize = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight);
      }
    };

    // Smooth scroll to hash links
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          const rect = element.getBoundingClientRect();
          const offsetTop = rect.top + scrollY - window.innerHeight * 0.1;
          setScrollY(Math.max(0, offsetTop));
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    window.addEventListener('hashchange', handleHashChange);

    // Initial hash check
    handleHashChange();

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('hashchange', handleHashChange);
      clearTimeout(scrollTimeout);
    };
  }, [contentHeight, speed, scrollY]);

  const contextValue: SmoothScrollContextType = {
    scrollY,
    scrollProgress: (scrollY / Math.max(contentHeight - window.innerHeight, 1)) * 100,
    isScrolling
  };

  return (
    <SmoothScrollContext.Provider value={contextValue}>
      <ScrollContainer ref={scrollContainerRef}>
        <ScrollContent
          ref={contentRef}
          style={{
            y: useTransform(smoothScrollY, value => -value)
          }}
        >
          {children}
        </ScrollContent>

        {/* Scroll Progress Indicator */}
        <ScrollIndicator>
          <ScrollProgress
            style={{
              scaleY: useTransform(scrollProgress, [0, 100], [0, 1])
            }}
            initial={{ scaleY: 0 }}
          />
        </ScrollIndicator>

        {/* Scroll Hint */}
        <ScrollHint
          initial={{ opacity: 1, y: 0 }}
          animate={{
            opacity: scrollY > 100 ? 0 : 1,
            y: scrollY > 100 ? 20 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            ↓ Scroll to explore
          </motion.div>
        </ScrollHint>

        {/* Scrolling Indicator */}
        <motion.div
          style={{
            position: 'fixed',
            top: '2rem',
            right: '2rem',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#4ecdc4',
            zIndex: 1000,
            boxShadow: '0 0 20px #4ecdc4'
          }}
          animate={{
            scale: isScrolling ? [1, 1.5, 1] : 1,
            opacity: isScrolling ? [0.5, 1, 0.5] : 0.3
          }}
          transition={{
            duration: 0.5,
            repeat: isScrolling ? Infinity : 0,
            ease: "easeInOut"
          }}
        />
      </ScrollContainer>
    </SmoothScrollContext.Provider>
  );
};