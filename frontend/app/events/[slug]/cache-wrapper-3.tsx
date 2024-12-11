'use cache'
import {getPostAndMorePosts} from "@/lib/api/wordpress";
import {notFound} from "next/navigation";
import React, {cache} from "react";
import ContentDefault from "@/components/page-templates/content-default";
import {convertMorePosts, convertPost} from "@/lib/convertApiInterfaces";
import MoreStories from "@/components/blocks/more-stories";


const getCachedPostAndMore = cache(async (slug: string | undefined) => {
  const { post, morePosts } = await getPostAndMorePosts(slug, false, null);

  if (!post?.slug) {
    return null;
  }

  return {
    post: convertPost(post),
    morePosts: convertMorePosts(morePosts)
  };
});

export default async function CacheWrapper3({slug}: {
  slug?: string;
}) {
  const data = await getCachedPostAndMore(slug);

  if (!data) {
    notFound();
  }

  const props = {
    title: "Events",
    href: `/events`,
  };

  return <ContentDefault
    content={{ ...data.post, headerLink: props }}
    additionalContent={data.morePosts.length > 0 ? <MoreStories /> : undefined}
  />
}
