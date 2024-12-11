import { notFound } from 'next/navigation';
import { getPostAndMorePosts, getAllPostsWithSlug } from '@/lib/api/wordpress';
import {Metadata} from "next";
import CacheWrapper3 from "@/app/events/[slug]/cache-wrapper-3";
import {connection} from "next/server";

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
  await connection()
  const params = await props0.params;
  //const { isEnabled: isPreview } = draftMode();
  return <CacheWrapper3 slug={params?.slug} />
}
