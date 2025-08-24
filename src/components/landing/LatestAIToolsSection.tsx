
import { ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const latestTools = [
  { 
    name: "Sora by OpenAI", 
    href: "https://openai.com/sora",
    description: "An AI model that can create realistic and imaginative scenes from text instructions."
  },
  { 
    name: "Gemini 1.5 Pro", 
    href: "https://deepmind.google/technologies/gemini/gemini-1-5/",
    description: "A highly capable, multimodal model that can understand long contexts of information."
  },
  { 
    name: "Claude 3", 
    href: "https://www.anthropic.com/news/claude-3-family",
    description: "A family of foundation models that offer a new standard of intelligence and speed."
  },
  { 
    name: "Llama 3", 
    href: "https://ai.meta.com/blog/meta-llama-3/",
    description: "Meta's next-generation, open-source large language model designed for developers."
  },
];

export function LatestAIToolsSection() {
  return (
    <section>
       <h2 className="text-3xl font-bold text-center mb-12">Explore the Latest AI Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {latestTools.map((tool) => (
            <Card key={tool.name} className="glass h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{tool.name}</span>
                  <Link
                    href={tool.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
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
