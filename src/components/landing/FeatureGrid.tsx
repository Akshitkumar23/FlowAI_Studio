
import React from 'react';
import {
  Presentation,
  Clapperboard,
  Wand2,
  Sparkles,
  Lightbulb,
  AudioLines,
} from 'lucide-react';
import { FeatureCard } from './FeatureCard';

const features = [
  {
    title: 'AI Presentation Generator',
    description: 'Generate a full presentation from a topic, including text and AI-generated images.',
    href: '/presentation-generator',
    icon: <Presentation className="w-10 h-10" />,
  },
  {
    title: 'Scene Preview Creator',
    description: 'Create stunning preview images from text prompts and optional reference images.',
    href: '/scene-preview',
    icon: <Clapperboard className="w-10 h-10" />,
  },
  {
    title: 'PPT Slide Enhancer',
    description: 'Redesign an existing slide or create a new one from text with content suggestions.',
    href: '/ppt-enhancer',
    icon: <Wand2 className="w-10 h-10" />,
  },
  {
    title: 'Prompt Enhancer',
    description: 'Transform your ideas into detailed, optimized prompts for superior AI results.',
    href: '/prompt-enhancer',
    icon: <Sparkles className="w-10 h-10" />,
  },
  {
    title: 'Creative Spark',
    description: 'Get random creative ideas and expand them into detailed paragraphs to kickstart your work.',
    href: '/creative-spark',
    icon: <Lightbulb className="w-10 h-10" />,
  },
  {
    title: 'Text-to-Speech',
    description: 'Convert text to speech with single-narrator or multi-speaker dialogue options.',
    href: '/text-to-speech',
    icon: <AudioLines className="w-10 h-10" />,
  },
];

export function FeatureGrid() {
  const colors = ['text-glow-primary', 'text-glow-accent'];
  
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
