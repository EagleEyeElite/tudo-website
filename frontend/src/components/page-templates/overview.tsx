import PostBody from '@/components/blocks/post-body';
import PostTitle from '@/components/blocks/post-title';
import HeaderLink from '@/components/blocks/headerLink';
import Link from 'next/link';
import {PagePropsApi} from 'lib/api/wordpress';
import Image from 'next/image';
import React from 'react';

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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
      <HeaderLink title="Home" href="/"/>
      <PostTitle>{page.title}</PostTitle>
      <PostBody content={page.content}/>
      {childPages.length > 0 ? (
        <ul className="flex flex-wrap justify-center gap-4">
          {childPages.map((childPage,index) => (
            <li key={index} className="py-4 w-full border-b border-gray-300 last:border-b-0">
              <Link href={`/${path}/${childPage.slug}`} className="group">
                <div className="flex flex-col">
                  <h3 className="text-3xl mb-3 leading-snug self-start group-hover:underline">
                    {childPage.title!}
                  </h3>
                  {childPage.featuredImageUrl && (
                    <div
                      className="relative h-[150px] shadow rounded-lg overflow-hidden mb-2 group-hover:scale-105 duration-200">
                      <Image
                        alt={childPage.title!}
                        src={childPage.featuredImageUrl!}
                        fill={true}
                        sizes="100%"
                        className="object-cover"
                        priority={index < 3}
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
