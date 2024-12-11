'use cache'
import {childPagesByParentId, getPageByTitle} from "@/lib/api/wordpress";
import {notFound} from "next/navigation";
import Overview from "@/components/page-templates/overview";
import React from "react";
import { unstable_cache } from 'next/cache';

const getCachedPage = unstable_cache(
  async (path: string) => getPageByTitle(path),
  ['page-cache'],
  {
    revalidate: false
  }
);

const getCachedChildPages = unstable_cache(
  async (id: string) => childPagesByParentId(id),
  ['childpages-cache'],
  {
    revalidate: false
  }
);

export default async function CacheWrapper({path}: {path: string}) {
  const page = await getCachedPage(path);
  if (!page) {
    notFound();
  }
  const childPages = await getCachedChildPages(page.id!);
  return <Overview path={path} page={page} childPages={childPages} />;
}
