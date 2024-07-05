import { Student } from "../../Domain/Entities/Student.js";
import { IUseCaseRequest } from "../../Interfaces/IUseCaseRequest.js";
import { UseCaseResponseMessage } from "../UseCaseResponse/UseCaseResponseMessage.js";
export class RegisterStudentRequest implements IUseCaseRequest<UseCaseResponseMessage> {
    public Students: Student[];
    constructor(students: Student[]) {
        this.Students = students;
    }
}