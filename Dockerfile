FROM node:18
MAINTAINER Kok How, Teh <funcoolgeek@gmail.com>
WORKDIR /app
ADD tsconfig.json .
ADD node_modules node_modules
ADD build .
RUN openssl req -new -newkey rsa:4096 -x509 -nodes -days 365 -keyout server.key -out server.crt -subj "/C=SG/ST=Singapore/L=Singapore /O=Kok How Pte. Ltd./OU=NodeJSRestAPI/CN=localhost/emailAddress=funcoolgeek@gmail.com" -passin pass:NodeJSRestAPI
EXPOSE 4433
ENTRYPOINT ["node", "--trace-deprecation", "--experimental-specifier-resolution=node", "src/webapi/server.js"]
