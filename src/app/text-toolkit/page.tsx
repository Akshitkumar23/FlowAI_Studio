
"use client";

import * as React from 'react';
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/PageHeader";
import { Loader2, Sparkles, Bot, Copy, Check, Languages, Type, Smile, Search, List } from "lucide-react";
import {
    checkGrammar,
    summarizeText,
    extractKeywords,
    analyzeSentiment,
    translateText
} from "@/ai/flows/text-toolkit-flow";
import { 
    GrammarInputSchema,
    SummarizerInputSchema,
    KeywordsInputSchema,
    SentimentInputSchema,
    TranslatorInputSchema
} from '@/ai/schemas';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const ResultCard = ({ title, content, rawContent }: { title: string, content: React.ReactNode, rawContent?: string }) => {
    const [isCopied, setIsCopied] = useState(false);
    
    const handleCopy = () => {
        const textToCopy = rawContent || (typeof content === 'string' ? content : '');
        if(textToCopy) {
            navigator.clipboard.writeText(textToCopy);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    return (
        <Card className="glass mt-6 animate-fade-in-up">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl"><Bot /> {title}</CardTitle>
                 <Button variant="ghost" size="icon" onClick={handleCopy} className="h-8 w-8">
                    {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
            </CardHeader>
            <CardContent>
                <div className="bg-background/50 p-4 rounded-md whitespace-pre-wrap text-sm">{content}</div>
            </CardContent>
        </Card>
    );
};


const GrammarForm = () => {
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof GrammarInputSchema>>({ 
        resolver: zodResolver(GrammarInputSchema), 
        defaultValues: { text: "" }
    });
    
    async function onSubmit(values: z.infer<typeof GrammarInputSchema>) {
        setIsLoading(true);
        setResult(null);
        try {
            const response = await checkGrammar(values);
            setResult(response.correctedText);
        } catch(e) { console.error(e) }
        setIsLoading(false);
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField name="text" render={({ field }) => (
                    <FormItem><FormLabel>Your Text</FormLabel><FormControl><Textarea rows={6} placeholder="Enter text with grammar mistakes..." {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Correcting...</> : <>Correct Grammar</>}
                </Button>
                 {result && <ResultCard title="Corrected Text" content={result} />}
            </form>
        </FormProvider>
    )
}

const SummarizerForm = () => {
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof SummarizerInputSchema>>({ 
        resolver: zodResolver(SummarizerInputSchema), 
        defaultValues: { text: "" }
    });
    
    async function onSubmit(values: z.infer<typeof SummarizerInputSchema>) {
        setIsLoading(true);
        setResult(null);
        try {
            const response = await summarizeText(values);
            setResult(response.summary);
        } catch(e) { console.error(e) }
        setIsLoading(false);
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField name="text" render={({ field }) => (
                    <FormItem><FormLabel>Your Article/Text</FormLabel><FormControl><Textarea rows={6} placeholder="Paste a long article or text here to summarize..." {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Summarizing...</> : <>Summarize Text</>}
                </Button>
                 {result && <ResultCard title="Summary" content={result} />}
            </form>
        </FormProvider>
    )
}

const KeywordsForm = () => {
    const [result, setResult] = useState<string[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof KeywordsInputSchema>>({ 
        resolver: zodResolver(KeywordsInputSchema), 
        defaultValues: { text: "" }
    });
    
    async function onSubmit(values: z.infer<typeof KeywordsInputSchema>) {
        setIsLoading(true);
        setResult(null);
        try {
            const response = await extractKeywords(values);
            setResult(response.keywords);
        } catch(e) { console.error(e) }
        setIsLoading(false);
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField name="text" render={({ field }) => (
                    <FormItem><FormLabel>Your Content</FormLabel><FormControl><Textarea rows={6} placeholder="Paste your content to extract keywords from..." {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Extracting...</> : <>Extract Keywords</>}
                </Button>
                {result && <ResultCard title="Extracted Keywords" content={<div className="flex flex-wrap gap-2">{result.map((kw, i) => <Badge key={i} variant="secondary">{kw}</Badge>)}</div>} rawContent={result.join(', ')}/>}
            </form>
        </FormProvider>
    )
}

const SentimentForm = () => {
    const [result, setResult] = useState<{sentiment: string, explanation: string} | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof SentimentInputSchema>>({ 
        resolver: zodResolver(SentimentInputSchema), 
        defaultValues: { text: "" }
    });
    
    async function onSubmit(values: z.infer<typeof SentimentInputSchema>) {
        setIsLoading(true);
        setResult(null);
        try {
            const response = await analyzeSentiment(values);
            setResult(response);
        } catch(e) { console.error(e) }
        setIsLoading(false);
    }
    
    const getSentimentColor = (sentiment: string) => {
        switch(sentiment.toLowerCase()) {
            case 'positive': return 'text-green-400';
            case 'negative': return 'text-red-400';
            default: return 'text-yellow-400';
        }
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField name="text" render={({ field }) => (
                    <FormItem><FormLabel>Text to Analyze</FormLabel><FormControl><Textarea rows={6} placeholder="Paste text here to analyze its sentiment..." {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</> : <>Analyze Sentiment</>}
                </Button>
                {result && <ResultCard title="Sentiment Analysis" content={
                    <div className='space-y-2'>
                        <p>Sentiment: <span className={`font-bold ${getSentimentColor(result.sentiment)}`}>{result.sentiment}</span></p>
                        <p>Explanation: {result.explanation}</p>
                    </div>
                } rawContent={`Sentiment: ${result.sentiment}. Explanation: ${result.explanation}`}/>}
            </form>
        </FormProvider>
    )
}

const TranslatorForm = () => {
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof TranslatorInputSchema>>({ 
        resolver: zodResolver(TranslatorInputSchema), 
        defaultValues: { text: "", targetLanguage: "Hindi" }
    });
    
    async function onSubmit(values: z.infer<typeof TranslatorInputSchema>) {
        setIsLoading(true);
        setResult(null);
        try {
            const response = await translateText(values);
            setResult(response.translatedText);
        } catch(e) { console.error(e) }
        setIsLoading(false);
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField name="text" render={({ field }) => (
                    <FormItem><FormLabel>Text to Translate</FormLabel><FormControl><Textarea rows={6} placeholder="Enter text to translate..." {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                 <FormField name="targetLanguage" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Target Language</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="English">English</SelectItem>
                                <SelectItem value="Hinglish">Hinglish</SelectItem>
                                <SelectItem value="Hindi">Hindi</SelectItem>
                                <SelectItem value="Spanish">Spanish</SelectItem>
                                <SelectItem value="French">French</SelectItem>
                                <SelectItem value="German">German</SelectItem>
                                <SelectItem value="Japanese">Japanese</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}/>
                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Translating...</> : <>Translate</>}
                </Button>
                 {result && <ResultCard title="Translation" content={result} />}
            </form>
        </FormProvider>
    )
}


export default function TextToolkitPage() {
    const tools = [
        { name: "Grammar", icon: <Type className="h-5 w-5" />, component: <GrammarForm /> },
        { name: "Summarize", icon: <List className="h-5 w-5" />, component: <SummarizerForm /> },
        { name: "Keywords", icon: <Search className="h-5 w-5" />, component: <KeywordsForm /> },
        { name: "Sentiment", icon: <Smile className="h-5 w-5" />, component: <SentimentForm /> },
        { name: "Translate", icon: <Languages className="h-5 w-5" />, component: <TranslatorForm /> },
    ];

    return (
        <div className="min-h-full animated-gradient-bg">
            <div className="container py-8">
                <PageHeader
                    title="Text Toolkit"
                    description="A powerful suite of tools to correct, summarize, analyze, and translate your text."
                />
                
                <div className="max-w-2xl mx-auto">
                    <Tabs defaultValue={tools[0].name} className="w-full">
                        <TabsList className="grid w-full grid-cols-5 bg-background/50 border border-white/10 p-1 h-auto">
                            {tools.map(tool => (
                                <TabsTrigger key={tool.name} value={tool.name} className="flex flex-col sm:flex-row gap-1 sm:gap-2 h-auto py-2 data-[state=active]:bg-primary/90 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=inactive]:hover:bg-primary/10">
                                    {tool.icon}
                                    <span className="text-xs sm:text-sm">{tool.name}</span>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        
                        {tools.map(tool => (
                             <TabsContent key={tool.name} value={tool.name}>
                                <Card className="glass">
                                    <CardHeader>
                                        <CardTitle>{tool.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {tool.component}
                                    </CardContent>
                                </Card>
                             </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
