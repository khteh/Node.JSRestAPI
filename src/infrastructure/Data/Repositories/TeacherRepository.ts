import { Student, Teacher, ITeacherRepository } from "webapi.core"
import { RepositoryBase } from "./RepositoryBase.js"
import { IStudentRepository, RepositoryTypes } from "webapi.core"
import { injectable, inject } from "inversify";
import { DatabaseTypes } from "../../types.js";
import { Database } from "../../db.js"
@injectable()
export class TeacherRepository extends RepositoryBase<Teacher> implements ITeacherRepository {
    private _studentRepository: IStudentRepository;
    constructor(@inject(DatabaseTypes.DatabaseService) db: Database, @inject(RepositoryTypes.IStudentRepository) studentRepo: IStudentRepository) {
        super(Teacher, db);
        this._studentRepository = studentRepo;
    }
    public override async GetById (id: number): Promise<Teacher | null> {
        return await this._repository.findOne({
            where: { id: id },
            relations: { students: true }
        });
    }
    public override async GetByEmail (email: string): Promise<Teacher | null> {
        return await this._repository.findOne({
            where: { email: email },
            relations: { students: true }
        });
    }
    public override async ListAll (): Promise<Teacher[]> {
        return await this._repository.find({ relations: ["teachers"] });
    }
    public async AddStudent (teacher: Teacher, student: Student): Promise<Teacher | null> {
        if (teacher && student) {
            try {
                teacher.students.push(student);
                return await this.Update(teacher);
            } catch (e) { console.log(e); }
        }
        return null;
    }
}