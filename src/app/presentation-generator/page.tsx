
"use client";

import { generatePresentation, regenerateSlideImage, expandSlideContent, shortenSlideContent, GenerateSlideImageInput } from "@/ai/flows/generate-presentation-flow";
import type { Slide } from "@/ai/schemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, RefreshCw, Download, Wand2, ArrowUp, ArrowDown, ChevronDown, Upload, Eye, X } from "lucide-react";
import Image from "next/image";
import { useState, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PageHeader } from "@/components/layout/PageHeader";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";

const formSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters long."),
  style: z.string().min(1, "Please select a style."),
  pdfTheme: z.string().min(1, "Please select a PDF theme."),
  titlePageTheme: z.string().optional(),
  numberOfSlides: z.coerce.number().min(1, "Number of slides must be at least 1.").max(10, "Number of slides cannot exceed 10."),
  institute: z.string().optional(),
  department: z.string().optional(),
  submittedTo: z.string().optional(),
  submittedBy: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const pdfThemes = [
    { name: 'Standard', background: '#FFFFFF', text: '#000000', title: '#000000', swatch: 'bg-white' },
    { name: 'Midnight', background: '#1a202c', text: '#FFFFFF', title: '#cbd5e0', swatch: 'bg-gray-800' },
    { name: 'Cosmic Fusion', background: 'linear-gradient(135deg, #1d2b64 0%, #f8cdda 100%)', text: '#FFFFFF', title: '#FFFFFF', swatch: 'bg-gradient-to-r from-indigo-800 to-pink-300' },
    { name: 'Aurora Borealis', background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)', text: '#FFFFFF', title: '#E0E0E0', swatch: 'bg-gradient-to-r from-gray-900 to-gray-600' },
    { name: 'Mystic Meadow', background: 'linear-gradient(135deg, #00467f 0%, #a5cc82 100%)', text: '#FFFFFF', title: '#E0F0E0', swatch: 'bg-gradient-to-r from-blue-800 to-green-300' },
    { name: 'Royal Amethyst', background: 'linear-gradient(135deg, #480048 0%, #C04848 100%)', text: '#FFFFFF', title: '#F0E0F0', swatch: 'bg-gradient-to-r from-purple-900 to-red-600' },
    { name: 'Oceanic Sunrise', background: 'linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)', text: '#FFFFFF', title: '#E0FFFF', swatch: 'bg-gradient-to-r from-blue-900 to-cyan-500' },
    { name: 'Crimson River', background: 'linear-gradient(135deg, #621708 0%, #f68a5c 100%)', text: '#FFFFFF', title: '#FFFFFF', swatch: 'bg-gradient-to-r from-red-900 to-orange-400' },
    { name: 'Emerald Water', background: 'linear-gradient(135deg, #02AAB0 0%, #00CDAC 100%)', text: '#FFFFFF', title: '#FFFFFF', swatch: 'bg-gradient-to-r from-teal-500 to-green-400' },
    { name: 'Golden Hour', background: 'linear-gradient(135deg, #ffc371 0%, #ff5f6d 100%)', text: '#FFFFFF', title: '#583101', swatch: 'bg-gradient-to-r from-yellow-400 to-red-500' },
    { name: 'Nebula', background: 'linear-gradient(135deg, #2c3e50 0%, #bdc3c7 100%)', text: '#FFFFFF', title: '#FFFFFF', swatch: 'bg-gradient-to-r from-gray-700 to-gray-400' },
    { name: 'Peach', background: 'linear-gradient(135deg, #FFDAB9 0%, #f6a6b2 100%)', text: '#402E32', title: '#402E32', swatch: 'bg-gradient-to-r from-orange-200 to-pink-300' },
];

const slideLayouts = ['left-image', 'right-image'];


