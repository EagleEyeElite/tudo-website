import cn from 'classnames'
import Image from 'next/image'
import Link from 'next/link'

export interface CoverImageProps {
  title: string
  coverImageUrl: string
  slug?: string
}

export default function CoverImage({coverImage} : {coverImage: CoverImageProps}) {
  const image = (<>
    {coverImage.coverImageUrl ? (
      <Image
        width={2000}
        height={1000}
        alt={`Cover Image for ${coverImage.title}`}
        src={coverImage.coverImageUrl}
        className={cn('shadow-small', {
          'hover:shadow-medium transition-shadow duration-200': coverImage.slug,
        })}
      />
    ) : null}
  </>
  )
  return (
    <div className="sm:mx-0">
      {coverImage.slug ? (
        <Link href={`/events/${coverImage.slug}`} aria-label={coverImage.title}>
          {image}
        </Link>
      ) : image}
    </div>
  )
}
