import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { childPagesByParentId, getAllParentPagesAsSlug, getPageByTitle } from "lib/api/wordpress"
import ContentDefault from "@/components/page-templates/content-default"
import { convertPage } from "@/lib/convertApiInterfaces"
import { HeaderLinkProps } from "@/components/blocks/headerLink"

export const dynamic = 'force-static'
export const revalidate = 10

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
  const params = await props.params;
  const slug = params.slug
  const page = await getPageByTitle(slug)

  if (!page) {
    notFound()
  }

  let headerLinkProps: HeaderLinkProps | undefined = undefined
  if (page.parent) {
    headerLinkProps = {
      title: page.parent.title!,
      href: `/${page.parent.slug}`,
    }
  }

  const content = {
    ...convertPage(page),
    headerLink: headerLinkProps
  }

  return <ContentDefault content={content} />
}
