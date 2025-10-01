import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const ContactContainer = styled.section`
  min-height: 100vh;
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #16213e 0%, #0f3460 50%, #1a1a2e 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 4rem 1rem;
    min-height: auto;
  }

  @media (max-width: 480px) {
    padding: 3rem 0.5rem;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 20% 30%, rgba(78, 205, 196, 0.1) 0%, transparent 40%),
      radial-gradient(circle at 80% 70%, rgba(255, 107, 107, 0.1) 0%, transparent 40%);
    animation: contactFloat 15s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes contactFloat {
    0%, 100% { transform: rotate(0deg) scale(1); }
    50% { transform: rotate(180deg) scale(1.1); }
  }
`;

const Title = styled(motion.h2)`
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 900;
  background: linear-gradient(135deg, #4ecdc4, #ff6b6b, #ffeaa7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  text-align: center;
  position: relative;
  z-index: 2;
  line-height: 1.1;
  word-break: break-word;

  @media (max-width: 768px) {
    font-size: clamp(2rem, 10vw, 3.5rem);
    margin-bottom: 0.8rem;
  }

  @media (max-width: 480px) {
    font-size: clamp(1.8rem, 8vw, 2.5rem);
    margin-bottom: 0.5rem;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 4px;
    background: linear-gradient(90deg, #4ecdc4, #ff6b6b, #ffeaa7);
    border-radius: 2px;
    animation: gradientShift 3s ease-in-out infinite;
  }

  @keyframes gradientShift {
    0%, 100% { filter: hue-rotate(0deg); }
    50% { filter: hue-rotate(60deg); }
  }
`;

const Subtitle = styled(motion.p)`
  font-size: clamp(1rem, 3vw, 1.4rem);
  text-align: center;
  opacity: 0.9;
  margin-bottom: 3rem;
  max-width: 700px;
  line-height: 1.6;
  position: relative;
  z-index: 2;
  padding: 0 1rem;

  @media (max-width: 768px) {
    font-size: clamp(0.9rem, 4vw, 1.2rem);
    margin-bottom: 2rem;
    max-width: 100%;
  }

  @media (max-width: 480px) {
    font-size: clamp(0.8rem, 4vw, 1rem);
    margin-bottom: 1.5rem;
    line-height: 1.5;
  }
`;

const ContactWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6rem;
  max-width: 1200px;
  width: 100%;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 3rem;
    padding: 0 1rem;
  }

  @media (max-width: 480px) {
    gap: 2rem;
    padding: 0 0.5rem;
  }
`;

const ContactMethods = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ContactCard = styled(motion.div)`
  background: rgba(15, 15, 35, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  border: 2px solid rgba(78, 205, 196, 0.2);
  position: relative;
  overflow: hidden;
  cursor: pointer;

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 15px;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 12px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(78, 205, 196, 0.05) 0%, transparent 50%, rgba(255, 107, 107, 0.05) 100%);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, transparent, rgba(78, 205, 196, 0.3), transparent);
    border-radius: inherit;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::after {
    opacity: 1;
  }
`;

const ContactIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: rgba(78, 205, 196, 0.1);
  border-radius: 15px;
  border: 1px solid rgba(78, 205, 196, 0.3);

  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
    font-size: 2rem;
  }
`;

const ContactTitle = styled.h3`
  font-size: clamp(1.1rem, 3vw, 1.4rem);
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #4ecdc4;
`;

const ContactValue = styled.p`
  font-size: clamp(0.9rem, 2.5vw, 1rem);
  opacity: 0.8;
  margin-bottom: 1rem;
  word-break: break-all;

  @media (max-width: 480px) {
    word-break: break-word;
  }
`;

const ContactDescription = styled.p`
  font-size: clamp(0.8rem, 2vw, 0.9rem);
  opacity: 0.6;
  line-height: 1.5;
  font-style: italic;
`;

const MessageForm = styled(motion.form)`
  background: rgba(15, 15, 35, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 3rem;
  border: 2px solid rgba(78, 205, 196, 0.2);
  position: relative;
  overflow: hidden;

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
    background: linear-gradient(135deg, rgba(78, 205, 196, 0.02) 0%, rgba(255, 107, 107, 0.02) 100%);
    pointer-events: none;
  }
`;

const FormTitle = styled.h3`
  font-size: clamp(1.4rem, 4vw, 1.8rem);
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
  color: #4ecdc4;

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }

  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 2rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
`;

