import { GetStaticProps } from 'next';
import Link from 'next/link';
import React from 'react';
import Layout from '../../components/layout';
import {childPagesByParentId, getPageByTitle} from "../../lib/api";
import Head from "next/head";
import {getActivityIndicator} from "../api/activityIndicator";
import PostTitle from "../../components/post-title";
import PostBody from "../../components/post-body";

const OverviewPage = ({ page, childPages, preview, activityState }) => {
  return (
      <Layout activityIndicator={activityState} preview={preview}>
        <Head>
          <title>Overview | TuDo Makerspace</title>
        </Head>
        <div className="max-w-2xl mx-auto">
          <PostTitle>{page.title}</PostTitle>
          <PostBody content={page.content}/>
          {childPages.length > 0 ? (
            <ul>
              {childPages.map((page) => (
                <li key={page.id}>
                  <Link href={`/${page.slug}`}>{page.title}</Link> {/* Adjust href to use slug */}
                </li>
              ))}
            </ul>
          ) : (
            <p>No child pages found.</p>
          )}
        </div>
      </Layout>
  );
};


export const getStaticProps: GetStaticProps = async ({
                                                       params,
                                                     }) => {
  const activityState = await getActivityIndicator();
  const res = await getPageByTitle("overview");

  if (!res) {
    return {
      notFound: true,
    }
  }

  const childPages= await childPagesByParentId(res.id)

  return {
    props: {
      page: res,
      childPages,
      activityState: structuredClone(activityState),
    },
    revalidate: 60, // In seconds, for ISR
  };
};

export default OverviewPage;
