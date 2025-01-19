import CoverImage from '@/components/blocks/cover-image'
import Link from 'next/link'
import HeroLinks from '@/components/ui/hero-links'
import React from 'react'
import { getHeroPostForHome } from '@/lib/api/wordpress'
import { convertCoverImage } from '@/lib/convertApiInterfaces'
import { HTMLRenderer } from '@/components/render/renderWordpress';

type HeroPostProps = {
  title: string;
  excerpt: string;
  slug: string;
  coverImage: any; // Replace with proper type from your CoverImage component
}

// Client Component without async functionality
function HeroContent({ title, excerpt, slug, coverImage }: HeroPostProps) {
  return (
    <section>
      <div className="mt-8 mb-3 lg:my-6 flex flex-col lg:flex-row justify-between items-center">
        <HeroLinks />
        <h2
          className="pt-8 lg:pt-0 flex items-center text-6xl sm:text-7xl lg:text-6xl xl:text-8xl font-bold tracking-tighter leading-tight lg:order-first"
          style={{margin: 0}}
        >
          <Link
            href={`/about-us/${slug}`}
            className="hover:underline inline-block align-middle prose prose-l"
          >
            <HTMLRenderer content={title} />
          </Link>
        </h2>
      </div>

      <div className="mb-8 md:mb-16">
        <CoverImage {...coverImage} maxH={true} priority={true}/>
      </div>

      <div
        className="mb-10 md:mb-14 max-w-screen-md mx-auto prose prose-l"
      >
        <HTMLRenderer content={title} />
      </div>
    </section>
  )
}

// Server Component handling async data fetching
export default async function HeroPost() {
  const post = await getHeroPostForHome();
  if (!post) return null;
  if (!post.title || !post.excerpt || !post.slug) return null;

  const coverImage = convertCoverImage(
    post.title,
    post.featuredImageUrl,
    post.slug,
    "/about-us"
  );

  const heroPost = {
    title: post.title,
    excerpt: post.excerpt,
    slug: post.slug,
    coverImage
  };

  // Render the client component with the fetched data
  return <HeroContent {...heroPost} />;
}
