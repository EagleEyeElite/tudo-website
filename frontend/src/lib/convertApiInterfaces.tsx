import {CoverImageProps} from 'components/blocks/cover-image';
import {AuthorProps} from 'components/blocks/avatar';
import {AuthorPropsApi, MorePostPropsApi, PagePropsApi, PostPropsApi} from 'lib/api/wordpress';
import {ContentDefaultProps} from 'components/page-templates/content-default';


export function convertCoverImage(
  title: string,
  coverImageUrl: string | null,
  slug: string | null,
  parentPath: string | null,
): CoverImageProps | undefined {
  if (coverImageUrl == undefined) {
    return undefined;
  }
  return {
    title,
    coverImageUrl,
    slug: slug || undefined,
    href: `${parentPath!}/${slug!}`
  }
}

export function convertAuthor(author?: AuthorPropsApi) : AuthorProps {
  return {
    firstName: author?.firstName || undefined,
    lastName: author?.lastName || undefined,
    name: author?.name || undefined,
    avatarUrl: author?.avatarUrl || undefined,
  }
}

export function convertPost(post: PostPropsApi): ContentDefaultProps {
  return {
    title: post.title!,
    author: convertAuthor(post.author!),
    coverImage: convertCoverImage(post.title!, post.featuredImageUrl, post?.slug, "/events"),
    date: post.date || undefined,
    content: post.content,
    categories: post.categories || undefined,
    tags: post.tags || undefined,
  };
}

interface AllPostsForHomeProps {
  title?: string;
  excerpt?: string,
  slug?: string,
  date?: string,
  coverImage?: CoverImageProps
  author: AuthorProps,
}

export function convertMorePosts(morePosts: MorePostPropsApi[]): AllPostsForHomeProps[] {
  return morePosts.map(post => ({
      title: post.title!,
      author: convertAuthor(post.author!),
      coverImage: convertCoverImage(post.title!, post.featuredImageUrl, post.slug, "/events"),
      date: post.date || undefined,
      excerpt: post.excerpt || undefined,
      slug: post.slug || undefined,
  }));
}

export function convertPage(page: PagePropsApi):  ContentDefaultProps{
  return {
    title: page.title!,
    content: page.content!,
    coverImage: convertCoverImage(page.title!, page.featuredImageUrl!, null, null),
  }
}
