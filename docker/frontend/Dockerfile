# Build stage
FROM node:20.9.0-bookworm-slim@sha256:2c6f8a1f1d9d5f5f5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5 as build

# Set secure defaults
ENV NODE_ENV=production \
    NPM_CONFIG_PREFIX=/home/node/.npm-global \
    PATH=$PATH:/home/node/.npm-global/bin

# Create non-root user
RUN groupadd -r nodejs && \
    useradd -r -g nodejs -d /home/node -s /bin/bash node && \
    mkdir -p /home/node/app && \
    chown -R node:nodejs /home/node

WORKDIR /home/node/app

# Switch to non-root user
USER node

# Install build dependencies with security updates
RUN apt-get update && \
    apt-get upgrade -y --no-install-recommends && \
    apt-get install -y --no-install-recommends \
    build-essential \
    python3 \
    make \
    g++ \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Copy package files first for better layer caching
COPY frontend/package*.json ./
RUN npm ci --no-audit --prefer-offline

# Copy source code
COPY frontend/ .

# Build the app
RUN npm run build

# Production stage
FROM nginx:1.25.3-bookworm-slim@sha256:2c6f8a1f1d9d5f5f5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5

# Apply security updates and cleanup
USER root
RUN apt-get update && \
    apt-get upgrade -y --no-install-recommends && \
    apt-get install -y --no-install-recommends \
    tzdata \
    && cp /usr/share/zoneinfo/UTC /etc/localtime \
    && echo "UTC" > /etc/timezone \
    && apt-get purge -y --auto-remove tzdata \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /var/cache/apt/archives/* \
    && find /var/log -type f -exec truncate -s 0 {} \;

# Remove default nginx content and copy built assets
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build --chown=nginx:nginx /home/node/app/build /usr/share/nginx/html

# Copy nginx config with security headers
COPY docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Set secure permissions
RUN chown -R nginx:nginx /var/cache/nginx /var/run /var/log/nginx && \
    find /var/log/nginx -type d -exec chmod 755 {} + && \
    find /var/log/nginx -type f -exec chmod 644 {} + && \
    chmod 644 /etc/nginx/conf.d/default.conf && \
    find /usr/share/nginx/html -type d -exec chmod 755 {} + && \
    find /usr/share/nginx/html -type f -exec chmod 644 {} +

# Set secure permissions for nginx files
RUN chown -R nginx:nginx /var/cache/nginx /var/run /var/log/nginx && \
    find /var/log/nginx -type d -exec chmod 755 {} + && \
    find /var/log/nginx -type f -exec chmod 644 {} + && \
    chmod 644 /etc/nginx/conf.d/default.conf && \
    find /usr/share/nginx/html -type d -exec chmod 755 {} + && \
    find /usr/share/nginx/html -type f -exec chmod 644 {} +

# Switch to non-root user
USER nginx

# Expose port 8080 (standard for unprivileged nginx)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

# Set secure headers and start nginx
RUN echo "\n    # Security headers\n    add_header X-Content-Type-Options nosniff;\n    add_header X-Frame-Options DENY;\n    add_header X-XSS-Protection "1; mode=block";\n    add_header Referrer-Policy "no-referrer-when-downgrade";\n    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:;";\n    # Disable server tokens\n    server_tokens off;\n" > /etc/nginx/conf.d/security-headers.conf

# Start nginx in the foreground with security optimizations
CMD ["nginx", "-g", "daemon off; error_log /dev/stderr info;"]
