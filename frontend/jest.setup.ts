import path from 'path';
import dotenvSafe from 'dotenv-safe';
import dotenvExpand from 'dotenv-expand';

// The tests talk to the same local services as `npm run dev`, so they use the same ../.env
const env = dotenvSafe.config({
  path: path.join(__dirname, '..', '.env'),
  example: path.join(__dirname, '.env.local.example'),
  allowEmptyValues: true,
  override: true,
});
dotenvExpand.expand(env);

// The tests write to the activity indicator, never run them against a deployed instance
for (const name of ['NEXT_PUBLIC_URL', 'WORDPRESS_API_URL', 'KV_REST_API_URL']) {
  const host = new URL(process.env[name] ?? '').hostname;
  if (host !== 'localhost' && host !== '127.0.0.1') {
    throw new Error(`${name} must point to localhost for tests, got "${host}"`);
  }
}
