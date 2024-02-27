if (!process.env.WORDPRESS_API_URL) {
  throw new Error(`
    Please provide a valid WordPress instance URL.
    Add to your environment variables WORDPRESS_API_URL.
  `)
}

if (!process.env.NEXT_PUBLIC_URL) {
  throw new Error(`
    Please provide a valid URL, where the website is going to be hosted.
  `)
}

// for preview NEXT_PUBLIC_VERCEL_URL https://github.com/vercel/next.js/discussions/16429#discussioncomment-4956268
const dotenvExpand = require("dotenv-expand");
dotenvExpand.expand({ parsed: { ...process.env } });

/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    domains: [
      process.env.WORDPRESS_API_URL.match(/(?<!www\.)[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+|localhost/)[0], // Valid WP Image domain.
      '0.gravatar.com',
      '1.gravatar.com',
      '2.gravatar.com',
      'secure.gravatar.com',
    ],
  },
}
