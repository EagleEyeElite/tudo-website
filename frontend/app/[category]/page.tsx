import React from 'react';
import { notFound } from 'next/navigation';
import { childPagesByParentId, getAllParentPagesAsSlug, getPageByTitle } from "@/lib/api/wordpress";
import { Metadata } from "next";
import Overview from "@/components/page-templates/overview";

export const revalidate = 60

export async function generateStaticParams() {
  const allParentPagesSlugs = await getAllParentPagesAsSlug();
  return allParentPagesSlugs
    .filter(slug => slug !== 'events')
    .map(category => ({ category }));
}

type Props = {
  params: Promise<{ category: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
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

  const childPages = await childPagesByParentId(page.id!);

  return (
    <Overview
      path={category}
      page={page}
      childPages={childPages}
    />
  );
}
