
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FeatureCardProps {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
}

export function FeatureCard({ title, description, href, icon }: FeatureCardProps) {
  return (
    <Link href={href} className="h-full flex flex-col group animate-fade-in-up">
        <Card className="h-full glass border-border/50 transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:border-primary/50 group-hover:shadow-2xl group-hover:shadow-primary/20 active:scale-100 active:shadow-lg flex flex-col">
        <CardHeader>
            <div className="p-3 bg-background rounded-lg border w-fit">
            {icon}
            </div>
        </CardHeader>
        <CardContent className="flex flex-col flex-grow">
            <CardTitle className="text-xl font-bold tracking-tight">{title}</CardTitle>
            <p className="mt-2 text-foreground/70 text-sm flex-grow">
            {description}
            </p>
            <div className="mt-4">
            <Button variant="default" className="w-full transition-transform duration-200 group-hover:scale-105 active:scale-100">
                Go to {title}
            </Button>
            </div>
        </CardContent>
        </Card>
    </Link>
  );
}
