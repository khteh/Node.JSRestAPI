import { IUseCaseRequest } from "../../Interfaces/IUseCaseRequest.js";
import { UseCaseResponseMessage } from "../UseCaseResponse/UseCaseResponseMessage.js";
export class CommonStudentsRequest implements IUseCaseRequest<UseCaseResponseMessage> {
    public Teachers: string[]; // Teacher's email
    constructor(teachers: string[]) {
        this.Teachers = teachers;
    }
}