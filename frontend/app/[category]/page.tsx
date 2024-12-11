import React from 'react';
import { notFound } from 'next/navigation';
import { getAllParentPagesAsSlug, getPageByTitle } from "@/lib/api/wordpress";
import CacheWrapper from "@/app/[category]/cache-wrapper";
import {Metadata} from "next";
import {connection} from "next/server";

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
  await connection()
  const category = (await params).category;
  return <CacheWrapper path={category}/>
}
