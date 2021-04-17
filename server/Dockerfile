FROM node:latest as build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

EXPOSE 80

COPY . .

CMD node index