# Use official Bun lightweight runtime
FROM oven/bun:1-slim

WORKDIR /app

# Cache dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Copy application source code
COPY . .

# Cloud platforms automatically set the PORT environment variable
ENV PORT=3000
EXPOSE 3000

# Start server using Bun
CMD ["bun", "src/index.js"]
