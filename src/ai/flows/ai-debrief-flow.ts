
'use server';

/**
 * @fileOverview An AI debriefer that analyzes slide content and a speech script to provide feedback.
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
  prompt: `You are an expert presentation coach and debriefer. Your task is to analyze the user's presentation content and speech script to provide constructive feedback.
  **IMPORTANT**: Use simple, easy-to-understand English words and sentence structures for all your feedback and the revised script. The language should be accessible to a general audience.

Analyze the following:
1.  **Clarity and Conciseness:** Is the message clear? Is the language simple and easy to understand?
2.  **Content-Slide Sync:** Does the script align well with the content on each slide? Does the speaker simply read the slides, or do they add value?
3.  **Structure and Flow:** Is there a logical flow from one slide to the next? Is there a clear introduction, body, and conclusion?
4.  **Engagement:** Is the content engaging? Does it include storytelling, questions, or strong statements?
5.  **Inclusivity & Bias:** Analyze the content for any potential biases (e.g., gender, cultural, racial), stereotypes, or insensitive language. Ensure the content is inclusive and respectful to a diverse audience.

Based on your analysis, provide:
- An overall score out of 10.
- A list of specific, actionable feedback points. For each point, specify the category and, if applicable, the slide number it refers to. If you find any bias, use the 'Inclusivity & Bias' category.
- A revised version of the script that incorporates your feedback and improves the overall quality and inclusivity of the presentation.

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

Provide your feedback now in the required JSON format, ensuring all text uses simple, clear English.
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
