import PostPreview from './post-preview'
import {getLatestPostsForHome} from "@/lib/api/wordpress";
import {convertMorePosts} from "@/lib/convertApiInterfaces";

export default async function MoreStories() {
  const morePosts = await getLatestPostsForHome();
  const morePostsConverted = convertMorePosts(morePosts);

  if (morePostsConverted.length == 0) {
    return null
  }

  return (
    <section>
      <h2 className="mb-8 text-6xl md:text-7xl font-bold tracking-tighter leading-tight">
        Events
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 lg:gap-x-32 gap-y-20 md:gap-y-32 mb-32">
        {morePostsConverted.map((post) => (
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
