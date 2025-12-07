import config from 'config';
import { ILogger, LogLevelsType } from "webapi.core"
import { injectable, inject } from "inversify";
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
var accessLogStream = rfs.createStream('nodejsrestapi.log', {
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
@injectable()
export class LoggerImpl implements ILogger {
    public Log (level: number, message: string): void {
        /*
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4,
        */
        switch (level) {
            case 0:
                Logger.error(message);
                break;
            case 1:
                Logger.warn(message);
                break;
            case 2:
                Logger.info(message);
                break;
            case 3:
                Logger.http(message);
                break;
            case 4:
                Logger.debug(message);
                break;
        }
    }
}