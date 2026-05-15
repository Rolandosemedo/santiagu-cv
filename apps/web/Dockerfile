FROM node:20-alpine

WORKDIR /app

COPY . .

WORKDIR /app/apps/web
RUN npm install
RUN npm run build

EXPOSE 3000
CMD ["node_modules/.bin/next", "start"]
