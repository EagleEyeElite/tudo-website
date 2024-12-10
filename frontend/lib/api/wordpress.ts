import {GraphQLClient} from "graphql-request";
import {getSdk, PostIdType} from "../generated/graphql";
import _ from "lodash";


export function getInitializedSdk() {
  const API_URL = process.env.WORDPRESS_API_URL || "";
  const headers = {
    'Content-Type': 'application/json',
  };

  if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
  }

  const client = new GraphQLClient(API_URL, {
    headers,
    fetch: (url: RequestInfo | URL, init?: RequestInit) => {
      return fetch(url, {
        ...init,
        next: {
          revalidate: 3600,
        },
      });
    }
  });

  return getSdk(client);
}
const sdk = getInitializedSdk();

interface PreviewPostProps {
  databaseId: number
  slug: string | null
  status: string | null
}

export async function getPreviewPost(id, idType: PostIdType = PostIdType.DatabaseId): Promise<PreviewPostProps> {
  const response = await sdk.PreviewPost({
      id,
      idType,
  });

  return {
    databaseId: response.post?.databaseId!,
    slug: response.post?.slug || null,
    status: response.post?.status || null,
  }
}

export async function getAllPostsWithSlug() {
  const data = await sdk.GetALLPostsWithSlug();
  return (data.posts?.nodes.map(node => node.slug || null)
    .filter((slug): slug is string => slug !== null) || []) ;
}

export async function getAllParentPagesAsSlug(): Promise<string[]> {
  const data = await sdk.GetAllParentPagesAsSlug();
  return data.pages?.nodes.map(({ slug }) => slug!) || [];
}

interface ParentPagePropsApi {
  title: string | null;
  slug: string | null;
}

export interface PagePropsApi {
  id: string | null;
  title: string | null;
  content: string | null;
  featuredImageUrl: string | null;
  slug: string | null;
  parent: ParentPagePropsApi | null;
}
export async function getPageByTitle(title: string): Promise<PagePropsApi | null>{
  const page = (await sdk.PageDetailsByTitle({ title })).pages!.nodes![0];
  if (page === undefined ) {
    return null
  }

  let parent: ParentPagePropsApi | null = null;
  if (page.parent && page.parent.node.__typename === 'Page') {
    const {title, slug} = page.parent?.node;
    parent = {title: title || null, slug: slug || null};
  }

  return {
    id: page.id,
    title: page.title!,
    content: page.content!,
    featuredImageUrl: page.featuredImage?.node?.sourceUrl || null,
    parent: parent,
    slug: null,
  };
}

export interface AuthorPropsApi {
  firstName: string | null;
  lastName: string | null;
  name: string | null;
  avatarUrl: string | null;
}
export interface MorePostPropsApi {
  title: string | null;
  excerpt: string | null;
  slug: string | null;
  date: string | null;
  featuredImageUrl: string | null;
  author: AuthorPropsApi | null;
}

export async function getHeroPostForHome() {
  'use cache'
  const data = await sdk.AllPostsAndWelcomePage();
  const dataWelcomePost = data.welcomePage?.nodes[0].children?.nodes[0]
  if (!(dataWelcomePost && dataWelcomePost.__typename === 'Page')) {
    throw new Error('Welcome page not found');
  }

  return {
    title: dataWelcomePost.title || null,
    excerpt: dataWelcomePost.content || null,
    slug: dataWelcomePost.slug || null,
    date: dataWelcomePost.date || null,
    featuredImageUrl: dataWelcomePost.featuredImage?.node?.sourceUrl || null,
    author: null
  }
}

export async function getLatestPostsForHome() {
  const data = await sdk.AllPostsAndWelcomePage();
  const dataWelcomePost = data.welcomePage?.nodes[0].children?.nodes[0]
  if (!(dataWelcomePost && dataWelcomePost.__typename === 'Page')) {
    throw new Error('Welcome page not found');
  }

  return data?.latestPosts?.nodes.map(node=> ({
      title: node.title || null,
      excerpt: node.excerpt || null,
      slug: node.slug || null,
      date: node.date || null,
      featuredImageUrl: node.featuredImage?.node?.sourceUrl || null,
      author: {
        firstName: node.author?.node?.firstName || null,
        lastName: node.author?.node?.lastName || null,
        name: node.author?.node?.name || null,
        avatarUrl: node.author?.node?.avatar?.url || null,
      },
    }
  )) || []
}

export interface PostPropsApi extends MorePostPropsApi {
  categories: string[] | null;
  content: string;
  tags: string[] | null;
}

