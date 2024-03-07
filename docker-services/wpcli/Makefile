install: configure

configure:

	@echo "⚙️ Configuring WordPress parameters..."
	wp core install \
		--url=${WORDPRESS_WEBSITE_URL_WITHOUT_HTTP} \
		--title="${WORDPRESS_WEBSITE_TITLE}" \
		--admin_user=${WORDPRESS_ADMIN_USER} \
		--admin_password=${WORDPRESS_ADMIN_PASSWORD} \
		--admin_email=${WORDPRESS_ADMIN_EMAIL}

	@echo "🌐 Updating site URL..."
	wp option update siteurl "${WORDPRESS_WEBSITE_URL}"

	@echo "🔌 Installing and activating plugins..."
	wp plugin install wp-graphql --activate
	wp plugin install https://github.com/wp-graphql/wp-graphql-jwt-authentication/archive/refs/tags/v0.7.0.zip --activate
	wp plugin install simple-local-avatars --activate

	@echo "🔐 Appending JWT Auth secret key to wp-config.php..."
	echo "define( 'GRAPHQL_JWT_AUTH_SECRET_KEY', '${WORDPRESS_GRAPHQL_JWT_AUTH_SECRET_KEY}' );" >> ./wp-config.php

	@echo "👤 Setting up admin user..."
	AVATAR_ID=$$(wp media import /uploads/tudo.png --porcelain); \
	wp user meta update 1 simple_local_avatar $$AVATAR_ID
	wp user update admin --nickname="${WORDPRESS_NICKNAME}" --display_name="${WORDPRESS_NICKNAME}"

	@echo "🖼 Setting site favicon..."
	FAVICON_ID=$$(wp media import /uploads/favicon.png --porcelain); \
	wp option update site_icon $$FAVICON_ID

	@echo "📄 Creating 'Impressum' page..."
	wp post create \
		--post_type=page \
		--post_title='Impressum' \
		--post_content='Project created by <strong>Conrad Klaus (<a href="https://github.com/EagleEyeElite">Github</a>)</strong> together with <strong>Marcel Léon Mrgic (<a href="https://github.com/MarcelLeonMrgic">Github</a>)</strong>.' \
		--post_status=publish \
		--post_author=1

	@echo "📚 Creating 'General' category..."
	@GENERAL_CATEGORY_ID=$$(wp term create category 'General' --porcelain);

	@echo "📝 Creating 'Example Post' with a feature image..."
	FEATURE_IMAGE_ID=$$(wp media import /uploads/feature-image.jpg --porcelain); \
	POST_ID=$$(wp post create \
		--post_type=post \
		--post_title='Example Post' \
		--post_content='<p>This is a <strong>bold</strong> statement, and this is an <em>italic</em> statement.</p><p>Visit <a href="https://example.com">Example Site</a> for more information.</p><blockquote>Here is a memorable quote.</blockquote>' \
		--post_category="$$GENERAL_CATEGORY_ID" \
		--post_status=publish \
		--post_author=1 \
		--porcelain); \
	wp post meta set $$POST_ID _thumbnail_id $$FEATURE_IMAGE_ID
