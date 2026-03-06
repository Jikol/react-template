# base stage
FROM oven/bun:1.4.2-alpine AS base

ARG DOCKER_TAG
ARG RETINA_WEBAPP_DEBUG
ARG RETINA_WEBAPP_VIEW
ARG RETINA_WEBAPP_API_URL

ENV DOCKER_TAG=${DOCKER_TAG} \
    RETINA_WEBAPP_DEBUG=${RETINA_WEBAPP_DEBUG} \
    RETINA_WEBAPP_VIEW=${RETINA_WEBAPP_VIEW} \
    RETINA_WEBAPP_API_URL=${RETINA_WEBAPP_API_URL}

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

# test stage
FROM base AS test

COPY . .

RUN bun run lint

# build stage
FROM test AS build

RUN bun run prod

# prod stage
FROM nginx:1.27-alpine AS final

ARG DOCKER_TAG
ARG RETINA_WEBAPP_HTTP_PORT
ARG RETINA_WEBAPP_HTTPS_PORT

ENV VERSION=${DOCKER_TAG} \
    RETINA_WEBAPP_HTTP_PORT=${RETINA_WEBAPP_HTTP_PORT} \
    RETINA_WEBAPP_HTTPS_PORT=${RETINA_WEBAPP_HTTPS_PORT}

WORKDIR /var/www

RUN apk add --no-cache curl

EXPOSE ${RETINA_WEBAPP_HTTP_PORT} ${RETINA_WEBAPP_HTTPS_PORT}

COPY --from=build /app/dist ./
COPY config /etc/nginx/

HEALTHCHECK --interval=10s --timeout=10s --retries=3 \
  CMD curl --silent --fail http://localhost:${RETINA_WEBAPP_HTTP_PORT} || \
      curl --silent --fail --insecure https://localhost:${RETINA_WEBAPP_HTTPS_PORT} || exit 1

LABEL org.opencontainers.image.title="retina-webapp" \
      org.opencontainers.image.description="SPA web application for Retina API to show retinal images" \
      org.opencontainers.image.version=${DOCKER_TAG} \
      org.opencontainers.image.vendor="VSB" \
      org.opencontainers.image.base.name="nginx:1.27-alpine"


