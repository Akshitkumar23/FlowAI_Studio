
'use server';
/**
 * @fileOverview Enhances a PPT slide by redesigning an existing image or creating a new multi-slide presentation from text.
 *
 * - enhancePptSlide - A function that handles the PPT slide enhancement process.
 * - EnhancePptSlideInput - The input type for the enhancePptSlide function.
 * - EnhancePptSlideOutput - The return type for the enhancePptSlide function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { GenerateSlideImageInput, regenerateSlideImage } from './generate-presentation-flow';
import type { Slide } from '@/ai/schemas';
import { SlideSchema } from '@/ai/schemas';

const EnhancePptSlideInputSchema = z.object({
  imageUri: z
    .string()
    .optional()
    .describe(
      "A data URI of an existing slide image that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'. If provided, the slide image will be redesigned."
    ),
  text: z
    .string()
    .optional()
    .describe('The text content for creating a new presentation. If provided, a new presentation will be created from the text.'),
  style: z.string().optional().describe('The desired style for the presentation images (e.g., Professional, Creative).'),
});
export type EnhancePptSlideInput = z.infer<typeof EnhancePptSlideInputSchema>;

const EnhancePptSlideOutputSchema = z.object({
  slides: z.array(SlideSchema).describe('The generated slides for the presentation.'),
  image: z.string().optional().describe('A data URI containing the redesigned image for the slide, if an image was provided.'),
});
export type EnhancePptSlideOutput = z.infer<typeof EnhancePptSlideOutputSchema>;

export async function enhancePptSlide(input: EnhancePptSlideInput): Promise<EnhancePptSlideOutput> {
  return enhancePptSlideFlow(input);
}

const imagePrompt = ai.definePrompt({
  name: 'redesignPptSlideImagePrompt',
  input: {schema: z.object({ imageUri: z.string() })},
  output: {schema: z.object({ image: z.string() })},
  prompt: `You are an expert in designing visually appealing and effective presentation slides.

You will be provided with an image of an existing slide. Redesign the slide to make it more modern and engaging, while keeping the same content. Return a new image.

Slide Image: {{media url=imageUri}}
`,
});

const textToSlidesPrompt = ai.definePrompt({
  name: 'createPptFromTextPrompt',
  input: {schema: z.object({text: z.string()}) },
  output: {schema: z.object({
    slides: z.array(z.object({
        title: z.string().describe('A concise title for the slide.'),
        content: z.array(z.string()).describe('3-4 detailed and insightful bullet points. Each bullet point should be a complete sentence.'),
    })).describe('The array of slides with titles and content.'),
  })},
  prompt: `You are an expert in creating presentations.
  Analyze the provided text content and break it down into a structured presentation.
  Identify the main sections and create a logical slide sequence.
  For each slide, generate a concise title and 3-4 detailed and insightful bullet points. Each bullet point should be a complete sentence and provide meaningful information.
  **IMPORTANT**: Use simple, easy-to-understand English words and sentence structures. The language should be accessible to a general audience.

  Text Content: {{{text}}}
  `,
});

const enhancePptSlideFlow = ai.defineFlow(
  {
    name: 'enhancePptSlideFlow',
    inputSchema: EnhancePptSlideInputSchema,
    outputSchema: EnhancePptSlideOutputSchema,
  },
  async (input): Promise<EnhancePptSlideOutput> => {
    if (input.imageUri) {
       const {output} = await imagePrompt({ imageUri: input.imageUri });
       return { slides: [], image: output!.image };
    } else if (input.text) {
        const {output: presentationStructure} = await textToSlidesPrompt({ text: input.text });
        if (!presentationStructure || !presentationStructure.slides) {
            throw new Error('Could not generate presentation structure from text.');
        }

        const generatedSlides = presentationStructure.slides.map(slide => ({
          ...slide,
          image: undefined,
        }));

        return { slides: generatedSlides };
    } else {
      throw new Error('Either imageUri or text must be provided.');
    }
  }
);
