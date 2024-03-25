# TuDo Website

## Prerequisites

Before you begin, ensure you have the following installed on your system:
- Docker and Docker Compose
- make
- Node.js and npm

## Getting Started

Follow these steps to set up the project environment.

### 1. Start Docker Services

To initialize and start the Docker services, including autoconfiguration:

1. Navigate to the `docker-services` directory:

   ```bash
   cd backend-services
   ```
- If its your first time running the project

   ```bash
   make autoinstall
   ```
- If you have already run the project before

   ```bash
   make up
   ```

### 2. Start the Next.js Server

For local development of the Next.js frontend:

1. Navigate to the `website` folder:

   ```bash
   cd front-end
   ```

2. Install the necessary npm packages:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

Your Next.js application is now running and can be accessed at `http://localhost:3000`.

## Deployment

The Next.js application is deployed on Vercel. For continuous deployment, ensure your Vercel project is correctly set up to track your repository.

### Docker Production Setup

For deploying the Dockerized environment in production, additional steps are required. They have not yet been implemented.

## Backups

The state of wordpress cms site is stored in docker volumes (defined in docker-services/docker-compose.yml).
No backup strategy has been implemented yet, but its recommended, to backup the volumes regularly.
