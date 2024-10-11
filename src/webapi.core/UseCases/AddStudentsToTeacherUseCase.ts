import { IAddStudentsToTeacherUseCase } from "../Interfaces/UseCases/IAddStudentsToTeacherUseCase.js"
import { IStudentRepository } from "../Interfaces/IStudentRepository.js"
import { ITeacherRepository } from "../Interfaces/ITeacherRepository.js"
import { IOutputPort } from "../Interfaces/IOutputPort.js";
import { UseCaseResponseMessage } from "../DTO/UseCaseResponse/UseCaseResponseMessage.js"
import { AddStudentsToTeacherRequest } from "../DTO/UseCaseRequests/AddStudentsToTeacherRequest.js"
import { Student } from "../Domain/Entities/Student.js";
import { Teacher } from "../Domain/Entities/Teacher.js";
import { Error } from "../DTO/Error.js"
import { injectable, inject } from "inversify";
import { ILogger, LogLevels } from "../Interfaces/ILogger.js";
import { LoggerTypes, RepositoryTypes } from "../types.js";
@injectable()
export class AddStudentsToTeacherUseCase implements IAddStudentsToTeacherUseCase {
    private readonly _teacherRepository: ITeacherRepository;
    private readonly _studentRepository: IStudentRepository;
    private _logger: ILogger;
    public constructor(@inject(LoggerTypes.ILogger) logger: ILogger, @inject(RepositoryTypes.IStudentRepository) studentRepo: IStudentRepository, @inject(RepositoryTypes.ITeacherRepository) teacherRepo: ITeacherRepository) {
        this._logger = logger;
        this._teacherRepository = teacherRepo;
        this._studentRepository = studentRepo;
    }
    public async Handle (request: AddStudentsToTeacherRequest, outputPort: IOutputPort<UseCaseResponseMessage>): Promise<Boolean> {
        let count: number = 0;
        let errors: Error[] = [];
        let response: UseCaseResponseMessage;
        try {
            for (let i of request.Students) {
                let s: Student | null = await this._studentRepository.GetByEmail(i.email);
                let t: Teacher | null = await this._teacherRepository.GetByEmail(request.Teacher.email);
                if (s !== null && t !== null && !t.students.some(ii => ii.id === s!.id) && !s.teachers.some(ii => ii.id === t!.id)) {
                    this._logger.Log(LogLevels.debug, `Adding student: ${JSON.stringify(s, null, 2)} to teacher ${JSON.stringify(t, null, 2)}`);
                    let student = await this._studentRepository.AddTeacher(s, t!);
                    this._logger.Log(LogLevels.debug, `student: ${JSON.stringify(student, null, 2)}`);
                    if (student !== null)
                        count++;
                    else {
                        this._logger.Log(LogLevels.error, `Failed to add student ${s.email} to teacher ${t.email}`);
                        errors.push(new Error("", `Failed to add student ${s.email} to teacher ${t.email}`));
                    }
                } else if (s === null) {
                    this._logger.Log(LogLevels.error, `Invalid student ${i.email}`);
                    errors.push(new Error("", `Invalid student ${i.email}`));
                } else if (t === null) {
                    this._logger.Log(LogLevels.error, `Invalid teacher ${i.email}`);
                    errors.push(new Error("", `Invalid student ${i.email}`));
                } else {
                    this._logger.Log(LogLevels.warn, `Skip duplicate student ${i.email} <-> teacher ${t.email}`);
                    errors.push(new Error("", `Skip duplicate  student ${i.email} <-> teacher ${t.email}`));
                }
            };
            this._logger.Log(LogLevels.debug, `${count} students added successfully to teacher ${request.Teacher.email}!`);
            response = new UseCaseResponseMessage("", count === request.Students.length && errors.length === 0, `${count} students added successfully to teacher ${request.Teacher.email}!`, errors);
            outputPort.Handle(response);
            return response.Success;
        } catch (e) {
            console.error(e);
            if (typeof e === "string") {
                errors.push(new Error("", e));
                response = new UseCaseResponseMessage("", false, e, errors);
            } else {
                errors.push(new Error("", JSON.stringify(e, null, 2)));
                response = new UseCaseResponseMessage("", false, "Exception!", errors);
            }
            outputPort.Handle(response);
            return false;
        }
    }
}