import cn from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import AdaptiveMaxHeightImage from "../ui/adaptive-max-height-image";
import React from "react";

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
  maxH = false,
  priority = false
} : CoverImageProps) {
  if (!coverImageUrl){
    return <></>
  }

  let image: React.ReactNode;
  if (maxH) {
    image = <AdaptiveMaxHeightImage
      src={coverImageUrl}
      alt={`Cover Image for ${title}`}
      priority={priority}
    />
  } else {
    image = (
      <Image
        width={2000}
        height={1000}
        alt={`Cover Image for ${title}`}
        src={coverImageUrl}
        className={cn('shadow-small', {
          'hover:shadow-medium transition-shadow duration-200': slug,
        })}
        priority={priority}
      />
    )
  }
  return (
    <div className="sm:mx-0">
      {href ? (
        <Link href={href} aria-label={title}>
          {image}
        </Link>
      ) : image}
    </div>
  )
}
