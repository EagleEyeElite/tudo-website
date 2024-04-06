# Check if .env exists, if not, copy from .env.example
check-env:
	@if [ ! -f .env ]; then \
		echo "No .env found. Creating from .env.example..."; \
		cp .env.example .env; \
	else \
		echo ".env exists, proceeding..."; \
	fi

start: check-env
	docker compose up -d --build

up-backend:
	docker compose up -d

down:
	docker compose --profile frontend down

up-frontend: check-env
	docker compose --profile frontend watch

wordpress-setup: reset start
	docker-compose build wp-auto-config
	docker compose run --rm wp-auto-config

quick-start: wordpress-setup
	@echo "Autoinstall complete. Starting frontend..."
	$(MAKE) up-frontend

reset: down
	@echo "💥 Removing related folders/files..."
	docker compose down --volumes
	@echo "🗑️  Docker volumes removed."
