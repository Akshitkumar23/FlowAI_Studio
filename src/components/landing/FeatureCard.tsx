
"use client";

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
}

export function FeatureCard({ title, description, href, icon, textColor }: FeatureCardProps) {
  const [isInView, setIsInView] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={cn(
        'h-full flex flex-col group transition-all duration-700 opacity-0',
        isInView ? 'animate-fade-in-up' : 'translate-y-10'
      )}
    >
      <Card className="h-full glass border-border/50 transition-all duration-300 ease-in-out hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 flex flex-col">
        <CardHeader>
          <div className="p-3 bg-background rounded-lg border w-fit">
            {icon}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col flex-grow p-4">
          <CardTitle className={cn("text-xl font-bold tracking-tight", textColor)}>
            {title}
          </CardTitle>
          <p className="mt-2 text-foreground/70 text-sm flex-grow">
            {description}
          </p>
          <Button asChild className="mt-4 w-full">
              <Link href={href}>
                {title}
              </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
