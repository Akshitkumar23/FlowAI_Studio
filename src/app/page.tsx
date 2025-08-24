import { HeroSection } from '@/components/landing/HeroSection';
import { FeatureGrid } from '@/components/landing/FeatureGrid';
import { AITipOfTheDay } from '@/components/landing/AITipOfTheDay';
import { LatestAIToolsSection } from '@/components/landing/LatestAIToolsSection';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen animated-gradient-bg">
      <HeroSection />
      <div className="container mx-auto px-4 py-16 space-y-24">
        <AITipOfTheDay />
        <FeatureGrid />
        <LatestAIToolsSection />
      </div>
    </div>
  );
}
