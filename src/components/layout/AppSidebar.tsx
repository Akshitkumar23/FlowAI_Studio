
"use client";

import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Sparkles, Presentation, Clapperboard, Wand2, Lightbulb, AudioLines } from 'lucide-react';
import * as React from 'react';

const menuItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/presentation-generator', icon: Presentation, label: 'Presentation Generator' },
    { href: '/scene-preview', icon: Clapperboard, label: 'Scene Preview' },
    { href: '/ppt-enhancer', icon: Wand2, label: 'PPT Enhancer' },
    { href: '/prompt-enhancer', icon: Sparkles, label: 'Prompt Enhancer' },
    { href: '/creative-spark', icon: Lightbulb, label: 'Creative Spark' },
    { href: '/text-to-speech', icon: AudioLines, label: 'Text-to-Speech' },
]

export function AppSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <div className="flex items-center gap-2">
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {menuItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                             <SidebarMenuButton
                                asChild
                                isActive={pathname === item.href}
                                tooltip={item.label}
                            >
                                <Link href={item.href}>
                                    <item.icon />
                                    <span>{item.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
    );
}
