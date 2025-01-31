FROM node:18-alpine

WORKDIR /app

COPY . .
RUN npm install --omit=dev
EXPOSE 4300

ENV PORT=4300
CMD ["node", "src/server.js"]
