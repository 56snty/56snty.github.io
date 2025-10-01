import React, { useState } from 'react';
import { ThemeProvider } from './ThemeProvider';
import { GlobalStyle } from './styles/GlobalStyles';
import { SpectacularLoadingScreen } from './components/SpectacularLoadingScreen';
import { EnhancedNavigation } from './components/EnhancedNavigation';
import { EnhancedHeroSection } from './components/EnhancedHeroSection';
import { AboutSection } from './components/AboutSection';
import { SkillsShowcase } from './components/SkillsShowcase';
import { SpectacularContactSection } from './components/SpectacularContactSection';
import { Footer } from './components/Footer';
import { CursorEffect } from './components/CursorEffect';
import { AdvancedParallaxBackground } from './components/AdvancedParallaxBackground';
import { ImageGallery } from './components/ImageGallery';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <ThemeProvider>
      <GlobalStyle />
      <CursorEffect />

      {isLoading && (
        <SpectacularLoadingScreen onLoadingComplete={() => setIsLoading(false)} />
      )}

      {!isLoading && (
        <>
          <AdvancedParallaxBackground />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <EnhancedNavigation />
            <div id="home">
              <EnhancedHeroSection />
            </div>
            <AboutSection />
            <SkillsShowcase />
            <div id="portfolio">
              <ImageGallery />
            </div>
            <SpectacularContactSection />
            <Footer />
          </div>
        </>
      )}
    </ThemeProvider>
  );
}

export default App;
