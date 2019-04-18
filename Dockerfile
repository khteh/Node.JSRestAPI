FROM node:latest
MAINTAINER Kok How, Teh <funcoolgeek@gmail.com>
ADD package.json .
RUN npm install
ADD . .
EXPOSE 8080
CMD ["npm", "start"]