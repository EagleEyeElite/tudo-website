'use cache'

import {fetchMediaItemsWithBackgroundSet} from "@/lib/api/wordpress";
import React from "react";
import BannerClient from "@/components/blocks/banner-client";
import {cacheLife} from "next/dist/server/use-cache/cache-life";


export default async function Banner() {
  //cacheLife({
  //  stale: undefined,     // Always serve stale data if available
  //  revalidate: 0,        // Revalidate immediately after serving
  //  expire: Infinity      // Never expire the cache
  //})

  cacheLife("seconds")

  const backgroundImageUrl = await fetchMediaItemsWithBackgroundSet();

  if (!backgroundImageUrl) {
    return null
  }

  return <BannerClient backgroundImageUrl={backgroundImageUrl} />
}
