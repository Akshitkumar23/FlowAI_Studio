
"use client";

import { useState, useEffect } from "react";
import * as React from 'react';
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/PageHeader";
import { Loader2, Sparkles, Bot, Copy, Check, Save, UserCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
    generateBlog, 
    generateEmailTemplate,
    generateProductDescription,
    generateSocialMediaCaptions,
} from "@/ai/flows/writing-assistant-flow";
import { 
    BlogWriterInputSchema,
    EmailTemplateInputSchema,
    ProductDescriptionInputSchema,
    SocialMediaCaptionInputSchema,
    UserProfileSchema
} from '@/ai/schemas';
import { cn } from "@/lib/utils";

type ProfileFormValues = z.infer<typeof UserProfileSchema>;


const getProfile = (): Partial<ProfileFormValues> => {
    try {
        if (typeof window === 'undefined') return {};
        const storedProfile = localStorage.getItem('userProfile');
        return storedProfile ? JSON.parse(storedProfile) : {};
    } catch (error) {
        console.error("Failed to parse user profile from localStorage", error);
        return {};
    }
}

const ResultCard = ({ title, content }: { title: string, content: React.ReactNode }) => {
    const [isCopied, setIsCopied] = useState(false);
    const handleCopy = () => {
        const textToCopy = (node: React.ReactNode): string => {
            if (typeof node === 'string') return node;
            if (typeof node === 'number') return String(node);
            if (Array.isArray(node)) return node.map(textToCopy).join('');
            if (React.isValidElement(node) && node.props.children) {
                return React.Children.map(node.props.children, textToCopy).join('');
            }
            return '';
        };

        const finalContent = textToCopy(content);
        if(finalContent) {
            navigator.clipboard.writeText(finalContent.replace(/•/g, ''));
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    return (
        <Card className="glass mt-6 animate-fade-in-up">
            <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl"><Bot className="w-5 h-5"/> {title}</CardTitle>
                 <Button variant="ghost" size="icon" onClick={handleCopy} className="h-8 w-8">
                    {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
                <div className="bg-background/50 p-3 sm:p-4 rounded-md whitespace-pre-wrap text-xs sm:text-sm leading-relaxed">{content}</div>
            </CardContent>
        </Card>
    );
};

const BlogWriterForm = () => {
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof BlogWriterInputSchema>>({ 
        resolver: zodResolver(BlogWriterInputSchema), 
        defaultValues: { topic: "", tone: "Professional", keywords: "" }
    });
    
    const onSubmit = async (values: z.infer<typeof BlogWriterInputSchema>) => {
        setIsLoading(true);
        setResult(null);
        try {
            const profile = getProfile();
            const response = await generateBlog({...values, profile});
            setResult(response.content);
        } catch(e) { console.error(e) }
        setIsLoading(false);
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField name="topic" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Topic</FormLabel>
                        <FormControl><Input placeholder="e.g., The Future of Artificial Intelligence" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField name="tone" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tone of Voice</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="Professional">Professional</SelectItem>
                                    <SelectItem value="Casual">Casual</SelectItem>
                                    <SelectItem value="Enthusiastic">Enthusiastic</SelectItem>
                                    <SelectItem value="Informative">Informative</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField name="keywords" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Keywords (optional)</FormLabel>
                            <FormControl><Input placeholder="e.g., AI, machine learning, future" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </div>
                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate Blog</>}
                </Button>
                 {result && <ResultCard title="Generated Blog Post" content={result} />}
            </form>
        </FormProvider>
    )
}

const EmailTemplateForm = () => {
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof EmailTemplateInputSchema>>({ 
        resolver: zodResolver(EmailTemplateInputSchema), 
        defaultValues: { purpose: "Follow-up", context: "" }
    });

    const onSubmit = async (values: z.infer<typeof EmailTemplateInputSchema>) => {
        setIsLoading(true);
        setResult(null);
        try {
            const profile = getProfile();
            const response = await generateEmailTemplate({...values, profile});
            setResult(response.template);
        } catch(e) { console.error(e); }
        setIsLoading(false);
    }
    
    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                 <FormField name="purpose" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Purpose of Email</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Follow-up">Follow-up</SelectItem>
                                <SelectItem value="Marketing Campaign">Marketing Campaign</SelectItem>
                                <SelectItem value="Customer Support">Customer Support</SelectItem>
                                <SelectItem value="Job Application">Job Application</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField name="context" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Context / Key Information</FormLabel>
                        <FormControl><Textarea placeholder="e.g., Following up on our meeting yesterday about the new project..." {...field} rows={4}/></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate Email</>}
                </Button>
                {result && <ResultCard title="Generated Email Template" content={result} />}
            </form>
        </FormProvider>
    )
}

