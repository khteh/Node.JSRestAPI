FROM node:22
MAINTAINER Kok How, Teh <funcoolgeek@gmail.com>
WORKDIR /app
ADD package.json .
ADD tsconfig.json .
ADD node_modules node_modules
ADD build .
RUN openssl req -new -newkey rsa:4096 -x509 -nodes -days 365 -keyout server.key -out server.crt -subj "/C=SG/ST=Singapore/L=Singapore /O=Kok How Pte. Ltd./OU=Node.JSRestAPI/CN=localhost/emailAddress=funcoolgeek@gmail.com" -passin pass:Node.JSRestAPI -addext "subjectAltName = DNS:localhost"
EXPOSE 443
ENTRYPOINT ["node", "--trace-deprecation", "src/webapi/server.js"]
