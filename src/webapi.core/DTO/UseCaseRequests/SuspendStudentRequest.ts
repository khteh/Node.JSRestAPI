import { Student } from "../../Domain/Entities/Student";
import { IUseCaseRequest } from "../../Interfaces/IUseCaseRequest";
import { UseCaseResponseMessage } from "../UseCaseResponse/UseCaseResponseMessage";
export class SuspendStudentRequest implements IUseCaseRequest<UseCaseResponseMessage>
{
    public Student: string;
    constructor(student: string) {
        this.Student = student;
    }
}