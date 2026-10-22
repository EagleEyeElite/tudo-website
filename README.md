# TuDo Website

Hey there, you wanna help out, or just check out the project? Here is a quick guide to get you started.

## Prerequisites

Before you begin, ensure you have the following installed on your system:
- [Docker](https://docs.docker.com/get-docker/)

## Getting Started

Visiting for the first time? — Follow these steps to set up the project environment.

   ```bash
   cp .env.example .env
   docker compose up -d --build
   docker compose run --rm wp-auto-config
   docker compose --profile frontend watch
   ```

The wordPress CMS can be accessed via `http://localhost:8080/wp-admin`.
The default credentials are username:`admin` and password:`pw`.

It takes a couple of minutes to set up everything.
Your Next.js application is now running and can be accessed at `http://localhost:3000`.

If you have your wordPress server already setup, you can skip the `wp-auto-config` step.

### Using Make [Optional]
Instead of typing every command per hand, you can use following `make` commands:

   ```bash
   make quick-start
   ```

### Some more `make` commands are available:

- Start all backend services
    ```bash
    make up-backend
    ```

- Stop all services
    ```bash
    make down
    ```

- Setup wordPress, deletes old data
    ```bash
    make wordpress-setup
    ```

- Update wordPress core, plugins and themes to the latest versions, keeps all data
    ```bash
    make wordpress-update
    ```


### WP CLI
You can interact with the wordPress instance via wpcli. For example, to change the display name of the admin user:
   ```bash
  docker compose run --rm wpcli wp user update admin --display_name="newDisplayName"
   ```

## Deployment

### Frontend (Vercel)
The Next.js application is deployed on Vercel, every push to `main` triggers a production deployment.
The Vercel project needs these environment variables (see `frontend/.env.local.example`):
`WORDPRESS_API_URL`, `WORDPRESS_ADMIN_USER`, `WORDPRESS_ADMIN_PASSWORD`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`,
`ACTIVITY_INDICATOR_USER`, `ACTIVITY_INDICATOR_PASSWORD`, `NEXT_WORDPRESS_PREVIEW_SECRET` and `NEXT_PUBLIC_URL`.

The frontend fetches its WordPress token at build time, so redeploy it whenever the WordPress admin password or the JWT secret changes.

### Backend (WordPress)
The backend services run with the production overrides: no published ports, the services join the external `proxy` network of the reverse proxy, and phpMyAdmin is off.

1. Create the `.env` from `.env.example` and set at least:
   - `COMPOSE_PROJECT_NAME` (also the database name) and `ENVIRONMENT="prod"`
   - `WORDPRESS_WEBSITE_URL` and `WORDPRESS_WEBSITE_URL_WITHOUT_HTTP` to the public WordPress domain
   - new random values for all passwords, tokens and secrets, e.g. `openssl rand -hex 32` for `WORDPRESS_GRAPHQL_JWT_AUTH_SECRET_KEY` (at least 32 characters, the placeholder is rejected in production)
2. Start the services and install, or update an existing installation:
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   # first installation
   docker compose -f docker-compose.yml -f docker-compose.prod.yml run --rm wp-auto-config
   # existing installation: update core, plugins and themes, keeps all content
   docker compose -f docker-compose.yml -f docker-compose.prod.yml run --rm wp-auto-config update
   ```
   The update sets a new JWT secret if the existing one is shorter than 32 characters, redeploy the frontend afterwards.
3. Start phpMyAdmin only while you need it:
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.prod.yml --profile phpmyadmin up -d phpmyadmin
   docker compose -f docker-compose.yml -f docker-compose.prod.yml --profile phpmyadmin rm -sf phpmyadmin
   ```

## Backups

The state of the wordPress cms site is stored in the docker volumes `wordpress` and `wordpress-db` (defined in `docker-compose.yml`).

Backups are managed by the UpdraftPlus plugin.
You can upload the backup files automatically to your cloud storage or download them locally.
