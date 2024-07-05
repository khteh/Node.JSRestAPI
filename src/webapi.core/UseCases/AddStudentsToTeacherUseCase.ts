import { IAddStudentsToTeacherUseCase } from "../Interfaces/UseCases/IAddStudentsToTeacherUseCase.js"
import { IStudentRepository } from "../Interfaces/IStudentRepository.js"
import { ITeacherRepository } from "../Interfaces/ITeacherRepository.js"
import { IOutputPort } from "../Interfaces/IOutputPort.js";
import { UseCaseResponseMessage } from "../DTO/UseCaseResponse/UseCaseResponseMessage.js"
import { AddStudentsToTeacherRequest } from "../DTO/UseCaseRequests/AddStudentsToTeacherRequest.js"
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
        let teacher: Teacher | null = await this._teacherRepository.GetByEmail(request.Teacher.email);
        if (teacher !== null)
            try {
                for (let i of request.Students) {
                    if (await this._studentRepository.GetByEmail(i.email) !== null && (teacher!.students.length === 0 || teacher!.students.find(s => s.email == i.email) == null)) {
                        this._logger.Log(LogLevels.debug, `Adding student: ${i.email} to teacher ${request.Teacher.email}`);
                        let [teacher, student] = await Promise.allSettled([this._teacherRepository.AddStudent(request.Teacher, i), this._studentRepository.AddTeacher(i, request.Teacher)]);
                        if (teacher.status === "fulfilled" && student.status === "fulfilled" && teacher.value !== null && student.value !== null)
                            count++;
                        else {
                            if (!teacher)
                                errors.push(new Error("", `Failed to add student ${i.email} to teacher ${request.Teacher.email}`));
                            if (!student)
                                errors.push(new Error("", `Failed to add teacher ${request.Teacher.email} to student ${i.email}`));
                        }
                    } else
                        errors.push(new Error("", `Failed to add student ${i.email} to teacher ${request.Teacher.email}`));
                };
                response = new UseCaseResponseMessage("", count === request.Students.length && errors.length === 0, `${count} students added successfully to teacher ${request.Teacher.email}!`, errors);
                outputPort.Handle(response);
                return response.Success;
            } catch (e) {
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