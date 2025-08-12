# Makefile for DriverFly Frontend Docker operations

.PHONY: help build build-dev up up-dev down clean logs shell shell-dev

# Default target
help:
	@echo "Available commands:"
	@echo "  build      - Build production Docker image"
	@echo "  build-dev  - Build development Docker image"
	@echo "  up         - Start production environment"
	@echo "  up-dev     - Start development environment"
	@echo "  down       - Stop all containers"
	@echo "  clean      - Remove containers, images, and volumes"
	@echo "  logs       - View container logs"
	@echo "  shell      - Enter production container shell"
	@echo "  shell-dev  - Enter development container shell"

# Build commands
build:
	docker-compose build --profile prod

build-dev:
	docker-compose build --profile dev

# Run commands
up:
	docker-compose --profile prod up -d

up-dev:
	docker-compose --profile dev up -d

# Stop commands
down:
	docker-compose down

# Cleanup commands
clean:
	docker-compose down --rmi all --volumes --remove-orphans
	docker system prune -f

# Debug commands
logs:
	docker-compose logs -f

shell:
	docker-compose exec app sh

shell-dev:
	docker-compose exec app-dev sh

# Development helpers
dev: build-dev up-dev
	@echo "Development environment started at http://localhost:3000"

prod: build up
	@echo "Production environment started at http://localhost:3000"

# Quick restart
restart: down up
	@echo "Environment restarted"

restart-dev: down up-dev
	@echo "Development environment restarted"
