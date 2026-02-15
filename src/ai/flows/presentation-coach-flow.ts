
'use server';

/**
 * @fileOverview An AI presentation coach that analyzes slide content and a speech script to provide feedback.
 *
 * - presentationCoach - A function that analyzes presentation content and provides feedback.
 * - PresentationCoachInput - The input type for the presentationCoach function.
 * - PresentationCoachOutput - The return type for the presentationCoach function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type {Slide} from '@/ai/schemas';
import {SlideSchema} from '@/ai/schemas';

const FeedbackItemSchema = z.object({
  category: z.string().describe("The category of the feedback (e.g., Clarity, Content-Slide Sync, Structure, Engagement)."),
  comment: z.string().describe("The specific feedback or suggestion."),
  slideReference: z.number().optional().describe("The slide number the feedback refers to, if applicable."),
});

export const PresentationCoachInputSchema = z.object({
  slides: z.array(SlideSchema).describe("The content of the presentation slides."),
  script: z.string().describe("The speech script for the presentation."),
});
export type PresentationCoachInput = z.infer<typeof PresentationCoachInputSchema>;

export const PresentationCoachOutputSchema = z.object({
  overallScore: z.number().min(1).max(10).describe("An overall score for the presentation from 1 to 10."),
  feedback: z.array(FeedbackItemSchema).describe("An array of constructive feedback items."),
  revisedScript: z.string().describe("A revised, improved version of the speech script."),
});
export type PresentationCoachOutput = z.infer<typeof PresentationCoachOutputSchema>;


export async function presentationCoach(input: PresentationCoachInput): Promise<PresentationCoachOutput> {
  return presentationCoachFlow(input);
}


const presentationCoachPrompt = ai.definePrompt({
  name: 'presentationCoachPrompt',
  input: {schema: PresentationCoachInputSchema},
  output: {schema: PresentationCoachOutputSchema},
  prompt: `You are an expert presentation coach. Your task is to analyze the user's presentation content and speech script to provide constructive feedback.

Analyze the following:
1.  **Clarity and Conciseness:** Is the message clear? Is the language simple and easy to understand?
2.  **Content-Slide Sync:** Does the script align well with the content on each slide? Does the speaker simply read the slides, or do they add value?
3.  **Structure and Flow:** Is there a logical flow from one slide to the next? Is there a clear introduction, body, and conclusion?
4.  **Engagement:** Is the content engaging? Does it include storytelling, questions, or strong statements?

Based on your analysis, provide:
- An overall score out of 10.
- A list of specific, actionable feedback points. For each point, specify the category and, if applicable, the slide number it refers to.
- A revised version of the script that incorporates your feedback and improves the overall quality of the presentation.

Here is the user's presentation content:

{{#each slides}}
---
Slide {{@index}}: {{this.title}}
Content:
{{#each this.content}}
- {{this}}
{{/each}}
---
{{/each}}

Here is the user's speech script:
"{{{script}}}"

Provide your feedback now in the required JSON format.
`,
});

const presentationCoachFlow = ai.defineFlow(
  {
    name: 'presentationCoachFlow',
    inputSchema: PresentationCoachInputSchema,
    outputSchema: PresentationCoachOutputSchema,
  },
  async (input) => {
    const {output} = await presentationCoachPrompt(input);
    if (!output) {
      throw new Error('Failed to get feedback from the presentation coach.');
    }
    return output;
  }
);
