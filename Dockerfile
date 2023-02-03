FROM node:18.14-alpine

WORKDIR /app

COPY package*.json ./
RUN npm i

COPY . .

CMD ["npm", "run", "start:host"]
