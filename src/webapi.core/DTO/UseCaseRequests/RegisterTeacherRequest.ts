import { IUseCaseRequest } from "../../Interfaces/IUseCaseRequest.js";
import { UseCaseResponseMessage } from "../UseCaseResponse/UseCaseResponseMessage.js";
export class RegisterTeacherRequest implements IUseCaseRequest<UseCaseResponseMessage> {
    public FirstName: string;
    public LastName: string;
    public Email: string;
    constructor(first: string, last: string, email: string) {
        this.FirstName = first;
        this.LastName = last;
        this.Email = email;
    }
}