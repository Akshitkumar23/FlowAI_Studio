
"use client";

import { useState, useEffect } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { AppHeader } from '@/components/layout/AppHeader';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { SplashScreen } from '@/components/layout/SplashScreen';

// Note: Metadata is not supported in client components.
// We can either move it to a server component or manage the title dynamically.
// For now, we keep the static title in the head.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Reduced splash screen time
    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en" className="dark">
      <head>
        <title>FlowAI Studio</title>
        <meta name="description" content="Create and enhance content with the power of AI." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased")}>
        {loading ? (
          <SplashScreen />
        ) : (
            <div className="flex flex-col min-h-screen">
                <AppHeader />
                <main className="flex-grow animate-fade-in">{children}</main>
                <Footer />
                <Toaster />
            </div>
        )}
      </body>
    </html>
  );
}
