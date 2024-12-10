'use cache';

import CoverImage from './cover-image'
import Link from 'next/link'
import HeroLinks from "../ui/hero-links";
import React from "react";
import {getHeroPostForHome} from "@/lib/api/wordpress";
import {convertCoverImage} from "@/lib/convertApiInterfaces";
import {unstable_cache} from "next/cache";

export default async function HeroPost() {
  const heroPost = await unstable_cache(
    async () => await getHeroPostForHome(),
    ['hero-post'],
    { revalidate: 1, }
  )();

  const {title, excerpt, slug, featuredImageUrl} = heroPost;
  const coverImage = heroPost ? convertCoverImage(title!, featuredImageUrl, slug, "/about-us") : null;

  if (!heroPost || !coverImage) {
    return null
  }

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
            dangerouslySetInnerHTML={{__html: title!}}
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
        dangerouslySetInnerHTML={{__html: excerpt!}}
      />

    </section>
  )
}
