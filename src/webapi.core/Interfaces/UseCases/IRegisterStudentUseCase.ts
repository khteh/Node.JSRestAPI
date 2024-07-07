import { RegistrationRequest } from "../../DTO/UseCaseRequests/RegistrationRequest.js"
import { Student } from "../../Domain/Entities/Student.js"
import { RegisterStudentRequest } from "../../DTO/UseCaseRequests/RegisterStudentRequest.js"
import { UseCaseResponseMessage } from "../../DTO/UseCaseResponse/UseCaseResponseMessage.js"
import { IUseCaseRequestHandler } from "../IUseCaseRequestHandler.js"
export interface IRegisterStudentUseCase extends IUseCaseRequestHandler<RegistrationRequest<Student>, UseCaseResponseMessage> {
}