import { IRegisterStudentUseCase } from "Interfaces/UseCases/IRegisterStudentUseCase"
import { IStudentRepository } from "Interfaces/IStudentRepository"
import { IOutputPort } from "Interfaces/IOutputPort";
import { UseCaseResponseMessage } from "DTO/UseCaseResponse/UseCaseResponseMessage"
import { RegisterStudentRequest } from "DTO/UseCaseRequests/RegisterStudentRequest"
import { Student } from "Domain/Entities/Student";
import { Error } from "DTO/Error"
import { injectable, inject } from "inversify";
import { ILogger, LogLevels } from "Interfaces/ILogger";
@injectable()
export class RegisterStudentUseCase implements IRegisterStudentUseCase {
    private readonly _repository: IStudentRepository;
    private _logger: ILogger;
    public constructor(logger: ILogger, repo: IStudentRepository) {
        this._logger = logger;
        this._repository = repo;
    }
    public async Handle (request: RegisterStudentRequest, outputPort: IOutputPort<UseCaseResponseMessage>): Promise<Boolean> {
        let count: number = 0;
        let errors: Error[] = [];
        request.Students.forEach(async i => {
            this._logger.Log(LogLevels.debug, `Processing student: ${i}`);
            let student = this._repository.GetByEmail(i.email);
            if (student === undefined || student === null) {
                await this._repository.Add(new Student(i.firstName, i.lastName, i.email, i.isSuspended ?? false));
                count++;
            } else {
                errors.push(new Error("", `Skip existing student ${i.email}`));
            }
        });
        let response: UseCaseResponseMessage = new UseCaseResponseMessage("", count == request.Students.length && !errors.length, `${count} students registered successfully`, errors);
        outputPort.Handle(response);
        return response.Success;
    }
}