
'use server';

/**
 * @fileOverview An AI debriefer that analyzes slide content and an optional speech script to provide feedback and a revised/generated script.
 *
 * - aiDebriefer - A function that analyzes presentation content and provides feedback.
 * - AIDebrieferInput - The input type for the aiDebriefer function.
 * - AIDebrieferOutput - The return type for the aiDebriefer function.
 */

import {ai} from '@/ai/genkit';
import { AIDebrieferInputSchema, AIDebrieferOutputSchema } from '@/ai/schemas';
import type { AIDebrieferInput, AIDebrieferOutput } from '@/ai/schemas';


export async function aiDebriefer(input: AIDebrieferInput): Promise<AIDebrieferOutput> {
  return aiDebrieferFlow(input);
}


const aiDebrieferPrompt = ai.definePrompt({
  name: 'aiDebrieferPrompt',
  input: {schema: AIDebrieferInputSchema},
  output: {schema: AIDebrieferOutputSchema},
  prompt: `You are an expert presentation coach and debriefer.
{{#if language}}
Your response for the script should be in the following language: {{{language}}}.
{{/if}}

Your task is to analyze the user's presentation content.
{{#if script}}
You will also analyze the provided speech script.
Analyze the following:
1.  **Clarity and Conciseness:** Is the message clear? Is the language simple and easy to understand?
2.  **Content-Slide Sync:** Does the script align well with the content on each slide? Does the speaker simply read the slides, or do they add value?
3.  **Structure and Flow:** Is there a logical flow from one slide to the next? Is there a clear introduction, body, and conclusion?
4.  **Engagement:** Is the content engaging? Does it include storytelling, questions, or strong statements?

Based on your analysis, provide:
- An overall score out of 10.
- A list of specific, actionable feedback points. For each point, specify the category and, if applicable, the slide number it refers to.
- A revised version of the script that incorporates your feedback and improves the overall quality of the presentation.

Here is the user's speech script:
"{{{script}}}"

{{else}}
The user has not provided a speech script. Your task is to generate a compelling and professional speech script that fits the provided slide content. The script should be engaging, clear, and perfectly aligned with each slide.

Based on the slides, provide:
- An overall score of 0, as no script was provided to score.
- A list of feedback points explaining that you have generated a new script and outlining its key strengths (e.g., strong opening, clear explanations, engaging call to action).
- The full, generated speech script.
{{/if}}

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


Provide your response in the required JSON format.
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
