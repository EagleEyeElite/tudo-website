import cn from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export interface CoverImageProps {
  title: string
  coverImageUrl: string
  slug?: string
  href: string
  maxH?: boolean
  priority?: boolean
}

export default function CoverImage(
{
  title,
  coverImageUrl,
  slug,
  href,
  priority = false,
}: CoverImageProps) {
  if (!coverImageUrl) return null

  const image =  (
    <Image
      alt={`Cover Image for ${title}`}
      priority={priority}
      src={coverImageUrl}
      width={2000}
      height={1000}
      className={cn('shadow-small', {
        'hover:shadow-medium transition-shadow duration-200': slug,
      })}
    />
  )

  if (!href)
    return image

  return (
    <Link href={href} aria-label={title}>
      {image}
    </Link>
  )
}
