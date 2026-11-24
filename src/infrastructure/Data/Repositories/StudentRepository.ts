import { Student, Teacher, type IStudentRepository, type ILogger, LoggerTypes, LogLevels } from "webapi.core"
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
        return await (await this.repository()).findOne({
            relations: { teachers: true },
            where: { id: id }
        });
    }
    public override async GetByEmail (email: string): Promise<Student | null> {
        return await (await this.repository()).findOne({
            relations: { teachers: true },
            where: { email: email }
        });
    }
    public override async ListAll (): Promise<Student[]> {
        return await (await this.repository()).find({ relations: { teachers: true } });
    }
    public async AddTeacher (student: Student, teacher: Teacher): Promise<Student | null> {
        if (teacher && student) {
            try {
                // Insert just this one join-table row. Saving the whole student would cascade to the teacher and
                // rewrite the join table from the teacher's students as loaded earlier, dropping rows added since.
                await (await this.repository()).createQueryBuilder().relation("teachers").of(student).add(teacher);
                (student.teachers ??= []).push(teacher);
                return student;
            } catch (e) {
                this._logger.Log(LogLevels.error, `AddTeacher(): ${e}`);
            }
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
            // A for...of loop, not forEach(async ...): forEach doesn't wait, so this returned before the saves finished.
            for (const s of students) {
                s.teachers = [];
                await (await this.repository()).save(s);
            }
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