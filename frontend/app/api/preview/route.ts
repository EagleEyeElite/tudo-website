import { NextRequest, NextResponse } from 'next/server';
import { getPreviewPost } from 'lib/api/wordpress';
import { PostIdType } from "lib/generated/graphql";
import { draftMode } from 'next/headers';

/**
 * Enable Preview Mode
 * For example http://localhost:3000/api/preview?slug=WP_SLUG=MY_SECRET
 * in dev: http://localhost:3000/api/preview?slug=WP_SLUG
 * @param request
 * @constructor
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const id = searchParams.get('id');
  const slug = searchParams.get('slug');
  const isDev = process.env.NODE_ENV === 'development';

  // In production, enforce the secret parameter. In development, allow bypassing the secret.
  if (!isDev && (!process.env.NEXT_WORDPRESS_PREVIEW_SECRET || secret !== process.env.NEXT_WORDPRESS_PREVIEW_SECRET)) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  // Ensure an ID or slug is provided for previewing a post
  if (!id && !slug) {
    return NextResponse.json({ message: 'Post ID or slug is required' }, { status: 400 });
  }

  // Fetch WordPress post by `id` or `slug`
  const post = await getPreviewPost(id || slug, id ? PostIdType.DatabaseId : PostIdType.Slug);

  // If the post doesn't exist, prevent preview mode from being enabled
  if (!post) {
    return NextResponse.json({ message: 'Post not found' }, { status: 401 });
  }

  // Enable Draft Mode
  (await draftMode()).enable();

  // Redirect to the path from the fetched post
  // We don't redirect to `searchParams.get('slug')` as that might lead to open redirect vulnerabilities
  const url = new URL(`/events/${post.slug || post.databaseId}`, request.url);
  return NextResponse.redirect(url);
}
