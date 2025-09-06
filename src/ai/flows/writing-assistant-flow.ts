
'use server';

/**
 * @fileOverview A collection of AI-powered writing assistance tools.
 *
 * - generateBlog: Creates a complete blog post from a topic, tone, and keywords.
 * - generateEmailTemplate: Creates a professional email template for a given purpose and context.
 * - generateProductDescription: Writes a compelling product description for e-commerce.
 * - generateSocialMediaCaptions: Creates engaging captions for social media platforms.
 * - generateResumeBulletPoints: Generates professional resume bullet points from job details.
 */

import {ai} from '@/ai/genkit';
import {
    BlogWriterInputSchema,
    BlogWriterOutputSchema,
    EmailTemplateInputSchema,
    EmailTemplateOutputSchema,
    ProductDescriptionInputSchema,
    ProductDescriptionOutputSchema,
    ResumeBuilderInputSchema,
    ResumeBuilderOutputSchema,
    SocialMediaCaptionInputSchema,
    SocialMediaCaptionOutputSchema,
} from '@/ai/schemas';
import type { 
    BlogWriterInput,
    BlogWriterOutput,
    EmailTemplateInput,
    EmailTemplateOutput,
    ProductDescriptionInput,
    ProductDescriptionOutput,
    SocialMediaCaptionInput,
    SocialMediaCaptionOutput,
    ResumeBuilderInput,
    ResumeBuilderOutput,
} from '@/ai/schemas';

// Blog/Article Writer
const blogWriterPrompt = ai.definePrompt({
    name: 'blogWriterPrompt',
    input: { schema: BlogWriterInputSchema },
    output: { schema: BlogWriterOutputSchema },
    prompt: `You are an expert blog writer and content strategist. Your task is to generate a complete, well-structured, and engaging blog post based on the user's request.
    **IMPORTANT**: Use simple, easy-to-understand English words and sentence structures. The language should be accessible to a general audience.
    
    {{#if profile}}
    Write this from the perspective of a {{profile.jobTitle}} with {{profile.yearsOfExperience}} years in the {{profile.industry}} industry.
    Consider their professional background: {{profile.bio}}
    {{/if}}

    Topic: {{{topic}}}
    Tone: {{{tone}}}
    Keywords: {{{keywords}}}

    Please generate a comprehensive blog post that includes:
    1.  A catchy and relevant title (using markdown H1).
    2.  A brief, engaging introduction that hooks the reader.
    3.  A main body with clear headings (H2) and subheadings (H3), discussing the topic in detail. Use bullet points or numbered lists where appropriate for readability.
    4.  A concluding paragraph that summarizes the key points and provides a call to action if appropriate.

    Ensure the content is high-quality, informative, matches the specified tone, and uses simple English. Format the output as a single string with markdown for headings and lists.
    `,
});

export async function generateBlog(input: BlogWriterInput): Promise<BlogWriterOutput> {
    const { output } = await blogWriterPrompt(input);
    return output!;
};

// Email Templates
const emailTemplatePrompt = ai.definePrompt({
    name: 'emailTemplatePrompt',
    input: { schema: EmailTemplateInputSchema },
    output: { schema: EmailTemplateOutputSchema },
    prompt: `You are an expert in writing professional and effective emails. Generate a ready-to-use email template based on the user's request.
    **IMPORTANT**: Use simple, easy-to-understand English.

    Purpose: {{{purpose}}}
    Context/Details: {{{context}}}
    
    {{#if profile}}
    The email should be from:
    Name: {{profile.name}}
    Title: {{profile.jobTitle}}
    Company: {{profile.company}}
    Use this information to craft the signature.
    {{/if}}

    Create a complete email template including:
    1. A clear and concise subject line.
    2. A professional and courteous body, written in simple English.
    3. Use placeholders like [Recipient Name], [Date], or [Specific Detail] where the user needs to fill in information.
    4. A proper closing and signature.
    `,
});

