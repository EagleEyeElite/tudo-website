import type {
  InferGetStaticPropsType,
  GetStaticProps,
  GetStaticPaths,
} from 'next'
import {getAllPagesAsSlug, getPageByTitle, PagePropsApi} from "../../lib/api";
import {useRouter} from "next/router";
import ErrorPage from "next/error";
import Layout from "../../components/layout/layout";
import {ActivityIndicatorState, getActivityIndicator} from "../api/activityIndicator";
import ContentDefault, {ContentDefaultProps} from "../../components/page-templates/content-default";
import Loading from "../../components/page-templates/loading";
import {CoverImageProps} from "../../components/blocks/cover-image";
import {convertPage, convertPost} from "../../lib/convertApiInterfaces";

export default function Page({
  page,
  activityState
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()
  if (!router.isFallback && !page?.id) {
    return <ErrorPage statusCode={404}/>
  }
  if (router.isFallback) {
    return Loading(activityState);
  }

  return (
    <Layout activityIndicator={activityState} preview={false}>
      <ContentDefault content={convertPage(page)}/>
    </Layout>
  )
}

export const getStaticProps = (async ({params}) => {
  const res = await getPageByTitle(params?.slug as string);
  if (!res) {
    return { notFound: true, revalidate: 10 }
  }
  const activityState = await getActivityIndicator();
  return {
    props: {
      page: res,
      activityState,
    },
    revalidate: 10,
  }
}) satisfies GetStaticProps<{
  page: PagePropsApi
  activityState: ActivityIndicatorState
}>

export const getStaticPaths = (async () => {
  const allPostSlugs = await getAllPagesAsSlug();
  return {
    paths: allPostSlugs,
    fallback: true,
  };
}) satisfies GetStaticPaths
