import config from 'config';
import { Request, Response, NextFunction } from 'express';
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import createError from 'http-errors'
import express from 'express'
import compression from 'compression'
//import helmet from 'helmet'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import * as rfs from 'rotating-file-stream'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import json from 'morgan-json'
import indexRoute from './routes/index.js'
import healthchecks from './routes/healthchecks.js'
import { api } from './routes/api.js'
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import bodyParser from 'body-parser';
var app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.enable("trust proxy");
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb', parameterLimit: 1000000 }));
app.use(express.static(path.join(__dirname, 'public')));
//if (config.util.getEnv('NODE_ENV') !== "test")
//  Database.init();
// create a rotating write stream
if (config.util.getEnv('NODE_ENV') !== "test") {
  var accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: "/var/log/node.js"
  })
  //var format: string = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent - :response-time ms"';
  const format = json({
    IP: ':remote-addr',
    User: ':remote-user',
    Timestamp: ':date[clf]',
    Method: ':method',
    Path: ':url',
    Protocol: 'HTTP/:http-version',
    Status: ':status',
    ContentLength: ':res[content-length]',
    Referrer: ':referrer',
    Agent: ':user-agent',
    ResponseTime: ':response-time ms',
  })
  // log only 4xx and 5xx responses to console
  app.use(morgan("combined", {
    skip: function (req, res) { return res.statusCode < 400 },
  }))

  // log all requests to access.log
  /*app.use(logger(format, {
    stream: accessLogStream,
  }))*/
  /*expressApp.use(expressWinston.logger({
    level: 'info',
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function (req, res) {
      return req?.url?.includes('health') || req?.url?.includes('robots.txt')
    }, // optional: allows to skip some log messages based on request and/or response
    format: winston.format.combine(
      winston.format.splat(),
      winston.format.timestamp(),
      winston.format.json()
    ),
    defaultMeta: { service: 'user-service' },
    requestWhitelist: ['headers', 'query'],  //these are not included in the standard StackDriver httpRequest
    responseWhitelist: ['body'], // this populates the `res.body` so we can get the response size (not required)        
    dynamicMeta: (req, res) => {
      const httpRequest = {}
      const meta = {}
      if (req) {
        meta.httpRequest = httpRequest
        httpRequest.requestMethod = req.method
        httpRequest.requestUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`
        httpRequest.protocol = `HTTP/${req.httpVersion}`
        httpRequest.remoteIp = req.ip // this includes both ipv6 and ipv4 addresses separated by ':'
        //httpRequest.remoteIp = req.ip.indexOf(':') >= 0 ? req.ip.substring(req.ip.lastIndexOf(':') + 1) : req.ip   // just ipv4
        httpRequest.requestSize = req.socket.bytesRead
        httpRequest.userAgent = req.get('User-Agent')
        httpRequest.referrer = req.get('Referrer')
        httpRequest.user = req.user ? req.user.username : null
        httpRequest.role = req.user ? req.user.role : null
      }
      if (res) {
        meta.httpRequest = httpRequest
        httpRequest.status = res.statusCode
        httpRequest.latency = {
          seconds: Math.floor(res.responseTime / 1000),
          nanos: (res.responseTime % 1000) * 1000000
        }
        if (res.body) {
          if (typeof res.body === 'object') {
            httpRequest.responseSize = JSON.stringify(res.body).length
          } else if (typeof res.body === 'string') {
            httpRequest.responseSize = res.body.length
          }
        }
      }
      return meta
    },
    transports: [
      new DailyRotateFile({
        level: 'info',
        filename: '/var/log/kyberlife/log-%DATE%',
        handleExceptions: true,
        format: winston.format.combine(
          winston.format.splat(),
          winston.format.timestamp(),
          winston.format.json()
        ),
        maxSize: '100m',
        maxFiles: '14d'
      }),
      new winston.transports.Console({
        level: 'debug',
        handleExceptions: true,
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      })
    ],
    exitOnError: false,
  }))*/
}
const shouldCompress = (req: Request, res: Response) => {
  // don't compress responses asking explicitly not
  if (req.headers['x-no-compression']) {
    return false
  }
  // use compression filter function
  return compression.filter(req, res)
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression({ filter: shouldCompress }));
//app.use(helmet()); // adding set of security middlewares
app.use(cors()); // enable all CORS request

app.use('/', indexRoute);
app.use('/health', healthchecks);
app.use('/api', api);
// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});
// error handler
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export { app, morgan };