# Check if .env exists, if not, copy from .env.example
check-env:
	@if [ ! -f .env ]; then \
		echo "No .env found. Creating from .env.example..."; \
		cp .env.example .env; \
	else \
		echo ".env exists, proceeding..."; \
	fi

start: check-env
	docker-compose up -d --build

up:
	docker-compose up -d

down:
	docker-compose down

autoinstall: start
	docker-compose -f docker-compose.yml -f wp-auto-config.yml run --rm wp-auto-config

clean: down
	@echo "💥 Removing related folders/files..."
	docker-compose down --volumes
	@echo "🗑️  Docker volumes removed."

reset: clean
