import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const FooterContainer = styled.footer`
  background: linear-gradient(135deg, #000 0%, #1a1a2e 100%);
  padding: 3rem 2rem 2rem;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const FunnyQuotes = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const QuoteCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 1.5rem;
  border-left: 4px solid #4ecdc4;
  font-style: italic;
  opacity: 0.8;
`;

const Copyright = styled.div`
  font-size: 0.9rem;
  opacity: 0.6;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 2rem;
  margin-top: 2rem;
`;

const TechStack = styled.div`
  font-size: 0.8rem;
  opacity: 0.5;
  margin-top: 1rem;
`;

const EasterEgg = styled(motion.div)`
  font-size: 0.7rem;
  opacity: 0.3;
  margin-top: 0.5rem;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const quotes = [
  "\"99 little bugs in the code, 99 little bugs. Take one down, patch it around, 127 little bugs in the code...\"",
  "\"It's not a bug, it's a feature request from the universe.\"",
  "\"I don't always test my code, but when I do, I do it in production.\"",
  "\"There are only two hard things in Computer Science: cache invalidation and naming things... and off-by-one errors.\""
];

export const Footer: React.FC = () => {
  const handleEasterEgg = () => {
    alert("🎉 You found the easter egg! Fun fact: This portfolio was built with approximately 47 cups of coffee and endless Stack Overflow visits!");
  };

  return (
    <FooterContainer>
      <FooterContent>
        <FunnyQuotes>
          {quotes.map((quote, index) => (
            <QuoteCard
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              {quote}
            </QuoteCard>
          ))}
        </FunnyQuotes>

        <Copyright>
          <div>
            © {new Date().getFullYear()} Emal.dev - Built with ☕, 💻, and an unhealthy amount of Stack Overflow
          </div>
          <TechStack>
            Powered by React, TypeScript, Styled Components, Framer Motion, and lots of debugging sessions
          </TechStack>
          <EasterEgg
            onClick={handleEasterEgg}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {"// Click here if you're bored"}
          </EasterEgg>
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
};