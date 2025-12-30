FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --configuration=production

# Servir com NGINX
FROM nginx:alpine

# Apaga HTML padrão do NGINX
RUN rm -rf /usr/share/nginx/html/*

# Copia config do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia o build correto DO ANGULAR 18 (pasta browser!)
COPY --from=build /app/dist/Fleetcom-app/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
