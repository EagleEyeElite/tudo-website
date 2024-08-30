import Head from 'next/head'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import Container from '../components/ui/container'
import MoreStories from '../components/blocks/more-stories'
import HeroPost from '../components/blocks/hero-post'
import Banner from '../components/blocks/banner'
import Layout from '../components/layout/layout'
import { fetchMediaItemsWithBackgroundSet, getAllPostsForHome, MorePostPropsApi } from 'lib/api/wordpress'
import React from "react";
import { ParallaxProvider } from "react-scroll-parallax";
import { ActivityIndicatorState, getActivityIndicator } from "lib/api/activityIndicator";
import { convertAuthor, convertCoverImage, convertMorePosts } from "lib/convertApiInterfaces";

export default function Index({
                                heroPost,
                                morePosts,
                                backgroundImageUrl,
                                preview,
                                activityState
                              }: InferGetStaticPropsType<typeof getStaticProps>) {
  const coverHeroPost = heroPost ? convertCoverImage(heroPost.title!, heroPost.featuredImageUrl, heroPost.slug, "/about-us") : null;
  const authorHeroPost = heroPost?.author ? convertAuthor(heroPost.author) : null;
  const morePostsConverted = convertMorePosts(morePosts);

  return (
    <ParallaxProvider>
      <Layout activityIndicator={activityState} preview={preview}>
        <Head>
          <title>{`TuDo Makerspace`}</title>
        </Head>
        <Banner backgroundImageUrl={backgroundImageUrl!}/>
        <Container>
          {heroPost && coverHeroPost && (
            <HeroPost
              title={heroPost.title!}
              coverImage={coverHeroPost}
              slug={heroPost.slug!}
              excerpt={heroPost.excerpt!}
            />
          )}
          {morePostsConverted.length > 0 && <MoreStories posts={morePostsConverted} />}
        </Container>
      </Layout>
    </ParallaxProvider>
  )
}

export const getStaticProps: GetStaticProps<{
  heroPost: MorePostPropsApi | null,
  morePosts: MorePostPropsApi[],
  backgroundImageUrl: string | null,
  preview: boolean,
  activityState: ActivityIndicatorState,
}> = async ({ preview = false }) => {
  const allPosts = await getAllPostsForHome()
  const heroPost = allPosts.welcomePage || null
  const morePosts = allPosts.latestPost || []
  const backgroundImageUrl = await fetchMediaItemsWithBackgroundSet() || null
  const activityState = await getActivityIndicator()

  return {
    props: {
      heroPost,
      morePosts,
      backgroundImageUrl,
      preview,
      activityState
    },
    revalidate: 1,
  }
}