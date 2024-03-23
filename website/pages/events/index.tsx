import { GetStaticProps, type InferGetStaticPropsType } from 'next';
import React from 'react';
import Layout from '../../components/layout/layout';
import {ActivityIndicatorState, getActivityIndicator} from "../api/activityIndicator";
import { getAllPostsForHome, getPageByTitle, PagePropsApi} from "../../lib/api";
import {useRouter} from "next/router";
import Loading from "../../components/page-templates/loading";
import ErrorPage from "next/error";
import Overview from "../../components/page-templates/overview";

export default function OverviewPage({ eventsPage, posts, activityState }: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()
  if (!router.isFallback && !eventsPage) {
    return <ErrorPage statusCode={404}/>
  }
  if (router.isFallback) {
    return Loading(activityState);
  }

  return (
    <Layout activityIndicator={activityState} preview={false}>
      <Overview path={"events"} page={eventsPage!} childPages={posts}/>
    </Layout>
  );
}

export const getStaticProps = (async ({params}) => {
  const activityState = await getActivityIndicator();
  const res = await getAllPostsForHome();
  const eventsPage = await getPageByTitle("Events");

  const resConverted = res.map(post => ({
    id: null,
    title: post.title,
    content: post.excerpt,
    featuredImageUrl: post.featuredImageUrl,
    slug: post.slug,
    parent: null
  }));

  return {
    props: {
      eventsPage: eventsPage,
      posts: resConverted,
      activityState: activityState,
    },
    revalidate: 10,
  };
}) satisfies GetStaticProps<{
  eventsPage: PagePropsApi | null,
  posts: PagePropsApi[],
  activityState: ActivityIndicatorState
}>
