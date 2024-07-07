import { RegistrationRequest } from "../../DTO/UseCaseRequests/RegistrationRequest.js"
import { Teacher } from "../../Domain/Entities/Teacher.js"
import { RegisterTeacherRequest } from "../../DTO/UseCaseRequests/RegisterTeacherRequest.js"
import { UseCaseResponseMessage } from "../../DTO/UseCaseResponse/UseCaseResponseMessage.js"
import { IUseCaseRequestHandler } from "../IUseCaseRequestHandler.js"
export interface IRegisterTeacherUseCase extends IUseCaseRequestHandler<RegistrationRequest<Teacher>, UseCaseResponseMessage> {
}