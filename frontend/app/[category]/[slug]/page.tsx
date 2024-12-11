import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { childPagesByParentId, getAllParentPagesAsSlug, getPageByTitle } from "lib/api/wordpress"
import CacheWrapper2 from "@/app/[category]/[slug]/cache-wrapper-2";
import {connection} from "next/server";

type Props = {
  params: Promise<{ category: string; slug: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug
  const page = await getPageByTitle(slug)

  if (!page) {
    notFound()
  }

  return {
    title: page.title,
  }
}

export async function generateStaticParams() {
  const parentSlugs = await getAllParentPagesAsSlug()
  const paths: { category: string; slug: string }[] = []

  for (const parentSlug of parentSlugs) {
    const parentPage = await getPageByTitle(parentSlug)
    if (!parentPage) continue

    const childPages = await childPagesByParentId(parentPage.id!)
    paths.push(...childPages.map((childPage) => ({
      category: parentSlug,
      slug: childPage.slug!
    })))
  }

  return paths
}


export default async function Page(props) {
  await connection()
  const params = await props.params;
  const slug = params.slug
  return <CacheWrapper2 slug={slug} />
}
