import { Error } from "webapi.core";
export class ResponseBase {
    public Success: boolean;
    public Errors: Error[];
    public constructor(success: boolean, errors: Error[]) {
        this.Success = success;
        this.Errors = errors;
    }
}