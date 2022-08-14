import { IRegisterTeacherUseCase } from "Interfaces/UseCases/IRegisterTeacherUseCase"
import { ITeacherRepository } from "Interfaces/ITeacherRepository"
import { IOutputPort } from "Interfaces/IOutputPort";
import { UseCaseResponseMessage } from "DTO/UseCaseResponse/UseCaseResponseMessage"
import { RegisterTeacherRequest } from "DTO/UseCaseRequests/RegisterTeacherRequest"
import { Teacher } from "Domain/Entities/Teacher";
import { Error } from "DTO/Error"
import { injectable, inject } from "inversify";
@injectable()
export class RegisterTeacherUseCase implements IRegisterTeacherUseCase {
    private readonly _repository: ITeacherRepository;
    public constructor(repo: ITeacherRepository) {
        this._repository = repo;
    }
    public async Handle (request: RegisterTeacherRequest, outputPort: IOutputPort<UseCaseResponseMessage>): Promise<Boolean> {
        let errors: Error[] = [];
        console.log(`Processing teacher: ${request.Email}`);
        let teacher = this._repository.GetByEmail(request.Email);
        if (teacher === undefined || teacher === null) {
            await this._repository.Add(new Teacher(request.FirstName, request.LastName, request.Email));
        } else {
            errors.push(new Error("", `Skip existing teacher ${request.Email}`));
        }
        let response: UseCaseResponseMessage = new UseCaseResponseMessage("", !errors.length, `Teacher ${request.Email} added successfully!`, errors);
        outputPort.Handle(response);
        return response.Success;
    }
}