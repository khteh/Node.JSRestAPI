import 'reflect-metadata'
import config from 'config';
//import { di } from "./routes/app.js"
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import createError from 'http-errors'
import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { Http2SecureServer, Http2ServerRequest, Http2ServerResponse } from 'http2';
// import json schemas as normal
import AddStudentSchema from './Schemas/AddStudentsSchema.json' with { type: "json" };
// import the generated interfaces
import { AddStudentsToTeacherSchema } from './types/AddStudentsSchema.js'
import formbody from '@fastify/formbody'
import view from '@fastify/view'
import compression from 'compression'
import compress from '@fastify/compress'
//import helmet from 'helmet'
//import cors from 'cors'
import cors from '@fastify/cors'
import path from 'path'
import fs from 'fs'
import * as rfs from 'rotating-file-stream'
import cookieParser from 'cookie-parser'
import fastifyCookie from '@fastify/cookie';
import morgan from 'morgan'
import json from 'morgan-json'
//import healthchecks from './routes/healthchecks.js'
//import { api } from './routes/app.js'
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import bodyParser from 'body-parser';
import express from 'express'
import { Container } from "inversify";
import { FibonacciController } from 'Controllers/FibonacciController.js';
import { GreetingsController } from 'Controllers/GreetingsController.js';
import { GeminiController } from 'Controllers/GeminiController.js';
import { RegistrationController } from 'Controllers/RegistrationController.js';
import { AddStudentsToTeacherController } from 'Controllers/AddStudentsToTeacherController.js';
import { CommonStudentsController } from 'Controllers/CommonStudentsController.js';
import { SuspendStudentController } from 'Controllers/SuspendStudentController.js';
import { StudentNotificationsController } from 'Controllers/StudentNotificationsController.js';
import { IRegisterStudentUseCase, IRegisterTeacherUseCase, IAddStudentsToTeacherUseCase, ICommonStudentsUseCase, ISuspendStudentUseCase, IStudentNotificationsUseCase, IGenerateContentUseCase, Student, UseCaseTypes, ILogger, LoggerTypes, Teacher, IStudentRepository, ITeacherRepository, RepositoryTypes } from "webapp.core"
import { RegisterStudentUseCase, SuspendStudentUseCase, RegisterTeacherUseCase, AddStudentsToTeacherUseCase, CommonStudentsUseCase, GenerateContentUseCase, StudentNotificationsUseCase } from "webapp.core";
import { StudentRepository, TeacherRepository, LoggerImpl, DatabaseTypes, Database } from "infrastructure"
import multer from 'multer';
const upload = multer({ dest: 'uploads/' })

