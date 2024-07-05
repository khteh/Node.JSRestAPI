import { Student } from "../../Domain/Entities/Student.js";
import { IUseCaseRequest } from "../../Interfaces/IUseCaseRequest.js";
import { UseCaseResponseMessage } from "../UseCaseResponse/UseCaseResponseMessage.js";
export class SuspendStudentRequest implements IUseCaseRequest<UseCaseResponseMessage> {
    public Student: string;
    constructor(student: string) {
        this.Student = student;
    }
}