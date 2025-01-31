import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  childPagesByParentId,
  getAllParentPagesAsSlug,
  getPageByTitle,
  getAllPostsWithSlug,
  getPost,
  getMorePosts
} from '@/lib/api/wordpress';
import ContentDefault from '@/components/page-templates/content-default';
import { convertPage, convertPost } from '@/lib/convertApiInterfaces';
import MoreStories from '@/components/blocks/more-stories';
import ContainerWide from '@/components/ui/container';
import SectionSeparator from '@/components/blocks/section-separator';
import React from 'react';

export const revalidate = 60;

export async function generateStaticParams() {
  // Get all category paths
  const parentSlugs = await getAllParentPagesAsSlug();
  const categoryPaths: { category: string; slug: string }[] = [];

  for (const parentSlug of parentSlugs) {
    const parentPage = await getPageByTitle(parentSlug);
    if (!parentPage) continue;

    const childPages = await childPagesByParentId(parentPage.id!);
    categoryPaths.push(...childPages.map((childPage) => ({
      category: parentSlug,
      slug: childPage.slug!
    })));
  }

  // Get all event paths
  const eventPosts = await getAllPostsWithSlug();
  const eventPaths = eventPosts.map(slug => ({
    category: 'events',
    slug
  }));

  // Combine both sets of paths
  return [...categoryPaths, ...eventPaths];
}

type Props = {
  params: Promise<{ category: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;

  if (category === 'events') {
    const post = await getPost(slug);
    if (!post.slug) notFound();
    return {
      title: `${post.title}`,
      ...(post.featuredImageUrl && {
        openGraph: {
          images: [{ url: post.featuredImageUrl }],
        },
      }),
    };
  }

  const page = await getPageByTitle(slug);
  if (!page) notFound();
  return { title: `${page.title}` };
}

export default async function DetailPage({ params }: Props) {
  const { category, slug } = await params;

  if (category === 'events') {
    const post = await getPost(slug);
    if (!post?.slug) notFound();

    const morePosts = (await getMorePosts(slug)).length;
    const content = {
      ...convertPost(post),
      headerLink: {
        title: "Events",
        href: "/events",
      }
    };

    return (
      <>
        <ContentDefault content={content} />
        {morePosts > 0 && (
          <ContainerWide>
            <SectionSeparator />
            <MoreStories slug={slug} />
          </ContainerWide>
        )}
      </>
    );
  }

  const page = await getPageByTitle(slug);
  if (!page) notFound();

  const content = {
    ...convertPage(page),
    headerLink: page.parent ? {
      title: page.parent.title!,
      href: `/${page.parent.slug}`
    } : undefined
  };

  return <ContentDefault content={content} />;

}
