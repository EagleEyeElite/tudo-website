import PostPreview from './post-preview'
import {CoverImageProps} from "./cover-image";
import {AuthorProps} from "./avatar";

export interface AllPostsForHomeProps {
  title?: string;
  excerpt?: string,
  slug?: string,
  date?: string,
  coverImage?: CoverImageProps
  author: AuthorProps,
}

export default function MoreStories({ posts }: {posts: AllPostsForHomeProps[]}) {
  return (
    <section>
      <h2 className="mb-8 text-6xl md:text-7xl font-bold tracking-tighter leading-tight">
        Events
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 lg:gap-x-32 gap-y-20 md:gap-y-32 mb-32">
        {posts.map((post) => (
          <PostPreview
            key={post.slug}
            title={post.title!}
            coverImage={post.coverImage!}
            date={post.date!}
            author={post.author}
            slug={post.slug!}
            excerpt={post.excerpt!}
          />
        ))}
      </div>
    </section>
  )
}
