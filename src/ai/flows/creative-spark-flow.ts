
'use server';

/**
 * @fileOverview Creative spark generator and expander.
 *
 * - getCreativeSpark - Generates a short, random creative idea or prompt.
 * - expandCreativeSpark - Expands on the given prompt into a detailed paragraph.
 * - CreativeSparkInput - The input type for the getCreativeSpark function.
 * - CreativeSparkOutput - The return type for the getCreativeSpark function.
 * - ExpandedCreativeSparkInput - The input type for the expandCreativeSpark function.
 * - ExpandedCreativeSparkOutput - The return type for the expandCreativeSpark function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreativeSparkInputSchema = z.object({})
export type CreativeSparkInput = z.infer<typeof CreativeSparkInputSchema>;

const CreativeSparkOutputSchema = z.object({
  spark: z.string().describe('A short, random creative idea or prompt.'),
});
export type CreativeSparkOutput = z.infer<typeof CreativeSparkOutputSchema>;

const ExpandedCreativeSparkInputSchema = z.object({
  spark: z.string().describe('The creative spark to expand on.'),
});
export type ExpandedCreativeSparkInput = z.infer<typeof ExpandedCreativeSparkInputSchema>;

const ExpandedCreativeSparkOutputSchema = z.object({
  expandedSpark: z.string().describe('A detailed paragraph expanding on the creative spark.'),
});
export type ExpandedCreativeSparkOutput = z.infer<typeof ExpandedCreativeSparkOutputSchema>;

export async function getCreativeSpark(): Promise<CreativeSparkOutput> {
  return creativeSparkFlow({});
}

export async function expandCreativeSpark(input: ExpandedCreativeSparkInput): Promise<ExpandedCreativeSparkOutput> {
  return expandCreativeSparkFlow(input);
}

const creativeSparkPrompt = ai.definePrompt({
  name: 'creativeSparkPrompt',
  input: {schema: CreativeSparkInputSchema},
  output: {schema: CreativeSparkOutputSchema},
  prompt: `You are a creativity assistant that generates creative prompts.

  Generate a short, random creative idea or prompt using simple, clear English.
  The prompt should be open-ended and inspire creativity.

  Example Prompts:
  - A world where animals can talk.
  - A detective who solves crimes using dreams.
  - A musician who can play emotions.
  `,
});

const creativeSparkFlow = ai.defineFlow(
  {
    name: 'creativeSparkFlow',
    inputSchema: CreativeSparkInputSchema,
    outputSchema: CreativeSparkOutputSchema,
  },
  async () => {
    const {output} = await creativeSparkPrompt({});
    return output!;
  }
);

const expandCreativeSparkPrompt = ai.definePrompt({
  name: 'expandCreativeSparkPrompt',
  input: {schema: ExpandedCreativeSparkInputSchema},
  output: {schema: ExpandedCreativeSparkOutputSchema},
  prompt: `You are a creativity assistant that expands creative prompts into detailed paragraphs.
  Use simple, easy-to-understand English for the expansion.

  Expand on the following creative spark into a detailed paragraph that provides a foundation for content creation:

  Creative Spark: {{{spark}}}
  `,
});

const expandCreativeSparkFlow = ai.defineFlow(
  {
    name: 'expandCreativeSparkFlow',
    inputSchema: ExpandedCreativeSparkInputSchema,
    outputSchema: ExpandedCreativeSparkOutputSchema,
  },
  async input => {
    const {output} = await expandCreativeSparkPrompt(input);
    return output!;
  }
);
