
import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { FeatureCard } from './FeatureCard';

const latestTools = [
  { 
    title: "Claude 3.5 Sonnet", 
    href: "https://www.anthropic.com/news/claude-3-5-sonnet",
    description: "A new benchmark for AI intelligence, setting new standards for graduate-level reasoning and speed.",
    icon: <ArrowUpRight className="w-10 h-10" />,
  },
  { 
    title: "Google Veo", 
    href: "https://deepmind.google/technologies/veo/",
    description: "Google's most advanced video generation model, creating high-quality, cinematic videos from text prompts.",
    icon: <ArrowUpRight className="w-10 h-10" />,
  },
  { 
    title: "Llama 3.1", 
    href: "https://ai.meta.com/blog/meta-llama-3-1/",
    description: "Meta's latest open-source LLM, offering powerful new capabilities and a massive context window for complex tasks.",
    icon: <ArrowUpRight className="w-10 h-10" />,
  },
  { 
    title: "Sora by OpenAI", 
    href: "https://openai.com/index/sora/",
    description: "The groundbreaking text-to-video model that can generate realistic and imaginative scenes from simple text instructions.",
    icon: <ArrowUpRight className="w-10 h-10" />,
  },
];

export function LatestAIToolsSection() {
    const colors = ['text-glow-accent', 'text-glow-primary'];
    return (
        <section>
        <div className="mb-12">
            <div className="glass rounded-xl p-8 md:p-12 text-center">
                <h2 className="text-3xl font-bold text-center">Explore the Latest AI Tools</h2>
            </div>
        </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {latestTools.map((tool, i) => {
                const colorClass = colors[i % colors.length];
                const iconWithColor = React.cloneElement(tool.icon, {
                    className: `${tool.icon.props.className} ${colorClass.replace('text-glow-', 'icon-glow-')}`,
                });

                return (
                    <FeatureCard
                        key={tool.title}
                        title={tool.title}
                        description={tool.description}
                        href={tool.href}
                        icon={iconWithColor}
                        textColor={colorClass}
                    />
                );
            })}
            </div>
        </section>
    );
}
