'use client';

import { useState, useEffect } from 'react';
import './globals.css';
import { AppHeader } from '@/components/layout/AppHeader';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { SplashScreen } from '@/components/layout/SplashScreen';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en" className="dark">
      <head>
        <title>FlowAI Studio | AI-Powered Content Creation</title>
        <meta name="description" content="The ultimate studio for creating presentations, resumes, scenes, and more with AI." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased min-h-screen flex flex-col")}>
        {loading && <SplashScreen />}
        <AppHeader />
        <main className={cn("flex-grow transition-opacity duration-1000", loading ? "opacity-0" : "opacity-100 animate-fade-in")}>
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}