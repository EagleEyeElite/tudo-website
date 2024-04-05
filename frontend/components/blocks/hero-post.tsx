import Avatar, {AuthorProps} from './avatar'
import Date from './date'
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
      <div className="my-4 lg:my-8 flex flex-col lg:flex-row justify-between items-center">
        <h2 className="mb-4 text-7xl md:text-7xl font-bold tracking-tighter leading-tight">
          <Link
            href={`/about-us/${slug}`}
            className="hover:underline"
            dangerouslySetInnerHTML={{__html: title}}
          ></Link>
        </h2>
        <HeroLinks/>
      </div>


      <div className="mb-8 md:mb-16">
        {coverImage && (
          <CoverImage {...coverImage} maxH={true}/>
        )}
      </div>
      <div
        className="text-lg leading-relaxed mb-10 md:mb-14 max-w-screen-md mx-auto"
        dangerouslySetInnerHTML={{__html: excerpt}}
      />

    </section>
  )
}
