ARG HTTP_PORT

FROM node:18.14-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build

FROM nginx:1.23.3-alpine
COPY --from=build /app/dist/car-wash-owner-panel /usr/share/nginx/html

EXPOSE ${HTTP_PORT}
