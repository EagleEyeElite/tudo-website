FROM wordpress:cli-php8.5

# Install make tool
USER root
RUN apk add --no-cache make

# Make docker compose wait for container dependencies be ready
# Add the wait script to the image
ENV WAIT_VERSION=2.12.1
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait

# Add Makefile to scripts dir
ADD Makefile entrypoint.sh /scripts/
RUN chmod +x /scripts/entrypoint.sh

# The www-data user has no writable home directory
ENV WP_CLI_CACHE_DIR=/tmp/wp-cli-cache

ENTRYPOINT [ "/scripts/entrypoint.sh" ]
USER 33:33
CMD ["wp", "shell"]
