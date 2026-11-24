#!/usr/bin/env node
//import 'elastic-apm-node/start.js'
import 'reflect-metadata'
/**
 * Module dependencies.
 */
import fs from 'fs';
import { app } from './index.js';
import http2 from 'http2';
import d from 'debug';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import config from 'config';
import { ServerCredentials } from '@grpc/grpc-js';
import { getServer } from './Services/SchoolService.js';

var debug = d('teachersapi:server');
var port = normalizePort(process.env.PORT || '443');
/*
Express doesn't support Node's http2 server on its own (https://github.com/expressjs/express/issues/5061),
so the app is wrapped with http2-express in index.ts. allowHTTP1 keeps HTTP/1.1 clients working on the same port.
*/
const options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt'),
  allowHTTP1: true
};
app.set('port', port);
var server = http2.createSecureServer(options, app);
server.on('error', onError);
server.listen(port);
/*
The gRPC server needs its own port: two servers can't listen on the same one. grpc.port in config/
(GRPC_PORT), default 4434. With grpc.requireClientCertificate (the default), clients must present a
certificate signed by server.crt (mutual TLS).
*/
const grpcPort: number = config.get<number>('grpc.port');
const credentials = ServerCredentials.createSsl(fs.readFileSync('server.crt'), [{
  cert_chain: fs.readFileSync('server.crt'),
  private_key: fs.readFileSync('server.key')
}], config.get<boolean>('grpc.requireClientCertificate'));
/** Resolves with the gRPC server's port once it is listening; rejects if it can't bind. */
export const grpcReady: Promise<number> = getServer().then(grpcServer => new Promise<number>((resolve, reject) =>
  // bindAsync starts serving once bound; Server.start() is deprecated.
  grpcServer.bindAsync(`0.0.0.0:${grpcPort}`, credentials, (error, boundPort) => error ? reject(error) : resolve(boundPort))));
grpcReady.then(boundPort => debug(`gRPC listening on port ${boundPort}`), error => {
  console.error(`gRPC server failed to listen on port ${grpcPort}: ${error.message}`);
  process.exit(1);
});

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort (val: string) {
  var port = Number(val);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError (error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
    default:
      throw error;
  }
}
export default port