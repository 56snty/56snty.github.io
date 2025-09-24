import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { useTheme } from '../ThemeProvider';

const NavContainer = styled(motion.nav)<{ isScrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 2rem;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.isScrolled
      ? 'rgba(15, 15, 35, 0.9)'
      : 'transparent'};
    backdrop-filter: ${props => props.isScrolled ? 'blur(20px)' : 'none'};
    border-bottom: ${props => props.isScrolled
      ? '1px solid rgba(78, 205, 196, 0.2)'
      : 'none'};
    border-radius: ${props => props.isScrolled ? '0 0 20px 20px' : '0'};
    box-shadow: ${props => props.isScrolled
      ? '0 8px 32px rgba(0, 0, 0, 0.3)'
      : 'none'};
  }
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

const Logo = styled(motion.div)`
  font-size: 1.8rem;
  font-weight: 900;
  background: linear-gradient(135deg, #4ecdc4, #ff6b6b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  cursor: pointer;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #4ecdc4, #ff6b6b);
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(motion.a)<{ isActive?: boolean }>`
  color: ${props => props.isActive ? '#4ecdc4' : 'rgba(255, 255, 255, 0.8)'};
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
  backdrop-filter: blur(10px);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.isActive
      ? 'rgba(78, 205, 196, 0.1)'
      : 'transparent'};
    border-radius: inherit;
    transition: all 0.3s ease;
  }

  &:hover {
    color: #4ecdc4;
    transform: translateY(-2px);

    &::before {
      background: rgba(78, 205, 196, 0.1);
      box-shadow: 0 5px 15px rgba(78, 205, 196, 0.2);
    }
  }
`;

const MobileMenuButton = styled(motion.button)`
  display: none;
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 2rem;
  right: 2rem;
  background: rgba(15, 15, 35, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 15px;
  border: 1px solid rgba(78, 205, 196, 0.2);
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const MobileNavLink = styled(motion.a)<{ isActive?: boolean }>`
  display: block;
  color: ${props => props.isActive ? '#4ecdc4' : 'rgba(255, 255, 255, 0.8)'};
  text-decoration: none;
  font-weight: 500;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;

  &:hover {
    color: #4ecdc4;
    background: rgba(78, 205, 196, 0.1);
    transform: translateX(5px);
  }

  &::before {
    content: '→';
    position: absolute;
    left: 0.5rem;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const ThemeToggle = styled(motion.button)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(78, 205, 196, 0.3);
  color: white;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(78, 205, 196, 0.2);
    transform: rotate(180deg) scale(1.1);
    box-shadow: 0 5px 15px rgba(78, 205, 196, 0.3);
  }
`;

const ProgressBar = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #4ecdc4, #ff6b6b, #ffeaa7);
  transform-origin: left;
`;

interface NavItem {
  name: string;
  href: string;
  icon?: string;
}

const navItems: NavItem[] = [
  { name: 'Home', href: '#home', icon: '🏠' },
  { name: 'About', href: '#about', icon: '👨‍💻' },
  { name: 'Skills', href: '#skills', icon: '⚡' },
  { name: 'Portfolio', href: '#portfolio', icon: '🎨' },
  { name: 'Contact', href: '#contact', icon: '📧' },
];

export const EnhancedNavigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleSectionChange = () => {
      const sections = ['home', 'about', 'skills', 'portfolio', 'contact'];
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleSectionChange);
    handleScroll();
    handleSectionChange();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleSectionChange);
    };
  }, []);

  const scrollToSection = (href: string) => {
    const section = href.replace('#', '');
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <NavContainer
      isScrolled={isScrolled}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <NavContent>
        <Logo
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTop}
        >
          EK.dev
        </Logo>

        <NavLinks>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              isActive={activeSection === item.href.replace('#', '')}
              onClick={() => scrollToSection(item.href)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span style={{ marginRight: '0.5rem' }}>{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </NavLinks>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ThemeToggle
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{ rotate: theme.isDark ? 0 : 180 }}
          >
            {theme.isDark ? '🌙' : '☀️'}
          </ThemeToggle>

          <MobileMenuButton
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={{ rotate: isMobileMenuOpen ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </motion.div>
          </MobileMenuButton>
        </div>
      </NavContent>

      <ProgressBar
        style={{
          scaleX: scrollYProgress
        }}
      />

      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {navItems.map((item, index) => (
              <MobileNavLink
                key={item.name}
                isActive={activeSection === item.href.replace('#', '')}
                onClick={() => scrollToSection(item.href)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span style={{ marginRight: '1rem' }}>{item.icon}</span>
                {item.name}
              </MobileNavLink>
            ))}
          </MobileMenu>
        )}
      </AnimatePresence>
    </NavContainer>
  );
};