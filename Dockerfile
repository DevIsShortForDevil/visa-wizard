# =============================================================================
# Dockerfile — Visa Wizard (Nuxt 4 SSR)
# =============================================================================
#
# Multi-stage build with 3 stages:
#
#   deps    — installs production dependencies only (cached layer)
#   builder — installs ALL dependencies and builds the Nuxt app
#   runner  — copies only .output from builder, runs the server
#
# The final image contains zero source code, zero dev dependencies,
# and zero build tools — just Node.js and the compiled .output folder.
# This keeps the image small and the attack surface minimal.
#
# Build:  docker build -t visa-wizard .
# Run:    docker run -p 3000:3000 --env-file .env visa-wizard
# =============================================================================

# Pin the Node version to match the LTS used in development.
# Alpine is a minimal Linux distro (~5MB) — much smaller than the default
# Debian-based node image (~900MB).
ARG NODE_VERSION=22

# -----------------------------------------------------------------------------
# Stage 1 — deps
# Install production dependencies only.
# This layer is cached separately so rebuilds after code changes
# don't reinstall node_modules unless package.json changes.
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS deps

WORKDIR /app

# Copy only the files needed for dependency installation first.
# Docker caches each layer — if these files haven't changed,
# npm ci is skipped entirely on the next build.
COPY package.json package-lock.json ./

# npm ci installs exact versions from package-lock.json.
# --omit=dev skips devDependencies since we only need runtime deps here.
RUN npm ci --omit=dev

# -----------------------------------------------------------------------------
# Stage 2 — builder
# Install ALL dependencies (including dev) and build the Nuxt app.
# This stage produces the .output folder which is the entire deployable app.
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app

# Copy package files and install ALL dependencies (including dev).
# We need devDependencies for TypeScript, Vite, Tailwind etc. to build.
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the source code.
# This is intentionally done AFTER npm ci so the dependency
# cache layer isn't invalidated by source code changes.
COPY . .

# Build the Nuxt app.
# Output goes to .output/ — a self-contained Node.js server
# that includes everything needed to run the app.
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 3 — runner
# The final production image.
# Copies only what's needed to run the app — nothing from the build stage
# except the compiled .output folder and production node_modules.
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS runner

WORKDIR /app

# Run as a non-root user for security.
# Root access inside a container is a security risk —
# if the app is compromised, the attacker gets root on the container.
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nuxt

# Copy production node_modules from deps stage.
# We use the deps stage (not builder) because builder has devDependencies too.
COPY --from=deps /app/node_modules ./node_modules

# Copy the compiled app from builder stage.
# .output is everything Nuxt needs to run — server, client assets, config.
COPY --from=builder /app/.output ./.output

# Copy shared/ directory — Nitro needs access to shared constants and types
# that are referenced at runtime via #shared alias.
COPY --from=builder /app/shared ./shared

# Switch to non-root user before starting the server.
USER nuxt

# Tell Nuxt/Nitro to listen on all network interfaces, not just localhost.
# Without this, the server is unreachable from outside the container.
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

# Document that the container listens on port 3000.
# This doesn't actually publish the port — that's done at runtime with -p.
EXPOSE 3000

# Start the Nitro server.
# .output/server/index.mjs is the entry point Nuxt generates for SSR.
CMD ["node", ".output/server/index.mjs"]