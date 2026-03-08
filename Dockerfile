# base stage
FROM oven/bun:1.3.10-alpine AS base

ARG DOCKER_TAG

# environment variables for usage in apps code
ARG _WEBAPP_DEBUG

ENV DOCKER_TAG=${DOCKER_TAG} \
    _WEBAPP_DEBUG=${_WEBAPP_DEBUG} \

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

ARG DOCKER_TAG

# environment variables for usage outside apps code (like nginx)
ARG _WEBAPP_HTTP_PORT
ARG _WEBAPP_HTTPS_PORT

ENV VERSION=${DOCKER_TAG} \
    _WEBAPP_HTTP_PORT=${_WEBAPP_HTTP_PORT} \
    _WEBAPP_HTTPS_PORT=${_WEBAPP_HTTPS_PORT}

WORKDIR /var/www

RUN apk add --no-cache curl

EXPOSE ${_WEBAPP_HTTP_PORT} ${_WEBAPP_HTTPS_PORT}

COPY --from=build /app/dist ./
COPY config /etc/nginx/

HEALTHCHECK --interval=10s --timeout=10s --retries=3 \
  CMD curl --silent --fail http://localhost:${_WEBAPP_HTTP_PORT} || \
      curl --silent --fail --insecure https://localhost:${_WEBAPP_HTTPS_PORT} || exit 1

LABEL org.opencontainers.image.title="react-template" \
      org.opencontainers.image.description="" \
      org.opencontainers.image.version=${DOCKER_TAG} \
      org.opencontainers.image.vendor="" \
      org.opencontainers.image.base.name="nginx:1.29-alpine3.22"


