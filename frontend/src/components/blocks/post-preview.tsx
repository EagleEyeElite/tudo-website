import Avatar, {AuthorProps} from '@/components/blocks/avatar'
import Date from '@/components/blocks/date'
import CoverImage, {CoverImageProps} from '@/components/blocks/cover-image'
import Link from 'next/link'
import { HTMLRenderer } from '@/components/render/renderWordpress';
import React from 'react';


interface PostPreviewProps {
  title: string;
  coverImage: CoverImageProps; // Assuming CoverImageProps is defined elsewhere
  date: string;
  excerpt: string;
  author: AuthorProps; // Assuming AuthorProps is defined elsewhere
  slug: string;
}

export default function PostPreview({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}: PostPreviewProps) {
  return (
    <div>
      <div className="mb-5">
        {coverImage && (
          <CoverImage {...coverImage} priority={false}/>
        )}
      </div>
      <h3 className="text-3xl mb-3 leading-snug">
        <Link
          href={`/events/${slug}`}
          className="hover:underline prose prose-l"
        >
          <HTMLRenderer content={title} />
        </Link>
      </h3>
      <div className="text-lg mb-4">
        <Date dateString={date} />
      </div>
      <div className="text-lg leading-relaxed mb-4 prose prose-l">
        <HTMLRenderer content={excerpt} />
      </div>
      <Avatar author={author} />
    </div>
  )
}
