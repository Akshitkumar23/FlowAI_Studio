
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PlusCircle, Trash2, Download, User, Briefcase, GraduationCap, Star, Globe, Award, Mail, Phone, MapPin, Palette, Wand2, Eye, X, Lightbulb, CheckCircle } from "lucide-react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { aiResumeEnhancer } from "@/ai/flows/ai-resume-enhancer-flow";
import { useToast } from "@/hooks/use-toast";
import type { AIResumeEnhancerInput } from "@/ai/schemas";
import { proactiveResumeAnalyst } from "@/ai/flows/proactive-resume-analyst-flow";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogFooter } from "@/components/ui/dialog";
import * as React from "react";
import { cn } from "@/lib/utils";


const resumeSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  photo: z.any().optional(),
  profileSummary: z.string().min(10, "Profile summary should be at least 10 characters"),
  workExperience: z.array(z.object({
    jobTitle: z.string().min(1, "Job title is required"),
    company: z.string().min(1, "Company name is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    description: z.string().min(1, "Description is required"),
  })),
  education: z.array(z.object({
    degree: z.string().min(1, "Degree is required"),
    institution: z.string().min(1, "Institution is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    percentage: z.string().optional(),
  })),
  skills: z.array(z.object({ value: z.string().min(1, "Skill cannot be empty") })),
  languages: z.array(z.object({ value: z.string().min(1, "Language cannot be empty") })),
  certificates: z.array(z.object({ value: z.string().min(1, "Certificate cannot be empty") })),
});

type ResumeFormValues = z.infer<typeof resumeSchema>;


