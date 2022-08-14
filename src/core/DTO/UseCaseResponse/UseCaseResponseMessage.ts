import { Error } from "../Error"
export class UseCaseResponseMessage {
    public Id: string;
    public Success: Boolean;
    public Message: string;
    public Errors: Array<Error>;
    public constructor(id: string, success: boolean = false, message?: string, errors?: Array<Error>) {
        this.Id = id;
        this.Success = success;
        this.Message = message ?? "";
        this.Errors = errors ?? new Array<Error>();
    }
}