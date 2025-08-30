
"use client";

import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ArrowUp, Github, Twitter, MoreHorizontal, LayoutGrid } from 'lucide-react';
import { FlowAILogo } from './AppHeader'; // Assuming FlowAILogo is exported from AppHeader

const menuItems = [
    { href: '/presentation-generator', label: 'Presentation Generator' },
    { href: '/scene-preview', label: 'Scene Preview' },
    { href: '/ppt-enhancer', label: 'PPT Enhancer' },
    { href: '/prompt-enhancer', label: 'Prompt Enhancer' },
    { href: '/creative-spark', label: 'Creative Spark' },
    { href: '/text-to-speech', label: 'Text-to-Speech' },
]

export function Footer() {

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="py-6 md:px-8 md:py-0 border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between h-24">
        <p className="text-balance text-sm text-muted-foreground text-left">
          © {new Date().getFullYear()} Akshit Kumar. All Rights Reserved.
        </p>

        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-5 w-5" />
                    <span className="sr-only">More Info</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="mb-4 w-80 glass" side="top" align="end">
                <div className="grid gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <FlowAILogo width={24} height={24}/>
                            <h4 className="font-medium leading-none">FlowAI Studio</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Your all-in-one platform for AI-powered content creation.
                        </p>
                    </div>
                    <nav className="grid gap-2">
                        <h5 className="font-semibold text-sm flex items-center gap-2"><LayoutGrid className="h-4 w-4 text-primary"/> Quick Links</h5>
                        {menuItems.slice(0, 4).map(item => (
                            <Link key={item.href} href={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors -ml-1 p-1 rounded-md">
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <a href="https://github.com/Akshitkumar23" target="_blank" rel="noopener noreferrer">
                             <Button variant="outline" size="icon">
                               <Github className="h-4 w-4" />
                             </Button>
                           </a>
                           <a href="https://x.com" target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="icon">
                                 <Twitter className="h-4 w-4" />
                               </Button>
                           </a>
                        </div>
                        <Button onClick={scrollToTop} variant="outline">
                            <ArrowUp className="mr-2 h-4 w-4" /> Back to Top
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>

      </div>
    </footer>
  );
}
