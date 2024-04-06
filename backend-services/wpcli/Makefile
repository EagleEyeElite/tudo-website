install: banner configure set-default-content-draft setup-categories upload_images set_avatar set_favicon create-pages posts end_banner

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
	wp plugin install https://github.com/wp-graphql/wp-graphql-meta-query/archive/refs/tags/v0.1.1.zip --activate
	wp plugin install updraftplus --activate
ifeq ($(ENVIRONMENT),dev)
	@echo "🛠 WPGraphQL debug mode enabled."
	wp config set GRAPHQL_DEBUG true --raw
endif

set-default-content-draft:
	@echo "Setting up default content to draft status..."
	@wp post update $(shell wp post list --post_type='page' --name='sample-page' --format=ids) --post_status='draft'
	@echo "'Sample Page' status set to draft."
	@wp post update $(shell wp post list --post_type='post' --name='hello-world' --format=ids) --post_status='draft'
	@echo "'Hello World!' post status set to draft."
	@echo "Default content setup complete."


setup-categories:
	@echo "Setting up event category..."
	@wp term create category 'Events' --porcelain
	@echo "Setting 'Events' as the default post category..."
	EVENTS_CAT_ID=$$(wp term list category --name='Events' --field=id --format=ids); wp option update default_category $$EVENTS_CAT_ID
	@echo "'Events' set as the default post category."
	@echo "Deleting the 'Uncategorized' category..."
	@wp term delete category $(shell wp term list category --name='Uncategorized' --field=id --format=ids) || true
	@echo "'Uncategorized' category deleted."


upload_images:
	@echo "📸 Uploading images from /uploads..."
	@for file in $$(find /uploads -type f); do \
		echo "Uploading $$file..."; \
		wp media import "$$file" --porcelain; \
	done

	@echo "📸 Setting background image for landing page..."
	BACKGROUND_ID1=$$(wp eval-file /php-scripts/get-attachment-id.php "cafeBanner.jpg"); wp eval-file /php-scripts/set-landing-page-banner-background.php $$BACKGROUND_ID1 1
	BACKGROUND_ID2=$$(wp eval-file /php-scripts/get-attachment-id.php "hello-world1.jpg"); wp eval-file /php-scripts/set-landing-page-banner-background.php $$BACKGROUND_ID2 1


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
		--post_title='Opening Hours' \
		--post_content="<p>Our open hours vary. For the most current information, please check our Telegram bot</a>.</p>" \
		--post_status=publish \
		--post_author=1 \
		--menu_order=2 \
		--post_parent=$(ABOUT_US_PAGE_ID) \
		--porcelain
	@wp post create \
		--post_type=page \
		--post_title='Official Channels' \
		--post_content="<p>Stay connected through our official channels:</p><ul><li>Channel 1: <a href='https://example.com'>example.com</a></li><li>Channel 2: <a href='https://example.com'>example.com</a></li><li>Channel 3: <a href='https://example.com'>example.com</a></li></ul>" \
		--post_status=publish \
		--post_author=1 \
		--menu_order=3 \
		--post_parent=$(ABOUT_US_PAGE_ID) \
		--porcelain
	@wp post create \
	    --post_type=page \
	    --post_title='Cafe' \
	    --post_content="<p>Our cafe is the perfect spot to <em>grab a mate</em>, chill, and relax. It's a space where you can unwind and get to know others in a friendly atmosphere.</p>" \
	    --post_status=publish \
	    --post_author=1 \
	    --menu_order=4 \
	    --post_parent=$(ABOUT_US_PAGE_ID) \
	    --porcelain
	@wp post create \
		--post_type=page \
		--post_title='Electronics Lab' \
		--post_content="<p>Welcome to our state-of-the-art <strong>Electronics Lab</strong>. A hub for innovation and learning, equipped with the latest tools and technology.</p>" \
		--post_status=publish \
		--post_author=1 \
		--menu_order=5 \
		--post_parent=$(ABOUT_US_PAGE_ID) \
		--porcelain
	@wp post create \
		--post_type=page \
		--post_title='3D Printing' \
		--post_content="<p>Our facility is equipped with <strong>3D printers</strong>, and you're only charged for the materials you use. After a quick introduction, you'll have the freedom to print your own designs and projects.</p>" \
		--post_status=publish \
		--post_author=1 \
		--menu_order=6 \
		--post_parent=$(ABOUT_US_PAGE_ID) \
		--porcelain
	@wp post create \
		--post_type=page \
		--post_title='Seminar Room' \
		--post_content="<p>Our <strong>Seminar Room</strong> is designed to foster learning and collaboration, ideal for workshops, meetings, and classes.</p>" \
		--post_status=publish \
		--post_author=1 \
		--menu_order=7 \
		--post_parent=$(ABOUT_US_PAGE_ID) \
		--porcelain
	@wp post create \
	    --post_type=page \
	    --post_title='Wood Workshop' \
	    --post_content="<p>Following a brief introduction, our <strong>wood workshop</strong> is your go-to place for bringing your own projects to life, offering the tools and space you need to create.</p>" \
	    --post_status=publish \
	    --post_author=1 \
	    --menu_order=8 \
	    --post_parent=$(ABOUT_US_PAGE_ID) \
	    --porcelain
	@wp post create \
		--post_type=page \
		--post_title='Support Us' \
		--post_content="<p>Our community thrives on your generous donations. <em>While we operate not for profit</em>, your contributions help us acquire new tools and materials for everyone's benefit. <u>Every Mate purchased in the café can also be paid for via PayPal</u>, directly supporting our growth and sustainability.</p><blockquote>'The essence of community, its heart and soul, is the non-monetary exchange of value; things we do and share because we care for others, and for the good of the place.'</blockquote>" \
		--post_status=publish \
		--post_author=1 \
		--menu_order=9 \
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

	@echo "📄 Creating Events at TuDo page..."
	wp post create \
		--post_type=page \
		--post_title='Events' \
		--post_content='<p>At TuDo, we host a variety of events ranging from workshops, seminars, to social gatherings. These events are designed to enhance learning, networking, and provide a platform for sharing innovative ideas.</p><p>Stay tuned to our events page for the latest updates and how you can participate in our upcoming events.</p>' \
		--post_status=publish \
		--post_author=1 \
		--porcelain
	@echo "Events at TuDo page created."

	@echo "📄 Creating WordPress Capabilities Showcase page..."
	wp post create \
		--post_type=page \
		--post_title='WordPress Capabilities Showcase' \
		--post_content='<h2>WordPress Formatting Capabilities</h2><p>Explore the rich formatting options WordPress offers:</p><ul><li><strong>Bold Text</strong></li><li><em>Italic Text</em></li><li><a href="https://wordpress.org">Links</a></li><li>Blockquotes</li><li>Unordered and Ordered Lists</li><li>And much more...</li></ul><p>With WordPress, creating visually appealing and organized content is straightforward, making it a powerful tool for web development.</p>' \
		--post_status=publish \
		--post_author=1 \
		--porcelain
	@echo "WordPress Capabilities Showcase page created."

	@echo "✅ All pages created successfully!"


