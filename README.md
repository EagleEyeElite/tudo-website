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


### WP CLI
You can interact with the wordPress instance via wpcli. For example, to change the display name of the admin user:
   ```bash
  docker compose run --rm wpcli wp user update admin --display_name="newDisplayName"
   ```

## Deployment

The Next.js application is deployed on Vercel. For continuous deployment, ensure your Vercel project is correctly set up to track your repository.

## Backups

The state of wordPress cms site is stored in docker volumes (defined in docker-services/docker-compose.yml).

Backups are managed by the UpdraftPlus plugin.
You can upload the backup files automatically to your cloud storage or download them locally.
