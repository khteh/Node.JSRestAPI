import { IOutputPort, UseCaseResponseMessage, Error } from "core"
export abstract class PresenterBase<T extends UseCaseResponseMessage> implements IOutputPort<T>
{
    public Code: number = 200;
    public Message: string = "";
    public Errors: Array<Error> = [];
    public async Handle (response: T): Promise<void> {
        this.Code = response.Success && !response.Errors.length ? 200 : 400;
        this.Message = response.Message;
        this.Errors = response.Errors;
    }
}
