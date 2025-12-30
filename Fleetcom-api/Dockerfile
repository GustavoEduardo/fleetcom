FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY --from=build /app/package*.json ./
RUN npm install --omit=dev

COPY --from=build /app/dist ./dist

# COPIA uploads e arquivos estáticos
COPY --from=build /app/public ./public

EXPOSE 3000

CMD ["node", "dist/main.js"]
