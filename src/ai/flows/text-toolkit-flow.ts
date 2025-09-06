
'use server';

/**
 * @fileOverview A collection of AI-powered text processing tools.
 *
 * - checkGrammar: Corrects grammatical errors in a given text.
 * - summarizeText: Creates a concise summary of a long text.
 * - extractKeywords: Extracts important keywords from a block of content.
 * - analyzeSentiment: Analyzes the emotional tone of a text.
 * - translateText: Translates text from one language to another.
 */

import {ai} from '@/ai/genkit';
import {
    GrammarInputSchema, GrammarOutputSchema,
    SummarizerInputSchema, SummarizerOutputSchema,
    KeywordsInputSchema, KeywordsOutputSchema,
    SentimentInputSchema, SentimentOutputSchema,
    TranslatorInputSchema, TranslatorOutputSchema
} from '@/ai/schemas';
import type {
    GrammarInput, GrammarOutput,
    SummarizerInput, SummarizerOutput,
    KeywordsInput, KeywordsOutput,
    SentimentInput, SentimentOutput,
    TranslatorInput, TranslatorOutput
} from '@/ai/schemas';

// 1. Grammar Checker
const grammarCheckerPrompt = ai.definePrompt({
    name: 'grammarCheckerPrompt',
    input: { schema: GrammarInputSchema },
    output: { schema: GrammarOutputSchema },
    prompt: `You are an expert English grammar and spelling checker.
    Correct the following text. Preserve the original meaning and tone.
    If there are no errors, return the original text. Your output should use simple, clear English.

    Text: "{{{text}}}"

    Provide the corrected text in the required JSON format.
    `,
});

export async function checkGrammar(input: GrammarInput): Promise<GrammarOutput> {
    const { output } = await grammarCheckerPrompt(input);
    return output!;
};

// 2. Text Summarizer
const summarizerPrompt = ai.definePrompt({
    name: 'summarizerPrompt',
    input: { schema: SummarizerInputSchema },
    output: { schema: SummarizerOutputSchema },
    prompt: `You are an expert at summarizing text. Create a concise and clear summary of the following content.
    The summary should capture the main points and key information, written in simple, easy-to-understand English.

    Content: "{{{text}}}"

    Provide the summary in the required JSON format.
    `,
});

export async function summarizeText(input: SummarizerInput): Promise<SummarizerOutput> {
    const { output } = await summarizerPrompt(input);
    return output!;
};

// 3. Keyword Extractor
const keywordsPrompt = ai.definePrompt({
    name: 'keywordsPrompt',
    input: { schema: KeywordsInputSchema },
    output: { schema: KeywordsOutputSchema },
    prompt: `You are an expert at identifying important keywords in a text.
    Analyze the following content and extract a list of the most relevant keywords.

    Content: "{{{text}}}"

    Return the keywords as an array of strings in the required JSON format.
    `,
});

export async function extractKeywords(input: KeywordsInput): Promise<KeywordsOutput> {
    const { output } = await keywordsPrompt(input);
    return output!;
};

// 4. Sentiment Analysis
const sentimentPrompt = ai.definePrompt({
    name: 'sentimentPrompt',
    input: { schema: SentimentInputSchema },
    output: { schema: SentimentOutputSchema },
    prompt: `You are an expert in sentiment analysis. Analyze the emotional tone of the following text.
    Classify the sentiment as 'Positive', 'Negative', or 'Neutral' and provide a brief explanation for your analysis using simple English.

    Text: "{{{text}}}"

    Return the analysis in the required JSON format.
    `,
});

export async function analyzeSentiment(input: SentimentInput): Promise<SentimentOutput> {
    const { output } = await sentimentPrompt(input);
    return output!;
};

// 5. Language Translator
const translatorPrompt = ai.definePrompt({
    name: 'translatorPrompt',
    input: { schema: TranslatorInputSchema },
    output: { schema: TranslatorOutputSchema },
    prompt: `You are a language translator. Translate the following text to the specified target language.
    For Hinglish, provide a translation that is a natural mix of Hindi and English, commonly used in everyday conversation.

    Text: "{{{text}}}"
    Target Language: {{targetLanguage}}

    Provide just the translated text in the required JSON format.
    `,
});

export async function translateText(input: TranslatorInput): Promise<TranslatorOutput> {
    const { output } = await translatorPrompt(input);
    return output!;
};
