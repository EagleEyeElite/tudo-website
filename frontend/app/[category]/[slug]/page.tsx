import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { childPagesByParentId, getAllParentPagesAsSlug, getPageByTitle } from "lib/api/wordpress"
import ContentDefault from "@/components/page-templates/content-default";
import { convertPage } from "@/lib/convertApiInterfaces";


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

type Props = {
  params: Promise<{ category: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageByTitle(slug);
  if (!page) {
    notFound()
  }

  return {
    title: page.title,
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const page = await getPageByTitle(slug);
  if (!page) {
    notFound();
  }

  const headerLinkProps = page.parent ? {
    title: page.parent.title!,
    href: `/${page.parent.slug}`
  } : undefined;

  const content = {
    ...convertPage(page),
    headerLink: headerLinkProps
  };

  return <ContentDefault content={content} />;
}
