import { Student, Teacher, IStudentRepository } from "webapi.core"
import { RepositoryBase } from "./RepositoryBase.js"
import { injectable, inject } from "inversify";
import { DatabaseTypes } from "../../types.js";
import { Database } from "../../db.js"
@injectable()
export class StudentRepository extends RepositoryBase<Student> implements IStudentRepository {
    constructor(@inject(DatabaseTypes.DatabaseService) db: Database) {
        super(Student, db);
    }
    public override async GetById (id: number): Promise<Student | null> {
        return await this._repository.findOneOrFail({
            where: { id: id },
            relations: ["teachers"]
        });
    }
    public override async GetByEmail (email: string): Promise<Student | null> {
        return await this._repository.findOneOrFail({
            where: { email: email },
            relations: ["teachers"]
        });
    }
    public override async ListAll (): Promise<Student[]> {
        return await this._repository.find({ relations: ["teachers"] });
    }
    public async AddTeacher (student: Student, teacher: Teacher): Promise<Student | null> {
        if (teacher && student) {
            student.teachers.push(teacher);
            return await this.Update(student);
        }
        return null;
    }
    public async RegisteredToTeacher (teacher: Teacher): Promise<Student[]> {
        if (teacher && teacher.email) {
            return (await this.ListAll()).filter(i => i.teachers.find(j => j.email == teacher.email));
        }
        return [];
    }
}