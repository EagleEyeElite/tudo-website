import Head from 'next/head'
import { GetStaticProps } from 'next'
import Container from '../components/ui/container'
import MoreStories from '../components/blocks/more-stories'
import HeroPost from '../components/blocks/hero-post'
import Banner from '../components/blocks/banner'
import Layout from '../components/layout/layout'
import { getAllPostsForHome } from '../lib/api'
import React from "react";
import {ParallaxProvider} from "react-scroll-parallax";
import {getActivityIndicator} from "./api/activityIndicator";


export default function Index({ allPosts: { edges }, preview, activityState }) {
  const heroPost = edges[0]?.node
  const morePosts = edges.slice(1)

  return (
    <ParallaxProvider>
      <Layout activityIndicator={activityState} preview={preview}>
        <Head>
          <title>{`TuDo Makerspace`}</title>
        </Head>
        <Banner/>
        <Container>
          {heroPost && (
            <HeroPost
              title={heroPost.title}
              coverImage={heroPost.featuredImage}
              date={heroPost.date}
              author={heroPost.author}
              slug={heroPost.slug}
              excerpt={heroPost.excerpt}
            />
          )}
          {morePosts.length > 0 && <MoreStories posts={morePosts} />}
        </Container>
      </Layout>
    </ParallaxProvider>
  )
}

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  const allPosts = await getAllPostsForHome()
  const activityState = await getActivityIndicator();
  return {
    props: { allPosts, preview, activityState: structuredClone(activityState) },
    revalidate: 10,
  }
}
