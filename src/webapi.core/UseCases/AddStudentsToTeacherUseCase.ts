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
        let t: Teacher | null = await this._teacherRepository.GetByEmail(request.Teacher.email);
        if (t !== null)
            try {
                for (let i of request.Students) {
                    let s: Student | null = await this._studentRepository.GetByEmail(i.email);
                    if (s !== null && (t!.students.length === 0 || t!.students.find(ss => ss.email == s.email) == null)) {
                        this._logger.Log(LogLevels.debug, `Adding student: ${JSON.stringify(s)} to teacher ${JSON.stringify(t)}`);
                        let [teacher, student] = await Promise.allSettled([this._teacherRepository.AddStudent(t, s), this._studentRepository.AddTeacher(s, t)]);
                        this._logger.Log(LogLevels.debug, `teacher: ${JSON.stringify(teacher)}, student: ${JSON.stringify(student)}`);
                        if (teacher.status === "fulfilled" && student.status === "fulfilled" && student.value !== null)
                            count++;
                        else {
                            if (!teacher || teacher.status !== "fulfilled") {
                                this._logger.Log(LogLevels.error, `Failed to add student ${s.email} to teacher ${t.email} status: ${teacher?.status} ${teacher?.reason}`);
                                errors.push(new Error("", `Failed to add student ${s.email} to teacher ${t.email}`));
                            }
                            if (!student || student.status !== "fulfilled") {
                                this._logger.Log(LogLevels.error, `Failed to add teacher ${t.email} to student ${s.email} status: ${student?.status} ${student?.reason}`);
                                errors.push(new Error("", `Failed to add teacher ${t.email} to student ${s.email}`));
                            }
                        }
                    } else if (s === null) {
                        this._logger.Log(LogLevels.error, `Invalid student ${i.email}`);
                        errors.push(new Error("", `Invalid student ${i.email}`));
                    } else {
                        this._logger.Log(LogLevels.error, `Failed to add student ${i.email} to teacher ${t.email}`);
                        errors.push(new Error("", `Failed to add student ${i.email} to teacher ${t.email}`));
                    }
                };
                response = new UseCaseResponseMessage("", count === request.Students.length && errors.length === 0, `${count} students added successfully to teacher ${t.email}!`, errors);
                outputPort.Handle(response);
                return response.Success;
            } catch (e) {
                console.error(e);
                if (typeof e === "string") {
                    errors.push(new Error("", e));
                    response = new UseCaseResponseMessage("", false, e, errors);
                } else {
                    errors.push(new Error("", JSON.stringify(e)));
                    response = new UseCaseResponseMessage("", false, "Exception!", errors);
                }
                outputPort.Handle(response);
                return false;
            }
        else {
            errors.push(new Error("", `Invalid Teacher ${request.Teacher.email}!`));
            response = new UseCaseResponseMessage("", false, `Invalid Teacher ${request.Teacher.email}!`, errors);
            outputPort.Handle(response);
            return false;
        }
    }
}