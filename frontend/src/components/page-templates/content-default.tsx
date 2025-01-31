import PostTitle from '@/components/blocks/post-title';
import ContainerWide, {ContainerTight} from '@/components/ui/container';
import PostBody from '@/components/blocks/post-body';
import HeaderLink, {HeaderLinkProps} from '@/components/blocks/headerLink';
import PostHeader from '@/components/blocks/post-header';
import Tags from '@/components/blocks/tags';
import React from 'react';
import {CoverImageProps} from '@/components/blocks/cover-image';
import {AuthorProps} from '@/components/blocks/avatar';
import AdaptiveMaxHeightImage from '@/components/ui/adaptive-max-height-image';
import Date from '@/components/blocks/date';
import Categories from '@/components/blocks/categories';


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


function ContentHeader({ title, coverImage, author }: Pick<ContentDefaultProps, 'title' | 'coverImage' | 'author'>) {
  if (author) {
    return <PostHeader title={title} coverImage={coverImage} author={author} />;
  }

  if (coverImage?.coverImageUrl) {
    return <>
      <PostTitle>{title}</PostTitle>
      <div className="mb-8 md:mb-16 sm:mx-0">
        <AdaptiveMaxHeightImage src={coverImage.coverImageUrl} priority={true} />
      </div>
    </>;
  }

  return <PostTitle>{title}</PostTitle>;
}

function ContentFooter({ date, categories, tags }: Pick<ContentDefaultProps, 'date' | 'categories' | 'tags'>) {
  return (
    <div className="max-w-2xl mx-auto pt-8 text-lg">
      {date && <> Posted <Date dateString={date} /> </>}
      {categories && <Categories categories={categories} />}
      {tags?.length! > 0 && <Tags tags={tags!} />}
    </div>
  );
}

export default function ContentDefault({
  content
}: {
  content: ContentDefaultProps;
}) {
  const Container = content.coverImage?.coverImageUrl ? ContainerWide : ContainerTight;

  return (
    <Container>
      {content.headerLink && <HeaderLink {...content.headerLink} />}
      <article className="mb-20">
        <ContentHeader
          title={content.title}
          coverImage={content.coverImage}
          author={content.author}
        />
        <PostBody content={content.content} />
        <ContentFooter
          date={content.date}
          categories={content.categories}
          tags={content.tags}
        />
      </article>
    </Container>
  );
}
