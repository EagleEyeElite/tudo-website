import Head from 'next/head'
import {GetStaticProps, type InferGetStaticPropsType} from 'next'
import Container from '../components/ui/container'
import MoreStories from '../components/blocks/more-stories'
import HeroPost from '../components/blocks/hero-post'
import Banner from '../components/blocks/banner'
import Layout from '../components/layout/layout'
import {fetchMediaItemsWithBackgroundSet, getAllPostsForHome, MorePostPropsApi} from '../lib/api'
import React from "react";
import {ParallaxProvider} from "react-scroll-parallax";
import {ActivityIndicatorState, getActivityIndicator} from "./api/activityIndicator";
import {convertAuthor, convertCoverImage, convertMorePosts} from "../lib/convertApiInterfaces";


export default function Index(
  { heroPost, morePosts, backgroundImageUrl, preview, activityState }: InferGetStaticPropsType<typeof getStaticProps>
) {
  const coverHeroPost = convertCoverImage(heroPost.title!, heroPost.featuredImageUrl, heroPost.slug)
  const authorHeroPost = convertAuthor(heroPost.author!)
  const morePostsConverted = convertMorePosts(morePosts)

  return (
    <ParallaxProvider>
      <Layout activityIndicator={activityState} preview={preview}>
        <Head>
          <title>{`TuDo Makerspace`}</title>
        </Head>
        <Banner backgroundImageUrl={backgroundImageUrl} />
        <Container>
          {heroPost && (
            <HeroPost
              title={heroPost.title!}
              coverImage={coverHeroPost}
              date={heroPost.date!}
              author={authorHeroPost}
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

export const getStaticProps = (async ({ preview = false }) => {
  const allPosts = await getAllPostsForHome()
  const heroPost = allPosts[0]
  const morePosts = allPosts.slice(1)
  const backgroundImageUrl = await fetchMediaItemsWithBackgroundSet();
  const activityState = await getActivityIndicator();
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
}) satisfies GetStaticProps<{
  heroPost: MorePostPropsApi,
  morePosts: MorePostPropsApi[],
  backgroundImageUrl: string,
  preview: boolean,
  activityState: ActivityIndicatorState,
}>
