import path from 'path';
import { NextConfig } from 'next';
import dotenvSafe from 'dotenv-safe';
import dotenvExpand from 'dotenv-expand';
import { getInitializedSdk } from "@/lib/api/wordpress";
import type {ImageConfig} from "next/dist/shared/lib/image-config";

function loadEnvFile() {
  // When running tests, don't use any production services, use the .env.example file for now
  const envFilePath = process.env.NODE_ENV === 'test' ? '.env.example' : '.env';

  // Configure dotenv-safe
  const env = dotenvSafe.config({
    path: path.join(__dirname, '..', envFilePath),
    example: path.join(__dirname, '.env.local.example'),
    allowEmptyValues: true,
  });

  dotenvExpand.expand(env);
}

// Get WordPress login token
async function login() {
  // Dont attempt login if in test environment
  if (process.env.NODE_ENV === 'test') {
    return undefined
  }

  const { WORDPRESS_ADMIN_USER, WORDPRESS_ADMIN_PASSWORD } = process.env;
  const sdk = getInitializedSdk();
  try {
    const data = await sdk.GetGraphQLToken(
      { username: WORDPRESS_ADMIN_USER!, password: WORDPRESS_ADMIN_PASSWORD! }
    );
    return data.login?.refreshToken || undefined;
  } catch (error) {
    console.warn('Warning: Failed to fetch GRAPHQL refresh token. Preview mode for unpublished WordPress posts will not work.');
    console.debug('Error Details:', error);
    return undefined;
  }
}

function createImageConfig(): ImageConfig {
  const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL;
  const defaultProtocol = WORDPRESS_API_URL?.includes('localhost') ? 'http' : 'https';
  const hostnamePattern = /(?<!www\.)[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+|localhost|wordpress/;
  const hostname = WORDPRESS_API_URL?.match(hostnamePattern)?.[0] ?? "";

  return {
    remotePatterns: [
      { protocol: defaultProtocol, hostname },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "wordpress" },
      { protocol: defaultProtocol, hostname: '0.gravatar.com' },
      { protocol: defaultProtocol, hostname: '1.gravatar.com' },
      { protocol: defaultProtocol, hostname: '2.gravatar.com' },
      { protocol: defaultProtocol, hostname: 'secure.gravatar.com' },
    ],
  };
}


const config = async (): Promise<NextConfig> => {
  loadEnvFile();

  return {
    images: createImageConfig(),
    webpack: (config, { dev }) => {
      if (!dev) {
        config.module.rules.push({
          test: /app[\\/]test.*\.(js|jsx|ts|tsx)$/,
          loader: 'ignore-loader',
        });
      }
      return config;
    },
    env: { WORDPRESS_AUTH_REFRESH_TOKEN:  await login() },
    experimental: {
      ppr: 'incremental',
      dynamicIO: true,
    },
  };
};

export default config;
