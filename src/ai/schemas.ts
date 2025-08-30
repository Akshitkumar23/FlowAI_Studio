
import {z} from 'genkit';

/**
 * @fileOverview This file contains shared Zod schemas and TypeScript types for AI Studio.
 * By centralizing them here, we can avoid "use server" conflicts and import them safely
 * into any file, whether it's a server-side flow or a client-side component.
 */

export const SlideSchema = z.object({
  title: z.string().describe('The title of the slide.'),
  content: z.array(z.string()).describe('The bullet points for the slide content.'),
  image: z.string().optional().describe('A data URI containing the image for the slide.'),
});

export type Slide = z.infer<typeof SlideSchema>;

export const RevisePresentationInputSchema = z.object({
    topic: z.string(),
    writingStyle: z.string().min(1),
    slides: z.array(SlideSchema),
    feedback: z.string().describe("The user's feedback on what to change about the presentation."),
});
export type RevisePresentationInput = z.infer<typeof RevisePresentationInputSchema>;

export const RevisePresentationOutputSchema = z.object({
    slides: z.array(SlideSchema),
});
export type RevisePresentationOutput = z.infer<typeof RevisePresentationOutputSchema>;


const FeedbackItemSchema = z.object({
  category: z.string().describe("The category of the feedback (e.g., Clarity, Content-Slide Sync, Structure, Engagement)."),
  comment: z.string().describe("The specific feedback or suggestion."),
  slideReference: z.number().optional().describe("The slide number the feedback refers to, if applicable."),
});

export const AIDebrieferInputSchema = z.object({
  slides: z.array(SlideSchema).describe("The content of the presentation slides."),
  script: z.string().optional().describe("The speech script for the presentation. If not provided, a script will be generated."),
});
export type AIDebrieferInput = z.infer<typeof AIDebrieferInputSchema>;

export const AIDebrieferOutputSchema = z.object({
  overallScore: z.number().min(0).max(10).describe("An overall score for the presentation from 0 to 10."),
  feedback: z.array(FeedbackItemSchema).describe("An array of constructive feedback items."),
  revisedScript: z.string().describe("A revised or newly generated, improved version of the speech script."),
});
export type AIDebrieferOutput = z.infer<typeof AIDebrieferOutputSchema>;
