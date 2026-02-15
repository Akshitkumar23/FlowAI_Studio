'use client';

import { FlowAILogo } from './AppHeader';

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background animated-gradient-bg animate-fade-out" style={{ animationDelay: '1.2s' }}>
      <div className="animate-splash-pop-in flex flex-col items-center">
        <FlowAILogo width={100} height={100} className="mb-6" />
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white text-glow-primary">
          FlowAI Studio
        </h1>
        <div className="mt-8 flex gap-1">
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
      </div>
    </div>
  );
}