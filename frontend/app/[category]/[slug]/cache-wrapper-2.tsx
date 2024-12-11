'use cache'
import {getPageByTitle} from "@/lib/api/wordpress";
import {notFound} from "next/navigation";
import React, {cache} from "react";
import ContentDefault from "@/components/page-templates/content-default";
import {HeaderLinkProps} from "@/components/blocks/headerLink";
import {convertPage} from "@/lib/convertApiInterfaces";

const getCachedPageContent = cache(async (slug: string) => {
  const page = await getPageByTitle(slug);

  if (!page) {
    return null;
  }

  let headerLinkProps: HeaderLinkProps | undefined = undefined;
  if (page.parent) {
    headerLinkProps = {
      title: page.parent.title!,
      href: `/${page.parent.slug}`,
    }
  }

  return {
    ...convertPage(page),
    headerLink: headerLinkProps
  };
});


export default async function CacheWrapper2({slug}: {
  slug: string;
}) {
  const content = await getCachedPageContent(slug);

  if (!content) {
    notFound();
  }

  return <ContentDefault content={content} />;
}
