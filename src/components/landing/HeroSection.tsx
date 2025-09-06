
export function HeroSection() {
  return (
    <section className="relative py-40 md:py-56 animated-gradient-bg">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Welcome to <span className="text-glow-primary">FlowAI Studio</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-foreground/80 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Your all-in-one platform for creating and enhancing content with the power of Artificial Intelligence.
            </p>
        </div>
      </div>
    </section>
  );
}
