install: banner configure upload_images set_avatar set_favicon create_categories create-pages posts end_banner

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
	# WQ graphql acf plugin support
	wp plugin install advanced-custom-fields --activate
	wp plugin install https://github.com/wp-graphql/wpgraphql-acf/releases/download/v2.2.0/wpgraphql-acf.zip --activate
	wp plugin install https://github.com/hoppinger/advanced-custom-fields-wpcli/archive/refs/tags/3.2.0.zip --activate
	wp acf import --json_file=/php-scripts/acf.json
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

	$(eval WHO_ARE_WE_PAGE_ID := $(shell wp post create \
		--post_type=page \
		--post_title='Who Are We' \
		--post_content="We're a vibrant makerspace dedicated to empowering individuals to <strong>unleash their creativity</strong> and bring their projects to life." \
		--post_status=publish \
		--post_author=1 \
		--menu_order=0 \
		--post_parent=$(ABOUT_US_PAGE_ID) \
		--porcelain))
	$(eval FEATURE_IMAGE_ID_WHO := $(shell wp eval-file /php-scripts/get-attachment-id.php "hello-world2.jpg"))

	@echo "📸 Setting background image for landing page..."
	BACKGROUND_ID=$$(wp eval-file /php-scripts/get-attachment-id.php "cafeBanner.jpg"); wp eval-file /php-scripts/set-background.php $$BACKGROUND_ID true


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