const ProductDescriptionForm = () => {
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof ProductDescriptionInputSchema>>({ 
        resolver: zodResolver(ProductDescriptionInputSchema), 
        defaultValues: { productName: "", features: "", targetAudience: "" }
    });

    const onSubmit = async (values: z.infer<typeof ProductDescriptionInputSchema>) => {
        setIsLoading(true);
        setResult(null);
        try {
            const profile = getProfile();
            const response = await generateProductDescription({...values, profile});
            setResult(response.description);
        } catch(e) { console.error(e); }
        setIsLoading(false);
    }
    
    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField name="productName" render={({ field }) => (
                    <FormItem><FormLabel>Product Name</FormLabel><FormControl><Input placeholder="e.g., Smartwatch Pro X" {...field}/></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField name="features" render={({ field }) => (
                    <FormItem><FormLabel>Key Features</FormLabel><FormControl><Textarea placeholder="List features, one per line. e.g.,- Waterproof&#10;- Heart rate monitor" {...field} rows={4}/></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField name="targetAudience" render={({ field }) => (
                    <FormItem><FormLabel>Target Audience</FormLabel><FormControl><Input placeholder="e.g., Tech enthusiasts, fitness lovers" {...field}/></FormControl><FormMessage /></FormItem>
                )}/>
                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate Description</>}
                </Button>
                {result && <ResultCard title="Generated Product Description" content={result} />}
            </form>
        </FormProvider>
    )
}

const SocialMediaForm = () => {
    const [result, setResult] = useState<string[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof SocialMediaCaptionInputSchema>>({ 
        resolver: zodResolver(SocialMediaCaptionInputSchema), 
        defaultValues: { platform: "Instagram", context: "" }
    });

    const onSubmit = async (values: z.infer<typeof SocialMediaCaptionInputSchema>) => {
        setIsLoading(true);
        setResult(null);
        try {
            const profile = getProfile();
            const response = await generateSocialMediaCaptions({...values, profile});
            setResult(response.captions);
        } catch(e) { console.error(e); }
        setIsLoading(false);
    }
    
    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                 <FormField name="platform" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Social Media Platform</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Instagram">Instagram</SelectItem>
                                <SelectItem value="Facebook">Facebook</SelectItem>
                                <SelectItem value="Twitter">Twitter</SelectItem>
                                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField name="context" render={({ field }) => (
                    <FormItem>
                        <FormLabel>What is the post about?</FormLabel>
                        <FormControl><Textarea placeholder="e.g., Announcing our new summer collection of t-shirts." {...field} rows={4}/></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate Captions</>}
                </Button>
                {result && <ResultCard title="Generated Captions" content={
                    <ul className="space-y-4">{result.map((r, i) => <li key={i} className="border-b border-border/50 pb-2 last:border-b-0 last:pb-0">{r}</li>)}</ul>
                } />}
            </form>
        </FormProvider>
    )
}

const ProfileForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(UserProfileSchema),
        defaultValues: {
            name: "",
            jobTitle: "",
            company: "",
            industry: "",
            yearsOfExperience: undefined,
            education: "",
            bio: "",
            skills: "",
            experience: "",
            goals: "",
        }
    });

    useEffect(() => {
        const savedProfile = getProfile();
        if (savedProfile) {
            form.reset(savedProfile);
        }
    }, [form]);

    const onSubmit = (values: ProfileFormValues) => {
        setIsLoading(true);
        try {
            localStorage.setItem("userProfile", JSON.stringify(values));
            toast({
                title: "Success!",
                description: "Your profile has been saved successfully.",
            });
        } catch (error) {
            console.error("Failed to save profile to localStorage", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not save your profile. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField name="name" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl><Input placeholder="e.g., John Doe" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField name="jobTitle" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Current Job Title</FormLabel>
                            <FormControl><Input placeholder="e.g., Software Engineer" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField name="company" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Company</FormLabel>
                            <FormControl><Input placeholder="e.g., Google" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField name="industry" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Industry</FormLabel>
                            <FormControl><Input placeholder="e.g., Technology" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField name="yearsOfExperience" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Years of Experience</FormLabel>
                            <FormControl><Input type="number" placeholder="e.g., 5" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || undefined)} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField name="education" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Highest Education</FormLabel>
                            <FormControl><Input placeholder="e.g., B.S. in Computer Science" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>

                <FormField name="bio" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Bio / Professional Summary</FormLabel>
                        <FormControl><Textarea placeholder="A brief summary about your professional background and accomplishments." {...field} rows={4} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField name="skills" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Key Skills</FormLabel>
                        <FormControl><Textarea placeholder="List your key skills, separated by commas. e.g., React, Next.js, TypeScript, Project Management" {...field} rows={3} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                
                <FormField name="experience" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Primary Experience / Achievements</FormLabel>
                        <FormControl><Textarea placeholder="Briefly describe your main roles or achievements to help the AI. e.g., 'Led a team to develop a new e-commerce platform that increased sales by 20%.'" {...field} rows={4} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                
                <FormField name="goals" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Professional Goals</FormLabel>
                        <FormControl><Textarea placeholder="What are your career goals? e.g., 'To become a principal engineer and lead large-scale projects.'" {...field} rows={2} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> Save Profile</>}
                </Button>
            </form>
        </FormProvider>
    );
};


