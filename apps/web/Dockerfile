FROM node:20-alpine

WORKDIR /app

# Copiar tudo
COPY . .

# Instalar dependências usando npm no workspace
WORKDIR /app/apps/web
RUN npm install

# Build
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
