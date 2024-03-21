import PicBanner from "../../public/assets/cafeBanner.jpg";
import React from "react";
import {ParallaxBanner, ParallaxBannerLayer} from 'react-scroll-parallax';
import {BannerLayer} from "react-scroll-parallax/src/components/ParallaxBanner/types";

export default function Banner({backgroundImageUrl}: {backgroundImageUrl: string}) {
  const Component = () => {
    const background: BannerLayer = {
      image: backgroundImageUrl,
      translateY: [0, 20],
      opacity: [0.4, 0.3],
      scale: [1.05, 1, "easeIn"],
      shouldAlwaysCompleteAnimation: true,
    };

    const headline: BannerLayer = {
      translateY: [0, 30],
      scale: [1, 1.05, 'easeOutCubic'],
      shouldAlwaysCompleteAnimation: true,
      expanded: false,
      className: "mix-blend-hard-light",
      children: (
        <div className="absolute inset-0 flex-col flex items-center justify-center text-white">
          {/*
          <h1 className="text-[10rem] font-bold tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
            TuDo
          </h1>
          */}
          <h1 className="text-[10rem] font-bold tracking-tighter leading-tight">
            TuDo
          </h1>
          <h3 className="text-6xl font-bold tracking-tighter hidden sm:block">
            Makerspace & Café
          </h3>
        </div>
      ),
    };

    const gradientOverlay: BannerLayer = {
      opacity: [0, 0.9],
      shouldAlwaysCompleteAnimation: true,
      expanded: false,
      children: (
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-blue-900" />
      ),
    };

    return (
      <ParallaxBanner
        layers={[background, headline, gradientOverlay]}
        className="h-[60vh] w-full mb-12 bg-gray-900"
      />
    );
  };

  return (
    <section>
      {/*<Container>
        <div className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-40 md:mb-12">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8">
            TuDo
          </h1>
          <h4 className="text-center md:text-left text-lg mt-5 md:pl-8">
            A space for creativity and innovation.
          </h4>
        </div>
      </Container>
     */}
      <Component />
    </section>
  )
}

