
interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden py-16 mb-8 rounded-lg">
       <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at top right, hsl(var(--primary) / 0.3), transparent 50%), radial-gradient(circle at bottom left, hsl(var(--accent) / 0.3), transparent 50%)',
        }}
      />
      <div className="relative container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center glass p-8 rounded-xl shadow-lg">
          <h1 className="text-4xl font-extrabold tracking-tight text-white animate-fade-in-up" style={{ animationDelay: '0.2s' }}>{title}</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.4s' }}>{description}</p>
        </div>
      </div>
    </div>
  );
}
