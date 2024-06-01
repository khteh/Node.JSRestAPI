#!/bin/bash
openssl genrsa -aes256 -passout pass:Node.JSRestAPI -out server.key 4096
openssl rsa -in server.key -out server.key.insecure -passin pass:Node.JSRestAPI
mv server.key server.key.secure
mv server.key.insecure server.key
openssl req -new -newkey rsa:4096 -x509 -nodes -days 365 -keyout server.key -out server.crt -subj "/C=SG/ST=Singapore/L=Singapore /O=Kok How Pte. Ltd./OU=Node.JSRestAPI/CN=localhost/emailAddress=funcoolgeek@gmail.com" -passin pass:Node.JSRestAPI -addext "subjectAltName = DNS:localhost"
openssl pkcs12 -export -out /tmp/localhost.pfx -inkey server.key -in server.crt -passout pass:Node.JSRestAPI