import Avatar, {AuthorProps} from './avatar'
import Date from './date'
import {CoverImageProps} from './cover-image'
import Link from 'next/link'
import AdaptiveMaxHeightImage from "../ui/adaptive-max-height-image";

interface HeroPostProps {
  title: string;
  coverImage?: CoverImageProps;
  date: string;
  excerpt: string;
  author: AuthorProps;
  slug: string;
}

export default function HeroPost({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}: HeroPostProps) {
  return (
    <section>
      <div className="mb-8 md:mb-16">
        {coverImage && (
          <AdaptiveMaxHeightImage src={coverImage.coverImageUrl} />
        )}
      </div>
      <div className="md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8 mb-20 md:mb-28">
        <div>
          <h3 className="mb-4 text-4xl lg:text-6xl leading-tight">
            <Link
              href={`/events/${slug}`}
              className="hover:underline"
              dangerouslySetInnerHTML={{ __html: title }}
            ></Link>
          </h3>
          <div className="mb-4 md:mb-0 text-lg">
            <Date dateString={date} />
          </div>
        </div>
        <div>
          <div
            className="text-lg leading-relaxed mb-4"
            dangerouslySetInnerHTML={{ __html: excerpt }}
          />
          <Avatar author={author} />
        </div>
      </div>
    </section>
  )
}