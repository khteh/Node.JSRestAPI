import { Student, Teacher, type ITeacherRepository, type ILogger, LoggerTypes, LogLevels } from "webapi.core"
import { RepositoryBase } from "./RepositoryBase.js"
import { type IStudentRepository, RepositoryTypes } from "webapi.core"
import { injectable, inject } from "inversify";
import { DatabaseTypes } from "../../types.js";
import { Database } from "../../db.js"
@injectable()
export class TeacherRepository extends RepositoryBase<Teacher> implements ITeacherRepository {
    private _studentRepository: IStudentRepository;
    constructor(@inject(LoggerTypes.ILogger) logger: ILogger, @inject(DatabaseTypes.DatabaseService) db: Database, @inject(RepositoryTypes.IStudentRepository) studentRepo: IStudentRepository) {
        super(logger, Teacher, db);
        this._studentRepository = studentRepo;
    }
    public override async GetById (id: number): Promise<Teacher | null> {
        return await (await this.repository()).findOne({
            relations: { students: true },
            where: { id: id }
        });
    }
    public override async GetByEmail (email: string): Promise<Teacher | null> {
        return await (await this.repository()).findOne({
            relations: { students: true },
            where: { email: email }
        });
    }
    public override async ListAll (): Promise<Teacher[]> {
        return await (await this.repository()).find({ relations: { students: true } });
    }
    public async AddStudent (teacher: Teacher, student: Student): Promise<Teacher | null> {
        if (teacher && student) {
            try {
                // Insert just this one join-table row. Saving the whole teacher would cascade to the student and
                // rewrite the join table from the student's teachers as loaded earlier, dropping rows added since.
                await (await this.repository()).createQueryBuilder().relation("students").of(teacher).add(student);
                (teacher.students ??= []).push(student);
                return teacher;
            } catch (e) {
                this._logger.Log(LogLevels.error, `AddStudent(): ${e}`);
            }
        }
        return null;
    }
    public async DeleteAllTeachers (): Promise<boolean> {
        try {
            return await this.Clear();
        } catch (error) {
            console.error(error);
            this._logger.Log(LogLevels.error, `DeleteAllTeachers(): ${error}`);
            return false;
        }
    }
}