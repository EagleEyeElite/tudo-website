import Image from "next/image";
import React from "react";

export default function HeroImage({ src }) {
  return (
    <div className="grow relative shadow-2xl rounded-lg overflow-clip">
      <Image
        src={src}
        fill={true}
        style={{objectFit: "cover"}}
        className="blur-xl brightness-150 contrast-[0.9] saturate-150 scale-150"
        alt=""
      />
      <Image
        src={src}
        fill={true}
        style={{objectFit: "contain"}}
        alt=""
      />
    </div>
  )
}
