import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { GradientText, GlassCard } from '../styles/GlobalStyles';
import { useIntersectionObserver } from '../hooks/useParallax';

const ContactContainer = styled.section`
  min-height: 100vh;
  padding: 5rem 0;
  position: relative;
  background: linear-gradient(135deg,
    rgba(255, 107, 107, 0.05) 0%,
    rgba(78, 205, 196, 0.05) 50%,
    rgba(156, 39, 176, 0.05) 100%),
    url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80') center/cover;
  background-attachment: fixed;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(2px);
  }
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
  align-items: start;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const LeftSection = styled.div``;

const Title = styled(motion.h2)`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  margin-bottom: 2rem;
  line-height: 1.1;
`;

const Description = styled(motion.p)`
  font-size: 1.2rem;
  line-height: 1.8;
  margin-bottom: 3rem;
  opacity: 0.9;
`;

const ContactInfo = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ContactItemBase = `
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateX(10px);
  }
`;

const ContactItem = styled(motion.div)`${ContactItemBase}`;
const ContactItemLink = styled(motion.a)`${ContactItemBase}`;

const ContactIcon = styled.div`
  font-size: 1.5rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ContactDetails = styled.div`
  flex: 1;
`;

const ContactLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.7;
  margin-bottom: 0.2rem;
`;

const ContactValue = styled.div`
  font-weight: 600;
  color: #4ecdc4;
`;

const FormSection = styled(GlassCard)`
  padding: 2.5rem;
`;

const Form = styled(motion.form)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #4ecdc4;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Input = styled(motion.input)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 1rem;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4ecdc4;
    background: rgba(255, 255, 255, 0.08);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const TextArea = styled(motion.textarea)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 1rem;
  color: #fff;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4ecdc4;
    background: rgba(255, 255, 255, 0.08);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const SubmitButton = styled(motion.button)`
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border: none;
  padding: 1rem 2rem;
  border-radius: 10px;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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

  &:hover:not(:disabled)::before {
    left: 100%;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
  }
`;

const SocialLinks = styled(motion.div)`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const SocialLink = styled(motion.a)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px) scale(1.1);
    box-shadow: 0 10px 20px rgba(255, 107, 107, 0.3);
  }
`;

const FloatingParticles = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
`;

const Particle = styled(motion.div)<{ size: number; delay: number }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  background: linear-gradient(45deg, rgba(255, 107, 107, 0.3), rgba(78, 205, 196, 0.3));
  filter: blur(1px);
`;

const contactInfo = [
  {
    icon: '📧',
    label: 'Email',
    value: 'hello@digitalartist.com',
    href: 'mailto:hello@digitalartist.com'
  },
  {
    icon: '📱',
    label: 'Phone',
    value: '+1 (555) 123-4567',
    href: 'tel:+15551234567'
  },
  {
    icon: '📍',
    label: 'Location',
    value: 'San Francisco, CA',
    href: '#'
  }
];

const socialLinks = [
  { icon: '🐦', href: '#', label: 'Twitter' },
  { icon: '📷', href: '#', label: 'Instagram' },
  { icon: '💼', href: '#', label: 'LinkedIn' },
  { icon: '🎨', href: '#', label: 'Behance' }
];

export const ContactSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isVisible = useIntersectionObserver(containerRef, { threshold: 0.3 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    alert('Message sent successfully!');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 10,
    x: Math.random() * 100,
    y: Math.random() * 100
  }));

  return (
    <ContactContainer ref={containerRef} id="contact">
      <FloatingParticles>
        {particles.map(particle => (
          <Particle
            key={particle.id}
            size={particle.size}
            delay={particle.delay}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + particle.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </FloatingParticles>

      <Content>
        <Grid>
          <LeftSection>
            <Title
              initial={{ opacity: 0, x: -100 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              Let's Create
              <br />
              <GradientText>Something Amazing</GradientText>
            </Title>

            <Description
              initial={{ opacity: 0, x: -50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
            >
              Ready to bring your digital vision to life? Let's collaborate on your next
              project and create something truly extraordinary together.
            </Description>

            <ContactInfo
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
            >
              {contactInfo.map((item, index) => {
                const itemProps = {
                  initial: { opacity: 0, x: -50 },
                  animate: isVisible ? { opacity: 1, x: 0 } : {},
                  transition: { duration: 0.8, delay: 0.6 + index * 0.1 },
                  whileHover: { scale: 1.02 }
                };

                return item.href !== '#' ? (
                  <ContactItemLink
                    key={index}
                    {...itemProps}
                    href={item.href}
                  >
                    <ContactIcon>{item.icon}</ContactIcon>
                    <ContactDetails>
                      <ContactLabel>{item.label}</ContactLabel>
                      <ContactValue>{item.value}</ContactValue>
                    </ContactDetails>
                  </ContactItemLink>
                ) : (
                  <ContactItem
                    key={index}
                    {...itemProps}
                  >
                    <ContactIcon>{item.icon}</ContactIcon>
                    <ContactDetails>
                      <ContactLabel>{item.label}</ContactLabel>
                      <ContactValue>{item.value}</ContactValue>
                    </ContactDetails>
                  </ContactItem>
                );
              })}
            </ContactInfo>

            <SocialLinks
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 1, ease: 'easeOut' }}
            >
              {socialLinks.map((social, index) => (
                <SocialLink
                  key={index}
                  href={social.href}
                  title={social.label}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {social.icon}
                </SocialLink>
              ))}
            </SocialLinks>
          </LeftSection>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          >
            <FormSection>
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                    whileFocus={{ scale: 1.02 }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                    whileFocus={{ scale: 1.02 }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Project inquiry"
                    required
                    whileFocus={{ scale: 1.02 }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="message">Message</Label>
                  <TextArea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project..."
                    required
                    whileFocus={{ scale: 1.02 }}
                  />
                </FormGroup>

                <SubmitButton
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </SubmitButton>
              </Form>
            </FormSection>
          </motion.div>
        </Grid>
      </Content>
    </ContactContainer>
  );
};