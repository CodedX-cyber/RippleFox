# Build stage
FROM python:3.13-slim-bookworm@sha256:2c6f8a1f1d9d5f5f5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5 as builder

# Set secure defaults
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_DEFAULT_TIMEOUT=100

WORKDIR /app

# Install system dependencies with security updates
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && \
    apt-get upgrade -y --no-install-recommends && \
    apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
    && find /usr/local -depth \
    \( \
        \( -type d -a \( -name test -o -name tests -o -name '__pycache__' \) \) \
        -o \
        \( -type f -a \( -name '*.pyc' -o -name '*.pyo' \) \) \
    \) -exec rm -rf '{}' +

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --user -r requirements.txt

# Runtime stage
FROM python:3.13-slim-bookworm@sha256:2c6f8a1f1d9d5f5f5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5

# Set secure defaults
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONHASHSEED=random \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_DEFAULT_TIMEOUT=100 \
    PIP_ROOT_USER_ACTION=ignore \
    POETRY_VERSION=1.7.1

WORKDIR /app

# Install minimal runtime dependencies with security updates
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && \
    apt-get upgrade -y --no-install-recommends && \
    apt-get install -y --no-install-recommends \
    libpq5 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
    && find /usr/local -depth \
    \( \
        \( -type d -a \( -name test -o -name tests -o -name '__pycache__' \) \) \
        -o \
        \( -type f -a \( -name '*.pyc' -o -name '*.pyo' \) \) \
    \) -exec rm -rf '{}' +

# Create non-root user with specific UID
RUN groupadd -g 1000 appuser && \
    useradd -u 1000 -g appuser -d /home/appuser -s /bin/bash appuser && \
    mkdir -p /home/appuser/.local && \
    chown -R appuser:appuser /home/appuser /app

# Copy Python dependencies from builder
COPY --from=builder --chown=appuser:appuser /root/.local /home/appuser/.local

# Ensure scripts in .local are usable
ENV PATH=/home/appuser/.local/bin:$PATH \
    PYTHONPATH=/home/appuser/.local/lib/python3.13/site-packages

# Switch to non-root user
USER appuser
WORKDIR /home/appuser

# Copy project with proper permissions
COPY --chown=appuser:appuser backend/ .

# Set secure permissions
RUN chmod -R 755 /app && \
    find /app -type d -exec chmod 755 {} \; && \
    find /app -type f -exec chmod 644 {} \; && \
    chmod +x /app/manage.py

USER appuser
WORKDIR /home/appuser

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Expose the port the app runs on
EXPOSE 8000

# Set secure defaults for Python
ENV PYTHONFAULTHANDLER=1 \
    PYTHONHASHSEED=random \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_DEFAULT_TIMEOUT=100 \
    PIP_ROOT_USER_ACTION=ignore \
    POETRY_VERSION=1.7.1

# Command to run the application with security best practices
CMD ["gunicorn", "--worker-tmp-dir", "/dev/shm", \
    "--workers", "$(( 2 * $(nproc) + 1 ))", \
    "--threads", "2", \
    "--worker-class", "gthread", \
    "--bind", "0.0.0.0:8000", \
    "--max-requests", "1000", \
    "--max-requests-jitter", "50", \
    "--timeout", "120", \
    "--graceful-timeout", "30", \
    "--log-level", "info", \
    "--access-logfile", "-", \
    "--error-logfile", "-", \
    "--capture-output", \
    "--preload", \
    "--forwarded-allow-ips", "*", \
    "--proxy-allow-from", "*", \
    "config.wsgi:application"]
