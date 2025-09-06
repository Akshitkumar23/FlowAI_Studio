
interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-12">
      <div className="glass rounded-xl p-8 md:p-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-white animate-fade-in-up" style={{ animationDelay: '0.2s' }}>{title}</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.4s' }}>{description}</p>
      </div>
    </div>
  );
}