export default function WritingAssistantPage() {

    const tools = [
        { name: "Profile", icon: UserCircle, component: <ProfileForm /> },
        { name: "Blog Writer", component: <BlogWriterForm /> },
        { name: "Email Templates", component: <EmailTemplateForm /> },
        { name: "Product Desc.", component: <ProductDescriptionForm /> },
        { name: "Social Media", component: <SocialMediaForm /> },
    ];
    
    return (
        <div className="min-h-full animated-gradient-bg px-2 sm:px-4">
            <div className="container py-6 md:py-8">
                <PageHeader
                    title="AI Writing Assistant"
                    description="Your all-in-one suite for generating high-quality written content for any need."
                />
                
                <div className="max-w-3xl mx-auto">
                    <Tabs defaultValue={tools[0].name} className="w-full">
                        <TabsList className={cn(
                            "flex flex-wrap items-center justify-center h-auto",
                            "bg-background/50 border border-white/10 p-1.5 sm:p-2 rounded-xl gap-1 sm:gap-2 mb-6"
                        )}>
                            {tools.map(tool => (
                                <TabsTrigger 
                                    key={tool.name} 
                                    value={tool.name} 
                                    className={cn(
                                        "text-[10px] xs:text-xs sm:text-sm rounded-lg px-2 sm:px-4 py-2 flex-grow sm:flex-grow-0",
                                        "data-[state=active]:bg-primary/90 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg",
                                        "data-[state=inactive]:hover:bg-primary/10"
                                    )}
                                >
                                    {tool.name}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        
                        {tools.map(tool => (
                             <TabsContent key={tool.name} value={tool.name} className="animate-fade-in-up">
                                <Card className="glass">
                                    <CardHeader className="p-4 sm:p-6">
                                        <CardTitle className="text-lg md:text-xl">{tool.name === 'Product Desc.' ? 'Product Description' : tool.name}</CardTitle>
                                        {tool.name === 'Profile' && <CardDescription className="text-xs">This data is saved locally to personalize your AI outputs.</CardDescription>}
                                    </CardHeader>
                                    <CardContent className="p-4 sm:p-6 pt-0">
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
