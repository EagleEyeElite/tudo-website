import { notFound } from 'next/navigation';
import {getAllPostsWithSlug, getMorePosts, getPost} from '@/lib/api/wordpress';
import {Metadata} from "next";
import {convertPost} from "@/lib/convertApiInterfaces";
import ContentDefault from "@/components/page-templates/content-default";
import MoreStories from "@/components/blocks/more-stories";
import ContainerWide from "@/components/ui/container";
import SectionSeparator from "@/components/blocks/section-separator";
import React from "react";

export async function generateStaticParams() {
  const allPosts = await getAllPostsWithSlug();
  return allPosts.map((slug) => ({ slug }));
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post.slug) {
    notFound();
  }

  return {
    title: `${post.title} | TuDo Makerspace`,
    ...(post.featuredImageUrl && {
      openGraph: {
        images: [{ url: post.featuredImageUrl }]
      }
    })
  };

}

export default async function Post({params}: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post?.slug) {
    notFound();
  }

  const morePosts = (await getMorePosts(slug)).length
  const headerLink = {
    title: "Events",
    href: `/events`,
  };

  return <>
    <ContentDefault
      content={{ ...convertPost(post), headerLink }}
    />
    {morePosts > 0 && (
      <ContainerWide>
        <SectionSeparator />
        <MoreStories slug={slug}/>
      </ContainerWide>
    )}
  </>
}
