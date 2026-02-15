
"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { generatePreviewImages } from "@/ai/flows/generate-video-image-flow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Clapperboard, X, UploadCloud, RefreshCcw, Check, Download, ChevronsRightLeft, CheckCircle2, Wand2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PageHeader } from "@/components/layout/PageHeader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import * as React from "react";
import { enhancePrompt } from "@/ai/flows/enhance-prompt";

const formSchema = z.object({
  prompt: z.string().min(5, "Prompt must be at least 5 characters long."),
  style: z.string().min(1, "Please select a style."),
  numImages: z.coerce.number().min(1).max(4).default(3),
});

type FormValues = z.infer<typeof formSchema>;

function ScenePreviewPageContent() {
  const searchParams = useSearchParams();
  const [referenceImages, setReferenceImages] = useState<(File | null)[]>([null, null, null]);
  const [previews, setPreviews] = useState<(string | null)[]>([null, null, null]);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isSelectionConfirmed, setIsSelectionConfirmed] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      style: "Cinematic",
      numImages: 3,
    },
  });

  useEffect(() => {
    const urlPrompt = searchParams.get("prompt");
    if (urlPrompt) {
      form.setValue("prompt", decodeURIComponent(urlPrompt));
    }
  }, [searchParams, form]);


  const handleFileChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const newImages = [...referenceImages];
      newImages[index] = file;
      setReferenceImages(newImages);

      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = [...previews];
        newPreviews[index] = reader.result as string;
        setPreviews(newPreviews);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeImage = (index: number) => {
    const newImages = [...referenceImages];
    newImages[index] = null;
    setReferenceImages(newImages);

    const newPreviews = [...previews];
    newPreviews[index] = null;
    setPreviews(newPreviews);
  }

  const handleReset = () => {
    form.reset();
    setReferenceImages([null, null, null]);
    setPreviews([null, null, null]);
    setGeneratedImages([]);
    setSelectedImages([]);
    setIsSelectionConfirmed(false);
  }

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setGeneratedImages([]);
    setSelectedImages([]);
    setIsSelectionConfirmed(false);
    try {
      const imageUris = await Promise.all(
        referenceImages.filter(Boolean).map(file => fileToDataUri(file!))
      );

      const fullPrompt = `${values.prompt}, in a ${values.style} style`;

      const response = await generatePreviewImages({
        prompt: fullPrompt,
        numImages: values.numImages,
        referenceImage1: imageUris[0],
        referenceImage2: imageUris[1],
        referenceImage3: imageUris[2],
      });
      setGeneratedImages(response.images);
    } catch (error) {
      console.error("Error generating images:", error);
      alert("Failed to generate images. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleSelection = (imgSrc: string) => {
    if (isSelectionConfirmed) return;
    setSelectedImages(prev => 
      prev.includes(imgSrc) 
        ? prev.filter(src => src !== imgSrc)
        : [...prev, imgSrc]
    );
  };

  const handleConfirmSelection = () => {
    setGeneratedImages(selectedImages);
    setSelectedImages([]);
    setIsSelectionConfirmed(true);
  }

  const downloadImage = (src: string, name: string) => {
    const link = document.createElement('a');
    link.href = src;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const handleEnhancePrompt = async () => {
    const currentPrompt = form.getValues("prompt");
    if (!currentPrompt) return;
    setIsEnhancing(true);
    try {
        const result = await enhancePrompt({prompt: currentPrompt});
        form.setValue("prompt", result.enhancedPrompt);
    } catch(e) {
        console.error("Failed to enhance prompt", e);
        alert("There was an error enhancing your prompt. Please try again.");
    } finally {
        setIsEnhancing(false);
    }
  }

  return (
    <>
      <div className="min-h-full animated-gradient-bg">
        <div className="container py-8">
          <PageHeader
            title="Bring Your Scenes to Life"
            description="Craft breathtaking visual previews from your ideas. Combine text prompts with reference images to generate stunning, high-fidelity scenes for your storyboards, concepts, or creative projects."
          />

          <div className="max-w-4xl mx-auto">
            <Card className="glass shadow-2xl shadow-primary/10 hover:shadow-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2"><Wand2 className="text-primary"/> Scene Generator</CardTitle>
                <CardDescription>Describe your desired scene, choose a style, and optionally add reference images to guide the AI.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="prompt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">Your Vision (The Prompt)</FormLabel>
                          <FormControl>
                            <div className="relative">
                               <Textarea
                                placeholder="e.g., 'A cinematic shot of a futuristic city at night, neon lights reflecting on wet streets'"
                                rows={4}
                                className="bg-background/70 pr-12"
                                {...field}
                               />
                                <Button 
                                    type="button" 
                                    variant="ghost"
                                    size="icon"
                                    className="absolute bottom-2 right-2 h-8 w-8 text-primary hover:bg-primary/10"
                                    onClick={handleEnhancePrompt}
                                    disabled={isEnhancing}
                                    title="Enhance Prompt"
                                >
                                    {isEnhancing ? <Loader2 className="h-4 w-4 animate-spin"/> : <Wand2 className="h-4 w-4" />}
                                </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="style"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">Genre / Visual Style</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-background/70">
                                  <SelectValue placeholder="Select a style" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Cinematic">Cinematic</SelectItem>
                                <SelectItem value="Horror">Horror</SelectItem>
                                <SelectItem value="Comedy">Comedy</SelectItem>
                                <SelectItem value="Sci-Fi">Sci-Fi</SelectItem>
                                <SelectItem value="Fantasy">Fantasy</SelectItem>
                                <SelectItem value="Anime">Anime</SelectItem>
                                <SelectItem value="3D Model">3D Model</SelectItem>
                                <SelectItem value="Pixel Art">Pixel Art</SelectItem>
                                <SelectItem value="Steampunk">Steampunk</SelectItem>
                                <SelectItem value="Vintage Photo">Vintage Photo</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="numImages"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">Number of Previews</FormLabel>
                            <FormControl>
                              <Input type="number" min="1" max="4" className="bg-background/70" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div>
                      <FormLabel className="font-semibold">Reference Images (Optional)</FormLabel>
                      <div className="flex items-center gap-3 mt-2">
                        {previews.map((preview, index) => (
                           <div key={index} className="relative">
                            {preview ? (
                                <div className="relative h-16 w-16">
                                    <Image src={preview} alt={`Reference ${index + 1}`} fill={true} style={{objectFit:'cover'}} className="rounded-lg border-2 border-primary" />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute -top-2 -right-2 h-6 w-6 z-10 rounded-full"
                                        onClick={() => removeImage(index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <label htmlFor={`ref-image-${index}`} className="flex items-center justify-center h-16 w-16 border-2 border-dashed border-border rounded-lg bg-background/50 hover:border-primary transition-colors cursor-pointer text-muted-foreground hover:text-primary">
                                    <UploadCloud className="h-6 w-6" />
                                    <Input id={`ref-image-${index}`} type="file" accept="image/*" onChange={handleFileChange(index)} className="sr-only"/>
                                </label>
                            )}
                            </div>
                        ))}
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button type="submit" disabled={isLoading} size="lg" className="w-full">
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Clapperboard className="mr-2 h-4 w-4" />
                            Generate Previews
                          </>
                        )}
                      </Button>
                      <Button type="button" variant="outline" onClick={handleReset} disabled={isLoading}>
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Reset
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          {isLoading && (
            <div className="text-center py-16">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <p className="mt-4 text-muted-foreground text-lg">The AI is weaving its magic. Please wait a moment...</p>
            </div>
          )}

          {generatedImages.length > 0 && (
            <div className="mt-16">
              <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold">{isSelectionConfirmed ? 'Your Final Selection' : 'Your Generated Previews'}</h2>
                  <p className="text-muted-foreground mt-2">
                    {isSelectionConfirmed 
                      ? 'Here are your confirmed images. Hover and click the icon to view them in full size.' 
                      : 'Click to select your favorites. Hover over an image to view or download.'}
                  </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {generatedImages.map((imgSrc, index) => {
                  const isSelected = selectedImages.includes(imgSrc);
                  return (
                    <Card 
                      key={imgSrc + index} 
                      onClick={() => toggleSelection(imgSrc)}
                      className={`group relative overflow-hidden rounded-lg transition-all duration-300 ${isSelectionConfirmed ? 'cursor-default' : 'cursor-pointer'} ${isSelected ? 'ring-4 ring-primary shadow-2xl' : 'ring-0 hover:ring-2 hover:ring-primary/50'}`}
                    >
                      <CardContent className="p-0">
                        <div className="aspect-video relative">
                          <Image src={imgSrc} alt={`Generated scene ${index + 1}`} fill={true} style={{objectFit:'cover'}} />
                          
                          {!isSelectionConfirmed && (
                            <div className={`absolute inset-0 bg-black/70 transition-opacity duration-300 flex items-center justify-center ${isSelected ? 'opacity-100' : 'opacity-0'}`}>
                              <CheckCircle2 className="h-12 w-12 text-white" />
                            </div>
                          )}

                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button variant="secondary" size="icon" onClick={(e) => { e.stopPropagation(); setLightboxImage(imgSrc); }}>
                              <ChevronsRightLeft className="h-4 w-4"/>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {selectedImages.length > 0 && !isSelectionConfirmed && (
                <div className="flex justify-center mt-8">
                  <Button onClick={handleConfirmSelection} size="lg">
                    <Check className="mr-2"/>
                    Confirm Selection ({selectedImages.length})
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {lightboxImage && (
        <Dialog open={!!lightboxImage} onOpenChange={() => setLightboxImage(null)}>
          <DialogContent className="max-w-4xl p-0 border-0 bg-transparent">
            <DialogTitle className="sr-only">Generated Image Preview</DialogTitle>
            <div className="relative">
              <Image src={lightboxImage} alt="Lightbox view" width={1920} height={1080} className="rounded-lg object-contain w-full h-auto max-h-[80vh]" />
              <div className="absolute bottom-4 right-4 flex gap-2">
                <Button 
                  onClick={() => downloadImage(lightboxImage, `generated-image-${Date.now()}.png`)}
                >
                  <Download className="mr-2" />
                  Download
                </Button>
              </div>
            </div>
            <DialogClose className="absolute right-4 top-4 rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground bg-white/20 hover:bg-white/30 p-2">
              <X className="h-6 w-6 text-white" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default function ScenePreviewPage() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ScenePreviewPageContent />
    </React.Suspense>
  )
}
