import {GetStaticProps, type InferGetStaticPropsType} from 'next';
import React from 'react';
import Layout from '../../components/layout/layout';
import {childPagesByParentId, getPageByTitle, PageProps} from "../../lib/api";
import Head from "next/head";
import {ActivityIndicatorState, getActivityIndicator} from "../api/activityIndicator";
import PostTitle from "../../components/blocks/post-title";
import PostBody from "../../components/blocks/post-body";
import Link from "next/link";
import Image from "next/image";


export default function OverviewPage({page, childPages, activityState}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout activityIndicator={activityState} preview={false}>
      <Head>
        <title>Overview | TuDo Makerspace</title>
      </Head>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <PostTitle>{page.title}</PostTitle>
        <PostBody content={page.content}/>
        {childPages.length > 0 ? (
          <ul className="flex flex-wrap justify-center gap-4">
            {childPages.map((page) => (
              <li
                key={page.id}
                className="py-4 w-full border-b border-gray-300 last:border-b-0"
              >
                <div className="flex flex-col">
                  <Link
                    href={`/overview/${page.title}`}
                    className="group"
                  >
                    <h3 className="text-3xl mb-3 leading-snug self-start group-hover:underline"
                        dangerouslySetInnerHTML={{__html: page.title}}
                    />
                    {page.featuredImageUrl && (
                      <div
                        className="relative h-[150px] shadow rounded-lg overflow-hidden mb-2 group-hover:scale-105 duration-200">
                        <Image
                          alt={page.title}
                          src={page.featuredImageUrl}
                          fill={true}
                          className="object-cover"
                        />
                      </div>
                    )}
                  </Link>
                  {/*<div
                    className="text-lg leading-relaxed mb-4 text-gray-600"
                    dangerouslySetInnerHTML={{__html: page.content}}
                  />
                  */}
                </div>

              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center">No child pages found.</p>
        )}


      </div>
    </Layout>
  );
};


export const getStaticProps = (async () => {
  const activityState = await getActivityIndicator();
  const res = await getPageByTitle("overview");

  if (!res) {
    return {
      notFound: true,
    }
  }

  const childPages = await childPagesByParentId(res.id)

  return {
    props: {
      page: res,
      childPages,
      activityState: structuredClone(activityState),
    },
    revalidate: 60, // In seconds, for ISR
  };
}) satisfies GetStaticProps<{
  page: PageProps
  childPages: PageProps[]
  activityState: ActivityIndicatorState
}>
