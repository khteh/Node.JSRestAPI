import { Student } from "../../Domain/Entities/Student.js";
import { Teacher } from "../../Domain/Entities/Teacher.js";
import { IUseCaseRequest } from "../../Interfaces/IUseCaseRequest.js";
import { UseCaseResponseMessage } from "../UseCaseResponse/UseCaseResponseMessage.js";
export class AddStudentsToTeacherRequest implements IUseCaseRequest<UseCaseResponseMessage> {
    public Students: Student[];
    public Teacher: Teacher;
    constructor(teacher: Teacher, students: Student[]) {
        this.Teacher = teacher;
        this.Students = students;
    }
}