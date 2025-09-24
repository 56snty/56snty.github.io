import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ContactContainer = styled.section`
  min-height: 100vh;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #16213e 0%, #0f3460 50%, #1a1a2e 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled(motion.h2)`
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #ffeaa7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 2rem;
  text-align: center;
`;

const Subtitle = styled(motion.p)`
  font-size: 1.3rem;
  text-align: center;
  opacity: 0.8;
  margin-bottom: 3rem;
  max-width: 600px;
`;

const ContactWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  max-width: 1000px;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const ContactMethods = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ContactCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 2rem;
  cursor: pointer;
  border: 2px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(78, 205, 196, 0.5);
    transform: translateY(-5px);
  }
`;

const ContactIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const ContactTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #4ecdc4;
`;

const ContactInfo = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 1rem;
`;

const ContactHumor = styled.div`
  font-style: italic;
  opacity: 0.7;
  font-size: 0.9rem;
  background: rgba(0, 0, 0, 0.3);
  padding: 0.8rem;
  border-radius: 8px;
  margin-top: 1rem;
`;

const FunForm = styled(motion.div)`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  padding: 2rem;
  border: 2px solid rgba(78, 205, 196, 0.3);
`;

const FormTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #ff6b6b;
`;

const FormDescription = styled.p`
  font-size: 1rem;
  opacity: 0.8;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const QuickMessage = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(78, 205, 196, 0.5);
  }
`;

const MessageEmoji = styled.span`
  font-size: 1.5rem;
  margin-right: 1rem;
`;

const MessageText = styled.span`
  font-size: 1rem;
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 3rem;
`;

const SocialButton = styled(motion.a)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border-radius: 50%;
  font-size: 1.5rem;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const quickMessages = [
  {
    emoji: "💼",
    text: "Let's build something awesome together!",
    message: "Hey! I saw your portfolio and would love to discuss a potential collaboration. Your skills look impressive!"
  },
  {
    emoji: "☕",
    text: "Want to grab a virtual coffee?",
    message: "Hi Emal! I'd love to chat about development, maybe share some programming stories over a virtual coffee?"
  },
  {
    emoji: "🚀",
    text: "I have a project idea!",
    message: "Hello! I have an exciting project in mind and think your expertise would be perfect. Let's discuss!"
  },
  {
    emoji: "🤝",
    text: "Interested in networking?",
    message: "Hey there! Always looking to connect with fellow developers. Would love to add you to my network!"
  }
];

const contactMethods = [
  {
    icon: "📧",
    title: "Email Me",
    info: "ek56351@gmail.com",
    humor: "I check my email more often than I check if my code works in production. That's saying something.",
    action: "mailto:ek56351@gmail.com"
  },
  {
    icon: "👨‍💻",
    title: "GitHub",
    info: "github.com/56snty",
    humor: "Warning: Contains traces of spaghetti code from my learning days. View at your own risk.",
    action: "https://github.com/56snty"
  }
];

export const ContactSection: React.FC = () => {
  const [, setSelectedMessage] = useState<string | null>(null);

  const handleQuickMessage = (message: string) => {
    setSelectedMessage(message);
    // Here you could integrate with an actual email service
    alert(`Message ready: "${message}"\n\nThis would normally open your email client!`);
  };

  return (
    <ContactContainer id="contact">
      <Title
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        ping me
      </Title>

      <Subtitle
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        Ready to collaborate? Let's create something amazing together!
        Promise I won't reply with just "it works on my machine" 😄
      </Subtitle>

      <ContactWrapper>
        <ContactMethods>
          {contactMethods.map((method, index) => (
            <ContactCard
              key={index}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.open(method.action, '_blank')}
            >
              <ContactIcon>{method.icon}</ContactIcon>
              <ContactTitle>{method.title}</ContactTitle>
              <ContactInfo>{method.info}</ContactInfo>
              <ContactHumor>{method.humor}</ContactHumor>
            </ContactCard>
          ))}
        </ContactMethods>

        <FunForm
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <FormTitle>Quick Message Templates</FormTitle>
          <FormDescription>
            Too lazy to type? I get it. Here are some pre-made conversation starters that won't make us both cringe:
          </FormDescription>

          {quickMessages.map((msg, index) => (
            <QuickMessage
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuickMessage(msg.message)}
            >
              <MessageEmoji>{msg.emoji}</MessageEmoji>
              <MessageText>{msg.text}</MessageText>
            </QuickMessage>
          ))}

          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255, 107, 107, 0.1)', borderRadius: '8px', fontSize: '0.9rem', opacity: 0.8 }}>
            💡 <strong>Pro tip:</strong> Mention your favorite programming language in your message and I'll probably respond 47% faster!
          </div>
        </FunForm>
      </ContactWrapper>

      <SocialLinks>
        <SocialButton
          href="mailto:ek56351@gmail.com"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          whileHover={{ rotate: 360, transition: { type: "spring", stiffness: 300 } }}
        >
          📧
        </SocialButton>
        <SocialButton
          href="https://github.com/56snty"
          target="_blank"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          viewport={{ once: true }}
          whileHover={{ rotate: 360, transition: { type: "spring", stiffness: 300 } }}
        >
          👨‍💻
        </SocialButton>
      </SocialLinks>
    </ContactContainer>
  );
};