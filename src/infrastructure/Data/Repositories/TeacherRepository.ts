import { Student, Teacher, ITeacherRepository } from "core"
import { RepositoryBase } from "./RepositoryBase"
import { IStudentRepository } from "core"
import { injectable, inject } from "inversify";
@injectable()
export class TeacherRepository extends RepositoryBase<Teacher> implements ITeacherRepository {
    private _studentRepository: IStudentRepository;
    constructor(studentRepo: IStudentRepository) {
        super(Teacher);
        this._studentRepository = studentRepo;
    }
    public override async GetById (id: number): Promise<Teacher | null> {
        return await this._repository.findOneOrFail({
            where: { id: id },
            relations: ["students"]
        });
    }
    public override async GetByEmail (email: string): Promise<Teacher | null> {
        return await this._repository.findOneOrFail({
            where: { email: email },
            relations: ["students"]
        });
    }
    public override async ListAll (): Promise<Teacher[]> {
        return await this._repository.find({ relations: ["teachers"] });
    }

    public async AddStudent (teacher: Teacher, student: Student): Promise<Teacher | null> {
        if (teacher && student) {
            teacher.students.push(student);
            return await this.Update(teacher);
        }
        return null;
    }
}