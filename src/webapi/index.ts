import config from 'config';
import { Request, Response, NextFunction } from 'express';
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import createError from 'http-errors'
import express from 'express'
import compression from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import * as rfs from 'rotating-file-stream'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import json from 'morgan-json'
import indexRoute from './routes/index.js'
import healthchecks from './routes/healthchecks.js'
import { api } from './routes/api.js'
import { Database } from "infrastructure"
var app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.enable("trust proxy");
//if (config.util.getEnv('NODE_ENV') !== "test")
//  Database.init();
// create a rotating write stream
if (config.util.getEnv('NODE_ENV') !== "test") {
  var accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: "/var/log/nodejs"
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
  app.use(logger("combined", {
    skip: function (req, res) { return res.statusCode < 400 },
  }))

  // log all requests to access.log
  app.use(logger(format, {
    stream: accessLogStream,
  }))
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
app.use(helmet()); // adding set of security middlewares
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

export { app, logger };