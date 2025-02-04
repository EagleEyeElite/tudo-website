'use client'

import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from '@/components/layout/footer'
import MainNavbar from '@/components/layout/navbar'
import React, { useState, useEffect, useRef } from 'react'
import { type ActivityIndicatorState } from "@/lib/api/activityIndicator"

interface RootLayoutClientProps {
  children: React.ReactNode;
  initialState: ActivityIndicatorState;
}

export default function RootLayoutClient({ children, initialState }: RootLayoutClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const applyTransform = () => {
      if (!contentRef.current) return;

      const element = contentRef.current;

      // Get the viewport center in global coordinates
      const viewportCenterX = window.innerWidth / 2;
      const viewportCenterY = window.innerHeight / 2 + window.scrollY;

      // Get element's global position
      const rect = element.getBoundingClientRect();
      const elementGlobalY = rect.top + window.scrollY;

      // Calculate the transform origin relative to the element
      const originY = viewportCenterY - elementGlobalY;

      if (isMenuOpen) {
        // Apply transform with calculated origin
        element.style.transformOrigin = `${viewportCenterX}px ${originY}px`;
        element.style.transform = 'scale(0.95)';
      } else {
        element.style.transform = 'none';
      }

      // Request next frame
      animationRef.current = requestAnimationFrame(applyTransform);
    };

    // Start animation
    animationRef.current = requestAnimationFrame(applyTransform);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isMenuOpen]);

  return (
    <>
      <MainNavbar initialState={initialState} onMenuOpenChange={setIsMenuOpen} />
      <div
        ref={contentRef}
        className="relative transition-all duration-300"
      >
        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
        <Footer />
      </div>

      <Analytics />
      <SpeedInsights />
    </>
  );
}