export default function PresentationGeneratorPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null);
  const [contentModifyingIndex, setContentModifyingIndex] = useState<number | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      style: "Professional",
      pdfTheme: "Standard",
      titlePageTheme: "",
      numberOfSlides: 3,
      institute: "",
      department: "",
      submittedTo: "",
      submittedBy: ""
    },
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setSlides([]);
    try {
      const response = await generatePresentation(values);
      
      const slidesWithImageGenPromises = response.slides.map(async (slide) => {
        return { ...slide, image: undefined };
      });

      const generatedSlides = await Promise.all(slidesWithImageGenPromises);

      setSlides(generatedSlides);

    } catch (error) {
      console.error("Error generating presentation:", error);
      alert("Failed to generate presentation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateOrRegenerateImage = async (index: number) => {
    setRegeneratingIndex(index);
    const slide = slides[index];
    const values = form.getValues();

    const input: GenerateSlideImageInput = {
      topic: values.topic,
      style: values.style,
      slideTitle: slide.title,
      slideContent: slide.content,
    };

    try {
      const { image } = await regenerateSlideImage(input);
      const newSlides = [...slides];
      newSlides[index].image = image;
      setSlides(newSlides);
    } catch (error) {
      console.error("Error regenerating image:", error);
      alert("Failed to regenerate image. Please try again.");
    } finally {
      setRegeneratingIndex(null);
    }
  };

  const handleContentModification = async (index: number, modificationType: 'expand' | 'shorten') => {
    setContentModifyingIndex(index);
    const slide = slides[index];
    try {
      const modificationFunction = modificationType === 'expand' ? expandSlideContent : shortenSlideContent;
      const result = await modificationFunction({ title: slide.title, content: slide.content });
      const newSlides = [...slides];
      newSlides[index].content = result.content;
      setSlides(newSlides);
    } catch (error) {
      console.error(`Error ${modificationType}ing content:`, error);
      alert(`Failed to ${modificationType} content. Please try again.`);
    } finally {
      setContentModifyingIndex(null);
    }
  }

  const generateAndDownloadPdf = async () => {
    if (!previewContainerRef.current) return;
    setIsProcessingPdf(true);

    const values = form.getValues();
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [1280, 720]
    });

    const slideElements = Array.from(previewContainerRef.current.children);
    
    try {
      for (let i = 0; i < slideElements.length; i++) {
        const slideElement = slideElements[i] as HTMLElement;
        const canvas = await html2canvas(slideElement, {
          useCORS: true,
          scale: 2,
          logging: false,
          backgroundColor: null
        });

        if (i > 0) {
            pdf.addPage();
        }
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 1280, 720);
      }
      pdf.save(`${values.topic.replace(/\s+/g, '-')}-presentation.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("An error occurred while generating the PDF. Please try again.");
    } finally {
      setIsProcessingPdf(false);
    }
};

  const buildTitlePageHtml = (values: FormValues, logoDataUrl: string | null): string => {
    const titleThemeName = values.titlePageTheme || values.pdfTheme;
    const titleTheme = pdfThemes.find(t => t.name === titleThemeName) || pdfThemes[0];
    
    return `
      <div style="width: 1280px; height: 720px; aspect-ratio: 16 / 9; background: ${titleTheme.background}; color: ${titleTheme.text}; font-family: 'Inter', sans-serif; box-sizing: border-box; display: flex; flex-direction: column; box-shadow: 0 0 10px rgba(0,0,0,0.5); overflow: hidden;">
          <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; height: 100%; padding: 60px; box-sizing: border-box; text-align: center;">
              ${values.institute ? `<div style="font-size: 48px; font-weight: 800; color: ${titleTheme.title}; line-height: 1.2;">${values.institute}</div>` : ''}
              ${values.department ? `<div style="font-size: 24px; font-weight: 500; margin-top: 8px; border-bottom: 1px solid ${titleTheme.title}; border-top: 1px solid ${titleTheme.title}; padding: 8px 0; display: inline-block;">${values.department}</div>` : ''}
              ${logoDataUrl ? `<div style="margin: 40px 0;"><img src="${logoDataUrl}" style="max-width: 150px; max-height: 100px; display: inline-block;" alt="logo"/></div>` : ''}
              <div style="font-size: 36px; font-weight: 700; color: ${titleTheme.title}; margin: 40px 0;">"${values.topic}"</div>
              <div style="display: flex; justify-content: space-around; width: 100%; margin-top: auto;">
                  ${values.submittedTo ? `<div style="flex: 1; text-align: center;"><div style="font-size: 20px; font-weight: 700; color: ${titleTheme.title}; margin-bottom: 12px; text-transform: uppercase;">Submitted To</div><div style="font-size: 18px; line-height: 1.5; white-space: pre-wrap;">${values.submittedTo}</div></div>` : ''}
                  ${values.submittedBy ? `<div style="flex: 1; text-align: center;"><div style="font-size: 20px; font-weight: 700; color: ${titleTheme.title}; margin-bottom: 12px; text-transform: uppercase;">Submitted By</div><div style="font-size: 18px; line-height: 1.5; white-space: pre-wrap;">${values.submittedBy}</div></div>` : ''}
              </div>
          </div>
      </div>`;
  };

  const buildContentSlideHtml = (slide: Slide, index: number, values: FormValues, imageDataUrl: string | null): string => {
      const contentTheme = pdfThemes.find(t => t.name === values.pdfTheme) || pdfThemes[0];
      const layoutType = imageDataUrl ? slideLayouts[index % slideLayouts.length] : 'text-only';
      
      const titleHtml = `<div style="font-size: 48px; font-weight: 800; color: ${contentTheme.title}; padding: 0; margin-bottom: 24px; text-align: left; line-height: 1.2;">${slide.title}</div>`;
      const contentHtml = `<ul style="list-style: none; padding: 0; margin: 0; font-size: 26px; line-height: 1.6;">${slide.content.map(point => `<li style="margin-bottom: 16px; display: flex; align-items: flex-start;"><span style="margin-right: 16px; margin-top: 6px; font-size: 24px; color: ${contentTheme.title};">&#9679;</span><span>${point}</span></li>`).join('')}</ul>`;
      const footerHtml = `<div style="position: absolute; bottom: 30px; left: 60px; font-size: 14px; color: ${contentTheme.text}; opacity: 0.7;">${values.topic} - Slide ${index + 1}</div>`;

      const textContentDiv = `<div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">${titleHtml}${contentHtml}</div>`;
      const imageDiv = imageDataUrl ? `<div style="flex: 1; display: flex; align-items: center; justify-content: center; height: 100%;"><img src="${imageDataUrl}" style="max-width: 100%; max-height: 580px; object-fit: cover; border-radius: 12px; box-shadow: 0 10px 20px rgba(0,0,0,0.1);" crossorigin="anonymous" /></div>` : '';
      
      let slideInnerHtml = '';
      switch(layoutType) {
        case 'left-image':
           slideInnerHtml = `<div style="display: flex; width: 100%; height: 100%; padding: 60px 60px 80px 60px; box-sizing: border-box; align-items: center; gap: 50px;">${imageDiv}${textContentDiv}</div>`;
           break;
        case 'right-image':
           slideInnerHtml = `<div style="display: flex; width: 100%; height: 100%; padding: 60px 60px 80px 60px; box-sizing: border-box; align-items: center; gap: 50px;">${textContentDiv}${imageDiv}</div>`;
           break;
        case 'text-only':
        default:
            slideInnerHtml = `<div style="display: flex; flex-direction: column; justify-content: center; width: 100%; height: 100%; padding: 80px 60px; box-sizing: border-box; text-align: left;">${titleHtml}${contentHtml}</div>`;
            break;
      }
      return `<div style="width: 1280px; height: 720px; aspect-ratio: 16 / 9; background: ${contentTheme.background}; color: ${contentTheme.text}; font-family: 'Inter', sans-serif; box-sizing: border-box; display: flex; flex-direction: column; box-shadow: 0 0 10px rgba(0,0,0,0.5); position: relative; overflow: hidden;">${slideInnerHtml}${footerHtml}</div>`;
  };

  const PreviewSlides = useCallback(() => {
      const values = form.getValues();
      const hasTitlePageDetails = values.institute || values.department || values.submittedTo || values.submittedBy || logoFile;

      const allSlidesHtml = [];

      if (hasTitlePageDetails) {
          allSlidesHtml.push(buildTitlePageHtml(values, logoPreview));
      }

      slides.forEach((slide, i) => {
          allSlidesHtml.push(buildContentSlideHtml(slide, i, values, slide.image || null));
      });
      
      return (
          <div ref={previewContainerRef} className="flex flex-col items-center gap-8">
              {allSlidesHtml.map((html, i) => (
                  <div key={i} dangerouslySetInnerHTML={{ __html: html }} />
              ))}
          </div>
      );
  }, [slides, form, logoFile, logoPreview]);


  return (
    <>
    <div className="min-h-full animated-gradient-bg">
    <div className="container py-8">
      <PageHeader
        title="AI Presentation Generator"
        description="Generate a full presentation from a topic, including text and AI-generated images."
      />

      <div className="max-w-xl mx-auto">
        <Card className="glass">
          <CardHeader>
            <CardTitle>Create Your Presentation</CardTitle>
            <CardDescription>Fill in the details below to generate your presentation.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 'The Future of Renewable Energy'" {...field} />
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
                        <FormLabel>Image Style</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Professional">Professional</SelectItem>
                            <SelectItem value="Creative">Creative</SelectItem>
                            <SelectItem value="Minimalist">Minimalist</SelectItem>
                            <SelectItem value="Futuristic">Futuristic</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="pdfTheme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content PDF Theme</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a theme" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {pdfThemes.map(theme => (
                              <SelectItem key={theme.name} value={theme.name}>
                                <div className="flex items-center gap-2">
                                  <div className={`w-4 h-4 rounded-full border ${theme.swatch}`}></div>
                                  <span>{theme.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                 <FormField
                    control={form.control}
                    name="numberOfSlides"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Slides</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" max="10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                <Collapsible>
                    <CollapsibleTrigger asChild>
                        <Button variant="link" className="p-0 h-auto">
                            <ChevronDown className="h-4 w-4 mr-2" />
                            Add Optional Title Page Details
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-4 pt-4">
                       <FormField
                            control={form.control}
                            name="titlePageTheme"
                            render={({ field }) => (
                               <FormItem>
                                <FormLabel>Title Page Theme</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value || ''}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a theme (defaults to content theme)" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {pdfThemes.map(theme => (
                                        <SelectItem key={theme.name} value={theme.name}>
                                            <div className="flex items-center gap-2">
                                            <div className={`w-4 h-4 rounded-full border ${theme.swatch}`}></div>
                                            <span>{theme.name}</span>
                                            </div>
                                        </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <FormField
                                control={form.control}
                                name="institute"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Institute/Company</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., RV Institute of Technology" {...field} />
                                    </FormControl>
                                    </FormItem>
                                )}
                                />
                            <FormField
                                control={form.control}
                                name="department"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Department</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Dept. of Computer Science" {...field} />
                                    </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="submittedTo"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Submitted To</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Enter names, one per line" {...field} rows={3}/>
                                </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="submittedBy"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Submitted By</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Enter names, one per line" {...field} rows={3}/>
                                </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormItem>
                            <FormLabel>Logo (Optional)</FormLabel>
                            <FormControl>
                                <div className="flex items-center gap-4">
                                <label htmlFor="logo-upload" className="flex-grow">
                                    <div className="flex items-center justify-center w-full h-12 border-2 border-dashed rounded-md cursor-pointer hover:border-primary">
                                        <Upload className="h-5 w-5 text-muted-foreground mr-2"/>
                                        <span className="text-sm text-muted-foreground">Upload Logo</span>
                                    </div>
                                    <Input id="logo-upload" type="file" accept="image/*" onChange={handleLogoChange} className="sr-only" />
                                </label>
                                {logoPreview && <Image src={logoPreview} alt="logo preview" width={48} height={48} className="object-contain rounded-md border p-1" />}
                                </div>
                            </FormControl>
                        </FormItem>
                    </CollapsibleContent>
                </Collapsible>


                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : "Generate Presentation"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {isLoading && (
        <div className="text-center py-16">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Generating your presentation. This may take a moment...</p>
        </div>
      )}
      
      {slides.length > 0 && (
        <div className="mt-16">
          <div className="max-w-4xl mx-auto space-y-8">
              {slides.map((slide, index) => (
                <Card key={index} className="glass overflow-hidden slide-card">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <span>{index + 1}. {slide.title}</span>
                        <div className="flex items-center gap-2">
                            <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleContentModification(index, 'expand')}
                                disabled={contentModifyingIndex === index}
                                title="Expand Content"
                            >
                                {contentModifyingIndex === index ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowDown className="h-4 w-4" />}
                            </Button>
                             <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleContentModification(index, 'shorten')}
                                disabled={contentModifyingIndex === index}
                                title="Shorten Content"
                            >
                                {contentModifyingIndex === index ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
                            </Button>
                        </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div className="space-y-4">
                      <ul className="list-disc list-inside space-y-2 text-foreground/80">
                        {slide.content.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-4">
                        {slide.image ? (
                            <div className="relative aspect-video">
                                <Image src={slide.image} alt={`Slide ${index + 1} image`} fill={true} style={{objectFit: 'cover'}} className="rounded-lg border" />
                            </div>
                        ) : (
                            <div className="relative aspect-video flex items-center justify-center bg-muted/30 rounded-lg border-2 border-dashed">
                                <p className="text-muted-foreground">No image generated</p>
                            </div>
                        )}
                        <Button
                            variant="secondary"
                            className="w-full"
                            onClick={() => handleGenerateOrRegenerateImage(index)}
                            disabled={regeneratingIndex === index}
                        >
                            {regeneratingIndex === index ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (slide.image ? <RefreshCw className="mr-2 h-4 w-4" /> : <Wand2 className="mr-2 h-4 w-4" />)}
                            {regeneratingIndex === index ? 'Generating...' : (slide.image ? 'Regenerate Image' : 'Generate Image')}
                        </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
           <div className="flex justify-center items-center gap-4 mt-8">
              <Button onClick={() => setIsPreviewOpen(true)} disabled={isLoading}>
                    <Eye className="mr-2 h-4 w-4" />
                    Preview PDF
              </Button>
            </div>
        </div>
      )}
    </div>
    </div>

    <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-7xl w-full h-[90vh] flex flex-col p-0">
            <DialogHeader className="p-4 border-b">
                <DialogTitle>PDF Preview</DialogTitle>
            </DialogHeader>
            <div className="flex-grow overflow-auto bg-gray-800 p-8">
                <div className="w-[1280px] mx-auto scale-[0.7] -translate-y-[15%] origin-top">
                    {isPreviewOpen && <PreviewSlides />}
                </div>
            </div>
            <DialogFooter className="p-4 border-t">
                <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                </DialogClose>
                <Button onClick={generateAndDownloadPdf} disabled={isProcessingPdf}>
                {isProcessingPdf ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download as PDF
                  </>
                )}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  );
}

    
