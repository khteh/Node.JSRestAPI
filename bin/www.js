#!/usr/bin/env node

/**
 * Module dependencies.
 */
import fs from 'fs';
import app from '../app.js';
import spdy from 'spdy'
import http2 from 'http2';
import d from 'debug';
var debug = d('teachersapi:server');

/*
https://stackoverflow.com/questions/59534717/how-to-integrate-http2-with-expressjs-using-nodejs-module-http2
expressjs still does not officially support Node http2
const server = http2.createSecureServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt')
});*/
// https://github.com/spdy-http2/node-spdy
const options = {
        key: fs.readFileSync('server.key'),
        cert:  fs.readFileSync('server.crt')
};
//console.log(options)
/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '8443');
app.set('port', port);
spdy.createServer(options, app)
      .listen(port, (error) => {
        if (error) {
          onError(error);
          //console.error(error)
          //return process.exit(1)
        } else {
          console.log('Listening on port: ' + port + '.')
        }
      })

/**
 * Create HTTP server.
 */

//var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

//server.listen(port);
//server.on('error', onError);
//server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

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

function onError(error) {
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

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = spdy.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}