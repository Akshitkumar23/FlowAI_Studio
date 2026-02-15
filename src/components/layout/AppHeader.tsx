
'use client';

import Link from 'next/link';
import { 
  Home, 
  Sparkles, 
  Presentation, 
  Clapperboard, 
  Wand2, 
  Lightbulb, 
  AudioLines, 
  Menu, 
  Mic, 
  FilePenLine, 
  FileText, 
  PenTool,
  ChevronRight,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export const FlowAILogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    width={props.width || 32}
    height={props.height || 32}
    {...props}
  >
    <defs>
      <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path
      fill="url(#logo-gradient)"
      d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm-8 168a72 72 0 0 1-72-72c0-32.33 21.41-60.44 51.36-68.89a8 8 0 0 1 9.53 4.11 8 8 0 0 1-4.11 9.53C80.3 103.22 64 128.33 64 156a64 64 0 0 0 128 0c0-29-17.8-54.88-43.25-62.75a8 8 0 0 1 5.5-15.05A88.22 88.22 0 0 1 208 156a88 88 0 0 1-88 88Z"
    />
  </svg>
);

const categories = [
  {
    name: 'General',
    items: [
      { href: '/', icon: Home, label: 'Home' },
    ]
  },
  {
    name: 'Presentation Studio',
    items: [
      { href: '/presentation-generator', icon: Presentation, label: 'AI Generator' },
      { href: '/ppt-enhancer', icon: Wand2, label: 'Slide Enhancer' },
      { href: '/ai-debrief', icon: Mic, label: 'AI Debriefer' },
    ]
  },
  {
    name: 'Creative Studio',
    items: [
      { href: '/scene-preview', icon: Clapperboard, label: 'Scene Preview' },
      { href: '/prompt-enhancer', icon: Sparkles, label: 'Prompt Enhancer' },
      { href: '/creative-spark', icon: Lightbulb, label: 'Creative Spark' },
      { href: '/text-to-speech', icon: AudioLines, label: 'Text-to-Speech' },
    ]
  },
  {
    name: 'Writing Suite',
    items: [
      { href: '/writing-assistant', icon: FilePenLine, label: 'Writing Assistant' },
      { href: '/resume-builder', icon: FileText, label: 'Resume Builder' },
      { href: '/text-toolkit', icon: PenTool, label: 'Text Toolkit' },
    ]
  }
];

const NavMenu = () => {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-primary/10 group">
          <Menu className="h-6 w-6 group-hover:text-primary transition-colors"/>
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="glass w-[300px] sm:w-[400px] border-l border-white/10 p-0 overflow-y-auto">
        <SheetHeader className="p-6 border-b border-white/10">
          <SheetTitle className="flex items-center gap-3">
            <FlowAILogo width={28} height={28} />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              FlowAI Studio
            </span>
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col gap-6 py-6 px-4">
          {categories.map((category, catIdx) => (
            <div key={category.name} className="space-y-2">
              <h4 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-bold px-3">
                {category.name}
              </h4>
              <div className="grid gap-1">
                {category.items.map((item, itemIdx) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-300 group",
                        "animate-fade-in-up",
                        isActive 
                          ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.1)]" 
                          : "hover:bg-white/5 text-foreground/80 hover:text-white"
                      )}
                      style={{ animationDelay: `${(catIdx * 100) + (itemIdx * 50)}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={cn(
                          "h-5 w-5 transition-transform group-hover:scale-110",
                          isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                        )} />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      <ChevronRight className={cn(
                        "h-4 w-4 transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-1",
                        isActive && "opacity-100 text-primary"
                      )} />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 mt-auto border-t border-white/10 bg-background/20">
          <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/20" asChild>
            <Link href="/presentation-generator" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-8">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="transition-transform duration-500 group-hover:rotate-12">
            <FlowAILogo />
          </div>
          <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent group-hover:to-primary transition-all">
            FlowAI Studio
          </span>
        </Link>
        <NavMenu />
      </div>
    </header>
  );
}