export interface getPostAndMorePostsApi {
  post: PostPropsApi;
  morePosts: MorePostPropsApi[];
}

export async function getPostAndMorePosts(slug, preview, previewData): Promise<getPostAndMorePostsApi> {
  const postPreview = preview && previewData?.post;
  const isId = Number.isInteger(Number(slug));
  const isSamePost = isId ? Number(slug) === postPreview.id : slug === postPreview.slug;
  const isDraft = isSamePost && postPreview?.status === 'draft';
  const isRevision = isSamePost && postPreview?.status === 'publish';


  if (isDraft) {
    const postsAndMore = await sdk.DraftPostBySlug({
      id: postPreview.id,
    });
    return {
      post: {
        title: postsAndMore.post?.title || null,
        excerpt: postsAndMore.post?.excerpt || null,
        slug: postsAndMore.post?.slug || "preview",
        date: postsAndMore.post?.date || null,
        author: {
          firstName: postsAndMore.post?.author?.node?.firstName || null,
          lastName: postsAndMore.post?.author?.node?.lastName || null,
          name: postsAndMore.post?.author?.node?.name || null,
          avatarUrl: postsAndMore.post?.author?.node?.avatar?.url || null,
        },
        featuredImageUrl: postsAndMore.post?.featuredImage?.node?.sourceUrl || null,
        categories: postsAndMore.post?.categories?.nodes.map(node => node.name!) || null,
        content: postsAndMore.post?.content!,
        tags: postsAndMore.post?.tags?.nodes?.map( node => node.name!) || null
      },
      morePosts: []
    }
  }
  const postsAndMore = await sdk.PublishedPostAndMorePosts({slug});
  if (isRevision && postsAndMore.post?.revisions) {
    const revision = postsAndMore.post.revisions.nodes[0];
    if (revision) Object.assign(postsAndMore.post, revision);
  }
  const morePosts = postsAndMore.posts?.nodes
    .filter(node => node.slug !== slug)
    .slice(0, 3);

  return {
    post: {
      title: postsAndMore.post?.title || null,
      excerpt: postsAndMore.post?.excerpt || null,
      slug: postsAndMore.post?.slug || null,
      date: postsAndMore.post?.date || null,
      author: {
        firstName: postsAndMore.post?.author?.node?.firstName || null,
        lastName: postsAndMore.post?.author?.node?.lastName || null,
        name: postsAndMore.post?.author?.node?.name || null,
        avatarUrl: postsAndMore.post?.author?.node?.avatar?.url || null,
      },
      featuredImageUrl: postsAndMore.post?.featuredImage?.node?.sourceUrl || null,
      categories: postsAndMore.post?.categories?.nodes.map(node => node.name!) || null,
      content: postsAndMore.post?.content!,
      tags: postsAndMore.post?.tags?.nodes?.map( node => node.name!) || null
    },
    morePosts: morePosts?.map(node => ({
      title: node.title || null,
      excerpt: node.excerpt || null,
      slug: node.slug || null,
      date: node.date || null,
      author: {
        firstName: node.author?.node?.firstName || null,
        lastName: node.author?.node?.lastName || null,
        name: node.author?.node?.name || null,
        avatarUrl: node.author?.node?.avatar?.url || null,
      },
      featuredImageUrl: node.featuredImage?.node?.sourceUrl || null,
    })) ?? []
  }
}

export async function getUnpublishedPosts() {
  try {
    const response = await sdk.UnpublishedPosts();
    const unpublishedPosts = response?.posts?.nodes || [];
    return unpublishedPosts.map(node => ({
      id: node?.id || null,
      title: node?.title || null,
      slug: node?.slug || null,
      status: node?.status || null,
    }));
  } catch (error) {
    console.error('Error fetching unpublished posts:', error);
    return [];
  }
}

export async function childPagesByParentId(parentId: string) {
  const response = await sdk.ChildPagesByParentId({ parentId });
  const childPages: PagePropsApi[] = response.pages!.nodes.map(node => ({
    id: node.id,
    title: node.title!,
    slug: node.slug ||null,
    content: node.content!,
    featuredImageUrl: node.featuredImage?.node?.sourceUrl || null,
    parent: null,
  }));

  return childPages
}

export async function fetchMediaItemsWithBackgroundSet() {
  const response = await sdk.FetchMediaItemsWithBackgroundSet();
  const mediaItems = response.mediaItems?.nodes;

  const backgroundTrueItemIds = mediaItems
    ?.map(item => item.mediaItemUrl!);

  return _.sample(backgroundTrueItemIds);
}
