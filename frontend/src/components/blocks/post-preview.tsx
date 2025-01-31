import Avatar, {AuthorProps} from '@/components/blocks/avatar'
import Date from '@/components/blocks/date'
import CoverImage, {CoverImageProps} from '@/components/blocks/cover-image'
import Link from 'next/link'
import React from 'react';
import { HTMLRenderer } from '@/components/render/renderWordpress';


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
      <CoverImage {...coverImage} />
      <Link href={`/events/${slug}`} className="block hover:underline pt-5">
        <h3 className="text-3xl leading-snug">{title}</h3>
      </Link>
      <Date className="block text-lg pt-3" dateString={date} />
      <HTMLRenderer content={excerpt} className="py-4"
      />
      <Avatar author={author} />
    </div>
  )
}
