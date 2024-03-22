import {GraphQLClient} from "graphql-request";
import {getSdk, PostIdType} from "./generated/graphql";


export function getInitializedSdk() {
  const API_URL = process.env.WORDPRESS_API_URL || "";
  const headers = {
    'Content-Type': 'application/json',
  };

  if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
  }

  const client = new GraphQLClient(API_URL, { headers });
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
  return (data.posts?.edges
    .map(({node}) => node.slug || null)
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
  const res = await sdk.PageIdByTitle({title});

  const id = res.pages?.nodes[0]?.id;
  if (id === undefined) {
    return null;
  }
  const page = (await sdk.PageById({ id })).page!;


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

export async function getAllPostsForHome(): Promise<MorePostPropsApi[]> {
  const data = await sdk.AllPosts();

  return data?.posts?.edges.map(({node}) => ({
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

  let data;
  if (isDraft) {
    data = await sdk.DraftPostBySlug({
      id: postPreview.id,
    });
    if (isDraft) data.post.slug = postPreview.id;
  } else {
    data = await sdk.PublishedPostAndMorePosts({slug});
    if (isRevision && data.post.revisions) {
      const revision = data.post.revisions.edges[0]?.node;
      if (revision) Object.assign(data.post, revision);
    }
    data.posts.edges = data.posts.edges.filter(({ node }) => node.slug !== slug);
    if (data.posts.edges.length > 3) data.posts.edges.pop(); // Ensure only 3 posts besides the main one
  }

  return {
    post: {
      title: data.post.title,
      excerpt: data.post.excerpt,
      slug: data.post.slug,
      date: data.post.date,
      author: {
        firstName: data.post.author?.node?.firstName,
        lastName: data.post.author?.node?.lastName,
        name: data.post.author?.node?.name,
        avatarUrl: data.post.author?.node?.avatar?.url,
      },
      featuredImageUrl: data.post.featuredImage?.node?.sourceUrl || null,
      categories: data.post.categories?.edges.map(({ node }) => node.name) || null,
      content: data.post.content,
      tags: data.post.tags?.edges.map(({ node }) => node.name) || null
    },
    morePosts: data.posts.edges.map(({node}) => {
      return {
        title: node.title || null,
          excerpt: node.excerpt || null,
        slug: node.slug || null,
        date: node.date || null,
        author: {
          firstName: node.author?.node?.firstName,
          lastName: node.author?.node?.lastName,
          name: node.author?.node?.name,
          avatarUrl: node.author?.node?.avatar?.url,
        },
        featuredImageUrl: node.featuredImage?.node?.sourceUrl || null,
      }
    }) || [],
  }
}

export async function getUnpublishedPosts() {
  try {
    const response = await sdk.UnpublishedPosts();
    const unpublishedPosts = response?.posts?.edges || [];
    return unpublishedPosts.map(({node}) => ({
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
  const childPages: PagePropsApi[] = response.pages!.edges.map(({ node }) => ({
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

  const backgroundTrueItemIds = mediaItems!
    .filter(item => item.background!.background === true)
    .map(item => item.mediaItemUrl);

  return backgroundTrueItemIds[0]!;
}
