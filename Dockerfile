FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install express cors

# Copy app files
COPY . .

# Expose port
EXPOSE 4300

# Start the server
CMD ["node", "server.js"]
