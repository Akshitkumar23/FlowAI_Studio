
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/layout/PageHeader";
import { aiDebriefer } from "@/ai/flows/ai-debrief-flow";
import type { Slide, AIDebrieferOutput } from "@/ai/schemas";
import { Loader2, Mic, Bot, Sparkles, CheckCircle, XCircle, BarChart, FileText, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

export default function AIDebrieferPage() {
    const [slidesText, setSlidesText] = useState("");
    const [scriptText, setScriptText] = useState("");
    const [result, setResult] = useState<AIDebrieferOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setResult(null);

        if (!slidesText || !scriptText) {
            setError("Please provide both slide content and the speech script.");
            return;
        }

        setIsLoading(true);
        try {
            const slides = parseSlides(slidesText);
            if (slides.length === 0) {
                setError("Could not parse slide content. Please use the format 'Slide 1: Title' followed by content points.");
                setIsLoading(false);
                return;
            }
            
            const response = await aiDebriefer({ slides, script: scriptText });
            setResult(response);
        } catch (err) {
            console.error("Error getting debriefing feedback:", err);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }
    
    const getScoreColor = (score: number) => {
        if (score >= 8) return 'text-green-500';
        if (score >= 5) return 'text-yellow-500';
        return 'text-red-500';
    }

    const FeedbackIcon = ({ category }: { category: string }) => {
        switch (category.toLowerCase()) {
            case 'clarity and conciseness':
            case 'clarity': 
                return <CheckCircle className="h-5 w-5 text-blue-500" />;
            case 'content-slide sync': 
                return <XCircle className="h-5 w-5 text-orange-500" />;
            case 'structure and flow':
            case 'structure': 
                return <BarChart className="h-5 w-5 text-purple-500" />;
            case 'engagement': 
                return <Sparkles className="h-5 w-5 text-yellow-500" />;
            case 'inclusivity & bias':
                return <ShieldCheck className="h-5 w-5 text-green-500" />;
            default: 
                return <FileText className="h-5 w-5 text-gray-500" />;
        }
    }

    return (
        <div className="min-h-full animated-gradient-bg">
            <div className="container py-8">
                <PageHeader
                    title="AI Debriefer"
                    description="Get expert feedback on your presentation's content and script to deliver with confidence."
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    <Card className="glass">
                        <CardHeader>
                            <CardTitle>Your Presentation</CardTitle>
                            <CardDescription>Paste your slide content and script below for analysis.</CardDescription>
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
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="script-input">Speech Script</Label>
                                    <Textarea
                                        id="script-input"
                                        placeholder="Paste your full speech script here."
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
                                        <div className={`text-4xl font-bold ${getScoreColor(result.overallScore)}`}>
                                            {result.overallScore}<span className="text-2xl text-muted-foreground">/10</span>
                                        </div>
                                        <Progress value={result.overallScore * 10} className="w-full" />
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
                                    <h3 className="font-semibold mb-2">Revised Script Suggestion</h3>
                                    <Card className="bg-background/50 max-h-80 overflow-y-auto">
                                        <CardContent className="p-4">
                                            <p className="text-sm whitespace-pre-wrap">{result.revisedScript}</p>
                                        </CardContent>
                                    </Card>
                                </div>

                            </CardContent>
                        </Card>
                    )}

                </div>
            </div>
        </div>
    );
}
