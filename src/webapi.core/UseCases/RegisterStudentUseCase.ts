import emailvalidator from 'email-validator'
import { IRegisterStudentUseCase } from "../Interfaces/UseCases/IRegisterStudentUseCase.js"
import { IStudentRepository } from "../Interfaces/IStudentRepository.js"
import { IOutputPort } from "../Interfaces/IOutputPort.js";
import { RegistrationRequest } from '../DTO/UseCaseRequests/RegistrationRequest.js';
import { UseCaseResponseMessage } from "../DTO/UseCaseResponse/UseCaseResponseMessage.js"
import { RegisterStudentRequest } from "../DTO/UseCaseRequests/RegisterStudentRequest.js"
import { Student } from "../Domain/Entities/Student.js";
import { Error } from "../DTO/Error.js"
import { injectable, inject } from "inversify";
import { ILogger, LogLevels } from "../Interfaces/ILogger.js";
import { LoggerTypes, RepositoryTypes } from "../types.js";
@injectable()
export class RegisterStudentUseCase implements IRegisterStudentUseCase {
    private readonly _repository: IStudentRepository;
    private _logger: ILogger;
    public constructor(@inject(LoggerTypes.ILogger) logger: ILogger, @inject(RepositoryTypes.IStudentRepository) repo: IStudentRepository) {
        this._logger = logger;
        this._repository = repo;
    }
    public async Handle (request: RegistrationRequest<Student>, outputPort: IOutputPort<UseCaseResponseMessage>): Promise<Boolean> {
        let count: number = 0;
        let errors: Error[] = [];
        let response: UseCaseResponseMessage;
        try {
            for (let i of request.Entities) {
                if (emailvalidator.validate(i.email)) {
                    this._logger.Log(LogLevels.debug, `Processing student: ${i.email}`);
                    let student: Student | null = await this._repository.GetByEmail(i.email);
                    if (student === undefined || student === null) {
                        await this._repository.Add(new Student(i.firstName, i.lastName, i.email, i.isSuspended ?? false));
                        count++;
                    } else {
                        this._logger.Log(LogLevels.warn, `Skip existing student ${i.email}`);
                        errors.push(new Error("", `Skip existing student ${i.email}`));
                    }
                } else {
                    this._logger.Log(LogLevels.error, `Skip student with invalid email: ${i.email}`);
                    errors.push(new Error("", `Skip student with invalid email: ${i.email}`));
                }
            };
            this._logger.Log(LogLevels.debug, `${count} students registered successfully`);
            response = new UseCaseResponseMessage("", count == request.Entities.length && !errors.length, `${count} students registered successfully`, errors);
            outputPort.Handle(response);
            return response.Success;
        } catch (e) {
            if (typeof e === "string") {
                this._logger.Log(LogLevels.error, `Exception: ${e}`);
                errors.push(new Error("", e));
                response = new UseCaseResponseMessage("", false, e, errors);
            } else {
                this._logger.Log(LogLevels.error, `Exception: ${JSON.stringify(e, null, 2)}`);
                errors.push(new Error("", JSON.stringify(e, null, 2)));
                response = new UseCaseResponseMessage("", false, "Exception!", errors);
            }
            outputPort.Handle(response);
            return false;
        }
    }
}