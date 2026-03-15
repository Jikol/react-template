# base stage
FROM oven/bun:1.3.10-alpine AS base

# environment variables for usage in apps code
ARG VITE_DEBUG
ENV VITE_DEBUG=${VITE_DEBUG}

ARG DOCKER_TAG
ENV DOCKER_TAG=${DOCKER_TAG}

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

# test stage
FROM base AS test

COPY . .

RUN bun run lint

# build stage
FROM base AS build

COPY . .

RUN bun run prod

# prod stage
FROM nginx:1.29-alpine3.22 AS final

# environment variables for usage outside apps code (like nginx)
ARG VITE_NAME
ARG VITE_DESCRIPTION
ARG VITE_HTTP_PORT
ARG VITE_HTTPS_PORT
ENV VITE_NAME=${VITE_NAME} \
    VITE_DESCRIPTION=${VITE_DESCRIPTION} \
    VITE_HTTP_PORT=${VITE_HTTP_PORT} \
    VITE_HTTPS_PORT=${VITE_HTTPS_PORT}

ARG DOCKER_TAG
ENV VERSION=${DOCKER_TAG}

WORKDIR /var/www

RUN apk add --no-cache curl

EXPOSE ${VITE_HTTP_PORT} ${VITE_HTTPS_PORT}

COPY --from=build /app/dist ./
COPY config /etc/nginx/

HEALTHCHECK --interval=10s --timeout=10s --retries=3 \
  CMD curl --silent --fail http://localhost:${VITE_HTTP_PORT} || \
      curl --silent --fail --insecure https://localhost:${VITE_HTTPS_PORT} || exit 1

LABEL org.opencontainers.image.title=${VITE_NAME} \
      org.opencontainers.image.description=${VITE_DESCRIPTION} \
      org.opencontainers.image.version=${VERSION} \
      org.opencontainers.image.base.name="nginx:1.29-alpine3.22"


