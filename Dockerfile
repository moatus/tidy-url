FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy server file
COPY server.js ./

# Expose port
EXPOSE 4300

# Start the server
CMD ["node", "server.js"]
