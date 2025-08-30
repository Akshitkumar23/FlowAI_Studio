
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/layout/PageHeader";
import { aiDebriefer } from "@/ai/flows/ai-debrief-flow";
import type { Slide, AIDebrieferOutput } from "@/ai/schemas";
import { Loader2, Mic, Bot, Sparkles, CheckCircle, XCircle, BarChart, FileText, Info, RefreshCw, Languages } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

type RegenerationState = 'idle' | 'regenerating' | 'hinglish';

export default function AIDebrieferPage() {
    const [slidesText, setSlidesText] = useState("");
    const [scriptText, setScriptText] = useState("");
    const [result, setResult] = useState<AIDebrieferOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [regenerationState, setRegenerationState] = useState<RegenerationState>('idle');

    const parseSlides = (text: string): Slide[] => {
        const slides: Slide[] = [];
        const slideSections = text.split(/Slide \d+:/i).filter(s => s.trim() !== "");
        
        slideSections.forEach((section, index) => {
            const lines = section.trim().split('\n');
            const title = lines.shift()?.trim() || `Slide ${index + 1}`;
            const content = lines.map(line => line.replace(/^-/, '').trim()).filter(line => line);
            slides.push({ title, content, image: undefined });
        });

        return slides;
    }

    const handleSubmit = async (e: React.FormEvent, language?: 'Hinglish') => {
        e.preventDefault();
        setError(null);
        if (!language) {
            setResult(null);
        }

        if (!slidesText) {
            setError("Please provide the slide content.");
            return;
        }

        const setLoadingState = language ? setRegenerationState : setIsLoading;
        if (language) {
            setRegenerationState(language === 'Hinglish' ? 'hinglish' : 'regenerating');
        } else {
            setIsLoading(true);
        }

        try {
            const slides = parseSlides(slidesText);
            if (slides.length === 0) {
                setError("Could not parse slide content. Please use the format 'Slide 1: Title' followed by content points.");
                setIsLoading(false);
                return;
            }
            
            const response = await aiDebriefer({ slides, script: scriptText, language });
            setResult(response);
        } catch (err) {
            console.error("Error getting debriefing feedback:", err);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoadingState(language ? 'idle' : false);
        }
    }
    
    const getScoreColor = (score: number) => {
        if (score >= 8) return 'text-green-500';
        if (score >= 5) return 'text-yellow-500';
        if (score > 0) return 'text-red-500';
        return 'text-gray-500';
    }

    const FeedbackIcon = ({ category }: { category: string }) => {
        switch (category.toLowerCase()) {
            case 'clarity': return <CheckCircle className="h-5 w-5 text-blue-500" />;
            case 'content-slide sync': return <XCircle className="h-5 w-5 text-red-500" />;
            case 'structure': return <BarChart className="h-5 w-5 text-purple-500" />;
            case 'engagement': return <Sparkles className="h-5 w-5 text-yellow-500" />;
            case 'script generation': return <Info className="h-5 w-5 text-green-500" />;
            default: return <FileText className="h-5 w-5 text-gray-500" />;
        }
    }

    return (
        <div className="min-h-full animated-gradient-bg">
            <div className="container py-8">
                <PageHeader
                    title="AI Debriefer"
                    description="Get expert feedback on your presentation. Provide your slides and an optional script to get started."
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    <Card className="glass">
                        <CardHeader>
                            <CardTitle>Your Presentation</CardTitle>
                            <CardDescription>
                                Paste your slide content below. If you provide a script, the AI will review it. If not, the AI will generate one for you.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="slides-input">Slide Content</Label>
                                    <Textarea
                                        id="slides-input"
                                        placeholder="Paste your slide content here. Use format like 'Slide 1: Title' then bullet points on new lines."
                                        value={slidesText}
                                        onChange={(e) => setSlidesText(e.target.value)}
                                        rows={10}
                                        className="font-mono text-sm"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="script-input">Speech Script (Optional)</Label>
                                    <Textarea
                                        id="script-input"
                                        placeholder="Paste your speech script here for a review, or leave it blank to get a new one generated."
                                        value={scriptText}
                                        onChange={(e) => setScriptText(e.target.value)}
                                        rows={10}
                                    />
                                </div>
                                
                                {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

                                <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <Mic className="mr-2 h-4 w-4" />
                                            Get Feedback
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {isLoading && (
                         <Card className="glass flex items-center justify-center h-full">
                            <div className="text-center p-8">
                                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                                <p className="mt-4 text-lg text-muted-foreground">Your AI Debriefer is reviewing your presentation...</p>
                                <p className="text-sm text-muted-foreground">This might take a moment.</p>
                            </div>
                        </Card>
                    )}

                    {result && (
                        <Card className="glass animate-fade-in-up">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bot />
                                    Your Debriefing Report
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <Label>Overall Score</Label>
                                    <div className="flex items-center gap-4 mt-2">
                                        {result.overallScore > 0 ? (
                                            <>
                                                <div className={`text-4xl font-bold ${getScoreColor(result.overallScore)}`}>
                                                    {result.overallScore}<span className="text-2xl text-muted-foreground">/10</span>
                                                </div>
                                                <Progress value={result.overallScore * 10} className="w-full" />
                                            </>
                                        ) : (
                                            <p className="text-muted-foreground">No script was provided to score. A new script has been generated for you.</p>
                                        )}
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="font-semibold mb-2">Key Feedback</h3>
                                    <div className="space-y-4">
                                        {result.feedback.map((item, index) => (
                                            <Alert key={index}>
                                                <AlertTitle className="flex items-center gap-3">
                                                    <FeedbackIcon category={item.category} />
                                                    <div className="flex-1">
                                                        {item.category}
                                                        {item.slideReference && <span className="font-normal text-muted-foreground ml-2">(Slide {item.slideReference})</span>}
                                                    </div>
                                                </AlertTitle>
                                                <AlertDescription className="pl-8">
                                                    {item.comment}
                                                </AlertDescription>
                                            </Alert>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-2">
                                        {scriptText ? 'Revised Script Suggestion' : 'Generated Script'}
                                    </h3>
                                    <Card className="bg-background/50 max-h-80 overflow-y-auto">
                                        <CardContent className="p-4">
                                            <p className="text-sm whitespace-pre-wrap">{result.revisedScript}</p>
                                        </CardContent>
                                    </Card>
                                    <div className="mt-4 flex gap-4">
                                        <Button
                                            variant="outline"
                                            onClick={(e) => handleSubmit(e, undefined)}
                                            disabled={regenerationState !== 'idle'}
                                        >
                                            {regenerationState === 'regenerating' ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <RefreshCw className="mr-2 h-4 w-4" />
                                            )}
                                            Regenerate Script
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={(e) => handleSubmit(e, 'Hinglish')}
                                            disabled={regenerationState !== 'idle'}
                                        >
                                             {regenerationState === 'hinglish' ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <Languages className="mr-2 h-4 w-4" />
                                            )}
                                            Generate in Hinglish
                                        </Button>
                                    </div>
                                </div>

                            </CardContent>
                        </Card>
                    )}

                </div>
            </div>
        </div>
    );
}
