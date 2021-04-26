# Dockerfile
FROM node:10
# Or whatever Node version/image you want
# WORKDIR '/var/www/app'
# # FROM node:10

ENV NODE_ENV = production

WORKDIR '/var/www/app'

COPY package.json /var/www/app

RUN npm install

COPY . /var/www/app

CMD node app.js

EXPOSE 3000