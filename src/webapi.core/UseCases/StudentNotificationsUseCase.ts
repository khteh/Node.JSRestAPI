import emailvalidator from 'email-validator'
import { IStudentNotificationsUseCase } from "../Interfaces/UseCases/IStudentNotificationsUseCase.js"
import { IStudentRepository } from "../Interfaces/IStudentRepository.js"
import { ITeacherRepository } from "../Interfaces/ITeacherRepository.js"
import { IOutputPort } from "../Interfaces/IOutputPort.js";
import { StudentNotificationsResponse } from "../DTO/UseCaseResponse/StudentNotificationsResponse.js"
import { StudentNotificationsRequest } from "../DTO/UseCaseRequests/StudentNotificationsRequest.js"
import { Student } from "../Domain/Entities/Student.js";
import { Error } from "../DTO/Error.js"
import { injectable, inject } from "inversify";
import { ILogger, LogLevels } from "../Interfaces/ILogger.js";
import { LoggerTypes, RepositoryTypes } from "../types.js";
@injectable()
export class StudentNotificationsUseCase implements IStudentNotificationsUseCase {
    private readonly _repository: ITeacherRepository;
    private readonly _studentRepository: IStudentRepository;
    private _logger: ILogger;
    public constructor(@inject(LoggerTypes.ILogger) logger: ILogger, @inject(RepositoryTypes.ITeacherRepository) repo: ITeacherRepository, @inject(RepositoryTypes.IStudentRepository) studentRepo: IStudentRepository) {
        this._logger = logger;
        this._repository = repo;
        this._studentRepository = studentRepo;
    }
    public async Handle (request: StudentNotificationsRequest, outputPort: IOutputPort<StudentNotificationsResponse>): Promise<Boolean> {
        let errors: Error[] = [];
        let recipients: string[] = [];
        let response: StudentNotificationsResponse;
        try {
            if (request.Teacher !== "" && emailvalidator.validate(request.Teacher)) {
                this._logger.Log(LogLevels.debug, `Processing notifications sent from teacher: ${request.Teacher}`);
                let teacher = await this._repository.GetByEmail(request.Teacher);
                if (teacher !== undefined && teacher !== null) {
                    for (let s of teacher.students) {
                        if (!s.isSuspended)
                            recipients.push(s.email);
                    }
                } else {
                    errors.push(new Error("", `Invalid teacher ${request.Teacher} to send notifications from!`));
                }
            } else {
                errors.push(new Error("", `Invalid request teacher ${request.Teacher}!`));
            }
            if (request.Students.length) {
                for (let s of request.Students) {
                    if (emailvalidator.validate(s)) {
                        let student = await this._studentRepository.GetByEmail(s);
                        if (student !== undefined && student !== null) {
                            recipients.push(s);
                        }
                    }
                }
            }
        } catch (e) {
            if (typeof e === "string") {
                errors.push(new Error("", e));
                response = new StudentNotificationsResponse("", false, recipients, e, errors);
            } else {
                errors.push(new Error("", JSON.stringify(e)));
                response = new StudentNotificationsResponse("", false, recipients, "Exception!", errors);
            }
            outputPort.Handle(response);
            return false;
        }
        response = new StudentNotificationsResponse("", !errors.length, recipients, `"${request.Message}" sent successfully to ${recipients.length} students from teacher ${request.Teacher}!`, errors);
        outputPort.Handle(response);
        return response.Success;
    }
}