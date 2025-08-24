
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
