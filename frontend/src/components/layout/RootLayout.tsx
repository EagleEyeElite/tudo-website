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
  const animationRef = useRef<number | undefined>(undefined);
  const frameCount = useRef(0);

  // Reset frame count when menu state changes
  useEffect(() => {
    frameCount.current = 0;
  }, [isMenuOpen]);

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

        // Only apply transform after initial origin set
        if (frameCount.current > 0) {
          element.style.transform = 'scale(0.95)';
        }

        // Increment frame count
        frameCount.current++;

        // Request next frame if still within initial frames
        if (frameCount.current <= 2) {
          animationRef.current = requestAnimationFrame(applyTransform);
        }
      } else {
        element.style.transform = 'none';
        frameCount.current = 0;
      }
    };

    // Start animation
    animationRef.current = requestAnimationFrame(applyTransform);

    // Also update on scroll
    const handleScroll = () => {
      if (isMenuOpen) {
        requestAnimationFrame(applyTransform);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isMenuOpen]);

  return (
    <>
      <MainNavbar initialState={initialState} onMenuOpenChange={setIsMenuOpen} />
      <div
        ref={contentRef}
        className="relative transition-transform duration-300"
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