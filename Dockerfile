# ── Build stage ────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# ── Runtime stage ───────────────────────────────────────────────
FROM node:20-alpine AS runtime

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# bash + python3 are needed to execute the bundled scripts
RUN apk add --no-cache bash python3

WORKDIR /app

# Copy production deps from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy source
COPY src/      ./src/
COPY public/   ./public/
COPY scripts/  ./scripts/
COPY package.json ./

# Fix ownership
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/healthz || exit 1

CMD ["node", "src/server.js"]
