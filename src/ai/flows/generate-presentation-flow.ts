
'use server';

/**
 * @fileOverview Generates a presentation with a given topic, style, and number of slides.
 * Also provides functionality to expand or shorten the content of individual slides.
 *
 * - generatePresentation - A function that handles the presentation generation process.
 * - GeneratePresentationInput - The input type for the generatePresentation function.
 * - GeneratePresentationOutput - The return type for the generatePresentation function.
 * - regenerateSlideImage - Generates an image for a single slide.
 * - RegenerateSlideImageInput - The input type for the regenerateSlideImage function.
 * - expandSlideContent - Takes slide content and makes it more detailed.
 * - ExpandSlideContentInput - The input type for the expandSlideContent function.
 * - shortenSlideContent - Takes slide content and makes it more concise.
 * - ShortenSlideContentInput - The input type for the shortenSlideContent function.
 * - revisePresentation - Revises an entire presentation based on user feedback.
 * - RevisePresentationInput - The input type for the revisePresentation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { SlideSchema, RevisePresentationInputSchema, RevisePresentationOutputSchema } from '@/ai/schemas';
import type { RevisePresentationInput, RevisePresentationOutput } from '@/ai/schemas';


const GeneratePresentationInputSchema = z.object({
  topic: z.string().describe('The topic of the presentation.'),
  style: z.string().describe('The desired visual style of the presentation images.'),
  writingStyle: z.string().min(1).describe('The desired writing style for the text content.'),
  numberOfSlides: z.number().int().min(1).describe('The number of slides to generate.'),
});
export type GeneratePresentationInput = z.infer<typeof GeneratePresentationInputSchema>;

const GeneratePresentationOutputSchema = z.object({
  slides: z.array(SlideSchema).describe('The generated slides for the presentation.'),
});

export type GeneratePresentationOutput = z.infer<typeof GeneratePresentationOutputSchema>;

const PresentationStructureSchema = z.object({
  title: z.string().describe('The overall presentation title.'),
  slides: z.array(z.object({
    title: z.string().describe('The title of the slide.'),
    content: z.array(z.string()).describe('The bullet points for the slide content.'),
  })).describe('The array of slides with titles and content.'),
});

export type PresentationStructure = z.infer<typeof PresentationStructureSchema>;


export async function generatePresentation(input: GeneratePresentationInput): Promise<GeneratePresentationOutput> {
  return generatePresentationFlow(input);
}

const generatePresentationStructurePrompt = ai.definePrompt({
  name: 'generatePresentationStructurePrompt',
  input: {schema: GeneratePresentationInputSchema},
  output: {schema: PresentationStructureSchema},
  prompt: `You are an expert presentation creator. Your job is to generate a structured presentation with exactly {{{numberOfSlides}}} slides based on the user's topic, style, and writing style.

  For each slide, provide a concise title and 3-4 detailed and insightful bullet points. Each bullet point should be a complete sentence and provide meaningful information. The content should be simple, clear, and directly related to the slide's title.
  **IMPORTANT**: Use simple, easy-to-understand English words and sentence structures. The language should be accessible to a general audience.
  
  Topic: {{{topic}}}
  Visual Style: {{{style}}}
  Writing Style: {{{writingStyle}}}
  Number of Slides: {{{numberOfSlides}}}

  The presentation structure must be returned in JSON format.
  `,
});

const GenerateSlideImageInputSchema = z.object({
  topic: z.string().describe('The topic of the presentation.'),
  style: z.string().describe('The desired style of the presentation.'),
  slideTitle: z.string().describe('The title of the slide.'),
  slideContent: z.array(z.string()).describe('The bullet points for the slide content.'),
});

export type GenerateSlideImageInput = z.infer<typeof GenerateSlideImageInputSchema>;

export async function regenerateSlideImage(input: GenerateSlideImageInput): Promise<{ image: string }> {
    const {media} = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: `Generate a single relevant image for a presentation slide, given the presentation topic, style, slide title and slide content. The image should be visually appealing and suitable for a presentation.

        Topic: ${input.topic}
        Style: ${input.style}
        Slide Title: ${input.slideTitle}
        Slide Content:
        ${input.slideContent.map(s => `- ${s}`).join('\n')}
        `,
        config: {
            responseModalities: ['TEXT', 'IMAGE'],
        },
    });

    if (!media?.url) {
        throw new Error('Image generation failed');
    }

    return { image: media.url };
}

const generatePresentationFlow = ai.defineFlow(
  {
    name: 'generatePresentationFlow',
    inputSchema: GeneratePresentationInputSchema,
    outputSchema: GeneratePresentationOutputSchema,
  },
  async input => {
    const {output: presentationStructure} = await generatePresentationStructurePrompt(input);

    if (!presentationStructure) {
      throw new Error('Could not generate presentation structure.');
    }

    const slides = presentationStructure.slides.map((slide) => ({
      title: slide.title,
      content: slide.content,
      image: undefined,
    }));

    return {slides};
  }
);


// Expand and Shorten Slide Content
const SlideContentInputSchema = z.object({
  title: z.string(),
  content: z.array(z.string()),
});
export type ExpandSlideContentInput = z.infer<typeof SlideContentInputSchema>;
export type ShortenSlideContentInput = z.infer<typeof SlideContentInputSchema>;

const SlideContentOutputSchema = z.object({
  content: z.array(z.string()),
});
export type SlideContentOutput = z.infer<typeof SlideContentOutputSchema>;


const expandContentPrompt = ai.definePrompt({
  name: 'expandSlideContentPrompt',
  input: {schema: SlideContentInputSchema},
  output: {schema: SlideContentOutputSchema},
  prompt: `You are an expert at refining presentation content.
  Given the following slide title and content, expand on the bullet points to make them more detailed and descriptive, while maintaining the same number of bullet points. Use simple, easy-to-understand English.

  Title: {{{title}}}
  Content:
  {{#each content}}
  - {{{this}}}
  {{/each}}
  `
});

const shortenContentPrompt = ai.definePrompt({
  name: 'shortenSlideContentPrompt',
  input: {schema: SlideContentInputSchema},
  output: {schema: SlideContentOutputSchema},
  prompt: `You are an expert at refining presentation content.
  Given the following slide title and content, shorten the bullet points to make them more concise and punchy, while maintaining the same number of bullet points. Use simple, easy-to-understand English.

  Title: {{{title}}}
  Content:
  {{#each content}}
  - {{{this}}}
  {{/each}}
  `
});


export async function expandSlideContent(input: ExpandSlideContentInput): Promise<SlideContentOutput> {
  const {output} = await expandContentPrompt(input);
  return output!;
}

export async function shortenSlideContent(input: ShortenSlideContentInput): Promise<SlideContentOutput> {
  const {output} = await shortenContentPrompt(input);
  return output!;
}


// AI Director - Revise Presentation
const revisePresentationPrompt = ai.definePrompt({
    name: 'revisePresentationPrompt',
    input: { schema: RevisePresentationInputSchema },
    output: { schema: RevisePresentationOutputSchema },
    prompt: `You are an AI Presentation Director.
    Your task is to revise an existing presentation based on user feedback and the provided writing style.
    You can add, remove, or edit slides. You can change titles, content, and the overall structure.
    Adhere to the user's feedback as closely as possible, while ensuring the content matches the requested writing style.
    **IMPORTANT**: Use simple, easy-to-understand English words and sentence structures. The language should be accessible to a general audience.

    Original Topic: {{{topic}}}
    Writing Style: {{{writingStyle}}}
    
    User Feedback: "{{{feedback}}}"

    Current Presentation Slides:
    {{#each slides}}
    Slide {{@index}}:
    Title: {{this.title}}
    Content:
    {{#each this.content}}
    - {{this}}
    {{/each}}
    ---
    {{/each}}

    Please provide the full, revised presentation in the correct JSON format. The revised content must adhere to the specified Writing Style and use simple language.
    `
});

const revisePresentationFlow = ai.defineFlow(
    {
        name: 'revisePresentationFlow',
        inputSchema: RevisePresentationInputSchema,
        outputSchema: RevisePresentationOutputSchema,
    },
    async (input) => {
        const { output } = await revisePresentationPrompt(input);
        if (!output) {
            throw new Error('Could not revise presentation.');
        }
        return output;
    }
);

export async function revisePresentation(input: RevisePresentationInput): Promise<RevisePresentationOutput> {
    return revisePresentationFlow(input);
}
