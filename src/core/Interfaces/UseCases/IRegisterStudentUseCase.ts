import { RegisterStudentRequest } from "../../DTO/UseCaseRequests/RegisterStudentRequest"
import { UseCaseResponseMessage } from "../../DTO/UseCaseResponse/UseCaseResponseMessage"
import { IUseCaseRequestHandler } from "../IUseCaseRequestHandler"
export interface IRegisterStudentUseCase extends IUseCaseRequestHandler<RegisterStudentRequest, UseCaseResponseMessage> {
}