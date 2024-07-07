import { Student } from "../../Domain/Entities/Student.js";
import { RegistrationRequest } from "./RegistrationRequest.js";
export class RegisterStudentRequest extends RegistrationRequest<Student> {
    constructor(students: Student[]) {
        super(students);
    }
}