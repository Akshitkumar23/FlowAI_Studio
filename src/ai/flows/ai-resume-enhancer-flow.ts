
'use server';

/**
 * @fileOverview An AI-powered resume enhancer.
 *
 * - aiResumeEnhancer: Takes resume data and returns an enhanced version with a rewritten
 *   profile summary and bullet-pointed work experience descriptions.
 */

import {ai} from '@/ai/genkit';
import {
    AIResumeEnhancerInputSchema,
    AIResumeEnhancerOutputSchema,
} from '@/ai/schemas';
import type { 
    AIResumeEnhancerInput,
    AIResumeEnhancerOutput,
} from '@/ai/schemas';

const resumeEnhancerPrompt = ai.definePrompt({
    name: 'resumeEnhancerPrompt',
    input: { schema: AIResumeEnhancerInputSchema },
    output: { schema: AIResumeEnhancerOutputSchema },
    prompt: `You are a top-tier professional resume writer and career coach.
    Your task is to analyze the user's provided resume data and significantly enhance it, using simple and clear English.

    You will perform two main tasks:
    1.  **Rewrite the Profile Summary:** Based on the user's full name, job title, skills, and work experience, write a compelling, professional, and concise profile summary. It should be 2-3 sentences and highlight the candidate's key strengths and career focus. Use clear, accessible language.
    2.  **Enhance Work Experience Descriptions:** For each work experience entry provided, convert the free-text description into a list of 3-4 concise, action-oriented, and impactful bullet points.
        - Each bullet point MUST start with a strong action verb (e.g., Spearheaded, Orchestrated, Executed, Modernized, Quantified).
        - Quantify achievements with metrics wherever possible (e.g., 'Increased user engagement by 25%', 'Reduced operational costs by $15K annually').
        - Focus on accomplishments and results, not just duties.
        - Format the output as a single string with each bullet point on a new line, starting with '• '.
        - Ensure the language is professional but easy to understand.

    Here is the user's data:
    - Full Name: {{fullName}}
    - Job Title: {{jobTitle}}
    - Current Profile Summary: "{{profileSummary}}"
    - Key Skills: {{#each skills}} {{this.value}}, {{/each}}
    - Work Experience:
    {{#each workExperience}}
    ---
    Entry Index: {{@index}}
    Job Title: {{this.jobTitle}}
    Company: {{this.company}}
    Description: "{{this.description}}"
    ---
    {{/each}}

    Please provide the rewritten profile summary and the enhanced work experience descriptions in the required JSON format.
    `,
});

export async function aiResumeEnhancer(input: AIResumeEnhancerInput): Promise<AIResumeEnhancerOutput> {
    const { output } = await resumeEnhancerPrompt(input);
    if (!output) {
        throw new Error("The AI resume enhancer failed to return a response.");
    }
    return output;
};
