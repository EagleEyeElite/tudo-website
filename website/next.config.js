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

require('dotenv-safe').config({
  allowEmptyValues: true,
  example: '.env.local.example',
});


// next.config.js
const defaultProtocol = process.env.WORDPRESS_API_URL.includes('localhost') ? 'http' : 'https';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: defaultProtocol,
        hostname: process.env.WORDPRESS_API_URL.match(/(?<!www\.)[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+|localhost/)[0],
      },
      {
        protocol: defaultProtocol,
        hostname: '0.gravatar.com',
      },
      {
        protocol: defaultProtocol,
        hostname: '1.gravatar.com',
      },
      {
        protocol: defaultProtocol,
        hostname: '2.gravatar.com',
      },
      {
        protocol: defaultProtocol,
        hostname: 'secure.gravatar.com',
      },
    ],
  },
}

module.exports = nextConfig;
