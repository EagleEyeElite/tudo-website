import React from 'react';
import { notFound } from 'next/navigation';
import { childPagesByParentId, getAllParentPagesAsSlug, getPageByTitle } from "@/lib/api/wordpress";
import Overview from "@/components/page-templates/overview";

export const dynamicParams = true;

export const revalidate = 10;

export async function generateStaticParams() {
  const allParentPagesSlugs = await getAllParentPagesAsSlug();
  return allParentPagesSlugs
    .filter(slug => slug !== 'events')
    .map(category => ({ category }));
}

export async function generateMetadata({ params }) {
  const page = await getPageByTitle(params.category);
  if (!page) {
    notFound();
  }

  return {
    title: `${page.title} | TuDo Makerspace`,
  };
}

export default async function OverviewPage({ params }) {
  const path = params.category;
  const page = await getPageByTitle(path);

  if (!page) {
    notFound();
  }

  const childPages = await childPagesByParentId(page.id!);

  return <Overview path={path} page={page} childPages={childPages} />;
}