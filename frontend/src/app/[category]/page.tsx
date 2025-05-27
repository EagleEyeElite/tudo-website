import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getLatestPostsForHome,
  getPageByTitle,
  childPagesByParentId,
  getAllParentPagesAsSlug
} from '@/lib/api/wordpress';
import Overview from '@/components/page-templates/overview';

export const revalidate = 10;

type Props = {
  params: Promise<{ category: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateStaticParams() {
  const allParentPagesSlugs = await getAllParentPagesAsSlug();
  return allParentPagesSlugs.map(category => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = (await params).category;
  const page = await getPageByTitle(category);

  if (!page) {
    notFound();
  }

  return {
    title: `${page.title} | TuDo Makerspace`,
  };
}

export default async function OverviewPage({ params }: Props) {
  const category = (await params).category;
  const page = await getPageByTitle(category);
  if (!page) {
    notFound();
  }

  if (category === 'events') {
    const posts = await getLatestPostsForHome();
    const childPages = posts.map(post => ({
      id: null,
      title: post.title,
      content: post.excerpt,
      featuredImageUrl: post.featuredImageUrl,
      slug: post.slug,
      parent: null
    }));

    return (
      <Overview
        path={'events'}
        page={page}
        childPages={childPages}
      />
    )
  }

  const childPages = await childPagesByParentId(page.id!);
  return (
    <Overview
      path={category}
      page={page}
      childPages={childPages}
    />
  );
}
