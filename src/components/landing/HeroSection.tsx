
'use client';

export function HeroSection() {
  const scrollToTools = () => {
    const element = document.getElementById('tools-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative py-20 md:py-32 overflow-hidden px-4">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-[120px] animate-pulse delay-700" />
      
      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold mb-6 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Next-Gen AI Workspace
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Create Beyond <span className="text-glow-primary">Limits</span> <br /> 
              with <span className="text-glow-accent">FlowAI</span>
            </h1>
            
            <p className="mt-6 max-w-2xl mx-auto text-base md:text-xl text-foreground/70 animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.4s' }}>
              The ultimate studio for professional presentations, resumes, and creative content. 
              Powered by advanced AI to streamline your workflow and spark your imagination.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <button 
                onClick={scrollToTools}
                className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-lg shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
              >
                Explore Studio
              </button>
            </div>
        </div>
      </div>
    </section>
  );
}
