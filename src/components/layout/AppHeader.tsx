
import Link from 'next/link';
import { Home, Sparkles, Presentation, Clapperboard, Wand2, Lightbulb, AudioLines, Menu, Mic, FilePenLine, FileText, PenTool } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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

const menuItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/presentation-generator', icon: Presentation, label: 'Presentation Generator' },
    { href: '/ai-debrief', icon: Mic, label: 'AI Debriefer' },
    { href: '/scene-preview', icon: Clapperboard, label: 'Scene Preview' },
    { href: '/ppt-enhancer', icon: Wand2, label: 'PPT Enhancer' },
    { href: '/prompt-enhancer', icon: Sparkles, label: 'Prompt Enhancer' },
    { href: '/creative-spark', icon: Lightbulb, label: 'Creative Spark' },
    { href: '/text-to-speech', icon: AudioLines, label: 'Text-to-Speech' },
    { href: '/writing-assistant', icon: FilePenLine, label: 'Writing Assistant' },
    { href: '/resume-builder', icon: FileText, label: 'Resume Builder' },
    { href: '/text-toolkit', icon: PenTool, label: 'Text Toolkit' },
]

const NavMenu = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6"/>
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass">
                {menuItems.map((item, index) => (
                    <DropdownMenuItem key={item.href} asChild 
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${index * 50 + 50}ms`, animationFillMode: 'both' }}>
                        <Link href={item.href}>
                            <item.icon className="mr-2 h-4 w-4" />
                            <span>{item.label}</span>
                        </Link>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
            <FlowAILogo />
            <span className="font-bold sm:inline-block">FlowAI Studio</span>
        </Link>
        <NavMenu />
      </div>
    </header>
  );
}
