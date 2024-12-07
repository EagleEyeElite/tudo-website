import { notFound } from 'next/navigation';
import MoreStories from '@/components/blocks/more-stories';
import ContentDefault from "@/components/page-templates/content-default";
import { getPostAndMorePosts, getAllPostsWithSlug } from '@/lib/api/wordpress';
import { convertPost, convertMorePosts } from "@/lib/convertApiInterfaces";
import {Metadata} from "next";

export const dynamicParams = true;

export const revalidate = 10

export async function generateStaticParams() {
  const allPosts = await getAllPostsWithSlug();
  return allPosts.map((slug) => ({ slug }));
}

export async function generateMetadata(props): Promise<Metadata> {
  const params = await props.params;
  const { post } = await getPostAndMorePosts(params?.slug, false, null);
  if (!post?.slug) {
    notFound();
  }

  const metadata = {
    title: `${post.title} | TuDo Makerspace`,
  };

  if (post.featuredImageUrl) {
    metadata['openGraph'] = {
      images: [{ url: post.featuredImageUrl }],
    };
  }

  return metadata;
}

export default async function Post(props0) {
  const params = await props0.params;
  //const { isEnabled: isPreview } = draftMode();
  const { post, morePosts } = await getPostAndMorePosts(params?.slug, false, null);

  if (!post?.slug) {
    notFound();
  }

  const postConverted = convertPost(post);
  const morePostsConverted = convertMorePosts(morePosts);

  const props = {
    title: "Events",
    href: `/events`,
  };

  return (
    <ContentDefault
      content={{ ...postConverted, headerLink: props }}
      additionalContent={morePostsConverted.length > 0 ? <MoreStories posts={morePostsConverted} /> : undefined}
    />
  );
}
