import React from 'react';
import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "./globals.css";
import NextAuthProvider from "@/components/providers/NextAuthProvider";

export const metadata: Metadata = {
  title: "Newsletter Source Hub",
  description: "Curated Daily Tech News",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable} bg-background font-sans antialiased selection:bg-primary/20`}>
        <NextAuthProvider>
          <div className="fixed inset-0 z-[-1] pointer-events-none">
            <div className="absolute inset-0 bg-grid-small-black/[0.2] dark:bg-grid-small-white/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/20 dark:bg-indigo-500/10 blur-[120px] rounded-full mix-blend-screen" />
          </div>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}