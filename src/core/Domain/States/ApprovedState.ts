import { ILogger, LogLevels } from "../../Interfaces/ILogger";
import { injectable, inject } from "inversify";
import { LoggerTypes } from '../../types';
import { StateContext } from "./StateContext";
import { State } from "./State";
import { StatusEnum } from "./StateEnums";
export class ApprovedState extends State {
    public constructor(@inject(LoggerTypes.ILogger) logger: ILogger, context: StateContext) {
        super(logger, StatusEnum.APPROVED, context);
    }
    public override async handle () {
        // Do operation
        this._logger.Log(LogLevels.debug, "ApprovedState.handle()")
    }
}