install: banner configure upload_images set_avatar set_favicon create_categories pages posts end_banner

banner:
	@echo "*************************************************************"
ifeq ($(ENVIRONMENT),dev)
	@echo "* 🛠️  ENVIRONMENT SETUP: DEVELOPMENT                        *"
else
	@echo "* 🚀  ENVIRONMENT SETUP: PRODUCTION                          *"
endif
	@echo "*************************************************************"

configure:
	@echo "⚙️ Configuring WordPress parameters..."
	wp core install --url="${WORDPRESS_WEBSITE_URL_WITHOUT_HTTP}" \
		--title="${WORDPRESS_WEBSITE_TITLE}" \
		--admin_user="${WORDPRESS_ADMIN_USER}" \
		--admin_password="${WORDPRESS_ADMIN_PASSWORD}" \
		--admin_email="${WORDPRESS_ADMIN_EMAIL}" \
		--locale="en_US"
	@echo "🌐 Site URL updated."
	wp option update siteurl "${WORDPRESS_WEBSITE_URL}"
	@echo "🔌 Installing and activating plugins."
	wp plugin install wp-graphql --activate
	wp plugin install https://github.com/wp-graphql/wp-graphql-jwt-authentication/archive/refs/tags/v0.7.0.zip --activate
	wp plugin install simple-local-avatars --activate
	# The GRAPHQL_JWT_AUTH_SECRET_KEY must not be at the end of the file. It has to be before the ABSPATH definition.
	@awk '/NONCE_SALT/{print;print "define( '\''GRAPHQL_JWT_AUTH_SECRET_KEY'\'', '\''${WORDPRESS_GRAPHQL_JWT_AUTH_SECRET_KEY}'\'' );";next}1' ./wp-config.php > ./wp-config-temp.php
	@mv ./wp-config-temp.php ./wp-config.php
	@echo "🔐 JWT Auth secret key appended successfully."
ifeq ($(ENVIRONMENT),dev)
	@echo "🛠 WPGraphQL debug mode enabled."
	wp config set GRAPHQL_DEBUG true --raw
endif

upload_images:
	@echo "📸 Uploading images from /uploads..."
	@for file in $$(find /uploads -type f); do \
		echo "Uploading $$file..."; \
		wp media import "$$file" --porcelain; \
	done

set_avatar:
	@echo "👤 Setting up admin user with avatar..."
	wp option update avatar_default 'blank'
	AVATAR_ID=$$(wp eval-file /php-scripts/get-attachment-id.php "tudo.png"); \
	wp eval-file /php-scripts/set-user-avatar.php 1 $$AVATAR_ID
ifeq ($(ENVIRONMENT),dev)
	wp user update admin --nickname="development" --display_name="development"
else
	wp user update admin --nickname="production" --display_name="production"
endif

set_favicon:
	@echo "🖼 Setting favicon based on environment..."
ifeq ($(ENVIRONMENT),dev)
	FAVICON_ID=$$(wp eval-file /php-scripts/get-attachment-id.php "favicon-dev.png"); wp option update site_icon $$FAVICON_ID
else
	FAVICON_ID=$$(wp eval-file /php-scripts/get-attachment-id.php "favicon-prod.png"); wp option update site_icon $$FAVICON_ID
endif

create_categories:
	@echo "📚 Creating default categories..."
	@GENERAL_CATEGORY_ID=$$(wp term create category 'General' --porcelain); \
	wp option update default_category $$GENERAL_CATEGORY_ID; \


pages:
	@echo "📃 Creating 'Overview' page..." && \
	OVERVIEW_PAGE_ID=$$(wp post create \
		--post_type=page \
		--post_title='Overview' \
		--post_content='The overview is made for "how to find us", room pages like "cafe", "wood workshop" and services like 3d-printing or screen printing.' \
		--post_status=publish \
		--post_author=1 \
		--porcelain) && \
	echo "📃 Creating child pages for 'Overview'..." && \
	wp post create \
		--post_type=page \
		--post_title='Overview1' \
		--post_content='This is the Overview1 page content.' \
		--post_status=publish \
		--post_author=1 \
		--post_parent=$$OVERVIEW_PAGE_ID && \
	wp post create \
		--post_type=page \
		--post_title='Overview2' \
		--post_content='This is the Overview2 page content.' \
		--post_status=publish \
		--post_author=1 \
		--post_parent=$$OVERVIEW_PAGE_ID && \
	wp post create \
		--post_type=page \
		--post_title='Overview3' \
		--post_content='This is the Overview3 page content.' \
		--post_status=publish \
		--post_author=1 \
		--post_parent=$$OVERVIEW_PAGE_ID


posts:
	@echo "📝 Creating 'Hello World1' post with a feature image..."

	FEATURE_IMAGE_ID_1=$$(wp eval-file /php-scripts/get-attachment-id.php "feature-image.jpg"); \
	POST_ID_1=$$(wp post create \
		--post_type=post \
		--post_title='Hello World1' \
		--post_content='<p>This is a <strong>bold</strong> statement, and this is an <em>italic</em> statement.</p><p>Visit <a href="https://example.com">Example Site</a> for more information.</p><blockquote>Here is a memorable quote.</blockquote>' \
		--post_status=publish \
		--post_author=1 \
		--porcelain); \
	wp post meta set $$POST_ID_1 _thumbnail_id $$FEATURE_IMAGE_ID_1

	FEATURE_IMAGE_ID_2=$$(wp eval-file /php-scripts/get-attachment-id.php "hello-world2.jpg"); \
	POST_ID_2=$$(wp post create \
		--post_type=post \
		--post_title='Hello World2' \
		--post_content='This is the content of Hello World2.' \
		--post_status=publish \
		--post_author=1 \
		--porcelain); \
	wp post meta set $$POST_ID_2 _thumbnail_id $$FEATURE_IMAGE_ID_2
	# Creating an Unpublished Post for preview testing
	wp post create --post_type=post --post_title='Unpublished Post' --post_content='This is the content of an unpublished post.' --post_status=private --post_author=1 --porcelain

	@echo "📄 Creating 'Impressum' page..."
	wp post create \
		--post_type=page \
		--post_title='Impressum' \
		--post_content='Project created by <strong>Conrad Klaus (<a href="https://github.com/EagleEyeElite">Github</a>)</strong> together with <strong>Marcel Léon Mrgic (<a href="https://github.com/MarcelLeonMrgic">Github</a>)</strong>.' \
		--post_status=publish \
		--post_author=1


end_banner:
	@echo "*************************************************************"
	@echo "* SETUP COMPLETED SUCCESSFULLY                               *"
ifeq ($(ENVIRONMENT),dev)
	@echo "* ENVIRONMENT: DEVELOPMENT                                   *"
else
	@echo "* ENVIRONMENT: PRODUCTION                                    *"
endif
	@echo "*************************************************************"
