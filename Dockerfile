FROM node:18.14-alpine

RUN npm install -g npm@9.4.0
RUN npm install -g @angular/cli

WORKDIR /app

#COPY package*.json ./
#RUN npm i

COPY . .
RUN ng build

CMD ["ng", "serve"]
