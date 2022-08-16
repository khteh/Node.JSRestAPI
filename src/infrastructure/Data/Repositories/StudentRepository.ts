import { Student, Teacher, IStudentRepository } from "core"
import { RepositoryBase } from "./RepositoryBase"
export class StudentRepository extends RepositoryBase<Student> implements IStudentRepository {
    constructor() {
        super(Student);
    }
    public async AddTeacher (student: Student, teacher: Teacher): Promise<Student | null> {
        if (teacher && student) {
            student.teacher.push(teacher);
            return await this.Update(student);
        }
        return null;
    }
}