import { CMS_NAME, CMS_URL } from '../lib/constants'
import Banner from "../public/assets/cafeBanner.jpg";
import Image from "next/image";
import React from "react";
import Container from "./container";
import {ParallaxBanner, ParallaxBannerLayer} from 'react-scroll-parallax';

export default function Intro() {
  return (
    <section>
        <Container>
          <div className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-40 md:mb-12">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8">
              TuDo
            </h1>
            <h4 className="text-center md:text-left text-lg mt-5 md:pl-8">
              A space for creativity and innovation.
            </h4>
          </div>
        </Container>

        <ParallaxBanner className="h-[60vh] w-full mb-12">
          <ParallaxBannerLayer
            image={Banner.src}
            speed={-20}
          />
        </ParallaxBanner>

    </section>
  )
}

