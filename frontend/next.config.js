// Setup and configuration
const path = require('path');
// When running tests, don't use any production services, use the .env.example file for now
const envFilePath = process.env.NODE_ENV === 'test' ? '.env.example' : '.env';
require('dotenv-safe').config({
  path: path.join(__dirname, '..', envFilePath),
  example: path.join(__dirname, '.env.local.example'),
  allowEmptyValues: true,
});

// Automatically expand any dotenv variables
const dotenvExpand = require("dotenv-expand");
dotenvExpand.expand({ parsed: { ...process.env } });

async function login() {
  const fetch = (await import('node-fetch')).default;
  const { WORDPRESS_API_URL, WORDPRESS_ADMIN_USER, WORDPRESS_ADMIN_PASSWORD } = process.env;
  const response = await fetch(WORDPRESS_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      query: `mutation {
        login(input: {
          clientMutationId: "uniqueId",
          username: "${WORDPRESS_ADMIN_USER}",
          password: "${WORDPRESS_ADMIN_PASSWORD}",
        }) {
          refreshToken
        }
      }`
    }),
  });

  const data = await response.json();
  if (!response.ok || data.errors) {
    console.warn('Warning: Failed to fetch GRAPHQL refresh token. Preview mode for unpublished WordPress posts will not work.');
    return null;
  }
  return data.data.login.refreshToken;
}

// Next.js configuration
const nextConfig = createNextConfig();

/** @type {import('next').NextConfig} */
function createNextConfig() {
  const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL;
  const defaultProtocol = WORDPRESS_API_URL.includes('localhost', "wordpress") ? 'http' : 'https';
  const hostnamePattern = /(?<!www\.)[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+|localhost|wordpress/;
  const hostname = WORDPRESS_API_URL.match(hostnamePattern)[0];

  return {
    images: {
      remotePatterns: [
        { protocol: defaultProtocol, hostname },
        { protocol: "http", hostname: "localhost" },
        { protocol: "http", hostname: "wordpress" },
        { protocol: defaultProtocol, hostname: '0.gravatar.com' },
        { protocol: defaultProtocol, hostname: '1.gravatar.com' },
        { protocol: defaultProtocol, hostname: '2.gravatar.com' },
        { protocol: defaultProtocol, hostname: 'secure.gravatar.com' },
      ],
    },
  };
}

/** @type {import('next').NextConfig} */
module.exports = async () => {
  let refreshToken;
  if(process.env.NODE_ENV !== 'test') {
    // Attempt login
    refreshToken = await login();
  }

  return {
    ...nextConfig,
    webpack: (config, { dev }) => {
      if (!dev) {
        config.module.rules.push({
          test: /app[\\/]test.*\.(js|jsx|ts|tsx)$/,
          loader: 'ignore-loader',
        });
      }
      return config;
    },
    env: {
      WORDPRESS_AUTH_REFRESH_TOKEN: refreshToken,
    },
    experimental: {
      ppr: 'incremental',
    },
  };
}
