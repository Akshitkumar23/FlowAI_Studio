'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
  textColor: string;
  className?: string;
}

export function FeatureCard({ title, description, href, icon, textColor, className }: FeatureCardProps) {
  const [isInView, setIsInView] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={cn(
        'h-full transition-all duration-1000',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12',
        className
      )}
    >
      <Card className="h-full glass border-white/10 hover:border-primary/50 flex flex-col overflow-hidden group relative active:scale-95 transition-transform duration-200">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <CardHeader className="relative z-10 p-6 pb-0">
          <div className="p-4 bg-background/40 rounded-xl border border-white/5 w-fit group-hover:scale-110 group-hover:bg-background/60 transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            {icon}
          </div>
        </CardHeader>

        <CardContent className="flex flex-col flex-grow p-6 relative z-10">
          <CardTitle className={cn("text-2xl font-bold tracking-tight mb-3 transition-all duration-300", textColor)}>
            {title}
          </CardTitle>
          <p className="text-foreground/70 text-base leading-relaxed flex-grow">
            {description}
          </p>
          <Button asChild className="mt-6 w-full group/btn shadow-lg" variant="secondary">
            <Link href={href}>
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </CardContent>

        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center" />
      </Card>
    </div>
  );
}
