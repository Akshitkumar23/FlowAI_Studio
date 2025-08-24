
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
    <Card className="h-full glass border-border/50 transition-all duration-300 ease-in-out hover:scale-105 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 flex flex-col">
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
          <Button asChild variant="secondary" className="w-full">
            <Link href={href}>Go to {title}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
