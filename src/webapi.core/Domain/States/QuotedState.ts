import { ILogger, LogLevels } from "../../Interfaces/ILogger.js";
import { injectable, inject } from "inversify";
import { LoggerTypes } from '../../types.js';
import { StateContext } from "./StateContext.js";
import State from "./State.js";
import { StatusEnum } from "./StateEnums.js";
import { ApprovedState } from "./ApprovedState.js";
import { RejectedState } from "./RejectedState.js";
export class QuotedState extends State {
    private readonly _approved: State;
    private readonly _rejected: State;
    public constructor(@inject(LoggerTypes.ILogger) logger: ILogger, context: StateContext) {
        super(logger, StatusEnum.QUOTED, context);
        this._approved = new ApprovedState(logger, this._context);
        this._rejected = new RejectedState(logger, this._context);
    }
    public override async handle () {
        // Do operation
        this._logger.Log(LogLevels.debug, "QuotedState.handle()")
        await this._context.ChangeState(this._approved);
    }
}
