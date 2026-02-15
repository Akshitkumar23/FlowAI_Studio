
"use client";

import { enhancePptSlide, EnhancePptSlideOutput } from "@/ai/flows/enhance-ppt-slide-flow";
import { regenerateSlideImage, GenerateSlideImageInput } from "@/ai/flows/generate-presentation-flow";
import type { Slide } from "@/ai/schemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Wand2, RefreshCw, Download } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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

export default function PptEnhancerPage() {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<EnhancePptSlideOutput | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null);
  const [mode, setMode] = useState<'text' | 'image'>('text');
  const [style, setStyle] = useState('Professional');
  const [pdfTheme, setPdfTheme] = useState('Standard');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setText("");
      setMode('image');
      setSlides([]);
      setResult(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setImageFile(null);
    setPreview(null);
    setMode('text');
    setResult(null);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text && !imageFile) {
      alert("Please provide either text or an image.");
      return;
    }

    setIsLoading(true);
    setResult(null);
    setSlides([]);

    try {
      let imageUri: string | undefined = undefined;
      if (imageFile) {
        imageUri = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
      }
      const response = await enhancePptSlide({ text: text || undefined, imageUri, style });
      if (response.slides && response.slides.length > 0) {
        setSlides(response.slides);
      } else {
        setResult(response);
      }
    } catch (error) {
      console.error("Error enhancing slide:", error);
      alert("Failed to enhance slide. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateImage = async (index: number) => {
    setRegeneratingIndex(index);
    const slide = slides[index];
    const input: GenerateSlideImageInput = {
      topic: slide.title,
      style: style,
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
  
    const handleDownloadPdf = async () => {
    if (slides.length === 0) return;
    setIsDownloading(true);

    const theme = pdfThemes.find(t => t.name === pdfTheme) || pdfThemes[0];
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [1280, 720]
    });

    const presentationTopic = slides[0]?.title || "Presentation";

    for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.width = '1280px';
        tempContainer.style.height = '720px';
        tempContainer.style.fontFamily = 'Inter, sans-serif';
        tempContainer.style.boxSizing = 'border-box';
        tempContainer.style.background = theme.background;
        tempContainer.style.color = theme.text;
        document.body.appendChild(tempContainer);
        
        let slideContentHtml = '';
  
        const preloadImage = (src: string): Promise<HTMLImageElement | null> => {
          return new Promise((resolve) => {
              if (!src || src.startsWith('https://placehold.co')) {
                resolve(null);
                return;
              }
              const img = new window.Image();
              img.crossOrigin = "anonymous";
              img.onload = () => resolve(img);
              img.onerror = () => {
                  console.error(`Failed to load image: ${src}`);
                  resolve(null);
              }
              img.src = src;
          });
        };
  
        try {
          const loadedImg = await preloadImage(slide.image || '');
          
          const titleHtml = `<div style="font-size: 48px; font-weight: 800; color: ${theme.title}; padding: 0; margin-bottom: 24px; text-align: left; line-height: 1.2;">${slide.title}</div>`;
          const contentHtml = `<ul style="list-style: none; padding: 0; margin: 0; font-size: 26px; line-height: 1.6;">${slide.content.map(point => `<li style="margin-bottom: 16px; display: flex; align-items: flex-start;"><span style="margin-right: 16px; margin-top: 6px; font-size: 24px; color: ${theme.title};">&#9679;</span><span>${point}</span></li>`).join('')}</ul>`;
          const footerHtml = `<div style="position: absolute; bottom: 30px; left: 60px; font-size: 14px; color: ${theme.text}; opacity: 0.7;">${presentationTopic} - Slide ${i + 1}</div>`;
          
          const textContentDiv = `<div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">${titleHtml}${contentHtml}</div>`;
          const imageDiv = loadedImg ? `<div style="flex: 1; display: flex; align-items: center; justify-content: center; height: 100%;"><img src="${loadedImg.src}" style="max-width: 100%; max-height: 580px; object-fit: cover; border-radius: 12px; box-shadow: 0 10px 20px rgba(0,0,0,0.1);"></div>` : '';
          
          const layoutType = loadedImg ? slideLayouts[i % slideLayouts.length] : 'text-only';
          
          switch(layoutType) {
            case 'left-image':
               slideContentHtml = `
                  <div style="display: flex; width: 100%; height: 100%; padding: 60px 60px 80px 60px; box-sizing: border-box; align-items: center; gap: 50px;">
                      ${imageDiv}
                      ${textContentDiv}
                  </div>
                  ${footerHtml}
               `;
               break;
            case 'right-image':
               slideContentHtml = `
                  <div style="display: flex; width: 100%; height: 100%; padding: 60px 60px 80px 60px; box-sizing: border-box; align-items: center; gap: 50px;">
                      ${textContentDiv}
                      ${imageDiv}
                  </div>
                  ${footerHtml}
               `;
               break;
            case 'text-only':
            default:
                slideContentHtml = `
                  <div style="display: flex; flex-direction: column; justify-content: center; width: 100%; height: 100%; padding: 80px 60px; box-sizing: border-box; text-align: left;">
                      ${titleHtml}
                      ${contentHtml}
                  </div>
                  ${footerHtml}
              `;
              break;
          }
          
          tempContainer.innerHTML = slideContentHtml;
          
          const canvas = await html2canvas(tempContainer, { 
              useCORS: true, 
              scale: 2, 
              logging: false,
              backgroundColor: null
          });
          const imgData = canvas.toDataURL('image/png');
          
          if (i > 0) doc.addPage();
          doc.addImage(imgData, 'PNG', 0, 0, 1280, 720);
  
        } catch(err) {
          console.error("Error rendering slide to canvas:", err);
          if (i > 0) doc.addPage();
          doc.text("Error rendering this slide.", 40, 40);
        } finally {
          document.body.removeChild(tempContainer);
        }
      }

    doc.save(`${presentationTopic.replace(/\s+/g, '-')}-presentation.pdf`);
    setIsDownloading(false);
  };


  return (
    <div className="min-h-full animated-gradient-bg">
    <div className="container py-8">
      <PageHeader
        title="PPT Slide Enhancer"
        description="Redesign an existing slide image or generate a full presentation from your raw text content."
      />

      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="glass">
          <CardHeader>
            <CardTitle>Enhance Your Content</CardTitle>
            <CardDescription>Upload an image to redesign, or paste your text to generate a presentation.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-2">
                  <Label htmlFor="text-input" className={mode === 'text' ? 'text-primary' : ''}>Create Presentation from Text</Label>
                  <Textarea
                    id="text-input"
                    placeholder="Paste your document, notes, or script here..."
                    value={text}
                    onChange={handleTextChange}
                    disabled={!!imageFile}
                    rows={12}
                    className={mode === 'image' ? 'bg-muted/30' : ''}
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="image-upload" className={mode === 'image' ? 'text-primary' : ''}>Redesign Slide from Image</Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={!!text}
                      className={`h-12 ${mode === 'text' ? 'bg-muted/30' : ''}`}
                    />
                  </div>
                  {preview && (
                    <div className="mt-4">
                      <Image src={preview} alt="Image preview" width={400} height={225} className="w-full rounded-lg object-contain border" />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="style-select">Image Style (for text mode)</Label>
                    <Select onValueChange={setStyle} defaultValue={style} disabled={mode === 'image'}>
                      <SelectTrigger id="style-select">
                        <SelectValue placeholder="Select a style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Professional">Professional</SelectItem>
                        <SelectItem value="Creative">Creative</SelectItem>
                        <SelectItem value="Minimalist">Minimalist</SelectItem>
                        <SelectItem value="Futuristic">Futuristic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="theme-select">PDF Theme (for text mode)</Label>
                     <Select onValueChange={setPdfTheme} defaultValue={pdfTheme} disabled={mode === 'image'}>
                      <SelectTrigger id="theme-select">
                        <SelectValue placeholder="Select a theme" />
                      </SelectTrigger>
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
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" disabled={isLoading || (!text && !imageFile)} className="w-full" size="lg">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {mode === 'text' ? 'Generating Presentation...' : 'Redesigning Image...'}
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      {mode === 'text' ? 'Generate Presentation' : 'Redesign Image'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {isLoading && (
          <Card className="glass flex items-center justify-center h-64 animate-pulse-bg">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <p className="mt-4 text-muted-foreground">AI is processing your request...</p>
            </div>
          </Card>
        )}

        {slides.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center">Generated Presentation</h2>
            {slides.map((slide, index) => (
              <Card key={index} className="glass overflow-hidden">
                <CardHeader>
                  <CardTitle>{index + 1}. {slide.title}</CardTitle>
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
                        <Image src={slide.image} alt={`Slide ${index + 1} image`} fill={true} style={{ objectFit: 'cover' }} className="rounded-lg border" />
                      </div>
                    ) : (
                      <div className="relative aspect-video flex items-center justify-center bg-muted/30 rounded-lg border-2 border-dashed">
                        <p className="text-muted-foreground">No image generated</p>
                      </div>
                    )}
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() => handleRegenerateImage(index)}
                      disabled={regeneratingIndex === index}
                    >
                      {regeneratingIndex === index ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="mr-2 h-4 w-4" />
                      )}
                      {regeneratingIndex === index ? 'Generating...' : (slide.image ? 'Regenerate Image' : 'Generate Image')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
             <div className="flex justify-center mt-8">
              <Button onClick={handleDownloadPdf} disabled={isDownloading || isLoading} size="lg">
                {isDownloading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Downloading PDF...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download as PDF
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {result && result.image && (
          <div className="space-y-8">
             <h2 className="text-3xl font-bold text-center">Redesigned Image</h2>
            <Card className="glass overflow-hidden">
              <CardContent className="p-6">
                <div className="relative aspect-video">
                    <Image src={result.image} alt="Redesigned slide" fill={true} style={{objectFit: 'cover'}} className="rounded-lg border" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}

    