# Quick Start Guide for WordPress Docker Deployment

This guide provides a quick setup for deploying WordPress locally and in production using Docker Compose, including useful automation via Makefile directives.

## Prerequisites

Ensure you have `Docker`, `Docker Compose` and `make` installed on your system.

## Getting Started

1. Create a `.env` file from the example and set your environment variables:

    ```bash
    cp .env.example .env
    ```

## Deployment

- **Automatic Installation**: For a hassle-free setup, use the `make` command. You may have to wait a bit.

    ```bash
    make autoinstall
    ```

- **Manual Setup**: If you prefer using Docker Compose commands directly:

    ```bash
    docker-compose up -d --build
    docker-compose -f docker-compose.yml -f wp-auto-config.yml run --rm wp-auto-config
    ```

Visit your WordPress site at `http://localhost` and manage your database via phpMyAdmin at `http://localhost:8080`.

## Default Credentials

- Defined in `.env.example`

## Additional Commands

- **Stop and Remove Containers**:

    ```bash
    docker-compose down
    ```

- **Clean Installation** (removes all data and starts fresh):

    ```bash
    make clean
    ```
  
- **Interact with wp instance via wpcli**:
    ```bash
    docker-compose run --rm wpcli wp user update admin --display_name="newDisplayName"
    ```

## References

- Based on the [work](https://github.com/kassambara/wordpress-docker-compose/) from kassambara.
- Related [blog post](https://www.datanovia.com/en/lessons/wordpress-docker-setup-files-example-for-local-development/).
