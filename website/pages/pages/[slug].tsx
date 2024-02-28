import type {
  InferGetStaticPropsType,
  GetStaticProps,
  GetStaticPaths,
} from 'next'
import {getAllPagesAsSlug, getPage, PageProps} from "../../lib/api";
import {useRouter} from "next/router";
import ErrorPage from "next/error";
import Layout from "../../components/layout";
import Container from "../../components/container";
import PostTitle from "../../components/post-title";
import Head from "next/head";
import PostBody from "../../components/post-body";
import {ActivityIndicatorState, getActivityIndicator} from "../api/activityIndicator";

export const getStaticPaths = (async () => {
  const allPostSlugs = await getAllPagesAsSlug();
  return {
    paths: allPostSlugs,
    fallback: true,
  };
}) satisfies GetStaticPaths


export const getStaticProps = (async ({params}) => {
  const res = await getPage(params?.slug as string); //"impressum"
  const activityState = structuredClone(await getActivityIndicator());

  return {
    props: {
      page: res,
      activityState,
    },
    revalidate: 10,
  }
}) satisfies GetStaticProps<{
  page: PageProps
  activityState: ActivityIndicatorState
}>


export default function Page(
  {
    page,
    activityState
  }: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()

  if (!router.isFallback && !page?.id) {
    return <ErrorPage statusCode={404}/>
  }

  return (
    <Layout activityIndicator={activityState} preview={false}>
      <Container>
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <article>
            <Head>
              <title>
                {`${page.title} | TuDo Makerspace`}
              </title>
              {
                page.featuredImageUrl && (
                  <meta
                    property="og:image"
                    content={page.featuredImageUrl}
                  />
                )
              }
            </Head>
            <PostTitle>{page.title}</PostTitle>
            <PostBody content={page.content}/>
          </article>
        )}
      </Container>
    </Layout>
  )
}