create-pages:
	@echo "📃 Creating 'About Us' page..."
	$(eval ABOUT_US_PAGE_ID := $(shell wp post create \
		--post_type=page \
		--post_title='About Us' \
		--post_content='This page serves as an overview of our <strong>cafe</strong>, our <em>rooms</em>, and everything official. Here, you will find information about the spaces we offer, the services available, and how we aim to create a welcoming and productive environment for everyone.' \
		--post_status=publish \
		--post_author=1 \
		--porcelain))
	$(eval FEATURE_IMAGE_ID_ABOUT := $(shell wp eval-file /php-scripts/get-attachment-id.php "feature-image.jpg"))
	@wp post meta set $(ABOUT_US_PAGE_ID) _thumbnail_id $(FEATURE_IMAGE_ID_ABOUT)

	@echo "📃 Creating child pages for 'About Us'..."
	$(eval WHO_ARE_WE_PAGE_ID := $(shell wp post create \
	    --post_type=page \
	    --post_title='Who Are We' \
	    --post_content="We're a vibrant makerspace dedicated to empowering individuals to <strong>unleash their creativity</strong> and bring their projects to life." \
		--post_status=publish \
	    --post_author=1 \
	    --menu_order=0 \
	    --post_parent=$(ABOUT_US_PAGE_ID) \
	    --porcelain))
	$(eval FEATURE_IMAGE_ID_WHO := $(shell wp eval-file /php-scripts/get-attachment-id.php "hello-world2.jpg"))
	@wp post meta set $(WHO_ARE_WE_PAGE_ID) _thumbnail_id $(FEATURE_IMAGE_ID_WHO).
	@wp post create \
	    --post_type=page \
	    --post_title='How to Find Us' \
	    --post_content="<p>Located in the <strong>heart of the TU campus</strong>, you can find us in the EB building, nestled within the Ini Keller.</p>" \
	    --post_status=publish \
	    --post_author=1 \
	    --menu_order=1 \
	    --post_parent=$(ABOUT_US_PAGE_ID) \
	    --porcelain
	@wp post create \
	    --post_type=page \
	    --post_title='Cafe' \
	    --post_content="<p>Our cafe is the perfect spot to <em>grab a mate</em>, chill, and relax. It's a space where you can unwind and get to know others in a friendly atmosphere.</p>" \
	    --post_status=publish \
	    --post_author=1 \
	    --menu_order=2 \
	    --post_parent=$(ABOUT_US_PAGE_ID) \
	    --porcelain
	@wp post create \
	    --post_type=page \
	    --post_title='Wood Workshop' \
	    --post_content="<p>Following a brief introduction, our <strong>wood workshop</strong> is your go-to place for bringing your own projects to life, offering the tools and space you need to create.</p>" \
	    --post_status=publish \
	    --post_author=1 \
	    --menu_order=3 \
	    --post_parent=$(ABOUT_US_PAGE_ID) \
	    --porcelain
	@wp post create \
	    --post_type=page \
	    --post_title='3D Printing' \
	    --post_content="<p>Our facility is equipped with <strong>3D printers</strong>, and you're only charged for the materials you use. After a quick introduction, you'll have the freedom to print your own designs and projects.</p>" \
	    --post_status=publish \
	    --post_author=1 \
	    --menu_order=4 \
	    --post_parent=$(ABOUT_US_PAGE_ID) \
	    --porcelain
	@wp post create \
	    --post_type=page \
	    --post_title='Our Channels' \
	    --post_content="<p>Stay connected through our official channels, including <strong>Mattermost</strong>, email, and <strong>GitHub</strong>, among others, ensuring you're always in the loop with what's happening.</p>" \
	    --post_status=publish \
	    --post_author=1 \
	    --menu_order=5 \
	    --post_parent=$(ABOUT_US_PAGE_ID) \
	    --porcelain
	@wp post create \
		--post_type=page \
		--post_title='Support Us' \
		--post_content="<p>Our community thrives on your generous donations. <em>While we operate not for profit</em>, your contributions help us acquire new tools and materials for everyone's benefit. <u>Every Mate purchased in the café can also be paid for via PayPal</u>, directly supporting our growth and sustainability.</p><blockquote>'The essence of community, its heart and soul, is the non-monetary exchange of value; things we do and share because we care for others, and for the good of the place.'</blockquote>" \
		--post_status=publish \
		--post_author=1 \
		--menu_order=6 \
		--post_parent=$(ABOUT_US_PAGE_ID) \
		--porcelain

	@echo "📃 Creating 'Legal' page..."
	$(eval LEGAL_PAGE_ID := $(shell wp post create \
	    --post_type=page \
	    --post_title='Legal' \
	    --post_content="<p>This section houses our <strong>legal documentation</strong>, including the imprint, privacy policy, and other essential information, ensuring <em>transparency and trust</em>.</p>" \
	    --post_status=publish \
	    --post_author=1 \
	    --porcelain))
	$(eval FEATURE_IMAGE_ID_LEGAL := $(shell wp eval-file /php-scripts/get-attachment-id.php "hello-world1.jpg"))
	@wp post meta set $(LEGAL_PAGE_ID) _thumbnail_id $(FEATURE_IMAGE_ID_LEGAL)

	@echo "📃 Creating child pages for 'Legal'..."
	$(eval IMPRINT_PAGE_ID := $(shell wp post create \
	    --post_type=page \
	    --post_title='Imprint' \
	    --post_content="<p>Crafted with care by <strong>Conrad Klaus</strong> (<a href='https://github.com/EagleEyeElite'>GitHub</a>). For inquiries or questions, please <a href='https://github.com/EagleEyeElite/tudo-website/issues'>raise a GitHub issue</a> or contact me directly.</p>" \
	    --post_status=publish \
	    --post_author=1 \
	    --menu_order=0 \
	    --post_parent=$(LEGAL_PAGE_ID) \
	    --porcelain))
	$(eval FEATURE_IMAGE_ID_IMPRINT := $(shell wp eval-file /php-scripts/get-attachment-id.php "feature-image.jpg"))
	@wp post meta set $(IMPRINT_PAGE_ID) _thumbnail_id $(FEATURE_IMAGE_ID_IMPRINT)
	# And similarly for the "Privacy Policy" page...
	@wp post create \
	    --post_type=page \
	    --post_title='Privacy Policy' \
		--post_content="<p>Your privacy is our priority. <strong>We do not collect your data</strong>, ensuring your visit remains <u>confidential and secure</u>.</p>" \
	    --post_status=publish \
	    --post_author=1 \
	    --menu_order=1 \
	    --post_parent=$(LEGAL_PAGE_ID) \
	    --porcelain

	$(eval LANDING_PAGE_BG_ID := $(shell wp post create \
		--post_type=page \
		--post_title='Landing Page Background' \
		--post_content="<p>This page is dedicated to controlling the background image of the landing page. The featured image set for this page will be displayed as the background.</p>" \
		--post_status=publish \
		--post_author=1 \
		--menu_order=999 \
		--porcelain))
	$(eval FEATURE_IMAGE_ID := $(shell wp eval-file /php-scripts/get-attachment-id.php "cafeBanner.jpg"))
	@wp post meta set $(LANDING_PAGE_BG_ID) _thumbnail_id $(FEATURE_IMAGE_ID)
	@echo "✅ 'Landing Page Background' page created and featured image set successfully!"

	@echo "✅ All pages created successfully!"


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



end_banner:
	@echo "*************************************************************"
	@echo "* SETUP COMPLETED SUCCESSFULLY                               *"
ifeq ($(ENVIRONMENT),dev)
	@echo "* ENVIRONMENT: DEVELOPMENT                                   *"
else
	@echo "* ENVIRONMENT: PRODUCTION                                    *"
endif
	@echo "*************************************************************"
