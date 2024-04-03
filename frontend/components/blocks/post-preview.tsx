import Avatar, {AuthorProps} from './avatar'
import Date from './date'
import CoverImage, {CoverImageProps} from './cover-image'
import Link from 'next/link'


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
          <CoverImage coverImage={coverImage} />
        )}
      </div>
      <h3 className="text-3xl mb-3 leading-snug">
        <Link
          href={`/events/${slug}`}
          className="hover:underline"
          dangerouslySetInnerHTML={{ __html: title }}
        ></Link>
      </h3>
      <div className="text-lg mb-4">
        <Date dateString={date} />
      </div>
      <div
        className="text-lg leading-relaxed mb-4"
        dangerouslySetInnerHTML={{ __html: excerpt }}
      />
      <Avatar author={author} />
    </div>
  )
}
