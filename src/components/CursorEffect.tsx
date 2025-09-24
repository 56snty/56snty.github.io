import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const CursorContainer = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: ${props => props.isVisible ? 1 : 0};
  transition: opacity 0.3s ease;

  @media (max-width: 768px) {
    display: none;
  }
`;

const CursorDot = styled(motion.div)<{ x: number; y: number }>`
  position: absolute;
  width: 6px;
  height: 6px;
  background: #4ecdc4;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  box-shadow: 0 0 10px rgba(78, 205, 196, 0.6);
`;

const CursorRing = styled(motion.div)<{ x: number; y: number; isHovering: boolean }>`
  position: absolute;
  width: ${props => props.isHovering ? '40px' : '24px'};
  height: ${props => props.isHovering ? '40px' : '24px'};
  border: 1px solid ${props => props.isHovering ? 'rgba(255, 107, 107, 0.8)' : 'rgba(78, 205, 196, 0.4)'};
  border-radius: 50%;
  transform: translate(-50%, -50%);
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  transition: all 0.2s ease;
`;

export const CursorEffect: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const updateCursor = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      // Clear existing timeout
      clearTimeout(timeoutId);

      // Hide cursor after a delay
      timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.tagName === 'A' ||
                          target.tagName === 'BUTTON' ||
                          !!target.closest('button') ||
                          !!target.closest('a') ||
                          target.style.cursor === 'pointer' ||
                          target.getAttribute('role') === 'button';

      setIsHovering(isInteractive);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsHovering(false);
    };

    // Only add listeners on non-touch devices
    if (window.matchMedia('(pointer: fine)').matches) {
      document.addEventListener('mousemove', updateCursor, { passive: true });
      document.addEventListener('mouseover', handleMouseOver, { passive: true });
      document.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      document.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <CursorContainer isVisible={isVisible}>
      <CursorDot
        x={mousePos.x}
        y={mousePos.y}
        animate={{
          scale: isHovering ? 0.3 : 1,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />

      <CursorRing
        x={mousePos.x}
        y={mousePos.y}
        isHovering={isHovering}
      />
    </CursorContainer>
  );
};