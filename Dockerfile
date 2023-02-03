FROM node:18.14-alpine

RUN npm install -g npm@9.4.0

WORKDIR /app

COPY package*.json ./
RUN npm i

COPY . .
# RUN npm run build

CMD ["npm", "run", "start"]
