import { Request, Response, NextFunction } from 'express';
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import createError from 'http-errors'
import express from 'express'
import compression from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import indexRoute from './routes/index'
import healthchecks from './routes/healthchecks'
import api from './routes/api'
import {Database} from "infrastructure"
var app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
Database.init();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression()); // compresses all the responses
app.use(helmet()); // adding set of security middlewares
app.use(cors()); // enable all CORS request

app.use('/', indexRoute);
app.use('/healthchecks', healthchecks);
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

export { app as default };