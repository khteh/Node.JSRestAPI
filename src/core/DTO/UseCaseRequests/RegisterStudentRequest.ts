import { Student } from "Domain/Entities/Student";
import { IUseCaseRequest } from "Interfaces/IUseCaseRequest";
import { UseCaseResponseMessage } from "DTO/UseCaseResponse/UseCaseResponseMessage";
export class RegisterStudentRequest implements IUseCaseRequest<UseCaseResponseMessage>
{
    public Students: Student[];
    constructor(students: Student[]) {
        this.Students = students;
    }
}