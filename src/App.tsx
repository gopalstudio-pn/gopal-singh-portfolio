import React from 'react';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { SkillsSection } from './components/SkillsSection';
import { ExperienceSection } from './components/ExperienceSection';
import { ContactSection } from './components/ContactSection';
import { IntroSplash } from './components/IntroSplash';
import { NameMarquee } from './components/Interactions';
import { GalaxySection } from './components/GalaxySection';
import { GlobeSection } from './components/GlobeSection';

function App() {
  return (
    <div className="w-full min-h-screen bg-black text-[#E8DFD8] selection:bg-[#cbb59d] selection:text-black">
      <IntroSplash />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <NameMarquee />
      <ExperienceSection />
      <GalaxySection />
      <GlobeSection />
      <ContactSection />
    </div>
  );
}

export default App;
