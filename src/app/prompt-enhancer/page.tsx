
"use client";

import { useState } from "react";
import { Wand2, Image as ImageIcon, Loader2, Copy, Check, Clapperboard } from "lucide-react";
import { analyzeImageStyle, enhancePrompt } from "@/ai/flows/enhance-prompt";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { PageHeader } from "@/components/layout/PageHeader";
import Link from "next/link";

export default function PromptEnhancerPage() {
  const [prompt, setPrompt] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [stylePrompt, setStylePrompt] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeStyle = async () => {
    if (!imageFile) return;
    setIsAnalyzing(true);
    setStylePrompt("");
    try {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onload = async () => {
        const photoDataUri = reader.result as string;
        const result = await analyzeImageStyle({ photoDataUri });
        setStylePrompt(result.prompt);
      };
    } catch (error) {
      console.error("Error analyzing image style:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleEnhancePrompt = async () => {
    if (!prompt) return;
    setIsEnhancing(true);
    setEnhancedPrompt("");
    try {
      const result = await enhancePrompt({ prompt });
      setEnhancedPrompt(result.enhancedPrompt);
    } catch (error) {
      console.error("Error enhancing prompt:", error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(enhancedPrompt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }

  return (
    <div className="min-h-full animated-gradient-bg">
    <div className="container py-8">
      <PageHeader
        title="Prompt Enhancer"
        description="Transform your ideas into detailed, optimized prompts for superior AI results."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Prompt Enhancement */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Enhance Your Text Prompt</CardTitle>
            <CardDescription>Write a simple prompt and let AI expand it into a detailed one.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="e.g., a knight fighting a dragon"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
            />
            <Button onClick={handleEnhancePrompt} disabled={isEnhancing || !prompt}>
              {isEnhancing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enhancing...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Enhance Prompt
                </>
              )}
            </Button>
            {isEnhancing && (
              <div className="flex justify-center items-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}
            {enhancedPrompt && (
              <div className="space-y-4 animate-fade-in-up">
                <div>
                  <h3 className="font-semibold mb-2">Enhanced Prompt:</h3>
                  <Card className="bg-secondary/50 p-4 relative">
                    <p className="text-sm whitespace-pre-wrap pr-10">{enhancedPrompt}</p>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:bg-background/50"
                        onClick={handleCopy}
                    >
                        {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </Card>
                </div>
                 <Button asChild className="w-full">
                    <Link href={`/scene-preview?prompt=${encodeURIComponent(enhancedPrompt)}`}>
                        <Clapperboard className="mr-2 h-4 w-4" />
                        Use in Scene Preview
                    </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Image Style Analysis */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Analyze Image Style</CardTitle>
            <CardDescription>Upload an image to generate a text prompt describing its style.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            {imagePreview && (
              <div className="mt-4">
                <Image src={imagePreview} alt="Preview" width={200} height={200} className="rounded-lg object-contain border" />
              </div>
            )}
            <Button onClick={handleAnalyzeStyle} disabled={isAnalyzing || !imageFile}>
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Analyze Style
                </>
              )}
            </Button>
            {isAnalyzing && (
              <div className="flex justify-center items-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}
            {stylePrompt && (
              <div className="animate-fade-in-up">
                <h3 className="font-semibold mt-4 mb-2">Style Prompt:</h3>
                <Card className="bg-secondary/50 p-4">
                  <p className="text-sm whitespace-pre-wrap">{stylePrompt}</p>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  );
}
