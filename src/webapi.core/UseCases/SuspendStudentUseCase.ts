import emailvalidator from 'email-validator'
import { ISuspendStudentUseCase } from "../Interfaces/UseCases/ISuspendStudentUseCase.js"
import { IStudentRepository } from "../Interfaces/IStudentRepository.js"
import { IOutputPort } from "../Interfaces/IOutputPort.js";
import { UseCaseResponseMessage } from "../DTO/UseCaseResponse/UseCaseResponseMessage.js"
import { SuspendStudentRequest } from "../DTO/UseCaseRequests/SuspendStudentRequest.js"
import { Student } from "../Domain/Entities/Student.js";
import { Error } from "../DTO/Error.js"
import { injectable, inject } from "inversify";
import { ILogger, LogLevels } from "../Interfaces/ILogger.js";
import { LoggerTypes, RepositoryTypes } from "../types.js";
@injectable()
export class SuspendStudentUseCase implements ISuspendStudentUseCase {
    private readonly _repository: IStudentRepository;
    private _logger: ILogger;
    public constructor(@inject(LoggerTypes.ILogger) logger: ILogger, @inject(RepositoryTypes.IStudentRepository) repo: IStudentRepository) {
        this._logger = logger;
        this._repository = repo;
    }
    public async Handle (request: SuspendStudentRequest, outputPort: IOutputPort<UseCaseResponseMessage>): Promise<Boolean> {
        let errors: Error[] = [];
        let response: UseCaseResponseMessage;
        if (request.Student !== "" && emailvalidator.validate(request.Student))
            try {
                this._logger.Log(LogLevels.debug, `Processing student: ${request.Student}`);
                let student = await this._repository.GetByEmail(request.Student);
                if (student !== undefined && student !== null) {
                    student.isSuspended = true;
                    student = await this._repository.Update(student);
                    if (student === undefined || student === null || !student.isSuspended) {
                        errors.push(new Error("", `Failed to UPDATE student ${request.Student} suspension status!`));
                    }
                } else {
                    errors.push(new Error("", `Invalid student ${request.Student}`));
                }
            } catch (e) {
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
        else {
            errors.push(new Error("", `Invalid request student ${request.Student}!`));
        }
        response = new UseCaseResponseMessage("", !errors.length, `Student ${request.Student} registered successfully`, errors);
        outputPort.Handle(response);
        return response.Success;
    }
}