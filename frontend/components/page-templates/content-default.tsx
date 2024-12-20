import Head from "next/head";
import PostTitle from "../blocks/post-title";
import ContainerWide, {ContainerTight} from "../ui/container";
import PostBody from "../blocks/post-body";
import SectionSeparator from "../blocks/section-separator";
import HeaderLink, {HeaderLinkProps} from "../blocks/headerLink";
import PostHeader from "../blocks/post-header";
import Tags from "../blocks/tags";
import React, {JSX} from "react";
import {CoverImageProps} from "../blocks/cover-image";
import {AuthorProps} from "../blocks/avatar";
import AdaptiveMaxHeightImage from "../ui/adaptive-max-height-image";
import Date from "../blocks/date";
import Categories from "../blocks/categories";

export interface ContentDefaultProps {
  headerLink?: HeaderLinkProps,
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
  const Category = content.headerLink ? <HeaderLink {...content.headerLink}/> : undefined;
  const metaOgImage = featuredImageUrl ? <meta property="og:image" content={featuredImageUrl}/> : null;
  let extra: JSX.Element | null = null
  if (additionalContent != null) {
    extra = <ContainerWide>
      <SectionSeparator/>
      {additionalContent}
    </ContainerWide>
  }

  let postHeader: JSX.Element;
  if (content.author != null) {
    postHeader = <PostHeader
      title={content.title}
      coverImage={content.coverImage}
      author={content.author}
    />;
  } else {
    postHeader = <PostTitle>{content.title}</PostTitle>;
    if (content.coverImage?.coverImageUrl != null) {
      postHeader = <>
        <PostTitle>{content.title}</PostTitle>
        <div className="mb-8 md:mb-16 sm:mx-0">
          <AdaptiveMaxHeightImage src={content.coverImage.coverImageUrl} priority={true}/>
        </div>
      </>
    }
  }

  const footer = (
    <div className="max-w-2xl mx-auto mb-6 text-lg">
      {content.date && (
        <>
          Posted <Date dateString={content.date} />
        </>
      )}
      {content.categories && <Categories categories={content.categories} />}
      {content.tags && content.tags.length > 0 && <Tags tags={content.tags} />}
    </div>
  )

  return (<>
    <Containers>
      {Category}
      <article className="mb-20">
        {postHeader}
        <PostBody content={content.content}/>
        {footer}
      </article>
    </Containers>
    {extra}
  </>)
}
