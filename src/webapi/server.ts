#!/usr/bin/env node
//import 'elastic-apm-node/start.js'

/**
 * Module dependencies.
 */
import fs from 'fs';
import { app } from './index.js';
import spdy from 'spdy'
import http2 from 'http2';
import d from 'debug';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

var debug = d('teachersapi:server');
var port = normalizePort(process.env.PORT || '443');
/*https://stackoverflow.com/questions/59534717/how-to-integrate-http2-with-expressjs-using-nodejs-module-http2
expressjs still does not officially support Node http2
https://github.com/expressjs/express/issues/5061
const server = http2.createSecureServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt')
}, app);
*/
/* https://github.com/spdy-http2/node-spdy */
const options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt')
};
//console.log(options)
app.set('port', port);
var server = spdy.createServer(options, app);
server.on('error', onError);
server.on('stream', (stream, headers) => {
  // stream is a Duplex
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200
  });
  stream.end('<h1>Hello World</h1>');
});
server.listen(port);
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