import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { GradientText } from '../styles/GlobalStyles';
import { useIntersectionObserver } from '../hooks/useParallax';

const WorkContainer = styled.section`
  min-height: 100vh;
  padding: 5rem 0;
  position: relative;
  background: radial-gradient(circle at 70% 30%, rgba(255, 107, 107, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 30% 70%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
              #000;
`;

const Content = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const Title = styled(motion.h2)`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  text-align: center;
  margin-bottom: 4rem;
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const ProjectCard = styled(motion.div)`
  position: relative;
  height: 400px;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  padding: 3px;

  &:hover .overlay {
    opacity: 1;
  }
`;

const ProjectImage = styled.div<{ bg: string }>`
  width: 100%;
  height: 100%;
  background: url(${props => props.bg}) center/cover;
  border-radius: 17px;
  position: relative;
`;

const ProjectOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.8), rgba(0,0,0,0.6));
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 17px;
`;

const ProjectTitle = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #fff;
`;

const ProjectDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const ProjectTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 2rem;
`;

const Tag = styled.span`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const ViewButton = styled(motion.button)`
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 25px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(255, 107, 107, 0.3);
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const ModalContent = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const ModalImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 2rem;
`;

const FilterButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
`;

const FilterButton = styled(motion.button)<{ active: boolean }>`
  background: ${props => props.active
    ? 'linear-gradient(45deg, #ff6b6b, #4ecdc4)'
    : 'rgba(255, 255, 255, 0.1)'};
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active
      ? 'linear-gradient(45deg, #ff5252, #26a69a)'
      : 'rgba(255, 255, 255, 0.2)'};
  }
`;

const projects = [
  {
    id: 1,
    title: 'Immersive 3D Gallery',
    description: 'An interactive 3D art gallery showcasing digital sculptures and installations.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    tags: ['Three.js', 'WebGL', 'React', 'Blender'],
    category: '3d',
    details: 'A fully immersive 3D gallery experience built with Three.js and React. Features include real-time lighting, physics simulations, and interactive art pieces that respond to user input.'
  },
  {
    id: 2,
    title: 'Generative Art Engine',
    description: 'AI-powered platform for creating unique digital artworks using machine learning.',
    image: 'https://images.unsplash.com/photo-1617791160588-241658c0f566?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    tags: ['Python', 'TensorFlow', 'React', 'API'],
    category: 'ai',
    details: 'An innovative platform that uses neural networks to generate unique digital artworks. Users can input parameters and watch as AI creates stunning visual compositions in real-time.'
  },
  {
    id: 3,
    title: 'Interactive Data Visualization',
    description: 'Dynamic dashboard transforming complex data into beautiful, interactive visuals.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    tags: ['D3.js', 'React', 'WebGL', 'TypeScript'],
    category: 'web',
    details: 'A comprehensive data visualization platform that transforms complex datasets into intuitive, interactive visual stories. Features real-time updates and responsive design.'
  },
  {
    id: 4,
    title: 'Virtual Reality Experience',
    description: 'Immersive VR application for exploring abstract digital landscapes.',
    image: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc696?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    tags: ['Unity', 'C#', 'VR', 'Oculus'],
    category: 'vr',
    details: 'A breathtaking VR experience that takes users through procedurally generated abstract landscapes. Built with Unity and optimized for Oculus devices.'
  },
  {
    id: 5,
    title: 'Motion Graphics Portfolio',
    description: 'Collection of animated graphics and visual effects for digital media.',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    tags: ['After Effects', 'Cinema 4D', 'Lottie', 'SVG'],
    category: 'motion',
    details: 'A showcase of motion graphics work including brand animations, explainer videos, and interactive web animations. Created using industry-standard tools and exported for web.'
  },
  {
    id: 6,
    title: 'Augmented Reality App',
    description: 'AR application that overlays digital art onto real-world environments.',
    image: 'https://images.unsplash.com/photo-1622609767103-de8f8fabb2d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    tags: ['ARKit', 'Swift', 'Unity', 'iOS'],
    category: 'ar',
    details: 'An innovative AR app that allows users to place and interact with digital art pieces in their real environment. Features include object tracking and realistic lighting.'
  }
];

const categories = [
  { key: 'all', label: 'All Projects' },
  { key: '3d', label: '3D & WebGL' },
  { key: 'web', label: 'Web Apps' },
  { key: 'ai', label: 'AI & ML' },
  { key: 'vr', label: 'Virtual Reality' },
  { key: 'ar', label: 'Augmented Reality' },
  { key: 'motion', label: 'Motion Graphics' }
];

export const WorkSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const isVisible = useIntersectionObserver(containerRef, { threshold: 0.3 });

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(project => project.category === activeFilter);

  return (
    <WorkContainer ref={containerRef} id="work">
      <Content>
        <Title
          initial={{ opacity: 0, y: 100 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          Featured <GradientText>Projects</GradientText>
        </Title>

        <FilterButtons>
          {categories.map((category, index) => (
            <FilterButton
              key={category.key}
              active={activeFilter === category.key}
              onClick={() => setActiveFilter(category.key)}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.label}
            </FilterButton>
          ))}
        </FilterButtons>

        <ProjectGrid>
          <AnimatePresence mode="wait">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedProject(project)}
              >
                <ProjectImage bg={project.image}>
                  <ProjectOverlay className="overlay">
                    <ProjectTitle>{project.title}</ProjectTitle>
                    <ProjectDescription>{project.description}</ProjectDescription>
                    <ProjectTags>
                      {project.tags.map((tag, tagIndex) => (
                        <Tag key={tagIndex}>{tag}</Tag>
                      ))}
                    </ProjectTags>
                    <ViewButton
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      View Details
                    </ViewButton>
                  </ProjectOverlay>
                </ProjectImage>
              </ProjectCard>
            ))}
          </AnimatePresence>
        </ProjectGrid>
      </Content>

      <AnimatePresence>
        {selectedProject && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <ModalContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <CloseButton
                onClick={() => setSelectedProject(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ×
              </CloseButton>

              <ModalImage src={selectedProject.image} alt={selectedProject.title} />

              <ProjectTitle>{selectedProject.title}</ProjectTitle>
              <ProjectDescription>{selectedProject.details}</ProjectDescription>

              <ProjectTags>
                {selectedProject.tags.map((tag, index) => (
                  <Tag key={index}>{tag}</Tag>
                ))}
              </ProjectTags>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </WorkContainer>
  );
};