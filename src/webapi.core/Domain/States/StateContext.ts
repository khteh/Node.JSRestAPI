import { ILogger, LogLevels } from "../../Interfaces/ILogger";
import { injectable, inject } from "inversify";
import { LoggerTypes } from '../../types';
import { State } from "./State";
import { StatusEnum } from "./StateEnums";

export class StateContext {
    private readonly _logger: ILogger;
    private _state?: State;
    public constructor(@inject(LoggerTypes.ILogger) logger: ILogger, state?: State) {
        this._logger = logger;
        this._state = state;
    }
    public async handle () {
        // Do operation
        if (this._state)
            this._state.handle();
    }
    public async ChangeState (state?: State) {
        this._logger.Log(LogLevels.debug, `Current state ${this._state?.Name()}`);
        this._state = state;
        this._logger.Log(LogLevels.debug, `New state ${this._state?.Name()}`);
    }
    public State (): StatusEnum | null {
        return this._state ? this._state.Name() : null;
    }
}