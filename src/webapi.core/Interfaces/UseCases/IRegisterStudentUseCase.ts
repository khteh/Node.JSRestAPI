import { RegisterStudentRequest } from "../../DTO/UseCaseRequests/RegisterStudentRequest.js"
import { UseCaseResponseMessage } from "../../DTO/UseCaseResponse/UseCaseResponseMessage.js"
import { IUseCaseRequestHandler } from "../IUseCaseRequestHandler.js"
export interface IRegisterStudentUseCase extends IUseCaseRequestHandler<RegisterStudentRequest, UseCaseResponseMessage> {
}