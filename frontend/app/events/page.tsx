'use cache'
import React from 'react';
import { Metadata } from 'next';
import { getLatestPostsForHome, getPageByTitle } from "lib/api/wordpress";
import Overview from "../../components/page-templates/overview";
import {notFound} from "next/navigation";

export const metadata: Metadata = {
  title: 'Events | TuDo Makerspace',
};

export default async function OverviewPage() {
  const res = await getLatestPostsForHome();
  const eventsPage = await getPageByTitle("Events");

  if (!eventsPage) {
    notFound();
  }
  const posts = res.map(post => ({
    id: null,
    title: post.title,
    content: post.excerpt,
    featuredImageUrl: post.featuredImageUrl,
    slug: post.slug,
    parent: null
  }));

  return <Overview path={"events"} page={eventsPage} childPages={posts} />;
}
