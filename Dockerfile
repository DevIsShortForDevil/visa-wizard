# ==========================================
# Stage 1: Build the application
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy only package files first to cache the dependencies layer
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the Nuxt application (Outputs to .output/)
RUN pnpm run build

# ==========================================
# Stage 2: Run the production server
# ==========================================
FROM node:22-alpine AS runner

WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Copy ONLY the built standalone server from the builder stage
COPY --from=builder /app/.output ./.output

# Expose the port Nuxt runs on
EXPOSE 3000

# Start the standalone Nitro server
CMD ["node", ".output/server/index.mjs"]