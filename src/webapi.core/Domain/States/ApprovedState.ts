import { ILogger, LogLevels } from "../../Interfaces/ILogger.js";
import { injectable, inject } from "inversify";
import { LoggerTypes } from '../../types.js';
import StateContext from "./StateContext.js";
import State from "./State.js";
import { StatusEnum } from "./StateEnums.js";
export default class ApprovedState extends State {
    public constructor(@inject(LoggerTypes.ILogger) logger: ILogger, context: () => StateContext) {
        super(logger, StatusEnum.APPROVED, context);
    }
    public override async handle () {
        // Do operation
        this._logger.Log(LogLevels.debug, "ApprovedState.handle()")
    }
}