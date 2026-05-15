# ---- Build stage: install deps, run Vite build ----
FROM oven/bun:1.3-alpine AS builder
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy sources and build
COPY . .
RUN bun run build

# ---- Runtime stage: nginx serving static files ----
FROM nginx:1.27-alpine AS runtime

# nginx:alpine auto-envsubst's *.conf.template files at startup, so $PORT
# (injected by Cloud Run) gets baked into the live nginx config.
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=builder /app/dist /usr/share/nginx/html

# Cloud Run sends PORT=8080 by default; default here makes local `docker run` work too.
ENV PORT=8080
EXPOSE 8080

# Drop the default nginx.conf's `listen 80` server block (we install our own template).
RUN rm /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
