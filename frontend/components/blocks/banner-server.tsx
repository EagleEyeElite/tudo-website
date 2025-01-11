'use cache'
import {fetchMediaItemsWithBackgroundSet} from "@/lib/api/wordpress";
import React from "react";
import BannerClient from "@/components/blocks/banner-client";
import {cacheLife} from "next/dist/server/use-cache/cache-life";
import Image from "next/image";

async function BannerImage() {
  cacheLife({
    revalidate: 1,
    expire: Infinity,
  })
  const backgroundImageUrl = await fetchMediaItemsWithBackgroundSet();
  if (!backgroundImageUrl) {
    return null
  }

  return <Image
    src={backgroundImageUrl}
    alt=""
    fill={true}
    className="object-cover"
    priority={true}
    sizes="100vw"
  />;
}

export default async function Banner() {
  return <>
    <BannerClient bannerImage={<BannerImage />} />
    </>
}
