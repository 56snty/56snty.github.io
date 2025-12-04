import React, { useEffect, useState, useRef } from 'react';

const chars = "-_~`!@#$%^&*()+=[]{}|;:,.<>?/";

export default function ScrambleText({ children, className, delay = 0 }) {
  const [text, setText] = useState(children);
  const originalText = useRef(children);
  const iteration = useRef(0);
  const interval = useRef(null);

  useEffect(() => {
    // Reset bij nieuwe tekst
    originalText.current = children;
    iteration.current = 0;
    clearInterval(interval.current);

    const startAnimation = () => {
        interval.current = setInterval(() => {
        setText(prev => 
            originalText.current
            .split("")
            .map((letter, index) => {
                if (index < iteration.current) {
                return originalText.current[index];
                }
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );

        if (iteration.current >= originalText.current.length) {
            clearInterval(interval.current);
        }

        iteration.current += 1 / 3; // Snelheid van decoden
        }, 30);
    }

    const timeout = setTimeout(startAnimation, delay * 1000); // Wacht even voor start

    return () => {
        clearInterval(interval.current);
        clearTimeout(timeout);
    };
  }, [children, delay]);

  return <span className={className}>{text}</span>;
}