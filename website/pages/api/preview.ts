import type { NextApiRequest, NextApiResponse } from 'next';
import { getPreviewPost } from '../../lib/api';

export default async function preview(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { secret, id, slug } = req.query;
  const isDev = process.env.NODE_ENV === 'development';

  // In production, enforce the secret parameter. In development, allow bypassing the secret.
  if (!isDev && (!process.env.NEXT_WORDPRESS_PREVIEW_SECRET || secret !== process.env.NEXT_WORDPRESS_PREVIEW_SECRET)) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  // Ensure an ID or slug is provided for previewing a post
  if (!id && !slug) {
    return res.status(400).json({ message: 'Post ID or slug is required' });
  }

  // Fetch WordPress post by `id` or `slug`
  const post = await getPreviewPost(id || slug, id ? 'DATABASE_ID' : 'SLUG');

  // If the post doesn't exist, prevent preview mode from being enabled
  if (!post) {
    return res.status(401).json({ message: 'Post not found' });
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({
    post: {
      id: post.databaseId,
      slug: post.slug,
      status: post.status,
    },
  });

  // Redirect to the path from the fetched post
  // We don't redirect to `req.query.slug` as that might lead to open redirect vulnerabilities
  res.writeHead(307, { Location: `/posts/${post.slug || post.databaseId}` });
  res.end();
}
