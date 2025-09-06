
import {z} from 'zod';

/**
 * @fileOverview This file contains shared Zod schemas and TypeScript types for AI Studio.
 * By centralizing them here, we can avoid "use server" conflicts and import them safely
 * into any file, whether it's a server-side flow or a client-side component.
 */

export const SlideSchema = z.object({
  title: z.string().describe('The title of the slide.'),
  content: z.array(z.string()).describe('The bullet points for the slide content.'),
  image: z.string().optional().describe('A data URI containing the image for the slide.'),
});

export type Slide = z.infer<typeof SlideSchema>;

export const RevisePresentationInputSchema = z.object({
    topic: z.string(),
    writingStyle: z.string().min(1),
    slides: z.array(SlideSchema),
    feedback: z.string().describe("The user's feedback on what to change about the presentation."),
});
export type RevisePresentationInput = z.infer<typeof RevisePresentationInputSchema>;

export const RevisePresentationOutputSchema = z.object({
    slides: z.array(SlideSchema),
});
export type RevisePresentationOutput = z.infer<typeof RevisePresentationOutputSchema>;


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


// AI Writing Assistant Schemas
export const UserProfileSchema = z.object({
    name: z.string().optional(),
    jobTitle: z.string().optional(),
    company: z.string().optional(),
    industry: z.string().optional(),
    yearsOfExperience: z.number().optional(),
    education: z.string().optional(),
    bio: z.string().optional(),
    skills: z.string().optional(),
    experience: z.string().optional(),
    goals: z.string().optional(),
}).optional();

export const BlogWriterInputSchema = z.object({
    topic: z.string().min(1, 'Topic is required.'),
    tone: z.string(),
    keywords: z.string().optional(),
    profile: UserProfileSchema,
});
export type BlogWriterInput = z.infer<typeof BlogWriterInputSchema>;
export const BlogWriterOutputSchema = z.object({ content: z.string() });
export type BlogWriterOutput = z.infer<typeof BlogWriterOutputSchema>;

export const EmailTemplateInputSchema = z.object({
    purpose: z.string(),
    context: z.string().min(1, 'Context is required.'),
    profile: UserProfileSchema,
});
export type EmailTemplateInput = z.infer<typeof EmailTemplateInputSchema>;
export const EmailTemplateOutputSchema = z.object({ template: z.string() });
export type EmailTemplateOutput = z.infer<typeof EmailTemplateOutputSchema>;

export const ProductDescriptionInputSchema = z.object({
    productName: z.string().min(1, 'Product name is required.'),
    features: z.string().min(1, 'Features are required.'),
    targetAudience: z.string().min(1, 'Target audience is required.'),
    profile: UserProfileSchema,
});
export type ProductDescriptionInput = z.infer<typeof ProductDescriptionInputSchema>;
export const ProductDescriptionOutputSchema = z.object({ description: z.string() });
export type ProductDescriptionOutput = z.infer<typeof ProductDescriptionOutputSchema>;

export const SocialMediaCaptionInputSchema = z.object({
    platform: z.string(),
    context: z.string().min(1, 'Context is required.'),
    profile: UserProfileSchema,
});
export type SocialMediaCaptionInput = z.infer<typeof SocialMediaCaptionInputSchema>;
export const SocialMediaCaptionOutputSchema = z.object({ captions: z.array(z.string()) });
export type SocialMediaCaptionOutput = z.infer<typeof SocialMediaCaptionOutputSchema>;

export const ResumeBuilderInputSchema = z.object({
    jobTitle: z.string().min(1, 'Job title is required.'),
    company: z.string().optional(),
    description: z.string().min(1, 'Description is required.'),
    profile: UserProfileSchema,
});
export type ResumeBuilderInput = z.infer<typeof ResumeBuilderInputSchema>;
export const ResumeBuilderOutputSchema = z.object({ bulletPoints: z.array(z.string()) });
export type ResumeBuilderOutput = z.infer<typeof ResumeBuilderOutputSchema>;

// AI Resume Enhancer Schemas
const WorkExperienceSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  description: z.string().min(1, "Description is required"),
});

export const AIResumeEnhancerInputSchema = z.object({
  fullName: z.string().optional(),
  jobTitle: z.string().optional(),
  profileSummary: z.string().optional(),
  workExperience: z.array(WorkExperienceSchema).optional(),
  skills: z.array(z.object({ value: z.string() })).optional(),
});
export type AIResumeEnhancerInput = z.infer<typeof AIResumeEnhancerInputSchema>;

export const AIResumeEnhancerOutputSchema = z.object({
    profileSummary: z.string().describe("The new, professionally rewritten profile summary."),
    enhancedWorkExperience: z.array(z.object({
        originalIndex: z.number().describe("The original index of the work experience entry."),
        enhancedDescription: z.string().describe("The rewritten, bullet-pointed description of responsibilities and achievements."),
    })).describe("An array of enhanced work experience entries."),
});
export type AIResumeEnhancerOutput = z.infer<typeof AIResumeEnhancerOutputSchema>;

// Proactive Resume Analyst Schemas
export const ProactiveResumeAnalystInputSchema = z.object({
  description: z.string().describe("The work experience description to analyze."),
});
export type ProactiveResumeAnalystInput = z.infer<typeof ProactiveResumeAnalystInputSchema>;

export const ProactiveResumeAnalystOutputSchema = z.object({
  hasSuggestion: z.boolean().describe("Whether a suggestion for improvement is available."),
  suggestion: z.string().optional().describe("The suggested improvement for the description. This may not be a full rewrite but a better way to phrase a point."),
});
export type ProactiveResumeAnalystOutput = z.infer<typeof ProactiveResumeAnalystOutputSchema>;

// Text Toolkit Schemas
export const GrammarInputSchema = z.object({ text: z.string().min(1, "Text is required.") });
export type GrammarInput = z.infer<typeof GrammarInputSchema>;
export const GrammarOutputSchema = z.object({ correctedText: z.string() });
export type GrammarOutput = z.infer<typeof GrammarOutputSchema>;

export const SummarizerInputSchema = z.object({ text: z.string().min(1, "Text is required.") });
export type SummarizerInput = z.infer<typeof SummarizerInputSchema>;
export const SummarizerOutputSchema = z.object({ summary: z.string() });
export type SummarizerOutput = z.infer<typeof SummarizerOutputSchema>;

export const KeywordsInputSchema = z.object({ text: z.string().min(1, "Text is required.") });
export type KeywordsInput = z.infer<typeof KeywordsInputSchema>;
export const KeywordsOutputSchema = z.object({ keywords: z.array(z.string()) });
export type KeywordsOutput = z.infer<typeof KeywordsOutputSchema>;

export const SentimentInputSchema = z.object({ text: z.string().min(1, "Text is required.") });
export type SentimentInput = z.infer<typeof SentimentInputSchema>;
export const SentimentOutputSchema = z.object({ sentiment: z.string(), explanation: z.string() });
export type SentimentOutput = z.infer<typeof SentimentOutputSchema>;

export const TranslatorInputSchema = z.object({
  text: z.string().min(1, "Text is required."),
  targetLanguage: z.string().min(1, "Target language is required."),
});
export type TranslatorInput = z.infer<typeof TranslatorInputSchema>;
export const TranslatorOutputSchema = z.object({ translatedText: z.string() });
export type TranslatorOutput = z.infer<typeof TranslatorOutputSchema>;
