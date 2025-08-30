
'use server';

/**
 * @fileOverview An AI debriefer that analyzes slide content and a speech script to provide feedback.
 *
 * - aiDebriefer - A function that analyzes presentation content and provides feedback.
 * - AIDebrieferInput - The input type for the aiDebriefer function.
 * - AIDebrieferOutput - The return type for the aiDebriefer function.
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

export const AIDebrieferInputSchema = z.object({
  slides: z.array(SlideSchema).describe("The content of the presentation slides."),
  script: z.string().describe("The speech script for the presentation."),
});
export type AIDebrieferInput = z.infer<typeof AIDebrieferInputSchema>;

export const AIDebrieferOutputSchema = z.object({
  overallScore: z.number().min(1).max(10).describe("An overall score for the presentation from 1 to 10."),
  feedback: z.array(FeedbackItemSchema).describe("An array of constructive feedback items."),
  revisedScript: z.string().describe("A revised, improved version of the speech script."),
});
export type AIDebrieferOutput = z.infer<typeof AIDebrieferOutputSchema>;


export async function aiDebriefer(input: AIDebrieferInput): Promise<AIDebrieferOutput> {
  return aiDebrieferFlow(input);
}


const aiDebrieferPrompt = ai.definePrompt({
  name: 'aiDebrieferPrompt',
  input: {schema: AIDebrieferInputSchema},
  output: {schema: AIDebrieferOutputSchema},
  prompt: `You are an expert presentation coach and debriefer. Your task is to analyze the user's presentation content and speech script to provide constructive feedback.

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

const aiDebrieferFlow = ai.defineFlow(
  {
    name: 'aiDebrieferFlow',
    inputSchema: AIDebrieferInputSchema,
    outputSchema: AIDebrieferOutputSchema,
  },
  async (input) => {
    const {output} = await aiDebrieferPrompt(input);
    if (!output) {
      throw new Error('Failed to get feedback from the AI Debriefer.');
    }
    return output;
  }
);

