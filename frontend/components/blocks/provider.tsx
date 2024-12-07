'use client';

import {ParallaxProvider} from "react-scroll-parallax";

export default function Provider({ children }) {
  return <ParallaxProvider>
    {children}
  </ParallaxProvider>;
}
