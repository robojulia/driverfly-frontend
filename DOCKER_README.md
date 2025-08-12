# Docker Setup for DriverFly Frontend

This document explains how to run the DriverFly frontend application using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose installed on your system
- Node.js 18+ (for local development without Docker)

## Quick Start

### 1. Environment Setup

Copy the environment template and configure your variables:

```bash
cp env.example .env
```

Edit `.env` file with your actual configuration values.

### 2. Development Mode

Run the application in development mode with hot reloading:

```bash
# Start development environment
docker-compose --profile dev up

# Or build and start
docker-compose --profile dev up --build
```

The application will be available at `http://localhost:3000`

### 3. Production Mode

Run the application in production mode:

```bash
# Start production environment
docker-compose --profile prod up

# Or build and start
docker-compose --profile prod up --build
```

### 4. With Nginx Reverse Proxy

For production deployment with Nginx:

```bash
docker-compose --profile prod --profile nginx up
```

## Docker Commands

### Building Images

```bash
# Build production image
docker build -t driverfly-frontend:latest .

# Build development image
docker build -f Dockerfile.dev -t driverfly-frontend:dev .
```

### Running Containers

```bash
# Run production container
docker run -p 3000:3000 --env-file .env driverfly-frontend:latest

# Run development container
docker run -p 3000:3000 -v $(pwd):/app driverfly-frontend:dev
```

### Container Management

```bash
# View running containers
docker ps

# View logs
docker logs <container_id>

# Stop containers
docker-compose down

# Remove containers and images
docker-compose down --rmi all
```

## Development Workflow

### Hot Reloading

When running in development mode (`--profile dev`):
- Source code changes are automatically reflected
- Node modules are cached in a Docker volume
- Next.js development server runs with hot reloading

### Volume Mounting

Development mode mounts your local directory to `/app` in the container:
- `.:/app` - Your source code
- `/app/node_modules` - Container's node_modules (excluded from sync)
- `/app/.next` - Next.js build cache (excluded from sync)

## Production Considerations

### Environment Variables

Ensure all required environment variables are set in your `.env` file:
- `BASE_URL` - Your application's base URL
- `BASE_URL_API` - Your API endpoint
- API keys for third-party services

### Security

- Never commit `.env` files to version control
- Use Docker secrets for sensitive data in production
- Consider using a reverse proxy (Nginx) for SSL termination

### Performance

- Production build uses multi-stage Dockerfile
- Optimized for Next.js standalone output
- Alpine Linux base for smaller image size

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the port mapping in `docker-compose.yml`
2. **Permission issues**: Ensure Docker has proper permissions
3. **Build failures**: Check that all dependencies are properly specified

### Debug Commands

```bash
# Enter running container
docker exec -it <container_id> sh

# View container logs
docker logs -f <container_id>

# Check container resources
docker stats
```

### Cleanup

```bash
# Remove all unused containers, networks, and images
docker system prune -a

# Remove specific images
docker rmi driverfly-frontend:latest driverfly-frontend:dev
```

## File Structure

```
.
├── Dockerfile              # Production Dockerfile
├── Dockerfile.dev          # Development Dockerfile
├── docker-compose.yml      # Docker Compose configuration
├── .dockerignore           # Docker build exclusions
├── env.example             # Environment variables template
└── DOCKER_README.md        # This file
```

## Next Steps

1. Configure your environment variables
2. Test the development environment
3. Build and test the production image
4. Deploy to your preferred hosting platform

For more information about Docker and Next.js, visit:
- [Docker Documentation](https://docs.docker.com/)
- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)

