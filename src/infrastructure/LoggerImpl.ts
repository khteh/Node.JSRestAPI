import { ILogger, LogLevelsType } from "core"
import { Logger } from "index"
export class LoggerImpl implements ILogger {
    Log (level: LogLevelsType, message: string): void {
        /*
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4,
        */
        switch (level.key) {
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