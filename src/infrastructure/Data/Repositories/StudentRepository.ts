import { Student, Teacher, IStudentRepository, ILogger, LoggerTypes, LogLevels } from "webapi.core"
import { RepositoryBase } from "./RepositoryBase.js"
import { injectable, inject } from "inversify";
import { DatabaseTypes } from "../../types.js";
import { Database } from "../../db.js"
@injectable()
export class StudentRepository extends RepositoryBase<Student> implements IStudentRepository {
    constructor(@inject(LoggerTypes.ILogger) logger: ILogger, @inject(DatabaseTypes.DatabaseService) db: Database) {
        super(logger, Student, db);
    }
    public override async GetById (id: number): Promise<Student | null> {
        return await this._repository.findOne({
            relations: { teachers: true },
            where: { id: id }
        });
    }
    public override async GetByEmail (email: string): Promise<Student | null> {
        return await this._repository.findOne({
            relations: { teachers: true },
            where: { email: email }
        });
    }
    public override async ListAll (): Promise<Student[]> {
        return await this._repository.find({ relations: ["teachers"] });
    }
    public async AddTeacher (student: Student, teacher: Teacher): Promise<Student | null> {
        if (teacher && student) {
            try {
                student.teachers.push(teacher);
                return await this.Update(student);
            } catch (e) { console.log(e); }
        }
        return null;
    }
    public async RegisteredToTeacher (teacher: Teacher): Promise<Student[]> {
        if (teacher && teacher.email) {
            return (await this.ListAll()).filter(i => i.teachers.find(j => j.email == teacher.email));
        }
        return [];
    }
    public async DeleteAllRelations (): Promise<boolean> {
        try {
            let students: Student[] = await this.ListAll();
            students.forEach(async s => {
                s.teachers = [];
                await this._repository.save(s);
            }
            );
        } catch (error) {
            console.error(error);
            this._logger.Log(LogLevels.error, `DeleteAllRelations(): ${error}`);
            return false;
        }
        return true;
    }
    public async DeleteAllStudents (): Promise<boolean> {
        try {
            return await this.Clear();
        } catch (error) {
            console.error(error);
            this._logger.Log(LogLevels.error, `DeleteAllStudents(): ${error}`);
            return false;
        }
    }
}