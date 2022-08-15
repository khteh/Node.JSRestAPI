import { Student, Teacher, ITeacherRepository } from "core"
import { RepositoryBase } from "./RepositoryBase"
import { IStudentRepository } from "core"
export class TeacherRepository extends RepositoryBase<Teacher> implements ITeacherRepository {
    private _studentRepository: IStudentRepository;
    constructor(studentRepo: IStudentRepository) {
        super(Teacher);
        this._studentRepository = studentRepo;
    }
    public async AddStudent (teacher: Teacher, student: Student): Promise<Teacher | null> {
        if (teacher && student) {
            teacher.student.push(student);
            return await this.Update(teacher);
        }
        return null;
    }
}