//import homeRoute from './routes/home.js'
//import fileUpload from 'express-fileupload';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envToLogger = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  production: true,
  test: false,
}
declare module 'fastify' {
  interface FastifyReply {
    render: (view: string, data?: object) => FastifyReply;
  }
}
var app: FastifyInstance<Http2SecureServer, Http2ServerRequest, Http2ServerResponse> = Fastify({
  logger: {
    level: 'info',
    file: '/var/log/node.js/nodejsrestapp.log', // Will use pino.destination()
    transport: {
      target: 'pino-pretty'
    },
    redact: ['req.headers.authorization'], // log all HTTP headers except the Authorization header for security:
    serializers: {
      res (reply) {
        // The default
        return {
          statusCode: reply.statusCode
        }
      },
      req (request) {
        return {
          method: request.method,
          url: request.url,
          path: request.routeOptions.url,
          parameters: request.params,
          // Including headers in the log could violate privacy laws,
          // e.g., GDPR. Use the "redact" option to remove sensitive
          // fields. It could also leak authentication data in the logs.
          headers: request.headers
        };
      },
    },
  },
  http2: true,
  https: {
    key: fs.readFileSync('fastify.key'),
    cert: fs.readFileSync('fastify.crt')
  },
  bodyLimit: 100 * 1024 * 1024, // 100MB
  trustProxy: true // Trust all proxies
})
// view engine setup
await app.register(view, {
  engine: {
    pug: require('pug'),
  },
  root: path.join(__dirname, 'views'), // Directory where your EJS templates are located
});
await app.register(import('@fastify/static'), {
  root: path.join(__dirname, 'public'), // 'public' is the directory containing static files
  //prefix: '/static/', // optional: serve files under a '/static' URL prefix
  maxAge: '30d',
  immutable: true
});
await app.register(formbody, { bodyLimit: 100 * 1024 * 1024 });
/*await app.register(fileUpload({
  // Configure file uploads with maximum file size 10MB
  limits: { fileSize: 100 * 1024 * 1024 },
  // Temporarily store uploaded files to disk, rather than buffering in memory
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));*/
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
  /*
  await app.register(morgan("combined", {
    skip: function (req, res) { return res.statusCode < 400 },
  }))*/

  // log all requests to access.log
  /*await app.register(logger(format, {
    stream: accessLogStream,
  }))*/
  /*expressawait app.register(expressWinston.logger({
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
/*
const shouldCompress = (req: FastifyRequest, res: FastifyReply) => {
  // don't compress responses asking explicitly not
  if (req.headers['x-no-compression']) {
    return false
  }
  // use compression filter function
  return compression.filter(req, res)
}
*/
await app.register(require('@fastify/cookie'), {
  secret: config.get("Secret"), // Optional: for signed cookies
  hook: 'onRequest', // set to false to disable cookie autoparsing or set autoparsing on any of the following hooks: 'onRequest', 'preParsing', 'preHandler', 'preValidation'. default: 'onRequest'
  parseOptions: {} // Optional: options to pass to the cookie.parse function
});
// Response compression can be disabled by an x-no-compression header in the request.
await app.register(compress, { inflateIfDeflated: true })
//await app.register(compression({ filter: shouldCompress }));
//await app.register(helmet()); // adding set of security middlewares
await app.register(cors);

// The order of the following await app.register is important. It will match the first rule.
//app.all('/', homeRoute);
/* GET home page. */
app.get('/', async (req, res) => {
  res.render('home', { title: 'Node.JS Express Application' });
});

// All methods (GET, POST, PUT, etc.)
app.all('/', async (request, reply) => {
  return { method: request.method };
});
app.all('/gemini', async (req, res) => { res.render('gemini', { title: 'Google Gemini' }); });
//app.all('/health', healthchecks);
/* k8s readiness check */
app.get('/ready', async function (req, res) {
  try {
    let [students, teachers]: PromiseSettledResult<number>[] = await Promise.allSettled([db.getRepository(Student).createQueryBuilder("student").getCount(), db.getRepository(Teacher).createQueryBuilder("teacher").getCount()]);
    if (students.status === "fulfilled" && teachers.status === "fulfilled" && students.value >= 0 && teachers.value >= 0)
      res.send('OK');
    else
      res.status(500).send('Database readiness health check failed!');
  } catch (e) {
    res.status(500).send(`Database readiness health check failed! ${e}`);
  }
});
/* k8s liveness check */
app.get('/live', function (req, res) {
  res.send('OK')
});
//app.all('/api', api);
const di = new Container();
/*
console.log('### LoggerTypes.ILogger ###');
console.log(LoggerTypes.ILogger);
console.log(`LoggerImpl: ${LoggerImpl}, Database: ${Database}, StudentRepository: ${StudentRepository}, TeacherRepository: ${TeacherRepository}`); //, GenerateContentUseCase: ${GenerateContentUseCase}`);
*/
di.bind<ILogger>(LoggerTypes.ILogger).to(LoggerImpl);
di.bind<IGenerateContentUseCase>(UseCaseTypes.IGenerateContentUseCase).to(GenerateContentUseCase);
di.bind<IRegisterStudentUseCase>(UseCaseTypes.IRegisterStudentUseCase).to(RegisterStudentUseCase);
di.bind<ISuspendStudentUseCase>(UseCaseTypes.ISuspendStudentUseCase).to(SuspendStudentUseCase);
di.bind<IRegisterTeacherUseCase>(UseCaseTypes.IRegisterTeacherUseCase).to(RegisterTeacherUseCase);
di.bind<IAddStudentsToTeacherUseCase>(UseCaseTypes.IAddStudentsToTeacherUseCase).to(AddStudentsToTeacherUseCase);
di.bind<ICommonStudentsUseCase>(UseCaseTypes.ICommonStudentsUseCase).to(CommonStudentsUseCase);
di.bind<IStudentNotificationsUseCase>(UseCaseTypes.IStudentNotificationsUseCase).to(StudentNotificationsUseCase);
di.bind<IStudentRepository>(RepositoryTypes.IStudentRepository).to(StudentRepository);
di.bind<ITeacherRepository>(RepositoryTypes.ITeacherRepository).to(TeacherRepository);
di.bind(DatabaseTypes.DatabaseService).to(Database);
var db = new Database(di.get<ILogger>(LoggerTypes.ILogger));

