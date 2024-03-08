# Setup Instructions

## WordPress and Docker Services

The WordPress server setup, including necessary configurations for GraphQL and JWT tokens, is automated through Docker. To start and manage the WordPress server, please refer to the `docker-services` README included in this project.

For a hassle-free setup, simply navigate to the `docker-services` directory and run:

```bash
cd ../docker-services
make autoinstall
```

This command handles the setup automatically. For more detailed instructions, please refer to the `docker-services` README.

## Environment Variables

To configure the environment variables:

1. Copy the `/docker-services/.env.example` file to `/docker-services/.env`.
2. Update it with your specific settings.

## Overriding Environment Variables for External Services

If you need to connect to services hosted externally (not on your local server) during development, you can override specific settings using an `.env.local` file.

Copy the `.env.local.example` file to `.env.local` and update it with the specific settings for the external services:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` to include the URLs, tokens, or other necessary configuration values for the external services. This allows for seamless switching between local and external resources without affecting the main environment settings.

## Running the Project

To launch the development server:

```bash
npm install
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000) to view the project.

## Preview Mode in Development

For content previews during development:

- With a secret (production environment):  
  [http://localhost:3000/api/preview?secret=next_wordpress_preview_token&id=1](http://localhost:3000/api/preview?secret=next_wordpress_preview_token&id=1)

- Without a secret (simplified for development):  
  [http://localhost:3000/api/preview?id=1](http://localhost:3000/api/preview?id=1)

## Running Tests

To ensure tests do not interact with production environments, they reference the `.env.example` file.

This approach helps maintain a separation between your development and production environments, safeguarding against accidental modifications to live data.

Before running tests, make sure:

1. Docker services are started, as described in the WordPress and Docker Services section.
2. The development server is running.

Then, you can start the tests with:

```bash
npm run test
```

## Generate favicon

Generate a favicon:
```bash
npm run generate-favicon
```

Select build for production and dev ```"masterPicture": "../artwork/favicon_production.svg",``` in faviconDescription.json and delete excess files.

For a favicon generation service visit [RealFaviconGenerator](https://realfavicongenerator.net/).

## Deployment

The project can be deployed using Docker for a containerized solution or [Vercel](https://vercel.com/) for easy hosting and scaling.

## Additional Information

For an in-depth guide on working with Next.js and WordPress, please consult:
- [Next.js Documentation](https://nextjs.org/docs)
- [WordPress Codex](https://codex.wordpress.org/)

This application is based on the template available at: [ISR Blog with Next.js and WordPress](https://vercel.com/templates/next.js/isr-blog-nextjs-wordpress).