posts:
	@echo "📝 Creating custom event posts under the 'Events' category..."
	# Screen Printing Workshop
	FEATURE_IMAGE_ID_SPW=$$(wp eval-file /php-scripts/get-attachment-id.php "feature-image.jpg"); \
	POST_ID_SPW=$$(wp post create --post_type=post --post_title='Screen Printing Workshop' --post_content='Join our Screen Printing Workshop to learn all about the process of transferring art to t-shirts and posters. Perfect for beginners and enthusiasts alike.' --post_status=publish --post_author=1 --porcelain); \
	wp post meta set $$POST_ID_SPW _thumbnail_id $$FEATURE_IMAGE_ID_SPW
	# Kick-off Semester Party
	FEATURE_IMAGE_ID_KOSP=$$(wp eval-file /php-scripts/get-attachment-id.php "hello-world1.jpg"); \
	POST_ID_KOSP=$$(wp post create --post_type=post --post_title='Kick-off Semester Party' --post_content='Celebrate the start of a new semester with us! Music, dancing, and fun await as we kick things off with a bang.' --post_status=publish --post_author=1 --porcelain); \
	wp post meta set $$POST_ID_KOSP _thumbnail_id $$FEATURE_IMAGE_ID_KOSP

	# Makerthon
	POST_ID_M=$$(wp post create --post_type=post --post_title='Makerthon' --post_content='Our annual Makerthon is back! Innovators, creators, and dreamers are welcome to join us for a weekend of creativity and invention.' --post_status=publish --post_author=1 --porcelain)
	# Dance in the May Party
	POST_ID_DITMP=$$(wp post create --post_type=post --post_title='Dance in the May Party' --post_content='Welcome the spring season with our Dance in the May Party. Enjoy a night of dance, music, and springtime joy.' --post_status=publish --post_author=1 --porcelain)

	# Pizza Tuesday
	FEATURE_IMAGE_ID_PT=$$(wp eval-file /php-scripts/get-attachment-id.php "hello-world2.jpg"); \
	POST_ID_PT=$$(wp post create --post_type=post --post_title='Pizza Tuesday' --post_content='Every Tuesday is Pizza Tuesday! Join us for delicious slices and good times. Vegetarian and vegan options available.' --post_status=publish --post_author=1 --porcelain); \
	wp post meta set $$POST_ID_PT _thumbnail_id $$FEATURE_IMAGE_ID_PT
	# Vinyl Disc Jockey Workshop
	FEATURE_IMAGE_ID_VDJW=$$(wp eval-file /php-scripts/get-attachment-id.php "feature-image.jpg"); \
	POST_ID_VDJW=$$(wp post create --post_type=post --post_title='Vinyl Disc Jockey Workshop' --post_content='Dive into the world of vinyl with our Disc Jockey Workshop. Learn the art of mixing, scratching, and spinning records like a pro.' --post_status=publish --post_author=1 --porcelain); \
	wp post meta set $$POST_ID_VDJW _thumbnail_id $$FEATURE_IMAGE_ID_VDJW

	# Creating the post with various formatting in the content
	FEATURE_IMAGE_ID_CFS=$$(wp eval-file /php-scripts/get-attachment-id.php "hello-world2.jpg"); \
	POST_ID_CFS=$$(wp post create \
		--post_type=post \
		--post_title='Content Formatting Showcase' \
		--post_content='<h2>Explore WordPress Formatting</h2><p><strong>Bold Text</strong> and <em>Italic Text</em> are essential for emphasizing points. Combine them for <strong><em>extra emphasis</em></strong>.</p><blockquote>“To be or not to be, that is the question.” - Shakespeare</blockquote><p>Lists are great for readability:</p><ul><li>First Item</li><li>Second Item with a <a href="https://example.com">link</a></li><li>Third Item</li></ul><p>And don’t forget about <code>inline code</code> for technical content!</p>' \
		--post_status=publish \
		--post_author=1 \
		--porcelain); \
	wp post meta set $$POST_ID_CFS _thumbnail_id $$FEATURE_IMAGE_ID_CFS



end_banner:
	@echo "*************************************************************"
	@echo "* SETUP COMPLETED SUCCESSFULLY                               *"
ifeq ($(ENVIRONMENT),dev)
	@echo "* ENVIRONMENT: DEVELOPMENT                                   *"
else
	@echo "* ENVIRONMENT: PRODUCTION                                    *"
endif
	@echo "*************************************************************"
