'use client'

import React, { ReactNode, useEffect } from 'react';
import { ParallaxBanner, ParallaxBannerLayer, useParallaxController } from 'react-scroll-parallax';
import { usePathname } from 'next/navigation';

export default function BannerClient({bannerImage}: {bannerImage: ReactNode}) {
  const pathname = usePathname();
  const parallaxController = useParallaxController();
  useEffect(() => {
    const handleSamePathNavigation = (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (href === pathname) {
        parallaxController?.update();
      }
    };

    document.addEventListener('click', handleSamePathNavigation);
    return () => document.removeEventListener('click', handleSamePathNavigation);
  }, [pathname, parallaxController]);

  return (
    <section>
      <ParallaxBanner
        className="h-[60vh] w-full bg-gray-900"
      >
        <ParallaxBannerLayer
          shouldAlwaysCompleteAnimation={true}
          expanded={false}
          translateY={[0, 20]}
          opacity={[0.6, 0.2]}
          scale={[1.05, 1, "easeOut"]}
        >
          {bannerImage}
        </ParallaxBannerLayer>
        <ParallaxBannerLayer
          shouldAlwaysCompleteAnimation={true}
          opacity={[0, 0.9]}
        >
          <div className="absolute inset-0 bg-linear-to-t from-gray-900 to-blue-900"/>
        </ParallaxBannerLayer>
        <ParallaxBannerLayer
          shouldAlwaysCompleteAnimation={true}
          expanded={false}
          translateY={ [0, 50]}
          opacity={[1, 0.5, 'easeIn']}
          scale={[1, 1.05, 'easeOut']}
        >
          <div className="absolute inset-0 flex-col flex items-center justify-center text-white">
            <h1 className="text-[10rem] font-bold tracking-tighter leading-tight">
              TuDo
            </h1>
            <h3 className="text-6xl font-bold tracking-tighter hidden sm:block">
              Makerspace & Café
            </h3>
          </div>
        </ParallaxBannerLayer>
      </ParallaxBanner>
    </section>
  );
}
