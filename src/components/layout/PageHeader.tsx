import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description: string;
  className?: string;
}

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-12 animate-fade-in-up", className)}>
      <div className="glass rounded-2xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/15 opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            {title}
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed font-medium">
            {description}
          </p>
        </div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      </div>
    </div>
  );
}
