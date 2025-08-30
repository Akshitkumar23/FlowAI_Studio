
import React from 'react';
import {
  Presentation,
  Clapperboard,
  Wand2,
  Sparkles,
  Lightbulb,
  AudioLines,
  MessageSquareQuote,
} from 'lucide-react';
import { FeatureCard } from './FeatureCard';

const features = [
  {
    title: 'Presentation Generator',
    description: 'Instantly create full presentations from a single topic, complete with AI-generated images.',
    href: '/presentation-generator',
    icon: <Presentation className="w-10 h-10" />,
  },
  {
    title: 'Scene Preview',
    description: 'Visually conceptualize your ideas by generating stunning preview images from text prompts.',
    href: '/scene-preview',
    icon: <Clapperboard className="w-10 h-10" />,
  },
  {
    title: 'PPT Enhancer',
    description: 'Automatically redesign your existing slide images or generate new presentations from raw text.',
    href: '/ppt-enhancer',
    icon: <Wand2 className="w-10 h-10" />,
  },
  {
    title: 'AI Debriefer',
    description: 'Receive expert feedback on your presentation script and content to boost your confidence.',
    href: '/ai-debrief',
    icon: <MessageSquareQuote className="w-10 h-10" />,
  },
  {
    title: 'Prompt Enhancer',
    description: 'Turn simple ideas into detailed, optimized prompts to get superior results from AI models.',
    href: '/prompt-enhancer',
    icon: <Sparkles className="w-10 h-10" />,
  },
  {
    title: 'Creative Spark',
    description: 'Overcome creative blocks with random ideas, and expand them into detailed paragraphs.',
    href: '/creative-spark',
    icon: <Lightbulb className="w-10 h-10" />,
  },
  {
    title: 'Text-to-Speech',
    description: 'Convert your text into natural-sounding audio with single or multi-speaker dialogue options.',
    href: '/text-to-speech',
    icon: <AudioLines className="w-10 h-10" />,
  },
];

export function FeatureGrid() {
  const colors = ['text-glow-primary', 'text-glow-accent', 'text-glow-primary', 'text-glow-accent', 'text-glow-primary', 'text-glow-accent', 'text-glow-primary'];
  
  return (
    <section>
      <h2 className="text-3xl font-bold text-center mb-12">Our Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, i) => {
          const colorClass = colors[i % colors.length];
          const iconWithColor = React.cloneElement(feature.icon, {
            className: `${feature.icon.props.className} ${colorClass.replace('text-glow-', 'icon-glow-')}`,
          });

          return (
            <FeatureCard 
              key={feature.title} 
              {...feature} 
              icon={iconWithColor}
              textColor={colorClass} 
            />
          );
        })}
      </div>
    </section>
  );
}