export async function generateEmailTemplate(input: EmailTemplateInput): Promise<EmailTemplateOutput> {
    const { output } = await emailTemplatePrompt(input);
    return output!;
};

// Product Descriptions
const productDescriptionPrompt = ai.definePrompt({
    name: 'productDescriptionPrompt',
    input: { schema: ProductDescriptionInputSchema },
    output: { schema: ProductDescriptionOutputSchema },
    prompt: `You are a skilled e-commerce copywriter with a knack for persuasion. Write a compelling and appealing product description using simple and clear English.
    
    Product Name: {{{productName}}}
    Key Features:
    {{{features}}}
    Target Audience: {{{targetAudience}}}

    The description should:
    - Have a catchy headline.
    - Highlight the key benefits of each feature, not just the features themselves.
    - Use persuasive and sensory language to engage the reader, but keep it simple.
    - Be formatted for maximum readability (e.g., using short paragraphs, bullet points with checkmark emojis, and bold text for emphasis).
    - Include a clear call to action at the end.
    `,
});

export async function generateProductDescription(input: ProductDescriptionInput): Promise<ProductDescriptionOutput> {
    const { output } = await productDescriptionPrompt(input);
    return output!;
};

// Social Media Captions
const socialMediaCaptionPrompt = ai.definePrompt({
    name: 'socialMediaCaptionPrompt',
    input: { schema: SocialMediaCaptionInputSchema },
    output: { schema: SocialMediaCaptionOutputSchema },
    prompt: `You are a savvy social media marketing expert. Generate a few distinct and engaging captions for a post, using simple and clear language.

    Platform: {{{platform}}}
    Context for the post: {{{context}}}

    {{#if profile}}
    The post is from {{profile.name}}, a {{profile.jobTitle}}. Keep this professional persona in mind, especially for LinkedIn.
    Their professional goals are: {{profile.goals}}. Try to align the captions with these goals if relevant.
    {{/if}}

    Generate 3-4 distinct caption options. Each caption should be:
    - Tailored for the specified platform's audience and style (e.g., professional for LinkedIn, more visual for Instagram).
    - Catchy and designed to spark conversation or clicks.
    - Written in easy-to-understand English.
    - Include relevant, popular, and niche hashtags.
    - Use emojis appropriately to increase engagement.
    `,
});

export async function generateSocialMediaCaptions(input: SocialMediaCaptionInput): Promise<SocialMediaCaptionOutput> {
    const { output } = await socialMediaCaptionPrompt(input);
    return output!;
};

// Resume/CV Builder
const resumeBuilderPrompt = ai.definePrompt({
    name: 'resumeBuilderPrompt',
    input: { schema: ResumeBuilderInputSchema },
    output: { schema: ResumeBuilderOutputSchema },
    prompt: `You are a top-tier professional resume writer and career coach. Based on the user's role and responsibilities, generate a list of concise, action-oriented, and impactful bullet points for their resume. Use simple and clear English.

    Job Title: {{{jobTitle}}}
    Company: {{{company}}}
    Description of duties and accomplishments: {{{description}}}

    {{#if profile}}
    Consider the user's overall profile for context:
    - Key Skills: {{profile.skills}}
    - Career Goals: {{profile.goals}}
    - Past Experience Summary: {{profile.experience}}
    Align the generated bullet points with their skills and future goals.
    {{/if}}

    Generate 4-5 bullet points. Each bullet point MUST:
    - Start with a strong, varied action verb (e.g., Spearheaded, Orchestrated, Executed, Modernized, Quantified).
    - Quantify achievements with metrics wherever possible (e.g., 'Increased user engagement by 25%', 'Reduced operational costs by $15K annually', 'Managed a team of 5 engineers').
    - Focus on accomplishments and results, not just duties.
    - Be concise and typically a single line, written in clear English.
    `,
});

export async function generateResumeBulletPoints(input: ResumeBuilderInput): Promise<ResumeBuilderOutput> {
    const { output } = await resumeBuilderPrompt(input);
    return output!;
};