const FormInput = styled(motion.input)`
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(78, 205, 196, 0.3);
  border-radius: 10px;
  color: white;
  font-size: 1rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  @media (max-width: 480px) {
    padding: 0.8rem;
    font-size: 16px;
  }

  &:focus {
    outline: none;
    border-color: #4ecdc4;
    box-shadow: 0 0 20px rgba(78, 205, 196, 0.3);
    background: rgba(255, 255, 255, 0.08);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const FormTextarea = styled(motion.textarea)`
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(78, 205, 196, 0.3);
  border-radius: 10px;
  color: white;
  font-size: 1rem;
  backdrop-filter: blur(10px);
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  transition: all 0.3s ease;

  @media (max-width: 480px) {
    padding: 0.8rem;
    font-size: 16px;
    min-height: 100px;
  }

  &:focus {
    outline: none;
    border-color: #4ecdc4;
    box-shadow: 0 0 20px rgba(78, 205, 196, 0.3);
    background: rgba(255, 255, 255, 0.08);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 1.2rem 2rem;
  background: linear-gradient(135deg, #4ecdc4, #ff6b6b);
  border: none;
  border-radius: 15px;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin-top: 1rem;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const FloatingElement = styled(motion.div)<{
  top: string;
  left: string;
  size: number;
}>`
  position: absolute;
  top: ${props => props.top};
  left: ${props => props.left};
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: rgba(78, 205, 196, 0.1);
  border: 1px solid rgba(78, 205, 196, 0.3);
  border-radius: 50%;
  pointer-events: none;
`;

const SuccessMessage = styled(motion.div)`
  background: rgba(78, 205, 196, 0.1);
  border: 2px solid rgba(78, 205, 196, 0.5);
  border-radius: 15px;
  padding: 1.5rem;
  text-align: center;
  color: #4ecdc4;
  font-weight: 600;
  backdrop-filter: blur(10px);
`;

const contactMethods = [
  {
    icon: '📧',
    title: 'Email Me',
    value: 'ek56351@gmail.com',
    description: 'Drop me a line! I usually respond within 24 hours (unless I\'m debugging something really stubborn).'
  },
  {
    icon: '🐱',
    title: 'GitHub',
    value: 'github.com/56snty',
    description: 'Check out my code repositories and see what I\'ve been working on lately!'
  },
  {
    icon: '📱',
    title: 'Phone',
    value: '+31 6 XXXX XXXX',
    description: 'Available for calls about internship opportunities and collaborations.'
  }
];

export const SpectacularContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [20, -20]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setShowSuccess(true);
    setFormData({ name: '', email: '', subject: '', message: '' });

    setTimeout(() => setShowSuccess(false), 5000);
  };

  const floatingElements = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 40 + 20
  }));

  return (
    <ContactContainer ref={containerRef} id="contact">
      {/* Floating Background Elements */}
      {floatingElements.map(element => (
        <FloatingElement
          key={element.id}
          top={element.top}
          left={element.left}
          size={element.size}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 8 + element.id,
            repeat: Infinity,
            ease: "easeInOut",
            delay: element.id * 0.5
          }}
        />
      ))}

      <Title
        initial={{ opacity: 0, y: 50, rotateX: 30 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        style={{ y: useTransform(y, (value) => `${(value as number) * 0.2}px`) }}
      >
        Let's Create Something Amazing Together! 🚀
      </Title>

      <Subtitle
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        viewport={{ once: true }}
      >
        Ready for an internship opportunity? Have a cool project in mind?
        Or just want to chat about code and coffee? I'd love to hear from you!
      </Subtitle>

      <ContactWrapper>
        <ContactMethods>
          {contactMethods.map((method, index) => (
            <ContactCard
              key={index}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.05,
                rotateY: 5,
                z: 20
              }}
              whileTap={{ scale: 0.98 }}
            >
              <ContactIcon>{method.icon}</ContactIcon>
              <ContactTitle>{method.title}</ContactTitle>
              <ContactValue>{method.value}</ContactValue>
              <ContactDescription>{method.description}</ContactDescription>
            </ContactCard>
          ))}
        </ContactMethods>

        <MessageForm
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
        >
          <FormTitle>Send Me a Message 💌</FormTitle>

          <AnimatePresence>
            {showSuccess ? (
              <SuccessMessage
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                🎉 Message sent successfully! I'll get back to you soon!
              </SuccessMessage>
            ) : (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <FormGroup>
                  <FormLabel htmlFor="name">Your Name</FormLabel>
                  <FormInput
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                    whileFocus={{ scale: 1.02 }}
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="email">Email Address</FormLabel>
                  <FormInput
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@company.com"
                    required
                    whileFocus={{ scale: 1.02 }}
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="subject">Subject</FormLabel>
                  <FormInput
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Internship Opportunity / Project Collaboration"
                    required
                    whileFocus={{ scale: 1.02 }}
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="message">Message</FormLabel>
                  <FormTextarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell me about the opportunity, project, or just say hi! I'm excited to hear from you..."
                    required
                    whileFocus={{ scale: 1.02 }}
                  />
                </FormGroup>

                <SubmitButton
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(78, 205, 196, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? 'Sending Magic ✨' : 'Send Message 🚀'}
                </SubmitButton>
              </motion.div>
            )}
          </AnimatePresence>
        </MessageForm>
      </ContactWrapper>
    </ContactContainer>
  );
};