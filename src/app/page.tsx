
import { HeroSection } from '@/components/landing/HeroSection';
import { FeatureGrid } from '@/components/landing/FeatureGrid';
import { AITipOfTheDay } from '@/components/landing/AITipOfTheDay';
import { LatestAIToolsSection } from '@/components/landing/LatestAIToolsSection';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen animated-gradient-bg">
      <HeroSection />

      <main className="flex-grow space-y-16 pb-24">
        <div className="container mx-auto px-4 -mt-8 relative z-20">
          <AITipOfTheDay />
        </div>
        
        <div id="tools-section" className="container mx-auto px-4 scroll-mt-20">
          <FeatureGrid />
        </div>

        <div className="container mx-auto px-4">
          <LatestAIToolsSection />
        </div>
      </main>
    </div>
  );
}
