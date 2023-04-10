import { ILogger, LogLevels } from "../../Interfaces/ILogger";
import { injectable, inject } from "inversify";
import { LoggerTypes } from '../../types';
import { StateContext } from "./StateContext";
import { State } from "./State";
import { StatusEnum } from "./StateEnums";
import { QuotedState } from "./QuotedState";
export class NewState extends State {
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
