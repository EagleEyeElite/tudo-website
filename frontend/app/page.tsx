import { Suspense } from 'react';
import Container from '@/components/ui/container';
import MoreStories from '@/components/blocks/more-stories';
import HeroPost from '@/components/blocks/hero-post';
import Banner from '@/components/blocks/banner';
import { getAllPostsForHome, fetchMediaItemsWithBackgroundSet } from '@/lib/api/wordpress';
import { convertCoverImage, convertMorePosts } from '@/lib/convertApiInterfaces';
import ClientWrapper from './ClientWrapper';

export const revalidate = 1;

export default async function Home() {
  const allPosts = await getAllPostsForHome();
  const heroPost = allPosts.welcomePage || null;
  const morePosts = allPosts.latestPost || [];
  const backgroundImageUrl = await fetchMediaItemsWithBackgroundSet() || null;

  const coverHeroPost = heroPost ? convertCoverImage(heroPost.title!, heroPost.featuredImageUrl, heroPost.slug, "/about-us") : null;
  const morePostsConverted = convertMorePosts(morePosts);

  return (
    <ClientWrapper>
      <Banner backgroundImageUrl={backgroundImageUrl!} />
      <Container>
        {heroPost && coverHeroPost && (
          <HeroPost
            title={heroPost.title!}
            coverImage={coverHeroPost}
            slug={heroPost.slug!}
            excerpt={heroPost.excerpt!}
          />
        )}
        <Suspense fallback={<div>Loading more stories...</div>}>
          {morePostsConverted.length > 0 && <MoreStories posts={morePostsConverted} />}
        </Suspense>
      </Container>
    </ClientWrapper>
  );
}
