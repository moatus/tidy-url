FROM node:18-alpine

WORKDIR /app

# Copy all files
COPY . .

# Install dependencies
RUN npm install --omit=dev

# Expose port
EXPOSE 4300

# Start the server
CMD ["node", "src/server.js"]
