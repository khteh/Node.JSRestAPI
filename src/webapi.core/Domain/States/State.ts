import { ILogger, LogLevels } from "../../Interfaces/ILogger";
import { injectable, inject } from "inversify";
import { LoggerTypes } from '../../types';
import { StateContext } from "./StateContext";
import { StatusEnum, StatusColors } from "./StateEnums";

export abstract class State {
    protected readonly _logger: ILogger;
    protected readonly _name: StatusEnum;
    protected readonly _colour: string;
    protected readonly _context: StateContext;
    protected constructor(@inject(LoggerTypes.ILogger) logger: ILogger, name: StatusEnum, context: StateContext) {
        this._logger = logger;
        this._name = name;
        this._context = context;
        this._colour = StatusColors[this._name] || StatusColors[StatusEnum.NEW]
    }
    public abstract handle (): void;
    public Name (): StatusEnum { return this._name }
}
