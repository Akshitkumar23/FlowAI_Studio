"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { FeatureCard } from "@/components/landing/FeatureCard";
import { Mic, FilePenLine, FileText, PenTool } from "lucide-react";
import React from "react";

const features = [
    {
        title: 'AI Debriefer',
        description: 'Get expert feedback on your presentation content and script to deliver with confidence.',
        href: '/ai-debrief',
        icon: <Mic className="w-10 h-10 text-glow-primary" />,
        textColor: "text-glow-primary",
    },
    {
        title: 'AI Writing Assistant',
        description: 'Generate complete blogs, email templates, product descriptions, and social media captions.',
        href: '/writing-assistant',
        icon: <FilePenLine className="w-10 h-10 text-glow-accent" />,
        textColor: "text-glow-accent",
    },
    {
        title: 'Resume Builder',
        description: 'Create a stunning, professional resume from your details and download it as a PDF.',
        href: '/resume-builder',
        icon: <FileText className="w-10 h-10 text-glow-primary" />,
        textColor: "text-glow-primary",
    },
    {
        title: 'Text Toolkit',
        description: 'Correct, summarize, analyze, translate, and extract keywords from your text.',
        href: '/text-toolkit',
        icon: <PenTool className="w-10 h-10 text-glow-accent" />,
        textColor: "text-glow-accent",
    },
];

export default function WritingSuitePage() {
    return (
        <div className="min-h-full animated-gradient-bg">
            <div className="container py-8">
                <PageHeader
                    title="AI Writing Studio"
                    description="A comprehensive set of tools to help you write, refine, and perfect your content."
                />
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {features.map((feature) => (
                             <FeatureCard
                                key={feature.title}
                                {...feature}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
