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

export async function getPreviewPost(id, idType: PostIdType = PostIdType.DatabaseId) {
  const response = await sdk.PreviewPost({
      id,
      idType,
  });

  return response.post;
}


export async function getAllPostsWithSlug() {
  const data = await sdk.GetALLPostsWithSlug();
  return data?.posts;
}

export async function getAllPagesAsSlug(): Promise<string[]> {
  const data = await sdk.GetAllPagesAsSlug();
  return data?.pages?.edges.map(({ node }) => `/pages/${node.slug}`) || [];
}


export interface PageProps {
  id: string;
  title: string;
  content: string;
  featuredImageUrl: string | null;
}

export async function getPageByTitle(title: string) {
  const res = await sdk.PageIdByTitle({title});

  const id = res.pages?.nodes[0]?.id;
  if (id === undefined) {
    return null;
  }
  const page = (await sdk.PageById({id})).page!;
  return {
    id: page.id,
    title: page.title,
    content: page.content,
    featuredImageUrl: page.featuredImage?.node?.sourceUrl || null,
  } as PageProps;
}


export async function getAllPostsForHome() {
  const data = await sdk.AllPosts();
  return data?.posts
}

export async function getPostAndMorePosts(slug, preview, previewData) {
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
    if (isDraft) data.post.slug = postPreview.id; // Draft posts may not have a slug
  } else {
    data = await sdk.PublishedPostAndMorePosts({
      slug, // Passing the slug directly as the variable.
    });
    if (isRevision && data.post.revisions) {
      const revision = data.post.revisions.edges[0]?.node;
      if (revision) Object.assign(data.post, revision);
    }
    data.posts.edges = data.posts.edges.filter(({ node }) => node.slug !== slug);
    if (data.posts.edges.length > 3) data.posts.edges.pop(); // Ensure only 3 posts besides the main one
  }

  return data;
}

export async function getUnpublishedPosts() {

  try {
    // Call the appropriate SDK function to execute the query
    const response = await sdk.UnpublishedPosts();

    // Extract the posts from the response
    const unpublishedPosts = response?.posts?.edges || [];

    // Extract relevant data from each post
    return unpublishedPosts.map(({node}) => ({
      id: node?.id || null,
      title: node?.title || null,
      slug: node?.slug || null,
      status: node?.status || null,
    })); // Return the formatted posts
  } catch (error) {
    console.error('Error fetching unpublished posts:', error);
    return []; // Return an empty array in case of error
  }
}

export async function childPagesByParentId(parentId: string) {
  const response = await sdk.ChildPagesByParentId({ parentId });
  const childPages: PageProps[] = response.pages!.edges.map(({ node }) => ({
    id: node.id,
    title: node.title!,
    slug: node.slug,
    content: node.content!,
    featuredImageUrl: node.featuredImage?.node?.sourceUrl || null,
  }));

  return childPages
}
