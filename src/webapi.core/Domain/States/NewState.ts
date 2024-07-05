import { ILogger, LogLevels } from "../../Interfaces/ILogger.js";
import { injectable, inject } from "inversify";
import { LoggerTypes } from '../../types.js';
import StateContext from "./StateContext.js";
import State from "./State.js";
import { StatusEnum } from "./StateEnums.js";
import QuotedState from "./QuotedState.js";
export default class NewState extends State {
    private readonly _quoted: State;
    public constructor(@inject(LoggerTypes.ILogger) logger: ILogger, context: StateContext) {
        super(logger, StatusEnum.NEW, context);
        this._quoted = new QuotedState(logger, this._context);
    }
    public override async handle () {
        // Do operation
        this._logger.Log(LogLevels.debug, "NewState.handle()")
        await this._context.ChangeState(this._quoted);
    }
}
