import Image from 'next/image';
import React from 'react';

interface AdaptiveMaxHeightImageProps {
  src: string;
  alt?: string;
  priority?: boolean;
}
export default function AdaptiveMaxHeightImage({src, alt, priority=false}: AdaptiveMaxHeightImageProps) {
  return <div className="relative overflow-hidden">
    <Image
      src={src}
      fill
      sizes="100vw"
      className="object-cover blur-xl brightness-150 contrast-[0.9] saturate-150 scale-150"
      alt=""
      priority={false}
    />
    <Image
      alt={alt || ""}
      src={src}
      sizes="100vw"
      width={0}
      height={0}
      className="relative object-contain w-full h-full max-h-[80vh] "
      priority={priority}
    />
  </div>
}
