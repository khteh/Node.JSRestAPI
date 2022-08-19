import { Student } from "../../Domain/Entities/Student";
import { Teacher } from "../../Domain/Entities/Teacher";
import { IUseCaseRequest } from "../../Interfaces/IUseCaseRequest";
import { UseCaseResponseMessage } from "../UseCaseResponse/UseCaseResponseMessage";
export class AddStudentsToTeacherRequest implements IUseCaseRequest<UseCaseResponseMessage>
{
    public Students: Student[];
    public Teacher: Teacher;
    constructor(teacher: Teacher, students: Student[]) {
        this.Teacher = teacher;
        this.Students = students;
    }
}