
"use client";

import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ArrowUp, Github, Twitter, MoreHorizontal, Info } from 'lucide-react';
import { FlowAILogo } from './AppHeader';

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
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <FlowAILogo width={24} height={24}/>
                            <h4 className="font-medium leading-none">FlowAI Studio</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Your all-in-one platform for AI-powered content creation.
                        </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <a href="https://github.com/Akshitkumar23" target="_blank" rel="noopener noreferrer">
                             <Button variant="outline" size="icon" aria-label="GitHub">
                               <Github className="h-4 w-4" />
                             </Button>
                           </a>
                           <a href="https://x.com" target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="icon" aria-label="Twitter">
                                 <Twitter className="h-4 w-4" />
                               </Button>
                           </a>
                        </div>
                        <Button onClick={scrollToTop} variant="outline" size="sm">
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
