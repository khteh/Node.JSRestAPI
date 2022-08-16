import { IUseCaseRequest } from "Interfaces/IUseCaseRequest";
import { UseCaseResponseMessage } from "DTO/UseCaseResponse/UseCaseResponseMessage";
export class CommonStudentsRequest implements IUseCaseRequest<UseCaseResponseMessage>
{
    public Teachers: string[]; // Teacher's email
    constructor(teachers: string[]) {
        this.Teachers = teachers;
    }
}