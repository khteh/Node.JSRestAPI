FROM node:18
MAINTAINER Kok How, Teh <funcoolgeek@gmail.com>
WORKDIR /app
RUN node --version
RUN npm --version
ADD package.json .
ADD tsconfig.json .
ADD src src
RUN cd src/core && npm install
RUN cd src/infrastructure && npm install
RUN cd src/webapi && npm install
RUN npm install
ADD build build
RUN openssl req -new -newkey rsa:4096 -x509 -nodes -days 365 -keyout server.key -out server.crt -subj "/C=SG/ST=Singapore/L=Singapore /O=Kok How Pte. Ltd./OU=NodeJSRestAPI/CN=localhost/emailAddress=funcoolgeek@gmail.com" -passin pass:NodeJSRestAPI
EXPOSE 4433
ENTRYPOINT ["node", "--experimental-specifier-resolution=node", "build/src/webapi/server.js"]