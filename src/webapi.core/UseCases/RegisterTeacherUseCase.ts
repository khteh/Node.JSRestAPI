import emailvalidator from 'email-validator'
import { IRegisterTeacherUseCase } from "../Interfaces/UseCases/IRegisterTeacherUseCase.js"
import { ITeacherRepository } from "../Interfaces/ITeacherRepository.js"
import { IOutputPort } from "../Interfaces/IOutputPort.js";
import { UseCaseResponseMessage } from "../DTO/UseCaseResponse/UseCaseResponseMessage.js"
import { RegisterTeacherRequest } from "../DTO/UseCaseRequests/RegisterTeacherRequest.js"
import { Teacher } from "../Domain/Entities/Teacher.js";
import { Error } from "../DTO/Error.js"
import { injectable, inject } from "inversify";
import { ILogger, LogLevels } from "../Interfaces/ILogger.js";
import { LoggerTypes, RepositoryTypes } from "../types.js";
@injectable()
export class RegisterTeacherUseCase implements IRegisterTeacherUseCase {
    private readonly _repository: ITeacherRepository;
    private _logger: ILogger;
    public constructor(@inject(LoggerTypes.ILogger) logger: ILogger, @inject(RepositoryTypes.ITeacherRepository) repo: ITeacherRepository) {
        this._logger = logger;
        this._repository = repo;
    }
    public async Handle (request: RegisterTeacherRequest, outputPort: IOutputPort<UseCaseResponseMessage>): Promise<Boolean> {
        let errors: Error[] = [];
        let response: UseCaseResponseMessage;
        try {
            if (emailvalidator.validate(request.Email)) {
                this._logger.Log(LogLevels.debug, `Processing teacher: ${request.Email}`);
                let teacher = await this._repository.GetByEmail(request.Email);
                if (teacher === undefined || teacher === null) {
                    await this._repository.Add(new Teacher(request.FirstName, request.LastName, request.Email));
                } else {
                    this._logger.Log(LogLevels.error, `Teacher ${request.Email} registration failed!`);
                    errors.push(new Error("", `Teacher ${request.Email} registration failed!`));
                }
                this._logger.Log(LogLevels.debug, `Teacher ${request.Email} registered successfully!`);
                response = new UseCaseResponseMessage("", !errors.length, `Teacher ${request.Email} registered successfully!`, errors);
                outputPort.Handle(response);
                return response.Success;
            } else {
                this._logger.Log(LogLevels.error, `Invalid teacher's email! ${request.Email}!`);
                errors.push(new Error("", `Invalid teacher's email! ${request.Email}!`));
                response = new UseCaseResponseMessage("", false, `Invalid teacher's email! ${request.Email}!`, errors);
                outputPort.Handle(response);
                return response.Success;
            }
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
    }
}