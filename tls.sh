#!/bin/bash
openssl genrsa -aes256 -passout pass:Node.JSRestAPI -out server.key 4096
openssl rsa -in server.key -out server.key.insecure -passin pass:Node.JSRestAPI
mv server.key server.key.secure
mv server.key.insecure server.key
openssl req -new -newkey rsa:4096 -x509 -nodes -days 365 -keyout server.key -out server.crt -subj "/C=SG/ST=Singapore/L=Singapore /O=Node.JSRestAPI Pte. Ltd./OU=Node.JSRestAPI/CN=Node.JSRestAPI/emailAddress=me@email.com" -passin pass:Node.JSRestAPI
openssl pkcs12 -export -out /tmp/localhost.pfx -inkey server.key -in server.crt -certfile server.crt -passout pass:Node.JSRestAPI
