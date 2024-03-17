// Import statements for TypeScript
import * as dotenvSafe from 'dotenv-safe';
import * as dotenvExpand from 'dotenv-expand';

// Initialize dotenv-safe to load and check environment variables
const myEnv = dotenvSafe.config({
  path: '../docker-services/.env', // Path to your .env file
  sample: '../docker-services/.env.example', // Path to your .env.example file
  allowEmptyValues: true,
});

// Use dotenv-expand to handle any nested variables
dotenvExpand.expand(myEnv);

import type { CodegenConfig } from '@graphql-codegen/cli';

console.log('Generating GraphQL types...');
console.log('Using WordPress API URL:', process.env.WORDPRESS_API_URL);

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.WORDPRESS_API_URL,
  documents: "**/*.{gql,graphql}",
  debug: true,
  verbose: true,
  ignoreNoDocuments: true,
  watch: true,
  generates: {
    "lib/generated/graphql.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-graphql-request",
      ],
    },
  },
};

export default config;