const ResumePreview = ({ data, photoPreview, leftColumnColor, headingColor }: { data: Partial<ResumeFormValues>, photoPreview: string | null, leftColumnColor: string, headingColor: string }) => {
    
    const headingStyle = { color: headingColor };
    const leftColumnStyle = { backgroundColor: leftColumnColor };
    
    return (
        <div className="w-[8.5in] min-h-[11in] bg-white text-black p-8 shadow-lg font-sans text-base">
            <div className="grid grid-cols-3 gap-8 h-full">
                {/* Left Column */}
                <div className="col-span-1 p-6 rounded-md space-y-8" style={leftColumnStyle}>
                    {photoPreview && <Image src={photoPreview} alt="Profile Photo" width={150} height={150} className="w-[150px] h-[150px] rounded-full mx-auto object-cover border-4 border-white shadow-md" />}
                    
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest border-b-2 pb-2" style={{ borderColor: headingColor, color: headingColor }}>Contact</h3>
                        <div className="space-y-2 text-xs">
                            {data.email && <div className="flex items-center gap-2 break-all"><Mail className="h-4 w-4"/><span>{data.email}</span></div>}
                            {data.phoneNumber && <div className="flex items-center gap-2"><Phone className="h-4 w-4"/><span>{data.phoneNumber}</span></div>}
                            {data.address && <div className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5"/><span>{data.address}</span></div>}
                        </div>
                    </div>

                    {data.skills && data.skills.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest border-b-2 pb-2" style={{ borderColor: headingColor, color: headingColor }}>Skills</h3>
                            <ul className="space-y-1 text-xs list-disc list-inside">
                                {data.skills.map((skill, i) => skill.value && <li key={i}>{skill.value}</li>)}
                            </ul>
                        </div>
                    )}

                    {data.languages && data.languages.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest border-b-2 pb-2" style={{ borderColor: headingColor, color: headingColor }}>Languages</h3>
                            <ul className="space-y-1 text-xs list-disc list-inside">
                                {data.languages.map((lang, i) => lang.value && <li key={i}>{lang.value}</li>)}
                            </ul>
                        </div>
                    )}

                    {data.certificates && data.certificates.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest border-b-2 pb-2" style={{ borderColor: headingColor, color: headingColor }}>Certificates</h3>
                            <ul className="space-y-1 text-xs list-disc list-inside">
                                {data.certificates.map((cert, i) => cert.value && <li key={i}>{cert.value}</li>)}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div className="col-span-2">
                    <div className="text-left mb-8">
                        <h1 className="text-4xl font-extrabold tracking-tight" style={headingStyle}>{data.fullName || "Your Name"}</h1>
                        <h2 className="text-xl font-medium">{data.jobTitle || "Your Job Title"}</h2>
                    </div>

                    <div className="space-y-8">
                        {data.profileSummary && (
                            <div>
                                <h3 className="text-lg font-bold uppercase tracking-wider border-b-2 pb-2 mb-4" style={headingStyle}>Profile</h3>
                                <p className="text-sm leading-relaxed">{data.profileSummary}</p>
                            </div>
                        )}

                        {data.workExperience && data.workExperience.length > 0 && (
                            <div>
                                <h3 className="text-lg font-bold uppercase tracking-wider border-b-2 pb-2 mb-4" style={headingStyle}>Work Experience</h3>
                                <div className="space-y-6">
                                    {data.workExperience.map((exp, i) => exp.jobTitle && (
                                        <div key={i} className="text-sm">
                                            <div className="flex justify-between items-baseline">
                                                <h4 className="font-bold text-base">{exp.jobTitle}</h4>
                                                <div className="text-xs">{exp.startDate} - {exp.endDate || 'Present'}</div>
                                            </div>
                                            <div className="font-medium">{exp.company}</div>
                                            <p className="mt-2 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {data.education && data.education.length > 0 && (
                             <div>
                                <h3 className="text-lg font-bold uppercase tracking-wider border-b-2 pb-2 mb-4" style={headingStyle}>Education</h3>
                                <div className="space-y-4">
                                    {data.education.map((edu, i) => edu.degree && (
                                        <div key={i} className="text-sm">
                                            <div className="flex justify-between items-baseline">
                                                <h4 className="font-bold text-base">{edu.degree}</h4>
                                                <div className="text-xs">{edu.startDate} - {edu.endDate || 'Present'}</div>
                                            </div>
                                            <div className="font-medium">{edu.institution}</div>
                                            {edu.percentage && <div className="mt-1">Percentage/GPA: {edu.percentage}</div>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default function ResumeBuilderPage() {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isBuildingWithAI, setIsBuildingWithAI] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [leftColumnColor, setLeftColumnColor] = useState("#f1f5f9"); // slate-100
  const [headingColor, setHeadingColor] = useState("#334155"); // slate-700
  const [suggestions, setSuggestions] = useState<Record<number, string | null>>({});
  const [analyzingIndex, setAnalyzingIndex] = useState<number | null>(null);
  const [scale, setScale] = useState(1);

  const { toast } = useToast();
  const resumePreviewRef = React.useRef<HTMLDivElement>(null);
  const previewCardRef = useRef<HTMLDivElement>(null);


  const calculateScale = useCallback(() => {
    if (previewCardRef.current) {
      const parentWidth = previewCardRef.current.offsetWidth;
      const resumeWidth = 8.5 * 96; // 8.5 inches at 96 DPI
      const padding = 16; 
      setScale(Math.min(1, (parentWidth - padding) / resumeWidth));
    }
  }, []);

  useEffect(() => {
    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, [calculateScale]);

  const form = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      fullName: "",
      jobTitle: "",
      email: "",
      phoneNumber: "",
      address: "",
      profileSummary: "",
      workExperience: [],
      education: [],
      skills: [{value: ""}],
      languages: [{value: ""}],
      certificates: [{value: ""}],
    },
  });

  const { fields: skills, append: appendSkill, remove: removeSkill } = useFieldArray({ control: form.control, name: "skills" });
  const { fields: languages, append: appendLanguage, remove: removeLanguage } = useFieldArray({ control: form.control, name: "languages" });
  const { fields: certificates, append: appendCertificate, remove: removeCertificate } = useFieldArray({ control: form.control, name: "certificates" });
  const { fields: workExperience, append: appendWork, remove: removeWork } = useFieldArray({ control: form.control, name: "workExperience" });
  const { fields: education, append: appendEducation, remove: removeEducation } = useFieldArray({ control: form.control, name: "education" });

  const watchedData = form.watch();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      form.setValue("photo", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBuildWithAI = async () => {
    const values = form.getValues();
    
    if (!values.fullName || !values.jobTitle || values.workExperience.length === 0) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please fill in your Full Name, Job Title, and at least one Work Experience entry to use the AI builder.",
        });
        return;
    }
    
    setIsBuildingWithAI(true);
    toast({
        title: "AI is at work!",
        description: "Enhancing your resume content...",
    });
    try {
        const input: AIResumeEnhancerInput = {
            fullName: values.fullName,
            jobTitle: values.jobTitle,
            profileSummary: values.profileSummary,
            workExperience: values.workExperience,
            skills: values.skills
        };
        const result = await aiResumeEnhancer(input);
        
        form.setValue('profileSummary', result.profileSummary);
        result.enhancedWorkExperience.forEach(exp => {
            form.setValue(`workExperience.${exp.originalIndex}.description`, exp.enhancedDescription);
        });

        toast({
            title: "Success!",
            description: "Your resume has been enhanced by AI.",
            variant: "default",
            className: "bg-green-500 text-white"
        });

    } catch (error) {
        console.error("Error building with AI", error);
        toast({
            variant: "destructive",
            title: "AI Error",
            description: "Could not enhance the resume. Please try again.",
        });
    } finally {
        setIsBuildingWithAI(false);
    }
  };
  
  const handleDownloadPdf = async () => {
    if (!resumePreviewRef.current) return;
    setIsDownloading(true);

    try {
      const canvas = await html2canvas(resumePreviewRef.current, {
        scale: 2, 
        useCORS: true,
        logging: false,
        backgroundColor: null
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const fullName = form.getValues("fullName") || "resume";
      pdf.save(`${fullName.replace(/\s+/g, '-')}.pdf`);

    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        variant: "destructive",
        title: "PDF Error",
        description: "Could not generate the PDF. Please try again.",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleAnalyzeDescription = async (index: number) => {
    const description = form.getValues(`workExperience.${index}.description`);
    if (!description || description.length < 20) {
      setSuggestions(prev => ({...prev, [index]: null}));
      return;
    };

    setAnalyzingIndex(index);
    try {
      const result = await proactiveResumeAnalyst({ description });
      if (result.hasSuggestion && result.suggestion) {
        setSuggestions(prev => ({ ...prev, [index]: result.suggestion! }));
      } else {
        setSuggestions(prev => ({ ...prev, [index]: null }));
      }
    } catch (error) {
      console.error("Error analyzing description:", error);
    } finally {
      setAnalyzingIndex(null);
    }
  }

  const applySuggestion = (index: number) => {
    if(suggestions[index]) {
        const currentDescription = form.getValues(`workExperience.${index}.description`);
        form.setValue(`workExperience.${index}.description`, `${currentDescription}\n\n${suggestions[index]}`);
        setSuggestions(prev => ({...prev, [index]: null}));
    }
  }

  return (
    <>
      <div className="min-h-full animated-gradient-bg px-2 sm:px-4">
        <div className="container py-6 md:py-8">
          <PageHeader
            title="Professional Resume Builder"
            description="Create a stunning, professional resume and download it as a PDF. AI assistants help you refine your content."
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start max-w-7xl mx-auto">
              {/* Form Section */}
              <div className="space-y-6 order-2 lg:order-1">
                  <FormProvider {...form}>
                  <form className="space-y-6">
                      <Card className="glass">
                          <CardHeader className="p-4 sm:p-6"><CardTitle className="flex items-center gap-2 text-lg md:text-xl"><Palette className="w-5 h-5"/> Theme & Colors</CardTitle></CardHeader>
                          <CardContent className="p-4 sm:p-6 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                  <Label htmlFor="left-column-color">Left Column Color</Label>
                                  <div className="flex items-center gap-2">
                                      <Input id="left-column-color" type="color" value={leftColumnColor} onChange={(e) => setLeftColumnColor(e.target.value)} className="p-1 h-10 w-14"/>
                                      <Input type="text" value={leftColumnColor} onChange={(e) => setLeftColumnColor(e.target.value)} className="text-xs sm:text-sm"/>
                                  </div>
                              </div>
                               <div className="space-y-2">
                                  <Label htmlFor="heading-color">Headings Color</Label>
                                  <div className="flex items-center gap-2">
                                      <Input id="heading-color" type="color" value={headingColor} onChange={(e) => setHeadingColor(e.target.value)} className="p-1 h-10 w-14"/>
                                      <Input type="text" value={headingColor} onChange={(e) => setHeadingColor(e.target.value)} className="text-xs sm:text-sm"/>
                                  </div>
                              </div>
                          </CardContent>
                      </Card>

                      <Card className="glass">
                          <CardHeader className="p-4 sm:p-6"><CardTitle className="flex items-center gap-2 text-lg md:text-xl"><User className="w-5 h-5"/> Personal Details</CardTitle></CardHeader>
                          <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
                             <div className="flex flex-col sm:flex-row items-center gap-4">
                                 <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-muted flex items-center justify-center border shrink-0">
                                    {photoPreview ? <Image src={photoPreview} alt="preview" width={96} height={96} className="rounded-full object-cover w-full h-full"/> : <User className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground"/>}
                                 </div>
                                 <FormField name="photo" control={form.control} render={({ field }) => (
                                     <FormItem className="flex-grow w-full">
                                         <FormLabel>Profile Photo</FormLabel>
                                         <FormControl>
                                             <Input type="file" accept="image/*" onChange={handlePhotoChange} className="text-xs sm:text-sm"/>
                                         </FormControl>
                                     </FormItem>
                                 )}/>
                             </div>
                             <FormField name="fullName" control={form.control} render={({ field }) => (
                                 <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="e.g. John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                             )}/>
                             <FormField name="jobTitle" control={form.control} render={({ field }) => (
                                 <FormItem><FormLabel>Job Title</FormLabel><FormControl><Input placeholder="e.g. Software Engineer" {...field} /></FormControl><FormMessage /></FormItem>
                             )}/>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                 <FormField name="email" control={form.control} render={({ field }) => (
                                     <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="e.g. email@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                                 )}/>
                                 <FormField name="phoneNumber" control={form.control} render={({ field }) => (
                                     <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="e.g. +1 123-456-7890" {...field} /></FormControl><FormMessage /></FormItem>
                                 )}/>
                             </div>
                              <FormField name="address" control={form.control} render={({ field }) => (
                                 <FormItem><FormLabel>Address</FormLabel><FormControl><Input placeholder="e.g. San Francisco, CA" {...field} /></FormControl><FormMessage /></FormItem>
                             )}/>
                             <FormField name="profileSummary" control={form.control} render={({ field }) => (
                                 <FormItem><FormLabel>Profile Summary</FormLabel><FormControl><Textarea rows={4} placeholder="A brief summary about your professional background..." {...field} /></FormControl><FormMessage /></FormItem>
                             )}/>
                          </CardContent>
                      </Card>

                      <Card className="glass">
                          <CardHeader className="p-4 sm:p-6"><CardTitle className="flex items-center gap-2 text-lg md:text-xl"><Briefcase className="w-5 h-5"/> Work Experience</CardTitle></CardHeader>
                          <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
                              {workExperience.map((field, index) => (
                                  <div key={field.id} className="p-3 sm:p-4 border rounded-md relative space-y-3 bg-background/20">
                                       <FormField name={`workExperience.${index}.jobTitle`} render={({ field }) => (
                                          <FormItem><FormLabel>Job Title</FormLabel><FormControl><Input placeholder="e.g., Senior Developer" {...field} /></FormControl><FormMessage /></FormItem>
                                      )}/>
                                       <FormField name={`workExperience.${index}.company`} render={({ field }) => (
                                          <FormItem><FormLabel>Company</FormLabel><FormControl><Input placeholder="e.g., Google" {...field} /></FormControl><FormMessage /></FormItem>
                                      )}/>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <FormField name={`workExperience.${index}.startDate`} render={({ field }) => (
                                            <FormItem><FormLabel>Start Date</FormLabel><FormControl><Input placeholder="e.g., May 2020" {...field} /></FormControl><FormMessage /></FormItem>
                                        )}/>
                                        <FormField name={`workExperience.${index}.endDate`} render={({ field }) => (
                                            <FormItem><FormLabel>End Date (optional)</FormLabel><FormControl><Input placeholder="e.g., Present" {...field} /></FormControl><FormMessage /></FormItem>
                                        )}/>
                                      </div>
                                      <FormField name={`workExperience.${index}.description`} render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Description of Responsibilities</FormLabel>
                                            <FormControl><Textarea rows={4} placeholder="Describe your role and achievements..." {...field} onBlur={() => handleAnalyzeDescription(index)} /></FormControl>
                                            <FormMessage />
                                          </FormItem>
                                      )}/>
                                      {analyzingIndex === index && (
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground"><Loader2 className="h-3 w-3 animate-spin"/>AI is analyzing...</div>
                                      )}
                                      {suggestions[index] && (
                                        <div className="bg-primary/10 border-l-4 border-primary p-3 rounded-r-md">
                                            <div className="flex items-start gap-2">
                                                <Lightbulb className="h-4 w-4 text-primary mt-1 flex-shrink-0"/>
                                                <div className="flex-grow">
                                                    <p className="font-semibold text-xs sm:text-sm">AI Suggestion</p>
                                                    <p className="text-[10px] sm:text-xs text-muted-foreground">{suggestions[index]}</p>
                                                </div>
                                                <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={() => applySuggestion(index)}>
                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                </Button>
                                            </div>
                                        </div>
                                      )}
                                      <Button type="button" variant="destructive" size="icon" onClick={() => removeWork(index)} className="absolute top-2 right-2 h-7 w-7"><Trash2 className="h-4 w-4"/></Button>
                                  </div>
                              ))}
                              <Button type="button" variant="outline" className="w-full text-xs sm:text-sm" onClick={() => appendWork({ jobTitle: "", company: "", startDate: "", endDate: "", description: "" })}><PlusCircle className="mr-2 h-4 w-4"/> Add Experience</Button>
                          </CardContent>
                      </Card>
                      
                      <Card className="glass">
                          <CardHeader className="p-4 sm:p-6"><CardTitle className="flex items-center gap-2 text-lg md:text-xl"><GraduationCap className="w-5 h-5"/> Education</CardTitle></CardHeader>
                          <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
                              {education.map((field, index) => (
                                  <div key={field.id} className="p-3 sm:p-4 border rounded-md relative space-y-3 bg-background/20">
                                       <FormField name={`education.${index}.degree`} render={({ field }) => (
                                          <FormItem><FormLabel>Degree / Certificate</FormLabel><FormControl><Input placeholder="e.g., B.S. in Computer Science" {...field} /></FormControl><FormMessage /></FormItem>
                                      )}/>
                                       <FormField name={`education.${index}.institution`} render={({ field }) => (
                                          <FormItem><FormLabel>Institution</FormLabel><FormControl><Input placeholder="e.g., Stanford University" {...field} /></FormControl><FormMessage /></FormItem>
                                      )}/>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <FormField name={`education.${index}.startDate`} render={({ field }) => (
                                            <FormItem><FormLabel>Start Date</FormLabel><FormControl><Input placeholder="e.g., Aug 2016" {...field} /></FormControl><FormMessage /></FormItem>
                                        )}/>
                                        <FormField name={`education.${index}.endDate`} render={({ field }) => (
                                            <FormItem><FormLabel>End Date (optional)</FormLabel><FormControl><Input placeholder="e.g., May 2020" {...field} /></FormControl><FormMessage /></FormItem>
                                        )}/>
                                      </div>
                                       <FormField name={`education.${index}.percentage`} render={({ field }) => (
                                          <FormItem><FormLabel>Percentage/GPA (optional)</FormLabel><FormControl><Input placeholder="e.g., 3.8 GPA" {...field} /></FormControl><FormMessage /></FormItem>
                                      )}/>
                                      <Button type="button" variant="destructive" size="icon" onClick={() => removeEducation(index)} className="absolute top-2 right-2 h-7 w-7"><Trash2 className="h-4 w-4"/></Button>
                                  </div>
                              ))}
                              <Button type="button" variant="outline" className="w-full text-xs sm:text-sm" onClick={() => appendEducation({ degree: "", institution: "", startDate: "", endDate: "", percentage: "" })}><PlusCircle className="mr-2 h-4 w-4"/> Add Education</Button>
                          </CardContent>
                      </Card>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <Card className="glass">
                              <CardHeader className="p-4 sm:p-6"><CardTitle className="flex items-center gap-2 text-base"><Star className="w-4 h-4"/> Skills</CardTitle></CardHeader>
                              <CardContent className="p-4 sm:p-6 pt-0 space-y-3">
                                  {skills.map((field, index) => (
                                      <div key={field.id} className="flex items-center gap-2">
                                          <FormField name={`skills.${index}.value`} render={({ field }) => (
                                              <FormItem className="flex-grow"><FormControl><Input {...field} placeholder="e.g. Project Management" className="text-xs sm:text-sm"/></FormControl></FormItem>
                                          )}/>
                                          <Button type="button" variant="ghost" size="icon" onClick={() => removeSkill(index)} className="h-8 w-8"><Trash2 className="h-4 w-4 text-red-500"/></Button>
                                      </div>
                                  ))}
                                  <Button type="button" variant="outline" size="sm" className="w-full text-xs" onClick={() => appendSkill({value: ""})}><PlusCircle className="mr-2 h-3 w-3"/> Add Skill</Button>
                              </CardContent>
                          </Card>
                          <Card className="glass">
                              <CardHeader className="p-4 sm:p-6"><CardTitle className="flex items-center gap-2 text-base"><Globe className="w-4 h-4"/> Languages</CardTitle></CardHeader>
                              <CardContent className="p-4 sm:p-6 pt-0 space-y-3">
                                  {languages.map((field, index) => (
                                      <div key={field.id} className="flex items-center gap-2">
                                          <FormField name={`languages.${index}.value`} render={({ field }) => (
                                              <FormItem className="flex-grow"><FormControl><Input {...field} placeholder="e.g. English" className="text-xs sm:text-sm"/></FormControl><FormMessage /></FormItem>
                                          )}/>
                                          <Button type="button" variant="ghost" size="icon" onClick={() => removeLanguage(index)} className="h-8 w-8"><Trash2 className="h-4 w-4 text-red-500"/></Button>
                                      </div>
                                  ))}
                                  <Button type="button" variant="outline" size="sm" className="w-full text-xs" onClick={() => appendLanguage({value: ""})}><PlusCircle className="mr-2 h-3 w-3"/> Add Language</Button>
                              </CardContent>
                          </Card>
                      </div>

                      <Card className="glass">
                          <CardHeader className="p-4 sm:p-6"><CardTitle className="flex items-center gap-2 text-base"><Award className="w-4 h-4"/> Certificates</CardTitle></CardHeader>
                          <CardContent className="p-4 sm:p-6 pt-0 space-y-3">
                              {certificates.map((field, index) => (
                                  <div key={field.id} className="flex items-center gap-2">
                                      <FormField name={`certificates.${index}.value`} render={({ field }) => (
                                          <FormItem className="flex-grow"><FormControl><Input {...field} placeholder="e.g. Certified React Developer" className="text-xs sm:text-sm"/></FormControl><FormMessage /></FormItem>
                                      )}/>
                                      <Button type="button" variant="ghost" size="icon" onClick={() => removeCertificate(index)} className="h-8 w-8"><Trash2 className="h-4 w-4 text-red-500"/></Button>
                                  </div>
                              ))}
                              <Button type="button" variant="outline" size="sm" className="w-full text-xs" onClick={() => appendCertificate({value: ""})}><PlusCircle className="mr-2 h-3 w-3"/> Add Certificate</Button>
                          </CardContent>
                      </Card>

                      <div className="flex flex-col gap-4 pt-4">
                        <Button type="button" size="lg" onClick={handleBuildWithAI} disabled={isBuildingWithAI} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-sm">
                          {isBuildingWithAI ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4" />}
                          {isBuildingWithAI ? 'Enhancing with AI...' : 'Enhance Full Resume with AI'}
                        </Button>
                        <Button type="button" size="lg" onClick={() => setIsPreviewOpen(true)} className="w-full text-sm">
                          <Eye className="mr-2 h-4 w-4" />
                          Preview & Download PDF
                        </Button>
                      </div>
                  </form>
                  </FormProvider>
              </div>
              
              {/* Preview Section */}
              <div className="lg:sticky lg:top-8 order-1 lg:order-2 mb-6 lg:mb-0">
                  <Card className="glass">
                      <CardHeader className="p-4 sm:p-6">
                          <CardTitle className="text-lg">Live Preview</CardTitle>
                          <CardDescription className="text-xs">Your progress updates in real-time.</CardDescription>
                      </CardHeader>
                      <CardContent ref={previewCardRef} className="p-2 sm:p-4 flex justify-center items-start min-h-[300px]">
                          <div className="overflow-hidden bg-gray-200 rounded-lg flex justify-center w-full">
                               <div 
                                style={{ 
                                  transform: `scale(${scale})`,
                                  transformOrigin: 'top center',
                                  marginBottom: `${(1 - scale) * -1100}px` 
                                }}
                                className="transition-transform duration-300"
                               >
                                  <ResumePreview data={watchedData} photoPreview={photoPreview} leftColumnColor={leftColumnColor} headingColor={headingColor} />
                               </div>
                          </div>
                      </CardContent>
                  </Card>
              </div>
          </div>
        </div>
      </div>
      
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl w-full h-[95vh] flex flex-col p-0 bg-background/90 backdrop-blur-md">
            <DialogHeader className="p-4 border-b flex-row flex justify-between items-center shrink-0">
                <DialogTitle className="text-base sm:text-lg">Resume Preview</DialogTitle>
                <DialogClose asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <X className="h-4 w-4" />
                      <span className="sr-only">Close</span>
                    </Button>
                </DialogClose>
            </DialogHeader>
            <div className="flex-grow overflow-auto bg-gray-200 p-4 sm:p-8 flex items-start justify-center">
                <div ref={resumePreviewRef} className="origin-top transition-transform duration-300">
                   {isPreviewOpen && <ResumePreview data={watchedData} photoPreview={photoPreview} leftColumnColor={leftColumnColor} headingColor={headingColor} />}
                </div>
            </div>
            <DialogFooter className="p-4 border-t flex flex-col sm:flex-row gap-3 sm:justify-between shrink-0">
                <Button variant="secondary" onClick={handleBuildWithAI} disabled={isBuildingWithAI} className="w-full sm:w-auto text-xs">
                    {isBuildingWithAI ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4" />}
                    {isBuildingWithAI ? 'Regenerating...' : 'Regenerate with AI'}
                </Button>
                <Button onClick={handleDownloadPdf} disabled={isDownloading} className="w-full sm:w-auto text-xs">
                {isDownloading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Downloading...
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
