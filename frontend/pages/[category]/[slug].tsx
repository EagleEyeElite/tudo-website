import type {
  InferGetStaticPropsType,
  GetStaticProps,
  GetStaticPaths,
} from 'next'
import {childPagesByParentId, getAllParentPagesAsSlug, getPageByTitle, PagePropsApi} from "../../lib/api";
import {useRouter} from "next/router";
import ErrorPage from "next/error";
import Layout from "../../components/layout/layout";
import {ActivityIndicatorState, getActivityIndicator} from "../api/activityIndicator";
import ContentDefault from "../../components/page-templates/content-default";
import Loading from "../../components/page-templates/loading";
import {convertPage} from "../../lib/convertApiInterfaces";
import {HeaderLinkProps} from "../../components/blocks/headerLink";

export default function Page({ page, activityState }: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()
  if (!router.isFallback && !page?.id) {
    return <ErrorPage statusCode={404}/>
  }
  if (router.isFallback) {
    return Loading(activityState);
  }

  let props: HeaderLinkProps | undefined = undefined;
  if (page.parent) {
    props = {
      title: page.parent.title!,
      href: `/${page.parent.slug}`,
    }
  }

  return (
    <Layout activityIndicator={activityState} preview={false}>
      <ContentDefault content={{...convertPage(page), headerLink: props} } />
    </Layout>
  )
}


export const getStaticProps = (async ({params}) => {
  const activityState = await getActivityIndicator();
  const res = await getPageByTitle(params?.slug as string);
  if (!res) {
    return { notFound: true }
  }
  return {
    props: {
      page: res,
      activityState: activityState,
    },
    revalidate: 10
  };
}) satisfies GetStaticProps<{
  page: PagePropsApi,
  activityState: ActivityIndicatorState,
}>

export const getStaticPaths = (async () => {
  const res = await getAllParentPagesAsSlug();
  const paths: string[] = []
  for (const category of res) {
    const pageProps = await getPageByTitle(category);
    if (!pageProps) {
      return {
        paths: [],
        fallback: false,
      };
    }
    const childPages = await childPagesByParentId(pageProps.id!)
    paths.push(...childPages.map((slug) => `/${category}/${slug.slug}`));
  }

  return {
    paths: paths,
    fallback: true,
  };
}) satisfies GetStaticPaths<{
  paths: string[]
  fallback: string
}>
