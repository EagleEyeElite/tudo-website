import {useRouter} from 'next/router'
import ErrorPage from 'next/error'
import {GetStaticPaths, GetStaticProps, InferGetStaticPropsType} from 'next'
import MoreStories from '../../components/blocks/more-stories'
import Layout from '../../components/layout/layout'
import {getAllPostsWithSlug, getPostAndMorePosts, MorePostPropsApi, PostPropsApi} from 'lib/api/wordpress'
import {ActivityIndicatorState, getActivityIndicator} from "lib/api/activityIndicator";
import ContentDefault from "../../components/page-templates/content-default";
import Loading from "../../components/page-templates/loading";
import {convertPost, convertMorePosts} from "../../lib/convertApiInterfaces";

export default function Post(
  {post, morePosts, preview, activityState}: InferGetStaticPropsType<typeof getStaticProps>
) {
  const router = useRouter()
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404}/>
  }
  if (router.isFallback) {
    return Loading(activityState);
  }
  const postConverted = convertPost(post)
  const morePostsConverted = convertMorePosts(morePosts)

  const props = {
    title: "Events",
    href: `/events`,
  }

  return (
    <Layout activityIndicator={activityState} preview={preview}>
      <ContentDefault
        content={{...postConverted, headerLink: props}}
        additionalContent={morePostsConverted.length > 0 ? <MoreStories posts={morePostsConverted}/> : undefined}
      />
    </Layout>
  )
}

export const getStaticProps = (async ({
  params,
  preview = false,
  previewData,
}) => {
  const {post, morePosts} = await getPostAndMorePosts(params?.slug, preview, previewData)
  const activityState = await getActivityIndicator();

  return {
    props: {
      preview,
      post,
      morePosts,
      activityState,
    },
    revalidate: 10,
  }
}) satisfies GetStaticProps<{
  preview: boolean,
  post: PostPropsApi,
  morePosts: MorePostPropsApi[],
  activityState: ActivityIndicatorState
}>

export const getStaticPaths: GetStaticPaths = async () => {
  const allPosts = await getAllPostsWithSlug()
  return {
    paths: allPosts.map((slug) => `/events/${slug}`),
    fallback: true,
  }
}
