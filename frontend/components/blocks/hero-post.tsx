import CoverImage, {CoverImageProps} from './cover-image'
import Link from 'next/link'
import HeroLinks from "../ui/hero-links";
import React from "react";

interface HeroPostProps {
  title: string;
  coverImage?: CoverImageProps;
  excerpt: string;
  slug: string;
}

export default function HeroPost({
  title,
  coverImage,
  excerpt,
  slug,
}: HeroPostProps) {
  return (
    <section>
      <div className="mt-8 mb-3 lg:my-6 flex flex-col lg:flex-row justify-between items-center">
        <HeroLinks/>
        <h2 className="pt-8 lg:pt-0 flex items-center text-6xl sm:text-7xl lg:text-6xl xl:text-8xl font-bold tracking-tighter leading-tight lg:order-first"
            style={{margin: 0}}
        >
          <Link
            href={`/about-us/${slug}`}
            className="hover:underline inline-block align-middle"
            dangerouslySetInnerHTML={{__html: title}}
          />
        </h2>
      </div>

      <div className="mb-8 md:mb-16">
        {coverImage && (
          <CoverImage {...coverImage} maxH={true} priority={true}/>
        )}
      </div>
      <div
        className="text-lg leading-relaxed mb-10 md:mb-14 max-w-screen-md mx-auto"
        dangerouslySetInnerHTML={{__html: excerpt}}
      />

    </section>
  )
}
