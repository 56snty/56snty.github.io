import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';

const GalleryContainer = styled(motion.div)`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const GalleryToggle = styled(motion.button)`
  width: 60px;
  height: 60px;
  border: none;
  border-radius: 50%;
  background: rgba(26, 26, 46, 0.8);
  color: #4ecdc4;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(78, 205, 196, 0.3);
  transition: all 0.3s ease;
  box-shadow: 0 0 20px rgba(78, 205, 196, 0.3);

  &:hover {
    background: rgba(78, 205, 196, 0.2);
    border-color: rgba(78, 205, 196, 0.8);
    box-shadow: 0 0 30px rgba(78, 205, 196, 0.5);
    transform: scale(1.1);
  }
`;

const GalleryPanel = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100vh;
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(25px);
  padding: 20px;
  overflow-y: auto;
  border-left: 1px solid rgba(78, 205, 196, 0.2);
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
`;

const GalleryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-top: 20px;
`;

const GalleryTitle = styled.h2`
  color: white;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
`;

const CloseButton = styled(motion.button)`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;

  &:hover {
    background: rgba(255, 107, 107, 0.8);
  }
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
`;

const ImageCard = styled(motion.div)`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  background: rgba(78, 205, 196, 0.08);
  border: 1px solid rgba(78, 205, 196, 0.2);
  box-shadow: 0 4px 20px rgba(78, 205, 196, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(78, 205, 196, 0.15);
    border-color: rgba(78, 205, 196, 0.6);
    box-shadow: 0 8px 30px rgba(78, 205, 196, 0.2);
    transform: translateY(-4px);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
`;

const ImageInfo = styled.div`
  padding: 15px;
  color: white;
`;

const ImageTitle = styled.h3`
  margin: 0 0 5px 0;
  font-size: 16px;
  font-weight: 600;
`;

const ImageDescription = styled.p`
  margin: 0;
  font-size: 14px;
  opacity: 0.7;
`;

const FullscreenOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const FullscreenImage = styled(motion.img)`
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 10px;
  user-select: none;
`;

const NavigationDots = styled.div`
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10001;
`;

const Dot = styled(motion.button)<{ active: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: ${props => props.active ? '#ff6b6b' : 'rgba(255, 255, 255, 0.5)'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #ff6b6b;
    transform: scale(1.2);
  }
`;

interface ImageData {
  src: string;
  title: string;
  description: string;
}

export const ImageGallery: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const constraintsRef = useRef(null);

  const images: ImageData[] = [
    {
      src: '/images/B background.png',
      title: 'Cosmic Nebula Vista',
      description: 'Deep space nebula formations with stellar phenomena and cosmic dust clouds'
    },
    {
      src: '/images/C background.png',
      title: 'Galactic Horizon',
      description: 'Distant galactic structures creating immersive parallax layers in space'
    }
  ];

  const handleImageClick = (index: number) => {
    setFullscreenIndex(index);
  };

  const closeFullscreen = () => {
    setFullscreenIndex(null);
    setDragOffset({ x: 0, y: 0 });
  };

  const nextImage = () => {
    if (fullscreenIndex !== null) {
      setFullscreenIndex((fullscreenIndex + 1) % images.length);
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const prevImage = () => {
    if (fullscreenIndex !== null) {
      setFullscreenIndex((fullscreenIndex - 1 + images.length) % images.length);
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;

    if (info.offset.x > threshold) {
      prevImage();
    } else if (info.offset.x < -threshold) {
      nextImage();
    } else if (Math.abs(info.offset.y) > threshold || Math.abs(info.offset.x) > 50) {
      closeFullscreen();
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (fullscreenIndex !== null) {
        switch (e.key) {
          case 'ArrowRight':
            nextImage();
            break;
          case 'ArrowLeft':
            prevImage();
            break;
          case 'Escape':
            closeFullscreen();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [fullscreenIndex, nextImage, prevImage]);

  return (
    <>
      <GalleryContainer>
        <GalleryToggle
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          data-cursor-text="GALLERY"
        >
          🖼️
        </GalleryToggle>
      </GalleryContainer>

      <AnimatePresence>
        {isOpen && (
          <GalleryPanel
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <GalleryHeader>
              <GalleryTitle>Gallery</GalleryTitle>
              <CloseButton
                onClick={() => setIsOpen(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                data-cursor-text="CLOSE"
              >
                ✕
              </CloseButton>
            </GalleryHeader>

            <ImageGrid>
              {images.map((image, index) => (
                <ImageCard
                  key={index}
                  onClick={() => handleImageClick(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="gallery-item"
                  data-cursor-text="VIEW"
                >
                  <Image src={image.src} alt={image.title} />
                  <ImageInfo>
                    <ImageTitle>{image.title}</ImageTitle>
                    <ImageDescription>{image.description}</ImageDescription>
                  </ImageInfo>
                </ImageCard>
              ))}
            </ImageGrid>
          </GalleryPanel>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {fullscreenIndex !== null && (
          <FullscreenOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeFullscreen}
            ref={constraintsRef}
          >
            <FullscreenImage
              src={images[fullscreenIndex].src}
              alt={images[fullscreenIndex].title}
              drag
              dragConstraints={constraintsRef}
              onDragEnd={handleDragEnd}
              animate={{ x: dragOffset.x, y: dragOffset.y, scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
            />

            <NavigationDots>
              {images.map((_, index) => (
                <Dot
                  key={index}
                  active={index === fullscreenIndex}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFullscreenIndex(index);
                    setDragOffset({ x: 0, y: 0 });
                  }}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </NavigationDots>
          </FullscreenOverlay>
        )}
      </AnimatePresence>
    </>
  );
};