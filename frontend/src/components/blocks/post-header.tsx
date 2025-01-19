import Avatar, {AuthorProps} from '@/components/blocks/avatar'
import {CoverImageProps} from '@/components/blocks/cover-image'
import PostTitle from '@/components/blocks/post-title'
import AdaptiveMaxHeightImage from '@/components/ui/adaptive-max-height-image';

interface PostHeaderProps {
  title: string;
  coverImage?: CoverImageProps; // Assuming CoverImageProps is defined elsewhere
  author: AuthorProps; // Assuming AuthorProps is defined elsewhere
}

export default function PostHeader({
   title,
   coverImage,
   author,
}: PostHeaderProps) {
  return (
    <>
      <PostTitle>{title}</PostTitle>
      <div className="hidden md:block md:mb-12">
        <Avatar author={author}/>
      </div>
      <div className="mb-8 md:mb-16 sm:mx-0">
        {coverImage ? <AdaptiveMaxHeightImage src={coverImage.coverImageUrl} priority={true}/> : null}
      </div>
      <div className="max-w-2xl mx-auto md:hidden mb-6">
        <Avatar author={author}/>
      </div>
    </>
  )
}
