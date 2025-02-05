// components/layout/openButton.tsx
import { OPENING_HOURS_PATH } from '@/lib/constants';
import React from 'react';
import Link from 'next/link';

export function OpenButton() {
  return (
    <div className="relative isolate" style={{ contain: 'paint layout style' }}>
      {/* Base Button */}
      <Link
        href={OPENING_HOURS_PATH}
        className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none"
      >
        <span className="relative z-10">Geöffnet</span>
      </Link>

      {/* Fixed Animation Layer */}
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden rounded-md pointer-events-none"
        style={{
          mixBlendMode: 'plus-lighter',
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)'
        }}
      >
        <div
          className="absolute inset-0 bg-green-500/30"
          style={{
            animation: 'buttonSlide 2s ease-in-out infinite',
            willChange: 'transform',
            transform: 'translate3d(0, 0, 0)'
          }}
        />
      </div>

      <style jsx>{`
          @keyframes buttonSlide {
              from {
                  transform: translate3d(-100%, 0, 0);
              }
              to {
                  transform: translate3d(100%, 0, 0);
              }
          }
      `}</style>
    </div>
  );
}