var fibonacci = new FibonacciController(di.get<ILogger>(LoggerTypes.ILogger));
var greetings = new GreetingsController(di.get<ILogger>(LoggerTypes.ILogger));
var gemini = new GeminiController(di.get<ILogger>(LoggerTypes.ILogger), di.get<IGenerateContentUseCase>(UseCaseTypes.IGenerateContentUseCase));
var registration = new RegistrationController(di.get<ILogger>(LoggerTypes.ILogger), di.get<IRegisterStudentUseCase>(UseCaseTypes.IRegisterStudentUseCase), di.get<IRegisterTeacherUseCase>(UseCaseTypes.IRegisterTeacherUseCase));
var addStudentsToTeacher = new AddStudentsToTeacherController(di.get<ILogger>(LoggerTypes.ILogger), di.get<IAddStudentsToTeacherUseCase>(UseCaseTypes.IAddStudentsToTeacherUseCase));
var commonStudents = new CommonStudentsController(di.get<ILogger>(LoggerTypes.ILogger), di.get<ICommonStudentsUseCase>(UseCaseTypes.ICommonStudentsUseCase));
var suspendStudent = new SuspendStudentController(di.get<ISuspendStudentUseCase>(UseCaseTypes.ISuspendStudentUseCase));
var studentNotifications = new StudentNotificationsController(di.get<IStudentNotificationsUseCase>(UseCaseTypes.IStudentNotificationsUseCase));
app.get('/greetings', async (req, res) => { greetings.Greetings(req, res); });
app.get('/fibonacci', async (req, res) => { fibonacci.Fibonacci(req, res); });
app.post('/gemini', upload.single('image'), async (req, res) => { gemini.GenerateText(req, res); });
app.post('/register', async (req, res) => { registration.Register(req, res); });
/*
{
  "teacher": {
      "email": "teacher1@gmail.com"
   },
  "students":
    [
      "student1@gmail.com",
      "student2@gmail.com"
    ]
}
*/
// https://fastify.dev/docs/latest/Reference/TypeScript/
const addStudentsSchema = {
  type: 'object',
  required: ['teacher', 'students'],
  properties: {
    teacher: {
      type: 'object',
      required: ['email'],
      properties: {
        email: { type: 'string', format: 'email' }
      }
    },
    students: {
      type: 'array',
      items: {
        type: 'string',
        format: 'email'
      },
    }
  }
}
app.post('/addstudents', {
  schema: {
    body: addStudentsSchema
  },
  handler: async (req, res) => { return await addStudentsToTeacher.AddStudentsToTeacher(req, res); }
});
app.post('/commonstudents', async (req, res) => { commonStudents.CommonStudents(req, res); });
app.post('/suspendstudent', async (req, res) => { suspendStudent.SuspendStudent(req, res); })
app.post('/notifystudents', async (req, res) => { studentNotifications.NotifyStudents(req, res); })

//await app.register('/', async (req, res) =>  { res.render('home', { title: 'Node.JS Express Application' }); }); // This is catch-all
// catch 404 and forward to error handler
await app.register(function (req: FastifyRequest, res: FastifyReply) {
  next(createError(404));
});
// error handler
await app.register(function (err: any, req: FastifyRequest, res: FastifyReply) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export { app, morgan };