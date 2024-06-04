import config from 'config';
export * from "./db"
export * from "./Data/Repositories/StudentRepository"
export * from "./Data/Repositories/TeacherRepository"
export * from "./LoggerImpl"
export * from "./types"
import winston from 'winston'
import * as rfs from 'rotating-file-stream'
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
}

const level = () => {
    const env = process.env.NODE_ENV || 'development'
    const isDevelopment = env === 'development'
    return isDevelopment ? 'debug' : 'warn'
}

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
}

winston.addColors(colors);
var path: string = (config.util.getEnv('NODE_ENV') === "test") ? "/tmp/node.js/test" : "/var/log/node.js";
// create a rotating write stream
var accessLogStream = rfs.createStream('application.log', {
    interval: '1d', // rotate daily
    path: path
})
const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.errors({ stack: true }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
);
const transports = [
    new winston.transports.Console({
        level: 'error',
        handleExceptions: true,
        format: format,
    }),
    new winston.transports.Stream({
        stream: accessLogStream,
        handleExceptions: true,
        format: format,
        /* other options */
    }),
];
const Logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports,
})
//export { Logger }
module.exports