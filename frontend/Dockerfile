# Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Принимаем CLIENT_SECRET как аргумент сборки
ARG CLIENT_SECRET
ENV REACT_APP_CLIENT_SECRET=$CLIENT_SECRET

COPY package*.json ./
RUN npm install
COPY . .

# Заменяем placeholder на реальный секрет
RUN sed -i "s/\${CLIENT_SECRET}/$REACT_APP_CLIENT_SECRET/" src/config/keycloak.ts

RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
