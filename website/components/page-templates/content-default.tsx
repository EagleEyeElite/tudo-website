import Head from "next/head";
import PostTitle from "../blocks/post-title";
import ContainerWide, {ContainerTight} from "../ui/container";
import PostBody from "../blocks/post-body";
import SectionSeparator from "../blocks/section-separator";
import Header from "../blocks/header";
import PostHeader from "../blocks/post-header";
import Tags from "../blocks/tags";
import {JSX} from "react";
import CoverImage, {CoverImageProps} from "../blocks/cover-image";
import {AuthorProps} from "../blocks/avatar";

export interface ContentDefaultProps {
  categories?: string[],
  title: string;
  author?: AuthorProps,
  coverImage?: CoverImageProps,
  date?: string,
  content: string,
  tags?: string[],
}

export default function ContentDefault({content, additionalContent}: {
  content: ContentDefaultProps;
  additionalContent?: JSX.Element;
}) {
  const featuredImageUrl = content.coverImage?.coverImageUrl;
  const renderWide = featuredImageUrl != undefined;

  const Containers = renderWide ? ContainerWide : ContainerTight;
  const Category = content?.categories ? <Header category={content?.categories[0]}/> : undefined;
  const metaOgImage = featuredImageUrl ? <meta property="og:image" content={featuredImageUrl}/> : null;
  let extra : JSX.Element | null = null
  if (additionalContent != null) {
    extra = <ContainerWide>
      <SectionSeparator />
      {additionalContent}
    </ContainerWide>
  }

  let postHeader: JSX.Element;
  if (content.date != null && content.author != null && content.categories != null) {
    postHeader = <PostHeader
      title={content.title}
      coverImage={content.coverImage}
      date={content.date}
      author={content.author}
      categories={content.categories}
    />;
  } else {
    postHeader = <PostTitle>{content.title}</PostTitle>;
    if(content.coverImage?.coverImageUrl != null) {
      postHeader = <>
        <PostTitle>{content.title}</PostTitle>
        <div className="mb-8 md:mb-16 sm:mx-0">
          <CoverImage coverImage={content.coverImage} />
        </div>
      </>
    }
  }

  let footer: JSX.Element | null = null;
  if ((content.tags?.length ?? 0) > 0) {
    footer = <Tags tags={content.tags || []} />;
  }

  return (<>
    <Head>
      <title>
        {`${content.title} | TuDo Makerspace`}
      </title>
      {metaOgImage}
    </Head>
    <Containers>
      {Category}
      <article>
        {postHeader}
        <PostBody content={content.content} />
        {footer}
      </article>
    </Containers>
    {extra}
  </>)
}
