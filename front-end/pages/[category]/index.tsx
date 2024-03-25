import {GetStaticProps, type InferGetStaticPropsType} from 'next';
import React from 'react';
import Layout from '../../components/layout/layout';
import {childPagesByParentId, getAllParentPagesAsSlug, getPageByTitle, PagePropsApi} from "../../lib/api";
import {ActivityIndicatorState, getActivityIndicator} from "../api/activityIndicator";
import {useRouter} from "next/router";
import ErrorPage from "next/error";
import Loading from "../../components/page-templates/loading";
import Overview from "../../components/page-templates/overview";


export default function OverviewPage({path, page, childPages, activityState}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()
  if (!router.isFallback && !page?.id) {
    return <ErrorPage statusCode={404}/>
  }
  if (router.isFallback) {
    return Loading(activityState);
  }

  return (
    <Layout activityIndicator={activityState} preview={false}>
      <Overview path={path} page={page} childPages={childPages}/>
    </Layout>
  )
}

export const getStaticProps = (async ({params}) => {
  const activityState = await getActivityIndicator();
  const path = params?.category as string
  const res = await getPageByTitle(path);
  if (!res) {
    return { notFound: true, revalidate: 10 }
  }
  const childPages = await childPagesByParentId(res.id!);

  return {
    props: {
      path,
      page: res,
      childPages,
      activityState: activityState,
    },
    revalidate: 10,
  };
}) satisfies GetStaticProps<{
  path: string
  page: PagePropsApi
  childPages: PagePropsApi[]
  activityState: ActivityIndicatorState
}>

export const getStaticPaths = async () => {
  const allParentPagesSlugs = await getAllParentPagesAsSlug();
  const paths = allParentPagesSlugs
    .filter(slug => slug !== 'events')
    .map(slug => `/${slug}`);
  return {
    paths,
    fallback: true,
  };
};
