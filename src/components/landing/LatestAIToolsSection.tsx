
import { ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const latestTools = [
  { 
    name: "Claude 3.5 Sonnet", 
    href: "https://www.anthropic.com/news/claude-3-5-sonnet",
    description: "A new benchmark for AI intelligence, setting new standards for graduate-level reasoning and speed."
  },
  { 
    name: "Google Veo", 
    href: "https://deepmind.google/technologies/veo/",
    description: "Google's most advanced video generation model, creating high-quality, cinematic videos from text prompts."
  },
  { 
    name: "Llama 3.1", 
    href: "https://ai.meta.com/blog/meta-llama-3-1/",
    description: "Meta's latest open-source LLM, offering powerful new capabilities and a massive context window for complex tasks."
  },
  { 
    name: "Sora by OpenAI", 
    href: "https://openai.com/index/sora/",
    description: "The groundbreaking text-to-video model that can generate realistic and imaginative scenes from simple text instructions."
  },
];

export function LatestAIToolsSection() {
  return (
    <section>
       <h2 className="text-3xl font-bold text-center mb-12">Explore the Latest AI Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {latestTools.map((tool) => (
            <Card key={tool.name} className="glass h-full flex flex-col group hover:border-primary/50 transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-primary/20">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{tool.name}</span>
                  <Link
                    href={tool.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground group-hover:text-primary transition-colors"
                  >
                    <ArrowUpRight className="h-6 w-6" />
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-foreground/80">{tool.description}</p>
              </CardContent>
            </Card>
        ))}
        </div>
    </section>
  );
}
