'use client'

import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Alert from '@/components/layout/alert'
import Footer from '@/components/layout/footer'
import MainNavbar from '@/components/layout/navbar'
import React, { useState } from 'react'
import { type ActivityIndicatorState } from "@/lib/api/activityIndicator"

interface RootLayoutClientProps {
  children: React.ReactNode;
  initialState: ActivityIndicatorState;
}

export default function RootLayoutClient({ children, initialState }: RootLayoutClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
    <MainNavbar initialState={initialState} onMenuOpenChange={setIsMenuOpen} />
    <div
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
      className="min-h-screen"
    >
      <div
        className={`flex flex-col min-h-[calc(100vh-4rem)] transition-all duration-300 ${
          isMenuOpen ? 'scale-95 translate-z-[-100px] opacity-50' : ''
        }`}
        style={{
          transformOrigin: 'center center',
        }}
      >

        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </div>
  <Analytics />
  <SpeedInsights />
</>
);
}