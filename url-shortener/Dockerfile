# Dockerfile for URLShortener (Node.js, Express)
# Uses a small Node image and runs server.js directly.

FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
# Copy package.json first to leverage Docker cache
COPY package*.json ./
RUN npm install --production

# Copy source
COPY . .

# Default port (can be overridden by env in Azure)
ENV PORT=3000
EXPOSE 3000

# Do not bake secrets into the image; provide via environment variables in the container/platform
CMD ["node", "server.js"]
