FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Expose default port used by app
EXPOSE 3000

# Use environment variable PORT if set
ENV PORT=3000

# Start the server
CMD ["node", "src/server.js"]
