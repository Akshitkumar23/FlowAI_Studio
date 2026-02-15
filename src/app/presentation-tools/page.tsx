
"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { FeatureCard } from "@/components/landing/FeatureCard";
import { Presentation, Wand2 } from "lucide-react";
import React from "react";

const features = [
    {
        title: 'AI Presentation Generator',
        description: 'Generate a full presentation from a topic, including text and AI-generated images.',
        href: '/presentation-generator',
        icon: <Presentation className="w-10 h-10 text-glow-primary" />,
        textColor: "text-glow-primary",
    },
    {
        title: 'PPT Slide Enhancer',
        description: 'Redesign an existing slide or create a new one from text with content suggestions.',
        href: '/ppt-enhancer',
        icon: <Wand2 className="w-10 h-10 text-glow-accent" />,
        textColor: "text-glow-accent",
    },
];

export default function PresentationToolsPage() {
    return (
        <div className="min-h-full animated-gradient-bg">
            <div className="container py-8">
                <PageHeader
                    title="Presentation Studio"
                    description="A collection of powerful tools to create, enhance, and perfect your presentations."
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
