
import { Lightbulb } from 'lucide-react';

const tips = [
  "When generating presentations, be specific with your topic and style for more tailored results.",
  "Use the 'Creative Spark' tool when you're facing a creative block to get new ideas.",
  "For the Scene Preview Creator, providing reference images can greatly influence the style of the output.",
  "The Prompt Enhancer can turn a simple idea into a rich prompt. Try it with a basic concept!",
  "Don't forget you can regenerate individual slide images in the Presentation Editor if you're not happy with one.",
  "Multi-speaker TTS can create engaging dialogues. Try formatting your script like a screenplay.",
];

export function AITipOfTheDay() {
  // By pre-calculating the index on the server, we avoid client-side randomness
  // which can cause hydration mismatches and performance issues.
  const tipIndex = Math.floor(Math.random() * tips.length);
  const tip = tips[tipIndex];

  return (
    <section>
      <div className="glass rounded-xl p-6 md:p-8 flex items-center gap-6">
        <div className="p-3 bg-background/50 rounded-full border-2 border-primary/30">
            <Lightbulb className="w-8 h-8 icon-glow-primary animate-pulse" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-primary-foreground/90">AI Tip of the Day</h3>
          <p className="text-foreground/80 mt-1">
            {tip}
          </p>
        </div>
      </div>
    </section>
  );
}
