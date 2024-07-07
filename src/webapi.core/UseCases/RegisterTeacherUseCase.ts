import emailvalidator from 'email-validator'
import { IRegisterTeacherUseCase } from "../Interfaces/UseCases/IRegisterTeacherUseCase.js"
import { ITeacherRepository } from "../Interfaces/ITeacherRepository.js"
import { IOutputPort } from "../Interfaces/IOutputPort.js";
import { RegistrationRequest } from '../DTO/UseCaseRequests/RegistrationRequest.js';
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
    public async Handle (request: RegistrationRequest<Teacher>, outputPort: IOutputPort<UseCaseResponseMessage>): Promise<Boolean> {
        let count: number = 0;
        let errors: Error[] = [];
        let response: UseCaseResponseMessage;
        try {
            for (let i of request.Entities) {
                if (emailvalidator.validate(i.email)) {
                    this._logger.Log(LogLevels.debug, `Processing teacher: ${i.email}`);
                    let teacher: Teacher | null = await this._repository.GetByEmail(i.email);
                    if (teacher === undefined || teacher === null) {
                        await this._repository.Add(new Teacher(i.firstName, i.lastName, i.email));
                        count++;
                    } else {
                        errors.push(new Error("", `Skip existing teacher ${i.email}`));
                    }
                } else {
                    errors.push(new Error("", `Skip teacher with invalid email: ${i.email}`));
                }
            };
            response = new UseCaseResponseMessage("", count == request.Entities.length && !errors.length, `${count} teachers registered successfully`, errors);
            outputPort.Handle(response);
            return response.Success;
        } catch (e) {
            if (typeof e === "string") {
                this._logger.Log(LogLevels.error, `Exception: ${e}`);
                errors.push(new Error("", e));
                response = new UseCaseResponseMessage("", false, e, errors);
            } else {
                this._logger.Log(LogLevels.error, `Exception: ${JSON.stringify(e)}`);
                errors.push(new Error("", JSON.stringify(e)));
                response = new UseCaseResponseMessage("", false, "Exception!", errors);
            }
            outputPort.Handle(response);
            return false;
        }
    }
}