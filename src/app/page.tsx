
import { HeroSection } from '@/components/landing/HeroSection';
import { FeatureGrid } from '@/components/landing/FeatureGrid';
import { AITipOfTheDay } from '@/components/landing/AITipOfTheDay';
import { LatestAIToolsSection } from '@/components/landing/LatestAIToolsSection';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />

      <main className="flex-grow">
        <div className="animated-gradient-bg py-24">
          <div className="container mx-auto px-4">
            <AITipOfTheDay />
          </div>
        </div>
        
        <div className="py-24 bg-background">
            <div className="container mx-auto px-4">
                <FeatureGrid />
            </div>
        </div>

        <div className="animated-gradient-bg py-24">
          <div className="container mx-auto px-4">
            <LatestAIToolsSection />
          </div>
        </div>
      </main>
    </div>
  );
}
