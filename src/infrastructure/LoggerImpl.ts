import { ILogger, LogLevelsType } from "webapi.core"
import { Logger } from "./index.js"
import { injectable, inject } from "inversify";
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