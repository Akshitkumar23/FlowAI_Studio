
'use server';

/**
 * @fileOverview A proactive AI resume analyst that provides suggestions for improving work experience descriptions.
 *
 * - proactiveResumeAnalyst: Analyzes a single work experience description and provides a suggestion.
 */

import {ai} from '@/ai/genkit';
import {
    ProactiveResumeAnalystInputSchema,
    ProactiveResumeAnalystOutputSchema,
} from '@/ai/schemas';
import type { 
    ProactiveResumeAnalystInput,
    ProactiveResumeAnalystOutput,
} from '@/ai/schemas';


const proactiveAnalystPrompt = ai.definePrompt({
    name: 'proactiveResumeAnalystPrompt',
    input: { schema: ProactiveResumeAnalystInputSchema },
    output: { schema: ProactiveResumeAnalystOutputSchema },
    prompt: `You are a proactive AI resume coach. You will be given a single work experience description.
    Your task is to analyze it for common weaknesses and provide ONE concise, actionable suggestion for improvement.
    **IMPORTANT**: Write your suggestion using simple, easy-to-understand English.

    Focus on these weaknesses:
    1.  **Passive Voice:** Identify sentences written in passive voice (e.g., "was responsible for...") and suggest an active voice alternative (e.g., "Managed...").
    2.  **Lack of Quantification:** If the description lacks numbers or metrics, suggest adding them. For example, if it says "Increased sales," suggest something like "Suggest adding a metric, e.g., 'Increased sales by 15% over six months.'".
    3.  **Vague Descriptions:** If a point is too generic, suggest making it more specific and results-oriented.

    Analyze the following description:
    "{{{description}}}"

    Based on your analysis, if you find a clear area for improvement, set hasSuggestion to true and provide a concise suggestion.
    If the description is already strong, set hasSuggestion to false. Do not provide a suggestion if none is needed.
    `,
});

export async function proactiveResumeAnalyst(input: ProactiveResumeAnalystInput): Promise<ProactiveResumeAnalystOutput> {
    const { output } = await proactiveAnalystPrompt(input);
    if (!output) {
        throw new Error("The proactive resume analyst failed to return a response.");
    }
    return output;
};
