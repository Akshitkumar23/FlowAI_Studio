
'use server';

/**
 * @fileOverview This file contains flows and utilities for enhancing prompts, including analyzing image styles.
 *
 * - analyzeImageStyle - Analyzes an image and returns a text prompt describing its artistic style.
 * - AnalyzeImageStyleInput - The input type for the analyzeImageStyle function.
 * - AnalyzeImageStyleOutput - The return type for the analyzeImageStyle function.
 * - enhancePrompt - Takes a user's prompt and transforms it into a detailed prompt optimized for AI models.
 * - EnhancePromptInput - The input type for the enhancePrompt function.
 * - EnhancePromptOutput - The return type for the enhancePrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeImageStyleInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeImageStyleInput = z.infer<typeof AnalyzeImageStyleInputSchema>;

const AnalyzeImageStyleOutputSchema = z.object({
  prompt: z
    .string()
    .describe('A text prompt describing the artistic style of the image.'),
});
export type AnalyzeImageStyleOutput = z.infer<typeof AnalyzeImageStyleOutputSchema>;

export async function analyzeImageStyle(
  input: AnalyzeImageStyleInput
): Promise<AnalyzeImageStyleOutput> {
  return analyzeImageStyleFlow(input);
}

const analyzeImageStylePrompt = ai.definePrompt({
  name: 'analyzeImageStylePrompt',
  input: {schema: AnalyzeImageStyleInputSchema},
  output: {schema: AnalyzeImageStyleOutputSchema},
  prompt: `You are an expert art critic. Please analyze the style of the image provided and generate a text prompt that describes the style in clear and simple English.

   Image: {{media url=photoDataUri}}`,
});

const analyzeImageStyleFlow = ai.defineFlow(
  {
    name: 'analyzeImageStyleFlow',
    inputSchema: AnalyzeImageStyleInputSchema,
    outputSchema: AnalyzeImageStyleOutputSchema,
  },
  async input => {
    const {output} = await analyzeImageStylePrompt(input);
    return output!;
  }
);

const EnhancePromptInputSchema = z.object({
  prompt: z.string().describe('The prompt to enhance.'),
});
export type EnhancePromptInput = z.infer<typeof EnhancePromptInputSchema>;

const EnhancePromptOutputSchema = z.object({
  enhancedPrompt: z.string().describe('The enhanced prompt.'),
});
export type EnhancePromptOutput = z.infer<typeof EnhancePromptOutputSchema>;

export async function enhancePrompt(
  input: EnhancePromptInput
): Promise<EnhancePromptOutput> {
  return enhancePromptFlow(input);
}


const enhancePromptTemplate = ai.definePrompt({
    name: 'enhancePromptTemplate',
    input: { schema: EnhancePromptInputSchema },
    output: { schema: EnhancePromptOutputSchema },
    prompt: `You are an expert at writing prompts for generative AI.
    A user will provide a simple prompt. Your task is to expand it into a more detailed and effective prompt, using clear and descriptive English.

    Consider adding details about:
    - Subject: What is the main focus?
    - Setting: Where does it take place?
    - Style: What is the artistic style (e.g., photorealistic, cartoon, watercolor)?
    - Lighting: How is the scene lit (e.g., cinematic, soft, neon)?
    - Composition: How is the shot framed (e.g., close-up, wide shot)?
    - Mood: What is the feeling or atmosphere?

    User Prompt: {{{prompt}}}

    Enhanced Prompt:
    `
});

const enhancePromptFlow = ai.defineFlow(
  {
    name: 'enhancePromptFlow',
    inputSchema: EnhancePromptInputSchema,
    outputSchema: EnhancePromptOutputSchema,
  },
  async input => {
    const { output } = await enhancePromptTemplate(input);
    return output!;
  }
);
