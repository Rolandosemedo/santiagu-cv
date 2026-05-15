FROM node:20-alpine

WORKDIR /app

COPY . .

WORKDIR /app/apps/api
RUN npm install
RUN npm run build

EXPOSE 3001
CMD ["node", "dist/server.js"]
