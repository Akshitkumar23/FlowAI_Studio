
"use client";

import { generatePresentation, regenerateSlideImage, expandSlideContent, shortenSlideContent, revisePresentation } from "@/ai/flows/generate-presentation-flow";
import type { Slide, RevisePresentationInput } from "@/ai/schemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, RefreshCw, Download, Wand2, ArrowUp, ArrowDown, ChevronDown, Upload, Eye, X, FileSignature, MessageCircle, Palette, ChevronsUpDown, ChevronsDownUp } from "lucide-react";
import Image from "next/image";
import { useState, useRef, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PageHeader } from "@/components/layout/PageHeader";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { createRoot } from "react-dom/client";

const formSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters long."),
  style: z.string().min(1, "Please select a style."),
  writingStyle: z.string().min(1, "Please select a writing style."),
  pdfTheme: z.string().min(1, "Please select a PDF theme."),
  numberOfSlides: z.coerce.number().min(1, "Number of slides must be at least 1.").max(10, "Number of slides cannot exceed 10."),
  institute: z.string().optional(),
  department: z.string().optional(),
  submittedTo: z.string().optional(),
  submittedBy: z.string().optional(),
  customThemeBackgroundColor: z.string().optional(),
  customThemeTitleColor: z.string().optional(),
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

