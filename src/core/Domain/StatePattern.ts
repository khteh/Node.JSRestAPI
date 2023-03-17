import { ILogger, LogLevels } from "../Interfaces/ILogger";
import { injectable, inject } from "inversify";
import { LoggerTypes } from '../types';
export enum StatusEnum {
    NEW = "New",
    QUOTED = "Quoted",
    APPROVED = "Approved",
    REJECTED = "Rejected",
}
export const StatusColors = {
    [StatusEnum.NEW]: "custom.brightBlue",
    [StatusEnum.QUOTED]: "custom.kyberBlue",
    [StatusEnum.APPROVED]: "custom.activeGreen",
    [StatusEnum.REJECTED]: "custom.deepRed",
}
abstract class State {
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
export class ApprovedState extends State {
    public constructor(@inject(LoggerTypes.ILogger) logger: ILogger, context: StateContext) {
        super(logger, StatusEnum.APPROVED, context);
    }
    public override async handle () {
        // Do operation
        this._logger.Log(LogLevels.debug, "ApprovedState.handle()")
    }
}
export class RejectedState extends State {
    public constructor(@inject(LoggerTypes.ILogger) logger: ILogger, context: StateContext) {
        super(logger, StatusEnum.REJECTED, context);
    }
    public override async handle () {
        // Do operation
        this._logger.Log(LogLevels.debug, "RejectedState.handle()")
    }
}

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