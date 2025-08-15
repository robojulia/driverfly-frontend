# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci && npm cache clean --force

# Add build timestamp to invalidate cache for source code layers
ARG BUILD_DATE
ARG GIT_COMMIT
ENV BUILD_DATE=${BUILD_DATE}
ENV GIT_COMMIT=${GIT_COMMIT}

# Copy source code
COPY . .

# Inject build-time environment variables for Next.js before building
# These will be provided via --build-arg in CI
ARG BASE_URL
ARG FRONTEND_BASE_URL
ARG BASE_URL_API
ARG NEXT_PUBLIC_BASE_URL_API
ARG MAPBOX_API_KEY
ARG NEXT_PUBLIC_MICROSOFT_CLARITY
ARG RECAPTCHA_SITE_KEY
ARG RECAPTCHA_SECRET_KEY
ARG TWILIO_APP_NAME
ARG PHONE_INPUT_COUNTRY_ALLOWED
ARG NEXT_PUBLIC_GOOGLE_ANALYTICS

# Expose them to the build step so Next.js can inline client-side values
ENV BASE_URL=${BASE_URL} \
    FRONTEND_BASE_URL=${FRONTEND_BASE_URL} \
    BASE_URL_API=${BASE_URL_API} \
    NEXT_PUBLIC_BASE_URL_API=${NEXT_PUBLIC_BASE_URL_API} \
    MAPBOX_API_KEY=${MAPBOX_API_KEY} \
    NEXT_PUBLIC_MICROSOFT_CLARITY=${NEXT_PUBLIC_MICROSOFT_CLARITY} \
    RECAPTCHA_SITE_KEY=${RECAPTCHA_SITE_KEY} \
    RECAPTCHA_SECRET_KEY=${RECAPTCHA_SECRET_KEY} \
    TWILIO_APP_NAME=${TWILIO_APP_NAME} \
    PHONE_INPUT_COUNTRY_ALLOWED=${PHONE_INPUT_COUNTRY_ALLOWED} \
    NEXT_PUBLIC_GOOGLE_ANALYTICS=${NEXT_PUBLIC_GOOGLE_ANALYTICS}

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S driverfly -u 1001

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy built application (Next.js outputs to .next folder)
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

# Create logs directory
RUN mkdir -p logs && chown -R driverfly:nodejs logs

# Switch to non-root user
USER driverfly

# Expose port
EXPOSE 3000

# Health check - simplified to avoid dependency issues
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start the application
CMD ["npm", "start"]

