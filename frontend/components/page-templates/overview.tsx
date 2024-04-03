import Head from "next/head";
import PostBody from "../blocks/post-body";
import PostTitle from "../blocks/post-title";
import HeaderLink from "../blocks/headerLink";
import Link from "next/link";
import {PagePropsApi} from "../../lib/api";
import Image from "next/image";
import React from "react";

export default function Overview({
  path,
  page,
  childPages,
}:{
  path: string
  page: PagePropsApi
  childPages: PagePropsApi[]
}) {

  return <>
    <Head>
      <title>{`${page.title} | TuDo Makerspace`}</title>
    </Head>
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
      <HeaderLink title="Home" href="/"/>
      <PostTitle>{page.title}</PostTitle>
      <PostBody content={page.content}/>
      {childPages.length > 0 ? (
        <ul className="flex flex-wrap justify-center gap-4">
          {childPages.map((childPage) => (
            <li key={childPage.id} className="py-4 w-full border-b border-gray-300 last:border-b-0">
              <Link href={`/${path}/${childPage.slug}`} className="group">
                <div className="flex flex-col">
                  <h3
                    className="text-3xl mb-3 leading-snug self-start group-hover:underline"
                    dangerouslySetInnerHTML={{__html: childPage.title!}}/>
                  {childPage.featuredImageUrl && (
                    <div
                      className="relative h-[150px] shadow rounded-lg overflow-hidden mb-2 group-hover:scale-105 duration-200">
                      <Image
                        alt={childPage.title!}
                        src={childPage.featuredImageUrl!}
                        fill={true}
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center">No child pages found.</p>
      )}
    </div>
  </>;
}
