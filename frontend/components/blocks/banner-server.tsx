'use cache'

import {fetchMediaItemsWithBackgroundSet} from "@/lib/api/wordpress";
import React from "react";
import BannerClient from "@/components/blocks/banner-client";
import {cacheLife} from "next/dist/server/use-cache/cache-life";

export default async function Banner() {
  cacheLife({
    revalidate: 1,  // Fetch a new one immediately after serving // TODO test how 0 works
    expire: Infinity,
  })

  const backgroundImageUrl = await fetchMediaItemsWithBackgroundSet();

  if (!backgroundImageUrl) {
    return null
  }

  return <BannerClient backgroundImageUrl={backgroundImageUrl} />
}
