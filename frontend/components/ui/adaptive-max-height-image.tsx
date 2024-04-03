import Image from "next/image";
import React from "react";

interface AdaptiveMaxHeightImageProps {
  src: string;
  alt?: string;

}
export default function AdaptiveMaxHeightImage({src, alt}: AdaptiveMaxHeightImageProps) {
  return <div className="relative overflow-hidden">
    <Image
      src={src}
      fill={true}
      className="object-cover blur-xl brightness-150 contrast-[0.9] saturate-150 scale-150"
      alt=""
    />
    <Image
      alt={alt || ""}
      src={src}
      sizes="100vw"
      width={0}
      height={0}
      className="relative object-contain w-full h-full max-h-[80vh] "
    />
  </div>
}