const TitlePage = ({ values, logoDataUrl, bgDataUrl }: { values: FormValues, logoDataUrl: string | null, bgDataUrl: string | null }) => {
  const titleTheme = pdfThemes.find(t => t.name === values.pdfTheme) || pdfThemes[0];
  const finalBg = values.customThemeBackgroundColor || (bgDataUrl ? `url(${bgDataUrl})` : titleTheme.background);
  const backgroundStyle: React.CSSProperties = bgDataUrl
    ? { backgroundImage: finalBg, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: finalBg };

  const finalTitleColor = values.customThemeTitleColor || titleTheme.title;
  const textColor = titleTheme.text;

  return (
    <div style={{ width: 1280, height: 720, ...backgroundStyle, color: textColor, fontFamily: 'Inter, sans-serif', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden', position: 'relative', padding: '40px 80px', textAlign: 'center' }}>
      {bgDataUrl && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1 }}></div>}
      
      <div style={{ width: '100%', zIndex: 2, flexShrink: 0, minHeight: '120px' }}>
        {values.institute && <div style={{ fontSize: '48px', fontWeight: 700, color: finalTitleColor, lineHeight: 1.2, textTransform: 'uppercase' }}>{values.institute}</div>}
        {values.department && <div style={{ fontSize: '24px', fontWeight: 500, marginTop: '8px', letterSpacing: '1px' }}>{values.department}</div>}
        {values.department && <div style={{width: '60%', margin: '12px auto 0 auto', borderTop: `1px solid ${finalTitleColor}`}}></div>}
      </div>

      <div style={{ zIndex: 2, position: 'relative', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', justifyContent: 'center', flexGrow: 1, width: '100%' }}>
          {logoDataUrl && <div style={{ marginBottom: '24px' }}><img src={logoDataUrl} style={{ maxWidth: 150, maxHeight: 100, display: 'inline-block' }} alt="logo" crossOrigin="anonymous"/></div>}
          <div style={{ fontSize: '56px', fontWeight: 800, color: finalTitleColor, lineHeight: 1.2, textShadow: '2px 2px 8px rgba(0,0,0,0.3)' }}>"{values.topic}"</div>
      </div>

      <div style={{ width: 'calc(100% - 160px)', display: 'flex', justifyContent: 'space-between', zIndex: 2, flexShrink: 0, alignSelf: 'stretch', minHeight: '120px' }}>
          {values.submittedTo && 
            <div style={{ flex: '1', textAlign: 'left' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: finalTitleColor, marginBottom: '8px' }}>SUBMITTED TO:</div>
              <div style={{ fontSize: '18px', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{values.submittedTo}</div>
            </div>
          }
          {values.submittedBy && 
            <div style={{ flex: '1', textAlign: 'right' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: finalTitleColor, marginBottom: '8px' }}>SUBMITTED BY:</div>
              <div style={{ fontSize: '18px', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{values.submittedBy}</div>
            </div>
          }
      </div>
    </div>
  );
};



const ContentSlide = ({ slide, index, values }: { slide: Slide, index: number, values: FormValues }) => {
    const contentTheme = pdfThemes.find(t => t.name === values.pdfTheme) || pdfThemes[0];
    const finalBg = values.customThemeBackgroundColor || contentTheme.background;
    const finalTitleColor = values.customThemeTitleColor || contentTheme.title;
    
    // AI-Powered Layout Logic
    const totalContentLength = slide.content.join(' ').length;
    let layoutType: 'text-only' | 'image-centric' | 'text-centric' = 'text-centric';
    if (!slide.image) {
        layoutType = 'text-only';
    } else if (totalContentLength < 150) {
        layoutType = 'image-centric';
    }

    const titleHtml = <div style={{ fontSize: 48, fontWeight: 800, color: finalTitleColor, padding: 0, marginBottom: 24, textAlign: 'left', lineHeight: 1.2, wordBreak: 'break-word' }}>{slide.title}</div>;
    const contentHtml = <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 26, lineHeight: 1.6, color: contentTheme.text }}>{slide.content.map((point, i) => <li key={i} style={{ marginBottom: 16, display: 'flex', alignItems: 'flex-start' }}><span style={{ marginRight: 16, marginTop: 6, fontSize: 24, color: finalTitleColor }}>●</span><span style={{ flex: 1, wordBreak: 'break-word' }}>{point}</span></li>)}</ul>;

    const textContentDiv = <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>{titleHtml}{contentHtml}</div>;
    const imageDiv = slide.image ? <div style={{ flex: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><img src={slide.image} style={{ width: '100%', height: 'auto', maxHeight: '580px', objectFit: 'cover', borderRadius: 12, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }} crossOrigin="anonymous" alt="slide visual"/></div> : null;
    
    let slideInnerHtml;
    switch(layoutType) {
        case 'image-centric':
           const imageCentricLayout = slideLayouts[index % slideLayouts.length];
           slideInnerHtml = <div style={{ display: 'flex', flexDirection: imageCentricLayout === 'left-image' ? 'row' : 'row-reverse', width: '100%', height: '100%', padding: '60px', boxSizing: 'border-box', alignItems: 'center', gap: 50 }}>
             <div style={{ flex: 1.5 }}>{imageDiv}</div>
             <div style={{ flex: 1 }}>{textContentDiv}</div>
           </div>;
           break;
        case 'text-centric':
           const textCentricLayout = slideLayouts[index % slideLayouts.length];
           slideInnerHtml = <div style={{ display: 'flex', flexDirection: textCentricLayout === 'left-image' ? 'row' : 'row-reverse', width: '100%', height: '100%', padding: '60px', boxSizing: 'border-box', alignItems: 'center', gap: 50 }}>
               <div style={{ flex: 1 }}>{imageDiv}</div>
               <div style={{ flex: 1 }}>{textContentDiv}</div>
           </div>;
           break;
        case 'text-only':
        default:
          slideInnerHtml = <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', height: '100%', padding: '80px 60px', boxSizing: 'border-box', textAlign: 'left' }}>{titleHtml}{contentHtml}</div>;
          break;
    }
    return <div style={{ width: 1280, height: 720, background: finalBg, color: contentTheme.text, fontFamily: 'Inter, sans-serif', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>{slideInnerHtml}</div>;
};

export default function PresentationGeneratorPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null);
  const [contentModifyingIndex, setContentModifyingIndex] = useState<number | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [titleBgFile, setTitleBgFile] = useState<File | null>(null);
  const [titleBgPreview, setTitleBgPreview] = useState<string | null>(null);
  const [showInlinePreview, setShowInlinePreview] = useState(false);
  const [isRevising, setIsRevising] = useState(false);
  const [directorFeedback, setDirectorFeedback] = useState("");
  const [scale, setScale] = useState(1);
  const previewCardRef = useRef<HTMLDivElement>(null);


  const calculateScale = useCallback(() => {
    if (previewCardRef.current) {
      const parentWidth = previewCardRef.current.offsetWidth;
      const previewWidth = 1280; 
      const padding = 32; 
      const availableWidth = parentWidth - padding;
      setScale(Math.min(1, availableWidth / previewWidth));
    }
  }, []);

  useEffect(() => {
    if (showInlinePreview) {
        calculateScale();
        window.addEventListener('resize', calculateScale);
    }
    return () => {
      window.removeEventListener('resize', calculateScale);
    };
  }, [showInlinePreview, calculateScale]);


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      style: "Professional",
      writingStyle: "Professional",
      pdfTheme: "Standard",
      numberOfSlides: 3,
      institute: "",
      department: "",
      submittedTo: "",
      submittedBy: "",
      customThemeBackgroundColor: "",
      customThemeTitleColor: ""
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

  const handleTitleBgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
        const file = e.target.files[0];
        setTitleBgFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setTitleBgPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setSlides([]);
    try {
      const response = await generatePresentation(values);
      setSlides(response.slides);
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

    const input = {
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

  const handleDirectorSubmit = async () => {
    if (!directorFeedback) return;
    setIsRevising(true);
    try {
        const values = form.getValues();
        const input: RevisePresentationInput = {
            topic: values.topic,
            slides: slides,
            feedback: directorFeedback,
            writingStyle: values.writingStyle,
        };
        const response = await revisePresentation(input);
        
        const finalSlides = response.slides.map((newSlide, index) => ({
            ...newSlide,
            image: slides[index]?.image, 
        }));
        setSlides(finalSlides);
        setDirectorFeedback("");

    } catch (error) {
        console.error("Error revising presentation:", error);
        alert("Failed to revise presentation. Please try again.");
    } finally {
        setIsRevising(false);
    }
  }
  
  const generateAndDownloadPdf = async () => {
      setIsProcessingPdf(true);
      const values = form.getValues();
      const hasTitlePageDetails = values.institute || values.department || values.submittedTo || values.submittedBy || logoFile || titleBgFile;

      const doc = new jsPDF({
          orientation: "landscape",
          unit: "px",
          format: [1280, 720]
      });

      const topic = values.topic || "presentation";
      
    const renderToCanvas = async (Component: React.ReactElement): Promise<HTMLCanvasElement> => {
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.width = '1280px';
        tempContainer.style.height = '720px';
        document.body.appendChild(tempContainer);
        
        const root = createRoot(tempContainer);
        
        await new Promise<void>((resolve) => {
            root.render(
                <div style={{width: 1280, height: 720}}>
                    {Component}
                </div>
            );
            setTimeout(resolve, 500); 
        });

        const canvas = await html2canvas(tempContainer, { 
            useCORS: true, 
            scale: 2, 
            logging: false, 
            backgroundColor: null 
        });

        root.unmount();
        document.body.removeChild(tempContainer);
        return canvas;
    };


      try {
          if (hasTitlePageDetails) {
              const canvas = await renderToCanvas(<TitlePage values={values} logoDataUrl={logoPreview} bgDataUrl={titleBgPreview} />);
              doc.addImage(canvas.toDataURL('image/png', 1.0), 'PNG', 0, 0, 1280, 720);
          }

          for (let i = 0; i < slides.length; i++) {
              if (i > 0 || hasTitlePageDetails) {
                  doc.addPage([1280, 720], 'landscape');
              }
              const canvas = await renderToCanvas(<ContentSlide slide={slides[i]} index={i} values={values} />);
              doc.addImage(canvas.toToDataURL('image/png', 1.0), 'PNG', 0, 0, 1280, 720);
          }
  
          doc.save(`${topic.replace(/\s+/g, '-')}-presentation.pdf`);

      } catch (err) {
          console.error("Error generating PDF:", err);
          alert("An error occurred while generating the PDF. Please try again.");
      } finally {
          setIsProcessingPdf(false);
      }
  };


  const PreviewSlides = useCallback(() => {
    const values = form.getValues();
    const hasTitlePageDetails = values.institute || values.department || values.submittedTo || values.submittedBy || logoFile || titleBgFile;

    return (
        <div ref={previewCardRef} className="w-full flex justify-center p-2 sm:p-4">
            <div 
                className="space-y-4 origin-top transition-transform duration-300"
                style={{ 
                    transform: `scale(${scale})`, 
                    width: '1280px',
                    marginBottom: `${(1 - scale) * -720}px`
                }}
            >
                {hasTitlePageDetails && <TitlePage values={values} logoDataUrl={logoPreview} bgDataUrl={titleBgPreview} />}
                {slides.map((slide, i) => (
                    <ContentSlide key={i} slide={slide} index={i} values={values} />
                ))}
            </div>
        </div>
    );
  }, [slides, logoPreview, titleBgPreview, scale, form]);


  return (
    <>
    <div className="min-h-full animated-gradient-bg px-2 sm:px-4">
    <div className="container py-6 md:py-8">
      <PageHeader
        title="AI Presentation Generator"
        description="Generate a full presentation from a topic, including text and AI-generated images."
      />

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto items-start">

        {/* Left Column: Form */}
        <div className="lg:sticky lg:top-8 order-1">
            <Card className="glass shadow-2xl shadow-primary/10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                        <FileSignature className="text-primary"/>
                        Create Your Presentation
                    </CardTitle>
                    <CardDescription>Fill in the details below to generate your masterpiece.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                            name="writingStyle"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Writing Style</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                    <SelectValue placeholder="Select a style" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Professional">Professional</SelectItem>
                                    <SelectItem value="Casual">Casual</SelectItem>
                                    <SelectItem value="Creative">Creative</SelectItem>
                                    <SelectItem value="Technical">Technical</SelectItem>
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        
                        <Collapsible>
                            <CollapsibleTrigger asChild>
                                <Button variant="link" className="p-0 h-auto text-primary text-xs sm:text-sm">
                                    <ChevronDown className="h-4 w-4 mr-2" />
                                    Add Optional Details & Customizations
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-4 pt-4 animate-accordion-down">
                                
                                <Collapsible>
                                    <CollapsibleTrigger asChild>
                                        <Button variant="ghost" className="p-0 h-auto text-xs text-muted-foreground w-full justify-start gap-2">
                                            <Palette className="h-4 w-4" /> Customize Theme Colors
                                        </Button>
                                    </CollapsibleTrigger>
                                     <CollapsibleContent className="space-y-4 p-4 mt-2 border rounded-md animate-accordion-down">
                                        <FormField
                                            control={form.control}
                                            name="customThemeBackgroundColor"
                                            render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Custom Background Color</FormLabel>
                                                <FormControl><Input type="text" placeholder="e.g., #FFFFFF or linear-gradient(...)" {...field} /></FormControl>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="customThemeTitleColor"
                                            render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Custom Title Color</FormLabel>
                                                <FormControl><Input type="text" placeholder="e.g., #000000" {...field} /></FormControl>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CollapsibleContent>
                                </Collapsible>

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
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormItem>
                                        <FormLabel>Logo (Optional)</FormLabel>
                                        <FormControl>
                                            <div className="flex items-center gap-4">
                                            <label htmlFor="logo-upload" className="flex-grow">
                                                <div className="flex items-center justify-center w-full h-12 border-2 border-dashed rounded-md cursor-pointer hover:border-primary">
                                                    <Upload className="h-5 w-5 text-muted-foreground mr-2"/>
                                                    <span className="text-xs text-muted-foreground">Upload Logo</span>
                                                </div>
                                                <Input id="logo-upload" type="file" accept="image/*" onChange={handleLogoChange} className="sr-only" />
                                            </label>
                                            {logoPreview && <Image src={logoPreview} alt="logo preview" width={48} height={48} className="object-contain rounded-md border p-1" />}
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                    <FormItem>
                                        <FormLabel>Background Image (Optional)</FormLabel>
                                        <FormControl>
                                            <label htmlFor="title-bg-upload" className="flex-grow">
                                                <div className="flex items-center justify-center w-full h-12 border-2 border-dashed rounded-md cursor-pointer hover:border-primary">
                                                    <Upload className="h-5 w-5 text-muted-foreground mr-2"/>
                                                    <span className="text-xs text-muted-foreground">Upload Background</span>
                                                </div>
                                                <Input id="title-bg-upload" type="file" accept="image/*" onChange={handleTitleBgChange} className="sr-only" />
                                            </label>
                                        </FormControl>
                                    </FormItem>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>


                        <Button type="submit" disabled={isLoading} size="lg" className="w-full mt-6">
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

        {/* Right Column: Results */}
        <div className="space-y-6 md:space-y-8 order-2">
            {isLoading && (
            <Card className="flex items-center justify-center min-h-[300px] bg-background/50">
                <div className="text-center p-4">
                    <Loader2 className="h-10 w-10 md:h-12 md:w-12 animate-spin text-primary mx-auto" />
                    <p className="mt-4 text-muted-foreground text-base md:text-lg font-medium">Generating your presentation...</p>
                    <p className="text-muted-foreground text-xs md:text-sm">This may take a few moments.</p>
                </div>
            </Card>
            )}
            
            {slides.length > 0 && (
                <>
                <div className="space-y-4">
                    {slides.map((slide, index) => (
                        <Card key={index} className="overflow-hidden bg-background/50">
                        <CardHeader className="p-4 sm:p-6">
                            <CardTitle className="flex justify-between items-start gap-4 text-lg md:text-xl">
                                <span className="flex-1">{index + 1}. {slide.title}</span>
                                <div className="flex items-center gap-1 shrink-0">
                                    <Button 
                                        variant="ghost" 
                                        size="icon"
                                        onClick={() => handleContentModification(index, 'expand')}
                                        disabled={contentModifyingIndex === index}
                                        title="Expand Content"
                                        className="h-8 w-8"
                                    >
                                        {contentModifyingIndex === index ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronsDownUp className="h-4 w-4" />}
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="icon"
                                        onClick={() => handleContentModification(index, 'shorten')}
                                        disabled={contentModifyingIndex === index}
                                        title="Shorten Content"
                                        className="h-8 w-8"
                                    >
                                        {contentModifyingIndex === index ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronsUpDown className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-start">
                            <ul className="list-disc list-inside space-y-2 text-foreground/80 text-sm">
                            {slide.content.map((point, i) => (
                                <li key={i}>{point}</li>
                            ))}
                            </ul>

                            <div className="space-y-4">
                                {slide.image ? (
                                    <div className="relative aspect-video">
                                        <Image src={slide.image} alt={`Slide ${index + 1} image`} fill={true} style={{objectFit:'cover'}} className="rounded-lg border" />
                                    </div>
                                ) : (
                                    <div className="relative aspect-video flex items-center justify-center bg-muted/30 rounded-lg border-2 border-dashed p-4">
                                        <p className="text-muted-foreground text-xs text-center">No image generated. Click below to create one.</p>
                                    </div>
                                )}
                                <Button
                                    variant="secondary"
                                    className="w-full text-xs"
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
                
                <Card className="bg-background/50">
                    <CardHeader className="p-4 sm:p-6">
                        <CardTitle className="flex items-center gap-2 text-lg">
                           <MessageCircle className="text-primary"/>
                           AI Director
                        </CardTitle>
                        <CardDescription className="text-xs">Not quite right? Give the AI feedback to revise the whole presentation.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0">
                       <div className="space-y-4">
                            <Textarea 
                                placeholder="e.g., 'Make it more professional' or 'Add a slide about financial risks'"
                                value={directorFeedback}
                                onChange={(e) => setDirectorFeedback(e.target.value)}
                                rows={3}
                                className="text-sm"
                            />
                            <Button onClick={handleDirectorSubmit} disabled={isRevising || !directorFeedback} className="w-full text-sm">
                                {isRevising ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Revising...</>
                                ) : (
                                    "Submit Feedback"
                                )}
                            </Button>
                       </div>
                    </CardContent>
                </Card>

                 <Card className="bg-background/50">
                    <CardHeader className="p-4 sm:p-6">
                        <CardTitle className="text-lg">Live Preview & Download</CardTitle>
                        <CardDescription className="text-xs">When you're ready, preview your presentation and download it as a PDF.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0 flex flex-col sm:flex-row justify-center items-center gap-3">
                        <Button variant="outline" onClick={() => setShowInlinePreview(!showInlinePreview)} disabled={isLoading || isRevising || slides.length === 0} className="w-full sm:w-auto text-xs">
                            <Eye className="mr-2 h-4 w-4" />
                            {showInlinePreview ? 'Hide Preview' : 'Show Live Preview'}
                        </Button>
                         <Button onClick={generateAndDownloadPdf} disabled={isProcessingPdf || slides.length === 0} className="w-full sm:w-auto text-xs">
                            {isProcessingPdf ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</>
                            ) : (
                            <><Download className="mr-2 h-4 w-4" />Download PDF</>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {showInlinePreview && slides.length > 0 && (
                    <div className="mt-8">
                        <PreviewSlides />
                    </div>
                )}
                </>
            )}
        </div>

    </div>
    </div>
    </div>
    </>
  );
}
